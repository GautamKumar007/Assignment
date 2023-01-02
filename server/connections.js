const Sequelize = require("sequelize");

const sequelize = new Sequelize(process.env.MYSQL_DATABASE_NAME, process.env.MYSQL_USER_NAME, process.env.MYSQL_PASSWORD, {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    dialect: "mysql"
})


sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});

global.sequelize = sequelize;
module.exports = sequelize;
