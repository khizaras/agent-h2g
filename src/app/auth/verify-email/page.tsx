"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, Typography, Button, message, Result } from "antd";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  MailOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

export default function VerifyEmailPage() {
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const animations = {
    fadeIn: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.6 },
    },
  };

  useEffect(() => {
    if (token) {
      verifyEmail();
    } else {
      setError("No verification token provided");
    }
  }, [token]);

  const verifyEmail = async () => {
    if (!token) return;

    setVerifying(true);
    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (data.success) {
        setVerified(true);
        message.success("Email verified successfully!");
      } else {
        setError(data.message || "Email verification failed");
      }
    } catch (error) {
      setError("An error occurred during verification. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  if (verifying) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f3f2f1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          fontFamily: "'Segoe UI', system-ui, sans-serif",
        }}
      >
        <motion.div
          {...animations.fadeIn}
          style={{
            width: "100%",
            maxWidth: "400px",
          }}
        >
          <Card
            style={{
              border: "1px solid #edebe9",
              borderRadius: 8,
              boxShadow:
                "0 1.6px 3.6px 0 rgba(0,0,0,.132), 0 0.3px 0.9px 0 rgba(0,0,0,.108)",
              padding: "24px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                background: "#0078d4",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
                color: "white",
                fontSize: 24,
              }}
            >
              <MailOutlined spin />
            </div>
            <Title
              level={3}
              style={{
                color: "#323130",
                fontFamily: "'Segoe UI', system-ui, sans-serif",
              }}
            >
              Verifying your email...
            </Title>
            <Text
              style={{
                color: "#605e5c",
                fontFamily: "'Segoe UI', system-ui, sans-serif",
              }}
            >
              Please wait while we verify your email address.
            </Text>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (verified) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f3f2f1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          fontFamily: "'Segoe UI', system-ui, sans-serif",
        }}
      >
        <motion.div
          {...animations.fadeIn}
          style={{
            width: "100%",
            maxWidth: "500px",
          }}
        >
          <Card
            style={{
              border: "1px solid #edebe9",
              borderRadius: 8,
              boxShadow:
                "0 1.6px 3.6px 0 rgba(0,0,0,.132), 0 0.3px 0.9px 0 rgba(0,0,0,.108)",
              padding: "24px",
            }}
          >
            <Result
              icon={
                <CheckCircleOutlined
                  style={{ color: "#107c10", fontSize: 72 }}
                />
              }
              title={
                <Title
                  level={2}
                  style={{
                    color: "#323130",
                    fontFamily: "'Segoe UI', system-ui, sans-serif",
                    fontWeight: 600,
                  }}
                >
                  Email Verified Successfully!
                </Title>
              }
              subTitle={
                <Text
                  style={{
                    color: "#605e5c",
                    fontSize: 16,
                    fontFamily: "'Segoe UI', system-ui, sans-serif",
                  }}
                >
                  Your email address has been verified. You can now sign in to
                  your account and start making a difference in your community.
                </Text>
              }
              extra={
                <div
                  style={{ display: "flex", gap: 16, justifyContent: "center" }}
                >
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => router.push("/auth/signin")}
                    style={{
                      backgroundColor: "#0078d4",
                      borderColor: "#0078d4",
                      borderRadius: 4,
                      height: 40,
                      fontWeight: 600,
                      fontSize: 14,
                      fontFamily: "'Segoe UI', system-ui, sans-serif",
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    size="large"
                    onClick={() => router.push("/")}
                    style={{
                      borderRadius: 4,
                      height: 40,
                      fontWeight: 600,
                      fontSize: 14,
                      fontFamily: "'Segoe UI', system-ui, sans-serif",
                    }}
                  >
                    Go to Home
                  </Button>
                </div>
              }
            />
          </Card>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f3f2f1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          fontFamily: "'Segoe UI', system-ui, sans-serif",
        }}
      >
        <motion.div
          {...animations.fadeIn}
          style={{
            width: "100%",
            maxWidth: "500px",
          }}
        >
          <Card
            style={{
              border: "1px solid #edebe9",
              borderRadius: 8,
              boxShadow:
                "0 1.6px 3.6px 0 rgba(0,0,0,.132), 0 0.3px 0.9px 0 rgba(0,0,0,.108)",
              padding: "24px",
            }}
          >
            <Result
              icon={
                <CloseCircleOutlined
                  style={{ color: "#d13438", fontSize: 72 }}
                />
              }
              title={
                <Title
                  level={2}
                  style={{
                    color: "#323130",
                    fontFamily: "'Segoe UI', system-ui, sans-serif",
                    fontWeight: 600,
                  }}
                >
                  Verification Failed
                </Title>
              }
              subTitle={
                <Text
                  style={{
                    color: "#605e5c",
                    fontSize: 16,
                    fontFamily: "'Segoe UI', system-ui, sans-serif",
                  }}
                >
                  {error}
                </Text>
              }
              extra={
                <div
                  style={{
                    display: "flex",
                    gap: 16,
                    justifyContent: "center",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#605e5c",
                      fontSize: 14,
                      fontFamily: "'Segoe UI', system-ui, sans-serif",
                      marginBottom: 16,
                    }}
                  >
                    If you need a new verification email, you can request one
                    from the sign-in page.
                  </Text>
                  <div style={{ display: "flex", gap: 16 }}>
                    <Button
                      type="primary"
                      size="large"
                      onClick={() => router.push("/auth/signin")}
                      style={{
                        backgroundColor: "#0078d4",
                        borderColor: "#0078d4",
                        borderRadius: 4,
                        height: 40,
                        fontWeight: 600,
                        fontSize: 14,
                        fontFamily: "'Segoe UI', system-ui, sans-serif",
                      }}
                    >
                      Go to Sign In
                    </Button>
                    <Button
                      size="large"
                      onClick={() => router.push("/")}
                      style={{
                        borderRadius: 4,
                        height: 40,
                        fontWeight: 600,
                        fontSize: 14,
                        fontFamily: "'Segoe UI', system-ui, sans-serif",
                      }}
                    >
                      Go to Home
                    </Button>
                  </div>
                </div>
              }
            />
          </Card>
        </motion.div>
      </div>
    );
  }

  return null;
}
