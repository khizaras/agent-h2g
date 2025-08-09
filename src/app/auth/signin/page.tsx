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
  Space,
} from "antd";
import { 
  FiMail, 
  FiLock, 
  FiLogIn, 
  FiUser, 
  FiShield, 
  FiHeart,
  FiUsers,
  FiTrendingUp
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import Link from "next/link";

const { Title, Text, Paragraph } = Typography;

// Premium animation variants
const premiumAnimations = {
  containerVariants: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },
  itemVariants: {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95 
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.23, 1, 0.32, 1],
      },
    },
  },
  cardHover: {
    y: -4,
    scale: 1.02,
    boxShadow: "0 15px 35px rgba(102, 126, 234, 0.1)",
    transition: { duration: 0.3, ease: "easeOut" },
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
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        fontFamily: "Inter, system-ui, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Elements */}
      <div
        style={{
          position: "absolute",
          top: "-50%",
          right: "-10%",
          width: "40%",
          height: "100%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-50%",
          left: "-10%",
          width: "40%",
          height: "100%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />

      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        <motion.div
          variants={premiumAnimations.containerVariants}
          initial="hidden"
          animate="visible"
          style={{
            display: "flex",
            maxWidth: "1200px",
            width: "100%",
            borderRadius: "24px",
            overflow: "hidden",
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Left Side - Branding */}
          <motion.div
            variants={premiumAnimations.itemVariants}
            style={{
              flex: 1,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              padding: "60px 40px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              color: "white",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 50%)",
              }}
            />
            
            <div style={{ position: "relative", zIndex: 1 }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, duration: 0.6, ease: "backOut" }}
                style={{
                  width: 80,
                  height: 80,
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "32px",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.3)",
                }}
              >
                <FiHeart style={{ fontSize: 32, color: "white" }} />
              </motion.div>

              <Title
                level={1}
                style={{
                  color: "white",
                  fontSize: "clamp(32px, 5vw, 48px)",
                  fontWeight: "800",
                  marginBottom: "16px",
                  fontFamily: "Inter, system-ui, sans-serif",
                  textShadow: "0 4px 20px rgba(0,0,0,0.8), 0 2px 10px rgba(0,0,0,0.6)",
                }}
              >
                Welcome Back
              </Title>
              
              <Paragraph
                style={{
                  color: "white",
                  fontSize: "18px",
                  marginBottom: "40px",
                  fontFamily: "Inter, system-ui, sans-serif",
                  lineHeight: 1.6,
                  textShadow: "0 2px 10px rgba(0,0,0,0.8), 0 1px 5px rgba(0,0,0,0.6)",
                }}
              >
                Continue your journey of community support and making a
                difference in people's lives.
              </Paragraph>

              <Space direction="vertical" size={16}>
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "rgba(255,255,255,0.9)",
                    fontFamily: "Inter, system-ui, sans-serif",
                  }}
                >
                  <FiUsers
                    style={{
                      fontSize: 20,
                      marginRight: 12,
                      color: "rgba(255,255,255,0.8)",
                    }}
                  />
                  <Text style={{ 
                    color: "white", 
                    fontSize: 16,
                    textShadow: "0 1px 5px rgba(0,0,0,0.8)"
                  }}>
                    Connect with your community
                  </Text>
                </motion.div>
                
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "rgba(255,255,255,0.9)",
                    fontFamily: "Inter, system-ui, sans-serif",
                  }}
                >
                  <FiTrendingUp
                    style={{
                      fontSize: 20,
                      marginRight: 12,
                      color: "rgba(255,255,255,0.8)",
                    }}
                  />
                  <Text style={{ 
                    color: "white", 
                    fontSize: 16,
                    textShadow: "0 1px 5px rgba(0,0,0,0.8)"
                  }}>
                    Track your impact
                  </Text>
                </motion.div>
                
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.6 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "rgba(255,255,255,0.9)",
                    fontFamily: "Inter, system-ui, sans-serif",
                  }}
                >
                  <FiShield
                    style={{
                      fontSize: 20,
                      marginRight: 12,
                      color: "rgba(255,255,255,0.8)",
                    }}
                  />
                  <Text style={{ 
                    color: "white", 
                    fontSize: 16,
                    textShadow: "0 1px 5px rgba(0,0,0,0.8)"
                  }}>
                    Secure and trusted platform
                  </Text>
                </motion.div>
              </Space>
            </div>
          </motion.div>

          {/* Right Side - Form */}
          <motion.div
            variants={premiumAnimations.itemVariants}
            style={{
              flex: 1,
              padding: "60px 40px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              background: "white",
            }}
          >
            <div style={{ maxWidth: "400px", width: "100%" }}>
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                style={{ marginBottom: "40px", textAlign: "center" }}
              >
                <Title
                  level={2}
                  style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontSize: "32px",
                    fontWeight: "700",
                    marginBottom: "8px",
                    fontFamily: "Inter, system-ui, sans-serif",
                  }}
                >
                  Sign In
                </Title>
                <Text
                  style={{
                    color: "#64748b",
                    fontSize: "16px",
                    fontFamily: "Inter, system-ui, sans-serif",
                  }}
                >
                  Access your account to continue
                </Text>
              </motion.div>

              <Form
                form={form}
                name="signin"
                onFinish={onFinish}
                layout="vertical"
                autoComplete="off"
              >
                <Form.Item
                  name="email"
                  label={
                    <Text
                      strong
                      style={{
                        fontFamily: "Inter, system-ui, sans-serif",
                        color: "#1e293b",
                      }}
                    >
                      Email Address
                    </Text>
                  }
                  rules={[
                    { required: true, message: "Email is required" },
                    { type: "email", message: "Please enter a valid email" },
                  ]}
                  style={{ marginBottom: 20 }}
                >
                  <Input
                    prefix={<FiMail style={{ color: "#64748b" }} />}
                    placeholder="Enter your email"
                    size="large"
                    style={{
                      borderRadius: "12px",
                      border: "2px solid #e2e8f0",
                      fontFamily: "Inter, system-ui, sans-serif",
                      padding: "12px 16px",
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  label={
                    <Text
                      strong
                      style={{
                        fontFamily: "Inter, system-ui, sans-serif",
                        color: "#1e293b",
                      }}
                    >
                      Password
                    </Text>
                  }
                  rules={[{ required: true, message: "Password is required" }]}
                  style={{ marginBottom: 20 }}
                >
                  <Input.Password
                    prefix={<FiLock style={{ color: "#64748b" }} />}
                    placeholder="Enter your password"
                    size="large"
                    style={{
                      borderRadius: "12px",
                      border: "2px solid #e2e8f0",
                      fontFamily: "Inter, system-ui, sans-serif",
                      padding: "12px 16px",
                    }}
                  />
                </Form.Item>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 32,
                  }}
                >
                  <Form.Item
                    name="remember"
                    valuePropName="checked"
                    style={{ margin: 0 }}
                  >
                    <Checkbox
                      style={{
                        fontFamily: "Inter, system-ui, sans-serif",
                        color: "#64748b",
                      }}
                    >
                      Remember me
                    </Checkbox>
                  </Form.Item>
                  <Link
                    href="/auth/forgot-password"
                    style={{
                      color: "#667eea",
                      textDecoration: "none",
                      fontFamily: "Inter, system-ui, sans-serif",
                      fontWeight: "500",
                    }}
                  >
                    Forgot password?
                  </Link>
                </div>

                <Form.Item style={{ marginBottom: 24 }}>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      size="large"
                      block
                      icon={<FiLogIn />}
                      style={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        border: "none",
                        borderRadius: "12px",
                        height: "56px",
                        fontSize: "16px",
                        fontWeight: "600",
                        fontFamily: "Inter, system-ui, sans-serif",
                        boxShadow: "0 8px 20px rgba(102,126,234,0.3)",
                      }}
                    >
                      {loading ? "Signing In..." : "Sign In"}
                    </Button>
                  </motion.div>
                </Form.Item>
              </Form>

              <Divider
                style={{
                  margin: "24px 0",
                  borderColor: "#e2e8f0",
                  fontFamily: "Inter, system-ui, sans-serif",
                  color: "#64748b",
                }}
              >
                Or continue with
              </Divider>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  size="large"
                  icon={<FcGoogle style={{ fontSize: 20 }} />}
                  loading={googleLoading}
                  onClick={handleGoogleSignIn}
                  block
                  style={{
                    borderRadius: "12px",
                    height: "56px",
                    border: "2px solid #e2e8f0",
                    fontWeight: "600",
                    fontSize: "16px",
                    marginBottom: 32,
                    fontFamily: "Inter, system-ui, sans-serif",
                    color: "#1e293b",
                  }}
                >
                  Continue with Google
                </Button>
              </motion.div>

              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <Text
                  style={{
                    color: "#64748b",
                    fontSize: "16px",
                    fontFamily: "Inter, system-ui, sans-serif",
                  }}
                >
                  Don't have an account?{" "}
                  <Link
                    href="/auth/signup"
                    style={{
                      color: "#667eea",
                      textDecoration: "none",
                      fontWeight: "600",
                      fontFamily: "Inter, system-ui, sans-serif",
                    }}
                  >
                    Sign up
                  </Link>
                </Text>
              </div>

              <div style={{ textAlign: "center" }}>
                <Text
                  style={{
                    color: "#94a3b8",
                    fontSize: "12px",
                    fontFamily: "Inter, system-ui, sans-serif",
                  }}
                >
                  By signing in, you agree to our{" "}
                  <Link
                    href="/terms"
                    style={{
                      color: "#667eea",
                      textDecoration: "none",
                      fontFamily: "Inter, system-ui, sans-serif",
                    }}
                  >
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    style={{
                      color: "#667eea",
                      textDecoration: "none",
                      fontFamily: "Inter, system-ui, sans-serif",
                    }}
                  >
                    Privacy Policy
                  </Link>
                </Text>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <style jsx global>{`
        .ant-input:focus,
        .ant-input-focused {
          border-color: #667eea !important;
          box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2) !important;
        }

        .ant-input-affix-wrapper:focus,
        .ant-input-affix-wrapper-focused {
          border-color: #667eea !important;
          box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2) !important;
        }

        .ant-checkbox-checked .ant-checkbox-inner {
          background-color: #667eea !important;
          border-color: #667eea !important;
        }

        .ant-form-item-label > label {
          font-weight: 600 !important;
          color: #1e293b !important;
          font-family: "Inter", system-ui, sans-serif !important;
        }

        @media (max-width: 768px) {
          .ant-row {
            flex-direction: column;
          }
          
          .ant-col:first-child {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}