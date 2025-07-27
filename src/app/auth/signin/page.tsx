"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
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
import { FiUser, FiLock, FiMail } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import Link from "next/link";

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
    <div className="auth-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="auth-container"
      >
        {/* Logo and Brand */}
        <div className="auth-header">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="auth-logo"
          >
            <span className="auth-logo-text">H2G</span>
          </motion.div>
          <Title level={2} className="auth-title">
            Welcome Back
          </Title>
          <Text className="auth-subtitle">
            Sign in to continue making a difference
          </Text>
        </div>

        <Card className="auth-card">
          <Form
            name="signin"
            onFinish={onFinish}
            layout="vertical"
            size="large"
            autoComplete="off"
          >
            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input
                prefix={<FiMail className="input-icon" />}
                placeholder="Enter your email"
                className="auth-input"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please enter your password" },
              ]}
            >
              <Input.Password
                prefix={<FiLock className="input-icon" />}
                placeholder="Enter your password"
                className="auth-input"
              />
            </Form.Item>

            <div className="auth-form-row">
              <Form.Item
                name="remember"
                valuePropName="checked"
                className="auth-checkbox"
              >
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <Link href="/auth/forgot-password" className="auth-link">
                Forgot password?
              </Link>
            </div>

            <Form.Item className="auth-submit">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="auth-btn-primary"
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <Divider>
            <Text type="secondary">Or continue with</Text>
          </Divider>

          <Button
            size="large"
            icon={<FcGoogle />}
            loading={googleLoading}
            onClick={handleGoogleSignIn}
            className="auth-btn-google"
          >
            Continue with Google
          </Button>

          <div className="auth-footer">
            <Text type="secondary">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="auth-link">
                Sign up
              </Link>
            </Text>
          </div>
        </Card>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="auth-features"
        >
          <Space direction="vertical" size="small">
            <Text type="secondary" className="auth-feature-text">
              🤝 Connect with your community
            </Text>
            <Text type="secondary" className="auth-feature-text">
              💝 Make meaningful contributions
            </Text>
            <Text type="secondary" className="auth-feature-text">
              🌟 Track your impact
            </Text>
          </Space>
        </motion.div>
      </motion.div>
    </div>
  );
}
