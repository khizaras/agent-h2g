import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { Database } from "@/lib/database";

// Like or unlike a cause
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
      );
    }

    const resolvedParams = await params;
    const causeId = parseInt(resolvedParams.id);

    if (isNaN(causeId)) {
      return NextResponse.json(
        { success: false, message: "Invalid cause ID" },
        { status: 400 },
      );
    }

    // Check if cause exists
    const causes = (await Database.query(
      "SELECT id, like_count FROM causes WHERE id = ?",
      [causeId],
    )) as any[];

    if (!causes || causes.length === 0) {
      return NextResponse.json(
        { success: false, message: "Cause not found" },
        { status: 404 },
      );
    }

    const cause = causes[0];

    // Check if user has already liked this cause
    const existingLikes = (await Database.query(
      "SELECT id, is_liked FROM like_interactions WHERE user_id = ? AND cause_id = ?",
      [session.user.id, causeId],
    )) as any[];

    let newLikeStatus = true;
    let likeCountChange = 1;

    if (existingLikes.length > 0) {
      // User has previously interacted with this cause
      const existingLike = existingLikes[0];
      newLikeStatus = !existingLike.is_liked; // Toggle the like status
      likeCountChange = newLikeStatus ? 1 : -1;

      // Update existing like record
      await Database.query(
        "UPDATE like_interactions SET is_liked = ?, updated_at = NOW() WHERE id = ?",
        [newLikeStatus, existingLike.id],
      );
    } else {
      // Create new like record
      await Database.query(
        "INSERT INTO like_interactions (user_id, cause_id, is_liked) VALUES (?, ?, ?)",
        [session.user.id, causeId, newLikeStatus],
      );
    }

    // Update the cause's like count
    const newLikeCount = Math.max(0, cause.like_count + likeCountChange);
    await Database.query("UPDATE causes SET like_count = ? WHERE id = ?", [
      newLikeCount,
      causeId,
    ]);

    // Log the interaction
    await Database.query(
      "INSERT INTO user_interactions (user_id, cause_id, interaction_type, metadata) VALUES (?, ?, ?, ?)",
      [
        session.user.id,
        causeId,
        "like",
        JSON.stringify({ action: newLikeStatus ? "liked" : "unliked" }),
      ],
    );

    return NextResponse.json({
      success: true,
      data: {
        liked: newLikeStatus,
        likeCount: newLikeCount,
        message: newLikeStatus
          ? "Cause liked successfully"
          : "Like removed successfully",
      },
    });
  } catch (error) {
    console.error("Error processing like:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process like" },
      { status: 500 },
    );
  }
}

// Get like status for a cause
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
      );
    }

    const resolvedParams = await params;
    const causeId = parseInt(resolvedParams.id);

    if (isNaN(causeId)) {
      return NextResponse.json(
        { success: false, message: "Invalid cause ID" },
        { status: 400 },
      );
    }

    // Get cause like count
    const causes = (await Database.query(
      "SELECT like_count FROM causes WHERE id = ?",
      [causeId],
    )) as any[];

    if (!causes || causes.length === 0) {
      return NextResponse.json(
        { success: false, message: "Cause not found" },
        { status: 404 },
      );
    }

    // Check if user has liked this cause
    const userLikes = (await Database.query(
      "SELECT is_liked FROM like_interactions WHERE user_id = ? AND cause_id = ?",
      [session.user.id, causeId],
    )) as any[];

    const userLiked = userLikes.length > 0 ? userLikes[0].is_liked : false;

    return NextResponse.json({
      success: true,
      data: {
        liked: userLiked,
        likeCount: causes[0].like_count,
      },
    });
  } catch (error) {
    console.error("Error getting like status:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get like status" },
      { status: 500 },
    );
  }
}
