const { image , Sequelize} = require("../models");
const db = require("../models")
const Album = db.album;
const Image = db.image;
const User = db.user;

exports.create = (req, res) => {
    if (req.body.authorized_user.find(elem => elem == req.username)) {
        return res.status(401).send({ message: "Unauthorized. You can't share the image with yourself" });
    }
    User.findAll({
        where: {
            username: req.body.authorized_user
        }
    }).then(users => {
        if (users.length != req.body.authorized_user.length) {
            return res.status(401).send({ message: "Unauthorized. You can't share the image with someone who doesn't exist" });
        }
        Image.findAll({
            where: {
                id: req.body.image_id
            }
        }).then(images => {
            User.findOne({
                where: {
                    id: req.userId
                }
            }).then(user => {
                Album.create({
                    name: req.body.name,
                    description: req.body.description,
                    user_id: req.userId,
                    tags: req.body.tags,
                    authorized_user: req.body.authorized_user,
                    image_id: req.body.image_id,
                    owner: user.username
                }).then(album => {
                    if (!images || images.length != req.body.image_id.length) {
                        return res.status(404).send({ message: "Image Not found." });
                    }
                    for (elem of images) {
                        if (elem.user_id != req.userId) {
                            return res.status(401).send({ message: "Unauthorized. You are not the owner of this image" });
                        }
                        elem.update({
                            album_id: elem.album_id.concat(album.id)
                        })
                    }
                    res.send(album);
                }).catch(err => {
                    res.status(500).send({ message: err.message });
                });
            })
        })
    })

}

exports.albums = (req, res) => {
    Album.findAll({
        where: {
            user_id: req.userId
        },
        limit: req.query.limit,
        offset: req.query.page
    }).then(albums => {
        res.send(albums);
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
}

exports.album = (req, res) => {
    Album.findOne({
        where: {
            id: req.params.id
        }
    }).then(album => {
        if (!album) {
            return res.status(404).send({ message: "Album Not found." });
        }
        res.send(album);
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
}

exports.delete = (req, res) => {
    Album.findOne({
        where: {
            id: req.params.id
        }
    }).then(album => {
        if (!album) {
            return res.status(404).send({ message: "Album Not found." });
        }
        Image.findAll({
            where: {
                id: album.image_id
            }
        })
        .then(images => {
            for (elem of images) {
                elem.update({
                    album_id: elem.album_id.filter(elem => elem != album.id)
                })
            }
            album.destroy();
            res.send({ message: "Album deleted" });
        })
    })
}

exports.update = (req, res) => {
    Album.findOne({
        where: {
            id: req.params.id
        }
    }).then(album => {
        if (!album) {
            return res.status(404).send({ message: "Album Not found." });
        }
        album.update({
            name: req.body.name,
            description: req.body.description,
        }).then(album => {
            res.send({ message: "Album was updated successfully!" });
        }).catch(err => {
            res.status(500).send({ message: err.message });
        });
    })
}

//  Cette fonction ne sert à rien non?
exports.album_by_user = (req, res) => {
    User.findOne({
        where: {
            username: req.params.username
        }
    }).then(user => {
        if (!user) {
            return res.status(404).send({ message: "User Not found." });
        }
        Album.findAll({
            where: {
                user_id: req.userId,
                id: user.id
            },
            limit: req.query.limit,
            offset: req.query.page
        }).then(albums => {
            res.send(albums);
        }).catch(err => {
            res.status(500).send({ message: err.message });
        });
    })
}

exports.images_of_album = (req, res) => {
    Album.findOne({
        where: {
            id: req.params.id
        }
    }).then(album => {
        if (!album) {
            return res.status(404).send({ message: "Album Not found." });
        }
        Image.findAll({
            where: {
                id: album.image_id
            },
            limit: req.query.limit,
            offset: req.query.page
        }).then(images => {
            for (elem of images) {
                elem.data = elem.data.toString();
            }
            res.send(images);
        }).catch(err => {
            res.status(500).send({ message: err.message });
        });
    })
}

exports.add_image_to_album = (req, res) => {
    Album.findOne({
        where: {
            id: req.params.album_id
        }
    }).then(album => {
        if (!album) {
            return res.status(404).send({ message: "Album Not found." });
        }
        Image.findOne({
            where: {
                id: req.params.img_id
                }
        }).then(image => {
            if (!image) {
                return res.status(404).send({ message: "Image Not found." });
            }
            if (album.image_id.find(elem => elem == image.id)) {
                return res.status(500).send({ message: "Image already in album" });
            }
            image.update({
                album_id: image.album_id.concat(album.id)
            })
            album.update({
                image_id: album.image_id.concat(image.id)
            }).then(album => {
                res.send({ message: "Image was added to album successfully!" });
            }).catch(err => {
                res.status(500).send({ message: err.message });
            });
        }).catch(err => {
            res.status(500).send({ message: err.message });
        });     
    })
}

exports.remove_image_from_album = (req, res) => {
    console.log("HERE")
    Album.findOne({
        where: {
            id: req.params.album_id
        }
    }).then(album => {
        if (!album) {
            return res.status(404).send({ message: "Album Not found." });
        }
        Image.findOne({
            where: {
                id: req.params.img_id
                }
        }).then(image => {
            if (!image || image.album_id.find(elem => elem == req.params.img_id) == undefined) {
                return res.status(404).send({ message: "Image Not found." });
            }
            image.update({
                album_id: image.album_id.filter(elem => elem != album.id)
            })
            album.update({
                image_id: album.image_id.filter(elem => elem != req.body.image_id)
            }).then(album => {
                res.send({ message: "Image was removed from album successfully!" });
            }).catch(err => {
                res.status(500).send({ message: err.message });
            });
        }).catch(err => {
            res.status(500).send({ message: err.message });
        }
        )
    })
}

exports.add_authorized_user = (req, res) => {
    Album.findOne({
        where: {
            id: req.params.id
        }
    }).then(album => {
        if (!album) {
            return res.status(404).send({ message: "Album Not found." });
        }
        if (album.authorized_user.find(elem => elem == req.params.username)) {
            return res.status(400).send({ message: "User already authorized." });
        }
        for (elem of album.image_id) {
            Image.findOne({
                where: {
                    id: elem
                }
            }).then(image => {
                if (image.authorized_user.find(elem => elem == req.params.username)) {
                    return res.status(400).send({ message: "User already authorized." });
                }
                image.update({
                    authorized_user: image.authorized_user.concat(req.params.username)
                })
            }).catch(err => {
                res.status(500).send({ message: err.message });
            }
            )
        }
        album.update({
            authorized_user: album.authorized_user.concat(req.params.username)
        }).then(album => {
            res.send({ message: "User was added to album successfully!" });
        }).catch(err => {
            res.status(500).send({ message: err.message });
        });
    })
}

exports.remove_authorized_user = (req, res) => {
    Album.findOne({
        where: {
            id: req.params.id
        }
    }).then(album => {
        if (!album) {
            return res.status(404).send({ message: "Album Not found." });
        }
        if (!album.authorized_user.find(elem => elem == req.params.username)) {
            return res.status(400).send({ message: "User not authorized." });
        }
        var bool = false
        for (elem of album.image_id) {
            Image.findOne({
                where: {
                    id: elem
                }
            }).then(image => {
                if (!image.authorized_user.find(elem => elem == req.params.username)) {
                    bool = true
                    return
                }
                image.update({
                    authorized_user: image.authorized_user.filter(elem => elem != req.params.username)
                })
            }).catch(err => {
                res.status(500).send({ message: err.message });
            }
            )
        }
        if (bool == true)
            return res.status(400).send({ message: "User not authorized." });
        let array = album.authorized_user.filter(item => item != req.params.username);
        album.update({
            authorized_user: array
        }).then(album => {
            res.send({ message: "User was removed from album successfully!" });
        }).catch(err => {
            res.status(500).send({ message: err.message });
        });
    })
}

exports.get_all_album_shared_with_me = (req, res) => {
    User.findOne({
        where:{
            id: req.userId
        }
    }).then(user => {
        Album.findAll({
            where: {
                authorized_user: {
                    [Sequelize.Op.contains]: [user.username],
                }
            },
            limit: req.query.limit,
            offset: req.query.page
        }).then(albums => {
            res.send(albums);
        }).catch(err => {
            res.status(500).send({ message: err.message });
        });
    })
}