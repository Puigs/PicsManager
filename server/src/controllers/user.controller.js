const { user, sequelize, Sequelize } = require("../models");
const db = require("../models");
const Image = db.image;
const Album = db.album;

exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
  };
  exports.userBoard = (req, res) => {
    res.status(200).send("User Content.");
  };
  exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
  };

exports.search_user_by_name = (req, res) => {
    const name = req.params.name;
    user.findAll({
        where: {
            username: {
                [Sequelize.Op.like]: "%" + name + "%"
            }
        }
    }).then(users => {
        res.status(200).json(users);
    }).catch(err => {
        res.status(500).json(err);
    })
}

exports.get_info_user = (req, res) => {
    let nb_albums = 0;
    let nb_images = 0;
    let nb_image_shared = 0;
    let nb_image_shared_with_me = 0;
    let nb_album_shared = 0;
    let nb_album_shared_with_me = 0;
    
    user.findOne({
        where: {
            id: req.userId
        }
    }).then(user => {
        Image.findAll({
            where: {
                user_id: req.userId
            }
        }).then(images => {
            nb_images = images.length;
            for (elem of images) {
                if (elem.authorized_user.length > 0) {
                    nb_image_shared++;
                }
            }
            Image.findAll({
                where: {
                    authorized_user: {
                        [Sequelize.Op.contains]: [user.username],
                    }
                }
            }).then(images_shared => {
                nb_image_shared_with_me = images_shared.length;
                Album.findAll({
                    where: {
                        user_id: req.userId
                    }
                }).then(albums => {
                    nb_albums = albums.length;
                    for (elem of albums) {
                        if (elem.authorized_user.length > 0) {
                            nb_album_shared++;
                        }
                    }
                    Album.findAll({
                        where: {
                            authorized_user: {
                                [Sequelize.Op.contains]: [user.username],
                            }
                        }
                    }).then(albums_shared => {
                        nb_album_shared_with_me = albums_shared.length;
                        res.status(200).json({
                            nb_albums: nb_albums,
                            nb_images: nb_images,
                            nb_image_shared: nb_image_shared,
                            nb_image_shared_with_me: nb_image_shared_with_me,
                            nb_album_shared: nb_album_shared,
                            nb_album_shared_with_me: nb_album_shared_with_me
                        });
                    }
                    ).catch(err => {
                        res.status(500).json(err);
                    }
                    )
                })
            })
        })
    })
}