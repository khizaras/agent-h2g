"use client";

import React, { useEffect, useState } from "react";
import { Card, Progress, Statistic, Tag, Spin, Alert } from "antd";
import {
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";

interface EnrollmentData {
  isEnrolled: boolean;
  enrollment?: {
    enrollment_status: string;
    created_at: string;
    message?: string;
    notes?: string;
  };
  courseInfo: {
    maxParticipants: number;
    currentParticipants: number;
    availableSpots: number;
    registrationDeadline?: string;
    startDate?: string;
    endDate?: string;
    enrollmentStatus: string;
  };
}

interface EnrollmentStatusProps {
  causeId: number;
  refreshTrigger?: number;
}

export default function EnrollmentStatus({ 
  causeId, 
  refreshTrigger = 0 
}: EnrollmentStatusProps) {
  const [enrollmentData, setEnrollmentData] = useState<EnrollmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEnrollmentStatus = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/causes/${causeId}/enroll`);
      const data = await response.json();

      if (data.success) {
        setEnrollmentData(data.data);
      } else {
        setError(data.message || "Failed to fetch enrollment status");
      }
    } catch (error) {
      console.error("Error fetching enrollment status:", error);
      setError("Failed to load enrollment information");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollmentStatus();
  }, [causeId, refreshTrigger]);

  const getStatusTag = (status: string) => {
    const statusConfig: Record<string, { color: string; icon: React.ReactNode; text: string }> = {
      pending: { color: "orange", icon: <ClockCircleOutlined />, text: "Pending Review" },
      accepted: { color: "green", icon: <CheckCircleOutlined />, text: "Accepted" },
      rejected: { color: "red", icon: <CloseCircleOutlined />, text: "Rejected" },
      completed: { color: "blue", icon: <CheckCircleOutlined />, text: "Completed" },
      cancelled: { color: "gray", icon: <CloseCircleOutlined />, text: "Cancelled" },
    };

    const config = statusConfig[status] || { color: "default", icon: <UserOutlined />, text: status };

    return (
      <Tag color={config.color} icon={config.icon} style={{ fontSize: "14px", padding: "4px 8px" }}>
        {config.text}
      </Tag>
    );
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "#ff4d4f";
    if (percentage >= 70) return "#faad14";
    return "#52c41a";
  };

  if (loading) {
    return (
      <Card style={{ borderRadius: "12px", marginBottom: "16px" }}>
        <div style={{ textAlign: "center", padding: "24px" }}>
          <Spin size="large" />
          <p style={{ marginTop: "16px", color: "#666" }}>Loading enrollment information...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert
        message="Unable to load enrollment information"
        description={error}
        type="warning"
        showIcon
        style={{ marginBottom: "16px", borderRadius: "8px" }}
      />
    );
  }

  if (!enrollmentData) return null;

  const { isEnrolled, enrollment, courseInfo } = enrollmentData;
  const occupancyPercentage = (courseInfo.currentParticipants / courseInfo.maxParticipants) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <TeamOutlined />
            <span>Enrollment Information</span>
          </div>
        }
        style={{ borderRadius: "12px", marginBottom: "16px" }}
      >
        {/* Course Capacity */}
        <div style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontWeight: "500" }}>Course Capacity</span>
            <span style={{ color: "#666", fontSize: "14px" }}>
              {courseInfo.currentParticipants} / {courseInfo.maxParticipants} enrolled
            </span>
          </div>
          <Progress
            percent={occupancyPercentage}
            strokeColor={getProgressColor(occupancyPercentage)}
            showInfo={false}
            size="default"
          />
          <div style={{ marginTop: "8px", fontSize: "12px", color: "#666" }}>
            {courseInfo.availableSpots > 0 
              ? `${courseInfo.availableSpots} spots remaining`
              : "Course is full"
            }
          </div>
        </div>

        {/* User Enrollment Status */}
        {isEnrolled && enrollment && (
          <div style={{ 
            backgroundColor: "#f8f9fa", 
            padding: "16px", 
            borderRadius: "8px",
            marginBottom: "16px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <h4 style={{ margin: 0, color: "#1890ff" }}>Your Enrollment</h4>
              {getStatusTag(enrollment.enrollment_status)}
            </div>
            
            <div style={{ fontSize: "14px", color: "#666", marginBottom: "8px" }}>
              Enrolled on: {new Date(enrollment.created_at).toLocaleDateString()}
            </div>

            {enrollment.message && (
              <div style={{ marginBottom: "8px" }}>
                <strong style={{ fontSize: "13px", color: "#555" }}>Your message:</strong>
                <p style={{ 
                  margin: "4px 0 0 0", 
                  fontSize: "13px", 
                  color: "#666",
                  fontStyle: "italic",
                  padding: "8px",
                  backgroundColor: "#fff",
                  borderRadius: "4px",
                  border: "1px solid #e8e8e8"
                }}>
                  "{enrollment.message}"
                </p>
              </div>
            )}

            {enrollment.notes && (
              <div>
                <strong style={{ fontSize: "13px", color: "#555" }}>Instructor notes:</strong>
                <p style={{ 
                  margin: "4px 0 0 0", 
                  fontSize: "13px", 
                  color: "#666",
                  padding: "8px",
                  backgroundColor: "#fff5f5",
                  borderRadius: "4px",
                  border: "1px solid #ffe0e0"
                }}>
                  {enrollment.notes}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Course Statistics */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", 
          gap: "16px" 
        }}>
          <Statistic
            title="Total Enrolled"
            value={courseInfo.currentParticipants}
            prefix={<UserOutlined />}
            valueStyle={{ fontSize: "18px" }}
          />
          <Statistic
            title="Available Spots"
            value={courseInfo.availableSpots}
            prefix={<TeamOutlined />}
            valueStyle={{ 
              fontSize: "18px",
              color: courseInfo.availableSpots > 0 ? "#52c41a" : "#ff4d4f"
            }}
          />
          <Statistic
            title="Capacity"
            value={`${Math.round(occupancyPercentage)}%`}
            valueStyle={{ fontSize: "18px" }}
          />
        </div>

        {/* Course Dates */}
        {(courseInfo.startDate || courseInfo.endDate || courseInfo.registrationDeadline) && (
          <div style={{ 
            marginTop: "20px", 
            paddingTop: "16px", 
            borderTop: "1px solid #f0f0f0" 
          }}>
            <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", color: "#555" }}>Important Dates</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px" }}>
              {courseInfo.registrationDeadline && (
                <div style={{ color: "#666" }}>
                  <strong>Registration Deadline:</strong> {new Date(courseInfo.registrationDeadline).toLocaleDateString()}
                </div>
              )}
              {courseInfo.startDate && (
                <div style={{ color: "#666" }}>
                  <strong>Start Date:</strong> {new Date(courseInfo.startDate).toLocaleDateString()}
                </div>
              )}
              {courseInfo.endDate && (
                <div style={{ color: "#666" }}>
                  <strong>End Date:</strong> {new Date(courseInfo.endDate).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}