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
    },

    isAvailable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },

    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "in frigider",
        validate: {
            isIn: [["in frigider", "disponibil", "claimed", "expirat"]]
        }
    }
}, {
    tableName: "produse",
    hooks: {
        afterCreate: async (produs, options) => {
            const Claim = require('./Claim');

            await Claim.create({
                idProdus: produs.idProdus,
                idClaimer: null,
                statusClaim: "In asteptare",
                mesaj: `Produs nou creat: ${produs.nume}`
            });

            console.log(`✓ Claim created automatically for product ${produs.idProdus} (${produs.nume})`);
        }
    }
})


module.exports = Produs;