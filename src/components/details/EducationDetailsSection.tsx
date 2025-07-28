import React, { useState } from 'react';
import { Card, Row, Col, Tag, Typography, Space, Divider, Button, Progress, Modal, Form, Input, message, Avatar, Badge, Statistic, Timeline, List } from 'antd';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  GlobalOutlined,
  LaptopOutlined,
  FileTextOutlined,
  SafetyCertificateOutlined,
  DollarOutlined,
  StarOutlined,
  PlayCircleOutlined,
  BookOutlined,
  UserOutlined,
  CheckCircleOutlined,
  FireOutlined,
  CrownOutlined,
  ThunderboltOutlined,
  TrophyOutlined,
  RocketOutlined,
  HeartOutlined,
  EyeOutlined,
  ShareAltOutlined,
  DownloadOutlined,
  VideoCameraOutlined,
  FileOutlined,
  ExperimentOutlined,
  BulbOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Title, Text, Paragraph } = Typography;

interface Trainer {
  id: number;
  name: string;
  email?: string;
  bio?: string;
  qualifications?: string;
  rating?: number;
  avatar?: string;
  expertise?: string[];
}

interface EducationDetails {
  id?: number;
  education_type: string;
  skill_level: string;
  topics: string[];
  max_trainees?: number;
  current_trainees?: number;
  duration_hours?: number;
  number_of_days?: number;
  prerequisites?: string;
  learning_objectives?: string[];
  start_date?: string;
  end_date?: string;
  registration_deadline?: string;
  schedule?: any;
  delivery_method?: string;
  location_details?: string;
  meeting_platform?: string;
  meeting_link?: string;
  // Multiple trainers support
  trainers?: Trainer[];
  // Legacy single trainer support for backward compatibility
  instructor_name?: string;
  instructor_email?: string;
  instructor_bio?: string;
  instructor_qualifications?: string;
  instructor_rating?: number;
  certification: boolean;
  certification_body?: string;
  materials_provided?: string[];
  equipment_required?: string[];
  software_required?: string[];
  price?: number;
  is_free: boolean;
  course_language?: string;
  subtitles_available?: string[];
  difficulty_rating?: number;
}

interface CourseModule {
  id: number;
  title: string;
  description: string;
  duration: number;
  resources: string[];
  completed?: boolean;
}

interface Enrollment {
  id: number;
  user_name: string;
  user_avatar?: string;
  registration_date: string;
  status: 'pending' | 'approved' | 'completed';
  completion_percentage?: number;
}

interface EducationDetailsSectionProps {
  details: EducationDetails;
  causeId?: number;
}

const EducationDetailsSection: React.FC<EducationDetailsSectionProps> = ({ details, causeId }) => {
  const [enrollModalVisible, setEnrollModalVisible] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [form] = Form.useForm();
  
  // Process trainers - support both new array format and legacy single trainer
  const trainers: Trainer[] = details.trainers || (details.instructor_name ? [{
    id: 1,
    name: details.instructor_name,
    email: details.instructor_email,
    bio: details.instructor_bio,
    qualifications: details.instructor_qualifications,
    rating: details.instructor_rating,
  }] : []);
  
  // Mock data for demo - in real app this would come from API
  const courseModules: CourseModule[] = [
    {
      id: 1,
      title: "Introduction to Core Concepts",
      description: "Learn the fundamental concepts and principles",
      duration: 2,
      resources: ["Video Lecture", "Reading Materials", "Practice Quiz"]
    },
    {
      id: 2,
      title: "Hands-on Practice",
      description: "Apply your knowledge with practical exercises",
      duration: 3,
      resources: ["Interactive Labs", "Project Templates", "Peer Review"]
    },
    {
      id: 3,
      title: "Advanced Techniques",
      description: "Master advanced techniques and best practices",
      duration: 2,
      resources: ["Expert Interviews", "Case Studies", "Final Project"]
    }
  ];
  
  const recentEnrollments: Enrollment[] = [
    {
      id: 1,
      user_name: "Sarah Johnson",
      user_avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face",
      registration_date: "2024-01-20",
      status: "approved",
      completion_percentage: 75
    },
    {
      id: 2,
      user_name: "Mike Chen",
      user_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      registration_date: "2024-01-19",
      status: "completed",
      completion_percentage: 100
    },
    {
      id: 3,
      user_name: "Emily Davis",
      registration_date: "2024-01-18",
      status: "pending",
      completion_percentage: 0
    }
  ];

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'green';
      case 'intermediate': return 'blue';
      case 'advanced': return 'orange';
      case 'expert': return 'red';
      default: return 'default';
    }
  };

  const getDeliveryMethodIcon = (method?: string) => {
    switch (method) {
      case 'online': return <GlobalOutlined />;
      case 'in-person': return <TeamOutlined />;
      case 'hybrid': return <LaptopOutlined />;
      default: return <BookOutlined />;
    }
  };

  const getDifficultyStars = (rating?: number) => {
    const actualRating = rating || 1;
    return Array(5).fill(0).map((_, index) => (
      <StarOutlined 
        key={index} 
        style={{ 
          color: index < actualRating ? '#1890ff' : '#d9d9d9',
          fontSize: '16px'
        }} 
      />
    ));
  };

  const isRegistrationOpen = details.registration_deadline ? 
    new Date() < new Date(details.registration_deadline) : 
    details.start_date ? new Date() < new Date(details.start_date) : true;
  
  const enrollmentPercentage = details.max_trainees ? 
    Math.round(((details.current_trainees || 0) / details.max_trainees) * 100) : 0;
  
  const handleEnrollment = async (values: any) => {
    try {
      setEnrolling(true);
      // Mock enrollment API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      message.success('🎉 Successfully enrolled! Check your email for confirmation.');
      setEnrollModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to enroll. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'approved': return <PlayCircleOutlined style={{ color: '#1890ff' }} />;
      case 'pending': return <ClockCircleOutlined style={{ color: '#faad14' }} />;
      default: return <UserOutlined />;
    }
  };
  
  const getResourceIcon = (resource: string) => {
    if (resource.toLowerCase().includes('video')) return <VideoCameraOutlined />;
    if (resource.toLowerCase().includes('quiz') || resource.toLowerCase().includes('practice')) return <ExperimentOutlined />;
    if (resource.toLowerCase().includes('reading') || resource.toLowerCase().includes('material')) return <FileOutlined />;
    if (resource.toLowerCase().includes('lab') || resource.toLowerCase().includes('interactive')) return <BulbOutlined />;
    return <FileTextOutlined />;
  };

  // Site-consistent theme colors
  const theme = {
    primary: '#1f2937', // Dark professional color
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    text: '#ffffff',
    textSecondary: '#e5e7eb',
    background: '#374151', // Dark background
    backgroundSecondary: '#1f2937',
    border: '#4b5563',
    shadow: '0 4px 16px rgba(0,0,0,0.3)'
  };

  return (
    <div className="education-details-section">
      {/* Professional Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ marginBottom: '32px' }}
      >
        <Card 
          style={{ 
            background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.backgroundSecondary} 100%)`,
            border: 'none',
            borderRadius: '16px',
            boxShadow: theme.shadow,
            overflow: 'hidden'
          }}
          bodyStyle={{ padding: '32px' }}
        >
          <div style={{ textAlign: 'center', color: 'white' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎓</div>
            <Title level={2} style={{ color: 'white', marginBottom: '8px', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
              {details.education_type?.replace('-', ' ').toUpperCase()} COURSE
            </Title>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap', marginTop: '24px' }}>
              <div style={{ 
                background: 'rgba(255,255,255,0.15)', 
                padding: '16px 24px', 
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{details.duration_hours || 0}h</div>
                <div style={{ fontSize: '14px', opacity: 0.9 }}>Duration</div>
              </div>
              <div style={{ 
                background: 'rgba(255,255,255,0.15)', 
                padding: '16px 24px', 
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{details.current_trainees || 0}/{details.max_trainees || '∞'}</div>
                <div style={{ fontSize: '14px', opacity: 0.9 }}>Enrolled</div>
              </div>
              <div style={{ 
                background: 'rgba(255,255,255,0.15)', 
                padding: '16px 24px', 
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{details.difficulty_rating || 1}/5</div>
                <div style={{ fontSize: '14px', opacity: 0.9 }}>Difficulty</div>
              </div>
              <div style={{ 
                background: 'rgba(255,255,255,0.15)', 
                padding: '16px 24px', 
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{details.is_free ? 'FREE' : `$${details.price}`}</div>
                <div style={{ fontSize: '14px', opacity: 0.9 }}>Price</div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
      
      {/* Course Overview */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card 
          title={<span style={{ color: theme.text }}><BookOutlined style={{ marginRight: '8px' }} />Course Overview</span>} 
          style={{ 
            marginBottom: '24px',
            borderRadius: '12px',
            boxShadow: theme.shadow,
            border: `1px solid ${theme.border}`,
            background: theme.background
          }}
          headStyle={{ 
            background: theme.backgroundSecondary,
            borderBottom: `1px solid ${theme.border}`,
            fontSize: '16px',
            fontWeight: '600'
          }}
          bodyStyle={{ background: theme.background }}
        >
          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <Space direction="vertical" size="small">
                <Text strong style={{ color: theme.text }}>Type:</Text>
                <Tag color="blue">
                  {details.education_type?.replace('-', ' ').toUpperCase()}
                </Tag>
              </Space>
            </Col>
            <Col xs={24} md={12}>
              <Space direction="vertical" size="small">
                <Text strong style={{ color: theme.text }}>Skill Level:</Text>
                <Tag color={getSkillLevelColor(details.skill_level)}>
                  {details.skill_level?.toUpperCase()}
                </Tag>
              </Space>
            </Col>
            <Col xs={24} md={12}>
              <Space direction="vertical" size="small">
                <Text strong style={{ color: theme.text }}>Duration:</Text>
                <Space>
                  <ClockCircleOutlined />
                  <Text>{details.duration_hours || 0} hours over {details.number_of_days || 1} days</Text>
                </Space>
              </Space>
            </Col>
            <Col xs={24} md={12}>
              <Space direction="vertical" size="small">
                <Text strong style={{ color: theme.text }}>Language:</Text>
                <Text>{details.course_language || 'English'}</Text>
              </Space>
            </Col>
          </Row>
          
          <Divider />
          
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Text strong style={{ color: theme.text }}>Topics Covered:</Text>
            <Space wrap>
              {details.topics && details.topics.length > 0 ? (
                details.topics.map((topic: string) => (
                  <Tag key={topic} color="geekblue">{topic.replace('-', ' ')}</Tag>
                ))
              ) : (
                <Text type="secondary">No topics specified</Text>
              )}
            </Space>
          </Space>

          {details.learning_objectives && details.learning_objectives.length > 0 && (
            <>
              <Divider />
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Text strong style={{ color: theme.text }}>Learning Objectives:</Text>
                <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
                  {details.learning_objectives.map((objective: string, index: number) => (
                    <li key={index} style={{ marginBottom: '4px' }}>{objective}</li>
                  ))}
                </ul>
              </Space>
            </>
          )}

          <Divider />
          
          <Space direction="vertical" size="small">
            <Text strong style={{ color: theme.text }}>Difficulty Rating:</Text>
            <Space>
              {getDifficultyStars(details.difficulty_rating)}
              <Text>({details.difficulty_rating || 1}/5)</Text>
            </Space>
          </Space>
        </Card>
      </motion.div>

      {/* Course Curriculum */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card 
          title={<span><ExperimentOutlined style={{ marginRight: '8px' }} />Course Curriculum</span>} 
          style={{ 
            marginBottom: '24px',
            borderRadius: '8px',
            boxShadow: theme.shadow,
            border: `1px solid ${theme.border}`
          }}
          headStyle={{ 
            background: theme.backgroundSecondary,
            borderBottom: `1px solid ${theme.border}`,
            fontSize: '16px',
            fontWeight: '600'
          }}
        >
          <Timeline>
            {courseModules.map((module, index) => (
              <Timeline.Item
                key={module.id}
                dot={<BulbOutlined style={{ fontSize: '16px', color: theme.primary }} />}
                color="blue"
              >
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                    <Title level={5} style={{ margin: 0, color: theme.text }}>
                      Module {index + 1}: {module.title}
                    </Title>
                    <Tag color="blue">{module.duration}h</Tag>
                  </div>
                  <Paragraph style={{ color: theme.textSecondary, marginBottom: '12px' }}>
                    {module.description}
                  </Paragraph>
                  <div>
                    <Text strong style={{ color: theme.text }}>Resources:</Text>
                    <div style={{ marginTop: '4px' }}>
                      <Space wrap>
                        {module.resources.map((resource, idx) => (
                          <Tag key={idx} icon={getResourceIcon(resource)} color="default">
                            {resource}
                          </Tag>
                        ))}
                      </Space>
                    </div>
                  </div>
                </div>
              </Timeline.Item>
            ))}
          </Timeline>
        </Card>
      </motion.div>
      
      {/* Schedule & Enrollment */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card 
          title={<span><CalendarOutlined style={{ marginRight: '8px' }} />Schedule & Enrollment</span>} 
          style={{ 
            marginBottom: '24px',
            borderRadius: '8px',
            boxShadow: theme.shadow,
            border: `1px solid ${theme.border}`
          }}
          headStyle={{ 
            background: theme.backgroundSecondary,
            borderBottom: `1px solid ${theme.border}`,
            fontSize: '16px',
            fontWeight: '600'
          }}
        >
          <Row gutter={[24, 16]}>
            <Col xs={24} md={8}>
              <Space direction="vertical" size="small">
                <Text strong style={{ color: theme.text }}>Start Date:</Text>
                <Space>
                  <CalendarOutlined style={{ color: theme.success }} />
                  <Text>{formatDate(details.start_date)}</Text>
                </Space>
              </Space>
            </Col>
            <Col xs={24} md={8}>
              <Space direction="vertical" size="small">
                <Text strong style={{ color: theme.text }}>End Date:</Text>
                <Space>
                  <CalendarOutlined style={{ color: theme.error }} />
                  <Text>{formatDate(details.end_date)}</Text>
                </Space>
              </Space>
            </Col>
            {details.registration_deadline && (
              <Col xs={24} md={8}>
                <Space direction="vertical" size="small">
                  <Text strong style={{ color: theme.text }}>Registration Deadline:</Text>
                  <Space>
                    <ClockCircleOutlined style={{ color: theme.warning }} />
                    <Text>{formatDate(details.registration_deadline)}</Text>
                  </Space>
                </Space>
              </Col>
            )}
          </Row>

          <Divider />

          <Row gutter={[24, 16]}>
            <Col xs={24} md={8}>
              <Card size="small" style={{ textAlign: 'center', border: `1px solid ${theme.border}` }}>
                <TeamOutlined style={{ fontSize: '24px', color: theme.primary, marginBottom: '8px' }} />
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: theme.text }}>
                  {details.current_trainees || 0} / {details.max_trainees || '∞'}
                </div>
                <div style={{ fontSize: '12px', color: theme.textSecondary }}>Participants</div>
                <Progress 
                  percent={enrollmentPercentage} 
                  showInfo={false} 
                  strokeColor={theme.primary} 
                  style={{ marginTop: '8px' }}
                />
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card size="small" style={{ textAlign: 'center', border: `1px solid ${theme.border}` }}>
                {isRegistrationOpen ? 
                  <CheckCircleOutlined style={{ fontSize: '24px', color: theme.success, marginBottom: '8px' }} /> : 
                  <ClockCircleOutlined style={{ fontSize: '24px', color: theme.error, marginBottom: '8px' }} />
                }
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: isRegistrationOpen ? theme.success : theme.error }}>
                  {isRegistrationOpen ? 'Registration Open' : 'Registration Closed'}
                </div>
                <div style={{ fontSize: '12px', color: theme.textSecondary }}>Status</div>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card size="small" style={{ textAlign: 'center', border: `1px solid ${theme.border}` }}>
                <SafetyCertificateOutlined style={{ fontSize: '24px', color: theme.warning, marginBottom: '8px' }} />
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: theme.text }}>
                  {details.certification ? 'Certificate Included' : 'No Certificate'}
                </div>
                <div style={{ fontSize: '12px', color: theme.textSecondary }}>Recognition</div>
              </Card>
            </Col>
          </Row>
        </Card>
      </motion.div>

      {/* Multiple Trainers Section */}
      {trainers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card 
            title={<span><UserOutlined style={{ marginRight: '8px' }} />Meet Your {trainers.length > 1 ? 'Trainers' : 'Trainer'}</span>} 
            style={{ 
              marginBottom: '24px',
              borderRadius: '8px',
              boxShadow: theme.shadow,
              border: `1px solid ${theme.border}`
            }}
            headStyle={{ 
              background: theme.backgroundSecondary,
              borderBottom: `1px solid ${theme.border}`,
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            <Row gutter={[24, 24]}>
              {trainers.map((trainer) => (
                <Col xs={24} md={trainers.length === 1 ? 24 : 12} key={trainer.id}>
                  <Card size="small" style={{ border: `1px solid ${theme.border}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                      <Avatar 
                        size={64} 
                        src={trainer.avatar}
                        icon={<UserOutlined />} 
                        style={{ marginRight: '16px', border: `2px solid ${theme.border}` }} 
                      />
                      <div style={{ flex: 1 }}>
                        <Title level={4} style={{ margin: 0, marginBottom: '4px', color: theme.text }}>
                          {trainer.name}
                        </Title>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                          {[...Array(5)].map((_, i) => (
                            <StarOutlined 
                              key={i} 
                              style={{ 
                                color: i < (trainer.rating || 4) ? theme.warning : '#d9d9d9', 
                                fontSize: '14px' 
                              }} 
                            />
                          ))}
                          <span style={{ marginLeft: '8px', fontSize: '12px', color: theme.textSecondary }}>
                            ({trainer.rating || 4}.0)
                          </span>
                        </div>
                        {trainer.email && (
                          <a 
                            href={`mailto:${trainer.email}`} 
                            style={{ color: theme.primary, fontSize: '12px' }}
                          >
                            {trainer.email}
                          </a>
                        )}
                      </div>
                    </div>
                    
                    {trainer.bio && (
                      <div style={{ marginBottom: '12px' }}>
                        <Text strong style={{ color: theme.text }}>Bio:</Text>
                        <Paragraph style={{ marginTop: '4px', marginBottom: 0, color: theme.textSecondary }}>
                          {trainer.bio}
                        </Paragraph>
                      </div>
                    )}
                    
                    {trainer.qualifications && (
                      <div style={{ marginBottom: '12px' }}>
                        <Text strong style={{ color: theme.text }}>Qualifications:</Text>
                        <Paragraph style={{ marginTop: '4px', marginBottom: 0, color: theme.textSecondary }}>
                          {trainer.qualifications}
                        </Paragraph>
                      </div>
                    )}

                    {trainer.expertise && trainer.expertise.length > 0 && (
                      <div>
                        <Text strong style={{ color: theme.text }}>Expertise:</Text>
                        <div style={{ marginTop: '4px' }}>
                          <Space wrap>
                            {trainer.expertise.map((skill, idx) => (
                              <Tag key={idx} color="blue">{skill}</Tag>
                            ))}
                          </Space>
                        </div>
                      </div>
                    )}
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </motion.div>
      )}

      {/* Recent Enrollments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Card 
          title={<span><TeamOutlined style={{ marginRight: '8px' }} />Recent Enrollments</span>} 
          style={{ 
            marginBottom: '24px',
            borderRadius: '8px',
            boxShadow: theme.shadow,
            border: `1px solid ${theme.border}`
          }}
          headStyle={{ 
            background: theme.backgroundSecondary,
            borderBottom: `1px solid ${theme.border}`,
            fontSize: '16px',
            fontWeight: '600'
          }}
        >
          <List
            dataSource={recentEnrollments}
            renderItem={(enrollment) => (
              <List.Item style={{ padding: '12px 0', borderBottom: `1px solid ${theme.border}` }}>
                <List.Item.Meta
                  avatar={
                    <Badge dot={enrollment.status === 'completed'} color="green">
                      <Avatar src={enrollment.user_avatar} icon={<UserOutlined />} size={40} />
                    </Badge>
                  }
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 600, color: theme.text }}>{enrollment.user_name}</span>
                      {getStatusIcon(enrollment.status)}
                      <Tag color={enrollment.status === 'completed' ? 'green' : enrollment.status === 'approved' ? 'blue' : 'gold'}>
                        {enrollment.status.toUpperCase()}
                      </Tag>
                    </div>
                  }
                  description={
                    <div>
                      <div style={{ marginBottom: '4px', color: theme.textSecondary }}>
                        Enrolled: {formatDate(enrollment.registration_date)}
                      </div>
                      {enrollment.completion_percentage !== undefined && (
                        <Progress 
                          percent={enrollment.completion_percentage} 
                          size="small" 
                          status={enrollment.completion_percentage === 100 ? 'success' : 'active'}
                          format={(percent) => `${percent}% complete`}
                        />
                      )}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      </motion.div>

      {/* Materials & Requirements */}
      {(details.materials_provided?.length || details.equipment_required?.length || details.software_required?.length || details.prerequisites) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <Card 
            title={<span><FileTextOutlined style={{ marginRight: '8px' }} />Materials & Requirements</span>} 
            style={{ 
              marginBottom: '24px',
              borderRadius: '8px',
              boxShadow: theme.shadow,
              border: `1px solid ${theme.border}`
            }}
            headStyle={{ 
              background: theme.backgroundSecondary,
              borderBottom: `1px solid ${theme.border}`,
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            {details.materials_provided && details.materials_provided.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <Text strong style={{ color: theme.text }}>Materials Provided:</Text>
                <div style={{ marginTop: '8px' }}>
                  <Space wrap>
                    {details.materials_provided.map((material: string) => (
                      <Tag key={material} color="green" icon={<FileTextOutlined />}>{material}</Tag>
                    ))}
                  </Space>
                </div>
              </div>
            )}
            
            {details.equipment_required && details.equipment_required.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <Text strong style={{ color: theme.text }}>Equipment Required:</Text>
                <div style={{ marginTop: '8px' }}>
                  <Space wrap>
                    {details.equipment_required.map((equipment: string) => (
                      <Tag key={equipment} color="orange" icon={<LaptopOutlined />}>{equipment}</Tag>
                    ))}
                  </Space>
                </div>
              </div>
            )}
            
            {details.software_required && details.software_required.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <Text strong style={{ color: theme.text }}>Software Required:</Text>
                <div style={{ marginTop: '8px' }}>
                  <Space wrap>
                    {details.software_required.map((software: string) => (
                      <Tag key={software} color="purple">{software}</Tag>
                    ))}
                  </Space>
                </div>
              </div>
            )}
            
            {details.prerequisites && (
              <div>
                <Text strong style={{ color: theme.text }}>Prerequisites:</Text>
                <Paragraph style={{ marginTop: '8px', marginBottom: '0', color: theme.textSecondary }}>
                  {details.prerequisites}
                </Paragraph>
              </div>
            )}
          </Card>
        </motion.div>
      )}

      {/* Pricing & Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <Card 
          title={<span><DollarOutlined style={{ marginRight: '8px' }} />Pricing & Enrollment</span>} 
          style={{ 
            borderRadius: '8px',
            boxShadow: theme.shadow,
            border: `1px solid ${theme.border}`,
            marginBottom: '24px'
          }}
          headStyle={{ 
            background: theme.backgroundSecondary,
            borderBottom: `1px solid ${theme.border}`,
            fontSize: '16px',
            fontWeight: '600'
          }}
        >
          <Row gutter={[24, 16]} style={{ marginBottom: '24px' }}>
            <Col xs={24} md={12}>
              <Card size="small" style={{ textAlign: 'center', border: `1px solid ${theme.border}` }}>
                <DollarOutlined style={{ fontSize: '32px', color: theme.primary, marginBottom: '12px' }} />
                <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: theme.text }}>
                  {details.is_free ? 'FREE!' : `$${details.price || 0}`}
                </div>
                <div style={{ fontSize: '14px', color: theme.textSecondary }}>Course Price</div>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card size="small" style={{ textAlign: 'center', border: `1px solid ${theme.border}` }}>
                <SafetyCertificateOutlined style={{ fontSize: '32px', color: theme.success, marginBottom: '12px' }} />
                <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: theme.text }}>
                  {details.certification ? '✅ Certificate Included' : '❌ No Certificate'}
                </div>
                <div style={{ fontSize: '14px', color: theme.textSecondary }}>Recognition</div>
                {details.certification && details.certification_body && (
                  <div style={{ fontSize: '12px', marginTop: '4px', color: theme.textSecondary }}>
                    by {details.certification_body}
                  </div>
                )}
              </Card>
            </Col>
          </Row>
          
          {/* Call to Action */}
          <div style={{ textAlign: 'center', padding: '24px', background: theme.backgroundSecondary, borderRadius: '8px' }}>
            <Title level={4} style={{ marginBottom: '16px', color: theme.text }}>
              Ready to Start Learning?
            </Title>
            <Space size="large">
              <Button 
                size="large" 
                type="primary" 
                icon={<RocketOutlined />}
                onClick={() => setEnrollModalVisible(true)}
                disabled={!isRegistrationOpen || (details.max_trainees && (details.current_trainees || 0) >= details.max_trainees)}
                style={{ 
                  height: '48px',
                  paddingLeft: '24px',
                  paddingRight: '24px',
                  borderRadius: '6px',
                  fontWeight: '600'
                }}
              >
                {isRegistrationOpen ? 'Enroll Now' : 'Registration Closed'}
              </Button>
              <Button 
                size="large" 
                icon={<ShareAltOutlined />}
                style={{ 
                  height: '48px',
                  borderRadius: '6px'
                }}
              >
                Share Course
              </Button>
            </Space>
            <div style={{ marginTop: '16px', fontSize: '14px', color: theme.textSecondary }}>
              Join {details.current_trainees || 0}+ students already enrolled in this course
            </div>
          </div>
        </Card>
      </motion.div>
      
      {/* Enrollment Modal */}
      <Modal
        title={
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📚</div>
            <Title level={3} style={{ margin: 0, color: theme.text }}>Enroll in Course</Title>
          </div>
        }
        open={enrollModalVisible}
        onCancel={() => setEnrollModalVisible(false)}
        footer={null}
        width={600}
        style={{ top: 20 }}
      >
        <div style={{ padding: '20px 0' }}>
          <div style={{ 
            background: theme.primary, 
            borderRadius: '8px', 
            padding: '20px', 
            color: 'white', 
            marginBottom: '24px', 
            textAlign: 'center' 
          }}>
            <Title level={4} style={{ color: 'white', margin: 0, marginBottom: '8px' }}>
              {details.education_type?.replace('-', ' ').toUpperCase()}
            </Title>
            <div style={{ fontSize: '16px', opacity: 0.9 }}>
              Duration: {details.duration_hours}h • {details.is_free ? 'FREE' : `$${details.price}`}
            </div>
          </div>
          
          <Form
            form={form}
            layout="vertical"
            onFinish={handleEnrollment}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="firstName"
                  label="First Name"
                  rules={[{ required: true, message: 'Please enter your first name' }]}
                >
                  <Input size="large" placeholder="John" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="lastName"
                  label="Last Name"
                  rules={[{ required: true, message: 'Please enter your last name' }]}
                >
                  <Input size="large" placeholder="Doe" />
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
            >
              <Input size="large" placeholder="john.doe@example.com" />
            </Form.Item>
            
            <Form.Item
              name="experience"
              label="Relevant Experience (Optional)"
            >
              <Input.TextArea 
                rows={3} 
                placeholder="Tell us about your background or experience related to this course..."
              />
            </Form.Item>
            
            <Form.Item
              name="motivation"
              label="Why do you want to take this course? (Optional)"
            >
              <Input.TextArea 
                rows={3} 
                placeholder="Share your goals and what you hope to achieve..."
              />
            </Form.Item>
            
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <Space size="large">
                <Button 
                  size="large" 
                  onClick={() => setEnrollModalVisible(false)}
                  style={{ minWidth: '120px' }}
                >
                  Cancel
                </Button>
                <Button 
                  size="large" 
                  type="primary" 
                  htmlType="submit" 
                  loading={enrolling}
                  icon={<RocketOutlined />}
                  style={{ 
                    minWidth: '160px',
                    fontWeight: '600'
                  }}
                >
                  {enrolling ? 'Enrolling...' : 'Enroll Now!'}
                </Button>
              </Space>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default EducationDetailsSection;