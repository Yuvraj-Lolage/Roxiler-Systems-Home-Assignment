const db = require("../config/db");

class Store {
  constructor(id, name, email, address, owner_id) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.address = address;
    this.owner_id = owner_id;
  }

  static async findAll() {
    const [rows] = await db.query(
      `SELECT 
        s.id,
        s.name,
        s.email,
        s.address,
        s.owner_id,
        ROUND(AVG(r.rating_value), 1) AS average_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      GROUP BY s.id`
    );
    return rows;
  }

  static async findPaginated({ limit, offset }) {
    const [[{ total }]] = await db.query("SELECT COUNT(*) AS total FROM stores");
    const [rows] = await db.query(
      `SELECT 
        s.id,
        s.name,
        s.email,
        s.address,
        s.owner_id,
        ROUND(AVG(r.rating_value), 1) AS average_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      GROUP BY s.id
      ORDER BY s.id DESC
      LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    return { rows, total };
  }
}

module.exports = { Store };
