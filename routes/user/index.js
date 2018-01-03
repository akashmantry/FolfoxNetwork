const User = require("../../database_models/user_model");

module.exports.register = function(server, options, next){
  server.route([
    {
      method: "POST",
      path: "/sign_up",
      handler: function(request, reply){
        User.findOne({"email": request.payload.email}, function(err, exiting_user){
          if(exiting_user){
            reply("This email has already been registered. Try another one!").code(400);
          }else{
            var user = new User({"email": request.payload.email,
             "name": request.payload.name,
             "password": request.payload.password});
            user.save(function(err, saved_user_record){
              if(err){
                reply("Error signing up.").code(400);
              }else{
                request.cookieAuth.set({"user": saved_user_record.email, "member_id": saved_user_record.member_id,
                  "name": saved_user_record.name});
                reply("Successfully signed up");
              }
            });
          }
        });
      }
    },
    {
      method: "POST",
      path: "/login",
      handler: function(request, reply){
        User.findOne({"email": request.payload.email, "password": request.payload.password}, function(err, valid_user){
          if(valid_user){
            request.cookieAuth.set({"user": valid_user.email, "member_id": valid_user.member_id,
              "name": valid_user.name});
            reply();
          }else{
            reply("Error logging in.").code(400);
          }
        });
      }
    },
    {
      method: "POST",
      path: "/logout",
      handler: function(request, reply){
        request.cookieAuth.clear();
        reply();
      }
    }
  ]);

  next();
};

module.exports.register.attributes = {
  pkg: require("./package.json")
};
