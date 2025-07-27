"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  Timeline,
  Typography,
  Space,
  Badge,
  List,
  Avatar,
  Tooltip,
  Button,
  Tag,
} from "antd";
import {
  TrophyOutlined,
  HeartOutlined,
  UserOutlined,
  DollarOutlined,
  GlobalOutlined,
  CalendarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  FireOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";

const { Title, Text, Paragraph } = Typography;

interface ImpactMetric {
  id: string;
  title: string;
  value: number;
  target?: number;
  trend: {
    direction: "up" | "down" | "stable";
    percentage: number;
    period: string;
  };
  icon: React.ReactNode;
  color: string;
  description: string;
}

interface RecentActivity {
  id: string;
  type: "donation" | "volunteer" | "cause_completed" | "milestone";
  user: string;
  action: string;
  target: string;
  amount?: number;
  timestamp: Date;
  avatar: string;
}

interface ImpactDashboardProps {
  timeframe?: "24h" | "7d" | "30d" | "1y";
  showTrends?: boolean;
  showActivities?: boolean;
  maxActivities?: number;
  className?: string;
}

export const ImpactDashboard: React.FC<ImpactDashboardProps> = ({
  timeframe = "30d",
  showTrends = true,
  showActivities = true,
  maxActivities = 10,
  className = "",
}) => {
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  // Simulated real-time data
  const [metrics, setMetrics] = useState<ImpactMetric[]>([
    {
      id: "lives_impacted",
      title: "Lives Impacted",
      value: 25847,
      target: 30000,
      trend: { direction: "up", percentage: 12.5, period: "this month" },
      icon: <HeartOutlined />,
      color: "#ff4d4f",
      description: "Total number of people who have received assistance",
    },
    {
      id: "active_volunteers",
      title: "Active Volunteers",
      value: 3456,
      target: 4000,
      trend: { direction: "up", percentage: 8.3, period: "this month" },
      icon: <UserOutlined />,
      color: "#1890ff",
      description: "Community members actively participating in causes",
    },
    {
      id: "funds_raised",
      title: "Funds Raised",
      value: 892340,
      target: 1000000,
      trend: { direction: "up", percentage: 15.7, period: "this month" },
      icon: <DollarOutlined />,
      color: "#52c41a",
      description: "Total monetary donations collected",
    },
    {
      id: "causes_completed",
      title: "Causes Completed",
      value: 1523,
      trend: { direction: "up", percentage: 22.1, period: "this month" },
      icon: <TrophyOutlined />,
      color: "#fa8c16",
      description: "Successfully fulfilled community requests",
    },
    {
      id: "global_reach",
      title: "Global Reach",
      value: 157,
      trend: { direction: "up", percentage: 5.2, period: "this month" },
      icon: <GlobalOutlined />,
      color: "#722ed1",
      description: "Countries and regions with active communities",
    },
    {
      id: "response_time",
      title: "Avg Response Time",
      value: 2.4,
      trend: { direction: "down", percentage: 18.5, period: "this month" },
      icon: <ThunderboltOutlined />,
      color: "#13c2c2",
      description: "Average hours to first response on new causes",
    },
  ]);

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([
    {
      id: "1",
      type: "donation",
      user: "Sarah M.",
      action: "donated $150 to",
      target: "Winter Clothing Drive",
      amount: 150,
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=50&h=50&fit=crop&crop=face",
    },
    {
      id: "2",
      type: "volunteer",
      user: "Marcus L.",
      action: "volunteered for",
      target: "Community Garden Project",
      timestamp: new Date(Date.now() - 12 * 60 * 1000),
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
    },
    {
      id: "3",
      type: "cause_completed",
      user: "Emily R.",
      action: "completed cause",
      target: "School Supply Collection",
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
    },
    {
      id: "4",
      type: "milestone",
      user: "Platform",
      action: "reached milestone of",
      target: "25,000 Lives Impacted",
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      avatar: "/images/logo-avatar.png",
    },
    {
      id: "5",
      type: "donation",
      user: "James P.",
      action: "donated $75 to",
      target: "Food Bank Initiative",
      amount: 75,
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
    },
  ]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1500);

    // Simulate real-time updates
    const updateInterval = setInterval(() => {
      setMetrics((prev) =>
        prev.map((metric) => ({
          ...metric,
          value: metric.value + Math.floor(Math.random() * 3),
        })),
      );
    }, 30000);

    return () => {
      clearTimeout(timer);
      clearInterval(updateInterval);
    };
  }, []);

  const getActivityIcon = (type: RecentActivity["type"]) => {
    switch (type) {
      case "donation":
        return <DollarOutlined style={{ color: "#52c41a" }} />;
      case "volunteer":
        return <UserOutlined style={{ color: "#1890ff" }} />;
      case "cause_completed":
        return <CheckCircleOutlined style={{ color: "#fa8c16" }} />;
      case "milestone":
        return <TrophyOutlined style={{ color: "#722ed1" }} />;
      default:
        return <ClockCircleOutlined />;
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const minutes = Math.floor((Date.now() - timestamp.getTime()) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const formatValue = (value: number, metric: ImpactMetric) => {
    if (metric.id === "funds_raised") {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    if (metric.id === "response_time") {
      return `${value.toFixed(1)}h`;
    }
    return value.toLocaleString();
  };

  return (
    <div className={`impact-dashboard ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ marginBottom: 32 }}
      >
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ marginBottom: 8 }}>
              Impact Dashboard
            </Title>
            <Text type="secondary">
              Real-time platform statistics and community activity
            </Text>
          </Col>
          <Col>
            <Space>
              <Badge status="processing" text="Live" />
              <Tag color="blue">{timeframe}</Tag>
            </Space>
          </Col>
        </Row>
      </motion.div>

      {/* Metrics Grid */}
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        {metrics.map((metric, index) => (
          <Col xs={24} sm={12} lg={8} xl={4} key={metric.id}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <Card
                hoverable
                loading={loading}
                onClick={() =>
                  setSelectedMetric(
                    selectedMetric === metric.id ? null : metric.id,
                  )
                }
                style={{
                  borderRadius: 16,
                  border:
                    selectedMetric === metric.id
                      ? `2px solid ${metric.color}`
                      : "1px solid #f0f0f0",
                  boxShadow:
                    selectedMetric === metric.id
                      ? `0 8px 25px ${metric.color}25`
                      : "0 2px 8px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease",
                }}
                bodyStyle={{ padding: "20px 16px" }}
              >
                {/* Icon and Trend */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      fontSize: 28,
                      color: metric.color,
                      background: `${metric.color}15`,
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {metric.icon}
                  </div>

                  {showTrends && (
                    <Tooltip
                      title={`${metric.trend.direction === "up" ? "Increase" : metric.trend.direction === "down" ? "Decrease" : "No change"} of ${metric.trend.percentage}% ${metric.trend.period}`}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          color:
                            metric.trend.direction === "up"
                              ? "#52c41a"
                              : metric.trend.direction === "down"
                                ? "#ff4d4f"
                                : "#8c8c8c",
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {metric.trend.direction === "up" ? (
                          <ArrowUpOutlined />
                        ) : metric.trend.direction === "down" ? (
                          <ArrowDownOutlined />
                        ) : null}
                        <span style={{ marginLeft: 4 }}>
                          {metric.trend.percentage}%
                        </span>
                      </div>
                    </Tooltip>
                  )}
                </div>

                {/* Value */}
                <Statistic
                  value={formatValue(metric.value, metric)}
                  valueStyle={{
                    color: metric.color,
                    fontSize: "clamp(1.5rem, 3vw, 2rem)",
                    fontWeight: 700,
                    lineHeight: 1.2,
                  }}
                />

                {/* Title */}
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#434343",
                    display: "block",
                    marginTop: 8,
                  }}
                >
                  {metric.title}
                </Text>

                {/* Progress Bar for targets */}
                {metric.target && (
                  <div style={{ marginTop: 12 }}>
                    <Progress
                      percent={Math.round((metric.value / metric.target) * 100)}
                      size="small"
                      strokeColor={metric.color}
                      showInfo={false}
                      trailColor={`${metric.color}20`}
                    />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {formatValue(metric.target - metric.value, metric)} to
                      goal
                    </Text>
                  </div>
                )}

                {/* Expanded Description */}
                {selectedMetric === metric.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      marginTop: 16,
                      paddingTop: 16,
                      borderTop: "1px solid #f0f0f0",
                    }}
                  >
                    <Paragraph
                      style={{
                        fontSize: 13,
                        color: "#666",
                        marginBottom: 0,
                        lineHeight: 1.5,
                      }}
                    >
                      {metric.description}
                    </Paragraph>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* Recent Activities */}
      {showActivities && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card
            title={
              <Space>
                <FireOutlined style={{ color: "#fa8c16" }} />
                <span>Live Activity Feed</span>
                <Badge
                  count={recentActivities.length}
                  style={{ backgroundColor: "#52c41a" }}
                />
              </Space>
            }
            style={{ borderRadius: 16 }}
            bodyStyle={{ padding: "0 24px 24px" }}
          >
            <List
              itemLayout="horizontal"
              dataSource={recentActivities.slice(0, maxActivities)}
              renderItem={(activity, index) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  <List.Item style={{ border: "none", padding: "12px 0" }}>
                    <List.Item.Meta
                      avatar={
                        <Badge dot status="processing">
                          <Avatar
                            src={activity.avatar}
                            icon={<UserOutlined />}
                          />
                        </Badge>
                      }
                      title={
                        <Space>
                          {getActivityIcon(activity.type)}
                          <Text strong>{activity.user}</Text>
                          <Text>{activity.action}</Text>
                          <Text style={{ color: "#1890ff" }}>
                            {activity.target}
                          </Text>
                          {activity.amount && (
                            <Tag color="green">${activity.amount}</Tag>
                          )}
                        </Space>
                      }
                      description={
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {formatTimeAgo(activity.timestamp)}
                        </Text>
                      }
                    />
                  </List.Item>
                </motion.div>
              )}
            />

            {recentActivities.length > maxActivities && (
              <div style={{ textAlign: "center", marginTop: 16 }}>
                <Button type="link">
                  View All Activities ({recentActivities.length - maxActivities}{" "}
                  more)
                </Button>
              </div>
            )}
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default ImpactDashboard;
