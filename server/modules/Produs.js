const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Produs = sequelize.define("Produs", {
    idProdus: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nume: {
        type: DataTypes.STRING,
        allowNull: false
    },

    categorie: {
        type: DataTypes.STRING,
        allowNull: false
    },

    dataExpirare: {
        type: DataTypes.DATE,
        allowNull: false
    },

    idUtilizator: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
})


module.exports = Produs;