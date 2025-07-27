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
  Row,
  Col,
  Modal,
  Input,
  message,
  Avatar,
  Tabs,
  Breadcrumb,
} from "antd";
import {
  HeartOutlined,
  ShareAltOutlined,
  TeamOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  UserOutlined,
  BookOutlined,
  MessageOutlined,
  LikeOutlined,
  HomeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { unsplashImages } from "@/services/unsplashService";
import FoodDetailsSection from "@/components/details/FoodDetailsSection";
import ClothesDetailsSection from "@/components/details/ClothesDetailsSection";
import EducationDetailsSection from "@/components/details/EducationDetailsSection";

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
  category_name?: string;
  urgencyLevel: "low" | "medium" | "high" | "critical";
  createdAt: string;
  deadline?: string;
  verified: boolean;
  creator: {
    id: number;
    name: string;
    avatar?: string;
    bio: string;
    causesCreated: number;
    totalRaised: number;
    verified: boolean;
  };
  contributors: Array<{
    id: number;
    name: string;
    amount: number;
    date: string;
    avatar?: string;
    message?: string;
    anonymous: boolean;
  }>;
  updates: Array<{
    id: number;
    title: string;
    content: string;
    date: string;
    author: string;
    images?: string[];
  }>;
  comments: Array<{
    id: number;
    author: string;
    avatar?: string;
    content: string;
    date: string;
    likes: number;
    replies?: Array<{
      id: number;
      author: string;
      content: string;
      date: string;
    }>;
  }>;
}

const mockCause: Cause = {
  id: 1,
  title: "Emergency Food Relief for Hurricane Victims",
  description: "Providing immediate food assistance to families displaced by recent hurricane damage in coastal communities.",
  detailedDescription: `
    In the aftermath of Hurricane Elena, thousands of families in our coastal communities have lost their homes, livelihoods, and access to basic necessities. The storm's unprecedented force left a trail of destruction, with many neighborhoods completely cut off from essential services.

    Our emergency food relief program is working around the clock to ensure no family goes hungry during this critical recovery period. We've established mobile food distribution centers that can reach even the most remote affected areas, providing fresh produce, non-perishable meals, clean water, and emergency supplies.

    What makes this program unique is our partnership with local farmers and food producers who were less affected by the storm. This not only supports our immediate relief efforts but also helps rebuild the local economy. Every dollar donated goes directly toward purchasing and distributing food, with zero administrative overhead.

    The need is urgent and growing daily. Local emergency shelters are overwhelmed, and many families are staying in temporary accommodations without access to cooking facilities. Our pre-prepared meal programs and mobile food trucks are literally lifelines for these communities.
  `,
  imageUrl: unsplashImages.causes[0]?.url || "https://images.unsplash.com/photo-1593113598332-cd288d649433",
  images: [
    unsplashImages.causes[0]?.url || "https://images.unsplash.com/photo-1593113598332-cd288d649433",
    unsplashImages.causes[1]?.url || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c",
    unsplashImages.causes[2]?.url || "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b",
  ],
  goalAmount: 25000,
  raisedAmount: 18500,
  location: "Miami, FL",
  category: "Emergency Relief",
  urgencyLevel: "critical",
  createdAt: "2024-01-15",
  deadline: "2024-02-28",
  verified: true,
  creator: {
    id: 1,
    name: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
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
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
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
      content: "Our new mobile food distribution truck successfully reached three remote communities today, delivering fresh produce and emergency meal kits to 127 families. The truck is equipped with refrigeration units to ensure food safety.",
      date: "2024-01-22",
      author: "Sarah Johnson",
      images: [
        unsplashImages.causes[3]?.url || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
        unsplashImages.causes[4]?.url || "https://images.unsplash.com/photo-1559827260-dc66d52bef19",
      ],
    },
    {
      id: 2,
      title: "Partnership with Local Schools Established",
      content: "We've partnered with 15 local schools to ensure displaced children continue receiving nutritious meals. Our team will provide breakfast and lunch programs at temporary learning centers.",
      date: "2024-01-20",
      author: "Relief Team",
    },
    {
      id: 3,
      title: "First 1,000 Families Reached!",
      content: "Milestone achieved! We've successfully provided emergency food assistance to over 1,000 families in the first week. Your donations are making a real difference.",
      date: "2024-01-18",
      author: "Sarah Johnson",
    },
  ],
  comments: [
    {
      id: 1,
      author: "Maria Rodriguez",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
      content: "My family was one of those helped by this program. Thank you so much for the quick response and quality food supplies.",
      date: "2024-01-21",
      likes: 24,
      replies: [
        {
          id: 1,
          author: "Sarah Johnson",
          content: "So glad we could help, Maria. Wishing you and your family all the best during recovery.",
          date: "2024-01-21",
        },
      ],
    },
    {
      id: 2,
      author: "Dr. James Wilson",
      content: "As a local physician, I've seen firsthand how malnutrition affects recovery from trauma. This program is vital for our community's health.",
      date: "2024-01-20",
      likes: 18,
    },
  ],
};


export default function CauseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [cause, setCause] = useState<Cause | null>(null);
  const [categoryDetails, setCategoryDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [donateModalVisible, setDonateModalVisible] = useState(false);
  const [donateAmount, setDonateAmount] = useState<string>("");
  const [activeTab, setActiveTab] = useState("1");

  useEffect(() => {
    const fetchCauseDetails = async () => {
      try {
        const response = await fetch(`/api/causes/${params.id}`);
        const result = await response.json();
        
        if (result.success) {
          setCause(result.data.cause);
          setCategoryDetails(result.data.categoryDetails);
        } else {
          console.error('Failed to fetch cause details:', result.error);
          // Fallback to mock data for now
          setCause(mockCause);
        }
      } catch (error) {
        console.error('Error fetching cause details:', error);
        // Fallback to mock data for now
        setCause(mockCause);
      } finally {
        setLoading(false);
      }
    };

    fetchCauseDetails();
  }, [params.id]);

  const handleDonate = () => {
    if (!donateAmount || parseFloat(donateAmount) <= 0) {
      message.error("Please enter a valid donation amount");
      return;
    }
    message.success(`Thank you for your donation of $${donateAmount}!`);
    setDonateModalVisible(false);
    setDonateAmount("");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case "critical": return "#f5222d";
      case "high": return "#fa8c16";
      case "medium": return "#faad14";
      case "low": return "#52c41a";
      default: return "#d9d9d9";
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="modern-loading">
          <Text>Loading cause details...</Text>
        </div>
      </MainLayout>
    );
  }

  if (!cause) {
    return (
      <MainLayout>
        <div className="modern-not-found">
          <Title level={2}>Cause not found</Title>
          <Button type="primary" onClick={() => router.push("/causes")} className="modern-btn-primary">
            Back to Causes
          </Button>
        </div>
      </MainLayout>
    );
  }

  const progressPercentage = Math.round((cause.raisedAmount / cause.goalAmount) * 100);
  const daysLeft = cause.deadline ? Math.max(0, Math.ceil((new Date(cause.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) : null;

  const tabItems = [
    {
      key: "1",
      label: "Story",
      children: (
        <div className="story-content">
          <Paragraph className="story-description">
            {cause.detailedDescription}
          </Paragraph>
        </div>
      ),
    },
    {
      key: "2",
      label: `Updates (${cause.updates.length})`,
      children: (
        <div className="updates-content">
          {cause.updates.map((update) => (
            <div key={update.id} className="modern-update-item">
              <div className="update-header">
                <Title level={4} className="update-title">
                  {update.title}
                </Title>
                <div className="update-meta">
                  <Space>
                    <UserOutlined />
                    <span>{update.author}</span>
                    <CalendarOutlined />
                    <span>{formatDate(update.date)}</span>
                  </Space>
                </div>
              </div>
              <Paragraph className="update-content">
                {update.content}
              </Paragraph>
              {update.images && (
                <div className="update-images">
                  {update.images.map((image, index) => (
                    <div key={index} className="update-image">
                      <img src={image} alt={`Update ${index + 1}`} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "3",
      label: `Comments (${cause.comments.length})`,
      children: (
        <div className="comments-content">
          {cause.comments.map((comment) => (
            <div key={comment.id} className="modern-comment-item">
              <div className="comment-header">
                <Avatar src={comment.avatar} icon={<UserOutlined />} size={40} />
                <div className="comment-author-info">
                  <div className="comment-author">{comment.author}</div>
                  <div className="comment-date">{formatDate(comment.date)}</div>
                </div>
              </div>
              <Paragraph className="comment-content">
                {comment.content}
              </Paragraph>
              <div className="comment-actions">
                <Button size="small" icon={<LikeOutlined />} className="like-btn">
                  {comment.likes}
                </Button>
                <Button size="small" className="reply-btn">Reply</Button>
              </div>
              {comment.replies?.map((reply) => (
                <div key={reply.id} className="modern-reply-item">
                  <div className="comment-header">
                    <Avatar icon={<UserOutlined />} size={32} />
                    <div className="comment-author-info">
                      <div className="comment-author">{reply.author}</div>
                      <div className="comment-date">{formatDate(reply.date)}</div>
                    </div>
                  </div>
                  <Paragraph className="comment-content">
                    {reply.content}
                  </Paragraph>
                </div>
              ))}
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="modern-cause-details-page">
        {/* Hero Section */}
        <section className="modern-cause-hero">
          <div className="hero-background">
            <img src={cause.imageUrl} alt={cause.title} />
            <div className="hero-overlay" />
          </div>
          
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="hero-content"
            >
              <Breadcrumb className="modern-breadcrumb">
                <Breadcrumb.Item>
                  <Link href="/">
                    <HomeOutlined /> Home
                  </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  <Link href="/causes">Causes</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>{cause.category}</Breadcrumb.Item>
              </Breadcrumb>

              <div className="hero-tags">
                <Tag 
                  className={`urgency-tag urgency-${cause.urgencyLevel}`}
                  style={{ backgroundColor: getUrgencyColor(cause.urgencyLevel) }}
                >
                  {cause.urgencyLevel.toUpperCase()} PRIORITY
                </Tag>
                <Tag className="category-tag">{cause.category}</Tag>
                {cause.verified && (
                  <Tag className="verified-tag">
                    <CheckCircleOutlined /> Verified
                  </Tag>
                )}
              </div>

              <Title level={1} className="hero-title">
                {cause.title}
              </Title>

              <div className="hero-meta">
                <div className="meta-item">
                  <EnvironmentOutlined />
                  <span>{cause.location}</span>
                </div>
                <div className="meta-item">
                  <CalendarOutlined />
                  <span>Created {formatDate(cause.createdAt)}</span>
                </div>
                {cause.deadline && (
                  <div className="meta-item">
                    <ClockCircleOutlined />
                    <span>{daysLeft} days left</span>
                  </div>
                )}
                <div className="meta-item">
                  <EyeOutlined />
                  <span>{cause.contributors.length} supporters</span>
                </div>
              </div>

              <Paragraph className="hero-description">
                {cause.description}
              </Paragraph>

              <div className="hero-actions">
                <Button
                  type="primary"
                  size="large"
                  icon={<HeartOutlined />}
                  onClick={() => setDonateModalVisible(true)}
                  className="modern-btn-primary"
                >
                  Donate Now
                </Button>
                <Button
                  size="large"
                  icon={<ShareAltOutlined />}
                  className="modern-btn-secondary"
                >
                  Share
                </Button>
                <Button
                  size="large"
                  icon={<TeamOutlined />}
                  className="modern-btn-secondary"
                >
                  Volunteer
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="modern-content-section">
          <div className="container">
            <Row gutter={[40, 40]}>
              <Col xs={24} lg={16}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {/* Category-specific details */}
                  {categoryDetails && cause.category_name && (
                    <div style={{ marginBottom: '24px' }}>
                      {cause.category_name === 'food' && (
                        <FoodDetailsSection details={categoryDetails} />
                      )}
                      {cause.category_name === 'clothes' && (
                        <ClothesDetailsSection details={categoryDetails} />
                      )}
                      {cause.category_name === 'education' && (
                        <EducationDetailsSection details={categoryDetails} />
                      )}
                    </div>
                  )}
                  
                  <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={tabItems}
                    className="modern-content-tabs"
                    size="large"
                  />
                </motion.div>
              </Col>

              <Col xs={24} lg={8}>
                <div className="sidebar">
                  {/* Progress Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <Card className="modern-progress-card">
                      <div className="progress-header">
                        <div className="raised-amount">
                          ${cause.raisedAmount.toLocaleString()}
                        </div>
                        <div className="goal-amount">
                          raised of ${cause.goalAmount.toLocaleString()} goal
                        </div>
                      </div>

                      <Progress
                        percent={progressPercentage}
                        showInfo={false}
                        strokeColor="#52c41a"
                        className="modern-progress-bar"
                      />

                      <div className="progress-stats">
                        <div className="stat-item">
                          <div className="stat-value">{progressPercentage}%</div>
                          <div className="stat-label">Funded</div>
                        </div>
                        <div className="stat-item">
                          <div className="stat-value">{cause.contributors.length}</div>
                          <div className="stat-label">Supporters</div>
                        </div>
                        <div className="stat-item">
                          <div className="stat-value">{daysLeft || 0}</div>
                          <div className="stat-label">Days Left</div>
                        </div>
                      </div>

                      <Button
                        type="primary"
                        size="large"
                        icon={<HeartOutlined />}
                        onClick={() => setDonateModalVisible(true)}
                        className="modern-btn-primary"
                        block
                      >
                        Donate Now
                      </Button>

                      <div className="secondary-actions">
                        <Button icon={<ShareAltOutlined />} className="action-btn">
                          Share
                        </Button>
                        <Button icon={<BookOutlined />} className="action-btn">
                          Save
                        </Button>
                      </div>
                    </Card>
                  </motion.div>

                  {/* Creator Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <Card className="modern-creator-card">
                      <div className="creator-header">
                        <Avatar
                          size={60}
                          src={cause.creator.avatar}
                          icon={<UserOutlined />}
                        />
                        <div className="creator-info">
                          <div className="creator-name">{cause.creator.name}</div>
                          <div className="creator-stats">
                            {cause.creator.causesCreated} causes • ${cause.creator.totalRaised.toLocaleString()} raised
                          </div>
                        </div>
                      </div>

                      <Paragraph className="creator-bio">
                        {cause.creator.bio}
                      </Paragraph>

                      {cause.creator.verified && (
                        <div className="creator-badge">
                          <Tag className="verified-creator-tag">
                            <SafetyCertificateOutlined /> Verified Creator
                          </Tag>
                        </div>
                      )}

                      <div className="creator-actions">
                        <Button icon={<MessageOutlined />} className="creator-btn">
                          Message
                        </Button>
                        <Button icon={<UserOutlined />} className="creator-btn">
                          Profile
                        </Button>
                      </div>
                    </Card>
                  </motion.div>

                  {/* Recent Contributors */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    <Card className="modern-contributors-card">
                      <Title level={4} className="contributors-title">
                        Recent Supporters ({cause.contributors.length})
                      </Title>
                      <div className="contributors-list">
                        {cause.contributors.map((contributor) => (
                          <div key={contributor.id} className="contributor-item">
                            <div className="contributor-main">
                              <Avatar
                                src={contributor.avatar}
                                icon={<UserOutlined />}
                                size={32}
                              />
                              <div className="contributor-info">
                                <div className="contributor-name">
                                  {contributor.anonymous ? "Anonymous" : contributor.name}
                                </div>
                                <div className="contribution-date">
                                  {formatDate(contributor.date)}
                                </div>
                              </div>
                              <div className="contribution-amount">
                                ${contributor.amount.toLocaleString()}
                              </div>
                            </div>
                            {contributor.message && (
                              <div className="contributor-message">
                                "{contributor.message}"
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </Card>
                  </motion.div>
                </div>
              </Col>
            </Row>
          </div>
        </section>

        {/* Donation Modal */}
        <Modal
          title="Make a Donation"
          open={donateModalVisible}
          onOk={handleDonate}
          onCancel={() => setDonateModalVisible(false)}
          okText="Donate"
          cancelText="Cancel"
          className="modern-donation-modal"
        >
          <div className="donation-content">
            <Text className="donation-label">How much would you like to donate?</Text>
            <Input
              size="large"
              placeholder="Enter amount"
              prefix="$"
              value={donateAmount}
              onChange={(e) => setDonateAmount(e.target.value)}
              className="donation-input"
            />
            <div className="preset-amounts">
              <Space wrap>
                {[25, 50, 100, 250].map((amount) => (
                  <Button
                    key={amount}
                    onClick={() => setDonateAmount(amount.toString())}
                    type={donateAmount === amount.toString() ? "primary" : "default"}
                    className="preset-amount-btn"
                  >
                    ${amount}
                  </Button>
                ))}
              </Space>
            </div>
          </div>
        </Modal>
      </div>
    </MainLayout>
  );
}
