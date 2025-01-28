


const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'easygoing-database-1.cfse4saom3x1.us-east-2.rds.amazonaws.com',
  database: 'postgres',
  password: '$Mauriceiscute97',
  port: 5432, // Default PostgreSQL port
  ssl: {
    rejectUnauthorized: false, // Use false for testing; consider using proper CA certificates in production
  },
});

module.exports = pool;

