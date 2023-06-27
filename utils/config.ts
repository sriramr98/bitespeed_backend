export default {
    db: {
        database: process.env.SQL_DATABASE || "test",
        username: process.env.SQL_USERNAME || "root",
        password: process.env.SQL_PASSWORD || "root",
        host: process.env.SQL_HOST || "localhost",
        port: process.env.SQL_PORT || 5432,
    },
}
