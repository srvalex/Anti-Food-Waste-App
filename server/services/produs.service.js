
const Produs = require("../modules/Produs");
const { operatiiBD } = require('sequelize');


async function findProductByPK(id) {
    let prod = await Produs.findByPk(id);
    return prod;
}

async function findAllProducts(filter) {
    let { nume, categorie, dataExpirare, idUtilizator, optiuneExpirare = 'inainte' } = filter;

    let optiuniQuery = {};
    let where = {}

    if (nume)
        where.nume = nume;
    if (categorie)
        where.categorie = categorie
    if (dataExpirare)
        if (optiuneExpirare == 'dupa')
            where.dataExpirare = {
                [operatiiBD.gte]: new Date(dataExpirare)
            }
        else
            where.dataExpirare = { [operatiiBD.lte]: new Date(dataExpirare) }
    if (idUtilizator)
        where.idUtilizator = idUtilizator;
    if (Object.keys(where).length > 0)
        optiuniQuery.where = where;
    return await Produs.findAll(optiuniQuery);
}


async function insertNewProduct(body) {
    let prod = await Produs.create(body);
    return prod;
}


async function updateProduct(idProdus, body) {
    let campuriProdus = [
        "nume",
        "categorie",
        "dataExpirare",
        "isAvailable",
        "status"
    ];
    let campuriUpdate = {};
    for (let camp of campuriProdus) {
        if (body[camp] !== undefined)
            campuriUpdate[camp] = body[camp];
    }
    const [tupluri] = await Produs.update(
        campuriUpdate,
        {
            where: { idProdus }
        }
    );
    return tupluri;
}


async function deleteProduct(idProdus) {
    return await Produs.destroy({
        where: { idProdus }
    });
}

async function findAvailableProducts(categorie) {
    const { User } = require('../modules');
    let whereClause = {
        isAvailable: true,
        status: 'disponibil'
    };

    if (categorie) whereClause.categorie = categorie;

    return await Produs.findAll({
        where: whereClause,
        include: [
            { model: User, attributes: ['id', 'username', 'email'] }
        ],
        order: [['dataExpirare', 'ASC']]
    });
}

async function findExpiringProducts(idUtilizator, days) {
    const { Op } = require('sequelize');
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    return await Produs.findAll({
        where: {
            idUtilizator: idUtilizator,
            dataExpirare: {
                [Op.between]: [today, futureDate]
            },
            status: {
                [Op.ne]: 'expired'
            }
        },
        order: [['dataExpirare', 'ASC']]
    });
}

module.exports = {
    findAllProducts,
    findProductByPK,
    insertNewProduct,
    updateProduct,
    deleteProduct,
    findAvailableProducts,
    findExpiringProducts
}