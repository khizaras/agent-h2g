'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button, Typography, Row, Col, Card } from 'antd';
import { 
  ArrowRightOutlined,
  HeartOutlined,
  TeamOutlined,
  GlobalOutlined,
  ThunderboltOutlined,
  SafetyCertificateOutlined,
  StarFilled
} from '@ant-design/icons';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';

const { Title, Paragraph } = Typography;

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
  }
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const floatingAnimation = {
  y: [-20, 20, -20],
  transition: {
    duration: 6,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

const features = [
  {
    icon: <ThunderboltOutlined />,
    title: "Instant Impact",
    description: "Start helping within minutes"
  },
  {
    icon: <SafetyCertificateOutlined />,
    title: "Verified Safe",
    description: "All users background checked"
  },
  {
    icon: <GlobalOutlined />,
    title: "Global Reach",
    description: "Connect across 34 countries"
  }
];

export function CTASection() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <section ref={ref} className="py-20 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
        {/* Floating elements */}
        <motion.div
          animate={floatingAnimation}
          className="absolute top-1/4 left-1/6 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            ...floatingAnimation,
            transition: { ...floatingAnimation.transition, delay: 2 }
          }}
          className="absolute top-1/2 right-1/4 w-48 h-48 bg-purple-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            ...floatingAnimation,
            transition: { ...floatingAnimation.transition, delay: 4 }
          }}
          className="absolute bottom-1/4 left-1/3 w-56 h-56 bg-pink-400/20 rounded-full blur-3xl"
        />

        {/* Geometric patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border border-white/30 rounded-full" />
          <div className="absolute bottom-20 right-20 w-24 h-24 border border-white/30 rounded-full" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-white/20 rounded-full" />
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="text-center"
        >
          {/* Main Heading */}
          <motion.div variants={fadeInUp} className="mb-16">
            <Title level={1} className="text-white mb-6 text-4xl md:text-6xl font-bold">
              Your Community
              <br />
              <span className="bg-gradient-to-r from-yellow-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Needs You
              </span>
            </Title>
            <Paragraph className="text-blue-100 text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed">
              Join over 12,000 people who are already making their communities stronger, 
              one act of kindness at a time.
            </Paragraph>
          </motion.div>

          {/* Features Grid */}
          <motion.div variants={fadeInUp} className="mb-16">
            <Row gutter={[32, 32]} className="max-w-4xl mx-auto">
              {features.map((feature, index) => (
                <Col xs={24} md={8} key={index}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Card 
                      className="glass border-white/20 hover:border-white/40 transition-all duration-300"
                      bodyStyle={{ padding: '2rem', textAlign: 'center' }}
                    >
                      <div className="text-4xl text-blue-300 mb-4">
                        {feature.icon}
                      </div>
                      <Title level={4} className="text-white mb-2">
                        {feature.title}
                      </Title>
                      <Paragraph className="text-blue-200 mb-0">
                        {feature.description}
                      </Paragraph>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>

          {/* Stats Bar */}
          <motion.div variants={fadeInUp} className="mb-16">
            <Card className="glass border-white/20 max-w-4xl mx-auto">
              <Row gutter={[32, 16]} className="text-center">
                <Col xs={12} sm={6}>
                  <div className="text-white">
                    <div className="text-2xl md:text-3xl font-bold text-yellow-400">12,847</div>
                    <div className="text-blue-200 text-sm">Active Members</div>
                  </div>
                </Col>
                <Col xs={12} sm={6}>
                  <div className="text-white">
                    <div className="text-2xl md:text-3xl font-bold text-green-400">8,432</div>
                    <div className="text-blue-200 text-sm">Lives Impacted</div>
                  </div>
                </Col>
                <Col xs={12} sm={6}>
                  <div className="text-white">
                    <div className="text-2xl md:text-3xl font-bold text-pink-400">2,567</div>
                    <div className="text-blue-200 text-sm">Active Causes</div>
                  </div>
                </Col>
                <Col xs={12} sm={6}>
                  <div className="text-white">
                    <div className="flex items-center justify-center space-x-1">
                      <span className="text-2xl md:text-3xl font-bold text-orange-400">4.9</span>
                      <StarFilled className="text-orange-400" />
                    </div>
                    <div className="text-blue-200 text-sm">User Rating</div>
                  </div>
                </Col>
              </Row>
            </Card>
          </motion.div>

          {/* Main CTA Buttons */}
          <motion.div variants={fadeInUp} className="mb-16">
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/auth/register">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    type="primary"
                    size="large"
                    icon={<ArrowRightOutlined />}
                    className="h-16 px-12 text-lg font-bold bg-gradient-to-r from-yellow-400 to-orange-500 border-none hover:shadow-2xl text-black"
                  >
                    Join the Community
                  </Button>
                </motion.div>
              </Link>
              
              <Link href="/causes">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    size="large"
                    icon={<HeartOutlined />}
                    className="h-16 px-12 text-lg font-bold border-2 border-white text-white hover:bg-white hover:text-purple-600 transition-all duration-300"
                  >
                    Start Helping Now
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>

          {/* Secondary Actions */}
          <motion.div variants={fadeInUp} className="mb-12">
            <Row gutter={[24, 24]} className="max-w-3xl mx-auto">
              <Col xs={24} sm={12}>
                <Link href="/causes/create" className="block">
                  <Card 
                    className="glass border-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer group"
                    bodyStyle={{ padding: '2rem' }}
                  >
                    <div className="text-center">
                      <TeamOutlined className="text-3xl text-blue-300 mb-3 group-hover:scale-110 transition-transform duration-300" />
                      <Title level={4} className="text-white mb-2">
                        Need Help?
                      </Title>
                      <Paragraph className="text-blue-200 mb-0">
                        Create a cause and get support from your community
                      </Paragraph>
                    </div>
                  </Card>
                </Link>
              </Col>
              
              <Col xs={24} sm={12}>
                <Link href="/about" className="block">
                  <Card 
                    className="glass border-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer group"
                    bodyStyle={{ padding: '2rem' }}
                  >
                    <div className="text-center">
                      <GlobalOutlined className="text-3xl text-purple-300 mb-3 group-hover:scale-110 transition-transform duration-300" />
                      <Title level={4} className="text-white mb-2">
                        Learn More
                      </Title>
                      <Paragraph className="text-blue-200 mb-0">
                        Discover our mission and impact stories
                      </Paragraph>
                    </div>
                  </Card>
                </Link>
              </Col>
            </Row>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div variants={fadeInUp}>
            <Paragraph className="text-blue-300 text-sm max-w-2xl mx-auto">
              🔒 Your data is secure • ✅ Background verified members • 🌍 Active in 34 countries • ⭐ 4.9/5 user rating
            </Paragraph>
            <Paragraph className="text-blue-400 text-xs mt-4">
              By joining, you agree to our Terms of Service and Privacy Policy
            </Paragraph>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent" />
    </section>
  );
}