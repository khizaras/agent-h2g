import React from 'react';
import { Card, Row, Col, Tag, Typography, Space, Divider, Button, Progress } from 'antd';
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
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface EducationDetails {
  education_type: string;
  skill_level: string;
  topics: string[];
  max_trainees?: number;
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
  instructor_name?: string;
  instructor_email?: string;
  instructor_bio?: string;
  instructor_qualifications?: string;
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

interface EducationDetailsSectionProps {
  details: EducationDetails;
}

const EducationDetailsSection: React.FC<EducationDetailsSectionProps> = ({ details }) => {
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
          color: index < actualRating ? '#faad14' : '#d9d9d9',
          fontSize: '16px'
        }} 
      />
    ));
  };

  const isRegistrationOpen = details.registration_deadline ? 
    new Date() < new Date(details.registration_deadline) : 
    details.start_date ? new Date() < new Date(details.start_date) : true;

  return (
    <div className="education-details-section">
      <Title level={3} style={{ marginBottom: '24px' }}>Course Details</Title>
      
      {/* Course Overview */}
      <Card title="Course Overview" className="details-card" style={{ marginBottom: '24px' }}>
        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <div className="detail-item">
              <Text strong>Type:</Text>
              <div style={{ marginTop: '4px' }}>
                <Tag color="blue" style={{ fontSize: '14px' }}>
                  {details.education_type?.replace('-', ' ').toUpperCase()}
                </Tag>
              </div>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="detail-item">
              <Text strong>Skill Level:</Text>
              <div style={{ marginTop: '4px' }}>
                <Tag color={getSkillLevelColor(details.skill_level)} style={{ fontSize: '14px' }}>
                  {details.skill_level?.toUpperCase()}
                </Tag>
              </div>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="detail-item">
              <Text strong>Duration:</Text>
              <div style={{ marginTop: '4px' }}>
                <Space>
                  <ClockCircleOutlined />
                  <Text style={{ fontSize: '16px', fontWeight: 600 }}>
                    {details.duration_hours || 0} hours over {details.number_of_days || 1} days
                  </Text>
                </Space>
              </div>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="detail-item">
              <Text strong>Language:</Text>
              <div style={{ marginTop: '4px' }}>
                <Text>{details.course_language || 'English'}</Text>
                {details.subtitles_available?.length && details.subtitles_available.length > 0 && (
                  <Text type="secondary"> (+{details.subtitles_available.length} subtitle languages)</Text>
                )}
              </div>
            </div>
          </Col>
        </Row>
        
        <Divider />
        
        <div className="detail-item">
          <Text strong>Topics Covered:</Text>
          <div style={{ marginTop: '8px' }}>
            <Space wrap>
              {details.topics && details.topics.length > 0 ? (
                details.topics.map((topic: string) => (
                  <Tag key={topic} color="geekblue">{topic.replace('-', ' ')}</Tag>
                ))
              ) : (
                <Text type="secondary">No topics specified</Text>
              )}
            </Space>
          </div>
        </div>

        {details.learning_objectives && details.learning_objectives.length > 0 && (
          <>
            <Divider />
            <div className="detail-item">
              <Text strong>Learning Objectives:</Text>
              <ul style={{ marginTop: '8px', marginBottom: '0' }}>
                {details.learning_objectives.map((objective: string, index: number) => (
                  <li key={index}>{objective}</li>
                ))}
              </ul>
            </div>
          </>
        )}

        <Divider />
        
        <div className="detail-item">
          <Text strong>Difficulty Rating:</Text>
          <div style={{ marginTop: '8px' }}>
            <Space>
              {getDifficultyStars(details.difficulty_rating)}
              <Text>({details.difficulty_rating || 1}/5)</Text>
            </Space>
          </div>
        </div>
      </Card>

      {/* Schedule & Enrollment */}
      <Card title="Schedule & Enrollment" className="details-card" style={{ marginBottom: '24px' }}>
        <Row gutter={[24, 16]}>
          <Col xs={24} md={8}>
            <div className="detail-item">
              <Text strong>Start Date:</Text>
              <div style={{ marginTop: '4px' }}>
                <Space>
                  <CalendarOutlined style={{ color: '#52c41a' }} />
                  <Text>{formatDate(details.start_date)}</Text>
                </Space>
              </div>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className="detail-item">
              <Text strong>End Date:</Text>
              <div style={{ marginTop: '4px' }}>
                <Space>
                  <CalendarOutlined style={{ color: '#ff4d4f' }} />
                  <Text>{formatDate(details.end_date)}</Text>
                </Space>
              </div>
            </div>
          </Col>
          {details.registration_deadline && (
            <Col xs={24} md={8}>
              <div className="detail-item">
                <Text strong>Registration Deadline:</Text>
                <div style={{ marginTop: '4px' }}>
                  <Space>
                    <ClockCircleOutlined style={{ color: '#faad14' }} />
                    <Text>{formatDate(details.registration_deadline)}</Text>
                  </Space>
                </div>
              </div>
            </Col>
          )}
        </Row>

        <Divider />

        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <div className="detail-item">
              <Text strong>Max Participants:</Text>
              <div style={{ marginTop: '4px' }}>
                <Text style={{ fontSize: '18px', fontWeight: 600 }}>
                  {details.max_trainees || 'Unlimited'}
                </Text>
              </div>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="detail-item">
              <Text strong>Registration:</Text>
              <div style={{ marginTop: '4px' }}>
                {isRegistrationOpen ? (
                  <Tag color="green">Open</Tag>
                ) : (
                  <Tag color="red">Closed</Tag>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Delivery Method */}
      <Card title="Delivery Method" className="details-card" style={{ marginBottom: '24px' }}>
        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <div className="detail-item">
              <Text strong>Method:</Text>
              <div style={{ marginTop: '4px' }}>
                <Space>
                  {getDeliveryMethodIcon(details.delivery_method)}
                  <Tag color="blue" style={{ fontSize: '14px' }}>
                    {details.delivery_method?.toUpperCase() || 'IN-PERSON'}
                  </Tag>
                </Space>
              </div>
            </div>
          </Col>
          {details.meeting_platform && (
            <Col xs={24} md={12}>
              <div className="detail-item">
                <Text strong>Platform:</Text>
                <div style={{ marginTop: '4px' }}>
                  <Text>{details.meeting_platform}</Text>
                </div>
              </div>
            </Col>
          )}
        </Row>
        
        {details.location_details && (
          <>
            <Divider />
            <div className="detail-item">
              <Text strong>Location Details:</Text>
              <Paragraph style={{ marginTop: '8px', marginBottom: '0' }}>
                {details.location_details}
              </Paragraph>
            </div>
          </>
        )}

        {details.meeting_link && (
          <>
            <Divider />
            <div className="detail-item">
              <Text strong>Meeting Link:</Text>
              <div style={{ marginTop: '8px' }}>
                <Button type="primary" icon={<PlayCircleOutlined />} href={details.meeting_link} target="_blank">
                  Join Meeting
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>

      {/* Instructor */}
      {details.instructor_name && (
        <Card title="Instructor" className="details-card" style={{ marginBottom: '24px' }}>
          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <div className="detail-item">
                <Text strong>Name:</Text>
                <div style={{ marginTop: '4px' }}>
                  <Text style={{ fontSize: '18px', fontWeight: 600 }}>{details.instructor_name}</Text>
                </div>
              </div>
            </Col>
            {details.instructor_email && (
              <Col xs={24} md={12}>
                <div className="detail-item">
                  <Text strong>Contact:</Text>
                  <div style={{ marginTop: '4px' }}>
                    <a href={`mailto:${details.instructor_email}`}>{details.instructor_email}</a>
                  </div>
                </div>
              </Col>
            )}
          </Row>
          
          {details.instructor_bio && (
            <>
              <Divider />
              <div className="detail-item">
                <Text strong>Bio:</Text>
                <Paragraph style={{ marginTop: '8px', marginBottom: details.instructor_qualifications ? '16px' : '0' }}>
                  {details.instructor_bio}
                </Paragraph>
              </div>
            </>
          )}
          
          {details.instructor_qualifications && (
            <div className="detail-item">
              <Text strong>Qualifications:</Text>
              <Paragraph style={{ marginTop: '8px', marginBottom: '0' }}>
                {details.instructor_qualifications}
              </Paragraph>
            </div>
          )}
        </Card>
      )}

      {/* Materials & Requirements */}
      {(details.materials_provided?.length || details.equipment_required?.length || details.software_required?.length || details.prerequisites) && (
        <Card title="Materials & Requirements" className="details-card" style={{ marginBottom: '24px' }}>
          {details.materials_provided && details.materials_provided.length > 0 && (
            <div className="detail-item" style={{ marginBottom: '16px' }}>
              <Text strong>Materials Provided:</Text>
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
            <div className="detail-item" style={{ marginBottom: '16px' }}>
              <Text strong>Equipment Required:</Text>
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
            <div className="detail-item" style={{ marginBottom: '16px' }}>
              <Text strong>Software Required:</Text>
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
            <div className="detail-item">
              <Text strong>Prerequisites:</Text>
              <Paragraph style={{ marginTop: '8px', marginBottom: '0' }}>
                {details.prerequisites}
              </Paragraph>
            </div>
          )}
        </Card>
      )}

      {/* Pricing & Certification */}
      <Card title="Pricing & Certification" className="details-card">
        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <div className="detail-item">
              <Text strong>Price:</Text>
              <div style={{ marginTop: '4px' }}>
                {details.is_free ? (
                  <Tag color="green" icon={<DollarOutlined />} style={{ fontSize: '16px' }}>FREE</Tag>
                ) : (
                  <Space>
                    <DollarOutlined style={{ color: '#52c41a' }} />
                    <Text style={{ fontSize: '18px', fontWeight: 600 }}>${details.price || 0}</Text>
                  </Space>
                )}
              </div>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="detail-item">
              <Text strong>Certificate:</Text>
              <div style={{ marginTop: '4px' }}>
                {details.certification ? (
                  <Space>
                    <SafetyCertificateOutlined style={{ color: '#52c41a' }} />
                    <Text style={{ color: '#52c41a' }}>Yes</Text>
                    {details.certification_body && (
                      <Text type="secondary">by {details.certification_body}</Text>
                    )}
                  </Space>
                ) : (
                  <Text type="secondary">No certificate provided</Text>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default EducationDetailsSection;