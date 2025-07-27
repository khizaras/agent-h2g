"use client";

import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Space,
  Tag,
  Rate,
  Avatar,
} from "antd";
import {
  BookOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CalendarOutlined,
  GlobalOutlined,
  TrophyOutlined,
  PlayCircleOutlined,
  TeamOutlined,
  DownloadOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";

const { Title, Paragraph, Text } = Typography;

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const educationResources = [
  {
    id: 1,
    title: "Community Organizing Fundamentals",
    category: "Leadership",
    type: "Course",
    duration: "6 weeks",
    rating: 4.8,
    students: 324,
    description:
      "Learn the essential skills for organizing and leading community initiatives effectively.",
    image:
      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=200&fit=crop",
    instructor: "Dr. Maria Santos",
    price: "Free",
    tags: ["Leadership", "Community", "Organizing"],
  },
  {
    id: 2,
    title: "Food Security and Nutrition",
    category: "Health",
    type: "Workshop",
    duration: "3 hours",
    rating: 4.9,
    students: 156,
    description:
      "Understanding food systems, nutrition science, and strategies to address food insecurity.",
    image:
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&h=200&fit=crop",
    instructor: "Chef Michael Chen",
    price: "Free",
    tags: ["Nutrition", "Food Security", "Health"],
  },
  {
    id: 3,
    title: "Grant Writing for Nonprofits",
    category: "Fundraising",
    type: "Course",
    duration: "4 weeks",
    rating: 4.7,
    students: 278,
    description:
      "Master the art of writing compelling grant proposals to fund your community projects.",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=200&fit=crop",
    instructor: "Lisa Rodriguez",
    price: "Free",
    tags: ["Grants", "Fundraising", "Writing"],
  },
  {
    id: 4,
    title: "Digital Marketing for Causes",
    category: "Marketing",
    type: "Workshop",
    duration: "2 days",
    rating: 4.6,
    students: 189,
    description:
      "Learn to promote your cause effectively using social media and digital platforms.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop",
    instructor: "Alex Kim",
    price: "Free",
    tags: ["Marketing", "Social Media", "Digital"],
  },
  {
    id: 5,
    title: "Volunteer Management Essentials",
    category: "Management",
    type: "Course",
    duration: "5 weeks",
    rating: 4.5,
    students: 201,
    description:
      "Strategies for recruiting, training, and retaining dedicated volunteers for your cause.",
    image:
      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=200&fit=crop",
    instructor: "Jordan Taylor",
    price: "Free",
    tags: ["Volunteers", "Management", "Training"],
  },
  {
    id: 6,
    title: "Impact Measurement and Evaluation",
    category: "Analytics",
    type: "Workshop",
    duration: "1 day",
    rating: 4.8,
    students: 143,
    description:
      "Learn to measure and communicate the real impact of your community initiatives.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop",
    instructor: "Dr. Priya Patel",
    price: "Free",
    tags: ["Impact", "Analytics", "Evaluation"],
  },
];

const categories = [
  "All",
  "Leadership",
  "Health",
  "Fundraising",
  "Marketing",
  "Management",
  "Analytics",
];

export default function EducationPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredResources, setFilteredResources] =
    useState(educationResources);

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    if (category === "All") {
      setFilteredResources(educationResources);
    } else {
      setFilteredResources(
        educationResources.filter((resource) => resource.category === category),
      );
    }
  };

  const stats = [
    { title: "Free Courses", value: "50+", icon: <BookOutlined /> },
    { title: "Active Learners", value: "2,847", icon: <UserOutlined /> },
    { title: "Completion Rate", value: "94%", icon: <TrophyOutlined /> },
    { title: "Expert Instructors", value: "25+", icon: <TeamOutlined /> },
  ];

  return (
    <MainLayout>
      <div className="page-container">
        {/* Hero Section */}
        <section className="education-hero">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="page-hero-content"
          >
            <motion.div variants={fadeInUp}>
              <Title level={1} className="page-hero-title">
                Learn to Lead Change
              </Title>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Paragraph className="page-hero-description">
                Access free educational resources designed to help you create
                meaningful impact in your community. From organizing basics to
                advanced leadership skills.
              </Paragraph>
            </motion.div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="about-section">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="page-content-container"
          >
            <Row gutter={[32, 32]} className="stats-row">
              {stats.map((stat, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                  <motion.div variants={fadeInUp}>
                    <Card
                      className="feature-card"
                      style={{ textAlign: "center" }}
                    >
                      <div className="feature-icon bg-gradient-to-r from-blue-400 to-purple-500">
                        {React.cloneElement(stat.icon, {
                          style: { fontSize: "32px", color: "white" },
                        })}
                      </div>
                      <Title
                        level={3}
                        style={{ color: "#1890ff", margin: "16px 0 8px" }}
                      >
                        {stat.value}
                      </Title>
                      <Text style={{ color: "#666", fontSize: "16px" }}>
                        {stat.title}
                      </Text>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </section>

        {/* Resources Section */}
        <section className="education-content">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="page-content-container"
          >
            <motion.div variants={fadeInUp} className="section-header">
              <Title level={2} className="section-title">
                Educational Resources
              </Title>
              <Paragraph className="section-description">
                Comprehensive learning materials to help you become an effective
                community leader and changemaker.
              </Paragraph>
            </motion.div>

            {/* Category Filter */}
            <motion.div
              variants={fadeInUp}
              style={{ marginBottom: "40px", textAlign: "center" }}
            >
              <Space wrap>
                {categories.map((category) => (
                  <Button
                    key={category}
                    type={selectedCategory === category ? "primary" : "default"}
                    onClick={() => handleCategoryFilter(category)}
                    style={{ borderRadius: "20px" }}
                  >
                    {category}
                  </Button>
                ))}
              </Space>
            </motion.div>

            {/* Resources Grid */}
            <Row gutter={[24, 24]} className="features-grid">
              {filteredResources.map((resource, index) => (
                <Col xs={24} md={12} lg={8} key={resource.id}>
                  <motion.div variants={fadeInUp}>
                    <Card className="resource-card" hoverable>
                      <div className="resource-image">
                        <img src={resource.image} alt={resource.title} />
                        <Tag
                          color="blue"
                          style={{
                            position: "absolute",
                            top: "12px",
                            left: "12px",
                            zIndex: 2,
                          }}
                        >
                          {resource.type}
                        </Tag>
                      </div>

                      <div className="resource-content">
                        <Text className="resource-category">
                          {resource.category}
                        </Text>

                        <Title level={4} className="resource-title">
                          {resource.title}
                        </Title>

                        <Paragraph className="resource-description">
                          {resource.description}
                        </Paragraph>

                        <div style={{ marginBottom: "16px" }}>
                          <Space wrap>
                            {resource.tags.map((tag) => (
                              <Tag key={tag} style={{ borderRadius: "12px" }}>
                                {tag}
                              </Tag>
                            ))}
                          </Space>
                        </div>

                        <div className="resource-meta">
                          <div>
                            <Space>
                              <Rate
                                disabled
                                defaultValue={resource.rating}
                                allowHalf
                                style={{ fontSize: "14px" }}
                              />
                              <Text type="secondary">
                                ({resource.students} students)
                              </Text>
                            </Space>
                            <br />
                            <Space style={{ marginTop: "8px" }}>
                              <ClockCircleOutlined />
                              <Text type="secondary">{resource.duration}</Text>
                            </Space>
                          </div>
                          <div>
                            <Text
                              strong
                              style={{ color: "#52c41a", fontSize: "16px" }}
                            >
                              {resource.price}
                            </Text>
                          </div>
                        </div>

                        <div style={{ marginTop: "16px" }}>
                          <Space
                            style={{
                              width: "100%",
                              justifyContent: "space-between",
                            }}
                          >
                            <Button
                              type="primary"
                              icon={<PlayCircleOutlined />}
                            >
                              Start Learning
                            </Button>
                            <Space>
                              <Button type="text" icon={<DownloadOutlined />} />
                              <Button type="text" icon={<ShareAltOutlined />} />
                            </Space>
                          </Space>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
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
                Ready to Start Learning?
              </Title>
              <Paragraph className="cta-description">
                Join thousands of changemakers who are developing their skills
                to create lasting positive impact in their communities.
              </Paragraph>
              <Space size="large" className="cta-actions">
                <Button
                  type="primary"
                  size="large"
                  icon={<BookOutlined />}
                  className="btn-primary-large"
                >
                  Browse All Courses
                </Button>
                <Button
                  size="large"
                  icon={<TeamOutlined />}
                  className="btn-secondary-large"
                >
                  <Link href="/contact">Become an Instructor</Link>
                </Button>
              </Space>
            </div>
          </motion.div>
        </section>
      </div>
    </MainLayout>
  );
}
