"use client";

import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Form,
  Input,
  Button,
  Space,
  Select,
  message,
} from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  MessageOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const contactInfo = [
  {
    icon: <MailOutlined />,
    title: "Email Us",
    content: "hello@hands2gether.com",
    description: "Send us an email and we'll respond within 24 hours",
  },
  {
    icon: <PhoneOutlined />,
    title: "Call Us",
    content: "+1 (555) 123-4567",
    description: "Monday to Friday, 9 AM to 6 PM PST",
  },
  {
    icon: <EnvironmentOutlined />,
    title: "Visit Us",
    content: "123 Community St, San Francisco, CA 94102",
    description: "Our office is open for scheduled visits",
  },
  {
    icon: <ClockCircleOutlined />,
    title: "Business Hours",
    content: "Mon - Fri: 9:00 AM - 6:00 PM",
    description: "We're here to help during business hours",
  },
];

export default function ContactPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (result.success) {
        message.success(
          "Thank you! Your message has been sent successfully. We'll get back to you soon.",
        );
        form.resetFields();
      } else {
        message.error(
          result.error || "Failed to send message. Please try again.",
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

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
            background: `linear-gradient(135deg, rgba(26, 115, 232, 0.95), rgba(66, 133, 244, 0.9)), url(https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?w=1600&h=400&fit=crop&crop=center&q=80)`,
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
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                style={{
                  position: 'absolute',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  left: `${5 + i * 12}%`,
                  top: `${15 + (i % 4) * 20}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: 4 + i * 0.3,
                  repeat: Infinity,
                  delay: i * 0.2,
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
                  Get in Touch
                </Title>
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
                  Have questions, suggestions, or need help? We'd love to hear
                  from you. Our team is here to support you and your community
                  initiatives.
                </Paragraph>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Contact Content */}
        <section className="contact-content">
          <div className="page-content-container">
            {/* Contact Information */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={staggerContainer}
              className="contact-section"
            >
              <div className="section-header">
                <Title level={2} className="section-title">
                  How to Reach Us
                </Title>
                <Paragraph className="section-description">
                  Multiple ways to get in touch with our team.
                </Paragraph>
              </div>

              <Row gutter={[32, 32]} className="contact-info-grid">
                {contactInfo.map((info, index) => (
                  <Col xs={24} md={12} lg={6} key={index}>
                    <motion.div 
                      variants={fadeInUp}
                      whileHover={{ 
                        y: -8,
                        scale: 1.02,
                        transition: { duration: 0.3 }
                      }}
                    >
                      <Card 
                        className="contact-info-card" 
                        hoverable
                        style={{
                          borderRadius: 16,
                          overflow: 'hidden',
                          border: 'none',
                          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                          transition: 'all 0.3s ease',
                          height: '100%'
                        }}
                        bodyStyle={{ padding: '32px 24px' }}
                      >
                        <motion.div 
                          className="contact-icon"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.3 }}
                          style={{
                            width: 64,
                            height: 64,
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
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                          }}
                        >
                          {React.cloneElement(info.icon, {
                            style: {
                              fontSize: "1.5rem",
                              color: "white",
                            },
                          })}
                        </motion.div>
                        <Title level={4} className="contact-title" style={{ textAlign: 'center', marginBottom: 12 }}>
                          {info.title}
                        </Title>
                        <Text className="contact-value" style={{ display: 'block', textAlign: 'center', fontSize: '16px', fontWeight: 600, marginBottom: 8 }}>
                          {info.content}
                        </Text>
                        <Paragraph className="contact-description" style={{ textAlign: 'center', color: '#666', margin: 0 }}>
                          {info.description}
                        </Paragraph>
                      </Card>
                    </motion.div>
                  </Col>
                ))}
              </Row>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
            >
              <Row justify="center">
                <Col xs={24} lg={16} xl={12}>
                  <Card className="contact-form-card">
                    <div className="section-header">
                      <Title level={2} className="form-title">
                        Send us a Message
                      </Title>
                      <Paragraph className="form-description">
                        Fill out the form below and we'll get back to you as
                        soon as possible.
                      </Paragraph>
                    </div>

                    <Form
                      form={form}
                      layout="vertical"
                      onFinish={handleSubmit}
                      size="large"
                    >
                      <Row gutter={16}>
                        <Col xs={24} md={24}>
                          <Form.Item
                            name="name"
                            label="Full Name"
                            rules={[
                              {
                                required: true,
                                message: "Please enter your full name",
                              },
                            ]}
                          >
                            <Input placeholder="Your full name" />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Row gutter={16}>
                        <Col xs={24} md={12}>
                          <Form.Item
                            name="email"
                            label="Email Address"
                            rules={[
                              {
                                required: true,
                                message: "Please enter your email",
                              },
                              {
                                type: "email",
                                message: "Please enter a valid email",
                              },
                            ]}
                          >
                            <Input placeholder="your.email@example.com" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                          <Form.Item
                            name="category"
                            label="Category"
                            rules={[
                              {
                                required: true,
                                message: "Please select a category",
                              },
                            ]}
                          >
                            <Select placeholder="Select inquiry type">
                              <Option value="general">General Inquiry</Option>
                              <Option value="support">Technical Support</Option>
                              <Option value="partnership">Partnership</Option>
                              <Option value="feedback">Feedback</Option>
                              <Option value="bug_report">Bug Report</Option>
                            </Select>
                          </Form.Item>
                        </Col>
                      </Row>

                      <Form.Item
                        name="subject"
                        label="Subject"
                        rules={[
                          { required: true, message: "Please enter a subject" },
                        ]}
                      >
                        <Input placeholder="What's this about?" />
                      </Form.Item>

                      <Form.Item
                        name="message"
                        label="Message"
                        rules={[
                          {
                            required: true,
                            message: "Please enter your message",
                          },
                        ]}
                      >
                        <TextArea
                          rows={6}
                          placeholder="Tell us more about how we can help you..."
                        />
                      </Form.Item>

                      <Form.Item>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            type="primary"
                            htmlType="submit"
                            icon={<SendOutlined />}
                            loading={loading}
                            className="form-submit-btn"
                            style={{ 
                              width: "100%",
                              height: 48,
                              borderRadius: 8,
                              fontSize: 16,
                              fontWeight: 600,
                              background: 'linear-gradient(135deg, #1890ff, #40a9ff)',
                              border: 'none',
                              boxShadow: '0 4px 16px rgba(24,144,255,0.3)',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.boxShadow = '0 6px 20px rgba(24,144,255,0.4)';
                              e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.boxShadow = '0 4px 16px rgba(24,144,255,0.3)';
                              e.currentTarget.style.transform = 'translateY(0)';
                            }}
                          >
                            Send Message
                          </Button>
                        </motion.div>
                      </Form.Item>
                    </Form>
                  </Card>
                </Col>
              </Row>
            </motion.div>

            {/* Additional Info */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
              className="contact-section"
            >
              <Row gutter={[32, 32]}>
                <Col xs={24} md={12}>
                  <Card className="contact-info-card">
                    <Title level={3} className="contact-title">
                      For Media Inquiries
                    </Title>
                    <Paragraph className="contact-description">
                      Interested in featuring Hands2gether in your publication
                      or interviewing our team? Reach out to our media relations
                      team.
                    </Paragraph>
                    <Text strong className="contact-value">
                      media@hands2gether.com
                    </Text>
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card className="contact-info-card">
                    <Title level={3} className="contact-title">
                      Partnership Opportunities
                    </Title>
                    <Paragraph className="contact-description">
                      Looking to partner with us? We're always open to
                      collaborating with organizations that share our mission.
                    </Paragraph>
                    <Text strong className="contact-value">
                      partnerships@hands2gether.com
                    </Text>
                  </Card>
                </Col>
              </Row>
            </motion.div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
