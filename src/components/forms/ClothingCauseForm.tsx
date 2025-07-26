'use client';

import React, { useState } from 'react';
import {
  Form,
  Input,
  Select,
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
  Radio,
  Checkbox,
} from 'antd';
import {
  PlusOutlined,
  InboxOutlined,
  InfoCircleOutlined,
  EnvironmentOutlined,
  SafetyOutlined,
  TagOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import type { ClothesDetails } from '@/types';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface ClothingCauseFormProps {
  initialValues?: Partial<ClothesDetails>;
  onSubmit: (values: ClothesDetails) => void;
  loading?: boolean;
}

const clothesTypes = [
  { value: 'tops', label: 'Tops & Shirts', icon: '👕' },
  { value: 'bottoms', label: 'Bottoms & Pants', icon: '👖' },
  { value: 'dresses', label: 'Dresses & Skirts', icon: '👗' },
  { value: 'outerwear', label: 'Jackets & Coats', icon: '🧥' },
  { value: 'shoes', label: 'Shoes & Footwear', icon: '👟' },
  { value: 'accessories', label: 'Accessories', icon: '👜' },
  { value: 'undergarments', label: 'Undergarments', icon: '🩲' },
  { value: 'activewear', label: 'Activewear', icon: '🏃‍♂️' },
  { value: 'formal', label: 'Formal Wear', icon: '🤵' },
  { value: 'sleepwear', label: 'Sleepwear', icon: '🩳' },
];

const categories = [
  { value: 'casual', label: 'Casual', description: 'Everyday wear' },
  { value: 'formal', label: 'Formal', description: 'Business or special occasions' },
  { value: 'activewear', label: 'Activewear', description: 'Sports and exercise' },
  { value: 'workwear', label: 'Workwear', description: 'Professional uniforms' },
  { value: 'special', label: 'Special Occasion', description: 'Events and celebrations' },
];

const ageGroups = [
  { value: 'baby', label: 'Baby (0-2 years)', sizes: ['Newborn', '0-3M', '3-6M', '6-9M', '9-12M', '12-18M', '18-24M'] },
  { value: 'toddler', label: 'Toddler (2-4 years)', sizes: ['2T', '3T', '4T'] },
  { value: 'child', label: 'Child (4-12 years)', sizes: ['4', '5', '6', '7', '8', '10', '12'] },
  { value: 'teen', label: 'Teen (13-17 years)', sizes: ['XS', 'S', 'M', 'L', 'XL'] },
  { value: 'adult', label: 'Adult (18+ years)', sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'] },
  { value: 'senior', label: 'Senior (65+ years)', sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
];

const conditions = [
  { value: 'new', label: 'New with Tags', description: 'Brand new, never worn' },
  { value: 'like-new', label: 'Like New', description: 'Worn once or twice, excellent condition' },
  { value: 'excellent', label: 'Excellent', description: 'Minor signs of wear, very good condition' },
  { value: 'good', label: 'Good', description: 'Some wear but still in good shape' },
  { value: 'fair', label: 'Fair', description: 'Noticeable wear but functional' },
];

const seasons = [
  { value: 'spring', label: 'Spring', icon: '🌸' },
  { value: 'summer', label: 'Summer', icon: '☀️' },
  { value: 'fall', label: 'Fall/Autumn', icon: '🍂' },
  { value: 'winter', label: 'Winter', icon: '❄️' },
  { value: 'all-season', label: 'All Season', icon: '🌍' },
];

const popularBrands = [
  'Nike', 'Adidas', 'H&M', 'Zara', 'Uniqlo', 'Gap', 'Old Navy',
  'Target', 'Walmart', 'Forever 21', 'American Eagle', 'Hollister',
  'Abercrombie', 'Levi\'s', 'Polo Ralph Lauren', 'Tommy Hilfiger',
  'Calvin Klein', 'Under Armour', 'Puma', 'Other'
];

const colors = [
  'Black', 'White', 'Gray', 'Navy', 'Blue', 'Red', 'Green',
  'Yellow', 'Orange', 'Purple', 'Pink', 'Brown', 'Beige',
  'Multicolor', 'Patterned'
];

export function ClothingCauseForm({ initialValues, onSubmit, loading = false }: ClothingCauseFormProps) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('adult');

  const handleSubmit = async (values: any) => {
    try {
      const formattedValues: ClothesDetails = {
        ...values,
        images: fileList.map(file => file.url || '').filter(Boolean),
      };
      
      await onSubmit(formattedValues);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: true,
    fileList,
    onChange: ({ fileList: newFileList }) => setFileList(newFileList),
    beforeUpload: (file: RcFile) => {
      const isImage = file.type.startsWith('image/');
      const isLt5M = file.size / 1024 / 1024 < 5;
      
      if (!isImage) {
        console.error('You can only upload image files!');
        return false;
      }
      if (!isLt5M) {
        console.error('Image must be smaller than 5MB!');
        return false;
      }
      return true;
    },
  };

  const getCurrentSizes = () => {
    const ageGroup = ageGroups.find(group => group.value === selectedAgeGroup);
    return ageGroup?.sizes || [];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="shadow-lg border-0">
        <div className="mb-8">
          <Title level={2} className="flex items-center space-x-3">
            <span className="text-3xl">👕</span>
            <span>Clothing Donation Details</span>
          </Title>
          <Paragraph className="text-gray-600 text-lg">
            Provide detailed information about the clothing items you're donating to help 
            recipients find what they need.
          </Paragraph>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            age_group: 'adult',
            condition: 'good',
            season: 'all-season',
            quantity: 1,
            delivery_available: false,
            is_urgent: false,
            is_cleaned: true,
            donation_receipt: false,
            ...initialValues,
          }}
          className="space-y-6"
        >
          {/* Clothing Type & Category */}
          <Row gutter={[24, 0]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="clothes_type"
                label={
                  <span className="flex items-center space-x-2">
                    <span>Clothing Type</span>
                    <Tooltip title="Select the main category of clothing items">
                      <InfoCircleOutlined className="text-gray-400" />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: 'Please select a clothing type' }]}
              >
                <Select
                  placeholder="Choose clothing type"
                  size="large"
                  className="w-full"
                >
                  {clothesTypes.map(type => (
                    <Option key={type.value} value={type.value}>
                      <div className="flex items-center space-x-2">
                        <span>{type.icon}</span>
                        <span>{type.label}</span>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="category"
                label="Style Category"
                rules={[{ required: true, message: 'Please select a category' }]}
              >
                <Select placeholder="Select style category" size="large">
                  {categories.map(cat => (
                    <Option key={cat.value} value={cat.value}>
                      <div>
                        <div className="font-medium">{cat.label}</div>
                        <div className="text-sm text-gray-500">{cat.description}</div>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Age Group & Sizes */}
          <Row gutter={[24, 0]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="age_group"
                label="Age Group"
                rules={[{ required: true, message: 'Please select an age group' }]}
              >
                <Select
                  placeholder="Select age group"
                  size="large"
                  onChange={setSelectedAgeGroup}
                >
                  {ageGroups.map(group => (
                    <Option key={group.value} value={group.value}>{group.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="size_range"
                label="Available Sizes"
                rules={[{ required: true, message: 'Please select at least one size' }]}
              >
                <Select
                  mode="multiple"
                  placeholder="Select all available sizes"
                  size="large"
                  className="w-full"
                >
                  {getCurrentSizes().map(size => (
                    <Option key={size} value={size}>{size}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Quantity & Condition */}
          <Row gutter={[24, 0]}>
            <Col xs={24} md={8}>
              <Form.Item
                name="quantity"
                label="Number of Items"
                rules={[{ required: true, message: 'Please enter quantity' }]}
              >
                <InputNumber
                  min={1}
                  max={1000}
                  size="large"
                  placeholder="Enter quantity"
                  className="w-full"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="condition"
                label="Condition"
                rules={[{ required: true, message: 'Please select condition' }]}
              >
                <Select size="large" placeholder="Select condition">
                  {conditions.map(cond => (
                    <Option key={cond.value} value={cond.value}>
                      <div>
                        <div className="font-medium">{cond.label}</div>
                        <div className="text-sm text-gray-500">{cond.description}</div>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="season"
                label="Season"
                rules={[{ required: true, message: 'Please select season' }]}
              >
                <Select size="large" placeholder="Select season">
                  {seasons.map(season => (
                    <Option key={season.value} value={season.value}>
                      <div className="flex items-center space-x-2">
                        <span>{season.icon}</span>
                        <span>{season.label}</span>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Colors & Brands */}
          <Row gutter={[24, 0]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="colors"
                label="Colors/Patterns"
              >
                <Select
                  mode="multiple"
                  placeholder="Select colors"
                  size="large"
                  className="w-full"
                >
                  {colors.map(color => (
                    <Option key={color} value={color}>{color}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="brands"
                label="Brands (Optional)"
              >
                <Select
                  mode="tags"
                  placeholder="Add brands"
                  size="large"
                  className="w-full"
                >
                  {popularBrands.map(brand => (
                    <Option key={brand} value={brand}>{brand}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Material & Care */}
          <Divider orientation="left">
            <span className="flex items-center space-x-2">
              <TagOutlined />
              <span>Material & Care Information</span>
            </span>
          </Divider>

          <Row gutter={[24, 0]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="material_composition"
                label="Material Composition"
              >
                <TextArea
                  rows={3}
                  placeholder="e.g., 100% Cotton, 60% Cotton 40% Polyester, etc."
                  className="resize-none"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="care_instructions"
                label="Care Instructions"
              >
                <TextArea
                  rows={3}
                  placeholder="e.g., Machine wash cold, tumble dry low, dry clean only, etc."
                  className="resize-none"
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Special Requirements */}
          <Form.Item
            name="special_requirements"
            label="Special Requirements or Notes"
          >
            <TextArea
              rows={3}
              placeholder="Any special sizing notes, defects, or other important information"
              className="resize-none"
            />
          </Form.Item>

          {/* Condition Flags */}
          <Divider orientation="left">
            <span className="flex items-center space-x-2">
              <SafetyOutlined />
              <span>Item Status</span>
            </span>
          </Divider>

          <Row gutter={[24, 0]}>
            <Col xs={24} md={8}>
              <Form.Item name="is_cleaned" valuePropName="checked">
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">🧼</span>
                    <div>
                      <div className="font-medium">Cleaned & Ready</div>
                      <div className="text-sm text-gray-500">Items are freshly cleaned</div>
                    </div>
                  </div>
                  <Switch />
                </div>
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item name="donation_receipt" valuePropName="checked">
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">📄</span>
                    <div>
                      <div className="font-medium">Need Receipt</div>
                      <div className="text-sm text-gray-500">For tax deduction purposes</div>
                    </div>
                  </div>
                  <Switch />
                </div>
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item name="is_urgent" valuePropName="checked">
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">⚡</span>
                    <div>
                      <div className="font-medium">Urgent Pickup</div>
                      <div className="text-sm text-gray-500">Needs collection today</div>
                    </div>
                  </div>
                  <Switch />
                </div>
              </Form.Item>
            </Col>
          </Row>

          {/* Pickup & Delivery */}
          <Divider orientation="left">
            <span className="flex items-center space-x-2">
              <EnvironmentOutlined />
              <span>Pickup & Delivery</span>
            </span>
          </Divider>

          <Form.Item
            name="pickup_instructions"
            label="Pickup Instructions"
          >
            <TextArea
              rows={3}
              placeholder="Provide specific pickup instructions (location, contact method, available times, etc.)"
              className="resize-none"
            />
          </Form.Item>

          <Row gutter={[24, 0]}>
            <Col xs={24} md={12}>
              <Form.Item name="delivery_available" valuePropName="checked">
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">🚗</span>
                    <div>
                      <div className="font-medium">Delivery Available</div>
                      <div className="text-sm text-gray-500">Can deliver to recipient</div>
                    </div>
                  </div>
                  <Switch />
                </div>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) => 
                  prevValues.delivery_available !== currentValues.delivery_available
                }
              >
                {({ getFieldValue }) =>
                  getFieldValue('delivery_available') && (
                    <Form.Item
                      name="delivery_radius"
                      label="Delivery Radius (km)"
                    >
                      <InputNumber
                        min={1}
                        max={50}
                        size="large"
                        placeholder="Maximum delivery distance"
                        className="w-full"
                        addonAfter="km"
                      />
                    </Form.Item>
                  )
                }
              </Form.Item>
            </Col>
          </Row>

          {/* Photo Upload */}
          <Divider orientation="left">
            <span className="flex items-center space-x-2">
              <span>📸</span>
              <span>Photos</span>
            </span>
          </Divider>

          <Form.Item
            name="images"
            label="Clothing Photos"
            extra="Upload clear photos showing the items' condition and style. Multiple angles help recipients make informed decisions."
          >
            <Upload.Dragger {...uploadProps} className="upload-area">
              <p className="ant-upload-drag-icon">
                <InboxOutlined className="text-4xl text-blue-500" />
              </p>
              <p className="ant-upload-text text-lg">
                Click or drag photos to upload
              </p>
              <p className="ant-upload-hint">
                Support for multiple photos. Max 5MB per image.
              </p>
            </Upload.Dragger>
          </Form.Item>

          {/* Guidelines Notice */}
          <Alert
            message="Donation Guidelines"
            description="Please ensure all clothing items are clean, in good condition, and suitable for donation. Items should be free from stains, tears, or odors."
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
              {initialValues ? 'Update Clothing Details' : 'Create Clothing Donation'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </motion.div>
  );
}