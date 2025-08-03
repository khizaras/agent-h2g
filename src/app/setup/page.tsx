"use client";

import React, { useState } from "react";
import {
  Card,
  Button,
  Typography,
  Steps,
  Alert,
  Input,
  Space,
  Row,
  Col,
  Divider,
  Statistic,
  Progress,
  List,
  message,
  Form,
  Modal,
} from "antd";
import {
  DatabaseOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  DeleteOutlined,
  PlusOutlined,
  UserOutlined,
  FolderOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Step } = Steps;

interface SetupResult {
  success: boolean;
  results: string[];
  statistics?: {
    users: number;
    categories: number;
    causes: number;
    food_details: number;
    clothes_details: number;
    training_details: number;
  };
  error?: string;
  details?: string;
}

export default function DatabaseSetupPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [setupResults, setSetupResults] = useState<SetupResult | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const [form] = Form.useForm();

  const steps = [
    {
      title: "Security Check",
      description: "Verify admin credentials",
      icon: <WarningOutlined />,
    },
    {
      title: "Drop Tables",
      description: "Remove existing data",
      icon: <DeleteOutlined />,
    },
    {
      title: "Create Tables",
      description: "Build new schema",
      icon: <DatabaseOutlined />,
    },
    {
      title: "Seed Data",
      description: "Add sample records",
      icon: <PlusOutlined />,
    },
    {
      title: "Complete",
      description: "Setup finished",
      icon: <CheckCircleOutlined />,
    },
  ];

  const handleSetupDatabase = async (keyToUse?: string) => {
    setLoading(true);
    setCurrentStep(1);
    
    // Use passed key or current state
    const finalAdminKey = keyToUse !== undefined ? keyToUse : adminKey;
    
    try {
      const response = await fetch("/api/setup/database", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ adminKey: finalAdminKey }),
      });

      const result: SetupResult = await response.json();
      
      if (result.success) {
        // Simulate progress through steps
        for (let i = 1; i <= 4; i++) {
          setCurrentStep(i);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        setSetupResults(result);
        message.success("Database setup completed successfully!");
      } else {
        setSetupResults(result);
        message.error(result.error || "Database setup failed");
      }
    } catch (error) {
      console.error("Setup error:", error);
      setSetupResults({
        success: false,
        results: [`❌ Network error: ${error.message}`],
        error: "Failed to connect to setup API"
      });
      message.error("Failed to setup database");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSetup = () => {
    const values = form.getFieldsValue();
    const keyFromForm = values.adminKey || "";
    setAdminKey(keyFromForm);
    setShowConfirmModal(false);
    handleSetupDatabase(keyFromForm);
  };

  const resetSetup = () => {
    setCurrentStep(0);
    setSetupResults(null);
    setAdminKey("");
    form.resetFields();
  };

  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <MainLayout>
      <div style={{ minHeight: "100vh", backgroundColor: "#f0f2f5", padding: "24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card style={{ marginBottom: 24, borderRadius: 12 }}>
              <div style={{ textAlign: "center" }}>
                <DatabaseOutlined 
                  style={{ fontSize: 48, color: "#1890ff", marginBottom: 16 }} 
                />
                <Title level={1} style={{ marginBottom: 8 }}>
                  Database Production Setup
                </Title>
                <Paragraph style={{ fontSize: 16, color: "#666", maxWidth: 600, margin: "0 auto" }}>
                  Initialize your production database with fresh tables, sample data, and user accounts.
                  This will completely reset your database.
                </Paragraph>
              </div>
            </Card>
          </motion.div>

          {/* Warning Alert */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Alert
              message="⚠️ DANGER ZONE"
              description="This will permanently delete ALL existing data and create fresh tables with sample data. This action cannot be undone!"
              type="error"
              showIcon
              style={{ marginBottom: 24, borderRadius: 8 }}
            />
          </motion.div>

          {/* Environment Info */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} md={12}>
              <Card style={{ borderRadius: 8 }}>
                <Statistic
                  title="Environment"
                  value={isDevelopment ? "Development" : "Production"}
                  prefix={isDevelopment ? "🛠️" : "🚀"}
                  valueStyle={{ color: isDevelopment ? "#52c41a" : "#f5222d" }}
                />
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card style={{ borderRadius: 8 }}>
                <Statistic
                  title="Admin Key Required"
                  value={isDevelopment ? "No" : "Yes"}
                  prefix={isDevelopment ? "✅" : "🔑"}
                  valueStyle={{ color: isDevelopment ? "#52c41a" : "#faad14" }}
                />
              </Card>
            </Col>
          </Row>

          {/* Setup Progress */}
          {(loading || setupResults) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card style={{ marginBottom: 24, borderRadius: 12 }}>
                <Title level={3} style={{ marginBottom: 24 }}>Setup Progress</Title>
                <Steps current={currentStep} style={{ marginBottom: 32 }}>
                  {steps.map((step, index) => (
                    <Step
                      key={index}
                      title={step.title}
                      description={step.description}
                      icon={loading && currentStep === index ? <LoadingOutlined /> : step.icon}
                    />
                  ))}
                </Steps>
                
                {loading && (
                  <div style={{ textAlign: "center" }}>
                    <Progress percent={((currentStep) / (steps.length - 1)) * 100} />
                    <Text style={{ marginTop: 16, display: "block" }}>
                      {steps[currentStep]?.description}...
                    </Text>
                  </div>
                )}
              </Card>
            </motion.div>
          )}

          {/* Setup Results */}
          {setupResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card style={{ marginBottom: 24, borderRadius: 12 }}>
                <Title level={3} style={{ marginBottom: 16 }}>
                  {setupResults.success ? "✅ Setup Results" : "❌ Setup Failed"}
                </Title>
                
                {setupResults.success && setupResults.statistics && (
                  <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                    <Col xs={12} sm={8} md={4}>
                      <Statistic
                        title="Users"
                        value={setupResults.statistics.users}
                        prefix={<UserOutlined />}
                      />
                    </Col>
                    <Col xs={12} sm={8} md={4}>
                      <Statistic
                        title="Categories"
                        value={setupResults.statistics.categories}
                        prefix={<FolderOutlined />}
                      />
                    </Col>
                    <Col xs={12} sm={8} md={4}>
                      <Statistic
                        title="Causes"
                        value={setupResults.statistics.causes}
                        prefix={<HeartOutlined />}
                      />
                    </Col>
                    <Col xs={12} sm={8} md={4}>
                      <Statistic
                        title="Food Details"
                        value={setupResults.statistics.food_details}
                        prefix="🍽️"
                      />
                    </Col>
                    <Col xs={12} sm={8} md={4}>
                      <Statistic
                        title="Clothes Details"
                        value={setupResults.statistics.clothes_details}
                        prefix="👕"
                      />
                    </Col>
                    <Col xs={12} sm={8} md={4}>
                      <Statistic
                        title="Training Details"
                        value={setupResults.statistics.training_details}
                        prefix="📚"
                      />
                    </Col>
                  </Row>
                )}

                <List
                  dataSource={setupResults.results}
                  renderItem={(item) => (
                    <List.Item style={{ borderBottom: "none", padding: "4px 0" }}>
                      <Text 
                        code={item.includes('✅') || item.includes('❌') || item.includes('⚠️')}
                        style={{ 
                          color: item.includes('✅') ? '#52c41a' : 
                                 item.includes('❌') ? '#f5222d' : 
                                 item.includes('⚠️') ? '#faad14' : 
                                 item.includes('🎉') ? '#1890ff' : 'inherit',
                          fontWeight: item.includes('🎉') || item.includes('📊') ? 'bold' : 'normal'
                        }}
                      >
                        {item}
                      </Text>
                    </List.Item>
                  )}
                  style={{ 
                    maxHeight: 400, 
                    overflowY: 'auto',
                    backgroundColor: '#fafafa',
                    padding: 16,
                    borderRadius: 8
                  }}
                />

                <div style={{ textAlign: "center", marginTop: 24 }}>
                  <Button onClick={resetSetup} size="large">
                    Run Setup Again
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Setup Form */}
          {!loading && !setupResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card style={{ borderRadius: 12 }}>
                <Title level={3} style={{ marginBottom: 24 }}>Database Setup Configuration</Title>
                
                <Form form={form} layout="vertical">
                  {!isDevelopment && (
                    <Form.Item
                      name="adminKey"
                      label="Admin Setup Key"
                      rules={[{ required: true, message: "Admin key is required in production" }]}
                    >
                      <Input.Password
                        size="large"
                        placeholder="Enter admin setup key"
                        style={{ borderRadius: 8 }}
                      />
                    </Form.Item>
                  )}

                  <Divider />

                  <Title level={4}>What will be created:</Title>
                  <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                    <Col xs={24} md={8}>
                      <Card size="small" style={{ borderRadius: 8 }}>
                        <Statistic
                          title="Tables"
                          value="10+"
                          prefix={<DatabaseOutlined />}
                          suffix="Complete Schema"
                        />
                      </Card>
                    </Col>
                    <Col xs={24} md={8}>
                      <Card size="small" style={{ borderRadius: 8 }}>
                        <Statistic
                          title="Sample Users"
                          value="5"
                          prefix={<UserOutlined />}
                          suffix="With Credentials"
                        />
                      </Card>
                    </Col>
                    <Col xs={24} md={8}>
                      <Card size="small" style={{ borderRadius: 8 }}>
                        <Statistic
                          title="Sample Causes"
                          value="3"
                          prefix={<HeartOutlined />}
                          suffix="All Categories"
                        />
                      </Card>
                    </Col>
                  </Row>

                  <div style={{ textAlign: "center" }}>
                    <Button
                      type="primary"
                      danger
                      size="large"
                      icon={<DatabaseOutlined />}
                      onClick={() => {
                        if (isDevelopment) {
                          // In development, can proceed directly
                          const values = form.getFieldsValue();
                          const keyFromForm = values.adminKey || "";
                          setAdminKey(keyFromForm);
                          handleSetupDatabase(keyFromForm);
                        } else {
                          // In production, show confirmation modal
                          setShowConfirmModal(true);
                        }
                      }}
                      style={{ 
                        height: 50, 
                        fontSize: 16, 
                        borderRadius: 8,
                        minWidth: 200
                      }}
                    >
                      Initialize Production Database
                    </Button>
                  </div>
                </Form>
              </Card>
            </motion.div>
          )}

          {/* Confirmation Modal */}
          <Modal
            title="⚠️ Confirm Database Reset"
            open={showConfirmModal}
            onOk={handleConfirmSetup}
            onCancel={() => setShowConfirmModal(false)}
            okText="Yes, Reset Database"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <div style={{ padding: "16px 0" }}>
              <Alert
                message="This action will:"
                description={
                  <ul style={{ margin: "8px 0", paddingLeft: 20 }}>
                    <li>Drop all existing tables and data</li>
                    <li>Create fresh database schema</li>
                    <li>Insert sample users and causes</li>
                    <li>Reset all statistics and content</li>
                  </ul>
                }
                type="warning"
                showIcon
                style={{ marginBottom: 16 }}
              />
              <Paragraph strong>
                Are you absolutely sure you want to proceed? This cannot be undone.
              </Paragraph>
            </div>
          </Modal>
        </div>
      </div>
    </MainLayout>
  );
}