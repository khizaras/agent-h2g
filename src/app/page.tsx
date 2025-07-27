"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Button,
  Card,
  Row,
  Col,
  Typography,
  Space,
  Avatar,
  Rate,
} from "antd";
import {
  FiHeart,
  FiUsers,
  FiShield,
  FiArrowRight,
  FiTrendingUp,
  FiGlobe,
  FiTarget,
  FiCheckCircle,
} from "react-icons/fi";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";

const { Title, Paragraph, Text } = Typography;

// Simple animated counter with basic counting
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (count < value) {
        setCount(Math.min(count + Math.ceil(value / 50), value));
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [count, value]);

  return (
    <span>
      {count.toLocaleString()}{suffix}
    </span>
  );
}



export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const features = [
    {
      icon: <FiHeart size={40} />,
      title: "Community Driven",
      description: "Connect with like-minded individuals working together to make a real difference in local communities.",
      color: "#52c41a",
    },
    {
      icon: <FiShield size={40} />,
      title: "Safe & Transparent",
      description: "Every donation is tracked with complete transparency. See exactly how your contributions create impact.",
      color: "#1890ff",
    },
    {
      icon: <FiTrendingUp size={40} />,
      title: "Proven Results",
      description: "Join thousands who have already created measurable change. Your impact starts immediately.",
      color: "#722ed1",
    },
  ];

  const stats = [
    {
      value: 25420,
      label: "Lives Impacted",
      icon: <FiUsers size={32} />,
      color: "#52c41a",
    },
    {
      value: 1450,
      label: "Meals Provided",
      icon: <FiHeart size={32} />,
      color: "#1890ff",
    },
    {
      value: 156,
      label: "Active Causes",
      icon: <FiTarget size={32} />,
      color: "#722ed1",
    },
    {
      value: 89,
      label: "Communities",
      icon: <FiGlobe size={32} />,
      color: "#fa8c16",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Community Volunteer",
      content: "Hands2gether made it simple to connect with families in need. I've helped organize meal distributions for over 150 households.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Michael Chen",
      role: "Cause Creator",
      content: "The platform made launching our food rescue program effortless. We've saved over 10,000 pounds of food from waste.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Emily Rodriguez",
      role: "Monthly Donor",
      content: "The transparency is incredible. I can see exactly how my contributions create real impact in my community.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
    },
  ];

  const featuredCauses = [
    {
      id: 1,
      title: "Weekend Meals for Families",
      description: "Providing nutritious weekend meals for children who rely on school meal programs.",
      goal: 5000,
      raised: 3250,
      supporters: 45,
      image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&h=600&fit=crop",
    },
    {
      id: 2,
      title: "Senior Grocery Support",
      description: "Helping elderly community members access fresh groceries and essential supplies.",
      goal: 3000,
      raised: 2100,
      supporters: 32,
      image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=600&fit=crop",
    },
    {
      id: 3,
      title: "Mobile Food Pantry",
      description: "Bringing fresh food directly to underserved neighborhoods in our community.",
      goal: 8000,
      raised: 4800,
      supporters: 78,
      image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&h=600&fit=crop",
    },
  ];

  if (!mounted) return null;

  return (
    <MainLayout>
      <div className="modern-home-page">
        {/* Hero Section */}
        <section className="modern-hero">
          <div className="modern-hero-content">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="hero-text"
            >
              <Title level={1} className="modern-hero-title">
                Building stronger communities,
                <span className="title-highlight"> together</span>
              </Title>
              
              <Paragraph className="modern-hero-subtitle">
                Connect with your community to fight hunger and create lasting change. 
                Every contribution matters, every action counts.
              </Paragraph>

              <div className="hero-actions">
                <Link href="/causes">
                  <Button type="primary" size="large" className="modern-btn-primary">
                    <FiHeart style={{ marginRight: 8 }} />
                    Explore Causes
                  </Button>
                </Link>
                <Link href="/causes/create">
                  <Button size="large" className="modern-btn-secondary">
                    Create a Cause
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="trust-indicators"
            >
              <Space size="large">
                <div className="trust-item">
                  <FiShield size={20} />
                  <span>Secure Platform</span>
                </div>
                <div className="trust-item">
                  <FiCheckCircle size={20} />
                  <span>Verified Causes</span>
                </div>
                <div className="trust-item">
                  <FiGlobe size={20} />
                  <span>Global Community</span>
                </div>
              </Space>
            </motion.div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="modern-stats-section">
          <div className="container">
            <Row gutter={[32, 32]}>
              {stats.map((stat, index) => (
                <Col xs={12} md={6} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="stat-card"
                  >
                    <div className="stat-icon" style={{ color: stat.color }}>
                      {stat.icon}
                    </div>
                    <div className="stat-number">
                      <AnimatedCounter value={stat.value} />
                    </div>
                    <div className="stat-label">{stat.label}</div>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        {/* Features Section */}
        <section className="modern-features-section">
          <div className="container">
            <div className="section-header">
              <Title level={2} className="section-title">
                Why Choose Hands2gether?
              </Title>
              <Paragraph className="section-subtitle">
                Simple, transparent, and effective community support
              </Paragraph>
            </div>

            <Row gutter={[32, 32]}>
              {features.map((feature, index) => (
                <Col xs={24} md={8} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="modern-feature-card">
                      <div className="feature-icon" style={{ color: feature.color }}>
                        {feature.icon}
                      </div>
                      <Title level={4} className="feature-title">
                        {feature.title}
                      </Title>
                      <Paragraph className="feature-description">
                        {feature.description}
                      </Paragraph>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        {/* Featured Causes Section */}
        <section className="modern-causes-section">
          <div className="container">
            <div className="section-header">
              <Title level={2} className="section-title">
                Featured Causes
              </Title>
              <Paragraph className="section-subtitle">
                Support meaningful initiatives in your community
              </Paragraph>
            </div>

            <Row gutter={[24, 24]}>
              {featuredCauses.map((cause, index) => (
                <Col xs={24} md={8} key={cause.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="modern-cause-card" hoverable>
                      <div className="cause-image">
                        <img src={cause.image} alt={cause.title} />
                      </div>
                      <div className="cause-content">
                        <Title level={4} className="cause-title">
                          {cause.title}
                        </Title>
                        <Paragraph className="cause-description">
                          {cause.description}
                        </Paragraph>
                        
                        <div className="cause-progress">
                          <div className="progress-info">
                            <Text strong>${cause.raised.toLocaleString()}</Text>
                            <Text type="secondary"> of ${cause.goal.toLocaleString()}</Text>
                          </div>
                          <div className="progress-bar">
                            <div 
                              className="progress-fill" 
                              style={{ width: `${(cause.raised / cause.goal) * 100}%` }}
                            />
                          </div>
                          <Text type="secondary" className="supporters">
                            {cause.supporters} supporters
                          </Text>
                        </div>

                        <Link href={`/causes/${cause.id}`}>
                          <Button type="primary" block className="modern-btn-primary">
                            Support This Cause
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>

            <div className="causes-cta">
              <Link href="/causes">
                <Button size="large" className="modern-btn-secondary">
                  View All Causes
                  <FiArrowRight style={{ marginLeft: 8 }} />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="modern-testimonials-section">
          <div className="container">
            <div className="section-header">
              <Title level={2} className="section-title">
                Community Stories
              </Title>
              <Paragraph className="section-subtitle">
                Real impact from real people in our community
              </Paragraph>
            </div>

            <Row gutter={[24, 24]}>
              {testimonials.map((testimonial, index) => (
                <Col xs={24} md={8} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="modern-testimonial-card">
                      <Rate disabled defaultValue={testimonial.rating} className="rating" />
                      
                      <Paragraph className="testimonial-content">
                        "{testimonial.content}"
                      </Paragraph>

                      <div className="testimonial-author">
                        <Avatar size={48} src={testimonial.avatar} />
                        <div className="author-info">
                          <Text strong className="author-name">
                            {testimonial.name}
                          </Text>
                          <Text type="secondary" className="author-role">
                            {testimonial.role}
                          </Text>
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
        <section className="modern-cta-section">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="cta-content"
            >
              <Title level={2} className="cta-title">
                Ready to Make a Difference?
              </Title>
              <Paragraph className="cta-description">
                Join thousands of community members creating positive change. 
                Every action counts, every contribution matters.
              </Paragraph>
              <div className="cta-actions">
                <Link href="/auth/signup">
                  <Button type="primary" size="large" className="modern-btn-primary">
                    <FiUsers style={{ marginRight: 8 }} />
                    Join Community
                  </Button>
                </Link>
                <Link href="/causes/create">
                  <Button size="large" className="modern-btn-secondary">
                    Start a Cause
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
