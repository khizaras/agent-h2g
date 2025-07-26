'use client';

import React from 'react';
import { Card, Row, Col, Typography, Form, Input, Button, Space } from 'antd';
import { 
  MailOutlined, 
  PhoneOutlined, 
  EnvironmentOutlined,
  ClockCircleOutlined,
  MessageOutlined,
  SendOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

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

const contactInfo = [
  {
    icon: <MailOutlined className="text-2xl text-blue-600" />,
    title: "Email Us",
    content: "hello@hands2gether.com",
    description: "Send us an email and we'll respond within 24 hours"
  },
  {
    icon: <PhoneOutlined className="text-2xl text-green-600" />,
    title: "Call Us",
    content: "+1 (555) 123-4567",
    description: "Monday to Friday, 9 AM to 6 PM PST"
  },
  {
    icon: <EnvironmentOutlined className="text-2xl text-purple-600" />,
    title: "Visit Us",
    content: "123 Community St, San Francisco, CA 94102",
    description: "Our office is open for scheduled visits"
  },
  {
    icon: <ClockCircleOutlined className="text-2xl text-orange-600" />,
    title: "Business Hours",
    content: "Mon - Fri: 9:00 AM - 6:00 PM",
    description: "We're here to help during business hours"
  }
];

export default function ContactPage() {
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    try {
      console.log('Contact form submission:', values);
      // TODO: Implement actual form submission
      form.resetFields();
      // Show success message
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

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
                Get in Touch
              </Title>
              <Paragraph className="text-xl text-blue-100 max-w-3xl mx-auto">
                Have questions, suggestions, or need help? We'd love to hear from you. 
                Our team is here to support you and your community initiatives.
              </Paragraph>
            </motion.div>
          </div>
        </motion.section>

        {/* Contact Info Cards */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
          className="py-20"
        >
          <div className="container mx-auto px-6">
            <Row gutter={[24, 24]}>
              {contactInfo.map((info, index) => (
                <Col xs={24} md={12} lg={6} key={index}>
                  <motion.div variants={fadeInUp}>
                    <Card 
                      className="h-full text-center hover:shadow-lg transition-all duration-300 border-0 rounded-2xl"
                      bodyStyle={{ padding: '2rem' }}
                    >
                      <div className="mb-4">{info.icon}</div>
                      <Title level={4} className="mb-2">
                        {info.title}
                      </Title>
                      <Text className="text-lg font-semibold text-gray-800 block mb-2">
                        {info.content}
                      </Text>
                      <Paragraph className="text-gray-600 text-sm mb-0">
                        {info.description}
                      </Paragraph>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </div>
        </motion.section>

        {/* Contact Form and Map */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
          className="py-20 bg-white"
        >
          <div className="container mx-auto px-6">
            <Row gutter={[48, 48]} align="middle">
              {/* Contact Form */}
              <Col xs={24} lg={12}>
                <motion.div variants={fadeInUp}>
                  <Card 
                    className="border-0 rounded-2xl shadow-lg"
                    bodyStyle={{ padding: '3rem' }}
                  >
                    <div className="mb-6">
                      <Title level={3} className="mb-2 flex items-center">
                        <MessageOutlined className="mr-3 text-blue-600" />
                        Send us a Message
                      </Title>
                      <Paragraph className="text-gray-600">
                        Fill out the form below and we'll get back to you as soon as possible.
                      </Paragraph>
                    </div>

                    <Form
                      form={form}
                      layout="vertical"
                      onFinish={handleSubmit}
                      size="large"
                    >
                      <Row gutter={16}>
                        <Col xs={24} sm={12}>
                          <Form.Item
                            name="firstName"
                            label="First Name"
                            rules={[{ required: true, message: 'Please enter your first name' }]}
                          >
                            <Input placeholder="Your first name" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                          <Form.Item
                            name="lastName"
                            label="Last Name"
                            rules={[{ required: true, message: 'Please enter your last name' }]}
                          >
                            <Input placeholder="Your last name" />
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
                        <Input placeholder="your@email.com" />
                      </Form.Item>

                      <Form.Item
                        name="subject"
                        label="Subject"
                        rules={[{ required: true, message: 'Please enter a subject' }]}
                      >
                        <Input placeholder="What is this about?" />
                      </Form.Item>

                      <Form.Item
                        name="message"
                        label="Message"
                        rules={[
                          { required: true, message: 'Please enter your message' },
                          { min: 10, message: 'Message should be at least 10 characters' }
                        ]}
                      >
                        <TextArea
                          rows={5}
                          placeholder="Tell us more about your inquiry..."
                          showCount
                          maxLength={1000}
                        />
                      </Form.Item>

                      <Form.Item>
                        <Button
                          type="primary"
                          htmlType="submit"
                          size="large"
                          block
                          icon={<SendOutlined />}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 border-none hover:shadow-lg transition-all duration-300 h-12"
                        >
                          Send Message
                        </Button>
                      </Form.Item>
                    </Form>
                  </Card>
                </motion.div>
              </Col>

              {/* Map/Info Section */}
              <Col xs={24} lg={12}>
                <motion.div variants={fadeInUp}>
                  <div className="space-y-8">
                    {/* Map Placeholder */}
                    <Card 
                      className="border-0 rounded-2xl overflow-hidden"
                      bodyStyle={{ padding: 0 }}
                    >
                      <div className="h-64 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                        <div className="text-center">
                          <EnvironmentOutlined className="text-6xl text-blue-600 mb-4" />
                          <Text className="text-lg text-gray-600">
                            Interactive Map Coming Soon
                          </Text>
                        </div>
                      </div>
                    </Card>

                    {/* Additional Info */}
                    <Card 
                      className="border-0 rounded-2xl"
                      bodyStyle={{ padding: '2rem' }}
                    >
                      <Title level={4} className="mb-4">
                        Why Contact Us?
                      </Title>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                          <Text className="text-gray-700">Get help with using the platform</Text>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                          <Text className="text-gray-700">Report issues or bugs</Text>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                          <Text className="text-gray-700">Suggest new features</Text>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                          <Text className="text-gray-700">Partnership opportunities</Text>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                          <Text className="text-gray-700">General questions and support</Text>
                        </div>
                      </div>
                    </Card>
                  </div>
                </motion.div>
              </Col>
            </Row>
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
          className="py-20 bg-gradient-to-br from-blue-50 to-purple-50"
        >
          <div className="container mx-auto px-6">
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <Title level={2} className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Frequently Asked Questions
              </Title>
              <Paragraph className="text-lg text-gray-600 max-w-2xl mx-auto">
                Quick answers to common questions. Can't find what you're looking for? Contact us!
              </Paragraph>
            </motion.div>

            <Row gutter={[24, 24]}>
              {[
                {
                  question: "How do I create a new cause?",
                  answer: "Simply click on 'Create Cause' in the navigation menu, choose your category, and fill out the detailed form."
                },
                {
                  question: "Is the platform free to use?",
                  answer: "Yes! Hands2gether is completely free for all users. We believe in making community support accessible to everyone."
                },
                {
                  question: "How do I contact someone about a cause?",
                  answer: "Each cause page has contact information and messaging options to connect directly with the cause creator."
                },
                {
                  question: "Can I edit or delete my cause?",
                  answer: "Yes, you can manage all your causes from your dashboard. You can edit details or mark them as completed."
                }
              ].map((faq, index) => (
                <Col xs={24} md={12} key={index}>
                  <motion.div variants={fadeInUp}>
                    <Card 
                      className="h-full border-0 rounded-2xl hover:shadow-md transition-all duration-300"
                      bodyStyle={{ padding: '2rem' }}
                    >
                      <Title level={5} className="text-blue-600 mb-3">
                        {faq.question}
                      </Title>
                      <Paragraph className="text-gray-700 mb-0">
                        {faq.answer}
                      </Paragraph>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </div>
        </motion.section>
      </div>
    </MainLayout>
  );
}