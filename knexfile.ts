import { config } from 'dotenv';
config();

// module.exports = {
//   development: {
//     client: process.env.DATABASE_CLIENT,
//     connection: {
//       host: process.env.DATABASE_HOST,
//       user: process.env.DATABASE_USERNAME,
//       password: process.env.DATABASE_PASSWORD,
//       database: process.env.DATABASE_NAME,
//     },
//     migrations: {
//       tableName: 'knex_migrations',
//       directory: './database/migrations',
//     },
//   },
// };

// module.exports = {
//   development: {
//     client: 'sqlite3',
//     connection: {
//       filename: './.tmp/data.db',  // Используйте путь из DATABASE_FILENAME
//     },
//     useNullAsDefault: true,  // Для SQLite важно указывать эту опцию
//   },
//   production: {
//     client: 'sqlite3',
//     connection: {
//       filename: './.tmp/data.db',
//     },
//     useNullAsDefault: true,
//   },
// };

module.exports = {
  development: {
    client: process.env.DATABASE_CLIENT,
    connection: {
      filename: process.env.DATABASE_FILENAME
    },
    migrations: {
      directory: './database/migrations',
    },
    useNullAsDefault: true
  }
};
