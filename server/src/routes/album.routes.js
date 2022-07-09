const controller = require("../controllers/album.controller")
const { verifyToken } = require("../middleware/authJwt");
const { checkUserIfExist, checkIfIExist } = require("../middleware/checkUserIfExist");
const { defaultQuery } = require("../middleware/query");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    
    app.post("/api/album/create", [verifyToken, checkIfIExist], controller.create);
    app.get("/api/album", [verifyToken, checkIfIExist, defaultQuery], controller.albums);
    app.get("/api/album/shared", [verifyToken, checkIfIExist, defaultQuery], controller.get_all_album_shared_with_me)
    app.get("/api/album/:id", [verifyToken, checkIfIExist], controller.album);
    app.put("/api/album/:id", [verifyToken, checkIfIExist], controller.update);
    app.delete("/api/album/:id", [verifyToken, checkIfIExist], controller.delete);
    app.get("/api/album/:id/images", [verifyToken, checkIfIExist, defaultQuery], controller.images_of_album);
    app.put("/api/album/:id/add/:username", [verifyToken, checkIfIExist, checkUserIfExist], controller.add_authorized_user);
    app.put("/api/album/:id/remove/:username", [verifyToken, checkIfIExist, checkUserIfExist], controller.remove_authorized_user);
    app.put("/api/album/:album_id/add/image/:img_id", [verifyToken, checkIfIExist], controller.add_image_to_album)
    app.put("/api/album/:album_id/remove/image/:img_id", [verifyToken, checkIfIExist], controller.remove_image_from_album)
    app.get("/api/album/:userId/:id", [verifyToken, checkIfIExist, defaultQuery], controller.album_by_user);
}