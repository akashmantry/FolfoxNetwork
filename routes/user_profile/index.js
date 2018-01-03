const User = require("../../database_models/user_model");
const shortid = require("shortid");
const fs = require("fs");
const UserStatus = require("../../database_models/user_status_model");

module.exports.register = function(plugin, options, next){
  plugin.route([
    {
      method: "GET",
      path: "/user_profile",
      config: {
        auth: "simple-cookie-strategy",
        handler: function(request, reply){
          User.findOne({"email": request.auth.credentials.user}, function(err, user){
            reply.view("user_profile", {user:user, display_nav_bar: true});
          })
        }
      }
    },
    {
      method: "POST",
      path: "/user_profile/edit",
      config: {
        auth: "simple-cookie-strategy",
        handler: function(request, reply){
          User.findOne({"email": request.auth.credentials.user}, function(err, user){
            user.name = request.payload.name;
            user.user_profile.location = request.payload.location;
            user.user_profile.description = request.payload.description;
            user.user_profile.interests = request.payload.interests;
            user.save(function(err){
              if(err){
                reply("Error while saving profile").code(400);
              }else{
                reply();
              }
            });
          })
        }
      }
    },
    {
      method: "POST",
      path: "/profile_pic/upload",
      config: {
        auth: "simple-cookie-strategy",
        handler: function(request, reply){

            var user_profile_image = "user_" + request.auth.credentials.member_id + "_" + shortid.generate() + "."
             + request.payload.image_type;
            fs.writeFile("user_profile_images/" + user_profile_image, new Buffer(request.payload.image_data, "base64"),
              function(err){
                if(!err){
                  User.findOne({"email": request.auth.credentials.user}, function(err, user){
                    user.user_profile.profile_pic=user_profile_image;
                    user.save(function(err){
                      if(err){
                        reply("Error while saving profile").code(400);
                      }else{
                        UserStatus.update({"user_email":request.auth.credentials.user},
                                          {"profile_pic":user_profile_image}, function(err, result){
                                            reply(user_profile_image);
                                          });
                      }
                    })
                  });

                }
              });
        }
      }
    },
    {
      method: "GET",
      path: "/user_profile/{member_id}",
      config: {
        auth: "simple-cookie-strategy",
        handler: function(request, reply){
          User.findOne({"member_id": request.params.member_id}, function(err, visiting_friend){
            reply.view("user_profile_visit", {user: visiting_friend, display_nav_bar: true});
          });
        }
      }
    }
  ])

  next();
}

module.exports.register.attributes = {
  pkg: require("./package.json")
};
