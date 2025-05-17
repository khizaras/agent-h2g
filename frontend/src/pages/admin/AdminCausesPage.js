import React, { useEffect, useState } from "react";
import {
  Table,
  Space,
  Button,
  Modal,
  Tag,
  Typography,
  Card,
  Select,
  message,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import {
  getAllCauses,
  updateCauseStatus,
  deleteCause,
} from "../../redux/slices/adminSlice";

const { Title } = Typography;
const { Option } = Select;

const AdminCausesPage = () => {
  const dispatch = useDispatch();
  const { causes = [], isLoading = false } = useSelector(
    (state) => state.admin || {}
  );

  useEffect(() => {
    dispatch(getAllCauses());
  }, [dispatch]);

  const handleStatusChange = (causeId, newStatus) => {
    Modal.confirm({
      title: `Are you sure you want to change this cause's status to ${newStatus}?`,
      content: "This will affect how the cause is displayed to users.",
      okText: "Yes",
      cancelText: "No",
      onOk() {
        dispatch(updateCauseStatus({ id: causeId, status: newStatus }));
        message.success(`Cause status updated to ${newStatus} successfully`);
      },
    });
  };

  const handleDelete = (causeId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this cause?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        dispatch(deleteCause(causeId));
        message.success("Cause deleted successfully");
      },
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "green";
      case "completed":
        return "blue";
      case "suspended":
        return "red";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text, record) => <Link to={`/causes/${record.id}`}>{text}</Link>,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category) =>
        category.charAt(0).toUpperCase() + category.slice(1),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Progress",
      key: "progress",
      render: (_, record) => {
        if (record.funding_goal) {
          const progress = Math.round(
            (Number(record.current_funding) / Number(record.funding_goal)) * 100
          );
          return `${progress}% ($${Number(record.current_funding)} of $${Number(
            record.funding_goal
          )})`;
        } else if (record.food_goal) {
          const progress = Math.round(
            (Number(record.current_food) / Number(record.food_goal)) * 100
          );
          return `${progress}% (${record.current_food} of ${record.food_goal} items)`;
        }
        return "N/A";
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Select
            defaultValue={record.status}
            style={{ width: 120 }}
            onChange={(value) => handleStatusChange(record.id, value)}
          >
            <Option value="active">Active</Option>
            <Option value="completed">Completed</Option>
            <Option value="suspended">Suspended</Option>
          </Select>
          <Button icon={<EditOutlined />} href={`/causes/edit/${record.id}`} />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Card>
        <Title level={2}>Manage Causes</Title>
        <Table
          columns={columns}
          dataSource={causes}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default AdminCausesPage;
