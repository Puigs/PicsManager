const db = require("../models");
const User = db.user;

exports.checkIfIExist = (req, res, next) => {
    User.findOne({
        where: {
            id: req.userId
        }
    }).then(user => {
        if (!user) {
            return res.status(404).send({ message: "User Not found." });
        }
        next();
    }
    ).catch(err => {
        res.status(500).send({ message: err.message });
    }
    );
}

exports.checkUserIfExist = (req, res, next) => {
    User.findOne({
        where: {
            username: req.params.username
        }
    }).then(user => {
        if (!user) {
            return res.status(404).send({ message: "User Not found." });
        }
        console.log("next")
        next();
    }
    ).catch(err => {
        res.status(500).send({ message: err.message });
    }
    );
}