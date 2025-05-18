import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  Card,
  Input,
  Select,
  Button,
  Typography,
  Empty,
  Pagination,
  Spin,
  Tag,
  Space,
  Breadcrumb,
  Divider,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  FilterOutlined,
  ReloadOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";

import CauseCard from "../../components/causes/CauseCard";
import { getCauses } from "../../redux/slices/causesSlice";
import "./CausesPage.css";

const { Title, Text } = Typography;
const { Option } = Select;

const CausesPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { causes, pagination, isLoading } = useSelector(
    (state) => state.causes
  );
  const { user } = useSelector((state) => state.auth);

  const [filters, setFilters] = useState({
    category: "",
    location: "",
    status: "active",
    search: "",
    page: 1,
    limit: 9,
  });

  useEffect(() => {
    dispatch(getCauses(filters));
  }, [dispatch, filters]);

  const handleSearch = (value) => {
    setFilters({ ...filters, search: value, page: 1 });
  };

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value, page: 1 });
  };

  const handleResetFilters = () => {
    setFilters({
      category: "",
      location: "",
      status: "active",
      search: "",
      page: 1,
      limit: 9,
    });
  };

  const handlePageChange = (page) => {
    setFilters({ ...filters, page });
  };
  return (
    <div className="causes-page-container">
      <div
        className="container"
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 16px" }}
      >
        <Breadcrumb className="breadcrumb-navigation">
          <Breadcrumb.Item>
            <Link to="/">Home</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Food Assistance Causes</Breadcrumb.Item>
        </Breadcrumb>{" "}
        <div className="page-header-wrapper">
          <div className="page-header">
            <div className="title-section">
              <Title
                level={2}
                style={{ marginBottom: 8, fontSize: 28, fontWeight: 600 }}
              >
                Food Assistance Causes
              </Title>
              <Text
                type="secondary"
                className="header-description"
                style={{ fontSize: 16 }}
              >
                Browse through active food assistance initiatives and support
                those in need in your community.
              </Text>
            </div>

            {user && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => navigate("/causes/create")}
                size="large"
                className="create-button"
                style={{ fontWeight: 500, height: 48 }}
              >
                Create New Cause
              </Button>
            )}
          </div>
        </div>
        <Card className="filters-card">
          {" "}
          <div className="filters-container">
            <Input.Search
              placeholder="Search causes by title or description"
              onSearch={handleSearch}
              className="search-input"
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              allowClear
              size="large"
              enterButton={<SearchOutlined />}
              style={{ maxWidth: "500px" }}
            />

            <Space size="middle" className="filters-group">
              <Select
                placeholder="Category"
                style={{ minWidth: 160 }}
                value={filters.category || undefined}
                onChange={(value) => handleFilterChange("category", value)}
                allowClear
                size="large"
                className="filter-select"
                popupMatchSelectWidth={false}
              >
                <Option value="local">Local Community</Option>
                <Option value="emergency">Emergency Relief</Option>
                <Option value="recurring">Recurring Program</Option>
              </Select>

              <Select
                placeholder="Status"
                style={{ minWidth: 160 }}
                value={filters.status || undefined}
                onChange={(value) => handleFilterChange("status", value)}
                allowClear
                size="large"
                className="filter-select"
                popupMatchSelectWidth={false}
              >
                <Option value="active">Active</Option>
                <Option value="completed">Completed</Option>
                <Option value="suspended">Suspended</Option>
              </Select>

              <Button
                icon={<ReloadOutlined />}
                onClick={handleResetFilters}
                title="Reset Filters"
                size="large"
                className="reset-button"
                type="default"
              />
            </Space>
          </div>
          {(filters.category ||
            filters.status !== "active" ||
            filters.search) && (
            <div className="active-filters mt-3">
              <Text type="secondary" className="mr-2">
                Active Filters:
              </Text>
              <Space size="small" wrap>
                {filters.category && (
                  <Tag
                    color="blue"
                    closable
                    onClose={() => handleFilterChange("category", "")}
                    className="filter-tag"
                  >
                    Category:{" "}
                    {filters.category.charAt(0).toUpperCase() +
                      filters.category.slice(1)}
                  </Tag>
                )}

                {filters.status && filters.status !== "active" && (
                  <Tag
                    color="orange"
                    closable
                    onClose={() => handleFilterChange("status", "active")}
                    className="filter-tag"
                  >
                    Status:{" "}
                    {filters.status.charAt(0).toUpperCase() +
                      filters.status.slice(1)}
                  </Tag>
                )}

                {filters.search && (
                  <Tag
                    color="green"
                    closable
                    onClose={() => handleFilterChange("search", "")}
                    className="filter-tag"
                  >
                    Search: {filters.search}
                  </Tag>
                )}
              </Space>
            </div>
          )}
        </Card>
        <div className="causes-results">
          {" "}
          {isLoading ? (
            <div className="loading-container">
              <Spin size="large" tip="Loading causes..." />
              <div style={{ marginTop: 20 }}>
                <Text type="secondary" style={{ fontSize: 16 }}>
                  Please wait while we retrieve the latest causes
                </Text>
              </div>
            </div>
          ) : causes.length > 0 ? (
            <>
              {" "}
              <Row gutter={[24, 24]} className="causes-grid">
                {causes.map((cause) => (
                  <Col
                    xs={24}
                    sm={12}
                    lg={8}
                    key={cause.id}
                    className="cause-column"
                  >
                    <CauseCard cause={cause} />
                  </Col>
                ))}
              </Row>{" "}
              <div className="pagination-container">
                <Card
                  bordered={false}
                  style={{
                    background: "#f9f9f9",
                    borderRadius: "8px",
                    padding: "16px 0",
                  }}
                >
                  <Pagination
                    current={pagination.page}
                    pageSize={pagination.limit}
                    total={pagination.total}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                    showTotal={(total) => `Total ${total} causes`}
                    className="custom-pagination"
                    style={{ textAlign: "center" }}
                  />
                </Card>
              </div>
            </>
          ) : (
            <Card className="empty-state-card">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                imageStyle={{ height: 120 }}
                description={
                  <div className="empty-description">
                    <Title
                      level={4}
                      style={{ marginBottom: 16, color: "#666" }}
                    >
                      No causes found matching your filters
                    </Title>
                    <Text
                      style={{
                        fontSize: 16,
                        display: "block",
                        marginBottom: 24,
                      }}
                    >
                      Try adjusting your search criteria or create a new cause
                    </Text>
                    <Space size="middle">
                      <Button
                        type="primary"
                        size="large"
                        onClick={handleResetFilters}
                        icon={<ReloadOutlined />}
                      >
                        Clear filters
                      </Button>
                      {user && (
                        <Button
                          type="default"
                          size="large"
                          onClick={() => navigate("/causes/create")}
                          icon={<PlusOutlined />}
                        >
                          Create a new cause
                        </Button>
                      )}
                    </Space>
                  </div>
                }
              />
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CausesPage;
