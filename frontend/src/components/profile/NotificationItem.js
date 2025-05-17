import React from "react";
import { useDispatch } from "react-redux";
import { Typography, Tag, Button, Space, Badge } from "antd";
import {
  BellOutlined,
  HeartOutlined,
  DollarOutlined,
  CommentOutlined,
  InfoCircleOutlined,
  ExclamationCircleOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  LikeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import moment from "moment";

import { markNotificationAsRead } from "../../redux/slices/notificationsSlice";
import { isMobile } from "../../utils/responsive";

const { Text } = Typography;

const NotificationItem = ({ notification }) => {
  const dispatch = useDispatch();
  const mobile = isMobile();

  const { id, title, message, type, is_read, created_at, cause_id, metadata } =
    notification;

  const handleMarkAsRead = () => {
    if (!is_read) {
      dispatch(markNotificationAsRead(id));
    }
  };

  // Icon based on notification type
  let icon;
  let tagColor;
  let tagText;

  switch (type) {
    case "cause_update":
      icon = <InfoCircleOutlined style={{ color: "#1890ff" }} />;
      tagColor = "blue";
      tagText = "Update";
      break;
    case "contribution":
      icon = <DollarOutlined style={{ color: "#52c41a" }} />;
      tagColor = "green";
      tagText = "Contribution";
      break;
    case "feedback":
      icon = <CommentOutlined style={{ color: "#fa8c16" }} />;
      tagColor = "orange";
      tagText = "Feedback";
      break;
    case "milestone":
      icon = <TrophyOutlined style={{ color: "#eb2f96" }} />;
      tagColor = "pink";
      tagText = "Milestone";
      break;
    case "deadline":
      icon = <ClockCircleOutlined style={{ color: "#f5222d" }} />;
      tagColor = "red";
      tagText = "Deadline";
      break;
    case "thank_you":
      icon = <HeartOutlined style={{ color: "#eb2f96" }} />;
      tagColor = "magenta";
      tagText = "Thank You";
      break;
    case "admin":
      icon = <UserOutlined style={{ color: "#faad14" }} />;
      tagColor = "gold";
      tagText = "Admin";
      break;
    case "system":
      icon = <BellOutlined style={{ color: "#722ed1" }} />;
      tagColor = "purple";
      tagText = "System";
      break;
    default:
      icon = <BellOutlined style={{ color: "#bfbfbf" }} />;
      tagColor = "default";
      tagText = "Notification";
  }

  // Parse metadata if available
  let metadataContent = null;
  if (metadata && type === "milestone") {
    try {
      const parsedMetadata =
        typeof metadata === "string" ? JSON.parse(metadata) : metadata;
      if (parsedMetadata.milestone) {
        metadataContent = (
          <div className="notification-metadata">
            <Text strong>Milestone:</Text>{" "}
            <Text>{parsedMetadata.milestone}</Text>
          </div>
        );
      }
    } catch (e) {
      console.error("Failed to parse notification metadata:", e);
    }
  }

  return (
    <div
      className={`notification-item ${!is_read ? "unread" : ""}`}
      style={{
        padding: mobile ? "8px" : "12px",
        marginBottom: "10px",
        borderRadius: "4px",
        border: "1px solid #f0f0f0",
        backgroundColor: is_read ? "#fff" : "#f6f8fa",
        display: "flex",
        alignItems: "flex-start",
      }}
    >
      <div
        className="notification-icon"
        style={{
          fontSize: mobile ? "16px" : "20px",
          padding: mobile ? "4px" : "8px",
          marginRight: "10px",
        }}
      >
        {!is_read && <Badge dot />}
        {icon}
      </div>

      <div className="notification-content" style={{ flex: 1 }}>
        <div
          className="notification-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "4px",
          }}
        >
          <Text strong style={{ fontSize: mobile ? "14px" : "16px" }}>
            {title}
          </Text>
          <Text
            type="secondary"
            className="notification-time"
            style={{ fontSize: mobile ? "11px" : "12px" }}
          >
            {moment(created_at).fromNow()}
          </Text>
        </div>

        <Text
          className="notification-message"
          style={{
            display: "block",
            marginBottom: "8px",
            fontSize: mobile ? "12px" : "14px",
          }}
        >
          {message}
        </Text>

        {metadataContent}

        <div
          className="notification-actions"
          style={{
            marginTop: "8px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Space size={mobile ? "small" : "middle"}>
            {!is_read && (
              <Button size="small" onClick={handleMarkAsRead}>
                Mark as Read
              </Button>
            )}

            {cause_id && (
              <Link to={`/causes/${cause_id}`}>
                <Button size="small" type="link">
                  View Cause
                </Button>
              </Link>
            )}
          </Space>

          <Tag color={tagColor}>{tagText}</Tag>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
