import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Typography,
  Row,
  Col,
  Card,
  Progress,
  Button,
  Tag,
  Avatar,
  Divider,
  Tabs,
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
  Skeleton,
  notification,
  Space,
  Breadcrumb,
  Image,
  Empty,
  Descriptions,
  List,
} from "antd";
import {
  HeartOutlined,
  HeartFilled,
  EditOutlined,
  DeleteOutlined,
  DollarOutlined,
  GiftOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  UserOutlined,
  ShareAltOutlined,
  CommentOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  TeamOutlined,
  HistoryOutlined,
  FileTextOutlined,
  TagOutlined,
} from "@ant-design/icons";
import moment from "moment";

import {
  getCauseById,
  getCauseFieldValues,
  toggleFollowCause,
  deleteCause,
} from "../../redux/slices/causesSlice";
import { createContribution } from "../../redux/slices/contributionsSlice";
import { createFeedback } from "../../redux/slices/feedbackSlice";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

const CauseDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cause, isLoading } = useSelector((state) => state.causes);
  const { user } = useSelector((state) => state.auth);

  const [isFollowing, setIsFollowing] = useState(false);
  const [isContributeModalVisible, setIsContributeModalVisible] =
    useState(false);
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [categoryFieldValues, setCategoryFieldValues] = useState([]);
  const [contributeForm] = Form.useForm();
  const [feedbackForm] = Form.useForm();

  // Check if user is the creator or admin
  const isCreatorOrAdmin =
    user && cause && (user.id === cause.user_id || user.is_admin);

  useEffect(() => {
    dispatch(getCauseById(id));

    // Fetch category field values
    dispatch(getCauseFieldValues(id))
      .unwrap()
      .then((values) => {
        setCategoryFieldValues(values);
      })
      .catch((error) => {
        console.error("Error fetching category values:", error);
      });
  }, [dispatch, id]);
  useEffect(() => {
    if (cause && user) {
      setIsFollowing(cause.isFollowing || false);
    }
  }, [cause, user]);
  const handleFollowToggle = () => {
    if (!user) {
      notification.warning({
        message: "Authentication Required",
        description: "Please log in or register to follow this cause.",
      });
      return;
    }

    dispatch(toggleFollowCause({ id, isFollowing }))
      .unwrap()
      .then((result) => {
        setIsFollowing(result.isFollowing);
        notification.success({
          message: result.isFollowing ? "Cause Followed" : "Cause Unfollowed",
          description: result.isFollowing
            ? "You will now receive updates about this cause."
            : "You will no longer receive updates about this cause.",
        });
      })
      .catch((error) => {
        notification.error({
          message: "Action Failed",
          description: error,
        });
      });
  };

  const handleContributeSubmit = (values) => {
    if (!user) {
      notification.warning({
        message: "Authentication Required",
        description: "Please log in or register to contribute to this cause.",
      });
      return;
    }

    const contributionData = {
      ...values,
      cause_id: id,
    };

    dispatch(createContribution(contributionData))
      .unwrap()
      .then(() => {
        notification.success({
          message: "Contribution Successful",
          description: "Thank you for your support!",
        });
        setIsContributeModalVisible(false);
        contributeForm.resetFields();
        dispatch(getCauseById(id)); // Refresh cause data
      })
      .catch((error) => {
        notification.error({
          message: "Contribution Failed",
          description: error,
        });
      });
  };

  const handleFeedbackSubmit = (values) => {
    if (!user) {
      notification.warning({
        message: "Authentication Required",
        description: "Please log in or register to leave feedback.",
      });
      return;
    }

    const feedbackData = {
      ...values,
      cause_id: id,
    };

    dispatch(createFeedback(feedbackData))
      .unwrap()
      .then(() => {
        notification.success({
          message: "Feedback Submitted",
          description: "Thank you for your feedback!",
        });
        setIsFeedbackModalVisible(false);
        feedbackForm.resetFields();
        dispatch(getCauseById(id)); // Refresh cause data
      })
      .catch((error) => {
        notification.error({
          message: "Feedback Submission Failed",
          description: error,
        });
      });
  };

  const handleDeleteConfirm = () => {
    dispatch(deleteCause(id))
      .unwrap()
      .then(() => {
        notification.success({
          message: "Cause Deleted",
          description: "The cause has been successfully deleted.",
        });
        navigate("/causes");
      })
      .catch((error) => {
        notification.error({
          message: "Deletion Failed",
          description: error,
        });
      });
  };

  if (isLoading || !cause) {
    return (
      <div className="cause-details-page">
        <Skeleton active paragraph={{ rows: 12 }} />
      </div>
    );
  }
  // Calculate progress percentages
  const fundingPercentage = cause.funding_goal
    ? Math.min(
        Math.round(
          (Number(cause.current_funding) / Number(cause.funding_goal)) * 100
        ),
        100
      )
    : 0;

  const foodPercentage = cause.food_goal
    ? Math.min(
        Math.round(
          (Number(cause.current_food) / Number(cause.food_goal)) * 100
        ),
        100
      )
    : 0;

  // Set category colors
  const categoryColors = {
    local: "blue",
    emergency: "red",
    recurring: "green",
  };

  // Set status colors
  const statusColors = {
    active: "green",
    completed: "blue",
    suspended: "red",
  };

  return (
    <div className="cause-details-page">
      {/* Breadcrumb Navigation */}
      <Breadcrumb className="breadcrumb-navigation">
        <Breadcrumb.Item>
          <Link to="/">
            <HomeOutlined /> Home
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/causes">
            <HeartOutlined /> Causes
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{cause.title}</Breadcrumb.Item>
      </Breadcrumb>

      <Row gutter={[24, 24]}>
        {/* Main Content Column */}
        <Col xs={24} lg={16}>
          <Card className="card-elevated" style={{ marginBottom: 24 }}>
            {/* Image Section */}{" "}
            <div className="cause-image" style={{ position: "relative" }}>
              {cause.image ? (
                <Image
                  src={cause.image}
                  alt={cause.title}
                  style={{
                    objectFit: "cover",
                    maxHeight: "400px",
                    width: "100%",
                  }}
                  fallback="/assets/default-cause.jpg"
                  preview={true}
                />
              ) : (
                <div
                  style={{
                    height: 300,
                    background: "#f0f0f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  <HeartOutlined
                    style={{ fontSize: 48, color: "#d9d9d9", marginBottom: 16 }}
                  />
                  <Text type="secondary">No image available</Text>
                </div>
              )}

              <div
                style={{ position: "absolute", top: 16, right: 16, zIndex: 1 }}
              >
                <Space size="small">
                  {" "}
                  <Tag
                    color={
                      categoryColors[
                        cause.category_id ? cause.category_id : 0
                      ] || "blue"
                    }
                    style={{ fontSize: "14px" }}
                  >
                    {cause.category_name
                      ? cause.category_name
                      : cause.category
                      ? cause.category.charAt(0).toUpperCase() +
                        cause.category.slice(1)
                      : "Unknown"}
                  </Tag>
                  <Tag
                    color={statusColors[cause.status] || "green"}
                    style={{ fontSize: "14px" }}
                  >
                    {cause.status.charAt(0).toUpperCase() +
                      cause.status.slice(1)}
                  </Tag>
                </Space>
              </div>
            </div>
            {/* Title and Meta Information */}
            <div style={{ padding: "16px 24px" }}>
              <Title level={2} style={{ marginBottom: 12 }}>
                {cause.title}
              </Title>

              <div className="cause-meta" style={{ marginBottom: 16 }}>
                <Space split={<Divider type="vertical" />} wrap>
                  <Text>
                    <EnvironmentOutlined style={{ color: "#1890ff" }} />{" "}
                    {cause.location || "No location specified"}
                  </Text>
                  <Text>
                    <CalendarOutlined style={{ color: "#1890ff" }} />{" "}
                    {moment(cause.created_at).format("MMM DD, YYYY")}
                  </Text>
                  <Text>
                    <UserOutlined style={{ color: "#1890ff" }} />{" "}
                    {cause.creator_name || "Anonymous"}
                  </Text>
                </Space>
              </div>

              <Divider style={{ margin: "8px 0 24px" }} />

              {/* Description */}
              <div className="cause-description">
                <Title level={4}>
                  <InfoCircleOutlined style={{ marginRight: 8 }} />
                  About This Cause
                </Title>
                <Paragraph
                  style={{ fontSize: 16, lineHeight: 1.6, marginBottom: 24 }}
                >
                  {cause.description || "No description provided."}
                </Paragraph>
              </div>

              {/* Category Fields Section - Styled for better appeal */}
              {categoryFieldValues && categoryFieldValues.length > 0 && (
                <div className="cause-category-fields">
                  <Title level={4}>
                    <TagOutlined style={{ marginRight: 8, color: "#1890ff" }} />
                    Category Details
                  </Title>

                  <Card
                    bordered={false}
                    className="category-fields-card"
                    style={{
                      backgroundColor: "#f9f9f9",
                      marginBottom: 24,
                      borderRadius: 8,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    }}
                  >
                    <Row gutter={[16, 16]}>
                      {categoryFieldValues.map((field) => {
                        // Render different field types appropriately
                        let fieldValue = field.value;
                        let fieldIcon = null;

                        // Assign icons based on field type
                        switch (field.type) {
                          case "date":
                            fieldIcon = (
                              <CalendarOutlined style={{ color: "#1890ff" }} />
                            );
                            fieldValue = field.value
                              ? moment(field.value).format("MMMM DD, YYYY")
                              : null;
                            break;
                          case "text":
                          case "textarea":
                            fieldIcon = (
                              <FileTextOutlined style={{ color: "#1890ff" }} />
                            );
                            break;
                          case "select":
                          case "radio":
                          case "checkbox":
                            fieldIcon = (
                              <TagOutlined style={{ color: "#1890ff" }} />
                            );
                            if (field.type === "checkbox" && field.value) {
                              try {
                                const values = JSON.parse(field.value);
                                if (Array.isArray(values)) {
                                  fieldValue = (
                                    <Space size={[0, 8]} wrap>
                                      {values.map((val, idx) => (
                                        <Tag key={idx} color="blue">
                                          {val}
                                        </Tag>
                                      ))}
                                    </Space>
                                  );
                                }
                              } catch (e) {
                                // If parsing fails, try comma-separated values
                                if (
                                  typeof field.value === "string" &&
                                  field.value.includes(",")
                                ) {
                                  const values = field.value.split(",");
                                  fieldValue = (
                                    <Space size={[0, 8]} wrap>
                                      {values.map((val, idx) => (
                                        <Tag key={idx} color="blue">
                                          {val}
                                        </Tag>
                                      ))}
                                    </Space>
                                  );
                                } else {
                                  console.error(
                                    "Error parsing checkbox value:",
                                    e
                                  );
                                }
                              }
                            } else if (field.value) {
                              fieldValue = (
                                <Tag color="blue">{field.value}</Tag>
                              );
                            }
                            break;
                          default:
                            fieldIcon = (
                              <InfoCircleOutlined
                                style={{ color: "#1890ff" }}
                              />
                            );
                        }

                        return (
                          <Col xs={24} sm={12} key={field.id}>
                            <Card
                              size="small"
                              bordered={false}
                              style={{
                                height: "100%",
                                background: "white",
                                borderRadius: 4,
                                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  marginBottom: 8,
                                }}
                              >
                                <span style={{ marginRight: 8 }}>
                                  {fieldIcon}
                                </span>
                                <Text strong>{field.name}</Text>
                                {field.required && (
                                  <Tag
                                    color="red"
                                    style={{ marginLeft: 8, fontSize: "0.8em" }}
                                  >
                                    Required
                                  </Tag>
                                )}
                              </div>
                              <div style={{ marginLeft: 24 }}>
                                {fieldValue ? (
                                  <div>{fieldValue}</div>
                                ) : (
                                  <Text type="secondary">Not provided</Text>
                                )}
                              </div>
                            </Card>
                          </Col>
                        );
                      })}
                    </Row>
                  </Card>
                </div>
              )}

              {/* Progress Section */}
              <Title level={4} style={{ marginTop: 24 }}>
                <TeamOutlined style={{ marginRight: 8 }} />
                Progress
              </Title>

              {cause.funding_goal > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 4,
                    }}
                  >
                    <Text strong>Funding Goal</Text>
                    <Text>
                      ${Number(cause.current_funding).toFixed(2)} of $
                      {Number(cause.funding_goal).toFixed(2)}
                    </Text>
                  </div>
                  <Progress
                    percent={fundingPercentage}
                    status={fundingPercentage >= 100 ? "success" : "active"}
                    strokeColor={{
                      from: "#108ee9",
                      to: "#87d068",
                    }}
                  />
                </div>
              )}

              {cause.food_goal > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 4,
                    }}
                  >
                    <Text strong>Food Items Goal</Text>
                    <Text>
                      {cause.current_food} of {cause.food_goal} items
                    </Text>
                  </div>
                  <Progress
                    percent={foodPercentage}
                    status={foodPercentage >= 100 ? "success" : "active"}
                    strokeColor={{
                      from: "#fa8c16",
                      to: "#faad14",
                    }}
                  />
                </div>
              )}

              {/* Stats Section */}
              <div
                className="cause-stats"
                style={{
                  marginTop: 24,
                  background: "#f9f9f9",
                  padding: 16,
                  borderRadius: 8,
                }}
              >
                <div className="stats-item">
                  <Text
                    style={{
                      fontSize: 28,
                      fontWeight: "bold",
                      color: "#1890ff",
                    }}
                  >
                    {cause.contributions_count || 0}
                  </Text>
                  <Text type="secondary">Contributors</Text>
                </div>
                <div className="stats-item">
                  <Text
                    style={{
                      fontSize: 28,
                      fontWeight: "bold",
                      color: "#1890ff",
                    }}
                  >
                    {cause.followers_count || 0}
                  </Text>
                  <Text type="secondary">Followers</Text>
                </div>
                <div className="stats-item">
                  <Text
                    style={{
                      fontSize: 28,
                      fontWeight: "bold",
                      color: "#1890ff",
                    }}
                  >
                    {moment(cause.created_at).fromNow()}
                  </Text>
                  <Text type="secondary">Started</Text>
                </div>
              </div>
            </div>
          </Card>

          {/* Tabs for Additional Information */}
          <Card className="card-elevated">
            <Tabs defaultActiveKey="1" size="large">
              {" "}
              <TabPane
                tab={
                  <span>
                    <HistoryOutlined style={{ marginRight: 8 }} />
                    Updates
                  </span>
                }
                key="1"
              >
                {cause.updates && cause.updates.length > 0 ? (
                  cause.updates.map((update) => (
                    <div key={update.id} style={{ marginBottom: 24 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: 8,
                        }}
                      >
                        {" "}
                        <Avatar
                          src={update.user_avatar || null}
                          icon={!update.user_avatar && <UserOutlined />}
                        />
                        <div style={{ marginLeft: 12 }}>
                          <Text strong>
                            {update.user_name || "Administrator"}
                          </Text>
                          <br />
                          <Text type="secondary">
                            {moment(update.created_at).format("MMM DD, YYYY")}
                          </Text>
                        </div>
                      </div>
                      <div style={{ marginLeft: 48 }}>
                        <Paragraph>{update.content}</Paragraph>
                      </div>
                      <Divider style={{ margin: "12px 0" }} />
                    </div>
                  ))
                ) : (
                  <Empty
                    description="No updates have been posted yet"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    style={{ margin: "40px 0" }}
                  />
                )}
              </TabPane>{" "}
              <TabPane
                tab={
                  <span>
                    <CommentOutlined style={{ marginRight: 8 }} />
                    Feedback
                  </span>
                }
                key="2"
              >
                {cause.feedback && cause.feedback.length > 0 ? (
                  cause.feedback.map((feedback) => (
                    <div
                      className="feedback-item"
                      key={feedback.id}
                      style={{ marginBottom: 24 }}
                    >
                      <div style={{ display: "flex" }}>
                        {" "}
                        <Avatar
                          src={feedback.user_avatar || null}
                          icon={!feedback.user_avatar && <UserOutlined />}
                          style={{ flexShrink: 0 }}
                        />
                        <div style={{ marginLeft: 12, flex: 1 }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Text strong>
                              {feedback.user_name || "Anonymous"}
                            </Text>
                            <Text type="secondary">
                              {moment(feedback.created_at).fromNow()}
                            </Text>
                          </div>
                          <div className="rating" style={{ marginTop: 4 }}>
                            {Array(5)
                              .fill(0)
                              .map((_, index) => (
                                <span
                                  key={index}
                                  className={`star ${
                                    index < feedback.rating ? "filled" : ""
                                  }`}
                                  style={{
                                    color:
                                      index < feedback.rating
                                        ? "#faad14"
                                        : "#d9d9d9",
                                    fontSize: "16px",
                                    marginRight: "3px",
                                  }}
                                >
                                  ★
                                </span>
                              ))}
                          </div>
                          {feedback.comment && (
                            <Paragraph
                              style={{
                                marginTop: 8,
                                fontStyle: "italic",
                                background: "#f8f8f8",
                                padding: "8px 12px",
                                borderRadius: "4px",
                              }}
                            >
                              "{feedback.comment}"
                            </Paragraph>
                          )}
                        </div>
                      </div>
                      <Divider style={{ margin: "12px 0" }} />
                    </div>
                  ))
                ) : (
                  <Empty
                    description="No feedback has been provided yet"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    style={{ margin: "40px 0" }}
                  />
                )}
              </TabPane>{" "}
              <TabPane
                tab={
                  <span>
                    <FileTextOutlined style={{ marginRight: 8 }} />
                    Category Details
                  </span>
                }
                key="3"
              >
                {categoryFieldValues && categoryFieldValues.length > 0 ? (
                  <List
                    itemLayout="horizontal"
                    dataSource={categoryFieldValues}
                    renderItem={(field) => {
                      // Render different field types appropriately
                      let fieldValue = field.value;
                      let fieldIcon = null;

                      // Assign icons based on field type
                      switch (field.type) {
                        case "date":
                          fieldIcon = (
                            <CalendarOutlined style={{ color: "#1890ff" }} />
                          );
                          fieldValue = field.value
                            ? moment(field.value).format("MMMM DD, YYYY")
                            : null;
                          break;
                        case "text":
                        case "textarea":
                          fieldIcon = (
                            <FileTextOutlined style={{ color: "#1890ff" }} />
                          );
                          break;
                        case "select":
                        case "radio":
                        case "checkbox":
                          fieldIcon = (
                            <TagOutlined style={{ color: "#1890ff" }} />
                          );

                          if (field.type === "checkbox" && field.value) {
                            try {
                              const values = JSON.parse(field.value);
                              if (Array.isArray(values)) {
                                fieldValue = (
                                  <Space size={[0, 8]} wrap>
                                    {values.map((val, idx) => (
                                      <Tag key={idx} color="blue">
                                        {val}
                                      </Tag>
                                    ))}
                                  </Space>
                                );
                              }
                            } catch (e) {
                              console.error("Error parsing checkbox value:", e);
                            }
                          } else if (field.value) {
                            fieldValue = <Tag color="blue">{field.value}</Tag>;
                          }
                          break;
                        default:
                          fieldIcon = (
                            <InfoCircleOutlined style={{ color: "#1890ff" }} />
                          );
                      }

                      return (
                        <List.Item>
                          <List.Item.Meta
                            avatar={
                              <Avatar
                                icon={fieldIcon}
                                style={{ backgroundColor: "#f0f5ff" }}
                              />
                            }
                            title={
                              <div>
                                {field.name}
                                {field.required && (
                                  <Tag
                                    color="red"
                                    style={{ marginLeft: 8, fontSize: "0.8em" }}
                                  >
                                    Required
                                  </Tag>
                                )}
                              </div>
                            }
                            description={
                              <div style={{ padding: "8px 0" }}>
                                {fieldValue || (
                                  <Text type="secondary">Not provided</Text>
                                )}
                              </div>
                            }
                          />
                        </List.Item>
                      );
                    }}
                  />
                ) : (
                  <Empty
                    description="No category details available"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    style={{ margin: "40px 0" }}
                  />
                )}
              </TabPane>
            </Tabs>
          </Card>
        </Col>

        {/* Sidebar Column */}
        <Col xs={24} lg={8}>
          {/* Action Card */}
          <Card className="card-elevated" style={{ marginBottom: 24 }}>
            <Title level={4} style={{ marginBottom: 16 }}>
              Support This Cause
            </Title>

            <div className="action-buttons">
              <Button
                type="primary"
                block
                size="large"
                icon={<DollarOutlined />}
                onClick={() => setIsContributeModalVisible(true)}
                style={{ marginBottom: 12, height: 48 }}
              >
                Contribute Now
              </Button>

              <Button
                type={isFollowing ? "default" : "dashed"}
                block
                size="large"
                icon={
                  isFollowing ? (
                    <HeartFilled style={{ color: "#ff4d4f" }} />
                  ) : (
                    <HeartOutlined />
                  )
                }
                onClick={handleFollowToggle}
                className="follow-button"
                style={{ marginBottom: 12 }}
              >
                {isFollowing ? "Following" : "Follow This Cause"}
              </Button>

              <Button
                type="default"
                block
                size="large"
                icon={<CommentOutlined />}
                onClick={() => setIsFeedbackModalVisible(true)}
                className="feedback-button"
                style={{ marginBottom: 12 }}
              >
                Leave Feedback
              </Button>

              <Button
                type="default"
                block
                size="large"
                icon={<ShareAltOutlined />}
                className="share-button"
              >
                Share This Cause
              </Button>
            </div>

            {isCreatorOrAdmin && (
              <>
                <Divider style={{ margin: "24px 0 16px" }} />
                <Title level={5}>Admin Actions</Title>
                <div
                  className="admin-actions"
                  style={{ display: "flex", gap: 8 }}
                >
                  <Button
                    type="default"
                    icon={<EditOutlined />}
                    onClick={() => navigate(`/causes/${id}/edit`)}
                    style={{ flex: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => setIsDeleteModalVisible(true)}
                    style={{ flex: 1 }}
                  >
                    Delete
                  </Button>
                </div>
              </>
            )}
          </Card>

          {/* Creator Info Card */}
          <Card className="card-elevated" style={{ marginBottom: 24 }}>
            <Title level={4} style={{ marginBottom: 16 }}>
              About the Creator
            </Title>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              {" "}
              <Avatar
                size={64}
                src={cause.creator_avatar || null}
                icon={!cause.creator_avatar && <UserOutlined />}
              />
              <div style={{ marginLeft: 16 }}>
                <Text strong style={{ fontSize: 16, display: "block" }}>
                  {cause.creator_name || "Anonymous"}
                </Text>
                <Text type="secondary">
                  Member since{" "}
                  {moment(cause.creator_joined || cause.created_at).format(
                    "MMM YYYY"
                  )}
                </Text>
              </div>
            </div>
            {cause.creator_bio ? (
              <Paragraph>{cause.creator_bio}</Paragraph>
            ) : (
              <Paragraph type="secondary">
                No additional information provided by the creator.
              </Paragraph>
            )}
            {cause.creator_email && (
              <Button
                type="link"
                icon={<MailOutlined />}
                href={`mailto:${cause.creator_email}`}
                style={{ padding: 0 }}
              >
                Contact Creator
              </Button>
            )}
          </Card>

          {/* Similar Causes Card (if available) */}
          {cause.similar_causes && cause.similar_causes.length > 0 && (
            <Card className="card-elevated">
              <Title level={4} style={{ marginBottom: 16 }}>
                Similar Causes
              </Title>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {cause.similar_causes.map((similarCause) => (
                  <Link to={`/causes/${similarCause.id}`} key={similarCause.id}>
                    <Card size="small" hoverable>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div
                          style={{
                            width: 60,
                            height: 60,
                            marginRight: 12,
                            overflow: "hidden",
                            borderRadius: 4,
                            flexShrink: 0,
                          }}
                        >
                          {" "}
                          {similarCause.image ? (
                            <img
                              src={similarCause.image}
                              alt={similarCause.title}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: "100%",
                                height: "100%",
                                background: "#f0f0f0",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <HeartOutlined style={{ color: "#d9d9d9" }} />
                            </div>
                          )}
                        </div>
                        <div style={{ flex: 1 }}>
                          <Text
                            strong
                            ellipsis={{ tooltip: similarCause.title }}
                          >
                            {similarCause.title}
                          </Text>
                          <Progress
                            percent={similarCause.progress || 0}
                            size="small"
                            showInfo={false}
                            style={{ marginTop: 8 }}
                          />
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </Card>
          )}
        </Col>
      </Row>

      {/* Contribute Modal */}
      <Modal
        title="Contribute to this Cause"
        visible={isContributeModalVisible}
        onCancel={() => setIsContributeModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={contributeForm}
          layout="vertical"
          onFinish={handleContributeSubmit}
          initialValues={{ amount: 20, food_quantity: 0, anonymous: false }}
        >
          <Form.Item
            name="amount"
            label="Monetary Contribution ($)"
            rules={[
              {
                type: "number",
                min: 0,
                message: "Amount must be greater than or equal to 0",
              },
            ]}
          >
            <InputNumber
              prefix={<DollarOutlined />}
              style={{ width: "100%" }}
              min={0}
              step={5}
            />
          </Form.Item>

          <Form.Item
            name="food_quantity"
            label="Food Items (quantity)"
            rules={[
              {
                type: "number",
                min: 0,
                message: "Quantity must be greater than or equal to 0",
              },
            ]}
          >
            <InputNumber
              prefix={<GiftOutlined />}
              style={{ width: "100%" }}
              min={0}
              step={1}
            />
          </Form.Item>

          <Form.Item name="message" label="Message (optional)">
            <TextArea
              rows={4}
              placeholder="Add a message of support (optional)"
            />
          </Form.Item>

          <Form.Item
            name="anonymous"
            valuePropName="checked"
            extra="Your name will not be displayed publicly with your contribution"
          >
            <Switch /> Make this contribution anonymous
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Space>
              <Button type="primary" htmlType="submit">
                Contribute Now
              </Button>
              <Button onClick={() => setIsContributeModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Feedback Modal */}
      <Modal
        title="Leave Feedback"
        visible={isFeedbackModalVisible}
        onCancel={() => setIsFeedbackModalVisible(false)}
        footer={null}
      >
        <Form
          form={feedbackForm}
          layout="vertical"
          onFinish={handleFeedbackSubmit}
        >
          <Form.Item
            name="rating"
            label="Rating"
            rules={[{ required: true, message: "Please rate this cause" }]}
          >
            <div
              className="rating-selector"
              style={{ fontSize: 30, color: "#faad14", cursor: "pointer" }}
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <span
                  key={value}
                  className="rating-star"
                  onClick={() => feedbackForm.setFieldsValue({ rating: value })}
                  style={{ marginRight: 8 }}
                >
                  ★
                </span>
              ))}
            </div>
          </Form.Item>

          <Form.Item
            name="comment"
            label="Comment"
            rules={[
              {
                required: true,
                message: "Please share your thoughts about this cause",
              },
            ]}
          >
            <TextArea rows={4} placeholder="Write your feedback here" />
          </Form.Item>

          <Form.Item
            name="anonymous"
            valuePropName="checked"
            extra="Your name will not be displayed publicly with your feedback"
          >
            <Switch /> Post anonymously
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Submit Feedback
              </Button>
              <Button onClick={() => setIsFeedbackModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Deletion"
        visible={isDeleteModalVisible}
        onCancel={() => setIsDeleteModalVisible(false)}
        onOk={handleDeleteConfirm}
        okText="Yes, Delete"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
      >
        <p>
          Are you sure you want to delete this cause? This action cannot be
          undone.
        </p>
      </Modal>
    </div>
  );
};

export default CauseDetailsPage;
