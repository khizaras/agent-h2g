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

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    dispatch(fetchChatHistory());
  }, [dispatch]);

  const handleViewSession = async (sessionId) => {
    setLoadingMessages(true);
    setSelectedSession(sessionId);
    setModalVisible(true);

    try {
      const resultAction = await dispatch(fetchSessionMessages(sessionId));
      if (fetchSessionMessages.fulfilled.match(resultAction)) {
        setSessionMessages(resultAction.payload.messages);
      }
    } catch (error) {
      toast.error("Failed to load conversation");
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
      </Card>

      <Modal
        title={
          <div>
            <Space>
              <Title level={4}>Conversation Details</Title>
              {selectedSession && (
                <Tag color="blue">
                  {sessionMessages.length > 0 &&
                    moment(sessionMessages[0].created_at).format(
                      "MMMM D, YYYY"
                    )}
                </Tag>
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
        width={700}
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
            dataSource={sessionMessages}
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
