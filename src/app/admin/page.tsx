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
  Dropdown,
  Empty,
  theme,
  Breadcrumb,
  Result,
} from "antd";
import {
  UserOutlined,
  HeartOutlined,
  MessageOutlined,
  TeamOutlined,
  DollarOutlined,
  RiseOutlined,
  WarningOutlined,
  TrophyOutlined,
  BellOutlined,
  SafetyCertificateOutlined,
  CrownOutlined,
  StarOutlined,
  FilterOutlined,
  ExportOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  DashboardOutlined,
  BarChartOutlined,
  SettingOutlined,
  BookOutlined,
  MedicineBoxOutlined,
  HomeOutlined,
  ClockCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
  const [collapsed, setCollapsed] = useState(false);
  const { token } = theme.useToken();
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
  const [enrollments, setEnrollments] = useState<any[]>([]);

  // UI states
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [causeModalVisible, setCauseModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [selectedCause, setSelectedCause] = useState<AdminCause | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [userForm] = Form.useForm();
  const [causeForm] = Form.useForm();

  // Table columns and filtered data will be defined below with proper TypeScript types

  const enrollmentColumns = [
    {
      title: 'Student',
      dataIndex: 'user_name',
      key: 'user_name',
    },
    {
      title: 'Course',
      dataIndex: 'cause_title',
      key: 'cause_title',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors: Record<string, string> = {
          pending: 'orange',
          accepted: 'green',
          rejected: 'red',
          completed: 'blue',
          cancelled: 'gray'
        };
        return (
          <Tag color={colors[status] || 'default'}>
            {status ? status.toUpperCase() : 'UNKNOWN'}
          </Tag>
        );
      },
    },
    {
      title: 'Enrolled',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Training Type',
      dataIndex: 'training_type',
      key: 'training_type',
    },
  ];


  // Filtered data
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCauses = causes.filter(cause => 
    cause.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredComments = comments.filter(comment => 
    comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comment.user_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredEnrollments = enrollments.filter(enrollment => 
    enrollment.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.cause_title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      // Add timeout to fetch requests
      const fetchWithTimeout = (url: string, timeout = 5000) => {
        return Promise.race([
          fetch(url),
          new Promise<Response>((_, reject) =>
            setTimeout(() => reject(new Error('Request timeout')), timeout)
          )
        ]);
      };

      // Fetch real data from API endpoints with timeout
      const requests = [
        fetchWithTimeout("/api/admin/stats").catch(e => ({ ok: false, error: e.message })),
        fetchWithTimeout("/api/admin/users?limit=50").catch(e => ({ ok: false, error: e.message })),
        fetchWithTimeout("/api/admin/causes?limit=50").catch(e => ({ ok: false, error: e.message })),
        fetchWithTimeout("/api/admin/comments?limit=50").catch(e => ({ ok: false, error: e.message })),
        fetchWithTimeout("/api/admin/enrollments?limit=50").catch(e => ({ ok: false, error: e.message })),
      ];

      const [statsResponse, usersResponse, causesResponse, commentsResponse, enrollmentsResponse] =
        await Promise.all(requests);

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

      // Handle enrollments
      if (enrollmentsResponse.ok) {
        const enrollmentsData = await enrollmentsResponse.json();
        if (enrollmentsData.success) {
          setEnrollments(enrollmentsData.data.enrollments || []);
        }
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
      message.warning("Database connection issue. Showing offline mode.");
      
      // Set fallback data for offline mode
      setStats({
        totalUsers: 0,
        totalCauses: 0,
        totalEnrollments: 0,
        totalComments: 0,
        pendingApprovals: 0
      });
      setUsers([]);
      setCauses([]);
      setComments([]);
      setEnrollments([]);
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
        return <HeartOutlined />;
      case "healthcare":
        return <MedicineBoxOutlined />;
      case "housing":
        return <HomeOutlined />;
      default:
        return <HeartOutlined />;
    }
  };


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
            {record.status ? record.status.toUpperCase() : 'UNKNOWN'}
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
          {category ? category.toUpperCase() : 'UNKNOWN'}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status ? status.toUpperCase() : 'UNKNOWN'}</Tag>
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
        <Tag color={getStatusColor(status)}>{status ? status.toUpperCase() : 'UNKNOWN'}</Tag>
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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "#f5f5f5",
        }}
      >
        <Card style={{ textAlign: "center", padding: "50px" }}>
          <div className="loading-spinner"></div>
          <Title level={3} style={{ marginTop: "20px" }}>
            Loading admin dashboard...
          </Title>
        </Card>
      </div>
    );
  }

  if (!session?.user || !(session.user as any)?.is_admin) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "#f5f5f5",
        }}
      >
        <Card style={{ textAlign: "center", maxWidth: 400 }}>
          <Result
            status="403"
            title="Access Denied"
            subTitle="You don't have permission to access the admin dashboard."
            extra={
              <Button type="primary" onClick={() => router.push("/")}>
                Go Home
              </Button>
            }
          />
        </Card>
      </div>
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
      label: "Users",
    },
    {
      key: "causes",
      icon: <HeartOutlined />,
      label: "Causes",
    },
    {
      key: "comments",
      icon: <MessageOutlined />,
      label: "Comments",
    },
    {
      key: "enrollments",
      icon: <BookOutlined />,
      label: "Enrollments",
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
    <Layout style={{ minHeight: "100vh" }}>
      {/* Professional Sidebar */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={280}
        style={{
          background: "#001529",
          boxShadow: "2px 0 8px rgba(0,0,0,0.15)",
        }}
      >
        {/* Logo Section */}
        <div
          style={{
            height: "64px",
            padding: "16px",
            display: "flex",
            alignItems: "center",
            borderBottom: "1px solid #1f2937",
          }}
        >
          <HeartOutlined
            style={{
              fontSize: "24px",
              color: "#10b981",
              marginRight: collapsed ? 0 : "12px",
            }}
          />
          {!collapsed && (
            <span
              style={{
                color: "white",
                fontSize: "18px",
                fontWeight: "600",
              }}
            >
              Hands2gether
            </span>
          )}
        </div>

        {/* Navigation Menu */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[activeTab]}
          style={{
            border: "none",
            background: "transparent",
          }}
          items={menuItems.map((item) => ({
            ...item,
            onClick: () => setActiveTab(item.key),
            style: {
              margin: "4px 8px",
              borderRadius: "8px",
              height: "48px",
              display: "flex",
              alignItems: "center",
            },
          }))}
        />

        {/* User Profile Section */}
        <div
          style={{
            position: "absolute",
            bottom: "16px",
            left: "8px",
            right: "8px",
            padding: "16px",
            borderTop: "1px solid #1f2937",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: "white",
            }}
          >
            <Avatar
              size={collapsed ? "small" : "default"}
              style={{
                backgroundColor: "#10b981",
                marginRight: collapsed ? 0 : "12px",
              }}
            >
              {session?.user?.name?.charAt(0)?.toUpperCase()}
            </Avatar>
            {!collapsed && (
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "14px", fontWeight: "500" }}>
                  {session?.user?.name}
                </div>
                <div style={{ fontSize: "12px", opacity: 0.7 }}>
                  Administrator
                </div>
              </div>
            )}
          </div>
        </div>
      </Sider>

      <Layout>
        {/* Professional Header */}
        <Header
          style={{
            background: "white",
            padding: "0 24px",
            borderBottom: "1px solid #f0f0f0",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 40,
                height: 40,
                marginRight: "16px",
              }}
            />
            <Breadcrumb
              items={[
                {
                  title: "Admin",
                },
                {
                  title: menuItems.find((item) => item.key === activeTab)
                    ?.label,
                },
              ]}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Badge count={stats.pendingApprovals}>
              <Button
                type="text"
                icon={<BellOutlined />}
                style={{ width: 40, height: 40 }}
              />
            </Badge>

            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={() => router.push("/api/auth/signout")}
              style={{ width: 40, height: 40 }}
            />
          </div>
        </Header>

        {/* Main Content Area */}
        <Content
          style={{
            margin: "24px",
            padding: "24px",
            background: "white",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            minHeight: "calc(100vh - 112px)",
          }}
        >
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "400px",
              }}
            >
              <Space direction="vertical" align="center">
                <div className="loading-spinner"></div>
                <Text>Loading admin dashboard...</Text>
              </Space>
            </div>
          ) : (
            <>
              {/* Dashboard Content */}
              {activeTab === "dashboard" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Title level={2} style={{ marginBottom: "24px" }}>
                    Dashboard Overview
                  </Title>

                  {/* Stats Grid */}
                  <Row gutter={[24, 24]} style={{ marginBottom: "32px" }}>
                    <Col xs={24} sm={12} lg={6}>
                      <Card
                        bordered={false}
                        style={{
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          color: "white",
                        }}
                      >
                        <Statistic
                          title={
                            <span style={{ color: "rgba(255,255,255,0.9)" }}>
                              Total Users
                            </span>
                          }
                          value={stats.totalUsers}
                          prefix={<TeamOutlined />}
                          valueStyle={{ color: "white", fontSize: "28px" }}
                        />
                        <div
                          style={{
                            marginTop: "8px",
                            fontSize: "12px",
                            opacity: 0.8,
                          }}
                        >
                          <RiseOutlined /> +{stats.monthlyGrowth}% this month
                        </div>
                      </Card>
                    </Col>

                    <Col xs={24} sm={12} lg={6}>
                      <Card
                        bordered={false}
                        style={{
                          background:
                            "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                          color: "white",
                        }}
                      >
                        <Statistic
                          title={
                            <span style={{ color: "rgba(255,255,255,0.9)" }}>
                              Total Causes
                            </span>
                          }
                          value={stats.totalCauses}
                          prefix={<HeartOutlined />}
                          valueStyle={{ color: "white", fontSize: "28px" }}
                        />
                        <div
                          style={{
                            marginTop: "8px",
                            fontSize: "12px",
                            opacity: 0.8,
                          }}
                        >
                          {stats.activeCauses} active
                        </div>
                      </Card>
                    </Col>

                    <Col xs={24} sm={12} lg={6}>
                      <Card
                        bordered={false}
                        style={{
                          background:
                            "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                          color: "white",
                        }}
                      >
                        <Statistic
                          title={
                            <span style={{ color: "rgba(255,255,255,0.9)" }}>
                              Comments
                            </span>
                          }
                          value={stats.totalComments}
                          prefix={<MessageOutlined />}
                          valueStyle={{ color: "white", fontSize: "28px" }}
                        />
                        <div
                          style={{
                            marginTop: "8px",
                            fontSize: "12px",
                            opacity: 0.8,
                          }}
                        >
                          {stats.pendingApprovals} pending
                        </div>
                      </Card>
                    </Col>

                    <Col xs={24} sm={12} lg={6}>
                      <Card
                        bordered={false}
                        style={{
                          background:
                            "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                          color: "white",
                        }}
                      >
                        <Statistic
                          title={
                            <span style={{ color: "rgba(255,255,255,0.9)" }}>
                              Donations
                            </span>
                          }
                          value={stats.totalDonations}
                          prefix={<DollarOutlined />}
                          valueStyle={{ color: "white", fontSize: "28px" }}
                        />
                        <div
                          style={{
                            marginTop: "8px",
                            fontSize: "12px",
                            opacity: 0.8,
                          }}
                        >
                          Platform impact
                        </div>
                      </Card>
                    </Col>
                  </Row>

                  {/* Quick Actions */}
                  <Row gutter={[24, 24]} style={{ marginBottom: "32px" }}>
                    <Col xs={24} lg={8}>
                      <Card
                        title="Quick Actions"
                        bordered={false}
                        style={{ height: "100%" }}
                      >
                        <Space direction="vertical" style={{ width: "100%" }}>
                          <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            block
                            onClick={() => setActiveTab("causes")}
                          >
                            Review Causes
                          </Button>
                          <Button
                            icon={<UserOutlined />}
                            block
                            onClick={() => setActiveTab("users")}
                          >
                            Manage Users
                          </Button>
                          <Button
                            icon={<MessageOutlined />}
                            block
                            onClick={() => setActiveTab("comments")}
                          >
                            Moderate Comments
                          </Button>
                        </Space>
                      </Card>
                    </Col>

                    <Col xs={24} lg={16}>
                      <Card
                        title="Recent Activity"
                        extra={
                          <Button
                            type="link"
                            onClick={() => setActiveTab("users")}
                          >
                            View All
                          </Button>
                        }
                        bordered={false}
                        style={{ height: "100%" }}
                      >
                        <div style={{ maxHeight: "200px", overflowY: "auto" }}>
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
                              <Avatar
                                src={user.avatar}
                                icon={<UserOutlined />}
                              />
                              <div style={{ marginLeft: "12px", flex: 1 }}>
                                <div style={{ fontWeight: 500 }}>
                                  {user.name}
                                </div>
                                <div
                                  style={{ fontSize: "12px", color: "#666" }}
                                >
                                  Joined{" "}
                                  {new Date(
                                    user.created_at,
                                  ).toLocaleDateString()}
                                </div>
                              </div>
                              {user.is_admin && (
                                <CrownOutlined style={{ color: "#faad14" }} />
                              )}
                            </div>
                          ))}
                        </div>
                      </Card>
                    </Col>
                  </Row>
                </motion.div>
              )}

              {/* Users Management */}
              {activeTab === "users" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "24px",
                    }}
                  >
                    <Title level={2} style={{ margin: 0 }}>
                      User Management
                    </Title>
                    <Space>
                      <Search
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: 250 }}
                      />
                      <Button icon={<FilterOutlined />}>Filter</Button>
                      <Button icon={<ExportOutlined />}>Export</Button>
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setUserModalVisible(true)}
                      >
                        Add User
                      </Button>
                    </Space>
                  </div>

                  <Card bordered={false}>
                    <Table
                      columns={userColumns}
                      dataSource={filteredUsers}
                      rowKey="id"
                      pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                          `${range[0]}-${range[1]} of ${total} users`,
                      }}
                      scroll={{ x: 1000 }}
                    />
                  </Card>
                </motion.div>
              )}

              {/* Causes Management */}
              {activeTab === "causes" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "24px",
                    }}
                  >
                    <Title level={2} style={{ margin: 0 }}>
                      Cause Management
                    </Title>
                    <Space>
                      <Search
                        placeholder="Search causes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: 250 }}
                      />
                      <Button icon={<FilterOutlined />}>Filter</Button>
                      <Button icon={<ExportOutlined />}>Export</Button>
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setCauseModalVisible(true)}
                      >
                        Add Cause
                      </Button>
                    </Space>
                  </div>

                  <Card bordered={false}>
                    <Table
                      columns={causeColumns}
                      dataSource={filteredCauses}
                      rowKey="id"
                      pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                          `${range[0]}-${range[1]} of ${total} causes`,
                      }}
                      scroll={{ x: 1200 }}
                    />
                  </Card>
                </motion.div>
              )}

              {/* Comments Management */}
              {activeTab === "comments" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "24px",
                    }}
                  >
                    <Title level={2} style={{ margin: 0 }}>
                      Comment Management
                    </Title>
                    <Space>
                      <Search
                        placeholder="Search comments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: 250 }}
                      />
                      <Button icon={<FilterOutlined />}>Filter</Button>
                      <Button icon={<CheckCircleOutlined />} type="primary">
                        Bulk Approve
                      </Button>
                      <Button icon={<CloseCircleOutlined />} danger>
                        Bulk Reject
                      </Button>
                    </Space>
                  </div>

                  <Card bordered={false}>
                    <Table
                      columns={commentColumns}
                      dataSource={filteredComments}
                      rowKey="id"
                      pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                          `${range[0]}-${range[1]} of ${total} comments`,
                      }}
                      scroll={{ x: 1000 }}
                      expandable={{
                        expandedRowRender: (record) => (
                          <div
                            style={{
                              margin: 0,
                              padding: "16px",
                              background: "#fafafa",
                              borderRadius: "4px",
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

              {/* Enrollments Management */}
              {activeTab === "enrollments" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "24px",
                    }}
                  >
                    <Title level={2} style={{ margin: 0 }}>
                      Enrollment Management
                    </Title>
                    <Space>
                      <Search
                        placeholder="Search enrollments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: 250 }}
                      />
                      <Button icon={<FilterOutlined />}>Filter</Button>
                      <Button icon={<CheckCircleOutlined />} type="primary">
                        Bulk Accept
                      </Button>
                      <Button icon={<CloseCircleOutlined />} danger>
                        Bulk Reject
                      </Button>
                    </Space>
                  </div>

                  <Card bordered={false}>
                    <Table
                      columns={enrollmentColumns}
                      dataSource={filteredEnrollments}
                      rowKey="id"
                      pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                          `${range[0]}-${range[1]} of ${total} enrollments`,
                      }}
                      scroll={{ x: 1200 }}
                      expandable={{
                        expandedRowRender: (record) => (
                          <div
                            style={{
                              margin: 0,
                              padding: "16px",
                              background: "#fafafa",
                              borderRadius: "4px",
                            }}
                          >
                            <Row gutter={16}>
                              <Col span={12}>
                                <strong>User Details:</strong>
                                <p>Email: {record.user_email}</p>
                                <p>Phone: {record.user_phone || 'N/A'}</p>
                              </Col>
                              <Col span={12}>
                                <strong>Course Details:</strong>
                                <p>Instructor: {record.instructor_name}</p>
                                <p>Start Date: {record.start_date ? new Date(record.start_date).toLocaleDateString() : 'TBD'}</p>
                                <p>Participants: {record.current_participants}/{record.max_participants}</p>
                              </Col>
                            </Row>
                            {record.admin_notes && (
                              <div style={{ marginTop: "12px" }}>
                                <strong>Admin Notes:</strong>
                                <p>{record.admin_notes}</p>
                              </div>
                            )}
                          </div>
                        ),
                      }}
                    />
                  </Card>
                </motion.div>
              )}

              {/* Analytics */}
              {activeTab === "analytics" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Title level={2} style={{ marginBottom: "24px" }}>
                    Analytics Dashboard
                  </Title>
                  <Alert
                    message="Analytics Dashboard"
                    description="Advanced analytics and reporting features will be implemented here."
                    type="info"
                    showIcon
                    style={{ borderRadius: "8px" }}
                  />
                </motion.div>
              )}

              {/* Settings */}
              {activeTab === "settings" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Title level={2} style={{ marginBottom: "24px" }}>
                    System Settings
                  </Title>
                  <Alert
                    message="System Settings"
                    description="System configuration and settings will be implemented here."
                    type="info"
                    showIcon
                    style={{ borderRadius: "8px" }}
                  />
                </motion.div>
              )}
            </>
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

      {/* Add Custom Styles */}
      <style jsx global>{`
        .loading-spinner {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #1890ff;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .ant-layout-sider {
          position: fixed !important;
          height: 100vh;
          left: 0;
          top: 0;
          z-index: 100;
        }

        .ant-layout {
          margin-left: 280px;
        }

        .ant-layout.ant-layout-has-sider .ant-layout {
          margin-left: 0;
        }

        .ant-menu-item {
          transition: all 0.3s ease;
        }

        .ant-menu-item:hover {
          transform: translateX(4px);
        }

        .ant-card {
          border-radius: 8px !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06) !important;
        }

        .ant-table-thead > tr > th {
          background: #fafafa !important;
          font-weight: 600 !important;
        }
      `}</style>
    </Layout>
  );
}
