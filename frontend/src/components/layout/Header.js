import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Layout,
  Menu,
  Button,
  Dropdown,
  Badge,
  Avatar,
  Space,
  Drawer,
  Typography,
  Divider,
  Tag,
} from "antd";
import {
  UserOutlined,
  BellOutlined,
  LogoutOutlined,
  DashboardOutlined,
  TeamOutlined,
  MenuOutlined,
  HeartOutlined,
  HomeOutlined,
  PlusOutlined,
  SettingOutlined,
  AppstoreOutlined,
  FormOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { isMobile } from "../../utils/responsive";
import { logout } from "../../redux/slices/authSlice";

const { Header: AntHeader } = Layout;
const { Title, Text } = Typography;

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const mobile = isMobile();

  // Get unread notifications count
  useEffect(() => {
    if (user) {
      // Fetch unread notifications count
      // This would use a notification service to fetch the count
      setUnreadCount(3); // Placeholder for demo
    }
  }, [user]);

  const onLogout = () => {
    dispatch(logout());
    navigate("/");
  };
  const userMenuItems = [
    {
      key: "profile",
      label: <Link to="/profile">My Profile</Link>,
      icon: <UserOutlined />,
    },
    {
      key: "contributions",
      label: <Link to="/my-contributions">My Contributions</Link>,
      icon: <AppstoreOutlined />,
    },
    {
      key: "followed",
      label: <Link to="/followed-causes">Followed Causes</Link>,
      icon: <HeartOutlined />,
    },
    {
      key: "chat-history",
      label: <Link to="/chat-history">Chat History</Link>,
      icon: <MessageOutlined />,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      danger: true,
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: onLogout,
    },
  ];

  // Add admin items if user is admin
  if (user && user.is_admin) {
    userMenuItems.splice(
      3,
      0,
      {
        type: "divider",
      },
      {
        key: "admin",
        label: <Link to="/admin">Admin Dashboard</Link>,
        icon: <DashboardOutlined />,
      },
      {
        key: "admin-users",
        label: <Link to="/admin/users">Manage Users</Link>,
        icon: <TeamOutlined />,
      },
      {
        key: "admin-categories",
        label: <Link to="/admin/categories">Manage Categories</Link>,
        icon: <FormOutlined />,
      },
      {
        key: "admin-causes",
        label: <Link to="/admin/causes">Manage Causes</Link>,
        icon: <SettingOutlined />,
      }
    );
  }

  return (
    <AntHeader
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        width: "100%",
        background: "#fff",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
        padding: "0 20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "100%",
          maxWidth: 1200,
          margin: "0 auto",
          width: "100%",
        }}
      >
        <div className="logo" style={{ flex: "0 0 auto" }}>
          <Link to="/">
            <Space align="center">
              <HeartOutlined style={{ fontSize: 28, color: "#ff4d4f" }} />
              <Title level={4} style={{ margin: 0, color: "#ff4d4f" }}>
                Hands2gether
              </Title>
            </Space>
          </Link>
        </div>

        {!mobile ? (
          <Menu
            mode="horizontal"
            style={{
              flex: "1 1 auto",
              justifyContent: "center",
              border: "none",
              fontWeight: 500,
            }}
            selectedKeys={[
              location.pathname === "/"
                ? "home"
                : location.pathname.split("/")[1] || "home",
            ]}
            items={[
              {
                key: "home",
                label: (
                  <Link to="/">
                    <HomeOutlined /> Home
                  </Link>
                ),
              },
              {
                key: "causes",
                label: (
                  <Link to="/causes">
                    <HeartOutlined /> Causes
                  </Link>
                ),
              },
              ...(user
                ? [
                    {
                      key: "create",
                      label: (
                        <Link to="/causes/create">
                          <PlusOutlined /> Create Cause
                        </Link>
                      ),
                    },
                  ]
                : []),
            ]}
          />
        ) : (
          <Button
            icon={<MenuOutlined />}
            onClick={() => setMobileMenuVisible(true)}
            style={{ marginLeft: "auto", marginRight: 16 }}
          />
        )}

        <div style={{ flex: "0 0 auto" }}>
          {user ? (
            <Space size={mobile ? "small" : "middle"} align="center">
              <Badge
                count={unreadCount}
                overflowCount={99}
                dot={unreadCount > 0}
              >
                <Button
                  icon={<BellOutlined />}
                  shape="circle"
                  onClick={() => navigate("/profile?tab=notifications")}
                />
              </Badge>

              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <Space align="center" style={{ cursor: "pointer" }}>
                  <Avatar
                    src={user.avatar ? `/uploads/${user.avatar}` : null}
                    icon={!user.avatar && <UserOutlined />}
                    style={{
                      backgroundColor: !user.avatar ? "#1890ff" : undefined,
                    }}
                  />
                  {!mobile && (
                    <span style={{ marginLeft: 4 }}>{user.name}</span>
                  )}
                </Space>
              </Dropdown>
            </Space>
          ) : (
            <Space>
              {!mobile ? (
                <>
                  <Button onClick={() => navigate("/login")}>Log In</Button>
                  <Button type="primary" onClick={() => navigate("/register")}>
                    Sign Up
                  </Button>
                </>
              ) : (
                <Button type="primary" onClick={() => navigate("/login")}>
                  Log In
                </Button>
              )}
            </Space>
          )}
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <Drawer
        title={
          <Space align="center">
            <HeartOutlined style={{ fontSize: 20, color: "#ff4d4f" }} />
            <Text strong>Hands2gether</Text>
          </Space>
        }
        placement="left"
        onClose={() => setMobileMenuVisible(false)}
        open={mobileMenuVisible}
        width={280}
      >
        {user && (
          <div style={{ padding: "0 0 16px 0", textAlign: "center" }}>
            <Space direction="vertical" align="center">
              <Avatar
                src={user.avatar ? `/uploads/${user.avatar}` : null}
                icon={!user.avatar && <UserOutlined />}
                size={64}
                style={{
                  backgroundColor: !user.avatar ? "#1890ff" : undefined,
                }}
              />
              <Text strong>{user.name}</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {user.email}
              </Text>
              {user.is_admin && <Tag color="red">Administrator</Tag>}
            </Space>
            <Divider style={{ margin: "16px 0" }} />
          </div>
        )}

        <Menu
          mode="vertical"
          style={{ border: "none" }}
          selectedKeys={[
            location.pathname === "/"
              ? "home"
              : location.pathname.split("/")[1] || "home",
          ]}
          items={[
            {
              key: "home",
              icon: <HomeOutlined />,
              label: (
                <Link to="/" onClick={() => setMobileMenuVisible(false)}>
                  Home
                </Link>
              ),
            },
            {
              key: "causes",
              icon: <HeartOutlined />,
              label: (
                <Link to="/causes" onClick={() => setMobileMenuVisible(false)}>
                  Causes
                </Link>
              ),
            },
            ...(user
              ? [
                  {
                    key: "create",
                    icon: <PlusOutlined />,
                    label: (
                      <Link
                        to="/causes/create"
                        onClick={() => setMobileMenuVisible(false)}
                      >
                        Create Cause
                      </Link>
                    ),
                  },
                  {
                    type: "divider",
                  },
                  {
                    key: "profile",
                    icon: <UserOutlined />,
                    label: (
                      <Link
                        to="/profile"
                        onClick={() => setMobileMenuVisible(false)}
                      >
                        My Profile
                      </Link>
                    ),
                  },
                  {
                    key: "contributions",
                    icon: <AppstoreOutlined />,
                    label: (
                      <Link
                        to="/my-contributions"
                        onClick={() => setMobileMenuVisible(false)}
                      >
                        My Contributions
                      </Link>
                    ),
                  },
                  {
                    key: "followed",
                    icon: <HeartOutlined />,
                    label: (
                      <Link
                        to="/followed-causes"
                        onClick={() => setMobileMenuVisible(false)}
                      >
                        Followed Causes
                      </Link>
                    ),
                  },
                  {
                    key: "chat-history",
                    icon: <MessageOutlined />,
                    label: (
                      <Link
                        to="/chat-history"
                        onClick={() => setMobileMenuVisible(false)}
                      >
                        Chat History
                      </Link>
                    ),
                  },
                  ...(user.is_admin
                    ? [
                        {
                          type: "divider",
                        },
                        {
                          key: "admin",
                          icon: <DashboardOutlined />,
                          label: (
                            <Link
                              to="/admin"
                              onClick={() => setMobileMenuVisible(false)}
                            >
                              Admin Dashboard
                            </Link>
                          ),
                        },
                        {
                          key: "admin-users",
                          icon: <TeamOutlined />,
                          label: (
                            <Link
                              to="/admin/users"
                              onClick={() => setMobileMenuVisible(false)}
                            >
                              Manage Users
                            </Link>
                          ),
                        },
                        {
                          key: "admin-categories",
                          icon: <FormOutlined />,
                          label: (
                            <Link
                              to="/admin/categories"
                              onClick={() => setMobileMenuVisible(false)}
                            >
                              Manage Categories
                            </Link>
                          ),
                        },
                        {
                          key: "admin-causes",
                          icon: <SettingOutlined />,
                          label: (
                            <Link
                              to="/admin/causes"
                              onClick={() => setMobileMenuVisible(false)}
                            >
                              Manage Causes
                            </Link>
                          ),
                        },
                      ]
                    : []),
                  {
                    type: "divider",
                  },
                  {
                    key: "logout",
                    danger: true,
                    icon: <LogoutOutlined />,
                    label: (
                      <span
                        onClick={() => {
                          onLogout();
                          setMobileMenuVisible(false);
                        }}
                      >
                        Logout
                      </span>
                    ),
                  },
                ]
              : [
                  {
                    type: "divider",
                  },
                  {
                    key: "login",
                    icon: <UserOutlined />,
                    label: (
                      <Link
                        to="/login"
                        onClick={() => setMobileMenuVisible(false)}
                      >
                        Log In
                      </Link>
                    ),
                  },
                  {
                    key: "register",
                    icon: <UserOutlined />,
                    label: (
                      <Link
                        to="/register"
                        onClick={() => setMobileMenuVisible(false)}
                      >
                        Sign Up
                      </Link>
                    ),
                  },
                ]),
          ]}
        />
      </Drawer>
    </AntHeader>
  );
};

export default Header;
