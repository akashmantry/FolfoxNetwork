const User = require("../../database_models/user_model");

module.exports.register = function(plugin, options, next){
  plugin.route([
    {
      method: "GET",
      path: "/friends",
      config: {
        auth: "simple-cookie-strategy",
        handler: function(request, reply){
          User.find({"email": {$ne: request.auth.credentials.user}}, function(err, users){
            reply.view("friends", {user_friends:users, display_nav_bar:true});
          });
        }
      }
    },
    {
      method: "POST",
      path: "/friend_request",
      config: {
        auth: "simple-cookie-strategy",
        handler: function(request, reply){
          User.find({"email": request.auth.credentials.user}, function(err, sending_user){
            User.find({"member_id": request.payload.friend_member_id}, function(err, potential_friend){
              potential_friend[0].update({$push: {"friend_requests": {"member_id": sending_user[0].member_id,
                                                                      "friend_name": sending_user[0].name,
                                                                      "profile_pic": sending_user[0].user_profile.profile_pic,
                                                                      "location": sending_user[0].user_profile.location
                                                                    }}}, function(err){});
              reply();
            });
          });
        }
      }
    },
    {
      method: "POST",
      path: "/accept_friend_request",
      config: {
        auth: "simple-cookie-strategy",
        handler: function(request, reply){
          User.find({"email": request.auth.credentials.user}, function(err, user){
            User.find({"member_id": request.payload.member_id}, function(err, accepted_friend){
              var found = false;
              for(friend in user.friends){
                if(accepted_friend[0].member_id === friend.member_id){
                  found = true;
                }
              }
              if(found === false){
                user[0].update({$push: {"friends": {"member_id": accepted_friend[0].member_id,
                                                    "friend_name": accepted_friend[0].name,
                                                    "profile_pic": accepted_friend[0].user_profile.profile_pic,
                                                    "location": accepted_friend[0].user_profile.location}},
                              $pull: {"friend_requests": {member_id: request.payload.member_id}}},
                              function(err){});
                accepted_friend[0].update({$push: {"friends": {"member_id": user[0].member_id,
                                                   "friend_name": user[0].name,
                                                   "profile_pic": user[0].user_profile.profile_pic,
                                                   "location": user[0].user_profile.location}}},
                              function(err){});
                reply();
              }else{
                console.log("User already exists");
              }
            });
          });
        }
      }
    }
  ])
  next();
};

module.exports.register.attributes = {
  pkg: require("./package.json")
};
