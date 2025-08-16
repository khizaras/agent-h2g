"use client";

import React, { useState } from "react";
import {
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Switch,
  Button,
  Space,
  Row,
  Col,
  Typography,
  Card,
  Upload,
  Tag,
  Divider,
  Alert,
  Tooltip,
  TimePicker,
  Rate,
} from "antd";
import {
  PlusOutlined,
  InboxOutlined,
  InfoCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  BookOutlined,
  GlobalOutlined,
  TrophyOutlined,
  TeamOutlined,
  MinusCircleOutlined,
  EditOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import type { EducationDetails, Instructor } from "@/types";
import "@/styles/education-form-fixes.css";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { RangePicker: DateRangePicker } = DatePicker;

// Enhanced Rich Text Editor Component with markdown support
const RichTextEditor: React.FC<{
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  style?: React.CSSProperties;
}> = ({ value, onChange, placeholder, style }) => {
  const [editorValue, setEditorValue] = useState(value || "");
  const [isPreview, setIsPreview] = useState(false);

  // Update internal state when external value changes
  React.useEffect(() => {
    setEditorValue(value || "");
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    setEditorValue(content);
    if (onChange) {
      onChange(content);
    }
  };

  const insertMarkdown = (before: string, after: string = "") => {
    const textarea = document.activeElement as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = editorValue.substring(start, end);
    const replacement = `${before}${selectedText}${after}`;

    const newValue =
      editorValue.substring(0, start) +
      replacement +
      editorValue.substring(end);
    setEditorValue(newValue);
    if (onChange) {
      onChange(newValue);
    }

    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length,
      );
    }, 0);
  };

  const toolbarButtons = [
    {
      label: "B",
      action: () => insertMarkdown("**", "**"),
      title: "Bold",
      style: { fontWeight: "bold" },
    },
    {
      label: "I",
      action: () => insertMarkdown("*", "*"),
      title: "Italic",
      style: { fontStyle: "italic" },
    },
    { label: "H1", action: () => insertMarkdown("# "), title: "Header 1" },
    { label: "H2", action: () => insertMarkdown("## "), title: "Header 2" },
    { label: "•", action: () => insertMarkdown("- "), title: "Bullet List" },
    {
      label: "1.",
      action: () => insertMarkdown("1. "),
      title: "Numbered List",
    },
    {
      label: "Link",
      action: () => insertMarkdown("[", "](url)"),
      title: "Link",
    },
    {
      label: "Code",
      action: () => insertMarkdown("`", "`"),
      title: "Inline Code",
    },
  ];

  const renderPreview = (text: string) => {
    return text
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, "<code>$1</code>")
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank">$1</a>',
      )
      .replace(/^- (.*$)/gim, "<li>$1</li>")
      .replace(/^1\. (.*$)/gim, "<li>$1</li>")
      .replace(/\n/g, "<br>");
  };

  return (
    <div className="enhanced-rich-text-editor" style={style}>
      {/* Toolbar */}
      <div className="editor-toolbar">
        {toolbarButtons.map((button, index) => (
          <button
            key={index}
            type="button"
            onClick={button.action}
            title={button.title}
            className="toolbar-btn"
            style={button.style}
          >
            {button.label}
          </button>
        ))}
        <div className="toolbar-divider" />
        <button
          type="button"
          onClick={() => setIsPreview(!isPreview)}
          className={`toolbar-btn ${isPreview ? "active" : ""}`}
          title={isPreview ? "Edit" : "Preview"}
        >
          {isPreview ? "✏️" : "👁️"}
        </button>
      </div>

      {/* Editor/Preview Area */}
      {isPreview ? (
        <div
          className="editor-preview"
          dangerouslySetInnerHTML={{ __html: renderPreview(editorValue) }}
        />
      ) : (
        <TextArea
          value={editorValue}
          onChange={handleChange}
          placeholder={
            placeholder ||
            "Enter content here... You can use markdown formatting like **bold**, *italic*, # headers, - lists, etc."
          }
          className="editor-textarea"
          autoSize={{ minRows: 6, maxRows: 12 }}
        />
      )}

      {/* Help Text */}
      <div className="editor-help">
        <small>
          Supports markdown: **bold**, *italic*, # headers, - bullets, 1.
          numbers, [links](url), `code`
        </small>
      </div>
    </div>
  );
};

interface EducationCauseFormProps {
  initialValues?: Partial<EducationDetails>;
  onSubmit: (values: EducationDetails) => void;
  loading?: boolean;
}

const educationTypes = [
  {
    value: "workshop",
    label: "Workshop",
    description: "Short-term hands-on learning",
    icon: "🔧",
  },
  {
    value: "course",
    label: "Course",
    description: "Structured multi-session learning",
    icon: "📚",
  },
  {
    value: "seminar",
    label: "Seminar",
    description: "Educational presentation or discussion",
    icon: "🎓",
  },
  {
    value: "webinar",
    label: "Webinar",
    description: "Online educational session",
    icon: "💻",
  },
  {
    value: "mentoring",
    label: "Mentoring",
    description: "One-on-one guidance and support",
    icon: "👥",
  },
  {
    value: "bootcamp",
    label: "Bootcamp",
    description: "Intensive skill-building program",
    icon: "🏃‍♂️",
  },
  {
    value: "certification",
    label: "Certification Program",
    description: "Professional certification training",
    icon: "🏆",
  },
  {
    value: "tutorial",
    label: "Tutorial",
    description: "Step-by-step instruction",
    icon: "📖",
  },
];

const skillLevels = [
  {
    value: "beginner",
    label: "Beginner",
    description: "No prior experience required",
  },
  {
    value: "intermediate",
    label: "Intermediate",
    description: "Some experience recommended",
  },
  {
    value: "advanced",
    label: "Advanced",
    description: "Significant experience required",
  },
  {
    value: "expert",
    label: "Expert",
    description: "Professional level expertise",
  },
  {
    value: "all-levels",
    label: "All Levels",
    description: "Suitable for everyone",
  },
];

const deliveryMethods = [
  {
    value: "in-person",
    label: "In-Person",
    description: "Face-to-face learning",
    icon: "🏢",
  },
  {
    value: "online",
    label: "Online",
    description: "Virtual learning via video call",
    icon: "💻",
  },
  {
    value: "hybrid",
    label: "Hybrid",
    description: "Combination of online and in-person",
    icon: "🔄",
  },
  {
    value: "self-paced",
    label: "Self-Paced",
    description: "Learn at your own pace",
    icon: "⏰",
  },
];

const popularTopics = [
  // Technology
  "Web Development",
  "Mobile App Development",
  "Data Science",
  "Artificial Intelligence",
  "Cybersecurity",
  "Cloud Computing",
  "Database Management",
  "UI/UX Design",

  // Business & Finance
  "Digital Marketing",
  "Social Media Marketing",
  "Project Management",
  "Entrepreneurship",
  "Financial Literacy",
  "Accounting",
  "Sales Techniques",
  "Business Strategy",

  // Creative Arts
  "Graphic Design",
  "Photography",
  "Video Editing",
  "Creative Writing",
  "Music Production",
  "Digital Art",
  "Animation",
  "Content Creation",

  // Life Skills
  "Cooking & Nutrition",
  "Personal Finance",
  "Time Management",
  "Communication Skills",
  "Leadership",
  "Public Speaking",
  "Interview Skills",
  "Resume Writing",

  // Health & Wellness
  "Mental Health Awareness",
  "Fitness Training",
  "Yoga & Meditation",
  "Nutrition Planning",

  // Languages
  "English Language",
  "Spanish",
  "French",
  "Mandarin",
  "Arabic",
  "Sign Language",

  // Technical Skills
  "Automotive Repair",
  "Electrical Work",
  "Plumbing",
  "Carpentry",
  "Sewing & Tailoring",

  // Other
  "Job Search Strategies",
  "Career Development",
  "Study Skills",
  "Exam Preparation",
];

const languages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Dutch",
  "Chinese (Mandarin)",
  "Chinese (Cantonese)",
  "Japanese",
  "Korean",
  "Vietnamese",
  "Thai",
  "Hindi",
  "Urdu",
  "Arabic",
  "Hebrew",
  "Russian",
  "Polish",
  "Turkish",
  "Swahili",
  "French (Canadian)",
  "Other",
];

const platforms = [
  "Zoom",
  "Google Meet",
  "Microsoft Teams",
  "Skype",
  "Discord",
  "WebEx",
  "Jitsi Meet",
  "BigBlueButton",
  "GoToMeeting",
  "Other",
];

const certificationBodies = [
  "Google",
  "Microsoft",
  "Amazon AWS",
  "Salesforce",
  "Adobe",
  "Cisco",
  "CompTIA",
  "PMI",
  "Scrum Alliance",
  "HubSpot",
  "Facebook Blueprint",
  "LinkedIn Learning",
  "Coursera",
  "edX",
  "Udacity",
  "Local Institution",
  "Professional Association",
  "Government Agency",
  "Other",
];

export function EducationCauseForm({
  initialValues,
  onSubmit,
  loading = false,
}: EducationCauseFormProps) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] =
    useState<string>("in-person");

  const handleSubmit = async (values: any) => {
    try {
      // Convert instructors array to legacy format for backward compatibility
      const primaryInstructor = values.instructors?.[0];

      const formattedValues: EducationDetails = {
        ...values,
        start_date: values.start_date?.format("YYYY-MM-DD"),
        end_date: values.end_date?.format("YYYY-MM-DD"),
        registration_deadline:
          values.registration_deadline?.format("YYYY-MM-DD"),
        schedule: values.schedule || {},
        materials: fileList.map((file) => file.url || "").filter(Boolean),
        // Set both new and legacy instructor fields
        instructors: values.instructors || [],
        instructorName: primaryInstructor?.name || "",
        instructorEmail: primaryInstructor?.email || "",
        instructorBio: primaryInstructor?.bio || "",
        instructorQualifications: primaryInstructor?.qualifications || "",
      };

      await onSubmit(formattedValues);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const uploadProps: UploadProps = {
    name: "file",
    multiple: true,
    fileList,
    onChange: ({ fileList: newFileList }) => setFileList(newFileList),
    beforeUpload: (file: RcFile) => {
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "image/jpeg",
        "image/png",
        "image/gif",
      ];
      const isValidType = validTypes.includes(file.type);
      const isLt10M = file.size / 1024 / 1024 < 10;

      if (!isValidType) {
        console.error("Please upload PDF, DOC, PPT, or image files only!");
        return false;
      }
      if (!isLt10M) {
        console.error("File must be smaller than 10MB!");
        return false;
      }
      return true;
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="education-form-wrapper"
    >
      <Card className="shadow-lg border-0">
        <div className="mb-8">
          <Title level={2} className="flex items-center space-x-3">
            <span className="text-3xl">🎓</span>
            <span>Education & Training Details</span>
          </Title>
          <Paragraph className="text-gray-600 text-lg">
            Create a comprehensive educational opportunity that empowers
            learners with valuable skills and knowledge.
          </Paragraph>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            education_type: "workshop",
            skill_level: "all-levels",
            max_trainees: 20,
            current_trainees: 0,
            duration_hours: 2,
            number_of_days: 1,
            delivery_method: "in-person",
            course_language: "English",
            difficulty_rating: 3,
            price: 0,
            is_free: true,
            certification: false,
            instructor_rating: 0,
            // Handle multiple instructors - convert legacy data or use new format
            instructors: initialValues?.instructors?.length
              ? initialValues.instructors
              : initialValues?.instructorName
                ? [
                    {
                      name: initialValues.instructorName,
                      email: initialValues.instructorEmail || "",
                      bio: initialValues.instructorBio || "",
                      qualifications:
                        initialValues.instructorQualifications || "",
                    },
                  ]
                : [{ name: "", email: "", bio: "", qualifications: "" }],
            ...initialValues,
            start_date: initialValues?.startDate
              ? dayjs(initialValues.startDate)
              : undefined,
            end_date: initialValues?.endDate
              ? dayjs(initialValues.endDate)
              : undefined,
            registration_deadline: initialValues?.registrationDeadline
              ? dayjs(initialValues.registrationDeadline)
              : undefined,
          }}
          className="education-form education-cause-form"
        >
          {/* Education Type & Skill Level */}
          <Row gutter={[24, 0]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="education_type"
                label={
                  <span className="flex items-center space-x-2">
                    <BookOutlined />
                    <span>Education Type</span>
                    <Tooltip title="Choose the format that best describes your educational offering">
                      <InfoCircleOutlined className="text-gray-400" />
                    </Tooltip>
                  </span>
                }
                rules={[
                  {
                    required: true,
                    message: "Please select an education type",
                  },
                ]}
              >
                <Select
                  placeholder="Choose education type"
                  size="large"
                  className="w-full education-type-select"
                >
                  {educationTypes.map((type) => (
                    <Option key={type.value} value={type.value}>
                      <div className="flex items-start space-x-3">
                        <span className="text-lg">{type.icon}</span>
                        <div>
                          <div className="font-medium">{type.label}</div>
                          <div className="text-sm text-gray-500">
                            {type.description}
                          </div>
                        </div>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="skill_level"
                label="Target Skill Level"
                rules={[
                  { required: true, message: "Please select skill level" },
                ]}
              >
                <Select
                  placeholder="Select target skill level"
                  size="large"
                  className="skill-level-select"
                >
                  {skillLevels.map((level) => (
                    <Option key={level.value} value={level.value}>
                      <div>
                        <div className="font-medium">{level.label}</div>
                        <div className="text-sm text-gray-500">
                          {level.description}
                        </div>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Topics */}
          <Form.Item
            name="topics"
            label="Topics Covered"
            rules={[
              { required: true, message: "Please select at least one topic" },
            ]}
          >
            <Select
              mode="tags"
              placeholder="Select or add topics"
              size="large"
              className="w-full"
              maxTagCount="responsive"
            >
              {popularTopics.map((topic) => (
                <Option key={topic} value={topic}>
                  {topic}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Participants & Duration */}
          <Row gutter={[24, 0]}>
            <Col xs={24} md={6}>
              <Form.Item
                name="max_trainees"
                label="Maximum Participants"
                rules={[
                  { required: true, message: "Please enter max participants" },
                ]}
              >
                <InputNumber
                  min={1}
                  max={1000}
                  size="large"
                  placeholder="Max participants"
                  className="w-full"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={6}>
              <Form.Item
                name="duration_hours"
                label="Duration (Hours)"
                rules={[{ required: true, message: "Please enter duration" }]}
              >
                <InputNumber
                  min={0.5}
                  max={40}
                  step={0.5}
                  size="large"
                  placeholder="Total hours"
                  className="w-full"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={6}>
              <Form.Item
                name="number_of_days"
                label="Number of Days"
                rules={[
                  { required: true, message: "Please enter number of days" },
                ]}
              >
                <InputNumber
                  min={1}
                  max={365}
                  size="large"
                  placeholder="Days"
                  className="w-full"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={6}>
              <Form.Item name="difficulty_rating" label="Difficulty Level">
                <div className="flex items-center space-x-2">
                  <Rate count={5} />
                  <Text className="text-sm text-gray-500">
                    (1=Easy, 5=Very Hard)
                  </Text>
                </div>
              </Form.Item>
            </Col>
          </Row>

          {/* Dates */}
          <Row gutter={[24, 0]}>
            <Col xs={24} md={8}>
              <Form.Item
                name="start_date"
                label="Start Date"
                rules={[
                  { required: true, message: "Please select start date" },
                ]}
              >
                <DatePicker
                  size="large"
                  placeholder="Program start date"
                  className="w-full"
                  disabledDate={(current) =>
                    current && current < dayjs().startOf("day")
                  }
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="end_date"
                label="End Date"
                rules={[{ required: true, message: "Please select end date" }]}
              >
                <DatePicker
                  size="large"
                  placeholder="Program end date"
                  className="w-full"
                  disabledDate={(current) =>
                    current && current < dayjs().startOf("day")
                  }
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="registration_deadline"
                label="Registration Deadline"
              >
                <DatePicker
                  size="large"
                  placeholder="Registration deadline"
                  className="w-full"
                  disabledDate={(current) =>
                    current && current < dayjs().startOf("day")
                  }
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Delivery Method */}
          <Divider orientation="left">
            <span className="flex items-center space-x-2">
              <GlobalOutlined />
              <span>Delivery Method</span>
            </span>
          </Divider>

          <Form.Item
            name="delivery_method"
            label="How will this be delivered?"
            rules={[
              { required: true, message: "Please select delivery method" },
            ]}
          >
            <Select
              placeholder="Select delivery method"
              size="large"
              onChange={setSelectedDeliveryMethod}
              className="delivery-method-select"
            >
              {deliveryMethods.map((method) => (
                <Option key={method.value} value={method.value}>
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{method.icon}</span>
                    <div>
                      <div className="font-medium">{method.label}</div>
                      <div className="text-sm text-gray-500">
                        {method.description}
                      </div>
                    </div>
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Location Details (Conditional) */}
          {(selectedDeliveryMethod === "in-person" ||
            selectedDeliveryMethod === "hybrid") && (
            <Form.Item
              name="location_details"
              label="Location Details"
              rules={[
                { required: true, message: "Please provide location details" },
              ]}
            >
              <TextArea
                rows={3}
                placeholder="Provide complete address and any special instructions for finding the location"
                className="resize-none"
              />
            </Form.Item>
          )}

          {/* Online Platform Details (Conditional) */}
          {(selectedDeliveryMethod === "online" ||
            selectedDeliveryMethod === "hybrid") && (
            <Row gutter={[24, 0]}>
              <Col xs={24} md={8}>
                <Form.Item
                  name="meeting_platform"
                  label="Platform"
                  rules={[
                    { required: true, message: "Please select platform" },
                  ]}
                >
                  <Select
                    placeholder="Select platform"
                    size="large"
                    className="platform-select"
                  >
                    {platforms.map((platform) => (
                      <Option key={platform} value={platform}>
                        {platform}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item name="meeting_link" label="Meeting Link (Optional)">
                  <Input size="large" placeholder="https://..." type="url" />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item name="meeting_id" label="Meeting ID (Optional)">
                  <Input size="large" placeholder="Meeting ID or Room Number" />
                </Form.Item>
              </Col>
            </Row>
          )}

          {/* Multiple Instructors */}
          <Divider orientation="left">
            <span className="flex items-center space-x-2">
              <TeamOutlined />
              <span>Instructor Information</span>
            </span>
          </Divider>

          <Form.List
            name="instructors"
            initialValue={[
              { name: "", email: "", bio: "", qualifications: "" },
            ]}
          >
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Card
                    key={key}
                    size="small"
                    title={`Instructor ${name + 1}`}
                    className="mb-4 instructor-card"
                    extra={
                      fields.length > 1 ? (
                        <Button
                          type="text"
                          danger
                          icon={<MinusCircleOutlined />}
                          onClick={() => remove(name)}
                          size="small"
                        >
                          Remove
                        </Button>
                      ) : null
                    }
                  >
                    <Row gutter={[16, 0]}>
                      <Col xs={24} md={12}>
                        <Form.Item
                          {...restField}
                          name={[name, "name"]}
                          label="Instructor Name"
                          rules={[
                            {
                              required: true,
                              message: "Please enter instructor name",
                            },
                          ]}
                        >
                          <Input
                            size="large"
                            placeholder="Full name of the instructor"
                          />
                        </Form.Item>
                      </Col>

                      <Col xs={24} md={12}>
                        <Form.Item
                          {...restField}
                          name={[name, "email"]}
                          label="Email (Optional)"
                          rules={[
                            {
                              type: "email",
                              message: "Please enter a valid email",
                            },
                          ]}
                        >
                          <Input
                            size="large"
                            type="email"
                            placeholder="instructor@email.com"
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={[16, 0]}>
                      <Col xs={24} md={12}>
                        <Form.Item
                          {...restField}
                          name={[name, "bio"]}
                          label="Instructor Bio"
                        >
                          <TextArea
                            rows={3}
                            placeholder="Brief background and experience"
                            className="resize-none"
                          />
                        </Form.Item>
                      </Col>

                      <Col xs={24} md={12}>
                        <Form.Item
                          {...restField}
                          name={[name, "qualifications"]}
                          label="Qualifications & Credentials"
                        >
                          <TextArea
                            rows={3}
                            placeholder="Relevant qualifications, certifications, and experience"
                            className="resize-none"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                ))}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                    size="large"
                    className="add-instructor-btn"
                  >
                    Add Another Instructor
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          {/* Prerequisites, Learning Objectives & Curriculum */}
          <Divider orientation="left">
            <span className="flex items-center space-x-2">
              <BookOutlined />
              <span>Course Details</span>
            </span>
          </Divider>

          <Row gutter={[24, 0]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="prerequisites"
                label="Prerequisites"
                className="curriculum-field"
              >
                <RichTextEditor placeholder="Any required knowledge, skills, or materials participants should have before joining this course" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item name="learning_objectives" label="Learning Objectives">
                <RichTextEditor placeholder="What will participants learn? List the key learning outcomes and objectives" />
              </Form.Item>
            </Col>
          </Row>

          {/* Curriculum Field */}
          <Form.Item
            name="curriculum"
            label="Detailed Curriculum"
            className="curriculum-field"
            extra="Provide a comprehensive breakdown of topics, modules, and session content"
          >
            <RichTextEditor
              placeholder="Outline the course structure, modules, topics covered in each session, and detailed curriculum breakdown"
              style={{ minHeight: "200px" }}
            />
          </Form.Item>

          {/* Language & Accessibility */}
          <Row gutter={[24, 0]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="course_language"
                label="Course Language"
                rules={[
                  { required: true, message: "Please select course language" },
                ]}
              >
                <Select
                  placeholder="Select primary language"
                  size="large"
                  showSearch
                >
                  {languages.map((lang) => (
                    <Option key={lang} value={lang}>
                      {lang}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="subtitles_available"
                label="Subtitles/Translation Available"
              >
                <Select
                  mode="multiple"
                  placeholder="Select available subtitle languages"
                  size="large"
                  className="w-full"
                >
                  {languages.map((lang) => (
                    <Option key={lang} value={lang}>
                      {lang}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Pricing & Certification */}
          <Divider orientation="left">
            <span className="flex items-center space-x-2">
              <TrophyOutlined />
              <span>Pricing & Certification</span>
            </span>
          </Divider>

          <Row gutter={[24, 0]}>
            <Col xs={24} md={8}>
              <Form.Item name="is_free" valuePropName="checked">
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">🆓</span>
                    <div>
                      <div className="font-medium">Free Course</div>
                      <div className="text-sm text-gray-500">
                        No cost to participants
                      </div>
                    </div>
                  </div>
                  <Switch />
                </div>
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) =>
                  prevValues.is_free !== currentValues.is_free
                }
              >
                {({ getFieldValue }) =>
                  !getFieldValue("is_free") && (
                    <Form.Item
                      name="price"
                      label="Course Price"
                      rules={[
                        { required: true, message: "Please enter price" },
                      ]}
                    >
                      <InputNumber
                        min={0}
                        size="large"
                        placeholder="Course price"
                        className="w-full"
                        addonBefore="$"
                      />
                    </Form.Item>
                  )
                }
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item name="certification" valuePropName="checked">
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">🏆</span>
                    <div>
                      <div className="font-medium">Certificate Provided</div>
                      <div className="text-sm text-gray-500">
                        Issue completion certificate
                      </div>
                    </div>
                  </div>
                  <Switch />
                </div>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.certification !== currentValues.certification
            }
          >
            {({ getFieldValue }) =>
              getFieldValue("certification") && (
                <Form.Item name="certification_body" label="Certification Body">
                  <Select
                    placeholder="Who will issue the certificate?"
                    size="large"
                    allowClear
                  >
                    {certificationBodies.map((body) => (
                      <Option key={body} value={body}>
                        {body}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              )
            }
          </Form.Item>

          {/* Materials & Requirements */}


          {/* Information Notice */}
          <Alert
            message="Educational Content Guidelines"
            description="Please ensure your educational content is accurate, appropriate, and valuable to learners. Respect intellectual property rights and provide clear learning outcomes."
            type="info"
            showIcon
            className="mb-6"
          />

          {/* Submit Button */}
          <Form.Item className="text-center pt-6">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 border-none hover:shadow-lg transition-all duration-300 px-12 h-12 rounded-full text-lg font-medium"
            >
              {initialValues
                ? "Update Course Details"
                : "Create Educational Opportunity"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </motion.div>
  );
}
