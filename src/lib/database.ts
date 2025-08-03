import mysql from "mysql2/promise";

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "next_h2g",
  port: parseInt(process.env.DB_PORT || "3306"),
  charset: "utf8mb4",
  supportBigNumbers: true,
  bigNumberStrings: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Database helper class
export class Database {
  private static pool = pool;

  // Get connection from pool
  static async getConnection() {
    return await this.pool.getConnection();
  }

  // Execute query with automatic connection handling
  static async query(sql: string, params: any[] = []) {
    const connection = await this.getConnection();
    try {
      const [rows] = await connection.execute(sql, params);
      return rows;
    } finally {
      connection.release();
    }
  }

  // Execute transaction
  static async transaction(callback: (connection: any) => Promise<any>) {
    const connection = await this.getConnection();
    try {
      await connection.beginTransaction();
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Health check
  static async healthCheck() {
    try {
      console.log("🔍 Testing database connection...");
      const start = Date.now();

      await this.query("SELECT 1 as test");

      const duration = Date.now() - start;
      console.log(`✅ Database query successful (${duration}ms)`);

      return {
        status: "healthy",
        timestamp: new Date().toISOString(),
        responseTime: duration,
        config: {
          host: process.env.DB_HOST || "localhost",
          database: process.env.DB_NAME || "next_h2g",
          port: process.env.DB_PORT || "3306",
          user: process.env.DB_USER || "root",
        },
      };
    } catch (error) {
      console.error("💀 Database health check failed:", error);

      return {
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
        errorCode: (error as any)?.code,
        errorNumber: (error as any)?.errno,
        sqlState: (error as any)?.sqlState,
        timestamp: new Date().toISOString(),
        config: {
          host: process.env.DB_HOST || "localhost",
          database: process.env.DB_NAME || "next_h2g",
          port: process.env.DB_PORT || "3306",
          user: process.env.DB_USER || "root",
        },
      };
    }
  }
}

// User service
export class UserService {
  static async findByEmail(email: string) {
    console.log("🔍 UserService.findByEmail called with:", email);
    try {
      const result = (await Database.query(
        "SELECT * FROM users WHERE LOWER(email) = LOWER(?)",
        [email],
      )) as any[];

      console.log("📊 Query result:", {
        rowsFound: result.length,
        userExists: !!result[0],
        userId: result[0]?.id,
        userEmail: result[0]?.email,
      });

      return result[0] || null;
    } catch (error) {
      console.error("💥 UserService.findByEmail error:", error);
      throw error;
    }
  }

  static async findById(id: number) {
    const result = (await Database.query("SELECT * FROM users WHERE id = ?", [
      id,
    ])) as any[];
    return result[0] || null;
  }

  static async create(userData: {
    name: string;
    email: string;
    password?: string;
    avatar?: string;
    isVerified?: boolean;
  }) {
    const {
      name,
      email,
      password = null,
      avatar = null,
      isVerified = false,
    } = userData;

    const result = (await Database.query(
      `INSERT INTO users (name, email, password, avatar, email_verified, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      [name, email, password, avatar, isVerified],
    )) as any;

    return {
      id: result.insertId,
      name,
      email,
      avatar,
      isVerified,
      isAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  static async update(id: number, data: any) {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        // Convert camelCase to snake_case for database fields
        const dbField = key.replace(
          /[A-Z]/g,
          (letter) => `_${letter.toLowerCase()}`,
        );
        fields.push(`${dbField} = ?`);
        values.push(value);
      }
    }

    if (fields.length === 0) return null;

    values.push(id);

    await Database.query(
      `UPDATE users SET ${fields.join(", ")}, updated_at = NOW() WHERE id = ?`,
      values,
    );

    return await this.findById(id);
  }

  static async updateLastLogin(id: number) {
    await Database.query("UPDATE users SET last_login = NOW() WHERE id = ?", [
      id,
    ]);
  }
}

// Account service for NextAuth
export class AccountService {
  static async create(accountData: {
    userId: number;
    type: string;
    provider: string;
    providerAccountId: string;
    refreshToken?: string;
    accessToken?: string;
    expiresAt?: number;
    tokenType?: string;
    scope?: string;
    idToken?: string;
    sessionState?: string;
  }) {
    const {
      userId,
      type,
      provider,
      providerAccountId,
      refreshToken = null,
      accessToken = null,
      expiresAt = null,
      tokenType = null,
      scope = null,
      idToken = null,
      sessionState = null,
    } = accountData;

    const id = `${provider}_${providerAccountId}_${Date.now()}`;

    await Database.query(
      `INSERT INTO accounts (id, user_id, type, provider, provider_account_id, 
       refresh_token, access_token, expires_at, token_type, scope, id_token, session_state)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        userId,
        type,
        provider,
        providerAccountId,
        refreshToken,
        accessToken,
        expiresAt,
        tokenType,
        scope,
        idToken,
        sessionState,
      ],
    );

    return { id, userId, type, provider, providerAccountId };
  }

  static async findByProvider(provider: string, providerAccountId: string) {
    const result = (await Database.query(
      "SELECT * FROM accounts WHERE provider = ? AND provider_account_id = ?",
      [provider, providerAccountId],
    )) as any[];
    return result[0] || null;
  }
}

// Session service for NextAuth
export class SessionService {
  static async create(sessionData: {
    sessionToken: string;
    userId: number;
    expires: Date;
  }) {
    const { sessionToken, userId, expires } = sessionData;
    const id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    await Database.query(
      "INSERT INTO sessions (id, session_token, user_id, expires) VALUES (?, ?, ?, ?)",
      [id, sessionToken, userId, expires],
    );

    return { id, sessionToken, userId, expires };
  }

  static async findByToken(sessionToken: string) {
    const result = (await Database.query(
      "SELECT * FROM sessions WHERE session_token = ?",
      [sessionToken],
    )) as any[];
    return result[0] || null;
  }

  static async update(sessionToken: string, data: any) {
    const { expires } = data;
    await Database.query(
      "UPDATE sessions SET expires = ? WHERE session_token = ?",
      [expires, sessionToken],
    );
  }

  static async delete(sessionToken: string) {
    await Database.query("DELETE FROM sessions WHERE session_token = ?", [
      sessionToken,
    ]);
  }
}

// Verification token service for NextAuth
export class VerificationTokenService {
  static async create(data: {
    identifier: string;
    token: string;
    expires: Date;
  }) {
    const { identifier, token, expires } = data;
    await Database.query(
      "INSERT INTO verificationtokens (identifier, token, expires) VALUES (?, ?, ?)",
      [identifier, token, expires],
    );
    return { identifier, token, expires };
  }

  static async findByToken(token: string) {
    const result = (await Database.query(
      "SELECT * FROM verificationtokens WHERE token = ?",
      [token],
    )) as any[];
    return result[0] || null;
  }

  static async delete(identifier: string, token: string) {
    await Database.query(
      "DELETE FROM verificationtokens WHERE identifier = ? AND token = ?",
      [identifier, token],
    );
  }
}

export default Database;
