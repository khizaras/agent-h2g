import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Input, Spin, Badge, Card, Avatar, Tooltip, Alert } from "antd";
import ReactMarkdown from "react-markdown";
import {
  SendOutlined,
  CloseOutlined,
  CommentOutlined,
  RobotOutlined,
  UserOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import {
  toggleChatbot,
  closeChatbot,
  openChatbot,
  addUserMessage,
  sendMessage,
  clearMessages,
  startNewSession,
  resetChatError,
  fetchChatHistory,
} from "../../redux/slices/chatbotSlice";
import "./Chatbot.css";

const Chatbot = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const messageEndRef = useRef(null);
  const { user } = useSelector((state) => state.auth);
  const {
    isOpen,
    messages,
    isLoading,
    isError,
    message,
    sessionId,
    remainingMessages,
    isApproachingLimit,
    limitReached,
  } = useSelector((state) => state.chatbot);

  const [userInput, setUserInput] = useState("");

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // First, add a useEffect hook to check session on component mount
  useEffect(() => {
    if (user && !sessionId) {
      // If user is logged in and no active session, start a new one
      dispatch(resetChatError());
    }
  }, [dispatch, user, sessionId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    if (!user) {
      // For guest users, prompt to login with a better UX
      dispatch(addUserMessage(userInput));

      // Add a "system" message explaining login requirement
      dispatch({
        type: "chatbot/message/system",
        payload: {
          id: Date.now(),
          text: "I'd love to help with that! To continue the conversation, please log in or create an account first.",
          sender: "bot",
          timestamp: new Date().toISOString(),
          isSystemMessage: true,
        },
      });

      // Clear input
      setUserInput("");

      // Delay navigation to login page to allow user to read the message
      setTimeout(() => {
        navigate("/login", { state: { from: "chatbot" } });
        dispatch(closeChatbot());
      }, 3000);
      return;
    }

    // Add user message to state
    dispatch(addUserMessage(userInput));

    // Send message to backend
    dispatch(sendMessage(userInput));

    // Clear input
    setUserInput("");
  };
  const handleToggleChatbot = () => {
    if (!user) {
      // If user is not logged in, redirect to login page
      navigate("/login", { state: { from: "chatbot" } });
      return;
    }

    dispatch(toggleChatbot());
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Add a function to render the message limit warning
  const renderMessageLimitWarning = () => {
    if (!user) return null;

    if (limitReached) {
      return (
        <Alert
          type="warning"
          message="Daily message limit reached"
          description="You've reached your daily limit of 20 messages. Please try again tomorrow."
          showIcon
          className="chat-limit-alert"
          style={{ margin: "8px 12px" }}
        />
      );
    } else if (isApproachingLimit) {
      return (
        <Alert
          type="info"
          message={`${remainingMessages} messages remaining today`}
          description="You're approaching your daily chat limit. Each user can send up to 20 messages per day."
          showIcon
          className="chat-limit-alert"
          style={{ margin: "8px 12px" }}
        />
      );
    }

    return null;
  };
  return (
    <div className="chatbot-container">
      {isOpen ? (
        <Card
          className="chatbot-card"
          title={
            <div className="chatbot-header">
              <span>Hands2gether Assistant</span>
              {user && remainingMessages < 20 && (
                <Badge
                  count={remainingMessages}
                  style={{
                    backgroundColor: isApproachingLimit ? "#faad14" : "#52c41a",
                    marginLeft: "8px",
                  }}
                  title={`${remainingMessages} messages remaining today`}
                />
              )}
            </div>
          }
          extra={
            <div style={{ display: "flex", gap: "8px" }}>
              {user && (
                <Tooltip title="View chat history">
                  <Button
                    type="text"
                    icon={<HistoryOutlined />}
                    onClick={() => navigate("/chat-history")}
                  />
                </Tooltip>
              )}
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={handleToggleChatbot}
              />
            </div>
          }
        >
          <div className="chatbot-messages">
            {" "}
            <div className="welcome-message">
              <Avatar
                icon={<RobotOutlined />}
                size={32}
                className="bot-avatar circular-avatar"
              />{" "}
              <div className="message bot">
                <div className="markdown-content">
                  <ReactMarkdown>
                    {`Hello${
                      user ? ` ${user.name}` : ""
                    }! I'm the Hands2gether Assistant. Ask me anything about our causes, how to contribute, or how the platform works!

**Try asking:**
* "What causes need funding right now?"
* "How can I create a new cause?"
* "Tell me about food assistance programs"`}
                  </ReactMarkdown>
                </div>
                <span className="message-time">
                  {formatTimestamp(new Date())}
                </span>
              </div>
            </div>
            {messages.map((msg) => (
              <div key={msg.id} className={`message-container ${msg.sender}`}>
                {" "}
                {msg.sender === "bot" && (
                  <Avatar
                    icon={<RobotOutlined />}
                    size={32}
                    className="bot-avatar circular-avatar"
                  />
                )}{" "}
                <div
                  className={`message ${msg.sender} ${
                    msg.isSystemMessage ? "system-message" : ""
                  }`}
                >
                  {msg.sender === "bot" ? (
                    <div className="markdown-content">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  ) : (
                    <p>{msg.text}</p>
                  )}
                  <span className="message-time">
                    {formatTimestamp(msg.timestamp)}
                  </span>
                </div>
                {msg.sender === "user" && (
                  <Avatar
                    icon={<UserOutlined />}
                    size={32}
                    className="user-avatar circular-avatar"
                  />
                )}
              </div>
            ))}
            {isLoading && (
              <div className="message-container bot">
                <Avatar
                  icon={<RobotOutlined />}
                  size={32}
                  className="bot-avatar circular-avatar"
                />
                <div className="message bot loading">
                  <div className="thinking-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span>Thinking...</span>
                </div>
              </div>
            )}
            {isError && (
              <div className="error-container">
                <Alert type="error" message={message} showIcon />
              </div>
            )}
            {renderMessageLimitWarning()} <div ref={messageEndRef} />
          </div>

          {/* Display limit warning if needed */}
          {renderMessageLimitWarning()}

          <form onSubmit={handleSubmit} className="chatbot-input">
            <Input
              placeholder="Type your message..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={isLoading || !user || limitReached}
              autoFocus
            />{" "}
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSubmit}
              disabled={isLoading || !userInput.trim() || !user || limitReached}
              title={
                limitReached ? "Daily message limit reached" : "Send message"
              }
            />
          </form>
          {!user && (
            <div className="login-prompt">
              <Alert
                type="info"
                message="Please log in to use the chatbot assistant"
                description="Only registered users can access the chatbot features."
                showIcon
                action={
                  <Button
                    size="small"
                    type="primary"
                    onClick={() =>
                      navigate("/login", { state: { from: "chatbot" } })
                    }
                  >
                    Login Now
                  </Button>
                }
              />
            </div>
          )}
        </Card>
      ) : (
        <Tooltip
          title={
            user
              ? "Chat with Hands2gether Assistant"
              : "Login to use chat assistant"
          }
          placement="left"
        >
          {" "}
          <Badge dot={!user} color="red" offset={[-5, 5]}>
            <Button
              className="chatbot-toggle"
              type={user ? "primary" : "default"}
              shape="circle"
              size="large"
              icon={<CommentOutlined style={{ fontSize: "20px" }} />}
              onClick={handleToggleChatbot}
            />
          </Badge>
        </Tooltip>
      )}
    </div>
  );
};

export default Chatbot;
