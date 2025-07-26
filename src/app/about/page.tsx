'use client';

import React from 'react';
import { Card, Row, Col, Typography, Space, Avatar, Statistic } from 'antd';
import { 
  HeartOutlined, 
  TeamOutlined, 
  GlobalOutlined, 
  SafetyCertificateOutlined,
  RocketOutlined,
  BulbOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
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

const teamMembers = [
  {
    name: "Sarah Johnson",
    role: "Founder & CEO",
    avatar: "👩‍💼",
    description: "Passionate about community building and social impact."
  },
  {
    name: "Mike Chen",
    role: "CTO",
    avatar: "👨‍💻",
    description: "Tech enthusiast focused on building scalable solutions."
  },
  {
    name: "Alex Rodriguez",
    role: "Community Manager",
    avatar: "👨‍🤝‍👨",
    description: "Dedicated to connecting people and fostering collaboration."
  },
  {
    name: "Emily Davis",
    role: "Head of Operations",
    avatar: "👩‍💼",
    description: "Ensuring smooth operations and user experience."
  }
];

const values = [
  {
    icon: <HeartOutlined className="text-4xl text-red-500" />,
    title: "Compassion First",
    description: "We believe in the power of human kindness and empathy to create meaningful change."
  },
  {
    icon: <TeamOutlined className="text-4xl text-blue-500" />,
    title: "Community Driven",
    description: "Every feature and decision is made with our community's needs and feedback in mind."
  },
  {
    icon: <GlobalOutlined className="text-4xl text-green-500" />,
    title: "Global Impact",
    description: "Connecting communities worldwide to create a network of positive change."
  },
  {
    icon: <SafetyCertificateOutlined className="text-4xl text-purple-500" />,
    title: "Trust & Safety",
    description: "Maintaining the highest standards of security and user protection."
  },
  {
    icon: <RocketOutlined className="text-4xl text-orange-500" />,
    title: "Innovation",
    description: "Continuously improving and evolving to serve our community better."
  },
  {
    icon: <BulbOutlined className="text-4xl text-yellow-500" />,
    title: "Transparency",
    description: "Open communication and clear processes in everything we do."
  }
];

export default function AboutPage() {
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
                About Hands2gether
              </Title>
              <Paragraph className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
                We're on a mission to connect communities, foster compassion, and create 
                meaningful impact through technology and human connection.
              </Paragraph>
            </motion.div>
          </div>
        </motion.section>

        {/* Mission Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
          className="py-20"
        >
          <div className="container mx-auto px-6">
            <Row gutter={[48, 48]} align="middle">
              <Col xs={24} lg={12}>
                <motion.div variants={fadeInUp}>
                  <Title level={2} className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Our Mission
                  </Title>
                  <Paragraph className="text-lg text-gray-700 mb-6">
                    Hands2gether was born from a simple belief: that every person has something 
                    valuable to offer their community, whether it's food, clothing, skills, or time.
                  </Paragraph>
                  <Paragraph className="text-lg text-gray-700 mb-6">
                    Our platform bridges the gap between those who want to help and those who need 
                    assistance, creating a seamless ecosystem of mutual support and community growth.
                  </Paragraph>
                  <Paragraph className="text-lg text-gray-700">
                    We leverage cutting-edge technology to make community support more accessible, 
                    efficient, and impactful than ever before.
                  </Paragraph>
                </motion.div>
              </Col>
              <Col xs={24} lg={12}>
                <motion.div variants={fadeInUp}>
                  <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 h-96 flex items-center justify-center">
                    <div className="text-8xl opacity-20">🤝</div>
                  </div>
                </motion.div>
              </Col>
            </Row>
          </div>
        </motion.section>

        {/* Values Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
          className="py-20 bg-white"
        >
          <div className="container mx-auto px-6">
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <Title level={2} className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Our Values
              </Title>
              <Paragraph className="text-lg text-gray-600 max-w-2xl mx-auto">
                These core principles guide everything we do and shape the way we build our platform.
              </Paragraph>
            </motion.div>

            <Row gutter={[32, 32]}>
              {values.map((value, index) => (
                <Col xs={24} md={12} lg={8} key={index}>
                  <motion.div variants={fadeInUp}>
                    <Card 
                      className="h-full text-center hover:shadow-lg transition-all duration-300 border-0 rounded-2xl"
                      bodyStyle={{ padding: '2rem' }}
                    >
                      <div className="mb-4">{value.icon}</div>
                      <Title level={4} className="mb-3">
                        {value.title}
                      </Title>
                      <Paragraph className="text-gray-600 mb-0">
                        {value.description}
                      </Paragraph>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </div>
        </motion.section>

        {/* Stats Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
          className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
        >
          <div className="container mx-auto px-6">
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <Title level={2} className="text-white mb-4">
                Our Impact So Far
              </Title>
              <Paragraph className="text-xl text-blue-100 max-w-2xl mx-auto">
                Together, we're making a real difference in communities worldwide.
              </Paragraph>
            </motion.div>

            <Row gutter={[32, 32]} className="text-center">
              {[
                { title: "Active Members", value: 12847, suffix: "+" },
                { title: "Lives Impacted", value: 8432, suffix: "+" },
                { title: "Active Causes", value: 2567, suffix: "+" },
                { title: "Countries", value: 34, suffix: "" }
              ].map((stat, index) => (
                <Col xs={12} md={6} key={index}>
                  <motion.div variants={fadeInUp}>
                    <Statistic
                      title={<span className="text-blue-100">{stat.title}</span>}
                      value={stat.value}
                      suffix={stat.suffix}
                      valueStyle={{ 
                        color: 'white', 
                        fontSize: '2.5rem',
                        fontWeight: 'bold'
                      }}
                    />
                  </motion.div>
                </Col>
              ))}
            </Row>
          </div>
        </motion.section>

        {/* Team Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
          className="py-20"
        >
          <div className="container mx-auto px-6">
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <Title level={2} className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Meet Our Team
              </Title>
              <Paragraph className="text-lg text-gray-600 max-w-2xl mx-auto">
                Passionate individuals working together to build a better, more connected world.
              </Paragraph>
            </motion.div>

            <Row gutter={[32, 32]}>
              {teamMembers.map((member, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                  <motion.div variants={fadeInUp}>
                    <Card 
                      className="text-center hover:shadow-lg transition-all duration-300 border-0 rounded-2xl"
                      bodyStyle={{ padding: '2rem' }}
                    >
                      <div className="text-6xl mb-4">{member.avatar}</div>
                      <Title level={4} className="mb-2">
                        {member.name}
                      </Title>
                      <Text className="text-blue-600 font-medium block mb-3">
                        {member.role}
                      </Text>
                      <Paragraph className="text-gray-600 text-sm mb-0">
                        {member.description}
                      </Paragraph>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </div>
        </motion.section>

        {/* CTA Section */}
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
                Join Our Mission
              </Title>
              <Paragraph className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
                Whether you're looking to help others or need support yourself, 
                you have a place in our community.
              </Paragraph>
              <Space size="large">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <a href="/auth/signup">
                    <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-8 rounded-xl hover:shadow-lg transition-all duration-300">
                      Get Started Today
                    </button>
                  </a>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <a href="/contact">
                    <button className="bg-white text-blue-600 font-semibold py-4 px-8 rounded-xl border-2 border-blue-600 hover:bg-blue-50 transition-all duration-300">
                      Contact Us
                    </button>
                  </a>
                </motion.div>
              </Space>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </MainLayout>
  );
}