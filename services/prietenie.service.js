const { Prietenie, User } = require("../modules");
const { Op } = require("sequelize");


async function findFriendshipByPK(idPrietenie) {
    let prietenie = await Prietenie.findByPk(idPrietenie);
    return prietenie;
}


async function findAllFriendships(filter) {
    let { idSender, idReciever, statusCerere, tag, sort, order } = filter;

    let optiuniQuery = {};
    let where = {}

    if (idSender)
        where.idSender = idSender;
    if (idReciever)
        where.idReciever = idReciever;
    if (statusCerere)
        where.statusCerere = statusCerere;
    if (tag)
        where.tag = tag;

    if (Object.keys(where).length > 0)
        optiuniQuery.where = where;

    if (sort)
        optiuniQuery.order = [[sort, order === "desc" ? "DESC" : "ASC"]]

    return await Prietenie.findAll(optiuniQuery);
}


async function insertNewFriendship(body) {
    let prietenie = await Prietenie.create(body);
    return prietenie;
}


async function updateFriendship(idPrietenie, body) {
    let campuriPrietenie = [
        "idSender",
        "idReciever",
        "statusCerere",
        "tag"
    ];
    let campuriUpdate = {};
    for (let camp of campuriPrietenie) {
        if (body[camp] !== undefined)
            campuriUpdate[camp] = body[camp];
    }
    const [tupluri] = await Prietenie.update(
        campuriUpdate,
        {
            where: { idPrietenie }
        }
    );
    return tupluri;
}


async function deleteFriendship(idPrietenie) {
    return await Prietenie.destroy({
        where: { idPrietenie }
    });
}


async function getAllFriendshipsWithUsers() {
    return await Prietenie.findAll({
        attributes: ["idPrietenie", "statusCerere", "tag"],
        include: [
            {
                model: User,
                as: "trimitere",
                attributes: ["id", "username", "email"]
            },
            {
                model: User,
                as: "primire",
                attributes: ["id", "username", "email"]
            }
        ]
    });
}


module.exports = {
    findAllFriendships,
    findFriendshipByPK,
    insertNewFriendship,
    updateFriendship,
    deleteFriendship,
    getAllFriendshipsWithUsers
}
