'use client';

import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Button, Space, Tag, Rate, Avatar, Spin, Empty, message } from 'antd';
import { 
  BookOutlined, 
  ClockCircleOutlined, 
  UserOutlined,
  CalendarOutlined,
  GlobalOutlined,
  TrophyOutlined,
  PlayCircleOutlined,
  TeamOutlined,
  DownloadOutlined,
  ShareAltOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/MainLayout';

const { Title, Paragraph, Text } = Typography;

const fadeInUp = {
  hidden: { opacity: 1, y: 0 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
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

interface EducationCause {
  id: number;
  title: string;
  description: string;
  short_description?: string;
  image?: string;
  user_name: string;
  location: string;
  education_type: string;
  skill_level: string;
  topics: string[];
  max_trainees: number;
  current_trainees: number;
  duration_hours: number;
  number_of_days: number;
  start_date: string;
  end_date: string;
  delivery_method: string;
  instructor_name: string;
  instructor_email?: string;
  instructor_bio?: string;
  instructor_qualifications?: string;
  instructor_rating: string | number; // API returns as string
  certification: boolean | number; // API returns as number
  certification_body?: string;
  materials_provided: string[];
  equipment_required: string[];
  software_required: string[];
  price: string | number; // API returns as string
  is_free: boolean | number; // API returns as number
  course_language: string;
  difficulty_rating: number;
  enrollment_status: string;
  available_spots: string | number; // API returns as string
  tags: string[];
  created_at: string;
  updated_at: string;
}

const educationTypes = ["All", "training", "workshop", "course", "certification", "bootcamp", "seminar"];
const skillLevels = ["All", "beginner", "intermediate", "advanced", "all-levels"];
const deliveryMethods = ["All", "online", "in-person", "hybrid"];

export default function EducationPage() {
  const [selectedEducationType, setSelectedEducationType] = useState("All");
  const [selectedSkillLevel, setSelectedSkillLevel] = useState("All");
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState("All");
  const [educationCauses, setEducationCauses] = useState<EducationCause[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  const fetchEducationCauses = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      queryParams.append('page', pagination.page.toString());
      queryParams.append('limit', pagination.limit.toString());
      
      if (selectedEducationType !== "All") {
        queryParams.append('educationType', selectedEducationType);
      }
      if (selectedSkillLevel !== "All") {
        queryParams.append('skillLevel', selectedSkillLevel);
      }
      if (selectedDeliveryMethod !== "All") {
        queryParams.append('deliveryMethod', selectedDeliveryMethod);
      }

      const response = await fetch(`/api/causes/education?${queryParams}`);
      const data = await response.json();

      if (data.success) {
        setEducationCauses(data.data.causes || []);
        setPagination(data.data.pagination || pagination);
      } else {
        throw new Error(data.error || 'Failed to fetch education causes');
      }
    } catch (err) {
      console.error('Error fetching education causes:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch education causes');
      setEducationCauses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducationCauses();
  }, [selectedEducationType, selectedSkillLevel, selectedDeliveryMethod]);

  const handleFilterChange = (type: string, value: string) => {
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page when filtering
    
    switch (type) {
      case 'educationType':
        setSelectedEducationType(value);
        break;
      case 'skillLevel':
        setSelectedSkillLevel(value);
        break;
      case 'deliveryMethod':
        setSelectedDeliveryMethod(value);
        break;
    }
  };

  const stats = [
    { title: "Total Courses", value: pagination.total.toString(), icon: <BookOutlined /> },
    { title: "Available Spots", value: educationCauses.reduce((total, cause) => total + (parseInt(cause.available_spots) || 0), 0).toString(), icon: <UserOutlined /> },
    { title: "Free Courses", value: educationCauses.filter(cause => Boolean(cause.is_free)).length.toString(), icon: <TrophyOutlined /> },
    { title: "Expert Instructors", value: new Set(educationCauses.map(cause => cause.instructor_name)).size.toString(), icon: <TeamOutlined /> }
  ];

  return (
    <MainLayout>
      <div className="page-container">
        {/* Hero Section with Enhanced Visibility */}
        <motion.section 
          initial="initial"
          animate="animate"
          variants={{
            initial: { opacity: 0 },
            animate: { opacity: 1, transition: { duration: 0.8 } }
          }}
          className="hero-section"
          style={{
            background: `linear-gradient(135deg, rgba(114, 46, 209, 0.95), rgba(146, 84, 222, 0.9)), url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&h=400&fit=crop&crop=center&q=80)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: '100px 0 80px',
            color: 'white',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Interactive floating elements */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
            zIndex: 1,
          }}>
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                style={{
                  position: 'absolute',
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.12)',
                  left: `${3 + i * 10}%`,
                  top: `${10 + (i % 5) * 18}%`,
                }}
                animate={{
                  y: [0, -25, 0],
                  scale: [1, 1.15, 1],
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{
                  duration: 3.5 + i * 0.4,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            ))}
          </div>

          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 2 }}>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp}>
                <Title 
                  level={1} 
                  style={{
                    color: 'white',
                    fontSize: '3rem',
                    fontWeight: 700,
                    marginBottom: 24,
                    textShadow: '0 4px 12px rgba(0,0,0,0.5)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Learn to Lead Change
                </Title>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <Paragraph 
                  style={{
                    color: 'white',
                    fontSize: '1.25rem',
                    marginBottom: 40,
                    opacity: 0.95,
                    textShadow: '0 2px 8px rgba(0,0,0,0.4)',
                    maxWidth: '700px',
                    margin: '0 auto 40px auto',
                    lineHeight: 1.6,
                  }}
                >
                  Access free educational resources designed to help you create 
                  meaningful impact in your community. From organizing basics to 
                  advanced leadership skills.
                </Paragraph>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Stats Section */}
        <section className="about-section">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="page-content-container"
          >
            <Row gutter={[32, 32]} className="stats-row">
              {stats.map((stat, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                  <motion.div 
                    variants={fadeInUp}
                    whileHover={{ 
                      y: -8,
                      scale: 1.03,
                      transition: { duration: 0.3 }
                    }}
                  >
                    <Card 
                      className="feature-card" 
                      style={{ 
                        textAlign: 'center',
                        borderRadius: 16,
                        border: 'none',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                        transition: 'all 0.3s ease',
                        height: '100%'
                      }}
                      bodyStyle={{ padding: '32px 24px' }}
                    >
                      <motion.div 
                        className="feature-icon"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: '50%',
                          background: index === 0
                            ? 'linear-gradient(135deg, #1890ff, #40a9ff)'
                            : index === 1
                              ? 'linear-gradient(135deg, #52c41a, #73d13d)'
                              : index === 2
                                ? 'linear-gradient(135deg, #722ed1, #9254de)'
                                : 'linear-gradient(135deg, #fa8c16, #ffa940)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 20px',
                          boxShadow: '0 6px 16px rgba(0,0,0,0.15)'
                        }}
                      >
                        {React.cloneElement(stat.icon, { style: { fontSize: '32px', color: 'white' } })}
                      </motion.div>
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                      >
                        <Title level={3} style={{ color: '#1890ff', margin: '16px 0 8px', fontSize: '2rem', fontWeight: 700 }}>
                          {stat.value}
                        </Title>
                        <Text style={{ color: '#666', fontSize: '16px', fontWeight: 500 }}>
                          {stat.title}
                        </Text>
                      </motion.div>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </section>

        {/* Resources Section */}
        <section className="education-content">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="page-content-container"
          >
            <motion.div variants={fadeInUp} className="section-header">
              <Title level={2} className="section-title">
                Educational Resources
              </Title>
              <Paragraph className="section-description">
                Comprehensive learning materials to help you become an effective 
                community leader and changemaker.
              </Paragraph>
            </motion.div>

            {/* Filters */}
            <motion.div variants={fadeInUp} style={{ marginBottom: '40px' }}>
              <Row gutter={[16, 16]} justify="center">
                <Col xs={24} sm={8}>
                  <Text strong style={{ display: 'block', marginBottom: '8px' }}>Course Type</Text>
                  <Space wrap>
                    {educationTypes.map(type => (
                      <motion.div
                        key={type}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          type={selectedEducationType === type ? "primary" : "default"}
                          onClick={() => handleFilterChange('educationType', type)}
                          style={{ 
                            borderRadius: '20px',
                            fontWeight: 500,
                            transition: 'all 0.3s ease',
                            boxShadow: selectedEducationType === type ? '0 4px 12px rgba(24,144,255,0.3)' : 'none'
                          }}
                          size="small"
                        >
                          {type === 'All' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                        </Button>
                      </motion.div>
                    ))}
                  </Space>
                </Col>
                <Col xs={24} sm={8}>
                  <Text strong style={{ display: 'block', marginBottom: '8px' }}>Skill Level</Text>
                  <Space wrap>
                    {skillLevels.map(level => (
                      <Button
                        key={level}
                        type={selectedSkillLevel === level ? "primary" : "default"}
                        onClick={() => handleFilterChange('skillLevel', level)}
                        style={{ borderRadius: '20px' }}
                        size="small"
                      >
                        {level === 'All' ? 'All Levels' : level.charAt(0).toUpperCase() + level.slice(1)}
                      </Button>
                    ))}
                  </Space>
                </Col>
                <Col xs={24} sm={8}>
                  <Text strong style={{ display: 'block', marginBottom: '8px' }}>Delivery Method</Text>
                  <Space wrap>
                    {deliveryMethods.map(method => (
                      <Button
                        key={method}
                        type={selectedDeliveryMethod === method ? "primary" : "default"}
                        onClick={() => handleFilterChange('deliveryMethod', method)}
                        style={{ borderRadius: '20px' }}
                        size="small"
                      >
                        {method === 'All' ? 'All Methods' : method.charAt(0).toUpperCase() + method.slice(1)}
                      </Button>
                    ))}
                  </Space>
                </Col>
              </Row>
            </motion.div>

            {/* Resources Grid */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <Spin size="large" />
                <div style={{ marginTop: '16px' }}>
                  <Text>Loading educational resources...</Text>
                </div>
              </div>
            ) : error ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <Text type="danger">{error}</Text>
                <div style={{ marginTop: '16px' }}>
                  <Button onClick={fetchEducationCauses}>Try Again</Button>
                </div>
              </div>
            ) : educationCauses.length === 0 ? (
              <Empty 
                description="No educational resources found matching your criteria"
                style={{ padding: '40px' }}
              />
            ) : (
              <div className="grid-2">
                {educationCauses.map((cause, index) => (
                  <motion.div
                    key={cause.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ 
                      y: -12, 
                      scale: 1.02,
                      boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                      transition: { duration: 0.3 }
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card className="card-professional"
                      style={{ opacity: 1 }}>
                      <div className="card-image-large">
                        <img
                          src={cause.image || "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=350&fit=crop"}
                          alt={cause.title}
                          style={{
                            width: "100%",
                            height: "280px",
                            objectFit: "cover",
                            borderRadius: "12px 12px 0 0",
                          }}
                        />
                        <div className="card-badges-large">
                          <Tag
                            color="blue"
                            style={{
                              fontSize: "14px",
                              padding: "6px 12px",
                              borderRadius: "20px",
                              fontWeight: "600",
                            }}
                          >
                            {cause.education_type.charAt(0).toUpperCase() + cause.education_type.slice(1)}
                          </Tag>
                          {cause.enrollment_status === 'ongoing' && (
                            <Tag
                              color="green"
                              style={{
                                fontSize: "12px",
                                padding: "4px 10px",
                                borderRadius: "16px",
                                fontWeight: "700",
                                textTransform: "uppercase",
                              }}
                            >
                              Ongoing
                            </Tag>
                          )}
                          {cause.enrollment_status === 'upcoming' && (
                            <Tag
                              color="orange"
                              style={{
                                fontSize: "12px",
                                padding: "4px 10px",
                                borderRadius: "16px",
                                fontWeight: "700",
                                textTransform: "uppercase",
                              }}
                            >
                              Upcoming
                            </Tag>
                          )}
                        </div>
                      </div>

                      <div
                        className="card-content-large"
                        style={{ padding: "24px" }}
                      >
                        <h2
                          className="card-title-large"
                          style={{
                            fontSize: "24px",
                            fontWeight: "700",
                            marginBottom: "12px",
                            lineHeight: "1.3",
                            color: "var(--text-primary)",
                          }}
                        >
                          {cause.title}
                        </h2>
                        <p
                          className="card-description-large"
                          style={{
                            fontSize: "16px",
                            lineHeight: "1.6",
                            marginBottom: "24px",
                            color: "var(--text-secondary)",
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {cause.short_description || cause.description.substring(0, 150) + '...'}
                        </p>

                        <div className="card-meta-large" style={{ marginBottom: '20px' }}>
                          <div className="flex items-center gap-sm mb-sm">
                            <div className="flex items-center gap-xs">
                              <ClockCircleOutlined style={{ color: 'var(--text-tertiary)' }} />
                              <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                                {cause.duration_hours}h over {cause.number_of_days} day{cause.number_of_days > 1 ? 's' : ''}
                              </span>
                            </div>
                            <div className="flex items-center gap-xs">
                              <UserOutlined style={{ color: 'var(--text-tertiary)' }} />
                              <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                                {cause.instructor_name}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-xs">
                              {cause.topics.slice(0, 2).map((topic, idx) => (
                                <Tag 
                                  key={idx} 
                                  style={{ 
                                    borderRadius: '16px',
                                    fontSize: '12px',
                                    padding: '2px 8px'
                                  }}
                                >
                                  {topic}
                                </Tag>
                              ))}
                              {cause.topics.length > 2 && (
                                <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                                  +{cause.topics.length - 2} more
                                </span>
                              )}
                            </div>
                            
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ 
                                fontSize: '18px', 
                                fontWeight: '700',
                                color: Boolean(cause.is_free) ? '#52c41a' : '#1890ff'
                              }}>
                                {Boolean(cause.is_free) ? 'Free' : `$${parseFloat(cause.price) || 0}`}
                              </div>
                              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                                {parseInt(cause.available_spots) || 0} spots left
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="card-actions-large">
                          <Link href={`/causes/${cause.id}`} style={{ width: '100%' }}>
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Button 
                                type="primary" 
                                size="large"
                                style={{ 
                                  width: '100%',
                                  height: '48px',
                                  borderRadius: '8px',
                                  fontWeight: '600',
                                  background: 'linear-gradient(135deg, #722ed1, #9254de)',
                                  border: 'none',
                                  boxShadow: '0 4px 16px rgba(114,46,209,0.3)',
                                  transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(114,46,209,0.4)';
                                  e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(114,46,209,0.3)';
                                  e.currentTarget.style.transform = 'translateY(0)';
                                }}
                              >
                                View Course Details
                              </Button>
                            </motion.div>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
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
                Ready to Start Learning?
              </Title>
              <Paragraph className="cta-description">
                Join thousands of changemakers who are developing their skills 
                to create lasting positive impact in their communities.
              </Paragraph>
              <Space size="large" className="cta-actions">
                <Button
                  type="primary"
                  size="large"
                  icon={<BookOutlined />}
                  className="btn-primary-large"
                >
                  Browse All Courses
                </Button>
                <Button
                  size="large"
                  icon={<TeamOutlined />}
                  className="btn-secondary-large"
                >
                  <Link href="/contact">Become an Instructor</Link>
                </Button>
              </Space>
            </div>
          </motion.div>
        </section>
      </div>
    </MainLayout>
  );
}
