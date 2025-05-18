const { pool } = require("../config/db");

class Category {
  // Create a new category
  static async create(categoryData) {
    const { name, description, icon } = categoryData;

    try {
      const [result] = await pool.query(
        `INSERT INTO categories (name, description, icon) 
         VALUES (?, ?, ?)`,
        [name, description, icon]
      );

      return { id: result.insertId, ...categoryData };
    } catch (error) {
      throw new Error(`Error creating category: ${error.message}`);
    }
  }

  // Get all categories
  static async getAll() {
    try {
      const [rows] = await pool.query(
        `SELECT c.*, COUNT(f.id) as field_count
         FROM categories c
         LEFT JOIN category_fields f ON c.id = f.category_id
         GROUP BY c.id
         ORDER BY c.name ASC`
      );

      return rows;
    } catch (error) {
      throw new Error(`Error getting categories: ${error.message}`);
    }
  }

  // Get category by ID with fields
  static async findById(id) {
    try {
      // Get category details
      const [categoryRows] = await pool.query(
        `SELECT * FROM categories WHERE id = ?`,
        [id]
      );

      if (categoryRows.length === 0) {
        return null;
      }

      const category = categoryRows[0];

      // Get fields for this category
      const [fieldRows] = await pool.query(
        `SELECT * FROM category_fields 
         WHERE category_id = ?
         ORDER BY display_order ASC`,
        [id]
      );

      category.fields = fieldRows;

      return category;
    } catch (error) {
      throw new Error(`Error finding category by ID: ${error.message}`);
    }
  }

  // Update category
  static async update(id, categoryData) {
    const { name, description, icon } = categoryData;

    try {
      await pool.query(
        `UPDATE categories SET 
         name = ?, description = ?, icon = ?
         WHERE id = ?`,
        [name, description, icon, id]
      );

      return { id, ...categoryData };
    } catch (error) {
      throw new Error(`Error updating category: ${error.message}`);
    }
  }

  // Delete category
  static async delete(id) {
    try {
      // Start a transaction
      const connection = await pool.getConnection();
      await connection.beginTransaction();

      try {
        // Delete all fields for this category first
        await connection.query(
          `DELETE FROM category_fields WHERE category_id = ?`,
          [id]
        );

        // Delete category
        await connection.query(`DELETE FROM categories WHERE id = ?`, [id]);

        // Commit the transaction
        await connection.commit();
        connection.release();

        return true;
      } catch (error) {
        // Rollback in case of error
        await connection.rollback();
        connection.release();
        throw error;
      }
    } catch (error) {
      throw new Error(`Error deleting category: ${error.message}`);
    }
  }

  // Add field to category
  static async addField(fieldData) {
    const {
      category_id,
      name,
      type,
      required,
      options,
      placeholder,
      display_order,
    } = fieldData;

    try {
      const [result] = await pool.query(
        `INSERT INTO category_fields 
         (category_id, name, type, required, options, placeholder, display_order) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          category_id,
          name,
          type,
          required ? 1 : 0,
          JSON.stringify(options || []),
          placeholder || "",
          display_order || 0,
        ]
      );

      return { id: result.insertId, ...fieldData };
    } catch (error) {
      throw new Error(`Error adding field to category: ${error.message}`);
    }
  }

  // Update field
  static async updateField(id, fieldData) {
    const { name, type, required, options, placeholder, display_order } =
      fieldData;

    try {
      await pool.query(
        `UPDATE category_fields SET 
         name = ?, type = ?, required = ?, options = ?, placeholder = ?, display_order = ?
         WHERE id = ?`,
        [
          name,
          type,
          required ? 1 : 0,
          JSON.stringify(options || []),
          placeholder || "",
          display_order || 0,
          id,
        ]
      );

      return { id, ...fieldData };
    } catch (error) {
      throw new Error(`Error updating field: ${error.message}`);
    }
  }

  // Delete field
  static async deleteField(id) {
    try {
      await pool.query(`DELETE FROM category_fields WHERE id = ?`, [id]);
      return true;
    } catch (error) {
      throw new Error(`Error deleting field: ${error.message}`);
    }
  }

  // Update field order
  static async updateFieldOrder(fields) {
    try {
      // Start a transaction
      const connection = await pool.getConnection();
      await connection.beginTransaction();

      try {
        for (let i = 0; i < fields.length; i++) {
          await connection.query(
            `UPDATE category_fields SET display_order = ? WHERE id = ?`,
            [i, fields[i].id]
          );
        }

        // Commit the transaction
        await connection.commit();
        connection.release();

        return true;
      } catch (error) {
        // Rollback in case of error
        await connection.rollback();
        connection.release();
        throw error;
      }
    } catch (error) {
      throw new Error(`Error updating field order: ${error.message}`);
    }
  }
  // Get category data values for a cause
  static async getCauseFieldValues(causeId) {
    try {
      const [rows] = await pool.query(
        `SELECT cv.*, cf.name, cf.type, cf.required, cf.options, cf.placeholder
         FROM cause_category_values cv
         JOIN category_fields cf ON cv.field_id = cf.id
         WHERE cv.cause_id = ?
         ORDER BY cf.display_order ASC`,
        [causeId]
      );

      return rows;
    } catch (error) {
      throw new Error(`Error getting cause field values: ${error.message}`);
    }
  }

  // Save cause field values
  static async saveCauseFieldValues(causeId, fieldValues) {
    try {
      // Start a transaction
      const connection = await pool.getConnection();
      await connection.beginTransaction();

      try {
        // Delete existing values
        await connection.query(
          `DELETE FROM cause_category_values WHERE cause_id = ?`,
          [causeId]
        );

        // Validate cause_id and field_id before inserting
        const [causeExists] = await connection.query(
          `SELECT id FROM causes WHERE id = ?`,
          [causeId]
        );
        if (causeExists.length === 0) {
          throw new Error(`Cause with id ${causeId} does not exist`);
        }

        // Log input data for debugging
        console.log("Debug: causeId", causeId);
        console.log("Debug: fieldValues", fieldValues);

        for (const field of fieldValues) {
          // Validate category_id exists
          const [categoryExists] = await connection.query(
            `SELECT id FROM categories WHERE id = ?`,
            [field.category_id]
          );
          if (categoryExists.length === 0) {
            throw new Error(
              `Category with id ${field.category_id} does not exist`
            );
          }

          // Validate field_id exists
          const [fieldExists] = await connection.query(
            `SELECT id FROM category_fields WHERE id = ?`,
            [field.field_id]
          );
          if (fieldExists.length === 0) {
            throw new Error(`Field with id ${field.field_id} does not exist`);
          }

          await connection.query(
            `INSERT INTO cause_category_values (cause_id, category_id, field_id, value) VALUES (?, ?, ?, ?)`,
            [causeId, field.category_id, field.field_id, field.value]
          );
        }

        // Commit the transaction
        await connection.commit();
        connection.release();

        return true;
      } catch (error) {
        // Rollback in case of error
        await connection.rollback();
        connection.release();
        throw error;
      }
    } catch (error) {
      throw new Error(`Error saving cause field values: ${error.message}`);
    }
  }
}

module.exports = Category;
