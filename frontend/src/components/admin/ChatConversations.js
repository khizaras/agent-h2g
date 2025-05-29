import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  Table,
  Button,
  Space,
  Modal,
  Typography,
  List,
  Avatar,
  Badge,
  Pagination,
  Empty,
  Spin,
  Tag,
  Input,
  DatePicker,
  Select,
} from "antd";
import {
  UserOutlined,
  RobotOutlined,
  EyeOutlined,
  SearchOutlined,
  FileTextOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import moment from "moment";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const ChatConversations = () => {
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversationMessages, setConversationMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState(null);
  const [filterUserId, setFilterUserId] = useState(null);
  const [userOptions, setUserOptions] = useState([]);

  const { user } = useSelector((state) => state.auth);

  const fetchConversations = async (page = 1) => {
    setLoading(true);

    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      queryParams.append("page", page);
      queryParams.append("limit", pagination.pageSize);

      if (searchText) {
        queryParams.append("search", searchText);
      }

      if (dateRange) {
        queryParams.append("startDate", dateRange[0].format("YYYY-MM-DD"));
        queryParams.append("endDate", dateRange[1].format("YYYY-MM-DD"));
      }

      if (filterUserId) {
        queryParams.append("userId", filterUserId);
      }

      const response = await axios.get(
        `/api/chatbot/admin/conversations?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setConversations(response.data.sessions);
      setPagination({
        ...pagination,
        current: page,
        total: response.data.total,
      });

      // Build list of unique users for filtering
      const uniqueUsers = new Map();
      response.data.sessions.forEach((session) => {
        if (!uniqueUsers.has(session.user_id)) {
          uniqueUsers.set(session.user_id, {
            id: session.user_id,
            name: session.user_name,
            email: session.user_email,
          });
        }
      });

      setUserOptions(Array.from(uniqueUsers.values()));
    } catch (error) {
      console.error("Error fetching conversations:", error);
      toast.error("Failed to fetch conversation data");
    } finally {
      setLoading(false);
    }
  };

  const fetchConversationMessages = async (sessionId) => {
    setLoadingMessages(true);

    try {
      const response = await axios.get(
        `/api/chatbot/admin/conversations/${sessionId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setConversationMessages(response.data.messages);
    } catch (error) {
      console.error(`Error fetching conversation ${sessionId}:`, error);
      toast.error("Failed to fetch conversation messages");
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleTableChange = (pagination) => {
    fetchConversations(pagination.current);
  };

  const handleViewConversation = (record) => {
    setSelectedConversation(record);
    fetchConversationMessages(record.session_id);
    setModalVisible(true);
  };

  const handleFilterChange = () => {
    fetchConversations(1);
  };

  const resetFilters = () => {
    setSearchText("");
    setDateRange(null);
    setFilterUserId(null);
    fetchConversations(1);
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const columns = [
    {
      title: "User",
      dataIndex: "user_name",
      key: "user_name",
      render: (text, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <span>
            <div>{text}</div>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {record.user_email}
            </Text>
          </span>
        </Space>
      ),
    },
    {
      title: "First Message",
      dataIndex: "first_message",
      key: "first_message",
      ellipsis: true,
      render: (text) =>
        text.length > 80 ? `${text.substring(0, 80)}...` : text,
    },
    {
      title: "Messages",
      dataIndex: "message_count",
      key: "message_count",
      render: (count) => (
        <Badge count={count} style={{ backgroundColor: "#52c41a" }} />
      ),
    },
    {
      title: "Started",
      dataIndex: "start_time",
      key: "start_time",
      render: (time) => moment(time).format("MMM DD, YYYY HH:mm"),
    },
    {
      title: "Last Message",
      dataIndex: "last_message_time",
      key: "last_message_time",
      render: (time) => moment(time).format("MMM DD, YYYY HH:mm"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => handleViewConversation(record)}
          size="small"
        >
          View
        </Button>
      ),
    },
  ];

  const formatTimestamp = (timestamp) => {
    return moment(timestamp).format("hh:mm A");
  };

  return (
    <div style={{ maxWidth: "100%", overflowX: "auto" }}>
      <Card
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Title level={4}>Chatbot Conversations</Title>
          </div>
        }
        extra={
          <Button
            type="primary"
            onClick={() => fetchConversations(pagination.current)}
            loading={loading}
          >
            Refresh
          </Button>
        }
      >
        <div
          style={{
            marginBottom: "20px",
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <Input
            placeholder="Search messages"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: "250px" }}
          />

          <RangePicker
            placeholder={["Start Date", "End Date"]}
            value={dateRange}
            onChange={(dates) => setDateRange(dates)}
          />

          <Select
            placeholder="Filter by User"
            style={{ width: "250px" }}
            value={filterUserId}
            onChange={(value) => setFilterUserId(value)}
            allowClear
          >
            {userOptions.map((user) => (
              <Option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </Option>
            ))}
          </Select>

          <Space>
            <Button type="primary" onClick={handleFilterChange}>
              Apply Filters
            </Button>
            <Button onClick={resetFilters}>Reset</Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={conversations}
          rowKey="session_id"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: (page) => fetchConversations(page),
          }}
          onChange={handleTableChange}
          loading={loading}
          locale={{
            emptyText: <Empty description="No conversations found" />,
          }}
        />
      </Card>

      <Modal
        title={
          <div>
            <Space>
              <Title level={4}>Conversation Details</Title>
              {selectedConversation && (
                <Tag color="blue">
                  {moment(selectedConversation.start_time).format(
                    "MMMM D, YYYY"
                  )}
                </Tag>
              )}
            </Space>
            {selectedConversation && (
              <div style={{ marginTop: "8px" }}>
                <Text type="secondary">
                  <UserOutlined /> {selectedConversation.user_name} (
                  {selectedConversation.user_email})
                </Text>
              </div>
            )}
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
            className="conversation-list"
            itemLayout="horizontal"
            dataSource={conversationMessages}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      icon={item.user_id ? <UserOutlined /> : <RobotOutlined />}
                      style={{
                        backgroundColor: item.message ? "#1890ff" : "#52c41a",
                      }}
                    />
                  }
                  title={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text strong>{item.message ? "User" : "Assistant"}</Text>
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        {formatTimestamp(item.created_at)}
                      </Text>
                    </div>
                  }
                  description={
                    <div className={item.message ? "" : "markdown-content"}>
                      {item.message ? (
                        item.message
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

export default ChatConversations;
