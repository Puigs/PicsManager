module.exports = (sequelize, Sequelize) => {
    const Album = sequelize.define("albums", {
        name: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        },
        create_at: {
            type: Sequelize.DATE
        },
        updated_at: {
            type: Sequelize.DATE
        },
        authorized_user: {
            type: Sequelize.ARRAY(Sequelize.STRING)
        },
        user_id: {
            type: Sequelize.INTEGER
        },
        image_id: {
            type: Sequelize.ARRAY(Sequelize.INTEGER)
        },
        owner: {
            type: Sequelize.STRING
        }
    })
    return Album
}