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
  Avatar,
} from "antd";
import {
  FiHeart,
  FiMapPin,
  FiSearch,
  FiUser,
  FiPlus,
  FiRefreshCw,
  FiShare2,
  FiFilter,
  FiGrid,
  FiList,
  FiTrendingUp,
  FiClock,
  FiTarget,
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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const loadingRef = useRef<HTMLDivElement>(null);

  const categories = [
    { value: "food", label: "Food & Nutrition", color: "#52c41a" },
    { value: "clothes", label: "Clothing", color: "#1890ff" },
    { value: "education", label: "Education", color: "#722ed1" },
    { value: "healthcare", label: "Healthcare", color: "#fa541c" },
    { value: "housing", label: "Housing", color: "#13c2c2" },
    { value: "other", label: "Other", color: "#eb2f96" },
  ];

  const urgencyLevels = [
    { value: "low", label: "Low Priority", color: "#52c41a" },
    { value: "medium", label: "Medium Priority", color: "#faad14" },
    { value: "high", label: "High Priority", color: "#fa541c" },
    { value: "critical", label: "Critical", color: "#f5222d" },
  ];

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

  const handleRefresh = useCallback(() => {
    const refreshFilters = {
      ...filters,
      page: 1,
      search: searchTerm || undefined,
      category: selectedCategory !== "all" ? selectedCategory : undefined,
      urgency: selectedUrgency !== "all" ? selectedUrgency : undefined,
    };
    dispatch(setFilters(refreshFilters));
    dispatch(fetchCauses(refreshFilters));
  }, [dispatch, filters, searchTerm, selectedCategory, selectedUrgency]);

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
      <div className="page-container">
        {/* Hero Section */}
        <section
          className="section-wrapper-hero"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <img
            className="hero-background"
            src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Community causes"
          />
          <div className="hero-overlay" />
          <div className="container-standard">
            <div className="card-content-hero">
              <motion.h1
                className="hero-title"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Discover <span className="hero-title-accent">Causes</span> That
                Matter
              </motion.h1>
              <motion.p
                className="hero-subtitle"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Join thousands of changemakers supporting meaningful causes in
                communities worldwide. Every contribution creates real impact.
              </motion.p>
              <motion.div
                className="hero-actions-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="hero-actions">
                  <Link href="/causes/create">
                    <Button className="btn-hero-primary">
                      <FiPlus style={{ marginRight: "8px" }} />
                      Create a Cause
                    </Button>
                  </Link>
                  <Button
                    className="btn-hero-secondary"
                    icon={viewMode === "grid" ? <FiList /> : <FiGrid />}
                    onClick={() =>
                      setViewMode(viewMode === "grid" ? "list" : "grid")
                    }
                  >
                    {viewMode === "grid" ? "List View" : "Grid View"}
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section
          className="section-wrapper"
          style={{ background: "var(--bg-secondary)" }}
        >
          <div className="container-standard">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="grid-4 mb-lg">
                <div>
                  <Text strong className="mb-xs block">
                    Search Causes
                  </Text>
                  <Search
                    placeholder="Search by title, description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    size="large"
                    prefix={<FiSearch />}
                    className="search-modern"
                  />
                </div>
                <div>
                  <Text strong className="mb-xs block">
                    Category
                  </Text>
                  <Select
                    value={selectedCategory}
                    onChange={setSelectedCategory}
                    size="large"
                    style={{ width: "100%" }}
                    placeholder="Category"
                    className="select-modern"
                  >
                    <Option value="all">All Categories</Option>
                    {categories.map((category) => (
                      <Option key={category.value} value={category.value}>
                        {category.label}
                      </Option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Text strong className="mb-xs block">
                    Priority Level
                  </Text>
                  <Select
                    value={selectedUrgency}
                    onChange={setSelectedUrgency}
                    size="large"
                    style={{ width: "100%" }}
                    placeholder="Urgency"
                    className="select-modern"
                  >
                    <Option value="all">All Priorities</Option>
                    {urgencyLevels.map((level) => (
                      <Option key={level.value} value={level.value}>
                        {level.label}
                      </Option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Text strong className="mb-xs block">
                    Options
                  </Text>
                  <div className="flex-between">
                    <div className="flex-center">
                      <Switch
                        checked={infiniteScrollEnabled}
                        onChange={setInfiniteScrollEnabled}
                        size="small"
                      />
                      <Text className="ml-xs">Auto-load</Text>
                    </div>
                    <Button
                      icon={<FiRefreshCw />}
                      onClick={handleRefresh}
                      className="btn-secondary"
                    >
                      Refresh
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Causes Grid Section */}
        <section className="section-wrapper">
          <div className="container-standard">
            {loading ? (
              <div className="text-center p-xl">
                <Spin size="large" />
                <p className="mt-md text-muted">Loading causes...</p>
              </div>
            ) : error ? (
              <div className="text-center p-xl">
                <h3 className="text-danger mb-md">Error loading causes</h3>
                <p className="mb-lg">{error}</p>
                <Button
                  className="btn-primary"
                  onClick={() => dispatch(fetchCauses(filters))}
                >
                  Try Again
                </Button>
              </div>
            ) : !Array.isArray(causes) || causes.length === 0 ? (
              <div className="text-center p-xl">
                <Empty
                  description="No causes found matching your criteria"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                >
                  <Link href="/causes/create">
                    <Button className="btn-primary" icon={<FiPlus />}>
                      Create First Cause
                    </Button>
                  </Link>
                </Empty>
              </div>
            ) : (
              <div className={viewMode === "grid" ? "grid-2" : "grid-1"}>
                {causes.map((cause, index) => (
                  <motion.div
                    key={cause.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -8, scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Card className="card-professional">
                      <div className="card-image-large">
                        <img
                          src={
                            cause.image ||
                            "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=350&fit=crop"
                          }
                          alt={cause.title}
                          style={{
                            width: "100%",
                            height: "280px",
                            objectFit: "cover",
                            borderRadius: "12px 12px 0 0",
                          }}
                        />
                        <div className="card-badges-large">
                          <Tag
                            color="green"
                            style={{
                              fontSize: "14px",
                              padding: "6px 12px",
                              borderRadius: "20px",
                              fontWeight: "600",
                            }}
                          >
                            {String(cause.category?.name || cause.category)}
                          </Tag>
                          {(cause as any).urgency && (
                            <Tag
                              color={
                                (cause as any).urgency === "critical"
                                  ? "red"
                                  : (cause as any).urgency === "high"
                                    ? "orange"
                                    : (cause as any).urgency === "medium"
                                      ? "yellow"
                                      : "green"
                              }
                              style={{
                                fontSize: "12px",
                                padding: "4px 10px",
                                borderRadius: "16px",
                                fontWeight: "700",
                                textTransform: "uppercase",
                              }}
                            >
                              {String((cause as any).urgency)}
                            </Tag>
                          )}
                        </div>
                      </div>
                      <div
                        className="card-content-large"
                        style={{ padding: "24px" }}
                      >
                        <h2
                          className="card-title-large"
                          style={{
                            fontSize: "24px",
                            fontWeight: "700",
                            marginBottom: "12px",
                            lineHeight: "1.3",
                            color: "var(--text-primary)",
                          }}
                        >
                          {cause.title}
                        </h2>
                        <p
                          className="card-description-large"
                          style={{
                            fontSize: "16px",
                            lineHeight: "1.6",
                            marginBottom: "24px",
                            color: "var(--text-secondary)",
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {cause.description}
                        </p>

                        <div
                          className="cause-meta-large"
                          style={{ marginBottom: "20px" }}
                        >
                          <div
                            className="flex-between"
                            style={{ marginBottom: "12px" }}
                          >
                            <div className="flex-center">
                              <FiUser
                                style={{
                                  marginRight: "8px",
                                  color: "var(--text-muted)",
                                  fontSize: "16px",
                                }}
                              />
                              <Text
                                style={{
                                  fontSize: "15px",
                                  fontWeight: "500",
                                  color: "var(--text-secondary)",
                                }}
                              >
                                {(cause as any).creator?.name || "Anonymous"}
                              </Text>
                            </div>
                            <div className="flex-center">
                              <FiClock
                                style={{
                                  marginRight: "8px",
                                  color: "var(--text-muted)",
                                  fontSize: "16px",
                                }}
                              />
                              <Text
                                style={{
                                  fontSize: "15px",
                                  color: "var(--text-muted)",
                                }}
                              >
                                {getTimeAgo(cause.createdAt)}
                              </Text>
                            </div>
                          </div>

                          {(cause as any).location && (
                            <div
                              className="flex-center"
                              style={{ marginBottom: "8px" }}
                            >
                              <FiMapPin
                                style={{
                                  marginRight: "8px",
                                  color: "var(--text-muted)",
                                  fontSize: "16px",
                                }}
                              />
                              <Text
                                style={{
                                  fontSize: "15px",
                                  color: "var(--text-muted)",
                                }}
                              >
                                {(cause as any).location}
                              </Text>
                            </div>
                          )}
                        </div>

                        {(cause as any).raised !== undefined &&
                          (cause as any).goal !== undefined && (
                            <div
                              className="funding-section"
                              style={{ marginBottom: "24px" }}
                            >
                              <div
                                className="flex-between"
                                style={{ marginBottom: "12px" }}
                              >
                                <Text
                                  strong
                                  style={{
                                    fontSize: "20px",
                                    fontWeight: "700",
                                    color: "var(--brand-primary)",
                                  }}
                                >
                                  $
                                  {(
                                    (cause as any).raised || 0
                                  ).toLocaleString()}
                                </Text>
                                <Text
                                  style={{
                                    fontSize: "16px",
                                    color: "var(--text-secondary)",
                                  }}
                                >
                                  of $
                                  {((cause as any).goal || 0).toLocaleString()}
                                </Text>
                              </div>
                              <div
                                className="progress-bar-large"
                                style={{
                                  background: "#f0f0f0",
                                  height: "12px",
                                  borderRadius: "6px",
                                  overflow: "hidden",
                                }}
                              >
                                <div
                                  className="progress-fill-large"
                                  style={{
                                    background:
                                      "linear-gradient(90deg, var(--brand-primary), var(--brand-secondary))",
                                    height: "100%",
                                    borderRadius: "6px",
                                    width: `${Math.min(((cause as any).raised / (cause as any).goal) * 100 || 0, 100)}%`,
                                    transition: "width 0.3s ease",
                                  }}
                                />
                              </div>
                              <div
                                className="flex-between"
                                style={{ marginTop: "8px" }}
                              >
                                <Text
                                  style={{
                                    fontSize: "14px",
                                    color: "var(--text-muted)",
                                  }}
                                >
                                  {Math.round(
                                    ((cause as any).raised /
                                      (cause as any).goal) *
                                      100 || 0,
                                  )}
                                  % funded
                                </Text>
                                <Text
                                  style={{
                                    fontSize: "14px",
                                    color: "var(--text-muted)",
                                  }}
                                >
                                  {(cause as any).supporters || 0} supporters
                                </Text>
                              </div>
                            </div>
                          )}

                        <div className="card-actions-large">
                          <Link href={`/causes/${cause.id}`}>
                            <Button
                              className="btn-primary-xl"
                              block
                              style={{
                                height: "56px",
                                fontSize: "16px",
                                fontWeight: "600",
                                borderRadius: "12px",
                              }}
                            >
                              <FiHeart
                                style={{
                                  marginRight: "12px",
                                  fontSize: "18px",
                                }}
                              />
                              Support This Cause
                            </Button>
                          </Link>
                          <div
                            className="flex-between"
                            style={{ marginTop: "12px" }}
                          >
                            <Button
                              icon={<FiShare2 />}
                              style={{
                                fontSize: "14px",
                                border: "none",
                                background: "transparent",
                                color: "var(--text-muted)",
                              }}
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  `${window.location.origin}/causes/${cause.id}`,
                                );
                                message.success("Link copied!");
                              }}
                            >
                              Share
                            </Button>
                            <Button
                              icon={<FiTarget />}
                              style={{
                                fontSize: "14px",
                                border: "none",
                                background: "transparent",
                                color: "var(--text-muted)",
                              }}
                            >
                              Learn More
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Load More / Pagination */}
            {!infiniteScrollEnabled && pagination.total > causes.length && (
              <div className="text-center mt-xl">
                <Button
                  className="btn-secondary-large"
                  onClick={loadMore}
                  loading={loadingMore}
                  icon={<FiTrendingUp />}
                >
                  Load More Causes
                </Button>
              </div>
            )}

            {/* Infinite Scroll Trigger */}
            {infiniteScrollEnabled && hasMore && (
              <div ref={loadingRef} className="text-center p-lg">
                {loadingMore && <Spin size="large" />}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container-standard">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="cta-title">Can't Find What You're Looking For?</h2>
              <p className="cta-description">
                Create your own cause and rally your community around issues
                that matter to you. Making a difference starts with taking the
                first step.
              </p>
              <div className="cta-actions">
                <Link href="/causes/create">
                  <Button className="cta-btn-primary">
                    <FiPlus style={{ marginRight: "8px" }} />
                    Start a New Cause
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button className="cta-btn-secondary">
                    <FiHeart style={{ marginRight: "8px" }} />
                    Get Help
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </MainLayout>
  );

  // Helper functions
  function getTimeAgo(dateString: string) {
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
  }
}
