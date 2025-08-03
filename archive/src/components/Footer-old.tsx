"use client";

import React from "react";
import { Layout, Row, Col, Typography, Space, Button, Divider } from "antd";
import {
  HiOutlineHeart,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
  HiOutlineGlobeAlt,
  HiOutlineNewspaper,
  HiOutlineShieldCheck,
  HiOutlineDocumentText,
  HiOutlineArrowUp,
} from "react-icons/hi";
import { motion } from "framer-motion";
import Link from "next/link";

const { Footer: AntFooter } = Layout;
const { Title, Text, Paragraph } = Typography;

interface FooterProps {
  onNewsletterSubscribe?: (email: string) => void;
}

export function Footer({ onNewsletterSubscribe }: FooterProps) {
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const email = formData.get("email") as string;

    if (onNewsletterSubscribe && email) {
      onNewsletterSubscribe(email);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AntFooter className="footer-modern">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-main">
          <Row gutter={[48, 32]}>
            {/* Brand Section */}
            <Col xs={24} sm={24} md={8} lg={6}>
              <div className="footer-brand">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="brand-section"
                >
                  <div className="brand-logo">
                    <div className="brand-icon">
                      <HiOutlineHeart size={24} />
                    </div>
                    <Title level={3} className="brand-title">
                      Hands2gether
                    </Title>
                  </div>
                  <Paragraph className="brand-description">
                    Empowering communities to create lasting change through
                    collaborative action and sustainable giving.
                  </Paragraph>

                  {/* Social Links */}
                  <div className="social-links">
                    <Button type="text" className="social-btn">
                      Facebook
                    </Button>
                    <Button type="text" className="social-btn">
                      Twitter
                    </Button>
                    <Button type="text" className="social-btn">
                      LinkedIn
                    </Button>
                    <Button type="text" className="social-btn">
                      Instagram
                    </Button>
                  </div>

                  {/* Contact Info */}
                  <div className="contact-info">
                    <Space direction="vertical" size="small">
                      <div className="contact-item">
                        <HiOutlineMail size={16} />
                        <Text>hello@hands2gether.org</Text>
                      </div>
                      <div className="contact-item">
                        <HiOutlinePhone size={16} />
                        <Text>+1 (555) 123-4567</Text>
                      </div>
                      <div className="contact-item">
                        <HiOutlineLocationMarker size={16} />
                        <Text>San Francisco, CA</Text>
                      </div>
                    </Space>
                  </div>
                </motion.div>
              </div>
            </Col>

            {/* Quick Links */}
            <Col xs={12} sm={12} md={5} lg={5}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Title level={4} className="footer-section-title">
                  Platform
                </Title>
                <ul className="footer-links">
                  <li>
                    <Link href="/causes">Browse Causes</Link>
                  </li>
                  <li>
                    <Link href="/causes/create">Create Cause</Link>
                  </li>
                  <li>
                    <Link href="/education">Education Hub</Link>
                  </li>
                  <li>
                    <Link href="/how-it-works">How It Works</Link>
                  </li>
                  <li>
                    <Link href="/impact">Impact Stories</Link>
                  </li>
                </ul>
              </motion.div>
            </Col>

            {/* Community */}
            <Col xs={12} sm={12} md={5} lg={5}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Title level={4} className="footer-section-title">
                  Community
                </Title>
                <ul className="footer-links">
                  <li>
                    <Link href="/stories">Success Stories</Link>
                  </li>
                  <li>
                    <Link href="/guidelines">Guidelines</Link>
                  </li>
                  <li>
                    <Link href="/volunteer">Volunteer</Link>
                  </li>
                  <li>
                    <Link href="/partners">Partners</Link>
                  </li>
                  <li>
                    <Link href="/blog">Blog</Link>
                  </li>
                </ul>
              </motion.div>
            </Col>

            {/* Newsletter & Support */}
            <Col xs={24} sm={24} md={6} lg={8}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Title level={4} className="footer-section-title">
                  Stay Connected
                </Title>

                {/* Newsletter Signup */}
                <div className="newsletter-signup">
                  <Text className="newsletter-label">Newsletter</Text>
                  <form
                    onSubmit={handleNewsletterSubmit}
                    className="newsletter-form"
                  >
                    <div className="newsletter-input-group">
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        className="newsletter-input"
                        required
                      />
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="newsletter-btn"
                        icon={<HiOutlineNewspaper size={16} />}
                      >
                        Subscribe
                      </Button>
                    </div>
                  </form>
                  <Text className="newsletter-note">
                    Get weekly updates on new causes and impact stories.
                  </Text>
                </div>

                {/* Support Links */}
                <div className="support-section">
                  <Title level={5} className="support-title">
                    Support
                  </Title>
                  <ul className="footer-links">
                    <li>
                      <Link href="/help">Help Center</Link>
                    </li>
                    <li>
                      <Link href="/contact">Contact Us</Link>
                    </li>
                    <li>
                      <Link href="/safety">Safety Guidelines</Link>
                    </li>
                    <li>
                      <Link href="/about">About Us</Link>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </Col>
          </Row>
        </div>

        <Divider className="footer-divider" />

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <Row justify="space-between" align="middle">
            <Col xs={24} md={12}>
              <Text className="copyright">
                © 2024 Hands2gether. All rights reserved. Made with ❤️ for
                communities worldwide.
              </Text>
            </Col>
            <Col xs={24} md={12}>
              <div className="footer-bottom-actions">
                <div className="legal-links">
                  <Link href="/privacy" className="legal-link">
                    <HiOutlineShieldCheck size={14} />
                    Privacy Policy
                  </Link>
                  <Link href="/terms" className="legal-link">
                    <HiOutlineDocumentText size={14} />
                    Terms of Service
                  </Link>
                  <Link href="/accessibility" className="legal-link">
                    <HiOutlineGlobeAlt size={14} />
                    Accessibility
                  </Link>
                </div>

                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="scroll-top-btn"
                >
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<HiOutlineArrowUp size={16} />}
                    onClick={scrollToTop}
                    className="back-to-top"
                    title="Back to top"
                  />
                </motion.div>
              </div>
            </Col>
          </Row>
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="footer-stats"
        >
          <Row gutter={[32, 16]} justify="center">
            <Col xs={12} sm={6}>
              <div className="stat-item">
                <Title level={3} className="stat-number">
                  12,847
                </Title>
                <Text className="stat-label">Active Members</Text>
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div className="stat-item">
                <Title level={3} className="stat-number">
                  8,432
                </Title>
                <Text className="stat-label">Lives Impacted</Text>
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div className="stat-item">
                <Title level={3} className="stat-number">
                  2,567
                </Title>
                <Text className="stat-label">Active Causes</Text>
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div className="stat-item">
                <Title level={3} className="stat-number">
                  34
                </Title>
                <Text className="stat-label">Countries</Text>
              </div>
            </Col>
          </Row>
        </motion.div>
      </div>

      <style jsx global>{`
        .footer-modern {
          background: linear-gradient(135deg, #f8fffe 0%, #f0f9ff 100%);
          border-top: 1px solid rgba(0, 0, 0, 0.06);
          margin-top: 80px;
          padding: 0;
        }

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .footer-main {
          padding: 64px 0 40px;
        }

        .footer-brand {
          margin-bottom: 24px;
        }

        .brand-section {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .brand-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
          color: white;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(82, 196, 26, 0.3);
        }

        .brand-title {
          margin: 0 !important;
          font-size: 20px !important;
          font-weight: 700 !important;
          background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .brand-description {
          color: #666;
          font-size: 14px;
          line-height: 1.6;
          margin: 0;
        }

        .social-links {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
          margin-bottom: 24px;
        }

        .social-btn {
          border-radius: 6px;
          color: #666;
          font-size: 13px;
          height: 32px;
          padding: 0 12px;
          transition: all 0.2s ease;
        }

        .social-btn:hover {
          background: rgba(82, 196, 26, 0.1);
          color: #52c41a;
        }

        .contact-info {
          margin-top: 16px;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #666;
          font-size: 14px;
        }

        .footer-section-title {
          font-size: 16px !important;
          font-weight: 600 !important;
          color: #333 !important;
          margin-bottom: 20px !important;
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-links li {
          margin-bottom: 12px;
        }

        .footer-links li:last-child {
          margin-bottom: 0;
        }

        .footer-links a {
          color: #666;
          text-decoration: none;
          font-size: 14px;
          font-weight: 400;
          transition: all 0.2s ease;
        }

        .footer-links a:hover {
          color: #52c41a;
          transform: translateX(2px);
        }

        .newsletter-signup {
          margin-bottom: 32px;
        }

        .newsletter-label {
          font-weight: 600;
          color: #333;
          font-size: 14px;
          display: block;
          margin-bottom: 12px;
        }

        .newsletter-form {
          margin-bottom: 12px;
        }

        .newsletter-input-group {
          display: flex;
          gap: 8px;
          width: 100%;
        }

        .newsletter-input {
          flex: 1;
          height: 40px;
          padding: 8px 12px;
          border: 1px solid #d9d9d9;
          border-radius: 6px;
          font-size: 14px;
          background: white;
          transition: all 0.2s ease;
        }

        .newsletter-input:focus {
          outline: none;
          border-color: #52c41a;
          box-shadow: 0 0 0 2px rgba(82, 196, 26, 0.1);
        }

        .newsletter-btn {
          border-radius: 6px;
          background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
          border: none;
          height: 40px;
          padding: 0 16px;
          font-size: 14px;
          font-weight: 500;
          box-shadow: 0 2px 8px rgba(82, 196, 26, 0.3);
          transition: all 0.2s ease;
        }

        .newsletter-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(82, 196, 26, 0.4);
        }

        .newsletter-note {
          font-size: 12px;
          color: #999;
          line-height: 1.4;
        }

        .support-section {
          margin-top: 32px;
        }

        .support-title {
          font-size: 14px !important;
          font-weight: 600 !important;
          color: #333 !important;
          margin-bottom: 16px !important;
        }

        .footer-divider {
          margin: 32px 0 24px;
          border-color: rgba(0, 0, 0, 0.08);
        }

        .footer-bottom {
          padding-bottom: 32px;
        }

        .copyright {
          color: #666;
          font-size: 14px;
        }

        .footer-bottom-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 24px;
          flex-wrap: wrap;
        }

        .legal-links {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        .legal-link {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #666;
          text-decoration: none;
          font-size: 13px;
          font-weight: 400;
          transition: all 0.2s ease;
        }

        .legal-link:hover {
          color: #52c41a;
        }

        .scroll-top-btn {
          display: flex;
          align-items: center;
        }

        .back-to-top {
          background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
          border: none;
          box-shadow: 0 4px 12px rgba(82, 196, 26, 0.3);
          transition: all 0.2s ease;
        }

        .back-to-top:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(82, 196, 26, 0.4);
        }

        .footer-stats {
          margin-top: 40px;
          padding-top: 32px;
          border-top: 1px solid rgba(0, 0, 0, 0.08);
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          margin: 0 !important;
          font-size: 24px !important;
          font-weight: 700 !important;
          color: #52c41a !important;
          margin-bottom: 8px !important;
        }

        .stat-label {
          color: #666;
          font-size: 14px;
          font-weight: 500;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .footer-main {
            padding: 48px 0 32px;
          }

          .footer-container {
            padding: 0 16px;
          }

          .footer-bottom-actions {
            justify-content: flex-start;
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .legal-links {
            justify-content: flex-start;
            gap: 16px;
          }

          .newsletter-input-group {
            flex-direction: column;
          }

          .newsletter-btn {
            width: 100%;
          }

          .brand-logo {
            justify-content: flex-start;
          }

          .copyright {
            margin-bottom: 16px;
          }
        }

        @media (max-width: 480px) {
          .footer-main {
            padding: 32px 0 24px;
          }

          .footer-container {
            padding: 0 12px;
          }

          .social-links {
            justify-content: flex-start;
          }

          .legal-links {
            flex-direction: column;
            gap: 12px;
          }

          .stat-number {
            font-size: 20px !important;
          }
        }
      `}</style>
    </AntFooter>
  );
}
