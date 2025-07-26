'use client';

import React from 'react';
import { Layout, Row, Col, Typography, Space, Button, Divider, Input } from 'antd';
import { 
  HeartOutlined,
  TwitterOutlined,
  FacebookOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  GithubOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  ArrowUpOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import Link from 'next/link';

const { Footer: AntFooter } = Layout;
const { Title, Paragraph, Text } = Typography;
const { Search } = Input;

const footerLinks = {
  platform: [
    { label: 'Browse Causes', href: '/causes' },
    { label: 'Create Cause', href: '/causes/create' },
    { label: 'Education', href: '/education' },
    { label: 'How It Works', href: '/how-it-works' },
  ],
  community: [
    { label: 'Success Stories', href: '/stories' },
    { label: 'Community Guidelines', href: '/guidelines' },
    { label: 'Volunteer', href: '/volunteer' },
    { label: 'Partner Organizations', href: '/partners' },
  ],
  support: [
    { label: 'Help Center', href: '/help' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Safety', href: '/safety' },
    { label: 'Trust & Security', href: '/security' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
    { label: 'Blog', href: '/blog' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Accessibility', href: '/accessibility' },
  ],
};

const socialLinks = [
  { icon: <TwitterOutlined />, href: 'https://twitter.com/hands2gether', label: 'Twitter' },
  { icon: <FacebookOutlined />, href: 'https://facebook.com/hands2gether', label: 'Facebook' },
  { icon: <InstagramOutlined />, href: 'https://instagram.com/hands2gether', label: 'Instagram' },
  { icon: <LinkedinOutlined />, href: 'https://linkedin.com/company/hands2gether', label: 'LinkedIn' },
  { icon: <GithubOutlined />, href: 'https://github.com/hands2gether', label: 'GitHub' },
];

const contactInfo = [
  { icon: <MailOutlined />, text: 'hello@hands2gether.com', href: 'mailto:hello@hands2gether.com' },
  { icon: <PhoneOutlined />, text: '+1 (555) 123-4567', href: 'tel:+15551234567' },
  { icon: <EnvironmentOutlined />, text: 'San Francisco, CA', href: '#' },
];

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletterSubmit = (value: string) => {
    if (value.trim()) {
      // TODO: Implement newsletter subscription
      console.log('Newsletter subscription:', value);
    }
  };

  return (
    <AntFooter className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="grid grid-cols-12 gap-4 transform rotate-12 scale-150">
            {[...Array(144)].map((_, i) => (
              <div key={i} className="w-2 h-2 bg-white rounded-full opacity-20" />
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 relative z-10">
        {/* Main Footer Content */}
        <Row gutter={[48, 48]}>
          {/* Brand Section */}
          <Col xs={24} sm={12} lg={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                  <HeartOutlined className="text-white text-xl" />
                </div>
                <Title level={3} className="text-white mb-0">
                  Hands2gether
                </Title>
              </div>

              <Paragraph className="text-blue-100 mb-6 text-lg leading-relaxed">
                Connecting communities through compassion. Building a world where everyone has 
                access to food, clothing, and education.
              </Paragraph>

              {/* Social Links */}
              <Space size="large">
                {socialLinks.map((social, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.2, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Link 
                      href={social.href} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-200 hover:text-white transition-colors"
                      title={social.label}
                    >
                      <Button
                        type="text"
                        icon={social.icon}
                        size="large"
                        className="text-blue-200 hover:text-white hover:bg-white/10 rounded-full border-blue-200/30 border"
                      />
                    </Link>
                  </motion.div>
                ))}
              </Space>

              {/* Contact Info */}
              <div className="mt-8 space-y-3">
                {contactInfo.map((contact, index) => (
                  <Link 
                    key={index}
                    href={contact.href}
                    className="flex items-center space-x-3 text-blue-200 hover:text-white transition-colors"
                  >
                    <span className="text-lg">{contact.icon}</span>
                    <span>{contact.text}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          </Col>

          {/* Platform Links */}
          <Col xs={24} sm={12} lg={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Title level={4} className="text-white mb-6">
                Platform
              </Title>
              <ul className="space-y-3">
                {footerLinks.platform.map((link, index) => (
                  <li key={index}>
                    <Link 
                      href={link.href}
                      className="text-blue-200 hover:text-white transition-colors hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </Col>

          {/* Community Links */}
          <Col xs={24} sm={12} lg={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Title level={4} className="text-white mb-6">
                Community
              </Title>
              <ul className="space-y-3">
                {footerLinks.community.map((link, index) => (
                  <li key={index}>
                    <Link 
                      href={link.href}
                      className="text-blue-200 hover:text-white transition-colors hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </Col>

          {/* Support Links */}
          <Col xs={24} sm={12} lg={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Title level={4} className="text-white mb-6">
                Support
              </Title>
              <ul className="space-y-3">
                {footerLinks.support.map((link, index) => (
                  <li key={index}>
                    <Link 
                      href={link.href}
                      className="text-blue-200 hover:text-white transition-colors hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <Title level={5} className="text-white mt-8 mb-4">
                Company
              </Title>
              <ul className="space-y-3">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <Link 
                      href={link.href}
                      className="text-blue-200 hover:text-white transition-colors hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </Col>

          {/* Newsletter Signup */}
          <Col xs={24} sm={12} lg={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Title level={4} className="text-white mb-6">
                Stay Connected
              </Title>
              <Paragraph className="text-blue-200 mb-6">
                Get the latest updates on new causes, success stories, and community events.
              </Paragraph>

              <Search
                placeholder="Enter your email"
                enterButton="Subscribe"
                size="large"
                onSearch={handleNewsletterSubmit}
                className="newsletter-search mb-6"
                style={{
                  '& .ant-input': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'white',
                  },
                  '& .ant-input::placeholder': {
                    color: 'rgba(255, 255, 255, 0.6)',
                  },
                }}
              />

              <Paragraph className="text-blue-300 text-sm">
                By subscribing, you agree to our Privacy Policy and consent to receive updates 
                from our team.
              </Paragraph>

              {/* App Download Buttons */}
              <div className="mt-8 space-y-3">
                <Title level={5} className="text-white mb-4">
                  Download Our App
                </Title>
                <div className="flex flex-col space-y-3">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="large"
                      className="bg-black text-white border-0 hover:bg-gray-800 rounded-lg w-full"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-xl">📱</div>
                        <div className="text-left">
                          <div className="text-xs">Download on the</div>
                          <div className="text-sm font-semibold">App Store</div>
                        </div>
                      </div>
                    </Button>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="large"
                      className="bg-black text-white border-0 hover:bg-gray-800 rounded-lg w-full"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-xl">🤖</div>
                        <div className="text-left">
                          <div className="text-xs">Get it on</div>
                          <div className="text-sm font-semibold">Google Play</div>
                        </div>
                      </div>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </Col>
        </Row>

        {/* Divider */}
        <Divider className="border-blue-800/50 my-12" />

        {/* Bottom Footer */}
        <Row justify="space-between" align="middle" className="flex-col md:flex-row space-y-4 md:space-y-0">
          <Col>
            <Paragraph className="text-blue-300 mb-0">
              © 2024 Hands2gether. All rights reserved. Made with ❤️ for communities worldwide.
            </Paragraph>
          </Col>

          <Col>
            <Space size="large" className="flex-wrap">
              {footerLinks.legal.map((link, index) => (
                <Link 
                  key={index}
                  href={link.href}
                  className="text-blue-300 hover:text-white transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </Space>
          </Col>

          <Col>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                type="primary"
                shape="circle"
                icon={<ArrowUpOutlined />}
                onClick={scrollToTop}
                className="bg-gradient-to-r from-blue-600 to-purple-600 border-none shadow-lg"
                title="Back to top"
              />
            </motion.div>
          </Col>
        </Row>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-blue-800/50"
        >
          <Row gutter={[32, 16]} justify="center">
            <Col xs={12} sm={6} className="text-center">
              <Title level={3} className="text-white mb-2">12,847</Title>
              <Text className="text-blue-200">Active Members</Text>
            </Col>
            <Col xs={12} sm={6} className="text-center">
              <Title level={3} className="text-white mb-2">8,432</Title>
              <Text className="text-blue-200">Lives Impacted</Text>
            </Col>
            <Col xs={12} sm={6} className="text-center">
              <Title level={3} className="text-white mb-2">2,567</Title>
              <Text className="text-blue-200">Active Causes</Text>
            </Col>
            <Col xs={12} sm={6} className="text-center">
              <Title level={3} className="text-white mb-2">34</Title>
              <Text className="text-blue-200">Countries</Text>
            </Col>
          </Row>
        </motion.div>
      </div>
    </AntFooter>
  );
}