const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require('../connections')

const User = sequelize.define("user", {
  display_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at'
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at'
  }

}, {
  timestamps: true,
  underscored: true,
});


// sequelize.sync().then(() => {
//   console.log('User table created successfully!');
// }).catch((error) => {
//   console.error('Unable to create table : ', error);
// });


module.exports = User;


