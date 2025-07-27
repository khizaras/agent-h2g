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
  Space,
  message,
  Checkbox,
  Steps,
} from "antd";
import {
  FiUser,
  FiLock,
  FiMail,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";
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
      // Mock signup - replace with actual API call
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
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
      setFormData({ ...formData, ...values });
      setCurrentStep(currentStep + 1);
    } catch (error) {
      // Validation failed
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
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Enter your first name"
                className="h-12 rounded-xl"
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
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Enter your last name"
                className="h-12 rounded-xl"
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
                prefix={<MailOutlined className="text-gray-400" />}
                placeholder="Enter your email"
                className="h-12 rounded-xl"
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
                prefix={<PhoneOutlined className="text-gray-400" />}
                placeholder="Enter your phone number"
                className="h-12 rounded-xl"
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
                prefix={<EnvironmentOutlined className="text-gray-400" />}
                placeholder="City, State"
                className="h-12 rounded-xl"
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
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Create a password"
                className="h-12 rounded-xl"
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
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Confirm your password"
                className="h-12 rounded-xl"
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
                <Link
                  href="/terms"
                  className="text-blue-600 hover:text-blue-700"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-blue-600 hover:text-blue-700"
                >
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg"
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
            Join Our Community
          </Title>
          <Text className="text-gray-600">Start making a difference today</Text>
        </div>

        <Card className="shadow-xl border-0" style={{ borderRadius: "24px" }}>
          {/* Progress Steps */}
          <div className="mb-8">
            <Steps current={currentStep} size="small" className="mb-4">
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
          >
            {renderStepContent()}

            <div className="flex justify-between mt-8">
              {currentStep > 0 && (
                <Button size="large" onClick={prevStep} className="rounded-xl">
                  Previous
                </Button>
              )}

              {currentStep < steps.length - 1 ? (
                <Button
                  type="primary"
                  size="large"
                  onClick={nextStep}
                  className="ml-auto rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 border-0"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  size="large"
                  className="ml-auto rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 border-0"
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
                icon={<GoogleOutlined />}
                loading={googleLoading}
                onClick={handleGoogleSignUp}
                className="w-full h-12 mb-6 rounded-xl border-gray-300 hover:border-blue-400"
              >
                Continue with Google
              </Button>
            </>
          )}

          <div className="text-center">
            <Text type="secondary">
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
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
          className="mt-8 text-center"
        >
          <Space direction="vertical" size="small">
            <Text type="secondary" className="text-sm">
              🚀 Create and share causes
            </Text>
            <Text type="secondary" className="text-sm">
              💰 Secure donation processing
            </Text>
            <Text type="secondary" className="text-sm">
              📊 Track your impact
            </Text>
          </Space>
        </motion.div>
      </motion.div>
    </div>
  );
}
