module.exports = {
    development: {
        client: "sqlite3",
        connection: {
            filename: `${__dirname}/dev.sqlite3`,
        },
        useNullAsDefault: true,
    },

    production: {
        client: "mysql",
        connection: {
            host: "host",
            database: "database",
            user: "username",
            password: "password",
        },
        pool: {
            min: 0,
            max: 7,
        },
    },
};
