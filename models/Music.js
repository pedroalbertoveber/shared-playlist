/* external modules */
const { DataTypes } = require("sequelize");
const db = require("../db/conn");
const User = require("./User");

const Music = db.define("Music", {
  title: {
    type: DataTypes.STRING,
    required: true,
    allowNull: false,
  },
  owner: {
    type: DataTypes.STRING,
    required: true,
    allowNull: false,
  },
  genre: {
    type: DataTypes.STRING,
    required: true,
    allowNull: false,
  },
});

Music.belongsTo(User);
User.hasMany(Music);

module.exports = Music;