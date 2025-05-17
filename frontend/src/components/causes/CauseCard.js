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
        <div
          style={{
            height: 200,
            overflow: "hidden",
            background: "#f0f0f0",
            position: "relative",
          }}
        >
          {image ? (
            <img
              alt={title}
              src={image}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                color: "#999",
                flexDirection: "column",
              }}
            >
              <HeartOutlined style={{ fontSize: 48, marginBottom: 8 }} />
              <Text type="secondary">No image available</Text>
            </div>
          )}

          <div
            style={{
              position: "absolute",
              top: 8,
              left: 8,
              zIndex: 1,
            }}
          >
            <Tag color={categoryColors[category] || categoryColors.default}>
              {category || "Miscellaneous"}
            </Tag>
          </div>

          <div
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 1,
            }}
          >
            <Tag color={statusColors[status] || statusColors.default}>
              {status || "Unknown"}
            </Tag>
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
            <Space align="center" size="small" style={{ marginBottom: 12 }}>
              <EnvironmentOutlined style={{ color: "#1890ff" }} />
              <Text type="secondary">
                {location || "No location specified"}
              </Text>

              <CalendarOutlined style={{ color: "#1890ff", marginLeft: 8 }} />
              <Text type="secondary">
                {moment(created_at).format("MMM DD, YYYY")}
              </Text>
            </Space>

            <Paragraph
              ellipsis={{ rows: 2 }}
              style={{ marginBottom: 16, minHeight: 42 }}
            >
              {shortDescription || "No description available"}
            </Paragraph>

            <div className="cause-progress">
              {funding_goal > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 4,
                    }}
                  >
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
                <div style={{ marginBottom: 12 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 4,
                    }}
                  >
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

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Space align="center" size="small">
                <Avatar
                  src={creator_avatar}
                  icon={!creator_avatar && <UserOutlined />}
                  size="small"
                />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {creator_name || "Anonymous"}
                </Text>
              </Space>

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
