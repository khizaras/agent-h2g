"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  Button,
  Typography,
  Progress,
  Space,
  Tag,
  Divider,
  Image,
  Row,
  Col,
  Modal,
  Input,
  message,
  Avatar,
  List,
  Rate,
} from "antd";
import {
  HeartOutlined,
  ShareAltOutlined,
  TeamOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  UserOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface Cause {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  goalAmount: number;
  raisedAmount: number;
  location: string;
  category: string;
  status: string;
  createdAt: string;
  creator: {
    name: string;
    avatar?: string;
  };
  contributors: {
    name: string;
    amount: number;
    date: string;
    avatar?: string;
  }[];
  updates: {
    title: string;
    content: string;
    date: string;
  }[];
}

export default function CauseDetailPage() {
  const { id } = useParams();
  const [cause, setCause] = useState<Cause | null>(null);
  const [loading, setLoading] = useState(true);
  const [donateModalVisible, setDonateModalVisible] = useState(false);
  const [donationAmount, setDonationAmount] = useState("");
  const [donationMessage, setDonationMessage] = useState("");

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockCause: Cause = {
      id: Number(id),
      title: "Emergency Food Relief for Homeless Families",
      description:
        "We are organizing an emergency food relief program to help homeless families in our community. Many families are struggling to put food on the table, especially during these challenging times. Your donation will help us provide nutritious meals, essential groceries, and emergency food packages to those who need it most.",
      imageUrl:
        "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&h=400&fit=crop",
      goalAmount: 50000,
      raisedAmount: 32500,
      location: "Downtown Community Center",
      category: "Emergency Relief",
      status: "active",
      createdAt: "2024-01-15",
      creator: {
        name: "Sarah Johnson",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b765?w=100&h=100&fit=crop&crop=face",
      },
      contributors: [
        {
          name: "John Doe",
          amount: 100,
          date: "2024-01-20",
          avatar:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        },
        {
          name: "Jane Smith",
          amount: 250,
          date: "2024-01-19",
          avatar:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
        },
        { name: "Mike Wilson", amount: 500, date: "2024-01-18" },
        { name: "Emily Davis", amount: 75, date: "2024-01-17" },
      ],
      updates: [
        {
          title: "Food Distribution Successful",
          content:
            "We successfully distributed food packages to 50 families this weekend. Thank you for your continued support!",
          date: "2024-01-20",
        },
        {
          title: "New Partnership Established",
          content:
            "We've partnered with the local food bank to increase our reach and impact in the community.",
          date: "2024-01-18",
        },
      ],
    };

    setTimeout(() => {
      setCause(mockCause);
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleDonate = () => {
    if (!donationAmount || Number(donationAmount) <= 0) {
      message.error("Please enter a valid donation amount");
      return;
    }

    // Mock donation - replace with actual payment processing
    message.success(`Thank you for your donation of $${donationAmount}!`);
    setDonateModalVisible(false);
    setDonationAmount("");
    setDonationMessage("");

    // Update raised amount
    if (cause) {
      setCause({
        ...cause,
        raisedAmount: cause.raisedAmount + Number(donationAmount),
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <Text className="mt-4 text-gray-600">Loading cause details...</Text>
        </div>
      </div>
    );
  }

  if (!cause) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Text className="text-gray-600">Cause not found</Text>
      </div>
    );
  }

  const progressPercentage = (cause.raisedAmount / cause.goalAmount) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Row gutter={[32, 32]}>
            {/* Main Content */}
            <Col xs={24} lg={16}>
              {/* Hero Image */}
              <div className="relative overflow-hidden rounded-2xl mb-8">
                <Image
                  src={cause.imageUrl}
                  alt={cause.title}
                  className="w-full h-96 object-cover"
                  preview={false}
                />
                <div className="absolute top-4 right-4">
                  <Tag
                    color={cause.status === "active" ? "green" : "orange"}
                    className="text-sm"
                  >
                    {cause.status.toUpperCase()}
                  </Tag>
                </div>
              </div>

              {/* Title and Description */}
              <Card className="mb-8" bordered={false}>
                <Title level={1} className="text-gray-800 mb-4">
                  {cause.title}
                </Title>

                <Space className="mb-6" wrap>
                  <Space>
                    <EnvironmentOutlined className="text-blue-600" />
                    <Text>{cause.location}</Text>
                  </Space>
                  <Space>
                    <CalendarOutlined className="text-blue-600" />
                    <Text>
                      Created {new Date(cause.createdAt).toLocaleDateString()}
                    </Text>
                  </Space>
                  <Tag color="blue">{cause.category}</Tag>
                </Space>

                <Paragraph className="text-lg text-gray-700 leading-relaxed">
                  {cause.description}
                </Paragraph>
              </Card>

              {/* Updates */}
              <Card title="Recent Updates" className="mb-8" bordered={false}>
                <List
                  dataSource={cause.updates}
                  renderItem={(update) => (
                    <List.Item>
                      <div className="w-full">
                        <div className="flex justify-between items-start mb-2">
                          <Title level={5} className="mb-0">
                            {update.title}
                          </Title>
                          <Text type="secondary" className="text-sm">
                            {new Date(update.date).toLocaleDateString()}
                          </Text>
                        </div>
                        <Paragraph className="text-gray-600 mb-0">
                          {update.content}
                        </Paragraph>
                      </div>
                    </List.Item>
                  )}
                />
              </Card>

              {/* Contributors */}
              <Card title="Recent Contributors" bordered={false}>
                <List
                  dataSource={cause.contributors}
                  renderItem={(contributor) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            src={contributor.avatar}
                            icon={!contributor.avatar && <UserOutlined />}
                          />
                        }
                        title={contributor.name}
                        description={`Donated $${contributor.amount} on ${new Date(contributor.date).toLocaleDateString()}`}
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>

            {/* Sidebar */}
            <Col xs={24} lg={8}>
              <div className="sticky top-8">
                {/* Donation Card */}
                <Card className="mb-6" bordered={false}>
                  <div className="text-center mb-6">
                    <Title level={2} className="text-green-600 mb-2">
                      ${cause.raisedAmount.toLocaleString()}
                    </Title>
                    <Text className="text-gray-600">
                      raised of ${cause.goalAmount.toLocaleString()} goal
                    </Text>
                  </div>

                  <Progress
                    percent={progressPercentage}
                    strokeColor="#059669"
                    className="mb-6"
                  />

                  <div className="flex justify-between mb-6">
                    <div className="text-center">
                      <Title level={4} className="mb-0">
                        {cause.contributors.length}
                      </Title>
                      <Text type="secondary">Contributors</Text>
                    </div>
                    <div className="text-center">
                      <Title level={4} className="mb-0">
                        {Math.ceil(
                          (new Date().getTime() -
                            new Date(cause.createdAt).getTime()) /
                            (1000 * 60 * 60 * 24),
                        )}
                      </Title>
                      <Text type="secondary">Days Active</Text>
                    </div>
                  </div>

                  <Space direction="vertical" className="w-full" size="middle">
                    <Button
                      type="primary"
                      size="large"
                      className="w-full h-12"
                      icon={<HeartOutlined />}
                      onClick={() => setDonateModalVisible(true)}
                    >
                      Donate Now
                    </Button>

                    <Button
                      size="large"
                      className="w-full"
                      icon={<ShareAltOutlined />}
                    >
                      Share Cause
                    </Button>
                  </Space>
                </Card>

                {/* Creator Card */}
                <Card title="Organizer" bordered={false}>
                  <div className="flex items-center space-x-4">
                    <Avatar
                      size={64}
                      src={cause.creator.avatar}
                      icon={!cause.creator.avatar && <UserOutlined />}
                    />
                    <div>
                      <Title level={5} className="mb-1">
                        {cause.creator.name}
                      </Title>
                      <Text type="secondary">Cause Organizer</Text>
                    </div>
                  </div>
                </Card>
              </div>
            </Col>
          </Row>
        </motion.div>
      </div>

      {/* Donation Modal */}
      <Modal
        title="Make a Donation"
        open={donateModalVisible}
        onCancel={() => setDonateModalVisible(false)}
        onOk={handleDonate}
        okText="Donate"
        okButtonProps={{
          size: "large",
          icon: <DollarOutlined />,
        }}
        cancelButtonProps={{ size: "large" }}
      >
        <div className="py-4">
          <div className="mb-4">
            <Text strong>Donation Amount</Text>
            <Input
              size="large"
              placeholder="Enter amount"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              prefix="$"
              className="mt-2"
              type="number"
            />
          </div>

          <div className="mb-4">
            <Text strong>Message (Optional)</Text>
            <TextArea
              placeholder="Add a personal message..."
              value={donationMessage}
              onChange={(e) => setDonationMessage(e.target.value)}
              rows={3}
              className="mt-2"
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <Text type="secondary" className="text-sm">
              Your donation will help provide essential food and support to
              homeless families in our community.
            </Text>
          </div>
        </div>
      </Modal>
    </div>
  );
}
