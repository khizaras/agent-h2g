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
import { FiHeart, FiMapPin, FiSearch, FiUser, FiPlus, FiRefreshCw, FiShare2 } from "react-icons/fi";
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
  selectCausesHasMore
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
  }, [dispatch, loadingMore, hasMore, infiniteScrollEnabled, pagination.page, filters, searchTerm, selectedCategory, selectedUrgency]);

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
        rootMargin: '100px',
        threshold: 0.1,
      }
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
                <Space direction="vertical" size="small" style={{ width: "100%" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
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
                <Title level={4} type="danger">Error loading causes</Title>
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
              <Row gutter={[24, 24]}>
                {Array.isArray(causes) && causes.map((cause, index) => (
                  <Col xs={24} sm={12} lg={8} key={cause.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ y: -8 }}
                      whileTap={{ scale: 0.98 }}
                      style={{ height: "100%" }}
                    >
                      <Card 
                        className="modern-cause-card" 
                        hoverable
                        style={{
                          height: "100%",
                          borderRadius: "16px",
                          overflow: "hidden",
                          border: "1px solid #e8e8e8",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          cursor: "pointer",
                          position: "relative"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.12)";
                          e.currentTarget.style.transform = "translateY(-4px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
                          e.currentTarget.style.transform = "translateY(0)";
                        }}
                      >
                        <div 
                          className="cause-image"
                          style={{
                            position: "relative",
                            overflow: "hidden",
                            borderRadius: "12px 12px 0 0",
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                          }}
                        >
                          <motion.img 
                            src={cause.image || '/placeholder-cause.jpg'} 
                            alt={cause.title}
                            style={{ 
                              width: '100%', 
                              height: '220px', 
                              objectFit: 'cover',
                              transition: 'transform 0.4s ease'
                            }}
                            whileHover={{ scale: 1.05 }}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder-cause.jpg';
                            }}
                          />
                          
                          {/* Gradient overlay */}
                          <div style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)",
                            pointerEvents: "none"
                          }} />
                          
                          {/* Interactive badges */}
                          <div style={{
                            position: "absolute",
                            top: "12px",
                            left: "12px",
                            right: "12px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            zIndex: 2
                          }}>
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.3 }}
                            >
                              <Tag
                                style={{
                                  backgroundColor: "rgba(255,255,255,0.9)",
                                  color: "#1890ff",
                                  border: "none",
                                  borderRadius: "20px",
                                  padding: "2px 12px",
                                  fontSize: "11px",
                                  fontWeight: "600",
                                  backdropFilter: "blur(10px)"
                                }}
                              >
                                {cause.category_name || 'General'}
                              </Tag>
                            </motion.div>
                            
                            <motion.div
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.4 }}
                            >
                              <Tag
                                style={{
                                  backgroundColor: getUrgencyColor(cause.priority || 'medium'),
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: "20px",
                                  padding: "2px 12px",
                                  fontSize: "11px",
                                  fontWeight: "700",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.5px",
                                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
                                }}
                              >
                                {cause.priority || 'medium'}
                              </Tag>
                            </motion.div>
                          </div>
                          
                          {/* Interactive action buttons overlay */}
                          <motion.div
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                            style={{
                              position: "absolute",
                              bottom: "12px",
                              right: "12px",
                              display: "flex",
                              gap: "8px",
                              zIndex: 2
                            }}
                          >
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              style={{
                                background: "rgba(255,255,255,0.9)",
                                border: "none",
                                borderRadius: "50%",
                                width: "36px",
                                height: "36px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                backdropFilter: "blur(10px)",
                                color: "#ff4757"
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                message.success("Added to favorites!");
                              }}
                            >
                              <FiHeart size={16} />
                            </motion.button>
                            
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              style={{
                                background: "rgba(255,255,255,0.9)",
                                border: "none",
                                borderRadius: "50%",
                                width: "36px",
                                height: "36px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                backdropFilter: "blur(10px)",
                                color: "#3742fa"
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                navigator.share?.({ 
                                  title: cause.title, 
                                  url: window.location.origin + `/causes/${cause.id}` 
                                }) || message.info("Link copied to clipboard!");
                              }}
                            >
                              <FiShare2 size={16} />
                            </motion.button>
                          </motion.div>
                        </div>

                        <div 
                          className="cause-content"
                          style={{
                            padding: "20px",
                            display: "flex",
                            flexDirection: "column",
                            height: "calc(100% - 220px)"
                          }}
                        >
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            <Title 
                              level={4} 
                              className="cause-title"
                              style={{
                                margin: "0 0 8px 0",
                                fontSize: "18px",
                                fontWeight: "600",
                                color: "#1f2937",
                                lineHeight: "1.3",
                                minHeight: "48px",
                                display: "-webkit-box",
                                WebkitBoxOrient: "vertical",
                                WebkitLineClamp: 2,
                                overflow: "hidden"
                              }}
                            >
                              {cause.title}
                            </Title>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            style={{ flex: 1 }}
                          >
                            <Paragraph 
                              className="cause-description"
                              style={{
                                color: "#6b7280",
                                fontSize: "14px",
                                lineHeight: "1.5",
                                margin: "0 0 16px 0",
                                minHeight: "60px",
                                display: "-webkit-box",
                                WebkitBoxOrient: "vertical",
                                WebkitLineClamp: 3,
                                overflow: "hidden"
                              }}
                            >
                              {cause.description || "No description available"}
                            </Paragraph>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="cause-meta"
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "8px",
                              marginBottom: "16px",
                              padding: "12px",
                              backgroundColor: "#f8fafc",
                              borderRadius: "8px",
                              border: "1px solid #e2e8f0"
                            }}
                          >
                            <div 
                              className="meta-item"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                fontSize: "13px",
                                color: "#64748b"
                              }}
                            >
                              <FiMapPin size={14} style={{ color: "#ef4444" }} />
                              <span>{cause.location || 'Location TBD'}</span>
                            </div>
                            <div 
                              className="meta-item"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                fontSize: "13px",
                                color: "#64748b"
                              }}
                            >
                              <FiUser size={14} style={{ color: "#3b82f6" }} />
                              <span>by {cause.user_name || 'Anonymous'}</span>
                            </div>

                            {/* Category-specific information */}
                            <div style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              fontSize: "12px",
                              color: "#6366f1",
                              backgroundColor: "#f0f9ff",
                              padding: "6px 10px",
                              borderRadius: "6px",
                              border: "1px solid #e0f2fe",
                              marginTop: "4px"
                            }}>
                              <span style={{ fontWeight: "600" }}>
                                {cause.category_name === 'food' && '🍽️ Food Assistance'}
                                {cause.category_name === 'clothes' && '👕 Clothing Donation'}
                                {cause.category_name === 'education' && '📚 Education & Training'}
                                {cause.category_name === 'healthcare' && '🏥 Healthcare Support'}
                                {cause.category_name === 'housing' && '🏠 Housing Assistance'}
                                {!cause.category_name && '🤝 Community Support'}
                              </span>
                            </div>
                            
                            {/* Engagement metrics */}
                            <div style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginTop: "4px",
                              fontSize: "12px",
                              color: "#9ca3af"
                            }}>
                              <span>👁 {cause.view_count || 0} views</span>
                              <span>❤️ {cause.like_count || 0} likes</span>
                              <span>💬 {cause.comment_count || 0} comments</span>
                            </div>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                          >
                            <Link href={`/causes/${cause.id}`}>
                              <Button
                                type="primary"
                                block
                                size="large"
                                style={{
                                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                  border: "none",
                                  borderRadius: "10px",
                                  height: "44px",
                                  fontWeight: "600",
                                  fontSize: "14px",
                                  boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                                  transition: "all 0.3s ease"
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.transform = "translateY(-2px)";
                                  e.currentTarget.style.boxShadow = "0 6px 16px rgba(102, 126, 234, 0.4)";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.transform = "translateY(0)";
                                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.3)";
                                }}
                              >
                                <FiHeart style={{ marginRight: 8 }} />
                                Support This Cause
                              </Button>
                            </Link>
                          </motion.div>
                        </div>
                      </Card>
                    </motion.div>
                  </Col>
                ))}
              </Row>
            )}

            {/* Load More & Pagination */}
            {!loading && causes.length > 0 && (
              <>
                {/* Infinite Scroll Loading Trigger */}
                {infiniteScrollEnabled && (
                  <div ref={loadingRef} style={{ padding: '20px', textAlign: 'center' }}>
                    {loadingMore && (
                      <div style={{ marginBottom: '16px' }}>
                        <Spin size="large" />
                        <p style={{ marginTop: '12px', color: '#666' }}>Loading more causes...</p>
                      </div>
                    )}
                    {!hasMore && causes.length > 0 && (
                      <div style={{ padding: '40px 20px', textAlign: 'center', color: '#999' }}>
                        <p>🎉 You've reached the end! No more causes to load.</p>
                        <Button onClick={handleRefresh} type="link">
                          Go back to top
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* Load More Button (fallback for infinite scroll) */}
                {infiniteScrollEnabled && hasMore && !loadingMore && (
                  <div style={{ textAlign: 'center', marginTop: '24px' }}>
                    <Button 
                      type="primary" 
                      size="large" 
                      onClick={loadMore}
                      loading={loadingMore}
                      style={{ minWidth: '200px' }}
                    >
                      Load More Causes
                    </Button>
                  </div>
                )}

                {/* Traditional Pagination */}
                {!infiniteScrollEnabled && pagination.totalPages > 1 && (
                  <div className="pagination-container" style={{ marginTop: '32px', textAlign: 'center' }}>
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
