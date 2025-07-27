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
    },
    {
      icon: <FiShield size={32} />,
      title: "Transparent & Secure",
      description:
        "Track your contributions with complete transparency and know exactly how your help makes a difference.",
      type: "security",
    },
    {
      icon: <FiZap size={32} />,
      title: "Immediate Impact",
      description:
        "Your contributions start making a difference immediately, helping families in need today.",
      type: "impact",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Community Volunteer",
      content:
        "Hands2gether has made it so easy to help families in my area. The platform is intuitive and I can see exactly how my contributions are being used.",
      rating: 5,
      avatar: profileImages[0],
    },
    {
      name: "Michael Chen",
      role: "Cause Creator",
      content:
        "I was able to organize a community feeding program that reached over 200 families. The support and tools provided are incredible.",
      rating: 5,
      avatar: profileImages[1],
    },
    {
      name: "Emily Rodriguez",
      role: "Regular Contributor",
      content:
        "What I love most is the transparency. I can track how my donations are used and see the real impact on families.",
      rating: 5,
      avatar: profileImages[2],
    },
  ];

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
                  <Button
                    type="primary"
                    size="large"
                    icon={<FiHeart />}
                    className="btn-primary-large"
                  >
                    <Link href="/causes">Explore Causes</Link>
                  </Button>
                  <Button
                    size="large"
                    icon={<FiPlay />}
                    className="btn-secondary-large"
                  >
                    Watch How It Works
                  </Button>
                </Space>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="hero-stats"
            >
              <Row gutter={[32, 16]} className="stats-row">
                <Col xs={24} sm={8}>
                  <Statistic
                    title="Total Raised"
                    value={287543}
                    prefix="$"
                    valueStyle={{ color: "#3f8600" }}
                    className="stat-item"
                  />
                </Col>
                <Col xs={24} sm={8}>
                  <Statistic
                    title="Families Helped"
                    value={1245}
                    valueStyle={{ color: "#cf1322" }}
                    className="stat-item"
                  />
                </Col>
                <Col xs={24} sm={8}>
                  <Statistic
                    title="Active Causes"
                    value={89}
                    valueStyle={{ color: "#1890ff" }}
                    className="stat-item"
                  />
                </Col>
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
