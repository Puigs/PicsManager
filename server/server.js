const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(bodyParser.json({limit: '20mb'}));
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// simple route

const db = require("./src/models");
const { album } = require("./src/models");
const Role = db.role;
const User = db.user;
const Image = db.image;
const Album = db.album;

// const Liaison = db.liaison;
db.sequelize.sync({force: true}).then(() => {
  console.log('Drop and Resync Db');
  initial();
});


require("./src/routes/auth.routes")(app);
require("./src/routes/user.routes")(app);
require("./src/routes/image.routes")(app);
require("./src/routes/album.routes")(app);
app.get("/", (req, res) => {
  res.json({ message: "Welcome to PicManager application." });
});
// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.create({
    id: 1,
    name: "user"
  });
  
  Role.create({
    id: 2,
    name: "admin"
  });


  User.create({
    username: "admin",
    password: "admin",
  })

  User.create({
    username: "user",
    password: "user",
  })

  User.create({
    username: "user2",
    password: "user2",
  })

  // Image.create({
  //   name: "plage_du_trou.png",
  //   description: "Image_1",
  //   data: "Une image de test",
  //   create_at: new Date(),
  //   updated_at: new Date(),
  //   user_id: 1,
  //   tags: ["tag1", "tag2"],
  //   authorized_user: ["user2"],
  //   album_id : [1]
  // })

  // Image.create({
  //   name: "agenial.png",
  //   description: "Image_1",
  //   data: "Une image de test",
  //   create_at: new Date(),
  //   updated_at: new Date(),
  //   user_id: 1,
  //   tags: ["tag1", "tag2"],
  //   authorized_user: ["user2"],
  //   album_id : [1]
  // })

  // Image.create({
  //   name: "andad.png",
  //   description: "Image_1",
  //   data: "Une image de test",
  //   create_at: new Date(),
  //   updated_at: new Date(),
  //   user_id: 1,
  //   tags: ["tag1", "tag2"],
  //   authorized_user: ["user2"],
  //   album_id : [1]
  // })

  // Image.create({
  //   name: "montagne_18.png",
  //   description: "Image_2",
  //   data: "Une image de test",
  //   create_at: new Date(),
  //   updated_at: new Date(),
  //   user_id: 3,
  //   tags: ["tag1", "tag2"],
  //   authorized_user: [],
  //   album_id : [1]
  // })

  // Image.create({
  //   name: "Image_3.png",
  //   description: "Image_3",
  //   data: "Une image de test",
  //   create_at: new Date(),
  //   updated_at: new Date(),
  //   user_id: 3,
  //   tags: ["tag1", "tag2"],
  //   authorized_user: ["admin", "user2"],
  //   album_id : [1]
  // })

  // Album.create({
  //   name: "album_1",
  //   description: "album_1",
  //   create_at: new Date(),
  //   updated_at: new Date(),
  //   user_id: 1,
  //   tags: ["tag1", "tag2"],
  //   authorized_user: [],
  //   image_id: [1]
  // })

  // Album.create({
  //   name: "album_1",
  //   description: "album_1",
  //   create_at: new Date(),
  //   updated_at: new Date(),
  //   user_id: 1,
  //   tags: ["tag1", "tag2"],
  //   authorized_user: [],
  //   image_id: [1]
  // })

  // Album.create({
  //   name: "album_1",
  //   description: "album_1",
  //   create_at: new Date(),
  //   updated_at: new Date(),
  //   user_id: 3,
  //   tags: ["tag1", "tag2"],
  //   authorized_user: ["admin"],
  //   image_id: [1]
  // })

  // Album.create({
  //   name: "album_1",
  //   description: "album_1",
  //   create_at: new Date(),
  //   updated_at: new Date(),
  //   user_id: 3,
  //   tags: ["tag1", "tag2"],
  //   authorized_user: ["admin"],
  //   image_id: [1]
  // })

  // Liaison.create({
  //   album_id: 1,
  //   user_id: 1
  // })
}