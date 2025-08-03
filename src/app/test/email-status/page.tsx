"use client";

import { useState, useEffect } from "react";
import { Card, Button, Typography, Space, Tag, Alert, Divider } from "antd";
import { FiMail, FiCheckCircle, FiXCircle, FiSettings } from "react-icons/fi";

const { Title, Text, Paragraph } = Typography;

export default function EmailStatusPage() {
  const [emailStatus, setEmailStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testEmailConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/test/email");
      const result = await response.json();
      setEmailStatus(result);
    } catch (error) {
      setEmailStatus({
        success: false,
        error: "Failed to connect to email test endpoint",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testEmailConnection();
  }, []);

  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <Card>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <FiMail size={48} color="#1890ff" />
            <Title level={2}>Email System Status</Title>
            <Paragraph>
              Check the configuration and functionality of the email
              notification system
            </Paragraph>
          </div>

          <Divider />

          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <div>
              <Title level={4}>
                <FiSettings style={{ marginRight: "8px" }} />
                Current Configuration
              </Title>
              <div
                style={{
                  background: "#f9f9f9",
                  padding: "16px",
                  borderRadius: "8px",
                }}
              >
                <Text strong>SMTP Host:</Text> smtp.gmail.com
                <br />
                <Text strong>SMTP Port:</Text> 587
                <br />
                <Text strong>Security:</Text> STARTTLS
                <br />
                <Text strong>From Email:</Text> noreply@hands2gether.com
                <br />
              </div>
            </div>

            <div>
              <Title level={4}>Connection Status</Title>
              {loading ? (
                <Alert
                  message="Testing email connection..."
                  type="info"
                  showIcon
                />
              ) : emailStatus ? (
                <div>
                  <Alert
                    message={
                      emailStatus.success
                        ? "Email System Ready"
                        : "Email System Error"
                    }
                    description={emailStatus.message || emailStatus.error}
                    type={emailStatus.success ? "success" : "error"}
                    showIcon
                    icon={
                      emailStatus.success ? <FiCheckCircle /> : <FiXCircle />
                    }
                  />

                  {emailStatus.config && (
                    <div
                      style={{
                        marginTop: "16px",
                        background: "#f9f9f9",
                        padding: "16px",
                        borderRadius: "8px",
                      }}
                    >
                      <Text strong>SMTP Configuration:</Text>
                      <pre style={{ fontSize: "12px", marginTop: "8px" }}>
                        {JSON.stringify(emailStatus.config, null, 2)}
                      </pre>
                    </div>
                  )}

                  {emailStatus.templates && (
                    <div style={{ marginTop: "16px" }}>
                      <Text strong>Available Email Templates:</Text>
                      <div style={{ marginTop: "8px" }}>
                        {emailStatus.templates.map((template: string) => (
                          <Tag
                            key={template}
                            color="blue"
                            style={{ margin: "4px" }}
                          >
                            {template}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Alert message="No status available" type="warning" />
              )}
            </div>

            <div>
              <Title level={4}>Email Features</Title>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "16px",
                }}
              >
                <Card size="small" title="Welcome Emails">
                  <Text>Sent automatically when users sign up</Text>
                  <br />
                  <Tag color="green">✓ Implemented</Tag>
                </Card>
                <Card size="small" title="Donation Confirmations">
                  <Text>Sent when users support a cause</Text>
                  <br />
                  <Tag color="green">✓ Implemented</Tag>
                </Card>
                <Card size="small" title="Comment Notifications">
                  <Text>Sent to cause creators for new comments</Text>
                  <br />
                  <Tag color="green">✓ Implemented</Tag>
                </Card>
              </div>
            </div>

            <div style={{ textAlign: "center" }}>
              <Button
                type="primary"
                icon={<FiMail />}
                loading={loading}
                onClick={testEmailConnection}
              >
                Test Email Connection
              </Button>
            </div>
          </Space>
        </Card>

        <Card style={{ marginTop: "24px" }}>
          <Title level={4}>Setup Instructions</Title>
          <Alert
            message="SMTP Configuration Required"
            description={
              <div>
                <p>
                  To enable email notifications, you need to configure SMTP
                  credentials:
                </p>
                <ol>
                  <li>
                    Get SMTP credentials for hands2gethero.org email domain
                  </li>
                  <li>
                    Update the following environment variables in .env.local:
                  </li>
                  <ul>
                    <li>
                      <code>SMTP_USER</code> - Your email address
                    </li>
                    <li>
                      <code>SMTP_PASSWORD</code> - Your app-specific password
                    </li>
                  </ul>
                  <li>Restart the development server</li>
                </ol>
              </div>
            }
            type="info"
            showIcon
          />
        </Card>
      </div>
    </div>
  );
}
