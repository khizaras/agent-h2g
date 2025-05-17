import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
  Checkbox,
  Radio,
  Divider,
  Empty,
  Row,
  Col,
} from "antd";
import {
  UploadOutlined,
  EnvironmentOutlined,
  BulbOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  ShoppingOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import moment from "moment";

import { getCauseById, updateCause } from "../../redux/slices/causesSlice";
import {
  getCategories,
  getCategoryById,
  getCauseFieldValues,
  saveCauseFieldValues,
} from "../../redux/slices/categoriesSlice";
import "./CauseForms.css";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const EditCausePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cause, isLoading: causeLoading } = useSelector(
    (state) => state.causes
  );
  const {
    categories = [],
    currentCategory = null,
    causeFieldValues = [],
    isLoading: categoryLoading,
  } = useSelector((state) => state.categories);
  const { user } = useSelector((state) => state.auth);

  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [dynamicFieldValues, setDynamicFieldValues] = useState({});

  // Fetch categories when component mounts
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  // Fetch category details when selected category changes
  useEffect(() => {
    if (selectedCategoryId) {
      dispatch(getCategoryById(selectedCategoryId));

      // If we have a cause ID, also fetch field values
      if (id) {
        dispatch(getCauseFieldValues(id));
      }
    }
  }, [selectedCategoryId, id, dispatch]);

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

        // Set selected category
        if (causeData.category_id) {
          setSelectedCategoryId(causeData.category_id);
        }

        // Set form values
        form.setFieldsValue({
          ...causeData,
          category_id: causeData.category_id,
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
      // Skip dynamic fields, they'll be handled separately
      if (key.startsWith("dynamic_")) {
        return;
      }

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
            fieldValue = fieldValue.join(",");
          }

          categoryFieldValues.push({
            field_id: field.id,
            value: fieldValue !== null ? String(fieldValue) : "",
          });
        }
      });
    }

    dispatch(updateCause({ id, causeData: formData }))
      .unwrap()
      .then(() => {
        // If we have category field values, save them
        if (categoryFieldValues.length > 0) {
          return dispatch(
            saveCauseFieldValues({
              causeId: id,
              values: categoryFieldValues,
            })
          ).unwrap();
        }
      })
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

  // Prepare existing field values
  useEffect(() => {
    if (causeFieldValues.length > 0 && currentCategory?.fields) {
      const fieldValueObj = {};

      causeFieldValues.forEach((fieldValue) => {
        const field = currentCategory.fields.find(
          (f) => f.id === fieldValue.field_id
        );
        if (field) {
          const fieldKey = `dynamic_${field.id}`;

          // For checkbox fields, split comma-separated values into array
          if (field.type === "checkbox" && fieldValue.value) {
            fieldValueObj[fieldKey] = fieldValue.value.split(",");
          } else {
            fieldValueObj[fieldKey] = fieldValue.value;
          }
        }
      });

      // Set form values for dynamic fields
      form.setFieldsValue(fieldValueObj);
      setDynamicFieldValues(fieldValueObj);
    }
  }, [causeFieldValues, currentCategory, form]);

  // Render dynamic fields based on selected category
  const renderDynamicFields = () => {
    if (!currentCategory || !currentCategory.fields || categoryLoading) {
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
                    <DatePicker style={{ width: "100%" }} />
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

  if (causeLoading || initialLoad) {
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
          <Link to="/">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/causes">Causes</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to={`/causes/${id}`}>{cause?.title}</Link>
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
                  prefix={<BulbOutlined />}
                  placeholder="Give your cause a clear, descriptive title"
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
                  loading={categoryLoading}
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
          </Row>{" "}
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
                  prefix={<EnvironmentOutlined />}
                  placeholder="City, State or Region"
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
                  prefix={<ClockCircleOutlined />}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col xs={24} md={8}>
              <Form.Item name="funding_goal" label="Funding Goal ($)">
                <InputNumber
                  min={0}
                  prefix={<DollarOutlined />}
                  placeholder="Amount needed"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item name="food_goal" label="Food Items Goal">
                <InputNumber
                  min={0}
                  prefix={<ShoppingOutlined />}
                  placeholder="Quantity needed"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
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
            </Col>
          </Row>
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
          {/* Dynamic Category Fields */}
          {selectedCategoryId && (
            <Card className="dynamic-fields-card mt-3 mb-3">
              {renderDynamicFields()}
            </Card>
          )}
          <Divider />
          <Form.Item className="form-actions">
            <Button
              type="default"
              onClick={() => navigate(`/causes/${id}`)}
              style={{ marginRight: 16 }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={causeLoading || categoryLoading}
            >
              Update Cause
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default EditCausePage;
