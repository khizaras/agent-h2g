import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Typography,
  Card,
  List,
  Avatar,
  Badge,
  Space,
  Button,
  Modal,
  Empty,
  Spin,
  Tag,
  Alert,
} from "antd";
import {
  UserOutlined,
  RobotOutlined,
  EyeOutlined,
  HistoryOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import "../styles/ChatHistory.css";
import { Navigate, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import moment from "moment";
import {
  fetchChatHistory,
  fetchSessionMessages,
} from "../redux/slices/chatbotSlice";
import ChatStatistics from "../components/chatbot/ChatStatistics";
import { toast } from "react-toastify";

const { Title, Text } = Typography;

const ChatHistoryPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { chatHistory, isLoading } = useSelector((state) => state.chatbot);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionMessages, setSessionMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [userStats, setUserStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }
  // Fetch chat history and user statistics
  useEffect(() => {
    dispatch(fetchChatHistory());

    const fetchUserStats = async () => {
      setLoadingStats(true);
      try {
        const response = await fetch(`/api/chatbot/stats/user/${user.id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setUserStats(data.stats);
        }
      } catch (error) {
        console.error("Error fetching user stats:", error);
        toast.error("Failed to load user statistics");
      } finally {
        setLoadingStats(false);
      }
    };

    fetchUserStats();
  }, [dispatch, user.id, user.token]);
  const handleViewSession = async (sessionId) => {
    setLoadingMessages(true);
    setSelectedSession(sessionId);
    setModalVisible(true);

    try {
      // Fetch messages and session analytics in parallel
      const [messagesAction, analyticsResponse] = await Promise.all([
        dispatch(fetchSessionMessages(sessionId)),
        fetch(`/api/chatbot/stats/session/${sessionId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }).then((res) => res.json()),
      ]);
      let messages = [];
      if (fetchSessionMessages.fulfilled.match(messagesAction)) {
        messages = messagesAction.payload.messages;
      }

      if (analyticsResponse.success) {
        setSessionMessages({
          messages,
          analytics: analyticsResponse.analytics,
        });
      }
    } catch (error) {
      toast.error("Failed to load conversation data");
    } finally {
      setLoadingMessages(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    return moment(timestamp).format("MMM D, YYYY h:mm A");
  };

  const formatShortTime = (timestamp) => {
    return moment(timestamp).format("h:mm A");
  };

  return (
    <div className="page-container">
      {/* Chat Statistics Section */}
      <Card
        className="chat-statistics-card"
        title={
          <Space>
            <MessageOutlined />
            <span>Your Chat Analytics</span>
          </Space>
        }
        style={{ marginBottom: "16px" }}
      >
        <ChatStatistics stats={userStats} loading={loadingStats} type="user" />
      </Card>
      {/* Chat History Section */}
      <Card
        className="chat-history-card"
        title={
          <Space>
            <HistoryOutlined />
            <span>Your Conversation History</span>
          </Space>
        }
      >
        {isLoading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Spin size="large" />
          </div>
        ) : chatHistory && chatHistory.length > 0 ? (
          <List
            className="chat-session-list"
            itemLayout="horizontal"
            dataSource={chatHistory}
            renderItem={(session) => (
              <List.Item
                actions={[
                  <Button
                    type="primary"
                    icon={<EyeOutlined />}
                    onClick={() => handleViewSession(session.session_id)}
                    size="small"
                  >
                    View
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      icon={<MessageOutlined />}
                      style={{ backgroundColor: "#1890ff" }}
                    />
                  }
                  title={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text strong>
                        Conversation on{" "}
                        {moment(session.start_time).format("MMMM D, YYYY")}
                      </Text>
                      <Badge
                        count={session.message_count}
                        style={{ backgroundColor: "#52c41a" }}
                        title={`${session.message_count} messages`}
                      />
                    </div>
                  }
                  description={
                    <div>
                      <Text type="secondary">
                        Started at {formatShortTime(session.start_time)}
                      </Text>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <Empty
            description={
              <span>
                You haven't had any conversations yet.
                <br />
                <Link to="/">Start chatting with our assistant!</Link>
              </span>
            }
          />
        )}
      </Card>{" "}
      <Modal
        title={
          <div>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Space>
                <Title level={4}>Conversation Details</Title>{" "}
                {selectedSession &&
                  sessionMessages.messages &&
                  sessionMessages.messages.length > 0 && (
                    <Tag color="blue">
                      {moment(sessionMessages.messages[0].created_at).format(
                        "MMMM D, YYYY"
                      )}
                    </Tag>
                  )}
              </Space>
              {sessionMessages.analytics && (
                <Card className="session-analytics" size="small">
                  <ChatStatistics
                    stats={sessionMessages.analytics}
                    loading={loadingMessages}
                    type="session"
                  />
                </Card>
              )}
            </Space>
          </div>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={800}
      >
        {loadingMessages ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Spin size="large" />
            <div style={{ marginTop: "16px" }}>Loading conversation...</div>
          </div>
        ) : (
          <List
            className="conversation-detail-list"
            itemLayout="horizontal"
            dataSource={sessionMessages.messages || []}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      icon={item.message ? <UserOutlined /> : <RobotOutlined />}
                      className={item.message ? "user-avatar" : "bot-avatar"}
                    />
                  }
                  title={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text strong>{item.message ? "You" : "Assistant"}</Text>
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        {formatShortTime(item.created_at)}
                      </Text>
                    </div>
                  }
                  description={
                    <div className={item.message ? "" : "markdown-content"}>
                      {item.message ? (
                        <div className="user-message">{item.message}</div>
                      ) : (
                        <ReactMarkdown>{item.response}</ReactMarkdown>
                      )}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Modal>
    </div>
  );
};

export default ChatHistoryPage;
