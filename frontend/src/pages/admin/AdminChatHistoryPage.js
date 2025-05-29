import React from "react";
import { useSelector } from "react-redux";
import { Typography, Breadcrumb, Card } from "antd";
import {
  HomeOutlined,
  DashboardOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import { Link, Navigate } from "react-router-dom";
import ChatConversations from "../../components/admin/ChatConversations";

const { Title } = Typography;

const AdminChatHistoryPage = () => {
  const { user } = useSelector((state) => state.auth);

  // Redirect if not admin
  if (!user || !user.is_admin) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="admin-page">
      <Breadcrumb className="admin-breadcrumb">
        <Breadcrumb.Item>
          <Link to="/">
            <HomeOutlined /> Home
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/admin">
            <DashboardOutlined /> Admin
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <CommentOutlined /> Chat History
        </Breadcrumb.Item>
      </Breadcrumb>

      <Title level={2} className="admin-title">
        <CommentOutlined /> Chatbot Conversations History
      </Title>

      <div className="admin-content">
        <ChatConversations />
      </div>
    </div>
  );
};

export default AdminChatHistoryPage;
