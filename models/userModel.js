const pool = require('../db/pool');

const User = {
    create: async (userData) => {
        const { first_Name, last_Name, username, email, password } = userData;
        const query = `
            INSERT INTO users (first_name, last_name, username, email, password)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, first_name, last_name, username, email
        `;
        try {
            const result = await pool.query(query, [first_Name, last_Name, username, email, password]);
            return result.rows[0];
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }
    ,
    findByEmail: async (email) => {
        const query = 'SELECT * FROM users WHERE email = $1';
        try {
            const result = await pool.query(query, [email]);
            return result.rows[0];
        } catch (error) {
            console.error('Error finding user by email:', error);
            throw error;
        }
    }
    ,
    findByUsername: async (username) => {
        const query = 'SELECT * FROM users WHERE username ILIKE $1'; // ILIKE for case-insensitive search
        try {
            const result = await pool.query(query, [username]);
            return result.rows[0];
        } catch (error) {
            console.error('Error finding user by username:', error);
            throw error;
        }
    }
    ,
    findById: async (id) => {
        const query = 'SELECT * FROM users WHERE id = $1';
        try {
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            console.error('Error finding user by ID:', error);
            throw error;
        }
    }
};

module.exports = User;