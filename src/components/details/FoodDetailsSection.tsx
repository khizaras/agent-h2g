import React from 'react';
import { Card, Row, Col, Tag, Typography, Space, Divider } from 'antd';
import {
  FireOutlined,
  CarOutlined,
  EnvironmentOutlined,
  SafetyCertificateOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  HeartOutlined,
  FileTextOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface FoodDetails {
  food_type: string;
  cuisine_type?: string;
  quantity?: number;
  unit?: string;
  serving_size?: number;
  dietary_restrictions?: string[];
  allergens?: string[];
  expiration_date?: string;
  preparation_date?: string;
  storage_requirements?: string;
  temperature_requirements?: string;
  pickup_instructions?: string;
  delivery_available: boolean;
  delivery_radius?: number;
  is_urgent: boolean;
  nutritional_info?: string;
  ingredients?: string;
  packaging_details?: string;
  halal: boolean;
  kosher: boolean;
  organic: boolean;
}

interface FoodDetailsSectionProps {
  details: FoodDetails;
}

const FoodDetailsSection: React.FC<FoodDetailsSectionProps> = ({ details }) => {
  const getTemperatureIcon = (temp: string) => {
    switch (temp) {
      case 'frozen': return '🧊';
      case 'refrigerated': return '❄️';
      case 'room-temp': return '🌡️';
      case 'warm': return '🔥';
      default: return '🌡️';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="food-details-section">
      <Title level={3} style={{ marginBottom: '24px' }}>Food Details</Title>
      
      {/* Basic Information */}
      <Card title="Basic Information" className="details-card" style={{ marginBottom: '24px' }}>
        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <div className="detail-item">
              <Text strong>Food Type:</Text>
              <div style={{ marginTop: '4px' }}>
                <Tag color={details.food_type === 'donation' ? 'green' : 'blue'} style={{ fontSize: '14px' }}>
                  {details.food_type === 'donation' ? '🍽️ DONATION' : '🙏 REQUEST'}
                </Tag>
              </div>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="detail-item">
              <Text strong>Cuisine Type:</Text>
              <div style={{ marginTop: '4px' }}>
                <Text style={{ fontSize: '16px' }}>{details.cuisine_type || 'General'}</Text>
              </div>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="detail-item">
              <Text strong>Quantity:</Text>
              <div style={{ marginTop: '4px' }}>
                <Text style={{ fontSize: '18px', fontWeight: 600 }}>
                  {details.quantity} {details.unit || 'servings'}
                </Text>
              </div>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="detail-item">
              <Text strong>Serving Size:</Text>
              <div style={{ marginTop: '4px' }}>
                <Text>{details.serving_size ? `${details.serving_size} people` : 'Not specified'}</Text>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Dietary Information */}
      <Card title="Dietary Information" className="details-card" style={{ marginBottom: '24px' }}>
        <Row gutter={[24, 16]}>
          <Col xs={24}>
            <div className="detail-item">
              <Text strong>Dietary Restrictions:</Text>
              <div style={{ marginTop: '8px' }}>
                <Space wrap>
                  {details.dietary_restrictions && details.dietary_restrictions.length > 0 ? (
                    details.dietary_restrictions.map((restriction: string) => (
                      <Tag key={restriction} color="orange">{restriction}</Tag>
                    ))
                  ) : (
                    <Text type="secondary">None specified</Text>
                  )}
                </Space>
              </div>
            </div>
          </Col>
          <Col xs={24}>
            <div className="detail-item">
              <Text strong>Allergens:</Text>
              <div style={{ marginTop: '8px' }}>
                <Space wrap>
                  {details.allergens && details.allergens.length > 0 ? (
                    details.allergens.map((allergen: string) => (
                      <Tag key={allergen} color="red">{allergen}</Tag>
                    ))
                  ) : (
                    <Text type="secondary">None specified</Text>
                  )}
                </Space>
              </div>
            </div>
          </Col>
          <Col xs={24}>
            <div className="detail-item">
              <Text strong>Certifications:</Text>
              <div style={{ marginTop: '8px' }}>
                <Space wrap>
                  {details.halal && (
                    <Tag color="green" icon={<CheckCircleOutlined />}>Halal</Tag>
                  )}
                  {details.kosher && (
                    <Tag color="blue" icon={<CheckCircleOutlined />}>Kosher</Tag>
                  )}
                  {details.organic && (
                    <Tag color="lime" icon={<HeartOutlined />}>Organic</Tag>
                  )}
                  {!details.halal && !details.kosher && !details.organic && (
                    <Text type="secondary">No certifications</Text>
                  )}
                </Space>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Storage and Timing */}
      <Card title="Storage & Timing" className="details-card" style={{ marginBottom: '24px' }}>
        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <div className="detail-item">
              <Text strong>Temperature Requirements:</Text>
              <div style={{ marginTop: '4px' }}>
                <Space>
                  <span>{getTemperatureIcon(details.temperature_requirements || 'room-temp')}</span>
                  <Text>{details.temperature_requirements?.replace('-', ' ').toUpperCase() || 'Room Temperature'}</Text>
                </Space>
              </div>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="detail-item">
              <Text strong>Storage Requirements:</Text>
              <div style={{ marginTop: '4px' }}>
                <Text>{details.storage_requirements || 'Standard storage'}</Text>
              </div>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="detail-item">
              <Text strong>Preparation Date:</Text>
              <div style={{ marginTop: '4px' }}>
                <Space>
                  <ClockCircleOutlined />
                  <Text>{formatDate(details.preparation_date)}</Text>
                </Space>
              </div>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="detail-item">
              <Text strong>Expiration Date:</Text>
              <div style={{ marginTop: '4px' }}>
                <Space>
                  <ClockCircleOutlined />
                  <Text>{formatDate(details.expiration_date)}</Text>
                </Space>
              </div>
            </div>
          </Col>
          <Col xs={24}>
            <div className="detail-item">
              <Text strong>Status:</Text>
              <div style={{ marginTop: '8px' }}>
                <Space wrap>
                  {details.is_urgent && (
                    <Tag color="red" icon={<FireOutlined />}>Urgent</Tag>
                  )}
                  {details.packaging_details && (
                    <Tag color="blue" icon={<FileTextOutlined />}>Packaged</Tag>
                  )}
                </Space>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Nutritional Information */}
      {(details.nutritional_info || details.ingredients) && (
        <Card title="Nutritional Information" className="details-card" style={{ marginBottom: '24px' }}>
          {details.ingredients && (
            <div className="detail-item" style={{ marginBottom: details.nutritional_info ? '16px' : '0' }}>
              <Text strong>Ingredients:</Text>
              <Paragraph style={{ marginTop: '8px', marginBottom: '0' }}>
                {details.ingredients}
              </Paragraph>
            </div>
          )}
          {details.nutritional_info && (
            <div className="detail-item">
              <Text strong>Nutritional Information:</Text>
              <Paragraph style={{ marginTop: '8px', marginBottom: '0' }}>
                {details.nutritional_info}
              </Paragraph>
            </div>
          )}
        </Card>
      )}

      {/* Pickup and Delivery */}
      <Card title="Pickup & Delivery" className="details-card">
        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <div className="detail-item">
              <Text strong>Delivery Available:</Text>
              <div style={{ marginTop: '4px' }}>
                {details.delivery_available ? (
                  <Space>
                    <CarOutlined style={{ color: '#52c41a' }} />
                    <Text style={{ color: '#52c41a' }}>Yes</Text>
                    {details.delivery_radius && (
                      <Text type="secondary">({details.delivery_radius}km radius)</Text>
                    )}
                  </Space>
                ) : (
                  <Space>
                    <EnvironmentOutlined style={{ color: '#ff4d4f' }} />
                    <Text style={{ color: '#ff4d4f' }}>Pickup Only</Text>
                  </Space>
                )}
              </div>
            </div>
          </Col>
        </Row>
        
        {details.pickup_instructions && (
          <>
            <Divider />
            <div className="detail-item">
              <Text strong>Pickup Instructions:</Text>
              <Paragraph style={{ marginTop: '8px', marginBottom: '0' }}>
                {details.pickup_instructions}
              </Paragraph>
            </div>
          </>
        )}
        
        {details.packaging_details && (
          <>
            <Divider />
            <div className="detail-item">
              <Text strong>Packaging Details:</Text>
              <Paragraph style={{ marginTop: '8px', marginBottom: '0' }}>
                {details.packaging_details}
              </Paragraph>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default FoodDetailsSection;