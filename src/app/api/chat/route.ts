import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { Database } from "@/lib/database";
import { z } from "zod";

const createConversationSchema = z.object({
  participant_id: z.number().int().positive(),
  cause_id: z.number().int().positive().optional(),
  initial_message: z.string().min(1, "Initial message is required"),
});

const sendMessageSchema = z.object({
  conversation_id: z.number().int().positive(),
  message: z.string().min(1, "Message is required"),
  message_type: z.enum(["text", "image", "file"]).default("text"),
});

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const conversation_id = searchParams.get("conversation_id");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const userId = (session.user as any).id;
    const offset = (page - 1) * limit;

    if (conversation_id) {
      // Get messages for a specific conversation
      const conversationIdNum = parseInt(conversation_id);

      // Verify user is part of this conversation
      const conversation = (await Database.query(
        `
        SELECT cc.* FROM chat_conversations cc
        WHERE cc.id = ? AND (cc.user1_id = ? OR cc.user2_id = ?)
      `,
        [conversationIdNum, userId, userId],
      )) as any[];

      if (conversation.length === 0) {
        return NextResponse.json(
          { success: false, error: "Conversation not found or access denied" },
          { status: 404 },
        );
      }

      // Get messages
      const messages = (await Database.query(
        `
        SELECT 
          cm.*,
          u.name as sender_name,
          u.avatar as sender_avatar
        FROM chat_messages cm
        LEFT JOIN users u ON cm.sender_id = u.id
        WHERE cm.conversation_id = ?
        ORDER BY cm.created_at DESC
        LIMIT ? OFFSET ?
      `,
        [conversationIdNum, limit, offset],
      )) as any[];

      // Mark messages as read
      await Database.query(
        `
        UPDATE chat_messages 
        SET is_read = TRUE 
        WHERE conversation_id = ? AND sender_id != ? AND is_read = FALSE
      `,
        [conversationIdNum, userId],
      );

      return NextResponse.json({
        success: true,
        data: {
          conversation: conversation[0],
          messages: messages || [],
          pagination: {
            page,
            limit,
            has_more: (messages?.length || 0) === limit,
          },
        },
      });
    } else {
      // Get all conversations for the user
      const conversations = (await Database.query(
        `
        SELECT 
          cc.*,
          CASE 
            WHEN cc.user1_id = ? THEN u2.name 
            ELSE u1.name 
          END as other_user_name,
          CASE 
            WHEN cc.user1_id = ? THEN u2.avatar 
            ELSE u1.avatar 
          END as other_user_avatar,
          CASE 
            WHEN cc.user1_id = ? THEN cc.user2_id 
            ELSE cc.user1_id 
          END as other_user_id,
          c.title as cause_title,
          (
            SELECT COUNT(*) 
            FROM chat_messages cm 
            WHERE cm.conversation_id = cc.id 
            AND cm.sender_id != ? 
            AND cm.is_read = FALSE
          ) as unread_count,
          (
            SELECT cm2.message 
            FROM chat_messages cm2 
            WHERE cm2.conversation_id = cc.id 
            ORDER BY cm2.created_at DESC 
            LIMIT 1
          ) as last_message,
          (
            SELECT cm2.created_at 
            FROM chat_messages cm2 
            WHERE cm2.conversation_id = cc.id 
            ORDER BY cm2.created_at DESC 
            LIMIT 1
          ) as last_message_at
        FROM chat_conversations cc
        LEFT JOIN users u1 ON cc.user1_id = u1.id
        LEFT JOIN users u2 ON cc.user2_id = u2.id
        LEFT JOIN causes c ON cc.cause_id = c.id
        WHERE cc.user1_id = ? OR cc.user2_id = ?
        ORDER BY last_message_at DESC NULLS LAST, cc.created_at DESC
        LIMIT ? OFFSET ?
      `,
        [userId, userId, userId, userId, userId, userId, limit, offset],
      )) as any[];

      // Get total unread count
      const unreadResult = (await Database.query(
        `
        SELECT COUNT(*) as total_unread
        FROM chat_messages cm
        INNER JOIN chat_conversations cc ON cm.conversation_id = cc.id
        WHERE (cc.user1_id = ? OR cc.user2_id = ?)
        AND cm.sender_id != ?
        AND cm.is_read = FALSE
      `,
        [userId, userId, userId],
      )) as any[];

      const totalUnread = unreadResult[0]?.total_unread || 0;

      return NextResponse.json({
        success: true,
        data: {
          conversations: conversations || [],
          total_unread: totalUnread,
          pagination: {
            page,
            limit,
            has_more: (conversations?.length || 0) === limit,
          },
        },
      });
    }
  } catch (error) {
    console.error("Get chat messages error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch messages" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const userId = (session.user as any).id;

    // Check if this is creating a new conversation or sending a message
    if (body.participant_id !== undefined) {
      // Creating a new conversation
      const validation = createConversationSchema.safeParse(body);

      if (!validation.success) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid input",
            details: validation.error.errors,
          },
          { status: 400 },
        );
      }

      const { participant_id, cause_id, initial_message } = validation.data;

      // Check if conversation already exists
      const existingConversation = (await Database.query(
        `
        SELECT id FROM chat_conversations
        WHERE ((user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?))
        AND (cause_id = ? OR (cause_id IS NULL AND ? IS NULL))
      `,
        [userId, participant_id, participant_id, userId, cause_id, cause_id],
      )) as any[];

      let conversationId;

      if (existingConversation.length > 0) {
        conversationId = existingConversation[0].id;
      } else {
        // Create new conversation
        const result = (await Database.query(
          `
          INSERT INTO chat_conversations (
            user1_id, 
            user2_id, 
            cause_id, 
            created_at
          ) VALUES (?, ?, ?, NOW())
        `,
          [userId, participant_id, cause_id || null],
        )) as any;

        conversationId = result.insertId;
      }

      // Send initial message
      await Database.query(
        `
        INSERT INTO chat_messages (
          conversation_id, 
          sender_id, 
          message, 
          message_type,
          created_at
        ) VALUES (?, ?, ?, 'text', NOW())
      `,
        [conversationId, userId, initial_message],
      );

      return NextResponse.json({
        success: true,
        data: {
          conversation_id: conversationId,
          message: "Conversation created successfully",
        },
      });
    } else {
      // Sending a message to existing conversation
      const validation = sendMessageSchema.safeParse(body);

      if (!validation.success) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid input",
            details: validation.error.errors,
          },
          { status: 400 },
        );
      }

      const { conversation_id, message, message_type } = validation.data;

      // Verify user is part of this conversation
      const conversation = (await Database.query(
        `
        SELECT * FROM chat_conversations
        WHERE id = ? AND (user1_id = ? OR user2_id = ?)
      `,
        [conversation_id, userId, userId],
      )) as any[];

      if (conversation.length === 0) {
        return NextResponse.json(
          { success: false, error: "Conversation not found or access denied" },
          { status: 404 },
        );
      }

      // Insert message
      const result = (await Database.query(
        `
        INSERT INTO chat_messages (
          conversation_id, 
          sender_id, 
          message, 
          message_type,
          created_at
        ) VALUES (?, ?, ?, ?, NOW())
      `,
        [conversation_id, userId, message, message_type],
      )) as any;

      // Update conversation's last activity
      await Database.query(
        `
        UPDATE chat_conversations 
        SET updated_at = NOW() 
        WHERE id = ?
      `,
        [conversation_id],
      );

      return NextResponse.json({
        success: true,
        data: {
          message_id: result.insertId,
          message: "Message sent successfully",
        },
      });
    }
  } catch (error) {
    console.error("Chat message error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process message" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { conversation_id, action } = await request.json();
    const userId = (session.user as any).id;

    if (!conversation_id || !action) {
      return NextResponse.json(
        { success: false, error: "Conversation ID and action are required" },
        { status: 400 },
      );
    }

    if (action === "mark_read") {
      // Mark all messages in conversation as read
      await Database.query(
        `
        UPDATE chat_messages 
        SET is_read = TRUE 
        WHERE conversation_id = ? AND sender_id != ?
      `,
        [conversation_id, userId],
      );

      return NextResponse.json({
        success: true,
        data: { message: "Messages marked as read" },
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 },
    );
  } catch (error) {
    console.error("Update chat error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update chat" },
      { status: 500 },
    );
  }
}
