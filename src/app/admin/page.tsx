"use client";

import React, { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Button,
  Tag,
  Avatar,
  Typography,
  Space,
  Input,
  Modal,
  Form,
  message,
  Switch,
  Divider,
  Progress,
  Alert,
  Select,
  DatePicker,
  Popconfirm,
  Badge,
  Tooltip,
} from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  HeartOutlined,
  MessageOutlined,
  BarChartOutlined,
  SettingOutlined,
  TeamOutlined,
  TrophyOutlined,
  StarOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  ExportOutlined,
  SafetyCertificateOutlined,
  CrownOutlined,
  RiseOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  BugOutlined,
  FireOutlined,
  GlobalOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  BookOutlined,
  ShirtOutlined,
  HomeOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import type { ColumnsType } from "antd/es/table";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

interface AdminStats {
  totalUsers: number;
  totalCauses: number;
  activeCauses: number;
  completedCauses: number;
  totalDonations: number;
  monthlyGrowth: number;
  totalComments: number;
  pendingApprovals: number;
}

interface AdminUser {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  is_admin: boolean;
  is_verified: boolean;
  created_at: string;
  last_login?: string;
  causesCreated: number;
  totalRaised: number;
  status: "active" | "inactive" | "banned";
  phone?: string;
}

interface AdminCause {
  id: number;
  title: string;
  category_name: string;
  status: "active" | "completed" | "paused" | "pending";
  priority: "low" | "medium" | "high" | "critical";
  creator_name: string;
  created_at: string;
  view_count: number;
  like_count: number;
  is_featured: boolean;
  goal_amount?: number;
  raised_amount?: number;
  location?: string;
}

interface AdminComment {
  id: number;
  content: string;
  user_name: string;
  user_avatar?: string;
  cause_title: string;
  cause_id: number;
  created_at: string;
  status: "approved" | "pending" | "rejected";
  is_flagged: boolean;
  reports_count: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalCauses: 0,
    activeCauses: 0,
    completedCauses: 0,
    totalDonations: 0,
    monthlyGrowth: 0,
    totalComments: 0,
    pendingApprovals: 0,
  });

  // Data states
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [causes, setCauses] = useState<AdminCause[]>([]);
  const [comments, setComments] = useState<AdminComment[]>([]);

  // UI states
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [causeModalVisible, setCauseModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [selectedCause, setSelectedCause] = useState<AdminCause | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [userForm] = Form.useForm();
  const [causeForm] = Form.useForm();

  // Check admin access
  useEffect(() => {
    if (status === "loading") return;
    if (!session || !(session.user as any)?.is_admin) {
      router.push("/");
      return;
    }
    fetchAdminData();
  }, [session, status, router]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      // Mock data - replace with real API calls
      setStats({
        totalUsers: 1567,
        totalCauses: 234,
        activeCauses: 189,
        completedCauses: 45,
        totalDonations: 125600,
        monthlyGrowth: 15.2,
        totalComments: 892,
        pendingApprovals: 12,
      });

      // Mock users data
      const mockUsers: AdminUser[] = [
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
          is_admin: false,
          is_verified: true,
          created_at: "2024-01-15",
          last_login: "2024-01-25",
          causesCreated: 3,
          totalRaised: 5600,
          status: "active",
          phone: "+1234567890",
        },
        {
          id: 2,
          name: "Sarah Johnson",
          email: "sarah@example.com",
          avatar:
            "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face",
          is_admin: false,
          is_verified: true,
          created_at: "2024-01-10",
          last_login: "2024-01-24",
          causesCreated: 5,
          totalRaised: 12400,
          status: "active",
        },
        {
          id: 3,
          name: "Mike Chen",
          email: "mike@example.com",
          is_admin: true,
          is_verified: true,
          created_at: "2024-01-05",
          last_login: "2024-01-26",
          causesCreated: 8,
          totalRaised: 25000,
          status: "active",
        },
      ];
      setUsers(mockUsers);

      // Mock causes data
      const mockCauses: AdminCause[] = [
        {
          id: 1,
          title: "Emergency Food Relief",
          category_name: "food",
          status: "active",
          priority: "high",
          creator_name: "John Doe",
          created_at: "2024-01-20",
          view_count: 245,
          like_count: 34,
          is_featured: true,
          goal_amount: 10000,
          raised_amount: 7500,
          location: "New York, NY",
        },
        {
          id: 2,
          title: "Winter Clothing Drive",
          category_name: "clothes",
          status: "active",
          priority: "medium",
          creator_name: "Sarah Johnson",
          created_at: "2024-01-18",
          view_count: 189,
          like_count: 28,
          is_featured: false,
          goal_amount: 5000,
          raised_amount: 3200,
          location: "Boston, MA",
        },
        {
          id: 3,
          title: "Computer Skills Training",
          category_name: "education",
          status: "completed",
          priority: "low",
          creator_name: "Mike Chen",
          created_at: "2024-01-10",
          view_count: 156,
          like_count: 45,
          is_featured: false,
          location: "Online",
        },
      ];
      setCauses(mockCauses);

      // Mock comments data
      const mockComments: AdminComment[] = [
        {
          id: 1,
          content: "This is a great initiative! Happy to support.",
          user_name: "Alice Smith",
          user_avatar:
            "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=40&h=40&fit=crop&crop=face",
          cause_title: "Emergency Food Relief",
          cause_id: 1,
          created_at: "2024-01-22",
          status: "approved",
          is_flagged: false,
          reports_count: 0,
        },
        {
          id: 2,
          content: "Inappropriate content that needs review...",
          user_name: "Bob Wilson",
          cause_title: "Winter Clothing Drive",
          cause_id: 2,
          created_at: "2024-01-21",
          status: "pending",
          is_flagged: true,
          reports_count: 3,
        },
      ];
      setComments(mockComments);
    } catch (error) {
      console.error("Error fetching admin data:", error);
      message.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    userForm.resetFields();
    setUserModalVisible(true);
  };

  const handleEditUser = (user: AdminUser) => {
    setSelectedUser(user);
    userForm.setFieldsValue(user);
    setUserModalVisible(true);
  };

  const handleDeleteUser = (userId: number) => {
    setUsers(users.filter((user) => user.id !== userId));
    message.success("User deleted successfully");
  };

  const handleUserSubmit = async (values: any) => {
    try {
      if (selectedUser) {
        // Update user
        setUsers(
          users.map((user) =>
            user.id === selectedUser.id ? { ...user, ...values } : user,
          ),
        );
        message.success("User updated successfully");
      } else {
        // Create user
        const newUser: AdminUser = {
          ...values,
          id: Math.max(...users.map((u) => u.id)) + 1,
          created_at: new Date().toISOString().split("T")[0],
          causesCreated: 0,
          totalRaised: 0,
          status: "active",
        };
        setUsers([...users, newUser]);
        message.success("User created successfully");
      }
      setUserModalVisible(false);
      userForm.resetFields();
    } catch (error) {
      message.error("Failed to save user");
    }
  };

  const handleCreateCause = () => {
    setSelectedCause(null);
    causeForm.resetFields();
    setCauseModalVisible(true);
  };

  const handleEditCause = (cause: AdminCause) => {
    setSelectedCause(cause);
    causeForm.setFieldsValue(cause);
    setCauseModalVisible(true);
  };

  const handleDeleteCause = (causeId: number) => {
    setCauses(causes.filter((cause) => cause.id !== causeId));
    message.success("Cause deleted successfully");
  };

  const handleCauseSubmit = async (values: any) => {
    try {
      if (selectedCause) {
        // Update cause
        setCauses(
          causes.map((cause) =>
            cause.id === selectedCause.id ? { ...cause, ...values } : cause,
          ),
        );
        message.success("Cause updated successfully");
      } else {
        // Create cause
        const newCause: AdminCause = {
          ...values,
          id: Math.max(...causes.map((c) => c.id)) + 1,
          created_at: new Date().toISOString().split("T")[0],
          view_count: 0,
          like_count: 0,
          is_featured: false,
        };
        setCauses([...causes, newCause]);
        message.success("Cause created successfully");
      }
      setCauseModalVisible(false);
      causeForm.resetFields();
    } catch (error) {
      message.error("Failed to save cause");
    }
  };

  const handleFeatureCause = async (causeId: number, featured: boolean) => {
    setCauses(
      causes.map((cause) =>
        cause.id === causeId ? { ...cause, is_featured: featured } : cause,
      ),
    );
    message.success(
      `Cause ${featured ? "featured" : "unfeatured"} successfully`,
    );
  };

  const handleDeleteComment = (commentId: number) => {
    setComments(comments.filter((comment) => comment.id !== commentId));
    message.success("Comment deleted successfully");
  };

  const handleApproveComment = (commentId: number) => {
    setComments(
      comments.map((comment) =>
        comment.id === commentId
          ? { ...comment, status: "approved" as const }
          : comment,
      ),
    );
    message.success("Comment approved successfully");
  };

  const handleRejectComment = (commentId: number) => {
    setComments(
      comments.map((comment) =>
        comment.id === commentId
          ? { ...comment, status: "rejected" as const }
          : comment,
      ),
    );
    message.success("Comment rejected successfully");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "green";
      case "completed":
        return "blue";
      case "paused":
        return "orange";
      case "pending":
        return "gold";
      case "inactive":
        return "default";
      case "banned":
        return "red";
      case "approved":
        return "green";
      case "rejected":
        return "red";
      default:
        return "default";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "#f5222d";
      case "high":
        return "#fa8c16";
      case "medium":
        return "#faad14";
      case "low":
        return "#52c41a";
      default:
        return "#d9d9d9";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "food":
        return <BookOutlined />;
      case "clothes":
        return <ShirtOutlined />;
      case "education":
        return <BookOutlined />;
      case "healthcare":
        return <MedicineBoxOutlined />;
      case "housing":
        return <HomeOutlined />;
      default:
        return <HeartOutlined />;
    }
  };

  // Filter data based on search
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredCauses = causes.filter(
    (cause) =>
      cause.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cause.category_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cause.status.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredComments = comments.filter(
    (comment) =>
      comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.cause_title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const userColumns: ColumnsType<AdminUser> = [
    {
      title: "User",
      key: "user",
      render: (record: AdminUser) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Avatar src={record.avatar} icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 600 }}>{record.name}</div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              {record.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (record: AdminUser) => (
        <Space direction="vertical" size="small">
          <Tag color={getStatusColor(record.status)}>
            {record.status.toUpperCase()}
          </Tag>
          {record.is_admin && (
            <Tag color="red" icon={<CrownOutlined />}>
              Admin
            </Tag>
          )}
          {record.is_verified && (
            <Tag color="green" icon={<SafetyCertificateOutlined />}>
              Verified
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: "Stats",
      key: "stats",
      render: (record: AdminUser) => (
        <div>
          <div style={{ fontSize: "12px" }}>Causes: {record.causesCreated}</div>
          <div style={{ fontSize: "12px" }}>
            Raised: ${record.totalRaised.toLocaleString()}
          </div>
        </div>
      ),
    },
    {
      title: "Joined",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: AdminUser) => (
        <Space>
          <Tooltip title="View Profile">
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() => router.push(`/profile/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Edit User">
            <Button
              icon={<EditOutlined />}
              size="small"
              type="primary"
              onClick={() => handleEditUser(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => handleDeleteUser(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete User">
              <Button icon={<DeleteOutlined />} size="small" danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const causeColumns: ColumnsType<AdminCause> = [
    {
      title: "Cause",
      key: "cause",
      render: (record: AdminCause) => (
        <div>
          <div
            style={{
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {getCategoryIcon(record.category_name)}
            {record.title}
          </div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            by {record.creator_name}
          </div>
          {record.location && (
            <div style={{ fontSize: "12px", color: "#666" }}>
              📍 {record.location}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category_name",
      key: "category_name",
      render: (category: string) => (
        <Tag color="blue" icon={getCategoryIcon(category)}>
          {category.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (priority: string) => (
        <Tag
          style={{
            backgroundColor: getPriorityColor(priority),
            color: "white",
            border: "none",
          }}
        >
          {priority?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Progress",
      key: "progress",
      render: (record: AdminCause) => {
        if (!record.goal_amount) return <span>—</span>;
        const percentage = Math.round(
          ((record.raised_amount || 0) / record.goal_amount) * 100,
        );
        return (
          <div>
            <Progress percent={percentage} size="small" />
            <div style={{ fontSize: "12px" }}>
              ${record.raised_amount?.toLocaleString() || 0} / $
              {record.goal_amount.toLocaleString()}
            </div>
          </div>
        );
      },
    },
    {
      title: "Engagement",
      key: "engagement",
      render: (record: AdminCause) => (
        <div>
          <div style={{ fontSize: "12px" }}>👁 {record.view_count}</div>
          <div style={{ fontSize: "12px" }}>❤️ {record.like_count}</div>
        </div>
      ),
    },
    {
      title: "Featured",
      dataIndex: "is_featured",
      key: "is_featured",
      render: (featured: boolean, record: AdminCause) => (
        <Switch
          checked={featured}
          onChange={(checked) => handleFeatureCause(record.id, checked)}
          checkedChildren="Yes"
          unCheckedChildren="No"
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: AdminCause) => (
        <Space>
          <Tooltip title="View Cause">
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() => router.push(`/causes/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Edit Cause">
            <Button
              icon={<EditOutlined />}
              size="small"
              type="primary"
              onClick={() => handleEditCause(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this cause?"
            onConfirm={() => handleDeleteCause(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete Cause">
              <Button icon={<DeleteOutlined />} size="small" danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const commentColumns: ColumnsType<AdminComment> = [
    {
      title: "Comment",
      key: "comment",
      render: (record: AdminComment) => (
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "4px",
            }}
          >
            <Avatar
              src={record.user_avatar}
              icon={<UserOutlined />}
              size="small"
            />
            <span style={{ fontWeight: 600 }}>{record.user_name}</span>
            {record.is_flagged && (
              <Tag color="red" icon={<WarningOutlined />}>
                Flagged
              </Tag>
            )}
          </div>
          <div style={{ marginBottom: "4px" }}>{record.content}</div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            on "{record.cause_title}"
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: "Reports",
      dataIndex: "reports_count",
      key: "reports_count",
      render: (count: number) => (
        <Badge
          count={count}
          showZero
          style={{ backgroundColor: count > 0 ? "#f5222d" : "#d9d9d9" }}
        />
      ),
    },
    {
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: AdminComment) => (
        <Space>
          {record.status === "pending" && (
            <>
              <Tooltip title="Approve Comment">
                <Button
                  icon={<CheckCircleOutlined />}
                  size="small"
                  type="primary"
                  onClick={() => handleApproveComment(record.id)}
                />
              </Tooltip>
              <Tooltip title="Reject Comment">
                <Button
                  icon={<ClockCircleOutlined />}
                  size="small"
                  onClick={() => handleRejectComment(record.id)}
                />
              </Tooltip>
            </>
          )}
          <Tooltip title="View Cause">
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() => router.push(`/causes/${record.cause_id}`)}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this comment?"
            onConfirm={() => handleDeleteComment(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete Comment">
              <Button icon={<DeleteOutlined />} size="small" danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (loading || status === "loading") {
    return (
      <MainLayout>
        <div style={{ padding: "50px", textAlign: "center" }}>
          <Title level={3}>Loading admin dashboard...</Title>
        </div>
      </MainLayout>
    );
  }

  if (!session || !(session.user as any)?.is_admin) {
    return (
      <MainLayout>
        <div style={{ padding: "50px", textAlign: "center" }}>
          <Alert
            message="Access Denied"
            description="You don't have permission to access the admin dashboard."
            type="error"
            showIcon
          />
        </div>
      </MainLayout>
    );
  }

  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "users",
      icon: <UserOutlined />,
      label: "Manage Users",
    },
    {
      key: "causes",
      icon: <HeartOutlined />,
      label: "Manage Causes",
    },
    {
      key: "comments",
      icon: <MessageOutlined />,
      label: "Manage Comments",
    },
    {
      key: "analytics",
      icon: <BarChartOutlined />,
      label: "Analytics",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Settings",
    },
  ];

  return (
    <MainLayout>
      <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
        <Sider
          width={250}
          style={{ background: "#fff", boxShadow: "2px 0 8px rgba(0,0,0,0.1)" }}
        >
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <Title level={4} style={{ margin: 0, color: "#1890ff" }}>
              <CrownOutlined /> Admin Panel
            </Title>
          </div>
          <Menu
            mode="inline"
            selectedKeys={[activeTab]}
            items={menuItems}
            onClick={({ key }) => setActiveTab(key)}
            style={{ border: "none", paddingTop: "20px" }}
          />
        </Sider>

        <Layout>
          <Header
            style={{
              background: "#fff",
              padding: "0 24px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Title
                level={3}
                style={{ margin: 0, textTransform: "capitalize" }}
              >
                {activeTab === "dashboard"
                  ? "Dashboard"
                  : activeTab === "users"
                    ? "Manage Users"
                    : activeTab === "causes"
                      ? "Manage Causes"
                      : activeTab === "comments"
                        ? "Manage Comments"
                        : activeTab}
              </Title>
              <div
                style={{ display: "flex", alignItems: "center", gap: "16px" }}
              >
                <Badge count={stats.pendingApprovals} offset={[-5, 5]}>
                  <Avatar src={session.user?.image} icon={<UserOutlined />} />
                </Badge>
                <span>Welcome, {session.user?.name}</span>
              </div>
            </div>
          </Header>

          <Content style={{ padding: "24px" }}>
            {activeTab === "dashboard" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Stats Cards */}
                <Row gutter={[24, 24]} style={{ marginBottom: "32px" }}>
                  <Col xs={24} sm={12} lg={6}>
                    <Card>
                      <Statistic
                        title="Total Users"
                        value={stats.totalUsers}
                        prefix={<TeamOutlined style={{ color: "#1890ff" }} />}
                        valueStyle={{ color: "#1890ff" }}
                      />
                      <div
                        style={{
                          marginTop: "8px",
                          fontSize: "12px",
                          color: "#666",
                        }}
                      >
                        <RiseOutlined /> +{stats.monthlyGrowth}% this month
                      </div>
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} lg={6}>
                    <Card>
                      <Statistic
                        title="Total Causes"
                        value={stats.totalCauses}
                        prefix={<HeartOutlined style={{ color: "#52c41a" }} />}
                        valueStyle={{ color: "#52c41a" }}
                      />
                      <div style={{ marginTop: "8px" }}>
                        <Progress
                          percent={Math.round(
                            (stats.activeCauses / stats.totalCauses) * 100,
                          )}
                          size="small"
                          format={() => `${stats.activeCauses} active`}
                        />
                      </div>
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} lg={6}>
                    <Card>
                      <Statistic
                        title="Total Comments"
                        value={stats.totalComments}
                        prefix={
                          <MessageOutlined style={{ color: "#722ed1" }} />
                        }
                        valueStyle={{ color: "#722ed1" }}
                      />
                      <div
                        style={{
                          marginTop: "8px",
                          fontSize: "12px",
                          color: "#666",
                        }}
                      >
                        {stats.pendingApprovals} pending approval
                      </div>
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} lg={6}>
                    <Card>
                      <Statistic
                        title="Total Donations"
                        value={stats.totalDonations}
                        prefix="$"
                        valueStyle={{ color: "#fa8c16" }}
                      />
                      <div
                        style={{
                          marginTop: "8px",
                          fontSize: "12px",
                          color: "#666",
                        }}
                      >
                        Average: $
                        {Math.round(stats.totalDonations / stats.totalCauses)}
                      </div>
                    </Card>
                  </Col>
                </Row>

                {/* Recent Activity */}
                <Row gutter={[24, 24]}>
                  <Col xs={24} lg={12}>
                    <Card
                      title="Recent Users"
                      extra={
                        <Button
                          type="link"
                          onClick={() => setActiveTab("users")}
                        >
                          View All
                        </Button>
                      }
                    >
                      <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                        {users.slice(0, 5).map((user) => (
                          <div
                            key={user.id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              padding: "8px 0",
                              borderBottom: "1px solid #f0f0f0",
                            }}
                          >
                            <Avatar src={user.avatar} icon={<UserOutlined />} />
                            <div style={{ marginLeft: "12px", flex: 1 }}>
                              <div style={{ fontWeight: 600 }}>{user.name}</div>
                              <div style={{ fontSize: "12px", color: "#666" }}>
                                Joined{" "}
                                {new Date(user.created_at).toLocaleDateString()}
                              </div>
                            </div>
                            {user.is_verified && (
                              <SafetyCertificateOutlined
                                style={{ color: "#52c41a" }}
                              />
                            )}
                            {user.is_admin && (
                              <CrownOutlined
                                style={{ color: "#faad14", marginLeft: "4px" }}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </Card>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Card
                      title="Recent Causes"
                      extra={
                        <Button
                          type="link"
                          onClick={() => setActiveTab("causes")}
                        >
                          View All
                        </Button>
                      }
                    >
                      <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                        {causes.slice(0, 5).map((cause) => (
                          <div
                            key={cause.id}
                            style={{
                              padding: "8px 0",
                              borderBottom: "1px solid #f0f0f0",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "start",
                              }}
                            >
                              <div style={{ flex: 1 }}>
                                <div
                                  style={{
                                    fontWeight: 600,
                                    marginBottom: "4px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                  }}
                                >
                                  {getCategoryIcon(cause.category_name)}
                                  {cause.title}
                                </div>
                                <div
                                  style={{
                                    fontSize: "12px",
                                    color: "#666",
                                    marginBottom: "4px",
                                  }}
                                >
                                  by {cause.creator_name} •{" "}
                                  {new Date(
                                    cause.created_at,
                                  ).toLocaleDateString()}
                                </div>
                                <Space>
                                  <Tag color={getStatusColor(cause.status)}>
                                    {cause.status}
                                  </Tag>
                                  {cause.is_featured && (
                                    <Tag color="gold" icon={<StarOutlined />}>
                                      Featured
                                    </Tag>
                                  )}
                                </Space>
                              </div>
                              <div
                                style={{
                                  textAlign: "right",
                                  fontSize: "12px",
                                  color: "#666",
                                }}
                              >
                                <div>👁 {cause.view_count}</div>
                                <div>❤️ {cause.like_count}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </Col>
                </Row>
              </motion.div>
            )}

            {activeTab === "users" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card
                  title="User Management"
                  extra={
                    <Space>
                      <Search
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: 200 }}
                      />
                      <Button icon={<FilterOutlined />}>Filter</Button>
                      <Button icon={<ExportOutlined />}>Export</Button>
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreateUser}
                      >
                        Add User
                      </Button>
                    </Space>
                  }
                >
                  <Table
                    columns={userColumns}
                    dataSource={filteredUsers}
                    rowKey="id"
                    pagination={{ pageSize: 10, showSizeChanger: true }}
                  />
                </Card>
              </motion.div>
            )}

            {activeTab === "causes" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card
                  title="Cause Management"
                  extra={
                    <Space>
                      <Search
                        placeholder="Search causes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: 200 }}
                      />
                      <Button icon={<FilterOutlined />}>Filter</Button>
                      <Button icon={<ExportOutlined />}>Export</Button>
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreateCause}
                      >
                        Add Cause
                      </Button>
                    </Space>
                  }
                >
                  <Table
                    columns={causeColumns}
                    dataSource={filteredCauses}
                    rowKey="id"
                    pagination={{ pageSize: 10, showSizeChanger: true }}
                  />
                </Card>
              </motion.div>
            )}

            {activeTab === "comments" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card
                  title="Comment Management"
                  extra={
                    <Space>
                      <Search
                        placeholder="Search comments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: 200 }}
                      />
                      <Button icon={<FilterOutlined />}>Filter</Button>
                      <Button icon={<ExportOutlined />}>Export</Button>
                    </Space>
                  }
                >
                  <Table
                    columns={commentColumns}
                    dataSource={filteredComments}
                    rowKey="id"
                    pagination={{ pageSize: 10, showSizeChanger: true }}
                    expandable={{
                      expandedRowRender: (record) => (
                        <div
                          style={{
                            margin: 0,
                            padding: "16px",
                            background: "#fafafa",
                          }}
                        >
                          <strong>Full Comment:</strong>
                          <p style={{ marginTop: "8px", marginBottom: 0 }}>
                            {record.content}
                          </p>
                          {record.reports_count > 0 && (
                            <div style={{ marginTop: "8px" }}>
                              <Tag color="red">
                                <WarningOutlined /> {record.reports_count}{" "}
                                reports
                              </Tag>
                            </div>
                          )}
                        </div>
                      ),
                    }}
                  />
                </Card>
              </motion.div>
            )}

            {activeTab === "analytics" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Alert
                  message="Analytics Dashboard"
                  description="Advanced analytics and reporting features will be implemented here."
                  type="info"
                  showIcon
                />
              </motion.div>
            )}

            {activeTab === "settings" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Alert
                  message="System Settings"
                  description="System configuration and settings will be implemented here."
                  type="info"
                  showIcon
                />
              </motion.div>
            )}
          </Content>
        </Layout>

        {/* User Modal */}
        <Modal
          title={selectedUser ? "Edit User" : "Create User"}
          open={userModalVisible}
          onCancel={() => setUserModalVisible(false)}
          footer={null}
          width={600}
        >
          <Form form={userForm} layout="vertical" onFinish={handleUserSubmit}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Full Name"
                  rules={[{ required: true, message: "Please enter the name" }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: "Please enter the email" },
                    { type: "email", message: "Please enter a valid email" },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="phone" label="Phone Number">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="status"
                  label="Status"
                  rules={[{ required: true, message: "Please select status" }]}
                >
                  <Select>
                    <Option value="active">Active</Option>
                    <Option value="inactive">Inactive</Option>
                    <Option value="banned">Banned</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="is_admin"
                  label="Admin Status"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="Admin" unCheckedChildren="User" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="is_verified"
                  label="Verification Status"
                  valuePropName="checked"
                >
                  <Switch
                    checkedChildren="Verified"
                    unCheckedChildren="Unverified"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Divider />

            <div style={{ textAlign: "right" }}>
              <Space>
                <Button onClick={() => setUserModalVisible(false)}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  {selectedUser ? "Update User" : "Create User"}
                </Button>
              </Space>
            </div>
          </Form>
        </Modal>

        {/* Cause Modal */}
        <Modal
          title={selectedCause ? "Edit Cause" : "Create Cause"}
          open={causeModalVisible}
          onCancel={() => setCauseModalVisible(false)}
          footer={null}
          width={800}
        >
          <Form form={causeForm} layout="vertical" onFinish={handleCauseSubmit}>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="title"
                  label="Title"
                  rules={[
                    { required: true, message: "Please enter the title" },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="category_name"
                  label="Category"
                  rules={[
                    { required: true, message: "Please select category" },
                  ]}
                >
                  <Select>
                    <Option value="food">Food</Option>
                    <Option value="clothes">Clothes</Option>
                    <Option value="education">Education</Option>
                    <Option value="healthcare">Healthcare</Option>
                    <Option value="housing">Housing</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="status"
                  label="Status"
                  rules={[{ required: true, message: "Please select status" }]}
                >
                  <Select>
                    <Option value="active">Active</Option>
                    <Option value="paused">Paused</Option>
                    <Option value="completed">Completed</Option>
                    <Option value="pending">Pending</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="priority"
                  label="Priority"
                  rules={[
                    { required: true, message: "Please select priority" },
                  ]}
                >
                  <Select>
                    <Option value="low">Low</Option>
                    <Option value="medium">Medium</Option>
                    <Option value="high">High</Option>
                    <Option value="critical">Critical</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="location" label="Location">
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="goal_amount" label="Goal Amount ($)">
                  <Input type="number" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="creator_name"
                  label="Creator Name"
                  rules={[
                    { required: true, message: "Please enter creator name" },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Divider />

            <div style={{ textAlign: "right" }}>
              <Space>
                <Button onClick={() => setCauseModalVisible(false)}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  {selectedCause ? "Update Cause" : "Create Cause"}
                </Button>
              </Space>
            </div>
          </Form>
        </Modal>
      </Layout>
    </MainLayout>
  );
}
