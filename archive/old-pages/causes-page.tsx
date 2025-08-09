"use client";

import React, { useEffect, useState } from "react";
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

// Microsoft-style statistics section
const StatsSection = ({ causes }: { causes: Cause[] }) => {
  const stats = [
    {
      title: "Active initiatives",
      value: causes.length,
      icon: <FiTarget />,
      description: "Community initiatives available",
    },
    {
      title: "Total views",
      value: causes.reduce((acc, cause) => acc + (cause.view_count || 0), 0),
      icon: <FiTrendingUp />,
      description: "Community engagement",
    },
    {
      title: "Supporters",
      value: causes.reduce((acc, cause) => acc + (cause.like_count || 0), 0),
      icon: <FiUsers />,
      description: "People actively participating",
    },
    {
      title: "Success rate",
      value: "94%",
      icon: <FiChevronRight />,
      description: "Initiatives completed successfully",
    },
  ];

  return (
    <section style={{
      background: '#faf9f8',
      padding: '48px 0',
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <Row gutter={[24, 24]}>
          {stats.map((stat, index) => (
            <Col xs={12} sm={6} key={index}>
              <motion.div {...animations.slideUp} style={{ transitionDelay: `${index * 0.1}s` }}>
                <Card style={{
                  textAlign: "center",
                  borderRadius: 8,
                  border: "1px solid #edebe9",
                  height: '100%'
                }}>
                  <div style={{
                    color: '#0078d4',
                    fontSize: '20px',
                    marginBottom: 12,
                    display: 'flex',
                    justifyContent: 'center'
                  }}>
                    {stat.icon}
                  </div>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: 600,
                    color: '#323130',
                    marginBottom: 4,
                    fontFamily: "'Segoe UI', system-ui, sans-serif"
                  }}>
                    {stat.value}
                  </div>
                  <Text style={{
                    color: '#323130',
                    fontSize: 14,
                    fontWeight: 600,
                    display: 'block',
                    marginBottom: 4,
                    fontFamily: "'Segoe UI', system-ui, sans-serif"
                  }}>
                    {stat.title}
                  </Text>
                  <Text style={{
                    color: '#605e5c',
                    fontSize: 12,
                    fontFamily: "'Segoe UI', system-ui, sans-serif"
                  }}>
                    {stat.description}
                  </Text>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

// Microsoft-style cause card with category-specific information
const CauseCard = ({ cause }: { cause: Cause }) => {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(cause.like_count || 0);
  
  const categoryColor = categoryColors[cause.category_name as keyof typeof categoryColors] || categoryColors.food;

  const handleCardClick = () => {
    router.push(`/causes/${cause.id}`);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  // Render category-specific relevant information
  const renderCategoryInfo = () => {
    switch (cause.category_name) {
      case 'food':
        return (
          <div style={{ marginTop: 8, marginBottom: 8 }}>
            <Space size={4} wrap>
              {cause.food_type && (
                <Tag size="small" style={{ 
                  backgroundColor: '#f0f8ff', 
                  color: '#0078d4', 
                  border: '1px solid #b3d9ff',
                  fontSize: '10px',
                  fontFamily: "'Segoe UI', system-ui, sans-serif"
                }}>
                  {cause.food_type}
                </Tag>
              )}
              {cause.serving_size && (
                <Tag size="small" style={{ 
                  backgroundColor: '#f0f8ff', 
                  color: '#0078d4', 
                  border: '1px solid #b3d9ff',
                  fontSize: '10px',
                  fontFamily: "'Segoe UI', system-ui, sans-serif"
                }}>
                  Serves {cause.serving_size}
                </Tag>
              )}
              {cause.expiration_date && (
                <Tag size="small" style={{ 
                  backgroundColor: '#fff3cd', 
                  color: '#f7630c', 
                  border: '1px solid #ffeaa7',
                  fontSize: '10px',
                  fontFamily: "'Segoe UI', system-ui, sans-serif"
                }}>
                  Expires {new Date(cause.expiration_date).toLocaleDateString()}
                </Tag>
              )}
            </Space>
          </div>
        );
      
      case 'clothes':
        return (
          <div style={{ marginTop: 8, marginBottom: 8 }}>
            <Space size={4} wrap>
              {cause.clothes_type && (
                <Tag size="small" style={{ 
                  backgroundColor: '#f0f8ff', 
                  color: '#0078d4', 
                  border: '1px solid #b3d9ff',
                  fontSize: '10px',
                  fontFamily: "'Segoe UI', system-ui, sans-serif"
                }}>
                  {cause.clothes_type.replace('-', ' ')}
                </Tag>
              )}
              {cause.gender && (
                <Tag size="small" style={{ 
                  backgroundColor: '#f0f8ff', 
                  color: '#0078d4', 
                  border: '1px solid #b3d9ff',
                  fontSize: '10px',
                  fontFamily: "'Segoe UI', system-ui, sans-serif"
                }}>
                  {cause.gender}
                </Tag>
              )}
              {cause.condition && (
                <Tag size="small" style={{ 
                  backgroundColor: '#f0f8ff', 
                  color: '#0078d4', 
                  border: '1px solid #b3d9ff',
                  fontSize: '10px',
                  fontFamily: "'Segoe UI', system-ui, sans-serif"
                }}>
                  {cause.condition}
                </Tag>
              )}
            </Space>
          </div>
        );
      
      case 'training':
        return (
          <div style={{ marginTop: 8, marginBottom: 8 }}>
            <Space size={4} wrap>
              {cause.training_type && (
                <Tag size="small" style={{ 
                  backgroundColor: '#f0f8ff', 
                  color: '#0078d4', 
                  border: '1px solid #b3d9ff',
                  fontSize: '10px',
                  fontFamily: "'Segoe UI', system-ui, sans-serif"
                }}>
                  {cause.training_type}
                </Tag>
              )}
              {cause.skill_level && (
                <Tag size="small" style={{ 
                  backgroundColor: '#f0f8ff', 
                  color: '#0078d4', 
                  border: '1px solid #b3d9ff',
                  fontSize: '10px',
                  fontFamily: "'Segoe UI', system-ui, sans-serif"
                }}>
                  {cause.skill_level.replace('-', ' ')}
                </Tag>
              )}
              {cause.duration_hours && (
                <Tag size="small" style={{ 
                  backgroundColor: '#f0f8ff', 
                  color: '#0078d4', 
                  border: '1px solid #b3d9ff',
                  fontSize: '10px',
                  fontFamily: "'Segoe UI', system-ui, sans-serif"
                }}>
                  {cause.duration_hours}h
                </Tag>
              )}
              {cause.is_free !== undefined && (
                <Tag size="small" style={{ 
                  backgroundColor: cause.is_free ? '#e8f5e8' : '#fff3cd',
                  color: cause.is_free ? '#107c10' : '#f7630c',
                  border: `1px solid ${cause.is_free ? '#90ee90' : '#ffeaa7'}`,
                  fontSize: '10px',
                  fontFamily: "'Segoe UI', system-ui, sans-serif"
                }}>
                  {cause.is_free ? 'Free' : 'Paid'}
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
    <motion.div {...animations.slideUp}>
      <Card
        hoverable
        onClick={handleCardClick}
        cover={
          <div style={{
            height: 220,
            background: cause.image 
              ? `url(${cause.image})`
              : `linear-gradient(135deg, ${categoryColor.primary}20, ${categoryColor.primary}40), url(${imageConfig.getRandomImage(cause.category_name as any, { w: 400, h: 220 })})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
          }}>
            <div style={{
              position: "absolute",
              top: 16,
              left: 16,
            }}>
              <Tag style={{
                backgroundColor: categoryColor.primary,
                color: "white",
                border: "none",
                borderRadius: 6,
                fontSize: "12px",
                fontWeight: 600,
                padding: "4px 10px",
                fontFamily: "'Segoe UI', system-ui, sans-serif"
              }}>
                {cause.category_display_name}
              </Tag>
            </div>
            
            {cause.cause_type && (
              <div style={{
                position: "absolute",
                top: 16,
                right: 16,
              }}>
                <Tag style={{
                  backgroundColor: cause.cause_type === "offered" ? "#107c10" : "#d13438",
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  fontSize: "11px",
                  fontWeight: 600,
                  padding: "3px 8px",
                  fontFamily: "'Segoe UI', system-ui, sans-serif"
                }}>
                  {cause.cause_type === "offered" ? "OFFERING" : "SEEKING"}
                </Tag>
              </div>
            )}

            {cause.priority !== 'medium' && (
              <div style={{
                position: "absolute",
                bottom: 16,
                right: 16,
              }}>
                <Tag style={{
                  backgroundColor: cause.priority === 'urgent' ? '#d13438' : cause.priority === 'high' ? '#f7630c' : '#0078d4',
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  fontSize: "10px",
                  fontWeight: 600,
                  padding: "2px 6px",
                  fontFamily: "'Segoe UI', system-ui, sans-serif"
                }}>
                  {cause.priority.toUpperCase()}
                </Tag>
              </div>
            )}
          </div>
        }
        style={{
          borderRadius: 12,
          overflow: "hidden",
          border: "1px solid #edebe9",
          height: "100%",
          cursor: "pointer",
          transition: 'all 0.3s ease-in-out',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}
        className="premium-cause-card"
        bodyStyle={{ padding: "20px" }}
      >
        {/* Title and Description */}
        <div style={{ marginBottom: 16 }}>
          <Title level={4} style={{
            marginBottom: 8,
            color: "#323130",
            fontSize: "16px",
            fontWeight: 600,
            lineHeight: "1.3",
            height: "42px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            fontFamily: "'Segoe UI', system-ui, sans-serif"
          }}>
            {cause.title}
          </Title>

          <div style={{
            color: '#605e5c',
            fontSize: '13px',
            lineHeight: '1.4',
            height: '36px',
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            fontFamily: "'Segoe UI', system-ui, sans-serif",
            marginBottom: 12
          }}>
            {cause.short_description || cause.description}
          </div>

          {/* Category-specific information */}
          {renderCategoryInfo()}
        </div>

        {/* Location and Time */}
        <div style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Space size={6} align="center">
                <FiMapPin style={{ color: "#8a8886", fontSize: 14 }} />
                <Text style={{ 
                  color: "#8a8886", 
                  fontSize: "12px",
                  fontFamily: "'Segoe UI', system-ui, sans-serif",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "80px"
                }}>
                  {cause.location}
                </Text>
              </Space>
            </Col>
            <Col span={12}>
              <Space size={6} align="center">
                <FiClock style={{ color: "#8a8886", fontSize: 14 }} />
                <Text style={{ 
                  color: "#8a8886", 
                  fontSize: "12px",
                  fontFamily: "'Segoe UI', system-ui, sans-serif"
                }}>
                  {formatTimeAgo(cause.created_at)}
                </Text>
              </Space>
            </Col>
          </Row>
        </div>

        {/* Footer with Creator and Actions */}
        <div style={{
          paddingTop: 16,
          borderTop: "1px solid #f3f2f1",
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Space size={8} align="center">
            <Avatar size={28} src={cause.creator_avatar} icon={<FiUser />} />
            <div>
              <Text style={{ 
                color: "#323130", 
                fontSize: "13px", 
                fontWeight: 600,
                fontFamily: "'Segoe UI', system-ui, sans-serif",
                display: "block",
                lineHeight: 1.2
              }}>
                {cause.creator_name || 'Anonymous'}
              </Text>
              <Text style={{ 
                color: "#8a8886", 
                fontSize: "11px",
                fontFamily: "'Segoe UI', system-ui, sans-serif"
              }}>
                Creator
              </Text>
            </div>
          </Space>

          <Space size={8}>
            <Button
              type="text"
              size="small"
              icon={<FiHeart fill={isLiked ? "currentColor" : "none"} />}
              onClick={handleLike}
              style={{
                padding: "6px 8px",
                color: isLiked ? "#d13438" : "#8a8886",
                fontSize: "12px",
                fontFamily: "'Segoe UI', system-ui, sans-serif",
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                gap: 4
              }}
            >
              {likeCount}
            </Button>

            <Button
              type="text"
              size="small"
              icon={<FiEye />}
              style={{ 
                padding: "6px 8px", 
                color: "#8a8886",
                fontSize: "12px",
                fontFamily: "'Segoe UI', system-ui, sans-serif",
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                gap: 4
              }}
            >
              {cause.view_count || 0}
            </Button>
          </Space>
        </div>
      </Card>
    </motion.div>
  );
};

// Microsoft-style filter bar
const FilterBar = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters);
  const selectedCategory = useAppSelector(selectSelectedCategory);
  const searchQuery = useAppSelector(selectSearchQuery);

  const categories = [
    { key: "all", label: "All categories" },
    { key: "food", label: "Food" },
    { key: "clothes", label: "Clothing" },
    { key: "training", label: "Training" },
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
    <motion.div style={{ marginBottom: 32 }} {...animations.slideUp}>
      {/* Category Filter */}
      <div style={{ marginBottom: 20 }}>
        <Space size={8} wrap>
          {categories.map((category) => (
            <Button
              key={category.key}
              type={
                selectedCategory === category.key ||
                (selectedCategory === null && category.key === "all")
                  ? "primary"
                  : "default"
              }
              onClick={() => handleCategoryChange(category.key)}
              style={{
                borderRadius: 4,
                fontWeight: 600,
                height: 32,
                fontSize: 14,
                backgroundColor:
                  selectedCategory === category.key ||
                  (selectedCategory === null && category.key === "all")
                    ? "#0078d4"
                    : undefined,
                borderColor:
                  selectedCategory === category.key ||
                  (selectedCategory === null && category.key === "all")
                    ? "#0078d4"
                    : "#8a8886",
                fontFamily: "'Segoe UI', system-ui, sans-serif"
              }}
            >
              {category.label}
            </Button>
          ))}
        </Space>
      </div>

      {/* Search and Filters */}
      <Card style={{
        borderRadius: 8,
        border: "1px solid #edebe9",
      }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={10}>
            <Input
              placeholder="Search initiatives..."
              prefix={<FiSearch style={{ color: "#8a8886" }} />}
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              style={{
                borderRadius: 4,
                borderColor: "#8a8886",
                fontFamily: "'Segoe UI', system-ui, sans-serif"
              }}
            />
          </Col>

          <Col xs={12} sm={6} md={4}>
            <Select
              placeholder="Type"
              allowClear
              value={filters.cause_type}
              onChange={(value) => handleFilterChange("cause_type", value)}
              style={{ width: "100%" }}
            >
              <Option value="wanted">Seeking help</Option>
              <Option value="offered">Offering help</Option>
            </Select>
          </Col>

          <Col xs={12} sm={6} md={4}>
            <Select
              placeholder="Priority"
              allowClear
              value={filters.priority}
              onChange={(value) => handleFilterChange("priority", value)}
              style={{ width: "100%" }}
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
              prefix={<FiMapPin style={{ color: "#8a8886" }} />}
              style={{
                borderRadius: 4,
                borderColor: "#8a8886",
                fontFamily: "'Segoe UI', system-ui, sans-serif"
              }}
            />
          </Col>
        </Row>
      </Card>
    </motion.div>
  );
};

// Main Causes Page Component
export default function CausesPage() {
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
      <div style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>
        {/* Microsoft-style hero section */}
        <section style={{
          background: '#f3f2f1',
          padding: "80px 0 56px",
        }}>
          <div style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
            textAlign: "center",
          }}>
            <motion.div {...animations.slideUp}>
              <Title level={1} style={{
                color: '#323130',
                fontSize: '32px',
                fontWeight: 600,
                marginBottom: 16,
                fontFamily: "'Segoe UI', system-ui, sans-serif"
              }}>
                Community initiatives
              </Title>
              <Paragraph style={{
                color: '#605e5c',
                fontSize: 16,
                marginBottom: 32,
                maxWidth: 600,
                margin: '0 auto 32px auto',
                fontFamily: "'Segoe UI', system-ui, sans-serif"
              }}>
                Discover opportunities to help your neighbors or find the support you need. 
                Browse active community initiatives and make a difference today.
              </Paragraph>
              
              <Space size="large">
                <Link href="/causes/create">
                  <Button
                    type="primary"
                    icon={<FiPlus />}
                    size="large"
                    style={{
                      backgroundColor: '#0078d4',
                      borderColor: '#0078d4',
                      borderRadius: 4,
                      height: 40,
                      fontWeight: 600,
                      fontSize: 14,
                      fontFamily: "'Segoe UI', system-ui, sans-serif"
                    }}
                  >
                    Start an initiative
                  </Button>
                </Link>
                
                <Button
                  icon={<FiGrid />}
                  size="large"
                  style={{
                    borderRadius: 4,
                    height: 40,
                    fontWeight: 600,
                    fontSize: 14,
                    borderColor: '#8a8886',
                    color: '#323130',
                    fontFamily: "'Segoe UI', system-ui, sans-serif"
                  }}
                >
                  Browse all
                </Button>
              </Space>
            </motion.div>
          </div>
        </section>

        {/* Statistics Section */}
        <StatsSection causes={causes || []} />

        {/* Main Content */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }}>
          <FilterBar />

          {error && (
            <motion.div style={{ marginBottom: 24, textAlign: "center" }} {...animations.fadeIn}>
              <Card style={{
                borderRadius: 8,
                backgroundColor: "#fdf4f4",
                border: "1px solid #d13438",
              }}>
                <Text style={{ fontSize: 14, color: "#d13438", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
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
                style={{ textAlign: "center", padding: "60px 0" }}
              >
                <Spin size="large" />
                <div style={{ marginTop: 16 }}>
                  <Text style={{ 
                    color: "#605e5c", 
                    fontSize: 14,
                    fontFamily: "'Segoe UI', system-ui, sans-serif"
                  }}>
                    Loading community initiatives...
                  </Text>
                </div>
              </motion.div>
            ) : causes.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                style={{ textAlign: "center", padding: "60px 0" }}
              >
                <Empty
                  description={
                    <div>
                      <Text style={{
                        fontSize: 16,
                        color: "#605e5c",
                        display: "block",
                        marginBottom: 12,
                        fontFamily: "'Segoe UI', system-ui, sans-serif"
                      }}>
                        No initiatives found
                      </Text>
                      <Text style={{ 
                        fontSize: 14, 
                        color: "#8a8886",
                        fontFamily: "'Segoe UI', system-ui, sans-serif"
                      }}>
                        Try adjusting your filters or create a new initiative
                      </Text>
                      <div style={{ marginTop: 20 }}>
                        <Link href="/causes/create">
                          <Button
                            type="primary"
                            icon={<FiPlus />}
                            style={{
                              backgroundColor: '#0078d4',
                              borderColor: '#0078d4',
                              borderRadius: 4,
                              fontWeight: 600,
                              fontFamily: "'Segoe UI', system-ui, sans-serif"
                            }}
                          >
                            Create the first initiative
                          </Button>
                        </Link>
                      </div>
                    </div>
                  }
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              </motion.div>
            ) : (
              <motion.div
                key="causes"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Row gutter={[32, 32]}>
                  {causes.map((cause, index) => (
                    <Col 
                      xs={24} 
                      sm={12} 
                      md={12} 
                      lg={8} 
                      xl={6} 
                      key={cause.id}
                    >
                      <CauseCard cause={cause} />
                    </Col>
                  ))}
                </Row>

                {/* Pagination */}
                {pagination && pagination.total_pages > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    style={{
                      textAlign: "center",
                      marginTop: 48,
                      paddingTop: 32,
                      borderTop: "1px solid #edebe9",
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
                        fontSize: 14,
                        fontFamily: "'Segoe UI', system-ui, sans-serif"
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