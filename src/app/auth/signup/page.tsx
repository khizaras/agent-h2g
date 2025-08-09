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
import { FiMail, FiLock, FiUserPlus } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import Link from "next/link";
import "@/styles/auth-premium.css";

const { Title, Text, Paragraph } = Typography;

const animations = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  },
  item: {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35 },
    },
  },
};

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
    } catch {
      message.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch {
      message.error("Google sign-up failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="auth-page signup">
      <div className="auth-layout">
        {/* Media / brand side */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={animations.container}
          className="auth-media"
        >
          <motion.div variants={animations.item} className="auth-media-inner">
            <div className="auth-badge-pill">Join the Movement</div>
            <div className="auth-badge">H2G</div>
            <Title level={1} className="auth-title">
              Join Hands2gether
            </Title>
            <Paragraph className="auth-subtitle">
              Create your account and start supporting causes that matter in
              your local community.
            </Paragraph>

            <div className="auth-impact-stats">
              <div className="auth-stat">
                <div className="auth-stat-value">87%</div>
                <div className="auth-stat-label">Success Rate</div>
              </div>
              <div className="auth-stat">
                <div className="auth-stat-value">32K</div>
                <div className="auth-stat-label">Volunteers</div>
              </div>
              <div className="auth-stat">
                <div className="auth-stat-value">156</div>
                <div className="auth-stat-label">Communities</div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="auth-testimonial"
            >
              <div className="auth-quote">
                "I've been volunteering through Hands2gether for over a year
                now. The platform makes it so easy to find meaningful ways to
                help, and I've made lasting connections with amazing people."
              </div>
              <div className="auth-quote-author">
                <div className="auth-quote-avatar">JT</div>
                <div>
                  <div style={{ fontWeight: 600, color: "#fff" }}>James T.</div>
                  <div
                    style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)" }}
                  >
                    Volunteer
                  </div>
                </div>
              </div>
            </motion.div>

            <img
              className="auth-illustration"
              src="/illustrations/teamwork.svg"
              alt="Teamwork Illustration"
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
                Create account
              </Title>
              <Text className="auth-caption">It only takes a minute</Text>
            </div>

            <Form
              form={form}
              name="signup"
              layout="vertical"
              size="middle"
              onFinish={onFinish}
              autoComplete="off"
              className="auth-form"
            >
              <div className="auth-row gap">
                <Form.Item
                  name="firstName"
                  label={<span className="auth-label">First name</span>}
                  rules={[
                    { required: true, message: "First name is required" },
                  ]}
                  className="flex-1"
                >
                  <Input
                    prefix={<FiUserPlus />}
                    placeholder="First name"
                    className="auth-input"
                    size="large"
                  />
                </Form.Item>
                <Form.Item
                  name="lastName"
                  label={<span className="auth-label">Last name</span>}
                  rules={[{ required: true, message: "Last name is required" }]}
                  className="flex-1"
                >
                  <Input
                    prefix={<FiUserPlus />}
                    placeholder="Last name"
                    className="auth-input"
                    size="large"
                  />
                </Form.Item>
              </div>

              <Form.Item
                name="email"
                label={<span className="auth-label">Email</span>}
                rules={[
                  { required: true, message: "Email is required" },
                  { type: "email", message: "Enter a valid email" },
                ]}
              >
                <Input
                  prefix={<FiMail />}
                  placeholder="you@example.com"
                  className="auth-input"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label={<span className="auth-label">Password</span>}
                rules={[
                  { required: true, message: "Password is required" },
                  { min: 8, message: "At least 8 characters" },
                ]}
              >
                <Input.Password
                  prefix={<FiLock />}
                  placeholder="Create a password"
                  className="auth-input"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label={<span className="auth-label">Confirm password</span>}
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Please confirm your password" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      return !value || getFieldValue("password") === value
                        ? Promise.resolve()
                        : Promise.reject(new Error("Passwords don't match"));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<FiLock />}
                  placeholder="Confirm your password"
                  className="auth-input"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="agreeToTerms"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, v) =>
                      v
                        ? Promise.resolve()
                        : Promise.reject(
                            new Error("You must agree to the terms"),
                          ),
                  },
                ]}
              >
                <Checkbox className="auth-checkbox">
                  I agree to the{" "}
                  <Link href="/terms" className="auth-link">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="auth-link">
                    Privacy Policy
                  </Link>
                </Checkbox>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  size="large"
                  block
                  className="auth-btn-primary"
                  icon={<FiUserPlus />}
                >
                  Create account
                </Button>
              </Form.Item>
            </Form>

            <Divider className="auth-divider">or</Divider>

            <Button
              size="large"
              icon={<FcGoogle />}
              loading={googleLoading}
              onClick={handleGoogleSignUp}
              block
              className="auth-btn-secondary"
            >
              Sign up with Google
            </Button>

            <div className="auth-footnote">
              <Text className="auth-caption">Already have an account? </Text>
              <Link href="/auth/signin" className="auth-link-strong">
                Sign in
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
