module.exports = (sequelize, Sequelize) => {
    const Image = sequelize.define("images", {
        name: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        },
        data: {
            type: Sequelize.BLOB
        },
        user_id: {
            type: Sequelize.INTEGER
        },
        tags: {
            type: Sequelize.ARRAY(Sequelize.STRING)
        },
        authorized_user: {
            type: Sequelize.ARRAY(Sequelize.STRING)
        },
        album_id: {
            type: Sequelize.ARRAY(Sequelize.INTEGER)
        },
        owner: {
            type: Sequelize.STRING
        }
    });
    return Image
}