import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  Typography,
  Tabs,
  Form,
  Input,
  Button,
  Avatar,
  Upload,
  message,
  Row,
  Col,
  Skeleton,
  Divider,
  Modal,
  Space,
  Empty,
  Tag,
  Breadcrumb,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  EditOutlined,
  UploadOutlined,
  SaveOutlined,
  DatabaseOutlined,
  HeartOutlined,
  BellOutlined,
  HomeOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

import {
  updateUserProfile,
  updateUserPassword,
} from "../../redux/slices/authSlice";
import {
  getUserNotifications,
  markAllNotificationsAsRead,
} from "../../redux/slices/notificationsSlice";
import { getUserStats } from "../../redux/slices/userSlice";
import NotificationItem from "../../components/profile/NotificationItem";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, isLoading: authLoading } = useSelector((state) => state.auth);
  const {
    notifications,
    unreadCount,
    isLoading: notificationsLoading,
  } = useSelector((state) => state.notifications);
  const { stats, isLoading: statsLoading } = useSelector((state) => state.user);

  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(getUserNotifications());
      dispatch(getUserStats());

      profileForm.setFieldsValue({
        name: user.name,
        email: user.email,
        bio: user.bio || "",
      });

      if (user.avatar) {
        setPreviewImage(`/uploads/${user.avatar}`);
      }
    }
  }, [user, dispatch, profileForm]);

  const handleAvatarChange = ({ file }) => {
    if (file.status === "uploading") {
      return;
    }

    if (file.status === "done") {
      setAvatarFile(file.originFileObj);

      // Create a preview URL
      const reader = new FileReader();
      reader.addEventListener("load", () => setPreviewImage(reader.result));
      reader.readAsDataURL(file.originFileObj);
    }
  };

  const handleProfileSubmit = (values) => {
    const formData = new FormData();

    // Add form values to formData
    Object.keys(values).forEach((key) => {
      if (values[key] !== undefined && values[key] !== null) {
        formData.append(key, values[key]);
      }
    });

    // Add avatar if uploaded
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    dispatch(updateUserProfile(formData))
      .unwrap()
      .then(() => {
        message.success("Profile updated successfully!");
        setEditMode(false);
      })
      .catch((error) => {
        message.error(`Failed to update profile: ${error}`);
      });
  };

  const handlePasswordSubmit = (values) => {
    dispatch(updateUserPassword(values))
      .unwrap()
      .then(() => {
        message.success("Password updated successfully!");
        setChangePasswordVisible(false);
        passwordForm.resetFields();
      })
      .catch((error) => {
        message.error(`Failed to update password: ${error}`);
      });
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsAsRead())
      .unwrap()
      .then(() => {
        message.success("All notifications marked as read");
      })
      .catch((error) => {
        message.error(`Failed to mark notifications as read: ${error}`);
      });
  };

  // Custom avatar upload button
  const uploadButton = (
    <div>
      <UploadOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  // Custom file upload props
  const fileUploadProps = {
    name: "avatar",
    beforeUpload: (file) => {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        message.error("You can only upload JPG/PNG files!");
        return false;
      }

      const isLessThan2MB = file.size / 1024 / 1024 < 2;
      if (!isLessThan2MB) {
        message.error("Image must be smaller than 2MB!");
        return false;
      }

      return false; // Prevent automatic upload
    },
    onChange: handleAvatarChange,
    showUploadList: false,
    customRequest: ({ onSuccess }) => {
      setTimeout(() => {
        onSuccess("ok", null);
      }, 0);
    },
  };

  if (authLoading) {
    return <Skeleton active avatar paragraph={{ rows: 6 }} />;
  }

  if (!user) {
    return (
      <Card>
        <Text>Please login to view your profile</Text>
      </Card>
    );
  }

  return (
    <div className="profile-page">
      <Breadcrumb className="breadcrumb-navigation">
        <Breadcrumb.Item>
          <Link to="/">
            <HomeOutlined /> Home
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Profile</Breadcrumb.Item>
      </Breadcrumb>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card className="profile-sidebar card-elevated">
            {/* Profile Header */}
            <div className="profile-header">
              <Avatar
                size={120}
                src={previewImage}
                icon={!previewImage && <UserOutlined />}
                style={{ border: "4px solid #f0f0f0" }}
              />
              <Title level={3} style={{ marginTop: 16, marginBottom: 4 }}>
                {user.name}
              </Title>
              <Text type="secondary">{user.email}</Text>

              {user.is_admin && (
                <Tag color="red" className="admin-tag">
                  Admin
                </Tag>
              )}
            </div>

            <Divider style={{ margin: "0 0 20px 0" }} />

            {/* Profile Stats */}
            <div className="profile-stats">
              {statsLoading ? (
                <Skeleton active paragraph={{ rows: 3 }} />
              ) : (
                <>
                  <div className="stat-item">
                    <DatabaseOutlined
                      style={{ fontSize: 24, color: "#1890ff" }}
                    />
                    <div className="stat-info">
                      <Text className="stat-number">{stats.causesCreated}</Text>
                      <Text type="secondary">Causes Created</Text>
                    </div>
                  </div>

                  <div className="stat-item">
                    <HeartOutlined style={{ fontSize: 24, color: "#ff4d4f" }} />
                    <div className="stat-info">
                      <Text className="stat-number">
                        {stats.causesFollowed}
                      </Text>
                      <Text type="secondary">Causes Followed</Text>
                    </div>
                  </div>

                  <div className="stat-item">
                    <BellOutlined style={{ fontSize: 24, color: "#faad14" }} />
                    <div className="stat-info">
                      <Text className="stat-number">{unreadCount}</Text>
                      <Text type="secondary">Unread Notifications</Text>
                    </div>
                  </div>
                </>
              )}
            </div>

            <Divider style={{ margin: "0 0 20px 0" }} />

            {/* Quick Links */}
            <div className="quick-links">
              <Title level={4}>Quick Links</Title>
              <ul>
                <li>
                  <Link to="/my-contributions">
                    <Button
                      type="link"
                      style={{ padding: "4px 0" }}
                      icon={<DatabaseOutlined />}
                    >
                      My Contributions
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link to="/followed-causes">
                    <Button
                      type="link"
                      style={{ padding: "4px 0" }}
                      icon={<HeartOutlined />}
                    >
                      Followed Causes
                    </Button>
                  </Link>{" "}
                </li>
                <li>
                  <Link to="/chat-history">
                    <Button
                      type="link"
                      style={{ padding: "4px 0" }}
                      icon={<MessageOutlined />}
                    >
                      Chat History
                    </Button>
                  </Link>
                </li>
                <li>
                  <Button
                    type="link"
                    icon={<LockOutlined />}
                    style={{ padding: "4px 0" }}
                    onClick={() => setChangePasswordVisible(true)}
                  >
                    Change Password
                  </Button>
                </li>
                {user.is_admin && (
                  <li>
                    <Link to="/admin">
                      <Button
                        type="link"
                        style={{ padding: "4px 0" }}
                        icon={<UserOutlined />}
                      >
                        Admin Dashboard
                      </Button>
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={16}>
          <Card className="profile-content card-elevated">
            <Tabs defaultActiveKey="1" size="large">
              <TabPane
                tab={
                  <span>
                    <UserOutlined />
                    Profile Information
                  </span>
                }
                key="1"
              >
                <div className="profile-info">
                  <div className="section-header">
                    <Title level={4}>Profile Information</Title>
                    <Button
                      type={editMode ? "primary" : "default"}
                      icon={editMode ? <SaveOutlined /> : <EditOutlined />}
                      onClick={() =>
                        editMode ? profileForm.submit() : setEditMode(true)
                      }
                    >
                      {editMode ? "Save Changes" : "Edit Profile"}
                    </Button>
                  </div>

                  {editMode ? (
                    <Form
                      form={profileForm}
                      layout="vertical"
                      onFinish={handleProfileSubmit}
                      requiredMark={false}
                    >
                      <Row gutter={[16, 16]}>
                        <Col xs={24} md={12}>
                          <Form.Item
                            label="Display Name"
                            name="name"
                            rules={[
                              {
                                required: true,
                                message: "Please enter your name",
                              },
                            ]}
                          >
                            <Input prefix={<UserOutlined />} />
                          </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                          <Form.Item
                            label="Email Address"
                            name="email"
                            rules={[
                              {
                                required: true,
                                message: "Please enter your email",
                              },
                              {
                                type: "email",
                                message: "Please enter a valid email",
                              },
                            ]}
                          >
                            <Input
                              prefix={<MailOutlined />}
                              disabled={user.google_id}
                            />
                            {user.google_id && (
                              <Text type="secondary">
                                Email cannot be changed for Google-linked
                                accounts
                              </Text>
                            )}
                          </Form.Item>
                        </Col>

                        <Col span={24}>
                          <Form.Item label="Bio" name="bio">
                            <TextArea
                              rows={4}
                              placeholder="Tell us a little about yourself"
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                          <Form.Item label="Profile Picture">
                            <Upload
                              {...fileUploadProps}
                              listType="picture-card"
                              className="avatar-uploader"
                            >
                              {previewImage ? (
                                <img
                                  src={previewImage}
                                  alt="Avatar"
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                              ) : (
                                uploadButton
                              )}
                            </Upload>
                          </Form.Item>
                        </Col>
                      </Row>

                      <Form.Item>
                        <Space>
                          <Button type="primary" htmlType="submit">
                            Save Changes
                          </Button>
                          <Button onClick={() => setEditMode(false)}>
                            Cancel
                          </Button>
                        </Space>
                      </Form.Item>
                    </Form>
                  ) : (
                    <div className="profile-details">
                      <div className="profile-item">
                        <Text strong>Display Name:</Text>
                        <Text>{user.name}</Text>
                      </div>

                      <div className="profile-item">
                        <Text strong>Email Address:</Text>
                        <Text>{user.email}</Text>
                      </div>

                      <div className="profile-item">
                        <Text strong>Bio:</Text>
                        <Paragraph>
                          {user.bio || "No bio provided yet."}
                        </Paragraph>
                      </div>

                      <div className="profile-item">
                        <Text strong>Account Created:</Text>
                        <Text>
                          {new Date(user.created_at).toLocaleDateString()}
                        </Text>
                      </div>

                      {user.google_id && (
                        <div className="profile-item">
                          <Text strong>Account Type:</Text>
                          <Text>Google Sign-In</Text>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </TabPane>

              <TabPane
                tab={
                  <span>
                    <BellOutlined />
                    Notifications{" "}
                    {unreadCount > 0 && (
                      <Tag color="red" style={{ marginLeft: 4 }}>
                        {unreadCount}
                      </Tag>
                    )}
                  </span>
                }
                key="2"
              >
                <div className="notifications-section">
                  <div className="section-header">
                    <Title level={4}>Notifications</Title>
                    {notifications && notifications.length > 0 && (
                      <Button
                        onClick={handleMarkAllAsRead}
                        type="primary"
                        ghost
                      >
                        Mark All as Read
                      </Button>
                    )}
                  </div>

                  {notificationsLoading ? (
                    <Skeleton active paragraph={{ rows: 5 }} />
                  ) : notifications && notifications.length > 0 ? (
                    <div className="notification-list">
                      {notifications.map((notification) => (
                        <NotificationItem
                          key={notification.id}
                          notification={notification}
                        />
                      ))}
                    </div>
                  ) : (
                    <Empty
                      description="No notifications yet"
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      style={{ margin: "40px 0" }}
                    />
                  )}
                </div>
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>

      {/* Change Password Modal */}
      <Modal
        title="Change Password"
        open={changePasswordVisible}
        onCancel={() => setChangePasswordVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handlePasswordSubmit}
          requiredMark={false}
        >
          <Form.Item
            name="currentPassword"
            label="Current Password"
            rules={[
              { required: true, message: "Please enter your current password" },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: "Please enter your new password" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm New Password"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Please confirm your new password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The two passwords do not match")
                  );
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Update Password
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProfilePage;
