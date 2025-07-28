'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Upload,
  Button,
  Card,
  Row,
  Col,
  Typography,
  Space,
  message,
  Steps,
  Divider,
  Tag,
  Spin,
  Alert
} from 'antd';
import {
  SaveOutlined,
  ArrowLeftOutlined,
  CloudUploadOutlined,
  DeleteOutlined,
  PlusOutlined,
  EditOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { Step } = Steps;

interface Cause {
  id: number;
  title: string;
  description: string;
  detailedDescription?: string;
  category: string;
  category_name: string;
  goalAmount: number;
  urgencyLevel: string;
  location: string;
  deadline?: string;
  image?: string;
  gallery?: string[];
  creator_id: number;
  verified: boolean;
  status: string;
}

interface CategoryDetails {
  // Food details
  food_type?: string;
  servings_count?: number;
  dietary_restrictions?: string[];
  preparation_time?: number;
  cooking_instructions?: string;
  
  // Clothes details
  clothing_type?: string;
  sizes_available?: string[];
  gender?: string;
  season?: string;
  condition?: string;
  
  // Education details
  education_type?: string;
  skill_level?: string;
  topics?: string[];
  max_trainees?: number;
  duration_hours?: number;
  prerequisites?: string;
  learning_objectives?: string[];
  instructor_name?: string;
  instructor_email?: string;
  certification?: boolean;
}

const categories = [
  { value: 'food', label: 'Food Assistance' },
  { value: 'clothes', label: 'Clothing Drive' },
  { value: 'education', label: 'Education & Training' },
];

const urgencyLevels = [
  { value: 'low', label: 'Low Priority' },
  { value: 'medium', label: 'Medium Priority' },
  { value: 'high', label: 'High Priority' },
  { value: 'critical', label: 'Critical' },
];

export default function EditCausePage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [form] = Form.useForm();
  const [cause, setCause] = useState<Cause | null>(null);
  const [categoryDetails, setCategoryDetails] = useState<CategoryDetails>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session?.user) {
      router.push('/auth/signin');
      return;
    }
    
    fetchCauseDetails();
  }, [params.id, session, status]);

  const fetchCauseDetails = async () => {
    try {
      const response = await fetch(`/api/causes/${params.id}`);
      const result = await response.json();
      
      if (result.success) {
        const causeData = result.data.cause;
        
        // Check if user is the owner
        if (causeData.creator_id !== session?.user?.id) {
          message.error('You can only edit your own causes');
          router.push(`/causes/${params.id}`);
          return;
        }
        
        setCause(causeData);
        setCategoryDetails(result.data.categoryDetails || {});
        setSelectedCategory(causeData.category_name || '');
        setImageUrls(causeData.gallery || []);
        
        // Populate form with existing data
        form.setFieldsValue({
          title: causeData.title,
          description: causeData.description,
          detailedDescription: causeData.detailedDescription,
          category: causeData.category_name,
          goalAmount: causeData.goalAmount,
          urgencyLevel: causeData.urgencyLevel,
          location: causeData.location,
          deadline: causeData.deadline ? dayjs(causeData.deadline) : undefined,
          ...result.data.categoryDetails
        });
        
      } else {
        message.error('Failed to load cause details');
        router.push('/causes');
      }
    } catch (error) {
      console.error('Error fetching cause:', error);
      message.error('Failed to load cause details');
      router.push('/causes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setSaving(true);
      
      const updateData = {
        ...values,
        deadline: values.deadline ? values.deadline.format('YYYY-MM-DD') : null,
        gallery: imageUrls,
        categoryDetails: getCategorySpecificData(values)
      };
      
      const response = await fetch(`/api/causes/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        message.success('Cause updated successfully!');
        router.push(`/causes/${params.id}`);
      } else {
        message.error(result.error || 'Failed to update cause');
      }
    } catch (error) {
      console.error('Error updating cause:', error);
      message.error('Failed to update cause');
    } finally {
      setSaving(false);
    }
  };

  const getCategorySpecificData = (values: any) => {
    switch (selectedCategory) {
      case 'food':
        return {
          food_type: values.food_type,
          servings_count: values.servings_count,
          dietary_restrictions: values.dietary_restrictions || [],
          preparation_time: values.preparation_time,
          cooking_instructions: values.cooking_instructions,
        };
      case 'clothes':
        return {
          clothing_type: values.clothing_type,
          sizes_available: values.sizes_available || [],
          gender: values.gender,
          season: values.season,
          condition: values.condition,
        };
      case 'education':
        return {
          education_type: values.education_type,
          skill_level: values.skill_level,
          topics: values.topics || [],
          max_trainees: values.max_trainees,
          duration_hours: values.duration_hours,
          prerequisites: values.prerequisites,
          learning_objectives: values.learning_objectives || [],
          instructor_name: values.instructor_name,
          instructor_email: values.instructor_email,
          certification: values.certification || false,
        };
      default:
        return {};
    }
  };

  const renderCategorySpecificFields = () => {
    switch (selectedCategory) {
      case 'food':
        return (
          <>
            <Col xs={24} md={12}>
              <Form.Item name="food_type" label="Food Type">
                <Select placeholder="Select food type">
                  <Option value="meals">Ready Meals</Option>
                  <Option value="groceries">Groceries</Option>
                  <Option value="snacks">Snacks</Option>
                  <Option value="beverages">Beverages</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="servings_count" label="Number of Servings">
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item name="dietary_restrictions" label="Dietary Restrictions">
                <Select mode="multiple" placeholder="Select dietary restrictions">
                  <Option value="vegetarian">Vegetarian</Option>
                  <Option value="vegan">Vegan</Option>
                  <Option value="halal">Halal</Option>
                  <Option value="kosher">Kosher</Option>
                  <Option value="gluten-free">Gluten Free</Option>
                  <Option value="dairy-free">Dairy Free</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="preparation_time" label="Preparation Time (minutes)">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item name="cooking_instructions" label="Cooking Instructions">
                <TextArea rows={3} placeholder="Provide cooking or serving instructions" />
              </Form.Item>
            </Col>
          </>
        );

      case 'clothes':
        return (
          <>
            <Col xs={24} md={12}>
              <Form.Item name="clothing_type" label="Clothing Type">
                <Select placeholder="Select clothing type">
                  <Option value="shirts">Shirts</Option>
                  <Option value="pants">Pants</Option>
                  <Option value="jackets">Jackets</Option>
                  <Option value="shoes">Shoes</Option>
                  <Option value="accessories">Accessories</Option>
                  <Option value="undergarments">Undergarments</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="gender" label="Gender">
                <Select placeholder="Select target gender">
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                  <Option value="unisex">Unisex</Option>
                  <Option value="kids">Kids</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item name="sizes_available" label="Available Sizes">
                <Select mode="multiple" placeholder="Select available sizes">
                  <Option value="XS">XS</Option>
                  <Option value="S">S</Option>
                  <Option value="M">M</Option>
                  <Option value="L">L</Option>
                  <Option value="XL">XL</Option>
                  <Option value="XXL">XXL</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="season" label="Season">
                <Select placeholder="Select season">
                  <Option value="spring">Spring</Option>
                  <Option value="summer">Summer</Option>
                  <Option value="fall">Fall</Option>
                  <Option value="winter">Winter</Option>
                  <Option value="all-season">All Season</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="condition" label="Condition">
                <Select placeholder="Select condition">
                  <Option value="new">New</Option>
                  <Option value="like-new">Like New</Option>
                  <Option value="good">Good</Option>
                  <Option value="fair">Fair</Option>
                </Select>
              </Form.Item>
            </Col>
          </>
        );

      case 'education':
        return (
          <>
            <Col xs={24} md={12}>
              <Form.Item name="education_type" label="Education Type">
                <Select placeholder="Select education type">
                  <Option value="workshop">Workshop</Option>
                  <Option value="course">Course</Option>
                  <Option value="seminar">Seminar</Option>
                  <Option value="certification">Certification Program</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="skill_level" label="Skill Level">
                <Select placeholder="Select skill level">
                  <Option value="beginner">Beginner</Option>
                  <Option value="intermediate">Intermediate</Option>
                  <Option value="advanced">Advanced</Option>
                  <Option value="expert">Expert</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item name="topics" label="Topics Covered">
                <Select mode="tags" placeholder="Enter topics covered">
                  <Option value="programming">Programming</Option>
                  <Option value="design">Design</Option>
                  <Option value="marketing">Marketing</Option>
                  <Option value="business">Business</Option>
                  <Option value="language">Language</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="max_trainees" label="Maximum Trainees">
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="duration_hours" label="Duration (hours)">
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item name="prerequisites" label="Prerequisites">
                <TextArea rows={2} placeholder="List any prerequisites" />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item name="learning_objectives" label="Learning Objectives">
                <Select mode="tags" placeholder="Enter learning objectives" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="instructor_name" label="Instructor Name">
                <Input placeholder="Enter instructor name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="instructor_email" label="Instructor Email">
                <Input type="email" placeholder="Enter instructor email" />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item name="certification" label="Certification Provided" valuePropName="checked">
                <Select placeholder="Certification available?">
                  <Option value={true}>Yes</Option>
                  <Option value={false}>No</Option>
                </Select>
              </Form.Item>
            </Col>
          </>
        );

      default:
        return null;
    }
  };

  if (loading || status === 'loading') {
    return (
      <MainLayout>
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px' }}>Loading cause details...</div>
        </div>
      </MainLayout>
    );
  }

  if (!cause) {
    return (
      <MainLayout>
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
          <Alert 
            message="Cause not found" 
            description="The cause you're trying to edit doesn't exist or you don't have permission to edit it."
            type="error"
            showIcon
          />
          <Button 
            type="primary" 
            onClick={() => router.push('/causes')}
            style={{ marginTop: '16px' }}
          >
            Back to Causes
          </Button>
        </div>
      </MainLayout>
    );
  }

  const steps = [
    {
      title: 'Basic Information',
      content: (
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <Form.Item
              name="title"
              label="Cause Title"
              rules={[{ required: true, message: 'Please enter a title' }]}
            >
              <Input placeholder="Enter a descriptive title" size="large" />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item
              name="description"
              label="Short Description"
              rules={[{ required: true, message: 'Please enter a description' }]}
            >
              <TextArea rows={3} placeholder="Brief description of your cause" />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item name="detailedDescription" label="Detailed Description">
              <TextArea rows={6} placeholder="Provide detailed information about your cause" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: 'Please select a category' }]}
            >
              <Select 
                placeholder="Select category" 
                size="large"
                onChange={(value) => setSelectedCategory(value)}
              >
                {categories.map(cat => (
                  <Option key={cat.value} value={cat.value}>
                    {cat.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="urgencyLevel"
              label="Priority Level"
              rules={[{ required: true, message: 'Please select priority level' }]}
            >
              <Select placeholder="Select priority" size="large">
                {urgencyLevels.map(level => (
                  <Option key={level.value} value={level.value}>
                    {level.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      ),
    },
    {
      title: 'Details & Goals',
      content: (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="goalAmount"
              label="Goal Amount ($)"
              rules={[{ required: true, message: 'Please enter goal amount' }]}
            >
              <InputNumber
                min={1}
                style={{ width: '100%' }}
                size="large"
                formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as any}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="deadline" label="Deadline (Optional)">
              <DatePicker style={{ width: '100%' }} size="large" />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item
              name="location"
              label="Location"
              rules={[{ required: true, message: 'Please enter location' }]}
            >
              <Input placeholder="City, State/Province, Country" size="large" />
            </Form.Item>
          </Col>
          {renderCategorySpecificFields()}
        </Row>
      ),
    },
  ];

  return (
    <MainLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => router.back()}
              style={{ marginBottom: '16px' }}
            >
              Back
            </Button>
            <Title level={2} style={{ margin: 0 }}>
              <EditOutlined style={{ marginRight: '8px' }} />
              Edit Cause
            </Title>
            <Text type="secondary">Update your cause information and details</Text>
          </div>

          {/* Progress Steps */}
          <Card style={{ marginBottom: '24px' }}>
            <Steps current={currentStep} onChange={setCurrentStep}>
              {steps.map((step, index) => (
                <Step key={index} title={step.title} />
              ))}
            </Steps>
          </Card>

          {/* Form */}
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            size="middle"
          >
            <Card>
              <div style={{ minHeight: '400px' }}>
                {steps[currentStep].content}
              </div>

              <Divider />

              {/* Navigation Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  {currentStep > 0 && (
                    <Button onClick={() => setCurrentStep(currentStep - 1)}>
                      Previous
                    </Button>
                  )}
                </div>
                <div>
                  {currentStep < steps.length - 1 ? (
                    <Button 
                      type="primary" 
                      onClick={() => setCurrentStep(currentStep + 1)}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      size="large"
                      icon={<SaveOutlined />}
                      htmlType="submit"
                      loading={saving}
                    >
                      Update Cause
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </Form>
        </motion.div>
      </div>
    </MainLayout>
  );
}
