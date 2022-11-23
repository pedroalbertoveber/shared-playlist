/* external modules */
const express = require("express");
const router = express.Router();

const checkAuth = require("../helpers/auth").checkAuth;
const MusicController = require("../controllers/MusicController");

router.get("/dashboard", checkAuth, MusicController.dashboard);
router.get("/add", checkAuth, MusicController.addMusic);
router.get("/edit/:id", checkAuth, MusicController.editMusic);
router.post("/edit", checkAuth, MusicController.editMusicPost);
router.post("/add", checkAuth, MusicController.addMusicPost);
router.post("/delete", checkAuth, MusicController.deleteMusic);
router.get("/", checkAuth, MusicController.showAll);

module.exports = router;