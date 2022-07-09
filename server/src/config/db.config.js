module.exports = {
    HOST: process.env.HOST || "localhost",
    USER: "pict-manager",
    PASSWORD: "pict-password",
    DB: "pict-db",
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };
