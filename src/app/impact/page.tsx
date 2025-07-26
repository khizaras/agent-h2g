"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, Row, Col, Typography, Statistic, Progress, Avatar, Timeline } from "antd";
import {
  UserOutlined,
  HeartOutlined,
  TrophyOutlined,
  GlobalOutlined,
  TeamOutlined,
  BookOutlined,
  HomeOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { MainLayout } from "@/components/layout/MainLayout";

const { Title, Paragraph, Text } = Typography;

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function ImpactPage() {
  const impactStats = [
    { title: "Lives Touched", value: 75420, icon: <UserOutlined />, color: "#1f2937" },
    { title: "Active Communities", value: 248, icon: <GlobalOutlined />, color: "#059669" },
    { title: "Volunteers Engaged", value: 12847, icon: <TeamOutlined />, color: "#0066CC" },
    { title: "Total Funds Raised", value: 2400000, prefix: "$", icon: <TrophyOutlined />, color: "#DC2626" },
  ];

  const categoryImpact = [
    {
      title: "Food Security",
      description: "Combating hunger in local communities",
      metrics: [
        { label: "Meals Served", value: "127,000+" },
        { label: "Families Fed", value: "8,400+" },
        { label: "Food Banks Supported", value: "156" },
      ],
      icon: "🍽️",
      color: "bg-blue-50",
    },
    {
      title: "Clothing Support", 
      description: "Providing essential clothing to those in need",
      metrics: [
        { label: "Items Donated", value: "45,000+" },
        { label: "People Clothed", value: "12,000+" },
        { label: "Donation Drives", value: "89" },
      ],
      icon: "👕",
      color: "bg-green-50",
    },
    {
      title: "Education & Training",
      description: "Empowering through knowledge and skills",
      metrics: [
        { label: "Students Taught", value: "5,200+" },
        { label: "Courses Completed", value: "340+" },
        { label: "Certificates Earned", value: "2,100+" },
      ],
      icon: "📚",
      color: "bg-purple-50",
    },
  ];

  const milestones = [
    {
      year: "2024",
      title: "Reached 75,000 Lives",
      description: "Milestone achievement in community impact across all categories",
      highlight: true,
    },
    {
      year: "2023",
      title: "Expanded to 248 Communities",
      description: "Significant growth in geographic reach and local partnerships",
      highlight: false,
    },
    {
      year: "2023",
      title: "Launched Education Platform",
      description: "Introduced comprehensive education and training programs",
      highlight: false,
    },
    {
      year: "2022",
      title: "First 10,000 Meals",
      description: "Major milestone in food security initiatives",
      highlight: false,
    },
  ];

  const testimonials = [
    {
      name: "Maria Rodriguez",
      role: "Single Mother of Three",
      content: "During the hardest time of my life, Hands2gether connected me with a local food bank. My children never went hungry.",
      avatar: "MR",
    },
    {
      name: "David Chen",
      role: "Recent Graduate",
      content: "The coding bootcamp I took through Hands2gether landed me my first tech job. Changed my whole life trajectory.",
      avatar: "DC",
    },
    {
      name: "Sarah Williams",
      role: "Community Volunteer",
      content: "I've been volunteering for 2 years. Seeing the direct impact we make in our neighborhood is incredibly rewarding.",
      avatar: "SW",
    },
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="text-center max-w-4xl mx-auto"
            >
              <Title level={1} className="text-5xl font-bold text-gray-900 mb-6">
                Measuring Our
                <span className="text-blue-600"> Impact</span>
              </Title>
              <Paragraph className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Every day, our community comes together to create meaningful change. Here's how we're 
                making a real difference in people's lives across the world.
              </Paragraph>
            </motion.div>
          </div>
        </section>

        {/* Impact Statistics */}
        <section className="py-16 px-6 bg-white">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-center mb-12"
            >
              <Title level={2} className="text-gray-900 mb-4">Impact by the Numbers</Title>
              <Paragraph className="text-gray-600 max-w-2xl mx-auto">
                Real metrics that show the tangible difference we're making together.
              </Paragraph>
            </motion.div>

            <Row gutter={[32, 32]} className="text-center">
              {impactStats.map((stat, index) => (
                <Col xs={12} md={6} key={index}>
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
                      <div className="text-blue-600 text-3xl mb-4">{stat.icon}</div>
                      <Statistic
                        value={stat.value}
                        prefix={stat.prefix}
                        valueStyle={{ 
                          color: stat.color,
                          fontSize: '2.5rem',
                          fontWeight: 'bold',
                          lineHeight: 1.2
                        }}
                      />
                      <Text className="text-gray-600 font-medium">{stat.title}</Text>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        {/* Category Impact */}
        <section className="py-16 px-6 bg-gray-50">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-center mb-12"
            >
              <Title level={2} className="text-gray-900 mb-4">Impact Across Categories</Title>
              <Paragraph className="text-gray-600 max-w-2xl mx-auto">
                See how each of our core focus areas is creating positive change.
              </Paragraph>
            </motion.div>

            <Row gutter={[32, 32]}>
              {categoryImpact.map((category, index) => (
                <Col xs={24} md={8} key={index}>
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`h-full border-0 shadow-lg ${category.color}`}>
                      <div className="text-center mb-6">
                        <div className="text-5xl mb-4">{category.icon}</div>
                        <Title level={3} className="text-gray-900 mb-3">
                          {category.title}
                        </Title>
                        <Paragraph className="text-gray-600">
                          {category.description}
                        </Paragraph>
                      </div>
                      
                      <div className="space-y-4">
                        {category.metrics.map((metric, metricIndex) => (
                          <div key={metricIndex} className="flex justify-between items-center">
                            <Text className="text-gray-700">{metric.label}</Text>
                            <Text strong className="text-gray-900">{metric.value}</Text>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        {/* Milestones Timeline */}
        <section className="py-16 px-6 bg-white">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-center mb-12"
            >
              <Title level={2} className="text-gray-900 mb-4">Our Journey</Title>
              <Paragraph className="text-gray-600 max-w-2xl mx-auto">
                Key milestones that mark our progress in building stronger communities.
              </Paragraph>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <Timeline
                mode="left"
                items={milestones.map((milestone, index) => ({
                  label: (
                    <div className="text-right">
                      <Text strong className="text-lg">{milestone.year}</Text>
                    </div>
                  ),
                  dot: milestone.highlight ? (
                    <div className="w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg" />
                  ) : undefined,
                  children: (
                    <Card className={`border-0 shadow-sm ${milestone.highlight ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''}`}>
                      <Title level={4} className="text-gray-900 mb-2">
                        {milestone.title}
                      </Title>
                      <Paragraph className="text-gray-600 mb-0">
                        {milestone.description}
                      </Paragraph>
                    </Card>
                  ),
                }))}
              />
            </motion.div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-16 px-6 bg-gray-50">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-center mb-12"
            >
              <Title level={2} className="text-gray-900 mb-4">Stories of Change</Title>
              <Paragraph className="text-gray-600 max-w-2xl mx-auto">
                Behind every number is a real person whose life has been touched by our community.
              </Paragraph>
            </motion.div>

            <Row gutter={[24, 24]}>
              {testimonials.map((testimonial, index) => (
                <Col xs={24} md={8} key={index}>
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full border-0 shadow-lg">
                      <Paragraph className="text-gray-700 mb-6 italic text-lg leading-relaxed">
                        "{testimonial.content}"
                      </Paragraph>
                      <div className="flex items-center">
                        <Avatar size={48} className="bg-blue-600 mr-4">
                          {testimonial.avatar}
                        </Avatar>
                        <div>
                          <Text strong className="text-gray-900 block">{testimonial.name}</Text>
                          <Text type="secondary">{testimonial.role}</Text>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-6 bg-blue-600">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <Title level={2} className="text-white mb-6">
                Be Part of the Next Milestone
              </Title>
              <Paragraph className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                Join our growing community and help us reach even more people in need. 
                Your contribution, no matter how small, creates ripples of positive change.
              </Paragraph>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ delay: 0.2 }}
              >
                <Progress
                  percent={75}
                  strokeColor={{
                    "0%": "#ffffff",
                    "100%": "#e0e7ff",
                  }}
                  className="mb-4 max-w-md mx-auto"
                  format={() => <span className="text-white font-medium">75% to next milestone</span>}
                />
                <Text className="text-blue-100 block mb-6">
                  25,000 more people to reach our goal of 100,000 lives touched
                </Text>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}