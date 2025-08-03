"use client";

import React, { useState, useEffect } from "react";
import {
  Dropdown,
  Badge,
  List,
  Typography,
  Space,
  Button,
  Modal,
  Avatar,
  Tag,
  Empty,
  Spin,
  message,
  Divider,
  Checkbox,
  Tooltip,
} from "antd";
import {
  BellOutlined,
  SettingOutlined,
  DeleteOutlined,
  CheckOutlined,
  EyeOutlined,
  MoreOutlined,
  HeartOutlined,
  UserAddOutlined,
  DollarOutlined,
  CommentOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const { Text } = Typography;

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  cause_id?: number;
  trigger_user_id?: number;
  is_read: boolean;
  created_at: string;
  cause_title?: string;
  cause_image?: string;
  trigger_user_name?: string;
  trigger_user_avatar?: string;
}

interface NotificationCenterProps {
  className?: string;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  className = "",
}) => {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>(
    [],
  );
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchNotifications = async (pageNum = 1, reset = false) => {
    if (!session?.user) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/notifications?page=${pageNum}&limit=20`,
      );
      const data = await response.json();

      if (data.success) {
        if (reset) {
          setNotifications(data.data.notifications);
        } else {
          setNotifications((prev) => [...prev, ...data.data.notifications]);
        }
        setUnreadCount(data.data.unreadCount);
        setHasMore(data.data.pagination.hasNext);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchNotifications(1, true);
    }
  }, [session]);

  const handleMarkAsRead = async (notificationIds: number[]) => {
    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "mark_read",
          notification_ids: notificationIds,
        }),
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notif) =>
            notificationIds.includes(notif.id)
              ? { ...notif, is_read: true }
              : notif,
          ),
        );
        setUnreadCount((prev) => Math.max(0, prev - notificationIds.length));
        message.success("Marked as read");
      }
    } catch (error) {
      message.error("Failed to mark as read");
    }
  };

  const handleDelete = async (notificationIds: number[]) => {
    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete",
          notification_ids: notificationIds,
        }),
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.filter((notif) => !notificationIds.includes(notif.id)),
        );
        setUnreadCount((prev) =>
          Math.max(
            0,
            prev -
              notificationIds.filter((id) =>
                notifications.find((n) => n.id === id && !n.is_read),
              ).length,
          ),
        );
        message.success("Notifications deleted");
      }
    } catch (error) {
      message.error("Failed to delete notifications");
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "cause_like":
        return <HeartOutlined style={{ color: "#ff4d4f" }} />;
      case "cause_follow":
        return <UserAddOutlined style={{ color: "#722ed1" }} />;
      case "cause_support":
        return <DollarOutlined style={{ color: "#52c41a" }} />;
      case "cause_comment":
        return <CommentOutlined style={{ color: "#1890ff" }} />;
      case "course_enrollment":
        return <BookOutlined style={{ color: "#fa8c16" }} />;
      default:
        return <BellOutlined style={{ color: "#666" }} />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const notificationDropdown = (
    <div
      className="notification-dropdown"
      style={{ width: 380, maxHeight: 500, overflow: "hidden" }}
    >
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #f0f0f0" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text strong>Notifications</Text>
          <Space>
            {unreadCount > 0 && (
              <Button
                type="link"
                size="small"
                onClick={() => {
                  const unreadIds = notifications
                    .filter((n) => !n.is_read)
                    .map((n) => n.id);
                  if (unreadIds.length > 0) {
                    handleMarkAsRead(unreadIds);
                  }
                }}
              >
                Mark all read
              </Button>
            )}
            <Button
              type="link"
              size="small"
              icon={<MoreOutlined />}
              onClick={() => setIsModalVisible(true)}
            >
              View all
            </Button>
          </Space>
        </div>
      </div>

      <div style={{ maxHeight: 400, overflowY: "auto" }}>
        {loading && notifications.length === 0 ? (
          <div style={{ padding: 20, textAlign: "center" }}>
            <Spin />
          </div>
        ) : notifications.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No notifications"
            style={{ padding: 40 }}
          />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={notifications.slice(0, 10)}
            renderItem={(notification) => (
              <List.Item
                style={{
                  padding: "12px 16px",
                  backgroundColor: notification.is_read
                    ? "transparent"
                    : "#f6ffed",
                  borderBottom: "1px solid #f0f0f0",
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (!notification.is_read) {
                    handleMarkAsRead([notification.id]);
                  }
                  if (notification.cause_id) {
                    window.open(`/causes/${notification.cause_id}`, "_blank");
                  }
                }}
              >
                <List.Item.Meta
                  avatar={
                    <div style={{ position: "relative" }}>
                      {notification.trigger_user_avatar ? (
                        <Avatar
                          src={notification.trigger_user_avatar}
                          size={40}
                        />
                      ) : (
                        <Avatar
                          icon={getNotificationIcon(notification.type)}
                          size={40}
                        />
                      )}
                      {!notification.is_read && (
                        <div
                          style={{
                            position: "absolute",
                            top: -2,
                            right: -2,
                            width: 8,
                            height: 8,
                            backgroundColor: "#1890ff",
                            borderRadius: "50%",
                            border: "2px solid white",
                          }}
                        />
                      )}
                    </div>
                  }
                  title={
                    <div>
                      <Text
                        strong={!notification.is_read}
                        style={{ fontSize: 14 }}
                      >
                        {notification.title}
                      </Text>
                      <div
                        style={{ fontSize: 12, color: "#666", marginTop: 2 }}
                      >
                        {formatTimeAgo(notification.created_at)}
                      </div>
                    </div>
                  }
                  description={
                    <Text style={{ fontSize: 13, color: "#666" }}>
                      {notification.message}
                    </Text>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </div>

      {notifications.length > 10 && (
        <div
          style={{
            padding: "8px 16px",
            borderTop: "1px solid #f0f0f0",
            textAlign: "center",
          }}
        >
          <Button type="link" onClick={() => setIsModalVisible(true)}>
            View all notifications
          </Button>
        </div>
      )}
    </div>
  );

  const handleBulkAction = (action: "read" | "unread" | "delete") => {
    if (selectedNotifications.length === 0) {
      message.warning("Please select notifications first");
      return;
    }

    if (action === "delete") {
      Modal.confirm({
        title: "Delete notifications",
        content: `Are you sure you want to delete ${selectedNotifications.length} notification(s)?`,
        onOk: () => {
          handleDelete(selectedNotifications);
          setSelectedNotifications([]);
        },
      });
    } else {
      const apiAction = action === "read" ? "mark_read" : "mark_unread";
      fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: apiAction,
          notification_ids: selectedNotifications,
        }),
      }).then(() => {
        fetchNotifications(1, true);
        setSelectedNotifications([]);
        message.success(`Marked as ${action}`);
      });
    }
  };

  if (!session?.user) {
    return null;
  }

  return (
    <>
      <Dropdown
        overlay={notificationDropdown}
        trigger={["click"]}
        placement="bottomRight"
        overlayClassName="notification-dropdown-overlay"
      >
        <Badge count={unreadCount} size="small">
          <Button
            type="text"
            icon={<BellOutlined />}
            className={className}
            style={{
              border: "none",
              boxShadow: "none",
              color: unreadCount > 0 ? "#1890ff" : "inherit",
            }}
          />
        </Badge>
      </Dropdown>

      <Modal
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>All Notifications</span>
            {selectedNotifications.length > 0 && (
              <Space>
                <Button size="small" onClick={() => handleBulkAction("read")}>
                  Mark Read
                </Button>
                <Button size="small" onClick={() => handleBulkAction("unread")}>
                  Mark Unread
                </Button>
                <Button
                  size="small"
                  danger
                  onClick={() => handleBulkAction("delete")}
                >
                  Delete
                </Button>
              </Space>
            )}
          </div>
        }
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedNotifications([]);
        }}
        footer={null}
        width={600}
        style={{ top: 20 }}
      >
        <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
          {notifications.length === 0 ? (
            <Empty description="No notifications" />
          ) : (
            <List
              itemLayout="horizontal"
              dataSource={notifications}
              renderItem={(notification) => (
                <List.Item
                  style={{
                    backgroundColor: notification.is_read
                      ? "transparent"
                      : "#f6ffed",
                    padding: "12px",
                    borderRadius: 6,
                    marginBottom: 8,
                  }}
                  actions={[
                    <Checkbox
                      key="select"
                      checked={selectedNotifications.includes(notification.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedNotifications((prev) => [
                            ...prev,
                            notification.id,
                          ]);
                        } else {
                          setSelectedNotifications((prev) =>
                            prev.filter((id) => id !== notification.id),
                          );
                        }
                      }}
                    />,
                    <Tooltip
                      title={
                        notification.is_read ? "Mark as unread" : "Mark as read"
                      }
                      key="read"
                    >
                      <Button
                        type="text"
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => handleMarkAsRead([notification.id])}
                      />
                    </Tooltip>,
                    <Tooltip title="Delete" key="delete">
                      <Button
                        type="text"
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete([notification.id])}
                      />
                    </Tooltip>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <div style={{ position: "relative" }}>
                        {notification.trigger_user_avatar ? (
                          <Avatar
                            src={notification.trigger_user_avatar}
                            size={40}
                          />
                        ) : (
                          <Avatar
                            icon={getNotificationIcon(notification.type)}
                            size={40}
                          />
                        )}
                        {!notification.is_read && (
                          <div
                            style={{
                              position: "absolute",
                              top: -2,
                              right: -2,
                              width: 8,
                              height: 8,
                              backgroundColor: "#1890ff",
                              borderRadius: "50%",
                              border: "2px solid white",
                            }}
                          />
                        )}
                      </div>
                    }
                    title={
                      <div>
                        <Text strong={!notification.is_read}>
                          {notification.title}
                        </Text>
                        {notification.cause_title && (
                          <Link href={`/causes/${notification.cause_id}`}>
                            <Tag color="blue" style={{ marginLeft: 8 }}>
                              {notification.cause_title}
                            </Tag>
                          </Link>
                        )}
                        <div
                          style={{ fontSize: 12, color: "#666", marginTop: 4 }}
                        >
                          {formatTimeAgo(notification.created_at)}
                        </div>
                      </div>
                    }
                    description={notification.message}
                  />
                </List.Item>
              )}
            />
          )}

          {hasMore && (
            <div style={{ textAlign: "center", marginTop: 16 }}>
              <Button
                loading={loading}
                onClick={() => {
                  const nextPage = page + 1;
                  setPage(nextPage);
                  fetchNotifications(nextPage, false);
                }}
              >
                Load More
              </Button>
            </div>
          )}
        </div>
      </Modal>

      <style jsx global>{`
        .notification-dropdown-overlay .ant-dropdown-menu {
          padding: 0;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </>
  );
};
