"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Divider,
  Space,
  message,
  Checkbox,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import Link from "next/link";
import { animations } from "@/config/theme";

const { Title, Text } = Typography;

interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();
  const [form] = Form.useForm();

  const onFinish = async (values: SignUpFormData) => {
    setLoading(true);
    try {
      const registrationData = {
        name: `${values.firstName} ${values.lastName}`.trim(),
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      };

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
      });

      if (response.ok) {
        message.success("Account created successfully! Please sign in.");
        router.push("/auth/signin");
      } else {
        const error = await response.json();
        message.error(error.message || "Registration failed");
      }
    } catch (error) {
      message.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      message.error("Google sign-up failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

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
            Create your account
          </Title>
          <Text style={{
            color: '#605e5c',
            fontSize: 14,
            fontFamily: "'Segoe UI', system-ui, sans-serif"
          }}>
            Join your community and start making a difference
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
            name="signup"
            layout="vertical"
            size="middle"
            onFinish={onFinish}
            autoComplete="off"
            style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
          >
            <div style={{ display: 'flex', gap: 12 }}>
              <Form.Item
                name="firstName"
                label="First name"
                rules={[
                  { required: true, message: "First name is required" },
                ]}
                style={{ flex: 1, marginBottom: 16 }}
              >
                <Input
                  prefix={<UserOutlined style={{ color: '#605e5c' }} />}
                  placeholder="First name"
                  style={{
                    borderRadius: 4,
                    borderColor: '#8a8886',
                    fontFamily: "'Segoe UI', system-ui, sans-serif"
                  }}
                />
              </Form.Item>

              <Form.Item
                name="lastName"
                label="Last name"
                rules={[
                  { required: true, message: "Last name is required" },
                ]}
                style={{ flex: 1, marginBottom: 16 }}
              >
                <Input
                  prefix={<UserOutlined style={{ color: '#605e5c' }} />}
                  placeholder="Last name"
                  style={{
                    borderRadius: 4,
                    borderColor: '#8a8886',
                    fontFamily: "'Segoe UI', system-ui, sans-serif"
                  }}
                />
              </Form.Item>
            </div>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Email is required" },
                { type: "email", message: "Please enter a valid email" },
              ]}
              style={{ marginBottom: 16 }}
            >
              <Input
                prefix={<MailOutlined style={{ color: '#605e5c' }} />}
                placeholder="Enter your email"
                style={{
                  borderRadius: 4,
                  borderColor: '#8a8886',
                  fontFamily: "'Segoe UI', system-ui, sans-serif"
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Password is required" },
                { min: 8, message: "Password must be at least 8 characters" },
              ]}
              style={{ marginBottom: 16 }}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#605e5c' }} />}
                placeholder="Create a password"
                style={{
                  borderRadius: 4,
                  borderColor: '#8a8886',
                  fontFamily: "'Segoe UI', system-ui, sans-serif"
                }}
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm password"
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
              style={{ marginBottom: 16 }}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#605e5c' }} />}
                placeholder="Confirm your password"
                style={{
                  borderRadius: 4,
                  borderColor: '#8a8886',
                  fontFamily: "'Segoe UI', system-ui, sans-serif"
                }}
              />
            </Form.Item>

            <Form.Item
              name="agreeToTerms"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(new Error("You must agree to the terms")),
                },
              ]}
              style={{ marginBottom: 24 }}
            >
              <Checkbox style={{
                fontSize: 14,
                fontFamily: "'Segoe UI', system-ui, sans-serif"
              }}>
                I agree to the{" "}
                <Link 
                  href="/terms" 
                  style={{ 
                    color: '#0078d4', 
                    textDecoration: 'none',
                    fontFamily: "'Segoe UI', system-ui, sans-serif"
                  }}
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link 
                  href="/privacy" 
                  style={{ 
                    color: '#0078d4', 
                    textDecoration: 'none',
                    fontFamily: "'Segoe UI', system-ui, sans-serif"
                  }}
                >
                  Privacy Policy
                </Link>
              </Checkbox>
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
                Create account
              </Button>
            </Form.Item>
          </Form>

          <Divider style={{
            margin: '16px 0',
            borderColor: '#edebe9',
            fontSize: 12,
            color: '#8a8886',
            fontFamily: "'Segoe UI', system-ui, sans-serif"
          }}>
            Or
          </Divider>

          <Button
            size="large"
            icon={<FcGoogle style={{ fontSize: 16 }} />}
            loading={googleLoading}
            onClick={handleGoogleSignUp}
            block
            style={{
              borderRadius: 4,
              height: 40,
              borderColor: '#8a8886',
              color: '#323130',
              fontWeight: 600,
              fontSize: 14,
              marginBottom: 24,
              fontFamily: "'Segoe UI', system-ui, sans-serif"
            }}
          >
            Sign up with Google
          </Button>

          <div style={{ textAlign: 'center' }}>
            <Text style={{
              color: '#605e5c',
              fontSize: 14,
              fontFamily: "'Segoe UI', system-ui, sans-serif"
            }}>
              Already have an account?{" "}
              <Link 
                href="/auth/signin" 
                style={{ 
                  color: '#0078d4', 
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontFamily: "'Segoe UI', system-ui, sans-serif"
                }}
              >
                Sign in
              </Link>
            </Text>
          </div>
        </Card>

        {/* Microsoft-style features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{
            marginTop: 24,
            textAlign: 'center'
          }}
        >
          <Space direction="vertical" size={8}>
            <Text style={{
              color: '#605e5c',
              fontSize: 12,
              fontFamily: "'Segoe UI', system-ui, sans-serif"
            }}>
              ✓ Connect with local communities
            </Text>
            <Text style={{
              color: '#605e5c',
              fontSize: 12,
              fontFamily: "'Segoe UI', system-ui, sans-serif"
            }}>
              ✓ Share resources and support
            </Text>
            <Text style={{
              color: '#605e5c',
              fontSize: 12,
              fontFamily: "'Segoe UI', system-ui, sans-serif"
            }}>
              ✓ Track your community impact
            </Text>
          </Space>
        </motion.div>
      </motion.div>
    </div>
  );
}