"use client";

import React from "react";
import { Card, Row, Col, Typography, Form, Input, Button, Space } from "antd";
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

  const handleSubmit = async (values: any) => {
    try {
      console.log("Contact form submission:", values);
      // TODO: Implement actual form submission
      form.resetFields();
      // Show success message
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <MainLayout>
      <div className="page-container">
        {/* Hero Section */}
        <section className="contact-hero">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="page-hero-content"
          >
            <motion.div variants={fadeInUp}>
              <Title level={1} className="page-hero-title">
                Get in Touch
              </Title>
              <Paragraph className="page-hero-description">
                Have questions, suggestions, or need help? We'd love to hear
                from you. Our team is here to support you and your community
                initiatives.
              </Paragraph>
            </motion.div>
          </motion.div>
        </section>

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
                    <motion.div variants={fadeInUp}>
                      <Card className="contact-info-card" hoverable>
                        <div className="contact-icon">
                          {React.cloneElement(info.icon, {
                            style: {
                              fontSize: "2rem",
                              color:
                                index === 0
                                  ? "#1890ff"
                                  : index === 1
                                    ? "#52c41a"
                                    : index === 2
                                      ? "#722ed1"
                                      : "#fa8c16",
                            },
                          })}
                        </div>
                        <Title level={4} className="contact-title">
                          {info.title}
                        </Title>
                        <Text className="contact-value">{info.content}</Text>
                        <Paragraph className="contact-description">
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
                        <Col xs={24} md={12}>
                          <Form.Item
                            name="firstName"
                            label="First Name"
                            rules={[
                              {
                                required: true,
                                message: "Please enter your first name",
                              },
                            ]}
                          >
                            <Input placeholder="Your first name" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                          <Form.Item
                            name="lastName"
                            label="Last Name"
                            rules={[
                              {
                                required: true,
                                message: "Please enter your last name",
                              },
                            ]}
                          >
                            <Input placeholder="Your last name" />
                          </Form.Item>
                        </Col>
                      </Row>

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
                        <Button
                          type="primary"
                          htmlType="submit"
                          icon={<SendOutlined />}
                          className="form-submit-btn"
                        >
                          Send Message
                        </Button>
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
