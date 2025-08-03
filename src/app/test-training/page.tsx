"use client";

import React from 'react';
import { Card, Row, Col, Typography, Tag, Space } from 'antd';
import { FiBookOpen, FiUsers, FiClock, FiCalendar, FiUser, FiAward, FiDollarSign, FiGlobe, FiMonitor } from 'react-icons/fi';
import { MainLayout } from '@/components/layout/MainLayout';

const { Title, Text } = Typography;

// Simulate the exact data structure from the database
const mockCause = {
  id: 2,
  title: 'Nodejs full stack developmet',
  category_name: 'training',
  categoryDetails: {
    id: 1,
    cause_id: 2,
    training_type: 'course',
    skill_level: 'all-levels',
    topics: '["general"]',
    max_participants: 20,
    current_participants: 0,
    duration_hours: 1,
    number_of_sessions: 1,
    prerequisites: null,
    learning_objectives: null,
    curriculum: null,
    start_date: '2025-08-01T18:30:00.000Z',
    end_date: '2025-08-08T18:30:00.000Z',
    registration_deadline: null,
    schedule: '[]',
    delivery_method: 'in-person',
    location_details: null,
    meeting_platform: null,
    meeting_link: null,
    meeting_id: null,
    meeting_password: null,
    instructor_name: 'khizar ahmed',
    instructor_email: null,
    instructor_phone: null,
    instructor_bio: null,
    instructor_qualifications: null,
    certification_provided: 0,
    certification_body: null,
    materials_provided: null,
    materials_required: null,
    software_required: null,
    price: '0.00',
    is_free: 1,
    course_language: 'English',
    subtitles_available: null,
    difficulty_rating: 1,
    course_materials_url: null,
    enrollment_status: 'open'
  }
};

const renderTrainingDetails = (details: any) => {
  console.log('Rendering training details:', details);
  
  return (
    <div style={{ marginBottom: 32 }}>
      <Title level={4} style={{ marginBottom: 20, color: '#3c4043' }}>
        <FiBookOpen style={{ marginRight: 8 }} />
        Training Details
      </Title>
      
      <Card 
        style={{ 
          borderRadius: 12, 
          border: '1px solid #e8eaed',
          backgroundColor: '#fafbfc'
        }}
        bodyStyle={{ padding: '20px' }}
      >
        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <div>
              <Text strong style={{ color: '#5f6368', fontSize: 12, textTransform: 'uppercase' }}>
                Training Type
              </Text>
              <div style={{ marginTop: 4 }}>
                <Tag color="blue" style={{ textTransform: 'capitalize' }}>
                  {details.training_type}
                </Tag>
              </div>
            </div>
          </Col>
          
          <Col xs={24} md={12}>
            <div>
              <Text strong style={{ color: '#5f6368', fontSize: 12, textTransform: 'uppercase' }}>
                Skill Level
              </Text>
              <div style={{ marginTop: 4 }}>
                <Tag color="green" style={{ textTransform: 'capitalize' }}>
                  {details.skill_level?.replace('-', ' ')}
                </Tag>
              </div>
            </div>
          </Col>
          
          <Col xs={24} md={12}>
            <div>
              <Text strong style={{ color: '#5f6368', fontSize: 12, textTransform: 'uppercase' }}>
                <FiUsers style={{ marginRight: 4 }} />
                Participants
              </Text>
              <div style={{ marginTop: 4 }}>
                <Text style={{ fontSize: 16, color: '#3c4043' }}>
                  {details.current_participants} / {details.max_participants}
                </Text>
              </div>
            </div>
          </Col>
          
          <Col xs={24} md={12}>
            <div>
              <Text strong style={{ color: '#5f6368', fontSize: 12, textTransform: 'uppercase' }}>
                <FiClock style={{ marginRight: 4 }} />
                Duration
              </Text>
              <div style={{ marginTop: 4 }}>
                <Text style={{ fontSize: 16, color: '#3c4043' }}>
                  {details.duration_hours} hours ({details.number_of_sessions} sessions)
                </Text>
              </div>
            </div>
          </Col>
          
          {details.start_date && (
            <Col xs={24} md={12}>
              <div>
                <Text strong style={{ color: '#5f6368', fontSize: 12, textTransform: 'uppercase' }}>
                  <FiCalendar style={{ marginRight: 4 }} />
                  Start Date
                </Text>
                <div style={{ marginTop: 4 }}>
                  <Text style={{ fontSize: 16, color: '#3c4043' }}>
                    {new Date(details.start_date).toLocaleDateString()}
                  </Text>
                </div>
              </div>
            </Col>
          )}
          
          {details.instructor_name && (
            <Col xs={24} md={12}>
              <div>
                <Text strong style={{ color: '#5f6368', fontSize: 12, textTransform: 'uppercase' }}>
                  <FiUser style={{ marginRight: 4 }} />
                  Instructor
                </Text>
                <div style={{ marginTop: 4 }}>
                  <Text style={{ fontSize: 16, color: '#3c4043' }}>
                    {details.instructor_name}
                  </Text>
                </div>
              </div>
            </Col>
          )}
          
          <Col xs={24} md={12}>
            <div>
              <Text strong style={{ color: '#5f6368', fontSize: 12, textTransform: 'uppercase' }}>
                <FiDollarSign style={{ marginRight: 4 }} />
                Price
              </Text>
              <div style={{ marginTop: 4 }}>
                {details.is_free ? (
                  <Tag color="green">Free</Tag>
                ) : (
                  <Text style={{ fontSize: 16, color: '#3c4043' }}>
                    ${details.price}
                  </Text>
                )}
              </div>
            </div>
          </Col>
          
          <Col xs={24} md={12}>
            <div>
              <Text strong style={{ color: '#5f6368', fontSize: 12, textTransform: 'uppercase' }}>
                <FiGlobe style={{ marginRight: 4 }} />
                Language
              </Text>
              <div style={{ marginTop: 4 }}>
                <Text style={{ fontSize: 16, color: '#3c4043' }}>
                  {details.course_language}
                </Text>
              </div>
            </div>
          </Col>
          
          <Col xs={24} md={12}>
            <div>
              <Text strong style={{ color: '#5f6368', fontSize: 12, textTransform: 'uppercase' }}>
                <FiMonitor style={{ marginRight: 4 }} />
                Delivery Method
              </Text>
              <div style={{ marginTop: 4 }}>
                <Tag color="blue" style={{ textTransform: 'capitalize' }}>
                  {details.delivery_method?.replace('-', ' ')}
                </Tag>
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

const renderCategorySpecificDetails = () => {
  console.log('renderCategorySpecificDetails called');
  console.log('mockCause:', mockCause);
  console.log('mockCause?.categoryDetails:', mockCause?.categoryDetails);
  
  if (!mockCause?.categoryDetails) {
    console.log('No category details found');
    return <div>No category details found</div>;
  }

  const details = mockCause.categoryDetails;
  const category = mockCause.category_name;
  
  console.log('Rendering details for category:', category);
  console.log('Details object:', details);

  switch (category) {
    case 'training':
      return renderTrainingDetails(details);
    default:
      console.log('Unknown category:', category);
      return <div>Unknown category: {category}</div>;
  }
};

export default function TestTrainingPage() {
  return (
    <MainLayout>
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <Title level={2}>Test Training Details Rendering</Title>
        <p>Category: {mockCause.category_name}</p>
        <p>Has categoryDetails: {mockCause.categoryDetails ? 'Yes' : 'No'}</p>
        
        {renderCategorySpecificDetails()}
      </div>
    </MainLayout>
  );
}