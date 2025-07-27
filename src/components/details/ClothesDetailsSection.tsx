import React from 'react';
import { Card, Row, Col, Tag, Typography, Space, Divider } from 'antd';
import {
  FireOutlined,
  CarOutlined,
  EnvironmentOutlined,
  SafetyCertificateOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface ClothesDetails {
  clothes_type: string;
  category: string;
  age_group: string;
  size_range: string[];
  condition: string;
  season: string;
  quantity: number;
  colors?: string[];
  brands?: string[];
  material_composition?: string;
  care_instructions?: string;
  special_requirements?: string;
  pickup_instructions?: string;
  delivery_available: boolean;
  delivery_radius?: number;
  is_urgent: boolean;
  is_cleaned: boolean;
  donation_receipt: boolean;
}

interface ClothesDetailsSectionProps {
  details: ClothesDetails;
}

const ClothesDetailsSection: React.FC<ClothesDetailsSectionProps> = ({ details }) => {
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new': return 'green';
      case 'excellent': return 'blue';
      case 'good': return 'cyan';
      case 'fair': return 'orange';
      case 'worn': return 'default';
      case 'vintage': return 'purple';
      default: return 'default';
    }
  };

  const getSeasonIcon = (season: string) => {
    switch (season) {
      case 'spring': return '🌸';
      case 'summer': return '☀️';
      case 'fall': return '🍂';
      case 'winter': return '❄️';
      default: return '🌍';
    }
  };

  const getAgeGroupIcon = (ageGroup: string) => {
    switch (ageGroup) {
      case 'newborn':
      case 'infant': return '👶';
      case 'toddler': return '🧒';
      case 'child': return '👧';
      case 'teen': return '👦';
      case 'adult': return '👤';
      case 'senior': return '🧓';
      default: return '👤';
    }
  };

  return (
    <div className="clothes-details-section">
      <Title level={3} style={{ marginBottom: '24px' }}>Clothing Details</Title>
      
      {/* Basic Information */}
      <Card title="Basic Information" className="details-card" style={{ marginBottom: '24px' }}>
        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <div className="detail-item">
              <Text strong>Type:</Text>
              <div style={{ marginTop: '4px' }}>
                <Tag color={details.clothes_type === 'donation' ? 'green' : 'blue'} style={{ fontSize: '14px' }}>
                  {details.clothes_type === 'donation' ? '📦 DONATION' : '🙏 REQUEST'}
                </Tag>
              </div>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="detail-item">
              <Text strong>Category:</Text>
              <div style={{ marginTop: '4px' }}>
                <Text style={{ fontSize: '16px' }}>{details.category?.replace('-', ' ').toUpperCase()}</Text>
              </div>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="detail-item">
              <Text strong>Age Group:</Text>
              <div style={{ marginTop: '4px' }}>
                <Space>
                  <span>{getAgeGroupIcon(details.age_group)}</span>
                  <Text>{details.age_group?.replace('-', ' ').toUpperCase()}</Text>
                </Space>
              </div>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="detail-item">
              <Text strong>Quantity:</Text>
              <div style={{ marginTop: '4px' }}>
                <Text style={{ fontSize: '18px', fontWeight: 600 }}>
                  {details.quantity} items
                </Text>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Condition and Quality */}
      <Card title="Condition & Quality" className="details-card" style={{ marginBottom: '24px' }}>
        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <div className="detail-item">
              <Text strong>Condition:</Text>
              <div style={{ marginTop: '4px' }}>
                <Tag color={getConditionColor(details.condition)} style={{ fontSize: '14px' }}>
                  {details.condition?.toUpperCase()}
                </Tag>
              </div>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="detail-item">
              <Text strong>Season:</Text>
              <div style={{ marginTop: '4px' }}>
                <Space>
                  <span>{getSeasonIcon(details.season)}</span>
                  <Text>{details.season?.replace('-', ' ').toUpperCase()}</Text>
                </Space>
              </div>
            </div>
          </Col>
          <Col xs={24}>
            <div className="detail-item">
              <Text strong>Sizes Available:</Text>
              <div style={{ marginTop: '8px' }}>
                <Space wrap>
                  {details.size_range?.map((size: string) => (
                    <Tag key={size} color="blue">{size.toUpperCase()}</Tag>
                  ))}
                </Space>
              </div>
            </div>
          </Col>
          <Col xs={24}>
            <div className="detail-item">
              <Text strong>Status:</Text>
              <div style={{ marginTop: '8px' }}>
                <Space wrap>
                  {details.is_cleaned && (
                    <Tag color="green" icon={<CheckCircleOutlined />}>Cleaned & Ready</Tag>
                  )}
                  {details.is_urgent && (
                    <Tag color="red" icon={<FireOutlined />}>Urgent</Tag>
                  )}
                  {details.donation_receipt && (
                    <Tag color="purple" icon={<FileTextOutlined />}>Receipt Available</Tag>
                  )}
                </Space>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Appearance Details */}
      {(details.colors?.length || details.brands?.length || details.material_composition) && (
        <Card title="Appearance & Materials" className="details-card" style={{ marginBottom: '24px' }}>
          <Row gutter={[24, 16]}>
            {details.colors?.length && details.colors.length > 0 && (
              <Col xs={24}>
                <div className="detail-item">
                  <Text strong>Colors:</Text>
                  <div style={{ marginTop: '8px' }}>
                    <Space wrap>
                      {details.colors.map((color: string) => (
                        <Tag key={color} color="default">{color}</Tag>
                      ))}
                    </Space>
                  </div>
                </div>
              </Col>
            )}
            {details.brands?.length && details.brands.length > 0 && (
              <Col xs={24}>
                <div className="detail-item">
                  <Text strong>Brands:</Text>
                  <div style={{ marginTop: '8px' }}>
                    <Space wrap>
                      {details.brands.map((brand: string) => (
                        <Tag key={brand} color="geekblue">{brand}</Tag>
                      ))}
                    </Space>
                  </div>
                </div>
              </Col>
            )}
            {details.material_composition && (
              <Col xs={24}>
                <div className="detail-item">
                  <Text strong>Material:</Text>
                  <div style={{ marginTop: '4px' }}>
                    <Text>{details.material_composition}</Text>
                  </div>
                </div>
              </Col>
            )}
          </Row>
        </Card>
      )}

      {/* Care Instructions */}
      {(details.care_instructions || details.special_requirements) && (
        <Card title="Care & Requirements" className="details-card" style={{ marginBottom: '24px' }}>
          {details.care_instructions && (
            <div className="detail-item" style={{ marginBottom: details.special_requirements ? '16px' : '0' }}>
              <Text strong>Care Instructions:</Text>
              <Paragraph style={{ marginTop: '8px', marginBottom: '0' }}>
                {details.care_instructions}
              </Paragraph>
            </div>
          )}
          {details.special_requirements && (
            <div className="detail-item">
              <Text strong>Special Requirements:</Text>
              <Paragraph style={{ marginTop: '8px', marginBottom: '0' }}>
                {details.special_requirements}
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
      </Card>
    </div>
  );
};

export default ClothesDetailsSection;