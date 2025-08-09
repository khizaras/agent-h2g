"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import "@/styles/cause-details.css";
import "@/styles/cause-details-premium.css";
import {
  Row,
  Col,
  Card,
  Button,
  Avatar,
  Typography,
  Space,
  Progress,
  Tag,
  Input,
  Form,
  Modal,
  Carousel,
  Image,
  Divider,
  Tooltip,
  message,
  Skeleton,
  Empty,
  Alert,
  Badge,
  Descriptions,
} from "antd";
import {
  FiHeart,
  FiShare2,
  FiMapPin,
  FiClock,
  FiUser,
  FiEye,
  FiMessageCircle,
  FiCalendar,
  FiPhone,
  FiMail,
  FiEdit,
  FiTrash2,
  FiFlag,
  FiBookmark,
  FiArrowLeft,
  FiChevronRight,
  FiStar,
  FiUsers,
  FiTrendingUp,
  FiTarget,
  FiCheckCircle,
  FiAlertCircle,
  FiCamera,
  FiSend,
  FiMoreHorizontal,
  FiPackage,
  FiThermometer,
  FiTruck,
  FiInfo,
  FiDollarSign,
  FiMonitor,
  FiBookOpen,
  FiAward,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";
import SocialShare from "@/components/ui/SocialShare";
import EnrollmentButton from "@/components/enrollment/EnrollmentButton";
import EnrollmentStatus from "@/components/enrollment/EnrollmentStatus";
import CommentsSection from "@/components/comments/CommentsSection";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// Helper functions for categories and priorities
const getCategoryIcon = (categoryName: string) => {
  const icons = {
    training: <FiBookOpen />,
    education: <FiBookOpen />,
    clothes: <FiPackage />,
    food: <FiPackage />,
    health: <FiHeart />,
    transport: <FiTruck />,
    housing: <FiMapPin />,
    technology: <FiMonitor />,
    default: <FiInfo />,
  };
  return icons[categoryName as keyof typeof icons] || icons.default;
};

const getPriorityColor = (priority: string) => {
  const colors = {
    low: "#6b7280",
    medium: "#f59e0b",
    high: "#ef4444",
    urgent: "#dc2626",
  };
  return colors[priority as keyof typeof colors] || colors.medium;
};

interface CauseDetails {
  id: number;
  title: string;
  description: string;
  short_description?: string;
  category_name: string;
  category_display_name: string;
  cause_type: string;
  priority: string;
  status: string;
  location: string;
  image?: string;
  gallery?: string[];
  created_at: string;
  updated_at: string;
  view_count: number;
  like_count: number;
  special_instructions?: string;
  contact_email?: string;
  contact_phone?: string;
  tags?: string[];
  creator: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    bio?: string;
  };
  categoryDetails?: any;
  comments?: any[];
  activities?: any[];
}

// Premium animation variants with improved easing
const premiumAnimations = {
  containerVariants: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  },
  itemVariants: {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.23, 1, 0.32, 1],
      },
    },
  },
  floatingVariants: {
    animate: {
      y: [0, -8, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  },
  glowVariants: {
    animate: {
      boxShadow: [
        "0 0 20px rgba(102, 126, 234, 0.3)",
        "0 0 40px rgba(102, 126, 234, 0.5)",
        "0 0 20px rgba(102, 126, 234, 0.3)",
      ],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  },
  cardHover: {
    y: -6,
    scale: 1.02,
    boxShadow: "0 20px 40px rgba(102,126,234,0.15)",
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

// Premium statistics component with enhanced animations
const PremiumStats = ({ cause }: { cause: any }) => {
  const [animatedValues, setAnimatedValues] = useState({
    views: 0,
    supporters: 0,
    comments: 0,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValues({
        views: cause.view_count || 0,
        supporters: cause.like_count || 0,
        comments: cause.comments?.length || 0,
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [cause]);

  const stats = [
    {
      title: "Views",
      value: animatedValues.views,
      icon: <FiEye />,
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      title: "Supporters",
      value: animatedValues.supporters,
      icon: <FiHeart />,
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      title: "Comments",
      value: animatedValues.comments,
      icon: <FiMessageCircle />,
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
    {
      title: "Rating",
      value: "4.8",
      icon: <FiStar />,
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    },
  ];

  return (
    <motion.div
      variants={premiumAnimations.itemVariants}
      className="premium-stats-container"
    >
      <Row gutter={[16, 16]}>
        {stats.map((stat, index) => (
          <Col xs={12} sm={6} key={index}>
            <motion.div
              whileHover={premiumAnimations.cardHover}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card
                style={{
                  background: `linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)`,
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "16px",
                  textAlign: "center",
                  height: "100px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                }}
                bodyStyle={{ padding: "12px" }}
              >
                <motion.div
                  animate={{ rotate: [0, 5, 0, -5, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: index * 0.2,
                  }}
                  style={{
                    background: stat.gradient,
                    borderRadius: "50%",
                    width: "32px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 8px",
                    color: "white",
                    fontSize: "14px",
                  }}
                >
                  {stat.icon}
                </motion.div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: index * 0.1 + 0.3,
                    type: "spring",
                    stiffness: 200,
                  }}
                >
                  <Text
                    style={{
                      fontSize: "18px",
                      fontWeight: "700",
                      background: stat.gradient,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      display: "block",
                      fontFamily: "Inter, system-ui, sans-serif",
                    }}
                  >
                    {stat.value}
                  </Text>
                </motion.div>
                <Text
                  style={{
                    fontSize: "11px",
                    color: "#64748b",
                    fontWeight: "500",
                    fontFamily: "Inter, system-ui, sans-serif",
                  }}
                >
                  {stat.title}
                </Text>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>
    </motion.div>
  );
};

// Premium gallery component with enhanced carousel
const PremiumGallery = ({ images }: { images: string[] }) => {
  const [currentImage, setCurrentImage] = useState(0);

  if (!images || images.length === 0) return null;

  return (
    <motion.div
      variants={premiumAnimations.itemVariants}
      className="premium-gallery"
    >
      <Card
        style={{
          background: `linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)`,
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        }}
        bodyStyle={{ padding: 0 }}
      >
        <div style={{ position: "relative" }}>
          <Carousel
            autoplay
            autoplaySpeed={4000}
            effect="fade"
            beforeChange={(_, next) => setCurrentImage(next)}
            dots={{
              className: "premium-carousel-dots",
            }}
          >
            {images.map((image, index) => (
              <div key={index} style={{ position: "relative" }}>
                <Image
                  src={image}
                  alt={`Gallery image ${index + 1}`}
                  style={{
                    width: "100%",
                    height: "300px",
                    objectFit: "cover",
                  }}
                  preview={{
                    mask: (
                      <div
                        style={{
                          background: "rgba(0,0,0,0.6)",
                          color: "white",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          backdropFilter: "blur(10px)",
                          fontFamily: "Inter, system-ui, sans-serif",
                        }}
                      >
                        <FiCamera style={{ marginRight: "8px" }} />
                        View Full Size
                      </div>
                    ),
                  }}
                />
              </div>
            ))}
          </Carousel>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              position: "absolute",
              bottom: "16px",
              right: "16px",
              background: "rgba(0,0,0,0.7)",
              color: "white",
              padding: "6px 12px",
              borderRadius: "20px",
              fontSize: "12px",
              backdropFilter: "blur(10px)",
              fontFamily: "Inter, system-ui, sans-serif",
            }}
          >
            {currentImage + 1} / {images.length}
          </motion.div>
        </div>
      </Card>

      <style jsx global>{`
        .premium-carousel-dots .slick-dots {
          bottom: 20px;
        }
        .premium-carousel-dots .slick-dots li button {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.6);
        }
        .premium-carousel-dots .slick-dots li.slick-active button {
          background: white;
        }
      `}</style>
    </motion.div>
  );
};

// Premium comment system with enhanced interactions
const PremiumComments = ({
  comments = [],
  causeId,
}: {
  comments: any[];
  causeId: string;
}) => {
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { data: session } = useSession();

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      // API call would go here
      message.success("Comment posted successfully!");
      setNewComment("");
    } catch (error) {
      message.error("Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      variants={premiumAnimations.itemVariants}
      className="premium-comments"
    >
      <Card
        style={{
          background: `linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)`,
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: "20px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        }}
      >
        <Title
          level={4}
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "24px",
            fontFamily: "Inter, system-ui, sans-serif",
            fontWeight: "700",
          }}
        >
          Comments ({comments.length})
        </Title>

        {/* Comment input */}
        {session && (
          <motion.div
            style={{ marginBottom: "32px" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Space align="start" style={{ width: "100%" }}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Avatar
                  src={session.user?.image}
                  icon={<FiUser />}
                  size={40}
                  style={{
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  }}
                />
              </motion.div>
              <div style={{ flex: 1, width: "calc(100% - 56px)" }}>
                <TextArea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  rows={3}
                  style={{
                    background: "rgba(255,255,255,0.5)",
                    border: "1px solid rgba(102,126,234,0.2)",
                    borderRadius: "12px",
                    fontFamily: "Inter, system-ui, sans-serif",
                  }}
                />
                <div style={{ marginTop: "12px", textAlign: "right" }}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="primary"
                      icon={<FiSend />}
                      loading={submitting}
                      onClick={handleSubmitComment}
                      disabled={!newComment.trim()}
                      style={{
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        border: "none",
                        borderRadius: "10px",
                        fontFamily: "Inter, system-ui, sans-serif",
                        fontWeight: "600",
                      }}
                    >
                      Post Comment
                    </Button>
                  </motion.div>
                </div>
              </div>
            </Space>
          </motion.div>
        )}

        {/* Comments list */}
        <div className="comments-list">
          {comments.length === 0 ? (
            <Empty
              description={
                <Text
                  style={{
                    color: "#64748b",
                    fontFamily: "Inter, system-ui, sans-serif",
                  }}
                >
                  No comments yet. Be the first to share your thoughts!
                </Text>
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ) : (
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              {comments.map((comment, index) => (
                <motion.div
                  key={comment.id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 5 }}
                >
                  <div
                    style={{
                      background: "rgba(255,255,255,0.6)",
                      borderRadius: "16px",
                      padding: "16px",
                      border: "1px solid rgba(102,126,234,0.1)",
                    }}
                  >
                    <Space align="start" style={{ width: "100%" }}>
                      <Avatar
                        src={comment.user_avatar}
                        icon={<FiUser />}
                        size={36}
                      />
                      <div style={{ flex: 1 }}>
                        <Space
                          direction="vertical"
                          size={4}
                          style={{ width: "100%" }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Text
                              strong
                              style={{
                                fontFamily: "Inter, system-ui, sans-serif",
                                fontWeight: "600",
                                color: "#1e293b",
                              }}
                            >
                              {comment.user_name || "Anonymous"}
                            </Text>
                            <Text
                              style={{
                                fontSize: "12px",
                                color: "#64748b",
                                fontFamily: "Inter, system-ui, sans-serif",
                              }}
                            >
                              {comment.created_at &&
                                new Date(
                                  comment.created_at,
                                ).toLocaleDateString()}
                            </Text>
                          </div>
                          <Text
                            style={{
                              color: "#334155",
                              lineHeight: "1.6",
                              fontFamily: "Inter, system-ui, sans-serif",
                            }}
                          >
                            {comment.content}
                          </Text>
                        </Space>
                      </div>
                    </Space>
                  </div>
                </motion.div>
              ))}
            </Space>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

// Premium enrollment component with enhanced interactions
const PremiumEnrollment = ({
  cause,
  onEnroll,
}: {
  cause: any;
  onEnroll: () => void;
}) => {
  const [enrolling, setEnrolling] = useState(false);
  const { data: session } = useSession();

  const handleEnroll = async () => {
    if (!session) {
      message.warning("Please log in to enroll");
      return;
    }

    setEnrolling(true);
    try {
      await onEnroll();
      message.success("Successfully enrolled!");
    } catch (error) {
      message.error("Failed to enroll");
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <motion.div
      variants={premiumAnimations.itemVariants}
      whileHover={premiumAnimations.cardHover}
    >
      <Card
        style={{
          background: `linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%)`,
          backdropFilter: "blur(20px)",
          border: "2px solid rgba(102,126,234,0.2)",
          borderRadius: "20px",
          textAlign: "center",
          boxShadow: "0 20px 40px rgba(102,126,234,0.15)",
        }}
      >
        <motion.div
          variants={premiumAnimations.floatingVariants}
          animate="animate"
        >
          <div
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "50%",
              width: "60px",
              height: "60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              boxShadow: "0 10px 30px rgba(102,126,234,0.3)",
            }}
          >
            <FiUsers style={{ color: "white", fontSize: "24px" }} />
          </div>
        </motion.div>

        <Title
          level={4}
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "12px",
            fontFamily: "Inter, system-ui, sans-serif",
            fontWeight: "700",
          }}
        >
          Join This Initiative
        </Title>

        <Paragraph
          style={{
            color: "#64748b",
            marginBottom: "20px",
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          Be part of making a difference in your community
        </Paragraph>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            type="primary"
            size="large"
            icon={<FiCheckCircle />}
            loading={enrolling}
            onClick={handleEnroll}
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
              borderRadius: "12px",
              height: "48px",
              fontFamily: "Inter, system-ui, sans-serif",
              fontWeight: "600",
              fontSize: "16px",
              padding: "0 32px",
              boxShadow: "0 8px 20px rgba(102,126,234,0.3)",
            }}
          >
            Enroll Now
          </Button>
        </motion.div>
      </Card>
    </motion.div>
  );
};

// Category-specific details component with premium styling
const CategoryDetails = ({ cause }: { cause: any }) => {
  const renderCategorySpecificInfo = () => {
    if (!cause?.categoryDetails) return null;

    const details = cause.categoryDetails;
    const category = cause.category_name;

    switch (category) {
      case "food":
        return (
          <Descriptions
            column={2}
            size="small"
            style={{
              background: "rgba(255,255,255,0.6)",
              borderRadius: "12px",
              padding: "16px",
            }}
          >
            {details.food_type && (
              <Descriptions.Item label="Food Type" span={1}>
                <Tag
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                  }}
                >
                  {details.food_type}
                </Tag>
              </Descriptions.Item>
            )}
            {details.serving_size && (
              <Descriptions.Item label="Serving Size" span={1}>
                <Tag
                  style={{
                    background:
                      "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                  }}
                >
                  Serves {details.serving_size}
                </Tag>
              </Descriptions.Item>
            )}
            {details.expiration_date && (
              <Descriptions.Item label="Expiration" span={2}>
                <Tag
                  style={{
                    background:
                      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                  }}
                >
                  {new Date(details.expiration_date).toLocaleDateString()}
                </Tag>
              </Descriptions.Item>
            )}
          </Descriptions>
        );

      case "clothes":
        return (
          <Descriptions
            column={2}
            size="small"
            style={{
              background: "rgba(255,255,255,0.6)",
              borderRadius: "12px",
              padding: "16px",
            }}
          >
            {details.clothes_type && (
              <Descriptions.Item label="Type" span={1}>
                <Tag
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                  }}
                >
                  {details.clothes_type.replace("-", " ")}
                </Tag>
              </Descriptions.Item>
            )}
            {details.gender && (
              <Descriptions.Item label="Gender" span={1}>
                <Tag
                  style={{
                    background:
                      "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                  }}
                >
                  {details.gender}
                </Tag>
              </Descriptions.Item>
            )}
            {details.condition && (
              <Descriptions.Item label="Condition" span={1}>
                <Tag
                  style={{
                    background:
                      "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                  }}
                >
                  {details.condition}
                </Tag>
              </Descriptions.Item>
            )}
          </Descriptions>
        );

      case "training":
        return (
          <Descriptions
            column={2}
            size="small"
            style={{
              background: "rgba(255,255,255,0.6)",
              borderRadius: "12px",
              padding: "16px",
            }}
          >
            {details.training_type && (
              <Descriptions.Item label="Training Type" span={1}>
                <Tag
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                  }}
                >
                  {details.training_type.charAt(0).toUpperCase() +
                    details.training_type.slice(1).replace(/-/g, " ")}
                </Tag>
              </Descriptions.Item>
            )}
            {details.skill_level && (
              <Descriptions.Item label="Skill Level" span={1}>
                <Tag
                  style={{
                    background:
                      "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                  }}
                >
                  {details.skill_level.charAt(0).toUpperCase() +
                    details.skill_level.slice(1).replace(/-/g, " ")}
                </Tag>
              </Descriptions.Item>
            )}
            {details.duration_hours && (
              <Descriptions.Item label="Duration" span={1}>
                <Tag
                  style={{
                    background:
                      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                  }}
                >
                  {details.duration_hours} hours
                </Tag>
              </Descriptions.Item>
            )}
            {details.max_participants && (
              <Descriptions.Item label="Max Participants" span={1}>
                <Tag
                  style={{
                    background:
                      "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                  }}
                >
                  {details.max_participants} people
                </Tag>
              </Descriptions.Item>
            )}
            {details.is_free !== undefined && (
              <Descriptions.Item label="Cost" span={1}>
                <Tag
                  style={{
                    background: details.is_free
                      ? "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
                      : "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                  }}
                >
                  {details.is_free ? "Free" : `₹${details.price || "Paid"}`}
                </Tag>
              </Descriptions.Item>
            )}
            {details.delivery_method && (
              <Descriptions.Item label="Delivery Method" span={1}>
                <Tag
                  style={{
                    background:
                      "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                  }}
                >
                  {details.delivery_method.charAt(0).toUpperCase() +
                    details.delivery_method.slice(1).replace(/-/g, " ")}
                </Tag>
              </Descriptions.Item>
            )}
          </Descriptions>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div variants={premiumAnimations.itemVariants}>
      <Card
        style={{
          background: `linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)`,
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: "20px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        }}
      >
        <Title
          level={4}
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "16px",
            fontFamily: "Inter, system-ui, sans-serif",
            fontWeight: "700",
          }}
        >
          Details
        </Title>
        {renderCategorySpecificInfo()}
      </Card>
    </motion.div>
  );
};

// Parse gallery helper function
const parseGallery = (gallery: string | string[]) => {
  try {
    if (Array.isArray(gallery)) return gallery;
    if (typeof gallery === "string") {
      const parsed = JSON.parse(gallery);
      return Array.isArray(parsed) ? parsed : [gallery];
    }
    return [];
  } catch (e) {
    return typeof gallery === "string" ? [gallery] : [];
  }
};

// Main cause details page component
export default function CauseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [cause, setCause] = useState<CauseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [enrolled, setEnrolled] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentForm] = Form.useForm();
  const [enrollmentRefresh, setEnrollmentRefresh] = useState(0);

  // Fetch cause data
  useEffect(() => {
    if (params?.id) {
      fetchCauseDetails(params.id as string);
    }
  }, [params?.id]);

  const fetchCauseDetails = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/causes/${id}`);
      const data = await response.json();

      if (data.success) {
        const causeData = {
          ...data.data.cause,
          categoryDetails: data.data.categoryDetails,
        };
        setCause(causeData);
        setLikeCount(data.data.cause.like_count || 0);
        setIsLiked(data.data.cause.user_liked || false);
        setEnrolled(data.data.cause.user_enrolled || false);
      } else {
        setError(data.error || "Failed to fetch cause details");
      }
    } catch (err) {
      console.error("Error fetching cause:", err);
      setError("Failed to fetch cause details");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!cause) return;

    if (!session) {
      message.warning("Please log in to like this cause");
      return;
    }

    try {
      const response = await fetch(`/api/causes/${cause.id}/like`, {
        method: isLiked ? "DELETE" : "POST",
      });

      if (response.ok) {
        setIsLiked(!isLiked);
        setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
        message.success(
          isLiked ? "Removed from favorites" : "Added to favorites",
        );
      }
    } catch (error) {
      message.error("Failed to update like status");
    }
  };

  const handleEnroll = async () => {
    if (!cause) return;

    if (!session) {
      message.warning("Please log in to enroll");
      return;
    }

    try {
      const response = await fetch(`/api/causes/${cause.id}/enroll`, {
        method: "POST",
      });

      if (response.ok) {
        setEnrolled(true);
        message.success("Successfully enrolled!");
      }
    } catch (error) {
      message.error("Failed to enroll");
    }
  };

  const handleShare = async () => {
    if (!cause) return;

    try {
      await navigator.share({
        title: cause.title,
        text: cause.short_description || cause.description,
        url: window.location.href,
      });
    } catch (error) {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      message.success("Link copied to clipboard!");
    }
  };

  const handleComment = async (values: any) => {
    try {
      // TODO: Implement comment functionality
      message.success("Comment added successfully");
      setShowCommentModal(false);
      commentForm.resetFields();
    } catch (err) {
      message.error("Failed to add comment");
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div
          style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card
              style={{
                background: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(20px)",
                borderRadius: "20px",
                padding: "40px",
                textAlign: "center",
                border: "none",
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
              }}
            >
              <Skeleton active paragraph={{ rows: 8 }} />
            </Card>
          </motion.div>
        </div>
      </MainLayout>
    );
  }

  if (error || !cause) {
    return (
      <MainLayout>
        <div className="cause-page error-state">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Empty
              description={
                <div>
                  <Text className="error-text">
                    {error || "Cause not found"}
                  </Text>
                  <div className="error-actions">
                    <Button
                      type="primary"
                      onClick={() => router.push("/causes")}
                      className="btn-ghost-light"
                    >
                      Back to Causes
                    </Button>
                  </div>
                </div>
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </motion.div>
        </div>
      </MainLayout>
    );
  }

  const isOwner = session?.user?.id === cause.creator?.id?.toString();
  const gallery = parseGallery(cause.gallery || []);

  return (
    <MainLayout>
      <div className="cause-details-page cause-page">
        {/* Modern Premium Header */}
        <div className="cause-header">
          <div className="cause-header-container">
            {/* Navigation */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                icon={<FiArrowLeft />}
                onClick={() => router.back()}
                className="cause-nav-back"
              >
                Back
              </Button>
            </motion.div>

            {/* Badges */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="cause-badges-container"
            >
              <div className="cause-category-badge">
                {getCategoryIcon(cause.category_name)}
                {cause.category_display_name}
              </div>
              {cause.cause_type && (
                <div
                  className={`cause-type-badge cause-type-${cause.cause_type}`}
                >
                  {cause.cause_type === "offered" ? "OFFERING" : "REQUESTING"}
                </div>
              )}
              {cause.priority !== "medium" && (
                <div
                  className={`cause-priority-badge priority-${cause.priority}`}
                >
                  {cause.priority.toUpperCase()}
                </div>
              )}
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h1 className="cause-title">{cause.title}</h1>
            </motion.div>

            {/* Meta Information */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="cause-meta-info"
            >
              <div className="cause-meta-item">
                <FiMapPin className="cause-meta-icon" />
                <span className="cause-meta-text">{cause.location}</span>
              </div>
              <div className="cause-meta-item">
                <FiClock className="cause-meta-icon" />
                <span className="cause-meta-text">
                  {new Date(cause.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="cause-meta-item">
                <FiEye className="cause-meta-icon" />
                <span className="cause-meta-text">
                  {cause.view_count} views
                </span>
              </div>
              <div className="cause-meta-item">
                <FiHeart className="cause-meta-icon" />
                <span className="cause-meta-text">
                  {cause.like_count} likes
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="cause-main-content">
          <motion.div
            variants={premiumAnimations.containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Statistics */}
            <div style={{ marginBottom: "48px" }}>
              <PremiumStats cause={cause} />
            </div>

            <div className="cause-content-grid">
              {/* Left Column */}
              <div className="main-content-column">
                <Space
                  direction="vertical"
                  size="large"
                  style={{ width: "100%" }}
                >
                  {/* Description */}
                  <motion.div variants={premiumAnimations.itemVariants}>
                    <div className="premium-card">
                      <div className="premium-card-content">
                        <h3 className="premium-card-title">
                          About this initiative
                        </h3>
                        <div className="cause-description">
                          <MarkdownRenderer content={cause.description} />
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Category-specific details */}
                  <CategoryDetails cause={cause} />

                  {/* Training Details - Premium Design */}
                  {cause.category_name === "training" &&
                    cause.categoryDetails && (
                      <motion.div
                        variants={premiumAnimations.itemVariants}
                        className="training-details-card"
                      >
                        <div className="premium-card-content">
                          <h3 className="training-header">
                            <FiBookOpen />
                            Training Details
                          </h3>

                          {/* Training Overview */}
                          <div className="training-overview">
                            <ul className="kv-list">
                              {cause.categoryDetails.training_type && (
                                <li className="kv">
                                  <span className="kv-label">Type</span>
                                  <span className="kv-value">
                                    {cause.categoryDetails.training_type
                                      .charAt(0)
                                      .toUpperCase() +
                                      cause.categoryDetails.training_type
                                        .slice(1)
                                        .replace(/-/g, " ")}
                                  </span>
                                </li>
                              )}
                              {cause.categoryDetails.skill_level && (
                                <li className="kv">
                                  <span className="kv-label">Level</span>
                                  <span className="kv-value">
                                    {cause.categoryDetails.skill_level
                                      .charAt(0)
                                      .toUpperCase() +
                                      cause.categoryDetails.skill_level
                                        .slice(1)
                                        .replace(/-/g, " ")}
                                  </span>
                                </li>
                              )}
                              {cause.categoryDetails.course_language && (
                                <li className="kv">
                                  <span className="kv-label">Language</span>
                                  <span className="kv-value">
                                    {cause.categoryDetails.course_language
                                      .charAt(0)
                                      .toUpperCase() +
                                      cause.categoryDetails.course_language.slice(
                                        1,
                                      )}
                                  </span>
                                </li>
                              )}
                              {cause.categoryDetails.delivery_method && (
                                <li className="kv">
                                  <span className="kv-label">Method</span>
                                  <span className="kv-value">
                                    {cause.categoryDetails.delivery_method
                                      .charAt(0)
                                      .toUpperCase() +
                                      cause.categoryDetails.delivery_method
                                        .slice(1)
                                        .replace(/-/g, " ")}
                                  </span>
                                </li>
                              )}
                            </ul>
                          </div>

                          {/* Key Metrics (compact) */}
                          <div className="training-metrics">
                            <div className="pill-group">
                              {cause.categoryDetails.duration_hours && (
                                <span className="pill">
                                  <FiClock />{" "}
                                  {cause.categoryDetails.duration_hours}h total
                                </span>
                              )}
                              {(cause.categoryDetails.number_of_sessions ||
                                cause.categoryDetails.session_duration) && (
                                <span className="pill">
                                  <FiBookOpen />
                                  {cause.categoryDetails.number_of_sessions
                                    ? `${cause.categoryDetails.number_of_sessions} sessions`
                                    : ""}
                                  {cause.categoryDetails.session_duration
                                    ? ` · ${cause.categoryDetails.session_duration}h each`
                                    : ""}
                                </span>
                              )}
                              <span className="pill">
                                <FiDollarSign />{" "}
                                {cause.categoryDetails.is_free
                                  ? "Free"
                                  : `₹${cause.categoryDetails.price || "Paid"}`}
                              </span>
                              {cause.categoryDetails.difficulty_rating && (
                                <span className="pill">
                                  <FiStar />{" "}
                                  {cause.categoryDetails.difficulty_rating}/5
                                </span>
                              )}
                              {cause.categoryDetails.max_participants && (
                                <span className="pill">
                                  <FiUsers /> up to{" "}
                                  {cause.categoryDetails.max_participants}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Enrollment Progress */}
                          {cause.categoryDetails.max_participants && (
                            <div className="enrollment-progress">
                              <div className="enrollment-header">
                                <h4 className="enrollment-title">
                                  📊 Enrollment Status
                                </h4>
                                <div className="enrollment-stats">
                                  <div className="enrollment-count">
                                    {cause.categoryDetails
                                      .current_participants || 0}{" "}
                                    / {cause.categoryDetails.max_participants}
                                  </div>
                                  <div className="enrollment-label">
                                    Students Enrolled
                                  </div>
                                </div>
                              </div>
                              <Progress
                                percent={Math.round(
                                  ((cause.categoryDetails
                                    .current_participants || 0) /
                                    cause.categoryDetails.max_participants) *
                                    100,
                                )}
                                className="enrollment-progress-bar"
                                strokeWidth={8}
                              />
                              <div className="enrollment-breakdown">
                                <div className="enrollment-item enrolled-count">
                                  ✅{" "}
                                  {cause.categoryDetails.current_participants ||
                                    0}{" "}
                                  enrolled
                                </div>
                                <div className="enrollment-item remaining-count">
                                  🎯{" "}
                                  {cause.categoryDetails.max_participants -
                                    (cause.categoryDetails
                                      .current_participants || 0)}{" "}
                                  spots remaining
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Rest of training details... */}
                          {/* Instructor Details */}
                          {cause.categoryDetails.instructor_name && (
                            <div className="instructor-card">
                              <div className="instructor-header">
                                <FiUser className="instructor-icon" />
                                <h4 className="instructor-name">
                                  {cause.categoryDetails.instructor_name}
                                </h4>
                              </div>
                              <div className="instructor-contact">
                                {cause.categoryDetails.instructor_email && (
                                  <div className="instructor-contact-item">
                                    <FiMail />{" "}
                                    {cause.categoryDetails.instructor_email}
                                  </div>
                                )}
                                {cause.categoryDetails.instructor_phone && (
                                  <div className="instructor-contact-item">
                                    <FiPhone />{" "}
                                    {cause.categoryDetails.instructor_phone}
                                  </div>
                                )}
                              </div>
                              {cause.categoryDetails
                                .instructor_qualifications && (
                                <div className="instructor-details">
                                  <span className="instructor-detail-label">
                                    Qualifications:
                                  </span>{" "}
                                  {
                                    cause.categoryDetails
                                      .instructor_qualifications
                                  }
                                </div>
                              )}
                              {cause.categoryDetails.instructor_bio && (
                                <div className="instructor-details">
                                  <span className="instructor-detail-label">
                                    Bio:
                                  </span>{" "}
                                  {cause.categoryDetails.instructor_bio}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Learning Details */}
                          <div className="content-grid">
                            {cause.categoryDetails.learning_objectives && (
                              <div className="content-card content-card-primary">
                                <h5 className="content-card-title">
                                  📋 Learning Objectives
                                </h5>
                                <div className="content-card-text">
                                  {cause.categoryDetails.learning_objectives}
                                </div>
                              </div>
                            )}
                            {cause.categoryDetails.curriculum && (
                              <div className="content-card content-card-success">
                                <h5 className="content-card-title">
                                  📚 Curriculum
                                </h5>
                                <div className="content-card-text">
                                  {cause.categoryDetails.curriculum}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Prerequisites */}
                          {cause.categoryDetails.prerequisites && (
                            <div className="content-card content-card-warning">
                              <h5 className="content-card-title">
                                ⚡ Prerequisites
                              </h5>
                              <div className="content-card-text">
                                {cause.categoryDetails.prerequisites}
                              </div>
                            </div>
                          )}

                          {/* Schedule Details */}
                          {cause.categoryDetails.schedule && (
                            <div className="schedule-card">
                              <div className="schedule-header">
                                <FiCalendar className="schedule-icon" />
                                <h5 className="schedule-title">
                                  Schedule Details
                                </h5>
                              </div>
                              <div className="schedule-item">
                                <span className="schedule-label">
                                  Schedule:
                                </span>{" "}
                                {cause.categoryDetails.schedule}
                              </div>
                            </div>
                          )}

                          {/* Topics & Materials */}
                          <div className="tags-section">
                            <div className="tags-grid">
                              {/* Topics */}
                              {cause.categoryDetails.topics &&
                                Array.isArray(cause.categoryDetails.topics) &&
                                cause.categoryDetails.topics.length > 0 && (
                                  <div>
                                    <h5 className="content-card-title">
                                      🎯 Topics Covered
                                    </h5>
                                    <div className="tags-container">
                                      {cause.categoryDetails.topics.map(
                                        (topic: string) => (
                                          <span
                                            key={topic}
                                            className="tag-item tag-topic"
                                          >
                                            {topic.charAt(0).toUpperCase() +
                                              topic.slice(1).replace(/-/g, " ")}
                                          </span>
                                        ),
                                      )}
                                    </div>
                                  </div>
                                )}

                              {/* Materials */}
                              {cause.categoryDetails.materials_provided &&
                                Array.isArray(
                                  cause.categoryDetails.materials_provided,
                                ) &&
                                cause.categoryDetails.materials_provided
                                  .length > 0 && (
                                  <div>
                                    <h5 className="content-card-title">
                                      📦 Materials Provided
                                    </h5>
                                    <div className="tags-container">
                                      {cause.categoryDetails.materials_provided.map(
                                        (material: string, index: number) => (
                                          <span
                                            key={material + index}
                                            className="tag-item tag-provided"
                                          >
                                            {material.charAt(0).toUpperCase() +
                                              material
                                                .slice(1)
                                                .replace(/-/g, " ")}
                                          </span>
                                        ),
                                      )}
                                    </div>
                                  </div>
                                )}

                              {/* Materials Required */}
                              {cause.categoryDetails.materials_required && (
                                <div>
                                  <h5 className="content-card-title">
                                    📝 Materials Required
                                  </h5>
                                  <div className="tags-container">
                                    {(() => {
                                      let required: any =
                                        cause.categoryDetails
                                          .materials_required;
                                      if (typeof required === "string") {
                                        try {
                                          required = JSON.parse(required);
                                        } catch (e) {
                                          required = [required];
                                        }
                                      }
                                      if (!Array.isArray(required))
                                        required = [];

                                      return required.map(
                                        (material: string, index: number) => (
                                          <span
                                            key={material + index}
                                            className="tag-item tag-required"
                                          >
                                            {material.charAt(0).toUpperCase() +
                                              material
                                                .slice(1)
                                                .replace(/-/g, " ")}
                                          </span>
                                        ),
                                      );
                                    })()}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Platform & Special Features */}
                          <Row
                            gutter={[16, 16]}
                            style={{ marginBottom: "24px" }}
                          >
                            {cause.categoryDetails.meeting_platform && (
                              <Col xs={12} sm={8} md={6}>
                                <div
                                  style={{
                                    background: "rgba(59,130,246,0.1)",
                                    border: "1px solid rgba(59,130,246,0.2)",
                                    borderRadius: "12px",
                                    padding: "12px",
                                    textAlign: "center",
                                  }}
                                >
                                  <FiMonitor
                                    style={{
                                      color: "#3b82f6",
                                      fontSize: "16px",
                                      marginBottom: "4px",
                                    }}
                                  />
                                  <div
                                    style={{
                                      fontSize: "12px",
                                      color: "#3b82f6",
                                      fontWeight: "600",
                                      fontFamily:
                                        "Inter, system-ui, sans-serif",
                                    }}
                                  >
                                    {cause.categoryDetails.meeting_platform
                                      .charAt(0)
                                      .toUpperCase() +
                                      cause.categoryDetails.meeting_platform
                                        .slice(1)
                                        .replace(/-/g, " ")}
                                  </div>
                                </div>
                              </Col>
                            )}
                            {cause.categoryDetails.certification_provided && (
                              <Col xs={12} sm={8} md={6}>
                                <div
                                  style={{
                                    background: "rgba(240,185,11,0.1)",
                                    border: "1px solid rgba(240,185,11,0.3)",
                                    borderRadius: "12px",
                                    padding: "12px",
                                    textAlign: "center",
                                  }}
                                >
                                  <FiAward
                                    style={{
                                      color: "#f0b90b",
                                      fontSize: "16px",
                                      marginBottom: "4px",
                                    }}
                                  />
                                  <div
                                    style={{
                                      fontSize: "12px",
                                      color: "#f0b90b",
                                      fontWeight: "600",
                                      fontFamily:
                                        "Inter, system-ui, sans-serif",
                                    }}
                                  >
                                    Certificate
                                  </div>
                                </div>
                              </Col>
                            )}
                            {cause.categoryDetails.location_details && (
                              <Col xs={12} sm={8} md={6}>
                                <div
                                  style={{
                                    background: "rgba(34,197,94,0.1)",
                                    border: "1px solid rgba(34,197,94,0.2)",
                                    borderRadius: "12px",
                                    padding: "12px",
                                    textAlign: "center",
                                  }}
                                >
                                  <FiMapPin
                                    style={{
                                      color: "#22c55e",
                                      fontSize: "16px",
                                      marginBottom: "4px",
                                    }}
                                  />
                                  <div
                                    style={{
                                      fontSize: "12px",
                                      color: "#22c55e",
                                      fontWeight: "600",
                                      fontFamily:
                                        "Inter, system-ui, sans-serif",
                                    }}
                                  >
                                    {cause.categoryDetails.location_details.slice(
                                      0,
                                      30,
                                    )}
                                    ...
                                  </div>
                                </div>
                              </Col>
                            )}
                          </Row>

                          {/* Schedule Information */}
                          {(cause.categoryDetails.start_date ||
                            cause.categoryDetails.end_date ||
                            cause.categoryDetails.registration_deadline) && (
                            <div
                              style={{
                                background: "rgba(239,68,68,0.1)",
                                border: "1px solid rgba(239,68,68,0.2)",
                                borderRadius: "12px",
                                padding: "16px",
                              }}
                            >
                              <FiCalendar
                                style={{
                                  color: "#ef4444",
                                  marginRight: "8px",
                                  fontSize: "16px",
                                }}
                              />
                              <Title
                                level={5}
                                style={{
                                  display: "inline",
                                  color: "#ef4444",
                                  fontWeight: "600",
                                  fontFamily: "Inter, system-ui, sans-serif",
                                  fontSize: "16px",
                                }}
                              >
                                Important Dates
                              </Title>
                              <div style={{ marginTop: "8px" }}>
                                {cause.categoryDetails.start_date && (
                                  <div
                                    style={{
                                      fontSize: "14px",
                                      color: "#ef4444",
                                      fontFamily:
                                        "Inter, system-ui, sans-serif",
                                      marginBottom: "4px",
                                    }}
                                  >
                                    🚀 <strong>Starts:</strong>{" "}
                                    {new Date(
                                      cause.categoryDetails.start_date,
                                    ).toLocaleDateString()}
                                  </div>
                                )}
                                {cause.categoryDetails.end_date && (
                                  <div
                                    style={{
                                      fontSize: "14px",
                                      color: "#ef4444",
                                      fontFamily:
                                        "Inter, system-ui, sans-serif",
                                      marginBottom: "4px",
                                    }}
                                  >
                                    🏁 <strong>Ends:</strong>{" "}
                                    {new Date(
                                      cause.categoryDetails.end_date,
                                    ).toLocaleDateString()}
                                  </div>
                                )}
                                {cause.categoryDetails
                                  .registration_deadline && (
                                  <div
                                    style={{
                                      fontSize: "14px",
                                      color: "#ef4444",
                                      fontFamily:
                                        "Inter, system-ui, sans-serif",
                                    }}
                                  >
                                    📝 <strong>Registration Deadline:</strong>{" "}
                                    {new Date(
                                      cause.categoryDetails.registration_deadline,
                                    ).toLocaleDateString()}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  {/* Gallery */}
                  {gallery && gallery.length > 0 && (
                    <PremiumGallery images={gallery} />
                  )}
                  {/* Comments */}
                  <div className="comments-spacer">
                    <CommentsSection causeId={cause.id} allowComments={true} />
                  </div>
                </Space>
              </div>

              {/* Right Column */}
              <div className="sidebar-column">
                <Space
                  direction="vertical"
                  size="large"
                  style={{ width: "100%" }}
                >
                  {/* Creator Info */}
                  <motion.div variants={premiumAnimations.itemVariants}>
                    <div className="sidebar-card">
                      <div
                        style={{ textAlign: "center", marginBottom: "20px" }}
                      >
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Avatar
                            src={cause.creator?.avatar}
                            icon={<FiUser />}
                            size={80}
                            style={{
                              marginBottom: "16px",
                              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                            }}
                          />
                        </motion.div>
                        <h4 className="sidebar-title">
                          {cause.creator?.name || "Anonymous"}
                        </h4>
                        <p className="premium-card-subtitle">
                          Initiative Creator
                        </p>
                      </div>

                      {cause.contact_phone && (
                        <Space
                          style={{
                            width: "100%",
                            justifyContent: "center",
                            marginBottom: "12px",
                          }}
                        >
                          <FiPhone style={{ color: "#64748b" }} />
                          <Text
                            style={{
                              fontFamily: "Inter, system-ui, sans-serif",
                            }}
                          >
                            {cause.contact_phone}
                          </Text>
                        </Space>
                      )}

                      {(cause.contact_email || cause.creator?.email) && (
                        <Space
                          style={{
                            width: "100%",
                            justifyContent: "center",
                            marginBottom: "20px",
                          }}
                        >
                          <FiMail style={{ color: "#64748b" }} />
                          <Text
                            style={{
                              fontFamily: "Inter, system-ui, sans-serif",
                            }}
                          >
                            {cause.contact_email || cause.creator?.email}
                          </Text>
                        </Space>
                      )}

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="primary"
                          block
                          icon={<FiMail />}
                          onClick={() =>
                            (window.location.href = `mailto:${cause.contact_email || cause.creator?.email}`)
                          }
                          style={{
                            background:
                              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            border: "none",
                            borderRadius: "12px",
                            height: "40px",
                            fontFamily: "Inter, system-ui, sans-serif",
                            fontWeight: "600",
                            fontSize: "14px",
                          }}
                        >
                          Send Message
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Enrollment */}
                  {!enrolled && (
                    <PremiumEnrollment cause={cause} onEnroll={handleEnroll} />
                  )}

                  {enrolled && (
                    <motion.div variants={premiumAnimations.itemVariants}>
                      <Alert
                        message="You're enrolled!"
                        description="You have successfully joined this initiative. The creator will contact you soon."
                        type="success"
                        showIcon
                        style={{
                          borderRadius: "16px",
                          border: "1px solid #10b981",
                          background: "rgba(16, 185, 129, 0.1)",
                          fontFamily: "Inter, system-ui, sans-serif",
                        }}
                      />
                    </motion.div>
                  )}

                  {/* Category-Specific Details */}

                  {/* Food Category Details */}
                  {cause.category_name === "food" && cause.categoryDetails && (
                    <motion.div variants={premiumAnimations.itemVariants}>
                      <Card
                        style={{
                          background: `linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)`,
                          backdropFilter: "blur(20px)",
                          border: "1px solid rgba(255,255,255,0.2)",
                          borderRadius: "20px",
                          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                        }}
                      >
                        <Title
                          level={4}
                          style={{
                            background:
                              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            marginBottom: "20px",
                            fontFamily: "Inter, system-ui, sans-serif",
                            fontWeight: "700",
                          }}
                        >
                          <FiPackage style={{ marginRight: 8 }} />
                          Food Details
                        </Title>

                        {/* Food Specifications */}
                        <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
                          {cause.categoryDetails.foodType && (
                            <Col span={8}>
                              <div
                                style={{
                                  textAlign: "center",
                                  padding: "12px",
                                  background: "rgba(16, 185, 129, 0.1)",
                                  borderRadius: "12px",
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: "16px",
                                    fontWeight: "700",
                                    background:
                                      "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    fontFamily: "Inter, system-ui, sans-serif",
                                  }}
                                >
                                  {cause.categoryDetails.foodType
                                    .charAt(0)
                                    .toUpperCase() +
                                    cause.categoryDetails.foodType
                                      .slice(1)
                                      .replace(/-/g, " ")}
                                </div>
                                <div
                                  style={{
                                    fontSize: "11px",
                                    color: "#64748b",
                                    fontFamily: "Inter, system-ui, sans-serif",
                                  }}
                                >
                                  Food Type
                                </div>
                              </div>
                            </Col>
                          )}
                          {cause.categoryDetails.quantity && (
                            <Col span={8}>
                              <div
                                style={{
                                  textAlign: "center",
                                  padding: "12px",
                                  background: "rgba(59, 130, 246, 0.1)",
                                  borderRadius: "12px",
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: "16px",
                                    fontWeight: "700",
                                    background:
                                      "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    fontFamily: "Inter, system-ui, sans-serif",
                                  }}
                                >
                                  {cause.categoryDetails.quantity}{" "}
                                  {cause.categoryDetails.unit || "servings"}
                                </div>
                                <div
                                  style={{
                                    fontSize: "11px",
                                    color: "#64748b",
                                    fontFamily: "Inter, system-ui, sans-serif",
                                  }}
                                >
                                  Quantity
                                </div>
                              </div>
                            </Col>
                          )}
                          {cause.categoryDetails.temperatureRequirements && (
                            <Col span={8}>
                              <div
                                style={{
                                  textAlign: "center",
                                  padding: "12px",
                                  background: "rgba(239, 68, 68, 0.1)",
                                  borderRadius: "12px",
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: "16px",
                                    fontWeight: "700",
                                    background:
                                      "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    fontFamily: "Inter, system-ui, sans-serif",
                                  }}
                                >
                                  <FiThermometer
                                    style={{ marginRight: "4px" }}
                                  />
                                  {cause.categoryDetails.temperatureRequirements
                                    .charAt(0)
                                    .toUpperCase() +
                                    cause.categoryDetails.temperatureRequirements
                                      .slice(1)
                                      .replace(/-/g, " ")}
                                </div>
                                <div
                                  style={{
                                    fontSize: "11px",
                                    color: "#64748b",
                                    fontFamily: "Inter, system-ui, sans-serif",
                                  }}
                                >
                                  Storage
                                </div>
                              </div>
                            </Col>
                          )}
                        </Row>

                        {/* Dietary Information */}
                        {(cause.categoryDetails.dietaryRestrictions ||
                          cause.categoryDetails.allergens) && (
                          <div style={{ marginBottom: "20px" }}>
                            {cause.categoryDetails.dietaryRestrictions &&
                              cause.categoryDetails.dietaryRestrictions.length >
                                0 && (
                                <div style={{ marginBottom: "12px" }}>
                                  <Text
                                    strong
                                    style={{
                                      color: "#1e293b",
                                      fontFamily:
                                        "Inter, system-ui, sans-serif",
                                      marginBottom: "8px",
                                      display: "block",
                                    }}
                                  >
                                    Dietary Restrictions:
                                  </Text>
                                  <Space wrap>
                                    {cause.categoryDetails.dietaryRestrictions.map(
                                      (restriction: string) => (
                                        <Tag
                                          key={restriction}
                                          style={{
                                            background:
                                              "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "12px",
                                          }}
                                        >
                                          {restriction.charAt(0).toUpperCase() +
                                            restriction
                                              .slice(1)
                                              .replace(/-/g, " ")}
                                        </Tag>
                                      ),
                                    )}
                                  </Space>
                                </div>
                              )}
                            {cause.categoryDetails.allergens &&
                              cause.categoryDetails.allergens.length > 0 && (
                                <div>
                                  <Text
                                    strong
                                    style={{
                                      color: "#1e293b",
                                      fontFamily:
                                        "Inter, system-ui, sans-serif",
                                      marginBottom: "8px",
                                      display: "block",
                                    }}
                                  >
                                    Contains Allergens:
                                  </Text>
                                  <Space wrap>
                                    {cause.categoryDetails.allergens.map(
                                      (allergen: string) => (
                                        <Tag
                                          key={allergen}
                                          style={{
                                            background:
                                              "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "12px",
                                          }}
                                        >
                                          {allergen.charAt(0).toUpperCase() +
                                            allergen.slice(1)}
                                        </Tag>
                                      ),
                                    )}
                                  </Space>
                                </div>
                              )}
                          </div>
                        )}

                        {/* Delivery Information */}
                        {cause.categoryDetails.deliveryAvailable && (
                          <div
                            style={{
                              background: "rgba(34, 197, 94, 0.1)",
                              border: "1px solid rgba(34, 197, 94, 0.3)",
                              borderRadius: "12px",
                              padding: "12px",
                              textAlign: "center",
                            }}
                          >
                            <FiTruck
                              style={{ color: "#22c55e", marginRight: "6px" }}
                            />
                            <Text
                              style={{
                                fontSize: "12px",
                                color: "#22c55e",
                                fontWeight: "600",
                                fontFamily: "Inter, system-ui, sans-serif",
                              }}
                            >
                              Delivery Available{" "}
                              {cause.categoryDetails.deliveryRadius &&
                                `(${cause.categoryDetails.deliveryRadius}km radius)`}
                            </Text>
                          </div>
                        )}
                      </Card>
                    </motion.div>
                  )}

                  {/* Clothes Category Details */}
                  {cause.category_name === "clothes" &&
                    cause.categoryDetails && (
                      <motion.div variants={premiumAnimations.itemVariants}>
                        <Card
                          style={{
                            background: `linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)`,
                            backdropFilter: "blur(20px)",
                            border: "1px solid rgba(255,255,255,0.2)",
                            borderRadius: "20px",
                            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                          }}
                        >
                          <Title
                            level={4}
                            style={{
                              background:
                                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                              marginBottom: "20px",
                              fontFamily: "Inter, system-ui, sans-serif",
                              fontWeight: "700",
                            }}
                          >
                            <FiPackage style={{ marginRight: 8 }} />
                            Clothing Details
                          </Title>

                          {/* Clothing Specifications */}
                          <Row
                            gutter={[16, 16]}
                            style={{ marginBottom: "20px" }}
                          >
                            {cause.categoryDetails.clothesType && (
                              <Col span={8}>
                                <div
                                  style={{
                                    textAlign: "center",
                                    padding: "12px",
                                    background: "rgba(139, 92, 246, 0.1)",
                                    borderRadius: "12px",
                                  }}
                                >
                                  <div
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: "700",
                                      background:
                                        "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                                      WebkitBackgroundClip: "text",
                                      WebkitTextFillColor: "transparent",
                                      fontFamily:
                                        "Inter, system-ui, sans-serif",
                                    }}
                                  >
                                    {cause.categoryDetails.clothesType
                                      .charAt(0)
                                      .toUpperCase() +
                                      cause.categoryDetails.clothesType
                                        .slice(1)
                                        .replace(/-/g, " ")}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: "11px",
                                      color: "#64748b",
                                      fontFamily:
                                        "Inter, system-ui, sans-serif",
                                    }}
                                  >
                                    Type
                                  </div>
                                </div>
                              </Col>
                            )}
                            {cause.categoryDetails.gender && (
                              <Col span={8}>
                                <div
                                  style={{
                                    textAlign: "center",
                                    padding: "12px",
                                    background: "rgba(236, 72, 153, 0.1)",
                                    borderRadius: "12px",
                                  }}
                                >
                                  <div
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: "700",
                                      background:
                                        "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
                                      WebkitBackgroundClip: "text",
                                      WebkitTextFillColor: "transparent",
                                      fontFamily:
                                        "Inter, system-ui, sans-serif",
                                    }}
                                  >
                                    {cause.categoryDetails.gender
                                      .charAt(0)
                                      .toUpperCase() +
                                      cause.categoryDetails.gender.slice(1)}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: "11px",
                                      color: "#64748b",
                                      fontFamily:
                                        "Inter, system-ui, sans-serif",
                                    }}
                                  >
                                    Gender
                                  </div>
                                </div>
                              </Col>
                            )}
                            {cause.categoryDetails.condition && (
                              <Col span={8}>
                                <div
                                  style={{
                                    textAlign: "center",
                                    padding: "12px",
                                    background: "rgba(34, 197, 94, 0.1)",
                                    borderRadius: "12px",
                                  }}
                                >
                                  <div
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: "700",
                                      background:
                                        "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                                      WebkitBackgroundClip: "text",
                                      WebkitTextFillColor: "transparent",
                                      fontFamily:
                                        "Inter, system-ui, sans-serif",
                                    }}
                                  >
                                    {cause.categoryDetails.condition
                                      .charAt(0)
                                      .toUpperCase() +
                                      cause.categoryDetails.condition
                                        .slice(1)
                                        .replace(/-/g, " ")}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: "11px",
                                      color: "#64748b",
                                      fontFamily:
                                        "Inter, system-ui, sans-serif",
                                    }}
                                  >
                                    Condition
                                  </div>
                                </div>
                              </Col>
                            )}
                          </Row>

                          {/* Size and Quantity Information */}
                          {(cause.categoryDetails.sizeRange ||
                            cause.categoryDetails.quantity) && (
                            <Row
                              gutter={[16, 16]}
                              style={{ marginBottom: "20px" }}
                            >
                              {cause.categoryDetails.sizeRange &&
                                cause.categoryDetails.sizeRange.length > 0 && (
                                  <Col span={16}>
                                    <div style={{ marginBottom: "12px" }}>
                                      <Text
                                        strong
                                        style={{
                                          color: "#1e293b",
                                          fontFamily:
                                            "Inter, system-ui, sans-serif",
                                          marginBottom: "8px",
                                          display: "block",
                                        }}
                                      >
                                        Available Sizes:
                                      </Text>
                                      <Space wrap>
                                        {cause.categoryDetails.sizeRange.map(
                                          (size: string) => (
                                            <Tag
                                              key={size}
                                              style={{
                                                background:
                                                  "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                                                color: "white",
                                                border: "none",
                                                borderRadius: "8px",
                                              }}
                                            >
                                              {size}
                                            </Tag>
                                          ),
                                        )}
                                      </Space>
                                    </div>
                                  </Col>
                                )}
                              {cause.categoryDetails.quantity && (
                                <Col span={8}>
                                  <div
                                    style={{
                                      textAlign: "center",
                                      padding: "12px",
                                      background: "rgba(59, 130, 246, 0.1)",
                                      borderRadius: "12px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        fontSize: "18px",
                                        fontWeight: "700",
                                        background:
                                          "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                        fontFamily:
                                          "Inter, system-ui, sans-serif",
                                      }}
                                    >
                                      {cause.categoryDetails.quantity}
                                    </div>
                                    <div
                                      style={{
                                        fontSize: "11px",
                                        color: "#64748b",
                                        fontFamily:
                                          "Inter, system-ui, sans-serif",
                                      }}
                                    >
                                      Items
                                    </div>
                                  </div>
                                </Col>
                              )}
                            </Row>
                          )}

                          {/* Age and Season Info */}
                          {(cause.categoryDetails.ageGroup ||
                            cause.categoryDetails.season) && (
                            <Row
                              gutter={[16, 16]}
                              style={{ marginBottom: "20px" }}
                            >
                              {cause.categoryDetails.ageGroup && (
                                <Col span={12}>
                                  <div
                                    style={{
                                      textAlign: "center",
                                      padding: "12px",
                                      background: "rgba(245, 158, 11, 0.1)",
                                      borderRadius: "12px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        fontSize: "16px",
                                        fontWeight: "700",
                                        background:
                                          "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                        fontFamily:
                                          "Inter, system-ui, sans-serif",
                                      }}
                                    >
                                      {cause.categoryDetails.ageGroup
                                        .charAt(0)
                                        .toUpperCase() +
                                        cause.categoryDetails.ageGroup.slice(1)}
                                    </div>
                                    <div
                                      style={{
                                        fontSize: "11px",
                                        color: "#64748b",
                                        fontFamily:
                                          "Inter, system-ui, sans-serif",
                                      }}
                                    >
                                      Age Group
                                    </div>
                                  </div>
                                </Col>
                              )}
                              {cause.categoryDetails.season && (
                                <Col span={12}>
                                  <div
                                    style={{
                                      textAlign: "center",
                                      padding: "12px",
                                      background: "rgba(16, 185, 129, 0.1)",
                                      borderRadius: "12px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        fontSize: "16px",
                                        fontWeight: "700",
                                        background:
                                          "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                        fontFamily:
                                          "Inter, system-ui, sans-serif",
                                      }}
                                    >
                                      {cause.categoryDetails.season
                                        .charAt(0)
                                        .toUpperCase() +
                                        cause.categoryDetails.season
                                          .slice(1)
                                          .replace(/-/g, " ")}
                                    </div>
                                    <div
                                      style={{
                                        fontSize: "11px",
                                        color: "#64748b",
                                        fontFamily:
                                          "Inter, system-ui, sans-serif",
                                      }}
                                    >
                                      Season
                                    </div>
                                  </div>
                                </Col>
                              )}
                            </Row>
                          )}

                          {/* Special Features */}
                          {(cause.categoryDetails.isCleaned ||
                            cause.categoryDetails.deliveryAvailable) && (
                            <div
                              style={{
                                display: "flex",
                                gap: "8px",
                                flexWrap: "wrap",
                              }}
                            >
                              {cause.categoryDetails.isCleaned && (
                                <div
                                  style={{
                                    background: "rgba(34, 197, 94, 0.1)",
                                    border: "1px solid rgba(34, 197, 94, 0.3)",
                                    borderRadius: "12px",
                                    padding: "8px 12px",
                                    textAlign: "center",
                                  }}
                                >
                                  <FiCheckCircle
                                    style={{
                                      color: "#22c55e",
                                      marginRight: "6px",
                                    }}
                                  />
                                  <Text
                                    style={{
                                      fontSize: "12px",
                                      color: "#22c55e",
                                      fontWeight: "600",
                                      fontFamily:
                                        "Inter, system-ui, sans-serif",
                                    }}
                                  >
                                    Cleaned & Ready
                                  </Text>
                                </div>
                              )}
                              {cause.categoryDetails.deliveryAvailable && (
                                <div
                                  style={{
                                    background: "rgba(59, 130, 246, 0.1)",
                                    border: "1px solid rgba(59, 130, 246, 0.3)",
                                    borderRadius: "12px",
                                    padding: "8px 12px",
                                    textAlign: "center",
                                  }}
                                >
                                  <FiTruck
                                    style={{
                                      color: "#3b82f6",
                                      marginRight: "6px",
                                    }}
                                  />
                                  <Text
                                    style={{
                                      fontSize: "12px",
                                      color: "#3b82f6",
                                      fontWeight: "600",
                                      fontFamily:
                                        "Inter, system-ui, sans-serif",
                                    }}
                                  >
                                    Delivery Available{" "}
                                    {cause.categoryDetails.deliveryRadius &&
                                      `(${cause.categoryDetails.deliveryRadius}km)`}
                                  </Text>
                                </div>
                              )}
                            </div>
                          )}
                        </Card>
                      </motion.div>
                    )}
                </Space>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Comment Modal */}
        <Modal
          title={
            <span className="modal-title-gradient">Join the Discussion</span>
          }
          open={showCommentModal}
          onCancel={() => setShowCommentModal(false)}
          footer={null}
          width={500}
          styles={{
            content: {
              borderRadius: "20px",
              fontFamily: "Inter, system-ui, sans-serif",
            },
          }}
        >
          <Form
            form={commentForm}
            onFinish={handleComment}
            layout="vertical"
            className="comment-form"
          >
            <Form.Item
              name="comment"
              label={<span className="comment-label">Your Comment</span>}
              rules={[{ required: true, message: "Please enter your comment" }]}
            >
              <TextArea
                rows={4}
                placeholder="Share your thoughts about this initiative..."
                className="comment-input"
              />
            </Form.Item>
            <Form.Item className="comment-actions">
              <Space>
                <Button
                  onClick={() => setShowCommentModal(false)}
                  className="btn-ghost"
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="btn-gradient"
                >
                  Post Comment
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>

      {/* Removed inline global styles in favor of stylesheet */}
    </MainLayout>
  );
}
