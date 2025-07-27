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

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
  },
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

export default function AboutPage() {
  const milestones = [
    {
      year: "2020",
      title: "Foundation",
      description:
        "Hands2gether was founded with a simple mission: connecting communities to create lasting positive change.",
      icon: <RocketOutlined />,
    },
    {
      year: "2021",
      title: "First 1,000 Users",
      description:
        "Reached our first milestone of 1,000 active community members across 15 cities.",
      icon: <TeamOutlined />,
    },
    {
      year: "2022",
      title: "Global Expansion",
      description:
        "Expanded internationally, launching in 25 countries and facilitating cross-border collaboration.",
      icon: <GlobalOutlined />,
    },
    {
      year: "2023",
      title: "Major Impact",
      description:
        "Surpassed $1M in funds raised and 10,000 lives directly impacted through our platform.",
      icon: <TrophyOutlined />,
    },
    {
      year: "2024",
      title: "AI Integration",
      description:
        "Launched AI-powered cause matching and impact prediction to maximize community engagement.",
      icon: <BulbOutlined />,
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
        "Ph.D. Social Psychology",
        "Research Published",
        "Community Leader",
      ],
    },
    {
      name: "Jordan Kim",
      role: "Head of Engineering",
      bio: "Full-stack developer with expertise in scalable web applications and user experience.",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      achievements: [
        "Stanford Computer Science",
        "Tech Startup Veteran",
        "Open Source Maintainer",
      ],
    },
  ];

  const values = [
    {
      icon: <HeartOutlined />,
      title: "Compassion First",
      description:
        "Every decision we make is guided by empathy and understanding for those we serve.",
    },
    {
      icon: <TeamOutlined />,
      title: "Community Driven",
      description:
        "We believe in the power of collective action and grassroots movements.",
    },
    {
      icon: <SafetyOutlined />,
      title: "Trust & Transparency",
      description:
        "We maintain complete transparency in our operations and fund allocation.",
    },
    {
      icon: <BulbOutlined />,
      title: "Innovation for Good",
      description:
        "We leverage technology to amplify human compassion and create efficient solutions.",
    },
  ];

  const stats = [
    { title: "Communities Served", value: 150, suffix: "+" },
    { title: "Funds Raised", value: 2.5, prefix: "$", suffix: "M+" },
    { title: "Lives Impacted", value: 25000, suffix: "+" },
    { title: "Active Volunteers", value: 5000, suffix: "+" },
  ];

  return (
    <MainLayout>
      <div className="page-container">
        {/* Hero Section */}
        <section className="page-hero">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerChildren}
            className="page-hero-content"
          >
            <motion.div variants={fadeInUp}>
              <Title level={1} className="page-hero-title">
                Building Stronger Communities Together
              </Title>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Paragraph className="page-hero-description">
                Since 2020, Hands2gether has been connecting compassionate
                individuals with meaningful causes, creating lasting positive
                impact in communities worldwide.
              </Paragraph>
            </motion.div>
          </motion.div>
        </section>

        {/* Mission Section */}
        <section className="about-section">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerChildren}
            className="page-content-container"
          >
            <motion.div variants={fadeInUp} className="section-header">
              <Title level={2} className="section-title">
                Our Mission
              </Title>
              <Paragraph className="section-description">
                To create a world where no one faces hardship alone, by building
                technology that connects communities and amplifies human
                compassion.
              </Paragraph>
            </motion.div>

            <Row gutter={[32, 32]} className="features-grid">
              {values.map((value, index) => (
                <Col xs={24} md={12} lg={6} key={index}>
                  <motion.div variants={fadeInUp}>
                    <Card className="feature-card" hoverable>
                      <div className="feature-icon feature-icon-security">
                        {React.cloneElement(value.icon, {
                          style: { fontSize: "32px", color: "white" },
                        })}
                      </div>
                      <Title level={4} className="feature-title">
                        {value.title}
                      </Title>
                      <Paragraph className="feature-description">
                        {value.description}
                      </Paragraph>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </section>

        {/* Timeline Section */}
        <section className="about-section">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerChildren}
            className="page-content-container"
          >
            <motion.div variants={fadeInUp} className="section-header">
              <Title level={2} className="section-title">
                Our Journey
              </Title>
              <Paragraph className="section-description">
                From a simple idea to a global movement - here's how we've grown
                to serve communities worldwide.
              </Paragraph>
            </motion.div>

            <motion.div variants={fadeInUp} className="about-timeline">
              {milestones.map((milestone, index) => (
                <div key={index} className="timeline-item">
                  <Space align="start">
                    <div className="feature-icon feature-icon-impact">
                      {React.cloneElement(milestone.icon, {
                        style: { fontSize: "24px", color: "white" },
                      })}
                    </div>
                    <div>
                      <div className="timeline-year">{milestone.year}</div>
                      <div className="timeline-title">{milestone.title}</div>
                      <div className="timeline-description">
                        {milestone.description}
                      </div>
                    </div>
                  </Space>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="about-section">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerChildren}
            className="page-content-container"
          >
            <motion.div variants={fadeInUp} className="section-header">
              <Title level={2} className="section-title">
                Our Impact in Numbers
              </Title>
            </motion.div>

            <Row gutter={[32, 32]} className="stats-row">
              {stats.map((stat, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                  <motion.div variants={fadeInUp}>
                    <Statistic
                      title={stat.title}
                      value={stat.value}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                      valueStyle={{
                        color: "#1890ff",
                        fontSize: "2.5rem",
                        fontWeight: 700,
                      }}
                      className="stat-item"
                    />
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </section>

        {/* Team Section */}
        <section className="about-section">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerChildren}
            className="page-content-container"
          >
            <motion.div variants={fadeInUp} className="section-header">
              <Title level={2} className="section-title">
                Meet Our Team
              </Title>
              <Paragraph className="section-description">
                Passionate individuals dedicated to making technology serve
                humanity's greatest needs.
              </Paragraph>
            </motion.div>

            <Row gutter={[32, 32]} className="team-grid">
              {teamMembers.map((member, index) => (
                <Col xs={24} md={12} lg={6} key={index}>
                  <motion.div variants={fadeInUp}>
                    <Card className="team-card" hoverable>
                      <Avatar
                        size={120}
                        src={member.avatar}
                        className="team-avatar"
                      />
                      <Title level={4} className="team-name">
                        {member.name}
                      </Title>
                      <Text className="team-role">{member.role}</Text>
                      <Paragraph className="team-bio">{member.bio}</Paragraph>
                      <div className="team-achievements">
                        {member.achievements.map((achievement, i) => (
                          <Tag key={i} className="achievement-tag">
                            {achievement}
                          </Tag>
                        ))}
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
                Ready to Make a Difference?
              </Title>
              <Paragraph className="cta-description">
                Join our community of changemakers and start creating positive
                impact in your neighborhood today.
              </Paragraph>
              <Space size="large" className="cta-actions">
                <Button
                  type="primary"
                  size="large"
                  icon={<HeartOutlined />}
                  className="btn-primary-large"
                >
                  <Link href="/causes">Explore Causes</Link>
                </Button>
                <Button
                  size="large"
                  icon={<ArrowRightOutlined />}
                  className="btn-secondary-large"
                >
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </Space>
            </div>
          </motion.div>
        </section>
      </div>
    </MainLayout>
  );
}
