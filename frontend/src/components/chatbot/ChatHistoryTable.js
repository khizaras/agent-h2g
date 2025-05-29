import React, { useState } from "react";
import { Table, Card, Row, Col, Statistic, Tag, Timeline, Tooltip } from "antd";
import {
  MessageOutlined,
  UserOutlined,
  ClockCircleOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { formatDistanceToNow } from "date-fns";

const ChatHistoryTable = ({ sessions, loading, onRowClick }) => {
  const columns = [
    {
      title: "Session ID",
      dataIndex: "session_id",
      key: "session_id",
      width: 220,
      render: (text) => <Tag color="blue">{text.substring(0, 8)}...</Tag>,
    },
    {
      title: "User",
      dataIndex: "user_name",
      key: "user_name",
      render: (text, record) => (
        <Tooltip title={record.user_email}>
          <span>
            <UserOutlined /> {text}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Messages",
      dataIndex: "message_count",
      key: "message_count",
      width: 100,
      render: (count) => (
        <Tag color="green">
          <MessageOutlined /> {count}
        </Tag>
      ),
    },
    {
      title: "First Message",
      dataIndex: "first_message",
      key: "first_message",
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "Started",
      dataIndex: "start_time",
      key: "start_time",
      width: 150,
      render: (date) => (
        <Tooltip title={new Date(date).toLocaleString()}>
          {formatDistanceToNow(new Date(date), { addSuffix: true })}
        </Tooltip>
      ),
    },
    {
      title: "Last Message",
      dataIndex: "last_message_time",
      key: "last_message_time",
      width: 150,
      render: (date) => (
        <Tooltip title={new Date(date).toLocaleString()}>
          {formatDistanceToNow(new Date(date), { addSuffix: true })}
        </Tooltip>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={sessions}
      loading={loading}
      rowKey="session_id"
      onRow={(record) => ({
        onClick: () => onRowClick(record),
      })}
      style={{ cursor: "pointer" }}
      pagination={{
        showSizeChanger: true,
        showQuickJumper: true,
        defaultPageSize: 10,
        pageSizeOptions: ["10", "20", "50", "100"],
      }}
    />
  );
};

export default ChatHistoryTable;
