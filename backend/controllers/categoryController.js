const Category = require("../models/Category");

// @desc    Create a new category
// @route   POST /api/admin/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
  try {
    const { name, description, icon } = req.body;

    // Basic validation
    if (!name) {
      return res.status(400).json({
        success: false,
        error: "Please provide a category name",
      });
    }

    // Create category
    const category = await Category.create({
      name,
      description,
      icon: icon || "TagsOutlined",
    });

    res.status(201).json({
      success: true,
      category,
    });
  } catch (error) {
    console.error("Error in createCategory:", error.message);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @desc    Get all categories
// @route   GET /api/admin/categories
// @access  Private/Admin
const getCategories = async (req, res) => {
  try {
    const categories = await Category.getAll();

    res.json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error("Error in getCategories:", error.message);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @desc    Get category by ID
// @route   GET /api/admin/categories/:id
// @access  Private/Admin
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        error: "Category not found",
      });
    }

    res.json({
      success: true,
      category,
    });
  } catch (error) {
    console.error("Error in getCategoryById:", error.message);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @desc    Update category
// @route   PUT /api/admin/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res) => {
  try {
    const { name, description, icon } = req.body;

    // Check if category exists
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        error: "Category not found",
      });
    }

    // Update category
    const updatedCategory = await Category.update(req.params.id, {
      name: name || category.name,
      description:
        description !== undefined ? description : category.description,
      icon: icon || category.icon,
    });

    res.json({
      success: true,
      category: updatedCategory,
    });
  } catch (error) {
    console.error("Error in updateCategory:", error.message);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @desc    Delete category
// @route   DELETE /api/admin/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
  try {
    // Check if category exists
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        error: "Category not found",
      });
    }

    // Delete category
    await Category.delete(req.params.id);

    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteCategory:", error.message);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @desc    Add field to category
// @route   POST /api/admin/categories/:id/fields
// @access  Private/Admin
const addField = async (req, res) => {
  try {
    const { name, type, required, options, placeholder, display_order } =
      req.body;
    const category_id = req.params.id;

    // Check if category exists
    const category = await Category.findById(category_id);

    if (!category) {
      return res.status(404).json({
        success: false,
        error: "Category not found",
      });
    }

    // Basic validation
    if (!name || !type) {
      return res.status(400).json({
        success: false,
        error: "Please provide field name and type",
      });
    }

    // Add field to category
    const field = await Category.addField({
      category_id,
      name,
      type,
      required: required || false,
      options,
      placeholder,
      display_order,
    });

    res.status(201).json({
      success: true,
      field,
    });
  } catch (error) {
    console.error("Error in addField:", error.message);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @desc    Update field
// @route   PUT /api/admin/categories/:categoryId/fields/:id
// @access  Private/Admin
const updateField = async (req, res) => {
  try {
    const fieldId = req.params.id;
    const { name, type, required, options, placeholder, display_order } =
      req.body;

    // Update field
    const field = await Category.updateField(fieldId, {
      name,
      type,
      required,
      options,
      placeholder,
      display_order,
    });

    res.json({
      success: true,
      field,
    });
  } catch (error) {
    console.error("Error in updateField:", error.message);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @desc    Delete field
// @route   DELETE /api/admin/categories/:categoryId/fields/:id
// @access  Private/Admin
const deleteField = async (req, res) => {
  try {
    const fieldId = req.params.id;

    // Delete field
    await Category.deleteField(fieldId);

    res.json({
      success: true,
      message: "Field deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteField:", error.message);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @desc    Update field order
// @route   PUT /api/admin/categories/:id/field-order
// @access  Private/Admin
const updateFieldOrder = async (req, res) => {
  try {
    const { fields } = req.body;

    // Update field order
    await Category.updateFieldOrder(fields);

    res.json({
      success: true,
      message: "Field order updated successfully",
    });
  } catch (error) {
    console.error("Error in updateFieldOrder:", error.message);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @desc    Get public categories
// @route   GET /api/categories
// @access  Public
const getPublicCategories = async (req, res) => {
  try {
    const categories = await Category.getAll();

    res.json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error("Error in getPublicCategories:", error.message);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @desc    Get public category by ID
// @route   GET /api/categories/:id
// @access  Public
const getPublicCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        error: "Category not found",
      });
    }

    res.json({
      success: true,
      category,
    });
  } catch (error) {
    console.error("Error in getPublicCategoryById:", error.message);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @desc    Get category field values for a cause
// @route   GET /api/causes/:id/category-values
// @access  Public
const getCauseFieldValues = async (req, res) => {
  try {
    const causeId = req.params.id || req.params.causeId;
    const values = await Category.getCauseFieldValues(causeId);

    res.json({
      success: true,
      values,
    });
  } catch (error) {
    console.error("Error in getCauseFieldValues:", error.message);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @desc    Save category field values for a cause
// @route   POST /api/causes/:id/category-values
// @access  Private
const saveCauseFieldValues = async (req, res) => {
  try {
    const causeId = req.params.id || req.params.causeId;
    const { values } = req.body;

    // Save field values
    await Category.saveCauseFieldValues(causeId, values);

    res.json({
      success: true,
      message: "Field values saved successfully",
    });
  } catch (error) {
    console.error("Error in saveCauseFieldValues:", error.message);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  addField,
  updateField,
  deleteField,
  updateFieldOrder,
  getPublicCategories,
  getPublicCategoryById,
  getCauseFieldValues,
  saveCauseFieldValues,
};
