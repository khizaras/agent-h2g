import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Typography,
  Statistic,
  Table,
  Button,
  Tabs,
  Breadcrumb,
  Skeleton,
  DatePicker,
  Space,
  Select,
  Form,
  Input,
  List,
  message,
  Divider,
  Tooltip,
  Badge,
} from "antd";
import {
  TeamOutlined,
  HeartOutlined,
  DollarOutlined,
  ShoppingOutlined,
  RiseOutlined,
  FallOutlined,
  CalendarOutlined,
  BarChartOutlined,
  PieChartOutlined,
  BellOutlined,
  CheckCircleOutlined,
  DownloadOutlined,
  DashboardOutlined,
  FileTextOutlined,
  EyeOutlined,
  UserOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import moment from "moment";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "./AdminDashboard.css";

import {
  getAdminStats,
  getAdminActivities,
} from "../../redux/slices/adminSlice";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Use default values and optional chaining to safely handle potentially undefined state
  const {
    stats = null,
    activities = [],
    isLoading = false,
  } = useSelector((state) => state.admin || {});
  const { user = null } = useSelector((state) => state.auth || {});

  const [dateRange, setDateRange] = useState([
    moment().subtract(30, "days"),
    moment(),
  ]);
  const [activityType, setActivityType] = useState("all");

  useEffect(() => {
    if (!user || !user.is_admin) {
      navigate("/");
      return;
    }

    dispatch(
      getAdminStats({
        startDate: dateRange[0].format("YYYY-MM-DD"),
        endDate: dateRange[1].format("YYYY-MM-DD"),
      })
    );

    dispatch(
      getAdminActivities({
        startDate: dateRange[0].format("YYYY-MM-DD"),
        endDate: dateRange[1].format("YYYY-MM-DD"),
        type: activityType,
      })
    );
  }, [dispatch, navigate, user, dateRange, activityType]);

  const handleDateRangeChange = (dates) => {
    if (dates) {
      setDateRange(dates);
    }
  };

  const handleActivityTypeChange = (value) => {
    setActivityType(value);
  };
  // Conditionally create chart configurations only if stats is available
  const contributionsChartOptions = {
    chart: {
      type: "column",
    },
    title: {
      text: "Contributions Over Time",
    },
    xAxis: {
      categories: stats?.contributionsChart?.dates || [],
      crosshair: true,
    },
    yAxis: [
      {
        min: 0,
        title: {
          text: "Money Amount ($)",
        },
      },
      {
        min: 0,
        title: {
          text: "Food Items",
        },
        opposite: true,
      },
    ],
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat:
        '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y}</b></td></tr>',
      footerFormat: "</table>",
      shared: true,
      useHTML: true,
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
    },
    series: [
      {
        name: "Money Contributions ($)",
        data: stats?.contributionsChart?.money || [],
      },
      {
        name: "Food Items",
        data: stats?.contributionsChart?.food || [],
        yAxis: 1,
        color: "#f5222d",
      },
    ],
  };

  // Causes by category chart configuration
  const causesByCategoryChartOptions = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: "pie",
    },
    title: {
      text: "Causes by Category",
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.percentage:.1f} %",
        },
      },
    },
    series: [
      {
        name: "Categories",
        colorByPoint: true,
        data: [
          {
            name: "Local",
            y: stats?.causesByCategory?.local || 0,
            color: "#1890ff",
          },
          {
            name: "Emergency",
            y: stats?.causesByCategory?.emergency || 0,
            color: "#f5222d",
          },
          {
            name: "Recurring",
            y: stats?.causesByCategory?.recurring || 0,
            color: "#52c41a",
          },
        ],
      },
    ],
  };

  // Activity table columns
  const activityColumns = [
    {
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => moment(date).format("MMM DD, YYYY HH:mm"),
      sorter: (a, b) => new Date(b.created_at) - new Date(a.created_at),
      defaultSortOrder: "descend",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => {
        const typeColors = {
          user_registered: "blue",
          cause_created: "green",
          contribution: "gold",
          feedback: "purple",
        };

        return (
          <Tag color={typeColors[type] || "default"}>
            {type.replace("_", " ").toUpperCase()}
          </Tag>
        );
      },
      filters: [
        { text: "User Registered", value: "user_registered" },
        { text: "Cause Created", value: "cause_created" },
        { text: "Contribution", value: "contribution" },
        { text: "Feedback", value: "feedback" },
      ],
      onFilter: (value, record) => record.type.indexOf(value) === 0,
    },
    {
      title: "Details",
      dataIndex: "details",
      key: "details",
    },
    {
      title: "User",
      dataIndex: "user_name",
      key: "user_name",
      render: (text, record) => (
        <Link to={`/admin/users/${record.user_id}`}>{text || "Anonymous"}</Link>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => {
        if (record.cause_id) {
          return (
            <Link to={`/causes/${record.cause_id}`}>
              <Button type="link" size="small">
                View Cause
              </Button>
            </Link>
          );
        }
        return null;
      },
    },
  ];

  // Admin Notifications Tab Content
  const NotificationsTab = () => {
    const [notificationForm, setNotificationForm] = useState({
      title: "",
      message: "",
      type: "admin",
    });
    const [sending, setSending] = useState(false);
    const [notificationHistory, setNotificationHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const { token = null } = useSelector((state) => state.auth || {});

    useEffect(() => {
      // Fetch notification history - this would be implemented in a real system
      setLoading(true);
      setTimeout(() => {
        setNotificationHistory([
          {
            id: 1,
            title: "New Feature Announcement",
            message: "We have launched meal tracking functionality!",
            sent_at: moment().subtract(2, "days").toISOString(),
            recipient_count: 156,
          },
          {
            id: 2,
            title: "Platform Maintenance",
            message:
              "The platform will be down for maintenance on Saturday night",
            sent_at: moment().subtract(1, "week").toISOString(),
            recipient_count: 142,
          },
        ]);
        setLoading(false);
      }, 1000);
    }, []);

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setNotificationForm({
        ...notificationForm,
        [name]: value,
      });
    };

    const handleSendNotification = async () => {
      try {
        setSending(true);
        // In a real application, this would call the API
        // await notificationsService.createAdminNotification(notificationForm, token);

        // Simulate successful notification
        setTimeout(() => {
          // Add to history
          setNotificationHistory([
            {
              id: Date.now(),
              title: notificationForm.title,
              message: notificationForm.message,
              sent_at: new Date().toISOString(),
              recipient_count: 160, // This would be returned from the API
            },
            ...notificationHistory,
          ]);

          // Reset form
          setNotificationForm({
            title: "",
            message: "",
            type: "admin",
          });

          setSending(false);

          // Show success message
          message.success("Notification sent to all users successfully!");
        }, 1500);
      } catch (error) {
        setSending(false);
        message.error("Failed to send notification");
      }
    };

    const notificationColumns = [
      {
        title: "Date Sent",
        dataIndex: "sent_at",
        key: "sent_at",
        render: (date) => moment(date).format("MMM DD, YYYY HH:mm"),
        sorter: (a, b) => new Date(b.sent_at) - new Date(a.sent_at),
        defaultSortOrder: "descend",
      },
      {
        title: "Title",
        dataIndex: "title",
        key: "title",
      },
      {
        title: "Message",
        dataIndex: "message",
        key: "message",
        ellipsis: true,
      },
      {
        title: "Recipients",
        dataIndex: "recipient_count",
        key: "recipient_count",
      },
    ];

    return (
      <div className="admin-notifications-tab">
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Card title="Send System Notification">
              <Form layout="vertical">
                <Form.Item
                  label="Notification Title"
                  required
                  validateStatus={
                    !notificationForm.title && notificationForm.title !== ""
                      ? "error"
                      : ""
                  }
                  help={
                    !notificationForm.title && notificationForm.title !== ""
                      ? "Please enter a title"
                      : ""
                  }
                >
                  <Input
                    name="title"
                    value={notificationForm.title}
                    onChange={handleInputChange}
                    placeholder="Enter notification title"
                  />
                </Form.Item>

                <Form.Item
                  label="Notification Message"
                  required
                  validateStatus={
                    !notificationForm.message && notificationForm.message !== ""
                      ? "error"
                      : ""
                  }
                  help={
                    !notificationForm.message && notificationForm.message !== ""
                      ? "Please enter a message"
                      : ""
                  }
                >
                  <Input.TextArea
                    name="message"
                    value={notificationForm.message}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Enter notification message"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    onClick={handleSendNotification}
                    loading={sending}
                    disabled={
                      !notificationForm.title || !notificationForm.message
                    }
                  >
                    Send to All Users
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="Notification Statistics">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Statistic
                    title="Total Notifications Sent"
                    value={notificationHistory.length}
                    prefix={<BellOutlined />}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Avg. Read Rate"
                    value={78.3}
                    suffix="%"
                    precision={1}
                    prefix={<CheckCircleOutlined />}
                  />
                </Col>
                <Col span={24}>
                  <Title level={5}>Top Performing Notifications</Title>
                  <List
                    size="small"
                    loading={loading}
                    dataSource={notificationHistory.slice(0, 3)}
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta
                          title={item.title}
                          description={`${item.recipient_count} recipients`}
                        />
                        <div>{moment(item.sent_at).fromNow()}</div>
                      </List.Item>
                    )}
                  />
                </Col>
              </Row>
            </Card>
          </Col>

          <Col span={24}>
            <Card title="Notification History">
              <Table
                dataSource={notificationHistory}
                columns={notificationColumns}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 5 }}
              />
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  // Reports Tab for Admin Dashboard
  const ReportsTab = () => {
    const [reportsType, setReportsType] = useState("contributions");
    const [dateRange, setDateRange] = useState([
      moment().subtract(30, "days"),
      moment(),
    ]);
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState(null);

    useEffect(() => {
      loadReportData();
    }, [reportsType, dateRange]);

    const loadReportData = () => {
      setLoading(true);

      // In a real application, you would call an API endpoint to fetch the report data
      setTimeout(() => {
        // Sample data - in a real app this would come from the backend
        const contributionsData = {
          summary: {
            totalAmount: 15680,
            totalFoodItems: 842,
            contributorsCount: 93,
            averageContribution: 168.6,
          },
          topCauses: [
            { name: "Local Food Bank Support", amount: 3250, items: 142 },
            { name: "Hurricane Relief Effort", amount: 2870, items: 98 },
            { name: "Community Kitchen Project", amount: 2100, items: 65 },
          ],
          chartData: {
            dates: [
              "May 1",
              "May 5",
              "May 10",
              "May 15",
              "May 20",
              "May 25",
              "May 30",
            ],
            amounts: [1200, 980, 1450, 2100, 3200, 2800, 3950],
            items: [65, 42, 78, 90, 145, 160, 262],
          },
        };

        const causesData = {
          summary: {
            totalActive: 24,
            totalCompleted: 18,
            successRate: 75,
            averageDuration: 21,
          },
          categoriesDistribution: [
            { name: "Emergency", count: 15, color: "#ff4d4f" },
            { name: "Local", count: 18, color: "#1890ff" },
            { name: "Recurring", count: 9, color: "#52c41a" },
          ],
          statusDistribution: [
            { name: "Active", count: 24, color: "#52c41a" },
            { name: "Completed", count: 18, color: "#1890ff" },
            { name: "Suspended", count: 3, color: "#ff4d4f" },
          ],
        };

        const userData = {
          summary: {
            totalUsers: 256,
            activeUsers: 142,
            newUsersThisMonth: 32,
            retentionRate: 84,
          },
          userGrowth: {
            dates: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            counts: [156, 172, 192, 218, 242, 256],
          },
          userTypes: [
            { name: "Contributors", count: 173, color: "#1890ff" },
            { name: "Cause Creators", count: 48, color: "#52c41a" },
            { name: "Both", count: 35, color: "#722ed1" },
          ],
        };

        switch (reportsType) {
          case "contributions":
            setReportData(contributionsData);
            break;
          case "causes":
            setReportData(causesData);
            break;
          case "users":
            setReportData(userData);
            break;
          default:
            setReportData(null);
        }

        setLoading(false);
      }, 1000);
    };

    const renderContributionsReport = () => {
      if (!reportData) return <Skeleton active />;

      const { summary, topCauses, chartData } = reportData;

      const contributionsChartOptions = {
        chart: {
          type: "column",
        },
        title: {
          text: "Contributions Over Time",
        },
        xAxis: {
          categories: chartData.dates,
        },
        yAxis: [
          {
            min: 0,
            title: {
              text: "Money Amount ($)",
            },
          },
          {
            min: 0,
            title: {
              text: "Food Items",
            },
            opposite: true,
          },
        ],
        series: [
          {
            name: "Money Contributions ($)",
            data: chartData.amounts,
          },
          {
            name: "Food Items",
            data: chartData.items,
            yAxis: 1,
            color: "#ff4d4f",
          },
        ],
      };

      return (
        <>
          <Row gutter={[24, 24]}>
            <Col xs={12} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Total Monetary Contributions"
                  value={summary.totalAmount}
                  precision={2}
                  prefix="$"
                  valueStyle={{ color: "#3f8600" }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Total Food Items"
                  value={summary.totalFoodItems}
                  valueStyle={{ color: "#cf1322" }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Number of Contributors"
                  value={summary.contributorsCount}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Average Contribution"
                  value={summary.averageContribution}
                  precision={2}
                  prefix="$"
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
            <Col xs={24} md={12}>
              <Card title="Top Causes by Contributions">
                <Table
                  dataSource={topCauses}
                  pagination={false}
                  rowKey="name"
                  columns={[
                    {
                      title: "Cause Name",
                      dataIndex: "name",
                      key: "name",
                    },
                    {
                      title: "Amount ($)",
                      dataIndex: "amount",
                      key: "amount",
                      render: (amount) => `$${Number(amount).toFixed(2)}`,
                    },
                    {
                      title: "Food Items",
                      dataIndex: "items",
                      key: "items",
                    },
                  ]}
                />
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="Contributions Trend">
                <HighchartsReact
                  highcharts={Highcharts}
                  options={contributionsChartOptions}
                />
              </Card>
            </Col>
          </Row>
        </>
      );
    };

    const renderCausesReport = () => {
      if (!reportData) return <Skeleton active />;

      const { summary, categoriesDistribution, statusDistribution } =
        reportData;

      const categoriesChartOptions = {
        chart: {
          type: "pie",
        },
        title: {
          text: "Causes by Category",
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: "pointer",
            dataLabels: {
              enabled: true,
              format: "<b>{point.name}</b>: {point.percentage:.1f} %",
            },
          },
        },
        series: [
          {
            name: "Categories",
            colorByPoint: true,
            data: categoriesDistribution.map((cat) => ({
              name: cat.name,
              y: cat.count,
              color: cat.color,
            })),
          },
        ],
      };

      const statusChartOptions = {
        chart: {
          type: "pie",
        },
        title: {
          text: "Causes by Status",
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: "pointer",
            dataLabels: {
              enabled: true,
              format: "<b>{point.name}</b>: {point.percentage:.1f} %",
            },
          },
        },
        series: [
          {
            name: "Status",
            colorByPoint: true,
            data: statusDistribution.map((status) => ({
              name: status.name,
              y: status.count,
              color: status.color,
            })),
          },
        ],
      };

      return (
        <>
          <Row gutter={[24, 24]}>
            <Col xs={12} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Active Causes"
                  value={summary.totalActive}
                  valueStyle={{ color: "#52c41a" }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Completed Causes"
                  value={summary.totalCompleted}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Success Rate"
                  value={summary.successRate}
                  suffix="%"
                  valueStyle={{ color: "#3f8600" }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Avg. Duration (days)"
                  value={summary.averageDuration}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
            <Col xs={24} md={12}>
              <Card title="Causes by Category">
                <HighchartsReact
                  highcharts={Highcharts}
                  options={categoriesChartOptions}
                />
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="Causes by Status">
                <HighchartsReact
                  highcharts={Highcharts}
                  options={statusChartOptions}
                />
              </Card>
            </Col>
          </Row>
        </>
      );
    };

    const renderUsersReport = () => {
      if (!reportData) return <Skeleton active />;

      const { summary, userGrowth, userTypes } = reportData;

      const userGrowthOptions = {
        chart: {
          type: "line",
        },
        title: {
          text: "User Growth Over Time",
        },
        xAxis: {
          categories: userGrowth.dates,
        },
        yAxis: {
          title: {
            text: "Users Count",
          },
        },
        series: [
          {
            name: "Total Users",
            data: userGrowth.counts,
          },
        ],
      };

      const userTypesOptions = {
        chart: {
          type: "pie",
        },
        title: {
          text: "User Types Distribution",
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: "pointer",
            dataLabels: {
              enabled: true,
              format: "<b>{point.name}</b>: {point.percentage:.1f} %",
            },
          },
        },
        series: [
          {
            name: "User Types",
            colorByPoint: true,
            data: userTypes.map((type) => ({
              name: type.name,
              y: type.count,
              color: type.color,
            })),
          },
        ],
      };

      return (
        <>
          <Row gutter={[24, 24]}>
            <Col xs={12} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Total Users"
                  value={summary.totalUsers}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Active Users"
                  value={summary.activeUsers}
                  valueStyle={{ color: "#52c41a" }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={12} md={6}>
              <Card>
                <Statistic
                  title="New Users (Month)"
                  value={summary.newUsersThisMonth}
                  valueStyle={{ color: "#722ed1" }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Retention Rate"
                  value={summary.retentionRate}
                  suffix="%"
                  valueStyle={{ color: "#3f8600" }}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
            <Col xs={24} md={12}>
              <Card title="User Growth Trend">
                <HighchartsReact
                  highcharts={Highcharts}
                  options={userGrowthOptions}
                />
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="User Types Distribution">
                <HighchartsReact
                  highcharts={Highcharts}
                  options={userTypesOptions}
                />
              </Card>
            </Col>
          </Row>
        </>
      );
    };

    return (
      <div className="admin-reports-tab">
        <Row gutter={[0, 24]}>
          <Col span={24}>
            <Card>
              <Space>
                <Select
                  value={reportsType}
                  onChange={setReportsType}
                  style={{ width: 180 }}
                >
                  <Option value="contributions">Contributions Report</Option>
                  <Option value="causes">Causes Report</Option>
                  <Option value="users">Users Report</Option>
                </Select>

                <RangePicker
                  value={dateRange}
                  onChange={setDateRange}
                  allowClear={false}
                />

                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  onClick={() =>
                    message.success("Report downloaded successfully")
                  }
                >
                  Export Report
                </Button>
              </Space>
            </Card>
          </Col>

          <Col span={24}>
            <Spin spinning={loading}>
              {reportsType === "contributions" && renderContributionsReport()}
              {reportsType === "causes" && renderCausesReport()}
              {reportsType === "users" && renderUsersReport()}
            </Spin>
          </Col>
        </Row>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="admin-dashboard-page">
        <Skeleton active paragraph={{ rows: 20 }} />
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      <div className="container">
        <Breadcrumb className="breadcrumb-navigation mt-3 mb-2">
          <Breadcrumb.Item>
            <Link to="/">Home</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Admin</Breadcrumb.Item>
          <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
        </Breadcrumb>

        <div className="admin-header-wrapper">
          <div className="admin-header mb-4">
            <div className="title-section">
              <Space align="center" className="header-icon-wrapper">
                <DashboardOutlined className="admin-header-icon" />
                <Title level={2} className="mb-1">
                  Admin Dashboard
                </Title>
              </Space>
              <Paragraph type="secondary" className="header-description">
                Monitor platform activity, track contributions, and analyze
                performance.
              </Paragraph>
            </div>

            <div className="admin-date-filter">
              <Card className="date-filter-card">
                <Space direction="vertical" size="small">
                  <Text strong>Date Range</Text>
                  <RangePicker
                    value={dateRange}
                    onChange={handleDateRangeChange}
                    className="date-picker"
                    allowClear={false}
                  />
                </Space>
              </Card>
            </div>
          </div>

          <div className="admin-quick-actions mb-4">
            <Space size="middle" className="quick-action-buttons">
              <Link to="/admin/users">
                <Button type="default" icon={<TeamOutlined />}>
                  Manage Users
                </Button>
              </Link>
              <Link to="/admin/causes">
                <Button type="default" icon={<HeartOutlined />}>
                  Manage Causes
                </Button>
              </Link>
              <Button type="default" icon={<DownloadOutlined />}>
                Export Data
              </Button>
            </Space>
          </div>
        </div>

        {isLoading ? (
          <div className="loading-container">
            <Row gutter={[24, 24]}>
              {[1, 2, 3, 4].map((item) => (
                <Col xs={24} sm={12} lg={6} key={item}>
                  <Card>
                    <Skeleton active paragraph={{ rows: 1 }} />
                  </Card>
                </Col>
              ))}
              <Col span={24}>
                <Card>
                  <Skeleton active paragraph={{ rows: 8 }} />
                </Card>
              </Col>
            </Row>
          </div>
        ) : (
          <>
            <Row gutter={[24, 24]} className="stats-cards mb-4">
              <Col xs={24} sm={12} lg={6}>
                <Card className="stats-card users-card shadow-sm">
                  <Statistic
                    title={<Text strong>Total Users</Text>}
                    value={stats?.users?.total || 0}
                    prefix={<TeamOutlined className="stat-icon" />}
                    valueStyle={{ color: "#1890ff" }}
                  />
                  <div className="stat-change">
                    {stats?.users?.change >= 0 ? (
                      <Text type="success">
                        <RiseOutlined /> +{stats?.users?.change || 0}% from
                        previous period
                      </Text>
                    ) : (
                      <Text type="danger">
                        <FallOutlined /> {stats?.users?.change || 0}% from
                        previous period
                      </Text>
                    )}
                  </div>
                </Card>
              </Col>

              <Col xs={24} sm={12} lg={6}>
                <Card className="stats-card causes-card shadow-sm">
                  <Statistic
                    title={<Text strong>Active Causes</Text>}
                    value={stats?.causes?.active || 0}
                    prefix={<HeartOutlined className="stat-icon" />}
                    valueStyle={{ color: "#52c41a" }}
                  />
                  <div className="stat-change">
                    <Text type="secondary">
                      Total: {stats?.causes?.total || 0} causes
                    </Text>
                  </div>
                </Card>
              </Col>

              <Col xs={24} sm={12} lg={6}>
                <Card className="stats-card money-card shadow-sm">
                  <Statistic
                    title={<Text strong>Money Contributions</Text>}
                    value={stats?.money?.total || 0}
                    prefix={<DollarOutlined className="stat-icon" />}
                    valueStyle={{ color: "#faad14" }}
                    precision={2}
                  />
                  <div className="stat-change">
                    {stats?.money?.change >= 0 ? (
                      <Text type="success">
                        <RiseOutlined /> +{stats?.money?.change || 0}% from
                        previous period
                      </Text>
                    ) : (
                      <Text type="danger">
                        <FallOutlined /> {stats?.money?.change || 0}% from
                        previous period
                      </Text>
                    )}
                  </div>
                </Card>
              </Col>

              <Col xs={24} sm={12} lg={6}>
                <Card className="stats-card food-card shadow-sm">
                  <Statistic
                    title={<Text strong>Food Contributions</Text>}
                    value={stats?.food?.total || 0}
                    prefix={<ShoppingOutlined className="stat-icon" />}
                    valueStyle={{ color: "#eb2f96" }}
                  />
                  <div className="stat-change">
                    {stats?.food?.change >= 0 ? (
                      <Text type="success">
                        <RiseOutlined /> +{stats?.food?.change || 0}% from
                        previous period
                      </Text>
                    ) : (
                      <Text type="danger">
                        <FallOutlined /> {stats?.food?.change || 0}% from
                        previous period
                      </Text>
                    )}
                  </div>
                </Card>
              </Col>
            </Row>

            <Row gutter={[24, 24]} className="charts-row mb-4">
              {" "}
              <Col xs={24} lg={16}>
                <Card className="chart-card shadow-sm">
                  <div className="card-title-section mb-3">
                    <Space align="center">
                      <BarChartOutlined className="card-icon" />
                      <Title level={4} className="mb-0">
                        Contributions Over Time
                      </Title>
                    </Space>
                  </div>
                  {stats?.contributionsChart ? (
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={contributionsChartOptions}
                    />
                  ) : (
                    <div className="no-data-message">
                      <Text type="secondary">
                        No contribution data available
                      </Text>
                    </div>
                  )}
                </Card>
              </Col>{" "}
              <Col xs={24} lg={8}>
                <Card className="chart-card shadow-sm">
                  <div className="card-title-section mb-3">
                    <Space align="center">
                      <PieChartOutlined className="card-icon" />
                      <Title level={4} className="mb-0">
                        Causes by Category
                      </Title>
                    </Space>
                  </div>
                  {stats?.causesByCategory ? (
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={causesByCategoryChartOptions}
                    />
                  ) : (
                    <div className="no-data-message">
                      <Text type="secondary">No category data available</Text>
                    </div>
                  )}
                </Card>
              </Col>
            </Row>

            <Row gutter={[24, 24]} className="admin-content-row">
              <Col xs={24} lg={16}>
                <Card className="activities-card shadow-sm">
                  <div className="card-title-section">
                    <Space align="center">
                      <BellOutlined className="card-icon" />
                      <Title level={4} className="mb-0">
                        Recent Activities
                      </Title>
                    </Space>

                    <Select
                      value={activityType}
                      onChange={handleActivityTypeChange}
                      style={{ width: 150 }}
                      className="activity-filter"
                    >
                      <Option value="all">All Activities</Option>
                      <Option value="user">User Activities</Option>
                      <Option value="cause">Cause Activities</Option>
                      <Option value="contribution">Contributions</Option>
                    </Select>
                  </div>

                  <Divider className="mt-3 mb-3" />

                  <List
                    className="activities-list"
                    dataSource={activities || []}
                    renderItem={(activity) => (
                      <List.Item className="activity-item">
                        <List.Item.Meta
                          avatar={
                            activity.type === "user" ? (
                              <UserOutlined className="activity-icon user-icon" />
                            ) : activity.type === "cause" ? (
                              <HeartOutlined className="activity-icon cause-icon" />
                            ) : (
                              <DollarOutlined className="activity-icon contribution-icon" />
                            )
                          }
                          title={
                            <div className="activity-title">
                              <Text strong>{activity.title}</Text>
                              <Badge
                                className="activity-time"
                                count={moment(activity.timestamp).fromNow()}
                                style={{
                                  backgroundColor: "#f0f0f0",
                                  color: "#666",
                                }}
                              />
                            </div>
                          }
                          description={
                            <Text type="secondary">{activity.description}</Text>
                          }
                        />
                        <div className="activity-actions">
                          <Button
                            type="text"
                            size="small"
                            icon={<EyeOutlined />}
                            onClick={() => {
                              if (activity.link) {
                                navigate(activity.link);
                              }
                            }}
                          >
                            View
                          </Button>
                        </div>
                      </List.Item>
                    )}
                    pagination={{
                      onChange: (page) => {
                        console.log(page);
                      },
                      pageSize: 5,
                    }}
                  />
                </Card>
              </Col>

              <Col xs={24} lg={8}>
                <Card className="summary-card shadow-sm">
                  <div className="card-title-section mb-3">
                    <Space align="center">
                      <FileTextOutlined className="card-icon" />
                      <Title level={4} className="mb-0">
                        Summary Report
                      </Title>
                    </Space>
                  </div>

                  <div className="summary-content">
                    <div className="summary-item">
                      <Text strong>Top Performing Cause:</Text>
                      <Text>{stats?.topCause?.title || "N/A"}</Text>
                      <div className="summary-detail">
                        <Text type="secondary">
                          ${stats?.topCause?.amount || 0} raised from{" "}
                          {stats?.topCause?.contributors || 0} contributors
                        </Text>
                      </div>
                    </div>

                    <Divider className="my-3" />

                    <div className="summary-item">
                      <Text strong>Most Active Region:</Text>
                      <Text>{stats?.topRegion?.name || "N/A"}</Text>
                      <div className="summary-detail">
                        <Text type="secondary">
                          {stats?.topRegion?.causes || 0} active causes
                        </Text>
                      </div>
                    </div>

                    <Divider className="my-3" />

                    <div className="summary-item">
                      <Text strong>Platform Health:</Text>
                      <div className="health-indicators">
                        <Tooltip title="User Engagement">
                          <div
                            className={`health-indicator ${
                              stats?.health?.engagement >= 70
                                ? "good"
                                : stats?.health?.engagement >= 40
                                ? "moderate"
                                : "poor"
                            }`}
                          >
                            <TeamOutlined /> {stats?.health?.engagement || 0}%
                          </div>
                        </Tooltip>

                        <Tooltip title="Contribution Rate">
                          <div
                            className={`health-indicator ${
                              stats?.health?.contributionRate >= 70
                                ? "good"
                                : stats?.health?.contributionRate >= 40
                                ? "moderate"
                                : "poor"
                            }`}
                          >
                            <DollarOutlined />{" "}
                            {stats?.health?.contributionRate || 0}%
                          </div>
                        </Tooltip>

                        <Tooltip title="Cause Success Rate">
                          <div
                            className={`health-indicator ${
                              stats?.health?.causeSuccess >= 70
                                ? "good"
                                : stats?.health?.causeSuccess >= 40
                                ? "moderate"
                                : "poor"
                            }`}
                          >
                            <CheckCircleOutlined />{" "}
                            {stats?.health?.causeSuccess || 0}%
                          </div>
                        </Tooltip>
                      </div>
                    </div>

                    <Divider className="my-3" />

                    <div className="admin-actions text-center">
                      <Button
                        type="primary"
                        icon={<DownloadOutlined />}
                        className="download-report-btn"
                      >
                        Download Full Report
                      </Button>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
