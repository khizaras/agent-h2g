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
import {
  UserOutlined,
  LockOutlined,
  GoogleOutlined,
  MailOutlined,
} from "@ant-design/icons";
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4"
          >
            <span className="text-white text-2xl font-bold">H2G</span>
          </motion.div>
          <Title level={2} className="text-gray-800 mb-2">
            Welcome Back
          </Title>
          <Text className="text-gray-600">
            Sign in to continue making a difference
          </Text>
        </div>

        <Card className="shadow-xl border-0" style={{ borderRadius: "24px" }}>
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
                prefix={<MailOutlined className="text-gray-400" />}
                placeholder="Enter your email"
                className="h-12 rounded-xl"
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
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Enter your password"
                className="h-12 rounded-xl"
              />
            </Form.Item>

            <div className="flex justify-between items-center mb-6">
              <Form.Item
                name="remember"
                valuePropName="checked"
                className="mb-0"
              >
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <Link
                href="/auth/forgot-password"
                className="text-blue-600 hover:text-blue-700"
              >
                Forgot password?
              </Link>
            </div>

            <Form.Item className="mb-4">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full h-12 text-lg font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 border-0"
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
            icon={<GoogleOutlined />}
            loading={googleLoading}
            onClick={handleGoogleSignIn}
            className="w-full h-12 mb-6 rounded-xl border-gray-300 hover:border-blue-400"
          >
            Continue with Google
          </Button>

          <div className="text-center">
            <Text type="secondary">
              Don't have an account?{" "}
              <Link
                href="/auth/signup"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
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
          className="mt-8 text-center"
        >
          <Space direction="vertical" size="small">
            <Text type="secondary" className="text-sm">
              🤝 Connect with your community
            </Text>
            <Text type="secondary" className="text-sm">
              💝 Make meaningful contributions
            </Text>
            <Text type="secondary" className="text-sm">
              🌟 Track your impact
            </Text>
          </Space>
        </motion.div>
      </motion.div>
    </div>
  );
}
