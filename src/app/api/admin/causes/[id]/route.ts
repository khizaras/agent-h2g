import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { Database } from "@/lib/database";

export async function PUT(
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
    const {
      title,
      description,
      short_description,
      category_id,
      location,
      status,
      priority,
      is_featured,
    } = await request.json();

    // Check if cause exists
    const existingCause = await Database.query(
      "SELECT id FROM causes WHERE id = ?",
      [id]
    );

    if (existingCause.length === 0) {
      return NextResponse.json(
        { success: false, error: "Cause not found" },
        { status: 404 }
      );
    }

    // Build update query dynamically
    const updates: string[] = [];
    const updateParams: any[] = [];

    if (title !== undefined) {
      updates.push("title = ?");
      updateParams.push(title);
    }

    if (description !== undefined) {
      updates.push("description = ?");
      updateParams.push(description);
    }

    if (short_description !== undefined) {
      updates.push("short_description = ?");
      updateParams.push(short_description);
    }

    if (category_id !== undefined) {
      // Verify category exists
      const categoryExists = await Database.query(
        "SELECT id FROM categories WHERE id = ?",
        [category_id]
      );

      if (categoryExists.length === 0) {
        return NextResponse.json(
          { success: false, error: "Invalid category" },
          { status: 400 }
        );
      }

      updates.push("category_id = ?");
      updateParams.push(category_id);
    }

    if (location !== undefined) {
      updates.push("location = ?");
      updateParams.push(location);
    }

    if (status !== undefined) {
      updates.push("status = ?");
      updateParams.push(status);
    }

    if (priority !== undefined) {
      updates.push("priority = ?");
      updateParams.push(priority);
    }

    if (is_featured !== undefined) {
      updates.push("is_featured = ?");
      updateParams.push(is_featured);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { success: false, error: "No fields to update" },
        { status: 400 }
      );
    }

    updates.push("updated_at = NOW()");
    updateParams.push(id);

    const updateQuery = `UPDATE causes SET ${updates.join(", ")} WHERE id = ?`;
    await Database.query(updateQuery, updateParams);

    return NextResponse.json({
      success: true,
      data: { message: "Cause updated successfully" },
    });
  } catch (error) {
    console.error("Error updating cause:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update cause" },
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

    // Check if cause exists
    const existingCause = await Database.query(
      "SELECT id FROM causes WHERE id = ?",
      [id]
    );

    if (existingCause.length === 0) {
      return NextResponse.json(
        { success: false, error: "Cause not found" },
        { status: 404 }
      );
    }

    // Delete cause (this will cascade delete related records due to foreign key constraints)
    await Database.query("DELETE FROM causes WHERE id = ?", [id]);

    return NextResponse.json({
      success: true,
      data: { message: "Cause deleted successfully" },
    });
  } catch (error) {
    console.error("Error deleting cause:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete cause" },
      { status: 500 }
    );
  }
}