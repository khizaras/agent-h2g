import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { login, reset, googleLogin } from "../../redux/slices/authSlice";

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

  // Redirect if logged in
  useEffect(() => {
    if (isSuccess || user) {
      navigate("/");
    }

    if (isError) {
      messageApi.error(errorMessage);
    }

    dispatch(reset());
  }, [user, isSuccess, isError, errorMessage, navigate, dispatch, messageApi]);

  const onFinish = (values) => {
    dispatch(login(values));
  };

  const handleGoogleLogin = async () => {
    // Implementation would depend on your Google auth setup
    // This is a placeholder for where you would trigger Google OAuth flow
    try {
      // In a real implementation, this would trigger the Google OAuth flow
      // and then call the googleLogin action with the received token
      alert("Google login would be implemented here with a real OAuth flow");

      // Simulating a successful login for demo purposes
      // const token = await getGoogleToken();
      // dispatch(googleLogin(token));
    } catch (error) {
      messageApi.error("Google login failed. Please try again.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 64px - 70px - 48px)",
      }}
    >
      {contextHolder}
      <Card style={{ width: 400, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Title level={2}>Welcome Back</Title>
          <Text type="secondary">Sign in to your Hands2gether account</Text>
        </div>

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

        <Divider plain>Or</Divider>

        <Button
          icon={<GoogleOutlined />}
          size="large"
          onClick={handleGoogleLogin}
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
