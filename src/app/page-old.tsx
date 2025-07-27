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
  Badge,
  Rate,
  List,
  Skeleton,
} from "antd";
import {
  FiHeart,
  FiUsers,
  FiAward,
  FiTrendingUp,
  FiMapPin,
  FiClock,
  FiArrowRight,
  FiPlay,
  FiStar,
  FiShield,
  FiZap,
} from "react-icons/fi";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import {
  getRandomHeroImage,
  getRandomCauseImage,
  getRandomProfileImage,
  UnsplashImage,
} from "@/services/unsplashService";

const { Title, Paragraph, Text } = Typography;

// Animation variants
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

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    peopleHelped: 0,
    activeCauses: 0,
    volunteers: 0,
    fundsRaised: 0,
  });

  useEffect(() => {
    // Simulate loading and animate stats
    const timer = setTimeout(() => {
      setLoading(false);
      // Animate stats counter
      const targetStats = {
        peopleHelped: 15420,
        activeCauses: 1870,
        volunteers: 2340,
        fundsRaised: 425000,
      };

      const duration = 2000;
      const steps = 60;
      const stepDuration = duration / steps;

      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const easeOutProgress = 1 - Math.pow(1 - progress, 3);

        setStats({
          peopleHelped: Math.floor(targetStats.peopleHelped * easeOutProgress),
          activeCauses: Math.floor(targetStats.activeCauses * easeOutProgress),
          volunteers: Math.floor(targetStats.volunteers * easeOutProgress),
          fundsRaised: Math.floor(targetStats.fundsRaised * easeOutProgress),
        });

        if (currentStep >= steps) {
          clearInterval(interval);
          setStats(targetStats);
        }
      }, stepDuration);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const heroImage = getRandomHeroImage();

  const featuredCauses = [
    {
      id: 1,
      title: "Emergency Winter Relief",
      description:
        "Providing warm meals and shelter to homeless families during the harsh winter season.",
      image: getRandomCauseImage(),
      raised: 68500,
      goal: 95000,
      supporters: 342,
      daysLeft: 18,
      urgency: "high",
      location: "Chicago, IL",
      category: "Emergency Relief",
    },
    {
      id: 2,
      title: "Community Food Garden",
      description:
        "Building sustainable food gardens to provide fresh produce to underserved neighborhoods.",
      image: getRandomCauseImage(),
      raised: 45000,
      goal: 60000,
      supporters: 156,
      daysLeft: 25,
      urgency: "medium",
      location: "Portland, OR",
      category: "Food Security",
    },
    {
      id: 3,
      title: "Mobile Food Kitchen",
      description:
        "Bringing nutritious hot meals directly to communities in need with our mobile kitchen initiative.",
      image: getRandomCauseImage(),
      raised: 32000,
      goal: 50000,
      supporters: 98,
      daysLeft: 35,
      urgency: "medium",
      location: "Austin, TX",
      category: "Mobile Services",
    },
  ];

  const testimonials = [
    {
      name: "Maria Rodriguez",
      role: "Community Volunteer",
      content:
        "This platform has transformed how our neighborhood comes together to help each other. The impact is incredible.",
      rating: 5,
      avatar: getRandomProfileImage(),
    },
    {
      name: "David Chen",
      role: "Cause Creator",
      content:
        "Starting our food drive was seamless. We exceeded our goal in just 10 days thanks to this amazing community.",
      rating: 5,
      avatar: getRandomProfileImage(),
    },
    {
      name: "Sarah Thompson",
      role: "Regular Donor",
      content:
        "I love the transparency here. I can see exactly how my contributions are making a real difference.",
      rating: 5,
      avatar: getRandomProfileImage(),
    },
  ];

  if (loading) {
    return (
      <MainLayout>
        <div style={{ padding: "80px 24px" }}>
          <Skeleton active paragraph={{ rows: 12 }} />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          background: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${heroImage.url}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <Title
              level={1}
              className="text-white mb-6"
              style={{
                fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                fontWeight: 800,
                textShadow: "2px 2px 8px rgba(0,0,0,0.8)",
                lineHeight: 1.1,
                marginBottom: "24px",
              }}
            >
              Building Stronger Communities
              <br />
              <span style={{ color: "#52c41a" }}>Together</span>
            </Title>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <Paragraph
              className="text-white mb-10"
              style={{
                fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
                textShadow: "1px 1px 4px rgba(0,0,0,0.8)",
                maxWidth: "800px",
                margin: "0 auto 40px",
                lineHeight: 1.6,
              }}
            >
              Connect with your community to share resources, knowledge, and
              hope. Every act of kindness creates lasting positive change.
            </Paragraph>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <Space size="large" wrap>
              <Link href="/causes">
                <Button
                  type="primary"
                  size="large"
                  icon={<FiHeart />}
                  style={{
                    height: "60px",
                    padding: "0 40px",
                    fontSize: "18px",
                    borderRadius: "30px",
                    background:
                      "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)",
                    border: "none",
                    boxShadow: "0 8px 25px rgba(82, 196, 26, 0.4)",
                  }}
                  className="hover:scale-105 transition-transform duration-300"
                >
                  Explore Causes
                </Button>
              </Link>
              <Link href="/causes/create">
                <Button
                  size="large"
                  ghost
                  icon={<FiPlay />}
                  style={{
                    height: "60px",
                    padding: "0 40px",
                    fontSize: "18px",
                    borderRadius: "30px",
                    borderWidth: "2px",
                  }}
                  className="hover:scale-105 transition-transform duration-300"
                >
                  Start a Cause
                </Button>
              </Link>
            </Space>
          </motion.div>
        </div>

        {/* Floating stats preview */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <div className="flex space-x-8 bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">
                {stats.peopleHelped.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">People Helped</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">
                {stats.activeCauses}
              </div>
              <div className="text-sm text-gray-600">Active Causes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">
                ${stats.fundsRaised / 1000}K
              </div>
              <div className="text-sm text-gray-600">Funds Raised</div>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Impact Statistics */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-6">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <Title level={2} className="mb-4">
              Our Community Impact
            </Title>
            <Paragraph className="text-lg text-gray-600 max-w-2xl mx-auto">
              See the real-time impact our community is making across
              neighborhoods and lives.
            </Paragraph>
          </motion.div>

          <Row gutter={[32, 32]}>
            {[
              {
                icon: <FiUsers />,
                value: stats.peopleHelped,
                label: "People Helped",
                color: "#1890ff",
                trend: "+12%",
              },
              {
                icon: <FiHeart />,
                value: stats.activeCauses,
                label: "Active Causes",
                color: "#52c41a",
                trend: "+8%",
              },
              {
                icon: <FiAward />,
                value: stats.volunteers,
                label: "Volunteers",
                color: "#722ed1",
                trend: "+15%",
              },
              {
                icon: <FiTrendingUp />,
                value: stats.fundsRaised,
                label: "Funds Raised",
                color: "#fa8c16",
                trend: "+18%",
                prefix: "$",
              },
            ].map((stat, index) => (
              <Col xs={12} md={6} key={index}>
                <motion.div variants={fadeInUp}>
                  <Card
                    className="text-center h-full hover:shadow-lg transition-shadow duration-300"
                    style={{
                      borderRadius: "16px",
                      border: "1px solid #f0f0f0",
                    }}
                  >
                    <div
                      className="mb-4"
                      style={{ color: stat.color, fontSize: "2.5rem" }}
                    >
                      {stat.icon}
                    </div>
                    <Statistic
                      value={stat.value}
                      prefix={stat.prefix}
                      valueStyle={{
                        fontSize: "2rem",
                        fontWeight: "bold",
                        color: stat.color,
                      }}
                    />
                    <Text strong className="block mt-2 mb-2">
                      {stat.label}
                    </Text>
                    <Badge
                      count={stat.trend}
                      style={{ backgroundColor: "#52c41a", color: "white" }}
                    />
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>
      </motion.section>

      {/* Featured Causes */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="py-20 bg-gray-50"
      >
        <div className="container mx-auto px-6">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <Title level={2} className="mb-4">
              Featured Causes
            </Title>
            <Paragraph className="text-lg text-gray-600 max-w-2xl mx-auto">
              Active campaigns making a difference right now. Join thousands
              making an impact.
            </Paragraph>
          </motion.div>

          <Row gutter={[32, 32]}>
            {featuredCauses.map((cause, index) => (
              <Col xs={24} md={8} key={cause.id}>
                <motion.div variants={fadeInUp}>
                  <Card
                    hoverable
                    cover={
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={cause.image.url}
                          alt={cause.image.description}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge
                            count={
                              cause.urgency === "high"
                                ? "URGENT"
                                : cause.category
                            }
                            style={{
                              backgroundColor:
                                cause.urgency === "high"
                                  ? "#ff4d4f"
                                  : "#1890ff",
                              fontSize: "12px",
                              fontWeight: "bold",
                            }}
                          />
                        </div>
                        <div className="absolute top-4 right-4 flex space-x-2">
                          <FiMapPin className="text-white" />
                          <Text className="text-white text-sm">
                            {cause.location}
                          </Text>
                        </div>
                      </div>
                    }
                    style={{ borderRadius: "16px", overflow: "hidden" }}
                    bodyStyle={{ padding: "24px" }}
                  >
                    <div className="mb-4">
                      <Title level={4} className="mb-2">
                        {cause.title}
                      </Title>
                      <Paragraph
                        ellipsis={{ rows: 2 }}
                        className="text-gray-600 mb-4"
                      >
                        {cause.description}
                      </Paragraph>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between mb-2">
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
                          "0%": "#52c41a",
                          "100%": "#389e0d",
                        }}
                        strokeWidth={8}
                        style={{ marginBottom: "8px" }}
                      />
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Goal: ${cause.goal.toLocaleString()}</span>
                        <span>{cause.supporters} supporters</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-1 text-orange-500">
                        <FiClock />
                        <Text className="text-sm">
                          {cause.daysLeft} days left
                        </Text>
                      </div>
                      <Link href={`/causes/${cause.id}`}>
                        <Button type="primary" icon={<FiArrowRight />}>
                          Support Now
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>

          <motion.div variants={fadeInUp} className="text-center mt-12">
            <Link href="/causes">
              <Button
                type="default"
                size="large"
                style={{ borderRadius: "8px", padding: "0 32px" }}
              >
                View All Causes
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-6">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <Title level={2} className="mb-4">
              How It Works
            </Title>
            <Paragraph className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simple steps to start making a meaningful impact in your
              community.
            </Paragraph>
          </motion.div>

          <Row gutter={[48, 32]} align="middle">
            {[
              {
                icon: <FiHeart />,
                title: "Discover",
                description:
                  "Find causes that resonate with your values and interests in your community.",
                color: "#52c41a",
              },
              {
                icon: <FiUsers />,
                title: "Connect",
                description:
                  "Join like-minded people and collaborate to create meaningful change.",
                color: "#1890ff",
              },
              {
                icon: <FiAward />,
                title: "Impact",
                description:
                  "See the real difference you're making with transparent tracking and updates.",
                color: "#722ed1",
              },
            ].map((step, index) => (
              <Col xs={24} md={8} key={index}>
                <motion.div variants={fadeInUp}>
                  <Card
                    className="text-center h-full hover:shadow-lg transition-shadow duration-300"
                    style={{
                      borderRadius: "16px",
                      border: "none",
                      background: "#fafafa",
                    }}
                  >
                    <div
                      className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full"
                      style={{
                        backgroundColor: step.color + "20",
                        color: step.color,
                        fontSize: "2rem",
                      }}
                    >
                      {step.icon}
                    </div>
                    <Title level={4} className="mb-4">
                      {step.title}
                    </Title>
                    <Paragraph className="text-gray-600">
                      {step.description}
                    </Paragraph>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>
      </motion.section>

      {/* Testimonials */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="py-20 bg-gray-50"
      >
        <div className="container mx-auto px-6">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <Title level={2} className="mb-4">
              What Our Community Says
            </Title>
            <Paragraph className="text-lg text-gray-600 max-w-2xl mx-auto">
              Real stories from real people making a difference together.
            </Paragraph>
          </motion.div>

          <Row gutter={[32, 32]}>
            {testimonials.map((testimonial, index) => (
              <Col xs={24} md={8} key={index}>
                <motion.div variants={fadeInUp}>
                  <Card
                    className="h-full"
                    style={{
                      borderRadius: "16px",
                      border: "1px solid #f0f0f0",
                    }}
                  >
                    <div className="mb-4">
                      <Rate
                        disabled
                        defaultValue={testimonial.rating}
                        style={{ fontSize: "14px" }}
                      />
                    </div>
                    <Paragraph className="text-gray-700 mb-6 italic">
                      "{testimonial.content}"
                    </Paragraph>
                    <div className="flex items-center space-x-3">
                      <Avatar src={testimonial.avatar.url} size={48} />
                      <div>
                        <Text strong className="block">
                          {testimonial.name}
                        </Text>
                        <Text type="secondary" className="text-sm">
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
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
        className="py-20 text-center"
        style={{
          background: "linear-gradient(135deg, #1890ff 0%, #722ed1 100%)",
        }}
      >
        <div className="container mx-auto px-6">
          <Title level={2} className="text-white mb-6">
            Ready to Make a Difference?
          </Title>
          <Paragraph
            className="text-white mb-10 opacity-90"
            style={{
              fontSize: "1.2rem",
              maxWidth: "600px",
              margin: "0 auto 40px",
            }}
          >
            Join thousands of community members creating positive change. Start
            your impact journey today.
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
                  height: "56px",
                  padding: "0 40px",
                  fontSize: "16px",
                  borderRadius: "28px",
                  fontWeight: "600",
                }}
                className="hover:scale-105 transition-transform duration-300"
              >
                Get Started Free
              </Button>
            </Link>
            <Link href="/causes">
              <Button
                size="large"
                ghost
                style={{
                  height: "56px",
                  padding: "0 40px",
                  fontSize: "16px",
                  borderRadius: "28px",
                  borderWidth: "2px",
                  fontWeight: "600",
                }}
                className="hover:scale-105 transition-transform duration-300"
              >
                Explore Causes
              </Button>
            </Link>
          </Space>
        </div>
      </motion.section>
    </MainLayout>
  );
}
