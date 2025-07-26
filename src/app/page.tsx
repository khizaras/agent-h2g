"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Button, 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Typography, 
  Space, 
  Avatar, 
  Progress,
  Carousel,
  Badge,
  Tooltip,
  Rate,
  Affix,
  BackTop,
  Timeline,
  Steps,
  Divider,
  Tag,
  List,
  Image as AntImage,
  Skeleton
} from "antd";
import {
  ArrowRightOutlined,
  HeartOutlined,
  UserOutlined,
  BookOutlined,
  ShoppingOutlined,
  PlayCircleOutlined,
  CheckCircleOutlined,
  StarOutlined,
  TeamOutlined,
  TrophyOutlined,
  GlobalOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  ThunderboltOutlined,
  SafetyCertificateOutlined,
  RocketOutlined,
  FireOutlined,
  LikeOutlined,
  ShareAltOutlined,
  CalendarOutlined,
  UpOutlined
} from "@ant-design/icons";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";

const { Title, Paragraph, Text } = Typography;
const { Step } = Steps;

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [animateStats, setAnimateStats] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
      setAnimateStats(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { 
      value: 10248, 
      label: "People Helped", 
      icon: <UserOutlined style={{ fontSize: 24, color: '#1890ff' }} />,
      trend: "+15%",
      period: "this month"
    },
    { 
      value: 1567, 
      label: "Active Causes", 
      icon: <HeartOutlined style={{ fontSize: 24, color: '#52c41a' }} />,
      trend: "+8%",
      period: "this week"
    },
    { 
      value: 890, 
      label: "Volunteers", 
      icon: <TeamOutlined style={{ fontSize: 24, color: '#722ed1' }} />,
      trend: "+23%",
      period: "this month"
    },
    { 
      value: 245000, 
      label: "Total Raised", 
      prefix: "$", 
      icon: <TrophyOutlined style={{ fontSize: 24, color: '#fa8c16' }} />,
      trend: "+12%",
      period: "this quarter"
    },
  ];

  const featuredCauses = [
    {
      id: 1,
      title: "Emergency Food Relief for Hurricane Victims",
      description: "Providing immediate food assistance to families displaced by recent hurricane damage",
      raised: 48750,
      goal: 75000,
      supporters: 234,
      urgency: "high",
      image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400",
      location: "Miami, FL",
      daysLeft: 12
    },
    {
      id: 2,
      title: "Community Food Bank Expansion",
      description: "Expanding our local food bank to serve 500 more families weekly",
      raised: 50000,
      goal: 50000,
      supporters: 156,
      urgency: "medium",
      image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400",
      location: "Seattle, WA",
      daysLeft: 0,
      completed: true
    },
    {
      id: 3,
      title: "Mobile Kitchen Initiative",
      description: "Creating a mobile kitchen to deliver hot meals to underserved neighborhoods",
      raised: 12000,
      goal: 35000,
      supporters: 89,
      urgency: "medium",
      image: "https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=400",
      location: "Austin, TX",
      daysLeft: 30
    }
  ];

  const howItWorksSteps = [
    {
      title: "Discover",
      description: "Find causes that matter to you in your community",
      icon: <GlobalOutlined />,
      interactive: true
    },
    {
      title: "Connect", 
      description: "Join with like-minded people making a difference",
      icon: <TeamOutlined />,
      interactive: true
    },
    {
      title: "Impact",
      description: "See the real change you're creating together",
      icon: <TrophyOutlined />,
      interactive: true
    }
  ];

  if (loading) {
    return (
      <MainLayout>
        <div style={{ padding: '50px' }}>
          <Skeleton active paragraph={{ rows: 8 }} />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div>
        <BackTop>
          <div style={{
            height: 40,
            width: 40,
            lineHeight: '40px',
            borderRadius: 4,
            backgroundColor: '#1890ff',
            color: '#fff',
            textAlign: 'center',
            fontSize: 14
          }}>
            <UpOutlined />
          </div>
        </BackTop>

        {/* Hero Section */}
        <div style={{ 
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          padding: '80px 24px',
          textAlign: 'center'
        }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge.Ribbon text="🚀 New Features" color="blue">
              <Card 
                style={{ 
                  maxWidth: 800, 
                  margin: '0 auto',
                  borderRadius: 16,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                }}
              >
                <Title level={1} style={{ marginBottom: 16 }}>
                  Bring Communities <Text type="danger">Together</Text>
                </Title>
                <Paragraph style={{ fontSize: 18, marginBottom: 32 }}>
                  Connect, share, and make a meaningful impact through food assistance, 
                  clothing donation, and educational programs.
                </Paragraph>
                <Space size="large" wrap>
                  <Link href="/causes">
                    <Button 
                      type="primary" 
                      size="large" 
                      icon={<RocketOutlined />}
                      style={{ height: 50, padding: '0 30px' }}
                    >
                      Explore Causes
                    </Button>
                  </Link>
                  <Link href="/causes/create">
                    <Button 
                      size="large" 
                      icon={<HeartOutlined />}
                      style={{ height: 50, padding: '0 30px' }}
                    >
                      Start a Cause
                    </Button>
                  </Link>
                  <Tooltip title="Watch our impact video">
                    <Button 
                      type="text" 
                      icon={<PlayCircleOutlined />} 
                      size="large"
                      style={{ color: '#1890ff' }}
                    >
                      Watch Demo
                    </Button>
                  </Tooltip>
                </Space>
              </Card>
            </Badge.Ribbon>
          </motion.div>
        </div>

        {/* Interactive Statistics */}
        <div style={{ padding: '60px 24px', background: '#fff' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <Title level={2}>Our Impact in Real-Time</Title>
              <Paragraph>Live statistics showing our community's collective impact</Paragraph>
            </div>
            
            <Row gutter={[32, 32]}>
              {stats.map((stat, index) => (
                <Col xs={12} md={6} key={index}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Card 
                      hoverable
                      style={{ 
                        textAlign: 'center',
                        borderRadius: 12,
                        border: '1px solid #f0f0f0'
                      }}
                      bodyStyle={{ padding: 24 }}
                    >
                      <div style={{ marginBottom: 16 }}>
                        {stat.icon}
                      </div>
                      <Statistic
                        value={animateStats ? stat.value : 0}
                        prefix={stat.prefix}
                        valueStyle={{ 
                          fontSize: 28,
                          fontWeight: 'bold',
                          color: '#1890ff'
                        }}
                      />
                      <Text strong style={{ display: 'block', marginTop: 8 }}>
                        {stat.label}
                      </Text>
                      <div style={{ marginTop: 8 }}>
                        <Tag color="green">{stat.trend}</Tag>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {stat.period}
                        </Text>
                      </div>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </div>
        </div>

        {/* Featured Causes Carousel */}
        <div style={{ padding: '60px 24px', background: '#fafafa' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <Title level={2}>Featured Causes</Title>
              <Paragraph>Active campaigns making a difference right now</Paragraph>
            </div>

            <Carousel
              autoplay
              dots={{ className: 'custom-dots' }}
              style={{ borderRadius: 12, overflow: 'hidden' }}
            >
              {featuredCauses.map((cause) => (
                <div key={cause.id}>
                  <Card
                    cover={
                      <div style={{ position: 'relative', height: 250, overflow: 'hidden' }}>
                        <AntImage
                          src={cause.image}
                          alt={cause.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          preview={false}
                        />
                        <div style={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
                          display: 'flex',
                          gap: 8
                        }}>
                          {cause.urgency === 'high' && (
                            <Badge status="error" text="Urgent" />
                          )}
                          {cause.completed && (
                            <Badge status="success" text="Completed" />
                          )}
                        </div>
                      </div>
                    }
                    style={{ margin: '0 8px' }}
                    actions={[
                      <Tooltip title="Like this cause" key="like">
                        <LikeOutlined />
                      </Tooltip>,
                      <Tooltip title="Share with others" key="share">
                        <ShareAltOutlined />
                      </Tooltip>,
                      <Link href={`/causes/${cause.id}`} key="view">
                        <ArrowRightOutlined />
                      </Link>,
                    ]}
                  >
                    <Card.Meta
                      title={
                        <div>
                          <Title level={4} style={{ margin: 0, marginBottom: 8 }}>
                            {cause.title}
                          </Title>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                            <EnvironmentOutlined style={{ color: '#1890ff' }} />
                            <Text type="secondary">{cause.location}</Text>
                            {!cause.completed && (
                              <>
                                <ClockCircleOutlined style={{ color: '#fa8c16' }} />
                                <Text type="secondary">{cause.daysLeft} days left</Text>
                              </>
                            )}
                          </div>
                        </div>
                      }
                      description={
                        <div>
                          <Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: 16 }}>
                            {cause.description}
                          </Paragraph>
                          <div style={{ marginBottom: 16 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                              <Text strong>${cause.raised.toLocaleString()} raised</Text>
                              <Text type="secondary">
                                {Math.round((cause.raised / cause.goal) * 100)}%
                              </Text>
                            </div>
                            <Progress 
                              percent={(cause.raised / cause.goal) * 100} 
                              showInfo={false}
                              strokeColor={{
                                '0%': '#108ee9',
                                '100%': '#87d068',
                              }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                              <Text type="secondary">Goal: ${cause.goal.toLocaleString()}</Text>
                              <Text type="secondary">{cause.supporters} supporters</Text>
                            </div>
                          </div>
                        </div>
                      }
                    />
                  </Card>
                </div>
              ))}
            </Carousel>
          </div>
        </div>

        {/* Interactive How It Works */}
        <div style={{ padding: '60px 24px', background: '#fff' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <Title level={2}>How It Works</Title>
              <Paragraph>Simple steps to start making an impact</Paragraph>
            </div>

            <Row gutter={[48, 32]} align="middle">
              <Col xs={24} lg={12}>
                <Steps
                  direction="vertical"
                  size="small"
                  current={activeTab}
                  onChange={setActiveTab}
                  items={howItWorksSteps.map((step, index) => ({
                    title: step.title,
                    description: step.description,
                    icon: React.cloneElement(step.icon, { 
                      style: { fontSize: 24, color: activeTab === index ? '#1890ff' : '#8c8c8c' }
                    })
                  }))}
                />
              </Col>
              <Col xs={24} lg={12}>
                <Card
                  style={{
                    height: 300,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: activeTab === 0 ? '#e6f7ff' : 
                               activeTab === 1 ? '#f6ffed' : '#fff1f0',
                    border: 'none',
                    borderRadius: 12
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    {React.cloneElement(howItWorksSteps[activeTab].icon, { 
                      style: { fontSize: 64, color: '#1890ff', marginBottom: 16 }
                    })}
                    <Title level={3}>{howItWorksSteps[activeTab].title}</Title>
                    <Paragraph style={{ fontSize: 16 }}>
                      {howItWorksSteps[activeTab].description}
                    </Paragraph>
                    <Button type="primary" size="large">
                      Get Started
                    </Button>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div style={{ padding: '60px 24px', background: '#fafafa' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <Title level={2}>Live Community Activity</Title>
              <Paragraph>See what's happening in our community right now</Paragraph>
            </div>

            <Row gutter={[24, 24]}>
              <Col xs={24} lg={12}>
                <Card title="Recent Donations" extra={<FireOutlined style={{ color: '#fa8c16' }} />}>
                  <List
                    itemLayout="horizontal"
                    dataSource={[
                      {
                        name: 'Anonymous',
                        action: 'donated $50 to',
                        cause: 'Emergency Food Relief',
                        time: '2 minutes ago'
                      },
                      {
                        name: 'Sarah J.',
                        action: 'donated $25 to',
                        cause: 'School Lunch Program',
                        time: '5 minutes ago'
                      },
                      {
                        name: 'Mike C.',
                        action: 'donated $100 to',
                        cause: 'Winter Clothing Drive',
                        time: '8 minutes ago'
                      }
                    ]}
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<Avatar style={{ backgroundColor: '#1890ff' }}>{item.name.charAt(0)}</Avatar>}
                          title={
                            <span>
                              <Text strong>{item.name}</Text> {item.action} <Text type="primary">{item.cause}</Text>
                            </span>
                          }
                          description={item.time}
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
              
              <Col xs={24} lg={12}>
                <Card title="New Volunteers" extra={<TeamOutlined style={{ color: '#52c41a' }} />}>
                  <List
                    itemLayout="horizontal"
                    dataSource={[
                      {
                        name: 'Lisa R.',
                        action: 'joined as volunteer for',
                        cause: 'Community Garden',
                        time: '1 minute ago'
                      },
                      {
                        name: 'David P.',
                        action: 'signed up to help with',
                        cause: 'Food Bank Distribution',
                        time: '4 minutes ago'
                      },
                      {
                        name: 'Maria S.',
                        action: 'volunteered for',
                        cause: 'Coding Workshop',
                        time: '7 minutes ago'
                      }
                    ]}
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<Avatar style={{ backgroundColor: '#52c41a' }}>{item.name.charAt(0)}</Avatar>}
                          title={
                            <span>
                              <Text strong>{item.name}</Text> {item.action} <Text type="primary">{item.cause}</Text>
                            </span>
                          }
                          description={item.time}
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>
          </div>
        </div>

        {/* CTA Section */}
        <div style={{
          background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
          padding: '80px 24px',
          textAlign: 'center'
        }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Title level={2} style={{ color: 'white', marginBottom: 16 }}>
              Ready to Make a Difference?
            </Title>
            <Paragraph style={{ color: 'rgba(255,255,255,0.85)', fontSize: 18, marginBottom: 32, maxWidth: 600, margin: '0 auto 32px' }}>
              Join thousands of community members creating positive change. 
              Start your impact journey today.
            </Paragraph>
            <Space size="large" wrap>
              <Link href="/auth/signup">
                <Button 
                  type="primary" 
                  size="large"
                  style={{ 
                    background: 'white', 
                    color: '#1890ff',
                    border: 'none',
                    height: 50,
                    padding: '0 30px'
                  }}
                >
                  Get Started Free
                </Button>
              </Link>
              <Link href="/causes">
                <Button 
                  size="large"
                  ghost
                  style={{ height: 50, padding: '0 30px' }}
                >
                  Explore Causes
                </Button>
              </Link>
            </Space>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}
