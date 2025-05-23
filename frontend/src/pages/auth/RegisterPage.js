import React, { useState, useEffect } from "react";
import { Form, Input, Button, Typography, Card, Alert, Divider } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  GoogleOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useGoogleLogin } from "@react-oauth/google";
import { register, reset, googleLogin } from "../../redux/slices/authSlice";
import { trackRegistration, trackEvent } from "../../utils/analytics";

const { Title } = Typography;

const RegisterPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const [error, setError] = useState(null);
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Get token and send to backend
        const accessToken = tokenResponse.access_token;
        dispatch(googleLogin(accessToken));
        // Track successful registration with Google
        trackRegistration("google");
      } catch (error) {
        setError("Google login failed. Please try again.");
        // Track failed registration attempt
        trackEvent("User", "Registration Failed", "Google", error?.message);
      }
    },
    onError: (error) => {
      setError("Google login failed. Please try again.");
      // Track error
      trackEvent(
        "User",
        "Registration Failed",
        "Google",
        error?.message || "Unknown error"
      );
    },
  });

  useEffect(() => {
    if (isError) {
      setError(message);
    }

    if (isSuccess || user) {
      navigate("/");
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onFinish = (values) => {
    if (values.password !== values.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const userData = {
      name: values.name,
      email: values.email,
      password: values.password,
    };
    dispatch(register(userData));
    // Track successful registration with email
    trackRegistration("email");
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", padding: "0 20px" }}>
      <Card>
        <Title level={2} style={{ textAlign: "center", marginBottom: 30 }}>
          Register
        </Title>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: 20 }}
          />
        )}

        <Form form={form} name="register" onFinish={onFinish} layout="vertical">
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Name" size="large" />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email address!" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            rules={[
              { required: true, message: "Please confirm your password!" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm Password"
              size="large"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={isLoading}
            >
              Register
            </Button>
          </Form.Item>{" "}
        </Form>

        <Divider plain>Or</Divider>

        <Button
          icon={<GoogleOutlined />}
          size="large"
          onClick={() => handleGoogleLogin()}
          block
          style={{ marginBottom: 16 }}
        >
          Sign up with Google
        </Button>

        <div style={{ textAlign: "center" }}>
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;
