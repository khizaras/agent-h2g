"use client";

import React from 'react';
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
} from 'antd';
import {
  FiUsers,
  FiPlus,
  FiArrowRight,
  FiHeart,
  FiMapPin,
  FiTrendingUp,
  FiTarget,
  FiShield,
  FiCheck,
  FiBookOpen,
  FiMessageCircle,
  FiChevronRight,
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { imageConfig, animations } from '@/config/theme';

const { Title, Text, Paragraph } = Typography;

export default function HomePage() {
  const router = useRouter();

  // Microsoft-style impact metrics
  const impactMetrics = [
    { title: "Communities served", value: "2,847", icon: <FiUsers />, description: "Active local communities" },
    { title: "People helped", value: "156K+", icon: <FiHeart />, description: "Lives positively impacted" },
    { title: "Causes supported", value: "9,234", icon: <FiTarget />, description: "Community initiatives funded" },
    { title: "Success rate", value: "94%", icon: <FiCheck />, description: "Goals achieved together" }
  ];

  // Featured community initiatives - Microsoft card style
  const featuredInitiatives = [
    {
      image: imageConfig.getImage('photo-1504113888839-1c8eb50233d3', { w: 600, h: 300 }),
      title: 'Community Food Network',
      description: 'Connecting local restaurants with families in need to reduce waste and hunger',
      impact: '12,000 meals delivered',
      location: 'Seattle, WA',
      participants: 247,
      category: 'Food Security'
    },
    {
      image: imageConfig.getImage('photo-1571019613454-1cb2f99b2d8b', { w: 600, h: 300 }),
      title: 'Digital Literacy Program',
      description: 'Empowering seniors with essential technology skills for modern life',
      impact: '500+ people trained',
      location: 'Portland, OR',
      participants: 189,
      category: 'Education'
    },
    {
      image: imageConfig.getImage('photo-1441986300917-64674bd600d8', { w: 600, h: 300 }),
      title: 'Clothing Exchange Network',
      description: 'Sustainable fashion sharing that helps families and reduces waste',
      impact: '2,000+ items shared',
      location: 'Denver, CO',
      participants: 342,
      category: 'Sustainability'
    }
  ];

  // Microsoft-style process steps
  const processSteps = [
    {
      icon: <FiPlus />,
      title: 'Start your initiative',
      description: 'Share your community need or offer to help others in your area',
      color: '#0078d4'
    },
    {
      icon: <FiUsers />,
      title: 'Build your network',
      description: 'Connect with neighbors and organizations ready to collaborate',
      color: '#0078d4'
    },
    {
      icon: <FiTarget />,
      title: 'Create lasting impact',
      description: 'Work together to solve real problems and strengthen your community',
      color: '#d13438'
    }
  ];

  // Community testimonials - Microsoft style
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Community Coordinator',
      avatar: imageConfig.getImage('photo-1494790108755-2616b612b786', { w: 80, h: 80, fit: 'crop', crop: 'face' }),
      quote: 'This platform transformed how we organize community events. We coordinated our largest neighborhood cleanup with 300+ volunteers seamlessly.',
      initiative: 'Green Neighborhoods',
      impact: '12 blocks cleaned'
    },
    {
      name: 'Marcus Johnson',
      role: 'Local Business Leader',
      avatar: imageConfig.getImage('photo-1507003211169-0a1dd7228f2d', { w: 80, h: 80, fit: 'crop', crop: 'face' }),
      quote: 'Connecting our restaurant surplus with families in need has never been easier. We\'ve built lasting partnerships that benefit everyone.',
      initiative: 'Food Recovery Network',
      impact: '8,500 meals donated'
    },
    {
      name: 'Dr. Emily Rodriguez',
      role: 'Healthcare Provider',
      avatar: imageConfig.getImage('photo-1559839734-2b71ea197ec2', { w: 80, h: 80, fit: 'crop', crop: 'face' }),
      quote: 'Reaching underserved communities with health screenings is now efficient and impactful. The platform helps us deliver care where it\'s needed most.',
      initiative: 'Community Wellness',
      impact: '1,200 people screened'
    }
  ];

  return (
    <MainLayout>
      <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
        {/* Hero Section - Microsoft Style */}
        <section style={{
          padding: '80px 0 56px',
          backgroundColor: '#ffffff',
        }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <Row gutter={[48, 48]} align="middle">
              <Col xs={24} lg={12} style={{ textAlign: 'left' }}>
                <motion.div {...animations.slideUp}>
                  <Title 
                    level={1} 
                    style={{ 
                      fontSize: '40px',
                      fontWeight: 600,
                      color: '#323130',
                      marginBottom: 24,
                      lineHeight: 1.25,
                      fontFamily: "'Segoe UI', system-ui, sans-serif",
                    }}
                  >
                    Empower your community with
                    <br />
                    <span style={{ color: '#0078d4' }}>
                      collaborative solutions
                    </span>
                  </Title>
                  
                  <Paragraph 
                    style={{ 
                      fontSize: '18px',
                      color: '#605e5c',
                      marginBottom: 32,
                      lineHeight: 1.43,
                      maxWidth: '500px',
                      fontFamily: "'Segoe UI', system-ui, sans-serif",
                    }}
                  >
                    Connect, share, and strengthen your neighborhood. From food security to education, 
                    build lasting solutions together on our trusted platform.
                  </Paragraph>
                  
                  <Space size={16} wrap>
                    <Button
                      type="primary"
                      size="large"
                      icon={<FiPlus />}
                      style={{
                        height: 40,
                        padding: '0 24px',
                        fontSize: '14px',
                        borderRadius: 4,
                        fontWeight: 600,
                        backgroundColor: '#0078d4',
                        border: 'none',
                        fontFamily: "'Segoe UI', system-ui, sans-serif",
                      }}
                      onClick={() => router.push('/causes/create')}
                    >
                      Start an initiative
                    </Button>
                    
                    <Button
                      size="large"
                      icon={<FiUsers />}
                      style={{
                        height: 40,
                        padding: '0 24px',
                        fontSize: '14px',
                        borderRadius: 4,
                        fontWeight: 600,
                        color: '#0078d4',
                        borderColor: '#8a8886',
                        fontFamily: "'Segoe UI', system-ui, sans-serif",
                      }}
                      onClick={() => router.push('/causes')}
                    >
                      Explore initiatives
                      <FiChevronRight style={{ marginLeft: 4 }} />
                    </Button>
                  </Space>
                </motion.div>
              </Col>
              
              <Col xs={24} lg={12}>
                <motion.div {...animations.slideUp} style={{ textAlign: 'center' }}>
                  <div 
                    style={{
                      position: 'relative',
                      borderRadius: 8,
                      overflow: 'hidden',
                      boxShadow: '0 1.6px 3.6px 0 rgba(0,0,0,.132), 0 0.3px 0.9px 0 rgba(0,0,0,.108)',
                    }}
                  >
                    <Image
                      src={imageConfig.getImage('photo-1582213782179-e0d53f98f2ca', { w: 600, h: 400 })}
                      alt="Community collaboration"
                      width="100%"
                      height={400}
                      style={{ objectFit: 'cover' }}
                      preview={false}
                    />
                    
                    {/* Microsoft-style overlay badge */}
                    <div 
                      style={{
                        position: 'absolute',
                        bottom: 16,
                        left: 16,
                        background: 'rgba(255,255,255,0.95)',
                        borderRadius: 4,
                        padding: '8px 12px',
                        backdropFilter: 'blur(8px)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        border: '1px solid rgba(255,255,255,0.3)',
                      }}
                    >
                      <Avatar.Group size={20} maxCount={3}>
                        <Avatar style={{ backgroundColor: '#0078d4' }} icon={<FiUsers />} />
                        <Avatar style={{ backgroundColor: '#0078d4' }} icon={<FiUsers />} />
                        <Avatar style={{ backgroundColor: '#d13438' }} icon={<FiUsers />} />
                      </Avatar.Group>
                      <Text style={{ 
                        fontSize: 12, 
                        color: '#323130', 
                        fontWeight: 600,
                        fontFamily: "'Segoe UI', system-ui, sans-serif"
                      }}>
                        2,847+ communities
                      </Text>
                    </div>
                  </div>
                </motion.div>
              </Col>
            </Row>
          </div>
        </section>

        {/* Impact Metrics - Microsoft Style */}
        <section style={{ padding: '56px 0', backgroundColor: '#faf9f8' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <motion.div {...animations.slideUp} style={{ textAlign: 'center', marginBottom: 48 }}>
              <Title level={2} style={{ 
                color: '#323130', 
                marginBottom: 16,
                fontFamily: "'Segoe UI', system-ui, sans-serif",
                fontWeight: 600
              }}>
                Making real impact together
              </Title>
              <Paragraph style={{ 
                color: '#605e5c', 
                fontSize: 16, 
                maxWidth: 600, 
                margin: '0 auto',
                fontFamily: "'Segoe UI', system-ui, sans-serif"
              }}>
                Our platform connects communities to create meaningful change. Here's the difference we're making.
              </Paragraph>
            </motion.div>

            <Row gutter={[24, 24]}>
              {impactMetrics.map((metric, index) => (
                <Col xs={12} sm={6} key={index}>
                  <motion.div {...animations.slideUp} style={{ transitionDelay: `${index * 0.1}s` }}>
                    <Card 
                      style={{ 
                        textAlign: 'center',
                        border: '1px solid #edebe9',
                        borderRadius: 8,
                        height: '100%'
                      }}
                      bodyStyle={{ padding: '24px 16px' }}
                    >
                      <div style={{ 
                        color: '#0078d4', 
                        fontSize: '20px', 
                        marginBottom: 12,
                        display: 'flex',
                        justifyContent: 'center'
                      }}>
                        {metric.icon}
                      </div>
                      <Statistic
                        value={metric.value}
                        valueStyle={{ 
                          color: '#323130',
                          fontSize: '28px',
                          fontWeight: 600,
                          fontFamily: "'Segoe UI', system-ui, sans-serif"
                        }}
                      />
                      <Text style={{ 
                        color: '#323130', 
                        fontSize: 14, 
                        fontWeight: 600,
                        display: 'block',
                        marginBottom: 4,
                        fontFamily: "'Segoe UI', system-ui, sans-serif"
                      }}>
                        {metric.title}
                      </Text>
                      <Text style={{ 
                        color: '#605e5c', 
                        fontSize: 12,
                        fontFamily: "'Segoe UI', system-ui, sans-serif"
                      }}>
                        {metric.description}
                      </Text>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        {/* How It Works - Microsoft Style */}
        <section style={{ padding: '56px 0', backgroundColor: '#ffffff' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <motion.div {...animations.slideUp} style={{ textAlign: 'center', marginBottom: 48 }}>
              <Title level={2} style={{ 
                color: '#323130', 
                marginBottom: 16,
                fontFamily: "'Segoe UI', system-ui, sans-serif",
                fontWeight: 600
              }}>
                Simple steps to community impact
              </Title>
              <Paragraph style={{ 
                color: '#605e5c', 
                fontSize: 16, 
                maxWidth: 600, 
                margin: '0 auto',
                fontFamily: "'Segoe UI', system-ui, sans-serif"
              }}>
                Three straightforward steps to create meaningful change in your neighborhood.
              </Paragraph>
            </motion.div>

            <Row gutter={[32, 32]} align="middle">
              {processSteps.map((step, index) => (
                <Col xs={24} md={8} key={index}>
                  <motion.div {...animations.slideUp} style={{ textAlign: 'center', transitionDelay: `${index * 0.1}s` }}>
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        backgroundColor: step.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 24px',
                        color: 'white',
                        fontSize: '24px',
                        boxShadow: '0 1.6px 3.6px 0 rgba(0,0,0,.132)',
                      }}
                    >
                      {step.icon}
                    </div>
                    <Title level={4} style={{ 
                      color: '#323130', 
                      marginBottom: 12,
                      fontFamily: "'Segoe UI', system-ui, sans-serif",
                      fontWeight: 600
                    }}>
                      {step.title}
                    </Title>
                    <Paragraph style={{ 
                      color: '#605e5c',
                      fontFamily: "'Segoe UI', system-ui, sans-serif"
                    }}>
                      {step.description}
                    </Paragraph>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        {/* Featured Initiatives - Microsoft Style */}
        <section style={{ padding: '56px 0', backgroundColor: '#faf9f8' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <motion.div {...animations.slideUp} style={{ textAlign: 'center', marginBottom: 48 }}>
              <Title level={2} style={{ 
                color: '#323130', 
                marginBottom: 16,
                fontFamily: "'Segoe UI', system-ui, sans-serif",
                fontWeight: 600
              }}>
                Community initiatives in action
              </Title>
              <Paragraph style={{ 
                color: '#605e5c', 
                fontSize: 16, 
                maxWidth: 600, 
                margin: '0 auto',
                fontFamily: "'Segoe UI', system-ui, sans-serif"
              }}>
                See how communities across the country are creating positive change through collaboration.
              </Paragraph>
            </motion.div>

            <Row gutter={[24, 24]}>
              {featuredInitiatives.map((initiative, index) => (
                <Col xs={24} md={8} key={index}>
                  <motion.div {...animations.slideUp} style={{ transitionDelay: `${index * 0.1}s` }}>
                    <Card
                      cover={
                        <div style={{ position: 'relative', overflow: 'hidden' }}>
                          <Image
                            src={initiative.image}
                            alt={initiative.title}
                            width="100%"
                            height={200}
                            style={{ objectFit: 'cover' }}
                            preview={false}
                          />
                          <div style={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            background: 'rgba(0, 120, 212, 0.9)',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: 4,
                            fontSize: 11,
                            fontWeight: 600,
                            fontFamily: "'Segoe UI', system-ui, sans-serif",
                          }}>
                            {initiative.category}
                          </div>
                        </div>
                      }
                      style={{
                        borderRadius: 8,
                        overflow: 'hidden',
                        border: '1px solid #edebe9',
                        height: '100%'
                      }}
                      bodyStyle={{ padding: '20px' }}
                    >
                      <Title level={4} style={{ 
                        marginBottom: 12, 
                        color: '#323130',
                        fontFamily: "'Segoe UI', system-ui, sans-serif",
                        fontWeight: 600
                      }}>
                        {initiative.title}
                      </Title>
                      <Paragraph style={{ 
                        color: '#605e5c', 
                        marginBottom: 16,
                        fontFamily: "'Segoe UI', system-ui, sans-serif"
                      }}>
                        {initiative.description}
                      </Paragraph>
                      
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        paddingTop: 12,
                        borderTop: '1px solid #f3f2f1'
                      }}>
                        <div>
                          <Text style={{ 
                            color: '#0078d4', 
                            fontSize: 12, 
                            fontWeight: 600,
                            display: 'block',
                            fontFamily: "'Segoe UI', system-ui, sans-serif"
                          }}>
                            {initiative.impact}
                          </Text>
                          <Space size={4} style={{ marginTop: 4 }}>
                            <FiMapPin style={{ color: '#8a8886', fontSize: 12 }} />
                            <Text style={{ 
                              color: '#8a8886', 
                              fontSize: 12,
                              fontFamily: "'Segoe UI', system-ui, sans-serif"
                            }}>
                              {initiative.location}
                            </Text>
                          </Space>
                        </div>
                        <Space size={4}>
                          <FiUsers style={{ color: '#8a8886', fontSize: 12 }} />
                          <Text style={{ 
                            color: '#8a8886', 
                            fontSize: 12,
                            fontFamily: "'Segoe UI', system-ui, sans-serif"
                          }}>
                            {initiative.participants}
                          </Text>
                        </Space>
                      </div>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        {/* Community Testimonials - Microsoft Style */}
        <section style={{ padding: '56px 0', backgroundColor: '#ffffff' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <motion.div {...animations.slideUp} style={{ textAlign: 'center', marginBottom: 48 }}>
              <Title level={2} style={{ 
                color: '#323130', 
                marginBottom: 16,
                fontFamily: "'Segoe UI', system-ui, sans-serif",
                fontWeight: 600
              }}>
                Trusted by community leaders
              </Title>
              <Paragraph style={{ 
                color: '#605e5c', 
                fontSize: 16, 
                maxWidth: 600, 
                margin: '0 auto',
                fontFamily: "'Segoe UI', system-ui, sans-serif"
              }}>
                Hear from the people who are making a difference in their neighborhoods.
              </Paragraph>
            </motion.div>

            <Row gutter={[24, 24]}>
              {testimonials.map((testimonial, index) => (
                <Col xs={24} md={8} key={index}>
                  <motion.div {...animations.slideUp} style={{ transitionDelay: `${index * 0.1}s` }}>
                    <Card
                      style={{
                        borderRadius: 8,
                        border: '1px solid #edebe9',
                        height: '100%',
                      }}
                      bodyStyle={{ padding: '24px' }}
                    >
                      <div style={{ marginBottom: 16 }}>
                        <FiMessageCircle style={{ color: '#0078d4', fontSize: 20 }} />
                      </div>
                      
                      <Paragraph style={{ 
                        color: '#323130', 
                        fontSize: 14, 
                        lineHeight: 1.43, 
                        marginBottom: 20,
                        fontStyle: 'italic',
                        fontFamily: "'Segoe UI', system-ui, sans-serif"
                      }}>
                        "{testimonial.quote}"
                      </Paragraph>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Avatar src={testimonial.avatar} size={40} />
                        <div style={{ flex: 1 }}>
                          <div style={{ 
                            fontWeight: 600, 
                            color: '#323130',
                            fontSize: 14,
                            fontFamily: "'Segoe UI', system-ui, sans-serif"
                          }}>
                            {testimonial.name}
                          </div>
                          <div style={{ 
                            color: '#605e5c', 
                            fontSize: 12,
                            fontFamily: "'Segoe UI', system-ui, sans-serif"
                          }}>
                            {testimonial.role}
                          </div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            marginTop: 4
                          }}>
                            <Tag 
                              color="blue" 
                              style={{ 
                                margin: 0, 
                                fontSize: 10,
                                borderRadius: 4,
                                fontFamily: "'Segoe UI', system-ui, sans-serif"
                              }}
                            >
                              {testimonial.initiative}
                            </Tag>
                            <Text style={{ 
                              color: '#0078d4', 
                              fontSize: 11, 
                              fontWeight: 600,
                              fontFamily: "'Segoe UI', system-ui, sans-serif"
                            }}>
                              {testimonial.impact}
                            </Text>
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

        {/* Call to Action - Microsoft Style */}
        <section style={{ padding: '56px 0', backgroundColor: '#f3f2f1', textAlign: 'center' }}>
          <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 24px' }}>
            <motion.div {...animations.slideUp}>
              <Title level={2} style={{ 
                color: '#323130', 
                marginBottom: 16,
                fontFamily: "'Segoe UI', system-ui, sans-serif",
                fontWeight: 600
              }}>
                Ready to empower your community?
              </Title>
              
              <Paragraph style={{ 
                color: '#605e5c', 
                fontSize: 16, 
                marginBottom: 32,
                fontFamily: "'Segoe UI', system-ui, sans-serif"
              }}>
                Join thousands of neighbors creating positive change in communities across the country.
              </Paragraph>
              
              <Space size="large" wrap>
                <Button
                  type="primary"
                  size="large"
                  icon={<FiPlus />}
                  style={{
                    height: 40,
                    padding: '0 24px',
                    fontSize: 14,
                    borderRadius: 4,
                    fontWeight: 600,
                    backgroundColor: '#0078d4',
                    border: 'none',
                    fontFamily: "'Segoe UI', system-ui, sans-serif",
                  }}
                  onClick={() => router.push('/causes/create')}
                >
                  Start an initiative
                </Button>
                
                <Button
                  size="large"
                  icon={<FiTarget />}
                  style={{
                    height: 40,
                    padding: '0 24px',
                    fontSize: 14,
                    borderRadius: 4,
                    fontWeight: 600,
                    color: '#0078d4',
                    borderColor: '#8a8886',
                    fontFamily: "'Segoe UI', system-ui, sans-serif",
                  }}
                  onClick={() => router.push('/causes')}
                >
                  Explore initiatives
                </Button>
              </Space>
            </motion.div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}