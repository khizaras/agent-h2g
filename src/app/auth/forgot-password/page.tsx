"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Space,
  message,
  Result,
} from "antd";
import {
  MailOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import Link from "next/link";
import { animations } from "@/config/theme";

const { Title, Text } = Typography;

interface ForgotPasswordFormData {
  email: string;
}

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();
  const [form] = Form.useForm();

  const onFinish = async (values: ForgotPasswordFormData) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: values.email }),
      });

      const data = await response.json();

      if (data.success) {
        setUserEmail(values.email);
        setEmailSent(true);
        message.success("Password reset email sent!");
      } else {
        message.error(data.message || "Failed to send reset email");
      }
    } catch (error) {
      message.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#f3f2f1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: "'Segoe UI', system-ui, sans-serif"
      }}>
        <motion.div
          {...animations.fadeIn}
          style={{
            width: '100%',
            maxWidth: '400px',
          }}
        >
          <Card style={{
            border: '1px solid #edebe9',
            borderRadius: 8,
            boxShadow: '0 1.6px 3.6px 0 rgba(0,0,0,.132), 0 0.3px 0.9px 0 rgba(0,0,0,.108)',
            padding: '8px',
          }}>
            <Result
              icon={
                <div style={{
                  width: 64,
                  height: 64,
                  backgroundColor: '#0078d4',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  color: 'white',
                  fontSize: 24,
                }}>
                  ✓
                </div>
              }
              title={
                <Title level={3} style={{
                  color: '#323130',
                  fontFamily: "'Segoe UI', system-ui, sans-serif",
                  fontWeight: 600
                }}>
                  Check your email
                </Title>
              }
              subTitle={
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                  <Text style={{
                    color: '#605e5c',
                    fontSize: 14,
                    fontFamily: "'Segoe UI', system-ui, sans-serif"
                  }}>
                    We've sent a password reset link to:
                  </Text>
                  <br />
                  <Text strong style={{
                    color: '#323130',
                    fontSize: 16,
                    fontFamily: "'Segoe UI', system-ui, sans-serif"
                  }}>
                    {userEmail}
                  </Text>
                </div>
              }
              extra={
                <Space style={{ width: '100%', justifyContent: 'center' }} direction="vertical" size={12}>
                  <Text style={{
                    color: '#605e5c',
                    fontSize: 14,
                    textAlign: 'center',
                    display: 'block',
                    fontFamily: "'Segoe UI', system-ui, sans-serif"
                  }}>
                    Click the link in the email to reset your password. 
                    If you don't see it, check your spam folder.
                  </Text>
                  
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => {
                      setEmailSent(false);
                      form.resetFields();
                    }}
                    style={{
                      backgroundColor: '#0078d4',
                      borderColor: '#0078d4',
                      borderRadius: 4,
                      height: 40,
                      fontWeight: 600,
                      fontSize: 14,
                      fontFamily: "'Segoe UI', system-ui, sans-serif"
                    }}
                  >
                    Send another email
                  </Button>
                  
                  <Link 
                    href="/auth/signin"
                    style={{ 
                      color: '#0078d4', 
                      textDecoration: 'none',
                      fontWeight: 600,
                      fontSize: 14,
                      fontFamily: "'Segoe UI', system-ui, sans-serif"
                    }}
                  >
                    ← Back to sign in
                  </Link>
                </Space>
              }
            />
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f3f2f1',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: "'Segoe UI', system-ui, sans-serif"
    }}>
      <motion.div
        {...animations.fadeIn}
        style={{
          width: '100%',
          maxWidth: '400px',
        }}
      >
        {/* Microsoft-style header */}
        <div style={{
          textAlign: 'center',
          marginBottom: 32,
        }}>
          <motion.div
            {...animations.scaleIn}
            style={{
              width: 48,
              height: 48,
              backgroundColor: '#0078d4',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              color: 'white',
              fontSize: 20,
              fontWeight: 600,
              fontFamily: "'Segoe UI', system-ui, sans-serif"
            }}
          >
            H2G
          </motion.div>
          <Title level={2} style={{
            color: '#323130',
            marginBottom: 8,
            fontSize: 24,
            fontWeight: 600,
            fontFamily: "'Segoe UI', system-ui, sans-serif"
          }}>
            Reset your password
          </Title>
          <Text style={{
            color: '#605e5c',
            fontSize: 14,
            fontFamily: "'Segoe UI', system-ui, sans-serif"
          }}>
            Enter your email address and we'll send you a link to reset your password
          </Text>
        </div>

        <Card style={{
          border: '1px solid #edebe9',
          borderRadius: 8,
          boxShadow: '0 1.6px 3.6px 0 rgba(0,0,0,.132), 0 0.3px 0.9px 0 rgba(0,0,0,.108)',
          padding: '8px',
        }}>
          <Form
            form={form}
            name="forgot-password"
            layout="vertical"
            size="middle"
            onFinish={onFinish}
            autoComplete="off"
            style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
          >
            <Form.Item
              name="email"
              label="Email address"
              rules={[
                { required: true, message: "Email is required" },
                { type: "email", message: "Please enter a valid email" },
              ]}
              style={{ marginBottom: 24 }}
            >
              <Input
                prefix={<MailOutlined style={{ color: '#605e5c' }} />}
                placeholder="Enter your email address"
                size="large"
                style={{
                  borderRadius: 4,
                  borderColor: '#8a8886',
                  fontFamily: "'Segoe UI', system-ui, sans-serif"
                }}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 16 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                block
                style={{
                  backgroundColor: '#0078d4',
                  borderColor: '#0078d4',
                  borderRadius: 4,
                  height: 40,
                  fontWeight: 600,
                  fontSize: 14,
                  fontFamily: "'Segoe UI', system-ui, sans-serif"
                }}
              >
                Send reset link
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Link 
              href="/auth/signin"
              style={{ 
                color: '#0078d4', 
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: 14,
                fontFamily: "'Segoe UI', system-ui, sans-serif",
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6
              }}
            >
              <ArrowLeftOutlined style={{ fontSize: 12 }} />
              Back to sign in
            </Link>
          </div>
        </Card>

        {/* Microsoft-style security note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{
            marginTop: 24,
            textAlign: 'center'
          }}
        >
          <Text style={{
            color: '#605e5c',
            fontSize: 12,
            fontFamily: "'Segoe UI', system-ui, sans-serif"
          }}>
            🔒 For your security, reset links expire after 1 hour and can only be used once.
          </Text>
        </motion.div>
      </motion.div>
    </div>
  );
}