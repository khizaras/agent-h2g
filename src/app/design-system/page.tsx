"use client";

import React from "react";
import { Button, Card, Typography, Space, Row, Col, Tag, Avatar } from "antd";
import { motion } from "framer-motion";
import {
  FiHeart,
  FiUsers,
  FiDollarSign,
  FiTrendingUp,
  FiStar,
  FiShield,
  FiGlobe,
  FiCheckCircle,
  FiPlay,
} from "react-icons/fi";
import { MainLayout } from "@/components/layout/MainLayout";

const { Title, Paragraph, Text } = Typography;

export default function DesignSystemPage() {
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
                Design System{" "}
                <span className="hero-title-accent">Showcase</span>
              </motion.h1>
              <motion.p
                className="hero-subtitle"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Comprehensive design tokens, components, and patterns for
                building beautiful, consistent user interfaces across the
                Hands2gether platform.
              </motion.p>
              <motion.div
                className="hero-actions-section"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <div className="hero-actions">
                  <Button className="btn-hero-primary">
                    <FiHeart className="mr-2" />
                    Primary Action
                  </Button>
                  <Button className="btn-hero-secondary">
                    <FiPlay className="mr-2" />
                    Secondary Action
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Typography Section */}
        <section className="section-wrapper">
          <div className="container-standard">
            <div className="section-header">
              <h2 className="section-title">Typography System</h2>
              <p className="section-subtitle">
                Consistent typography scales and styles for improved readability
                and visual hierarchy
              </p>
            </div>

            <Row gutter={[32, 32]}>
              <Col span={12}>
                <Card className="card-modern">
                  <div className="card-content">
                    <h3 className="card-title">Headings</h3>
                    <div style={{ marginBottom: "16px" }}>
                      <h1
                        className="hero-title"
                        style={{
                          color: "#1a1a1a",
                          textShadow: "none",
                          fontSize: "3rem",
                        }}
                      >
                        Hero Title
                      </h1>
                    </div>
                    <div style={{ marginBottom: "16px" }}>
                      <h2
                        className="section-title"
                        style={{ textAlign: "left" }}
                      >
                        Section Title
                      </h2>
                    </div>
                    <div style={{ marginBottom: "16px" }}>
                      <h3 className="card-title">Card Title</h3>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col span={12}>
                <Card className="card-modern">
                  <div className="card-content">
                    <h3 className="card-title">Body Text</h3>
                    <p
                      className="hero-subtitle"
                      style={{ color: "#666666", textShadow: "none" }}
                    >
                      Hero subtitle text with enhanced readability and visual
                      appeal.
                    </p>
                    <p
                      className="section-subtitle"
                      style={{ textAlign: "left" }}
                    >
                      Section subtitle providing context and supporting
                      information.
                    </p>
                    <p className="card-subtitle">
                      Card subtitle with optimal line height for comfortable
                      reading experience.
                    </p>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        </section>

        {/* Button System */}
        <section
          className="section-wrapper"
          style={{ background: "var(--bg-secondary)" }}
        >
          <div className="container-standard">
            <div className="section-header">
              <h2 className="section-title">Button System</h2>
              <p className="section-subtitle">
                Comprehensive button styles for different contexts and actions
              </p>
            </div>

            <Row gutter={[32, 32]}>
              <Col span={8}>
                <Card className="card-modern">
                  <div className="card-content text-center">
                    <h3 className="card-title">Primary Buttons</h3>
                    <Space
                      direction="vertical"
                      size="large"
                      style={{ width: "100%" }}
                    >
                      <Button className="btn-hero-primary" block>
                        <FiHeart style={{ marginRight: "8px" }} />
                        Hero Primary
                      </Button>
                      <Button className="btn-primary-large" block>
                        <FiUsers style={{ marginRight: "8px" }} />
                        Primary Large
                      </Button>
                    </Space>
                  </div>
                </Card>
              </Col>
              <Col span={8}>
                <Card className="card-modern">
                  <div className="card-content text-center">
                    <h3 className="card-title">Secondary Buttons</h3>
                    <Space
                      direction="vertical"
                      size="large"
                      style={{ width: "100%" }}
                    >
                      <Button className="btn-hero-secondary" block>
                        <FiPlay style={{ marginRight: "8px" }} />
                        Hero Secondary
                      </Button>
                      <Button className="btn-secondary-large" block>
                        <FiGlobe style={{ marginRight: "8px" }} />
                        Secondary Large
                      </Button>
                    </Space>
                  </div>
                </Card>
              </Col>
              <Col span={8}>
                <Card className="card-modern">
                  <div className="card-content text-center">
                    <h3 className="card-title">CTA Buttons</h3>
                    <Space
                      direction="vertical"
                      size="large"
                      style={{ width: "100%" }}
                    >
                      <Button className="cta-btn-primary" block>
                        <FiCheckCircle style={{ marginRight: "8px" }} />
                        CTA Primary
                      </Button>
                      <Button className="cta-btn-secondary" block>
                        <FiStar style={{ marginRight: "8px" }} />
                        CTA Secondary
                      </Button>
                    </Space>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        </section>

        {/* Card System */}
        <section className="section-wrapper">
          <div className="container-standard">
            <div className="section-header">
              <h2 className="section-title">Card Components</h2>
              <p className="section-subtitle">
                Versatile card designs for different content types and contexts
              </p>
            </div>

            <Row gutter={[32, 32]}>
              <Col span={8}>
                <Card className="card-modern">
                  <div className="card-image">
                    <img
                      src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=250&fit=crop"
                      alt="Modern card example"
                    />
                  </div>
                  <div className="card-content">
                    <h3 className="card-title mb-md">Modern Card</h3>
                    <p className="card-subtitle">
                      Standard card design with hover effects and modern
                      aesthetics.
                    </p>
                  </div>
                </Card>
              </Col>
              <Col span={8}>
                <div className="card-feature">
                  <div
                    className="feature-icon-wrapper"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    <FiHeart />
                  </div>
                  <h3 className="card-title mb-md">Feature Card</h3>
                  <p className="card-subtitle">
                    Feature-focused card with prominent icon and enhanced hover
                    animations.
                  </p>
                </div>
              </Col>
              <Col span={8}>
                <div className="card-testimonial">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "16px",
                    }}
                  >
                    <Avatar
                      src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
                      size={48}
                      style={{ marginRight: "12px" }}
                    />
                    <div>
                      <Text strong>Sarah Johnson</Text>
                      <br />
                      <Text type="secondary">Community Member</Text>
                    </div>
                  </div>
                  <p className="card-subtitle">
                    "This platform has truly transformed our community's ability
                    to help one another."
                  </p>
                </div>
              </Col>
            </Row>
          </div>
        </section>

        {/* Grid System */}
        <section
          className="section-wrapper"
          style={{ background: "var(--bg-secondary)" }}
        >
          <div className="container-standard">
            <div className="section-header">
              <h2 className="section-title">Grid System</h2>
              <p className="section-subtitle">
                Responsive grid layouts for organizing content effectively
              </p>
            </div>

            <div style={{ marginBottom: "32px" }}>
              <h3 className="card-title mb-lg">4-Column Grid</h3>
              <div className="grid-4">
                {[1, 2, 3, 4].map((item) => (
                  <Card key={item} className="card-modern">
                    <div className="card-content text-center">
                      <h4>Grid Item {item}</h4>
                      <p className="card-subtitle">
                        Responsive grid item that adapts to screen size.
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "32px" }}>
              <h3 className="card-title mb-lg">3-Column Grid</h3>
              <div className="grid-3">
                {[1, 2, 3].map((item) => (
                  <Card key={item} className="card-modern">
                    <div className="card-content text-center">
                      <h4>Grid Item {item}</h4>
                      <p className="card-subtitle">
                        Responsive 3-column layout.
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h3 className="card-title mb-lg">2-Column Grid</h3>
              <div className="grid-2">
                {[1, 2].map((item) => (
                  <Card key={item} className="card-modern">
                    <div className="card-content text-center">
                      <h4>Grid Item {item}</h4>
                      <p className="card-subtitle">
                        Two-column responsive layout.
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
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
              <h2 className="cta-title">Ready to Build Something Amazing?</h2>
              <p className="cta-description">
                Use this comprehensive design system to create consistent,
                beautiful user interfaces that enhance the user experience
                across all platform features.
              </p>
              <div className="cta-actions">
                <Button className="cta-btn-primary">
                  <FiCheckCircle style={{ marginRight: "8px" }} />
                  Get Started
                </Button>
                <Button className="cta-btn-secondary">
                  <FiGlobe style={{ marginRight: "8px" }} />
                  Learn More
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer-modern">
          <div className="container-standard">
            <div className="footer-grid">
              <div className="footer-section">
                <h4>Hands2gether</h4>
                <p>
                  Building stronger communities through collective action and
                  mutual support.
                </p>
                <div className="social-links">
                  <a href="#" className="social-link">
                    <FiGlobe size={18} />
                  </a>
                  <a href="#" className="social-link">
                    <FiHeart size={18} />
                  </a>
                  <a href="#" className="social-link">
                    <FiUsers size={18} />
                  </a>
                </div>
              </div>
              <div className="footer-section">
                <h4>Design System</h4>
                <ul>
                  <li>
                    <a href="#">Typography</a>
                  </li>
                  <li>
                    <a href="#">Components</a>
                  </li>
                  <li>
                    <a href="#">Colors</a>
                  </li>
                  <li>
                    <a href="#">Spacing</a>
                  </li>
                </ul>
              </div>
              <div className="footer-section">
                <h4>Resources</h4>
                <ul>
                  <li>
                    <a href="#">Documentation</a>
                  </li>
                  <li>
                    <a href="#">Examples</a>
                  </li>
                  <li>
                    <a href="#">Guidelines</a>
                  </li>
                  <li>
                    <a href="#">Best Practices</a>
                  </li>
                </ul>
              </div>
              <div className="footer-section">
                <h4>Support</h4>
                <ul>
                  <li>
                    <a href="#">Help Center</a>
                  </li>
                  <li>
                    <a href="#">Contact Us</a>
                  </li>
                  <li>
                    <a href="#">Community</a>
                  </li>
                  <li>
                    <a href="#">Feedback</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="footer-divider">
              <div className="footer-bottom">
                <p>&copy; 2024 Hands2gether. All rights reserved.</p>
                <div className="social-links">
                  <a href="#" className="social-link">
                    <FiGlobe size={16} />
                  </a>
                  <a href="#" className="social-link">
                    <FiHeart size={16} />
                  </a>
                  <a href="#" className="social-link">
                    <FiUsers size={16} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </MainLayout>
  );
}
