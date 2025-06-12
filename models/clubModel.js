const pool = require('../db/pool');

module.exports = Club = {
    create: async (clubData) => {
        const { userId, clubName, passcode } = clubData;

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Check if the club name already exists
            const checkQuery = `
                SELECT id FROM clubs WHERE name = $1
            `;
            const checkResult = await client.query(checkQuery, [clubName]);
            if (checkResult.rows.length > 0) {
                throw new Error('Club name already exists');
            }
            // Insert the new club into the clubs table
            const insertQuery = `
                INSERT INTO clubs (name, passcode)
                VALUES ($1, $2)
                RETURNING id, name
            `;
            const insertValues = [clubName, passcode];
            const insertResult = await client.query(insertQuery, insertValues);
            console.log('Club created:', insertResult.rows[0]);

            // Insert the club creator's user ID into the user_clubs table
            const creatorQuery = `
                INSERT INTO user_clubs (club_id, user_id, is_admin)
                VALUES ($1, $2, TRUE)
            `;
            const creatorValues = [insertResult.rows[0].id, userId];
            await client.query(creatorQuery, creatorValues);

            await client.query('COMMIT');
            console.log('Club creator/admin added:', userId);
            return insertResult.rows[0]; // Return the created club
        } catch (error) {
            console.error('Error checking club name:', error);
            throw error; 
        } finally {
            client.release();
        }
    },
    getAll: async () => {
        const query = `
            SELECT c.id, c.name,c.passcode, u.username
            FROM clubs c
            JOIN user_clubs uc ON c.id = uc.club_id
            JOIN users u ON uc.user_id = u.id
            ORDER BY c.name ASC
        `;
        try {
            const result = await pool.query(query);
            // console.log('clubModel.js - getAll - Fetched clubs:', result.rows);
            return result.rows;
        } catch (error) {
            console.error('Error fetching clubs:', error);
            throw error;
        }
    },
    getById: async (clubId) => {
        const query = `
            SELECT c.id, c.name, c.passcode, u.username
            FROM clubs c
            JOIN user_clubs uc ON c.id = uc.club_id
            JOIN users u ON uc.user_id = u.id
            WHERE c.id = $1
        `;
        try {
            const result = await pool.query(query, [clubId]);
            if (result.rows.length === 0) {
                return null; // No club found with the given ID
            }
            // console.log('clubModel.js - getById - Fetched club:', result.rows[0]);
            return result.rows[0];
        } catch (error) {
            console.error('Error fetching club by ID:', error);
            throw error;
        }
    },
    join: async (clubId, userId) => {
        const client = await pool.connect(); // Make the queries atomic(all queries succeed or fail) by wrapping them in a transaction
        if (!clubId || !userId) {
            throw new Error('Club ID and User ID are required');
        }
        try {
            await client.query('BEGIN'); // Start a transaction

            // Check if the club exists and the passcode is correct
            const checkQuery = `
                SELECT id FROM clubs WHERE id = $1
            `;
            const checkResult = await client.query(checkQuery, [clubId]);
            if (checkResult.rows.length === 0) {
                throw new Error('Invalid club ID');
            }

            // Insert the user into the user_clubs table
            const insertQuery = `
                INSERT INTO user_clubs (club_id, user_id, is_admin)
                VALUES ($1, $2, FALSE)
            `;
            await client.query(insertQuery, [clubId, userId]);

            await client.query('COMMIT');
            // console.log('User joined club:', clubId);
        } catch (error) {
            console.error('Error joining club:', error);
            await client.query('ROLLBACK');
            throw error; 
        } finally {
            client.release();
        }
    }
}