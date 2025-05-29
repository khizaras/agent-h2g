import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Divider,
  Alert,
  Space,
  message,
} from "antd";
import { UserOutlined, LockOutlined, GoogleOutlined } from "@ant-design/icons";
import { useGoogleLogin } from "@react-oauth/google";
import { login, reset, googleLogin } from "../../redux/slices/authSlice";
import { trackLogin, trackEvent } from "../../utils/analytics";

const { Title, Text } = Typography;

const LoginPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [messageApi, contextHolder] = message.useMessage();

  const {
    user,
    isLoading,
    isSuccess,
    isError,
    message: errorMessage,
  } = useSelector((state) => state.auth);
  // Check for location state to see if redirected from chatbot
  const location = useLocation();
  const fromChatbot = location.state?.from === "chatbot";

  // Redirect if logged in
  useEffect(() => {
    if (isSuccess || user) {
      // If redirected from chatbot, go back to the page where the chatbot was opened
      navigate(fromChatbot ? -1 : "/");
    }

    if (isError) {
      messageApi.error(errorMessage);
    }

    dispatch(reset());
  }, [
    user,
    isSuccess,
    isError,
    errorMessage,
    navigate,
    dispatch,
    messageApi,
    fromChatbot,
  ]);
  const onFinish = (values) => {
    dispatch(login(values));
    // Track successful login with email
    trackLogin("email");
  };
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Get token and send to backend
        const accessToken = tokenResponse.access_token;
        dispatch(googleLogin(accessToken));
        // Track successful login with Google
        trackLogin("google");
      } catch (error) {
        messageApi.error("Google login failed. Please try again.");
        // Track failed login attempt
        trackEvent("User", "Login Failed", "Google", error.message);
      }
    },
    onError: (error) => {
      messageApi.error("Google login failed. Please try again.");
      // Track error
      trackEvent(
        "User",
        "Login Failed",
        "Google",
        error?.message || "Unknown error"
      );
    },
  });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 64px - 70px - 48px)",
      }}
    >
      {contextHolder}{" "}
      <Card style={{ width: 400, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Title level={2}>Welcome Back</Title>
          <Text type="secondary">Sign in to your Hands2gether account</Text>
        </div>
        {fromChatbot && (
          <Alert
            message="Login Required for Chatbot"
            description="You need to be logged in to use our chatbot assistant."
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}
        <Form form={form} name="login" onFinish={onFinish} layout="vertical">
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Link to="/forgot-password">Forgot password?</Link>
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={isLoading}
            >
              Log In
            </Button>
          </Form.Item>
        </Form>
        <Divider plain>Or</Divider>{" "}
        <Button
          icon={<GoogleOutlined />}
          size="large"
          onClick={() => handleGoogleLogin()}
          block
          style={{ marginBottom: 16 }}
        >
          Continue with Google
        </Button>
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Text>Don't have an account? </Text>
          <Link to="/register">Sign up</Link>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
