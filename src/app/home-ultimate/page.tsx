"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Button,
  Card,
  Row,
  Col,
  Tag,
  Avatar,
  Rate,
  Progress,
  Typography,
} from "antd";
import {
  FiHeart,
  FiUsers,
  FiPlay,
  FiDollarSign,
  FiGlobe,
  FiTrendingUp,
  FiCheckCircle,
  FiFacebook,
  FiInstagram,
  FiLinkedin,
  FiShield,
  FiZap,
} from "react-icons/fi";
import { MainLayout } from "@/components/layout/MainLayout";

const { Title, Paragraph, Text } = Typography;

interface Cause {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  raised: number;
  goal: number;
  backers: number;
  daysLeft: number;
  urgent?: boolean;
  trending?: boolean;
  verified?: boolean;
}

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}

interface Testimonial {
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
  location: string;
  verified: boolean;
}

export default function HomeUltimatePage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const features: Feature[] = [
    {
      icon: <FiUsers />,
      title: "Community-Driven",
      description:
        "Connect with like-minded individuals in your area who share your passion for making a positive impact.",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      icon: <FiShield />,
      title: "Trust & Transparency",
      description:
        "Every cause is verified and tracked with complete transparency. Your contributions are always secure and accountable.",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      icon: <FiZap />,
      title: "Real-Time Impact",
      description:
        "See the immediate impact of your contributions with live updates and direct feedback from beneficiaries.",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
  ];

  const enhancedCauses: Cause[] = [
    {
      id: 1,
      title: "Emergency Food Relief for Hurricane Victims",
      description:
        "Providing immediate food assistance to families affected by recent hurricanes in the Gulf Coast region.",
      image:
        "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=250&fit=crop",
      category: "Food",
      raised: 85000,
      goal: 120000,
      backers: 420,
      daysLeft: 12,
      urgent: true,
      trending: true,
      verified: true,
    },
    {
      id: 2,
      title: "School Lunch Program for Underprivileged Children",
      description:
        "Ensuring nutritious meals for students in low-income areas to support their education and development.",
      image:
        "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=250&fit=crop",
      category: "Education",
      raised: 42000,
      goal: 60000,
      backers: 280,
      daysLeft: 25,
      trending: true,
      verified: true,
    },
    {
      id: 3,
      title: "Community Garden Initiative",
      description:
        "Building sustainable community gardens to provide fresh produce and teach agricultural skills.",
      image:
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=250&fit=crop",
      category: "Environment",
      raised: 18500,
      goal: 35000,
      backers: 156,
      daysLeft: 18,
      verified: true,
    },
  ];

  const testimonials: Testimonial[] = [
    {
      name: "Maria Rodriguez",
      role: "Community Volunteer",
      content:
        "This platform has revolutionized how we coordinate food relief in our neighborhood. The real-time tracking and community engagement features are game-changers.",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      location: "Austin, TX",
      verified: true,
    },
    {
      name: "David Kim",
      role: "Local Business Owner",
      content:
        "Through Hands2gether, our restaurant has been able to donate surplus food efficiently. We've helped feed over 800 families this year alone.",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      location: "Seattle, WA",
      verified: true,
    },
    {
      name: "Sarah Johnson",
      role: "Single Mother",
      content:
        "When I lost my job during the pandemic, this community stepped up. Not only did they provide food, but they connected me with job opportunities.",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      location: "Denver, CO",
      verified: true,
    },
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  // Enhanced Cause Card Component
  const EnhancedCauseCard: React.FC<{ cause: Cause }> = ({ cause }) => {
    const progressPercent = Math.round((cause.raised / cause.goal) * 100);

    return (
      <Card className="ultimate-card" bordered={false}>
        <div className="ultimate-card-image">
          <img src={cause.image} alt={cause.title} />

          {/* Status badges */}
          <div
            style={{
              position: "absolute",
              top: "16px",
              left: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {cause.urgent && (
              <Tag color="red" style={{ fontWeight: "600" }}>
                URGENT
              </Tag>
            )}
            {cause.trending && (
              <Tag icon={<FiTrendingUp size={12} />} color="orange">
                Trending
              </Tag>
            )}
            {cause.verified && (
              <Tag icon={<FiCheckCircle size={12} />} color="blue">
                Verified
              </Tag>
            )}
          </div>
        </div>

        <div className="ultimate-card-content">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <Tag color="green">{cause.category}</Tag>
            <Text
              style={{ color: "#ff4d4f", fontWeight: "600", fontSize: "14px" }}
            >
              {cause.daysLeft} days left
            </Text>
          </div>

          <Title level={4} style={{ marginBottom: "12px", lineHeight: "1.3" }}>
            {cause.title}
          </Title>

          <Paragraph
            style={{ color: "#666", marginBottom: "20px", fontSize: "14px" }}
          >
            {cause.description}
          </Paragraph>

          {/* Progress Section */}
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <Text style={{ fontWeight: "700", color: "#1a1a1a" }}>
                ${cause.raised.toLocaleString()}
              </Text>
              <Text style={{ color: "#52c41a", fontWeight: "600" }}>
                {progressPercent}%
              </Text>
            </div>

            <Progress
              percent={progressPercent}
              showInfo={false}
              strokeColor={{
                "0%": "#52c41a",
                "100%": "#73d13d",
              }}
              style={{ marginBottom: "8px" }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
                color: "#999",
              }}
            >
              <span>Goal: ${cause.goal.toLocaleString()}</span>
              <span>{cause.backers} backers</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <Button
              type="primary"
              className="hero-btn-primary"
              style={{ flex: 1 }}
            >
              Support Now
            </Button>
            <Button style={{ borderColor: "#d9d9d9", color: "#666" }}>
              <FiHeart />
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <MainLayout>
      <div className="modern-home-page">
        {/* Hero Section */}
        <section className="ultimate-hero-section">
          <img
            src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1920&h=1080&fit=crop"
            alt="Community helping hands"
            className="ultimate-hero-bg"
          />
          <div className="ultimate-hero-overlay" />

          <div className="ultimate-hero-content">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="hero-title">
                Together We Make a{" "}
                <span className="hero-title-accent">Difference</span>
              </h1>

              <p className="hero-subtitle">
                Join our community-driven platform where every contribution
                creates meaningful impact. From food assistance to education
                support, your help changes lives.
              </p>

              <div className="hero-actions">
                <Button
                  className="btn-hero-primary"
                  size="large"
                  icon={<FiHeart />}
                >
                  Start Helping Today
                </Button>
                <Button
                  className="btn-hero-secondary"
                  size="large"
                  icon={<FiPlay />}
                >
                  Watch Our Story
                </Button>
              </div>
            </motion.div>

            {/* Enhanced Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="cause-stats-enhanced"
            >
              <div className="stat-item-enhanced">
                <div className="stat-icon-container">
                  <FiUsers className="stat-icon-enhanced" />
                </div>
                <div className="stat-content-enhanced">
                  <div className="stat-number-enhanced">10,000+</div>
                  <div className="stat-label-enhanced">Lives Touched</div>
                </div>
              </div>

              <div className="stat-item-enhanced">
                <div className="stat-icon-container">
                  <FiDollarSign className="stat-icon-enhanced" />
                </div>
                <div className="stat-content-enhanced">
                  <div className="stat-number-enhanced">$2.5M+</div>
                  <div className="stat-label-enhanced">Funds Raised</div>
                </div>
              </div>

              <div className="stat-item-enhanced">
                <div className="stat-icon-container">
                  <FiHeart className="stat-icon-enhanced" />
                </div>
                <div className="stat-content-enhanced">
                  <div className="stat-number-enhanced">500+</div>
                  <div className="stat-label-enhanced">Active Causes</div>
                </div>
              </div>

              <div className="stat-item-enhanced">
                <div className="stat-icon-container">
                  <FiGlobe className="stat-icon-enhanced" />
                </div>
                <div className="stat-content-enhanced">
                  <div className="stat-number-enhanced">50+</div>
                  <div className="stat-label-enhanced">Communities</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="ultimate-section ultimate-section-bg">
          <div className="ultimate-container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              style={{ textAlign: "center", marginBottom: "60px" }}
            >
              <h2
                style={{
                  fontSize: "2.5rem",
                  fontWeight: 700,
                  marginBottom: "16px",
                  color: "#1a1a1a",
                }}
              >
                How We're Making an Impact
              </h2>
              <p
                style={{
                  fontSize: "1.2rem",
                  color: "#666",
                  maxWidth: "600px",
                  margin: "0 auto",
                }}
              >
                Our platform connects generous hearts with meaningful causes,
                creating lasting change in communities worldwide.
              </p>
            </motion.div>

            <Row gutter={[32, 32]}>
              {features.map((feature, index) => (
                <Col key={index} xs={24} md={8}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="ultimate-card" bordered={false}>
                      <div
                        style={{ textAlign: "center", padding: "40px 24px" }}
                      >
                        <div
                          style={{
                            fontSize: "3rem",
                            marginBottom: "24px",
                            background: feature.gradient,
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                          }}
                        >
                          {feature.icon}
                        </div>
                        <h3
                          style={{
                            fontSize: "1.5rem",
                            fontWeight: 600,
                            marginBottom: "16px",
                            color: "#1a1a1a",
                          }}
                        >
                          {feature.title}
                        </h3>
                        <p style={{ color: "#666", lineHeight: 1.6 }}>
                          {feature.description}
                        </p>
                      </div>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        {/* Enhanced Causes Section */}
        <section className="ultimate-section ultimate-section-alt">
          <div className="ultimate-container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              style={{ textAlign: "center", marginBottom: "60px" }}
            >
              <h2
                style={{
                  fontSize: "2.5rem",
                  fontWeight: 700,
                  marginBottom: "16px",
                  color: "#1a1a1a",
                }}
              >
                Featured Causes Making a Difference
              </h2>
              <p
                style={{
                  fontSize: "1.2rem",
                  color: "#666",
                  maxWidth: "600px",
                  margin: "0 auto",
                }}
              >
                Discover inspiring stories and join causes that are creating
                real impact in communities around the world.
              </p>
            </motion.div>

            <Row gutter={[24, 24]}>
              {enhancedCauses.map((cause, index) => (
                <Col key={cause.id} xs={24} md={12} lg={8}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    style={{ height: "100%" }}
                  >
                    <EnhancedCauseCard cause={cause} />
                  </motion.div>
                </Col>
              ))}
            </Row>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              style={{ textAlign: "center", marginTop: "60px" }}
            >
              <Button className="hero-btn-primary" size="large">
                Explore All Causes
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Voices from Our Community */}
        <section className="ultimate-section ultimate-section-bg">
          <div className="ultimate-container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              style={{ textAlign: "center", marginBottom: "60px" }}
            >
              <h2
                style={{
                  fontSize: "2.5rem",
                  fontWeight: 700,
                  marginBottom: "16px",
                  color: "#1a1a1a",
                }}
              >
                Voices from Our Community
              </h2>
              <p
                style={{
                  fontSize: "1.2rem",
                  color: "#666",
                  maxWidth: "600px",
                  margin: "0 auto",
                }}
              >
                Real stories from people whose lives have been transformed
                through the generosity of our community.
              </p>
            </motion.div>

            <Row gutter={[24, 24]}>
              {testimonials.map((testimonial, index) => (
                <Col key={index} xs={24} md={12} lg={8}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    style={{ height: "100%" }}
                  >
                    <Card
                      className="ultimate-testimonial-card"
                      bordered={false}
                    >
                      <div style={{ marginBottom: "20px" }}>
                        <Rate
                          disabled
                          defaultValue={5}
                          style={{ fontSize: "16px" }}
                        />
                      </div>

                      <p
                        style={{
                          fontStyle: "italic",
                          color: "#666",
                          lineHeight: 1.6,
                          marginBottom: "24px",
                          fontSize: "16px",
                        }}
                      >
                        "{testimonial.content}"
                      </p>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "16px",
                        }}
                      >
                        <Avatar size={48} src={testimonial.avatar} />
                        <div>
                          <div
                            style={{
                              fontWeight: 600,
                              color: "#1a1a1a",
                              marginBottom: "4px",
                            }}
                          >
                            {testimonial.name}
                          </div>
                          <div style={{ fontSize: "14px", color: "#666" }}>
                            {testimonial.role}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        {/* CTA Section */}
        <section
          style={{
            background: "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)",
            color: "white",
            padding: "100px 0",
          }}
        >
          <div className="ultimate-container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              style={{
                textAlign: "center",
                maxWidth: "800px",
                margin: "0 auto",
              }}
            >
              <h2
                style={{
                  color: "white",
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  fontWeight: 700,
                  marginBottom: "24px",
                }}
              >
                Ready to Make a Difference?
              </h2>

              <p
                style={{
                  color: "rgba(255, 255, 255, 0.9)",
                  fontSize: "1.2rem",
                  marginBottom: "40px",
                  lineHeight: 1.6,
                }}
              >
                Join thousands of compassionate individuals who are creating
                positive change in their communities. Every contribution, no
                matter the size, makes a meaningful impact.
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <Button
                  size="large"
                  style={{
                    background: "white",
                    color: "#52c41a",
                    border: "none",
                    fontWeight: 600,
                    height: "56px",
                    padding: "0 32px",
                    borderRadius: "28px",
                  }}
                >
                  Start Your Journey
                </Button>
                <Button
                  size="large"
                  style={{
                    background: "transparent",
                    color: "white",
                    border: "2px solid white",
                    fontWeight: 600,
                    height: "56px",
                    padding: "0 32px",
                    borderRadius: "28px",
                  }}
                >
                  Learn More
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="ultimate-footer">
          <div className="ultimate-footer-content">
            <div className="ultimate-footer-grid">
              <div className="ultimate-footer-section">
                <h4>Hands2gether</h4>
                <p>
                  Connecting hearts, changing lives. We're a community-driven
                  platform dedicated to making meaningful impact through
                  collective action and compassion.
                </p>
                <div className="ultimate-social-links">
                  <a href="#" className="ultimate-social-link">
                    <FiFacebook />
                  </a>
                  <a href="#" className="ultimate-social-link">
                    <FiGlobe />
                  </a>
                  <a href="#" className="ultimate-social-link">
                    <FiInstagram />
                  </a>
                  <a href="#" className="ultimate-social-link">
                    <FiLinkedin />
                  </a>
                </div>
              </div>

              <div className="ultimate-footer-section">
                <h4>Get Involved</h4>
                <ul>
                  <li>
                    <a href="/causes">Browse Causes</a>
                  </li>
                  <li>
                    <a href="/causes/create">Start a Cause</a>
                  </li>
                  <li>
                    <a href="#">Volunteer</a>
                  </li>
                  <li>
                    <a href="#">Donate</a>
                  </li>
                  <li>
                    <a href="#">Partner with Us</a>
                  </li>
                </ul>
              </div>

              <div className="ultimate-footer-section">
                <h4>Resources</h4>
                <ul>
                  <li>
                    <a href="/education">Learning Center</a>
                  </li>
                  <li>
                    <a href="#">Success Stories</a>
                  </li>
                  <li>
                    <a href="#">Community Guidelines</a>
                  </li>
                  <li>
                    <a href="#">Safety & Trust</a>
                  </li>
                  <li>
                    <a href="#">Help Center</a>
                  </li>
                </ul>
              </div>

              <div className="ultimate-footer-section">
                <h4>Company</h4>
                <ul>
                  <li>
                    <a href="/about">About Us</a>
                  </li>
                  <li>
                    <a href="/contact">Contact</a>
                  </li>
                  <li>
                    <a href="#">Careers</a>
                  </li>
                  <li>
                    <a href="#">Press</a>
                  </li>
                  <li>
                    <a href="#">Terms of Service</a>
                  </li>
                  <li>
                    <a href="#">Privacy Policy</a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="ultimate-footer-divider">
              <div className="ultimate-footer-bottom">
                <p>&copy; 2024 Hands2gether. All rights reserved.</p>
                <p>Made with ❤️ for communities worldwide</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </MainLayout>
  );
}
