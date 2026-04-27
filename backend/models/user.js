const db = require("../config/db");

class User {
  constructor(id, name, email, password, role) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
  }

  static async create(name, email, address, password, role = "USER") {
    const [result] = await db.query(
      "INSERT INTO users (name, email, address, password, role) VALUES (?, ?, ?, ?, ?)",
      [name, email, address, password, role]
    );
    return {
      id: result.insertId,
      name,
      email,
      address,
      role,
    };
  }

  static async findById(id) {
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    if (rows.length === 0) return null;
    const { id: userId, name, email, password } = rows[0];
    return new User(userId, name, email, password);
  }

  static async findByEmail(email) {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) return null;
    const { id, name, email: userEmail, password, role } = rows[0];
    return new User(id, name, userEmail, password, role);
  }

  static async findAll() {
    const [rows] = await db.query(
      "SELECT id, name, email, address, role FROM users ORDER BY id DESC"
    );
    return rows;
  }

  static async findPaginated({ limit, offset }) {
    const [[{ total }]] = await db.query("SELECT COUNT(*) AS total FROM users");
    const [rows] = await db.query(
      "SELECT id, name, email, address, role FROM users ORDER BY id DESC LIMIT ? OFFSET ?",
      [limit, offset]
    );

    return { rows, total };
  }

  async update() {
    await db.query(
      "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?",
      [this.name, this.email, this.password, this.id]
    );
    return this;
  }

  async delete() {
    await db.query("DELETE FROM users WHERE id = ?", [this.id]);
    return true;
  }
}

module.exports = { User };
