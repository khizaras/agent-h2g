'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Button, Card, Row, Col, Statistic, Typography, Space } from 'antd';
import { 
  ArrowRightOutlined, 
  HeartOutlined, 
  UserOutlined, 
  BookOutlined,
  ThunderboltOutlined,
  GlobalOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import Image from 'next/image';
import { HeroSection } from '@/components/home/HeroSection';
import { CategoryShowcase } from '@/components/home/CategoryShowcase';
import { FeaturedCauses } from '@/components/home/FeaturedCauses';
import { HowItWorks } from '@/components/home/HowItWorks';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { ImpactStats } from '@/components/home/ImpactStats';
import { CTASection } from '@/components/home/CTASection';

const { Title, Paragraph } = Typography;

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
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

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  const [statsRef, statsInView] = useInView({
    threshold: 0.3,
    triggerOnce: true
  });

  const [featuresRef, featuresInView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  return (
    <div ref={containerRef} className="min-h-screen overflow-hidden">
      {/* Background Pattern */}
      <motion.div
        style={{ y: backgroundY }}
        className="fixed inset-0 z-0"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse" />
          <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000" />
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000" />
        </div>
      </motion.div>

      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Impact Statistics */}
        <motion.section
          ref={statsRef}
          initial="hidden"
          animate={statsInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="py-20 bg-white/80 backdrop-blur-md"
        >
          <div className="container mx-auto px-6">
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <Title level={2} className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Making Real Impact Together
              </Title>
              <Paragraph className="text-lg text-gray-600 max-w-2xl mx-auto">
                Join thousands of community members who are already making a difference
              </Paragraph>
            </motion.div>

            <ImpactStats />
          </div>
        </motion.section>

        {/* Category Showcase */}
        <CategoryShowcase />

        {/* Featured Causes */}
        <FeaturedCauses />

        {/* How It Works */}
        <HowItWorks />

        {/* Key Features */}
        <motion.section
          ref={featuresRef}
          initial="hidden"
          animate={featuresInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="py-20 bg-gradient-to-r from-blue-600 to-purple-600"
        >
          <div className="container mx-auto px-6">
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <Title level={2} className="mb-4 text-white">
                Enterprise-Grade Platform
              </Title>
              <Paragraph className="text-lg text-blue-100 max-w-2xl mx-auto">
                Built with cutting-edge technology for maximum impact and reliability
              </Paragraph>
            </motion.div>

            <Row gutter={[32, 32]} className="max-w-6xl mx-auto">
              {[
                {
                  icon: <ThunderboltOutlined className="text-4xl text-yellow-400" />,
                  title: "Lightning Fast",
                  description: "Optimized performance with Next.js 15 and advanced caching"
                },
                {
                  icon: <GlobalOutlined className="text-4xl text-green-400" />,
                  title: "Global Reach",
                  description: "Connect communities worldwide with real-time collaboration"
                },
                {
                  icon: <SafetyCertificateOutlined className="text-4xl text-blue-300" />,
                  title: "Enterprise Security",
                  description: "Bank-grade security with end-to-end encryption"
                }
              ].map((feature, index) => (
                <Col xs={24} md={8} key={index}>
                  <motion.div
                    variants={fadeInUp}
                    whileHover={{ 
                      scale: 1.05,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <Card 
                      className="text-center h-full bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300"
                      bodyStyle={{ padding: '2rem' }}
                    >
                      <div className="mb-4">{feature.icon}</div>
                      <Title level={4} className="text-white mb-3">
                        {feature.title}
                      </Title>
                      <Paragraph className="text-blue-100 mb-0">
                        {feature.description}
                      </Paragraph>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </div>
        </motion.section>

        {/* Testimonials */}
        <TestimonialsSection />

        {/* CTA Section */}
        <CTASection />
      </div>
    </div>
  );
}