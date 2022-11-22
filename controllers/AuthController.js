/* external modules */
const User = require("../models/User");
const bcrypt = require("bcryptjs");

module.exports = class AuthController {

  static login(req, res) {
    res.render("auth/login");
  }

  static async loginPost(req, res) {
    const { email, password } = req.body;
     
    /* find user */
    const user = await User.findOne({ where: { email: email }});

    if(!user) {
      req.flash("message", "Este e-mail não está cadastrado no sistema.");
      res.render("auth/login");
      return;
    }

    /* check if passwords match */
    const passwordMatch = bcrypt.compareSync(password, user.password);

    if(!passwordMatch) {
      req.flash("message", "Senha inválida. Tente novamente.");
      res.render("auth/login");
      return;
    }

    /* initialized session */

    req.session.userid = user.id;

    req.flash("message", "Autenticação realizada com sucesso");
    req.session.save(() => {
      res.redirect("/");
    });
    
    return;
  }

  static register(req, res) {
    res.render("auth/register");
  }

  static async registerPost(req, res) {

    const { 
      name, 
      email, 
      password, 
      confirmpassword 
    } = req.body;
    
    /* password match validation */
    if (password !== confirmpassword) {
      req.flash("message", "As senhas não são iguais. Tente novamente.");
      res.render("auth/register");
      return;
    }

    /* check if users exists */
    const userExists = await User.findOne({ where: { email: email }});
    if(userExists) {
      req.flash("message", "Este e-mail já está cadastrado em sistema.")
      res.render("auth/register");
      return;
    }

    /* creating a password */
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = {
      name,
      email,
      password: hashedPassword,
    };

    try {
      const newUser =  await User.create(user);

      /* initilize session */
      req.session.userid = newUser.id;
      req.flash("message","Cadastro realizado com sucesso!");

      req.session.save(() => {
        res.redirect("/");
      });

    } catch(err) {
      console.log("Não foi possível criar o usuário: ", err);
    }
  }

  static logout(req, res) {
    req.session.destroy();
    res.redirect("/login");
  }
};