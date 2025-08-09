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
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import Link from "next/link";
import "@/styles/auth-premium.css";

const { Title, Text, Paragraph } = Typography;

// Subtle animation variants
const animations = {
  container: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  },
  item: {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  },
};

export default function SignInPage() {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();
  const [form] = Form.useForm();

  const onFinish = async (values: {
    email: string;
    password: string;
    remember?: boolean;
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
    } catch {
      message.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch {
      message.error("Google sign-in failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="auth-page signin">
      <div className="auth-layout">
        {/* Media / brand side */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={animations.container}
          className="auth-media"
        >
          <motion.div variants={animations.item} className="auth-media-inner">
            <div className="auth-badge-pill">Community Platform</div>
            <div className="auth-badge">H2G</div>
            <Title level={1} className="auth-title">
              Welcome back
            </Title>
            <Paragraph className="auth-subtitle">
              Pick up where you left off and continue making a difference in
              your community.
            </Paragraph>

            <div className="auth-impact-stats">
              <div className="auth-stat">
                <div className="auth-stat-value">10K+</div>
                <div className="auth-stat-label">Members</div>
              </div>
              <div className="auth-stat">
                <div className="auth-stat-value">243</div>
                <div className="auth-stat-label">Active Causes</div>
              </div>
              <div className="auth-stat">
                <div className="auth-stat-value">$1.2M</div>
                <div className="auth-stat-label">Raised</div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="auth-testimonial"
            >
              <div className="auth-quote">
                "Hands2gether connected me with volunteers who helped rebuild my
                small business after the flood. I'm forever grateful to this
                amazing community."
              </div>
              <div className="auth-quote-author">
                <div className="auth-quote-avatar">MS</div>
                <div>
                  <div style={{ fontWeight: 600, color: "#fff" }}>Maria S.</div>
                  <div
                    style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)" }}
                  >
                    Small Business Owner
                  </div>
                </div>
              </div>
            </motion.div>

            <img
              className="auth-illustration"
              src="/illustrations/handshake.svg"
              alt="Collaboration Illustration"
            />
            <div className="auth-credit">Background photo via Unsplash</div>
          </motion.div>
        </motion.div>

        {/* Form side */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={animations.container}
          className="auth-panel"
        >
          <motion.div variants={animations.item} className="auth-panel-inner">
            <div className="auth-header">
              <Title level={2} className="auth-heading">
                Sign in
              </Title>
              <Text className="auth-caption">
                Access your account to continue
              </Text>
            </div>

            <Form
              form={form}
              name="signin"
              onFinish={onFinish}
              layout="vertical"
              autoComplete="off"
              className="auth-form"
            >
              <Form.Item
                name="email"
                label={<span className="auth-label">Email address</span>}
                rules={[
                  { required: true, message: "Email is required" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input
                  prefix={<FiMail />}
                  placeholder="you@example.com"
                  size="large"
                  className="auth-input"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label={<span className="auth-label">Password</span>}
                rules={[{ required: true, message: "Password is required" }]}
              >
                <Input.Password
                  prefix={<FiLock />}
                  placeholder="Enter your password"
                  size="large"
                  className="auth-input"
                />
              </Form.Item>

              <div className="auth-row">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox className="auth-checkbox">Remember me</Checkbox>
                </Form.Item>
                <Link href="/auth/forgot-password" className="auth-link">
                  Forgot password?
                </Link>
              </div>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  size="large"
                  block
                  className="auth-btn-primary"
                  icon={<FiLogIn />}
                >
                  Sign in
                </Button>
              </Form.Item>
            </Form>

            <Divider className="auth-divider">or</Divider>

            <Button
              size="large"
              icon={<FcGoogle />}
              loading={googleLoading}
              onClick={handleGoogleSignIn}
              block
              className="auth-btn-secondary"
            >
              Continue with Google
            </Button>

            <div className="auth-footnote">
              <Text className="auth-caption">Don&apos;t have an account? </Text>
              <Link href="/auth/signup" className="auth-link-strong">
                Create account
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
