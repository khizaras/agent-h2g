import React from 'react';
import {
  Form,
  Input,
  Select,
  InputNumber,
  Checkbox,
  Row,
  Col,
  Typography,
  Card,
} from 'antd';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface ClothesDetailsFormProps {
  form: any;
}

const ClothesDetailsForm: React.FC<ClothesDetailsFormProps> = ({ form }) => {
  return (
    <div className="modern-form-step">
      <div className="step-header">
        <div className="step-icon">👕</div>
        <Title level={3}>Clothing Details</Title>
        <Text type="secondary">
          Provide specific information about the clothing items
        </Text>
      </div>

      <div className="form-section">
        <Title level={4}>Basic Clothing Information</Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="clothesType"
              label="Clothing Type"
              rules={[{ required: true, message: "Please select clothing type" }]}
            >
              <Select size="large" placeholder="Select clothing type">
                <Option value="donation">Donation (Giving Away)</Option>
                <Option value="request">Request (Need Items)</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="clothesCategory"
              label="Category"
              rules={[{ required: true, message: "Please select category" }]}
            >
              <Select size="large" placeholder="Select category">
                <Option value="tops">Tops & Shirts</Option>
                <Option value="bottoms">Bottoms & Pants</Option>
                <Option value="dresses">Dresses & Skirts</Option>
                <Option value="outerwear">Outerwear & Jackets</Option>
                <Option value="shoes">Shoes & Footwear</Option>
                <Option value="accessories">Accessories</Option>
                <Option value="undergarments">Undergarments</Option>
                <Option value="formal">Formal Wear</Option>
                <Option value="sleepwear">Sleepwear</Option>
                <Option value="sportswear">Sportswear</Option>
                <Option value="workwear">Work Uniforms</Option>
                <Option value="maternity">Maternity Wear</Option>
                <Option value="swimwear">Swimwear</Option>
                <Option value="costumes">Costumes</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Form.Item
              name="ageGroup"
              label="Age Group"
              initialValue="adult"
              rules={[{ required: true, message: "Please select age group" }]}
            >
              <Select size="large">
                <Option value="newborn">Newborn (0-3 months)</Option>
                <Option value="infant">Infant (3-12 months)</Option>
                <Option value="toddler">Toddler (1-3 years)</Option>
                <Option value="child">Child (4-12 years)</Option>
                <Option value="teen">Teen (13-17 years)</Option>
                <Option value="adult">Adult (18+ years)</Option>
                <Option value="senior">Senior (65+ years)</Option>
                <Option value="plus-size">Plus Size</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="condition"
              label="Condition"
              rules={[{ required: true, message: "Please select condition" }]}
            >
              <Select size="large">
                <Option value="new">New with Tags</Option>
                <Option value="excellent">Excellent (Like New)</Option>
                <Option value="good">Good (Minor Wear)</Option>
                <Option value="fair">Fair (Noticeable Wear)</Option>
                <Option value="worn">Well Worn</Option>
                <Option value="vintage">Vintage</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="season"
              label="Season"
              initialValue="all-season"
              rules={[{ required: true, message: "Please select season" }]}
            >
              <Select size="large">
                <Option value="spring">Spring</Option>
                <Option value="summer">Summer</Option>
                <Option value="fall">Fall/Autumn</Option>
                <Option value="winter">Winter</Option>
                <Option value="all-season">All Season</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </div>

      <div className="form-section">
        <Title level={4}>Size & Quantity</Title>
        <Form.Item
          name="sizeRange"
          label="Size Range"
          rules={[{ required: true, message: "Please select sizes" }]}
        >
          <Select
            mode="multiple"
            size="large"
            placeholder="Select sizes available"
            style={{ width: "100%" }}
          >
            <Option value="xs">XS</Option>
            <Option value="s">S</Option>
            <Option value="m">M</Option>
            <Option value="l">L</Option>
            <Option value="xl">XL</Option>
            <Option value="xxl">XXL</Option>
            <Option value="xxxl">XXXL</Option>
            <Option value="4xl">4XL</Option>
            <Option value="5xl">5XL</Option>
            {/* Baby/Child sizes */}\n            <Option value="0-3m">0-3 months</Option>
            <Option value="3-6m">3-6 months</Option>
            <Option value="6-12m">6-12 months</Option>
            <Option value="12-18m">12-18 months</Option>
            <Option value="18-24m">18-24 months</Option>
            <Option value="2t">2T</Option>
            <Option value="3t">3T</Option>
            <Option value="4t">4T</Option>
            <Option value="5t">5T</Option>
            <Option value="6t">6T</Option>
            {/* Shoe sizes */}\n            <Option value="5">Size 5</Option>
            <Option value="6">Size 6</Option>
            <Option value="7">Size 7</Option>
            <Option value="8">Size 8</Option>
            <Option value="9">Size 9</Option>
            <Option value="10">Size 10</Option>
            <Option value="11">Size 11</Option>
            <Option value="12">Size 12</Option>
            <Option value="13">Size 13</Option>
            <Option value="14">Size 14</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="quantity"
          label="Quantity"
          rules={[{ required: true, message: "Please enter quantity" }]}
        >
          <InputNumber
            size="large"
            style={{ width: "100%" }}
            min={1}
            placeholder="Number of items"
          />
        </Form.Item>
      </div>

      <div className="form-section">
        <Title level={4}>Appearance & Style</Title>
        <Form.Item name="colors" label="Colors Available">
          <Select
            mode="multiple"
            size="large"
            placeholder="Select colors"
            style={{ width: "100%" }}
          >
            <Option value="black">Black</Option>
            <Option value="white">White</Option>
            <Option value="gray">Gray</Option>
            <Option value="blue">Blue</Option>
            <Option value="navy">Navy</Option>
            <Option value="red">Red</Option>
            <Option value="green">Green</Option>
            <Option value="yellow">Yellow</Option>
            <Option value="purple">Purple</Option>
            <Option value="pink">Pink</Option>
            <Option value="brown">Brown</Option>
            <Option value="beige">Beige</Option>
            <Option value="orange">Orange</Option>
            <Option value="multicolor">Multicolor</Option>
            <Option value="print">Printed/Patterned</Option>
          </Select>
        </Form.Item>

        <Form.Item name="brands" label="Brands">
          <Select
            mode="tags"
            size="large"
            placeholder="Enter brand names (press Enter to add)"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item name="materialComposition" label="Material Composition">
          <Input
            size="large"
            placeholder="e.g., 100% Cotton, 80% Cotton 20% Polyester, Denim, Wool Blend"
          />
        </Form.Item>
      </div>

      <div className="form-section">
        <Title level={4}>Care & Condition Details</Title>
        <Form.Item name="careInstructions" label="Care Instructions">
          <TextArea
            rows={2}
            placeholder="Washing and care instructions, any special requirements"
          />
        </Form.Item>

        <Form.Item name="specialRequirements" label="Special Requirements">
          <TextArea
            rows={2}
            placeholder="Any special needs, occasions, or requirements for these items"
          />
        </Form.Item>

        <Form.Item name="pickupInstructions" label="Pickup/Delivery Instructions">
          <TextArea
            rows={3}
            placeholder="Special instructions for coordination, pickup, or delivery"
          />
        </Form.Item>
      </div>

      <div className="form-section">
        <Title level={4}>Additional Options</Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Form.Item name="isCleaned" valuePropName="checked">
              <Checkbox style={{ fontSize: '16px' }}>Items are cleaned and ready</Checkbox>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="deliveryAvailable" valuePropName="checked">
              <Checkbox style={{ fontSize: '16px' }}>Delivery Available</Checkbox>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="donationReceipt" valuePropName="checked">
              <Checkbox style={{ fontSize: '16px' }}>Donation Receipt Available</Checkbox>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item name="isUrgent" valuePropName="checked">
              <Checkbox style={{ fontSize: '16px' }}>Urgent Need/Donation</Checkbox>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
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
                placeholder="e.g., 15"
              />
            </Form.Item>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ClothesDetailsForm;