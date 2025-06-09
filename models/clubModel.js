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
            console.log('Club creator added:', userId);
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
            SELECT c.id, c.name, u.username
            FROM clubs c
            JOIN user_clubs uc ON c.id = uc.club_id
            JOIN users u ON uc.user_id = u.id
            ORDER BY c.name ASC
        `;
        try {
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            console.error('Error fetching clubs:', error);
            throw error;
        }
    }
}