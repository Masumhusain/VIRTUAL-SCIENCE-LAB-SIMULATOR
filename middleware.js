// middleware/checkAuth.js
module.exports.isLoggedIn = (req , res , next)=> {
   if(!req.isAuthenticated()) {
     req.session.redirectUrl = req.originalUrl;
     req.flash("error", "user must be logged in first");
     res.redirect("/login");
   }else{
    next();
   }
};
