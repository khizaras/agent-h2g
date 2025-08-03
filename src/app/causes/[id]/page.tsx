"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Space,
  Tag,
  Avatar,
  Divider,
  Spin,
  Alert,
  Modal,
  Form,
  Input,
  Progress,
  Image,
  message,
  Breadcrumb,
  Statistic,
} from "antd";
import {
  FiHeart,
  FiShare2,
  FiEye,
  FiMapPin,
  FiClock,
  FiUser,
  FiMessageCircle,
  FiEdit3,
  FiPhone,
  FiMail,
  FiCalendar,
  FiUsers,
  FiTarget,
  FiBookOpen,
  FiAward,
  FiPackage,
  FiThermometer,
  FiTruck,
  FiInfo,
  FiAlertCircle,
  FiDollarSign,
  FiMonitor,
  FiChevronRight,
  FiArrowLeft,
  FiFlag,
  FiImage,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";
import SocialShare from "@/components/ui/SocialShare";
import { animations } from "@/config/theme";
import EnrollmentButton from "@/components/enrollment/EnrollmentButton";
import EnrollmentStatus from "@/components/enrollment/EnrollmentStatus";
import CommentsSection from "@/components/comments/CommentsSection";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface CauseDetails {
  id: number;
  title: string;
  description: string;
  short_description?: string;
  category_name: string;
  category_display_name: string;
  cause_type: string;
  priority: string;
  status: string;
  location: string;
  image?: string;
  gallery?: string[];
  created_at: string;
  updated_at: string;
  view_count: number;
  like_count: number;
  special_instructions?: string;
  contact_email?: string;
  contact_phone?: string;
  tags?: string[];
  creator: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    bio?: string;
  };
  categoryDetails?: any;
  comments?: any[];
  activities?: any[];
}

const parseGallery = (gallery: string | string[]) => {
  try {
    if (Array.isArray(gallery)) return gallery;
    if (typeof gallery === "string") {
      const parsed = JSON.parse(gallery);
      return Array.isArray(parsed) ? parsed : [gallery];
    }
    return [];
  } catch (e) {
    return typeof gallery === "string" ? [gallery] : [];
  }
};

export default function CauseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [cause, setCause] = useState<CauseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentForm] = Form.useForm();
  const [enrollmentRefresh, setEnrollmentRefresh] = useState(0);

  useEffect(() => {
    if (params?.id) {
      fetchCauseDetails(params.id as string);
    }
  }, [params?.id]);

  const fetchCauseDetails = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/causes/${id}`);
      const data = await response.json();

      if (data.success) {
        console.log("API Response:", data);
        console.log("Category Details:", data.data.categoryDetails);
        console.log("Cause category:", data.data.cause.category_name);

        const causeData = {
          ...data.data.cause,
          categoryDetails: data.data.categoryDetails,
        };
        setCause(causeData);
        setLikeCount(data.data.cause.like_count || 0);
      } else {
        setError(data.error || "Failed to fetch cause details");
      }
    } catch (err) {
      console.error("Error fetching cause:", err);
      setError("Failed to fetch cause details");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    // TODO: Implement like functionality
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    message.success(liked ? "Removed from favorites" : "Added to favorites");
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: cause?.title,
        text: cause?.short_description || cause?.description,
        url: window.location.href,
      });
    } catch (err) {
      // Fallback to copy URL
      navigator.clipboard.writeText(window.location.href);
      message.success("Link copied to clipboard");
    }
  };

  const handleComment = async (values: any) => {
    try {
      // TODO: Implement comment functionality
      message.success("Comment added successfully");
      setShowCommentModal(false);
      commentForm.resetFields();
    } catch (err) {
      message.error("Failed to add comment");
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "#d13438";
      case "high":
        return "#f7630c";
      case "medium":
        return "#0078d4";
      case "low":
        return "#0078d4";
      default:
        return "#0078d4";
    }
  };

  const getCauseTypeColor = (type: string) => {
    return type === "offered" ? "#0078d4" : "#0078d4";
  };

  const renderCategorySpecificDetails = () => {
    console.log("renderCategorySpecificDetails called");
    console.log("cause:", cause);
    console.log("cause?.categoryDetails:", cause?.categoryDetails);

    if (!cause?.categoryDetails) {
      console.log("No category details found");
      return null;
    }

    const details = cause.categoryDetails;
    const category = cause.category_name;

    console.log("Rendering details for category:", category);
    console.log("Details object:", details);

    switch (category) {
      case "food":
        return renderFoodDetails(details);
      case "clothes":
        return renderClothesDetails(details);
      case "training":
        return renderTrainingDetails(details);
      default:
        console.log("Unknown category:", category);
        return null;
    }
  };

  const renderFoodDetails = (details: any) => (
    <div style={{ marginBottom: 32 }}>
      <Title
        level={4}
        style={{
          marginBottom: 20,
          color: "#323130",
          fontFamily: "'Segoe UI', system-ui, sans-serif",
          fontWeight: 600,
        }}
      >
        <FiTarget style={{ marginRight: 8, color: "#0078d4" }} />
        Food Details
      </Title>

      <Card
        style={{
          borderRadius: 8,
          border: "1px solid #edebe9",
          backgroundColor: "#ffffff",
        }}
        bodyStyle={{ padding: "24px" }}
      >
        <Row gutter={[24, 16]}>
          {details.food_type && (
            <Col xs={24} md={12}>
              <div>
                <Text
                  strong
                  style={{
                    color: "#605e5c",
                    fontSize: 12,
                    textTransform: "uppercase",
                    fontFamily: "'Segoe UI', system-ui, sans-serif",
                  }}
                >
                  Food Type
                </Text>
                <div style={{ marginTop: 4 }}>
                  <Tag
                    style={{
                      textTransform: "capitalize",
                      backgroundColor: "#0078d4",
                      color: "white",
                      border: "none",
                      borderRadius: 4,
                      fontFamily: "'Segoe UI', system-ui, sans-serif",
                    }}
                  >
                    {details.food_type}
                  </Tag>
                </div>
              </div>
            </Col>
          )}

          {details.cuisine_type && (
            <Col xs={24} md={12}>
              <div>
                <Text
                  strong
                  style={{
                    color: "#5f6368",
                    fontSize: 12,
                    textTransform: "uppercase",
                  }}
                >
                  Cuisine
                </Text>
                <div style={{ marginTop: 4 }}>
                  <Text style={{ fontSize: 16, color: "#3c4043" }}>
                    {details.cuisine_type}
                  </Text>
                </div>
              </div>
            </Col>
          )}

          {(details.quantity || details.unit) && (
            <Col xs={24} md={12}>
              <div>
                <Text
                  strong
                  style={{
                    color: "#5f6368",
                    fontSize: 12,
                    textTransform: "uppercase",
                  }}
                >
                  Quantity
                </Text>
                <div style={{ marginTop: 4 }}>
                  <Text style={{ fontSize: 16, color: "#3c4043" }}>
                    {details.quantity} {details.unit}
                  </Text>
                </div>
              </div>
            </Col>
          )}

          {details.serving_size && (
            <Col xs={24} md={12}>
              <div>
                <Text
                  strong
                  style={{
                    color: "#5f6368",
                    fontSize: 12,
                    textTransform: "uppercase",
                  }}
                >
                  Serves
                </Text>
                <div style={{ marginTop: 4 }}>
                  <Text style={{ fontSize: 16, color: "#3c4043" }}>
                    {details.serving_size} people
                  </Text>
                </div>
              </div>
            </Col>
          )}

          {details.temperature_requirements && (
            <Col xs={24} md={12}>
              <div>
                <Text
                  strong
                  style={{
                    color: "#5f6368",
                    fontSize: 12,
                    textTransform: "uppercase",
                  }}
                >
                  <FiThermometer style={{ marginRight: 4 }} />
                  Storage
                </Text>
                <div style={{ marginTop: 4 }}>
                  <Tag color="orange" style={{ textTransform: "capitalize" }}>
                    {details.temperature_requirements.replace("-", " ")}
                  </Tag>
                </div>
              </div>
            </Col>
          )}

          {details.expiration_date && (
            <Col xs={24} md={12}>
              <div>
                <Text
                  strong
                  style={{
                    color: "#5f6368",
                    fontSize: 12,
                    textTransform: "uppercase",
                  }}
                >
                  <FiAlertCircle style={{ marginRight: 4 }} />
                  Expires
                </Text>
                <div style={{ marginTop: 4 }}>
                  <Text style={{ fontSize: 16, color: "#ea4335" }}>
                    {new Date(details.expiration_date).toLocaleDateString()}
                  </Text>
                </div>
              </div>
            </Col>
          )}
        </Row>

        {/* Dietary Information */}
        {(details.vegan ||
          details.vegetarian ||
          details.halal ||
          details.kosher) && (
          <div
            style={{
              marginTop: 20,
              paddingTop: 16,
              borderTop: "1px solid #e8eaed",
            }}
          >
            <Text
              strong
              style={{
                color: "#5f6368",
                fontSize: 12,
                textTransform: "uppercase",
                display: "block",
                marginBottom: 8,
              }}
            >
              Dietary Information
            </Text>
            <Space wrap>
              {details.vegan && (
                <Tag
                  style={{
                    backgroundColor: "#0078d4",
                    color: "white",
                    border: "none",
                  }}
                >
                  Vegan
                </Tag>
              )}
              {details.vegetarian && (
                <Tag
                  style={{
                    backgroundColor: "#0078d4",
                    color: "white",
                    border: "none",
                  }}
                >
                  Vegetarian
                </Tag>
              )}
              {details.halal && <Tag color="blue">Halal</Tag>}
              {details.kosher && <Tag color="blue">Kosher</Tag>}
              {details.organic && <Tag color="orange">Organic</Tag>}
            </Space>
          </div>
        )}

        {details.delivery_available && (
          <div
            style={{
              marginTop: 20,
              paddingTop: 16,
              borderTop: "1px solid #e8eaed",
            }}
          >
            <Space>
              <FiTruck style={{ color: "#34a853" }} />
              <Text style={{ color: "#34a853", fontWeight: 500 }}>
                Delivery available
                {details.delivery_radius &&
                  ` within ${details.delivery_radius}km`}
              </Text>
            </Space>
          </div>
        )}
      </Card>
    </div>
  );

  const renderClothesDetails = (details: any) => (
    <div style={{ marginBottom: 32 }}>
      <Title level={4} style={{ marginBottom: 20, color: "#3c4043" }}>
        <FiPackage style={{ marginRight: 8 }} />
        Clothing Details
      </Title>

      <Card
        style={{
          borderRadius: 12,
          border: "1px solid #e8eaed",
          backgroundColor: "#fafbfc",
        }}
        bodyStyle={{ padding: "20px" }}
      >
        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <div>
              <Text
                strong
                style={{
                  color: "#5f6368",
                  fontSize: 12,
                  textTransform: "uppercase",
                }}
              >
                Type
              </Text>
              <div style={{ marginTop: 4 }}>
                <Tag color="purple" style={{ textTransform: "capitalize" }}>
                  {details.clothes_type?.replace("-", " ")}
                </Tag>
              </div>
            </div>
          </Col>

          <Col xs={24} md={12}>
            <div>
              <Text
                strong
                style={{
                  color: "#5f6368",
                  fontSize: 12,
                  textTransform: "uppercase",
                }}
              >
                Condition
              </Text>
              <div style={{ marginTop: 4 }}>
                <Tag
                  color={
                    details.condition === "new"
                      ? "blue"
                      : details.condition === "like-new"
                        ? "blue"
                        : "orange"
                  }
                >
                  {details.condition?.replace("-", " ")}
                </Tag>
              </div>
            </div>
          </Col>

          <Col xs={24} md={12}>
            <div>
              <Text
                strong
                style={{
                  color: "#5f6368",
                  fontSize: 12,
                  textTransform: "uppercase",
                }}
              >
                Gender & Age
              </Text>
              <div style={{ marginTop: 4 }}>
                <Space>
                  <Tag color="cyan">{details.gender}</Tag>
                  <Tag color="geekblue">{details.age_group}</Tag>
                </Space>
              </div>
            </div>
          </Col>

          {details.size_range && Array.isArray(details.size_range) && (
            <Col xs={24} md={12}>
              <div>
                <Text
                  strong
                  style={{
                    color: "#5f6368",
                    fontSize: 12,
                    textTransform: "uppercase",
                  }}
                >
                  Sizes Available
                </Text>
                <div style={{ marginTop: 4 }}>
                  <Space wrap>
                    {details.size_range.map((size: string, index: number) => (
                      <Tag key={index} color="volcano">
                        {size}
                      </Tag>
                    ))}
                  </Space>
                </div>
              </div>
            </Col>
          )}

          {details.season && (
            <Col xs={24} md={12}>
              <div>
                <Text
                  strong
                  style={{
                    color: "#5f6368",
                    fontSize: 12,
                    textTransform: "uppercase",
                  }}
                >
                  Season
                </Text>
                <div style={{ marginTop: 4 }}>
                  <Tag color="magenta" style={{ textTransform: "capitalize" }}>
                    {details.season?.replace("-", " ")}
                  </Tag>
                </div>
              </div>
            </Col>
          )}

          {details.quantity && (
            <Col xs={24} md={12}>
              <div>
                <Text
                  strong
                  style={{
                    color: "#5f6368",
                    fontSize: 12,
                    textTransform: "uppercase",
                  }}
                >
                  <FiPackage style={{ marginRight: 4 }} />
                  Quantity
                </Text>
                <div style={{ marginTop: 4 }}>
                  <Text style={{ fontSize: 16, color: "#3c4043" }}>
                    {details.quantity} items
                  </Text>
                </div>
              </div>
            </Col>
          )}
        </Row>

        {details.delivery_available && (
          <div
            style={{
              marginTop: 20,
              paddingTop: 16,
              borderTop: "1px solid #e8eaed",
            }}
          >
            <Space>
              <FiTruck style={{ color: "#34a853" }} />
              <Text style={{ color: "#34a853", fontWeight: 500 }}>
                Delivery available
                {details.delivery_radius &&
                  ` within ${details.delivery_radius}km`}
              </Text>
            </Space>
          </div>
        )}
      </Card>
    </div>
  );

  const renderTrainingDetails = (details: any) => (
    <div style={{ marginBottom: 32 }}>
      <Title level={4} style={{ marginBottom: 20, color: "#3c4043" }}>
        <FiBookOpen style={{ marginRight: 8 }} />
        Training Details
      </Title>

      <Card
        style={{
          borderRadius: 12,
          border: "1px solid #e8eaed",
          backgroundColor: "#fafbfc",
        }}
        bodyStyle={{ padding: "20px" }}
      >
        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <div>
              <Text
                strong
                style={{
                  color: "#5f6368",
                  fontSize: 12,
                  textTransform: "uppercase",
                }}
              >
                Training Type
              </Text>
              <div style={{ marginTop: 4 }}>
                <Tag color="blue" style={{ textTransform: "capitalize" }}>
                  {details.training_type}
                </Tag>
              </div>
            </div>
          </Col>

          <Col xs={24} md={12}>
            <div>
              <Text
                strong
                style={{
                  color: "#5f6368",
                  fontSize: 12,
                  textTransform: "uppercase",
                }}
              >
                Skill Level
              </Text>
              <div style={{ marginTop: 4 }}>
                <Tag
                  style={{
                    backgroundColor: "#0078d4",
                    color: "white",
                    border: "none",
                  }}
                >
                  {details.skill_level?.replace("-", " ")}
                </Tag>
              </div>
            </div>
          </Col>

          <Col xs={24} md={12}>
            <div>
              <Text
                strong
                style={{
                  color: "#5f6368",
                  fontSize: 12,
                  textTransform: "uppercase",
                }}
              >
                <FiClock style={{ marginRight: 4 }} />
                Duration
              </Text>
              <div style={{ marginTop: 4 }}>
                <Text style={{ fontSize: 16, color: "#3c4043" }}>
                  {details.duration_hours} hours
                  {details.number_of_sessions > 1 &&
                    ` (${details.number_of_sessions} sessions)`}
                </Text>
              </div>
            </div>
          </Col>

          <Col xs={24} md={12}>
            <div>
              <Text
                strong
                style={{
                  color: "#5f6368",
                  fontSize: 12,
                  textTransform: "uppercase",
                }}
              >
                <FiUsers style={{ marginRight: 4 }} />
                Participants
              </Text>
              <div style={{ marginTop: 4 }}>
                <Text style={{ fontSize: 16, color: "#3c4043" }}>
                  {details.current_participants || 0} /{" "}
                  {details.max_participants} enrolled
                </Text>
                <Progress
                  percent={Math.round(
                    ((details.current_participants || 0) /
                      details.max_participants) *
                      100,
                  )}
                  size="small"
                  style={{ marginTop: 4 }}
                />
              </div>
            </div>
          </Col>

          {(details.start_date || details.end_date) && (
            <Col xs={24} md={12}>
              <div>
                <Text
                  strong
                  style={{
                    color: "#5f6368",
                    fontSize: 12,
                    textTransform: "uppercase",
                  }}
                >
                  <FiCalendar style={{ marginRight: 4 }} />
                  Schedule
                </Text>
                <div style={{ marginTop: 4 }}>
                  <Text style={{ fontSize: 16, color: "#3c4043" }}>
                    {details.start_date &&
                      new Date(details.start_date).toLocaleDateString()}
                    {details.start_date && details.end_date && " - "}
                    {details.end_date &&
                      new Date(details.end_date).toLocaleDateString()}
                  </Text>
                </div>
              </div>
            </Col>
          )}

          <Col xs={24} md={12}>
            <div>
              <Text
                strong
                style={{
                  color: "#5f6368",
                  fontSize: 12,
                  textTransform: "uppercase",
                }}
              >
                <FiMonitor style={{ marginRight: 4 }} />
                Delivery Method
              </Text>
              <div style={{ marginTop: 4 }}>
                <Tag color="cyan" style={{ textTransform: "capitalize" }}>
                  {details.delivery_method?.replace("-", " ")}
                </Tag>
              </div>
            </div>
          </Col>
        </Row>

        {/* Topics */}
        {details.topics &&
          Array.isArray(details.topics) &&
          details.topics.length > 0 && (
            <div
              style={{
                marginTop: 20,
                paddingTop: 16,
                borderTop: "1px solid #e8eaed",
              }}
            >
              <Text
                strong
                style={{
                  color: "#5f6368",
                  fontSize: 12,
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: 8,
                }}
              >
                Topics Covered
              </Text>
              <Space wrap>
                {details.topics.map((topic: string, index: number) => (
                  <Tag key={index} color="processing">
                    {topic}
                  </Tag>
                ))}
              </Space>
            </div>
          )}

        {/* Instructor */}
        {details.instructor_name && (
          <div
            style={{
              marginTop: 20,
              paddingTop: 16,
              borderTop: "1px solid #e8eaed",
            }}
          >
            <Text
              strong
              style={{
                color: "#5f6368",
                fontSize: 12,
                textTransform: "uppercase",
                display: "block",
                marginBottom: 8,
              }}
            >
              Instructor
            </Text>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Avatar icon={<FiUser />} size={40} />
              <div>
                <Text
                  strong
                  style={{ fontSize: 16, color: "#3c4043", display: "block" }}
                >
                  {details.instructor_name}
                </Text>
                {details.instructor_email && (
                  <Text style={{ fontSize: 14, color: "#5f6368" }}>
                    {details.instructor_email}
                  </Text>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Prerequisites */}
        {details.prerequisites && (
          <div
            style={{
              marginTop: 20,
              paddingTop: 16,
              borderTop: "1px solid #e8eaed",
            }}
          >
            <Text
              strong
              style={{
                color: "#5f6368",
                fontSize: 12,
                textTransform: "uppercase",
                display: "block",
                marginBottom: 8,
              }}
            >
              Prerequisites
            </Text>
            <div
              style={{
                backgroundColor: "#fff3cd",
                padding: 12,
                borderRadius: 6,
                border: "1px solid #ffeaa7",
              }}
            >
              <MarkdownRenderer content={details.prerequisites} />
            </div>
          </div>
        )}

        {/* Curriculum */}
        {details.curriculum && (
          <div
            style={{
              marginTop: 20,
              paddingTop: 16,
              borderTop: "1px solid #e8eaed",
            }}
          >
            <Text
              strong
              style={{
                color: "#5f6368",
                fontSize: 12,
                textTransform: "uppercase",
                display: "block",
                marginBottom: 8,
              }}
            >
              <FiBookOpen style={{ marginRight: 4 }} />
              Curriculum
            </Text>
            <div
              style={{
                backgroundColor: "#f0f8ff",
                padding: 16,
                borderRadius: 8,
                border: "1px solid #b3d9ff",
              }}
            >
              <MarkdownRenderer content={details.curriculum} />
            </div>
          </div>
        )}

        {/* Price & Certification */}
        <div
          style={{
            marginTop: 20,
            paddingTop: 16,
            borderTop: "1px solid #e8eaed",
          }}
        >
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Space>
                <FiDollarSign
                  style={{ color: details.is_free ? "#34a853" : "#1a73e8" }}
                />
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 500,
                    color: details.is_free ? "#34a853" : "#1a73e8",
                  }}
                >
                  {details.is_free ? "Free" : `$${details.price}`}
                </Text>
              </Space>
            </Col>
            {details.certification_provided && (
              <Col xs={24} md={12}>
                <Space>
                  <FiAward style={{ color: "#ea4335" }} />
                  <Text
                    style={{ fontSize: 16, fontWeight: 500, color: "#ea4335" }}
                  >
                    Certificate Provided
                  </Text>
                </Space>
              </Col>
            )}
          </Row>
        </div>
      </Card>
    </div>
  );

  if (loading) {
    return (
      <MainLayout>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
          }}
        >
          <Spin size="large" />
        </div>
      </MainLayout>
    );
  }

  if (error || !cause) {
    return (
      <MainLayout>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
          <Alert
            message="Error"
            description={error || "Cause not found"}
            type="error"
            showIcon
            action={
              <Button onClick={() => router.push("/causes")}>
                Back to Causes
              </Button>
            }
          />
        </div>
      </MainLayout>
    );
  }

  const isOwner = session?.user?.id === cause.creator?.id?.toString();
  const gallery = parseGallery(cause.gallery || []);

  return (
    <MainLayout>
      <div style={{ minHeight: "100vh", backgroundColor: "#faf9f8" }}>
        {/* Microsoft-style breadcrumb navigation */}
        <div
          style={{
            backgroundColor: "white",
            borderBottom: "1px solid #edebe9",
            padding: "16px 0",
          }}
        >
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Button
                type="text"
                icon={<FiArrowLeft />}
                onClick={() => router.back()}
                style={{
                  marginRight: 16,
                  color: "#0078d4",
                  fontSize: 14,
                  fontFamily: "'Segoe UI', system-ui, sans-serif",
                }}
              >
                Back
              </Button>
              <Breadcrumb
                separator={
                  <FiChevronRight style={{ color: "#8a8886", fontSize: 12 }} />
                }
                items={[
                  {
                    title: (
                      <Link
                        href="/"
                        style={{
                          color: "#0078d4",
                          textDecoration: "none",
                          fontFamily: "'Segoe UI', system-ui, sans-serif",
                        }}
                      >
                        Home
                      </Link>
                    ),
                  },
                  {
                    title: (
                      <Link
                        href="/causes"
                        style={{
                          color: "#0078d4",
                          textDecoration: "none",
                          fontFamily: "'Segoe UI', system-ui, sans-serif",
                        }}
                      >
                        Initiatives
                      </Link>
                    ),
                  },
                  {
                    title: (
                      <span
                        style={{
                          color: "#323130",
                          fontFamily: "'Segoe UI', system-ui, sans-serif",
                        }}
                      >
                        {cause.title}
                      </span>
                    ),
                  },
                ]}
                style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>
          <Row gutter={[32, 32]}>
            {/* Left Column - Main Content */}
            <Col xs={24} lg={16}>
              <motion.div {...animations.slideUp}>
                {/* Microsoft-style hero image */}
                {cause.image && (
                  <Card
                    style={{
                      marginBottom: 32,
                      borderRadius: 8,
                      overflow: "hidden",
                      border: "1px solid #edebe9",
                      boxShadow:
                        "0 1.6px 3.6px 0 rgba(0,0,0,.132), 0 0.3px 0.9px 0 rgba(0,0,0,.108)",
                    }}
                    bodyStyle={{ padding: 0 }}
                  >
                    <div style={{ position: "relative" }}>
                      <Image
                        src={cause.image}
                        alt={cause.title}
                        width="100%"
                        height={320}
                        style={{ objectFit: "cover" }}
                        preview={false}
                      />

                      {/* Microsoft-style overlay badges */}
                      <div
                        style={{
                          position: "absolute",
                          top: 16,
                          left: 16,
                          display: "flex",
                          gap: 8,
                          flexWrap: "wrap",
                        }}
                      >
                        <Tag
                          style={{
                            backgroundColor: "#0078d4",
                            color: "white",
                            border: "none",
                            borderRadius: 4,
                            padding: "4px 8px",
                            fontSize: 11,
                            fontWeight: 600,
                            fontFamily: "'Segoe UI', system-ui, sans-serif",
                          }}
                        >
                          {cause.category_display_name}
                        </Tag>
                        <Tag
                          style={{
                            backgroundColor: getCauseTypeColor(
                              cause.cause_type,
                            ),
                            color: "white",
                            border: "none",
                            borderRadius: 4,
                            padding: "4px 8px",
                            fontSize: 11,
                            fontWeight: 600,
                            fontFamily: "'Segoe UI', system-ui, sans-serif",
                          }}
                        >
                          {cause.cause_type === "offered"
                            ? "OFFERING HELP"
                            : "SEEKING HELP"}
                        </Tag>
                        {cause.priority !== "medium" && (
                          <Tag
                            style={{
                              backgroundColor: getPriorityColor(cause.priority),
                              color: "white",
                              border: "none",
                              borderRadius: 4,
                              padding: "4px 8px",
                              fontSize: 11,
                              fontWeight: 600,
                              fontFamily: "'Segoe UI', system-ui, sans-serif",
                            }}
                          >
                            {cause.priority.toUpperCase()}
                          </Tag>
                        )}
                      </div>
                    </div>
                  </Card>
                )}

                {/* Microsoft-style main content card */}
                <Card
                  style={{
                    borderRadius: 8,
                    border: "1px solid #edebe9",
                    boxShadow:
                      "0 1.6px 3.6px 0 rgba(0,0,0,.132), 0 0.3px 0.9px 0 rgba(0,0,0,.108)",
                  }}
                  bodyStyle={{ padding: "32px" }}
                >
                  {/* Microsoft-style header */}
                  <div style={{ marginBottom: 32 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: 20,
                      }}
                    >
                      <Title
                        level={1}
                        style={{
                          margin: 0,
                          fontSize: "32px",
                          fontWeight: 600,
                          color: "#323130",
                          lineHeight: 1.25,
                          fontFamily: "'Segoe UI', system-ui, sans-serif",
                        }}
                      >
                        {cause.title}
                      </Title>

                      {/* Microsoft-style action buttons */}
                      <Space size={8}>
                        <Button
                          type={liked ? "primary" : "default"}
                          icon={<FiHeart />}
                          onClick={handleLike}
                          style={{
                            borderRadius: 4,
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            height: 32,
                            fontSize: 14,
                            fontWeight: 600,
                            fontFamily: "'Segoe UI', system-ui, sans-serif",
                            backgroundColor: liked ? "#0078d4" : undefined,
                            borderColor: liked ? "#0078d4" : "#8a8886",
                          }}
                        >
                          {likeCount}
                        </Button>

                        <SocialShare
                          url={`${typeof window !== "undefined" ? window.location.origin : ""}/causes/${cause.id}`}
                          title={cause.title}
                          description={
                            cause.short_description ||
                            cause.description.substring(0, 160) + "..."
                          }
                          image={cause.image}
                          hashtags={[
                            "Hands2gether",
                            "Charity",
                            "Community",
                            cause.category_display_name || cause.category_name,
                            cause.location.split(",")[0],
                          ]}
                        />

                        {isOwner && (
                          <Button
                            icon={<FiEdit3 />}
                            onClick={() =>
                              router.push(`/causes/${cause.id}/edit`)
                            }
                            style={{
                              borderRadius: 4,
                              height: 32,
                              borderColor: "#8a8886",
                              fontFamily: "'Segoe UI', system-ui, sans-serif",
                            }}
                          >
                            Edit
                          </Button>
                        )}
                      </Space>
                    </div>

                    {/* Microsoft-style meta information */}
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 20,
                        color: "#605e5c",
                        fontSize: 14,
                      }}
                    >
                      <Space size={6}>
                        <FiMapPin size={14} style={{ color: "#8a8886" }} />
                        <Text
                          style={{
                            color: "#605e5c",
                            fontFamily: "'Segoe UI', system-ui, sans-serif",
                          }}
                        >
                          {cause.location}
                        </Text>
                      </Space>

                      <Space size={6}>
                        <FiClock size={14} style={{ color: "#8a8886" }} />
                        <Text
                          style={{
                            color: "#605e5c",
                            fontFamily: "'Segoe UI', system-ui, sans-serif",
                          }}
                        >
                          {new Date(cause.created_at).toLocaleDateString()}
                        </Text>
                      </Space>

                      <Space size={6}>
                        <FiEye size={14} style={{ color: "#8a8886" }} />
                        <Text
                          style={{
                            color: "#605e5c",
                            fontFamily: "'Segoe UI', system-ui, sans-serif",
                          }}
                        >
                          {cause.view_count} views
                        </Text>
                      </Space>
                    </div>
                  </div>

                  {/* Microsoft-style description */}
                  <div style={{ marginBottom: 32 }}>
                    <MarkdownRenderer
                      content={cause.description}
                      style={{
                        fontSize: 16,
                        lineHeight: 1.43,
                        color: "#323130",
                        fontFamily: "'Segoe UI', system-ui, sans-serif",
                      }}
                    />
                  </div>

                  {/* Microsoft-style special instructions */}
                  {cause.special_instructions && (
                    <div style={{ marginBottom: 32 }}>
                      <Title
                        level={4}
                        style={{
                          marginBottom: 16,
                          color: "#323130",
                          fontFamily: "'Segoe UI', system-ui, sans-serif",
                          fontWeight: 600,
                        }}
                      >
                        <FiInfo style={{ marginRight: 8, color: "#0078d4" }} />
                        Special Instructions
                      </Title>
                      <div
                        style={{
                          padding: 20,
                          backgroundColor: "#f3f2f1",
                          borderRadius: 8,
                          border: "1px solid #edebe9",
                        }}
                      >
                        <MarkdownRenderer
                          content={cause.special_instructions}
                          style={{
                            fontFamily: "'Segoe UI', system-ui, sans-serif",
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Category-Specific Details */}
                  {renderCategorySpecificDetails()}

                  {/* Enrollment Status - Only for Training */}
                  {cause.category_name === "training" && (
                    <EnrollmentStatus
                      causeId={cause.id}
                      refreshTrigger={enrollmentRefresh}
                    />
                  )}

                  {/* Comments Section */}
                  <div style={{ marginTop: 32 }}>
                    <CommentsSection causeId={cause.id} allowComments={true} />
                  </div>

                  {/* Tags */}
                  {cause.tags && cause.tags.length > 0 && (
                    <div style={{ marginBottom: 32 }}>
                      <Title
                        level={4}
                        style={{ marginBottom: 16, color: "#3c4043" }}
                      >
                        Tags
                      </Title>
                      <div
                        style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
                      >
                        {cause.tags.map((tag, index) => (
                          <Tag
                            key={index}
                            style={{
                              borderRadius: 16,
                              padding: "4px 12px",
                              border: "1px solid #1a73e8",
                              color: "#1a73e8",
                              backgroundColor: "#f0f4ff",
                            }}
                          >
                            {tag}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Gallery */}
                  {gallery.length > 0 && (
                    <div style={{ marginBottom: 32 }}>
                      <Title
                        level={4}
                        style={{ marginBottom: 16, color: "#3c4043" }}
                      >
                        <FiImage style={{ marginRight: 8 }} />
                        Gallery
                      </Title>
                      <Row gutter={[16, 16]}>
                        {gallery.slice(0, 6).map((img, index) => (
                          <Col xs={12} sm={8} md={6} key={index}>
                            <Image
                              src={img}
                              alt={`Gallery ${index + 1}`}
                              width="100%"
                              height={120}
                              style={{
                                objectFit: "cover",
                                borderRadius: 8,
                              }}
                            />
                          </Col>
                        ))}
                      </Row>
                    </div>
                  )}

                  {/* Microsoft-style involvement section with dynamic buttons */}
                  <div style={{ marginBottom: 32 }}>
                    <Title
                      level={4}
                      style={{
                        marginBottom: 20,
                        color: "#323130",
                        fontFamily: "'Segoe UI', system-ui, sans-serif",
                        fontWeight: 600,
                      }}
                    >
                      Get Involved
                    </Title>
                    <Space size="large" wrap>
                      {/* Dynamic primary action button based on category */}
                      {cause.category_name === "training" ? (
                        <EnrollmentButton
                          causeId={cause.id}
                          courseName={cause.title}
                          maxParticipants={
                            cause.categoryDetails?.max_participants || 0
                          }
                          currentParticipants={
                            cause.categoryDetails?.current_participants || 0
                          }
                          enrollmentStatus="available"
                          onEnrollmentSuccess={() => {
                            setEnrollmentRefresh((prev) => prev + 1);
                            fetchCauseDetails(params.id as string);
                          }}
                        />
                      ) : cause.category_name === "food" ||
                        cause.category_name === "clothes" ? (
                        <Button
                          type="primary"
                          size="large"
                          icon={<FiMail />}
                          onClick={() =>
                            (window.location.href = `mailto:${cause.contact_email || cause.creator?.email}?subject=Interest in ${cause.title}`)
                          }
                          style={{
                            borderRadius: 4,
                            height: 40,
                            padding: "0 24px",
                            backgroundColor: "#0078d4",
                            borderColor: "#0078d4",
                            fontWeight: 600,
                            fontSize: 14,
                            fontFamily: "'Segoe UI', system-ui, sans-serif",
                          }}
                        >
                          Contact
                        </Button>
                      ) : (
                        <Button
                          type="primary"
                          size="large"
                          icon={<FiMessageCircle />}
                          onClick={() => setShowCommentModal(true)}
                          style={{
                            borderRadius: 4,
                            height: 40,
                            padding: "0 24px",
                            backgroundColor: "#0078d4",
                            borderColor: "#0078d4",
                            fontWeight: 600,
                            fontSize: 14,
                            fontFamily: "'Segoe UI', system-ui, sans-serif",
                          }}
                        >
                          Get Involved
                        </Button>
                      )}

                      {/* Secondary action: Discussion for all categories */}
                      <Button
                        size="large"
                        icon={<FiMessageCircle />}
                        onClick={() => setShowCommentModal(true)}
                        style={{
                          borderRadius: 4,
                          height: 40,
                          padding: "0 24px",
                          borderColor: "#8a8886",
                          fontWeight: 600,
                          fontSize: 14,
                          fontFamily: "'Segoe UI', system-ui, sans-serif",
                        }}
                      >
                        Join Discussion
                      </Button>

                      {/* Contact options for training category or when contact info available */}
                      {cause.category_name === "training" &&
                        (cause.contact_email || cause.creator?.email) && (
                          <Button
                            size="large"
                            icon={<FiMail />}
                            onClick={() =>
                              (window.location.href = `mailto:${cause.contact_email || cause.creator?.email}?subject=Question about ${cause.title}`)
                            }
                            style={{
                              borderRadius: 4,
                              height: 40,
                              padding: "0 24px",
                              borderColor: "#8a8886",
                              fontWeight: 600,
                              fontSize: 14,
                              fontFamily: "'Segoe UI', system-ui, sans-serif",
                            }}
                          >
                            Contact Instructor
                          </Button>
                        )}

                      {cause.contact_phone && (
                        <Button
                          size="large"
                          icon={<FiPhone />}
                          onClick={() =>
                            (window.location.href = `tel:${cause.contact_phone}`)
                          }
                          style={{
                            borderRadius: 4,
                            height: 40,
                            padding: "0 24px",
                            borderColor: "#8a8886",
                            color: "#0078d4",
                            fontWeight: 600,
                            fontSize: 14,
                            fontFamily: "'Segoe UI', system-ui, sans-serif",
                          }}
                        >
                          Call Now
                        </Button>
                      )}
                    </Space>
                  </div>
                </Card>
              </motion.div>
            </Col>

            {/* Microsoft-style sidebar */}
            <Col xs={24} lg={8}>
              <motion.div
                {...animations.slideUp}
                style={{ transitionDelay: "0.2s" }}
              >
                {/* Microsoft-style creator card */}
                <Card
                  style={{
                    marginBottom: 24,
                    borderRadius: 8,
                    border: "1px solid #edebe9",
                    boxShadow:
                      "0 1.6px 3.6px 0 rgba(0,0,0,.132), 0 0.3px 0.9px 0 rgba(0,0,0,.108)",
                  }}
                  bodyStyle={{ padding: "24px" }}
                >
                  <div style={{ textAlign: "center" }}>
                    <Avatar
                      src={cause.creator?.avatar}
                      icon={<FiUser />}
                      size={64}
                      style={{
                        marginBottom: 16,
                        border: "2px solid #edebe9",
                      }}
                    />
                    <Title
                      level={4}
                      style={{
                        marginBottom: 8,
                        color: "#323130",
                        fontFamily: "'Segoe UI', system-ui, sans-serif",
                        fontWeight: 600,
                      }}
                    >
                      {cause.creator?.name || "Anonymous"}
                    </Title>
                    <Text
                      style={{
                        color: "#605e5c",
                        display: "block",
                        marginBottom: 16,
                        fontSize: 14,
                        fontFamily: "'Segoe UI', system-ui, sans-serif",
                      }}
                    >
                      Initiative Creator
                    </Text>
                    {cause.creator?.bio && (
                      <Paragraph
                        style={{
                          color: "#323130",
                          fontSize: 14,
                          textAlign: "center",
                          marginBottom: 20,
                          fontFamily: "'Segoe UI', system-ui, sans-serif",
                        }}
                      >
                        {cause.creator.bio}
                      </Paragraph>
                    )}
                    <Space
                      direction="vertical"
                      style={{ width: "100%" }}
                      size={12}
                    >
                      <Button
                        type="primary"
                        block
                        icon={<FiMail />}
                        onClick={() =>
                          (window.location.href = `mailto:${cause.creator?.email}`)
                        }
                        style={{
                          borderRadius: 4,
                          height: 40,
                          backgroundColor: "#0078d4",
                          borderColor: "#0078d4",
                          fontWeight: 600,
                          fontSize: 14,
                          fontFamily: "'Segoe UI', system-ui, sans-serif",
                        }}
                      >
                        Send Message
                      </Button>
                    </Space>
                  </div>
                </Card>

                {/* Microsoft-style stats card */}
                <Card
                  style={{
                    marginBottom: 24,
                    borderRadius: 8,
                    border: "1px solid #edebe9",
                    boxShadow:
                      "0 1.6px 3.6px 0 rgba(0,0,0,.132), 0 0.3px 0.9px 0 rgba(0,0,0,.108)",
                  }}
                  bodyStyle={{ padding: "24px" }}
                >
                  <Title
                    level={4}
                    style={{
                      marginBottom: 20,
                      color: "#323130",
                      fontFamily: "'Segoe UI', system-ui, sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    Impact Metrics
                  </Title>
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Statistic
                        title="Views"
                        value={cause.view_count}
                        prefix={<FiEye style={{ color: "#0078d4" }} />}
                        valueStyle={{
                          color: "#323130",
                          fontSize: "20px",
                          fontFamily: "'Segoe UI', system-ui, sans-serif",
                          fontWeight: 600,
                        }}
                        style={{
                          textAlign: "center",
                        }}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="Supporters"
                        value={likeCount}
                        prefix={<FiHeart style={{ color: "#d13438" }} />}
                        valueStyle={{
                          color: "#323130",
                          fontSize: "20px",
                          fontFamily: "'Segoe UI', system-ui, sans-serif",
                          fontWeight: 600,
                        }}
                        style={{
                          textAlign: "center",
                        }}
                      />
                    </Col>
                  </Row>
                </Card>

                {/* Enrollment Analytics Section - Only for Training Categories */}
                {cause.category_name === "training" &&
                  cause.categoryDetails && (
                    <Card
                      style={{
                        marginBottom: 24,
                        borderRadius: 8,
                        border: "1px solid #edebe9",
                        boxShadow:
                          "0 1.6px 3.6px 0 rgba(0,0,0,.132), 0 0.3px 0.9px 0 rgba(0,0,0,.108)",
                      }}
                      bodyStyle={{ padding: "24px" }}
                    >
                      <Title
                        level={4}
                        style={{
                          marginBottom: 20,
                          color: "#323130",
                          fontFamily: "'Segoe UI', system-ui, sans-serif",
                          fontWeight: 600,
                        }}
                      >
                        <FiUsers style={{ marginRight: 8, color: "#0078d4" }} />
                        Enrollment Analytics
                      </Title>

                      {/* Enrollment Progress */}
                      <div style={{ marginBottom: 24 }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 8,
                          }}
                        >
                          <Text
                            style={{
                              fontWeight: 600,
                              color: "#323130",
                              fontFamily: "'Segoe UI', system-ui, sans-serif",
                            }}
                          >
                            Enrollment Progress
                          </Text>
                          <Text
                            style={{
                              fontSize: 14,
                              color: "#605e5c",
                              fontFamily: "'Segoe UI', system-ui, sans-serif",
                            }}
                          >
                            {cause.categoryDetails.current_participants || 0} /{" "}
                            {cause.categoryDetails.max_participants}
                          </Text>
                        </div>
                        <Progress
                          percent={Math.round(
                            ((cause.categoryDetails.current_participants || 0) /
                              cause.categoryDetails.max_participants) *
                              100,
                          )}
                          strokeColor={{
                            "0%": "#0078d4",
                            "100%": "#40e0d0",
                          }}
                          style={{ marginBottom: 8 }}
                        />
                        <Text
                          style={{
                            fontSize: 12,
                            color: "#8a8886",
                            fontFamily: "'Segoe UI', system-ui, sans-serif",
                          }}
                        >
                          {cause.categoryDetails.max_participants -
                            (cause.categoryDetails.current_participants ||
                              0)}{" "}
                          spots remaining
                        </Text>
                      </div>

                      {/* Key Metrics */}
                      <Row gutter={[8, 8]} style={{ marginBottom: 20 }}>
                        <Col span={12}>
                          <div
                            style={{
                              textAlign: "center",
                              padding: "12px",
                              backgroundColor: "#f3f2f1",
                              borderRadius: 6,
                            }}
                          >
                            <div
                              style={{
                                fontSize: "18px",
                                fontWeight: 600,
                                color: "#0078d4",
                                fontFamily: "'Segoe UI', system-ui, sans-serif",
                              }}
                            >
                              {cause.categoryDetails.duration_hours}h
                            </div>
                            <div
                              style={{
                                fontSize: "11px",
                                color: "#605e5c",
                                fontFamily: "'Segoe UI', system-ui, sans-serif",
                              }}
                            >
                              Duration
                            </div>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div
                            style={{
                              textAlign: "center",
                              padding: "12px",
                              backgroundColor: "#f3f2f1",
                              borderRadius: 6,
                            }}
                          >
                            <div
                              style={{
                                fontSize: "18px",
                                fontWeight: 600,
                                color: cause.categoryDetails.is_free
                                  ? "#107c10"
                                  : "#f7630c",
                                fontFamily: "'Segoe UI', system-ui, sans-serif",
                              }}
                            >
                              {cause.categoryDetails.is_free
                                ? "Free"
                                : `$${cause.categoryDetails.price}`}
                            </div>
                            <div
                              style={{
                                fontSize: "11px",
                                color: "#605e5c",
                                fontFamily: "'Segoe UI', system-ui, sans-serif",
                              }}
                            >
                              Price
                            </div>
                          </div>
                        </Col>
                      </Row>

                      {/* Enrolled Users Preview */}
                      {cause.categoryDetails.current_participants > 0 && (
                        <div style={{ marginBottom: 16 }}>
                          <Text
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              color: "#605e5c",
                              display: "block",
                              marginBottom: 8,
                              fontFamily: "'Segoe UI', system-ui, sans-serif",
                            }}
                          >
                            RECENT ENROLLMENTS
                          </Text>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <Avatar.Group maxCount={3} size="small">
                              {/* Mock enrolled users - in real implementation, these would come from API */}
                              <Avatar style={{ backgroundColor: "#0078d4" }}>
                                JD
                              </Avatar>
                              <Avatar style={{ backgroundColor: "#107c10" }}>
                                AS
                              </Avatar>
                              <Avatar style={{ backgroundColor: "#d13438" }}>
                                MK
                              </Avatar>
                            </Avatar.Group>
                            <Text
                              style={{
                                fontSize: 11,
                                color: "#8a8886",
                                fontFamily: "'Segoe UI', system-ui, sans-serif",
                              }}
                            >
                              and{" "}
                              {Math.max(
                                0,
                                (cause.categoryDetails.current_participants ||
                                  0) - 3,
                              )}{" "}
                              others
                            </Text>
                          </div>
                        </div>
                      )}

                      {/* Achievement Badge */}
                      {cause.categoryDetails.certification_provided && (
                        <div
                          style={{
                            backgroundColor: "#fff3cd",
                            border: "1px solid #ffeaa7",
                            borderRadius: 6,
                            padding: "12px",
                            textAlign: "center",
                          }}
                        >
                          <FiAward
                            style={{ color: "#f7630c", marginRight: 6 }}
                          />
                          <Text
                            style={{
                              fontSize: 12,
                              color: "#f7630c",
                              fontWeight: 600,
                              fontFamily: "'Segoe UI', system-ui, sans-serif",
                            }}
                          >
                            Certificate Available
                          </Text>
                        </div>
                      )}
                    </Card>
                  )}

                {/* Microsoft-style quick actions */}
                <Card
                  style={{
                    borderRadius: 8,
                    border: "1px solid #edebe9",
                    boxShadow:
                      "0 1.6px 3.6px 0 rgba(0,0,0,.132), 0 0.3px 0.9px 0 rgba(0,0,0,.108)",
                  }}
                  bodyStyle={{ padding: "24px" }}
                >
                  <Title
                    level={4}
                    style={{
                      marginBottom: 20,
                      color: "#323130",
                      fontFamily: "'Segoe UI', system-ui, sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    Quick Actions
                  </Title>
                  <Space
                    direction="vertical"
                    style={{ width: "100%" }}
                    size={12}
                  >
                    <Button
                      block
                      icon={<FiMessageCircle />}
                      onClick={() => setShowCommentModal(true)}
                      style={{
                        borderRadius: 4,
                        height: 40,
                        borderColor: "#8a8886",
                        fontFamily: "'Segoe UI', system-ui, sans-serif",
                        fontWeight: 600,
                      }}
                    >
                      Join Discussion
                    </Button>
                    <Button
                      block
                      icon={<FiShare2 />}
                      onClick={handleShare}
                      style={{
                        borderRadius: 4,
                        height: 40,
                        borderColor: "#8a8886",
                        fontFamily: "'Segoe UI', system-ui, sans-serif",
                        fontWeight: 600,
                      }}
                    >
                      Share Initiative
                    </Button>
                    <Button
                      block
                      icon={<FiFlag />}
                      style={{
                        borderRadius: 4,
                        height: 40,
                        borderColor: "#8a8886",
                        color: "#d13438",
                        fontFamily: "'Segoe UI', system-ui, sans-serif",
                        fontWeight: 600,
                      }}
                    >
                      Report Issue
                    </Button>
                  </Space>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </div>

        {/* Microsoft-style comment modal */}
        <Modal
          title={
            <span
              style={{
                fontFamily: "'Segoe UI', system-ui, sans-serif",
                fontWeight: 600,
                color: "#323130",
              }}
            >
              Join the Discussion
            </span>
          }
          open={showCommentModal}
          onCancel={() => setShowCommentModal(false)}
          footer={null}
          width={500}
          styles={{
            content: {
              borderRadius: 8,
              fontFamily: "'Segoe UI', system-ui, sans-serif",
            },
          }}
        >
          <Form
            form={commentForm}
            onFinish={handleComment}
            layout="vertical"
            style={{ marginTop: 24 }}
          >
            <Form.Item
              name="comment"
              label={
                <span
                  style={{
                    fontFamily: "'Segoe UI', system-ui, sans-serif",
                    fontWeight: 600,
                    color: "#323130",
                  }}
                >
                  Your Comment
                </span>
              }
              rules={[{ required: true, message: "Please enter your comment" }]}
            >
              <TextArea
                rows={4}
                placeholder="Share your thoughts about this initiative..."
                style={{
                  borderRadius: 4,
                  borderColor: "#8a8886",
                  fontFamily: "'Segoe UI', system-ui, sans-serif",
                }}
              />
            </Form.Item>
            <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
              <Space>
                <Button
                  onClick={() => setShowCommentModal(false)}
                  style={{
                    borderRadius: 4,
                    borderColor: "#8a8886",
                    fontFamily: "'Segoe UI', system-ui, sans-serif",
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    borderRadius: 4,
                    backgroundColor: "#0078d4",
                    borderColor: "#0078d4",
                    fontFamily: "'Segoe UI', system-ui, sans-serif",
                    fontWeight: 600,
                  }}
                >
                  Post Comment
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </MainLayout>
  );
}
