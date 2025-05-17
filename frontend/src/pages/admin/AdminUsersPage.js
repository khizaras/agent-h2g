import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  Space,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Typography,
  Card,
  Breadcrumb,
  Tag,
  Tooltip,
  Row,
  Col,
  Avatar,
  Drawer,
  Divider,
  Badge,
  Popconfirm,
  Input as AntInput,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  EditOutlined,
  DeleteOutlined,
  UserAddOutlined,
  TeamOutlined,
  SearchOutlined,
  UserOutlined,
  MailOutlined,
  LockOutlined,
  IdcardOutlined,
  FilterOutlined,
  EyeOutlined,
  ArrowLeftOutlined,
  CheckCircleTwoTone,
  CloseCircleTwoTone,
} from "@ant-design/icons";
import {
  getUsers,
  updateUser,
  deleteUser,
  createUser,
} from "../../redux/slices/adminSlice";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { Search } = AntInput;

const AdminUsersPage = () => {
  const dispatch = useDispatch();
  const { users = [], isLoading = false } = useSelector(
    (state) => state.admin || {}
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [form] = Form.useForm();
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const showModal = (user = null) => {
    setEditingUser(user);
    if (user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        is_admin: user.is_admin ? "true" : "false",
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = (values) => {
    if (editingUser) {
      dispatch(
        updateUser({
          id: editingUser.id,
          userData: {
            ...values,
            is_admin: values.is_admin === "true",
          },
        })
      );
      message.success("User updated successfully");
    } else {
      dispatch(
        createUser({
          ...values,
          is_admin: values.is_admin === "true",
        })
      );
      message.success("User created successfully");
    }
    setIsModalVisible(false);
  };

  const handleDelete = (userId) => {
    dispatch(deleteUser(userId));
    message.success("User deleted successfully");
    if (isDrawerVisible && selectedUser && selectedUser.id === userId) {
      setIsDrawerVisible(false);
    }
  };

  const showUserDetails = (user) => {
    setSelectedUser(user);
    setIsDrawerVisible(true);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase());
    const matchesRole =
      filterRole === "all" ||
      (filterRole === "admin" && user.is_admin) ||
      (filterRole === "user" && !user.is_admin);
    return matchesSearch && matchesRole;
  });

  const columns = [
    {
      title: "User",
      key: "user",
      render: (_, record) => (
        <div className="user-cell">
          <Avatar
            size="large"
            icon={<UserOutlined />}
            className="user-avatar"
            style={{
              backgroundColor: record.is_admin ? "#1890ff" : "#52c41a",
            }}
          />
          <div className="user-info">
            <Text strong className="user-name">
              {record.name}
            </Text>
            <Text type="secondary" className="user-email">
              {record.email}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "is_admin",
      key: "is_admin",
      render: (isAdmin) =>
        isAdmin ? (
          <Tag color="blue" className="role-tag">
            Admin
          </Tag>
        ) : (
          <Tag color="green" className="role-tag">
            User
          </Tag>
        ),
      filters: [
        { text: "Admin", value: true },
        { text: "User", value: false },
      ],
      onFilter: (value, record) => record.is_admin === value,
    },
    {
      title: "Status",
      key: "status",
      render: () => (
        <Badge status="success" text="Active" className="status-badge" />
      ),
    },
    {
      title: "Actions",
      key: "action",
      render: (_, record) => (
        <Space size="middle" className="action-buttons">
          <Tooltip title="View Details">
            <Button
              icon={<EyeOutlined />}
              onClick={() => showUserDetails(record)}
              className="view-button"
            />
          </Tooltip>
          <Tooltip title="Edit User">
            <Button
              icon={<EditOutlined />}
              onClick={() => showModal(record)}
              className="edit-button"
            />
          </Tooltip>
          <Tooltip title="Delete User">
            <Popconfirm
              title="Are you sure you want to delete this user?"
              description="This action cannot be undone."
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true }}
            >
              <Button
                icon={<DeleteOutlined />}
                danger
                className="delete-button"
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-users-container">
      <div className="container">
        <Breadcrumb className="breadcrumb-navigation mt-3 mb-2">
          <Breadcrumb.Item>
            <Link to="/">Home</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/admin">Admin</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Manage Users</Breadcrumb.Item>
        </Breadcrumb>

        <Card className="users-card shadow-sm">
          <div className="page-header mb-4">
            <div className="title-section">
              <Space align="center" className="header-icon-wrapper">
                <TeamOutlined className="header-icon" />
                <Title level={2} className="mb-1">
                  Manage Users
                </Title>
              </Space>
              <Paragraph type="secondary" className="header-description">
                Add, edit, or remove users from the platform. Manage user roles
                and permissions.
              </Paragraph>
            </div>
          </div>

          <div className="table-actions mb-4">
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} md={8}>
                <Search
                  placeholder="Search by name or email"
                  allowClear
                  enterButton={<SearchOutlined />}
                  size="large"
                  className="search-input"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </Col>
              <Col xs={24} md={8}>
                <Select
                  placeholder="Filter by role"
                  style={{ width: "100%" }}
                  size="large"
                  value={filterRole}
                  onChange={(value) => setFilterRole(value)}
                  className="role-filter"
                >
                  <Option value="all">All Roles</Option>
                  <Option value="admin">Admin Only</Option>
                  <Option value="user">User Only</Option>
                </Select>
              </Col>
              <Col xs={24} md={8} className="text-right">
                <Button
                  type="primary"
                  icon={<UserAddOutlined />}
                  onClick={() => showModal()}
                  size="large"
                  className="add-user-button"
                >
                  Add User
                </Button>
              </Col>
            </Row>
          </div>

          <Table
            columns={columns}
            dataSource={filteredUsers}
            rowKey="id"
            loading={isLoading}
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
              showTotal: (total) => `Total ${total} users`,
            }}
            className="users-table"
            rowClassName="user-row"
          />
        </Card>

        <Modal
          title={
            <div className="modal-header">
              {editingUser ? (
                <>
                  <EditOutlined className="modal-icon" /> Edit User
                </>
              ) : (
                <>
                  <UserAddOutlined className="modal-icon" /> Add User
                </>
              )}
            </div>
          }
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          className="user-modal"
          destroyOnClose
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="user-form"
            size="large"
          >
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Please enter a name" }]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Full Name"
              />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please enter an email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input
                prefix={<MailOutlined className="site-form-item-icon" />}
                placeholder="Email Address"
              />
            </Form.Item>

            {!editingUser && (
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: "Please enter a password" },
                  { min: 6, message: "Password must be at least 6 characters" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  placeholder="Password"
                />
              </Form.Item>
            )}

            <Form.Item
              name="is_admin"
              label="Role"
              rules={[{ required: true, message: "Please select a role" }]}
            >
              <Select>
                <Option value="false">Regular User</Option>
                <Option value="true">Administrator</Option>
              </Select>
            </Form.Item>

            <Divider />

            <Form.Item className="form-actions">
              <Space>
                <Button type="default" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  {editingUser ? "Update User" : "Create User"}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        <Drawer
          title={
            <div className="drawer-header">
              <Space>
                <IdcardOutlined className="drawer-icon" />
                <span>User Details</span>
              </Space>
            </div>
          }
          placement="right"
          onClose={() => setIsDrawerVisible(false)}
          visible={isDrawerVisible}
          width={400}
          className="user-details-drawer"
          extra={
            <Space>
              <Button onClick={() => setIsDrawerVisible(false)}>Close</Button>
            </Space>
          }
        >
          {selectedUser && (
            <div className="user-details">
              <div className="user-profile-header mb-4">
                <Avatar
                  size={80}
                  icon={<UserOutlined />}
                  className="user-profile-avatar"
                  style={{
                    backgroundColor: selectedUser.is_admin
                      ? "#1890ff"
                      : "#52c41a",
                  }}
                />
                <div className="user-profile-info">
                  <Title level={4} className="mb-0">
                    {selectedUser.name}
                  </Title>
                  <Text type="secondary">{selectedUser.email}</Text>
                  <div className="mt-2">
                    {selectedUser.is_admin ? (
                      <Tag color="blue" className="profile-tag">
                        Administrator
                      </Tag>
                    ) : (
                      <Tag color="green" className="profile-tag">
                        Regular User
                      </Tag>
                    )}
                    <Tag color="success" className="profile-tag">
                      Active
                    </Tag>
                  </div>
                </div>
              </div>

              <Divider />

              <div className="user-profile-details">
                <div className="detail-item">
                  <Text strong>Account Created:</Text>
                  <Text>
                    {selectedUser.created_at
                      ? new Date(selectedUser.created_at).toLocaleDateString()
                      : "N/A"}
                  </Text>
                </div>

                <div className="detail-item">
                  <Text strong>Last Login:</Text>
                  <Text>
                    {selectedUser.last_login
                      ? new Date(selectedUser.last_login).toLocaleDateString()
                      : "N/A"}
                  </Text>
                </div>

                <div className="detail-item">
                  <Text strong>Admin Access:</Text>
                  <Text>
                    {selectedUser.is_admin ? (
                      <CheckCircleTwoTone twoToneColor="#52c41a" />
                    ) : (
                      <CloseCircleTwoTone twoToneColor="#ff4d4f" />
                    )}
                    <span className="ml-2">
                      {selectedUser.is_admin ? "Enabled" : "Disabled"}
                    </span>
                  </Text>
                </div>
              </div>

              <Divider />

              <div className="drawer-actions">
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    block
                    onClick={() => {
                      showModal(selectedUser);
                      setIsDrawerVisible(false);
                    }}
                  >
                    Edit User
                  </Button>

                  <Popconfirm
                    title="Are you sure you want to delete this user?"
                    description="This action cannot be undone."
                    onConfirm={() => handleDelete(selectedUser.id)}
                    okText="Yes"
                    cancelText="No"
                    okButtonProps={{ danger: true }}
                  >
                    <Button danger icon={<DeleteOutlined />} block>
                      Delete User
                    </Button>
                  </Popconfirm>
                </Space>
              </div>
            </div>
          )}
        </Drawer>
      </div>
    </div>
  );
};

export default AdminUsersPage;
