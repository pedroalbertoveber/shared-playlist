/* external modules */
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("shared_playlist", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

try {
  sequelize.authenticate();
  console.log("Conectou ao banco de dados SQL!");
} catch(err) {
  console.log("ERROR: Aconteceu um erro ao executar o programa: ", err);
}

module.exports = sequelize;