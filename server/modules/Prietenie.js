const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Prietenie = sequelize.define("Prietenie", {
    idPrietenie: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    idRequest: {
        type: DataTypes.INTEGER,
        allowNull: false
    },


    idReciever: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    statusCerere: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [["In asteptare", "Acceptata", "Refuzata"]]
        }
    }
})


module.export = Prietenie;