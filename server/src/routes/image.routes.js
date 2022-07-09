const controller = require("../controllers/image.controller");
const { verifyToken } = require("../middleware/authJwt");
const { checkIfIExist, checkUserIfExist } = require("../middleware/checkUserIfExist");
const { defaultQuery } = require("../middleware/query");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "x-access-token, Origin, Content-Type, Accept"
        );
        next();
      }
    );
    app.post("/api/image/create", 
    [verifyToken, checkIfIExist],
    controller.create);
    app.get("/api/image", [verifyToken, checkIfIExist, defaultQuery],controller.images)
    app.get("/api/image/shared", [verifyToken, checkIfIExist, defaultQuery], controller.get_images_shared_with_me)
    app.get("/api/image/shared/:username", [verifyToken, checkIfIExist, checkUserIfExist, defaultQuery], controller.get_images_from_authorized_user_by_user)
    app.get("/api/image/:img_id/albums", [verifyToken, checkIfIExist, defaultQuery], controller.get_all_album_of_image)
    app.put("/api/image/:img_id/authorize/add/:username", [verifyToken, checkIfIExist, checkUserIfExist], controller.add_authorized_user)
    app.put("/api/image/:img_id/authorize/remove/:username", [verifyToken, checkIfIExist, checkUserIfExist], controller.remove_authorized_user)
    app.put("/api/image/:img_id/tag/add/:tag", [verifyToken, checkIfIExist], controller.add_tag)
    app.put("/api/image/:img_id/tag/remove/:tag", [verifyToken, checkIfIExist], controller.remove_tag)
    app.get("/api/image/tag/:tag", [verifyToken, checkIfIExist, defaultQuery], controller.get_images_by_tag)
    app.get("/api/image/name/:name", [verifyToken, checkIfIExist, defaultQuery], controller.get_images_by_name)
    app.get("/api/image/date/:date", [verifyToken, checkIfIExist, defaultQuery], controller.get_images_by_create_date)
    app.get("/api/image/last_image", [verifyToken, checkIfIExist], controller.get_last_image_upload)
    app.get("/api/image/:img_id", [verifyToken, checkIfIExist], controller.image)
    app.put("/api/image/:img_id", [verifyToken, checkIfIExist], controller.update)
    app.delete("/api/image/:img_id", [verifyToken, checkIfIExist], controller.delete)
  };  