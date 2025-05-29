import React from "react";
import { Card, Row, Col, Statistic, Table, Timeline, Spin, Empty } from "antd";
import { Line, Bar } from "@ant-design/charts";
import {
  MessageOutlined,
  UserOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  RiseOutlined,
  FireOutlined,
} from "@ant-design/icons";
import moment from "moment";

const ChatStatistics = ({ stats, loading, type = "user" }) => {
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!stats) {
    return <Empty description="No statistics available" />;
  }

  // Prepare data for daily activity chart
  const dailyActivityData = (
    stats.daily_stats ||
    stats.dailyActivity ||
    []
  ).map((item) => ({
    date: moment(item.date).format("MMM DD"),
    messages: item.message_count,
    users: item.active_users,
  }));

  // Prepare data for hourly distribution
  const hourlyData = (
    stats.hourly_distribution ||
    stats.timeDistribution ||
    []
  ).map((item) => ({
    hour: `${item.hour}:00`,
    count: item.message_count,
    users: item.unique_users,
  }));

  // Configure line chart for daily activity
  const dailyConfig = {
    data: dailyActivityData,
    xField: "date",
    yField: "messages",
    smooth: true,
    point: {
      size: 3,
    },
    tooltip: {
      showMarkers: false,
    },
  };

  // Configure bar chart for hourly distribution
  const hourlyConfig = {
    data: hourlyData,
    xField: "hour",
    yField: "count",
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
    label: {
      position: "top",
      style: {
        fill: "#595959",
        fontSize: 12,
      },
    },
  };

  const growthConfig =
    type === "platform" && stats.growth_stats
      ? {
          data: stats.growth_stats.map((item) => ({
            week: `Week ${item.week}`,
            users: item.new_users,
            messages: item.messages,
          })),
          xField: "week",
          yField: "users",
          seriesField: "type",
          smooth: true,
        }
      : null;

  return (
    <div className="chat-statistics">
      {/* Summary Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Messages"
              value={
                type === "user" ? stats.totalMessages : stats.total_messages
              }
              prefix={<MessageOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Sessions"
              value={
                type === "user" ? stats.total_sessions : stats.total_sessions
              }
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={
                type === "user" ? "Avg. Messages/Session" : "Active Users Today"
              }
              value={
                type === "user"
                  ? Math.round(stats.avg_messages_per_session)
                  : stats.active_users_today
              }
              prefix={type === "user" ? <MessageOutlined /> : <TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={type === "user" ? "Avg. Message Length" : "Messages Today"}
              value={
                type === "user" ? stats.avgMessageLength : stats.messages_today
              }
              prefix={<FireOutlined />}
              suffix="chars"
            />
          </Card>
        </Col>
      </Row>{" "}
      {/* Charts */}
      <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
        <Col xs={24} lg={12}>
          <Card title="Daily Activity">
            <Line {...dailyConfig} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Hourly Distribution">
            <Bar {...hourlyConfig} />
          </Card>
        </Col>
      </Row>
      {/* Additional Stats */}
      {type === "platform" && stats.top_users && (
        <Card title="Top Users" style={{ marginTop: "16px" }}>
          <Table
            dataSource={stats.top_users}
            columns={[
              {
                title: "User",
                dataIndex: "user_name",
                key: "user_name",
              },
              {
                title: "Messages",
                dataIndex: "message_count",
                key: "message_count",
                sorter: (a, b) => a.message_count - b.message_count,
              },
              {
                title: "Sessions",
                dataIndex: "session_count",
                key: "session_count",
                sorter: (a, b) => a.session_count - b.session_count,
              },
              {
                title: "Avg. Message Length",
                dataIndex: "avg_message_length",
                key: "avg_message_length",
                render: (val) => Math.round(val),
                sorter: (a, b) => a.avg_message_length - b.avg_message_length,
              },
            ]}
            pagination={false}
          />
        </Card>
      )}
      {type === "platform" && stats.growth_stats && (
        <Card title="Platform Growth" style={{ marginTop: "16px" }}>
          <Line {...growthConfig} />
        </Card>
      )}{" "}
      {type === "user" && stats.responseTimeStats && (
        <Card title="Response Time Analysis" style={{ marginTop: "16px" }}>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Statistic
                title="Avg. Response Time"
                value={Math.round(stats.responseTimeStats.avg_response_time)}
                suffix="seconds"
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="Min Response Time"
                value={stats.responseTimeStats.min_response_time}
                suffix="seconds"
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="Max Response Time"
                value={stats.responseTimeStats.max_response_time}
                suffix="seconds"
              />
            </Col>
          </Row>
        </Card>
      )}
      {type === "user" && stats.timing_analysis && (
        <Card title="Session Timing" style={{ marginTop: "16px" }}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Statistic
                title="Duration"
                value={stats.duration_minutes}
                suffix="minutes"
              />
            </Col>
            <Col span={12}>
              <Statistic
                title="Avg. Time Between Messages"
                value={Math.round(
                  stats.timing_analysis.avg_time_between_messages
                )}
                suffix="seconds"
              />
            </Col>
          </Row>
        </Card>
      )}
    </div>
  );
};

export default ChatStatistics;
