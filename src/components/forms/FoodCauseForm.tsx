'use client';

import React, { useState } from 'react';
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
} from 'antd';
import {
  PlusOutlined,
  InboxOutlined,
  InfoCircleOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  SafetyOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import type { FoodDetails } from '@/types';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = TimePicker;

interface FoodCauseFormProps {
  initialValues?: Partial<FoodDetails>;
  onSubmit: (values: FoodDetails) => void;
  loading?: boolean;
}

const foodTypes = [
  { value: 'prepared-meals', label: 'Prepared Meals', icon: '🍽️' },
  { value: 'fresh-produce', label: 'Fresh Produce', icon: '🥬' },
  { value: 'canned-goods', label: 'Canned Goods', icon: '🥫' },
  { value: 'dry-goods', label: 'Dry Goods', icon: '🌾' },
  { value: 'beverages', label: 'Beverages', icon: '🥤' },
  { value: 'snacks', label: 'Snacks', icon: '🍪' },
  { value: 'baby-food', label: 'Baby Food', icon: '🍼' },
  { value: 'frozen', label: 'Frozen Items', icon: '❄️' },
];

const cuisineTypes = [
  'Mediterranean', 'Italian', 'Mexican', 'Indian', 'Chinese', 'Japanese',
  'Thai', 'Middle Eastern', 'American', 'French', 'Greek', 'Spanish',
  'Korean', 'Vietnamese', 'Vegetarian', 'Vegan', 'Other'
];

const dietaryRestrictions = [
  'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free',
  'Soy-Free', 'Low-Sodium', 'Low-Sugar', 'Keto', 'Paleo'
];

const allergens = [
  'Peanuts', 'Tree Nuts', 'Dairy', 'Eggs', 'Soy', 'Wheat', 'Fish',
  'Shellfish', 'Sesame', 'Sulfites'
];

const temperatureRequirements = [
  { value: 'frozen', label: 'Frozen (-18°C or below)' },
  { value: 'refrigerated', label: 'Refrigerated (0-4°C)' },
  { value: 'room-temp', label: 'Room Temperature' },
  { value: 'heated', label: 'Keep Heated (60°C+)' },
];

export function FoodCauseForm({ initialValues, onSubmit, loading = false }: FoodCauseFormProps) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [selectedFoodType, setSelectedFoodType] = useState<string>('');

  const handleSubmit = async (values: any) => {
    try {
      const formattedValues: FoodDetails = {
        ...values,
        expiration_date: values.expiration_date?.format('YYYY-MM-DD'),
        preparation_date: values.preparation_date?.format('YYYY-MM-DD'),
        availability_hours: values.availability_hours 
          ? `${values.availability_hours[0].format('HH:mm')}-${values.availability_hours[1].format('HH:mm')}`
          : undefined,
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="shadow-lg border-0">
        <div className="mb-8">
          <Title level={2} className="flex items-center space-x-3">
            <span className="text-3xl">🍽️</span>
            <span>Food Assistance Details</span>
          </Title>
          <Paragraph className="text-gray-600 text-lg">
            Provide detailed information about the food items you're sharing to help recipients 
            understand what's available and any special requirements.
          </Paragraph>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            quantity: 1,
            unit: 'servings',
            temperature_requirements: 'room-temp',
            delivery_available: false,
            is_urgent: false,
            halal: false,
            kosher: false,
            organic: false,
            ...initialValues,
            expiration_date: initialValues?.expiration_date ? dayjs(initialValues.expiration_date) : undefined,
            preparation_date: initialValues?.preparation_date ? dayjs(initialValues.preparation_date) : undefined,
          }}
          className="space-y-6"
        >
          {/* Food Type & Cuisine */}
          <Row gutter={[24, 0]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="food_type"
                label={
                  <span className="flex items-center space-x-2">
                    <span>Food Type</span>
                    <Tooltip title="Select the category that best describes your food items">
                      <InfoCircleOutlined className="text-gray-400" />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: 'Please select a food type' }]}
              >
                <Select
                  placeholder="Choose food type"
                  size="large"
                  onChange={setSelectedFoodType}
                  className="w-full"
                >
                  {foodTypes.map(type => (
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
                name="cuisine_type"
                label="Cuisine Type (Optional)"
              >
                <Select
                  placeholder="Select cuisine"
                  size="large"
                  allowClear
                  showSearch
                  className="w-full"
                >
                  {cuisineTypes.map(cuisine => (
                    <Option key={cuisine} value={cuisine}>{cuisine}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Quantity & Serving */}
          <Row gutter={[24, 0]}>
            <Col xs={24} md={8}>
              <Form.Item
                name="quantity"
                label="Quantity Available"
                rules={[{ required: true, message: 'Please enter quantity' }]}
              >
                <InputNumber
                  min={1}
                  max={10000}
                  size="large"
                  placeholder="Enter quantity"
                  className="w-full"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="unit"
                label="Unit of Measurement"
                rules={[{ required: true, message: 'Please select unit' }]}
              >
                <Select size="large" placeholder="Select unit">
                  <Option value="servings">Servings</Option>
                  <Option value="meals">Meals</Option>
                  <Option value="portions">Portions</Option>
                  <Option value="kg">Kilograms</Option>
                  <Option value="lbs">Pounds</Option>
                  <Option value="pieces">Pieces</Option>
                  <Option value="containers">Containers</Option>
                  <Option value="boxes">Boxes</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="serving_size"
                label="Serving Size (Optional)"
              >
                <InputNumber
                  min={1}
                  size="large"
                  placeholder="People per serving"
                  className="w-full"
                  addonAfter="people"
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Dates */}
          <Row gutter={[24, 0]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="preparation_date"
                label="Preparation Date"
              >
                <DatePicker
                  size="large"
                  placeholder="When was this prepared?"
                  className="w-full"
                  disabledDate={(current) => current && current > dayjs().endOf('day')}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="expiration_date"
                label={
                  <span className="flex items-center space-x-2">
                    <span>Expiration/Best By Date</span>
                    <Tooltip title="When should this food be consumed by?">
                      <InfoCircleOutlined className="text-gray-400" />
                    </Tooltip>
                  </span>
                }
              >
                <DatePicker
                  size="large"
                  placeholder="Best by date"
                  className="w-full"
                  disabledDate={(current) => current && current < dayjs().startOf('day')}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Dietary Information */}
          <Divider orientation="left">
            <span className="flex items-center space-x-2">
              <SafetyOutlined />
              <span>Dietary Information</span>
            </span>
          </Divider>

          <Row gutter={[24, 0]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="dietary_restrictions"
                label="Dietary Restrictions"
              >
                <Select
                  mode="multiple"
                  placeholder="Select all that apply"
                  size="large"
                  className="w-full"
                >
                  {dietaryRestrictions.map(restriction => (
                    <Option key={restriction} value={restriction}>{restriction}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="allergens"
                label="Contains Allergens"
              >
                <Select
                  mode="multiple"
                  placeholder="Select allergens present"
                  size="large"
                  className="w-full"
                >
                  {allergens.map(allergen => (
                    <Option key={allergen} value={allergen}>{allergen}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Special Dietary Flags */}
          <Row gutter={[24, 0]}>
            <Col xs={24} md={8}>
              <Form.Item name="halal" valuePropName="checked">
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">🕌</span>
                    <div>
                      <div className="font-medium">Halal Certified</div>
                      <div className="text-sm text-gray-500">Prepared according to Islamic law</div>
                    </div>
                  </div>
                  <Switch />
                </div>
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item name="kosher" valuePropName="checked">
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">✡️</span>
                    <div>
                      <div className="font-medium">Kosher Certified</div>
                      <div className="text-sm text-gray-500">Prepared according to Jewish law</div>
                    </div>
                  </div>
                  <Switch />
                </div>
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item name="organic" valuePropName="checked">
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">🌱</span>
                    <div>
                      <div className="font-medium">Organic</div>
                      <div className="text-sm text-gray-500">Certified organic ingredients</div>
                    </div>
                  </div>
                  <Switch />
                </div>
              </Form.Item>
            </Col>
          </Row>

          {/* Storage & Temperature */}
          <Divider orientation="left">
            <span className="flex items-center space-x-2">
              <span>🌡️</span>
              <span>Storage Requirements</span>
            </span>
          </Divider>

          <Row gutter={[24, 0]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="temperature_requirements"
                label="Temperature Requirements"
                rules={[{ required: true, message: 'Please select temperature requirement' }]}
              >
                <Select size="large" placeholder="Select storage temperature">
                  {temperatureRequirements.map(temp => (
                    <Option key={temp.value} value={temp.value}>{temp.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item name="is_urgent" valuePropName="checked">
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">⚡</span>
                    <div>
                      <div className="font-medium">Urgent Pickup Required</div>
                      <div className="text-sm text-gray-500">Needs to be collected today</div>
                    </div>
                  </div>
                  <Switch />
                </div>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="storage_requirements"
            label="Storage Instructions"
          >
            <TextArea
              rows={3}
              placeholder="Provide specific storage instructions (e.g., keep refrigerated, store in dry place, etc.)"
              className="resize-none"
            />
          </Form.Item>

          {/* Ingredients & Nutrition */}
          <Divider orientation="left">
            <span className="flex items-center space-x-2">
              <span>📋</span>
              <span>Additional Information</span>
            </span>
          </Divider>

          <Row gutter={[24, 0]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="ingredients"
                label="Ingredients List (Optional)"
              >
                <TextArea
                  rows={4}
                  placeholder="List main ingredients (especially for allergen awareness)"
                  className="resize-none"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="packaging_details"
                label="Packaging Details"
              >
                <TextArea
                  rows={4}
                  placeholder="Describe packaging (e.g., vacuum sealed, containers included, etc.)"
                  className="resize-none"
                />
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
              placeholder="Provide specific pickup instructions (location, contact method, etc.)"
              className="resize-none"
            />
          </Form.Item>

          <Row gutter={[24, 0]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="availability_hours"
                label="Available Hours"
              >
                <RangePicker
                  size="large"
                  placeholder={['Start time', 'End time']}
                  className="w-full"
                  format="HH:mm"
                />
              </Form.Item>
            </Col>

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
          </Row>

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

          {/* Photo Upload */}
          <Divider orientation="left">
            <span className="flex items-center space-x-2">
              <span>📸</span>
              <span>Photos</span>
            </span>
          </Divider>

          <Form.Item
            name="images"
            label="Food Photos"
            extra="Upload photos of the food items. Good photos help build trust and show the quality of items."
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

          {/* Safety Notice */}
          <Alert
            message="Food Safety Notice"
            description="Please ensure all food items are safe for consumption and follow local food safety guidelines. Only share food that you would eat yourself."
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
              {initialValues ? 'Update Food Details' : 'Create Food Assistance'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </motion.div>
  );
}