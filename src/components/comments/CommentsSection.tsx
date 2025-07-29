"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Avatar,
  Typography,
  Space,
  Input,
  Form,
  message,
  Divider,
  Rate,
  Tooltip,
  Modal,
  Spin,
  Empty,
} from "antd";
import {
  UserOutlined,
  LikeOutlined,
  LikeFilled,
  MessageOutlined,
  SendOutlined,
  EditOutlined,
  DeleteOutlined,
  StarOutlined,
  StarFilled,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

interface Comment {
  id: number;
  content: string;
  user_name: string;
  user_avatar?: string;
  user_id: number;
  is_verified?: boolean;
  rating?: number;
  like_count: number;
  reply_count: number;
  created_at: string;
  updated_at: string;
  is_anonymous: boolean;
  is_pinned: boolean;
  parent_id?: number;
  replies?: Comment[];
  liked?: boolean;
}

interface CommentsSectionProps {
  causeId: number;
  allowComments?: boolean;
  allowRatings?: boolean;
  className?: string;
}

export default function CommentsSection({
  causeId,
  allowComments = true,
  allowRatings = true,
  className = "",
}: CommentsSectionProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState<number>(0);
  const [isAnonymous, setIsAnonymous] = useState(false);
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
        rating: allowRatings ? values.rating : null,
        is_anonymous: values.is_anonymous || false,
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
        setNewComment("");
        setNewRating(0);
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

  const handleLikeComment = async (commentId: number) => {
    if (!session?.user) {
      message.error("Please sign in to like comments");
      return;
    }

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "like" }),
      });

      const data = await response.json();

      if (data.success) {
        const updateComment = (comment: Comment): Comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              liked: data.data.liked,
              like_count: data.data.liked
                ? comment.like_count + 1
                : Math.max(0, comment.like_count - 1),
            };
          }
          return {
            ...comment,
            replies: comment.replies?.map(updateComment) || [],
          };
        };

        setComments(prev => prev.map(updateComment));
      } else {
        message.error(data.error || "Failed to like comment");
      }
    } catch (error) {
      console.error("Error liking comment:", error);
      message.error("Failed to like comment");
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        // Remove comment from UI
        const removeComment = (comments: Comment[]): Comment[] => {
          return comments
            .filter(comment => comment.id !== commentId)
            .map(comment => ({
              ...comment,
              replies: comment.replies ? removeComment(comment.replies) : [],
            }));
        };

        setComments(prev => removeComment(prev));
        message.success("Comment deleted successfully");
      } else {
        message.error(data.error || "Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      message.error("Failed to delete comment");
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
    const canEdit = session?.user?.id === comment.user_id.toString();
    const canDelete = canEdit || (session?.user as any)?.is_admin;

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
          border: comment.is_pinned ? "2px solid #1890ff" : "1px solid #f0f0f0",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
          <Avatar
            src={comment.is_anonymous ? undefined : comment.user_avatar}
            icon={<UserOutlined />}
            size={isReply ? 32 : 40}
          />
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <Text strong>
                {comment.is_anonymous ? "Anonymous" : comment.user_name}
              </Text>
              {comment.is_verified && (
                <SafetyCertificateOutlined style={{ color: "#52c41a" }} />
              )}
              {comment.is_pinned && (
                <Tooltip title="Pinned comment">
                  <StarFilled style={{ color: "#faad14" }} />
                </Tooltip>
              )}
              <Text type="secondary" style={{ fontSize: "12px" }}>
                {formatDate(comment.created_at)}
              </Text>
              {comment.updated_at !== comment.created_at && (
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  (edited)
                </Text>
              )}
            </div>

            {comment.rating && (
              <div style={{ marginBottom: "8px" }}>
                <Rate disabled value={comment.rating} size="small" />
              </div>
            )}

            <Paragraph style={{ marginBottom: "12px" }}>
              {comment.content}
            </Paragraph>

            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <Button
                type="text"
                size="small"
                icon={comment.liked ? <LikeFilled /> : <LikeOutlined />}
                onClick={() => handleLikeComment(comment.id)}
                style={{ color: comment.liked ? "#1890ff" : undefined }}
              >
                {comment.like_count}
              </Button>

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

              {canEdit && (
                <Button
                  type="text"
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => setEditingComment(comment.id)}
                >
                  Edit
                </Button>
              )}

              {canDelete && (
                <Button
                  type="text"
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    Modal.confirm({
                      title: "Delete Comment",
                      content: "Are you sure you want to delete this comment?",
                      onOk: () => handleDeleteComment(comment.id),
                    });
                  }}
                >
                  Delete
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

              <Form.Item name="is_anonymous" valuePropName="checked">
                <Button type="text" size="small">
                  Reply anonymously
                </Button>
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
            <AnimatePresence>
              {comment.replies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} isReply />
              ))}
            </AnimatePresence>
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

            {allowRatings && (
              <Form.Item name="rating" label="Rating (optional)">
                <Rate />
              </Form.Item>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Form.Item name="is_anonymous" valuePropName="checked" style={{ margin: 0 }}>
                <Button type="text">Comment anonymously</Button>
              </Form.Item>

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
          <AnimatePresence>
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </AnimatePresence>

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