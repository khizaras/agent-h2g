"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  Button,
  Card,
  Progress,
  Statistic,
  Typography,
  Row,
  Col,
  Avatar,
  Space,
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
  FiStar,
  FiPlay,
  FiClock,
  FiAward,
} from "react-icons/fi";
import { MainLayout } from "@/components/layout/MainLayout";

const { Title, Text, Paragraph } = Typography;

// Enhanced TypeScript interfaces
interface Cause {
  id: string;
  title: string;
  description: string;
  goal: number;
  raised: number;
  image: string;
  category: string;
  urgent: boolean;
  contributors: number;
  daysLeft: number;
  verified: boolean;
  trending: boolean;
}

interface CommunityMetric {
  label: string;
  value: string;
  icon: React.ReactNode;
  growth: string;
  color: string;
  description: string;
}

interface Testimonial {
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
  location: string;
  verified: boolean;
}

const UltimateHomePage: React.FC = () => {
  const { data: session } = useSession();
  const { scrollY } = useScroll();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Enhanced community metrics
  const communityMetrics: CommunityMetric[] = [
    {
      label: "Meals Served",
      value: "127,459",
      icon: <FiHeart size={32} />,
      growth: "+24%",
      color: "#ef4444",
      description: "Nutritious meals provided to families",
    },
    {
      label: "Active Contributors",
      value: "8,342",
      icon: <FiUsers size={32} />,
      growth: "+16%",
      color: "#3b82f6",
      description: "Community members making a difference",
    },
    {
      label: "Communities Reached",
      value: "156",
      icon: <FiGlobe size={32} />,
      growth: "+12%",
      color: "#10b981",
      description: "Local communities we serve",
    },
    {
      label: "Success Rate",
      value: "96.8%",
      icon: <FiAward size={32} />,
      growth: "+3%",
      color: "#f59e0b",
      description: "Causes reaching their goals",
    },
  ];

  // Featured causes with enhanced data
  const [featuredCauses] = useState<Cause[]>([
    {
      id: "1",
      title: "Emergency Winter Food Relief",
      description:
        "Providing warm meals and emergency food packages to families facing crisis during the harsh winter months.",
      goal: 25000,
      raised: 18750,
      image:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      category: "Emergency Relief",
      urgent: true,
      contributors: 312,
      daysLeft: 12,
      verified: true,
      trending: true,
    },
    {
      id: "2",
      title: "Community Garden & Food Hub",
      description:
        "Building a sustainable community garden that will provide fresh produce and educational programs for local families.",
      goal: 40000,
      raised: 32800,
      image:
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop",
      category: "Sustainability",
      urgent: false,
      contributors: 189,
      daysLeft: 25,
      verified: true,
      trending: false,
    },
    {
      id: "3",
      title: "Mobile Food Pantry Program",
      description:
        "Expanding our mobile food pantry to reach underserved rural communities with fresh groceries and essentials.",
      goal: 15000,
      raised: 11200,
      image:
        "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&h=600&fit=crop",
      category: "Outreach",
      urgent: false,
      contributors: 94,
      daysLeft: 18,
      verified: true,
      trending: true,
    },
  ]);

  // Enhanced testimonials
  const testimonials: Testimonial[] = [
    {
      name: "Maria Gonzalez",
      role: "Community Organizer",
      content:
        "This platform has revolutionized how we coordinate food relief in our neighborhood. The real-time tracking and community engagement features are game-changers.",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      location: "Austin, TX",
      verified: true,
    },
    {
      name: "David Kim",
      role: "Local Business Owner",
      content:
        "Through Hands2gether, our restaurant has been able to donate surplus food efficiently. We've helped feed over 800 families this year alone.",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      location: "Seattle, WA",
      verified: true,
    },
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  // Enhanced Cause Card Component
  const EnhancedCauseCard: React.FC<{ cause: Cause; index: number }> = ({
    cause,
    index,
  }) => {
    const progressPercent = Math.round((cause.raised / cause.goal) * 100);

    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        whileHover={{ y: -12, transition: { duration: 0.3 } }}
        viewport={{ once: true }}
      >
        <Card
          hoverable
          className="enhanced-cause-card"
          cover={
            <div style={{ position: 'relative', height: '224px', overflow: 'hidden' }}>
              <img
                src={cause.image}
                alt={cause.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease'
                }}
              />

              {/* Status badges */}
              <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {cause.urgent && (
                  <Tag color="red" style={{ fontWeight: '600' }}>
                    URGENT
                  </Tag>
                )}
                {cause.trending && (
                  <Tag icon={<FiTrendingUp size={12} />} color="orange">
                    Trending
                  </Tag>
                )}
                {cause.verified && (
                  <Tag icon={<FiCheckCircle size={12} />} color="blue">
                    Verified
                  </Tag>
                )}
              </div>

              <Tag color="green" style={{ position: 'absolute', top: '16px', right: '16px' }}>
                {cause.category}
              </Tag>

              {/* Quick stats overlay */}
              <div 
                style={{ 
                  position: 'absolute', 
                  bottom: 0, 
                  left: 0, 
                  right: 0, 
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                  padding: '16px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'white', fontSize: '14px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FiUsers size={16} />
                    {cause.contributors}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FiClock size={16} />
                    {cause.daysLeft}d left
                  </span>
                </div>
              </div>
            </div>
          }
          styles={{ body: { padding: "24px", height: "100%" } }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '16px' }}>
            <div style={{ flexGrow: 1 }}>
              <Title level={4} style={{ marginBottom: '8px', minHeight: '56px', lineHeight: '1.4' }}>
                {cause.title}
              </Title>
              <Text 
                type="secondary" 
                style={{ 
                  fontSize: '14px', 
                  lineHeight: '1.5',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {cause.description}
              </Text>
            </div>            
            {/* Enhanced progress section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text strong style={{ fontSize: '18px' }}>
                  ${cause.raised.toLocaleString()}
                </Text>
                <Text type="secondary">of ${cause.goal.toLocaleString()}</Text>
              </div>
              <Progress
                percent={progressPercent}
                showInfo={false}
                strokeColor={{
                  "0%": "#10b981",
                  "50%": "#059669",
                  "100%": "#047857",
                }}
                trailColor="#f3f4f6"
                strokeWidth={8}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#6b7280' }}>
                <span>{progressPercent}% funded</span>
                <span>{cause.daysLeft} days remaining</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px' }}>
              <Space>
                <Avatar.Group maxCount={3} size="small">
                  <Avatar src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face" />
                  <Avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" />
                  <Avatar src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face" />
                </Avatar.Group>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  +{cause.contributors} supporters
                </Text>
              </Space>
              <Button
                type="primary"
                size="small"
                className="hero-btn-primary"
                style={{ minWidth: "100px" }}
              >
                Support Now
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  };

  return (
    <MainLayout>
      <div className="modern-home-page">
        {/* Ultra-Modern Hero Section */}
        <section className="parallax-hero">
          {/* Dynamic gradient background with Unsplash image */}
          <div className="parallax-bg">
            <div
              className="parallax-image"
              style={{
                backgroundImage: `
                  linear-gradient(135deg, rgba(102, 126, 234, 0.85) 0%, rgba(118, 75, 162, 0.85) 100%),
                  url('https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1920&h=1080&fit=crop&q=80')
                `,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
              }}
            />
            <div className="parallax-overlay" />
          </div>

          {/* Hero content */}
          <div className="parallax-hero-content">
            <div className="container">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="hero-text-center"
              >
                {/* Trust indicator */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6"
                >
                  <FiTrendingUp size={20} color="#fbbf24" />
                  <Text className="text-white text-sm font-medium">
                    Trusted by 8,000+ community members
                  </Text>
                </motion.div>

                <Title level={1} className="parallax-hero-title">
                  Transform Communities
                  <br />
                  <span className="title-gradient">One Meal at a Time</span>
                </Title>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <Paragraph className="parallax-hero-subtitle">
                    Join the largest community-driven platform for food
                    assistance. Connect with neighbors, support local causes,
                    and create lasting impact in communities that need it most.
                  </Paragraph>
                </motion.div>

                {/* Enhanced CTA buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="hero-actions"
                >
                  <Button
                    type="primary"
                    size="large"
                    className="hero-btn-primary"
                    icon={<FiHeart size={20} />}
                  >
                    Start Making Impact
                  </Button>
                  <Button
                    size="large"
                    className="hero-btn-secondary"
                    icon={<FiPlay size={20} />}
                  >
                    Watch Success Stories
                  </Button>
                </motion.div>

                {/* Real-time stats ticker */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.8 }}
                  className="mt-12 flex justify-center space-x-8 text-sm"
                >
                  {communityMetrics.slice(0, 3).map((metric, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl font-bold text-white">
                        {metric.value}
                      </div>
                      <div className="text-white/70">{metric.label}</div>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="scroll-indicator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            <motion.div
              className="scroll-arrow"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <FiArrowRight style={{ transform: "rotate(90deg)" }} size={20} />
            </motion.div>
            <span>Scroll to explore</span>
          </motion.div>
        </section>

        {/* Enhanced Community Impact Dashboard */}
        <section className="modern-stats-section">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Title level={2} className="mb-4 text-4xl">
                Our Community Impact
              </Title>
              <Text type="secondary" className="text-xl">
                Real metrics from real people creating extraordinary change
              </Text>
            </motion.div>

            <Row gutter={[32, 32]}>
              {communityMetrics.map((metric, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  >
                    <Card className="text-center h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                      <div
                        className="mb-6 flex justify-center p-4 rounded-full mx-auto w-fit"
                        style={{
                          backgroundColor: `${metric.color}15`,
                          color: metric.color,
                        }}
                      >
                        {metric.icon}
                      </div>
                      <Statistic
                        value={metric.value}
                        valueStyle={{
                          color: "#1f2937",
                          fontSize: "2.5rem",
                          fontWeight: "bold",
                          marginBottom: "8px",
                        }}
                      />
                      <Text className="block text-lg font-medium mb-2">
                        {metric.label}
                      </Text>
                      <Text type="secondary" className="text-sm mb-3">
                        {metric.description}
                      </Text>
                      <Tag color="green" className="text-sm px-3 py-1">
                        {metric.growth} this month
                      </Tag>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        {/* Premium Featured Causes */}
        <section className="py-20">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Title level={2} className="mb-4 text-4xl">
                Featured Causes
              </Title>
              <Text type="secondary" className="text-xl">
                Support these verified community initiatives and see your impact
                in real-time
              </Text>
            </motion.div>

            <Row gutter={[32, 32]}>
              {featuredCauses.map((cause, index) => (
                <Col xs={24} lg={8} key={cause.id}>
                  <EnhancedCauseCard cause={cause} index={index} />
                </Col>
              ))}
            </Row>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center mt-16"
            >
              <Button
                type="default"
                size="large"
                className="px-12 h-12 text-lg"
                icon={<FiArrowRight size={20} />}
              >
                Explore All Causes
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Premium Testimonials */}
        <section className="py-20 bg-gray-50">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Title level={2} className="mb-4 text-4xl">
                Voices from Our Community
              </Title>
              <Text type="secondary" className="text-xl">
                Stories from the people making and receiving impact
              </Text>
            </motion.div>

            <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    background: 'white',
                    borderRadius: '24px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    padding: '48px',
                    textAlign: 'center',
                    margin: '0 16px'
                  }}
                >
                  <div style={{ marginBottom: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                      {[...Array(testimonials[currentTestimonial].rating)].map(
                        (_, i) => (
                          <FiStar
                            key={i}
                            size={24}
                            style={{ color: "#fbbf24", fill: "#fbbf24" }}
                          />
                        ),
                      )}
                    </div>
                    <Text 
                      style={{ 
                        fontSize: '20px', 
                        color: '#374151', 
                        lineHeight: '1.6', 
                        fontStyle: 'italic',
                        maxWidth: '600px',
                        margin: '0 auto',
                        display: 'block'
                      }}
                    >
                      "{testimonials[currentTestimonial].content}"
                    </Text>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
                    <Avatar
                      src={testimonials[currentTestimonial].avatar}
                      size={80}
                      style={{ border: '4px solid #dcfce7', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    />
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                        <Text strong style={{ fontSize: '18px' }}>
                          {testimonials[currentTestimonial].name}
                        </Text>
                        {testimonials[currentTestimonial].verified && (
                          <FiCheckCircle
                            size={20}
                            style={{ color: "#3b82f6" }}
                          />
                        )}
                      </div>
                      <Text type="secondary" className="block mb-1">
                        {testimonials[currentTestimonial].role}
                      </Text>
                      <Text type="secondary" className="text-sm">
                        {testimonials[currentTestimonial].location}
                      </Text>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Testimonial indicators */}
              <div className="flex justify-center space-x-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentTestimonial
                        ? "bg-green-600 w-8"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Ultimate Call to Action */}
        <section className="py-24 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 relative overflow-hidden">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center relative z-10"
            >
              <Title
                level={1}
                className="!text-white !text-5xl !font-bold !mb-6"
              >
                Ready to Transform Lives?
              </Title>
              <Paragraph className="!text-white/95 !text-2xl !mb-8 !leading-relaxed max-w-4xl mx-auto">
                Join 8,000+ community members who are already creating
                extraordinary impact. Every contribution, every volunteer hour,
                every shared meal builds stronger, more resilient communities.
              </Paragraph>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Button
                  type="primary"
                  size="large"
                  className="bg-white text-green-600 border-white hover:bg-gray-100 hover:text-green-700 h-16 px-12 text-xl font-semibold shadow-2xl"
                  icon={<FiTrendingUp size={24} />}
                >
                  Start Your Impact Journey
                </Button>
                <Button
                  size="large"
                  className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm h-16 px-12 text-xl"
                  icon={<FiHeart size={24} />}
                >
                  Create a Cause
                </Button>
              </div>

              {/* Trust indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                className="flex justify-center items-center space-x-8 mt-12 text-white/80"
              >
                <div className="flex items-center space-x-2">
                  <FiCheckCircle size={24} />
                  <span>100% Transparent</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiAward size={24} />
                  <span>96.8% Success Rate</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiHeart size={24} />
                  <span>127K+ Meals Served</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Dark Footer Section */}
        <footer className="bg-gray-900 text-white py-16">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              {/* Brand Column */}
              <div className="md:col-span-1">
                <Title level={3} className="!text-white !mb-4">
                  Hands2gether
                </Title>
                <Text className="text-gray-300 leading-relaxed mb-6">
                  Building stronger communities through food assistance, one
                  meal at a time.
                </Text>
                <div className="flex space-x-4">
                  <Button
                    type="text"
                    icon={<FiHeart size={20} />}
                    className="!text-gray-300 hover:!text-white"
                  />
                  <Button
                    type="text"
                    icon={<FiUsers size={20} />}
                    className="!text-gray-300 hover:!text-white"
                  />
                  <Button
                    type="text"
                    icon={<FiGlobe size={20} />}
                    className="!text-gray-300 hover:!text-white"
                  />
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <Title level={5} className="!text-white !mb-4">
                  Quick Links
                </Title>
                <div className="space-y-2">
                  <Link
                    href="/causes"
                    className="block text-gray-300 hover:text-white transition-colors"
                  >
                    Browse Causes
                  </Link>
                  <Link
                    href="/create"
                    className="block text-gray-300 hover:text-white transition-colors"
                  >
                    Create Cause
                  </Link>
                  <Link
                    href="/about"
                    className="block text-gray-300 hover:text-white transition-colors"
                  >
                    About Us
                  </Link>
                  <Link
                    href="/contact"
                    className="block text-gray-300 hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </div>
              </div>

              {/* Support */}
              <div>
                <Title level={5} className="!text-white !mb-4">
                  Support
                </Title>
                <div className="space-y-2">
                  <Link
                    href="/help"
                    className="block text-gray-300 hover:text-white transition-colors"
                  >
                    Help Center
                  </Link>
                  <Link
                    href="/community"
                    className="block text-gray-300 hover:text-white transition-colors"
                  >
                    Community Guidelines
                  </Link>
                  <Link
                    href="/safety"
                    className="block text-gray-300 hover:text-white transition-colors"
                  >
                    Safety & Trust
                  </Link>
                  <Link
                    href="/resources"
                    className="block text-gray-300 hover:text-white transition-colors"
                  >
                    Resources
                  </Link>
                </div>
              </div>

              {/* Newsletter */}
              <div>
                <Title level={5} className="!text-white !mb-4">
                  Stay Connected
                </Title>
                <Text className="text-gray-300 mb-4">
                  Get updates on community impact and new causes.
                </Text>
                <div className="space-y-3">
                  <Button
                    type="primary"
                    size="large"
                    className="w-full bg-green-600 hover:bg-green-700 border-green-600"
                    icon={<FiHeart size={16} />}
                  >
                    Join Our Community
                  </Button>
                </div>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-gray-800 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <Text className="text-gray-400 text-sm">
                  © 2025 Hands2gether. All rights reserved. Built with ❤️ for
                  communities.
                </Text>
                <div className="flex space-x-6 text-sm">
                  <Link
                    href="/privacy"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="/terms"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Terms of Service
                  </Link>
                  <Link
                    href="/cookies"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Cookie Policy
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </MainLayout>
  );
};

export default UltimateHomePage;
