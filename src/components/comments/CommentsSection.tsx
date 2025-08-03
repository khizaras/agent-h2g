"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Avatar,
  Typography,
  Divider,
  Spin,
  Empty,
  message,
} from "antd";
import {
  MessageOutlined,
  SendOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

const { TextArea } = Input;
const { Text, Paragraph } = Typography;

interface Comment {
  id: number;
  content: string;
  user_name: string;
  user_avatar?: string;
  user_id: number;
  reply_count: number;
  created_at: string;
  parent_id?: number;
  replies?: Comment[];
}

interface CommentsSectionProps {
  causeId: number;
  allowComments?: boolean;
  className?: string;
}

export default function CommentsSection({
  causeId,
  allowComments = true,
  className = "",
}: CommentsSectionProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    fetchComments();
  }, [causeId]);

  const fetchComments = async (pageNum = 1, loadMore = false) => {
    try {
      if (!loadMore) setLoading(true);
      else setLoadingMore(true);

      const response = await fetch(
        `/api/comments?cause_id=${causeId}&page=${pageNum}&limit=10`
      );
      const data = await response.json();

      if (data.success) {
        const newComments = data.data.comments || [];
        
        if (loadMore) {
          setComments(prev => [...prev, ...newComments]);
        } else {
          setComments(newComments);
        }

        setHasMore(data.data.pagination?.hasNext || false);
        setPage(pageNum);

        // Fetch replies for each comment
        for (const comment of newComments) {
          if (comment.reply_count > 0) {
            fetchReplies(comment.id);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      message.error("Failed to load comments");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const fetchReplies = async (parentId: number) => {
    try {
      const response = await fetch(
        `/api/comments?cause_id=${causeId}&parent_id=${parentId}&limit=50`
      );
      const data = await response.json();

      if (data.success) {
        const replies = data.data.comments || [];
        setComments(prev =>
          prev.map(comment =>
            comment.id === parentId
              ? { ...comment, replies }
              : comment
          )
        );
      }
    } catch (error) {
      console.error("Error fetching replies:", error);
    }
  };

  const handleSubmitComment = async (values: any) => {
    if (!session?.user) {
      message.error("Please sign in to comment");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        cause_id: causeId,
        content: values.content,
        parent_id: replyingTo || null,
      };

      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        const newComment = data.data.comment;
        
        if (replyingTo) {
          // Add to replies
          setComments(prev =>
            prev.map(comment =>
              comment.id === replyingTo
                ? {
                    ...comment,
                    replies: [...(comment.replies || []), newComment],
                    reply_count: comment.reply_count + 1
                  }
                : comment
            )
          );
          setReplyingTo(null);
        } else {
          // Add to main comments
          setComments(prev => [newComment, ...prev]);
        }

        form.resetFields();
        message.success("Comment added successfully!");
      } else {
        message.error(data.error || "Failed to add comment");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      message.error("Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`comment-item ${isReply ? "reply-item" : ""}`}
        style={{
          marginLeft: isReply ? "40px" : "0",
          marginBottom: "16px",
          padding: "16px",
          background: isReply ? "#fafafa" : "#fff",
          borderRadius: "8px",
          border: "1px solid #f0f0f0",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
          <Avatar
            src={comment.user_avatar}
            icon={<UserOutlined />}
            size={isReply ? 32 : 40}
          />
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <Text strong>
                {comment.user_name}
              </Text>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                {formatDate(comment.created_at)}
              </Text>
            </div>

            <Paragraph style={{ marginBottom: "12px" }}>
              {comment.content}
            </Paragraph>

            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              {!isReply && comment.reply_count > 0 && (
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  {comment.reply_count} {comment.reply_count === 1 ? 'reply' : 'replies'}
                </Text>
              )}

              {!isReply && (
                <Button
                  type="text"
                  size="small"
                  icon={<MessageOutlined />}
                  onClick={() => setReplyingTo(comment.id)}
                >
                  Reply
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Reply Form */}
        {replyingTo === comment.id && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            style={{ marginTop: "16px", marginLeft: "52px" }}
          >
            <Form form={form} onFinish={handleSubmitComment}>
              <Form.Item
                name="content"
                rules={[{ required: true, message: "Please enter your reply" }]}
              >
                <TextArea
                  placeholder="Write your reply..."
                  rows={3}
                  maxLength={1000}
                  showCount
                />
              </Form.Item>


              <div style={{ display: "flex", gap: "8px" }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitting}
                  icon={<SendOutlined />}
                  size="small"
                >
                  Reply
                </Button>
                <Button size="small" onClick={() => setReplyingTo(null)}>
                  Cancel
                </Button>
              </div>
            </Form>
          </motion.div>
        )}

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div style={{ marginTop: "16px" }}>
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} isReply />
            ))}
          </div>
        )}
      </motion.div>
    );
  };

  if (loading) {
    return (
      <Card className={className}>
        <div style={{ textAlign: "center", padding: "40px" }}>
          <Spin size="large" />
          <div style={{ marginTop: "16px" }}>Loading comments...</div>
        </div>
      </Card>
    );
  }

  return (
    <Card title={`Comments (${comments.length})`} className={className}>
      {/* New Comment Form */}
      {allowComments && session?.user && (
        <div style={{ marginBottom: "24px" }}>
          <Form form={form} onFinish={handleSubmitComment}>
            <Form.Item
              name="content"
              rules={[{ required: true, message: "Please enter your comment" }]}
            >
              <TextArea
                placeholder="Share your thoughts..."
                rows={4}
                maxLength={1000}
                showCount
              />
            </Form.Item>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                icon={<SendOutlined />}
              >
                Post Comment
              </Button>
            </div>
          </Form>
          <Divider />
        </div>
      )}

      {/* Comments List */}
      {comments.length === 0 ? (
        <Empty
          description="No comments yet"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <div>
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}

          {/* Load More Button */}
          {hasMore && (
            <div style={{ textAlign: "center", marginTop: "24px" }}>
              <Button
                loading={loadingMore}
                onClick={() => fetchComments(page + 1, true)}
              >
                Load More Comments
              </Button>
            </div>
          )}
        </div>
      )}

      {!session?.user && allowComments && (
        <div style={{ textAlign: "center", padding: "20px", background: "#fafafa", borderRadius: "8px" }}>
          <Text type="secondary">
            Please sign in to join the conversation
          </Text>
        </div>
      )}
    </Card>
  );
}