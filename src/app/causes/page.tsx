'use client';

import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Button, Space, Spin, Empty } from 'antd';
import { HeartOutlined, EnvironmentOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/MainLayout';

const { Title, Paragraph, Text } = Typography;

interface Cause {
  id: number;
  title: string;
  description: string;
  short_description: string;
  location: string;
  category: string;
  priority: string;
  created_at: string;
  user_name: string;
  view_count: number;
  like_count: number;
}

const mockCauses: Cause[] = [
  {
    id: 1,
    title: "Community Food Drive for Local Families",
    description: "Organizing a food drive to help local families in need during the holiday season.",
    short_description: "Help feed local families during the holidays",
    location: "San Francisco, CA",
    category: "Food Assistance",
    priority: "high",
    created_at: "2024-01-15",
    user_name: "Sarah Johnson",
    view_count: 245,
    like_count: 32,
  },
  {
    id: 2,
    title: "Winter Clothing Donation Drive",
    description: "Collecting warm clothing for homeless individuals in our community.",
    short_description: "Warm clothing for those in need",
    location: "Seattle, WA",
    category: "Clothing Donation",
    priority: "urgent",
    created_at: "2024-01-14",
    user_name: "Mike Chen",
    view_count: 189,
    like_count: 28,
  },
  {
    id: 3,
    title: "Free Programming Workshop for Beginners",
    description: "Teaching basic programming skills to help people start their tech careers.",
    short_description: "Learn programming basics for free",
    location: "Austin, TX",
    category: "Education & Training",
    priority: "medium",
    created_at: "2024-01-13",
    user_name: "Alex Rodriguez",
    view_count: 156,
    like_count: 19,
  },
];

const priorityColors = {
  low: '#52c41a',
  medium: '#1890ff',
  high: '#faad14',
  urgent: '#ff4d4f',
};

const categoryColors = {
  'Food Assistance': '#FF6B35',
  'Clothing Donation': '#4ECDC4',
  'Education & Training': '#45B7D1',
};

export default function CausesPage() {
  const [causes, setCauses] = useState<Cause[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCauses(mockCauses);
      setLoading(false);
    }, 1000);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
        <div className="container mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Title level={1} className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Browse Causes
            </Title>
            <Paragraph className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Discover meaningful ways to help your community. Every contribution makes a difference.
            </Paragraph>
            <Space>
              <Link href="/causes/create">
                <Button 
                  type="primary" 
                  size="large"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 border-none hover:shadow-lg transition-all duration-300"
                >
                  Create New Cause
                </Button>
              </Link>
              <Button size="large">
                Filter Causes
              </Button>
            </Space>
          </motion.div>

          {/* Causes Grid */}
          {loading ? (
            <div className="text-center py-20">
              <Spin size="large" />
              <div className="mt-4 text-gray-600">Loading causes...</div>
            </div>
          ) : causes.length === 0 ? (
            <Empty
              description="No causes found"
              className="py-20"
            />
          ) : (
            <Row gutter={[24, 24]}>
              {causes.map((cause, index) => (
                <Col xs={24} md={12} lg={8} key={cause.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <Card
                      className="h-full hover:shadow-xl transition-all duration-300 border-0 rounded-2xl overflow-hidden"
                      cover={
                        <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                          <div className="text-6xl opacity-20">
                            {cause.category === 'Food Assistance' && '🍽️'}
                            {cause.category === 'Clothing Donation' && '👕'}
                            {cause.category === 'Education & Training' && '🎓'}
                          </div>
                        </div>
                      }
                    >
                      <div className="p-2">
                        {/* Category and Priority */}
                        <div className="flex justify-between items-center mb-3">
                          <span 
                            className="px-3 py-1 rounded-full text-xs font-medium text-white"
                            style={{ backgroundColor: categoryColors[cause.category as keyof typeof categoryColors] }}
                          >
                            {cause.category}
                          </span>
                          <span 
                            className="px-2 py-1 rounded-full text-xs font-medium text-white capitalize"
                            style={{ backgroundColor: priorityColors[cause.priority as keyof typeof priorityColors] }}
                          >
                            {cause.priority}
                          </span>
                        </div>

                        {/* Title */}
                        <Title level={4} className="mb-2 line-clamp-2">
                          {cause.title}
                        </Title>

                        {/* Description */}
                        <Paragraph className="text-gray-600 mb-4 line-clamp-2">
                          {cause.short_description}
                        </Paragraph>

                        {/* Meta Information */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-gray-500 text-sm">
                            <EnvironmentOutlined className="mr-2" />
                            {cause.location}
                          </div>
                          <div className="flex items-center text-gray-500 text-sm">
                            <ClockCircleOutlined className="mr-2" />
                            {formatDate(cause.created_at)}
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <HeartOutlined className="mr-1" />
                              {cause.like_count}
                            </span>
                            <span>{cause.view_count} views</span>
                          </div>
                          <Text className="text-sm text-gray-600">
                            by {cause.user_name}
                          </Text>
                        </div>

                        {/* Action Button */}
                        <div className="mt-4">
                          <Link href={`/causes/${cause.id}`}>
                            <Button 
                              type="primary" 
                              block 
                              className="bg-gradient-to-r from-blue-600 to-purple-600 border-none hover:shadow-md transition-all duration-300"
                            >
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </div>
    </MainLayout>
  );
}