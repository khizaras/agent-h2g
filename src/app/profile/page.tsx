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
  message,
  Switch,
  Select,
  Empty,
  Timeline,
  Badge,
  Skeleton,
  Tooltip,
  Alert,
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
  DollarOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  PlusOutlined,
  StarOutlined,
  EyeOutlined,
  CommentOutlined,
  ShareAltOutlined,
  BellOutlined,
  SafetyCertificateOutlined,
  GiftOutlined,
  RiseOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { motion } from "framer-motion";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  phone?: string;
  joinedDate: string;
  isVerified?: boolean;
  stats: {
    causesCreated: number;
    totalDonated: number;
    totalRaised: number;
    volunteersHours: number;
    causesSupported: number;
    totalViews: number;
    totalLikes: number;
    completedCauses: number;
  };
  causes: any[];
  supportedCauses: any[];
  activities: any[];
}

interface Activity {
  id: number;
  type: string;
  description: string;
  cause_title: string;
  cause_image?: string;
  category_name: string;
  category_color: string;
  created_at: string;
  metadata?: any;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [supportedCauses, setSupportedCauses] = useState<any[]>([]);
  const [form] = Form.useForm();
  const [updating, setUpdating] = useState(false);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [loadingSupportedCauses, setLoadingSupportedCauses] = useState(false);

  // Fetch real profile data
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    const fetchProfileData = async () => {
      try {
        setLoading(true);

        // Fetch user's causes
        const causesResponse = await fetch("/api/user/causes");
        let userCauses = [];

        if (causesResponse.ok) {
          const causesData = await causesResponse.json();
          userCauses = causesData.success ? causesData.data?.causes || [] : [];
        }

        // Calculate comprehensive stats from causes
        const stats = {
          causesCreated: userCauses.length,
          totalDonated: 0, // This would come from a donations table if implemented
          totalRaised: userCauses.reduce(
            (sum: number, c: any) => sum + (c.raised_amount || 0),
            0,
          ),
          volunteersHours: userCauses.reduce(
            (sum: number, c: any) => sum + (c.volunteer_hours || 0),
            0,
          ),
          causesSupported: 0, // Will be updated when we fetch supported causes
          totalViews: userCauses.reduce(
            (sum: number, c: any) => sum + (c.view_count || 0),
            0,
          ),
          totalLikes: userCauses.reduce(
            (sum: number, c: any) => sum + (c.like_count || 0),
            0,
          ),
          completedCauses: userCauses.filter(
            (c: any) => c.status === "completed",
          ).length,
        };

        const profileData: UserProfile = {
          id: Number(session.user.id) || 1,
          name: session.user.name || "Community Member",
          email: session.user.email || "",
          avatar: session.user.image,
          bio: (session.user as any).bio || "",
          location: (session.user as any).location || "",
          website: (session.user as any).website || "",
          phone: (session.user as any).phone || "",
          joinedDate:
            (session.user as any).createdAt || new Date().toISOString(),
          isVerified: (session.user as any).is_verified || false,
          stats,
          causes: userCauses,
          supportedCauses: [],
          activities: [],
        };

        setProfile(profileData);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        message.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [session, status, router]);

  // Fetch user activities
  const fetchActivities = async () => {
    if (!session?.user?.id) return;

    try {
      setLoadingActivities(true);
      const response = await fetch(`/api/user/activities?limit=10`);
      const data = await response.json();

      if (data.success) {
        setActivities(data.data.activities || []);
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoadingActivities(false);
    }
  };

  // Fetch supported causes
  const fetchSupportedCauses = async () => {
    if (!session?.user?.id) return;

    try {
      setLoadingSupportedCauses(true);
      const response = await fetch(`/api/user/supported-causes?limit=10`);
      const data = await response.json();

      if (data.success) {
        setSupportedCauses(data.data.causes || []);
        // Update profile stats with supported causes count
        if (profile) {
          setProfile((prev) =>
            prev
              ? {
                  ...prev,
                  stats: {
                    ...prev.stats,
                    causesSupported: data.data.causes?.length || 0,
                  },
                }
              : null,
          );
        }
      }
    } catch (error) {
      console.error("Error fetching supported causes:", error);
    } finally {
      setLoadingSupportedCauses(false);
    }
  };

  // Fetch activities and supported causes when tab changes
  useEffect(() => {
    if (activeTab === "activities" && activities.length === 0) {
      fetchActivities();
    } else if (activeTab === "supported" && supportedCauses.length === 0) {
      fetchSupportedCauses();
    }
  }, [activeTab, session?.user?.id]);

  const handleEditProfile = async (values: any) => {
    try {
      setUpdating(true);

      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (data.success) {
        message.success("Profile updated successfully!");
        setProfile((prev) => (prev ? { ...prev, ...values } : null));
        setEditModalVisible(false);
      } else {
        message.error(data.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error("Failed to update profile");
    } finally {
      setUpdating(false);
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
      case "pending":
        return "gold";
      default:
        return "default";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "#f5222d";
      case "high":
        return "#fa8c16";
      case "medium":
        return "#faad14";
      case "low":
        return "#52c41a";
      default:
        return "#d9d9d9";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "donation":
        return <GiftOutlined style={{ color: "#52c41a" }} />;
      case "comment":
        return <CommentOutlined style={{ color: "#1890ff" }} />;
      case "like":
        return <HeartOutlined style={{ color: "#eb2f96" }} />;
      case "share":
        return <ShareAltOutlined style={{ color: "#722ed1" }} />;
      case "volunteer":
        return <TeamOutlined style={{ color: "#fa8c16" }} />;
      default:
        return <StarOutlined style={{ color: "#faad14" }} />;
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-6 py-8">
            <div className="max-w-7xl mx-auto">
              {/* Header Skeleton */}
              <Card className="mb-6">
                <Row gutter={[24, 24]} align="middle">
                  <Col xs={24} sm={6} className="text-center">
                    <Skeleton.Avatar size={120} active />
                  </Col>
                  <Col xs={24} sm={12}>
                    <Skeleton active paragraph={{ rows: 3 }} />
                  </Col>
                  <Col xs={24} sm={6}>
                    <Skeleton.Button size="large" active />
                  </Col>
                </Row>
              </Card>

              {/* Stats Skeleton */}
              <Card className="mb-6">
                <Row gutter={[16, 16]}>
                  {[1, 2, 3, 4].map((i) => (
                    <Col key={i} xs={12} sm={6}>
                      <Skeleton active paragraph={{ rows: 1 }} />
                    </Col>
                  ))}
                </Row>
              </Card>

              {/* Content Skeleton */}
              <Card>
                <Skeleton active paragraph={{ rows: 8 }} />
              </Card>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!profile) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Alert
              message="Profile Not Found"
              description="There was an error loading your profile. Please try again."
              type="error"
              showIcon
              className="mb-4"
            />
            <Space>
              <Button type="primary" onClick={() => window.location.reload()}>
                Retry
              </Button>
              <Button onClick={() => router.push("/")}>Go Home</Button>
            </Space>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="mb-6 overflow-hidden">
                {/* Cover Background */}
                <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                </div>

                {/* Profile Info */}
                <div className="relative px-6 pb-6">
                  <div className="-mt-16 relative z-10">
                    <Row gutter={[24, 24]} align="middle">
                      <Col xs={24} sm={6} className="text-center sm:text-left">
                        <div className="relative inline-block">
                          <Avatar
                            size={120}
                            src={profile.avatar}
                            icon={<UserOutlined />}
                            className="border-4 border-white shadow-lg"
                          />
                          {profile.isVerified && (
                            <Badge
                              count={
                                <SafetyCertificateOutlined
                                  style={{ color: "#52c41a" }}
                                />
                              }
                              offset={[-10, 10]}
                            />
                          )}
                        </div>
                      </Col>
                      <Col xs={24} sm={12}>
                        <div className="text-center sm:text-left mt-4 sm:mt-0">
                          <Space align="center" size="small" className="mb-2">
                            <Title level={2} className="mb-0">
                              {profile.name}
                            </Title>
                            {profile.isVerified && (
                              <Tooltip title="Verified User">
                                <SafetyCertificateOutlined
                                  style={{ color: "#52c41a", fontSize: "20px" }}
                                />
                              </Tooltip>
                            )}
                          </Space>
                          <div className="space-y-2">
                            <div className="flex items-center justify-center sm:justify-start text-gray-600">
                              <MailOutlined className="mr-2" />
                              <span>{profile.email}</span>
                            </div>
                            {profile.phone && (
                              <div className="flex items-center justify-center sm:justify-start text-gray-600">
                                <PhoneOutlined className="mr-2" />
                                <span>{profile.phone}</span>
                              </div>
                            )}
                            {profile.location && (
                              <div className="flex items-center justify-center sm:justify-start text-gray-600">
                                <EnvironmentOutlined className="mr-2" />
                                <span>{profile.location}</span>
                              </div>
                            )}
                            <div className="flex items-center justify-center sm:justify-start text-gray-600">
                              <CalendarOutlined className="mr-2" />
                              <span>
                                Joined {formatDate(profile.joinedDate)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Col>
                      <Col xs={24} sm={6} className="text-center sm:text-right">
                        <Space
                          direction="vertical"
                          size="small"
                          className="w-full"
                        >
                          <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => setEditModalVisible(true)}
                            size="large"
                            className="w-full sm:w-auto"
                          >
                            Edit Profile
                          </Button>
                          <Button
                            icon={<BellOutlined />}
                            size="large"
                            className="w-full sm:w-auto"
                          >
                            Notifications
                          </Button>
                        </Space>
                      </Col>
                    </Row>
                    {profile.bio && (
                      <div className="mt-6 pt-4 border-t text-center sm:text-left">
                        <Paragraph className="text-gray-700 text-base leading-relaxed">
                          {profile.bio}
                        </Paragraph>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Enhanced Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="mb-6">
                <div className="text-center mb-6">
                  <Title level={3} className="mb-2">
                    Your Impact Dashboard
                  </Title>
                  <Text type="secondary">
                    Your contributions to the community
                  </Text>
                </div>
                <Row gutter={[24, 24]}>
                  <Col xs={12} sm={8} lg={6}>
                    <div className="text-center p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                      <div className="text-2xl text-blue-600 mb-2">
                        <HeartOutlined />
                      </div>
                      <Statistic
                        title="Causes Created"
                        value={profile.stats.causesCreated}
                        valueStyle={{
                          color: "#1890ff",
                          fontSize: "24px",
                          fontWeight: "bold",
                        }}
                      />
                    </div>
                  </Col>
                  <Col xs={12} sm={8} lg={6}>
                    <div className="text-center p-4 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
                      <div className="text-2xl text-green-600 mb-2">
                        <DollarOutlined />
                      </div>
                      <Statistic
                        title="Total Raised"
                        value={profile.stats.totalRaised}
                        precision={0}
                        prefix="$"
                        valueStyle={{
                          color: "#52c41a",
                          fontSize: "24px",
                          fontWeight: "bold",
                        }}
                      />
                    </div>
                  </Col>
                  <Col xs={12} sm={8} lg={6}>
                    <div className="text-center p-4 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors">
                      <div className="text-2xl text-orange-600 mb-2">
                        <ClockCircleOutlined />
                      </div>
                      <Statistic
                        title="Volunteer Hours"
                        value={profile.stats.volunteersHours}
                        valueStyle={{
                          color: "#fa8c16",
                          fontSize: "24px",
                          fontWeight: "bold",
                        }}
                      />
                    </div>
                  </Col>
                  <Col xs={12} sm={8} lg={6}>
                    <div className="text-center p-4 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors">
                      <div className="text-2xl text-purple-600 mb-2">
                        <TeamOutlined />
                      </div>
                      <Statistic
                        title="Causes Supported"
                        value={profile.stats.causesSupported}
                        valueStyle={{
                          color: "#722ed1",
                          fontSize: "24px",
                          fontWeight: "bold",
                        }}
                      />
                    </div>
                  </Col>
                  <Col xs={12} sm={8} lg={6}>
                    <div className="text-center p-4 rounded-lg bg-pink-50 hover:bg-pink-100 transition-colors">
                      <div className="text-2xl text-pink-600 mb-2">
                        <EyeOutlined />
                      </div>
                      <Statistic
                        title="Total Views"
                        value={profile.stats.totalViews}
                        valueStyle={{
                          color: "#eb2f96",
                          fontSize: "24px",
                          fontWeight: "bold",
                        }}
                      />
                    </div>
                  </Col>
                  <Col xs={12} sm={8} lg={6}>
                    <div className="text-center p-4 rounded-lg bg-red-50 hover:bg-red-100 transition-colors">
                      <div className="text-2xl text-red-600 mb-2">
                        <HeartOutlined />
                      </div>
                      <Statistic
                        title="Total Likes"
                        value={profile.stats.totalLikes}
                        valueStyle={{
                          color: "#f5222d",
                          fontSize: "24px",
                          fontWeight: "bold",
                        }}
                      />
                    </div>
                  </Col>
                  <Col xs={12} sm={8} lg={6}>
                    <div className="text-center p-4 rounded-lg bg-cyan-50 hover:bg-cyan-100 transition-colors">
                      <div className="text-2xl text-cyan-600 mb-2">
                        <CheckCircleOutlined />
                      </div>
                      <Statistic
                        title="Completed Causes"
                        value={profile.stats.completedCauses}
                        valueStyle={{
                          color: "#13c2c2",
                          fontSize: "24px",
                          fontWeight: "bold",
                        }}
                      />
                    </div>
                  </Col>
                  <Col xs={12} sm={8} lg={6}>
                    <div className="text-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="text-2xl text-gray-600 mb-2">
                        <RiseOutlined />
                      </div>
                      <Statistic
                        title="Success Rate"
                        value={
                          profile.stats.causesCreated > 0
                            ? Math.round(
                                (profile.stats.completedCauses /
                                  profile.stats.causesCreated) *
                                  100,
                              )
                            : 0
                        }
                        suffix="%"
                        valueStyle={{
                          color: "#595959",
                          fontSize: "24px",
                          fontWeight: "bold",
                        }}
                      />
                    </div>
                  </Col>
                </Row>
              </Card>
            </motion.div>

            {/* Enhanced Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="min-h-96">
                <Tabs
                  activeKey={activeTab}
                  onChange={setActiveTab}
                  size="large"
                  items={[
                    {
                      key: "overview",
                      label: "Overview",
                      children: (
                        <div className="py-4">
                          <Row gutter={[24, 24]}>
                            <Col xs={24} lg={16}>
                              <div className="mb-6">
                                <Title level={4} className="mb-4">
                                  <TrophyOutlined className="mr-2" />
                                  Recent Achievements
                                </Title>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  {profile.stats.causesCreated > 0 && (
                                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                                      <div className="flex items-center mb-2">
                                        <HeartOutlined className="text-blue-600 text-lg mr-2" />
                                        <span className="font-semibold text-blue-800">
                                          First Cause Created
                                        </span>
                                      </div>
                                      <Text type="secondary">
                                        You've started making a difference!
                                      </Text>
                                    </div>
                                  )}
                                  {profile.stats.completedCauses > 0 && (
                                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                                      <div className="flex items-center mb-2">
                                        <CheckCircleOutlined className="text-green-600 text-lg mr-2" />
                                        <span className="font-semibold text-green-800">
                                          Mission Accomplished
                                        </span>
                                      </div>
                                      <Text type="secondary">
                                        Successfully completed{" "}
                                        {profile.stats.completedCauses} cause
                                        {profile.stats.completedCauses > 1
                                          ? "s"
                                          : ""}
                                        !
                                      </Text>
                                    </div>
                                  )}
                                  {profile.stats.totalViews > 100 && (
                                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                                      <div className="flex items-center mb-2">
                                        <EyeOutlined className="text-purple-600 text-lg mr-2" />
                                        <span className="font-semibold text-purple-800">
                                          Community Attention
                                        </span>
                                      </div>
                                      <Text type="secondary">
                                        Your causes have gained{" "}
                                        {profile.stats.totalViews} views!
                                      </Text>
                                    </div>
                                  )}
                                  {profile.stats.totalLikes > 50 && (
                                    <div className="bg-gradient-to-r from-pink-50 to-pink-100 p-4 rounded-lg border border-pink-200">
                                      <div className="flex items-center mb-2">
                                        <HeartOutlined className="text-pink-600 text-lg mr-2" />
                                        <span className="font-semibold text-pink-800">
                                          Loved by Community
                                        </span>
                                      </div>
                                      <Text type="secondary">
                                        Received {profile.stats.totalLikes}{" "}
                                        likes from supporters!
                                      </Text>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </Col>
                            <Col xs={24} lg={8}>
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <Title level={5} className="mb-3">
                                  Quick Actions
                                </Title>
                                <div className="space-y-3">
                                  <Link href="/causes/create">
                                    <Button
                                      type="primary"
                                      icon={<PlusOutlined />}
                                      block
                                    >
                                      Create New Cause
                                    </Button>
                                  </Link>
                                  <Button icon={<SettingOutlined />} block>
                                    Account Settings
                                  </Button>
                                  <Button icon={<BellOutlined />} block>
                                    Notification Preferences
                                  </Button>
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </div>
                      ),
                    },
                    {
                      key: "causes",
                      label: `My Causes (${profile.causes.length})`,
                      children: (
                        <div className="py-4">
                          {profile.causes.length > 0 ? (
                            <Row gutter={[24, 24]}>
                              {profile.causes.map((cause) => (
                                <Col xs={24} md={12} lg={8} key={cause.id}>
                                  <motion.div
                                    whileHover={{ y: -4 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <Card
                                      className="h-full hover:shadow-lg transition-shadow duration-300"
                                      cover={
                                        cause.image ? (
                                          <div className="h-48 overflow-hidden">
                                            <img
                                              src={cause.image}
                                              alt={cause.title}
                                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                            />
                                          </div>
                                        ) : (
                                          <div className="h-48 bg-gray-100 flex items-center justify-center">
                                            <HeartOutlined className="text-gray-400 text-4xl" />
                                          </div>
                                        )
                                      }
                                      actions={[
                                        <Link
                                          href={`/causes/${cause.id}`}
                                          key="view"
                                        >
                                          <EyeOutlined /> View
                                        </Link>,
                                        <span key="likes">
                                          <HeartOutlined />{" "}
                                          {cause.like_count || 0}
                                        </span>,
                                        <span key="views">
                                          <EyeOutlined />{" "}
                                          {cause.view_count || 0}
                                        </span>,
                                      ]}
                                    >
                                      <div className="mb-3">
                                        <Space>
                                          <Tag
                                            color={getStatusColor(cause.status)}
                                          >
                                            {cause.status?.toUpperCase()}
                                          </Tag>
                                          <Tag
                                            style={{
                                              backgroundColor: getPriorityColor(
                                                cause.priority,
                                              ),
                                              color: "white",
                                              border: "none",
                                            }}
                                          >
                                            {cause.priority?.toUpperCase()}
                                          </Tag>
                                        </Space>
                                      </div>
                                      <Title level={5} className="mb-2">
                                        {cause.title}
                                      </Title>
                                      <Paragraph
                                        className="text-sm text-gray-600 mb-3"
                                        ellipsis={{ rows: 2 }}
                                      >
                                        {cause.description ||
                                          cause.short_description}
                                      </Paragraph>
                                      <div className="text-xs text-gray-500 mb-3">
                                        <Space
                                          split={<Divider type="vertical" />}
                                        >
                                          <span>
                                            <CalendarOutlined />{" "}
                                            {formatDate(cause.created_at)}
                                          </span>
                                          <span>
                                            <CommentOutlined />{" "}
                                            {cause.comment_count || 0}
                                          </span>
                                        </Space>
                                      </div>
                                    </Card>
                                  </motion.div>
                                </Col>
                              ))}
                            </Row>
                          ) : (
                            <Empty
                              description="No causes created yet"
                              image={Empty.PRESENTED_IMAGE_SIMPLE}
                            >
                              <Link href="/causes/create">
                                <Button
                                  type="primary"
                                  icon={<PlusOutlined />}
                                  size="large"
                                >
                                  Create Your First Cause
                                </Button>
                              </Link>
                            </Empty>
                          )}
                        </div>
                      ),
                    },
                    {
                      key: "supported",
                      label: `Supported Causes (${supportedCauses.length})`,
                      children: (
                        <div className="py-4">
                          {loadingSupportedCauses ? (
                            <div className="text-center py-12">
                              <Skeleton active paragraph={{ rows: 4 }} />
                            </div>
                          ) : supportedCauses.length > 0 ? (
                            <Row gutter={[24, 24]}>
                              {supportedCauses.map((cause) => (
                                <Col xs={24} md={12} lg={8} key={cause.id}>
                                  <motion.div
                                    whileHover={{ y: -4 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <Card
                                      className="h-full hover:shadow-lg transition-shadow duration-300"
                                      cover={
                                        cause.image ? (
                                          <div className="h-48 overflow-hidden">
                                            <img
                                              src={cause.image}
                                              alt={cause.title}
                                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                            />
                                          </div>
                                        ) : (
                                          <div className="h-48 bg-gray-100 flex items-center justify-center">
                                            <HeartOutlined className="text-gray-400 text-4xl" />
                                          </div>
                                        )
                                      }
                                      actions={[
                                        <Link
                                          href={`/causes/${cause.id}`}
                                          key="view"
                                        >
                                          <EyeOutlined /> View
                                        </Link>,
                                        <span key="creator">
                                          <UserOutlined /> {cause.creator_name}
                                        </span>,
                                      ]}
                                    >
                                      <div className="mb-3">
                                        <Space>
                                          <Tag
                                            color={
                                              cause.category_color || "blue"
                                            }
                                          >
                                            {cause.category_display_name}
                                          </Tag>
                                          <Tag
                                            color={getStatusColor(cause.status)}
                                          >
                                            {cause.status?.toUpperCase()}
                                          </Tag>
                                        </Space>
                                      </div>
                                      <Title level={5} className="mb-2">
                                        {cause.title}
                                      </Title>
                                      <Paragraph
                                        className="text-sm text-gray-600 mb-3"
                                        ellipsis={{ rows: 2 }}
                                      >
                                        {cause.description ||
                                          cause.short_description}
                                      </Paragraph>
                                      <div className="text-xs text-gray-500">
                                        <Space
                                          split={<Divider type="vertical" />}
                                        >
                                          <span>
                                            <CalendarOutlined />{" "}
                                            {formatDate(cause.last_interaction)}
                                          </span>
                                          <span>
                                            <HeartOutlined />{" "}
                                            {cause.like_count || 0}
                                          </span>
                                        </Space>
                                      </div>
                                    </Card>
                                  </motion.div>
                                </Col>
                              ))}
                            </Row>
                          ) : (
                            <Empty
                              description="No supported causes yet"
                              image={Empty.PRESENTED_IMAGE_SIMPLE}
                            >
                              <Link href="/causes">
                                <Button
                                  type="primary"
                                  icon={<HeartOutlined />}
                                  size="large"
                                >
                                  Discover Causes to Support
                                </Button>
                              </Link>
                            </Empty>
                          )}
                        </div>
                      ),
                    },
                    {
                      key: "activities",
                      label: `Activities (${activities.length})`,
                      children: (
                        <div className="py-4">
                          {loadingActivities ? (
                            <div className="text-center py-12">
                              <Skeleton active paragraph={{ rows: 4 }} />
                            </div>
                          ) : activities.length > 0 ? (
                            <Timeline>
                              {activities.map((activity) => (
                                <Timeline.Item
                                  key={activity.id}
                                  dot={getActivityIcon(activity.type)}
                                >
                                  <div className="ml-4">
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <Title level={5} className="mb-1">
                                          {activity.description}
                                        </Title>
                                        <div className="flex items-center mb-2">
                                          <Link
                                            href={`/causes/${activity.cause_id}`}
                                            className="text-blue-600 hover:text-blue-800"
                                          >
                                            {activity.cause_title}
                                          </Link>
                                          <Tag
                                            color={activity.category_color}
                                            className="ml-2"
                                          >
                                            {activity.category_name}
                                          </Tag>
                                        </div>
                                        <Text
                                          type="secondary"
                                          className="text-sm"
                                        >
                                          {formatDate(activity.created_at)}
                                        </Text>
                                      </div>
                                      {activity.cause_image && (
                                        <img
                                          src={activity.cause_image}
                                          alt={activity.cause_title}
                                          className="w-16 h-16 object-cover rounded ml-4"
                                        />
                                      )}
                                    </div>
                                  </div>
                                </Timeline.Item>
                              ))}
                            </Timeline>
                          ) : (
                            <Empty
                              description="No activities yet"
                              image={Empty.PRESENTED_IMAGE_SIMPLE}
                            >
                              <Text type="secondary">
                                Start interacting with causes to see your
                                activity timeline here.
                              </Text>
                            </Empty>
                          )}
                        </div>
                      ),
                    },
                  ]}
                />
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Enhanced Edit Profile Modal */}
        <Modal
          title={
            <span>
              <EditOutlined className="mr-2" />
              Edit Profile
            </span>
          }
          open={editModalVisible}
          onCancel={() => setEditModalVisible(false)}
          footer={null}
          width={700}
          style={{ top: 20 }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleEditProfile}
            initialValues={profile}
            className="mt-4"
          >
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="name"
                  label="Full Name"
                  rules={[
                    { required: true, message: "Please enter your name" },
                  ]}
                >
                  <Input size="large" placeholder="Enter your full name" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="bio" label="Bio">
              <TextArea
                rows={4}
                placeholder="Tell us about yourself, your interests, and what drives you to help others..."
                showCount
                maxLength={500}
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label="Email Address"
                  rules={[
                    { required: true, message: "Please enter your email" },
                    { type: "email", message: "Please enter a valid email" },
                  ]}
                >
                  <Input
                    size="large"
                    prefix={<MailOutlined />}
                    placeholder="your@email.com"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="phone" label="Phone Number">
                  <Input
                    size="large"
                    prefix={<PhoneOutlined />}
                    placeholder="+1 (555) 123-4567"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="location" label="Location">
                  <Input
                    size="large"
                    prefix={<EnvironmentOutlined />}
                    placeholder="City, State"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="website" label="Website">
                  <Input
                    size="large"
                    prefix={<GlobalOutlined />}
                    placeholder="https://yourwebsite.com"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Divider />

            <div className="flex justify-end space-x-3 pt-2">
              <Button
                size="large"
                onClick={() => setEditModalVisible(false)}
                disabled={updating}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                loading={updating}
                icon={<CheckCircleOutlined />}
              >
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
    </MainLayout>
  );
}
