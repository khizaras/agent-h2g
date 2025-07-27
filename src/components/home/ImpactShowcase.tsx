"use client";

import React from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Progress,
  Tag,
  Space,
} from "antd";
import {
  TrophyOutlined,
  HeartOutlined,
  TeamOutlined,
  GlobalOutlined,
  RocketOutlined,
  FireOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";

const { Title, Paragraph } = Typography;

interface ImpactMetric {
  label: string;
  value: number;
  unit?: string;
  prefix?: string;
  suffix?: string;
  icon: React.ReactNode;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
    period: string;
  };
}

interface ImpactShowcaseProps {
  metrics?: ImpactMetric[];
  title?: string;
  subtitle?: string;
  className?: string;
}

const defaultMetrics: ImpactMetric[] = [
  {
    label: "Lives Impacted",
    value: 25847,
    icon: <HeartOutlined />,
    color: "#1890ff",
    trend: { value: 15, isPositive: true, period: "this month" },
  },
  {
    label: "Causes Supported",
    value: 1523,
    icon: <RocketOutlined />,
    color: "#52c41a",
    trend: { value: 8, isPositive: true, period: "this week" },
  },
  {
    label: "Active Volunteers",
    value: 3456,
    icon: <TeamOutlined />,
    color: "#722ed1",
    trend: { value: 23, isPositive: true, period: "this month" },
  },
  {
    label: "Funds Raised",
    value: 892340,
    prefix: "$",
    icon: <TrophyOutlined />,
    color: "#fa8c16",
    trend: { value: 12, isPositive: true, period: "this quarter" },
  },
  {
    label: "Communities Served",
    value: 157,
    icon: <GlobalOutlined />,
    color: "#eb2f96",
    trend: { value: 5, isPositive: true, period: "this year" },
  },
  {
    label: "Success Stories",
    value: 428,
    icon: <FireOutlined />,
    color: "#13c2c2",
    trend: { value: 18, isPositive: true, period: "this month" },
  },
];

export const ImpactShowcase: React.FC<ImpactShowcaseProps> = ({
  metrics = defaultMetrics,
  title = "Our Collective Impact",
  subtitle = "Real-time statistics showing the positive change we're creating together",
  className = "",
}) => {
  return (
    <div className={`py-16 ${className}`}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: "center", marginBottom: 60 }}
        >
          <Title
            level={2}
            style={{
              marginBottom: 16,
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              background: "linear-gradient(135deg, #1890ff 0%, #722ed1 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {title}
          </Title>
          <Paragraph
            style={{
              fontSize: 18,
              color: "#64748b",
              maxWidth: 600,
              margin: "0 auto",
            }}
          >
            {subtitle}
          </Paragraph>
        </motion.div>

        {/* Metrics Grid */}
        <Row gutter={[24, 24]}>
          {metrics.map((metric, index) => (
            <Col xs={12} sm={8} lg={4} key={index}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Card
                  style={{
                    textAlign: "center",
                    borderRadius: 16,
                    border: "none",
                    background:
                      "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.08)",
                    transition: "all 0.3s ease",
                    overflow: "hidden",
                    position: "relative",
                  }}
                  bodyStyle={{ padding: "24px 16px" }}
                >
                  {/* Background Pattern */}
                  <div
                    style={{
                      position: "absolute",
                      top: -20,
                      right: -20,
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      background: `${metric.color}15`,
                      zIndex: 0,
                    }}
                  />

                  {/* Icon */}
                  <div
                    style={{
                      fontSize: 32,
                      color: metric.color,
                      marginBottom: 16,
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    {metric.icon}
                  </div>

                  {/* Value */}
                  <Statistic
                    value={metric.value}
                    prefix={metric.prefix}
                    suffix={metric.suffix}
                    valueStyle={{
                      fontSize: "clamp(1.2rem, 2.5vw, 2rem)",
                      fontWeight: "bold",
                      color: metric.color,
                      lineHeight: 1.2,
                    }}
                  />

                  {/* Label */}
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#334155",
                      marginTop: 8,
                      marginBottom: 12,
                    }}
                  >
                    {metric.label}
                  </div>

                  {/* Trend */}
                  {metric.trend && (
                    <Tag
                      color={metric.trend.isPositive ? "green" : "red"}
                      style={{
                        borderRadius: 12,
                        fontSize: 11,
                        padding: "2px 8px",
                      }}
                    >
                      {metric.trend.isPositive ? "+" : "-"}
                      {metric.trend.value}% {metric.trend.period}
                    </Tag>
                  )}
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* Additional Visual Elements */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            marginTop: 60,
            textAlign: "center",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: 24,
            padding: "40px 24px",
            color: "#ffffff",
          }}
        >
          <Title level={3} style={{ color: "#ffffff", marginBottom: 16 }}>
            Join the Movement
          </Title>
          <Paragraph
            style={{
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: 16,
              marginBottom: 24,
              maxWidth: 500,
              margin: "0 auto 24px",
            }}
          >
            Together, we're building stronger communities one cause at a time.
            Your contribution, no matter the size, creates lasting impact.
          </Paragraph>

          {/* Progress Indicator */}
          <div style={{ maxWidth: 400, margin: "0 auto" }}>
            <Progress
              percent={73}
              strokeColor={{
                "0%": "#ffffff",
                "100%": "rgba(255, 255, 255, 0.8)",
              }}
              trailColor="rgba(255, 255, 255, 0.2)"
              strokeWidth={8}
              style={{ marginBottom: 12 }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 14,
                color: "rgba(255, 255, 255, 0.8)",
              }}
            >
              <span>Current Impact</span>
              <span>73% of annual goal</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ImpactShowcase;
