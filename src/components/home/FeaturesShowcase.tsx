"use client";

import React from "react";
import { Card, Row, Col, Typography, Space, Button } from "antd";
import {
  SearchOutlined,
  HeartOutlined,
  UserAddOutlined,
  MessageOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
  TeamOutlined,
  TrophyOutlined,
  GlobalOutlined,
  MobileOutlined,
  BellOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";

const { Title, Paragraph } = Typography;

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  category: string;
}

interface FeaturesShowcaseProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

const features: Feature[] = [
  {
    title: "Smart Cause Discovery",
    description:
      "AI-powered recommendations help you find causes that align with your interests and location.",
    icon: <SearchOutlined />,
    color: "#1890ff",
    category: "discovery",
  },
  {
    title: "Secure Donations",
    description:
      "Bank-level security ensures your contributions reach the right causes safely and transparently.",
    icon: <SafetyOutlined />,
    color: "#52c41a",
    category: "security",
  },
  {
    title: "Volunteer Matching",
    description:
      "Connect with volunteer opportunities that match your skills and availability.",
    icon: <UserAddOutlined />,
    color: "#722ed1",
    category: "volunteer",
  },
  {
    title: "Real-time Updates",
    description:
      "Get instant notifications about cause progress and community impact in real-time.",
    icon: <ThunderboltOutlined />,
    color: "#fa8c16",
    category: "updates",
  },
  {
    title: "Community Chat",
    description:
      "Engage with like-minded individuals and organizers through our built-in messaging system.",
    icon: <MessageOutlined />,
    color: "#eb2f96",
    category: "community",
  },
  {
    title: "Impact Tracking",
    description:
      "Visualize your personal contribution impact with detailed analytics and reports.",
    icon: <BarChartOutlined />,
    color: "#13c2c2",
    category: "analytics",
  },
  {
    title: "Team Collaboration",
    description:
      "Create or join teams to amplify your impact through coordinated group efforts.",
    icon: <TeamOutlined />,
    color: "#2f54eb",
    category: "collaboration",
  },
  {
    title: "Achievement System",
    description:
      "Earn badges and recognition for your contributions and milestone achievements.",
    icon: <TrophyOutlined />,
    color: "#f5222d",
    category: "gamification",
  },
  {
    title: "Global Reach",
    description:
      "Support causes worldwide or focus on local community initiatives in your area.",
    icon: <GlobalOutlined />,
    color: "#faad14",
    category: "global",
  },
  {
    title: "Mobile First",
    description:
      "Fully responsive design ensures seamless experience across all devices.",
    icon: <MobileOutlined />,
    color: "#52c41a",
    category: "mobile",
  },
  {
    title: "Smart Notifications",
    description:
      "Customizable alerts keep you informed without overwhelming your day.",
    icon: <BellOutlined />,
    color: "#722ed1",
    category: "notifications",
  },
  {
    title: "Heart-Centered",
    description:
      "Every feature is designed with empathy and human connection at its core.",
    icon: <HeartOutlined />,
    color: "#ff4d4f",
    category: "philosophy",
  },
];

export const FeaturesShowcase: React.FC<FeaturesShowcaseProps> = ({
  title = "Powerful Features for Meaningful Impact",
  subtitle = "Everything you need to discover, support, and track causes that matter to you",
  className = "",
}) => {
  return (
    <div
      className={`py-20 bg-gradient-to-br from-slate-50 to-blue-50 ${className}`}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: "center", marginBottom: 80 }}
        >
          <Title
            level={2}
            style={{
              marginBottom: 20,
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              background: "linear-gradient(135deg, #1890ff 0%, #722ed1 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            {title}
          </Title>
          <Paragraph
            style={{
              fontSize: 20,
              color: "#64748b",
              maxWidth: 600,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            {subtitle}
          </Paragraph>
        </motion.div>

        {/* Features Grid */}
        <Row gutter={[32, 32]}>
          {features.map((feature, index) => (
            <Col xs={24} sm={12} lg={8} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.7 }}
                whileHover={{ y: -8 }}
              >
                <Card
                  style={{
                    height: "100%",
                    borderRadius: 20,
                    border: "none",
                    background: "#ffffff",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                    transition:
                      "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    overflow: "hidden",
                    position: "relative",
                  }}
                  bodyStyle={{
                    padding: 32,
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                  className="feature-card"
                >
                  {/* Background Decoration */}
                  <div
                    style={{
                      position: "absolute",
                      top: -30,
                      right: -30,
                      width: 100,
                      height: 100,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${feature.color}15, ${feature.color}08)`,
                      zIndex: 0,
                    }}
                  />

                  {/* Icon */}
                  <div
                    style={{
                      fontSize: 40,
                      color: feature.color,
                      marginBottom: 24,
                      position: "relative",
                      zIndex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                    }}
                  >
                    {feature.icon}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
                    <Title
                      level={4}
                      style={{
                        marginBottom: 16,
                        color: "#1e293b",
                        fontSize: 20,
                        fontWeight: 600,
                        lineHeight: 1.3,
                      }}
                    >
                      {feature.title}
                    </Title>

                    <Paragraph
                      style={{
                        color: "#64748b",
                        fontSize: 16,
                        lineHeight: 1.6,
                        marginBottom: 0,
                      }}
                    >
                      {feature.description}
                    </Paragraph>
                  </div>

                  {/* Category Tag */}
                  <div
                    style={{
                      marginTop: 20,
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 12px",
                        backgroundColor: `${feature.color}15`,
                        color: feature.color,
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {feature.category}
                    </span>
                  </div>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          style={{
            textAlign: "center",
            marginTop: 80,
          }}
        >
          <Card
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
              borderRadius: 24,
              padding: "40px 32px",
            }}
          >
            <Title
              level={3}
              style={{
                color: "#ffffff",
                marginBottom: 16,
                fontSize: 28,
              }}
            >
              Ready to Make a Difference?
            </Title>
            <Paragraph
              style={{
                color: "rgba(255, 255, 255, 0.9)",
                fontSize: 18,
                marginBottom: 32,
                maxWidth: 500,
                margin: "0 auto 32px",
              }}
            >
              Join thousands of changemakers who are already creating positive
              impact in their communities.
            </Paragraph>

            <Space size="large" wrap>
              <Button
                type="primary"
                size="large"
                style={{
                  backgroundColor: "#ffffff",
                  color: "#667eea",
                  border: "none",
                  borderRadius: 12,
                  height: 48,
                  padding: "0 32px",
                  fontSize: 16,
                  fontWeight: 600,
                  boxShadow: "0 4px 15px rgba(255, 255, 255, 0.3)",
                }}
                href="/auth/register"
              >
                Get Started Today
              </Button>
              <Button
                size="large"
                style={{
                  backgroundColor: "transparent",
                  color: "#ffffff",
                  border: "2px solid rgba(255, 255, 255, 0.5)",
                  borderRadius: 12,
                  height: 48,
                  padding: "0 32px",
                  fontSize: 16,
                  fontWeight: 600,
                }}
                href="/causes"
              >
                Explore Causes
              </Button>
            </Space>
          </Card>
        </motion.div>
      </div>

      {/* Additional CSS for hover effects */}
      <style jsx>{`
        .feature-card:hover {
          transform: translateY(-8px) !important;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15) !important;
        }
      `}</style>
    </div>
  );
};

export default FeaturesShowcase;
