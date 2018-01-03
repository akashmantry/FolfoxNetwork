const User = require("../../database_models/user_model");
const UserStatus = require("../../database_models/user_status_model");
const CommentStatus = require("../../database_models/comment_model");

module.exports.register = function(plugin, options, next){
  plugin.route([
    {
      method: "GET",
      path: "/home",
      config: {
        auth: "simple-cookie-strategy",
        handler: function(request, reply){
          var name = request.auth.credentials.name;
          var user_statuses;
          User.findOne({"email": request.auth.credentials.user}, function(err, user){
            UserStatus.find({}, function(err, statuses){
              user_statuses = statuses;
              reply.view("home", {user: user, name: name, user_statuses: user_statuses, display_nav_bar: true});
            }).sort('-status_date')
          });
        }
      }
    },
    {
      method: "POST",
      path: "/user_status/create",
      config: {
        auth: "simple-cookie-strategy",
        handler: function(request, reply){
          User.findOne({"email": request.auth.credentials.user}, function(err, user){
            var user_status = new UserStatus({"user_email": request.auth.credentials.user,
                                              "user_status": request.payload.user_status,
                                              "name": request.auth.credentials.name,
                                              "profile_pic": user.user_profile.profile_pic,
                                              "member_id": user.member_id
                                            });
            user_status.save(function(err, result){
              if(err){
                reply("Error while saving status").code(400);
              }else{
                reply(result);
              }
            });
          });
        }
      }
    },
    {
      method: "POST",
      path: "/user_status/like",
      config: {
        auth: "simple-cookie-strategy",
        handler: function(request, reply){
          UserStatus.findOne({"status_id": request.payload.id}, function(err, status){
            if (err) { return next(err); }
            status.likes += 1;
            status.save(function(err) {
              if (err) { reply("Error while updating likes").code(400); }
              else{
                reply();
              }
            });
          });
        }
      }
    },
    {
      method: "POST",
      path: "/user_status/comment",
      config: {
        auth: "simple-cookie-strategy",
        handler: function(request, reply){
          User.find({"email": request.auth.credentials.user}, function(err, commenting_user){
            UserStatus.find({"status_id": request.payload.id}, function(err, post){
              var comment = {"comment_email": commenting_user[0].email,
                              "comment_status": request.payload.user_status,
                              "comment_name": request.auth.credentials.name,
                              "comment_profile_pic": commenting_user[0].user_profile.profile_pic,
                              "status_id": request.payload.id,
                              "member_id": commenting_user[0].member_id
                            };
              post[0].update({$push: {"comments": comment}}, function(err, result){
                              if (err)
                                return console.error(err);
                              else
                                reply(comment);
                            });
              });
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
