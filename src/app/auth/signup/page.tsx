"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
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
  Steps,
} from "antd";
import { FiUser, FiLock, FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  LockOutlined,
  GoogleOutlined,
} from "@ant-design/icons";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import Link from "next/link";

const { Title, Text } = Typography;
const { Step } = Steps;

interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  newsletter: boolean;
}

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<SignUpFormData>>({});
  const router = useRouter();
  const [form] = Form.useForm();

  // Keep form data in sync
  useEffect(() => {
    form.setFieldsValue(formData);
  }, [form, formData]);

  const steps = [
    {
      title: "Personal Info",
      description: "Basic information",
    },
    {
      title: "Contact Details",
      description: "How to reach you",
    },
    {
      title: "Account Security",
      description: "Secure your account",
    },
  ];

  const onFinish = async (values: SignUpFormData) => {
    setLoading(true);
    try {
      // Get current form values and merge with accumulated data
      const currentValues = await form.getFieldsValue();
      const allFormData = { ...formData, ...currentValues, ...values };
      
      // Prepare data for the registration API
      const registrationData = {
        name: `${allFormData.firstName} ${allFormData.lastName}`.trim(),
        email: allFormData.email,
        password: allFormData.password,
        confirmPassword: allFormData.confirmPassword,
      };

      console.log('Submitting registration data:', registrationData); // Debug log

      // Use the correct registration endpoint
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
    } catch (error) {
      message.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      message.error("Google sign-up failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const nextStep = async () => {
    try {
      const values = await form.validateFields();
      const updatedFormData = { ...formData, ...values };
      console.log('Next step - accumulated data:', updatedFormData); // Debug log
      setFormData(updatedFormData);
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[
                { required: true, message: "Please enter your first name" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="input-icon" />}
                placeholder="Enter your first name"
                className="auth-input"
              />
            </Form.Item>

            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[
                { required: true, message: "Please enter your last name" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="input-icon" />}
                placeholder="Enter your last name"
                className="auth-input"
              />
            </Form.Item>
          </>
        );

      case 1:
        return (
          <>
            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input
                prefix={<MailOutlined className="input-icon" />}
                placeholder="Enter your email"
                className="auth-input"
              />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[
                { required: true, message: "Please enter your phone number" },
              ]}
            >
              <Input
                prefix={<PhoneOutlined className="input-icon" />}
                placeholder="Enter your phone number"
                className="auth-input"
              />
            </Form.Item>

            <Form.Item
              name="location"
              label="Location"
              rules={[
                { required: true, message: "Please enter your location" },
              ]}
            >
              <Input
                prefix={<EnvironmentOutlined className="input-icon" />}
                placeholder="City, State"
                className="auth-input"
              />
            </Form.Item>
          </>
        );

      case 2:
        return (
          <>
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please enter your password" },
                { min: 8, message: "Password must be at least 8 characters" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="input-icon" />}
                placeholder="Create a password"
                className="auth-input"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm your password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match"));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="input-icon" />}
                placeholder="Confirm your password"
                className="auth-input"
              />
            </Form.Item>

            <Form.Item
              name="agreeToTerms"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error("You must agree to the terms"),
                        ),
                },
              ]}
            >
              <Checkbox>
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

            <Form.Item name="newsletter" valuePropName="checked">
              <Checkbox>
                Subscribe to our newsletter for updates and impact stories
              </Checkbox>
            </Form.Item>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="auth-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="auth-container auth-container-wide"
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
            Join Our Community
          </Title>
          <Text className="auth-subtitle">Start making a difference today</Text>
        </div>

        <Card className="auth-card">
          {/* Progress Steps */}
          <div className="auth-steps">
            <Steps current={currentStep} size="small" className="signup-steps">
              {steps.map((step, index) => (
                <Step
                  key={index}
                  title={step.title}
                  description={step.description}
                />
              ))}
            </Steps>
          </div>

          <Form
            form={form}
            name="signup"
            onFinish={onFinish}
            layout="vertical"
            size="large"
            autoComplete="off"
            initialValues={formData}
            preserve={false}
          >
            {renderStepContent()}

            <div className="auth-form-navigation">
              {currentStep > 0 && (
                <Button
                  size="large"
                  onClick={prevStep}
                  className="auth-btn-secondary"
                >
                  Previous
                </Button>
              )}

              {currentStep < steps.length - 1 ? (
                <Button
                  type="primary"
                  size="large"
                  onClick={nextStep}
                  className="auth-btn-primary auth-btn-next"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  size="large"
                  className="auth-btn-primary auth-btn-next"
                >
                  Create Account
                </Button>
              )}
            </div>
          </Form>

          {currentStep === 0 && (
            <>
              <Divider>
                <Text type="secondary">Or continue with</Text>
              </Divider>

              <Button
                size="large"
                icon={<FcGoogle />}
                loading={googleLoading}
                onClick={handleGoogleSignUp}
                className="auth-btn-google"
              >
                Continue with Google
              </Button>
            </>
          )}

          <div className="auth-footer">
            <Text type="secondary">
              Already have an account?{" "}
              <Link href="/auth/signin" className="auth-link">
                Sign in
              </Link>
            </Text>
          </div>
        </Card>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="auth-features"
        >
          <Space direction="vertical" size="small">
            <Text type="secondary" className="auth-feature-text">
              🚀 Create and share causes
            </Text>
            <Text type="secondary" className="auth-feature-text">
              💰 Secure donation processing
            </Text>
            <Text type="secondary" className="auth-feature-text">
              📊 Track your impact
            </Text>
          </Space>
        </motion.div>
      </motion.div>
    </div>
  );
}
