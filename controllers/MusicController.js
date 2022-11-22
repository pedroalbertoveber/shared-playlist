const Music = require("../models/Music");
const User = require("../models/User");

module.exports = class MusicController {
  static showAll(req, res) {
    res.render("music/home");
  }

  static async dashboard(req, res) {

    const UserId = req.session.userid;
    
    const user = await User.findOne({
      where: { id: UserId },
      include: Music,
      plain: true,
    });

    const musics = user.Music.map(result => result.dataValues);
    let emptyMusics = false;

    /* check if user doesnt have any music */
    if(musics.length === 0) {
      emptyMusics = true;
    }

    /* check if user exists */
    if(!user) {
      res.redirect("/login");
    }
    res.render("music/dashboard", { musics, emptyMusics })
  }

  static addMusic(req, res) {
    res.render("music/add");
  }

  static async addMusicPost(req, res) {
    const UserId = req.session.userid;
    const { title, owner, genre } = req.body;

    const newMusic = {
      title,
      owner,
      genre,
      UserId,
    };

    try {
      await Music.create(newMusic);

      req.flash("message", "Música adicionada a playlist");
      req.session.save(() => {
        res.redirect("/musics/dashboard");
      });
    } catch(err) {
      console.log("Erro ao executar o programa: ", err);
    }
  }

  static async editMusic(req, res) {
    const id = req.params.id;

    try {
      const music = await Music.findOne({ where: { id: id }, raw: true });
      res.render("music/edit", { music });
    } catch(err) {
      console.log("Ocorreu um erro ao executar o programa: ", err);
    }
  }

  static async editMusicPost(req, res) {

    const id = req.body.id;

    const music = {
      title: req.body.title,
      owner: req.body.owner,
      genre: req.body.genre,
    };

    try {
      await Music.update(music, { where: { id: id }});
      req.flash("message", "Música alterada com sucesso!");
      
      req.session.save(() => {
        res.redirect("/musics/dashboard");
      });

    } catch(err) {
      console.log(err);
    }
  }

  static async deleteMusic(req, res) {
    const id = req.body.id;
    const UserId = req.session.userid;

    try {
      await Music.destroy({ where: { id: id, UserId: UserId  }});
      req.flash("message", "Música removida da playlist");

      req.session.save(() => {
        res.redirect("/musics/dashboard");
      })
    } catch(err) {
      console.log("Erro ao executar o programa: ", err);
    }
  }
};