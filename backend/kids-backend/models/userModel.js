const db = require('../config/db');

class UserModel {
    static async create(userData) {
        const { name, age, parent_email, age_group_id } = userData;
        const [result] = await db.execute(
            'INSERT INTO Users (name, age, parent_email, age_group_id) VALUES (?, ?, ?, ?)',
            [name, age, parent_email, age_group_id]
        );
        return result.insertId;
    }

    static async findById(id) {
        const [rows] = await db.execute('SELECT * FROM Users WHERE id = ?', [id]);
        return rows[0];
    }

    static async update(id, userData) {
        const { name, age, parent_email } = userData;
        await db.execute(
            'UPDATE Users SET name = ?, age = ?, parent_email = ? WHERE id = ?',
            [name, age, parent_email, id]
        );
    }

    static async delete(id) {
        await db.execute('DELETE FROM Users WHERE id = ?', [id]);
    }
}

module.exports = UserModel;