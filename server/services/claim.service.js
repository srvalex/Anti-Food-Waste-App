const { Claim, User, Produs } = require('../modules');
const { Op } = require('sequelize');

async function findClaimByPK(id) {
    return await Claim.findByPk(id, {
        include: [
            { model: User, as: "claimer", attributes: ['id', 'username', 'email'] },
            { model: Produs, as: "produs", attributes: ['idProdus', 'nume', 'categorie', 'dataExpirare'] }
        ]
    });
}

async function findAllClaims(filters) {
    let whereClause = {};
    let orderClause = [];

    if (filters.idProdus) whereClause.idProdus = filters.idProdus;
    if (filters.idClaimer) whereClause.idClaimer = filters.idClaimer;
    if (filters.statusClaim) whereClause.statusClaim = filters.statusClaim;

    if (filters.sort && filters.order) {
        orderClause.push([filters.sort, filters.order.toUpperCase()]);
    }

    return await Claim.findAll({
        where: whereClause,
        order: orderClause.length > 0 ? orderClause : [['createdAt', 'DESC']],
        include: [
            { model: User, as: "claimer", attributes: ['id', 'username', 'email'] },
            { model: Produs, as: "produs", attributes: ['idProdus', 'nume', 'categorie', 'dataExpirare', 'idUtilizator'] }
        ]
    });
}

async function insertNewClaim(claimData) {
    return await Claim.create(claimData);
}

async function updateClaim(id, updateData) {
    let [nrTupluri] = await Claim.update(updateData, {
        where: { idClaim: id }
    });
    return nrTupluri;
}

async function deleteClaim(id) {
    return await Claim.destroy({
        where: { idClaim: id }
    });
}

async function getClaimsByProductOwner(ownerId) {
    return await Claim.findAll({
        include: [
            { model: User, as: "claimer", attributes: ['id', 'username', 'email'], required: false },
            {
                model: Produs,
                as: "produs",
                where: { idUtilizator: ownerId },
                attributes: ['idProdus', 'nume', 'categorie', 'dataExpirare', 'idUtilizator']
            }
        ],
        order: [['createdAt', 'DESC']]
    });
}

module.exports = {
    findClaimByPK,
    findAllClaims,
    insertNewClaim,
    updateClaim,
    deleteClaim,
    getClaimsByProductOwner
};
