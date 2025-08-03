"use client";

import React, { useState } from "react";
import { Button, Modal, Form, Input, message, Spin } from "antd";
import { UserAddOutlined, LoadingOutlined } from "@ant-design/icons";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

const { TextArea } = Input;

interface EnrollmentButtonProps {
  causeId: number;
  courseName: string;
  maxParticipants: number;
  currentParticipants: number;
  enrollmentStatus?: string;
  onEnrollmentSuccess?: () => void;
}

export default function EnrollmentButton({
  causeId,
  courseName,
  maxParticipants,
  currentParticipants,
  enrollmentStatus = "available",
  onEnrollmentSuccess,
}: EnrollmentButtonProps) {
  const { data: session } = useSession();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const availableSpots = maxParticipants - currentParticipants;
  const isFull = availableSpots <= 0;
  const isDisabled = enrollmentStatus !== "available" || isFull;

  const getButtonText = () => {
    if (enrollmentStatus === "enrolled") return "Already Enrolled";
    if (enrollmentStatus === "pending") return "Enrollment Pending";
    if (enrollmentStatus === "expired") return "Registration Closed";
    if (enrollmentStatus === "started") return "Course Started";
    if (isFull) return "Course Full";
    return "Enroll Now";
  };

  const getButtonProps = () => {
    const baseProps = {
      size: "large" as const,
      icon: <UserAddOutlined />,
      disabled: isDisabled || !session,
    };

    if (enrollmentStatus === "enrolled" || enrollmentStatus === "pending") {
      return { ...baseProps, type: "default" as const };
    }

    return { ...baseProps, type: "primary" as const };
  };

  const handleEnroll = async (values: { message?: string }) => {
    if (!session) {
      message.error("Please sign in to enroll");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/causes/${causeId}/enroll`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: values.message || "",
        }),
      });

      const data = await response.json();

      if (data.success) {
        message.success("Enrollment submitted successfully!");
        setIsModalVisible(false);
        form.resetFields();
        onEnrollmentSuccess?.();
      } else {
        message.error(data.message || "Failed to enroll");
      }
    } catch (error) {
      console.error("Enrollment error:", error);
      message.error("Failed to submit enrollment");
    } finally {
      setLoading(false);
    }
  };

  const showModal = () => {
    if (!session) {
      message.info("Please sign in to enroll in this course");
      return;
    }
    setIsModalVisible(true);
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: isDisabled ? 1 : 1.02 }}
        whileTap={{ scale: isDisabled ? 1 : 0.98 }}
      >
        <Button
          {...getButtonProps()}
          onClick={showModal}
          style={{
            width: "100%",
            height: "48px",
            fontSize: "16px",
            fontWeight: "600",
            borderRadius: "8px",
          }}
        >
          {getButtonText()}
        </Button>
      </motion.div>

      {/* Available spots indicator */}
      {enrollmentStatus === "available" && (
        <div style={{ textAlign: "center", marginTop: "8px" }}>
          <span style={{ 
            fontSize: "12px", 
            color: isFull ? "#ff4d4f" : "#52c41a",
            fontWeight: "500"
          }}>
            {isFull ? "No spots available" : `${availableSpots} spots remaining`}
          </span>
        </div>
      )}

      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <UserAddOutlined />
            <span>Enroll in Course</span>
          </div>
        }
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={500}
      >
        <div style={{ margin: "16px 0" }}>
          <h4 style={{ margin: "0 0 8px 0", color: "#1890ff" }}>
            {courseName}
          </h4>
          <p style={{ margin: "0", color: "#666", fontSize: "14px" }}>
            You're about to enroll in this training course. Once submitted, your enrollment will be reviewed by the instructor.
          </p>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleEnroll}
          style={{ marginTop: "24px" }}
        >
          <Form.Item
            name="message"
            label="Message (Optional)"
            extra="Tell the instructor why you're interested in this course or any relevant experience you have."
          >
            <TextArea
              rows={4}
              placeholder="I'm interested in this course because..."
              maxLength={500}
              showCount
            />
          </Form.Item>

          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            gap: "12px",
            marginTop: "24px"
          }}>
            <Button
              onClick={() => {
                setIsModalVisible(false);
                form.resetFields();
              }}
              style={{ flex: 1 }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ flex: 1 }}
              icon={loading ? <LoadingOutlined /> : <UserAddOutlined />}
            >
              {loading ? "Enrolling..." : "Submit Enrollment"}
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}