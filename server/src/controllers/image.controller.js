const { user, album, sequelize, Sequelize } = require("../models");
const db = require("../models");
const { add_image_to_album } = require("./album.controller");
const Image = db.image;
const User = db.user;
// import { Blob } from 'buffer';

exports.create = (req, res) => {
    if (req.body.authorized_user.find(elem => elem == req.username)) {
        return res.status(401).send({ message: "Unauthorized. You can't share the image with yourself" });
    }
    User.findAll({
        where: {
            username: req.body.authorized_user
        }
    }).then(users => {
        if (!users || users.length !== req.body.authorized_user.length) {
            return res.status(404).send({ message: "One of the user of the list have not be found" });
        }
        album.findAll({
            where: {
                id: req.body.album_id
            }
        }).then(album => {
            var autho = []
            if (album && album.length != 0) {
                for (user_auth of req.body.authorized_user) {
                    if (!album[0].authorized_user.find(elem => elem == user_auth)) {
                        autho.push(user_auth)
                    }
                }
                for (user_auth of album[0].authorized_user) {
                    if (!autho.find(elem => elem == user_auth)) {
                        autho.push(user_auth)
                    }
                }
            } else {
                autho = req.body.authorized_user
            }
            User.findOne({
                where: {
                    id: req.userId
                }
            }).then(user => {
                if (!user) {
                    return res.status(404).send({ message: "User not found" });
                }
                Image.create({
                    name: req.body.name,
                    description: req.body.description,
                    data: Buffer.from(req.body.data),
                    user_id: req.userId,
                    tags: req.body.tags,
                    authorized_user: autho,
                    album_id: req.body.album_id,
                    owner: user.username
                }).then(image => {                
                    image.data = image.data.toString()
                    if (!album || album.length != req.body.album_id.length) {
                        return res.status(404).send({ message: "One or many album Not found." });
                    }
                    for (elem of album) {
                        if (elem.user_id != req.userId) {
                            return res.status(401).send({ message: "Unauthorized. You are not the owner of this album" });
                        }
                        elem.update({
                            image_id: elem.image_id.concat(image.id)
                        })
                    }
                    res.setHeader('content-type', 'multipart/form-data');
                    res.send(image);
            });
            }).catch(err => {
                res.status(500).send({ message: err.message });
            });
        })
    })
}

exports.images = (req, res) => {
    Image.findAll({
        where: {
            user_id: req.userId
        },
        limit: req.query.limit,
        offset: req.query.page
    }).then(images => {
        for (elem of images) {
            elem.data = elem.data.toString()
        }
        res.send(images);
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
}

exports.image = (req, res) => {
    Image.findOne({
        where: {
            id: req.params.img_id,
            user_id: req.userId
        }
    }).then(image => {
        image.data = image.data.toString()
        res.send(image);
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
}

exports.update = (req, res) => {
    Image.findOne({
        where: {
            id: req.params.img_id,
            user_id: req.userId
        }
    }).then(image => {
        if (!image) {
            return res.status(404).send({ message: "Image Not found." });
        }
        image.update({
            name: req.body.name,
            description: req.body.description,
        }).then(image => {
            res.send({ message: "Image was updated successfully!" });
        }).catch(err => {
            res.status(500).send({ message: err.message });
        });
    })
}

exports.delete = (req, res) => {
    Image.findOne({
        where: {
            id: req.params.img_id,
            user_id: req.userId
        }
    }).then(image => {
        if (!image) {
            return res.status(404).send({ message: "Image Not found." });
        }
        album.findAll({
            where: {
                id: image.album_id
            }
        }).then(album => {
            for (elem of album) {
                elem.update({
                    image_id: elem.image_id.filter(elem => elem != image.id)
                })
            }
            image.destroy().then(result => {
                res.send({ message: "Image was deleted successfully!" });
            }).catch(err => {
                res.status(500).send({ message: err.message });
            });
         })
    })
}

exports.image_by_user = (req, res) => {
    Image.findOne({
        where: {
            id: req.params.img_id
        }
    }).then(image => {
        image.data = image.data.toString()
        res.send(image);
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
}

exports.get_all_album_of_image = (req, res) => {
    Image.findOne({
        where: {
            id: req.params.img_id
        }
    }).then(image => {
        if (!image) {
            return res.status(404).send({ message: "Image Not found." });
        }
        album.findAll({
            where: {
                id: image.album_id,
            },
            limit: req.query.limit,
            offset: req.query.page
        }).then(album => {
            res.send(album);
        }
        ).catch(err => {
            res.status(500).send({ message: err.message });
        }
        );
    }
    ).catch(err => {
        res.status(500).send({ message: err.message });
    }
    );
}

// exports.authorize_user = (req, res) => {
//     User.findOne({
//         where: {
//             username: req.params.username 
//         }
//     }).then(user => {
//         if (!user) {
//             return res.status(404).send({ message: "User Not found." });
//         }
//         Image.findOne({
//             where: {
//                 id: req.params.img_id,
//                 user_id: req.userId,

//             }
//         }).then(image => {
//             if (!image) {
//                 return res.status(404).send({ message: "Image Not found." });
//             }
//             image.update({
//                 authorized_user: image.authorized_user.push(req.params.username)
//             }).then(image => {
//                 res.send({ message: "Image was updated successfully!" });
//             }
//             ).catch(err => {
//                 res.status(500).send({ message: err.message });
//             }
//             );
//         })
//     })
// }

// exports.get_images_from_authorized_user = (req, res) => {
//     User.findOne({
//         where: {
//             username: req.params.username
//         }
//     }).then(user => {
//         if (!user) {
//             return res.status(404).send({ message: "User Not found." });
//         }

//         Image.findAll({
//             where: {
//                 authorized_user: req.params.username,
//             },
//             limit: req.query.limit,
//             offset: req.query.page
//         }).then(images => {
//             for (elem of images) {
//                 elem.data = elem.data.toString()
//             }
//             res.send(images);
//         }
//         ).catch(err => {
//             res.status(500).send({ message: err.message });
//         }
//     );
//     }).catch(err => {
//         res.status(500).send({ message: err.message });
//     });
// }

//Exporte a function that return all the images of an user given by req.params.user_id and return only the images that are authorized by the user
exports.get_images_from_authorized_user_by_user = (req, res) => {
    User.findOne({
        where: {
            username: req.params.username
        }
    }).then(user => {
        if (!user) {
            return res.status(404).send({ message: "User Not found." });
        }
        User.findOne({
            where: {
                id: req.userId
            }
        }).then(me => {
            Image.findAll({
                where: {
                    authorized_user: {
                        [Sequelize.Op.contains]: [me.username],
                    },
                    user_id: user.id
                },
                limit: req.query.limit,
                offset: req.query.page
            }).then(images => {
                for (elem of images) {
                    elem.data = elem.data.toString()
                }
                res.send(images);
            }
            ).catch(err => {
                res.status(500).send({ message: err.message });
            }
        );
        }).catch(err => {
            res.status(500).send({ message: err.message });
        });
        })
}

// a corriger
exports.get_images_shared_with_me = (req, res) => {
    User.findOne({
        where: {
            id: req.userId
        }
    }).then(user => {
        if (!user) {
            return res.status(404).send({ message: "User Not found." });
        }
        Image.findAll({
            where: {
                authorized_user: {
                    [Sequelize.Op.contains]: [user.username],
                }
            },
            limit: req.query.limit,
            offset: req.query.page
        }).then(images => {
            for (elem of images) {
                elem.data = elem.data.toString()
            }
            res.send(images);
        }
        ).catch(err => {
            res.status(500).send({ message: err.message });
        });
    })
}

exports.add_authorized_user = (req, res) => {
    Image.findOne({
        where: {
            id: req.params.img_id
        }
    }).then(image => {
        if (!image) {
            return res.status(404).send({ message: "Image Not found." });
        }
        if (image.authorized_user.find(elem => elem == req.params.username)) {
            return res.status(400).send({ message: "User already authorized." });
        }
        image.update({
            authorized_user: image.authorized_user.concat(req.params.username)
        }).then(image => {
            res.send({ message: "Image was updated successfully!" });
        }
        ).catch(err => {
            res.status(500).send({ message: err.message });
        }
        );
    }
    ).catch(err => {
        res.status(500).send({ message: err.message });
    }
    );
}

exports.remove_authorized_user = (req, res) => {
    Image.findOne({
        where: {
            id: req.params.img_id
        }
    }).then(image => {
        if (!image) {
            return res.status(404).send({ message: "Image Not found." });
        }
        if (image.authorized_user.find(elem => elem == req.params.username) == undefined) {
            return res.status(400).send({ message: "User not authorized" });
        }
        let array = image.authorized_user.filter(item => item != req.params.username);
        image.update({
            authorized_user: array
        }).then(image => {
            res.send({ message: "Image was updated successfully!" });
        }
        ).catch(err => {
            res.status(500).send({ message: err.message });
        }
        );
    }
    ).catch(err => {
        res.status(500).send({ message: err.message });
    }
    );
}


exports.add_tag = (req, res) => {
    Image.findOne({
        where: {
            id: req.params.img_id
        }
    }).then(image => {
        if (!image) {
            return res.status(404).send({ message: "Image Not found." });
        }
        if (image.tags.find(elem => elem == req.params.tag)) {
            return res.status(400).send({ message: "Tag already added." });
        }
        image.update({
            tags: image.tags.concat(req.params.tag)
        }).then(image => {
            res.send({ message: "Image was updated successfully!" });
        }
        ).catch(err => {
            res.status(500).send({ message: err.message });
        }
        );
    }
    ).catch(err => {
        res.status(500).send({ message: err.message });
    }
    );
}

exports.remove_tag = (req, res) => {
    Image.findOne({
        where: {
            id: req.params.img_id
        }
    }).then(image => {
        if (!image) {
            return res.status(404).send({ message: "Image Not found." });
        }
        if (image.tags.find(elem => elem == req.params.tag) == undefined) {
            return res.status(400).send({ message: "Tag don't exist" });
        }
        let array = image.tags.filter(item => item != req.params.tag);
        image.update({
            tags: array
        }).then(image => {
            res.send({ message: "Image was updated successfully!" });
        }
        ).catch(err => {
            res.status(500).send({ message: err.message });
        }
        );
    }
    ).catch(err => {
        res.status(500).send({ message: err.message });
    }
    );
}

exports.get_images_by_tag = (req, res) => {
    Image.findAll({
        where: {
            tags: {
                [Sequelize.Op.contains]: [req.params.tag]
            },
            user_id: req.userId
        },
        limit: req.query.limit,
        offset: req.query.page
    }).then(images => {
        for (elem of images) {
            elem.data = elem.data.toString()
        }
        res.send(images);
    }
    ).catch(err => {
        res.status(500).send({ message: err.message });
    }
    );
}

exports.get_images_by_name = (req, res) => {
    Image.findAll({
        where: {
            name: {
                [Sequelize.Op.like]: '%' + req.params.name + '%'
            },
            user_id: req.userId,
        },
        limit: req.query.limit,
        offset: req.query.page
    }).then(images => {
        for (elem of images) {
            elem.data = elem.data.toString()
        }
        res.send(images);
    }
    ).catch(err => {
        res.status(500).send({ message: err.message });
    }
    );
}

exports.get_images_by_create_date = (req, res) => {
    Image.findAll({
        where: {
            createdAt: {
                [Sequelize.Op.like]: '%' + req.params.date + '%'
            },
            user_id: req.userId
        },
        limit: req.query.limit,
        offset: req.query.page
    }).then(images => {
        for (elem of images) {
            elem.data = elem.data.toString()
        }
        res.send(images);
    }
    ).catch(err => {
        res.status(500).send({ message: err.message });
    }
    );
}

exports.get_last_image_upload = (req, res) => {
    Image.findAll({
        where: {
            user_id: req.userId
        },
        order: [
            ['createdAt', 'DESC']
        ],
        limit: 1
    }).then(image => {
        image = image[0]
        image.data = image.data.toString()
        res.send(image);
    }
    ).catch(err => {
        res.status(500).send({ message: err.message });
    }
    );
}
