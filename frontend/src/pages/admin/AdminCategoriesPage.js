import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  Space,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Typography,
  Card,
  Breadcrumb,
  Tag,
  Tooltip,
  Row,
  Col,
  Divider,
  Popconfirm,
  Badge,
  Drawer,
  Empty,
  InputNumber,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FormOutlined,
  AppstoreOutlined,
  MenuUnfoldOutlined,
  EyeOutlined,
  SearchOutlined,
  DragOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./AdminCategories.css";

// Import the reducer actions (we'll create these next)
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
  addField,
  updateField,
  deleteField,
  updateFieldOrder,
} from "../../redux/slices/categoriesSlice";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const AdminCategoriesPage = () => {
  const dispatch = useDispatch();
  // Access the categories state with default value to prevent errors
  const {
    categories = [],
    currentCategory = null,
    isLoading = false,
  } = useSelector((state) => state.categories || {});

  // UI state
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [fieldModalVisible, setFieldModalVisible] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [categoryDrawerVisible, setCategoryDrawerVisible] = useState(false);
  const [searchText, setSearchText] = useState("");

  // Forms
  const [categoryForm] = Form.useForm();
  const [fieldForm] = Form.useForm();

  // Selected item state
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [fieldToDelete, setFieldToDelete] = useState(null);

  // Field options state (for select, radio, checkbox fields)
  const [fieldOptions, setFieldOptions] = useState([{ value: "", label: "" }]);

  // Load categories when component mounts
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  // Filter categories based on search text
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Show category modal (for create or edit)
  const showCategoryModal = (category = null) => {
    setSelectedCategory(category);
    if (category) {
      categoryForm.setFieldsValue({
        name: category.name,
        description: category.description,
        icon: category.icon || "",
      });
    } else {
      categoryForm.resetFields();
    }
    setCategoryModalVisible(true);
  };

  // Handle category form submission
  const handleCategorySubmit = (values) => {
    if (selectedCategory) {
      // Update existing category
      dispatch(
        updateCategory({
          id: selectedCategory.id,
          categoryData: values,
        })
      ).then(() => {
        message.success("Category updated successfully");
        setCategoryModalVisible(false);
      });
    } else {
      // Create new category
      dispatch(createCategory(values)).then(() => {
        message.success("Category created successfully");
        setCategoryModalVisible(false);
      });
    }
  };

  // Delete category
  const handleDeleteCategory = () => {
    if (categoryToDelete) {
      dispatch(deleteCategory(categoryToDelete.id)).then(() => {
        message.success("Category deleted successfully");
        setConfirmDeleteVisible(false);
        setCategoryDrawerVisible(false);
      });
    }
  };

  // Show field modal (for create or edit)
  const showFieldModal = (field = null, categoryId = null) => {
    setSelectedField(field);

    if (field) {
      // Edit existing field
      let options = [];
      if (
        field.options &&
        ["select", "radio", "checkbox"].includes(field.type)
      ) {
        try {
          const parsedOptions =
            typeof field.options === "string"
              ? JSON.parse(field.options)
              : field.options;

          options = parsedOptions.map((opt) => ({
            value: typeof opt === "string" ? opt : opt.value,
            label: typeof opt === "string" ? opt : opt.label,
          }));
        } catch (e) {
          console.error("Error parsing field options:", e);
          options = [{ value: "", label: "" }];
        }
      }

      setFieldOptions(
        options.length > 0 ? options : [{ value: "", label: "" }]
      );

      fieldForm.setFieldsValue({
        name: field.name,
        type: field.type,
        required: field.required,
        placeholder: field.placeholder || "",
      });
    } else {
      // Create new field
      fieldForm.resetFields();
      setFieldOptions([{ value: "", label: "" }]);
    }

    setFieldModalVisible(true);
  };

  // Handle field form submission
  const handleFieldSubmit = (values) => {
    const categoryId = selectedCategory?.id;

    if (!categoryId) {
      message.error("Category ID is required");
      return;
    }

    let processedOptions = null;
    if (["select", "radio", "checkbox"].includes(values.type)) {
      // Filter out empty options
      processedOptions = fieldOptions
        .filter((opt) => opt.value.trim() !== "")
        .map((opt) => ({ value: opt.value, label: opt.label || opt.value }));
    }

    const fieldData = {
      ...values,
      options: processedOptions,
    };

    if (selectedField) {
      // Update existing field
      dispatch(
        updateField({
          categoryId,
          fieldId: selectedField.id,
          fieldData,
        })
      ).then(() => {
        message.success("Field updated successfully");
        setFieldModalVisible(false);

        // Refresh category details
        dispatch(getCategoryById(categoryId));
      });
    } else {
      // Create new field
      dispatch(
        addField({
          categoryId,
          fieldData: {
            ...fieldData,
            display_order: currentCategory?.fields?.length || 0,
          },
        })
      ).then(() => {
        message.success("Field added successfully");
        setFieldModalVisible(false);

        // Refresh category details
        dispatch(getCategoryById(categoryId));
      });
    }
  };

  // Delete field
  const handleDeleteField = () => {
    if (fieldToDelete && selectedCategory) {
      dispatch(
        deleteField({
          categoryId: selectedCategory.id,
          fieldId: fieldToDelete.id,
        })
      ).then(() => {
        message.success("Field deleted successfully");

        // Refresh category details
        dispatch(getCategoryById(selectedCategory.id));
      });
    }
  };

  // View category details
  const viewCategoryDetails = (category) => {
    setSelectedCategory(category);
    dispatch(getCategoryById(category.id));
    setCategoryDrawerVisible(true);
  };

  // Add field option (for select, radio, checkbox)
  const addFieldOption = () => {
    setFieldOptions([...fieldOptions, { value: "", label: "" }]);
  };

  // Remove field option
  const removeFieldOption = (index) => {
    const newOptions = [...fieldOptions];
    newOptions.splice(index, 1);
    setFieldOptions(newOptions);
  };

  // Update field option
  const updateFieldOption = (index, key, value) => {
    const newOptions = [...fieldOptions];
    newOptions[index][key] = value;
    setFieldOptions(newOptions);
  };

  // Handle drag and drop to reorder fields
  const handleDragEnd = (result) => {
    if (!result.destination || !currentCategory) {
      return;
    }

    const items = Array.from(currentCategory.fields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update the display_order property for each item
    const updatedItems = items.map((item, index) => ({
      ...item,
      display_order: index,
    }));

    // Dispatch action to update field order
    dispatch(
      updateFieldOrder({
        categoryId: currentCategory.id,
        fields: updatedItems,
      })
    ).then(() => {
      message.success("Field order updated");
      // Update the local state
      dispatch(getCategoryById(currentCategory.id));
    });
  };

  // Table columns configuration
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Fields",
      dataIndex: "field_count",
      key: "field_count",
      render: (count) =>
        count ? (
          <Badge count={count} style={{ backgroundColor: "#52c41a" }} />
        ) : (
          <Badge count="0" style={{ backgroundColor: "#d9d9d9" }} />
        ),
      sorter: (a, b) => a.field_count - b.field_count,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              icon={<EyeOutlined />}
              onClick={() => viewCategoryDetails(record)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              onClick={() => showCategoryModal(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                setCategoryToDelete(record);
                setConfirmDeleteVisible(true);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Field type options
  const fieldTypeOptions = [
    { label: "Text", value: "text" },
    { label: "Textarea", value: "textarea" },
    { label: "Number", value: "number" },
    { label: "Date", value: "date" },
    { label: "Select", value: "select" },
    { label: "Checkbox", value: "checkbox" },
    { label: "Radio", value: "radio" },
    { label: "File", value: "file" },
  ];

  // Render options form items for select, radio, and checkbox field types
  const renderOptionsFormItems = () => {
    const fieldType = fieldForm.getFieldValue("type");

    if (["select", "radio", "checkbox"].includes(fieldType)) {
      return (
        <div className="field-options-container">
          <Divider orientation="left">Options</Divider>

          {fieldOptions.map((option, index) => (
            <Row key={index} gutter={[16, 16]} className="option-row">
              <Col flex="auto">
                <Input
                  placeholder="Option Value"
                  value={option.value}
                  onChange={(e) =>
                    updateFieldOption(index, "value", e.target.value)
                  }
                />
              </Col>
              <Col flex="auto">
                <Input
                  placeholder="Display Label (optional)"
                  value={option.label}
                  onChange={(e) =>
                    updateFieldOption(index, "label", e.target.value)
                  }
                />
              </Col>
              <Col flex="none">
                <Button
                  type="text"
                  danger
                  icon={<MinusCircleOutlined />}
                  onClick={() => removeFieldOption(index)}
                  disabled={fieldOptions.length <= 1}
                />
              </Col>
            </Row>
          ))}

          <Button
            type="dashed"
            onClick={addFieldOption}
            icon={<PlusOutlined />}
            style={{ marginTop: "10px", width: "100%" }}
          >
            Add Option
          </Button>
        </div>
      );
    }

    return null;
  };

  // Render field list in category drawer
  const renderFieldList = () => {
    if (
      !currentCategory ||
      !currentCategory.fields ||
      currentCategory.fields.length === 0
    ) {
      return (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No fields added yet"
        />
      );
    }

    return (
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="fields-list">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="fields-list"
            >
              {currentCategory.fields.map((field, index) => (
                <Draggable
                  key={field.id.toString()}
                  draggableId={field.id.toString()}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="field-item"
                    >
                      <div className="field-content">
                        <div className="field-details">
                          <div className="field-header">
                            <Text strong>{field.name}</Text>
                            {field.required && (
                              <Tag color="red" className="required-tag">
                                Required
                              </Tag>
                            )}
                          </div>
                          <div className="field-type">
                            <Text type="secondary">
                              Type:{" "}
                              {field.type.charAt(0).toUpperCase() +
                                field.type.slice(1)}
                            </Text>
                          </div>
                          {field.placeholder && (
                            <div className="field-placeholder">
                              <Text type="secondary">
                                Placeholder: {field.placeholder}
                              </Text>
                            </div>
                          )}
                          {field.options &&
                            ["select", "radio", "checkbox"].includes(
                              field.type
                            ) && (
                              <div className="field-options">
                                <Text type="secondary">
                                  Options:{" "}
                                  {JSON.parse(field.options)
                                    .map((o) =>
                                      typeof o === "string"
                                        ? o
                                        : o.label || o.value
                                    )
                                    .join(", ")}
                                </Text>
                              </div>
                            )}
                        </div>
                        <div className="field-actions">
                          <span
                            {...provided.dragHandleProps}
                            className="drag-handle"
                          >
                            <DragOutlined />
                          </span>
                          <Tooltip title="Edit Field">
                            <Button
                              type="text"
                              icon={<EditOutlined />}
                              onClick={() => showFieldModal(field)}
                            />
                          </Tooltip>
                          <Tooltip title="Delete Field">
                            <Button
                              type="text"
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => {
                                setFieldToDelete(field);
                                handleDeleteField();
                              }}
                            />
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  };

  return (
    <div className="admin-categories-container">
      <div className="container">
        <Breadcrumb className="breadcrumb-navigation mt-3 mb-2">
          <Breadcrumb.Item>
            <Link to="/">Home</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/admin">Admin</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Manage Categories</Breadcrumb.Item>
        </Breadcrumb>

        <Card className="categories-card shadow-sm">
          <div className="page-header mb-4">
            <div className="title-section">
              <Space align="center" className="header-icon-wrapper">
                <FormOutlined className="header-icon" />
                <Title level={2} className="mb-1">
                  Manage Categories
                </Title>
              </Space>
              <Paragraph type="secondary" className="header-description">
                Create and manage categories for causes. Each category can have
                custom fields that users will fill out when creating a cause.
              </Paragraph>
            </div>
          </div>

          <div className="table-actions mb-4">
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} md={12}>
                <Input
                  prefix={<SearchOutlined />}
                  placeholder="Search categories by name"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  allowClear
                />
              </Col>
              <Col xs={24} md={12} className="text-right">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => showCategoryModal()}
                >
                  Add Category
                </Button>
              </Col>
            </Row>
          </div>

          <Table
            columns={columns}
            dataSource={filteredCategories}
            rowKey="id"
            loading={isLoading}
            pagination={{ pageSize: 10 }}
          />
        </Card>

        {/* Category Form Modal */}
        <Modal
          title={
            <div className="modal-header">
              {selectedCategory ? (
                <>
                  <EditOutlined className="modal-icon" /> Edit Category
                </>
              ) : (
                <>
                  <PlusOutlined className="modal-icon" /> Add Category
                </>
              )}
            </div>
          }
          open={categoryModalVisible}
          onCancel={() => setCategoryModalVisible(false)}
          footer={null}
          destroyOnClose
        >
          <Form
            form={categoryForm}
            layout="vertical"
            onFinish={handleCategorySubmit}
          >
            <Form.Item
              name="name"
              label="Category Name"
              rules={[
                { required: true, message: "Please enter a category name" },
              ]}
            >
              <Input placeholder="E.g., Food Drive, Emergency Relief" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[
                { required: true, message: "Please enter a description" },
              ]}
            >
              <TextArea
                rows={4}
                placeholder="Describe what this category is used for"
              />
            </Form.Item>

            <Form.Item
              name="icon"
              label="Icon (optional)"
              tooltip="Enter an icon name from Ant Design Icons"
            >
              <Input placeholder="E.g., heart, food, medical" />
            </Form.Item>

            <Form.Item className="form-actions">
              <Space>
                <Button
                  type="default"
                  onClick={() => setCategoryModalVisible(false)}
                >
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  {selectedCategory ? "Update Category" : "Create Category"}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* Field Form Modal */}
        <Modal
          title={
            <div className="modal-header">
              {selectedField ? (
                <>
                  <EditOutlined className="modal-icon" /> Edit Field
                </>
              ) : (
                <>
                  <PlusOutlined className="modal-icon" /> Add Field
                </>
              )}
            </div>
          }
          open={fieldModalVisible}
          onCancel={() => setFieldModalVisible(false)}
          footer={null}
          destroyOnClose
          width={600}
        >
          <Form form={fieldForm} layout="vertical" onFinish={handleFieldSubmit}>
            <Form.Item
              name="name"
              label="Field Name"
              rules={[{ required: true, message: "Please enter a field name" }]}
            >
              <Input placeholder="E.g., Location, Amount Needed, Contact Person" />
            </Form.Item>

            <Form.Item
              name="type"
              label="Field Type"
              rules={[
                { required: true, message: "Please select a field type" },
              ]}
            >
              <Select placeholder="Select a field type">
                {fieldTypeOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="required"
              label="Required"
              valuePropName="checked"
              initialValue={false}
            >
              <Select>
                <Option value={true}>Yes</Option>
                <Option value={false}>No</Option>
              </Select>
            </Form.Item>

            <Form.Item name="placeholder" label="Placeholder Text">
              <Input placeholder="E.g., Enter the location of your cause" />
            </Form.Item>

            {renderOptionsFormItems()}

            <Form.Item className="form-actions">
              <Space>
                <Button
                  type="default"
                  onClick={() => setFieldModalVisible(false)}
                >
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  {selectedField ? "Update Field" : "Add Field"}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* Delete Category Confirmation */}
        <Modal
          title="Confirm Delete"
          open={confirmDeleteVisible}
          onCancel={() => setConfirmDeleteVisible(false)}
          onOk={handleDeleteCategory}
          okText="Delete"
          okButtonProps={{ danger: true }}
        >
          <p>
            Are you sure you want to delete the category "
            {categoryToDelete?.name}"? This will also delete all associated
            fields and values.
          </p>
          <p>
            <strong>This action cannot be undone.</strong>
          </p>
        </Modal>

        {/* Category Details Drawer */}
        <Drawer
          title={
            <div className="drawer-header">
              <Space>
                <FormOutlined className="drawer-icon" />
                <span>{selectedCategory?.name}</span>
              </Space>
            </div>
          }
          placement="right"
          width={600}
          onClose={() => setCategoryDrawerVisible(false)}
          open={categoryDrawerVisible}
          extra={
            <Space>
              <Button onClick={() => setCategoryDrawerVisible(false)}>
                Close
              </Button>
            </Space>
          }
        >
          {currentCategory && (
            <div className="category-details">
              <div className="category-header">
                <div className="category-meta">
                  <Paragraph>{currentCategory.description}</Paragraph>
                </div>
              </div>

              <Divider />

              <div className="fields-section">
                <div className="section-header">
                  <Title level={4}>Fields</Title>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => showFieldModal(null, currentCategory.id)}
                  >
                    Add Field
                  </Button>
                </div>

                <Paragraph type="secondary" className="section-description">
                  Drag and drop to reorder fields. These fields will be shown to
                  users when they select this category.
                </Paragraph>

                {renderFieldList()}
              </div>

              <Divider />

              <div className="drawer-actions">
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    block
                    onClick={() => {
                      showCategoryModal(currentCategory);
                      setCategoryDrawerVisible(false);
                    }}
                  >
                    Edit Category
                  </Button>

                  <Popconfirm
                    title="Are you sure you want to delete this category?"
                    description="This will also delete all associated fields and values. This action cannot be undone."
                    onConfirm={() => {
                      dispatch(deleteCategory(currentCategory.id));
                      setCategoryDrawerVisible(false);
                      message.success("Category deleted successfully");
                    }}
                    okText="Delete"
                    cancelText="Cancel"
                    okButtonProps={{ danger: true }}
                  >
                    <Button danger icon={<DeleteOutlined />} block>
                      Delete Category
                    </Button>
                  </Popconfirm>
                </Space>
              </div>
            </div>
          )}
        </Drawer>
      </div>
    </div>
  );
};

export default AdminCategoriesPage;
