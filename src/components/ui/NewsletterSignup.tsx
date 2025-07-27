"use client";

import React, { useState } from "react";
import { Input, Button, message, Space, Typography, Card } from "antd";
import {
  MailOutlined,
  CheckCircleOutlined,
  GiftOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";

const { Text, Paragraph } = Typography;

interface NewsletterSignupProps {
  variant?: "inline" | "card" | "minimal";
  theme?: "light" | "dark";
  showBenefits?: boolean;
  className?: string;
}

export const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  variant = "inline",
  theme = "light",
  showBenefits = true,
  className = "",
}) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      message.error("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      message.error("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      // Simulate API call - replace with actual implementation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // TODO: Implement actual newsletter subscription API
      console.log("Subscribing email:", email);

      setSubscribed(true);
      message.success("Successfully subscribed to our newsletter!");
      setEmail("");
    } catch (error) {
      message.error("Failed to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    { icon: <GiftOutlined />, text: "Weekly impact updates" },
    { icon: <CheckCircleOutlined />, text: "Exclusive cause previews" },
    { icon: <MailOutlined />, text: "Community success stories" },
  ];

  const isDark = theme === "dark";

  if (subscribed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={className}
      >
        <Card
          style={{
            background: isDark ? "rgba(255, 255, 255, 0.1)" : "#f0f9ff",
            border: "none",
            borderRadius: 12,
            textAlign: "center",
            backdropFilter: "blur(10px)",
          }}
        >
          <CheckCircleOutlined
            style={{
              fontSize: 48,
              color: "#52c41a",
              marginBottom: 16,
            }}
          />
          <Text
            style={{
              color: isDark ? "#ffffff" : "#1890ff",
              fontSize: 18,
              fontWeight: 600,
              display: "block",
              marginBottom: 8,
            }}
          >
            Welcome to our community!
          </Text>
          <Paragraph
            style={{
              color: isDark ? "rgba(255, 255, 255, 0.8)" : "#64748b",
              marginBottom: 0,
            }}
          >
            Check your email for a confirmation message.
          </Paragraph>
        </Card>
      </motion.div>
    );
  }

  if (variant === "card") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={className}
      >
        <Card
          style={{
            background: isDark
              ? "linear-gradient(135deg, rgba(24, 144, 255, 0.1) 0%, rgba(114, 46, 209, 0.1) 100%)"
              : "linear-gradient(135deg, #1890ff 0%, #722ed1 100%)",
            border: "none",
            borderRadius: 16,
            backdropFilter: "blur(10px)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <MailOutlined
              style={{
                fontSize: 40,
                color: "#ffffff",
                marginBottom: 16,
              }}
            />
            <Text
              style={{
                color: "#ffffff",
                fontSize: 24,
                fontWeight: 700,
                display: "block",
                marginBottom: 8,
              }}
            >
              Stay Connected
            </Text>
            <Paragraph
              style={{
                color: "rgba(255, 255, 255, 0.9)",
                fontSize: 16,
                marginBottom: 0,
              }}
            >
              Get the latest updates on community impact and new causes
            </Paragraph>
          </div>

          {showBenefits && (
            <div style={{ marginBottom: 24 }}>
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 12,
                    color: "rgba(255, 255, 255, 0.9)",
                  }}
                >
                  <span style={{ marginRight: 12, fontSize: 16 }}>
                    {benefit.icon}
                  </span>
                  <Text style={{ color: "rgba(255, 255, 255, 0.9)" }}>
                    {benefit.text}
                  </Text>
                </motion.div>
              ))}
            </div>
          )}

          <Space.Compact style={{ width: "100%" }}>
            <Input
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onPressEnter={handleSubmit}
              style={{
                height: 48,
                fontSize: 16,
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                border: "none",
              }}
            />
            <Button
              type="primary"
              onClick={handleSubmit}
              loading={loading}
              style={{
                height: 48,
                paddingLeft: 24,
                paddingRight: 24,
                backgroundColor: "#ffffff",
                color: "#1890ff",
                border: "none",
                fontWeight: 600,
              }}
            >
              Subscribe
            </Button>
          </Space.Compact>
        </Card>
      </motion.div>
    );
  }

  if (variant === "minimal") {
    return (
      <div className={className}>
        <Space.Compact style={{ width: "100%", maxWidth: 400 }}>
          <Input
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onPressEnter={handleSubmit}
            style={{
              height: 40,
              backgroundColor: isDark ? "rgba(255, 255, 255, 0.1)" : "#ffffff",
              border: isDark
                ? "1px solid rgba(255, 255, 255, 0.2)"
                : "1px solid #d9d9d9",
              color: isDark ? "#ffffff" : "#000000",
            }}
          />
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={loading}
            style={{ height: 40 }}
          >
            Subscribe
          </Button>
        </Space.Compact>
      </div>
    );
  }

  // Default inline variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <div style={{ marginBottom: 16 }}>
        <Text
          style={{
            color: isDark ? "#ffffff" : "#1e293b",
            fontSize: 18,
            fontWeight: 600,
            display: "block",
            marginBottom: 8,
          }}
        >
          Stay Updated
        </Text>
        <Paragraph
          style={{
            color: isDark ? "rgba(255, 255, 255, 0.8)" : "#64748b",
            marginBottom: 0,
            fontSize: 14,
          }}
        >
          Subscribe to get weekly updates on community impact
        </Paragraph>
      </div>

      <Space.Compact style={{ width: "100%" }}>
        <Input
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onPressEnter={handleSubmit}
          style={{
            height: 44,
            backgroundColor: isDark ? "rgba(255, 255, 255, 0.1)" : "#ffffff",
            border: isDark
              ? "1px solid rgba(255, 255, 255, 0.2)"
              : "1px solid #d9d9d9",
            color: isDark ? "#ffffff" : "#000000",
          }}
        />
        <Button
          type="primary"
          onClick={handleSubmit}
          loading={loading}
          style={{
            height: 44,
            paddingLeft: 20,
            paddingRight: 20,
          }}
        >
          Subscribe
        </Button>
      </Space.Compact>

      {showBenefits && (
        <div style={{ marginTop: 12 }}>
          {benefits.slice(0, 2).map((benefit, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 6,
                color: isDark ? "rgba(255, 255, 255, 0.7)" : "#64748b",
                fontSize: 12,
              }}
            >
              <span style={{ marginRight: 8, fontSize: 12 }}>
                {benefit.icon}
              </span>
              <Text
                style={{
                  color: isDark ? "rgba(255, 255, 255, 0.7)" : "#64748b",
                  fontSize: 12,
                }}
              >
                {benefit.text}
              </Text>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default NewsletterSignup;
