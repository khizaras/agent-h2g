"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Space,
  Input,
  Select,
  Tag,
  Progress,
  Avatar,
  Badge,
  Pagination,
} from "antd";
import {
  FiHeart,
  FiMapPin,
  FiClock,
  FiSearch,
  FiUser,
  FiEye,
  FiShare2,
  FiBookmark,
  FiDollarSign,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { unsplashImages } from "@/services/unsplashService";

const { Title, Paragraph, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

interface Cause {
  id: number;
  title: string;
  description: string;
  location: string;
  category: string;
  urgency_level: "low" | "medium" | "high" | "critical";
  created_at: string;
  user_name: string;
  goal_amount: number;
  raised_amount: number;
  percentage_complete: number;
  image_url: string;
  tags: string[];
  view_count: number;
  like_count: number;
  deadline: string;
}

const mockCauses: Cause[] = [
  {
    id: 1,
    title: "Emergency Food Relief for Hurricane Victims",
    description:
      "Providing immediate food assistance to families displaced by recent hurricane damage in coastal communities.",
    location: "Miami, FL",
    category: "Emergency Relief",
    urgency_level: "critical",
    created_at: "2024-01-15",
    user_name: "Sarah Johnson",
    goal_amount: 25000,
    raised_amount: 18500,
    percentage_complete: 74,
    image_url:
      unsplashImages.causes[0]?.url ||
      "https://images.unsplash.com/photo-1593113598332-cd288d649433",
    tags: ["emergency", "food-relief", "hurricane", "families"],
    view_count: 1245,
    like_count: 189,
    deadline: "2024-02-15",
  },
  {
    id: 2,
    title: "Community Food Bank Expansion",
    description:
      "Expanding our local food bank to serve 500 more families weekly with fresh produce and nutritious meals.",
    location: "Seattle, WA",
    category: "Food Banks",
    urgency_level: "high",
    created_at: "2024-01-14",
    user_name: "Mike Chen",
    goal_amount: 50000,
    raised_amount: 28000,
    percentage_complete: 56,
    image_url:
      unsplashImages.causes[1]?.url ||
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c",
    tags: ["food-bank", "expansion", "families", "nutrition"],
    view_count: 892,
    like_count: 145,
    deadline: "2024-03-01",
  },
  {
    id: 3,
    title: "Mobile Community Kitchen Initiative",
    description:
      "Creating a mobile kitchen to deliver hot, nutritious meals to underserved neighborhoods and elderly residents.",
    location: "Austin, TX",
    category: "Community Kitchens",
    urgency_level: "medium",
    created_at: "2024-01-13",
    user_name: "Lisa Rodriguez",
    goal_amount: 35000,
    raised_amount: 12000,
    percentage_complete: 34,
    image_url:
      unsplashImages.causes[2]?.url ||
      "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b",
    tags: ["mobile-kitchen", "elderly", "neighborhoods", "hot-meals"],
    view_count: 567,
    like_count: 78,
    deadline: "2024-04-01",
  },
  {
    id: 4,
    title: "School Breakfast Program Enhancement",
    description:
      "Improving school breakfast programs to ensure no child starts their day hungry, focusing on nutritious options.",
    location: "Denver, CO",
    category: "School Meals",
    urgency_level: "medium",
    created_at: "2024-01-12",
    user_name: "David Park",
    goal_amount: 20000,
    raised_amount: 8500,
    percentage_complete: 43,
    image_url:
      unsplashImages.causes[3]?.url ||
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
    tags: ["school-meals", "children", "nutrition", "education"],
    view_count: 423,
    like_count: 56,
    deadline: "2024-03-15",
  },
  {
    id: 5,
    title: "Senior Meal Delivery Service",
    description:
      "Providing weekly meal deliveries to homebound seniors, ensuring they receive proper nutrition and social connection.",
    location: "Portland, OR",
    category: "Senior Support",
    urgency_level: "high",
    created_at: "2024-01-11",
    user_name: "Emily Watson",
    goal_amount: 30000,
    raised_amount: 19000,
    percentage_complete: 63,
    image_url:
      unsplashImages.causes[4]?.url ||
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19",
    tags: ["senior-support", "meal-delivery", "nutrition", "social"],
    view_count: 634,
    like_count: 92,
    deadline: "2024-02-28",
  },
  {
    id: 6,
    title: "Urban Farm Fresh Produce Distribution",
    description:
      "Creating sustainable urban farms to provide fresh, organic produce to food-insecure neighborhoods.",
    location: "Detroit, MI",
    category: "Urban Farming",
    urgency_level: "low",
    created_at: "2024-01-10",
    user_name: "Marcus Green",
    goal_amount: 45000,
    raised_amount: 15000,
    percentage_complete: 33,
    image_url:
      unsplashImages.causes[5]?.url ||
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b",
    tags: ["urban-farm", "organic", "sustainability", "fresh-produce"],
    view_count: 345,
    like_count: 42,
    deadline: "2024-05-01",
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
  },
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export default function CausesPage() {
  const [causes, setCauses] = useState<Cause[]>(mockCauses);
  const [filteredCauses, setFilteredCauses] = useState<Cause[]>(mockCauses);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedUrgency, setSelectedUrgency] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);

  const categories = [
    "Emergency Relief",
    "Food Banks",
    "Community Kitchens",
    "School Meals",
    "Senior Support",
    "Urban Farming",
  ];

  const urgencyLevels = ["low", "medium", "high", "critical"];

  useEffect(() => {
    let filtered = causes;

    if (searchTerm) {
      filtered = filtered.filter(
        (cause) =>
          cause.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cause.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cause.location.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (cause) => cause.category === selectedCategory,
      );
    }

    if (selectedUrgency !== "all") {
      filtered = filtered.filter(
        (cause) => cause.urgency_level === selectedUrgency,
      );
    }

    setFilteredCauses(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedUrgency, causes]);

  const paginatedCauses = filteredCauses.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

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
      <div className="page-container">
        {/* Hero Section */}
        <section className="causes-header">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerChildren}
            className="page-hero-content"
          >
            <motion.div variants={fadeInUp}>
              <Title level={1} className="page-hero-title">
                Discover Causes That Need Your Help
              </Title>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Paragraph className="page-hero-description">
                Browse active causes in your community and around the world.
                Every contribution makes a real difference in someone's life.
              </Paragraph>
            </motion.div>
          </motion.div>
        </section>

        {/* Filters */}
        <section className="causes-filters">
          <div className="filters-container">
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} md={8}>
                <div className="filter-section">
                  <Search
                    placeholder="Search causes..."
                    allowClear
                    size="large"
                    prefix={<FiSearch />}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div className="filter-section">
                  <Select
                    value={selectedCategory}
                    onChange={setSelectedCategory}
                    size="large"
                    style={{ width: "100%" }}
                    placeholder="Select Category"
                  >
                    <Option value="all">All Categories</Option>
                    {categories.map((category) => (
                      <Option key={category} value={category}>
                        {category}
                      </Option>
                    ))}
                  </Select>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div className="filter-section">
                  <Select
                    value={selectedUrgency}
                    onChange={setSelectedUrgency}
                    size="large"
                    style={{ width: "100%" }}
                    placeholder="Select Urgency"
                  >
                    <Option value="all">All Urgency Levels</Option>
                    {urgencyLevels.map((level) => (
                      <Option key={level} value={level}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </Option>
                    ))}
                  </Select>
                </div>
              </Col>
            </Row>
          </div>
        </section>

        {/* Causes Grid */}
        <section className="causes-content">
          <div className="page-content-container">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerChildren}
            >
              <Row gutter={[24, 24]} className="causes-grid">
                <AnimatePresence>
                  {paginatedCauses.map((cause) => (
                    <Col xs={24} md={12} lg={8} key={cause.id}>
                      <motion.div
                        variants={fadeInUp}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card className="cause-card-large" hoverable>
                          <div className="cause-image-large">
                            <img src={cause.image_url} alt={cause.title} />
                            <Tag
                              className={`cause-urgency urgency-${cause.urgency_level}`}
                              style={{
                                backgroundColor: getUrgencyColor(
                                  cause.urgency_level,
                                ),
                              }}
                            >
                              {cause.urgency_level.toUpperCase()}
                            </Tag>
                          </div>

                          <div className="cause-content">
                            <div className="cause-header">
                              <Title level={4} className="cause-title-large">
                                {cause.title}
                              </Title>
                              <div className="cause-stats">
                                <Space size="small">
                                  <FiEye />
                                  <Text>{cause.view_count}</Text>
                                </Space>
                                <Space size="small">
                                  <FiHeart />
                                  <Text>{cause.like_count}</Text>
                                </Space>
                              </div>
                            </div>

                            <Paragraph className="cause-description-large">
                              {cause.description}
                            </Paragraph>

                            <div className="cause-progress">
                              <Progress
                                percent={cause.percentage_complete}
                                showInfo={false}
                                strokeColor={{
                                  "0%": "#40a9ff",
                                  "100%": "#1890ff",
                                }}
                                className="progress-bar"
                              />
                              <div className="progress-info">
                                <Text strong className="progress-amount">
                                  ${cause.raised_amount.toLocaleString()} raised
                                </Text>
                                <Text
                                  type="secondary"
                                  className="progress-goal"
                                >
                                  of ${cause.goal_amount.toLocaleString()} goal
                                </Text>
                              </div>
                            </div>

                            <div className="cause-meta">
                              <Space className="meta-item">
                                <FiMapPin size={14} />
                                <Text type="secondary">{cause.location}</Text>
                              </Space>
                              <Space className="meta-item">
                                <FiClock size={14} />
                                <Text type="secondary">
                                  Due {formatDate(cause.deadline)}
                                </Text>
                              </Space>
                            </div>

                            <div className="cause-footer">
                              <div className="cause-author">
                                <Avatar icon={<FiUser />} size="small" />
                                <div className="author-info">
                                  <div className="author-name">
                                    {cause.user_name}
                                  </div>
                                  <div className="author-date">
                                    {formatDate(cause.created_at)}
                                  </div>
                                </div>
                              </div>

                              <div className="cause-actions">
                                <Button
                                  type="text"
                                  icon={<FiBookmark />}
                                  className="action-btn"
                                />
                                <Button
                                  type="text"
                                  icon={<FiShare2 />}
                                  className="action-btn"
                                />
                              </div>
                            </div>

                            <Button
                              type="primary"
                              size="large"
                              icon={<FiHeart />}
                              className="cause-btn"
                              block
                            >
                              <Link href={`/causes/${cause.id}`}>
                                Support This Cause
                              </Link>
                            </Button>
                          </div>
                        </Card>
                      </motion.div>
                    </Col>
                  ))}
                </AnimatePresence>
              </Row>

              {/* Pagination */}
              {filteredCauses.length > pageSize && (
                <motion.div
                  variants={fadeInUp}
                  style={{ textAlign: "center", marginTop: "40px" }}
                >
                  <Pagination
                    current={currentPage}
                    total={filteredCauses.length}
                    pageSize={pageSize}
                    onChange={setCurrentPage}
                    showSizeChanger={false}
                    showQuickJumper
                    showTotal={(total, range) =>
                      `${range[0]}-${range[1]} of ${total} causes`
                    }
                  />
                </motion.div>
              )}

              {/* No Results */}
              {filteredCauses.length === 0 && (
                <motion.div
                  variants={fadeInUp}
                  style={{ textAlign: "center", padding: "60px 0" }}
                >
                  <Title level={3}>No causes found</Title>
                  <Paragraph>
                    Try adjusting your search criteria or{" "}
                    <Button
                      type="link"
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedCategory("all");
                        setSelectedUrgency("all");
                      }}
                    >
                      clear all filters
                    </Button>
                  </Paragraph>
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="cta-container"
          >
            <div className="cta-content">
              <Title level={2} className="cta-title">
                Ready to Make a Difference?
              </Title>
              <Paragraph className="cta-description">
                Can't find a cause that speaks to you? Create your own and start
                building support for what matters most to your community.
              </Paragraph>
              <Space size="large" className="cta-actions">
                <Button
                  type="primary"
                  size="large"
                  icon={<FiHeart />}
                  className="btn-primary-large"
                >
                  <Link href="/causes/create">Create a Cause</Link>
                </Button>
                <Button
                  size="large"
                  icon={<FiDollarSign />}
                  className="btn-secondary-large"
                >
                  Learn About Impact
                </Button>
              </Space>
            </div>
          </motion.div>
        </section>
      </div>
    </MainLayout>
  );
}
