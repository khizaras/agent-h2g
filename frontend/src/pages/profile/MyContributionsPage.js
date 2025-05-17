import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Card,
  Typography,
  Table,
  Tag,
  Breadcrumb,
  Empty,
  Skeleton,
  Button,
  Space,
  Tooltip,
  Alert,
} from "antd";
import {
  DollarOutlined,
  GiftOutlined,
  CalendarOutlined,
  EyeOutlined,
  HeartOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import moment from "moment";

import { getUserContributions } from "../../redux/slices/userSlice";

const { Title, Text, Paragraph } = Typography;

const MyContributionsPage = () => {
  const dispatch = useDispatch();
  const { contributions, isLoading } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getUserContributions());
  }, [dispatch]);

  // Table columns configuration
  const columns = [
    {
      title: "Cause",
      dataIndex: "cause_title",
      key: "cause_title",
      render: (text, record) => (
        <Link to={`/causes/${record.cause_id}`} className="cause-link">
          {text}
        </Link>
      ),
      ellipsis: true,
    },
    {
      title: "Type",
      key: "type",
      width: 140,
      render: (_, record) => (
        <Space size="small">
          {Number(record.amount) > 0 && (
            <Tag
              color="green"
              icon={<DollarOutlined />}
              className="contribution-tag"
            >
              Financial
            </Tag>
          )}
          {Number(record.food_quantity) > 0 && (
            <Tag
              color="orange"
              icon={<GiftOutlined />}
              className="contribution-tag"
            >
              Food Items
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: 120,
      render: (amount) =>
        amount ? (
          <Text className="amount-value">${Number(amount).toFixed(2)}</Text>
        ) : (
          "-"
        ),
    },
    {
      title: "Food Items",
      dataIndex: "food_quantity",
      key: "food_quantity",
      width: 120,
      render: (quantity) =>
        quantity ? (
          <Text className="quantity-value">
            {quantity} {quantity === 1 ? "item" : "items"}
          </Text>
        ) : (
          "-"
        ),
    },
    {
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",
      width: 140,
      render: (date) => (
        <span className="date-value">
          <CalendarOutlined className="date-icon" />{" "}
          {moment(date).format("MMM DD, YYYY")}
        </span>
      ),
      sorter: (a, b) => new Date(b.created_at) - new Date(a.created_at),
      defaultSortOrder: "descend",
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Tooltip title="View this cause">
          <Button
            type="primary"
            size="middle"
            icon={<EyeOutlined />}
            className="action-button"
            onClick={() => {
              window.location.href = `/causes/${record.cause_id}`;
            }}
          >
            View
          </Button>
        </Tooltip>
      ),
    },
  ];

  return (
    <div className="my-contributions-page-container">
      <div className="container">
        <Breadcrumb className="breadcrumb-navigation mt-3 mb-2">
          <Breadcrumb.Item>
            <Link to="/">Home</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/profile">Profile</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>My Contributions</Breadcrumb.Item>
        </Breadcrumb>

        <Card className="contributions-card shadow-sm">
          <div className="page-header mb-4">
            <div className="title-section">
              <Space align="center" className="header-icon-wrapper">
                <HistoryOutlined className="header-icon" />
                <Title level={2} className="mb-1">
                  My Contributions
                </Title>
              </Space>
              <Paragraph type="secondary" className="header-description">
                Track all your contributions to various food assistance causes.
              </Paragraph>
            </div>
          </div>

          {isLoading ? (
            <div className="skeleton-container">
              <Skeleton active paragraph={{ rows: 6 }} />
            </div>
          ) : contributions && contributions.length > 0 ? (
            <div className="table-container">
              <Table
                columns={columns}
                dataSource={contributions.map((item) => ({
                  ...item,
                  key: item.id,
                }))}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: false,
                  showTotal: (total) => `Total ${total} contributions`,
                }}
                className="contributions-table"
                scroll={{ x: 800 }}
                bordered={false}
                size="middle"
              />
            </div>
          ) : (
            <div className="empty-state-container">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div className="empty-description">
                    <Text strong className="mb-2">
                      You haven't made any contributions yet
                    </Text>
                    <Paragraph type="secondary" className="mt-2 mb-3">
                      When you contribute to causes, your contribution history
                      will appear here.
                    </Paragraph>
                    <Link to="/causes">
                      <Button
                        type="primary"
                        icon={<HeartOutlined />}
                        size="large"
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

        {contributions && contributions.length > 0 && (
          <Alert
            message="Impact Tracking"
            description="Your contributions are making a difference in your community. Thank you for your generosity!"
            type="success"
            showIcon
            className="impact-alert mt-3"
          />
        )}
      </div>
    </div>
  );
};

export default MyContributionsPage;
