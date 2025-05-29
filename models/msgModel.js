const pool = require('../db/pool');
const Message = {
    create: async (messageData) => {
        const { userId, content } = messageData;
        const query = `
            INSERT INTO messages (user_id, content)
            VALUES ($1, $2)
            RETURNING id, user_id, content, created_at
        `;
        try {
            const result = await pool.query(query, [userId, content]);
            return result.rows[0];
        } catch (error) {
            console.error('Error creating message:', error);
            throw error;
        }
    },
    getAllMessages: async () => {
        const query = `
            SELECT m.id, m.content, m.created_at, u.username
            FROM messages m
            JOIN users u ON m.user_id = u.id
            ORDER BY m.created_at DESC
        `;
        try {
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            console.error('Error fetching messages:', error);
            throw error;
        }
    }
}

module.exports = Message;