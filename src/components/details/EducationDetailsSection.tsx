import React, { useState } from "react";
import {
  Card,
  Tag,
  Typography,
  Row,
  Col,
  Space,
  Button,
  List,
  Timeline,
  Avatar,
  Form,
  Input,
  Modal,
  message,
  Progress,
  Divider,
} from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  BookOutlined,
  TrophyOutlined,
  StarOutlined,
  GlobalOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined,
  ExperimentOutlined,
  BulbOutlined,
  FileTextOutlined,
  LaptopOutlined,
  ToolOutlined,
  SafetyCertificateOutlined,
  PlusOutlined,
  VideoCameraOutlined,
  LinkOutlined,
  DesktopOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";

const { Title, Text, Paragraph } = Typography;

interface CourseModule {
  title: string;
  description: string;
  duration: string;
  resources: string[];
  assessment?: string;
}

interface Instructor {
  name: string;
  email?: string;
  phone?: string;
  bio: string;
  qualifications: string[];
  avatar?: string;
}

interface EducationDetails {
  // Basic course info
  education_type: string;
  skill_level: string;
  topics: string;
  duration_hours: number;
  number_of_days: number;

  // Enrollment info
  max_trainees: number;
  current_trainees: number;
  start_date: string;
  end_date: string;
  registration_deadline?: string;

  // Delivery info
  schedule: string;
  delivery_method: string;
  location_details?: string;
  meeting_platform?: string;
  meeting_link?: string;

  // Instructor info
  instructor_name: string;
  instructor_email?: string;
  instructor_bio?: string;
  instructor_qualifications?: string;
  instructor_rating: number;

  // Course content
  prerequisites?: string;
  learning_objectives?: string;
  materials_provided?: string;
  equipment_required?: string;
  software_required?: string;

  // Enhanced fields (JSON)
  course_modules?: CourseModule[];
  instructors?: Instructor[];
  enhanced_prerequisites?: Array<{
    type: string;
    description: string;
    required: boolean;
  }>;

  // Certification & pricing
  certification: boolean;
  certification_body?: string;
  price: number;
  is_free: boolean;
  course_language: string;
  difficulty_rating: number;
}

interface EducationDetailsSectionProps {
  details: EducationDetails;
  theme: any;
}

const EducationDetailsSection: React.FC<EducationDetailsSectionProps> = ({
  details,
  theme,
}) => {
  const [enrollModalVisible, setEnrollModalVisible] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  // Process instructors - use enhanced instructors if available, fallback to basic instructor
  const instructors: Instructor[] =
    details.instructors && details.instructors.length > 0
      ? details.instructors
      : [
          {
            name: details.instructor_name,
            email: details.instructor_email,
            bio:
              details.instructor_bio ||
              "Experienced instructor with expertise in the subject matter.",
            qualifications: details.instructor_qualifications
              ? details.instructor_qualifications
                  .split(",")
                  .map((q) => q.trim())
              : ["Certified Instructor"],
          },
        ];

  // Process course modules
  const courseModules: CourseModule[] = details.course_modules || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getSkillLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "beginner":
        return "green";
      case "intermediate":
        return "orange";
      case "advanced":
        return "red";
      case "expert":
        return "purple";
      default:
        return "blue";
    }
  };

  const getDeliveryMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case "online":
        return <GlobalOutlined />;
      case "in-person":
        return <TeamOutlined />;
      case "hybrid":
        return <DesktopOutlined />;
      default:
        return <BookOutlined />;
    }
  };

  const getDifficultyStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <StarOutlined
        key={index}
        style={{
          color: index < rating ? "#FFD700" : "#DDD",
          fontSize: "14px",
        }}
      />
    ));
  };

  const getResourceIcon = (resource: string) => {
    const resourceLower = resource.toLowerCase();
    if (resourceLower.includes("video")) return <VideoCameraOutlined />;
    if (resourceLower.includes("document") || resourceLower.includes("pdf"))
      return <FileTextOutlined />;
    if (resourceLower.includes("software") || resourceLower.includes("tool"))
      return <LaptopOutlined />;
    if (resourceLower.includes("equipment")) return <ToolOutlined />;
    return <LinkOutlined />;
  };

  const handleEnrollment = async (values: any) => {
    setEnrolling(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      message.success("Enrollment request submitted successfully!");
      setEnrollModalVisible(false);
    } catch (error) {
      message.error("Failed to submit enrollment. Please try again.");
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <div style={{ width: "100%" }}>
      {/* Course Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card
          title={
            <span>
              <BookOutlined style={{ marginRight: "8px" }} />
              Course Overview
            </span>
          }
          style={{
            marginBottom: "24px",
            borderRadius: "8px",
            boxShadow: theme.shadow,
            border: `1px solid ${theme.border}`,
          }}
          headStyle={{
            background: theme.backgroundSecondary,
            borderBottom: `1px solid ${theme.border}`,
            fontSize: "16px",
            fontWeight: "600",
          }}
        >
          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <Space
                direction="vertical"
                size="middle"
                style={{ width: "100%" }}
              >
                <div>
                  <Text strong style={{ color: theme.text }}>
                    Course Type:
                  </Text>
                  <br />
                  <Text style={{ color: theme.textSecondary }}>
                    {details.education_type}
                  </Text>
                </div>
                <div>
                  <Text strong style={{ color: theme.text }}>
                    Skill Level:
                  </Text>
                  <br />
                  <Tag color={getSkillLevelColor(details.skill_level)}>
                    {details.skill_level}
                  </Tag>
                </div>
                <div>
                  <Text strong style={{ color: theme.text }}>
                    Duration:
                  </Text>
                  <br />
                  <Space>
                    <ClockCircleOutlined style={{ color: theme.primary }} />
                    <Text style={{ color: theme.textSecondary }}>
                      {details.duration_hours} hours over{" "}
                      {details.number_of_days} days
                    </Text>
                  </Space>
                </div>
                <div>
                  <Text strong style={{ color: theme.text }}>
                    Language:
                  </Text>
                  <br />
                  <Text style={{ color: theme.textSecondary }}>
                    {details.course_language}
                  </Text>
                </div>
              </Space>
            </Col>
            <Col xs={24} md={12}>
              <Space
                direction="vertical"
                size="middle"
                style={{ width: "100%" }}
              >
                <div>
                  <Text strong style={{ color: theme.text }}>
                    Delivery Method:
                  </Text>
                  <br />
                  <Space>
                    {getDeliveryMethodIcon(details.delivery_method)}
                    <Text style={{ color: theme.textSecondary }}>
                      {details.delivery_method}
                    </Text>
                  </Space>
                </div>
                <div>
                  <Text strong style={{ color: theme.text }}>
                    Difficulty:
                  </Text>
                  <br />
                  <Space>{getDifficultyStars(details.difficulty_rating)}</Space>
                </div>
                <div>
                  <Text strong style={{ color: theme.text }}>
                    Certification:
                  </Text>
                  <br />
                  <Space>
                    <SafetyCertificateOutlined
                      style={{ color: theme.primary }}
                    />
                    <Text style={{ color: theme.textSecondary }}>
                      {details.certification
                        ? details.certification_body ||
                          "Certificate of Completion"
                        : "No certification"}
                    </Text>
                  </Space>
                </div>
                <div>
                  <Text strong style={{ color: theme.text }}>
                    Topics Covered:
                  </Text>
                  <br />
                  <Paragraph
                    style={{
                      color: theme.textSecondary,
                      marginBottom: 0,
                    }}
                  >
                    {details.topics}
                  </Paragraph>
                </div>
              </Space>
            </Col>
          </Row>
        </Card>
      </motion.div>

      {/* Meet Your Instructors */}
      {instructors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card
            title={
              <span>
                <UserOutlined style={{ marginRight: "8px" }} />
                Meet Your{" "}
                {instructors.length > 1 ? "Instructors" : "Instructor"}
              </span>
            }
            style={{
              marginBottom: "24px",
              borderRadius: "8px",
              boxShadow: theme.shadow,
              border: `1px solid ${theme.border}`,
            }}
            headStyle={{
              background: theme.backgroundSecondary,
              borderBottom: `1px solid ${theme.border}`,
              fontSize: "16px",
              fontWeight: "600",
            }}
          >
            <List
              dataSource={instructors}
              renderItem={(instructor) => (
                <List.Item style={{ padding: "16px 0" }}>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        size={64}
                        src={instructor.avatar}
                        icon={<UserOutlined />}
                        style={{
                          backgroundColor: theme.primary,
                        }}
                      />
                    }
                    title={
                      <Title level={4} style={{ margin: 0, color: theme.text }}>
                        {instructor.name}
                      </Title>
                    }
                    description={
                      <div>
                        <div
                          style={{
                            color: theme.textSecondary,
                            marginBottom: "12px",
                          }}
                        >
                          <MarkdownRenderer content={instructor.bio || ""} />
                        </div>
                        {instructor.qualifications &&
                          instructor.qualifications.length > 0 && (
                            <div style={{ marginBottom: "8px" }}>
                              <Text strong style={{ color: theme.text }}>
                                Qualifications:
                              </Text>
                              <br />
                              <Space wrap>
                                {instructor.qualifications.map(
                                  (qualification, index) => (
                                    <Tag key={index} color="green">
                                      <TrophyOutlined
                                        style={{ marginRight: "4px" }}
                                      />
                                      {qualification}
                                    </Tag>
                                  ),
                                )}
                              </Space>
                            </div>
                          )}
                        {instructor.email && (
                          <div>
                            <Text strong style={{ color: theme.text }}>
                              Contact:
                            </Text>
                            <br />
                            <Text style={{ color: theme.textSecondary }}>
                              {instructor.email}
                            </Text>
                          </div>
                        )}
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </motion.div>
      )}

      {/* Course Curriculum */}
      {courseModules.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card
            title={
              <span>
                <ExperimentOutlined style={{ marginRight: "8px" }} />
                Course Curriculum
              </span>
            }
            style={{
              marginBottom: "24px",
              borderRadius: "8px",
              boxShadow: theme.shadow,
              border: `1px solid ${theme.border}`,
            }}
            headStyle={{
              background: theme.backgroundSecondary,
              borderBottom: `1px solid ${theme.border}`,
              fontSize: "16px",
              fontWeight: "600",
            }}
          >
            <Timeline>
              {courseModules.map((module, index) => (
                <Timeline.Item
                  key={index}
                  dot={
                    <BulbOutlined
                      style={{ fontSize: "16px", color: theme.primary }}
                    />
                  }
                  color="blue"
                >
                  <div style={{ marginBottom: "16px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "start",
                        marginBottom: "8px",
                      }}
                    >
                      <Title level={5} style={{ margin: 0, color: theme.text }}>
                        Module {index + 1}: {module.title}
                      </Title>
                      <Tag color="blue">{module.duration}h</Tag>
                    </div>
                    <div
                      style={{
                        color: theme.textSecondary,
                        marginBottom: "12px",
                      }}
                    >
                      <MarkdownRenderer content={module.description || ""} />
                    </div>
                    {module.resources && module.resources.length > 0 && (
                      <div>
                        <Text strong style={{ color: theme.text }}>
                          Resources:
                        </Text>
                        <div style={{ marginTop: "4px" }}>
                          <Space wrap>
                            {module.resources.map((resource, idx) => (
                              <Tag
                                key={idx}
                                icon={getResourceIcon(resource)}
                                color="default"
                              >
                                {resource}
                              </Tag>
                            ))}
                          </Space>
                        </div>
                      </div>
                    )}
                    {module.assessment && (
                      <div style={{ marginTop: "8px" }}>
                        <Text strong style={{ color: theme.text }}>
                          Assessment:
                        </Text>
                        <br />
                        <Text style={{ color: theme.textSecondary }}>
                          {module.assessment}
                        </Text>
                      </div>
                    )}
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </motion.div>
      )}

      {/* Schedule & Enrollment */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card
          title={
            <span>
              <CalendarOutlined style={{ marginRight: "8px" }} />
              Schedule & Enrollment
            </span>
          }
          style={{
            marginBottom: "24px",
            borderRadius: "8px",
            boxShadow: theme.shadow,
            border: `1px solid ${theme.border}`,
          }}
          headStyle={{
            background: theme.backgroundSecondary,
            borderBottom: `1px solid ${theme.border}`,
            fontSize: "16px",
            fontWeight: "600",
          }}
        >
          <Row gutter={[24, 16]}>
            <Col xs={24} md={16}>
              <Space
                direction="vertical"
                size="large"
                style={{ width: "100%" }}
              >
                <div>
                  <Text strong style={{ color: theme.text }}>
                    Schedule:
                  </Text>
                  <br />
                  <Text style={{ color: theme.textSecondary }}>
                    {typeof details.schedule === "string"
                      ? details.schedule
                      : "Schedule to be announced"}
                  </Text>
                </div>
                <div>
                  <Text strong style={{ color: theme.text }}>
                    Start Date:
                  </Text>
                  <br />
                  <Space>
                    <CalendarOutlined style={{ color: theme.primary }} />
                    <Text style={{ color: theme.textSecondary }}>
                      {formatDate(details.start_date)}
                    </Text>
                  </Space>
                </div>
                <div>
                  <Text strong style={{ color: theme.text }}>
                    End Date:
                  </Text>
                  <br />
                  <Space>
                    <CalendarOutlined style={{ color: theme.primary }} />
                    <Text style={{ color: theme.textSecondary }}>
                      {formatDate(details.end_date)}
                    </Text>
                  </Space>
                </div>
                {details.location_details && (
                  <div>
                    <Text strong style={{ color: theme.text }}>
                      Location:
                    </Text>
                    <br />
                    <Space>
                      <EnvironmentOutlined style={{ color: theme.primary }} />
                      <Text style={{ color: theme.textSecondary }}>
                        {details.location_details}
                      </Text>
                    </Space>
                  </div>
                )}
                {details.meeting_platform && (
                  <div>
                    <Text strong style={{ color: theme.text }}>
                      Platform:
                    </Text>
                    <br />
                    <Text style={{ color: theme.textSecondary }}>
                      {details.meeting_platform}
                    </Text>
                  </div>
                )}
              </Space>
            </Col>
            <Col xs={24} md={8}>
              <div
                style={{
                  padding: "20px",
                  background: theme.backgroundSecondary,
                  borderRadius: "8px",
                  border: `1px solid ${theme.border}`,
                }}
              >
                <div style={{ textAlign: "center", marginBottom: "16px" }}>
                  <Text strong style={{ fontSize: "16px", color: theme.text }}>
                    Enrollment Status
                  </Text>
                </div>
                <Progress
                  percent={Math.round(
                    (details.current_trainees / details.max_trainees) * 100,
                  )}
                  strokeColor={theme.primary}
                  style={{ marginBottom: "12px" }}
                />
                <div style={{ textAlign: "center", marginBottom: "16px" }}>
                  <Text style={{ color: theme.textSecondary }}>
                    {details.current_trainees} / {details.max_trainees} enrolled
                  </Text>
                </div>
                <div style={{ textAlign: "center", marginBottom: "16px" }}>
                  <Text
                    strong
                    style={{ fontSize: "18px", color: theme.primary }}
                  >
                    {details.is_free ? "FREE" : `$${details.price}`}
                  </Text>
                </div>
                <Button
                  type="primary"
                  size="large"
                  block
                  icon={<PlusOutlined />}
                  onClick={() => setEnrollModalVisible(true)}
                  disabled={details.current_trainees >= details.max_trainees}
                  style={{
                    backgroundColor: theme.primary,
                    borderColor: theme.primary,
                  }}
                >
                  {details.current_trainees >= details.max_trainees
                    ? "Class Full"
                    : "Enroll Now"}
                </Button>
              </div>
            </Col>
          </Row>
        </Card>
      </motion.div>

      {/* Prerequisites & Materials */}
      {(details.prerequisites ||
        details.materials_provided ||
        details.equipment_required ||
        details.software_required ||
        (details.enhanced_prerequisites &&
          details.enhanced_prerequisites.length > 0)) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card
            title={
              <span>
                <ToolOutlined style={{ marginRight: "8px" }} />
                Prerequisites & Materials
              </span>
            }
            style={{
              marginBottom: "24px",
              borderRadius: "8px",
              boxShadow: theme.shadow,
              border: `1px solid ${theme.border}`,
            }}
            headStyle={{
              background: theme.backgroundSecondary,
              borderBottom: `1px solid ${theme.border}`,
              fontSize: "16px",
              fontWeight: "600",
            }}
          >
            <Row gutter={[24, 16]}>
              <Col xs={24} md={12}>
                <Space
                  direction="vertical"
                  size="middle"
                  style={{ width: "100%" }}
                >
                  {details.prerequisites && (
                    <div>
                      <Text strong style={{ color: theme.text }}>
                        Prerequisites:
                      </Text>
                      <br />
                      <Text style={{ color: theme.textSecondary }}>
                        {details.prerequisites}
                      </Text>
                    </div>
                  )}

                  {details.enhanced_prerequisites &&
                    details.enhanced_prerequisites.length > 0 && (
                      <div>
                        <Text strong style={{ color: theme.text }}>
                          Detailed Prerequisites:
                        </Text>
                        <div style={{ marginTop: "8px" }}>
                          {details.enhanced_prerequisites.map(
                            (prereq, index) => (
                              <div key={index} style={{ marginBottom: "8px" }}>
                                <Space>
                                  <CheckCircleOutlined
                                    style={{
                                      color: prereq.required
                                        ? "#f5222d"
                                        : "#52c41a",
                                    }}
                                  />
                                  <Tag
                                    color={prereq.required ? "red" : "green"}
                                  >
                                    {prereq.type}
                                  </Tag>
                                </Space>
                                <div
                                  style={{
                                    color: theme.textSecondary,
                                    marginLeft: "24px",
                                    marginTop: "4px",
                                  }}
                                >
                                  <MarkdownRenderer content={prereq.description || ""} />
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                  {details.materials_provided && (
                    <div>
                      <Text strong style={{ color: theme.text }}>
                        Materials Provided:
                      </Text>
                      <br />
                      <Text style={{ color: theme.textSecondary }}>
                        {details.materials_provided}
                      </Text>
                    </div>
                  )}
                </Space>
              </Col>
              <Col xs={24} md={12}>
                <Space
                  direction="vertical"
                  size="middle"
                  style={{ width: "100%" }}
                >
                  {details.equipment_required && (
                    <div>
                      <Text strong style={{ color: theme.text }}>
                        Equipment Required:
                      </Text>
                      <br />
                      <Space>
                        <LaptopOutlined style={{ color: theme.primary }} />
                        <Text style={{ color: theme.textSecondary }}>
                          {details.equipment_required}
                        </Text>
                      </Space>
                    </div>
                  )}
                  {details.software_required && (
                    <div>
                      <Text strong style={{ color: theme.text }}>
                        Software Required:
                      </Text>
                      <br />
                      <Space>
                        <DesktopOutlined style={{ color: theme.primary }} />
                        <Text style={{ color: theme.textSecondary }}>
                          {details.software_required}
                        </Text>
                      </Space>
                    </div>
                  )}
                  {details.learning_objectives && (
                    <div>
                      <Text strong style={{ color: theme.text }}>
                        Learning Objectives:
                      </Text>
                      <br />
                      <Text style={{ color: theme.textSecondary }}>
                        {details.learning_objectives}
                      </Text>
                    </div>
                  )}
                </Space>
              </Col>
            </Row>
          </Card>
        </motion.div>
      )}

      {/* Enrollment Modal */}
      <Modal
        title="Enroll in Course"
        open={enrollModalVisible}
        onCancel={() => setEnrollModalVisible(false)}
        footer={null}
        width={600}
      >
        <div style={{ padding: "20px 0" }}>
          <Paragraph
            style={{ color: theme.textSecondary, marginBottom: "24px" }}
          >
            Please fill out the form below to enroll in{" "}
            <Text strong>{details.education_type}</Text>.
          </Paragraph>
          <Form layout="vertical" onFinish={handleEnrollment}>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Full Name"
                  name="name"
                  rules={[
                    { required: true, message: "Please enter your name" },
                  ]}
                >
                  <Input placeholder="Enter your full name" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Please enter your email" },
                    { type: "email", message: "Please enter a valid email" },
                  ]}
                >
                  <Input placeholder="Enter your email address" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              label="Phone Number"
              name="phone"
              rules={[
                { required: true, message: "Please enter your phone number" },
              ]}
            >
              <Input placeholder="Enter your phone number" />
            </Form.Item>
            <Form.Item
              label="Previous Experience"
              name="experience"
              rules={[
                {
                  required: true,
                  message: "Please describe your experience",
                },
              ]}
            >
              <Input.TextArea
                rows={3}
                placeholder="Describe your previous experience with this subject"
              />
            </Form.Item>
            <Form.Item
              label="Motivation"
              name="motivation"
              rules={[
                {
                  required: true,
                  message: "Please tell us why you want to join",
                },
              ]}
            >
              <Input.TextArea
                rows={3}
                placeholder="Why do you want to take this course?"
              />
            </Form.Item>
            <div style={{ textAlign: "right", marginTop: "24px" }}>
              <Space>
                <Button onClick={() => setEnrollModalVisible(false)}>
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={enrolling}
                  style={{
                    backgroundColor: theme.primary,
                    borderColor: theme.primary,
                    fontWeight: "600",
                  }}
                >
                  {enrolling ? "Enrolling..." : "Enroll Now!"}
                </Button>
              </Space>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default EducationDetailsSection;
