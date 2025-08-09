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
import {
  FiUser,
  FiEdit3,
  FiSettings,
  FiHeart,
  FiTrendingUp,
  FiCalendar,
  FiMapPin,
  FiMail,
  FiPhone,
  FiGlobe,
  FiDollarSign,
  FiUsers,
  FiClock,
  FiPlus,
  FiStar,
  FiEye,
  FiMessageCircle,
  FiShare2,
  FiBell,
  FiShield,
  FiGift,
  FiTarget,
  FiAward,
  FiTrendingDown,
  FiInfo,
  FiCheckCircle
} from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { motion } from "framer-motion";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// Premium animation variants
const premiumAnimations = {
  containerVariants: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },
  itemVariants: {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95 
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.23, 1, 0.32, 1],
      },
    },
  },
  cardHover: {
    y: -4,
    scale: 1.02,
    boxShadow: "0 15px 35px rgba(102, 126, 234, 0.1)",
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

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
        return <FiGift style={{ color: "#52c41a" }} />;
      case "comment":
        return <FiMessageCircle style={{ color: "#1890ff" }} />;
      case "like":
        return <FiHeart style={{ color: "#eb2f96" }} />;
      case "share":
        return <FiShare2 style={{ color: "#722ed1" }} />;
      case "volunteer":
        return <FiUsers style={{ color: "#fa8c16" }} />;
      default:
        return <FiStar style={{ color: "#faad14" }} />;
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div
          style={{
            minHeight: "100vh",
            background: "#f8fafc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Card
            style={{
              background: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(20px)",
              borderRadius: "20px",
              padding: "40px",
              textAlign: "center",
              border: "none",
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            }}
          >
            <Skeleton active paragraph={{ rows: 4 }} />
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (!profile) {
    return (
      <MainLayout>
        <div
          style={{
            minHeight: "100vh",
            background: "#f8fafc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Card
            style={{
              background: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(20px)",
              borderRadius: "20px",
              padding: "40px",
              textAlign: "center",
              border: "none",
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            }}
          >
            <Alert
              message="Profile Not Found"
              description="There was an error loading your profile. Please try again."
              type="error"
              showIcon
              style={{ marginBottom: "24px" }}
            />
            <Space>
              <Button type="primary" onClick={() => window.location.reload()}>
                Retry
              </Button>
              <Button onClick={() => router.push("/")}>Go Home</Button>
            </Space>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div
        style={{
          minHeight: "100vh",
          background: "#f8fafc",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        {/* Premium Header */}
        <div style={{ 
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", 
          borderBottom: "1px solid rgba(255,255,255,0.1)"
        }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px" }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Title 
                level={1} 
                style={{ 
                  color: "white",
                  fontSize: "clamp(28px, 4vw, 42px)",
                  fontWeight: "800",
                  marginBottom: "8px",
                  fontFamily: "Inter, system-ui, sans-serif",
                  textShadow: "0 4px 20px rgba(0,0,0,0.6), 0 2px 10px rgba(0,0,0,0.8)"
                }}
              >
                My Profile
              </Title>
              <Text style={{ 
                color: "white", 
                fontSize: "18px",
                fontFamily: "Inter, system-ui, sans-serif",
                textShadow: "0 2px 10px rgba(0,0,0,0.8), 0 1px 5px rgba(0,0,0,0.6)"
              }}>
                Manage your community impact and contributions
              </Text>
            </motion.div>
          </div>
        </div>

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }}>
          <motion.div
            variants={premiumAnimations.containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Premium Profile Header Card */}
            <motion.div variants={premiumAnimations.itemVariants}>
              <Card
                style={{
                  background: `linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)`,
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "24px",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                  marginBottom: "32px",
                  overflow: "hidden"
                }}
              >
                {/* Premium Header Background */}
                <div style={{
                  height: "160px",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  position: "relative",
                  margin: "-24px -24px 0 -24px"
                }}>
                  <div style={{
                    position: "absolute",
                    top: "24px",
                    right: "24px",
                    zIndex: 2
                  }}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        type="primary"
                        icon={<FiEdit3 />}
                        onClick={() => setEditModalVisible(true)}
                        style={{
                          background: "rgba(255,255,255,0.2)",
                          border: "1px solid rgba(255,255,255,0.3)",
                          backdropFilter: "blur(10px)",
                          color: "white",
                          fontWeight: "600",
                          height: "40px",
                          borderRadius: "12px",
                          fontFamily: "Inter, system-ui, sans-serif"
                        }}
                      >
                        Edit Profile
                      </Button>
                    </motion.div>
                  </div>
                  
                  {/* Floating decoration elements */}
                  <div style={{
                    position: "absolute",
                    top: "20%",
                    left: "10%",
                    width: "60px",
                    height: "60px",
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: "50%",
                    backdropFilter: "blur(10px)"
                  }} />
                  <div style={{
                    position: "absolute",
                    bottom: "20%",
                    right: "15%",
                    width: "40px",
                    height: "40px",
                    background: "rgba(255,255,255,0.08)",
                    borderRadius: "50%",
                    backdropFilter: "blur(10px)"
                  }} />
                </div>

                <div style={{ padding: "0 32px 32px 32px" }}>
                  {/* Profile Info with Avatar */}
                  <div style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: "24px",
                    marginTop: "-60px",
                    marginBottom: "24px"
                  }}>
                    <div style={{ position: "relative" }}>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                      >
                        <Avatar
                          size={120}
                          src={profile.avatar}
                          icon={<FiUser />}
                          style={{
                            border: "4px solid white",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                          }}
                        />
                        {profile.isVerified && (
                          <div style={{
                            position: "absolute",
                            bottom: "8px",
                            right: "8px",
                            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                            borderRadius: "50%",
                            padding: "6px",
                            border: "3px solid white",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                          }}>
                            <FiShield style={{ color: "white", fontSize: "16px" }} />
                          </div>
                        )}
                      </motion.div>
                    </div>
                    
                    <div style={{ flex: 1, paddingBottom: "12px" }}>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "12px"
                      }}>
                        <Title 
                          level={2} 
                          style={{
                            margin: 0,
                            fontSize: "28px",
                            fontWeight: "700",
                            color: "#1e293b",
                            fontFamily: "Inter, system-ui, sans-serif"
                          }}
                        >
                          {profile.name}
                        </Title>
                        {profile.isVerified && (
                          <Tooltip title="Verified Community Member">
                            <div style={{
                              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                              borderRadius: "8px",
                              padding: "4px 8px",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px"
                            }}>
                              <FiShield style={{ color: "white", fontSize: "14px" }} />
                              <Text style={{ color: "white", fontSize: "12px", fontWeight: "600" }}>
                                Verified
                              </Text>
                            </div>
                          </Tooltip>
                        )}
                      </div>
                      
                      <div style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "20px",
                        color: "#64748b",
                        fontSize: "15px",
                        marginBottom: "16px"
                      }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <FiMail style={{ fontSize: "16px" }} />
                          {profile.email}
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <FiCalendar style={{ fontSize: "16px" }} />
                          Joined {formatDate(profile.joinedDate)}
                        </span>
                        {profile.location && (
                          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <FiMapPin style={{ fontSize: "16px" }} />
                            {profile.location}
                          </span>
                        )}
                      </div>

                      {profile.bio && (
                        <div style={{
                          background: "rgba(102, 126, 234, 0.05)",
                          border: "1px solid rgba(102, 126, 234, 0.1)",
                          borderRadius: "12px",
                          padding: "16px 20px",
                          marginTop: "12px"
                        }}>
                          <Text style={{
                            color: "#475569",
                            fontSize: "15px",
                            lineHeight: "1.6",
                            fontFamily: "Inter, system-ui, sans-serif"
                          }}>
                            {profile.bio}
                          </Text>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Premium Stats Grid */}
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "20px",
                    marginTop: "24px",
                    padding: "24px 0",
                    borderTop: "1px solid rgba(0,0,0,0.08)"
                  }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{
                        background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
                        borderRadius: "12px",
                        padding: "16px",
                        marginBottom: "8px",
                        border: "1px solid #bfdbfe"
                      }}>
                        <FiHeart style={{ fontSize: "24px", color: "#2563eb", marginBottom: "8px" }} />
                        <Text style={{ 
                          fontSize: "24px", 
                          fontWeight: "700", 
                          color: "#1e293b", 
                          display: "block",
                          fontFamily: "Inter, system-ui, sans-serif"
                        }}>
                          {profile.stats.causesCreated}
                        </Text>
                      </div>
                      <Text style={{ fontSize: "14px", color: "#64748b", fontWeight: "500" }}>
                        Causes Created
                      </Text>
                    </div>
                    
                    <div style={{ textAlign: "center" }}>
                      <div style={{
                        background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
                        borderRadius: "12px",
                        padding: "16px",
                        marginBottom: "8px",
                        border: "1px solid #86efac"
                      }}>
                        <FiDollarSign style={{ fontSize: "24px", color: "#16a34a", marginBottom: "8px" }} />
                        <Text style={{ 
                          fontSize: "24px", 
                          fontWeight: "700", 
                          color: "#1e293b", 
                          display: "block",
                          fontFamily: "Inter, system-ui, sans-serif"
                        }}>
                          ${profile.stats.totalRaised.toLocaleString()}
                        </Text>
                      </div>
                      <Text style={{ fontSize: "14px", color: "#64748b", fontWeight: "500" }}>
                        Total Raised
                      </Text>
                    </div>
                    
                    <div style={{ textAlign: "center" }}>
                      <div style={{
                        background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                        borderRadius: "12px",
                        padding: "16px",
                        marginBottom: "8px",
                        border: "1px solid #fbbf24"
                      }}>
                        <FiClock style={{ fontSize: "24px", color: "#d97706", marginBottom: "8px" }} />
                        <Text style={{ 
                          fontSize: "24px", 
                          fontWeight: "700", 
                          color: "#1e293b", 
                          display: "block",
                          fontFamily: "Inter, system-ui, sans-serif"
                        }}>
                          {profile.stats.volunteersHours}
                        </Text>
                      </div>
                      <Text style={{ fontSize: "14px", color: "#64748b", fontWeight: "500" }}>
                        Volunteer Hours
                      </Text>
                    </div>
                    
                    <div style={{ textAlign: "center" }}>
                      <div style={{
                        background: "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)",
                        borderRadius: "12px",
                        padding: "16px",
                        marginBottom: "8px",
                        border: "1px solid #c4b5fd"
                      }}>
                        <FiUsers style={{ fontSize: "24px", color: "#7c3aed", marginBottom: "8px" }} />
                        <Text style={{ 
                          fontSize: "24px", 
                          fontWeight: "700", 
                          color: "#1e293b", 
                          display: "block",
                          fontFamily: "Inter, system-ui, sans-serif"
                        }}>
                          {profile.stats.causesSupported}
                        </Text>
                      </div>
                      <Text style={{ fontSize: "14px", color: "#64748b", fontWeight: "500" }}>
                        Causes Supported
                      </Text>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Premium Tabbed Content */}
            <motion.div variants={premiumAnimations.itemVariants}>
              <Card
                style={{
                  background: `linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)`,
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "20px",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                  minHeight: "500px"
                }}
              >
                <Tabs
                  activeKey={activeTab}
                  onChange={setActiveTab}
                  size="large"
                  type="line"
                  style={{
                    fontFamily: "Inter, system-ui, sans-serif"
                  }}
                  items={[
                    {
                      key: "overview",
                      label: (
                        <span style={{ fontFamily: "Inter, system-ui, sans-serif", fontWeight: "500" }}>
                          <FiInfo style={{ marginRight: "8px" }} />
                          Overview
                        </span>
                      ),
                      children: (
                        <div style={{ padding: "24px 0" }}>
                          <Row gutter={[32, 32]}>
                            <Col xs={24} lg={16}>
                              <div style={{ marginBottom: "40px" }}>
                                <Title level={3} style={{
                                  marginBottom: "24px",
                                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                  WebkitBackgroundClip: "text",
                                  WebkitTextFillColor: "transparent",
                                  fontFamily: "Inter, system-ui, sans-serif",
                                  fontWeight: "700",
                                  display: "flex",
                                  alignItems: "center"
                                }}>
                                  <FiAward style={{ marginRight: "12px", color: "#667eea" }} />
                                  Recent Achievements
                                </Title>
                                
                                <div style={{
                                  display: "grid",
                                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                                  gap: "20px"
                                }}>
                                  {profile.stats.causesCreated > 0 && (
                                    <motion.div
                                      whileHover={premiumAnimations.cardHover}
                                      style={{
                                        background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
                                        padding: "24px",
                                        borderRadius: "16px",
                                        border: "1px solid #93c5fd"
                                      }}
                                    >
                                      <div style={{
                                        display: "flex",
                                        alignItems: "center",
                                        marginBottom: "12px"
                                      }}>
                                        <FiHeart style={{
                                          color: "#2563eb",
                                          fontSize: "20px",
                                          marginRight: "12px"
                                        }} />
                                        <Text style={{
                                          fontWeight: "600",
                                          color: "#1e40af",
                                          fontSize: "16px",
                                          fontFamily: "Inter, system-ui, sans-serif"
                                        }}>
                                          First Cause Created
                                        </Text>
                                      </div>
                                      <Text style={{ color: "#475569", fontSize: "14px" }}>
                                        You've started making a difference in your community!
                                      </Text>
                                    </motion.div>
                                  )}
                                  
                                  {profile.stats.completedCauses > 0 && (
                                    <motion.div
                                      whileHover={premiumAnimations.cardHover}
                                      style={{
                                        background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
                                        padding: "24px",
                                        borderRadius: "16px",
                                        border: "1px solid #86efac"
                                      }}
                                    >
                                      <div style={{
                                        display: "flex",
                                        alignItems: "center",
                                        marginBottom: "12px"
                                      }}>
                                        <FiCheckCircle style={{
                                          color: "#16a34a",
                                          fontSize: "20px",
                                          marginRight: "12px"
                                        }} />
                                        <Text style={{
                                          fontWeight: "600",
                                          color: "#15803d",
                                          fontSize: "16px",
                                          fontFamily: "Inter, system-ui, sans-serif"
                                        }}>
                                          Mission Accomplished
                                        </Text>
                                      </div>
                                      <Text style={{ color: "#475569", fontSize: "14px" }}>
                                        Successfully completed {profile.stats.completedCauses} cause
                                        {profile.stats.completedCauses > 1 ? "s" : ""}!
                                      </Text>
                                    </motion.div>
                                  )}
                                  
                                  {profile.stats.totalViews > 100 && (
                                    <motion.div
                                      whileHover={premiumAnimations.cardHover}
                                      style={{
                                        background: "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)",
                                        padding: "24px",
                                        borderRadius: "16px",
                                        border: "1px solid #c4b5fd"
                                      }}
                                    >
                                      <div style={{
                                        display: "flex",
                                        alignItems: "center",
                                        marginBottom: "12px"
                                      }}>
                                        <FiEye style={{
                                          color: "#7c3aed",
                                          fontSize: "20px",
                                          marginRight: "12px"
                                        }} />
                                        <Text style={{
                                          fontWeight: "600",
                                          color: "#6d28d9",
                                          fontSize: "16px",
                                          fontFamily: "Inter, system-ui, sans-serif"
                                        }}>
                                          Community Recognition
                                        </Text>
                                      </div>
                                      <Text style={{ color: "#475569", fontSize: "14px" }}>
                                        Your causes have gained {profile.stats.totalViews} views!
                                      </Text>
                                    </motion.div>
                                  )}
                                </div>
                              </div>
                            </Col>
                            
                            <Col xs={24} lg={8}>
                              <div style={{
                                background: "linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)",
                                border: "1px solid rgba(102, 126, 234, 0.1)",
                                borderRadius: "16px",
                                padding: "32px",
                              }}>
                                <Title level={4} style={{
                                  margin: "0 0 24px 0",
                                  color: "#1f2937",
                                  fontSize: "18px",
                                  fontFamily: "Inter, system-ui, sans-serif",
                                  fontWeight: "600"
                                }}>
                                  Quick Actions
                                </Title>
                                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Link href="/causes/create">
                                      <Button
                                        type="primary"
                                        icon={<FiPlus />}
                                        size="large"
                                        block
                                        style={{
                                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                          border: "none",
                                          height: "56px",
                                          borderRadius: "12px",
                                          fontSize: "16px",
                                          fontWeight: "600",
                                          fontFamily: "Inter, system-ui, sans-serif",
                                          boxShadow: "0 8px 20px rgba(102,126,234,0.3)",
                                        }}
                                      >
                                        Create New Cause
                                      </Button>
                                    </Link>
                                  </motion.div>
                                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button
                                      icon={<FiSettings />}
                                      size="large"
                                      block
                                      style={{
                                        height: "48px",
                                        borderRadius: "10px",
                                        fontSize: "15px",
                                        fontWeight: "500",
                                        borderColor: "#d1d5db",
                                        color: "#6b7280",
                                        fontFamily: "Inter, system-ui, sans-serif"
                                      }}
                                    >
                                      Account Settings
                                    </Button>
                                  </motion.div>
                                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button
                                      icon={<FiBell />}
                                      size="large"
                                      block
                                      style={{
                                        height: "48px",
                                        borderRadius: "10px",
                                        fontSize: "15px",
                                        fontWeight: "500",
                                        borderColor: "#d1d5db",
                                        color: "#6b7280",
                                        fontFamily: "Inter, system-ui, sans-serif"
                                      }}
                                    >
                                      Notification Preferences
                                    </Button>
                                  </motion.div>
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </div>
                      ),
                    },
                    {
                      key: "causes",
                      label: (
                        <span style={{ fontFamily: "Inter, system-ui, sans-serif", fontWeight: "500" }}>
                          <FiHeart style={{ marginRight: "8px" }} />
                          My Causes ({profile.causes.length})
                        </span>
                      ),
                      children: (
                        <div style={{ padding: "24px 0" }}>
                          {profile.causes.length > 0 ? (
                            <Row gutter={[24, 24]}>
                              {profile.causes.map((cause) => (
                                <Col xs={24} md={12} lg={8} key={cause.id}>
                                  <motion.div
                                    whileHover={premiumAnimations.cardHover}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <Card
                                      style={{
                                        height: "100%",
                                        borderRadius: "16px",
                                        border: "1px solid rgba(102, 126, 234, 0.1)",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                                        transition: "all 0.3s ease"
                                      }}
                                      cover={
                                        cause.image ? (
                                          <div style={{ height: "192px", overflow: "hidden", borderRadius: "16px 16px 0 0" }}>
                                            <img
                                              src={cause.image}
                                              alt={cause.title}
                                              style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                                transition: "transform 0.3s ease"
                                              }}
                                            />
                                          </div>
                                        ) : (
                                          <div style={{
                                            height: "192px",
                                            background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            borderRadius: "16px 16px 0 0"
                                          }}>
                                            <FiHeart style={{ color: "#94a3b8", fontSize: "48px" }} />
                                          </div>
                                        )
                                      }
                                      actions={[
                                        <Link href={`/causes/${cause.id}`} key="view">
                                          <span style={{ color: "#667eea", fontWeight: "500" }}>
                                            <FiEye style={{ marginRight: "4px" }} /> View
                                          </span>
                                        </Link>,
                                        <Link href={`/causes/${cause.id}/edit`} key="edit">
                                          <span style={{ color: "#667eea", fontWeight: "500" }}>
                                            <FiEdit3 style={{ marginRight: "4px" }} /> Edit
                                          </span>
                                        </Link>,
                                        <span key="likes" style={{ color: "#64748b" }}>
                                          <FiHeart style={{ marginRight: "4px" }} />
                                          {cause.like_count || 0}
                                        </span>,
                                        <span key="views" style={{ color: "#64748b" }}>
                                          <FiEye style={{ marginRight: "4px" }} />
                                          {cause.view_count || 0}
                                        </span>,
                                      ]}
                                    >
                                      <div style={{ marginBottom: "16px" }}>
                                        <Space>
                                          <Tag color={getStatusColor(cause.status)}>
                                            {cause.status?.toUpperCase()}
                                          </Tag>
                                          <Tag
                                            style={{
                                              backgroundColor: getPriorityColor(cause.priority),
                                              color: "white",
                                              border: "none",
                                            }}
                                          >
                                            {cause.priority?.toUpperCase()}
                                          </Tag>
                                        </Space>
                                      </div>
                                      <Title level={5} style={{ 
                                        marginBottom: "12px", 
                                        fontFamily: "Inter, system-ui, sans-serif",
                                        color: "#1e293b"
                                      }}>
                                        {cause.title}
                                      </Title>
                                      <Paragraph
                                        style={{ 
                                          fontSize: "14px", 
                                          color: "#64748b", 
                                          marginBottom: "16px",
                                          fontFamily: "Inter, system-ui, sans-serif"
                                        }}
                                        ellipsis={{ rows: 2 }}
                                      >
                                        {cause.description || cause.short_description}
                                      </Paragraph>
                                      <div style={{ 
                                        fontSize: "12px", 
                                        color: "#94a3b8",
                                        fontFamily: "Inter, system-ui, sans-serif"
                                      }}>
                                        <Space split={<Divider type="vertical" />}>
                                          <span>
                                            <FiCalendar style={{ marginRight: "4px" }} />
                                            {formatDate(cause.created_at)}
                                          </span>
                                          <span>
                                            <FiMessageCircle style={{ marginRight: "4px" }} />
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
                            <div style={{ textAlign: "center", padding: "80px 40px" }}>
                              <div style={{
                                background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                                borderRadius: "50%",
                                width: "80px",
                                height: "80px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 24px auto"
                              }}>
                                <FiHeart style={{ fontSize: "40px", color: "#94a3b8" }} />
                              </div>
                              <Title level={4} style={{ 
                                marginBottom: "12px", 
                                color: "#64748b",
                                fontFamily: "Inter, system-ui, sans-serif"
                              }}>
                                No causes created yet
                              </Title>
                              <Text style={{ 
                                color: "#94a3b8", 
                                marginBottom: "32px", 
                                display: "block",
                                fontFamily: "Inter, system-ui, sans-serif"
                              }}>
                                Start making a difference in your community
                              </Text>
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link href="/causes/create">
                                  <Button
                                    type="primary"
                                    icon={<FiPlus />}
                                    size="large"
                                    style={{
                                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                      border: "none",
                                      height: "48px",
                                      borderRadius: "12px",
                                      fontSize: "16px",
                                      fontWeight: "600",
                                      fontFamily: "Inter, system-ui, sans-serif",
                                      boxShadow: "0 8px 20px rgba(102,126,234,0.3)",
                                    }}
                                  >
                                    Create Your First Cause
                                  </Button>
                                </Link>
                              </motion.div>
                            </div>
                          )}
                        </div>
                      ),
                    },
                    // Additional tabs would go here...
                  ]}
                />
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Premium Edit Profile Modal */}
      <Modal
        title={
          <span style={{ 
            fontFamily: "Inter, system-ui, sans-serif", 
            fontWeight: "600", 
            fontSize: "18px",
            color: "#1e293b"
          }}>
            <FiEdit3 style={{ marginRight: "8px", color: "#667eea" }} />
            Edit Profile
          </span>
        }
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={700}
        style={{ top: 40 }}
        styles={{
          content: {
            borderRadius: "16px",
            overflow: "hidden"
          }
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditProfile}
          initialValues={profile}
          style={{ marginTop: "24px" }}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="name"
                label={
                  <Text style={{ 
                    fontFamily: "Inter, system-ui, sans-serif", 
                    fontWeight: "600",
                    color: "#374151"
                  }}>
                    Full Name
                  </Text>
                }
                rules={[
                  { required: true, message: "Please enter your name" },
                ]}
              >
                <Input 
                  size="large" 
                  placeholder="Enter your full name"
                  style={{
                    borderRadius: "10px",
                    border: "2px solid #e5e7eb",
                    fontFamily: "Inter, system-ui, sans-serif"
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item 
            name="bio" 
            label={
              <Text style={{ 
                fontFamily: "Inter, system-ui, sans-serif", 
                fontWeight: "600",
                color: "#374151"
              }}>
                Bio
              </Text>
            }
          >
            <TextArea
              rows={4}
              placeholder="Tell us about yourself, your interests, and what drives you to help others..."
              showCount
              maxLength={500}
              style={{
                borderRadius: "10px",
                border: "2px solid #e5e7eb",
                fontFamily: "Inter, system-ui, sans-serif"
              }}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label={
                  <Text style={{ 
                    fontFamily: "Inter, system-ui, sans-serif", 
                    fontWeight: "600",
                    color: "#374151"
                  }}>
                    Email Address
                  </Text>
                }
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input
                  size="large"
                  prefix={<FiMail style={{ color: "#6b7280" }} />}
                  placeholder="your@email.com"
                  style={{
                    borderRadius: "10px",
                    border: "2px solid #e5e7eb",
                    fontFamily: "Inter, system-ui, sans-serif"
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="phone" 
                label={
                  <Text style={{ 
                    fontFamily: "Inter, system-ui, sans-serif", 
                    fontWeight: "600",
                    color: "#374151"
                  }}>
                    Phone Number
                  </Text>
                }
              >
                <Input
                  size="large"
                  prefix={<FiPhone style={{ color: "#6b7280" }} />}
                  placeholder="+1 (555) 123-4567"
                  style={{
                    borderRadius: "10px",
                    border: "2px solid #e5e7eb",
                    fontFamily: "Inter, system-ui, sans-serif"
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="location" 
                label={
                  <Text style={{ 
                    fontFamily: "Inter, system-ui, sans-serif", 
                    fontWeight: "600",
                    color: "#374151"
                  }}>
                    Location
                  </Text>
                }
              >
                <Input
                  size="large"
                  prefix={<FiMapPin style={{ color: "#6b7280" }} />}
                  placeholder="City, State"
                  style={{
                    borderRadius: "10px",
                    border: "2px solid #e5e7eb",
                    fontFamily: "Inter, system-ui, sans-serif"
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="website" 
                label={
                  <Text style={{ 
                    fontFamily: "Inter, system-ui, sans-serif", 
                    fontWeight: "600",
                    color: "#374151"
                  }}>
                    Website
                  </Text>
                }
              >
                <Input
                  size="large"
                  prefix={<FiGlobe style={{ color: "#6b7280" }} />}
                  placeholder="https://yourwebsite.com"
                  style={{
                    borderRadius: "10px",
                    border: "2px solid #e5e7eb",
                    fontFamily: "Inter, system-ui, sans-serif"
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider style={{ margin: "32px 0" }} />

          <div style={{ 
            display: "flex", 
            justifyContent: "flex-end", 
            gap: "12px", 
            paddingTop: "8px" 
          }}>
            <Button
              size="large"
              onClick={() => setEditModalVisible(false)}
              disabled={updating}
              style={{
                borderRadius: "10px",
                height: "48px",
                fontFamily: "Inter, system-ui, sans-serif",
                fontWeight: "500"
              }}
            >
              Cancel
            </Button>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                loading={updating}
                icon={<FiCheckCircle />}
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                  borderRadius: "10px",
                  height: "48px",
                  fontFamily: "Inter, system-ui, sans-serif",
                  fontWeight: "600",
                  boxShadow: "0 4px 12px rgba(102,126,234,0.3)"
                }}
              >
                Save Changes
              </Button>
            </motion.div>
          </div>
        </Form>
      </Modal>

      <style jsx global>{`
        .ant-tabs-nav {
          border-bottom: 1px solid rgba(102, 126, 234, 0.1) !important;
          margin-bottom: 0 !important;
        }
        
        .ant-tabs-tab {
          border-radius: 8px 8px 0 0 !important;
          margin-right: 8px !important;
        }
        
        .ant-tabs-tab-active .ant-tabs-tab-btn {
          color: #667eea !important;
          font-weight: 600 !important;
        }
        
        .ant-tabs-ink-bar {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          height: 3px !important;
        }
        
        .ant-input:focus,
        .ant-input-focused {
          border-color: #667eea !important;
          box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2) !important;
        }
        
        .ant-input-affix-wrapper:focus,
        .ant-input-affix-wrapper-focused {
          border-color: #667eea !important;
          box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2) !important;
        }
        
        .ant-form-item-label > label {
          font-weight: 600 !important;
          color: #374151 !important;
          font-family: 'Inter', system-ui, sans-serif !important;
        }
        
        .ant-modal-header {
          border-bottom: 1px solid rgba(102, 126, 234, 0.1) !important;
          padding: 20px 24px !important;
        }
        
        .ant-modal-body {
          padding: 24px !important;
        }
      `}</style>
    </MainLayout>
  );
}