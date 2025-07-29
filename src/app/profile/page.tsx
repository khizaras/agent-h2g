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
      <div style={{ background: "#f5f5f5", minHeight: "100vh" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px" }}>
          {/* Modern Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ paddingTop: "32px", paddingBottom: "24px" }}
          >
            <Card 
              style={{ 
                borderRadius: "12px", 
                boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                border: "1px solid #e8e8e8",
                overflow: "hidden",
                backgroundColor: "#ffffff"
              }}
            >
              {/* Professional Header Background */}
              <div style={{ 
                height: "140px", 
                background: "linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%)",
                position: "relative"
              }}>
                <div style={{ 
                  position: "absolute", 
                  top: "24px", 
                  right: "24px", 
                  zIndex: 2 
                }}>
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => setEditModalVisible(true)}
                    style={{
                      backgroundColor: "rgba(255,255,255,0.15)",
                      borderColor: "rgba(255,255,255,0.25)",
                      backdropFilter: "blur(8px)",
                      border: "1px solid rgba(255,255,255,0.25)",
                      fontWeight: "500"
                    }}
                  >
                    Edit Profile
                  </Button>
                </div>
              </div>

              {/* Professional Profile Info */}
              <div style={{ padding: "0 32px 32px 32px", position: "relative" }}>
                <div style={{ 
                  display: "flex", 
                  alignItems: "flex-end", 
                  gap: "20px",
                  marginTop: "-50px",
                  marginBottom: "20px"
                }}>
                  <div style={{ position: "relative" }}>
                    <Avatar
                      size={100}
                      src={profile.avatar}
                      icon={<UserOutlined />}
                      style={{
                        border: "3px solid white",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.12)"
                      }}
                    />
                    {profile.isVerified && (
                      <div style={{
                        position: "absolute",
                        bottom: "8px",
                        right: "8px",
                        background: "#52c41a",
                        borderRadius: "50%",
                        padding: "4px",
                        border: "2px solid white"
                      }}>
                        <SafetyCertificateOutlined 
                          style={{ color: "white", fontSize: "16px" }} 
                        />
                      </div>
                    )}
                  </div>
                  
                  <div style={{ flex: 1, paddingBottom: "8px" }}>
                    <div style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "8px", 
                      marginBottom: "8px" 
                    }}>
                      <Title 
                        level={2} 
                        style={{ 
                          margin: 0, 
                          fontSize: "24px", 
                          fontWeight: "600",
                          color: "#111827"
                        }}
                      >
                        {profile.name}
                      </Title>
                      {profile.isVerified && (
                        <Tooltip title="Verified User">
                          <SafetyCertificateOutlined
                            style={{ 
                              color: "#52c41a", 
                              fontSize: "20px",
                              marginLeft: "4px"
                            }}
                          />
                        </Tooltip>
                      )}
                    </div>
                    
                    <div style={{ 
                      display: "flex", 
                      flexWrap: "wrap", 
                      gap: "16px",
                      color: "#6b7280",
                      fontSize: "14px"
                    }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <MailOutlined />
                        {profile.email}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <CalendarOutlined />
                        Joined {formatDate(profile.joinedDate)}
                      </span>
                      {profile.location && (
                        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <EnvironmentOutlined />
                          {profile.location}
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "12px", paddingBottom: "8px" }}>
                    <Space>
                      <Button
                        icon={<BellOutlined />}
                        style={{
                          borderColor: "#d1d5db",
                          color: "#6b7280",
                          height: "36px"
                        }}
                      >
                        Notifications
                      </Button>
                      <Button
                        icon={<SettingOutlined />}
                        style={{
                          borderColor: "#d1d5db",
                          color: "#6b7280",
                          height: "36px"
                        }}
                      >
                        Settings
                      </Button>
                    </Space>
                  </div>
                </div>

                {profile.bio && (
                  <div style={{
                    backgroundColor: "#f8fafc",
                    padding: "16px 20px",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    marginTop: "16px"
                  }}>
                    <Text style={{ 
                      color: "#475569", 
                      fontSize: "14px", 
                      lineHeight: "1.5" 
                    }}>
                      {profile.bio}
                    </Text>
                  </div>
                )}
                
                {/* Quick Stats Row */}
                <div style={{
                  display: "flex",
                  gap: "20px",
                  marginTop: "20px",
                  padding: "16px 0",
                  borderTop: "1px solid #f1f5f9"
                }}>
                  <div style={{ textAlign: "center", flex: 1 }}>
                    <Text style={{ fontSize: "18px", fontWeight: "600", color: "#1e293b", display: "block" }}>
                      {profile.stats.causesCreated}
                    </Text>
                    <Text style={{ fontSize: "12px", color: "#64748b" }}>Causes</Text>
                  </div>
                  <div style={{ textAlign: "center", flex: 1 }}>
                    <Text style={{ fontSize: "18px", fontWeight: "600", color: "#1e293b", display: "block" }}>
                      ${profile.stats.totalRaised.toLocaleString()}
                    </Text>
                    <Text style={{ fontSize: "12px", color: "#64748b" }}>Raised</Text>
                  </div>
                  <div style={{ textAlign: "center", flex: 1 }}>
                    <Text style={{ fontSize: "18px", fontWeight: "600", color: "#1e293b", display: "block" }}>
                      {profile.stats.volunteersHours}
                    </Text>
                    <Text style={{ fontSize: "12px", color: "#64748b" }}>Hours</Text>
                  </div>
                  <div style={{ textAlign: "center", flex: 1 }}>
                    <Text style={{ fontSize: "18px", fontWeight: "600", color: "#1e293b", display: "block" }}>
                      {profile.stats.causesSupported}
                    </Text>
                    <Text style={{ fontSize: "12px", color: "#64748b" }}>Supported</Text>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Simplified Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ marginBottom: "24px" }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", marginBottom: "24px" }}>
              {/* Impact Metrics Cards */}
              <Card style={{ borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 1px 8px rgba(0,0,0,0.04)" }}>
                <div style={{ padding: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                    <div style={{ backgroundColor: "#eff6ff", padding: "8px", borderRadius: "8px", marginRight: "12px" }}>
                      <HeartOutlined style={{ color: "#2563eb", fontSize: "20px" }} />
                    </div>
                    <div>
                      <Text style={{ color: "#6b7280", fontSize: "13px", display: "block" }}>Causes Created</Text>
                      <Text style={{ color: "#111827", fontSize: "24px", fontWeight: "600" }}>
                        {profile.stats.causesCreated}
                      </Text>
                    </div>
                  </div>
                  <div style={{ fontSize: "12px", color: "#6b7280" }}>
                    +{profile.stats.causesCreated > 0 ? Math.round((profile.stats.causesCreated / 5) * 100) : 0}% engagement rate
                  </div>
                </div>
              </Card>
              
              <Card style={{ borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 1px 8px rgba(0,0,0,0.04)" }}>
                <div style={{ padding: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                    <div style={{ backgroundColor: "#f0fdf4", padding: "8px", borderRadius: "8px", marginRight: "12px" }}>
                      <DollarOutlined style={{ color: "#16a34a", fontSize: "20px" }} />
                    </div>
                    <div>
                      <Text style={{ color: "#6b7280", fontSize: "13px", display: "block" }}>Total Raised</Text>
                      <Text style={{ color: "#111827", fontSize: "24px", fontWeight: "600" }}>
                        ${profile.stats.totalRaised.toLocaleString()}
                      </Text>
                    </div>
                  </div>
                  <div style={{ fontSize: "12px", color: "#6b7280" }}>
                    Average ${profile.stats.causesCreated > 0 ? Math.round(profile.stats.totalRaised / profile.stats.causesCreated).toLocaleString() : 0} per cause
                  </div>
                </div>
              </Card>
              
              <Card style={{ borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 1px 8px rgba(0,0,0,0.04)" }}>
                <div style={{ padding: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                    <div style={{ backgroundColor: "#fef3c7", padding: "8px", borderRadius: "8px", marginRight: "12px" }}>
                      <ClockCircleOutlined style={{ color: "#d97706", fontSize: "20px" }} />
                    </div>
                    <div>
                      <Text style={{ color: "#6b7280", fontSize: "13px", display: "block" }}>Volunteer Hours</Text>
                      <Text style={{ color: "#111827", fontSize: "24px", fontWeight: "600" }}>
                        {profile.stats.volunteersHours}
                      </Text>
                    </div>
                  </div>
                  <div style={{ fontSize: "12px", color: "#6b7280" }}>
                    Community impact rating: {profile.stats.volunteersHours > 50 ? "High" : profile.stats.volunteersHours > 20 ? "Medium" : "Growing"}
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Interactive Activity Feed */}
            <Card style={{ borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 1px 8px rgba(0,0,0,0.04)", marginBottom: "16px" }}>
              <div style={{ padding: "20px 24px 16px 24px", borderBottom: "1px solid #f1f5f9" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Title level={4} style={{ margin: 0, fontSize: "16px", fontWeight: "600", color: "#111827" }}>
                    Recent Activity
                  </Title>
                  <Button type="link" size="small" style={{ color: "#2563eb" }}>
                    View All
                  </Button>
                </div>
              </div>
              <div style={{ padding: "16px 24px" }}>
                {activities.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {activities.slice(0, 3).map((activity) => (
                      <div key={activity.id} style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "12px",
                        backgroundColor: "#f8fafc",
                        borderRadius: "6px",
                        border: "1px solid #e2e8f0"
                      }}>
                        <div style={{ marginRight: "12px" }}>
                          {getActivityIcon(activity.type)}
                        </div>
                        <div style={{ flex: 1 }}>
                          <Text style={{ fontSize: "14px", color: "#374151", fontWeight: "500" }}>
                            {activity.description}
                          </Text>
                          <br />
                          <Text style={{ fontSize: "12px", color: "#6b7280" }}>
                            {activity.cause_title} • {formatDate(activity.created_at)}
                          </Text>
                        </div>
                        <Button size="small" type="text" icon={<EyeOutlined />} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "24px", color: "#6b7280" }}>
                    <Text>No recent activity. Start engaging with causes to see updates here.</Text>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Tabbed Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card 
              style={{ 
                borderRadius: "8px", 
                boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
                border: "1px solid #e2e8f0",
                minHeight: "400px"
              }}
            >
              <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                size="default"
                type="line"
                style={{ 
                  ".ant-tabs-nav": { 
                    borderBottom: "1px solid #f0f0f0",
                    marginBottom: "0"
                  }
                }}
                items={[
                  {
                    key: "overview",
                    label: "Overview",
                    children: (
                      <div style={{ padding: "16px 0" }}>
                        <Row gutter={[32, 32]}>
                          <Col xs={24} lg={16}>
                            <div style={{ marginBottom: "32px" }}>
                              <div style={{ 
                                display: "flex", 
                                alignItems: "center", 
                                marginBottom: "20px" 
                              }}>
                                <TrophyOutlined style={{ 
                                  fontSize: "20px", 
                                  color: "#f59e0b", 
                                  marginRight: "8px" 
                                }} />
                                <Title 
                                  level={4} 
                                  style={{ 
                                    margin: 0, 
                                    color: "#1f2937",
                                    fontSize: "18px"
                                  }}
                                >
                                  Recent Achievements
                                </Title>
                              </div>
                              
                              <div style={{ 
                                display: "grid", 
                                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
                                gap: "16px" 
                              }}>
                                {profile.stats.causesCreated > 0 && (
                                  <div style={{
                                    background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
                                    padding: "20px",
                                    borderRadius: "12px",
                                    border: "1px solid #93c5fd"
                                  }}>
                                    <div style={{ 
                                      display: "flex", 
                                      alignItems: "center", 
                                      marginBottom: "8px" 
                                    }}>
                                      <HeartOutlined style={{ 
                                        color: "#2563eb", 
                                        fontSize: "18px", 
                                        marginRight: "8px" 
                                      }} />
                                      <span style={{ 
                                        fontWeight: "600", 
                                        color: "#1e40af",
                                        fontSize: "15px"
                                      }}>
                                        First Cause Created
                                      </span>
                                    </div>
                                    <Text style={{ color: "#475569", fontSize: "14px" }}>
                                      You've started making a difference!
                                    </Text>
                                  </div>
                                )}
                                
                                {profile.stats.completedCauses > 0 && (
                                  <div style={{
                                    background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
                                    padding: "20px",
                                    borderRadius: "12px",
                                    border: "1px solid #86efac"
                                  }}>
                                    <div style={{ 
                                      display: "flex", 
                                      alignItems: "center", 
                                      marginBottom: "8px" 
                                    }}>
                                      <CheckCircleOutlined style={{ 
                                        color: "#16a34a", 
                                        fontSize: "18px", 
                                        marginRight: "8px" 
                                      }} />
                                      <span style={{ 
                                        fontWeight: "600", 
                                        color: "#15803d",
                                        fontSize: "15px"
                                      }}>
                                        Mission Accomplished
                                      </span>
                                    </div>
                                    <Text style={{ color: "#475569", fontSize: "14px" }}>
                                      Successfully completed {profile.stats.completedCauses} cause
                                      {profile.stats.completedCauses > 1 ? "s" : ""}!
                                    </Text>
                                  </div>
                                )}
                                
                                {profile.stats.totalViews > 100 && (
                                  <div style={{
                                    background: "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)",
                                    padding: "20px",
                                    borderRadius: "12px",
                                    border: "1px solid #c4b5fd"
                                  }}>
                                    <div style={{ 
                                      display: "flex", 
                                      alignItems: "center", 
                                      marginBottom: "8px" 
                                    }}>
                                      <EyeOutlined style={{ 
                                        color: "#7c3aed", 
                                        fontSize: "18px", 
                                        marginRight: "8px" 
                                      }} />
                                      <span style={{ 
                                        fontWeight: "600", 
                                        color: "#6d28d9",
                                        fontSize: "15px"
                                      }}>
                                        Community Attention
                                      </span>
                                    </div>
                                    <Text style={{ color: "#475569", fontSize: "14px" }}>
                                      Your causes have gained {profile.stats.totalViews} views!
                                    </Text>
                                  </div>
                                )}
                              </div>
                            </div>
                          </Col>
                          
                          <Col xs={24} lg={8}>
                            <div style={{
                              background: "#f8fafc",
                              padding: "24px",
                              borderRadius: "12px",
                              border: "1px solid #e2e8f0"
                            }}>
                              <Title 
                                level={5} 
                                style={{ 
                                  margin: "0 0 16px 0", 
                                  color: "#1f2937",
                                  fontSize: "16px"
                                }}
                              >
                                Quick Actions
                              </Title>
                              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                <Link href="/causes/create">
                                  <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    size="large"
                                    block
                                    style={{
                                      height: "48px",
                                      borderRadius: "8px",
                                      fontSize: "15px",
                                      fontWeight: "500"
                                    }}
                                  >
                                    Create New Cause
                                  </Button>
                                </Link>
                                <Button 
                                  icon={<SettingOutlined />} 
                                  size="large" 
                                  block
                                  style={{
                                    height: "48px",
                                    borderRadius: "8px",
                                    fontSize: "15px"
                                  }}
                                >
                                  Account Settings
                                </Button>
                                <Button 
                                  icon={<BellOutlined />} 
                                  size="large" 
                                  block
                                  style={{
                                    height: "48px",
                                    borderRadius: "8px",
                                    fontSize: "15px"
                                  }}
                                >
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
                                        <Link
                                          href={`/causes/${cause.id}/edit`}
                                          key="edit"
                                        >
                                          <EditOutlined /> Edit
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
                        <div style={{ padding: "16px 0" }}>
                          {loadingSupportedCauses ? (
                            <div style={{ textAlign: "center", padding: "48px 0" }}>
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
                        <div style={{ padding: "16px 0" }}>
                          {loadingActivities ? (
                            <div style={{ textAlign: "center", padding: "48px 0" }}>
                              <Skeleton active paragraph={{ rows: 4 }} />
                            </div>
                          ) : activities.length > 0 ? (
                            <Timeline>
                              {activities.map((activity) => (
                                <Timeline.Item
                                  key={activity.id}
                                  dot={getActivityIcon(activity.type)}
                                >
                                  <div style={{ marginLeft: "16px" }}>
                                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                                      <div style={{ flex: 1 }}>
                                        <Title level={5} style={{ marginBottom: "4px" }}>
                                          {activity.description}
                                        </Title>
                                        <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                                          <Link
                                            href={`/causes/${activity.cause_id}`}
                                            style={{ color: "#2563eb" }}
                                          >
                                            {activity.cause_title}
                                          </Link>
                                          <Tag
                                            color={activity.category_color}
                                            style={{ marginLeft: "8px" }}
                                          >
                                            {activity.category_name}
                                          </Tag>
                                        </div>
                                        <Text
                                          type="secondary"
                                          style={{ fontSize: "14px" }}
                                        >
                                          {formatDate(activity.created_at)}
                                        </Text>
                                      </div>
                                      {activity.cause_image && (
                                        <img
                                          src={activity.cause_image}
                                          alt={activity.cause_title}
                                          style={{ 
                                            width: "64px", 
                                            height: "64px", 
                                            objectFit: "cover", 
                                            borderRadius: "4px", 
                                            marginLeft: "16px" 
                                          }}
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
              <EditOutlined style={{ marginRight: "8px" }} />
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
            style={{ marginTop: "16px" }}
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

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", paddingTop: "8px" }}>
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
    </MainLayout>
  );
}
