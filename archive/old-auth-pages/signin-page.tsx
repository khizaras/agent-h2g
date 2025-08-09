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
  message,
  Checkbox,
} from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import Link from "next/link";
import { animations } from "@/config/theme";

const { Title, Text } = Typography;

export default function SignInPage() {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values: {
    email: string;
    password: string;
    remember: boolean;
  }) => {
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        message.error("Invalid email or password");
      } else {
        message.success("Welcome back!");
        router.push("/");
      }
    } catch (error) {
      message.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      message.error("Google sign-in failed. Please try again.");
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
          maxWidth: '360px',
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
            Sign in
          </Title>
          <Text style={{
            color: '#605e5c',
            fontSize: 14,
            fontFamily: "'Segoe UI', system-ui, sans-serif"
          }}>
            to continue to Hands2gether
          </Text>
        </div>

        <Card style={{
          border: '1px solid #edebe9',
          borderRadius: 8,
          boxShadow: '0 1.6px 3.6px 0 rgba(0,0,0,.132), 0 0.3px 0.9px 0 rgba(0,0,0,.108)',
          padding: '8px',
        }}>
          <Form
            name="signin"
            onFinish={onFinish}
            layout="vertical"
            size="middle"
            autoComplete="off"
            style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
          >
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
              ]}
              style={{ marginBottom: 16 }}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#605e5c' }} />}
                placeholder="Enter your password"
                style={{
                  borderRadius: 4,
                  borderColor: '#8a8886',
                  fontFamily: "'Segoe UI', system-ui, sans-serif"
                }}
              />
            </Form.Item>

            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: 24
            }}>
              <Form.Item
                name="remember"
                valuePropName="checked"
                style={{ margin: 0 }}
              >
                <Checkbox style={{
                  fontSize: 14,
                  fontFamily: "'Segoe UI', system-ui, sans-serif"
                }}>
                  Keep me signed in
                </Checkbox>
              </Form.Item>
              <Link 
                href="/auth/forgot-password" 
                style={{ 
                  color: '#0078d4', 
                  textDecoration: 'none',
                  fontSize: 14,
                  fontFamily: "'Segoe UI', system-ui, sans-serif"
                }}
              >
                Forgot password?
              </Link>
            </div>

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
                Sign in
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
            onClick={handleGoogleSignIn}
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
            Sign in with Google
          </Button>

          <div style={{ textAlign: 'center' }}>
            <Text style={{
              color: '#605e5c',
              fontSize: 14,
              fontFamily: "'Segoe UI', system-ui, sans-serif"
            }}>
              No account?{" "}
              <Link 
                href="/auth/signup" 
                style={{ 
                  color: '#0078d4', 
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontFamily: "'Segoe UI', system-ui, sans-serif"
                }}
              >
                Create one!
              </Link>
            </Text>
          </div>
        </Card>

        {/* Terms and Privacy */}
        <div style={{
          marginTop: 24,
          textAlign: 'center'
        }}>
          <Text style={{
            color: '#8a8886',
            fontSize: 12,
            fontFamily: "'Segoe UI', system-ui, sans-serif"
          }}>
            By signing in, you agree to our{" "}
            <Link 
              href="/terms" 
              style={{ 
                color: '#0078d4', 
                textDecoration: 'none',
                fontFamily: "'Segoe UI', system-ui, sans-serif"
              }}
            >
              Terms
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
          </Text>
        </div>
      </motion.div>
    </div>
  );
}