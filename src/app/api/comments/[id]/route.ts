import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { Database } from "@/lib/database";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { content, rating } = await request.json();

    // Check if comment exists and user owns it
    const existingComment = await Database.query(
      "SELECT user_id FROM comments WHERE id = ?",
      [id]
    );

    if (existingComment.length === 0) {
      return NextResponse.json(
        { success: false, error: "Comment not found" },
        { status: 404 }
      );
    }

    // Only allow owner or admin to edit
    const isOwner = existingComment[0].user_id === parseInt(session.user.id);
    const isAdmin = (session.user as any)?.is_admin;

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { success: false, error: "Not authorized to edit this comment" },
        { status: 403 }
      );
    }

    // Build update query
    const updates: string[] = [];
    const updateParams: any[] = [];

    if (content !== undefined) {
      updates.push("content = ?");
      updateParams.push(content);
    }

    if (rating !== undefined) {
      updates.push("rating = ?");
      updateParams.push(rating);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { success: false, error: "No fields to update" },
        { status: 400 }
      );
    }

    updates.push("updated_at = NOW()");
    updateParams.push(id);

    const updateQuery = `UPDATE comments SET ${updates.join(", ")} WHERE id = ?`;
    await Database.query(updateQuery, updateParams);

    return NextResponse.json({
      success: true,
      data: { message: "Comment updated successfully" },
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update comment" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Check if comment exists and get its details
    const existingComment = await Database.query(
      "SELECT user_id, parent_id FROM comments WHERE id = ?",
      [id]
    );

    if (existingComment.length === 0) {
      return NextResponse.json(
        { success: false, error: "Comment not found" },
        { status: 404 }
      );
    }

    // Only allow owner or admin to delete
    const isOwner = existingComment[0].user_id === parseInt(session.user.id);
    const isAdmin = (session.user as any)?.is_admin;

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { success: false, error: "Not authorized to delete this comment" },
        { status: 403 }
      );
    }

    const comment = existingComment[0];

    // Delete comment (cascade delete will handle replies)
    await Database.query("DELETE FROM comments WHERE id = ?", [id]);

    // Update reply count for parent comment if this was a reply
    if (comment.parent_id) {
      await Database.query(
        "UPDATE comments SET reply_count = reply_count - 1 WHERE id = ? AND reply_count > 0",
        [comment.parent_id]
      );
    }

    return NextResponse.json({
      success: true,
      data: { message: "Comment deleted successfully" },
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete comment" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { action } = await request.json();

    // Check if comment exists
    const existingComment = await Database.query(
      "SELECT user_id, like_count FROM comments WHERE id = ?",
      [id]
    );

    if (existingComment.length === 0) {
      return NextResponse.json(
        { success: false, error: "Comment not found" },
        { status: 404 }
      );
    }

    if (action === "like") {
      // Check if user already liked this comment
      const existingLike = await Database.query(
        "SELECT id FROM user_interactions WHERE user_id = ? AND cause_id = (SELECT cause_id FROM comments WHERE id = ?) AND interaction_type = 'comment_like' AND JSON_EXTRACT(metadata, '$.comment_id') = ?",
        [session.user.id, id, id]
      );

      if (existingLike.length > 0) {
        // Unlike
        await Database.query(
          "DELETE FROM user_interactions WHERE user_id = ? AND cause_id = (SELECT cause_id FROM comments WHERE id = ?) AND interaction_type = 'comment_like' AND JSON_EXTRACT(metadata, '$.comment_id') = ?",
          [session.user.id, id, id]
        );

        await Database.query(
          "UPDATE comments SET like_count = like_count - 1 WHERE id = ? AND like_count > 0",
          [id]
        );

        return NextResponse.json({
          success: true,
          data: { message: "Comment unliked", liked: false },
        });
      } else {
        // Like
        await Database.query(
          "INSERT INTO user_interactions (user_id, cause_id, interaction_type, metadata, created_at) SELECT ?, cause_id, 'comment_like', JSON_OBJECT('comment_id', ?), NOW() FROM comments WHERE id = ?",
          [session.user.id, id, id]
        );

        await Database.query(
          "UPDATE comments SET like_count = like_count + 1 WHERE id = ?",
          [id]
        );

        return NextResponse.json({
          success: true,
          data: { message: "Comment liked", liked: true },
        });
      }
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid action" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error updating comment interaction:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update comment" },
      { status: 500 }
    );
  }
}