const Hapi = require("hapi");
const server = new Hapi.Server();
const mongoose = require("mongoose");
const User = require("./database_models/user_model");
const node_connect_db = mongoose.connect(process.env.MONGO_HOST + '/api');//"mongodb://localhost/folfox_network");
const moment = require('moment');
moment().format();

// Loads environment variables
// Used only in development
require('dotenv').config({silent: true});

//server.connection({port:3000});
server.connection({ port: process.env.PORT || 3000 });
const io = require("socket.io")(server.listener);

server.start(console.log("Server started"));

server.route({
  method : "GET",
  path : "/",
  handler : function(request, reply){
    reply.view("landing", {display_nav_bar: false});
  }
});

server.register(require("vision"), function(err){
  server.views({
    engines : {
      ejs : require("ejs")
    },
    relativeTo : __dirname,
    path : "views"
  })
});

server.register(require("inert"), function(err){

});

server.register(require("hapi-auth-cookie"));

server.auth.strategy("simple-cookie-strategy", "cookie",{
  cookie: "folfox_network_cookie",
  password: "abcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdef",
  isSecure: false
});


server.route({
  method : "GET",
  path : "/{param*}",
  handler : {
    directory : {
      path : "public"
    }
  }
});

server.route({
  method : "GET",
  path : "/user_profile_images/{param*}",
  handler : {
    directory : {
      path : "user_profile_images"
    }
  }
});

server.register({
  register: require("./routes/user")
}, function(err){
    if(err){
      return;
    }
});

server.register({
  register: require("./routes/home")
}, function(err){
    if(err){
      return;
    }
});

server.register({
  register: require("./routes/user_profile")
}, function(err){
    if(err){
      return;
    }
});

server.register({
  register: require("./routes/friends")
}, function(err){
    if(err){
      return;
    }
});

io.on("connection", function(socket){
  socket.on("attach_user_info", function(user_info){
    socket.member_id = user_info.member_id;
    socket.user_name = user_info.user_name;
  })

  socket.on("message_from_client", function(user_message){
    var all_connected_clients = io.sockets.connected;
    for(var socket_id in all_connected_clients){
      if(all_connected_clients[socket_id].member_id === user_message.friend_member_id){
        var message_object = {"message": user_message.message, "user_name": socket.user_name};
        all_connected_clients[socket_id].emit("message_from_server", message_object);
        break;
      }
    }
  })
});
