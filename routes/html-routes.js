// Requiring path to so we can use relative routes to our HTML files
var path = require("path");
const db = require("../models")
// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function (app) {

  // event feed
  app.get("/events", function (req, res) {
    db.Event.findAll({}).then(function (data) {
      console.log(data)
      res.render("event-feed", { events: data })
    })
  })

  //can delete lines 19-21 bc they're already being hosted by express
  // create event html
  app.get("/create-event.html", function (req, res) {
    res.sendFile(path.join(__dirname, "../views/create-event.html"))
  });



  app.get("/", function (req, res) {
    // If the user already has an account send them to the members page; this can be a little simpler by using res.redirect-- check back w Anthony about this
    if (req.user) {
      res.redirect("/members");
    }
    res.sendFile(path.join(__dirname, "../public/signup.html"));
  });

  app.get("/login", function (req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/members");
    }
    res.sendFile(path.join(__dirname, "../public/login.html"));
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/members", isAuthenticated, function (req, res) {
    res.sendFile(path.join(__dirname, "../public/members.html"));
  });

}

// to the event feed
/* app.get ("/event", isAuthenticated, function (req,res){
  res.render("event-feed",) // need an object to pass through here after the comma
});

// eventually render handlebars files. */

