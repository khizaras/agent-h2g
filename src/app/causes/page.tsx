"use client";

import React, { useState, useEffect } from "react";
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
} from "antd";
import {
  FiHeart,
  FiMapPin,
  FiSearch,
  FiUser,
  FiPlus,
} from "react-icons/fi";
import { motion } from "framer-motion";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";

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
  participants: number;
  views: number;
  likes: number;
  image_url: string;
  tags: string[];
  deadline: string;
}

const mockCauses: Cause[] = [
  {
    id: 1,
    title: "Emergency Food Relief for Hurricane Victims",
    description: "Providing immediate food assistance to families displaced by recent hurricane damage in coastal communities.",
    location: "Miami, FL",
    category: "Emergency Relief",
    urgency_level: "critical",
    created_at: "2024-01-15",
    user_name: "Sarah Johnson",
    goal_amount: 25000,
    raised_amount: 18500,
    percentage_complete: 74,
    image_url: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&h=600&fit=crop",
    tags: ["emergency", "food-relief", "hurricane", "families"],
    view_count: 1245,
    like_count: 189,
    deadline: "2024-02-15",
  },
  {
    id: 2,
    title: "Community Food Bank Expansion",
    description: "Expanding our local food bank to serve 500 more families weekly with fresh produce and nutritious meals.",
    location: "Seattle, WA",
    category: "Food Banks",
    urgency_level: "high",
    created_at: "2024-01-14",
    user_name: "Mike Chen",
    goal_amount: 50000,
    raised_amount: 28000,
    percentage_complete: 56,
    image_url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=600&fit=crop",
    tags: ["food-bank", "expansion", "families", "nutrition"],
    view_count: 892,
    like_count: 145,
    deadline: "2024-03-01",
  },
  {
    id: 3,
    title: "Mobile Community Kitchen Initiative",
    description: "Creating a mobile kitchen to deliver hot, nutritious meals to underserved neighborhoods and elderly residents.",
    location: "Austin, TX",
    category: "Community Kitchens",
    urgency_level: "medium",
    created_at: "2024-01-13",
    user_name: "Lisa Rodriguez",
    goal_amount: 35000,
    raised_amount: 12000,
    percentage_complete: 34,
    image_url: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&h=600&fit=crop",
    tags: ["mobile-kitchen", "elderly", "neighborhoods", "hot-meals"],
    view_count: 567,
    like_count: 78,
    deadline: "2024-04-01",
  },
  {
    id: 4,
    title: "School Breakfast Program Enhancement",
    description: "Improving school breakfast programs to ensure no child starts their day hungry, focusing on nutritious options.",
    location: "Denver, CO",
    category: "School Meals",
    urgency_level: "medium",
    created_at: "2024-01-12",
    user_name: "David Park",
    goal_amount: 20000,
    raised_amount: 8500,
    percentage_complete: 43,
    image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
    tags: ["school-meals", "children", "nutrition", "education"],
    view_count: 423,
    like_count: 56,
    deadline: "2024-03-15",
  },
  {
    id: 5,
    title: "Senior Meal Delivery Service",
    description: "Providing weekly meal deliveries to homebound seniors, ensuring they receive proper nutrition and social connection.",
    location: "Portland, OR",
    category: "Senior Support",
    urgency_level: "high",
    created_at: "2024-01-11",
    user_name: "Emily Watson",
    goal_amount: 30000,
    raised_amount: 19000,
    percentage_complete: 63,
    image_url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
    tags: ["senior-support", "meal-delivery", "nutrition", "social"],
    view_count: 634,
    like_count: 92,
    deadline: "2024-02-28",
  },
  {
    id: 6,
    title: "Urban Farm Fresh Produce Distribution",
    description: "Creating sustainable urban farms to provide fresh, organic produce to food-insecure neighborhoods.",
    location: "Detroit, MI",
    category: "Urban Farming",
    urgency_level: "low",
    created_at: "2024-01-10",
    user_name: "Marcus Green",
    goal_amount: 45000,
    raised_amount: 15000,
    percentage_complete: 33,
    image_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop",
    tags: ["urban-farm", "organic", "sustainability", "fresh-produce"],
    view_count: 345,
    like_count: 42,
    deadline: "2024-05-01",
  },
];


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
                Browse meaningful initiatives in your community and join thousands making a real difference.
              </Paragraph>
              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-number">{filteredCauses.length}</span>
                  <span className="stat-label">Active Causes</span>
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
              <Col xs={24} md={12}>
                <Input.Search
                  placeholder="Search causes..."
                  size="large"
                  prefix={<FiSearch />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="modern-search"
                />
              </Col>
              <Col xs={12} md={6}>
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
              <Col xs={12} md={6}>
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
            </Row>
          </div>
        </section>

        {/* Causes Grid */}
        <section className="modern-causes-grid-section">
          <div className="container">
            <Row gutter={[24, 24]}>
              {paginatedCauses.map((cause, index) => (
                <Col xs={24} sm={12} lg={8} key={cause.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="modern-cause-card" hoverable>
                      <div className="cause-image">
                        <img src={cause.image_url} alt={cause.title} />
                        <Tag
                          className={`urgency-tag urgency-${cause.urgency_level}`}
                          style={{ backgroundColor: getUrgencyColor(cause.urgency_level) }}
                        >
                          {cause.urgency_level.toUpperCase()}
                        </Tag>
                      </div>

                      <div className="cause-content">
                        <div className="cause-category">{cause.category}</div>
                        
                        <Title level={4} className="cause-title">
                          {cause.title}
                        </Title>

                        <Paragraph className="cause-description">
                          {cause.description.substring(0, 120)}...
                        </Paragraph>

                        <div className="cause-progress">
                          <div className="progress-info">
                            <span className="raised">${cause.raised_amount.toLocaleString()}</span>
                            <span className="percentage">{cause.percentage_complete}% funded</span>
                          </div>
                          <div className="progress-bar">
                            <div 
                              className="progress-fill" 
                              style={{ width: `${cause.percentage_complete}%` }}
                            />
                          </div>
                          <div className="goal">Goal: ${cause.goal_amount.toLocaleString()}</div>
                        </div>

                        <div className="cause-meta">
                          <div className="meta-item">
                            <FiMapPin size={14} />
                            <span>{cause.location}</span>
                          </div>
                          <div className="meta-item">
                            <FiUser size={14} />
                            <span>by {cause.user_name}</span>
                          </div>
                        </div>

                        <Link href={`/causes/${cause.id}`}>
                          <Button type="primary" block className="modern-btn-primary">
                            <FiHeart style={{ marginRight: 8 }} />
                            Support This Cause
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  </motion.div>
                </Col>
              ))}

            </Row>

            {/* Pagination */}
            {filteredCauses.length > pageSize && (
              <div className="pagination-container">
                <Pagination
                  current={currentPage}
                  total={filteredCauses.length}
                  pageSize={pageSize}
                  onChange={setCurrentPage}
                  showSizeChanger={false}
                  showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} causes`}
                />
              </div>
            )}

            {/* No Results */}
            {filteredCauses.length === 0 && (
              <div className="no-results">
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
              </div>
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
                Can't find what you're looking for? Create your own cause and start building support for what matters to your community.
              </Paragraph>
              <Link href="/causes/create">
                <Button type="primary" size="large" className="modern-btn-primary">
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
