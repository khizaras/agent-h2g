import React from 'react';
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
  Space,
  Card,
} from 'antd';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface FoodDetailsFormProps {
  form: any;
}

const FoodDetailsForm: React.FC<FoodDetailsFormProps> = ({ form }) => {
  return (
    <div className="modern-form-step">
      <div className="step-header">
        <div className="step-icon">🍽️</div>
        <Title level={3}>Food Details</Title>
        <Text type="secondary">
          Provide specific information about the food you're offering
        </Text>
      </div>

      <div className="form-section">
        <Title level={4}>Basic Food Information</Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="foodType"
              label="Food Type"
              rules={[{ required: true, message: "Please select food type" }]}
            >
              <Select size="large" placeholder="Select food type">
                <Option value="fresh-produce">Fresh Produce</Option>
                <Option value="cooked-meals">Cooked Meals</Option>
                <Option value="packaged-food">Packaged Food</Option>
                <Option value="beverages">Beverages</Option>
                <Option value="dairy">Dairy Products</Option>
                <Option value="meat-seafood">Meat & Seafood</Option>
                <Option value="baked-goods">Baked Goods</Option>
                <Option value="frozen">Frozen Food</Option>
                <Option value="canned">Canned Food</Option>
                <Option value="snacks">Snacks & Treats</Option>
                <Option value="baby-food">Baby Food</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="cuisineType" label="Cuisine Type">
              <Input
                size="large"
                placeholder="e.g., Italian, Indian, Mexican, Mediterranean"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Form.Item
              name="quantity"
              label="Quantity"
              rules={[{ required: true, message: "Please enter quantity" }]}
            >
              <InputNumber
                size="large"
                style={{ width: "100%" }}
                min={1}
                placeholder="Number"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="unit"
              label="Unit"
              initialValue="servings"
              rules={[{ required: true, message: "Please select unit" }]}
            >
              <Select size="large">
                <Option value="servings">Servings</Option>
                <Option value="kg">Kilograms</Option>
                <Option value="lbs">Pounds</Option>
                <Option value="pieces">Pieces</Option>
                <Option value="boxes">Boxes</Option>
                <Option value="bags">Bags</Option>
                <Option value="liters">Liters</Option>
                <Option value="cans">Cans</Option>
                <Option value="bottles">Bottles</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="servingSize" label="Serving Size (people)">
              <InputNumber
                size="large"
                style={{ width: "100%" }}
                min={1}
                placeholder="e.g., 50"
              />
            </Form.Item>
          </Col>
        </Row>
      </div>

      <div className="form-section">
        <Title level={4}>Food Safety & Storage</Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item name="expirationDate" label="Expiration Date">
              <DatePicker
                size="large"
                style={{ width: "100%" }}
                placeholder="Select expiry date"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="preparationDate" label="Preparation Date">
              <DatePicker
                size="large"
                style={{ width: "100%" }}
                placeholder="When was it prepared?"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="temperatureRequirements"
              label="Storage Temperature"
              initialValue="room-temp"
            >
              <Select size="large">
                <Option value="frozen">Frozen (-18°C or below)</Option>
                <Option value="refrigerated">Refrigerated (0-4°C)</Option>
                <Option value="room-temp">Room Temperature</Option>
                <Option value="hot">Hot/Warm (above 60°C)</Option>
                <Option value="cool-dry">Cool & Dry</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="packagingDetails" label="Packaging Details">
              <Input
                size="large"
                placeholder="e.g., vacuum sealed, in containers, individually wrapped"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="storageRequirements" label="Storage Requirements">
          <TextArea
            rows={2}
            placeholder="Special storage instructions, temperature requirements, etc."
          />
        </Form.Item>
      </div>

      <div className="form-section">
        <Title level={4}>Dietary Information</Title>
        <Form.Item name="dietaryRestrictions" label="Dietary Restrictions">
          <Select
            mode="multiple"
            size="large"
            placeholder="Select any dietary restrictions"
            style={{ width: "100%" }}
          >
            <Option value="vegetarian">Vegetarian</Option>
            <Option value="vegan">Vegan</Option>
            <Option value="gluten-free">Gluten Free</Option>
            <Option value="nut-free">Nut Free</Option>
            <Option value="dairy-free">Dairy Free</Option>
            <Option value="soy-free">Soy Free</Option>
            <Option value="egg-free">Egg Free</Option>
            <Option value="low-sodium">Low Sodium</Option>
            <Option value="low-sugar">Low Sugar</Option>
            <Option value="diabetic-friendly">Diabetic Friendly</Option>
            <Option value="keto">Keto Friendly</Option>
            <Option value="paleo">Paleo</Option>
          </Select>
        </Form.Item>

        <Form.Item name="allergens" label="Known Allergens">
          <Select
            mode="multiple"
            size="large"
            placeholder="Select any allergens present"
            style={{ width: "100%" }}
          >
            <Option value="nuts">Nuts</Option>
            <Option value="peanuts">Peanuts</Option>
            <Option value="dairy">Dairy</Option>
            <Option value="eggs">Eggs</Option>
            <Option value="soy">Soy</Option>
            <Option value="gluten">Gluten/Wheat</Option>
            <Option value="fish">Fish</Option>
            <Option value="shellfish">Shellfish</Option>
            <Option value="sesame">Sesame</Option>
            <Option value="sulfites">Sulfites</Option>
          </Select>
        </Form.Item>

        <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
          <Col xs={24} md={8}>
            <Form.Item name="halal" valuePropName="checked">
              <Checkbox style={{ fontSize: '16px' }}>Halal Certified</Checkbox>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="kosher" valuePropName="checked">
              <Checkbox style={{ fontSize: '16px' }}>Kosher Certified</Checkbox>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="organic" valuePropName="checked">
              <Checkbox style={{ fontSize: '16px' }}>Organic</Checkbox>
            </Form.Item>
          </Col>
        </Row>
      </div>

      <div className="form-section">
        <Title level={4}>Additional Details</Title>
        <Form.Item name="ingredients" label="Main Ingredients">
          <TextArea 
            rows={3} 
            placeholder="List the main ingredients (especially important for allergen information)"
          />
        </Form.Item>

        <Form.Item name="nutritionalInfo" label="Nutritional Information">
          <TextArea
            rows={2}
            placeholder="Any nutritional information you'd like to share (calories, protein, etc.)"
          />
        </Form.Item>

        <Form.Item name="pickupInstructions" label="Pickup Instructions">
          <TextArea
            rows={3}
            placeholder="Special instructions for pickup, handling, or coordination"
          />
        </Form.Item>
      </div>

      <div className="form-section">
        <Title level={4}>Delivery & Urgency</Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item name="deliveryAvailable" valuePropName="checked">
              <Checkbox style={{ fontSize: '16px' }}>Delivery Available</Checkbox>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="isUrgent" valuePropName="checked">
              <Checkbox style={{ fontSize: '16px' }}>Urgent Pickup Required</Checkbox>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="deliveryRadius"
          label="Delivery Radius (km)"
          tooltip="How far are you willing to deliver? Leave blank if pickup only"
        >
          <InputNumber
            size="large"
            style={{ width: "100%" }}
            min={1}
            max={100}
            placeholder="e.g., 10"
          />
        </Form.Item>
      </div>
    </div>
  );
};

export default FoodDetailsForm;