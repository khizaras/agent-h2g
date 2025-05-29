import React, { useState } from "react";
import { Layout, Menu, theme } from "antd";
import { useLocation, Link } from "react-router-dom";
import {
  DashboardOutlined,
  TeamOutlined,
  FormOutlined,
  HeartOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import "./AdminLayout.css";

const { Sider, Content } = Layout;

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { token } = theme.useToken();

  const menuItems = [
    {
      key: "/admin",
      icon: <DashboardOutlined />,
      label: <Link to="/admin">Dashboard</Link>,
    },
    {
      key: "/admin/users",
      icon: <TeamOutlined />,
      label: <Link to="/admin/users">Users</Link>,
    },
    {
      key: "/admin/causes",
      icon: <HeartOutlined />,
      label: <Link to="/admin/causes">Causes</Link>,
    },
    {
      key: "/admin/categories",
      icon: <FormOutlined />,
      label: <Link to="/admin/categories">Categories</Link>,
    },
    {
      key: "/admin/chat-history",
      icon: <MessageOutlined />,
      label: <Link to="/admin/chat-history">Chat History</Link>,
    },
  ];
  return (
    <Layout className="admin-layout">
      <Sider
        className="admin-sider"
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{
          background: token.colorBgContainer,
        }}
      >
        <div style={{ height: 16 }} />
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          style={{ borderRight: "none" }}
          items={menuItems}
        />
      </Sider>
      <Content className="admin-content">
        <div className="admin-content-inner">{children}</div>
      </Content>
    </Layout>
  );
};

export default AdminLayout;
