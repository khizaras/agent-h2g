"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  Button,
  Typography,
  Progress,
  Space,
  Tag,
  Divider,
  Row,
  Col,
  Modal,
  Input,
  message,
  Avatar,
  List,
  Tabs,
  Timeline,
  Statistic,
  Badge,
  Tooltip,
  Rate,
  Breadcrumb,
  Affix,
} from "antd";
import {
  HeartOutlined,
  ShareAltOutlined,
  TeamOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  UserOutlined,
  DollarOutlined,
  BookOutlined,
  FlagOutlined,
  MessageOutlined,
  LikeOutlined,
  HomeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FireOutlined,
  EyeOutlined,
  WarningOutlined,
  ThunderboltOutlined,
  TrophyOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { MainLayout } from "@/components/layout/MainLayout";
import {
  unsplashImages,
  getRandomCauseImage,
} from "@/services/unsplashService";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface Cause {
  id: number;
  title: string;
  description: string;
  detailedDescription: string;
  imageUrl: string;
  images: string[];
  goalAmount: number;
  raisedAmount: number;
  location: string;
  category: string;
  status: string;
  urgencyLevel: "low" | "medium" | "high" | "critical";
  createdAt: string;
  updatedAt: string;
  deadline?: string;
  verified: boolean;
  featured: boolean;
  creator: {
    id: number;
    name: string;
    avatar?: string;
    email: string;
    bio: string;
    causesCreated: number;
    totalRaised: number;
    verified: boolean;
  };
  contributors: {
    id: number;
    name: string;
    amount: number;
    date: string;
    avatar?: string;
    message?: string;
    anonymous: boolean;
  }[];
  updates: {
    id: number;
    title: string;
    content: string;
    date: string;
    images?: string[];
    author: string;
  }[];
  comments: {
    id: number;
    author: string;
    avatar?: string;
    content: string;
    date: string;
    likes: number;
    replies?: {
      id: number;
      author: string;
      content: string;
      date: string;
    }[];
  }[];
  tags: string[];
  volunteers: {
    needed: number;
    joined: number;
  };
  stats: {
    views: number;
    likes: number;
    shares: number;
    saves: number;
  };
  milestones: {
    amount: number;
    description: string;
    achieved: boolean;
    achievedDate?: string;
  }[];
}

export default function CauseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [cause, setCause] = useState<Cause | null>(null);
  const [loading, setLoading] = useState(true);
  const [donateModalVisible, setDonateModalVisible] = useState(false);
  const [donationAmount, setDonationAmount] = useState("");
  const [donationMessage, setDonationMessage] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockCause: Cause = {
      id: Number(id),
      title: "Emergency Food Relief for Hurricane Victims",
      description:
        "Providing immediate food assistance to families displaced by recent hurricane damage in coastal communities.",
      detailedDescription: `
        <p>Our Emergency Food Relief program was launched in response to the devastating hurricane that hit our coastal communities last month. Hundreds of families have been displaced from their homes and are struggling to access basic necessities, especially nutritious food.</p>
        
        <h3>What We're Doing:</h3>
        <ul>
          <li>Distributing emergency food packages to affected families</li>
          <li>Providing hot meals at temporary shelters</li>
          <li>Coordinating with local food banks for sustained support</li>
          <li>Ensuring children have access to school meals despite disruptions</li>
        </ul>
        
        <h3>Why This Matters:</h3>
        <p>Food security is a fundamental human right. In times of crisis, access to nutritious meals becomes even more critical for maintaining health and hope. Your support ensures that no family goes hungry during their most vulnerable time.</p>
        
        <h3>How Your Donation Helps:</h3>
        <ul>
          <li>$25 provides a week's worth of groceries for one person</li>
          <li>$100 feeds a family of four for two weeks</li>
          <li>$250 supports our mobile food distribution truck for one day</li>
          <li>$500 stocks an emergency food pantry serving 50 families</li>
        </ul>
      `,
      imageUrl: unsplashImages.causes[0].url,
      images: [
        unsplashImages.causes[0].url,
        unsplashImages.causes[1].url,
        unsplashImages.causes[2].url,
        unsplashImages.causes[3].url,
      ],
      goalAmount: 75000,
      raisedAmount: 48750,
      location: "Miami-Dade County, FL",
      category: "Emergency Relief",
      status: "active",
      urgencyLevel: "critical",
      createdAt: "2024-01-10",
      updatedAt: "2024-01-22",
      deadline: "2024-02-28",
      verified: true,
      featured: true,
      creator: {
        id: 1,
        name: "Sarah Johnson",
        avatar: "/images/avatars/sarah.jpg",
        email: "sarah@relieforganization.org",
        bio: "Disaster relief coordinator with 10+ years experience. Passionate about ensuring no community faces crisis alone.",
        causesCreated: 8,
        totalRaised: 285000,
        verified: true,
      },
      contributors: [
        {
          id: 1,
          name: "Anonymous Donor",
          amount: 5000,
          date: "2024-01-22",
          message: "Prayers for all affected families. Stay strong!",
          anonymous: true,
        },
        {
          id: 2,
          name: "Miami Food Bank",
          amount: 2500,
          date: "2024-01-21",
          avatar: "/images/avatars/mike.jpg",
          message: "Proud to support this vital cause.",
          anonymous: false,
        },
        {
          id: 3,
          name: "Local Restaurant Alliance",
          amount: 1800,
          date: "2024-01-20",
          message: "Together we rebuild stronger.",
          anonymous: false,
        },
        {
          id: 4,
          name: "Community Members",
          amount: 950,
          date: "2024-01-19",
          message: "Every family deserves food security.",
          anonymous: false,
        },
      ],
      updates: [
        {
          id: 1,
          title: "Mobile Food Truck Reaches Remote Areas",
          content:
            "Our new mobile food distribution truck successfully reached three remote communities today, delivering fresh produce and emergency meal kits to 127 families. The truck is equipped with refrigeration units to ensure food safety.",
          date: "2024-01-22",
          images: [unsplashImages.causes[4].url, unsplashImages.causes[5].url],
          author: "Sarah Johnson",
        },
        {
          id: 2,
          title: "Partnership with Local Schools Established",
          content:
            "We've partnered with 15 local schools to ensure displaced children continue receiving nutritious meals. Our team will provide breakfast and lunch programs at temporary learning centers.",
          date: "2024-01-20",
          author: "Relief Team",
        },
        {
          id: 3,
          title: "First 1,000 Families Reached!",
          content:
            "Milestone achieved! We've successfully provided emergency food assistance to over 1,000 families in the first week. Your donations are making a real difference.",
          date: "2024-01-18",
          author: "Sarah Johnson",
        },
      ],
      comments: [
        {
          id: 1,
          author: "Maria Rodriguez",
          avatar: "/images/avatars/lisa.jpg",
          content:
            "My family was one of those helped by this program. Thank you so much for the quick response and quality food supplies.",
          date: "2024-01-21",
          likes: 24,
          replies: [
            {
              id: 1,
              author: "Sarah Johnson",
              content:
                "So glad we could help, Maria. Wishing you and your family all the best during recovery.",
              date: "2024-01-21",
            },
          ],
        },
        {
          id: 2,
          author: "Dr. James Wilson",
          content:
            "As a local physician, I've seen firsthand how malnutrition affects recovery from trauma. This program is vital for our community's health.",
          date: "2024-01-20",
          likes: 18,
        },
      ],
      tags: [
        "emergency-relief",
        "food-security",
        "hurricane-recovery",
        "families",
        "community-support",
      ],
      volunteers: {
        needed: 150,
        joined: 89,
      },
      stats: {
        views: 12847,
        likes: 456,
        shares: 89,
        saves: 234,
      },
      milestones: [
        {
          amount: 15000,
          description: "Emergency food supplies for first 500 families",
          achieved: true,
          achievedDate: "2024-01-15",
        },
        {
          amount: 35000,
          description: "Mobile food truck deployment",
          achieved: true,
          achievedDate: "2024-01-19",
        },
        {
          amount: 50000,
          description: "Partnership with 15 local schools",
          achieved: false,
        },
        {
          amount: 75000,
          description: "Sustained support for 3 months",
          achieved: false,
        },
      ],
    };

    setTimeout(() => {
      setCause(mockCause);
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleDonate = () => {
    if (!donationAmount || Number(donationAmount) <= 0) {
      message.error("Please enter a valid donation amount");
      return;
    }

    // Mock donation - replace with actual payment processing
    message.success(
      `Thank you for your donation of $${donationAmount}! Every dollar helps save lives.`,
    );
    setDonateModalVisible(false);
    setDonationAmount("");
    setDonationMessage("");

    // Update raised amount
    if (cause) {
      setCause({
        ...cause,
        raisedAmount: cause.raisedAmount + Number(donationAmount),
      });
    }
  };

  const handleLike = () => {
    setLiked(!liked);
    if (cause) {
      setCause({
        ...cause,
        stats: {
          ...cause.stats,
          likes: liked ? cause.stats.likes - 1 : cause.stats.likes + 1,
        },
      });
    }
  };

  const handleSave = () => {
    setSaved(!saved);
    message.success(
      saved ? "Removed from saved causes" : "Saved to your causes list",
    );
    if (cause) {
      setCause({
        ...cause,
        stats: {
          ...cause.stats,
          saves: saved ? cause.stats.saves - 1 : cause.stats.saves + 1,
        },
      });
    }
  };

  const getDaysLeft = (deadline?: string) => {
    if (!deadline) return null;
    const today = new Date();
    const end = new Date(deadline);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
            <Text className="mt-4 text-gray-600 text-lg">
              Loading cause details...
            </Text>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!cause) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="text-center">
            <Title level={3} className="text-gray-400">
              Cause not found
            </Title>
            <Paragraph className="text-gray-500 mb-6">
              The cause you're looking for doesn't exist or has been removed.
            </Paragraph>
            <Link href="/causes">
              <Button type="primary" size="large">
                Browse Other Causes
              </Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  const progressPercentage = Math.min(
    (cause.raisedAmount / cause.goalAmount) * 100,
    100,
  );
  const daysLeft = getDaysLeft(cause.deadline);

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        {/* Breadcrumb Navigation */}
        <div className="bg-white border-b border-gray-100">
          <div className="container mx-auto px-6 py-4">
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link href="/" className="flex items-center">
                  <HomeOutlined className="mr-1" />
                  Home
                </Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link href="/causes">Causes</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>{cause.category}</Breadcrumb.Item>
              <Breadcrumb.Item className="text-gray-400">
                {cause.title}
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative">
          <div className="h-96 relative overflow-hidden">
            <Image
              src={cause.imageUrl}
              alt={cause.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

            {/* Hero Content */}
            <div className="absolute inset-0 flex items-end">
              <div className="container mx-auto px-6 pb-12">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="max-w-4xl"
                >
                  {/* Status Badges */}
                  <div className="flex flex-wrap gap-3 mb-6">
                    {cause.featured && (
                      <Badge
                        status="processing"
                        text={
                          <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            <FireOutlined className="mr-1" />
                            Featured
                          </span>
                        }
                      />
                    )}
                    {cause.verified && (
                      <Badge
                        status="success"
                        text={
                          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            <SafetyCertificateOutlined className="mr-1" />
                            Verified
                          </span>
                        }
                      />
                    )}
                    <Badge
                      status="processing"
                      text={
                        <span
                          className="px-3 py-1 rounded-full text-sm font-medium text-white"
                          style={{
                            backgroundColor:
                              cause.urgencyLevel === "critical"
                                ? "#DC2626"
                                : cause.urgencyLevel === "high"
                                  ? "#EF4444"
                                  : cause.urgencyLevel === "medium"
                                    ? "#F59E0B"
                                    : "#10B981",
                          }}
                        >
                          <WarningOutlined className="mr-1" />
                          {cause.urgencyLevel.charAt(0).toUpperCase() +
                            cause.urgencyLevel.slice(1)}{" "}
                          Priority
                        </span>
                      }
                    />
                    {daysLeft !== null && daysLeft <= 14 && (
                      <Badge
                        status="error"
                        text={
                          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            <ClockCircleOutlined className="mr-1" />
                            {daysLeft} days left
                          </span>
                        }
                      />
                    )}
                  </div>

                  <Title
                    level={1}
                    className="text-white mb-4 text-4xl md:text-5xl font-bold"
                  >
                    {cause.title}
                  </Title>

                  <Paragraph className="text-blue-100 text-xl mb-6 leading-relaxed">
                    {cause.description}
                  </Paragraph>

                  <div className="flex flex-wrap gap-6 text-blue-200">
                    <div className="flex items-center">
                      <EnvironmentOutlined className="mr-2 text-lg" />
                      <span className="font-medium">{cause.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Tag
                        color="blue"
                        className="border-0 bg-blue-500/30 text-blue-100"
                      >
                        {cause.category}
                      </Tag>
                    </div>
                    <div className="flex items-center">
                      <EyeOutlined className="mr-2 text-lg" />
                      <span>{cause.stats.views.toLocaleString()} views</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-12">
          <Row gutter={[32, 32]}>
            {/* Main Content */}
            <Col xs={24} lg={16}>
              {/* Action Buttons - Mobile */}
              <div className="lg:hidden mb-8">
                <Row gutter={[12, 12]}>
                  <Col span={24}>
                    <Button
                      type="primary"
                      size="large"
                      block
                      icon={<HeartOutlined />}
                      onClick={() => setDonateModalVisible(true)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 border-none h-12 font-semibold"
                    >
                      Donate Now -{" "}
                      {formatCurrency(
                        progressPercentage >= 100
                          ? 0
                          : Math.ceil(
                              (cause.goalAmount - cause.raisedAmount) / 4,
                            ),
                      )}{" "}
                      Impact
                    </Button>
                  </Col>
                  <Col span={12}>
                    <Button
                      size="large"
                      block
                      icon={
                        <LikeOutlined
                          style={{ color: liked ? "#EF4444" : undefined }}
                        />
                      }
                      onClick={handleLike}
                      className={liked ? "text-red-500 border-red-500" : ""}
                    >
                      {cause.stats.likes}
                    </Button>
                  </Col>
                  <Col span={12}>
                    <Button
                      size="large"
                      block
                      icon={
                        <BookOutlined
                          style={{ color: saved ? "#3B82F6" : undefined }}
                        />
                      }
                      onClick={handleSave}
                      className={saved ? "text-blue-500 border-blue-500" : ""}
                    >
                      Save
                    </Button>
                  </Col>
                </Row>
              </div>

              {/* Tabbed Content */}
              <Card className="mb-8 shadow-lg border-0 rounded-2xl">
                <Tabs
                  activeKey={activeTab}
                  onChange={setActiveTab}
                  size="large"
                  items={[
                    {
                      key: "overview",
                      label: "Overview",
                      children: (
                        <div className="space-y-8">
                          {/* Detailed Description */}
                          <div>
                            <Title level={3} className="mb-4">
                              About This Cause
                            </Title>
                            <div
                              className="prose max-w-none text-gray-700 leading-relaxed"
                              dangerouslySetInnerHTML={{
                                __html: cause.detailedDescription,
                              }}
                            />
                          </div>

                          {/* Tags */}
                          <div>
                            <Title level={4} className="mb-4">
                              Tags
                            </Title>
                            <div className="flex flex-wrap gap-2">
                              {cause.tags.map((tag, index) => (
                                <Tag
                                  key={index}
                                  className="rounded-full px-3 py-1 text-blue-600 border-blue-200"
                                >
                                  #{tag.replace("-", " ")}
                                </Tag>
                              ))}
                            </div>
                          </div>

                          {/* Image Gallery */}
                          {cause.images.length > 1 && (
                            <div>
                              <Title level={4} className="mb-4">
                                Gallery
                              </Title>
                              <Row gutter={[16, 16]}>
                                {cause.images.slice(1).map((img, index) => (
                                  <Col xs={12} md={8} key={index}>
                                    <div className="relative h-32 overflow-hidden rounded-lg">
                                      <Image
                                        src={img}
                                        alt={`Gallery image ${index + 1}`}
                                        fill
                                        className="object-cover hover:scale-105 transition-transform duration-300"
                                      />
                                    </div>
                                  </Col>
                                ))}
                              </Row>
                            </div>
                          )}
                        </div>
                      ),
                    },
                    {
                      key: "updates",
                      label: `Updates (${cause.updates.length})`,
                      children: (
                        <div className="space-y-6">
                          {cause.updates.map((update) => (
                            <Card
                              key={update.id}
                              className="border border-gray-100 rounded-xl"
                            >
                              <div className="flex justify-between items-start mb-4">
                                <Title level={4} className="mb-0">
                                  {update.title}
                                </Title>
                                <div className="text-right">
                                  <Text type="secondary" className="text-sm">
                                    {new Date(update.date).toLocaleDateString(
                                      "en-US",
                                      {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                      },
                                    )}
                                  </Text>
                                  <div className="text-xs text-gray-400">
                                    by {update.author}
                                  </div>
                                </div>
                              </div>
                              <Paragraph className="text-gray-700 mb-4 leading-relaxed">
                                {update.content}
                              </Paragraph>
                              {update.images && (
                                <Row gutter={[12, 12]}>
                                  {update.images.map((img, index) => (
                                    <Col xs={12} md={8} key={index}>
                                      <div className="relative h-24 overflow-hidden rounded-lg">
                                        <Image
                                          src={img}
                                          alt={`Update image ${index + 1}`}
                                          fill
                                          className="object-cover"
                                        />
                                      </div>
                                    </Col>
                                  ))}
                                </Row>
                              )}
                            </Card>
                          ))}
                        </div>
                      ),
                    },
                    {
                      key: "contributors",
                      label: `Contributors (${cause.contributors.length})`,
                      children: (
                        <div className="space-y-4">
                          {cause.contributors.map((contributor) => (
                            <Card
                              key={contributor.id}
                              className="border border-gray-100 rounded-xl"
                            >
                              <div className="flex items-start space-x-4">
                                <Avatar
                                  size={48}
                                  src={
                                    !contributor.anonymous
                                      ? contributor.avatar
                                      : undefined
                                  }
                                  icon={<UserOutlined />}
                                  className="flex-shrink-0"
                                />
                                <div className="flex-1">
                                  <div className="flex justify-between items-start mb-2">
                                    <div>
                                      <Title level={5} className="mb-1">
                                        {contributor.anonymous
                                          ? "Anonymous Donor"
                                          : contributor.name}
                                      </Title>
                                      <Text
                                        type="secondary"
                                        className="text-sm"
                                      >
                                        Donated{" "}
                                        {formatCurrency(contributor.amount)} on{" "}
                                        {new Date(
                                          contributor.date,
                                        ).toLocaleDateString()}
                                      </Text>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-lg font-bold text-green-600">
                                        {formatCurrency(contributor.amount)}
                                      </div>
                                    </div>
                                  </div>
                                  {contributor.message && (
                                    <blockquote className="border-l-4 border-blue-200 pl-4 italic text-gray-600">
                                      "{contributor.message}"
                                    </blockquote>
                                  )}
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      ),
                    },
                    {
                      key: "comments",
                      label: `Comments (${cause.comments.length})`,
                      children: (
                        <div className="space-y-6">
                          {/* Comment Form */}
                          <Card className="border border-gray-100 rounded-xl">
                            <Title level={5} className="mb-4">
                              Leave a Comment
                            </Title>
                            <TextArea
                              placeholder="Share your thoughts or encouragement..."
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              rows={3}
                              className="mb-4"
                            />
                            <Button
                              type="primary"
                              icon={<MessageOutlined />}
                              disabled={!newComment.trim()}
                            >
                              Post Comment
                            </Button>
                          </Card>

                          {/* Comments List */}
                          {cause.comments.map((comment) => (
                            <Card
                              key={comment.id}
                              className="border border-gray-100 rounded-xl"
                            >
                              <div className="flex items-start space-x-4">
                                <Avatar
                                  size={40}
                                  src={comment.avatar}
                                  icon={<UserOutlined />}
                                  className="flex-shrink-0"
                                />
                                <div className="flex-1">
                                  <div className="flex justify-between items-start mb-2">
                                    <Title level={5} className="mb-1">
                                      {comment.author}
                                    </Title>
                                    <Text type="secondary" className="text-sm">
                                      {new Date(
                                        comment.date,
                                      ).toLocaleDateString()}
                                    </Text>
                                  </div>
                                  <Paragraph className="text-gray-700 mb-3 leading-relaxed">
                                    {comment.content}
                                  </Paragraph>
                                  <div className="flex items-center space-x-4">
                                    <Button
                                      type="text"
                                      size="small"
                                      icon={<LikeOutlined />}
                                      className="text-gray-500 hover:text-blue-500"
                                    >
                                      {comment.likes}
                                    </Button>
                                    <Button
                                      type="text"
                                      size="small"
                                      className="text-gray-500 hover:text-blue-500"
                                    >
                                      Reply
                                    </Button>
                                  </div>

                                  {/* Replies */}
                                  {comment.replies &&
                                    comment.replies.length > 0 && (
                                      <div className="mt-4 pl-4 border-l-2 border-gray-100 space-y-3">
                                        {comment.replies.map((reply) => (
                                          <div
                                            key={reply.id}
                                            className="flex items-start space-x-3"
                                          >
                                            <Avatar
                                              size={32}
                                              icon={<UserOutlined />}
                                            />
                                            <div className="flex-1">
                                              <div className="flex items-center space-x-2 mb-1">
                                                <Text
                                                  strong
                                                  className="text-sm"
                                                >
                                                  {reply.author}
                                                </Text>
                                                <Text
                                                  type="secondary"
                                                  className="text-xs"
                                                >
                                                  {new Date(
                                                    reply.date,
                                                  ).toLocaleDateString()}
                                                </Text>
                                              </div>
                                              <Paragraph className="text-gray-600 text-sm mb-0">
                                                {reply.content}
                                              </Paragraph>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      ),
                    },
                  ]}
                />
              </Card>
            </Col>

            {/* Sidebar */}
            <Col xs={24} lg={8}>
              <Affix offsetTop={24}>
                <div className="space-y-6">
                  {/* Donation Progress Card */}
                  <Card className="shadow-lg border-0 rounded-2xl">
                    <div className="text-center mb-6">
                      <div className="mb-4">
                        <Title level={2} className="text-green-600 mb-1">
                          {formatCurrency(cause.raisedAmount)}
                        </Title>
                        <Text className="text-gray-600 text-lg">
                          raised of {formatCurrency(cause.goalAmount)} goal
                        </Text>
                      </div>

                      <Progress
                        percent={progressPercentage}
                        strokeColor={{
                          "0%": "#3B82F6",
                          "100%": "#10B981",
                        }}
                        strokeWidth={12}
                        className="mb-4"
                        format={(percent) => `${percent?.toFixed(0)}%`}
                      />

                      {/* Quick Stats */}
                      <Row gutter={16} className="mb-6">
                        <Col span={8} className="text-center">
                          <Statistic
                            value={cause.contributors.length}
                            title="Backers"
                            valueStyle={{
                              fontSize: "1.5rem",
                              fontWeight: "bold",
                            }}
                          />
                        </Col>
                        <Col span={8} className="text-center">
                          <Statistic
                            value={daysLeft || 0}
                            title="Days Left"
                            valueStyle={{
                              fontSize: "1.5rem",
                              fontWeight: "bold",
                            }}
                          />
                        </Col>
                        <Col span={8} className="text-center">
                          <Statistic
                            value={`${cause.volunteers.joined}/${cause.volunteers.needed}`}
                            title="Volunteers"
                            valueStyle={{
                              fontSize: "1rem",
                              fontWeight: "bold",
                            }}
                          />
                        </Col>
                      </Row>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <Button
                        type="primary"
                        size="large"
                        block
                        icon={<HeartOutlined />}
                        onClick={() => setDonateModalVisible(true)}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 border-none h-14 font-semibold text-lg hover:shadow-xl transition-all duration-300"
                      >
                        Donate Now
                      </Button>

                      <Row gutter={12}>
                        <Col span={8}>
                          <Tooltip title={liked ? "Unlike" : "Like this cause"}>
                            <Button
                              size="large"
                              block
                              icon={
                                <LikeOutlined
                                  style={{
                                    color: liked ? "#EF4444" : undefined,
                                  }}
                                />
                              }
                              onClick={handleLike}
                              className={`h-12 ${liked ? "text-red-500 border-red-500 bg-red-50" : ""} hover:shadow-md transition-all duration-300`}
                            >
                              {cause.stats.likes}
                            </Button>
                          </Tooltip>
                        </Col>
                        <Col span={8}>
                          <Tooltip
                            title={
                              saved ? "Remove from saved" : "Save for later"
                            }
                          >
                            <Button
                              size="large"
                              block
                              icon={
                                <BookOutlined
                                  style={{
                                    color: saved ? "#3B82F6" : undefined,
                                  }}
                                />
                              }
                              onClick={handleSave}
                              className={`h-12 ${saved ? "text-blue-500 border-blue-500 bg-blue-50" : ""} hover:shadow-md transition-all duration-300`}
                            >
                              Save
                            </Button>
                          </Tooltip>
                        </Col>
                        <Col span={8}>
                          <Tooltip title="Share this cause">
                            <Button
                              size="large"
                              block
                              icon={<ShareAltOutlined />}
                              className="h-12 hover:shadow-md transition-all duration-300"
                            >
                              Share
                            </Button>
                          </Tooltip>
                        </Col>
                      </Row>
                    </div>
                  </Card>

                  {/* Milestones */}
                  <Card
                    title="Milestones"
                    className="shadow-lg border-0 rounded-2xl"
                  >
                    <Timeline
                      items={cause.milestones.map((milestone, index) => ({
                        dot: milestone.achieved ? (
                          <CheckCircleOutlined className="text-green-500 text-lg" />
                        ) : (
                          <ClockCircleOutlined className="text-gray-400 text-lg" />
                        ),
                        color: milestone.achieved ? "green" : "gray",
                        children: (
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <Text
                                strong
                                className={
                                  milestone.achieved
                                    ? "text-green-600"
                                    : "text-gray-600"
                                }
                              >
                                {formatCurrency(milestone.amount)}
                              </Text>
                              {milestone.achieved && milestone.achievedDate && (
                                <Text type="secondary" className="text-xs">
                                  {new Date(
                                    milestone.achievedDate,
                                  ).toLocaleDateString()}
                                </Text>
                              )}
                            </div>
                            <Paragraph className="text-gray-600 mb-0 text-sm">
                              {milestone.description}
                            </Paragraph>
                          </div>
                        ),
                      }))}
                    />
                  </Card>

                  {/* Organizer Card */}
                  <Card
                    title="Organizer"
                    className="shadow-lg border-0 rounded-2xl"
                  >
                    <div className="text-center">
                      <Avatar
                        size={80}
                        src={cause.creator.avatar}
                        icon={<UserOutlined />}
                        className="mb-4 mx-auto border-4 border-blue-100"
                      />
                      <div className="mb-4">
                        <Title
                          level={4}
                          className="mb-1 flex items-center justify-center"
                        >
                          {cause.creator.name}
                          {cause.creator.verified && (
                            <Tooltip title="Verified organizer">
                              <SafetyCertificateOutlined className="ml-2 text-blue-500" />
                            </Tooltip>
                          )}
                        </Title>
                        <Text type="secondary">Cause Organizer</Text>
                      </div>

                      <Paragraph className="text-gray-600 text-sm mb-4 leading-relaxed">
                        {cause.creator.bio}
                      </Paragraph>

                      <Row gutter={16} className="mb-4">
                        <Col span={12} className="text-center">
                          <Statistic
                            value={cause.creator.causesCreated}
                            title="Causes Created"
                            valueStyle={{
                              fontSize: "1.25rem",
                              color: "#3B82F6",
                            }}
                          />
                        </Col>
                        <Col span={12} className="text-center">
                          <Statistic
                            value={formatCurrency(cause.creator.totalRaised)}
                            title="Total Raised"
                            valueStyle={{
                              fontSize: "1.25rem",
                              color: "#10B981",
                            }}
                          />
                        </Col>
                      </Row>

                      <Button
                        type="default"
                        block
                        className="hover:shadow-md transition-all duration-300"
                      >
                        Contact Organizer
                      </Button>
                    </div>
                  </Card>

                  {/* Report/Trust & Safety */}
                  <Card className="shadow-lg border-0 rounded-2xl">
                    <div className="text-center">
                      <Title level={5} className="mb-3">
                        Trust & Safety
                      </Title>
                      <Paragraph className="text-gray-600 text-sm mb-4">
                        Report any concerns about this cause to our trust and
                        safety team.
                      </Paragraph>
                      <Button
                        icon={<FlagOutlined />}
                        size="small"
                        type="text"
                        className="text-gray-500 hover:text-red-500"
                      >
                        Report Cause
                      </Button>
                    </div>
                  </Card>
                </div>
              </Affix>
            </Col>
          </Row>
        </div>

        {/* Donation Modal */}
        <Modal
          title={
            <div className="text-center">
              <Title level={3} className="mb-2">
                Make a Donation
              </Title>
              <Text type="secondary">Support {cause.title}</Text>
            </div>
          }
          open={donateModalVisible}
          onCancel={() => setDonateModalVisible(false)}
          footer={null}
          width={600}
          className="rounded-2xl"
        >
          <div className="py-6">
            {/* Quick Amount Buttons */}
            <div className="mb-6">
              <Text strong className="block mb-3">
                Quick Amounts
              </Text>
              <Row gutter={[12, 12]}>
                {[25, 50, 100, 250, 500, 1000].map((amount) => (
                  <Col span={8} key={amount}>
                    <Button
                      size="large"
                      block
                      onClick={() => setDonationAmount(amount.toString())}
                      className={`h-12 ${donationAmount === amount.toString() ? "border-blue-500 bg-blue-50 text-blue-600" : ""}`}
                    >
                      {formatCurrency(amount)}
                    </Button>
                  </Col>
                ))}
              </Row>
            </div>

            {/* Custom Amount */}
            <div className="mb-4">
              <Text strong className="block mb-2">
                Custom Amount
              </Text>
              <Input
                size="large"
                placeholder="Enter amount"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                prefix="$"
                type="number"
                className="h-12"
              />
            </div>

            {/* Impact Information */}
            {donationAmount && Number(donationAmount) > 0 && (
              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <Text strong className="text-blue-800 block mb-2">
                  Your Impact
                </Text>
                <Text className="text-blue-700 text-sm">
                  ${donationAmount} can provide emergency food supplies for{" "}
                  {Math.floor(Number(donationAmount) / 25)} people for one week.
                </Text>
              </div>
            )}

            {/* Message */}
            <div className="mb-6">
              <Text strong className="block mb-2">
                Message (Optional)
              </Text>
              <TextArea
                placeholder="Add a personal message to inspire others..."
                value={donationMessage}
                onChange={(e) => setDonationMessage(e.target.value)}
                rows={3}
                showCount
                maxLength={200}
              />
            </div>

            {/* Donation Button */}
            <Button
              type="primary"
              size="large"
              block
              onClick={handleDonate}
              disabled={!donationAmount || Number(donationAmount) <= 0}
              icon={<DollarOutlined />}
              className="bg-gradient-to-r from-blue-600 to-purple-600 border-none h-14 font-semibold text-lg hover:shadow-xl transition-all duration-300"
            >
              Donate{" "}
              {donationAmount ? formatCurrency(Number(donationAmount)) : ""}
            </Button>

            <div className="mt-4 text-center">
              <Text type="secondary" className="text-xs">
                Secure payment processing. Your donation helps save lives.
              </Text>
            </div>
          </div>
        </Modal>
      </div>
    </MainLayout>
  );
}
