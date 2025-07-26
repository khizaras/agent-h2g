import { Sequelize, DataTypes, Model } from 'sequelize';
import mysql2 from 'mysql2';

// Database configuration
const sequelize = new Sequelize({
  dialect: 'mysql',
  dialectModule: mysql2,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hands2gether',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 20,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
  },
});

// User Model
export class User extends Model {
  declare id: number;
  declare name: string;
  declare email: string;
  declare password?: string;
  declare avatar?: string;
  declare bio?: string;
  declare phone?: string;
  declare address?: string;
  declare isAdmin: boolean;
  declare isVerified: boolean;
  declare emailNotifications: boolean;
  declare pushNotifications: boolean;
  declare lastLogin?: Date;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true, // Nullable for OAuth users
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    emailNotifications: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    pushNotifications: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    indexes: [
      {
        fields: ['email'],
      },
      {
        fields: ['created_at'],
      },
    ],
  }
);

// Category Model
export class Category extends Model {
  declare id: number;
  declare name: 'food' | 'clothes' | 'education';
  declare displayName: string;
  declare description?: string;
  declare icon?: string;
  declare color?: string;
  declare isActive: boolean;
  declare sortOrder: number;
  declare readonly createdAt: Date;
}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.ENUM('food', 'clothes', 'education'),
      allowNull: false,
      unique: true,
    },
    displayName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    icon: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    color: {
      type: DataTypes.STRING(7),
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'Category',
    tableName: 'categories',
  }
);

// Cause Model
export class Cause extends Model {
  declare id: number;
  declare title: string;
  declare description: string;
  declare shortDescription?: string;
  declare categoryId: number;
  declare userId: number;
  declare location: string;
  declare latitude?: number;
  declare longitude?: number;
  declare image?: string;
  declare gallery?: string[];
  declare status: 'active' | 'pending' | 'completed' | 'suspended' | 'archived';
  declare priority: 'low' | 'medium' | 'high' | 'urgent';
  declare isFeatured: boolean;
  declare viewCount: number;
  declare likeCount: number;
  declare shareCount: number;
  declare tags?: string[];
  declare contactPhone?: string;
  declare contactEmail?: string;
  declare contactPerson?: string;
  declare availabilityHours?: string;
  declare specialInstructions?: string;
  declare expiresAt?: Date;
  declare completedAt?: Date;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Cause.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    shortDescription: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    gallery: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'pending', 'completed', 'suspended', 'archived'),
      defaultValue: 'pending',
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
      defaultValue: 'medium',
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    viewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    likeCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    shareCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    contactPhone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    contactEmail: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    contactPerson: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    availabilityHours: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    specialInstructions: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Cause',
    tableName: 'causes',
    indexes: [
      {
        fields: ['category_id'],
      },
      {
        fields: ['user_id'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['latitude', 'longitude'],
      },
      {
        fields: ['created_at'],
      },
      {
        type: 'FULLTEXT',
        fields: ['title', 'description'],
      },
    ],
  }
);

// Food Details Model
export class FoodDetails extends Model {
  declare id: number;
  declare causeId: number;
  declare foodType: 'perishable' | 'non-perishable' | 'prepared' | 'raw' | 'beverages' | 'snacks';
  declare cuisineType?: string;
  declare quantity: number;
  declare unit: 'kg' | 'lbs' | 'servings' | 'portions' | 'items' | 'packages';
  declare servingSize?: number;
  declare dietaryRestrictions?: string[];
  declare allergens?: string[];
  declare expirationDate?: Date;
  declare preparationDate?: Date;
  declare storageRequirements?: string;
  declare temperatureRequirements: 'frozen' | 'refrigerated' | 'room-temp' | 'hot';
  declare pickupInstructions?: string;
  declare deliveryAvailable: boolean;
  declare deliveryRadius?: number;
  declare isUrgent: boolean;
  declare nutritionalInfo?: Record<string, any>;
  declare ingredients?: string;
  declare packagingDetails?: string;
  declare halal: boolean;
  declare kosher: boolean;
  declare organic: boolean;
  declare readonly createdAt: Date;
}

FoodDetails.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    causeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'causes',
        key: 'id',
      },
    },
    foodType: {
      type: DataTypes.ENUM('perishable', 'non-perishable', 'prepared', 'raw', 'beverages', 'snacks'),
      allowNull: false,
    },
    cuisineType: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    unit: {
      type: DataTypes.ENUM('kg', 'lbs', 'servings', 'portions', 'items', 'packages'),
      defaultValue: 'servings',
    },
    servingSize: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    dietaryRestrictions: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    allergens: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    expirationDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    preparationDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    storageRequirements: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    temperatureRequirements: {
      type: DataTypes.ENUM('frozen', 'refrigerated', 'room-temp', 'hot'),
      defaultValue: 'room-temp',
    },
    pickupInstructions: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    deliveryAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    deliveryRadius: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    isUrgent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    nutritionalInfo: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    ingredients: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    packagingDetails: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    halal: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    kosher: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    organic: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'FoodDetails',
    tableName: 'food_details',
    indexes: [
      {
        fields: ['food_type'],
      },
      {
        fields: ['expiration_date'],
      },
      {
        fields: ['is_urgent'],
      },
    ],
  }
);

// Define associations
User.hasMany(Cause, { foreignKey: 'userId', as: 'causes' });
Cause.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Category.hasMany(Cause, { foreignKey: 'categoryId', as: 'causes' });
Cause.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

Cause.hasOne(FoodDetails, { foreignKey: 'causeId', as: 'foodDetails' });
FoodDetails.belongsTo(Cause, { foreignKey: 'causeId', as: 'cause' });

// Database connection and initialization
export const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✅ Database models synchronized.');
    }
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    throw error;
  }
};

export { sequelize };
export default sequelize;