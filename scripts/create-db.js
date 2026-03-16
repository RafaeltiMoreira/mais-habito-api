require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { Client } = require('pg');

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'postgres', // Connect to default db to create new one
});

async function run() {
  try {
    await client.connect();
    // Check if db exists
    const res = await client.query('SELECT datname FROM pg_database WHERE datname = $1', [process.env.DB_NAME]);
    if (res.rowCount === 0) {
      console.log(`Creating database ${process.env.DB_NAME}...`);
      await client.query(`CREATE DATABASE ${process.env.DB_NAME}`);
      console.log('Database created successfully.');
    } else {
      console.log(`Database ${process.env.DB_NAME} already exists.`);
    }
  } catch (err) {
    console.error('Error creating database:', err);
  } finally {
    await client.end();
  }
}

run();
