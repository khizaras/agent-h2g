"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Button,
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Space,
  Avatar,
  Progress,
  Carousel,
  Badge,
  Tooltip,
  Rate,
  Affix,
  BackTop,
  Timeline,
  Steps,
  Divider,
  Tag,
  List,
  Image as AntImage,
  Skeleton,
} from "antd";
import {
  FiArrowRight,
  FiHeart,
  FiUser,
  FiBook,
  FiShoppingBag,
  FiPlay,
  FiCheckCircle,
  FiStar,
  FiUsers,
  FiAward,
  FiGlobe,
  FiMapPin,
  FiClock,
  FiZap,
  FiShield,
  FiSend,
  FiTrendingUp,
  FiThumbsUp,
  FiShare2,
  FiCalendar,
  FiChevronUp,
} from "react-icons/fi";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import ImpactShowcase from "@/components/home/ImpactShowcase";
import FeaturesShowcase from "@/components/home/FeaturesShowcase";

const { Title, Paragraph, Text } = Typography;
const { Step } = Steps;

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [animateStats, setAnimateStats] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
      setAnimateStats(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    {
      value: 10248,
      label: "People Helped",
      icon: <FiUser style={{ fontSize: 24, color: "#1890ff" }} />,
      trend: "+15%",
      period: "this month",
    },
    {
      value: 1567,
      label: "Active Causes",
      icon: <FiHeart style={{ fontSize: 24, color: "#52c41a" }} />,
      trend: "+8%",
      period: "this week",
    },
    {
      value: 890,
      label: "Volunteers",
      icon: <FiUsers style={{ fontSize: 24, color: "#722ed1" }} />,
      trend: "+23%",
      period: "this month",
    },
    {
      value: 245000,
      label: "Total Raised",
      prefix: "$",
      icon: <FiAward style={{ fontSize: 24, color: "#fa8c16" }} />,
      trend: "+12%",
      period: "this quarter",
    },
  ];

  const featuredCauses = [
    {
      id: 1,
      title: "Emergency Food Relief for Hurricane Victims",
      description:
        "Providing immediate food assistance to families displaced by recent hurricane damage",
      raised: 48750,
      goal: 75000,
      supporters: 234,
      urgency: "high",
      image:
        "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400",
      location: "Miami, FL",
      daysLeft: 12,
    },
    {
      id: 2,
      title: "Community Food Bank Expansion",
      description:
        "Expanding our local food bank to serve 500 more families weekly",
      raised: 50000,
      goal: 50000,
      supporters: 156,
      urgency: "medium",
      image:
        "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400",
      location: "Seattle, WA",
      daysLeft: 0,
      completed: true,
    },
    {
      id: 3,
      title: "Mobile Kitchen Initiative",
      description:
        "Creating a mobile kitchen to deliver hot meals to underserved neighborhoods",
      raised: 12000,
      goal: 35000,
      supporters: 89,
      urgency: "medium",
      image: "https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=400",
      location: "Austin, TX",
      daysLeft: 30,
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: "Sarah Martinez",
      role: "Community Volunteer",
      content:
        "This platform has transformed how our community connects and helps each other. The impact is truly remarkable.",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b586?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Cause Creator",
      content:
        "Starting our food drive was so simple. We reached our goal in just 2 weeks thanks to this amazing community.",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 3,
      name: "Emma Thompson",
      role: "Donor",
      content:
        "I love how transparent everything is. I can see exactly how my contributions are making a difference.",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    },
  ];

  const howItWorksSteps = [
    {
      title: "Discover",
      description: "Find causes that matter to you in your community",
      icon: <FiGlobe />,
      interactive: true,
    },
    {
      title: "Connect",
      description: "Join with like-minded people making a difference",
      icon: <FiUsers />,
      interactive: true,
    },
    {
      title: "Impact",
      description: "See the real change you're creating together",
      icon: <FiAward />,
      interactive: true,
    },
  ];

  if (loading) {
    return (
      <MainLayout>
        <div style={{ padding: "50px" }}>
          <Skeleton active paragraph={{ rows: 8 }} />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div>
        <BackTop>
          <div
            style={{
              height: 40,
              width: 40,
              lineHeight: "40px",
              borderRadius: 8,
              backgroundColor: "#1890ff",
              color: "#fff",
              textAlign: "center",
              fontSize: 14,
              boxShadow: "0 4px 12px rgba(24, 144, 255, 0.3)",
            }}
          >
            <FiChevronUp />
          </div>
        </BackTop>

        {/* Hero Section with Parallax */}
        <div
          style={{
            background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1920&h=800&fit=crop&crop=center')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              textAlign: "center",
              padding: "0 24px",
              maxWidth: "900px",
              zIndex: 2,
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <Title
                level={1}
                style={{
                  fontSize: "clamp(2.5rem, 6vw, 5rem)",
                  marginBottom: 24,
                  color: "#ffffff",
                  fontWeight: "bold",
                  textShadow: "2px 2px 8px rgba(0,0,0,0.7)",
                  lineHeight: 1.2,
                }}
              >
                Building Stronger Communities Together
              </Title>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            >
              <Paragraph
                style={{
                  fontSize: "clamp(1.1rem, 3vw, 1.8rem)",
                  marginBottom: 48,
                  color: "#ffffff",
                  lineHeight: 1.6,
                  textShadow: "1px 1px 4px rgba(0,0,0,0.7)",
                  maxWidth: "700px",
                  margin: "0 auto 48px",
                }}
              >
                Connect with your community to share food, clothing, knowledge,
                and hope. Every act of kindness creates ripples of positive
                change.
              </Paragraph>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
            >
              <Space size="large" wrap style={{ justifyContent: "center" }}>
                <Link href="/causes">
                  <Button
                    type="primary"
                    size="large"
                    style={{
                      height: 56,
                      paddingLeft: 40,
                      paddingRight: 40,
                      fontSize: 18,
                      borderRadius: 28,
                      background:
                        "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
                      border: "none",
                      boxShadow: "0 8px 25px rgba(24, 144, 255, 0.4)",
                      transition: "all 0.3s ease",
                    }}
                    icon={<FiHeart />}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 12px 35px rgba(24, 144, 255, 0.5)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0px)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 25px rgba(24, 144, 255, 0.4)";
                    }}
                  >
                    Explore Causes
                  </Button>
                </Link>
                <Link href="/causes/create">
                  <Button
                    size="large"
                    style={{
                      height: 56,
                      paddingLeft: 40,
                      paddingRight: 40,
                      fontSize: 18,
                      borderRadius: 28,
                      background: "rgba(255, 255, 255, 0.15)",
                      color: "#ffffff",
                      border: "2px solid rgba(255, 255, 255, 0.3)",
                      backdropFilter: "blur(10px)",
                      transition: "all 0.3s ease",
                    }}
                    icon={<FiSend />}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255, 255, 255, 0.25)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255, 255, 255, 0.15)";
                      e.currentTarget.style.transform = "translateY(0px)";
                    }}
                  >
                    Start a Cause
                  </Button>
                </Link>
              </Space>
            </motion.div>
          </div>
        </div>

        {/* Interactive Statistics */}
        <div style={{ padding: "60px 24px", background: "#fff" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <Title level={2}>Our Impact in Real-Time</Title>
              <Paragraph>
                Live statistics showing our community's collective impact
              </Paragraph>
            </div>

            <Row gutter={[32, 32]}>
              {stats.map((stat, index) => (
                <Col xs={12} md={6} key={index}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Card
                      hoverable
                      style={{
                        textAlign: "center",
                        borderRadius: 12,
                        border: "1px solid #f0f0f0",
                      }}
                      bodyStyle={{ padding: 24 }}
                    >
                      <div style={{ marginBottom: 16 }}>{stat.icon}</div>
                      <Statistic
                        value={animateStats ? stat.value : 0}
                        prefix={stat.prefix}
                        valueStyle={{
                          fontSize: 28,
                          fontWeight: "bold",
                          color: "#1890ff",
                        }}
                      />
                      <Text strong style={{ display: "block", marginTop: 8 }}>
                        {stat.label}
                      </Text>
                      <div style={{ marginTop: 8 }}>
                        <Tag color="green">{stat.trend}</Tag>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {stat.period}
                        </Text>
                      </div>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </div>
        </div>

        {/* Featured Causes Carousel */}
        <div style={{ padding: "60px 24px", background: "#fafafa" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <Title level={2}>Featured Causes</Title>
              <Paragraph>
                Active campaigns making a difference right now
              </Paragraph>
            </div>

            <Carousel
              autoplay
              dots={{ className: "custom-dots" }}
              style={{ borderRadius: 12, overflow: "hidden" }}
            >
              {featuredCauses.map((cause) => (
                <div key={cause.id}>
                  <Card
                    cover={
                      <div
                        style={{
                          position: "relative",
                          height: 250,
                          overflow: "hidden",
                        }}
                      >
                        <AntImage
                          src={cause.image}
                          alt={cause.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          preview={false}
                        />
                        <div
                          style={{
                            position: "absolute",
                            top: 16,
                            right: 16,
                            display: "flex",
                            gap: 8,
                          }}
                        >
                          {cause.urgency === "high" && (
                            <Badge status="error" text="Urgent" />
                          )}
                          {cause.completed && (
                            <Badge status="success" text="Completed" />
                          )}
                        </div>
                      </div>
                    }
                    style={{ margin: "0 8px" }}
                    actions={[
                      <Tooltip title="Like this cause" key="like">
                        <FiThumbsUp />
                      </Tooltip>,
                      <Tooltip title="Share with others" key="share">
                        <FiShare2 />
                      </Tooltip>,
                      <Link href={`/causes/${cause.id}`} key="view">
                        <FiArrowRight />
                      </Link>,
                    ]}
                  >
                    <Card.Meta
                      title={
                        <div>
                          <Title
                            level={4}
                            style={{ margin: 0, marginBottom: 8 }}
                          >
                            {cause.title}
                          </Title>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              marginBottom: 12,
                            }}
                          >
                            <FiMapPin style={{ color: "#1890ff" }} />
                            <Text type="secondary">{cause.location}</Text>
                            {!cause.completed && (
                              <>
                                <FiClock
                                  style={{ color: "#fa8c16" }}
                                />
                                <Text type="secondary">
                                  {cause.daysLeft} days left
                                </Text>
                              </>
                            )}
                          </div>
                        </div>
                      }
                      description={
                        <div>
                          <Paragraph
                            ellipsis={{ rows: 2 }}
                            style={{ marginBottom: 16 }}
                          >
                            {cause.description}
                          </Paragraph>
                          <div style={{ marginBottom: 16 }}>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: 8,
                              }}
                            >
                              <Text strong>
                                ${cause.raised.toLocaleString()} raised
                              </Text>
                              <Text type="secondary">
                                {Math.round((cause.raised / cause.goal) * 100)}%
                              </Text>
                            </div>
                            <Progress
                              percent={(cause.raised / cause.goal) * 100}
                              showInfo={false}
                              strokeColor={{
                                "0%": "#108ee9",
                                "100%": "#87d068",
                              }}
                            />
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginTop: 8,
                              }}
                            >
                              <Text type="secondary">
                                Goal: ${cause.goal.toLocaleString()}
                              </Text>
                              <Text type="secondary">
                                {cause.supporters} supporters
                              </Text>
                            </div>
                          </div>
                        </div>
                      }
                    />
                  </Card>
                </div>
              ))}
            </Carousel>
          </div>
        </div>

        {/* Interactive How It Works */}
        <div style={{ padding: "60px 24px", background: "#fff" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <Title level={2}>How It Works</Title>
              <Paragraph>Simple steps to start making an impact</Paragraph>
            </div>

            <Row gutter={[48, 32]} align="middle">
              <Col xs={24} lg={12}>
                <Steps
                  direction="vertical"
                  size="small"
                  current={activeTab}
                  onChange={setActiveTab}
                  items={howItWorksSteps.map((step, index) => ({
                    title: step.title,
                    description: step.description,
                    icon: React.cloneElement(step.icon, {
                      style: {
                        fontSize: 24,
                        color: activeTab === index ? "#1890ff" : "#8c8c8c",
                      },
                    }),
                  }))}
                />
              </Col>
              <Col xs={24} lg={12}>
                <Card
                  style={{
                    height: 300,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      activeTab === 0
                        ? "#e6f7ff"
                        : activeTab === 1
                          ? "#f6ffed"
                          : "#fff1f0",
                    border: "none",
                    borderRadius: 12,
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    {howItWorksSteps[activeTab] &&
                      React.cloneElement(howItWorksSteps[activeTab].icon, {
                        style: {
                          fontSize: 64,
                          color: "#1890ff",
                          marginBottom: 16,
                        },
                      })}
                    <Title level={3}>{howItWorksSteps[activeTab]?.title}</Title>
                    <Paragraph style={{ fontSize: 16 }}>
                      {howItWorksSteps[activeTab]?.description}
                    </Paragraph>
                    <Button type="primary" size="large">
                      Get Started
                    </Button>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div style={{ padding: "60px 24px", background: "#fafafa" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <Title level={2}>Live Community Activity</Title>
              <Paragraph>
                See what's happening in our community right now
              </Paragraph>
            </div>

            <Row gutter={[24, 24]}>
              <Col xs={24} lg={12}>
                <Card
                  title="Recent Donations"
                  extra={<FiTrendingUp style={{ color: "#fa8c16" }} />}
                >
                  <List
                    itemLayout="horizontal"
                    dataSource={[
                      {
                        name: "Anonymous",
                        action: "donated $50 to",
                        cause: "Emergency Food Relief",
                        time: "2 minutes ago",
                      },
                      {
                        name: "Sarah J.",
                        action: "donated $25 to",
                        cause: "School Lunch Program",
                        time: "5 minutes ago",
                      },
                      {
                        name: "Mike C.",
                        action: "donated $100 to",
                        cause: "Winter Clothing Drive",
                        time: "8 minutes ago",
                      },
                    ]}
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={
                            <Avatar style={{ backgroundColor: "#1890ff" }}>
                              {item.name.charAt(0)}
                            </Avatar>
                          }
                          title={
                            <span>
                              <Text strong>{item.name}</Text> {item.action}{" "}
                              <Text style={{ color: "#1890ff" }}>
                                {item.cause}
                              </Text>
                            </span>
                          }
                          description={item.time}
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <Card
                  title="New Volunteers"
                  extra={<FiUsers style={{ color: "#52c41a" }} />}
                >
                  <List
                    itemLayout="horizontal"
                    dataSource={[
                      {
                        name: "Lisa R.",
                        action: "joined as volunteer for",
                        cause: "Community Garden",
                        time: "1 minute ago",
                      },
                      {
                        name: "David P.",
                        action: "signed up to help with",
                        cause: "Food Bank Distribution",
                        time: "4 minutes ago",
                      },
                      {
                        name: "Maria S.",
                        action: "volunteered for",
                        cause: "Coding Workshop",
                        time: "7 minutes ago",
                      },
                    ]}
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={
                            <Avatar style={{ backgroundColor: "#52c41a" }}>
                              {item.name.charAt(0)}
                            </Avatar>
                          }
                          title={
                            <span>
                              <Text strong>{item.name}</Text> {item.action}{" "}
                              <Text style={{ color: "#1890ff" }}>
                                {item.cause}
                              </Text>
                            </span>
                          }
                          description={item.time}
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>
          </div>
        </div>

        {/* Impact Showcase Section */}
        <ImpactShowcase />

        {/* Features Showcase Section */}
        <FeaturesShowcase />

        {/* CTA Section */}
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
              Ready to Make a Difference?
            </Title>
            <Paragraph
              style={{
                color: "rgba(255,255,255,0.85)",
                fontSize: 18,
                marginBottom: 32,
                maxWidth: 600,
                margin: "0 auto 32px",
              }}
            >
              Join thousands of community members creating positive change.
              Start your impact journey today.
            </Paragraph>
            <Space size="large" wrap>
              <Link href="/auth/signup">
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
                >
                  Get Started Free
                </Button>
              </Link>
              <Link href="/causes">
                <Button
                  size="large"
                  ghost
                  style={{ height: 50, padding: "0 30px" }}
                >
                  Explore Causes
                </Button>
              </Link>
            </Space>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}
