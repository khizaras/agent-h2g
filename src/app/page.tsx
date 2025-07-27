"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
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
  Tooltip,
  Tag,
  Steps,
  Timeline,
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
  FiCheck,
  FiTarget,
  FiGlobe,
  FiMail,
  FiPhone,
  FiVideo,
  FiExternalLink,
  FiDollarSign,
} from "react-icons/fi";
import {
  HeartOutlined,
  RocketOutlined,
  SafetyOutlined,
  GlobalOutlined,
  TeamOutlined,
  TrophyOutlined,
  PlayCircleOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import {
  getRandomHeroImage,
  getRandomCauseImage,
  getRandomProfileImage,
  UnsplashImage,
} from "@/services/unsplashService";

const { Title, Paragraph, Text } = Typography;
const { Step } = Steps;

// Animated Counter Component
function AnimatedCounter({
  value,
  duration = 2000,
  prefix = "",
  suffix = "",
}: {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (inView) {
      motionValue.set(value);
    }
  }, [inView, motionValue, value]);

  useEffect(() => {
    return springValue.onChange((latest) => {
      setDisplayValue(Math.floor(latest));
    });
  }, [springValue]);

  return (
    <div ref={ref} className="animated-counter">
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </div>
  );
}

// Interactive Process Steps
const processSteps = [
  {
    title: "Discover",
    description: "Find causes that matter to you",
    icon: <FiTarget />,
  },
  {
    title: "Connect",
    description: "Join communities making a difference",
    icon: <FiUsers />,
  },
  {
    title: "Contribute",
    description: "Make your impact through donations or volunteering",
    icon: <FiHeart />,
  },
  {
    title: "Track",
    description: "See the real-time impact of your contributions",
    icon: <FiTrendingUp />,
  },
];

// Animation variants
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

const scaleOnHover = {
  scale: 1.05,
  transition: { duration: 0.2 },
};

export default function HomePage() {
  const [heroImage, setHeroImage] = useState<UnsplashImage | null>(null);
  const [causeImages, setCauseImages] = useState<UnsplashImage[]>([]);
  const [profileImages, setProfileImages] = useState<UnsplashImage[]>([]);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const [heroImg, causeImgs, profileImgs] = await Promise.all([
          getRandomHeroImage(),
          Promise.all([
            getRandomCauseImage(),
            getRandomCauseImage(),
            getRandomCauseImage(),
          ]),
          Promise.all([
            getRandomProfileImage(),
            getRandomProfileImage(),
            getRandomProfileImage(),
            getRandomProfileImage(),
          ]),
        ]);

        setHeroImage(heroImg);
        setCauseImages(causeImgs);
        setProfileImages(profileImgs);
      } catch (error) {
        console.error("Error loading images:", error);
      } finally {
        setImageLoading(false);
      }
    };

    loadImages();
  }, []);

  const features = [
    {
      icon: <FiHeart size={32} />,
      title: "Community Driven",
      description:
        "Join a network of compassionate individuals working together to fight hunger in our communities.",
      type: "community",
      stats: "15K+ Members",
      highlight: "Growing Daily",
    },
    {
      icon: <FiShield size={32} />,
      title: "Transparent & Secure",
      description:
        "Track your contributions with complete transparency and know exactly how your help makes a difference.",
      type: "security",
      stats: "100% Transparency",
      highlight: "Verified Impact",
    },
    {
      icon: <FiZap size={32} />,
      title: "Immediate Impact",
      description:
        "Your contributions start making a difference immediately, helping families in need today.",
      type: "impact",
      stats: "24hr Response",
      highlight: "Real-time Updates",
    },
  ];

  // Enhanced statistics with real-time feel
  const liveStats = [
    {
      value: 25420,
      label: "Lives Impacted",
      icon: <FiUsers />,
      trend: "+12% this month",
      color: "#52c41a",
      trendColor: "#52c41a",
      suffix: "",
    },
    {
      value: 1840000,
      label: "Funds Raised",
      prefix: "$",
      icon: <FiTrendingUp />,
      trend: "+28% this quarter",
      color: "#1890ff",
      trendColor: "#52c41a",
      suffix: "",
    },
    {
      value: 156,
      label: "Active Causes",
      icon: <FiHeart />,
      trend: "+5 this week",
      color: "#f5222d",
      trendColor: "#52c41a",
      suffix: "",
    },
    {
      value: 89,
      label: "Communities",
      icon: <FiGlobe />,
      trend: "Worldwide",
      color: "#722ed1",
      trendColor: "#1890ff",
      suffix: "",
    },
  ];

  // Success stories for testimonials
  const successStories = [
    {
      name: "Sarah Johnson",
      role: "Community Volunteer",
      location: "San Francisco, CA",
      content:
        "Hands2gether connected me with local families in need. In just 3 months, I've helped organize meal distributions for over 150 households.",
      rating: 5,
      avatar: profileImages[0],
      impact: "150 families helped",
      verified: true,
    },
    {
      name: "Michael Chen",
      role: "Cause Creator",
      location: "Austin, TX",
      content:
        "I launched a food rescue program that has saved 10,000+ pounds of food from waste. The platform made coordination seamless.",
      rating: 5,
      avatar: profileImages[1],
      impact: "10K+ lbs food saved",
      verified: true,
    },
    {
      name: "Emily Rodriguez",
      role: "Monthly Donor",
      location: "Miami, FL",
      content:
        "Seeing real-time updates on how my monthly contributions help families gives me confidence that every dollar makes a difference.",
      rating: 5,
      avatar: profileImages[2],
      impact: "$2,400 donated",
      verified: true,
    },
  ];

  const testimonials = successStories; // For backward compatibility

  const mockCauses = [
    {
      id: 1,
      title: "Weekend Meals for Local Families",
      description:
        "Providing nutritious weekend meals for children who rely on school breakfast and lunch programs.",
      progress: 75,
      goal: 5000,
      raised: 3750,
      location: "Downtown Community Center",
      timeLeft: "5 days left",
      image: causeImages[0],
      tags: ["Children", "Education", "Urgent"],
    },
    {
      id: 2,
      title: "Senior Citizens Grocery Support",
      description:
        "Helping elderly community members access fresh groceries and essential food items.",
      progress: 60,
      goal: 3000,
      raised: 1800,
      location: "Riverside Senior Center",
      timeLeft: "12 days left",
      image: causeImages[1],
      tags: ["Seniors", "Ongoing", "Health"],
    },
    {
      id: 3,
      title: "Mobile Food Pantry Initiative",
      description:
        "Bringing fresh food directly to underserved neighborhoods through our mobile pantry program.",
      progress: 45,
      goal: 8000,
      raised: 3600,
      location: "Multiple Locations",
      timeLeft: "18 days left",
      image: causeImages[2],
      tags: ["Innovation", "Accessibility", "Impact"],
    },
  ];

  return (
    <MainLayout>
      <div className="page-container">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-background">
            {!imageLoading && heroImage && (
              <img
                src={heroImage.url}
                alt="Community helping together"
                className="hero-bg-image"
              />
            )}
            <div className="hero-overlay" />
          </div>

          <div className="hero-content">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerChildren}
              className="hero-text-container"
            >
              <motion.div variants={fadeInUp}>
                <Title level={1} className="hero-title">
                  Building Stronger
                  <br />
                  <span className="hero-title-highlight">
                    Communities Together
                  </span>
                </Title>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Paragraph className="hero-description">
                  Join thousands of compassionate individuals making a real
                  difference. Create causes, contribute to initiatives, and help
                  build a world where no one goes hungry.
                </Paragraph>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Space size="large" className="hero-actions">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      type="primary"
                      size="large"
                      icon={<FiHeart />}
                      className="btn-primary-large"
                    >
                      <Link href="/causes">Start Helping Today</Link>
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="large"
                      icon={<FiPlay />}
                      className="btn-secondary-large"
                    >
                      Watch Our Impact Story
                    </Button>
                  </motion.div>
                </Space>
              </motion.div>
            </motion.div>

            {/* Enhanced Interactive Stats */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="hero-stats"
            >
              <Row gutter={[24, 16]} className="stats-row">
                {liveStats.map((stat, index) => (
                  <Col xs={12} sm={6} key={index}>
                    <motion.div
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                      }}
                      className="hero-stat-card"
                    >
                      <div className="stat-icon" style={{ color: stat.color }}>
                        {stat.icon}
                      </div>
                      <div className="stat-value">
                        <AnimatedCounter
                          value={
                            stat.value > 1000000
                              ? Math.floor(stat.value / 100000) / 10
                              : stat.value > 1000
                                ? Math.floor(stat.value / 100) / 10
                                : stat.value
                          }
                          prefix={stat.prefix || ""}
                          suffix={
                            stat.value > 1000000
                              ? "M+"
                              : stat.value > 1000
                                ? "K+"
                                : "+"
                          }
                        />
                      </div>
                      <div className="stat-label">{stat.label}</div>
                      <div className="stat-trend">{stat.trend}</div>
                    </motion.div>
                  </Col>
                ))}
              </Row>

              {/* Trust indicators */}
              <motion.div
                className="trust-indicators"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                <Space size="large">
                  <Tooltip title="SSL Secured Platform">
                    <div className="trust-badge">
                      <SafetyOutlined />
                      <span>Secure</span>
                    </div>
                  </Tooltip>
                  <Tooltip title="Transparent Fund Tracking">
                    <div className="trust-badge">
                      <CheckCircleOutlined />
                      <span>Verified</span>
                    </div>
                  </Tooltip>
                  <Tooltip title="Global Community Network">
                    <div className="trust-badge">
                      <GlobalOutlined />
                      <span>Worldwide</span>
                    </div>
                  </Tooltip>
                </Space>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Enhanced Statistics Section */}
        <section className="page-section stats-section">
          <div className="stats-container">
            <Row gutter={[32, 32]} justify="center">
              {liveStats.map((stat, index) => (
                <Col key={index} xs={24} sm={12} lg={6}>
                  <motion.div
                    className="stat-card"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Card
                      className="stat-card-inner"
                      style={{
                        height: "100%",
                        textAlign: "center",
                        border: "2px solid #f0f0f0",
                        borderRadius: "16px",
                        background:
                          "linear-gradient(135deg, #fff 0%, #fafafa 100%)",
                      }}
                    >
                      <Space
                        direction="vertical"
                        size="middle"
                        style={{ width: "100%" }}
                      >
                        <div
                          className="stat-icon"
                          style={{ color: stat.color, fontSize: "48px" }}
                        >
                          {stat.icon}
                        </div>
                        <div>
                          <div className="stat-number">
                            <AnimatedCounter
                              value={stat.value}
                              duration={2000}
                              prefix={stat.prefix}
                              suffix={stat.suffix}
                            />
                          </div>
                          <Text type="secondary" className="stat-label">
                            {stat.label}
                          </Text>
                        </div>
                        {stat.trend && (
                          <div
                            className="stat-trend"
                            style={{ color: stat.trendColor }}
                          >
                            {stat.trend}
                          </div>
                        )}
                      </Space>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>

            {/* Trust Indicators */}
            <motion.div
              className="trust-section"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Row
                gutter={[24, 24]}
                justify="center"
                style={{ marginTop: "80px" }}
              >
                <Col span={24}>
                  <Text
                    type="secondary"
                    style={{
                      display: "block",
                      textAlign: "center",
                      marginBottom: "32px",
                      fontSize: "16px",
                    }}
                  >
                    Trusted by thousands of community members
                  </Text>
                </Col>
                {[
                  {
                    icon: <FiShield />,
                    text: "Verified Causes",
                    color: "#52c41a",
                  },
                  {
                    icon: <FiAward />,
                    text: "Community Approved",
                    color: "#1890ff",
                  },
                  {
                    icon: <FiHeart />,
                    text: "100% Transparent",
                    color: "#eb2f96",
                  },
                  {
                    icon: <FiTrendingUp />,
                    text: "Real Impact",
                    color: "#722ed1",
                  },
                ].map((trust, index) => (
                  <Col key={index} xs={12} sm={6}>
                    <motion.div
                      className="trust-badge"
                      whileHover={{ scale: 1.1 }}
                      style={{
                        textAlign: "center",
                        padding: "16px",
                        borderRadius: "12px",
                        background: "rgba(255, 255, 255, 0.8)",
                        border: "1px solid #f0f0f0",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "24px",
                          color: trust.color,
                          marginBottom: "8px",
                        }}
                      >
                        {trust.icon}
                      </div>
                      <Text style={{ fontSize: "14px", fontWeight: 500 }}>
                        {trust.text}
                      </Text>
                    </motion.div>
                  </Col>
                ))}
              </Row>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerChildren}
            className="features-container"
          >
            <motion.div variants={fadeInUp} className="section-header">
              <Title level={2} className="section-title">
                Why Choose Hands2gether?
              </Title>
              <Paragraph className="section-description">
                Our platform is designed to make community support accessible,
                transparent, and impactful for everyone involved.
              </Paragraph>
            </motion.div>

            <Row gutter={[32, 32]} className="features-grid">
              {features.map((feature, index) => (
                <Col xs={24} md={8} key={index}>
                  <motion.div variants={fadeInUp} whileHover={scaleOnHover}>
                    <Card className="feature-card" hoverable>
                      <div
                        className={`feature-icon feature-icon-${feature.type}`}
                      >
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
          </motion.div>
        </section>

        {/* Featured Causes Section */}
        <section className="causes-section">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerChildren}
            className="causes-container"
          >
            <motion.div variants={fadeInUp} className="section-header">
              <Title level={2} className="section-title">
                Featured Causes
              </Title>
              <Paragraph className="section-description">
                Discover impactful initiatives in your community that need your
                support today.
              </Paragraph>
            </motion.div>

            <Row gutter={[24, 24]} className="causes-grid">
              {mockCauses.map((cause, index) => (
                <Col xs={24} md={8} key={cause.id}>
                  <motion.div variants={fadeInUp} whileHover={scaleOnHover}>
                    <Card
                      hoverable
                      className="cause-card"
                      cover={
                        !imageLoading && cause.image ? (
                          <div className="cause-image-container">
                            <img
                              alt={cause.title}
                              src={cause.image.url}
                              className="cause-image"
                            />
                            <div className="cause-tags">
                              {cause.tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  color={
                                    tag === "Urgent"
                                      ? "red"
                                      : tag === "Ongoing"
                                        ? "blue"
                                        : "green"
                                  }
                                  text={tag}
                                  className="cause-tag"
                                />
                              ))}
                            </div>
                          </div>
                        ) : (
                          <Skeleton.Image className="cause-skeleton" />
                        )
                      }
                    >
                      <Title level={4} className="cause-title">
                        {cause.title}
                      </Title>

                      <Paragraph className="cause-description">
                        {cause.description}
                      </Paragraph>

                      <div className="cause-progress">
                        <Progress
                          percent={cause.progress}
                          showInfo={false}
                          strokeColor={{
                            "0%": "#40a9ff",
                            "100%": "#1890ff",
                          }}
                          className="progress-bar"
                        />
                        <div className="progress-info">
                          <Text strong className="progress-amount">
                            ${cause.raised.toLocaleString()} raised
                          </Text>
                          <Text type="secondary" className="progress-goal">
                            of ${cause.goal.toLocaleString()} goal
                          </Text>
                        </div>
                      </div>

                      <div className="cause-meta">
                        <Space className="meta-item">
                          <FiMapPin size={14} />
                          <Text type="secondary">{cause.location}</Text>
                        </Space>
                        <Space className="meta-item">
                          <FiClock size={14} />
                          <Text type="secondary">{cause.timeLeft}</Text>
                        </Space>
                      </div>

                      <Button
                        type="primary"
                        block
                        icon={<FiHeart />}
                        className="cause-btn"
                      >
                        Support This Cause
                      </Button>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>

            <motion.div variants={fadeInUp} className="causes-cta">
              <Button
                type="default"
                size="large"
                icon={<FiArrowRight />}
                className="btn-view-all"
              >
                <Link href="/causes">View All Causes</Link>
              </Button>
            </motion.div>
          </motion.div>
        </section>

        {/* Testimonials Section */}
        <section className="testimonials-section">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerChildren}
            className="testimonials-container"
          >
            <motion.div variants={fadeInUp} className="section-header">
              <Title level={2} className="section-title">
                Stories from Our Community
              </Title>
              <Paragraph className="section-description">
                Real stories from real people making a difference through
                Hands2gether.
              </Paragraph>
            </motion.div>

            <Row gutter={[24, 24]} className="testimonials-grid">
              {testimonials.map((testimonial, index) => (
                <Col xs={24} lg={8} key={index}>
                  <motion.div variants={fadeInUp}>
                    <Card className="testimonial-card">
                      <div className="testimonial-rating">
                        <Rate disabled defaultValue={testimonial.rating} />
                      </div>

                      <Paragraph className="testimonial-content">
                        "{testimonial.content}"
                      </Paragraph>

                      <div className="testimonial-author">
                        <Avatar
                          size={48}
                          src={
                            !imageLoading && testimonial.avatar
                              ? testimonial.avatar.url
                              : undefined
                          }
                          className="author-avatar"
                        />
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
                Join our community today and start creating positive change in
                your neighborhood. Every contribution, no matter how small,
                makes a real impact.
              </Paragraph>
              <Space size="large" className="cta-actions">
                <Button
                  type="primary"
                  size="large"
                  icon={<FiUsers />}
                  className="btn-primary-large"
                >
                  Join Our Community
                </Button>
                <Button
                  size="large"
                  icon={<FiTrendingUp />}
                  className="btn-secondary-large"
                >
                  Start a Cause
                </Button>
              </Space>
            </div>
          </motion.div>
        </section>
      </div>
    </MainLayout>
  );
}
