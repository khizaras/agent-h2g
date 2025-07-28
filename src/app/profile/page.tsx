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
} from "@ant-design/icons";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";

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
  stats: {
    causesCreated: number;
    totalDonated: number;
    totalRaised: number;
    volunteersHours: number;
    causesSupported: number;
  };
  causes: any[];
  contributions: any[];
  activities: any[];
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [form] = Form.useForm();
  const [updating, setUpdating] = useState(false);

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
          userCauses = causesData.success ? causesData.data || [] : [];
        }

        // Calculate basic stats
        const stats = {
          causesCreated: userCauses.length,
          totalDonated: 0,
          totalRaised: userCauses.reduce((sum: number, c: any) => sum + (c.raised || 0), 0),
          volunteersHours: 0,
          causesSupported: 0,
        };

        const profileData: UserProfile = {
          id: Number(session.user.id) || 1,
          name: session.user.name || "Community Member",
          email: session.user.email || "",
          avatar: session.user.image,
          bio: (session.user as any).bio || "",
          location: "",
          website: "",
          phone: (session.user as any).phone || "",
          joinedDate: (session.user as any).createdAt || new Date().toISOString(),
          stats,
          causes: userCauses,
          contributions: [],
          activities: [],
        };

        setProfile(profileData);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        const fallbackProfile: UserProfile = {
          id: Number(session.user.id) || 1,
          name: session.user.name || "Community Member",
          email: session.user.email || "",
          avatar: session.user.image,
          bio: "",
          location: "",
          website: "",
          phone: "",
          joinedDate: new Date().toISOString(),
          stats: {
            causesCreated: 0,
            totalDonated: 0,
            totalRaised: 0,
            volunteersHours: 0,
            causesSupported: 0,
          },
          causes: [],
          contributions: [],
          activities: [],
        };
        setProfile(fallbackProfile);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [session, status, router]);

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
        setProfile(prev => prev ? { ...prev, ...values } : null);
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
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <Text>Loading your profile...</Text>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!profile) {
    return (
      <MainLayout>
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <Title level={3}>Profile not found</Title>
            <Paragraph>There was an error loading your profile.</Paragraph>
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
      <div className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} sm={6} className="text-center">
              <Avatar
                size={120}
                src={profile.avatar}
                icon={<UserOutlined />}
                className="mb-4"
              />
            </Col>
            <Col xs={24} sm={12}>
              <Title level={2} className="mb-2">{profile.name}</Title>
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <MailOutlined className="mr-2" />
                  <span>{profile.email}</span>
                </div>
                {profile.phone && (
                  <div className="flex items-center text-gray-600">
                    <PhoneOutlined className="mr-2" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                <div className="flex items-center text-gray-600">
                  <CalendarOutlined className="mr-2" />
                  <span>Joined {new Date(profile.joinedDate).toLocaleDateString()}</span>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={6} className="text-right">
              <Button 
                type="primary" 
                icon={<EditOutlined />}
                onClick={() => setEditModalVisible(true)}
                size="large"
                className="mb-2"
              >
                Edit Profile
              </Button>
            </Col>
          </Row>
          {profile.bio && (
            <div className="mt-4 pt-4 border-t">
              <Paragraph>{profile.bio}</Paragraph>
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <Title level={3} className="mb-4">Your Activity</Title>
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={6}>
              <Statistic
                title="Causes Created"
                value={profile.stats.causesCreated}
                prefix={<HeartOutlined />}
              />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic
                title="Total Raised"
                value={profile.stats.totalRaised}
                prefix="$"
              />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic
                title="Volunteer Hours"
                value={profile.stats.volunteersHours}
                prefix={<ClockCircleOutlined />}
              />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic
                title="Causes Supported"
                value={profile.stats.causesSupported}
                prefix={<TeamOutlined />}
              />
            </Col>
          </Row>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              {
                key: "causes",
                label: `My Causes (${profile.causes.length})`,
                children: (
                  <div className="p-6">
                    {profile.causes.length > 0 ? (
                      <Row gutter={[16, 16]}>
                        {profile.causes.map((cause) => (
                          <Col xs={24} md={12} lg={8} key={cause.id}>
                            <Card className="h-full">
                              {cause.image && (
                                <div className="h-48 mb-4">
                                  <Image
                                    src={cause.image}
                                    alt={cause.title}
                                    fill
                                    className="object-cover rounded"
                                  />
                                </div>
                              )}
                              <Title level={5} className="mb-2">
                                {cause.title}
                              </Title>
                              <Paragraph className="text-sm mb-3">
                                {cause.description?.substring(0, 100)}...
                              </Paragraph>
                              <div className="text-sm text-gray-500">
                                Status: <Tag color={getStatusColor(cause.status)}>{cause.status}</Tag>
                              </div>
                              <div className="mt-4">
                                <Link href={`/causes/${cause.id}`}>
                                  <Button type="primary" size="small">
                                    View Details
                                  </Button>
                                </Link>
                              </div>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    ) : (
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
                    )}
                  </div>
                ),
              },
            ]}
          />
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
            <Form.Item
              name="name"
              label="Full Name"
              rules={[{ required: true, message: "Please enter your name" }]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item name="bio" label="Bio">
              <TextArea rows={4} placeholder="Tell us about yourself..." />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[{ type: "email", message: "Please enter a valid email" }]}
                >
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
              <Button onClick={() => setEditModalVisible(false)} disabled={updating}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={updating}>
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
    </MainLayout>
  );
}
