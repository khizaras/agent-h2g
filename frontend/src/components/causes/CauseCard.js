import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  Tag,
  Progress,
  Avatar,
  Space,
  Typography,
  Button,
  Divider,
} from "antd";
import {
  UserOutlined,
  EnvironmentOutlined,
  HeartOutlined,
  CalendarOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { isMobile } from "../../utils/responsive";
import moment from "moment";
import "./CauseCard.css";

const { Meta } = Card;
const { Text, Paragraph } = Typography;

const CauseCard = ({ cause }) => {
  const {
    id,
    title,
    description,
    image,
    location,
    category,
    funding_goal,
    current_funding,
    food_goal,
    current_food,
    creator_name,
    creator_avatar,
    status,
    created_at,
  } = cause;

  const mobile = isMobile();
  // Calculate percentages for progress bars
  const fundingPercentage = funding_goal
    ? Math.min(
        Math.round((Number(current_funding) / Number(funding_goal)) * 100),
        100
      )
    : 0;

  const foodPercentage = food_goal
    ? Math.min(
        Math.round((Number(current_food) / Number(food_goal)) * 100),
        100
      )
    : 0;

  // Set category colors
  const categoryColors = {
    local: "blue",
    emergency: "red",
    recurring: "green",
    default: "purple",
  };

  // Set status colors
  const statusColors = {
    active: "green",
    completed: "blue",
    suspended: "red",
    default: "gray",
  };

  // Format description to be shorter
  const shortDescription =
    description && description.length > (mobile ? 80 : 120)
      ? `${description.substring(0, mobile ? 80 : 120)}...`
      : description;
  return (
    <Card
      hoverable
      className="cause-card"
      cover={
        <div className="cause-image-container">
          {" "}
          {image ? (
            <img alt={title} src={image} className="cause-image" />
          ) : (
            <div className="cause-image-placeholder">
              <HeartOutlined style={{ fontSize: 48, marginBottom: 8 }} />
              <Text type="secondary">No image available</Text>
            </div>
          )}
          <div className="cause-tag-container">
            <div>
              <Tag color={categoryColors[category] || categoryColors.default}>
                {category
                  ? category.charAt(0).toUpperCase() + category.slice(1)
                  : "Miscellaneous"}
              </Tag>
            </div>
            <div>
              <Tag color={statusColors[status] || statusColors.default}>
                {status
                  ? status.charAt(0).toUpperCase() + status.slice(1)
                  : "Unknown"}
              </Tag>
            </div>
          </div>
        </div>
      }
      bodyStyle={{ padding: "16px 20px" }}
    >
      <Meta
        title={
          <Link to={`/causes/${id}`} style={{ fontSize: 18, fontWeight: 600 }}>
            {title}
          </Link>
        }
        description={
          <div className="cause-card-content">
            {" "}
            <div className="cause-location-date">
              <div
                style={{
                  marginRight: 16,
                  marginBottom: 4,
                  display: "flex",
                  alignItems: "center",
                  maxWidth: "100%",
                  overflow: "hidden",
                }}
              >
                <EnvironmentOutlined
                  style={{ color: "#1890ff", marginRight: 4, flexShrink: 0 }}
                />
                <Text
                  type="secondary"
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {location || "No location specified"}
                </Text>
              </div>

              <div
                style={{ display: "flex", alignItems: "center", flexShrink: 0 }}
              >
                <CalendarOutlined
                  style={{ color: "#1890ff", marginRight: 4 }}
                />
                <Text type="secondary">
                  {moment(created_at).format("MMM DD, YYYY")}
                </Text>
              </div>
            </div>{" "}
            <div
              className="cause-description"
              style={{
                height: "3em",
                overflow: "hidden",
                marginBottom: "16px",
              }}
            >
              <Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: 0 }}>
                {shortDescription || "No description available"}
              </Paragraph>
            </div>
            <div className="cause-progress">
              {funding_goal > 0 && (
                <div className="cause-progress-item">
                  <div className="cause-progress-header">
                    <Text strong style={{ fontSize: 13 }}>
                      Funding Progress
                    </Text>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      ${Number(current_funding).toFixed(2)} of $
                      {Number(funding_goal).toFixed(2)}
                    </Text>
                  </div>
                  <Progress
                    percent={fundingPercentage}
                    status={fundingPercentage >= 100 ? "success" : "active"}
                    showInfo={false}
                    size="small"
                    strokeColor={{
                      from: "#108ee9",
                      to: "#87d068",
                    }}
                  />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {fundingPercentage}% funded
                  </Text>
                </div>
              )}

              {food_goal > 0 && (
                <div
                  className="cause-progress-item"
                  style={{ marginBottom: 0 }}
                >
                  <div className="cause-progress-header">
                    <Text strong style={{ fontSize: 13 }}>
                      Food Items
                    </Text>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      {current_food} of {food_goal} items
                    </Text>
                  </div>
                  <Progress
                    percent={foodPercentage}
                    status={foodPercentage >= 100 ? "success" : "active"}
                    showInfo={false}
                    size="small"
                    strokeColor={{
                      from: "#fa8c16",
                      to: "#faad14",
                    }}
                  />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {foodPercentage}% collected
                  </Text>
                </div>
              )}
            </div>
            <Divider style={{ margin: "12px 0" }} />
            <div className="cause-footer">
              <div className="cause-creator">
                <Avatar
                  src={creator_avatar}
                  icon={!creator_avatar && <UserOutlined />}
                  size="small"
                />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {creator_name || "Anonymous"}
                </Text>
              </div>

              <Button type="primary" size="small" icon={<ArrowRightOutlined />}>
                <Link to={`/causes/${id}`} style={{ color: "inherit" }}>
                  View Details
                </Link>
              </Button>
            </div>
          </div>
        }
      />
    </Card>
  );
};

export default CauseCard;
