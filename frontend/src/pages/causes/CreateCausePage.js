import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Form,
  Input,
  Select,
  Button,
  Upload,
  InputNumber,
  Card,
  Typography,
  message,
  DatePicker,
  Breadcrumb,
  Space,
  Divider,
  Row,
  Col,
} from "antd";
import {
  UploadOutlined,
  EnvironmentOutlined,
  UserOutlined,
  BulbOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  ShoppingOutlined,
  InfoCircleOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import moment from "moment";

import { createCause } from "../../redux/slices/causesSlice";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const CreateCausePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.causes);
  const { user } = useSelector((state) => state.auth);

  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const onFinish = (values) => {
    const formData = new FormData();

    // Add all form values to formData
    Object.keys(values).forEach((key) => {
      if (key === "end_date") {
        formData.append(
          key,
          values[key] ? values[key].format("YYYY-MM-DD") : ""
        );
      } else if (values[key] !== undefined && values[key] !== null) {
        formData.append(key, values[key]);
      }
    });

    // Add image if uploaded
    if (imageFile) {
      formData.append("image", imageFile);
    }

    dispatch(createCause(formData))
      .unwrap()
      .then((cause) => {
        message.success("Cause created successfully!");
        navigate(`/causes/${cause.id}`);
      })
      .catch((error) => {
        message.error(`Failed to create cause: ${error}`);
      });
  };

  const handleImageChange = ({ file }) => {
    if (file.status === "uploading") {
      return;
    }

    if (file.status === "done") {
      setImageFile(file.originFileObj);

      // Create a preview URL
      const reader = new FileReader();
      reader.addEventListener("load", () => setPreviewImage(reader.result));
      reader.readAsDataURL(file.originFileObj);
    }
  };

  // Custom upload button
  const uploadButton = (
    <div className="upload-button-content">
      <UploadOutlined className="upload-icon" />
      <div className="upload-text">Upload Image</div>
    </div>
  );

  // Custom file upload props
  const fileUploadProps = {
    name: "image",
    beforeUpload: (file) => {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        message.error("You can only upload JPG/PNG files!");
        return false;
      }

      const isLessThan5MB = file.size / 1024 / 1024 < 5;
      if (!isLessThan5MB) {
        message.error("Image must be smaller than 5MB!");
        return false;
      }

      return false; // Prevent automatic upload
    },
    onChange: handleImageChange,
    showUploadList: false,
    customRequest: ({ onSuccess }) => {
      setTimeout(() => {
        onSuccess("ok", null);
      }, 0);
    },
  };

  return (
    <div className="create-cause-page-container">
      <div className="container">
        <Breadcrumb className="breadcrumb-navigation mt-3 mb-2">
          <Breadcrumb.Item>
            <Link to="/">Home</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/causes">Causes</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Create New Cause</Breadcrumb.Item>
        </Breadcrumb>

        <Card className="form-card shadow mb-4">
          <div className="back-link mb-3">
            <Button
              type="link"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/causes")}
              className="p-0"
            >
              Back to causes
            </Button>
          </div>

          <div className="form-header mb-4">
            <Title level={2} className="mb-2">
              Create a New Cause
            </Title>
            <Paragraph type="secondary" className="intro-text">
              Fill out the form below to create a new food assistance cause. Be
              clear and detailed to help others understand how they can help.
            </Paragraph>
          </div>

          <Divider className="mb-4" />

          <Form
            layout="vertical"
            onFinish={onFinish}
            className="create-cause-form"
            initialValues={{
              category: "local",
              status: "active",
            }}
            size="large"
          >
            <Row gutter={24}>
              <Col xs={24} lg={16}>
                <Form.Item
                  name="title"
                  label="Cause Title"
                  rules={[
                    {
                      required: true,
                      message: "Please enter a title for your cause",
                    },
                  ]}
                >
                  <Input
                    prefix={<BulbOutlined className="site-form-item-icon" />}
                    placeholder="Give your cause a clear, descriptive title"
                    className="input-with-icon"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} lg={8}>
                <Form.Item
                  name="category"
                  label="Category"
                  rules={[
                    { required: true, message: "Please select a category" },
                  ]}
                >
                  <Select placeholder="Select a category">
                    <Option value="local">Local Community Support</Option>
                    <Option value="emergency">Emergency Relief</Option>
                    <Option value="recurring">Recurring Program</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="description"
              label="Description"
              rules={[
                { required: true, message: "Please provide a description" },
                {
                  min: 50,
                  message: "Description must be at least 50 characters",
                },
              ]}
            >
              <TextArea
                rows={6}
                placeholder="Describe your cause in detail. What's the need? Who will benefit? How will contributions be used?"
                className="description-textarea"
              />
            </Form.Item>

            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="location"
                  label="Location"
                  rules={[
                    { required: true, message: "Please specify a location" },
                  ]}
                >
                  <Input
                    prefix={
                      <EnvironmentOutlined className="site-form-item-icon" />
                    }
                    placeholder="City, State or Region"
                    className="input-with-icon"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item name="end_date" label="End Date (Optional)">
                  <DatePicker
                    style={{ width: "100%" }}
                    disabledDate={(current) =>
                      current && current < moment().startOf("day")
                    }
                    placeholder="When does this cause end?"
                    format="YYYY-MM-DD"
                    className="custom-datepicker"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item name="funding_goal" label="Funding Goal ($)">
                  <InputNumber
                    min={0}
                    placeholder="Amount needed"
                    style={{ width: "100%" }}
                    formatter={(value) =>
                      `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    className="custom-input-number"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item name="food_goal" label="Food Items Goal">
                  <InputNumber
                    min={0}
                    placeholder="Quantity needed"
                    style={{ width: "100%" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    className="custom-input-number"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Card className="upload-card mt-3 mb-3">
              <Form.Item
                name="image"
                label="Cause Image"
                extra="Add a high-quality image that represents your cause. This will be displayed on your cause page."
              >
                <Upload
                  {...fileUploadProps}
                  listType="picture-card"
                  className="cause-image-uploader"
                >
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Cause preview"
                      style={{ width: "100%" }}
                      className="preview-image"
                    />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              </Form.Item>
            </Card>

            <Divider className="mt-4 mb-4" />

            <Form.Item className="form-actions text-right">
              <Space size="middle">
                <Button
                  type="default"
                  onClick={() => navigate("/causes")}
                  size="large"
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isLoading}
                  size="large"
                  className="submit-button"
                >
                  Create Cause
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default CreateCausePage;
