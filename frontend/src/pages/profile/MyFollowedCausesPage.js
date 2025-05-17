import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Typography,
  Empty,
  Breadcrumb,
  Skeleton,
  Button,
  Divider,
  Alert,
  Space,
} from "antd";
import {
  SearchOutlined,
  HeartOutlined,
  BellOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

import CauseCard from "../../components/causes/CauseCard";
import { getFollowedCauses } from "../../redux/slices/userSlice";

const { Title, Text, Paragraph } = Typography;

const MyFollowedCausesPage = () => {
  const dispatch = useDispatch();
  const { followedCauses, isLoading } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getFollowedCauses());
  }, [dispatch]);

  return (
    <div className="followed-causes-page-container">
      <div className="container">
        <Breadcrumb className="breadcrumb-navigation mt-3 mb-2">
          <Breadcrumb.Item>
            <Link to="/">Home</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/profile">Profile</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Followed Causes</Breadcrumb.Item>
        </Breadcrumb>

        <Card className="followed-causes-card shadow-sm">
          <div className="page-header mb-4">
            <div className="title-section">
              <Space align="center" className="header-icon-wrapper">
                <HeartOutlined className="header-icon" />
                <Title level={2} className="mb-1">
                  Causes I'm Following
                </Title>
              </Space>
              <Paragraph type="secondary" className="header-description">
                Track and support the food assistance causes that matter to you.
              </Paragraph>
            </div>
          </div>

          <Alert
            message="Stay Updated"
            description="Following a cause means you'll receive notifications when there are updates or when they need additional support."
            type="info"
            showIcon
            icon={<BellOutlined />}
            className="info-alert mb-4"
            closable
          />

          {isLoading ? (
            <div className="loading-grid">
              <Row gutter={[24, 24]}>
                {[1, 2, 3].map((item) => (
                  <Col xs={24} sm={12} lg={8} key={item}>
                    <Card className="skeleton-card">
                      <Skeleton active paragraph={{ rows: 4 }} />
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          ) : followedCauses && followedCauses.length > 0 ? (
            <div className="followed-causes-grid">
              <Row gutter={[24, 24]}>
                {followedCauses.map((cause) => (
                  <Col
                    xs={24}
                    sm={12}
                    lg={8}
                    key={cause.id}
                    className="cause-column"
                  >
                    <CauseCard cause={cause} />
                  </Col>
                ))}
              </Row>
            </div>
          ) : (
            <div className="empty-state-container text-center">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                className="custom-empty-image"
                description={
                  <div className="empty-description">
                    <Text strong className="mb-2">
                      You aren't following any causes yet
                    </Text>
                    <Paragraph type="secondary" className="mt-2 mb-3">
                      When you follow a cause, you'll receive updates and it
                      will appear here for quick access.
                    </Paragraph>
                    <Link to="/causes">
                      <Button
                        type="primary"
                        icon={<SearchOutlined />}
                        size="large"
                        className="browse-button"
                      >
                        Browse Causes
                      </Button>
                    </Link>
                  </div>
                }
              />
            </div>
          )}
        </Card>

        {followedCauses && followedCauses.length > 0 && (
          <Card className="tips-card shadow-sm mt-4">
            <div className="tips-header">
              <InfoCircleOutlined className="tips-icon" />
              <Text strong>Tips for Supporting Causes</Text>
            </div>
            <ul className="tips-list">
              <li>Share causes with your network to increase their reach</li>
              <li>
                Check for updates regularly to see if new needs have emerged
              </li>
              <li>Consider recurring contributions for ongoing causes</li>
            </ul>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MyFollowedCausesPage;
