import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { Database } from "@/lib/database";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user || !(session.user as any)?.is_admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { action } = await request.json();

    // Check if comment exists
    const existingComment = await Database.query(
      "SELECT id, is_approved, is_pinned FROM comments WHERE id = ?",
      [id]
    );

    if (existingComment.length === 0) {
      return NextResponse.json(
        { success: false, error: "Comment not found" },
        { status: 404 }
      );
    }

    const comment = existingComment[0];

    switch (action) {
      case "approve":
        await Database.query(
          "UPDATE comments SET is_approved = TRUE, updated_at = NOW() WHERE id = ?",
          [id]
        );
        return NextResponse.json({
          success: true,
          data: { message: "Comment approved successfully" },
        });

      case "reject":
        await Database.query(
          "UPDATE comments SET is_approved = FALSE, updated_at = NOW() WHERE id = ?",
          [id]
        );
        return NextResponse.json({
          success: true,
          data: { message: "Comment rejected successfully" },
        });

      case "pin":
        await Database.query(
          "UPDATE comments SET is_pinned = TRUE, updated_at = NOW() WHERE id = ?",
          [id]
        );
        return NextResponse.json({
          success: true,
          data: { message: "Comment pinned successfully" },
        });

      case "unpin":
        await Database.query(
          "UPDATE comments SET is_pinned = FALSE, updated_at = NOW() WHERE id = ?",
          [id]
        );
        return NextResponse.json({
          success: true,
          data: { message: "Comment unpinned successfully" },
        });

      default:
        return NextResponse.json(
          { success: false, error: "Invalid action" },
          { status: 400 }
        );
    }
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
    
    if (!session?.user || !(session.user as any)?.is_admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Check if comment exists
    const existingComment = await Database.query(
      "SELECT id, parent_id FROM comments WHERE id = ?",
      [id]
    );

    if (existingComment.length === 0) {
      return NextResponse.json(
        { success: false, error: "Comment not found" },
        { status: 404 }
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