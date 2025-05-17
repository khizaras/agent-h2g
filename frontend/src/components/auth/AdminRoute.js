import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { Spin, Result, Button } from "antd";
import { LoadingOutlined, LockOutlined } from "@ant-design/icons";

const AdminRoute = () => {
  const { user, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return (
      <div className="admin-loading-container">
        <Spin
          size="large"
          indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />}
        />
        <div className="loading-text">Loading admin dashboard...</div>
      </div>
    );
  }

  // Check for both boolean and numeric (1) values for is_admin
  if (user && (user.is_admin === true || user.is_admin === 1)) {
    return <Outlet />;
  } else {
    return (
      <Result
        status="403"
        title="Access Denied"
        subTitle="Sorry, you are not authorized to access this page."
        icon={<LockOutlined />}
        extra={
          <Button type="primary" href="/">
            Back to Home
          </Button>
        }
      />
    );
  }
};

export default AdminRoute;
