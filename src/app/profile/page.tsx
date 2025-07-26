"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Avatar,
  Typography,
  Button,
  Tabs,
  Statistic,
  List,
  Progress,
  Tag,
  Space,
  Divider,
  Modal,
  Form,
  Input,
  Upload,
  message,
  Switch,
  Select,
  Badge,
  Timeline,
  Empty,
  Tooltip,
  Rate,
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  SettingOutlined,
  HeartOutlined,
  TrophyOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
  CameraOutlined,
  DollarOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  StarOutlined,
  BookOutlined,
  ShareAltOutlined,
  FlagOutlined,
  CheckCircleOutlined,
  FireOutlined,
  BellOutlined,
  EyeOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { unsplashImages, getRandomCauseImage } from "@/services/unsplashService";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  bio: string;
  location: string;
  website?: string;
  phone?: string;
  joinedDate: string;
  verified: boolean;
  stats: {
    causesCreated: number;
    totalDonated: number;
    totalRaised: number;
    volunteersHours: number;
    causesSupported: number;
    impactScore: number;
  };
  badges: {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    earned: boolean;
    earnedDate?: string;
  }[];
  causes: {
    id: number;
    title: string;
    description: string;
    status: "active" | "completed" | "paused";
    raised: number;
    goal: number;
    supporters: number;
    image: string;
    createdAt: string;
  }[];
  contributions: {
    id: number;
    causeTitle: string;
    amount: number;
    date: string;
    type: "donation" | "volunteer" | "skill";
    hours?: number;
    skill?: string;
  }[];
  activities: {
    id: number;
    type: "created_cause" | "donated" | "volunteered" | "shared" | "comment";
    description: string;
    date: string;
    icon: React.ReactNode;
  }[];
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    profileVisibility: "public" | "private" | "friends";
    newsletter: boolean;
    marketing: boolean;
  };
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [form] = Form.useForm();

  // Mock profile data
  useEffect(() => {
    // Check if user is signed in
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    // Mock profile data
    const mockProfile: UserProfile = {
      id: 1,
      name: session.user.name || "John Doe",
      email: session.user.email || "john@example.com",
      avatar: session.user.image,
      bio: "Passionate community advocate with 5+ years of experience in organizing local food security initiatives. Believes in the power of collective action to create lasting change.",
      location: "Seattle, WA",
      website: "https://johndoe.com",
      phone: "(555) 123-4567",
      joinedDate: "2023-01-15",
      verified: true,
      stats: {
        causesCreated: 12,
        totalDonated: 5650,
        totalRaised: 87500,
        volunteersHours: 324,
        causesSupported: 28,
        impactScore: 92,
      },
      badges: [
        {
          id: "community-champion",
          name: "Community Champion",
          description: "Created 10+ successful causes",
          icon: "🏆",
          color: "gold",
          earned: true,
          earnedDate: "2024-01-15",
        },
        {
          id: "top-fundraiser",
          name: "Top Fundraiser",
          description: "Raised over $50,000",
          icon: "💰",
          color: "green",
          earned: true,
          earnedDate: "2024-01-10",
        },
        {
          id: "volunteer-hero",
          name: "Volunteer Hero",
          description: "300+ volunteer hours",
          icon: "⭐",
          color: "blue",
          earned: true,
          earnedDate: "2024-01-05",
        },
        {
          id: "mentor",
          name: "Mentor",
          description: "Helped 5+ new organizers",
          icon: "👥",
          color: "purple",
          earned: false,
        },
      ],
      causes: [
        {
          id: 1,
          title: "Emergency Food Relief for Hurricane Victims",
          description: "Providing immediate food assistance to families displaced by recent hurricane damage.",
          status: "active",
          raised: 48750,
          goal: 75000,
          supporters: 234,
          image: unsplashImages.causes[0].url,
          createdAt: "2024-01-10",
        },
        {
          id: 2,
          title: "Community Food Bank Expansion",
          description: "Expanding our local food bank to serve 500 more families weekly.",
          status: "completed",
          raised: 50000,
          goal: 50000,
          supporters: 156,
          image: unsplashImages.causes[1].url,
          createdAt: "2023-12-15",
        },
        {
          id: 3,
          title: "Mobile Kitchen Initiative",
          description: "Creating a mobile kitchen to deliver hot meals to underserved neighborhoods.",
          status: "active",
          raised: 12000,
          goal: 35000,
          supporters: 89,
          image: unsplashImages.causes[2].url,
          createdAt: "2024-01-20",
        },
      ],
      contributions: [
        {
          id: 1,
          causeTitle: "School Breakfast Program",
          amount: 250,
          date: "2024-01-20",
          type: "donation",
        },
        {
          id: 2,
          causeTitle: "Senior Meal Delivery",
          amount: 0,
          date: "2024-01-18",
          type: "volunteer",
          hours: 8,
        },
        {
          id: 3,
          causeTitle: "Food Recovery Network",
          amount: 0,
          date: "2024-01-15",
          type: "skill",
          skill: "Web Development",
        },
      ],
      activities: [
        {
          id: 1,
          type: "created_cause",
          description: "Created Emergency Food Relief for Hurricane Victims",
          date: "2024-01-10",
          icon: <HeartOutlined />,
        },
        {
          id: 2,
          type: "donated",
          description: "Donated $250 to School Breakfast Program",
          date: "2024-01-08",
          icon: <DollarOutlined />,
        },
        {
          id: 3,
          type: "volunteered",
          description: "Volunteered 8 hours for Senior Meal Delivery",
          date: "2024-01-05",
          icon: <TeamOutlined />,
        },
        {
          id: 4,
          type: "shared",
          description: "Shared Community Food Bank Expansion",
          date: "2024-01-03",
          icon: <ShareAltOutlined />,
        },
      ],
      preferences: {
        emailNotifications: true,
        smsNotifications: false,
        profileVisibility: "public",
        newsletter: true,
        marketing: false,
      },
    };

    setTimeout(() => {
      setProfile(mockProfile);
      setLoading(false);
    }, 1000);
  }, [session, status, router]);

  const handleEditProfile = async (values: any) => {
    try {
      // Mock API call
      message.success("Profile updated successfully!");
      setEditModalVisible(false);
      if (profile) {
        setProfile({
          ...profile,
          ...values,
        });
      }
    } catch (error) {
      message.error("Failed to update profile");
    }
  };

  const handleUpdateSettings = async (values: any) => {
    try {
      // Mock API call
      message.success("Settings updated successfully!");
      setSettingsModalVisible(false);
      if (profile) {
        setProfile({
          ...profile,
          preferences: values,
        });
      }
    } catch (error) {
      message.error("Failed to update settings");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "green";
      case "completed":
        return "blue";
      case "paused":
        return "orange";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <Text className="text-gray-600">Loading your profile...</Text>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!profile) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <Title level={3} className="text-gray-400">
              Profile not found
            </Title>
            <Paragraph className="text-gray-500 mb-6">
              There was an error loading your profile.
            </Paragraph>
            <Button type="primary" onClick={() => router.push("/")}>
              Go Home
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="container mx-auto px-6 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Row gutter={[32, 32]} align="middle">
                <Col xs={24} md={8} className="text-center md:text-left">
                  <div className="relative inline-block">
                    <Avatar
                      size={120}
                      src={profile.avatar}
                      icon={<UserOutlined />}
                      className="border-4 border-white shadow-lg"
                    />
                    {profile.verified && (
                      <div className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full p-2">
                        <CheckCircleOutlined className="text-sm" />
                      </div>
                    )}
                  </div>
                </Col>
                <Col xs={24} md={12}>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Title level={2} className="text-white mb-0">
                        {profile.name}
                      </Title>
                      {profile.verified && (
                        <Tooltip title="Verified user">
                          <CheckCircleOutlined className="text-green-400 text-lg" />
                        </Tooltip>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 text-blue-100">
                      <div className="flex items-center space-x-2">
                        <EnvironmentOutlined />
                        <span>{profile.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CalendarOutlined />
                        <span>
                          Joined {new Date(profile.joinedDate).toLocaleDateString("en-US", { year: "numeric", month: "long" })}
                        </span>
                      </div>
                    </div>
                    <Paragraph className="text-blue-100 text-lg mb-0">
                      {profile.bio}
                    </Paragraph>
                  </div>
                </Col>
                <Col xs={24} md={4} className="text-center">
                  <Space direction="vertical" size="middle">
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={() => setEditModalVisible(true)}
                      className="bg-white text-blue-600 border-white hover:bg-blue-50"
                      size="large"
                    >
                      Edit Profile
                    </Button>
                    <Button
                      icon={<SettingOutlined />}
                      onClick={() => setSettingsModalVisible(true)}
                      className="border-white text-white hover:bg-white/10"
                      size="large"
                    >
                      Settings
                    </Button>
                  </Space>
                </Col>
              </Row>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Row gutter={[16, 16]}>
              <Col xs={12} sm={8} md={4}>
                <Card className="text-center shadow-sm">
                  <Statistic
                    title="Causes Created"
                    value={profile.stats.causesCreated}
                    prefix={<HeartOutlined className="text-red-500" />}
                    valueStyle={{ color: "#1f2937", fontSize: "1.5rem" }}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={8} md={4}>
                <Card className="text-center shadow-sm">
                  <Statistic
                    title="Total Donated"
                    value={profile.stats.totalDonated}
                    prefix={<DollarOutlined className="text-green-500" />}
                    formatter={(value) => formatCurrency(Number(value))}
                    valueStyle={{ color: "#1f2937", fontSize: "1.5rem" }}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={8} md={4}>
                <Card className="text-center shadow-sm">
                  <Statistic
                    title="Total Raised"
                    value={profile.stats.totalRaised}
                    prefix={<TrophyOutlined className="text-yellow-500" />}
                    formatter={(value) => formatCurrency(Number(value))}
                    valueStyle={{ color: "#1f2937", fontSize: "1.5rem" }}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={8} md={4}>
                <Card className="text-center shadow-sm">
                  <Statistic
                    title="Volunteer Hours"
                    value={profile.stats.volunteersHours}
                    prefix={<ClockCircleOutlined className="text-blue-500" />}
                    valueStyle={{ color: "#1f2937", fontSize: "1.5rem" }}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={8} md={4}>
                <Card className="text-center shadow-sm">
                  <Statistic
                    title="Causes Supported"
                    value={profile.stats.causesSupported}
                    prefix={<TeamOutlined className="text-purple-500" />}
                    valueStyle={{ color: "#1f2937", fontSize: "1.5rem" }}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={8} md={4}>
                <Card className="text-center shadow-sm">
                  <div className="mb-2">
                    <Text className="text-gray-500 text-sm">Impact Score</Text>
                  </div>
                  <div className="relative">
                    <Progress
                      type="circle"
                      percent={profile.stats.impactScore}
                      width={60}
                      strokeColor={{
                        "0%": "#3b82f6",
                        "100%": "#1d4ed8",
                      }}
                      format={(percent) => (
                        <span className="text-lg font-bold text-gray-900">
                          {percent}
                        </span>
                      )}
                    />
                    <div className="mt-2">
                      <StarOutlined className="text-yellow-500" />
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              size="large"
              items={[
                {
                  key: "overview",
                  label: "Overview",
                  children: (
                    <Row gutter={[24, 24]}>
                      {/* Badges */}
                      <Col xs={24} lg={8}>
                        <Card title="Achievements" className="h-full">
                          <div className="space-y-4">
                            {profile.badges.map((badge) => (
                              <div
                                key={badge.id}
                                className={`p-4 rounded-lg border transition-all ${
                                  badge.earned
                                    ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200"
                                    : "bg-gray-50 border-gray-200 opacity-60"
                                }`}
                              >
                                <div className="flex items-start space-x-3">
                                  <div className="text-2xl">{badge.icon}</div>
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                      <Text
                                        strong
                                        className={
                                          badge.earned
                                            ? "text-gray-900"
                                            : "text-gray-500"
                                        }
                                      >
                                        {badge.name}
                                      </Text>
                                      {badge.earned && (
                                        <CheckCircleOutlined className="text-green-500" />
                                      )}
                                    </div>
                                    <Text
                                      type="secondary"
                                      className="text-sm"
                                    >
                                      {badge.description}
                                    </Text>
                                    {badge.earned && badge.earnedDate && (
                                      <div className="text-xs text-gray-400 mt-1">
                                        Earned{" "}
                                        {new Date(
                                          badge.earnedDate
                                        ).toLocaleDateString()}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </Card>
                      </Col>

                      {/* Recent Activity */}
                      <Col xs={24} lg={16}>
                        <Card title="Recent Activity" className="h-full">
                          <Timeline
                            items={profile.activities.map((activity) => ({
                              dot: (
                                <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                                  {activity.icon}
                                </div>
                              ),
                              children: (
                                <div>
                                  <Text strong>{activity.description}</Text>
                                  <div className="text-sm text-gray-500">
                                    {new Date(
                                      activity.date
                                    ).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })}
                                  </div>
                                </div>
                              ),
                            }))}
                          />
                        </Card>
                      </Col>
                    </Row>
                  ),
                },
                {
                  key: "causes",
                  label: `My Causes (${profile.causes.length})`,
                  children: (
                    <Row gutter={[24, 24]}>
                      {profile.causes.map((cause) => (
                        <Col xs={24} md={12} lg={8} key={cause.id}>
                          <motion.div
                            whileHover={{ y: -4 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Card
                              className="h-full shadow-sm hover:shadow-md transition-all duration-300"
                              cover={
                                <div className="relative h-48 overflow-hidden">
                                  <Image
                                    src={cause.image}
                                    alt={cause.title}
                                    fill
                                    className="object-cover"
                                  />
                                  <div className="absolute top-4 right-4">
                                    <Tag
                                      color={getStatusColor(cause.status)}
                                      className="capitalize"
                                    >
                                      {cause.status}
                                    </Tag>
                                  </div>
                                </div>
                              }
                            >
                              <div className="space-y-3">
                                <Title level={5} className="mb-2 line-clamp-2">
                                  {cause.title}
                                </Title>
                                <Paragraph
                                  type="secondary"
                                  className="text-sm line-clamp-2"
                                >
                                  {cause.description}
                                </Paragraph>

                                {/* Progress */}
                                <div>
                                  <div className="flex justify-between items-center mb-2">
                                    <Text className="text-sm font-medium">
                                      {formatCurrency(cause.raised)} raised
                                    </Text>
                                    <Text type="secondary" className="text-sm">
                                      {Math.round(
                                        (cause.raised / cause.goal) * 100
                                      )}
                                      %
                                    </Text>
                                  </div>
                                  <Progress
                                    percent={(cause.raised / cause.goal) * 100}
                                    showInfo={false}
                                    strokeColor={{
                                      "0%": "#3b82f6",
                                      "100%": "#1d4ed8",
                                    }}
                                  />
                                  <div className="flex justify-between items-center mt-2">
                                    <Text type="secondary" className="text-xs">
                                      Goal: {formatCurrency(cause.goal)}
                                    </Text>
                                    <Text type="secondary" className="text-xs">
                                      {cause.supporters} supporters
                                    </Text>
                                  </div>
                                </div>

                                <div className="flex justify-between items-center pt-2">
                                  <Text type="secondary" className="text-xs">
                                    Created{" "}
                                    {new Date(
                                      cause.createdAt
                                    ).toLocaleDateString()}
                                  </Text>
                                  <Link href={`/causes/${cause.id}`}>
                                    <Button type="link" size="small">
                                      View Details
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            </Card>
                          </motion.div>
                        </Col>
                      ))}
                      {profile.causes.length === 0 && (
                        <Col span={24}>
                          <Empty
                            description="No causes created yet"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                          >
                            <Link href="/causes/create">
                              <Button type="primary" icon={<PlusOutlined />}>
                                Create Your First Cause
                              </Button>
                            </Link>
                          </Empty>
                        </Col>
                      )}
                    </Row>
                  ),
                },
                {
                  key: "contributions",
                  label: `Contributions (${profile.contributions.length})`,
                  children: (
                    <Card>
                      <List
                        dataSource={profile.contributions}
                        renderItem={(contribution) => (
                          <List.Item>
                            <List.Item.Meta
                              avatar={
                                <Avatar
                                  icon={
                                    contribution.type === "donation" ? (
                                      <DollarOutlined />
                                    ) : contribution.type === "volunteer" ? (
                                      <TeamOutlined />
                                    ) : (
                                      <BookOutlined />
                                    )
                                  }
                                  className={
                                    contribution.type === "donation"
                                      ? "bg-green-100 text-green-600"
                                      : contribution.type === "volunteer"
                                      ? "bg-blue-100 text-blue-600"
                                      : "bg-purple-100 text-purple-600"
                                  }
                                />
                              }
                              title={
                                <div className="flex items-center space-x-2">
                                  <span>{contribution.causeTitle}</span>
                                  <Tag
                                    color={
                                      contribution.type === "donation"
                                        ? "green"
                                        : contribution.type === "volunteer"
                                        ? "blue"
                                        : "purple"
                                    }
                                    className="capitalize"
                                  >
                                    {contribution.type}
                                  </Tag>
                                </div>
                              }
                              description={
                                <div className="space-y-1">
                                  {contribution.type === "donation" && (
                                    <Text>
                                      Donated {formatCurrency(contribution.amount)}
                                    </Text>
                                  )}
                                  {contribution.type === "volunteer" && (
                                    <Text>
                                      Volunteered {contribution.hours} hours
                                    </Text>
                                  )}
                                  {contribution.type === "skill" && (
                                    <Text>
                                      Shared skill: {contribution.skill}
                                    </Text>
                                  )}
                                  <div className="text-sm text-gray-500">
                                    {new Date(
                                      contribution.date
                                    ).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })}
                                  </div>
                                </div>
                              }
                            />
                          </List.Item>
                        )}
                      />
                      {profile.contributions.length === 0 && (
                        <Empty
                          description="No contributions yet"
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                        >
                          <Link href="/causes">
                            <Button type="primary" icon={<HeartOutlined />}>
                              Explore Causes
                            </Button>
                          </Link>
                        </Empty>
                      )}
                    </Card>
                  ),
                },
              ]}
            />
          </motion.div>
        </div>

        {/* Edit Profile Modal */}
        <Modal
          title="Edit Profile"
          open={editModalVisible}
          onCancel={() => setEditModalVisible(false)}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleEditProfile}
            initialValues={profile}
          >
            <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
              <Input size="large" />
            </Form.Item>

            <Form.Item name="bio" label="Bio">
              <TextArea rows={4} placeholder="Tell us about yourself..." />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="location" label="Location">
                  <Input size="large" prefix={<EnvironmentOutlined />} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="website" label="Website">
                  <Input size="large" prefix={<GlobalOutlined />} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="email" label="Email" rules={[{ type: "email" }]}>
                  <Input size="large" prefix={<MailOutlined />} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="phone" label="Phone">
                  <Input size="large" prefix={<PhoneOutlined />} />
                </Form.Item>
              </Col>
            </Row>

            <div className="flex justify-end space-x-2 pt-4">
              <Button onClick={() => setEditModalVisible(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal>

        {/* Settings Modal */}
        <Modal
          title="Account Settings"
          open={settingsModalVisible}
          onCancel={() => setSettingsModalVisible(false)}
          footer={null}
          width={500}
        >
          <Form
            layout="vertical"
            onFinish={handleUpdateSettings}
            initialValues={profile.preferences}
          >
            <Title level={5}>Notifications</Title>
            <Form.Item name="emailNotifications" valuePropName="checked">
              <div className="flex items-center justify-between">
                <div>
                  <Text strong>Email Notifications</Text>
                  <div className="text-sm text-gray-500">
                    Receive updates about your causes and activities
                  </div>
                </div>
                <Switch />
              </div>
            </Form.Item>

            <Form.Item name="smsNotifications" valuePropName="checked">
              <div className="flex items-center justify-between">
                <div>
                  <Text strong>SMS Notifications</Text>
                  <div className="text-sm text-gray-500">
                    Urgent updates via text message
                  </div>
                </div>
                <Switch />
              </div>
            </Form.Item>

            <Divider />

            <Title level={5}>Privacy</Title>
            <Form.Item name="profileVisibility" label="Profile Visibility">
              <Select size="large">
                <Select.Option value="public">Public</Select.Option>
                <Select.Option value="private">Private</Select.Option>
                <Select.Option value="friends">Friends Only</Select.Option>
              </Select>
            </Form.Item>

            <Divider />

            <Title level={5}>Marketing</Title>
            <Form.Item name="newsletter" valuePropName="checked">
              <div className="flex items-center justify-between">
                <div>
                  <Text strong>Newsletter</Text>
                  <div className="text-sm text-gray-500">
                    Monthly updates and impact stories
                  </div>
                </div>
                <Switch />
              </div>
            </Form.Item>

            <Form.Item name="marketing" valuePropName="checked">
              <div className="flex items-center justify-between">
                <div>
                  <Text strong>Marketing Communications</Text>
                  <div className="text-sm text-gray-500">
                    Special offers and product updates
                  </div>
                </div>
                <Switch />
              </div>
            </Form.Item>

            <div className="flex justify-end space-x-2 pt-4">
              <Button onClick={() => setSettingsModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Save Settings
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
    </MainLayout>
  );
}