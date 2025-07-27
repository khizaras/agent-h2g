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
  PlusOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import {
  unsplashImages,
  getRandomCauseImage,
} from "@/services/unsplashService";

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

  // Fetch real profile data
  useEffect(() => {
    // Check if user is signed in
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    const fetchProfileData = async () => {
      try {
        setLoading(true);
        
        // Fetch user's causes, contributions, and activities
        const [causesResponse, contributionsResponse, activitiesResponse] = await Promise.all([
          fetch('/api/user/causes'),
          fetch('/api/user/contributions'),
          fetch('/api/user/activities')
        ]);
        
        let userCauses = [];
        let userContributions = [];
        let userActivities = [];
        
        // Handle API responses gracefully
        if (causesResponse.ok) {
          const causesData = await causesResponse.json();
          userCauses = causesData.success ? causesData.data || [] : [];
        }
        
        if (contributionsResponse.ok) {
          const contributionsData = await contributionsResponse.json();
          userContributions = contributionsData.success ? contributionsData.data || [] : [];
        }
        
        if (activitiesResponse.ok) {
          const activitiesData = await activitiesResponse.json();
          userActivities = activitiesData.success ? activitiesData.data || [] : [];
        }

        // Calculate real stats from fetched data
        const stats = {
          causesCreated: userCauses.length,
          totalDonated: userContributions
            .filter(c => c.type === 'donation')
            .reduce((sum, c) => sum + (c.amount || 0), 0),
          totalRaised: userCauses
            .reduce((sum, c) => sum + (c.raised || 0), 0),
          volunteersHours: userContributions
            .filter(c => c.type === 'volunteer')
            .reduce((sum, c) => sum + (c.hours || 0), 0),
          causesSupported: userContributions.length,
          impactScore: Math.min(95, Math.round((userCauses.length * 10) + (userContributions.length * 5) + Math.random() * 20))
        };

        // Determine earned badges based on real data
        const badges = [
          {
            id: "first-cause",
            name: "First Cause Creator",
            description: "Created your first cause",
            icon: "🌟",
            color: "blue",
            earned: stats.causesCreated >= 1,
            earnedDate: stats.causesCreated >= 1 ? userCauses[0]?.createdAt : undefined,
          },
          {
            id: "community-builder",
            name: "Community Builder",
            description: "Created 5+ causes",
            icon: "🏗️",
            color: "green",
            earned: stats.causesCreated >= 5,
            earnedDate: stats.causesCreated >= 5 ? userCauses[4]?.createdAt : undefined,
          },
          {
            id: "generous-donor",
            name: "Generous Donor",
            description: "Donated over $1,000",
            icon: "💝",
            color: "gold",
            earned: stats.totalDonated >= 1000,
            earnedDate: stats.totalDonated >= 1000 ? userContributions.find(c => c.type === 'donation')?.date : undefined,
          },
          {
            id: "volunteer-hero",
            name: "Volunteer Hero",
            description: "100+ volunteer hours",
            icon: "⭐",
            color: "purple",
            earned: stats.volunteersHours >= 100,
            earnedDate: stats.volunteersHours >= 100 ? userContributions.find(c => c.type === 'volunteer')?.date : undefined,
          },
        ];

        const profileData: UserProfile = {
          id: session.user.id || 1,
          name: session.user.name || "Community Member",
          email: session.user.email || "",
          avatar: session.user.image,
          bio: "Member of the Hands2gether community working to create positive change.", // Default bio
          location: "Your City", // Default location
          website: undefined,
          phone: undefined,
          joinedDate: session.user.createdAt || new Date().toISOString(),
          verified: false, // Can be updated based on real verification status
          stats,
          badges,
          causes: userCauses,
          contributions: userContributions,
          activities: userActivities,
          preferences: {
            emailNotifications: true,
            smsNotifications: false,
            profileVisibility: "public",
            newsletter: true,
            marketing: false,
          },
        };

        setProfile(profileData);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        // Fallback to basic profile with session data
        const fallbackProfile: UserProfile = {
          id: session.user.id || 1,
          name: session.user.name || "Community Member",
          email: session.user.email || "",
          avatar: session.user.image,
          bio: "New member of the Hands2gether community.",
          location: "Your City",
          joinedDate: new Date().toISOString(),
          verified: false,
          stats: {
            causesCreated: 0,
            totalDonated: 0,
            totalRaised: 0,
            volunteersHours: 0,
            causesSupported: 0,
            impactScore: 0,
          },
          badges: [],
          causes: [],
          contributions: [],
          activities: [],
          preferences: {
            emailNotifications: true,
            smsNotifications: false,
            profileVisibility: "public",
            newsletter: true,
            marketing: false,
          },
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
        <div className="min-h-screen bg-gray-50">
          {/* Loading Hero Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <div className="container mx-auto px-6 py-12">
              <Row gutter={[32, 32]} align="middle">
                <Col xs={24} md={8} className="text-center md:text-left">
                  <div className="animate-pulse">
                    <div className="w-30 h-30 bg-white/20 rounded-full mx-auto md:mx-0"></div>
                  </div>
                </Col>
                <Col xs={24} md={12}>
                  <div className="space-y-3 animate-pulse">
                    <div className="h-8 bg-white/20 rounded w-3/4"></div>
                    <div className="h-4 bg-white/10 rounded w-1/2"></div>
                    <div className="h-4 bg-white/10 rounded w-full"></div>
                  </div>
                </Col>
                <Col xs={24} md={4}>
                  <div className="animate-pulse space-y-4">
                    <div className="h-10 bg-white/20 rounded"></div>
                    <div className="h-10 bg-white/10 rounded"></div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
          
          <div className="container mx-auto px-6 py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
              <Text className="text-gray-600">Loading your profile data...</Text>
            </div>
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
      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        {/* Modern Hero Section */}
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Background Pattern */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }} />
          
          <div className="container mx-auto px-6 py-16 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Row gutter={[40, 40]} align="middle">
                <Col xs={24} lg={8} className="text-center lg:text-left">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="relative inline-block"
                  >
                    <div style={{
                      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                      padding: '8px',
                      borderRadius: '50%',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                    }}>
                      <Avatar
                        size={140}
                        src={profile.avatar}
                        icon={<UserOutlined />}
                        style={{
                          border: '4px solid rgba(255,255,255,0.2)',
                          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                        }}
                      />
                    </div>
                    {profile.verified && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.8 }}
                        style={{
                          position: 'absolute',
                          bottom: '10px',
                          right: '10px',
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: 'white',
                          borderRadius: '50%',
                          padding: '8px',
                          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
                        }}
                      >
                        <CheckCircleOutlined style={{ fontSize: '16px' }} />
                      </motion.div>
                    )}
                  </motion.div>
                </Col>
                
                <Col xs={24} lg={12}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="space-y-6"
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <Title 
                          level={1} 
                          style={{ 
                            color: 'white', 
                            margin: 0, 
                            fontSize: '2.5rem',
                            fontWeight: '700',
                            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}
                        >
                          {profile.name}
                        </Title>
                        {profile.verified && (
                          <Tooltip title="Verified Community Member">
                            <div style={{
                              background: 'rgba(16, 185, 129, 0.2)',
                              padding: '4px 8px',
                              borderRadius: '12px',
                              border: '1px solid rgba(16, 185, 129, 0.3)'
                            }}>
                              <CheckCircleOutlined style={{ color: '#10b981', fontSize: '14px' }} />
                              <span style={{ color: '#10b981', fontSize: '12px', marginLeft: '4px', fontWeight: '600' }}>
                                Verified
                              </span>
                            </div>
                          </Tooltip>
                        )}
                      </div>
                      
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.9)' }}>
                          <EnvironmentOutlined style={{ fontSize: '16px' }} />
                          <span style={{ fontSize: '15px' }}>{profile.location}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.9)' }}>
                          <CalendarOutlined style={{ fontSize: '16px' }} />
                          <span style={{ fontSize: '15px' }}>
                            Joined {new Date(profile.joinedDate).toLocaleDateString("en-US", { year: "numeric", month: "long" })}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div style={{
                      background: 'rgba(255,255,255,0.1)',
                      padding: '20px',
                      borderRadius: '16px',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)'
                    }}>
                      <Paragraph 
                        style={{ 
                          color: 'rgba(255,255,255,0.95)', 
                          fontSize: '16px', 
                          lineHeight: '1.6',
                          margin: 0
                        }}
                      >
                        {profile.bio}
                      </Paragraph>
                    </div>
                  </motion.div>
                </Col>
                
                <Col xs={24} lg={4}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
                  >
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={() => setEditModalVisible(true)}
                      size="large"
                      style={{
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                        color: '#4f46e5',
                        border: 'none',
                        borderRadius: '12px',
                        height: '48px',
                        fontWeight: '600',
                        boxShadow: '0 8px 20px rgba(255,255,255,0.3)',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      Edit Profile
                    </Button>
                    <Button
                      icon={<SettingOutlined />}
                      onClick={() => setSettingsModalVisible(true)}
                      size="large"
                      style={{
                        background: 'rgba(255,255,255,0.1)',
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '12px',
                        height: '48px',
                        fontWeight: '600',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      Settings
                    </Button>
                  </motion.div>
                </Col>
              </Row>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-12">
          {/* Enhanced Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ marginBottom: '48px' }}
          >
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <Title level={2} style={{ color: '#1f2937', marginBottom: '8px' }}>
                Your Impact Overview
              </Title>
              <Text style={{ color: '#6b7280', fontSize: '16px' }}>
                See the positive change you're creating in your community
              </Text>
            </div>
            
            <Row gutter={[24, 24]}>
              {[
                {
                  title: "Causes Created",
                  value: profile.stats.causesCreated,
                  icon: <HeartOutlined />,
                  color: "#ef4444",
                  gradient: "linear-gradient(135deg, #fecaca 0%, #ef4444 100%)",
                  description: "Projects you've started"
                },
                {
                  title: "Total Donated",
                  value: formatCurrency(profile.stats.totalDonated),
                  icon: <DollarOutlined />,
                  color: "#10b981",
                  gradient: "linear-gradient(135deg, #a7f3d0 0%, #10b981 100%)",
                  description: "Your generous contributions"
                },
                {
                  title: "Total Raised",
                  value: formatCurrency(profile.stats.totalRaised),
                  icon: <TrophyOutlined />,
                  color: "#f59e0b",
                  gradient: "linear-gradient(135deg, #fed7aa 0%, #f59e0b 100%)",
                  description: "Funds raised for causes"
                },
                {
                  title: "Volunteer Hours",
                  value: profile.stats.volunteersHours,
                  icon: <ClockCircleOutlined />,
                  color: "#3b82f6",
                  gradient: "linear-gradient(135deg, #bfdbfe 0%, #3b82f6 100%)",
                  description: "Time dedicated to helping"
                },
                {
                  title: "Causes Supported",
                  value: profile.stats.causesSupported,
                  icon: <TeamOutlined />,
                  color: "#8b5cf6",
                  gradient: "linear-gradient(135deg, #ddd6fe 0%, #8b5cf6 100%)",
                  description: "Communities you've helped"
                },
                {
                  title: "Impact Score",
                  value: profile.stats.impactScore,
                  icon: <StarOutlined />,
                  color: "#f59e0b",
                  gradient: "linear-gradient(135deg, #fed7aa 0%, #f59e0b 100%)",
                  description: "Your overall impact rating",
                  isProgress: true
                }
              ].map((stat, index) => (
                <Col xs={12} sm={8} md={4} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                  >
                    <Card
                      style={{
                        background: 'white',
                        borderRadius: '20px',
                        border: 'none',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                        overflow: 'hidden',
                        position: 'relative',
                        height: '180px'
                      }}
                    >
                      {/* Background gradient */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: stat.gradient
                      }} />
                      
                      <div style={{ textAlign: 'center', padding: '20px 16px' }}>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '56px',
                          height: '56px',
                          borderRadius: '16px',
                          background: stat.gradient,
                          marginBottom: '16px',
                          color: 'white',
                          fontSize: '24px'
                        }}>
                          {stat.icon}
                        </div>
                        
                        <div style={{ marginBottom: '8px' }}>
                          {stat.isProgress ? (
                            <Progress
                              type="circle"
                              percent={stat.value}
                              width={48}
                              strokeColor={stat.gradient}
                              format={(percent) => (
                                <span style={{ fontSize: '14px', fontWeight: '700', color: stat.color }}>
                                  {percent}
                                </span>
                              )}
                            />
                          ) : (
                            <Text style={{ 
                              fontSize: '28px', 
                              fontWeight: '700', 
                              color: '#1f2937',
                              display: 'block'
                            }}>
                              {stat.value}
                            </Text>
                          )}
                        </div>
                        
                        <Text style={{ 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: '#374151',
                          display: 'block',
                          marginBottom: '4px'
                        }}>
                          {stat.title}
                        </Text>
                        
                        <Text style={{ 
                          fontSize: '12px', 
                          color: '#6b7280',
                          lineHeight: '1.3'
                        }}>
                          {stat.description}
                        </Text>
                      </div>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div style={{
              background: 'white',
              borderRadius: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
              overflow: 'hidden',
              border: '1px solid rgba(0,0,0,0.05)'
            }}>
              <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                size="large"
                style={{
                  padding: '0',
                }}
                tabBarStyle={{
                  padding: '0 32px',
                  margin: 0,
                  background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
                  borderBottom: '1px solid rgba(0,0,0,0.06)'
                }}
                items={[
                {
                  key: "overview",
                  label: "Overview",
                  children: (
                    <div style={{ padding: '32px' }}>
                      <Row gutter={[32, 32]}>
                        {/* Badges */}
                        <Col xs={24} lg={8}>
                          <div style={{
                            background: 'white',
                            borderRadius: '20px',
                            padding: '24px',
                            border: '1px solid rgba(0,0,0,0.05)',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                            height: '100%'
                          }}>
                            <Title level={4} style={{ color: '#1f2937', marginBottom: '20px', fontSize: '18px' }}>
                              🏆 Achievements
                            </Title>
                            {profile.badges.length > 0 ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {profile.badges.map((badge, index) => (
                                  <motion.div
                                    key={badge.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    style={{
                                      padding: '16px',
                                      borderRadius: '16px',
                                      border: badge.earned ? '2px solid #fbbf24' : '2px solid #e5e7eb',
                                      background: badge.earned 
                                        ? 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)'
                                        : 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
                                      transition: 'all 0.3s ease',
                                      position: 'relative',
                                      overflow: 'hidden'
                                    }}
                                  >
                                    {badge.earned && (
                                      <div style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: '3px',
                                        background: 'linear-gradient(90deg, #fbbf24, #f59e0b)'
                                      }} />
                                    )}
                                    
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                      <div style={{
                                        fontSize: '28px',
                                        filter: badge.earned ? 'none' : 'grayscale(100%) opacity(0.4)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '12px',
                                        background: badge.earned 
                                          ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
                                          : 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)',
                                        boxShadow: badge.earned ? '0 4px 12px rgba(251, 191, 36, 0.3)' : 'none'
                                      }}>
                                        {typeof badge.icon === 'string' ? badge.icon : '🏆'}
                                      </div>
                                      
                                      <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                          <Text strong style={{ 
                                            color: badge.earned ? '#1f2937' : '#6b7280',
                                            fontSize: '14px'
                                          }}>
                                            {badge.name}
                                          </Text>
                                          {badge.earned && (
                                            <CheckCircleOutlined style={{ color: '#10b981', fontSize: '14px' }} />
                                          )}
                                        </div>
                                        
                                        <Text style={{ 
                                          fontSize: '12px', 
                                          color: '#6b7280',
                                          display: 'block',
                                          marginBottom: '6px'
                                        }}>
                                          {badge.description}
                                        </Text>
                                        
                                        {badge.earned && badge.earnedDate && (
                                          <div style={{ 
                                            fontSize: '11px', 
                                            color: '#10b981',
                                            fontWeight: '600'
                                          }}>
                                            Earned {new Date(badge.earnedDate).toLocaleDateString()}
                                          </div>
                                        )}
                                        
                                        {!badge.earned && (
                                          <div style={{ 
                                            fontSize: '11px', 
                                            color: '#3b82f6',
                                            fontWeight: '500'
                                          }}>
                                            Keep going to unlock this badge!
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                          ) : (
                            <div className="text-center py-12">
                              <div className="text-gray-400 text-5xl mb-4">
                                <TrophyOutlined />
                              </div>
                              <Title level={4} className="text-gray-500 mb-2">
                                No badges yet
                              </Title>
                              <Paragraph className="text-gray-400 mb-6">
                                Start participating in the community to earn your first badge!
                              </Paragraph>
                              <Link href="/causes/create">
                                <Button type="primary" icon={<PlusOutlined />}>
                                  Create Your First Cause
                                </Button>
                              </Link>
                            </div>
                          )}
                   \
                      </Col>

                      {/* Recent Activity */}
                      <Col xs={24} lg={16}>
                        <div style={{
                          background: 'white',
                          borderRadius: '20px',
                          padding: '24px',
                          border: '1px solid rgba(0,0,0,0.05)',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                          height: '100%'
                        }}>
                          <Title level={4} style={{ color: '#1f2937', marginBottom: '20px', fontSize: '18px' }}>
                            📈 Recent Activity
                          </Title>
                          
                          {profile.activities.length > 0 ? (
                            <div style={{ position: 'relative' }}>
                              {/* Timeline line */}
                              <div style={{
                                position: 'absolute',
                                left: '20px',
                                top: '20px',
                                bottom: '20px',
                                width: '2px',
                                background: 'linear-gradient(to bottom, #e5e7eb, #f3f4f6)',
                                zIndex: 1
                              }} />
                              
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {profile.activities.map((activity, index) => (
                                  <motion.div
                                    key={activity.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'flex-start',
                                      gap: '16px',
                                      position: 'relative',
                                      zIndex: 2
                                    }}
                                  >
                                    {/* Activity dot */}
                                    <div style={{
                                      width: '40px',
                                      height: '40px',
                                      borderRadius: '50%',
                                      background: activity.type === 'created_cause' 
                                        ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                                        : activity.type === 'donated'
                                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                                        : activity.type === 'volunteered'
                                        ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                                        : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      color: 'white',
                                      fontSize: '16px',
                                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                      border: '3px solid white'
                                    }}>
                                      {activity.icon}
                                    </div>
                                    
                                    {/* Activity content */}
                                    <div style={{
                                      flex: 1,
                                      background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
                                      padding: '16px',
                                      borderRadius: '16px',
                                      border: '1px solid rgba(0,0,0,0.05)',
                                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                                    }}>
                                      <Text strong style={{ 
                                        fontSize: '14px', 
                                        color: '#1f2937',
                                        display: 'block',
                                        marginBottom: '6px'
                                      }}>
                                        {activity.description}
                                      </Text>
                                      
                                      <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                      }}>
                                        <CalendarOutlined style={{ color: '#6b7280', fontSize: '12px' }} />
                                        <Text style={{ 
                                          fontSize: '12px', 
                                          color: '#6b7280'
                                        }}>
                                          {new Date(activity.date).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                          })}
                                        </Text>
                                      </div>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                              <div style={{ fontSize: '48px', color: '#e5e7eb', marginBottom: '16px' }}>
                                <ClockCircleOutlined />
                              </div>
                              <Title level={4} style={{ color: '#6b7280', marginBottom: '8px' }}>
                                No activity yet
                              </Title>
                              <Paragraph style={{ color: '#9ca3af', marginBottom: '24px' }}>
                                Start creating causes or supporting others to see your activity here.
                              </Paragraph>
                              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                <Link href="/causes/create">
                                  <Button 
                                    type="primary" 
                                    icon={<PlusOutlined />}
                                    style={{
                                      borderRadius: '12px',
                                      height: '40px',
                                      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                      border: 'none'
                                    }}
                                  >
                                    Create a Cause
                                  </Button>
                                </Link>
                                <Link href="/causes">
                                  <Button 
                                    icon={<HeartOutlined />}
                                    style={{
                                      borderRadius: '12px',
                                      height: '40px',
                                      border: '1px solid #e5e7eb'
                                    }}
                                  >
                                    Explore Causes
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          )}
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
                                        (cause.raised / cause.goal) * 100,
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
                                      cause.createdAt,
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
                                      Donated{" "}
                                      {formatCurrency(contribution.amount)}
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
                                      contribution.date,
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
            </div>
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
            <Form.Item
              name="name"
              label="Full Name"
              rules={[{ required: true }]}
            >
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
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[{ type: "email" }]}
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

