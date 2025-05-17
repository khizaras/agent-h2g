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
      <div className="container">
        <Breadcrumb className="breadcrumb-navigation mt-3 mb-2">
          <Breadcrumb.Item>
            <Link to="/">Home</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Food Assistance Causes</Breadcrumb.Item>
        </Breadcrumb>

        <div className="page-header-wrapper">
          <div className="page-header flexible-header mb-3">
            <div className="title-section">
              <Title level={2} className="mb-1">
                Food Assistance Causes
              </Title>
              <Text type="secondary" className="header-description">
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
              >
                Create New Cause
              </Button>
            )}
          </div>
        </div>

        <Card className="filters-card shadow-sm mb-4">
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
          {isLoading ? (
            <div className="loading-container text-center p-5">
              <Spin size="large" />
              <div className="mt-3">
                <Text type="secondary">Loading causes...</Text>
              </div>
            </div>
          ) : causes.length > 0 ? (
            <>
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
              </Row>

              <div className="pagination-container text-center mt-4 mb-4">
                <Pagination
                  current={pagination.page}
                  pageSize={pagination.limit}
                  total={pagination.total}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                  showTotal={(total) => `Total ${total} causes`}
                  className="custom-pagination"
                />
              </div>
            </>
          ) : (
            <Card className="empty-state-card shadow-sm p-4 text-center">
              <Empty
                description={
                  <div className="empty-description">
                    <Text className="mb-2">
                      No causes found matching your filters.
                    </Text>
                    <div className="mt-3">
                      <Button
                        type="primary"
                        onClick={handleResetFilters}
                        className="mr-2"
                      >
                        Clear filters
                      </Button>
                      {user && (
                        <Button
                          type="default"
                          onClick={() => navigate("/causes/create")}
                        >
                          Create a new cause
                        </Button>
                      )}
                    </div>
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
