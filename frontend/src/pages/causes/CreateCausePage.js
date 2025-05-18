import React, { useState, useEffect } from "react";
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
  Checkbox,
  Radio,
  Spin,
  Empty,
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
  TagsOutlined,
} from "@ant-design/icons";
import moment from "moment";

import { createCause } from "../../redux/slices/causesSlice";
import {
  getCategories,
  getCategoryById,
  saveCauseFieldValues,
} from "../../redux/slices/categoriesSlice";
import "./CauseForms.css";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const CreateCausePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading: causesLoading } = useSelector((state) => state.causes);
  const {
    categories = [],
    currentCategory = null,
    isLoading: categoriesLoading,
  } = useSelector((state) => state.categories);
  const { user } = useSelector((state) => state.auth);

  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [dynamicFieldValues, setDynamicFieldValues] = useState({});
  const [form] = Form.useForm();

  // Fetch categories when component mounts
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  // Fetch category details when a category is selected
  useEffect(() => {
    if (selectedCategoryId) {
      dispatch(getCategoryById(selectedCategoryId));
    }
  }, [selectedCategoryId, dispatch]);
  const onFinish = (values) => {
    const formData = new FormData();

    // Helper function to safely handle date formatting
    const safelyFormatDate = (dateValue) => {
      return dateValue && moment.isMoment(dateValue) && dateValue.isValid()
        ? dateValue.format("YYYY-MM-DD")
        : "";
    };

    // Add all form values to formData
    Object.keys(values).forEach((key) => {
      // Skip dynamic fields, they'll be handled separately
      if (key.startsWith("dynamic_")) {
        return;
      }
      if (key === "end_date") {
        formData.append(key, safelyFormatDate(values[key]));
      } else if (values[key] !== undefined && values[key] !== null) {
        formData.append(key, values[key]);
      }
    });

    // Add image if uploaded
    if (imageFile) {
      formData.append("image", imageFile);
    }

    // Create an array to store dynamic field values
    const categoryFieldValues = [];

    // Process dynamic fields if a category is selected
    if (selectedCategoryId && currentCategory?.fields?.length > 0) {
      currentCategory.fields.forEach((field) => {
        const fieldKey = `dynamic_${field.id}`;
        if (values[fieldKey] !== undefined) {
          let fieldValue = values[fieldKey];

          // Handle array values (checkbox groups)
          if (Array.isArray(fieldValue)) {
            fieldValue = JSON.stringify(fieldValue);
          }

          categoryFieldValues.push({
            field_id: field.id,
            category_id: selectedCategoryId,
            value: fieldValue !== null ? String(fieldValue) : "",
          });
        }
      });
    }

    dispatch(createCause(formData))
      .unwrap()
      .then((cause) => {
        // If we have category field values, save them
        if (categoryFieldValues.length > 0) {
          dispatch(
            saveCauseFieldValues({
              causeId: cause.id,
              values: categoryFieldValues,
            })
          );
        }

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
      // Set the file for form submission
      setImageFile(file.originFileObj || file);

      // Create a preview URL
      const reader = new FileReader();
      reader.addEventListener("load", () => setPreviewImage(reader.result));
      reader.readAsDataURL(file.originFileObj || file);
    }
  };

  // Handle category change
  const handleCategoryChange = (categoryId) => {
    setSelectedCategoryId(categoryId);

    // Reset dynamic field values when category changes
    setDynamicFieldValues({});

    // Clear any previously set dynamic field values in the form
    if (currentCategory?.fields) {
      const fieldsToReset = {};
      currentCategory.fields.forEach((field) => {
        fieldsToReset[`dynamic_${field.id}`] = undefined;
      });
      form.setFieldsValue(fieldsToReset);
    }
  };

  // Render dynamic fields based on selected category
  const renderDynamicFields = () => {
    if (!currentCategory || !currentCategory.fields || categoriesLoading) {
      return selectedCategoryId ? (
        <Spin tip="Loading category fields..." />
      ) : null;
    }

    if (currentCategory.fields.length === 0) {
      return <Empty description="No custom fields for this category" />;
    }

    return (
      <>
        {" "}
        <Divider orientation="left">
          <Space>
            <TagsOutlined />
            <span>Category-specific Information</span>
          </Space>
        </Divider>
        {[...currentCategory.fields]
          .sort((a, b) => a.display_order - b.display_order)
          .map((field) => {
            const fieldKey = `dynamic_${field.id}`;

            // Generate the appropriate field component based on field type
            switch (field.type) {
              case "text":
                return (
                  <Form.Item
                    key={fieldKey}
                    name={fieldKey}
                    label={field.name}
                    rules={[
                      {
                        required: field.required,
                        message: `Please enter ${field.name}`,
                      },
                    ]}
                  >
                    <Input
                      placeholder={field.placeholder || `Enter ${field.name}`}
                    />
                  </Form.Item>
                );

              case "textarea":
                return (
                  <Form.Item
                    key={fieldKey}
                    name={fieldKey}
                    label={field.name}
                    rules={[
                      {
                        required: field.required,
                        message: `Please enter ${field.name}`,
                      },
                    ]}
                  >
                    <TextArea
                      rows={4}
                      placeholder={field.placeholder || `Enter ${field.name}`}
                    />
                  </Form.Item>
                );

              case "number":
                return (
                  <Form.Item
                    key={fieldKey}
                    name={fieldKey}
                    label={field.name}
                    rules={[
                      {
                        required: field.required,
                        message: `Please enter ${field.name}`,
                      },
                    ]}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      placeholder={field.placeholder || `Enter ${field.name}`}
                    />
                  </Form.Item>
                );
              case "date":
                return (
                  <Form.Item
                    key={fieldKey}
                    name={fieldKey}
                    label={field.name}
                    rules={[
                      {
                        required: field.required,
                        message: `Please select ${field.name}`,
                      },
                    ]}
                  >
                    <DatePicker
                      style={{ width: "100%" }}
                      format="YYYY-MM-DD"
                      placeholder={field.placeholder || `Select ${field.name}`}
                    />
                  </Form.Item>
                );

              case "select":
                let options = [];
                try {
                  options =
                    typeof field.options === "string"
                      ? JSON.parse(field.options)
                      : field.options || [];
                } catch (e) {
                  console.error("Error parsing options:", e);
                }

                return (
                  <Form.Item
                    key={fieldKey}
                    name={fieldKey}
                    label={field.name}
                    rules={[
                      {
                        required: field.required,
                        message: `Please select ${field.name}`,
                      },
                    ]}
                  >
                    <Select
                      placeholder={field.placeholder || `Select ${field.name}`}
                    >
                      {options.map((option, idx) => (
                        <Option
                          key={`${fieldKey}_opt_${idx}`}
                          value={option.value || option}
                        >
                          {option.label || option}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                );

              case "checkbox":
                let checkOptions = [];
                try {
                  checkOptions =
                    typeof field.options === "string"
                      ? JSON.parse(field.options)
                      : field.options || [];
                } catch (e) {
                  console.error("Error parsing options:", e);
                }

                return (
                  <Form.Item
                    key={fieldKey}
                    name={fieldKey}
                    label={field.name}
                    rules={[
                      {
                        required: field.required,
                        message: `Please select at least one ${field.name}`,
                      },
                    ]}
                  >
                    <Checkbox.Group>
                      {checkOptions.map((option, idx) => (
                        <Checkbox
                          key={`${fieldKey}_opt_${idx}`}
                          value={option.value || option}
                        >
                          {option.label || option}
                        </Checkbox>
                      ))}
                    </Checkbox.Group>
                  </Form.Item>
                );

              case "radio":
                let radioOptions = [];
                try {
                  radioOptions =
                    typeof field.options === "string"
                      ? JSON.parse(field.options)
                      : field.options || [];
                } catch (e) {
                  console.error("Error parsing options:", e);
                }

                return (
                  <Form.Item
                    key={fieldKey}
                    name={fieldKey}
                    label={field.name}
                    rules={[
                      {
                        required: field.required,
                        message: `Please select ${field.name}`,
                      },
                    ]}
                  >
                    <Radio.Group>
                      {radioOptions.map((option, idx) => (
                        <Radio
                          key={`${fieldKey}_opt_${idx}`}
                          value={option.value || option}
                        >
                          {option.label || option}
                        </Radio>
                      ))}
                    </Radio.Group>
                  </Form.Item>
                );

              default:
                return null;
            }
          })}
      </>
    );
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

      // Set the image file directly here
      setImageFile(file);

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
          <Divider className="mb-4" />{" "}
          <Form
            layout="vertical"
            onFinish={onFinish}
            className="create-cause-form"
            initialValues={{
              status: "active",
            }}
            size="large"
            form={form}
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
                  name="category_id"
                  label="Category"
                  rules={[
                    { required: true, message: "Please select a category" },
                  ]}
                >
                  <Select
                    placeholder="Select a category"
                    loading={categoriesLoading}
                    onChange={handleCategoryChange}
                  >
                    {categories.map((category) => (
                      <Option key={category.id} value={category.id}>
                        {category.name}
                      </Option>
                    ))}
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
              </Col>{" "}
            </Row>{" "}
            <Card className="upload-card mt-3 mb-3">
              <Form.Item
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
            {/* Dynamic Category Fields */}
            {selectedCategoryId && (
              <Card className="dynamic-fields-card mt-3 mb-3">
                {renderDynamicFields()}
              </Card>
            )}
            <Divider className="mt-4 mb-4" />
            <Form.Item className="form-actions text-right">
              <Space size="middle">
                <Button
                  type="default"
                  onClick={() => navigate("/causes")}
                  size="large"
                >
                  Cancel
                </Button>{" "}
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={causesLoading || categoriesLoading}
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
