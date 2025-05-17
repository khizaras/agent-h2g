import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Spin,
} from "antd";
import {
  UploadOutlined,
  EnvironmentOutlined,
  BulbOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import moment from "moment";

import { getCauseById, updateCause } from "../../redux/slices/causesSlice";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const EditCausePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cause, isLoading } = useSelector((state) => state.causes);
  const { user } = useSelector((state) => state.auth);

  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    dispatch(getCauseById(id))
      .unwrap()
      .then((causeData) => {
        // Check if user is authorized to edit
        if (!user?.is_admin && user?.id !== causeData.user_id) {
          message.error("You don't have permission to edit this cause");
          navigate(`/causes/${id}`);
          return;
        }

        // Set preview image if the cause has an image
        if (causeData.image) {
          setPreviewImage(`/uploads/${causeData.image}`);
        }

        // Set form values
        form.setFieldsValue({
          ...causeData,
          end_date: causeData.end_date ? moment(causeData.end_date) : null,
        });

        setInitialLoad(false);
      })
      .catch((error) => {
        message.error(`Error loading cause: ${error}`);
        navigate("/causes");
      });
  }, [dispatch, id, navigate, user, form]);

  const onFinish = (values) => {
    const formData = new FormData();

    // Add form values to formData
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

    dispatch(updateCause({ id, causeData: formData }))
      .unwrap()
      .then(() => {
        message.success("Cause updated successfully!");
        navigate(`/causes/${id}`);
      })
      .catch((error) => {
        message.error(`Failed to update cause: ${error}`);
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
    <div>
      <UploadOutlined />
      <div style={{ marginTop: 8 }}>Change Image</div>
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

  if (isLoading || initialLoad) {
    return (
      <div className="edit-cause-page loading">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="edit-cause-page">
      <Breadcrumb className="breadcrumb-navigation">
        <Breadcrumb.Item>
          <a href="/">Home</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="/causes">Causes</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href={`/causes/${id}`}>{cause?.title}</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Edit</Breadcrumb.Item>
      </Breadcrumb>

      <Card className="form-card">
        <Title level={2}>Edit Cause</Title>
        <Text type="secondary" className="intro-text">
          Update the information for your cause.
        </Text>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="edit-cause-form"
        >
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
              prefix={<BulbOutlined />}
              placeholder="Give your cause a clear, descriptive title"
            />
          </Form.Item>

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
            />
          </Form.Item>

          <Space size="large" align="start" className="form-row">
            <Form.Item
              name="location"
              label="Location"
              rules={[{ required: true, message: "Please specify a location" }]}
            >
              <Input
                prefix={<EnvironmentOutlined />}
                placeholder="City, State or Region"
              />
            </Form.Item>

            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: "Please select a category" }]}
            >
              <Select placeholder="Select a category">
                <Option value="local">Local Community Support</Option>
                <Option value="emergency">Emergency Relief</Option>
                <Option value="recurring">Recurring Program</Option>
              </Select>
            </Form.Item>
          </Space>

          <Space size="large" align="start" className="form-row">
            <Form.Item name="funding_goal" label="Funding Goal ($)">
              <InputNumber
                min={0}
                prefix={<DollarOutlined />}
                placeholder="Amount needed"
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item name="food_goal" label="Food Items Goal">
              <InputNumber
                min={0}
                prefix={<ShoppingOutlined />}
                placeholder="Quantity needed"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Space>

          <Space size="large" align="start" className="form-row">
            <Form.Item name="end_date" label="End Date (Optional)">
              <DatePicker
                style={{ width: "100%" }}
                disabledDate={(current) =>
                  current && current < moment().startOf("day")
                }
                placeholder="When does this cause end?"
                prefix={<ClockCircleOutlined />}
              />
            </Form.Item>

            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: "Please select a status" }]}
            >
              <Select placeholder="Select status">
                <Option value="active">Active</Option>
                <Option value="completed">Completed</Option>
                <Option value="suspended">Suspended</Option>
              </Select>
            </Form.Item>
          </Space>

          <Form.Item name="image" label="Cause Image">
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
                />
              ) : (
                uploadButton
              )}
            </Upload>
            <Text type="secondary">
              Update the image that represents your cause.
            </Text>
          </Form.Item>

          <Form.Item className="form-actions">
            <Button
              type="default"
              onClick={() => navigate(`/causes/${id}`)}
              style={{ marginRight: 16 }}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Update Cause
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default EditCausePage;
