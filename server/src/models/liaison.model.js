module.exports = (sequelize, Sequelize) => {
    const Liaison = sequelize.define("liaisons", {
        album_id: {
            type: Sequelize.INTEGER
        },
        user_id: {
        type: Sequelize.INTEGER
        }
    })
    return Liaison
    }