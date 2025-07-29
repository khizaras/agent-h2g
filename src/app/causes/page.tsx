"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Input,
  Select,
  Tag,
  Pagination,
  Spin,
  Empty,
  Switch,
  Space,
  message,
} from "antd";
import {
  FiHeart,
  FiMapPin,
  FiSearch,
  FiUser,
  FiPlus,
  FiRefreshCw,
  FiShare2,
} from "react-icons/fi";
import { motion } from "framer-motion";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchCauses,
  loadMoreCauses,
  setFilters,
  setSearchQuery,
  selectCausesList,
  selectCausesLoading,
  selectCausesLoadingMore,
  selectCausesError,
  selectCausesFilters,
  selectCausesPagination,
  selectCausesHasMore,
} from "@/store/slices/causesSlice";

const { Title, Paragraph, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

export default function CausesPage() {
  const dispatch = useAppDispatch();
  const causes = useAppSelector(selectCausesList) || [];
  const loading = useAppSelector(selectCausesLoading);
  const loadingMore = useAppSelector(selectCausesLoadingMore);
  const error = useAppSelector(selectCausesError);
  const filters = useAppSelector(selectCausesFilters);
  const pagination = useAppSelector(selectCausesPagination);
  const hasMore = useAppSelector(selectCausesHasMore);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedUrgency, setSelectedUrgency] = useState<string>("all");
  const [infiniteScrollEnabled, setInfiniteScrollEnabled] = useState(true);
  const loadingRef = useRef<HTMLDivElement>(null);

  const categories = [
    "food",
    "clothes",
    "education",
    "healthcare",
    "housing",
    "other",
  ];

  const urgencyLevels = ["low", "medium", "high", "critical"];

  // Fetch causes on component mount
  useEffect(() => {
    dispatch(fetchCauses(filters));
  }, [dispatch]);

  // Handle search and filter changes
  useEffect(() => {
    const newFilters = {
      ...filters,
      search: searchTerm || undefined,
      category: selectedCategory !== "all" ? selectedCategory : undefined,
      urgency: selectedUrgency !== "all" ? selectedUrgency : undefined,
      page: 1, // Reset to first page when filters change
    };

    dispatch(setFilters(newFilters));
    dispatch(fetchCauses(newFilters));
  }, [searchTerm, selectedCategory, selectedUrgency, dispatch]);

  const handlePageChange = (page: number) => {
    const newFilters = { ...filters, page };
    dispatch(setFilters(newFilters));
    dispatch(fetchCauses(newFilters));
  };

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore && infiniteScrollEnabled) {
      const nextPage = pagination.page + 1;
      const newFilters = {
        ...filters,
        page: nextPage,
        search: searchTerm || undefined,
        category: selectedCategory !== "all" ? selectedCategory : undefined,
        urgency: selectedUrgency !== "all" ? selectedUrgency : undefined,
      };
      dispatch(loadMoreCauses(newFilters));
    }
  }, [
    dispatch,
    loadingMore,
    hasMore,
    infiniteScrollEnabled,
    pagination.page,
    filters,
    searchTerm,
    selectedCategory,
    selectedUrgency,
  ]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!infiniteScrollEnabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loadingMore && !loading) {
          loadMore();
        }
      },
      {
        root: null,
        rootMargin: "100px",
        threshold: 0.1,
      },
    );

    const currentRef = loadingRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [loadMore, hasMore, loadingMore, loading, infiniteScrollEnabled]);

  const handleRefresh = () => {
    const refreshFilters = {
      ...filters,
      page: 1,
      search: searchTerm || undefined,
      category: selectedCategory !== "all" ? selectedCategory : undefined,
      urgency: selectedUrgency !== "all" ? selectedUrgency : undefined,
    };
    dispatch(setFilters(refreshFilters));
    dispatch(fetchCauses(refreshFilters));
  };

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case "critical":
        return "#f5222d";
      case "high":
        return "#fa8c16";
      case "medium":
        return "#faad14";
      case "low":
        return "#52c41a";
      default:
        return "#d9d9d9";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // New helper functions for compact cards
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "food":
        return "#ff6b6b";
      case "clothes":
        return "#4ecdc4";
      case "education":
        return "#45b7d1";
      case "healthcare":
        return "#f9ca24";
      case "housing":
        return "#6c5ce7";
      default:
        return "#a4b0be";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "food":
        return "🍽️";
      case "clothes":
        return "👕";
      case "education":
        return "📚";
      case "healthcare":
        return "🏥";
      case "housing":
        return "🏠";
      default:
        return "🤝";
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "food":
        return "Food";
      case "clothes":
        return "Clothes";
      case "education":
        return "Education";
      case "healthcare":
        return "Healthcare";
      case "housing":
        return "Housing";
      default:
        return "General";
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const getCategoryDetails = (category: string) => {
    switch (category) {
      case "food":
        return {
          info: "🍽️ Providing meals & nutrition",
          detail: "Food assistance program",
        };
      case "clothes":
        return {
          info: "👕 Clothing & essentials",
          detail: "Clothing donation drive",
        };
      case "education":
        return {
          info: "📚 Learning & development",
          detail: "Educational support",
        };
      case "healthcare":
        return {
          info: "🏥 Health & medical care",
          detail: "Healthcare assistance",
        };
      case "housing":
        return {
          info: "🏠 Shelter & housing",
          detail: "Housing support program",
        };
      default:
        return {
          info: "🤝 Community support",
          detail: "General assistance",
        };
    }
  };

  const getTimeAgo = (dateString: string) => {
    if (!dateString) return "Recent";

    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getCategoryActionText = (category: string) => {
    switch (category) {
      case "food":
        return "🍽️ Support Food";
      case "clothes":
        return "👕 Donate Clothes";
      case "education":
        return "📚 Support Learning";
      case "healthcare":
        return "🏥 Support Health";
      case "housing":
        return "🏠 Support Housing";
      default:
        return "🤝 Support Cause";
    }
  };

  return (
    <MainLayout>
      <div className="modern-causes-page">
        {/* Hero Section */}
        <section className="modern-causes-hero">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="hero-content"
            >
              <Title level={1} className="hero-title">
                Discover Causes That Matter
              </Title>
              <Paragraph className="hero-subtitle">
                Browse meaningful initiatives in your community and join
                thousands making a real difference.
              </Paragraph>
              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-number">{pagination.total || 0}</span>
                  <span className="stat-label">Active Causes</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{causes.length || 0}</span>
                  <span className="stat-label">Loaded</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">25K+</span>
                  <span className="stat-label">Lives Impacted</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Filters */}
        <section className="modern-filters-section">
          <div className="container">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={10}>
                <Input.Search
                  placeholder="Search causes..."
                  size="large"
                  prefix={<FiSearch />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="modern-search"
                />
              </Col>
              <Col xs={12} md={5}>
                <Select
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  size="large"
                  style={{ width: "100%" }}
                  placeholder="Category"
                  className="modern-select"
                >
                  <Option value="all">All Categories</Option>
                  {categories.map((category) => (
                    <Option key={category} value={category}>
                      {category}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col xs={12} md={5}>
                <Select
                  value={selectedUrgency}
                  onChange={setSelectedUrgency}
                  size="large"
                  style={{ width: "100%" }}
                  placeholder="Urgency"
                  className="modern-select"
                >
                  <Option value="all">All Urgency</Option>
                  {urgencyLevels.map((level) => (
                    <Option key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} md={4}>
                <Space
                  direction="vertical"
                  size="small"
                  style={{ width: "100%" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Switch
                      checked={infiniteScrollEnabled}
                      onChange={setInfiniteScrollEnabled}
                      size="small"
                    />
                    <Text style={{ fontSize: "12px" }}>Infinite Scroll</Text>
                  </div>
                  <Button
                    icon={<FiRefreshCw />}
                    onClick={handleRefresh}
                    size="small"
                    style={{ width: "100%" }}
                  >
                    Refresh
                  </Button>
                </Space>
              </Col>
            </Row>
          </div>
        </section>

        {/* Causes Grid */}
        <section className="modern-causes-grid-section">
          <div className="container">
            {loading ? (
              <div className="text-center py-12">
                <Spin size="large" />
                <p className="mt-4">Loading causes...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <Title level={4} type="danger">
                  Error loading causes
                </Title>
                <p>{error}</p>
                <Button onClick={() => dispatch(fetchCauses(filters))}>
                  Try Again
                </Button>
              </div>
            ) : !Array.isArray(causes) || causes.length === 0 ? (
              <Empty
                description="No causes found"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                <Link href="/causes/create">
                  <Button type="primary" icon={<FiPlus />}>
                    Create First Cause
                  </Button>
                </Link>
              </Empty>
            ) : (
              <div className="causes-grid-container">
                <Row gutter={[16, 16]}>
                  {Array.isArray(causes) &&
                    causes.map((cause, index) => (
                      <Col xs={24} sm={12} md={8} lg={6} xl={6} key={cause.id}>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.05 }}
                          whileHover={{ y: -4, scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          style={{ height: "100%" }}
                        >
                          <Card
                            className="compact-cause-card"
                            hoverable
                            style={{
                              height: "100%",
                              borderRadius: "12px",
                              overflow: "hidden",
                              border: "1px solid #f0f0f0",
                              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                              transition: "all 0.2s ease",
                              cursor: "pointer",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.boxShadow =
                                "0 8px 24px rgba(0,0,0,0.15)";
                              e.currentTarget.style.transform =
                                "translateY(-2px)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.boxShadow =
                                "0 1px 3px rgba(0,0,0,0.1)";
                              e.currentTarget.style.transform = "translateY(0)";
                            }}
                            cover={
                              <div
                                style={{
                                  position: "relative",
                                  height: "180px",
                                  overflow: "hidden",
                                }}
                              >
                                <motion.img
                                  src={cause.image || "/placeholder-cause.jpg"}
                                  alt={cause.title}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    transition: "transform 0.3s ease",
                                  }}
                                  whileHover={{ scale: 1.05 }}
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "/placeholder-cause.jpg";
                                  }}
                                />

                                {/* Quick action buttons */}
                                <div
                                  style={{
                                    position: "absolute",
                                    top: "8px",
                                    right: "8px",
                                    display: "flex",
                                    gap: "4px",
                                  }}
                                >
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    style={{
                                      background: "rgba(255,255,255,0.9)",
                                      border: "none",
                                      borderRadius: "50%",
                                      width: "28px",
                                      height: "28px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      cursor: "pointer",
                                      color: "#ff4757",
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      message.success("Added to favorites!");
                                    }}
                                  >
                                    <FiHeart size={12} />
                                  </motion.button>
                                </div>

                                {/* Category badge */}
                                <div
                                  style={{
                                    position: "absolute",
                                    top: "8px",
                                    left: "8px",
                                  }}
                                >
                                  <Tag
                                    style={{
                                      backgroundColor: getCategoryColor(
                                        cause.category_name,
                                      ),
                                      color: "white",
                                      border: "none",
                                      borderRadius: "12px",
                                      padding: "2px 8px",
                                      fontSize: "10px",
                                      fontWeight: "600",
                                      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                                    }}
                                  >
                                    {getCategoryIcon(cause.category_name)}{" "}
                                    {getCategoryLabel(cause.category_name)}
                                  </Tag>
                                </div>

                                {/* Priority indicator */}
                                <div
                                  style={{
                                    position: "absolute",
                                    bottom: "8px",
                                    right: "8px",
                                  }}
                                >
                                  <div
                                    style={{
                                      width: "8px",
                                      height: "8px",
                                      borderRadius: "50%",
                                      backgroundColor: getUrgencyColor(
                                        cause.priority || "medium",
                                      ),
                                      boxShadow: "0 0 8px rgba(0,0,0,0.3)",
                                    }}
                                  />
                                </div>
                              </div>
                            }
                          >
                            <div style={{ padding: "12px" }}>
                              {/* Title */}
                              <Title
                                level={5}
                                style={{
                                  margin: "0 0 6px 0",
                                  fontSize: "14px",
                                  fontWeight: "600",
                                  color: "#1f2937",
                                  lineHeight: "1.4",
                                  display: "-webkit-box",
                                  WebkitBoxOrient: "vertical",
                                  WebkitLineClamp: 2,
                                  overflow: "hidden",
                                  minHeight: "36px",
                                }}
                              >
                                {cause.title}
                              </Title>

                              {/* Description (2 lines max) */}
                              <div
                                style={{
                                  fontSize: "12px",
                                  color: "#6b7280",
                                  lineHeight: "1.4",
                                  marginBottom: "8px",
                                  display: "-webkit-box",
                                  WebkitBoxOrient: "vertical",
                                  WebkitLineClamp: 2,
                                  overflow: "hidden",
                                  minHeight: "32px",
                                }}
                              >
                                {cause.description ||
                                  "Help make a difference in the community..."}
                              </div>

                              {/* Category-specific information */}
                              <div
                                style={{
                                  backgroundColor: "#f8fafc",
                                  border: "1px solid #e2e8f0",
                                  borderRadius: "6px",
                                  padding: "6px 8px",
                                  marginBottom: "8px",
                                  fontSize: "11px",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    color: "#374151",
                                  }}
                                >
                                  <span style={{ fontWeight: "600" }}>
                                    {
                                      getCategoryDetails(cause.category_name)
                                        .info
                                    }
                                  </span>
                                  <span
                                    style={{
                                      fontSize: "10px",
                                      color: getUrgencyColor(
                                        cause.priority || "medium",
                                      ),
                                      fontWeight: "700",
                                      textTransform: "uppercase",
                                    }}
                                  >
                                    {cause.priority || "medium"}
                                  </span>
                                </div>
                              </div>

                              {/* Location and author */}
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  marginBottom: "8px",
                                  fontSize: "12px",
                                  color: "#6b7280",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                  }}
                                >
                                  <FiMapPin size={10} />
                                  <span>
                                    {cause.location?.slice(0, 15) ||
                                      "Location TBD"}
                                    {cause.location?.length > 15 ? "..." : ""}
                                  </span>
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                  }}
                                >
                                  <FiUser size={10} />
                                  <span>
                                    {cause.user_name?.slice(0, 10) ||
                                      "Anonymous"}
                                    {cause.user_name?.length > 10 ? "..." : ""}
                                  </span>
                                </div>
                              </div>

                              {/* Engagement metrics */}
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  marginBottom: "10px",
                                  padding: "6px 8px",
                                  backgroundColor: "#f8fafc",
                                  borderRadius: "6px",
                                  fontSize: "11px",
                                  color: "#64748b",
                                  border: "1px solid #e2e8f0",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "2px",
                                  }}
                                >
                                  <span style={{ color: "#3b82f6" }}>👁</span>
                                  <span>
                                    {formatNumber(
                                      (cause as any).view_count || 0,
                                    )}
                                  </span>
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "2px",
                                  }}
                                >
                                  <span style={{ color: "#ef4444" }}>❤️</span>
                                  <span>
                                    {formatNumber(
                                      (cause as any).like_count || 0,
                                    )}
                                  </span>
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "2px",
                                  }}
                                >
                                  <span style={{ color: "#10b981" }}>💬</span>
                                  <span>
                                    {formatNumber(
                                      (cause as any).comment_count || 0,
                                    )}
                                  </span>
                                </div>
                                <div
                                  style={{
                                    fontSize: "10px",
                                    color: "#6b7280",
                                    fontStyle: "italic",
                                  }}
                                >
                                  {getTimeAgo(cause.created_at)}
                                </div>
                              </div>

                              {/* Action button */}
                              <Link href={`/causes/${cause.id}`}>
                                <Button
                                  type="primary"
                                  block
                                  size="small"
                                  style={{
                                    background: `linear-gradient(135deg, ${getCategoryColor(cause.category_name)} 0%, ${getCategoryColor(cause.category_name)}dd 100%)`,
                                    border: "none",
                                    borderRadius: "6px",
                                    height: "32px",
                                    fontWeight: "600",
                                    fontSize: "12px",
                                    boxShadow: `0 2px 6px ${getCategoryColor(cause.category_name)}40`,
                                  }}
                                >
                                  {getCategoryActionText(cause.category_name)}
                                </Button>
                              </Link>
                            </div>
                          </Card>
                        </motion.div>
                      </Col>
                    ))}
                </Row>
              </div>
            )}

            {/* Load More & Pagination */}
            {!loading && causes.length > 0 && (
              <>
                {/* Infinite Scroll Loading Trigger */}
                {infiniteScrollEnabled && (
                  <div
                    ref={loadingRef}
                    style={{ padding: "20px", textAlign: "center" }}
                  >
                    {loadingMore && (
                      <div style={{ marginBottom: "16px" }}>
                        <Spin size="large" />
                        <p style={{ marginTop: "12px", color: "#666" }}>
                          Loading more causes...
                        </p>
                      </div>
                    )}
                    {!hasMore && causes.length > 0 && (
                      <div
                        style={{
                          padding: "40px 20px",
                          textAlign: "center",
                          color: "#999",
                        }}
                      >
                        <p>
                          🎉 You've reached the end! No more causes to load.
                        </p>
                        <Button onClick={handleRefresh} type="link">
                          Go back to top
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* Load More Button (fallback for infinite scroll) */}
                {infiniteScrollEnabled && hasMore && !loadingMore && (
                  <div style={{ textAlign: "center", marginTop: "24px" }}>
                    <Button
                      type="primary"
                      size="large"
                      onClick={loadMore}
                      loading={loadingMore}
                      style={{ minWidth: "200px" }}
                    >
                      Load More Causes
                    </Button>
                  </div>
                )}

                {/* Traditional Pagination */}
                {!infiniteScrollEnabled && pagination.totalPages > 1 && (
                  <div
                    className="pagination-container"
                    style={{ marginTop: "32px", textAlign: "center" }}
                  >
                    <Pagination
                      current={pagination.page}
                      total={pagination.total}
                      pageSize={pagination.limit}
                      onChange={handlePageChange}
                      showSizeChanger={false}
                      showTotal={(total, range) =>
                        `${range[0]}-${range[1]} of ${total} causes`
                      }
                      showQuickJumper
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="modern-cta-section">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="cta-content"
            >
              <Title level={2} className="cta-title">
                Start Your Own Cause
              </Title>
              <Paragraph className="cta-description">
                Can't find what you're looking for? Create your own cause and
                start building support for what matters to your community.
              </Paragraph>
              <Link href="/causes/create">
                <Button
                  type="primary"
                  size="large"
                  className="modern-btn-primary"
                >
                  <FiPlus style={{ marginRight: 8 }} />
                  Create a Cause
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
