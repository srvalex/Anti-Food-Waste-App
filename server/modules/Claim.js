const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Claim = sequelize.define("Claim", {
    idClaim: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    idProdus: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    idClaimer: {
        type: DataTypes.INTEGER,
        allowNull: true
    },

    statusClaim: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "In asteptare",
        validate: {
            isIn: [["In asteptare", "Acceptat", "Refuzat"]]
        }
    },

    mesaj: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: "claims"
});

module.exports = Claim;
