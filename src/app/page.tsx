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
  Spin,
  Tag,
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
  FiPlay,
  FiDollarSign,
  FiAward,
  FiStar,
  FiPlus,
} from "react-icons/fi";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchFeaturedCauses,
  selectFeaturedCauses,
  selectCausesLoading,
} from "@/store/slices/causesSlice";

const { Title, Paragraph, Text } = Typography;

// Simple animated counter with basic counting
function AnimatedCounter({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
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
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function HomePage() {
  const dispatch = useAppDispatch();
  const featuredCauses = useAppSelector(selectFeaturedCauses) || [];
  const loading = useAppSelector(selectCausesLoading);
  const [mounted, setMounted] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mounted) {
      dispatch(fetchFeaturedCauses());
    }
  }, [dispatch, mounted]);

  const features = [
    {
      icon: <FiHeart size={40} />,
      title: "Community Driven",
      description:
        "Connect with like-minded individuals working together to make a real difference in local communities.",
      color: "#52c41a",
    },
    {
      icon: <FiShield size={40} />,
      title: "Safe & Transparent",
      description:
        "Every donation is tracked with complete transparency. See exactly how your contributions create impact.",
      color: "#1890ff",
    },
    {
      icon: <FiTrendingUp size={40} />,
      title: "Proven Results",
      description:
        "Join thousands who have already created measurable change. Your impact starts immediately.",
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
      content:
        "Hands2gether made it simple to connect with families in need. I've helped organize meal distributions for over 150 households.",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Michael Chen",
      role: "Cause Creator",
      content:
        "The platform made launching our food rescue program effortless. We've saved over 10,000 pounds of food from waste.",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Emily Rodriguez",
      role: "Monthly Donor",
      content:
        "The transparency is incredible. I can see exactly how my contributions create real impact in my community.",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
    },
  ];

  if (!mounted) return null;

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
            alt="Community helping hands"
          />
          <div className="hero-overlay" />
          <div className="container-standard">
            <div className="card-content-hero">
              <motion.h1
                className="hero-title"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Building <span className="hero-title-accent">Communities</span>{" "}
                Together
              </motion.h1>
              <motion.p
                className="hero-subtitle"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Connect with your neighbors, create meaningful causes, and make
                a lasting impact in your community through the power of
                collective action.
              </motion.p>
              <motion.div
                className="hero-actions-section"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <div className="hero-actions">
                  <Link href="/causes">
                    <Button className="btn-hero-primary">
                      <FiHeart style={{ marginRight: "8px" }} />
                      Explore Causes
                    </Button>
                  </Link>
                  <Link href="/causes/create">
                    <Button className="btn-hero-secondary">
                      <FiPlay style={{ marginRight: "8px" }} />
                      Create a Cause
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section
          className="section-wrapper"
          style={{ background: "var(--bg-secondary)" }}
        >
          <div className="container-standard">
            <motion.div
              className="grid-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="card-hero"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div
                    className="feature-icon-wrapper"
                    style={{ background: stat.color, marginBottom: "16px" }}
                  >
                    {stat.icon}
                  </div>
                  <h3 className="card-title mb-xs">
                    <AnimatedCounter value={stat.value} />
                  </h3>
                  <p className="card-subtitle mb-0">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="section-wrapper">
          <div className="container-standard">
            <div className="section-header">
              <h2 className="section-title">Why Choose Hands2gether?</h2>
              <p className="section-subtitle">
                Our platform makes it easy to create meaningful change in your
                community with powerful tools and unwavering support.
              </p>
            </div>

            <div className="grid-3">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="card-feature"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <div
                    className="feature-icon-wrapper"
                    style={{ background: feature.color }}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="card-title">{feature.title}</h3>
                  <p className="card-subtitle">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Causes Section */}
        <section
          className="section-wrapper"
          style={{ background: "var(--bg-secondary)" }}
        >
          <div className="container-standard">
            <div className="section-header">
              <h2 className="section-title">Featured Causes</h2>
              <p className="section-subtitle">
                Discover urgent causes making real impact in communities
                worldwide
              </p>
            </div>

            {loading ? (
              <div className="text-center p-xl">
                <Spin size="large" />
              </div>
            ) : (
              <div className="grid-3">
                {featuredCauses.slice(0, 3).map((cause, index) => (
                  <motion.div
                    key={cause.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    viewport={{ once: true }}
                  >
                    <Card className="card-modern">
                      <div className="card-image">
                        <img
                          src={
                            cause.image ||
                            "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=250&fit=crop"
                          }
                          alt={cause.title}
                        />
                        <div
                          style={{
                            position: "absolute",
                            top: "16px",
                            left: "16px",
                          }}
                        >
                          <Tag color="green">
                            {String(cause.category?.name || cause.category)}
                          </Tag>
                        </div>
                      </div>
                      <div className="card-content">
                        <h3 className="card-title">{cause.title}</h3>
                        <p className="card-subtitle mb-lg">
                          {cause.description}
                        </p>
                        <div className="flex-between mb-md">
                          <Text strong>
                            ${(cause as any).raised?.toLocaleString() || "0"}
                          </Text>
                          <Text type="secondary">
                            of ${(cause as any).goal?.toLocaleString() || "0"}
                          </Text>
                        </div>
                        <div
                          style={{
                            background: "#f0f0f0",
                            height: "8px",
                            borderRadius: "4px",
                            marginBottom: "16px",
                          }}
                        >
                          <div
                            style={{
                              background: "var(--brand-primary)",
                              height: "8px",
                              borderRadius: "4px",
                              width: `${Math.min(((cause as any).raised / (cause as any).goal) * 100 || 0, 100)}%`,
                            }}
                          />
                        </div>
                        <Link href={`/causes/${cause.id}`}>
                          <Button className="btn-primary-large" block>
                            <FiHeart style={{ marginRight: "8px" }} />
                            Support This Cause
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            <div className="text-center mt-xl">
              <Link href="/causes">
                <Button className="btn-secondary-large">
                  <FiArrowRight style={{ marginRight: "8px" }} />
                  View All Causes
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="section-wrapper">
          <div className="container-standard">
            <div className="section-header">
              <h2 className="section-title">Community Stories</h2>
              <p className="section-subtitle">
                Real stories from real people making a difference every day
              </p>
            </div>

            <div className="grid-2">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="card-testimonial"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="flex mb-md">
                    <Avatar
                      src={testimonial.avatar}
                      size={64}
                      style={{ marginRight: "16px" }}
                    />
                    <div>
                      <Text strong style={{ fontSize: "18px" }}>
                        {testimonial.name}
                      </Text>
                      <br />
                      <Text type="secondary">{testimonial.role}</Text>
                      <br />
                      <Rate
                        disabled
                        defaultValue={testimonial.rating}
                        style={{ fontSize: "14px" }}
                      />
                    </div>
                  </div>
                  <p className="card-subtitle">"{testimonial.content}"</p>
                </motion.div>
              ))}
            </div>
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
              <h2 className="cta-title">Ready to Make a Difference?</h2>
              <p className="cta-description">
                Join thousands of community members who are already creating
                positive change. Start your impact journey today.
              </p>
              <div className="cta-actions">
                <Link href="/causes">
                  <Button className="cta-btn-primary">
                    <FiHeart style={{ marginRight: "8px" }} />
                    Explore Causes
                  </Button>
                </Link>
                <Link href="/causes/create">
                  <Button className="cta-btn-secondary">
                    <FiPlus style={{ marginRight: "8px" }} />
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
