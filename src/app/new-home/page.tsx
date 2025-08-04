"use client";

import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Button,
  Typography,
  Space,
  Avatar,
  Image,
  Statistic,
  Tag,
  Progress,
} from 'antd';
import {
  FiArrowRight,
  FiCheck,
  FiUsers,
  FiTrendingUp,
  FiStar,
  FiPlay,
  FiShield,
  FiGlobe,
  FiZap,
  FiTarget,
} from 'react-icons/fi';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { imageConfig } from '@/config/theme';

const { Title, Text, Paragraph } = Typography;

export default function PremiumNewHomePage() {
  const router = useRouter();
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Premium animations
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  // Enterprise metrics
  const enterpriseMetrics = [
    { 
      value: "340%", 
      label: "Efficiency increase", 
      description: "Average resource allocation improvement",
      icon: <FiTrendingUp />,
      color: "#06b6d4"
    },
    { 
      value: "2.8M", 
      label: "Lives transformed", 
      description: "Cross-platform impact measurement",
      icon: <FiUsers />,
      color: "#8b5cf6"
    },
    { 
      value: "98.4%", 
      label: "Client satisfaction", 
      description: "Enterprise-grade service reliability",
      icon: <FiStar />,
      color: "#10b981"
    },
    { 
      value: "45min", 
      label: "Average setup time", 
      description: "From onboarding to first initiative",
      icon: <FiZap />,
      color: "#f59e0b"
    }
  ];

  // Three premium pillars
  const premiumPillars = [
    {
      title: "Strategic Food Networks",
      subtitle: "Enterprise-grade nutrition distribution",
      description: "Orchestrate sophisticated supply chains connecting premium food partners with underserved communities through data-driven allocation strategies.",
      image: imageConfig.getImage('photo-1556909114-f6e7ad7d3136', { w: 600, h: 400 }),
      metrics: {
        partners: "847+",
        efficiency: "89%",
        coverage: "23 cities"
      },
      features: [
        "AI-powered demand forecasting",
        "Real-time inventory optimization", 
        "Quality assurance protocols",
        "Impact measurement dashboard"
      ],
      color: "#dc2626",
      gradient: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
      route: "/causes?category=food"
    },
    {
      title: "Sustainable Fashion Exchange",
      subtitle: "Circular economy textile platform",
      description: "Deploy advanced clothing redistribution systems that maximize utility while minimizing environmental impact through sophisticated matching algorithms.",
      image: imageConfig.getImage('photo-1441986300917-64674bd600d8', { w: 600, h: 400 }),
      metrics: {
        exchanges: "15.2K",
        sustainability: "94%",
        satisfaction: "4.9/5"
      },
      features: [
        "Size optimization algorithms",
        "Carbon footprint tracking",
        "Premium brand partnerships",
        "Seasonal demand analytics"
      ],
      color: "#7c3aed",
      gradient: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
      route: "/causes?category=clothing"
    },
    {
      title: "Professional Development Hub",
      subtitle: "Executive-level skill transformation",
      description: "Deliver sophisticated training programs and mentorship networks designed to accelerate career advancement and professional excellence.",
      image: imageConfig.getImage('photo-1571019613454-1cb2f99b2d8b', { w: 600, h: 400 }),
      metrics: {
        graduated: "3.4K",
        placement: "92%",
        income: "+156%"
      },
      features: [
        "Executive mentorship matching",
        "Industry certification programs",
        "Career trajectory analysis",
        "Corporate partnership network"
      ],
      color: "#0d9488",
      gradient: "linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)",
      route: "/education"
    }
  ];

  // Enterprise testimonials
  const enterpriseTestimonials = [
    {
      name: 'Sarah Chen',
      title: 'Chief Strategy Officer',
      company: 'Metropolitan Community Alliance',
      avatar: imageConfig.getImage('photo-1494790108755-2616b612b786', { w: 100, h: 100, fit: 'crop', crop: 'face' }),
      quote: 'This platform revolutionized our resource allocation strategy. We achieved 340% efficiency increase and expanded our impact across 12 metropolitan areas.',
      metrics: {
        impact: '84,000 residents served',
        efficiency: '340% improvement',
        roi: '$2.4M annual savings'
      },
      rating: 5
    },
    {
      name: 'Marcus Rivera',
      title: 'Director of Operations',
      company: 'Corporate Social Impact Ventures',
      avatar: imageConfig.getImage('photo-1507003211169-0a1dd7228f2d', { w: 100, h: 100, fit: 'crop', crop: 'face' }),
      quote: 'The analytical capabilities and strategic insights transformed how we approach community partnerships. ROI tracking is exceptional.',
      metrics: {
        impact: '45 corporate partners',
        efficiency: '89% resource optimization',
        roi: '12x investment return'
      },
      rating: 5
    },
    {
      name: 'Dr. Elena Vasquez',
      title: 'Chief Innovation Officer', 
      company: 'Future Cities Institute',
      avatar: imageConfig.getImage('photo-1559839734-2b71ea197ec2', { w: 100, h: 100, fit: 'crop', crop: 'face' }),
      quote: 'Sophisticated data visualization and predictive analytics enable us to anticipate community needs and deploy resources strategically.',
      metrics: {
        impact: '156% outcome improvement',
        efficiency: '91% accuracy rate', 
        roi: '$5.2M impact generated'
      },
      rating: 5
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % enterpriseTestimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <MainLayout>
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#ffffff',
        position: 'relative',
        overflow: 'hidden'
      }}>
        
        {/* Floating geometric shapes */}
        <motion.div
          style={{
            position: 'absolute',
            top: '10%',
            right: '10%',
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            opacity: 0.1,
            zIndex: 0
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <motion.div
          style={{
            position: 'absolute',
            bottom: '20%',
            left: '5%',
            width: 80,
            height: 80,
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #06b6d4 0%, #10b981 100%)',
            opacity: 0.1,
            zIndex: 0
          }}
          animate={{
            x: [0, 30, 0],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Premium Hero Section */}
        <section style={{
          position: 'relative',
          padding: '120px 0 80px',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          zIndex: 1
        }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <Row gutter={[64, 48]} align="middle">
              <Col xs={24} lg={14}>
                <motion.div {...fadeInUp}>
                  {/* Premium status badge */}
                  <motion.div 
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)',
                      padding: '10px 20px',
                      borderRadius: 30,
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                      marginBottom: 32,
                      boxShadow: '0 4px 20px rgba(59, 130, 246, 0.1)'
                    }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FiShield style={{ color: '#3b82f6', fontSize: 16 }} />
                    <Text style={{ 
                      color: '#3b82f6', 
                      fontSize: 14, 
                      fontWeight: 600,
                      fontFamily: 'var(--font-inter)',
                      letterSpacing: '-0.01em'
                    }}>
                      Enterprise-grade • Trusted by 2,847 organizations
                    </Text>
                  </motion.div>

                  <Title 
                    level={1} 
                    style={{ 
                      fontSize: '64px',
                      fontWeight: 800,
                      color: '#0f172a',
                      marginBottom: 24,
                      lineHeight: 1.1,
                      fontFamily: 'var(--font-inter)',
                      letterSpacing: '-0.025em'
                    }}
                  >
                    Orchestrate
                    <br />
                    <span style={{ 
                      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>
                      meaningful change
                    </span>
                  </Title>
                  
                  <Paragraph 
                    style={{ 
                      fontSize: '22px',
                      color: '#64748b',
                      marginBottom: 40,
                      lineHeight: 1.6,
                      maxWidth: '600px',
                      fontFamily: 'var(--font-inter)',
                      fontWeight: 400
                    }}
                  >
                    Advanced community impact platform for strategic leaders who demand 
                    excellence in resource allocation and measurable outcomes.
                  </Paragraph>
                  
                  <Space size={20} wrap>
                    <motion.div
                      whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)' }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="primary"
                        size="large"
                        icon={<FiArrowRight />}
                        style={{
                          height: 56,
                          padding: '0 32px',
                          fontSize: '16px',
                          borderRadius: 12,
                          fontWeight: 600,
                          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                          border: 'none',
                          fontFamily: 'var(--font-inter)',
                          letterSpacing: '-0.01em'
                        }}
                        onClick={() => router.push('/causes/create')}
                      >
                        Launch strategic initiative
                      </Button>
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        size="large"
                        icon={<FiPlay />}
                        style={{
                          height: 56,
                          padding: '0 32px',
                          fontSize: '16px',
                          borderRadius: 12,
                          fontWeight: 600,
                          color: '#0f172a',
                          borderColor: '#e2e8f0',
                          background: '#ffffff',
                          fontFamily: 'var(--font-inter)',
                          letterSpacing: '-0.01em'
                        }}
                        onClick={() => router.push('/causes')}
                      >
                        Watch demo
                      </Button>
                    </motion.div>
                  </Space>
                </motion.div>
              </Col>
              
              <Col xs={24} lg={10}>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, x: 100 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ duration: 1, delay: 0.3 }}
                  style={{ position: 'relative' }}
                >
                  {/* Premium dashboard mockup */}
                  <div style={{
                    position: 'relative',
                    borderRadius: 20,
                    overflow: 'hidden',
                    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0'
                  }}>
                    <Image
                      src={imageConfig.getRandomImage('hero', { w: 800, h: 600 })}
                      alt="Premium community dashboard"
                      width="100%"
                      height={400}
                      style={{ objectFit: 'cover' }}
                      preview={false}
                    />
                    
                    {/* Floating metrics cards */}
                    <motion.div 
                      style={{
                        position: 'absolute',
                        top: 20,
                        right: 20,
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: 12,
                        padding: '16px 20px',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                      }}
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FiTrendingUp style={{ color: '#10b981', fontSize: 16 }} />
                        <div>
                          <div style={{ 
                            fontWeight: 700, 
                            color: '#0f172a',
                            fontSize: 18,
                            fontFamily: 'var(--font-inter)'
                          }}>
                            340%
                          </div>
                          <div style={{ 
                            color: '#64748b', 
                            fontSize: 12,
                            fontFamily: 'var(--font-inter)'
                          }}>
                            Efficiency gain
                          </div>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      style={{
                        position: 'absolute',
                        bottom: 20,
                        left: 20,
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: 12,
                        padding: '16px 20px',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                      }}
                      animate={{ y: [0, 10, 0] }}
                      transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FiUsers style={{ color: '#3b82f6', fontSize: 16 }} />
                        <div>
                          <div style={{ 
                            fontWeight: 700, 
                            color: '#0f172a',
                            fontSize: 18,
                            fontFamily: 'var(--font-inter)'
                          }}>
                            2.8M
                          </div>
                          <div style={{ 
                            color: '#64748b', 
                            fontSize: 12,
                            fontFamily: 'var(--font-inter)'
                          }}>
                            Lives impacted
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </Col>
            </Row>
          </div>
        </section>

        {/* Enterprise Metrics */}
        <section style={{ 
          padding: '80px 0', 
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff'
        }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <Row gutter={[40, 40]}>
                {enterpriseMetrics.map((metric, index) => (
                  <Col xs={12} sm={6} key={index}>
                    <motion.div 
                      variants={fadeInUp}
                      whileHover={{ y: -8, scale: 1.05 }}
                      style={{ textAlign: 'center' }}
                    >
                      <div style={{ 
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${metric.color}20 0%, ${metric.color}40 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px',
                        border: `2px solid ${metric.color}30`
                      }}>
                        <div style={{ color: metric.color, fontSize: 24 }}>
                          {metric.icon}
                        </div>
                      </div>
                      
                      <div style={{ 
                        fontWeight: 800, 
                        color: '#ffffff',
                        fontSize: '32px',
                        marginBottom: 8,
                        fontFamily: 'var(--font-inter)',
                        letterSpacing: '-0.02em'
                      }}>
                        {metric.value}
                      </div>
                      <div style={{ 
                        color: '#ffffff', 
                        fontSize: 16, 
                        fontWeight: 600,
                        marginBottom: 4,
                        fontFamily: 'var(--font-inter)'
                      }}>
                        {metric.label}
                      </div>
                      <div style={{ 
                        color: '#94a3b8', 
                        fontSize: 13,
                        fontFamily: 'var(--font-inter)'
                      }}>
                        {metric.description}
                      </div>
                    </motion.div>
                  </Col>
                ))}
              </Row>
            </motion.div>
          </div>
        </section>

        {/* Premium Pillars */}
        <section style={{ padding: '100px 0', backgroundColor: '#ffffff' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <motion.div {...fadeInUp} style={{ textAlign: 'center', marginBottom: 80 }}>
              <Title level={2} style={{ 
                color: '#0f172a', 
                marginBottom: 16,
                fontSize: '48px',
                fontWeight: 700,
                fontFamily: 'var(--font-inter)',
                letterSpacing: '-0.02em'
              }}>
                Three strategic pillars
              </Title>
              <Paragraph style={{ 
                color: '#64748b', 
                fontSize: 20, 
                maxWidth: 700, 
                margin: '0 auto',
                fontFamily: 'var(--font-inter)'
              }}>
                Advanced frameworks for sophisticated community impact measurement 
                and resource optimization across key vertical markets.
              </Paragraph>
            </motion.div>

            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {premiumPillars.map((pillar, index) => (
                <motion.div 
                  key={index} 
                  variants={fadeInUp}
                  style={{ marginBottom: 80 }}
                >
                  <Row gutter={[80, 40]} align="middle">
                    <Col xs={24} lg={index % 2 === 0 ? 12 : 0} order={index % 2 === 0 ? 1 : 2}>
                      <motion.div
                        whileHover={{ scale: 1.02, y: -8 }}
                        transition={{ duration: 0.4 }}
                      >
                        <Card
                          style={{
                            borderRadius: 20,
                            overflow: 'hidden',
                            border: 'none',
                            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                            background: `linear-gradient(135deg, ${pillar.color}05 0%, #ffffff 100%)`
                          }}
                          bodyStyle={{ padding: 0 }}
                        >
                          <div style={{ position: 'relative' }}>
                            <Image
                              src={pillar.image}
                              alt={pillar.title}
                              width="100%"
                              height={300}
                              style={{ objectFit: 'cover' }}
                              preview={false}
                            />
                            <div style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              background: `linear-gradient(135deg, ${pillar.color}40 0%, transparent 100%)`
                            }} />
                            
                            {/* Metrics overlay */}
                            <div style={{
                              position: 'absolute',
                              bottom: 20,
                              left: 20,
                              right: 20,
                              display: 'flex',
                              gap: 16
                            }}>
                              {Object.entries(pillar.metrics).map(([key, value]) => (
                                <div key={key} style={{
                                  background: 'rgba(255, 255, 255, 0.95)',
                                  backdropFilter: 'blur(10px)',
                                  borderRadius: 8,
                                  padding: '8px 12px',
                                  flex: 1,
                                  textAlign: 'center'
                                }}>
                                  <div style={{ 
                                    fontWeight: 700, 
                                    color: '#0f172a',
                                    fontSize: 16,
                                    fontFamily: 'var(--font-inter)'
                                  }}>
                                    {value}
                                  </div>
                                  <div style={{ 
                                    color: '#64748b', 
                                    fontSize: 11,
                                    textTransform: 'capitalize',
                                    fontFamily: 'var(--font-inter)'
                                  }}>
                                    {key}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    </Col>
                    
                    <Col xs={24} lg={12} order={index % 2 === 0 ? 2 : 1}>
                      <div style={{ padding: index % 2 === 0 ? '0 0 0 40px' : '0 40px 0 0' }}>
                        <Title level={3} style={{ 
                          marginBottom: 12, 
                          color: '#0f172a',
                          fontFamily: 'var(--font-inter)',
                          fontWeight: 700,
                          fontSize: '32px',
                          letterSpacing: '-0.01em'
                        }}>
                          {pillar.title}
                        </Title>
                        
                        <Text style={{ 
                          color: pillar.color, 
                          fontSize: 16, 
                          fontWeight: 600,
                          display: 'block',
                          marginBottom: 20,
                          fontFamily: 'var(--font-inter)'
                        }}>
                          {pillar.subtitle}
                        </Text>
                        
                        <Paragraph style={{ 
                          color: '#64748b', 
                          marginBottom: 32,
                          lineHeight: 1.7,
                          fontSize: 16,
                          fontFamily: 'var(--font-inter)'
                        }}>
                          {pillar.description}
                        </Paragraph>
                        
                        <div style={{ marginBottom: 32 }}>
                          {pillar.features.map((feature, featureIndex) => (
                            <motion.div 
                              key={featureIndex} 
                              style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 12, 
                                marginBottom: 12 
                              }}
                              whileHover={{ x: 8 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div style={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                background: pillar.gradient,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                <FiCheck style={{ color: '#ffffff', fontSize: 12 }} />
                              </div>
                              <Text style={{ 
                                color: '#475569', 
                                fontSize: 15,
                                fontFamily: 'var(--font-inter)'
                              }}>
                                {feature}
                              </Text>
                            </motion.div>
                          ))}
                        </div>
                        
                        <motion.div
                          whileHover={{ x: 8 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Button
                            type="link"
                            icon={<FiArrowRight />}
                            style={{
                              padding: 0,
                              height: 'auto',
                              color: pillar.color,
                              fontWeight: 600,
                              fontSize: 16,
                              fontFamily: 'var(--font-inter)'
                            }}
                            onClick={() => router.push(pillar.route)}
                          >
                            Explore strategic framework
                          </Button>
                        </motion.div>
                      </div>
                    </Col>
                  </Row>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Enterprise Testimonials */}
        <section style={{ 
          padding: '100px 0', 
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
        }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <motion.div {...fadeInUp} style={{ textAlign: 'center', marginBottom: 80 }}>
              <Title level={2} style={{ 
                color: '#0f172a', 
                marginBottom: 16,
                fontSize: '48px',
                fontWeight: 700,
                fontFamily: 'var(--font-inter)',
                letterSpacing: '-0.02em'
              }}>
                Trusted by enterprise leaders
              </Title>
              <Paragraph style={{ 
                color: '#64748b', 
                fontSize: 20, 
                maxWidth: 700, 
                margin: '0 auto',
                fontFamily: 'var(--font-inter)'
              }}>
                Strategic decision-makers who demand excellence choose our platform 
                for mission-critical community impact initiatives.
              </Paragraph>
            </motion.div>

            <Row gutter={[40, 40]}>
              {enterpriseTestimonials.map((testimonial, index) => (
                <Col xs={24} md={8} key={index}>
                  <motion.div 
                    whileHover={{ y: -12, scale: 1.02 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card
                      style={{
                        borderRadius: 20,
                        border: 'none',
                        height: '100%',
                        background: '#ffffff',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
                      }}
                      bodyStyle={{ padding: '40px' }}
                    >
                      {/* Rating stars */}
                      <div style={{ marginBottom: 24, display: 'flex', gap: 4 }}>
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <FiStar key={i} style={{ color: '#fbbf24', fontSize: 16, fill: '#fbbf24' }} />
                        ))}
                      </div>
                      
                      <Paragraph style={{ 
                        color: '#0f172a', 
                        fontSize: 16, 
                        lineHeight: 1.7, 
                        marginBottom: 32,
                        fontFamily: 'var(--font-inter)'
                      }}>
                        "{testimonial.quote}"
                      </Paragraph>
                      
                      {/* Metrics */}
                      <div style={{ marginBottom: 32 }}>
                        {Object.entries(testimonial.metrics).map(([key, value]) => (
                          <div key={key} style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            marginBottom: 8,
                            padding: '8px 0',
                            borderBottom: '1px solid #f1f5f9'
                          }}>
                            <Text style={{ 
                              color: '#64748b', 
                              fontSize: 13,
                              textTransform: 'capitalize',
                              fontFamily: 'var(--font-inter)'
                            }}>
                              {key}:
                            </Text>
                            <Text style={{ 
                              color: '#0f172a', 
                              fontSize: 13,
                              fontWeight: 600,
                              fontFamily: 'var(--font-inter)'
                            }}>
                              {value}
                            </Text>
                          </div>
                        ))}
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <Avatar src={testimonial.avatar} size={56} />
                        <div>
                          <div style={{ 
                            fontWeight: 600, 
                            color: '#0f172a',
                            fontSize: 16,
                            marginBottom: 2,
                            fontFamily: 'var(--font-inter)'
                          }}>
                            {testimonial.name}
                          </div>
                          <div style={{ 
                            color: '#3b82f6', 
                            fontSize: 14,
                            fontWeight: 600,
                            marginBottom: 2,
                            fontFamily: 'var(--font-inter)'
                          }}>
                            {testimonial.title}
                          </div>
                          <div style={{ 
                            color: '#64748b', 
                            fontSize: 13,
                            fontFamily: 'var(--font-inter)'
                          }}>
                            {testimonial.company}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        {/* Premium CTA */}
        <section style={{ 
          padding: '100px 0', 
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Animated background elements */}
          <motion.div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `
                radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 40% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)
              `,
            }}
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
          
          <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px', position: 'relative' }}>
            <motion.div {...fadeInUp}>
              <Title level={2} style={{ 
                color: '#ffffff', 
                marginBottom: 16,
                fontSize: '48px',
                fontWeight: 700,
                fontFamily: 'var(--font-inter)',
                letterSpacing: '-0.02em'
              }}>
                Ready to transform your impact?
              </Title>
              
              <Paragraph style={{ 
                color: '#94a3b8', 
                fontSize: 20, 
                marginBottom: 48,
                maxWidth: 600,
                margin: '0 auto 48px',
                fontFamily: 'var(--font-inter)'
              }}>
                Join the executive network driving sophisticated community transformation 
                through data-driven strategies and measurable outcomes.
              </Paragraph>
              
              <Space size="large" wrap>
                <motion.div
                  whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.4)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    size="large"
                    style={{
                      height: 56,
                      padding: '0 40px',
                      fontSize: 16,
                      borderRadius: 12,
                      fontWeight: 600,
                      backgroundColor: '#ffffff',
                      borderColor: '#ffffff',
                      color: '#0f172a',
                      fontFamily: 'var(--font-inter)',
                    }}
                    icon={<FiArrowRight />}
                    onClick={() => router.push('/causes/create')}
                  >
                    Launch strategic initiative
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    size="large"
                    style={{
                      height: 56,
                      padding: '0 40px',
                      fontSize: 16,
                      borderRadius: 12,
                      fontWeight: 600,
                      backgroundColor: 'transparent',
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      color: '#ffffff',
                      fontFamily: 'var(--font-inter)',
                    }}
                    icon={<FiGlobe />}
                    onClick={() => router.push('/causes')}
                  >
                    Explore network
                  </Button>
                </motion.div>
              </Space>
            </motion.div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}