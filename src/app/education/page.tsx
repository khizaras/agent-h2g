'use client';

import React, { useState } from 'react';
import { Card, Row, Col, Typography, Button, Space, Tag, Rate, Avatar } from 'antd';
import { 
  BookOutlined, 
  ClockCircleOutlined, 
  UserOutlined,
  CalendarOutlined,
  GlobalOutlined,
  TrophyOutlined,
  PlayCircleOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/MainLayout';

const { Title, Paragraph, Text } = Typography;

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

const educationPrograms = [
  {
    id: 1,
    title: "Web Development Bootcamp",
    instructor: "Sarah Johnson",
    rating: 4.8,
    students: 124,
    duration: "12 weeks",
    level: "Beginner",
    type: "Course",
    price: "Free",
    description: "Learn modern web development from scratch including HTML, CSS, JavaScript, and React.",
    topics: ["HTML/CSS", "JavaScript", "React", "Node.js"],
    startDate: "2024-02-15",
    delivery: "Online",
    certificate: true
  },
  {
    id: 2,
    title: "Digital Marketing Fundamentals",
    instructor: "Mike Chen",
    rating: 4.6,
    students: 89,
    duration: "6 weeks",
    level: "Intermediate",
    type: "Workshop",
    price: "Free",
    description: "Master the basics of digital marketing including SEO, social media, and content marketing.",
    topics: ["SEO", "Social Media", "Content Marketing", "Analytics"],
    startDate: "2024-02-20",
    delivery: "Hybrid",
    certificate: false
  },
  {
    id: 3,
    title: "Financial Literacy for Everyone",
    instructor: "Emily Davis",
    rating: 4.9,
    students: 256,
    duration: "4 weeks",
    level: "All Levels",
    type: "Seminar",
    price: "Free",
    description: "Learn essential financial skills including budgeting, investing, and retirement planning.",
    topics: ["Budgeting", "Investing", "Insurance", "Retirement"],
    startDate: "2024-02-25",
    delivery: "In-Person",
    certificate: true
  },
  {
    id: 4,
    title: "Data Science with Python",
    instructor: "Alex Rodriguez",
    rating: 4.7,
    students: 78,
    duration: "10 weeks",
    level: "Advanced",
    type: "Bootcamp",
    price: "Free",
    description: "Dive deep into data science using Python, pandas, and machine learning libraries.",
    topics: ["Python", "Pandas", "Machine Learning", "Visualization"],
    startDate: "2024-03-01",
    delivery: "Online",
    certificate: true
  }
];

const categories = [
  { name: "Technology", count: 45, icon: "💻", color: "#3b82f6" },
  { name: "Business", count: 32, icon: "💼", color: "#10b981" },
  { name: "Creative Arts", count: 28, icon: "🎨", color: "#f59e0b" },
  { name: "Life Skills", count: 51, icon: "🌟", color: "#8b5cf6" },
  { name: "Health & Wellness", count: 24, icon: "🏃‍♀️", color: "#ef4444" },
  { name: "Languages", count: 19, icon: "🗣️", color: "#06b6d4" }
];

const levelColors = {
  "All Levels": "#52c41a",
  "Beginner": "#1890ff",
  "Intermediate": "#faad14",
  "Advanced": "#f5222d"
};

const typeColors = {
  "Course": "#722ed1",
  "Workshop": "#13c2c2",
  "Bootcamp": "#eb2f96",
  "Seminar": "#52c41a"
};

export default function EducationPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredPrograms = selectedCategory 
    ? educationPrograms.filter(program => 
        program.topics.some(topic => 
          topic.toLowerCase().includes(selectedCategory.toLowerCase())
        )
      )
    : educationPrograms;

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Hero Section */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
        >
          <div className="container mx-auto px-6 text-center">
            <motion.div variants={fadeInUp}>
              <Title level={1} className="text-white mb-6">
                Education & Training
              </Title>
              <Paragraph className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
                Unlock your potential with free courses, workshops, and training programs. 
                Learn new skills, advance your career, and connect with expert instructors.
              </Paragraph>
              <Space size="large">
                <Button 
                  type="primary" 
                  size="large"
                  className="bg-white text-blue-600 border-white hover:bg-blue-50 font-semibold"
                >
                  Browse All Programs
                </Button>
                <Link href="/education/create">
                  <Button 
                    size="large"
                    className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold"
                  >
                    Teach a Course
                  </Button>
                </Link>
              </Space>
            </motion.div>
          </div>
        </motion.section>

        {/* Categories */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
          className="py-20"
        >
          <div className="container mx-auto px-6">
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <Title level={2} className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Browse by Category
              </Title>
              <Paragraph className="text-lg text-gray-600">
                Find the perfect learning opportunity in your area of interest.
              </Paragraph>
            </motion.div>

            <Row gutter={[24, 24]}>
              {categories.map((category, index) => (
                <Col xs={12} sm={8} md={6} lg={4} key={index}>
                  <motion.div 
                    variants={fadeInUp}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Card
                      className="text-center cursor-pointer hover:shadow-lg transition-all duration-300 border-0 rounded-2xl"
                      bodyStyle={{ padding: '1.5rem' }}
                      onClick={() => setSelectedCategory(
                        selectedCategory === category.name ? null : category.name
                      )}
                      style={{
                        borderColor: selectedCategory === category.name ? category.color : 'transparent',
                        borderWidth: selectedCategory === category.name ? '2px' : '1px'
                      }}
                    >
                      <div className="text-3xl mb-2">{category.icon}</div>
                      <Text className="font-semibold text-gray-800 block mb-1">
                        {category.name}
                      </Text>
                      <Text className="text-sm text-gray-500">
                        {category.count} programs
                      </Text>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </div>
        </motion.section>

        {/* Featured Programs */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
          className="py-20 bg-white"
        >
          <div className="container mx-auto px-6">
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <Title level={2} className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {selectedCategory ? `${selectedCategory} Programs` : 'Featured Programs'}
              </Title>
              <Paragraph className="text-lg text-gray-600">
                {selectedCategory 
                  ? `Discover ${selectedCategory.toLowerCase()} courses and workshops.`
                  : 'Start your learning journey with these popular programs.'
                }
              </Paragraph>
              {selectedCategory && (
                <Button 
                  onClick={() => setSelectedCategory(null)}
                  type="link"
                  className="text-blue-600"
                >
                  View All Programs
                </Button>
              )}
            </motion.div>

            <Row gutter={[24, 24]}>
              {filteredPrograms.map((program, index) => (
                <Col xs={24} lg={12} key={program.id}>
                  <motion.div variants={fadeInUp}>
                    <Card
                      className="h-full hover:shadow-xl transition-all duration-300 border-0 rounded-2xl overflow-hidden"
                    >
                      <div className="p-6">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Tag color={typeColors[program.type as keyof typeof typeColors]}>
                                {program.type}
                              </Tag>
                              <Tag color={levelColors[program.level as keyof typeof levelColors]}>
                                {program.level}
                              </Tag>
                              {program.certificate && (
                                <Tag color="gold" icon={<TrophyOutlined />}>
                                  Certificate
                                </Tag>
                              )}
                            </div>
                            <Title level={4} className="mb-2">
                              {program.title}
                            </Title>
                          </div>
                          <div className="text-right">
                            <Text className="text-2xl font-bold text-green-600">
                              {program.price}
                            </Text>
                          </div>
                        </div>

                        {/* Description */}
                        <Paragraph className="text-gray-600 mb-4">
                          {program.description}
                        </Paragraph>

                        {/* Topics */}
                        <div className="mb-4">
                          <Text className="text-sm text-gray-500 block mb-2">Topics Covered:</Text>
                          <div className="flex flex-wrap gap-1">
                            {program.topics.map((topic, topicIndex) => (
                              <Tag key={topicIndex} className="text-xs">
                                {topic}
                              </Tag>
                            ))}
                          </div>
                        </div>

                        {/* Meta Info */}
                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <ClockCircleOutlined className="mr-2" />
                            {program.duration}
                          </div>
                          <div className="flex items-center">
                            <CalendarOutlined className="mr-2" />
                            {formatDate(program.startDate)}
                          </div>
                          <div className="flex items-center">
                            <GlobalOutlined className="mr-2" />
                            {program.delivery}
                          </div>
                          <div className="flex items-center">
                            <TeamOutlined className="mr-2" />
                            {program.students} students
                          </div>
                        </div>

                        {/* Instructor */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-4">
                          <div className="flex items-center space-x-3">
                            <Avatar icon={<UserOutlined />} />
                            <div>
                              <Text className="font-medium text-gray-800 block">
                                {program.instructor}
                              </Text>
                              <Text className="text-sm text-gray-500">Instructor</Text>
                            </div>
                          </div>
                          <div className="text-right">
                            <Rate disabled defaultValue={program.rating} allowHalf className="text-sm" />
                            <Text className="text-sm text-gray-500 block">
                              {program.rating}/5
                            </Text>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-3">
                          <Button 
                            type="primary" 
                            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 border-none hover:shadow-md transition-all duration-300"
                            icon={<PlayCircleOutlined />}
                          >
                            Enroll Now
                          </Button>
                          <Button className="flex-1">
                            Learn More
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
          className="py-20 bg-gradient-to-br from-blue-100 to-purple-100"
        >
          <div className="container mx-auto px-6 text-center">
            <motion.div variants={fadeInUp}>
              <Title level={2} className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Share Your Knowledge
              </Title>
              <Paragraph className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
                Have expertise to share? Create your own course or workshop and help others 
                learn valuable skills. Teaching is a powerful way to give back to your community.
              </Paragraph>
              <Space size="large">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/education/create">
                    <Button 
                      type="primary"
                      size="large"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 border-none hover:shadow-lg transition-all duration-300 px-8"
                      icon={<BookOutlined />}
                    >
                      Create a Course
                    </Button>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="large"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8"
                  >
                    Learn More
                  </Button>
                </motion.div>
              </Space>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </MainLayout>
  );
}