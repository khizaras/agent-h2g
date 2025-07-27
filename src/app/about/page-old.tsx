"use client";

import React from "react";
import {
  Typography,
  Card,
  Row,
  Col,
  Timeline,
  Statistic,
  Avatar,
  Space,
  Button,
  Tag,
  List,
} from "antd";
import {
  HeartOutlined,
  TeamOutlined,
  TrophyOutlined,
  GlobalOutlined,
  RocketOutlined,
  SafetyOutlined,
  BulbOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";

const { Title, Paragraph, Text } = Typography;

export default function AboutPage() {
  const milestones = [
    {
      year: "2020",
      title: "Foundation",
      description:
        "Hands2gether was founded with a simple mission: connecting communities to create lasting positive change.",
      icon: <RocketOutlined style={{ color: "#1890ff" }} />,
    },
    {
      year: "2021",
      title: "First 1,000 Users",
      description:
        "Reached our first milestone of 1,000 active community members across 15 cities.",
      icon: <TeamOutlined style={{ color: "#52c41a" }} />,
    },
    {
      year: "2022",
      title: "Global Expansion",
      description:
        "Expanded internationally, launching in 25 countries and facilitating cross-border collaboration.",
      icon: <GlobalOutlined style={{ color: "#722ed1" }} />,
    },
    {
      year: "2023",
      title: "Major Impact",
      description:
        "Surpassed $1M in funds raised and 10,000 lives directly impacted through our platform.",
      icon: <TrophyOutlined style={{ color: "#fa8c16" }} />,
    },
    {
      year: "2024",
      title: "AI Integration",
      description:
        "Launched AI-powered cause matching and impact prediction to maximize community engagement.",
      icon: <BulbOutlined style={{ color: "#eb2f96" }} />,
    },
  ];

  const teamMembers = [
    {
      name: "Sarah Chen",
      role: "CEO & Co-founder",
      bio: "Former nonprofit director with 15 years of community organizing experience.",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
      achievements: ["Harvard MBA", "Forbes 30 Under 30", "TEDx Speaker"],
    },
    {
      name: "Marcus Rodriguez",
      role: "CTO & Co-founder",
      bio: "Ex-Google engineer passionate about technology for social good.",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      achievements: [
        "MIT Computer Science",
        "Google Senior SWE",
        "Open Source Contributor",
      ],
    },
    {
      name: "Dr. Amara Okafor",
      role: "Head of Impact",
      bio: "Ph.D. in Social Psychology specializing in community behavior and sustainable change.",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
      achievements: [
        "Stanford Ph.D.",
        "UN Advisory Board",
        "Published Researcher",
      ],
    },
    {
      name: "James Park",
      role: "VP of Product",
      bio: "Design thinking expert focused on creating intuitive experiences for social impact.",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      achievements: [
        "IDEO Alumni",
        "Design Awards Winner",
        "UX Innovation Leader",
      ],
    },
  ];

  const values = [
    {
      title: "Transparency",
      description:
        "Every dollar, every action, every outcome is tracked and shared openly with our community.",
      icon: <SafetyOutlined style={{ fontSize: 32, color: "#1890ff" }} />,
      metrics: { label: "Transparency Score", value: 98, suffix: "%" },
    },
    {
      title: "Inclusivity",
      description:
        "We believe everyone has something valuable to contribute, regardless of background or resources.",
      icon: <HeartOutlined style={{ fontSize: 32, color: "#ff4d4f" }} />,
      metrics: { label: "Communities Served", value: 157, suffix: "+" },
    },
    {
      title: "Innovation",
      description:
        "We continuously evolve our platform using cutting-edge technology and user feedback.",
      icon: <BulbOutlined style={{ fontSize: 32, color: "#faad14" }} />,
      metrics: { label: "New Features", value: 24, suffix: "/year" },
    },
    {
      title: "Impact",
      description:
        "We measure success by the tangible positive change created in communities worldwide.",
      icon: <TrophyOutlined style={{ fontSize: 32, color: "#52c41a" }} />,
      metrics: { label: "Lives Impacted", value: 25847, suffix: "+" },
    },
  ];

  const achievements = [
    "B Corp Certified for social and environmental performance",
    "Winner of the 2023 Social Innovation Award",
    'Featured in Forbes "Top Social Impact Platforms"',
    "Partnership with United Nations SDG Action Campaign",
    "ISO 27001 certified for information security",
    "4.9/5 user satisfaction rating across all platforms",
  ];

  return (
    <MainLayout>
      <div style={{ background: "#ffffff" }}>
        {/* Hero Section */}
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(24, 144, 255, 0.1) 0%, rgba(114, 46, 209, 0.1) 100%)",
            padding: "100px 24px",
            textAlign: "center",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ maxWidth: 800, margin: "0 auto" }}
          >
            <Title
              level={1}
              style={{
                marginBottom: 24,
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                background: "linear-gradient(135deg, #1890ff 0%, #722ed1 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Connecting Hearts, Creating Change
            </Title>
            <Paragraph
              style={{
                fontSize: 22,
                color: "#64748b",
                marginBottom: 40,
                lineHeight: 1.6,
              }}
            >
              We're more than a platform—we're a movement of people who believe
              that together, we can solve the world's most pressing challenges
              one community at a time.
            </Paragraph>
            <Space size="large">
              <Link href="/causes">
                <Button
                  type="primary"
                  size="large"
                  style={{ height: 50, padding: "0 30px" }}
                >
                  Explore Our Impact
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="large" style={{ height: 50, padding: "0 30px" }}>
                  Get In Touch
                </Button>
              </Link>
            </Space>
          </motion.div>
        </div>

        {/* Mission & Vision */}
        <div style={{ padding: "80px 24px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <Row gutter={[48, 48]} align="middle">
              <Col xs={24} lg={12}>
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <Title level={2} style={{ marginBottom: 24 }}>
                    Our Mission
                  </Title>
                  <Paragraph
                    style={{ fontSize: 18, lineHeight: 1.8, marginBottom: 32 }}
                  >
                    To democratize social impact by providing an accessible,
                    transparent, and efficient platform that connects passionate
                    individuals with meaningful causes in their communities and
                    beyond.
                  </Paragraph>
                  <Title level={3} style={{ marginBottom: 16 }}>
                    Why We Started
                  </Title>
                  <Paragraph
                    style={{ fontSize: 16, lineHeight: 1.7, color: "#64748b" }}
                  >
                    We noticed that while millions of people want to make a
                    difference, they often don't know where to start or how to
                    find legitimate, impactful opportunities. Hands2gether
                    bridges that gap.
                  </Paragraph>
                </motion.div>
              </Col>
              <Col xs={24} lg={12}>
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <Card
                    style={{
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      border: "none",
                      borderRadius: 16,
                      color: "#ffffff",
                    }}
                  >
                    <Title
                      level={2}
                      style={{ color: "#ffffff", marginBottom: 24 }}
                    >
                      Our Vision
                    </Title>
                    <Paragraph
                      style={{
                        color: "rgba(255, 255, 255, 0.9)",
                        fontSize: 18,
                        lineHeight: 1.8,
                      }}
                    >
                      A world where every person has the tools and connections
                      needed to create positive change, where communities are
                      strengthened through collective action, and where no good
                      cause goes unfunded or unsupported.
                    </Paragraph>
                  </Card>
                </motion.div>
              </Col>
            </Row>
          </div>
        </div>

        {/* Our Values */}
        <div style={{ padding: "80px 24px", background: "#fafafa" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              style={{ textAlign: "center", marginBottom: 60 }}
            >
              <Title level={2}>Our Core Values</Title>
              <Paragraph style={{ fontSize: 18, color: "#64748b" }}>
                These principles guide everything we do and every decision we
                make
              </Paragraph>
            </motion.div>

            <Row gutter={[32, 32]}>
              {values.map((value, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                  >
                    <Card
                      style={{
                        height: "100%",
                        textAlign: "center",
                        borderRadius: 16,
                        border: "none",
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                      }}
                    >
                      <div style={{ marginBottom: 20 }}>{value.icon}</div>
                      <Title level={4} style={{ marginBottom: 16 }}>
                        {value.title}
                      </Title>
                      <Paragraph style={{ color: "#64748b", marginBottom: 24 }}>
                        {value.description}
                      </Paragraph>
                      <Statistic
                        value={value.metrics.value}
                        suffix={value.metrics.suffix}
                        title={value.metrics.label}
                        valueStyle={{ color: "#1890ff", fontSize: 20 }}
                      />
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </div>
        </div>

        {/* Timeline */}
        <div style={{ padding: "80px 24px" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              style={{ textAlign: "center", marginBottom: 60 }}
            >
              <Title level={2}>Our Journey</Title>
              <Paragraph style={{ fontSize: 18, color: "#64748b" }}>
                From a simple idea to a global movement
              </Paragraph>
            </motion.div>

            <Timeline mode="alternate">
              {milestones.map((milestone, index) => (
                <Timeline.Item
                  key={index}
                  dot={
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: "#ffffff",
                        border: "2px solid #1890ff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 16,
                      }}
                    >
                      {milestone.icon}
                    </div>
                  }
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                  >
                    <Card
                      style={{
                        maxWidth: 400,
                        borderRadius: 12,
                        border: "none",
                        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <Title level={4} style={{ marginBottom: 8 }}>
                        {milestone.year} - {milestone.title}
                      </Title>
                      <Paragraph style={{ color: "#64748b", marginBottom: 0 }}>
                        {milestone.description}
                      </Paragraph>
                    </Card>
                  </motion.div>
                </Timeline.Item>
              ))}
            </Timeline>
          </div>
        </div>

        {/* Team Section */}
        <div style={{ padding: "80px 24px", background: "#fafafa" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              style={{ textAlign: "center", marginBottom: 60 }}
            >
              <Title level={2}>Meet Our Team</Title>
              <Paragraph style={{ fontSize: 18, color: "#64748b" }}>
                Passionate individuals united by a common purpose
              </Paragraph>
            </motion.div>

            <Row gutter={[32, 32]}>
              {teamMembers.map((member, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    whileHover={{ y: -5 }}
                  >
                    <Card
                      style={{
                        textAlign: "center",
                        borderRadius: 16,
                        border: "none",
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                        overflow: "hidden",
                      }}
                    >
                      <Avatar
                        src={member.avatar}
                        size={80}
                        style={{ marginBottom: 16 }}
                      />
                      <Title level={4} style={{ marginBottom: 4 }}>
                        {member.name}
                      </Title>
                      <Text
                        type="secondary"
                        style={{
                          fontSize: 14,
                          marginBottom: 16,
                          display: "block",
                        }}
                      >
                        {member.role}
                      </Text>
                      <Paragraph
                        style={{
                          fontSize: 14,
                          color: "#64748b",
                          marginBottom: 16,
                          lineHeight: 1.5,
                        }}
                      >
                        {member.bio}
                      </Paragraph>
                      <div>
                        {member.achievements.map((achievement, i) => (
                          <Tag
                            key={i}
                            style={{ marginBottom: 4, fontSize: 11 }}
                          >
                            {achievement}
                          </Tag>
                        ))}
                      </div>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </div>
        </div>

        {/* Achievements */}
        <div style={{ padding: "80px 24px" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              style={{ textAlign: "center", marginBottom: 60 }}
            >
              <Title level={2}>Recognition & Achievements</Title>
              <Paragraph style={{ fontSize: 18, color: "#64748b" }}>
                We're honored to be recognized for our commitment to social
                impact
              </Paragraph>
            </motion.div>

            <List
              grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 }}
              dataSource={achievements}
              renderItem={(item, index) => (
                <List.Item>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                  >
                    <Card
                      style={{
                        borderRadius: 12,
                        border: "none",
                        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.06)",
                      }}
                    >
                      <Space>
                        <CheckCircleOutlined
                          style={{ color: "#52c41a", fontSize: 20 }}
                        />
                        <Text style={{ fontSize: 16 }}>{item}</Text>
                      </Space>
                    </Card>
                  </motion.div>
                </List.Item>
              )}
            />
          </div>
        </div>

        {/* Call to Action */}
        <div
          style={{
            background: "linear-gradient(135deg, #1890ff 0%, #722ed1 100%)",
            padding: "80px 24px",
            textAlign: "center",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Title level={2} style={{ color: "white", marginBottom: 16 }}>
              Join Our Mission
            </Title>
            <Paragraph
              style={{
                color: "rgba(255,255,255,0.9)",
                fontSize: 18,
                marginBottom: 32,
                maxWidth: 600,
                margin: "0 auto 32px",
              }}
            >
              Whether you're looking to donate, volunteer, or start your own
              cause, we're here to help you make a meaningful impact.
            </Paragraph>
            <Space size="large" wrap>
              <Link href="/causes">
                <Button
                  type="primary"
                  size="large"
                  style={{
                    background: "white",
                    color: "#1890ff",
                    border: "none",
                    height: 50,
                    padding: "0 30px",
                  }}
                  icon={<ArrowRightOutlined />}
                >
                  Start Making Impact
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="large"
                  ghost
                  style={{ height: 50, padding: "0 30px" }}
                >
                  Partner With Us
                </Button>
              </Link>
            </Space>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}
