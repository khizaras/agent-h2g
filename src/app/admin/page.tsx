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
  HomeOutlined,
  MedicineBoxOutlined,
  BellOutlined,
  DollarOutlined,
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

    console.log("Session data:", session);
    console.log("User admin status:", (session?.user as any)?.is_admin);

    if (!session?.user) {
      router.push("/auth/signin");
      return;
    }

    // Check if user has admin flag
    if (!(session.user as any)?.is_admin) {
      console.log("User is not admin, redirecting...");
      router.push("/");
      return;
    }

    fetchAdminData();
  }, [session, status, router]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      // Fetch real data from API endpoints
      const [statsResponse, usersResponse, causesResponse, commentsResponse] =
        await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/admin/users?limit=50"),
          fetch("/api/admin/causes?limit=50"),
          fetch("/api/admin/comments?limit=50"),
        ]);

      // Handle stats
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        if (statsData.success) {
          setStats(statsData.data);
        }
      }

      // Handle users
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        if (usersData.success) {
          setUsers(usersData.data.users || []);
        }
      }

      // Handle causes
      if (causesResponse.ok) {
        const causesData = await causesResponse.json();
        if (causesData.success) {
          setCauses(causesData.data.causes || []);
        }
      }

      // Handle comments
      if (commentsResponse.ok) {
        const commentsData = await commentsResponse.json();
        if (commentsData.success) {
          setComments(commentsData.data.comments || []);
        }
      }
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

  const handleDeleteUser = async (userId: number) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        setUsers(users.filter((user) => user.id !== userId));
        message.success("User deleted successfully");
      } else {
        message.error(data.error || "Failed to delete user");
      }
    } catch (error) {
      message.error("Failed to delete user");
    }
  };

  const handleUserSubmit = async (values: any) => {
    try {
      if (selectedUser) {
        // Update user
        const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        const data = await response.json();
        if (data.success) {
          setUsers(
            users.map((user) =>
              user.id === selectedUser.id ? { ...user, ...values } : user,
            ),
          );
          message.success("User updated successfully");
        } else {
          message.error(data.error || "Failed to update user");
          return;
        }
      } else {
        // Create user
        const response = await fetch("/api/admin/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        const data = await response.json();
        if (data.success) {
          const newUser: AdminUser = {
            ...values,
            id: data.data.id,
            created_at: new Date().toISOString().split("T")[0],
            causesCreated: 0,
            totalRaised: 0,
            status: "active",
          };
          setUsers([...users, newUser]);
          message.success("User created successfully");
        } else {
          message.error(data.error || "Failed to create user");
          return;
        }
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

  const handleDeleteCause = async (causeId: number) => {
    try {
      const response = await fetch(`/api/admin/causes/${causeId}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        setCauses(causes.filter((cause) => cause.id !== causeId));
        message.success("Cause deleted successfully");
      } else {
        message.error(data.error || "Failed to delete cause");
      }
    } catch (error) {
      message.error("Failed to delete cause");
    }
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
    try {
      const response = await fetch(`/api/admin/causes/${causeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_featured: featured }),
      });

      const data = await response.json();
      if (data.success) {
        setCauses(
          causes.map((cause) =>
            cause.id === causeId ? { ...cause, is_featured: featured } : cause,
          ),
        );
        message.success(
          `Cause ${featured ? "featured" : "unfeatured"} successfully`,
        );
      } else {
        message.error(data.error || "Failed to update cause");
      }
    } catch (error) {
      message.error("Failed to update cause");
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      const response = await fetch(`/api/admin/comments/${commentId}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        setComments(comments.filter((comment) => comment.id !== commentId));
        message.success("Comment deleted successfully");
      } else {
        message.error(data.error || "Failed to delete comment");
      }
    } catch (error) {
      message.error("Failed to delete comment");
    }
  };

  const handleApproveComment = async (commentId: number) => {
    try {
      const response = await fetch(`/api/admin/comments/${commentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve" }),
      });

      const data = await response.json();
      if (data.success) {
        setComments(
          comments.map((comment) =>
            comment.id === commentId
              ? { ...comment, status: "approved" as const }
              : comment,
          ),
        );
        message.success("Comment approved successfully");
      } else {
        message.error(data.error || "Failed to approve comment");
      }
    } catch (error) {
      message.error("Failed to approve comment");
    }
  };

  const handleRejectComment = async (commentId: number) => {
    try {
      const response = await fetch(`/api/admin/comments/${commentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject" }),
      });

      const data = await response.json();
      if (data.success) {
        setComments(
          comments.map((comment) =>
            comment.id === commentId
              ? { ...comment, status: "rejected" as const }
              : comment,
          ),
        );
        message.success("Comment rejected successfully");
      } else {
        message.error(data.error || "Failed to reject comment");
      }
    } catch (error) {
      message.error("Failed to reject comment");
    }
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
      case "clothes":
        return <HeartOutlined />;
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

  if (!session?.user || !(session.user as any)?.is_admin) {
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
      <div style={{ display: "flex", minHeight: "100vh", background: "#fafbfc" }}>
        {/* Modern Dark Sidebar */}
        <div
          style={{
            width: "260px",
            position: "fixed",
            left: 0,
            top: 0,
            height: "100vh",
            background: "#1f2937",
            boxShadow: "4px 0 16px rgba(0,0,0,0.1)",
            zIndex: 1000,
            overflowY: "auto",
          }}
        >
        <div
          style={{
            padding: "24px 20px",
            textAlign: "center",
            borderBottom: "1px solid #f0f0f0",
            background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
            color: "white",
          }}
        >
          <Title level={4} style={{ margin: 0, color: "white" }}>
            <CrownOutlined /> Admin Dashboard
          </Title>
          <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px" }}>
            Hands2gether Management
          </Text>
        </div>
        <div style={{ padding: "20px 0" }}>
          {menuItems.map((item) => (
            <div
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              style={{
                padding: "12px 20px",
                margin: "4px 12px",
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                fontSize: "14px",
                fontWeight: "500",
                color: activeTab === item.key ? "#2563eb" : "#6b7280",
                backgroundColor:
                  activeTab === item.key ? "#eff6ff" : "transparent",
                transition: "all 0.2s ease",
                border:
                  activeTab === item.key
                    ? "1px solid #bfdbfe"
                    : "1px solid transparent",
              }}
              onMouseEnter={(e) => {
                if (activeTab !== item.key) {
                  e.currentTarget.style.backgroundColor = "#f8fafc";
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== item.key) {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              {item.icon}
              {item.label}
            </div>
          ))}
        </div>
      </div>

        {/* Main Content Area */}
        <div
          style={{
            marginLeft: "260px",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
        {/* Header */}
        <div
          style={{
            background: "#ffffff",
            padding: "16px 32px",
            borderBottom: "1px solid #e5e7eb",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            position: "sticky",
            top: 0,
            zIndex: 100,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <Title
                level={3}
                style={{
                  margin: 0,
                  fontSize: "20px",
                  fontWeight: "600",
                  color: "#111827",
                }}
              >
                {activeTab === "dashboard"
                  ? "Dashboard Overview"
                  : activeTab === "users"
                    ? "User Management"
                    : activeTab === "causes"
                      ? "Cause Management"
                      : activeTab === "comments"
                        ? "Comment Moderation"
                        : activeTab === "analytics"
                          ? "Analytics & Reports"
                          : "System Settings"}
              </Title>
              <Text style={{ color: "#6b7280", fontSize: "14px" }}>
                {activeTab === "dashboard" &&
                  "Monitor platform activity and key metrics"}
                {activeTab === "users" &&
                  "Manage user accounts and permissions"}
                {activeTab === "causes" &&
                  "Oversee cause listings and approvals"}
                {activeTab === "comments" &&
                  "Review and moderate user comments"}
                {activeTab === "analytics" &&
                  "View detailed analytics and insights"}
                {activeTab === "settings" && "Configure system settings"}
              </Text>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <Space>
                <Badge count={stats.pendingApprovals} size="small">
                  <Button icon={<BellOutlined />} type="text" />
                </Badge>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Avatar
                    src={session.user?.image}
                    icon={<UserOutlined />}
                    size="small"
                  />
                  <div style={{ textAlign: "left" }}>
                    <Text
                      style={{
                        fontSize: "13px",
                        fontWeight: "500",
                        color: "#111827",
                      }}
                    >
                      {session.user?.name}
                    </Text>
                    <br />
                    <Text style={{ fontSize: "11px", color: "#6b7280" }}>
                      Admin
                    </Text>
                  </div>
                </div>
              </Space>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div style={{ padding: "24px 32px", flex: 1, overflowY: "auto" }}>
          {activeTab === "dashboard" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Enhanced Stats Cards */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "20px",
                  marginBottom: "32px",
                }}
              >
                <Card
                  style={{
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  <div style={{ padding: "20px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "16px",
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: "#eff6ff",
                          padding: "12px",
                          borderRadius: "10px",
                        }}
                      >
                        <TeamOutlined
                          style={{ color: "#2563eb", fontSize: "24px" }}
                        />
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <Text style={{ fontSize: "12px", color: "#10b981" }}>
                          <RiseOutlined /> +{stats.monthlyGrowth}%
                        </Text>
                      </div>
                    </div>
                    <div style={{ marginBottom: "8px" }}>
                      <Text
                        style={{
                          fontSize: "32px",
                          fontWeight: "700",
                          color: "#111827",
                        }}
                      >
                        {stats.totalUsers.toLocaleString()}
                      </Text>
                    </div>
                    <Text style={{ color: "#6b7280", fontSize: "14px" }}>
                      Total Users
                    </Text>
                    <div
                      style={{
                        marginTop: "12px",
                        padding: "8px 0",
                        borderTop: "1px solid #f3f4f6",
                      }}
                    >
                      <Text style={{ fontSize: "12px", color: "#6b7280" }}>
                        {stats.monthlyGrowth}% growth this month
                      </Text>
                    </div>
                  </div>
                </Card>
                <Card
                  style={{
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  <div style={{ padding: "20px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "16px",
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: "#f0fdf4",
                          padding: "12px",
                          borderRadius: "10px",
                        }}
                      >
                        <HeartOutlined
                          style={{ color: "#16a34a", fontSize: "24px" }}
                        />
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <Text style={{ fontSize: "12px", color: "#16a34a" }}>
                          {stats.activeCauses} active
                        </Text>
                      </div>
                    </div>
                    <div style={{ marginBottom: "8px" }}>
                      <Text
                        style={{
                          fontSize: "32px",
                          fontWeight: "700",
                          color: "#111827",
                        }}
                      >
                        {stats.totalCauses.toLocaleString()}
                      </Text>
                    </div>
                    <Text style={{ color: "#6b7280", fontSize: "14px" }}>
                      Total Causes
                    </Text>
                    <div
                      style={{
                        marginTop: "12px",
                        padding: "8px 0",
                        borderTop: "1px solid #f3f4f6",
                      }}
                    >
                      <Progress
                        percent={Math.round(
                          (stats.activeCauses / stats.totalCauses) * 100,
                        )}
                        size="small"
                        strokeColor="#16a34a"
                        format={() =>
                          `${Math.round((stats.activeCauses / stats.totalCauses) * 100)}% active`
                        }
                      />
                    </div>
                  </div>
                </Card>
                <Card
                  style={{
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  <div style={{ padding: "20px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "16px",
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: "#fdf4ff",
                          padding: "12px",
                          borderRadius: "10px",
                        }}
                      >
                        <MessageOutlined
                          style={{ color: "#a855f7", fontSize: "24px" }}
                        />
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <Badge
                          count={stats.pendingApprovals}
                          style={{ backgroundColor: "#f59e0b" }}
                        />
                      </div>
                    </div>
                    <div style={{ marginBottom: "8px" }}>
                      <Text
                        style={{
                          fontSize: "32px",
                          fontWeight: "700",
                          color: "#111827",
                        }}
                      >
                        {stats.totalComments.toLocaleString()}
                      </Text>
                    </div>
                    <Text style={{ color: "#6b7280", fontSize: "14px" }}>
                      Total Comments
                    </Text>
                    <div
                      style={{
                        marginTop: "12px",
                        padding: "8px 0",
                        borderTop: "1px solid #f3f4f6",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: "12px",
                          color:
                            stats.pendingApprovals > 0 ? "#f59e0b" : "#6b7280",
                        }}
                      >
                        {stats.pendingApprovals} pending approval
                      </Text>
                    </div>
                  </div>
                </Card>
                <Card
                  style={{
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  <div style={{ padding: "20px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "16px",
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: "#fff7ed",
                          padding: "12px",
                          borderRadius: "10px",
                        }}
                      >
                        <DollarOutlined
                          style={{ color: "#ea580c", fontSize: "24px" }}
                        />
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <Text style={{ fontSize: "12px", color: "#ea580c" }}>
                          <TrophyOutlined /> Top Impact
                        </Text>
                      </div>
                    </div>
                    <div style={{ marginBottom: "8px" }}>
                      <Text
                        style={{
                          fontSize: "32px",
                          fontWeight: "700",
                          color: "#111827",
                        }}
                      >
                        ${stats.totalDonations.toLocaleString()}
                      </Text>
                    </div>
                    <Text style={{ color: "#6b7280", fontSize: "14px" }}>
                      Total Donations
                    </Text>
                    <div
                      style={{
                        marginTop: "12px",
                        padding: "8px 0",
                        borderTop: "1px solid #f3f4f6",
                      }}
                    >
                      <Text style={{ fontSize: "12px", color: "#6b7280" }}>
                        Avg: $
                        {Math.round(
                          stats.totalDonations / Math.max(stats.totalCauses, 1),
                        ).toLocaleString()}{" "}
                        per cause
                      </Text>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Interactive Quick Actions */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "20px",
                  marginBottom: "32px",
                }}
              >
                <Card
                  style={{
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  hoverable
                  onClick={() => setActiveTab("users")}
                >
                  <div style={{ textAlign: "center", padding: "20px" }}>
                    <div
                      style={{
                        backgroundColor: "#eff6ff",
                        padding: "16px",
                        borderRadius: "12px",
                        display: "inline-block",
                        marginBottom: "16px",
                      }}
                    >
                      <UserOutlined
                        style={{ fontSize: "32px", color: "#2563eb" }}
                      />
                    </div>
                    <Title
                      level={4}
                      style={{ margin: "0 0 8px 0", color: "#111827" }}
                    >
                      Manage Users
                    </Title>
                    <Text style={{ color: "#6b7280", fontSize: "14px" }}>
                      Add, edit, or remove user accounts
                    </Text>
                  </div>
                </Card>

                <Card
                  style={{
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  hoverable
                  onClick={() => setActiveTab("causes")}
                >
                  <div style={{ textAlign: "center", padding: "20px" }}>
                    <div
                      style={{
                        backgroundColor: "#f0fdf4",
                        padding: "16px",
                        borderRadius: "12px",
                        display: "inline-block",
                        marginBottom: "16px",
                      }}
                    >
                      <HeartOutlined
                        style={{ fontSize: "32px", color: "#16a34a" }}
                      />
                    </div>
                    <Title
                      level={4}
                      style={{ margin: "0 0 8px 0", color: "#111827" }}
                    >
                      Manage Causes
                    </Title>
                    <Text style={{ color: "#6b7280", fontSize: "14px" }}>
                      Review and moderate cause listings
                    </Text>
                  </div>
                </Card>

                <Card
                  style={{
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  hoverable
                  onClick={() => setActiveTab("comments")}
                >
                  <div style={{ textAlign: "center", padding: "20px" }}>
                    <div
                      style={{
                        backgroundColor: "#fdf4ff",
                        padding: "16px",
                        borderRadius: "12px",
                        display: "inline-block",
                        marginBottom: "16px",
                      }}
                    >
                      <MessageOutlined
                        style={{ fontSize: "32px", color: "#a855f7" }}
                      />
                    </div>
                    <Title
                      level={4}
                      style={{ margin: "0 0 8px 0", color: "#111827" }}
                    >
                      Moderate Comments
                    </Title>
                    <Text style={{ color: "#6b7280", fontSize: "14px" }}>
                      Review flagged content and comments
                    </Text>
                  </div>
                </Card>
              </div>

              {/* Recent Activity Dashboard */}
              <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                  <Card
                    title="Recent Users"
                    extra={
                      <Button type="link" onClick={() => setActiveTab("users")}>
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
                              <WarningOutlined /> {record.reports_count} reports
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
        </div>
      </div>

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
              <Button onClick={() => setUserModalVisible(false)}>Cancel</Button>
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
                rules={[{ required: true, message: "Please enter the title" }]}
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
                rules={[{ required: true, message: "Please select category" }]}
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
                rules={[{ required: true, message: "Please select priority" }]}
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
      </div>
    </MainLayout>
  );
}
