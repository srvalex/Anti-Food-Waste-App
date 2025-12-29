const { Sequelize } = require("sequelize") // importa sau fa request pentru acest pachet
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ".database.sqlite"
});

module.export = sequelize;