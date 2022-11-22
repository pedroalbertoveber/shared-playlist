module.exports = class MusicController {
  static showAll(req, res) {
    res.render("music/home");
  }
};