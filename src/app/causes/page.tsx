"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Input,
  Select,
  Tag,
  Avatar,
  Typography,
  Space,
  Pagination,
  Empty,
  Spin,
  Progress,
  Tooltip,
  Badge,
} from "antd";
import {
  FiSearch,
  FiFilter,
  FiHeart,
  FiEye,
  FiMapPin,
  FiClock,
  FiUser,
  FiPlus,
  FiTrendingUp,
  FiTarget,
  FiUsers,
  FiChevronRight,
  FiGrid,
  FiArrowRight,
  FiStar,
  FiAward,
  FiCalendar,
  FiActivity,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchCauses,
  setFilters,
  setSelectedCategory,
  setSearchQuery,
  selectCauses,
  selectCausesLoading,
  selectPagination,
  selectFilters,
  selectSelectedCategory,
  selectSearchQuery,
  selectCausesError,
  Cause,
} from "@/store/slices/causesSlice";
import { imageConfig, categoryColors, animations } from "@/config/theme";
import { MainLayout } from "@/components/layout/MainLayout";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

// Premium animation variants
const premiumAnimations = {
  containerVariants: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },
  itemVariants: {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  },
  cardHover: {
    y: -8,
    scale: 1.02,
    boxShadow: "0 25px 50px rgba(102, 126, 234, 0.15)",
    transition: { duration: 0.3, ease: "easeOut" },
  },
  statsCounter: {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
      },
    },
  },
};

// Premium Statistics Section
const PremiumStatsSection = ({ causes }: { causes: Cause[] }) => {
  const [animatedStats, setAnimatedStats] = useState({
    totalCauses: 0,
    totalViews: 0,
    totalSupporters: 0,
    successRate: 0,
  });

  const finalStats = {
    totalCauses: causes.length,
    totalViews: causes.reduce((acc, cause) => acc + (cause.view_count || 0), 0),
    totalSupporters: causes.reduce(
      (acc, cause) => acc + (cause.like_count || 0),
      0,
    ),
    successRate: 94,
  };

  // Animate counters
  useEffect(() => {
    const duration = 2000;
    const interval = 50;
    const steps = duration / interval;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easing = 1 - Math.pow(1 - progress, 3); // Ease out cubic

      setAnimatedStats({
        totalCauses: Math.floor(finalStats.totalCauses * easing),
        totalViews: Math.floor(finalStats.totalViews * easing),
        totalSupporters: Math.floor(finalStats.totalSupporters * easing),
        successRate: Math.floor(finalStats.successRate * easing),
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedStats(finalStats);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [causes]);

  const stats = [
    {
      title: "Active Initiatives",
      value: animatedStats.totalCauses,
      icon: <FiTarget size={24} />,
      description: "Community initiatives available",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      bgColor: "rgba(102, 126, 234, 0.1)",
    },
    {
      title: "Total Engagement",
      value: animatedStats.totalViews,
      icon: <FiTrendingUp size={24} />,
      description: "Community views and interactions",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      bgColor: "rgba(240, 147, 251, 0.1)",
    },
    {
      title: "Community Support",
      value: animatedStats.totalSupporters,
      icon: <FiUsers size={24} />,
      description: "People actively participating",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      bgColor: "rgba(79, 172, 254, 0.1)",
    },
    {
      title: "Success Rate",
      value: `${animatedStats.successRate}%`,
      icon: <FiAward size={24} />,
      description: "Initiatives completed successfully",
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      bgColor: "rgba(67, 233, 123, 0.1)",
    },
  ];

  return (
    <section
      style={{
        background:
          "linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.02) 100%)",
        padding: "80px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decoration */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23667eea' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          opacity: 0.4,
        }}
      />

      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "0 40px",
          position: "relative",
        }}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={premiumAnimations.containerVariants}
        >
          <Row gutter={[32, 32]}>
            {stats.map((stat, index) => (
              <Col xs={12} sm={6} key={index}>
                <motion.div variants={premiumAnimations.itemVariants}>
                  <Card
                    style={{
                      background: "rgba(255, 255, 255, 0.9)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(102, 126, 234, 0.1)",
                      borderRadius: 20,
                      height: "100%",
                      textAlign: "center",
                      padding: "24px 20px",
                      position: "relative",
                      overflow: "hidden",
                      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                      cursor: "pointer",
                    }}
                    bodyStyle={{ padding: 0 }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-8px)";
                      e.currentTarget.style.boxShadow =
                        "0 25px 50px rgba(102, 126, 234, 0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 20px rgba(0, 0, 0, 0.08)";
                    }}
                  >
                    {/* Icon container */}
                    <motion.div
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: "50%",
                        background: stat.gradient,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 20px",
                        color: "white",
                        position: "relative",
                      }}
                      variants={premiumAnimations.statsCounter}
                    >
                      {stat.icon}
                      <div
                        style={{
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          borderRadius: "50%",
                          background: stat.bgColor,
                          top: 0,
                          left: 0,
                          zIndex: -1,
                          transform: "scale(2.5)",
                        }}
                      />
                    </motion.div>

                    {/* Value */}
                    <motion.div
                      style={{
                        fontSize: "32px",
                        fontWeight: 800,
                        background: stat.gradient,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        marginBottom: 8,
                        fontFamily: "var(--font-inter)",
                      }}
                    >
                      {stat.value}
                    </motion.div>

                    {/* Title */}
                    <Text
                      style={{
                        color: "#0f172a",
                        fontSize: 16,
                        fontWeight: 700,
                        display: "block",
                        marginBottom: 8,
                        fontFamily: "var(--font-inter)",
                      }}
                    >
                      {stat.title}
                    </Text>

                    {/* Description */}
                    <Text
                      style={{
                        color: "#64748b",
                        fontSize: 13,
                        fontFamily: "var(--font-inter)",
                        lineHeight: 1.4,
                      }}
                    >
                      {stat.description}
                    </Text>

                    {/* Shimmer effect */}
                    <motion.div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: "-100%",
                        width: "100%",
                        height: "100%",
                        background:
                          "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                        zIndex: 1,
                      }}
                      animate={{ left: ["100%", "-100%"] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>
      </div>
    </section>
  );
};

// Premium Cause Card
const PremiumCauseCard = ({
  cause,
  index,
}: {
  cause: Cause;
  index: number;
}) => {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(cause.like_count || 0);
  const [isHovered, setIsHovered] = useState(false);

  const categoryColor =
    categoryColors[cause.category_name as keyof typeof categoryColors] ||
    categoryColors.food;

  const handleCardClick = useCallback(() => {
    router.push(`/causes/${cause.id}`);
  }, [router, cause.id]);

  const handleLike = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsLiked(!isLiked);
      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    },
    [isLiked],
  );

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const renderCategoryInfo = () => {
    switch (cause.category_name) {
      case "food":
        return (
          <div style={{ marginTop: 12, marginBottom: 16 }}>
            <Space size={6} wrap>
              {cause.food_type && (
                <Tag
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%)",
                    color: "#667eea",
                    border: "1px solid rgba(102, 126, 234, 0.2)",
                    borderRadius: 12,
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "2px 8px",
                  }}
                >
                  {cause.food_type}
                </Tag>
              )}
              {cause.serving_size && (
                <Tag
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(67, 233, 123, 0.1) 0%, rgba(56, 249, 215, 0.05) 100%)",
                    color: "#43e97b",
                    border: "1px solid rgba(67, 233, 123, 0.2)",
                    borderRadius: 12,
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "2px 8px",
                  }}
                >
                  Serves {cause.serving_size}
                </Tag>
              )}
            </Space>
          </div>
        );

      case "clothes":
        return (
          <div style={{ marginTop: 12, marginBottom: 16 }}>
            <Space size={6} wrap>
              {cause.clothes_type && (
                <Tag
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(240, 147, 251, 0.1) 0%, rgba(245, 87, 108, 0.05) 100%)",
                    color: "#f093fb",
                    border: "1px solid rgba(240, 147, 251, 0.2)",
                    borderRadius: 12,
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "2px 8px",
                  }}
                >
                  {cause.clothes_type.replace("-", " ")}
                </Tag>
              )}
              {cause.gender && (
                <Tag
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(0, 242, 254, 0.05) 100%)",
                    color: "#4facfe",
                    border: "1px solid rgba(79, 172, 254, 0.2)",
                    borderRadius: 12,
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "2px 8px",
                  }}
                >
                  {cause.gender}
                </Tag>
              )}
            </Space>
          </div>
        );

      case "training":
        return (
          <div style={{ marginTop: 12, marginBottom: 16 }}>
            <Space size={6} wrap>
              {cause.training_type && (
                <Tag
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%)",
                    color: "#667eea",
                    border: "1px solid rgba(102, 126, 234, 0.2)",
                    borderRadius: 12,
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "2px 8px",
                  }}
                >
                  {cause.training_type}
                </Tag>
              )}
              {cause.duration_hours && (
                <Tag
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(67, 233, 123, 0.1) 0%, rgba(56, 249, 215, 0.05) 100%)",
                    color: "#43e97b",
                    border: "1px solid rgba(67, 233, 123, 0.2)",
                    borderRadius: 12,
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "2px 8px",
                  }}
                >
                  {cause.duration_hours}h
                </Tag>
              )}
            </Space>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      variants={premiumAnimations.itemVariants}
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{ height: "100%" }}
    >
      <motion.div
        variants={{
          hover: premiumAnimations.cardHover,
        }}
        style={{ height: "100%" }}
      >
        <Card
          hoverable
          onClick={handleCardClick}
          cover={
            <div
              style={{
                height: 240,
                background: cause.image
                  ? `url(${cause.image})`
                  : `linear-gradient(135deg, ${categoryColor.primary}40, ${categoryColor.primary}60), url(${imageConfig.getRandomImage(cause.category_name as any, { w: 400, h: 240 })})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Gradient overlay */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 100%)",
                }}
              />

              {/* Category badge */}
              <div
                style={{
                  position: "absolute",
                  top: 16,
                  left: 16,
                }}
              >
                <Tag
                  style={{
                    background: "rgba(255, 255, 255, 0.95)",
                    color: categoryColor.primary,
                    border: "none",
                    borderRadius: 12,
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "6px 12px",
                    fontFamily: "var(--font-inter)",
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {cause.category_display_name}
                </Tag>
              </div>

              {/* Type badge */}
              {cause.cause_type && (
                <div
                  style={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                  }}
                >
                  <Tag
                    style={{
                      background:
                        cause.cause_type === "offered"
                          ? "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
                          : "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                      color: "white",
                      border: "none",
                      borderRadius: 12,
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "4px 10px",
                      fontFamily: "var(--font-inter)",
                      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)",
                    }}
                  >
                    {cause.cause_type === "offered" ? "OFFERING" : "SEEKING"}
                  </Tag>
                </div>
              )}

              {/* Priority indicator */}
              {cause.priority !== "medium" && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 16,
                    right: 16,
                  }}
                >
                  <Badge
                    count={cause.priority.toUpperCase()}
                    style={{
                      backgroundColor:
                        cause.priority === "urgent"
                          ? "#ff4d4f"
                          : cause.priority === "high"
                            ? "#fa8c16"
                            : "#52c41a",
                      fontSize: 10,
                      fontWeight: 700,
                      borderRadius: 8,
                      padding: "0 8px",
                      height: 20,
                      lineHeight: "20px",
                    }}
                  />
                </div>
              )}

              {/* Hover overlay */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: "rgba(102, 126, 234, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      style={{
                        background: "rgba(255, 255, 255, 0.95)",
                        borderRadius: "50%",
                        width: 60,
                        height: 60,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backdropFilter: "blur(10px)",
                        boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
                      }}
                    >
                      <FiArrowRight size={24} style={{ color: "#667eea" }} />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          }
          style={{
            borderRadius: 20,
            overflow: "hidden",
            border: "1px solid rgba(102, 126, 234, 0.1)",
            height: "100%",
            cursor: "pointer",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          }}
          bodyStyle={{ padding: "24px" }}
        >
          {/* Title and Description */}
          <div style={{ marginBottom: 20 }}>
            <Title
              level={4}
              style={{
                marginBottom: 12,
                color: "#0f172a",
                fontSize: 18,
                fontWeight: 700,
                lineHeight: 1.3,
                height: "50px",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                fontFamily: "var(--font-inter)",
              }}
            >
              {cause.title}
            </Title>

            <Text
              style={{
                color: "#64748b",
                fontSize: 14,
                lineHeight: 1.5,
                height: "42px",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                fontFamily: "var(--font-inter)",
              }}
            >
              {cause.short_description || cause.description}
            </Text>

            {/* Category-specific information */}
            {renderCategoryInfo()}
          </div>

          {/* Location and Time */}
          <div style={{ marginBottom: 20 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Space size={8} align="center">
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FiMapPin style={{ color: "#667eea", fontSize: 14 }} />
                  </div>
                  <div>
                    <Text
                      style={{
                        color: "#0f172a",
                        fontSize: 13,
                        fontWeight: 600,
                        fontFamily: "var(--font-inter)",
                        display: "block",
                        lineHeight: 1.2,
                      }}
                    >
                      Location
                    </Text>
                    <Text
                      style={{
                        color: "#64748b",
                        fontSize: 11,
                        fontFamily: "var(--font-inter)",
                      }}
                    >
                      {cause.location}
                    </Text>
                  </div>
                </Space>
              </Col>
              <Col span={12}>
                <Space size={8} align="center">
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(0, 242, 254, 0.05) 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FiClock style={{ color: "#4facfe", fontSize: 14 }} />
                  </div>
                  <div>
                    <Text
                      style={{
                        color: "#0f172a",
                        fontSize: 13,
                        fontWeight: 600,
                        fontFamily: "var(--font-inter)",
                        display: "block",
                        lineHeight: 1.2,
                      }}
                    >
                      Posted
                    </Text>
                    <Text
                      style={{
                        color: "#64748b",
                        fontSize: 11,
                        fontFamily: "var(--font-inter)",
                      }}
                    >
                      {formatTimeAgo(cause.created_at)}
                    </Text>
                  </div>
                </Space>
              </Col>
            </Row>
          </div>

          {/* Footer with Creator and Actions */}
          <div
            style={{
              paddingTop: 20,
              borderTop: "1px solid rgba(102, 126, 234, 0.1)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Space size={12} align="center">
              <Avatar
                size={40}
                src={cause.creator_avatar}
                icon={<FiUser />}
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "2px solid rgba(102, 126, 234, 0.2)",
                }}
              />
              <div>
                <Text
                  style={{
                    color: "#0f172a",
                    fontSize: 14,
                    fontWeight: 700,
                    fontFamily: "var(--font-inter)",
                    display: "block",
                    lineHeight: 1.2,
                  }}
                >
                  {cause.creator_name || "Anonymous"}
                </Text>
                <Text
                  style={{
                    color: "#64748b",
                    fontSize: 12,
                    fontFamily: "var(--font-inter)",
                  }}
                >
                  Initiative Creator
                </Text>
              </div>
            </Space>

            <Space size={12}>
              <Tooltip title="Support this initiative">
                <Button
                  type="text"
                  size="small"
                  icon={<FiHeart fill={isLiked ? "currentColor" : "none"} />}
                  onClick={handleLike}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    color: isLiked ? "#f5576c" : "#64748b",
                    background: isLiked
                      ? "rgba(245, 87, 108, 0.1)"
                      : "rgba(102, 126, 234, 0.05)",
                    border: `1px solid ${isLiked ? "rgba(245, 87, 108, 0.2)" : "rgba(102, 126, 234, 0.1)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.3s ease",
                  }}
                >
                  <Text style={{ fontSize: 11, marginLeft: 4 }}>
                    {likeCount}
                  </Text>
                </Button>
              </Tooltip>

              <Tooltip title="View count">
                <Button
                  type="text"
                  size="small"
                  icon={<FiEye />}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    color: "#64748b",
                    background: "rgba(102, 126, 234, 0.05)",
                    border: "1px solid rgba(102, 126, 234, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 11, marginLeft: 4 }}>
                    {cause.view_count || 0}
                  </Text>
                </Button>
              </Tooltip>
            </Space>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

// Premium Filter Bar
const PremiumFilterBar = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters);
  const selectedCategory = useAppSelector(selectSelectedCategory);
  const searchQuery = useAppSelector(selectSearchQuery);

  const categories = [
    {
      key: "all",
      label: "All Categories",
      icon: <FiGrid size={16} />,
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      key: "food",
      label: "Food",
      icon: <FiHeart size={16} />,
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    },
    {
      key: "clothes",
      label: "Clothing",
      icon: <FiUser size={16} />,
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      key: "training",
      label: "Training",
      icon: <FiTarget size={16} />,
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
  ];

  const handleCategoryChange = (category: string) => {
    const newCategory = category === "all" ? null : category;
    dispatch(setSelectedCategory(newCategory));
  };

  const handleSearchChange = (value: string) => {
    dispatch(setSearchQuery(value));
  };

  const handleFilterChange = (key: string, value: any) => {
    dispatch(setFilters({ [key]: value }));
  };

  return (
    <motion.div
      style={{ marginBottom: 48 }}
      initial="hidden"
      animate="visible"
      variants={premiumAnimations.containerVariants}
    >
      {/* Category Filter */}
      <motion.div
        style={{ marginBottom: 24 }}
        variants={premiumAnimations.itemVariants}
      >
        <Space size={12} wrap>
          {categories.map((category) => {
            const isActive =
              selectedCategory === category.key ||
              (selectedCategory === null && category.key === "all");

            return (
              <motion.div
                key={category.key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  type={isActive ? "primary" : "default"}
                  onClick={() => handleCategoryChange(category.key)}
                  style={{
                    borderRadius: 16,
                    fontWeight: 600,
                    height: 44,
                    fontSize: 14,
                    padding: "0 20px",
                    background: isActive
                      ? category.gradient
                      : "rgba(255, 255, 255, 0.9)",
                    borderColor: isActive
                      ? "transparent"
                      : "rgba(102, 126, 234, 0.2)",
                    color: isActive ? "white" : "#0f172a",
                    fontFamily: "var(--font-inter)",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    backdropFilter: "blur(10px)",
                    boxShadow: isActive
                      ? "0 8px 25px rgba(102, 126, 234, 0.3)"
                      : "0 2px 8px rgba(0, 0, 0, 0.06)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                  icon={category.icon}
                >
                  {category.label}
                </Button>
              </motion.div>
            );
          })}
        </Space>
      </motion.div>

      {/* Search and Filters */}
      <motion.div variants={premiumAnimations.itemVariants}>
        <Card
          style={{
            borderRadius: 20,
            border: "1px solid rgba(102, 126, 234, 0.1)",
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 8px 32px rgba(102, 126, 234, 0.08)",
          }}
        >
          <Row gutter={[20, 20]} align="middle">
            <Col xs={24} sm={12} md={10}>
              <Input
                placeholder="Search initiatives..."
                prefix={
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FiSearch style={{ color: "white", fontSize: 12 }} />
                  </div>
                }
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                style={{
                  borderRadius: 12,
                  borderColor: "rgba(102, 126, 234, 0.2)",
                  fontFamily: "var(--font-inter)",
                  height: 44,
                  fontSize: 14,
                }}
              />
            </Col>

            <Col xs={12} sm={6} md={4}>
              <Select
                placeholder="Type"
                allowClear
                value={filters.cause_type}
                onChange={(value) => handleFilterChange("cause_type", value)}
                style={{ width: "100%", height: 44 }}
                dropdownStyle={{
                  borderRadius: 12,
                  boxShadow: "0 12px 32px rgba(0, 0, 0, 0.12)",
                }}
              >
                <Option value="wanted">Seeking Help</Option>
                <Option value="offered">Offering Help</Option>
              </Select>
            </Col>

            <Col xs={12} sm={6} md={4}>
              <Select
                placeholder="Priority"
                allowClear
                value={filters.priority}
                onChange={(value) => handleFilterChange("priority", value)}
                style={{ width: "100%", height: 44 }}
                dropdownStyle={{
                  borderRadius: 12,
                  boxShadow: "0 12px 32px rgba(0, 0, 0, 0.12)",
                }}
              >
                <Option value="urgent">Urgent</Option>
                <Option value="high">High</Option>
                <Option value="medium">Medium</Option>
                <Option value="low">Low</Option>
              </Select>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Input
                placeholder="Location"
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
                prefix={
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FiMapPin style={{ color: "white", fontSize: 12 }} />
                  </div>
                }
                style={{
                  borderRadius: 12,
                  borderColor: "rgba(102, 126, 234, 0.2)",
                  fontFamily: "var(--font-inter)",
                  height: 44,
                  fontSize: 14,
                }}
              />
            </Col>
          </Row>
        </Card>
      </motion.div>
    </motion.div>
  );
};

// Main Premium Causes Page Component
export default function PremiumCausesPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const causes = useAppSelector(selectCauses);
  const loading = useAppSelector(selectCausesLoading);
  const pagination = useAppSelector(selectPagination);
  const filters = useAppSelector(selectFilters);
  const error = useAppSelector(selectCausesError);

  // Initialize filters from URL params
  useEffect(() => {
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const type = searchParams.get("type");
    const location = searchParams.get("location");
    const page = searchParams.get("page");

    const urlFilters: any = {};

    if (category) {
      dispatch(setSelectedCategory(category));
      urlFilters.category = category;
    }

    if (search) {
      dispatch(setSearchQuery(search));
      urlFilters.search = search;
    }

    if (type) urlFilters.cause_type = type;
    if (location) urlFilters.location = location;
    if (page) urlFilters.page = parseInt(page);

    if (Object.keys(urlFilters).length > 0) {
      dispatch(setFilters(urlFilters));
    }
  }, [searchParams, dispatch]);

  // Initial fetch on mount
  useEffect(() => {
    if (Object.keys(filters).length === 0) {
      dispatch(fetchCauses({}));
    }
  }, [dispatch]);

  // Fetch causes when filters change
  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      dispatch(fetchCauses(filters));
    }
  }, [filters, dispatch]);

  const handlePageChange = (page: number) => {
    dispatch(setFilters({ ...filters, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <MainLayout>
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)",
        }}
      >
        {/* Premium Statistics Section */}
        <PremiumStatsSection causes={causes || []} />

        {/* Main Content */}
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "80px 40px" }}>
          <PremiumFilterBar />

          {error && (
            <motion.div
              style={{ marginBottom: 32, textAlign: "center" }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card
                style={{
                  borderRadius: 16,
                  background:
                    "linear-gradient(135deg, rgba(255, 77, 79, 0.05) 0%, rgba(245, 87, 108, 0.03) 100%)",
                  border: "1px solid rgba(255, 77, 79, 0.2)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: "#ff4d4f",
                    fontFamily: "var(--font-inter)",
                    fontWeight: 600,
                  }}
                >
                  Error loading initiatives: {error}
                </Text>
              </Card>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ textAlign: "center", padding: "100px 0" }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    margin: "0 auto 24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: "white",
                    }}
                  />
                </motion.div>
                <Text
                  style={{
                    color: "#64748b",
                    fontSize: 16,
                    fontFamily: "var(--font-inter)",
                    fontWeight: 600,
                  }}
                >
                  Loading community initiatives...
                </Text>
              </motion.div>
            ) : causes.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                style={{ textAlign: "center", padding: "100px 0" }}
              >
                <Empty
                  description={
                    <div>
                      <Text
                        style={{
                          fontSize: 20,
                          color: "#64748b",
                          display: "block",
                          marginBottom: 16,
                          fontFamily: "var(--font-inter)",
                          fontWeight: 600,
                        }}
                      >
                        No initiatives found
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          color: "#94a3b8",
                          fontFamily: "var(--font-inter)",
                          marginBottom: 32,
                          display: "block",
                        }}
                      >
                        Try adjusting your filters or create a new initiative
                      </Text>
                      <Link href="/causes/create">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            type="primary"
                            icon={<FiPlus />}
                            size="large"
                            style={{
                              background:
                                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                              borderColor: "transparent",
                              borderRadius: 16,
                              height: 48,
                              fontWeight: 700,
                              fontSize: 16,
                              fontFamily: "var(--font-inter)",
                              padding: "0 24px",
                              boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
                            }}
                          >
                            Create the First Initiative
                          </Button>
                        </motion.div>
                      </Link>
                    </div>
                  }
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              </motion.div>
            ) : (
              <motion.div
                key="causes"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={premiumAnimations.containerVariants}
              >
                <Row gutter={[32, 32]}>
                  {causes.map((cause, index) => (
                    <Col xs={24} sm={12} md={12} lg={8} xl={6} key={cause.id}>
                      <PremiumCauseCard cause={cause} index={index} />
                    </Col>
                  ))}
                </Row>

                {/* Premium Pagination */}
                {pagination && pagination.total_pages > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    style={{
                      textAlign: "center",
                      marginTop: 80,
                      paddingTop: 40,
                      borderTop: "1px solid rgba(102, 126, 234, 0.1)",
                    }}
                  >
                    <Pagination
                      current={pagination.page}
                      total={pagination.total}
                      pageSize={pagination.limit}
                      onChange={handlePageChange}
                      showSizeChanger={false}
                      showQuickJumper
                      showTotal={(total, range) =>
                        `${range[0]}-${range[1]} of ${total} initiatives`
                      }
                      style={{
                        fontSize: 16,
                        fontFamily: "var(--font-inter)",
                      }}
                    />
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MainLayout>
  );
}
