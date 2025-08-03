"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Space,
  message,
  Result,
  Alert,
} from "antd";
import {
  LockOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import Link from "next/link";
import { animations } from "@/config/theme";

const { Title, Text } = Typography;

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

function ResetPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);
  const [tokenError, setTokenError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form] = Form.useForm();

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setTokenError("Invalid reset link. Please request a new password reset.");
      setValidatingToken(false);
      return;
    }

    validateToken();
  }, [token]);

  const validateToken = async () => {
    try {
      const response = await fetch("/api/auth/validate-reset-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (data.success) {
        setTokenValid(true);
      } else {
        setTokenError(data.message || "Invalid or expired reset link.");
      }
    } catch (error) {
      setTokenError("Failed to validate reset link. Please try again.");
    } finally {
      setValidatingToken(false);
    }
  };

  const onFinish = async (values: ResetPasswordFormData) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password: values.password,
          confirmPassword: values.confirmPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPasswordReset(true);
        message.success("Password reset successfully!");
      } else {
        message.error(data.message || "Failed to reset password");
      }
    } catch (error) {
      message.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (validatingToken) {
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
        <Card style={{
          border: '1px solid #edebe9',
          borderRadius: 8,
          boxShadow: '0 1.6px 3.6px 0 rgba(0,0,0,.132), 0 0.3px 0.9px 0 rgba(0,0,0,.108)',
          padding: '40px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔐</div>
          <Title level={3} style={{
            color: '#323130',
            fontFamily: "'Segoe UI', system-ui, sans-serif",
          }}>
            Validating reset link...
          </Title>
          <Text style={{
            color: '#605e5c',
            fontFamily: "'Segoe UI', system-ui, sans-serif"
          }}>
            Please wait while we verify your password reset link.
          </Text>
        </Card>
      </div>
    );
  }

  if (passwordReset) {
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
                <CheckCircleOutlined style={{
                  color: '#52c41a',
                  fontSize: 64,
                }} />
              }
              title={
                <Title level={3} style={{
                  color: '#323130',
                  fontFamily: "'Segoe UI', system-ui, sans-serif",
                  fontWeight: 600
                }}>
                  Password reset successful!
                </Title>
              }
              subTitle={
                <Text style={{
                  color: '#605e5c',
                  fontSize: 16,
                  fontFamily: "'Segoe UI', system-ui, sans-serif"
                }}>
                  Your password has been successfully reset. You can now sign in with your new password.
                </Text>
              }
              extra={
                <Button
                  type="primary"
                  size="large"
                  onClick={() => router.push('/auth/signin')}
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
                  Sign in now
                </Button>
              }
            />
          </Card>
        </motion.div>
      </div>
    );
  }

  if (!tokenValid) {
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
            <Alert
              message="Invalid Reset Link"
              description={tokenError}
              type="error"
              showIcon
              style={{ marginBottom: 24 }}
            />
            
            <div style={{ textAlign: 'center' }}>
              <Space direction="vertical" size={12}>
                <Link 
                  href="/auth/forgot-password"
                  style={{ 
                    color: '#0078d4', 
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: 14,
                    fontFamily: "'Segoe UI', system-ui, sans-serif"
                  }}
                >
                  Request a new password reset
                </Link>
                
                <Link 
                  href="/auth/signin"
                  style={{ 
                    color: '#605e5c', 
                    textDecoration: 'none',
                    fontSize: 14,
                    fontFamily: "'Segoe UI', system-ui, sans-serif"
                  }}
                >
                  Back to sign in
                </Link>
              </Space>
            </div>
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
            Create new password
          </Title>
          <Text style={{
            color: '#605e5c',
            fontSize: 14,
            fontFamily: "'Segoe UI', system-ui, sans-serif"
          }}>
            Enter a strong password to secure your account
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
            name="reset-password"
            layout="vertical"
            size="middle"
            onFinish={onFinish}
            autoComplete="off"
            style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
          >
            <Form.Item
              name="password"
              label="New password"
              rules={[
                { required: true, message: "Password is required" },
                { min: 8, message: "Password must be at least 8 characters" },
                {
                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
                },
              ]}
              style={{ marginBottom: 16 }}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#605e5c' }} />}
                placeholder="Enter your new password"
                size="large"
                style={{
                  borderRadius: 4,
                  borderColor: '#8a8886',
                  fontFamily: "'Segoe UI', system-ui, sans-serif"
                }}
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm new password"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm your password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords don't match"));
                  },
                }),
              ]}
              style={{ marginBottom: 24 }}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#605e5c' }} />}
                placeholder="Confirm your new password"
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
                Reset password
              </Button>
            </Form.Item>
          </Form>
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
            🔒 Choose a strong password with at least 8 characters, including uppercase, lowercase, and numbers.
          </Text>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        background: '#f3f2f1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}>
        <div>Loading...</div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}