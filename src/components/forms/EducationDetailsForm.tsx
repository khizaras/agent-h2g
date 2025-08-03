import React, { useState } from "react";
import {
  Form,
  Input,
  Select,
  InputNumber,
  DatePicker,
  Checkbox,
  Row,
  Col,
  Typography,
  Card,
  TimePicker,
  Radio,
  Button,
  Divider,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import MarkdownEditor from "@/components/ui/MarkdownEditor";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface EducationDetailsFormProps {
  form: any;
  onEnhancedFieldsChange?: (fields: {
    courseModules: any[];
    instructors: any[];
    enhancedPrerequisites: any[];
  }) => void;
  initialEnhancedFields?: {
    courseModules?: any[];
    instructors?: any[];
    enhancedPrerequisites?: any[];
  };
}

const EducationDetailsForm: React.FC<EducationDetailsFormProps> = ({
  form,
  onEnhancedFieldsChange,
  initialEnhancedFields,
}) => {
  // Enhanced education state - initialize with existing data if available
  const [courseModules, setCourseModules] = useState<
    Array<{
      title: string;
      description: string;
      duration: string;
      resources: string[];
      assessment: string;
    }>
  >(initialEnhancedFields?.courseModules || []);

  const [instructors, setInstructors] = useState<
    Array<{
      name: string;
      email: string;
      phone?: string;
      bio?: string;
      qualifications?: string[];
      avatar?: string;
    }>
  >(initialEnhancedFields?.instructors || []);

  const [enhancedPrerequisites, setEnhancedPrerequisites] = useState<
    Array<{
      title: string;
      description: string;
      resources: string[];
    }>
  >(initialEnhancedFields?.enhancedPrerequisites || []);

  // Initialize state from props only once when component mounts or when initialEnhancedFields changes
  const initializedRef = React.useRef<string>('');
  
  React.useEffect(() => {
    if (initialEnhancedFields) {
      const currentKey = JSON.stringify(initialEnhancedFields);
      // Only update if this is truly new initial data
      if (currentKey !== initializedRef.current) {
        setCourseModules(initialEnhancedFields.courseModules || []);
        setInstructors(initialEnhancedFields.instructors || []);
        setEnhancedPrerequisites(initialEnhancedFields.enhancedPrerequisites || []);
        initializedRef.current = currentKey;
      }
    }
  }, [initialEnhancedFields]);

  // Notify parent when internal state changes - but exclude the callback function from deps
  React.useEffect(() => {
    // Only notify if we have been initialized (to avoid initial empty state notification)
    if (initializedRef.current && onEnhancedFieldsChange) {
      onEnhancedFieldsChange({
        courseModules,
        instructors,
        enhancedPrerequisites,
      });
    }
  }, [courseModules, instructors, enhancedPrerequisites]); // Removed onEnhancedFieldsChange from deps

  // Memoized update functions to prevent unnecessary re-renders
  const updateInstructor = React.useCallback((index: number, field: string, value: any) => {
    setInstructors(prev => {
      const newInstructors = [...prev];
      (newInstructors[index] as any)[field] = value;
      return newInstructors;
    });
  }, []);

  const addInstructor = React.useCallback(() => {
    setInstructors(prev => [
      ...prev,
      {
        name: "",
        email: "",
        phone: "",
        bio: "",
        qualifications: [],
        avatar: "",
      },
    ]);
  }, []);

  const removeInstructor = React.useCallback((index: number) => {
    setInstructors(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateCourseModule = React.useCallback((index: number, field: string, value: any) => {
    setCourseModules(prev => {
      const newModules = [...prev];
      (newModules[index] as any)[field] = value;
      return newModules;
    });
  }, []);

  const addCourseModule = React.useCallback(() => {
    setCourseModules(prev => [
      ...prev,
      {
        title: "",
        description: "",
        duration: "",
        resources: [],
        assessment: "",
      },
    ]);
  }, []);

  const removeCourseModule = React.useCallback((index: number) => {
    setCourseModules(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updatePrerequisite = React.useCallback((index: number, field: string, value: any) => {
    setEnhancedPrerequisites(prev => {
      const newPrereqs = [...prev];
      (newPrereqs[index] as any)[field] = value;
      return newPrereqs;
    });
  }, []);

  const addPrerequisite = React.useCallback(() => {
    setEnhancedPrerequisites(prev => [
      ...prev,
      {
        title: "",
        description: "",
        resources: [],
      },
    ]);
  }, []);

  const removePrerequisite = React.useCallback((index: number) => {
    setEnhancedPrerequisites(prev => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <div className="modern-form-step">
      <div className="step-header">
        <div className="step-icon">🎓</div>
        <Title level={3}>Education & Training Details</Title>
        <Text type="secondary">
          Provide information about your course, workshop, or training program
        </Text>
      </div>

      <div className="form-section">
        <Title level={4}>Course Information</Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="educationType"
              label="Education Type"
              rules={[
                { required: true, message: "Please select education type" },
              ]}
            >
              <Select size="large" placeholder="Select type">
                <Option value="course">Online Course</Option>
                <Option value="workshop">Workshop</Option>
                <Option value="seminar">Seminar</Option>
                <Option value="bootcamp">Bootcamp</Option>
                <Option value="mentoring">1-on-1 Mentoring</Option>
                <Option value="certification">Certification Program</Option>
                <Option value="tutoring">Tutoring</Option>
                <Option value="webinar">Webinar</Option>
                <Option value="masterclass">Masterclass</Option>
                <Option value="training">Professional Training</Option>
                <Option value="conference">Conference</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="skillLevel"
              label="Skill Level"
              initialValue="all-levels"
              rules={[{ required: true, message: "Please select skill level" }]}
            >
              <Select size="large">
                <Option value="beginner">Beginner</Option>
                <Option value="intermediate">Intermediate</Option>
                <Option value="advanced">Advanced</Option>
                <Option value="expert">Expert</Option>
                <Option value="all-levels">All Levels</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="topics"
          label="Topics Covered"
          rules={[{ required: true, message: "Please select topics" }]}
        >
          <Select
            mode="multiple"
            size="large"
            placeholder="Select topics covered"
            style={{ width: "100%" }}
          >
            {/* Tech & Programming */}
            <Option value="programming">Programming</Option>
            <Option value="web-development">Web Development</Option>
            <Option value="mobile-development">Mobile Development</Option>
            <Option value="data-science">Data Science</Option>
            <Option value="ai-ml">AI & Machine Learning</Option>
            <Option value="cybersecurity">Cybersecurity</Option>
            <Option value="cloud-computing">Cloud Computing</Option>
            <Option value="database">Database Management</Option>

            {/* Design & Creative */}
            <Option value="graphic-design">Graphic Design</Option>
            <Option value="ui-ux">UI/UX Design</Option>
            <Option value="photography">Photography</Option>
            <Option value="video-editing">Video Editing</Option>
            <Option value="animation">Animation</Option>
            <Option value="arts-crafts">Arts & Crafts</Option>
            <Option value="music">Music</Option>
            <Option value="writing">Writing</Option>

            {/* Business & Professional */}
            <Option value="business">Business Management</Option>
            <Option value="marketing">Digital Marketing</Option>
            <Option value="sales">Sales</Option>
            <Option value="finance">Finance</Option>
            <Option value="entrepreneurship">Entrepreneurship</Option>
            <Option value="project-management">Project Management</Option>
            <Option value="leadership">Leadership</Option>
            <Option value="communication">Communication Skills</Option>

            {/* Academic */}
            <Option value="mathematics">Mathematics</Option>
            <Option value="science">Science</Option>
            <Option value="language">Language Learning</Option>
            <Option value="history">History</Option>
            <Option value="literature">Literature</Option>
            <Option value="philosophy">Philosophy</Option>

            {/* Life Skills */}
            <Option value="cooking">Cooking</Option>
            <Option value="fitness">Fitness & Health</Option>
            <Option value="mindfulness">Mindfulness & Meditation</Option>
            <Option value="personal-development">Personal Development</Option>
            <Option value="parenting">Parenting</Option>
            <Option value="relationships">Relationships</Option>

            {/* Professional Skills */}
            <Option value="job-search">Job Search Skills</Option>
            <Option value="interview-prep">Interview Preparation</Option>
            <Option value="resume-writing">Resume Writing</Option>
            <Option value="networking">Professional Networking</Option>
            <Option value="public-speaking">Public Speaking</Option>
          </Select>
        </Form.Item>

        <Form.Item name="learningObjectives" label="Learning Objectives">
          <Select
            mode="tags"
            size="large"
            placeholder="Enter learning objectives (press Enter to add each one)"
            style={{ width: "100%" }}
          />
        </Form.Item>
      </div>

      <div className="form-section">
        <Title level={4}>Course Structure</Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Form.Item
              name="maxTrainees"
              label="Max Participants"
              rules={[
                { required: true, message: "Please enter max participants" },
              ]}
            >
              <InputNumber
                size="large"
                style={{ width: "100%" }}
                min={1}
                max={1000}
                placeholder="e.g., 20"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="durationHours"
              label="Duration (Hours)"
              rules={[{ required: true, message: "Please enter duration" }]}
            >
              <InputNumber
                size="large"
                style={{ width: "100%" }}
                min={1}
                placeholder="Total hours"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="numberOfDays"
              label="Number of Days"
              rules={[
                { required: true, message: "Please enter number of days" },
              ]}
            >
              <InputNumber
                size="large"
                style={{ width: "100%" }}
                min={1}
                placeholder="e.g., 5"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="difficultyRating"
              label="Difficulty Rating (1-10)"
              initialValue={1}
            >
              <Select size="large">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <Option key={num} value={num}>
                    {num} -{" "}
                    {num <= 3
                      ? "Easy"
                      : num <= 6
                        ? "Moderate"
                        : num <= 8
                          ? "Hard"
                          : "Expert"}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="courseLanguage"
              label="Course Language"
              initialValue="English"
            >
              <Select size="large">
                <Option value="English">English</Option>
                <Option value="Spanish">Spanish</Option>
                <Option value="French">French</Option>
                <Option value="German">German</Option>
                <Option value="Portuguese">Portuguese</Option>
                <Option value="Arabic">Arabic</Option>
                <Option value="Chinese">Chinese (Mandarin)</Option>
                <Option value="Japanese">Japanese</Option>
                <Option value="Korean">Korean</Option>
                <Option value="Hindi">Hindi</Option>
                <Option value="Russian">Russian</Option>
                <Option value="Italian">Italian</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="subtitlesAvailable" label="Subtitles Available">
          <Select
            mode="multiple"
            size="large"
            placeholder="Select languages for subtitles"
            style={{ width: "100%" }}
          >
            <Option value="English">English</Option>
            <Option value="Spanish">Spanish</Option>
            <Option value="French">French</Option>
            <Option value="German">German</Option>
            <Option value="Portuguese">Portuguese</Option>
            <Option value="Arabic">Arabic</Option>
            <Option value="Chinese">Chinese</Option>
            <Option value="Japanese">Japanese</Option>
            <Option value="Korean">Korean</Option>
            <Option value="Hindi">Hindi</Option>
          </Select>
        </Form.Item>

        <Form.Item name="prerequisites" label="Basic Prerequisites (Legacy)">
          <TextArea
            rows={3}
            placeholder="Any prerequisites, prior knowledge, or requirements for participants"
          />
        </Form.Item>
      </div>

      {/* Enhanced Education Fields */}
      <div className="form-section">
        <Divider>Enhanced Course Features</Divider>
      </div>

      {/* Course Modules */}
      <div className="form-section">
        <Card
          title="Course Curriculum"
          size="small"
          style={{ marginBottom: 16 }}
        >
          {courseModules.map((module, index) => (
            <Card
              key={index}
              size="small"
              style={{ marginBottom: 8 }}
              extra={
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => removeCourseModule(index)}
                />
              }
            >
              <Row gutter={[8, 8]}>
                <Col xs={24} md={12}>
                  <Input
                    placeholder="Module Title"
                    value={module.title}
                    onChange={(e) => updateCourseModule(index, 'title', e.target.value)}
                  />
                </Col>
                <Col xs={24} md={12}>
                  <Input
                    placeholder="Duration (e.g., 2 weeks)"
                    value={module.duration}
                    onChange={(e) => updateCourseModule(index, 'duration', e.target.value)}
                  />
                </Col>
                <Col xs={24}>
                  <MarkdownEditor
                    placeholder="Module Description - Use markdown for formatting"
                    value={module.description}
                    onChange={(value) => updateCourseModule(index, 'description', value || "")}
                    height={150}
                  />
                </Col>
                <Col xs={24} md={12}>
                  <Select
                    mode="tags"
                    placeholder="Resources (videos, PDFs, etc.)"
                    value={module.resources}
                    onChange={(values) => updateCourseModule(index, 'resources', values)}
                    style={{ width: "100%" }}
                  />
                </Col>
                <Col xs={24} md={12}>
                  <Input
                    placeholder="Assessment Method"
                    value={module.assessment}
                    onChange={(e) => updateCourseModule(index, 'assessment', e.target.value)}
                  />
                </Col>
              </Row>
            </Card>
          ))}
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={addCourseModule}
            block
          >
            Add Course Module
          </Button>
        </Card>
      </div>

      {/* Multiple Instructors */}
      <div className="form-section">
        <Card title="Instructors" size="small" style={{ marginBottom: 16 }}>
          {instructors.map((instructor, index) => (
            <Card
              key={index}
              size="small"
              style={{ marginBottom: 8 }}
              extra={
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    const newInstructors = instructors.filter(
                      (_, i) => i !== index,
                    );
                    setInstructors(newInstructors);
                  }}
                />
              }
            >
              <Row gutter={[8, 8]}>
                <Col xs={24} md={8}>
                  <Input
                    placeholder="Instructor Name"
                    value={instructor.name}
                    onChange={(e) => updateInstructor(index, 'name', e.target.value)}
                  />
                </Col>
                <Col xs={24} md={8}>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={instructor.email}
                    onChange={(e) => updateInstructor(index, 'email', e.target.value)}
                  />
                </Col>
                <Col xs={24} md={8}>
                  <Input
                    placeholder="Phone (optional)"
                    value={instructor.phone || ""}
                    onChange={(e) => updateInstructor(index, 'phone', e.target.value)}
                  />
                </Col>
                <Col xs={24}>
                  <MarkdownEditor
                    placeholder="Bio (optional) - Use markdown for formatting"
                    value={instructor.bio || ""}
                    onChange={(value) => updateInstructor(index, 'bio', value || "")}
                    height={150}
                  />
                </Col>
                <Col xs={24} md={12}>
                  <Select
                    mode="tags"
                    placeholder="Qualifications (optional)"
                    value={instructor.qualifications || []}
                    onChange={(values) => updateInstructor(index, 'qualifications', values)}
                    style={{ width: "100%" }}
                  />
                </Col>
                <Col xs={24} md={12}>
                  <Input
                    placeholder="Avatar URL (optional)"
                    value={instructor.avatar || ""}
                    onChange={(e) => updateInstructor(index, 'avatar', e.target.value)}
                  />
                </Col>
              </Row>
            </Card>
          ))}
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={addInstructor}
            block
          >
            Add Instructor
          </Button>
        </Card>
      </div>

      {/* Enhanced Prerequisites */}
      <div className="form-section">
        <Card
          title="Detailed Prerequisites"
          size="small"
          style={{ marginBottom: 16 }}
        >
          {enhancedPrerequisites.map((prereq, index) => (
            <Card
              key={index}
              size="small"
              style={{ marginBottom: 8 }}
              extra={
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    const newPrereqs = enhancedPrerequisites.filter(
                      (_, i) => i !== index,
                    );
                    setEnhancedPrerequisites(newPrereqs);
                  }}
                />
              }
            >
              <Row gutter={[8, 8]}>
                <Col xs={24} md={12}>
                  <Input
                    placeholder="Prerequisite Title"
                    value={prereq.title}
                    onChange={(e) => updatePrerequisite(index, 'title', e.target.value)}
                  />
                </Col>
                <Col xs={24} md={12}>
                  <Select
                    mode="tags"
                    placeholder="Resources"
                    value={prereq.resources}
                    onChange={(values) => updatePrerequisite(index, 'resources', values)}
                    style={{ width: "100%" }}
                  />
                </Col>
                <Col xs={24}>
                  <MarkdownEditor
                    placeholder="Description - Use markdown for formatting"
                    value={prereq.description}
                    onChange={(value) => updatePrerequisite(index, 'description', value || "")}
                    height={150}
                  />
                </Col>
              </Row>
            </Card>
          ))}
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={addPrerequisite}
            block
          >
            Add Prerequisite
          </Button>
        </Card>
      </div>

      <div className="form-section">
        <Title level={4}>Legacy Instructor Information</Title>
        <Form.Item
          name="instructorName"
          label="Instructor Name (Legacy)"
          rules={[{ required: true, message: "Please enter instructor name" }]}
        >
          <Input size="large" placeholder="Name of the instructor" />
        </Form.Item>

        <Form.Item name="instructorEmail" label="Instructor Email (Legacy)">
          <Input
            size="large"
            type="email"
            placeholder="Instructor's contact email"
          />
        </Form.Item>

        <Form.Item name="instructorBio" label="Instructor Bio (Legacy)">
          <TextArea
            rows={3}
            placeholder="Brief bio about the instructor's background, experience, and qualifications"
          />
        </Form.Item>

        <Form.Item
          name="instructorQualifications"
          label="Instructor Qualifications (Legacy)"
        >
          <TextArea
            rows={2}
            placeholder="Degrees, certifications, years of experience, notable achievements"
          />
        </Form.Item>
      </div>

      <div className="form-section">
        <Title level={4}>Schedule & Delivery</Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="startDate"
              label="Start Date"
              rules={[{ required: true, message: "Please select start date" }]}
            >
              <DatePicker
                size="large"
                style={{ width: "100%" }}
                placeholder="Select start date"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="endDate"
              label="End Date"
              rules={[{ required: true, message: "Please select end date" }]}
            >
              <DatePicker
                size="large"
                style={{ width: "100%" }}
                placeholder="Select end date"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="registrationDeadline" label="Registration Deadline">
          <DatePicker
            size="large"
            style={{ width: "100%" }}
            placeholder="Last day for registration"
          />
        </Form.Item>

        <Form.Item
          name="deliveryMethod"
          label="Delivery Method"
          rules={[{ required: true, message: "Please select delivery method" }]}
        >
          <Radio.Group size="large">
            <Radio.Button value="online">Online</Radio.Button>
            <Radio.Button value="in-person">In-Person</Radio.Button>
            <Radio.Button value="hybrid">Hybrid</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item name="locationDetails" label="Location Details">
          <TextArea
            rows={2}
            placeholder="For in-person: provide address. For online: platform details will be shared separately."
          />
        </Form.Item>

        <Form.Item name="meetingPlatform" label="Meeting Platform (for online)">
          <Select size="large" placeholder="Select platform">
            <Option value="zoom">Zoom</Option>
            <Option value="teams">Microsoft Teams</Option>
            <Option value="meet">Google Meet</Option>
            <Option value="webex">Cisco Webex</Option>
            <Option value="discord">Discord</Option>
            <Option value="skype">Skype</Option>
            <Option value="custom">Custom Platform</Option>
            <Option value="other">Other</Option>
          </Select>
        </Form.Item>

        <Form.Item name="meetingLink" label="Meeting Link (if available)">
          <Input size="large" placeholder="https://..." />
        </Form.Item>
      </div>

      <div className="form-section">
        <Title level={4}>Course Materials & Requirements</Title>
        <Form.Item name="materialsProvided" label="Materials Provided">
          <Select
            mode="multiple"
            size="large"
            placeholder="Select materials included"
            style={{ width: "100%" }}
          >
            <Option value="slides">Presentation Slides</Option>
            <Option value="notes">Course Notes</Option>
            <Option value="worksheets">Worksheets</Option>
            <Option value="recordings">Session Recordings</Option>
            <Option value="resources">Additional Resources</Option>
            <Option value="assignments">Practice Assignments</Option>
            <Option value="software">Software/Tools Access</Option>
            <Option value="books">Digital Books/PDFs</Option>
            <Option value="templates">Templates</Option>
            <Option value="certificates">Digital Certificates</Option>
          </Select>
        </Form.Item>

        <Form.Item name="equipmentRequired" label="Equipment Required">
          <Select
            mode="multiple"
            size="large"
            placeholder="What participants need"
            style={{ width: "100%" }}
          >
            <Option value="computer">Computer/Laptop</Option>
            <Option value="webcam">Webcam</Option>
            <Option value="microphone">Microphone</Option>
            <Option value="internet">Stable Internet Connection</Option>
            <Option value="smartphone">Smartphone</Option>
            <Option value="tablet">Tablet</Option>
            <Option value="notebook">Notebook & Pen</Option>
            <Option value="calculator">Calculator</Option>
            <Option value="headphones">Headphones</Option>
            <Option value="printer">Printer</Option>
          </Select>
        </Form.Item>

        <Form.Item name="softwareRequired" label="Software Required">
          <Select
            mode="tags"
            size="large"
            placeholder="Enter software/tools needed (press Enter to add)"
            style={{ width: "100%" }}
          />
        </Form.Item>
      </div>

      <div className="form-section">
        <Title level={4}>Pricing & Certification</Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="isFree"
              valuePropName="checked"
              initialValue={true}
            >
              <Checkbox style={{ fontSize: "16px" }}>
                This is a free course
              </Checkbox>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="price" label="Price ($)" initialValue={0}>
              <InputNumber
                size="large"
                style={{ width: "100%" }}
                min={0}
                placeholder="0 for free"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item name="certification" valuePropName="checked">
              <Checkbox style={{ fontSize: "16px" }}>
                Certificate provided upon completion
              </Checkbox>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="certificationBody" label="Certification Body">
              <Input
                size="large"
                placeholder="e.g., Institution name, Professional body"
              />
            </Form.Item>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default EducationDetailsForm;
