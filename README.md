# Folfox Network
## Description
Folfox Network is a social networking web application created using Node.js, MongoDB and WebSockets.
Libraries used: Mongoose, Socket.io, ejs templating. Created docker image for the application and deployed it on Digital Ocean droplets. The configuration involved 1 MongoDB server, 2 NodeJS application servers
and 1 load balancer. Used a separate droplet for Rancher to manage the servers and to scale.
https://www.digitalocean.com/community/tutorials/how-to-deploy-a-node-js-and-mongodb-application-with-rancher-on-ubuntu-16-04

## Features
* Signup and Login page.
* Home page where user can post and also see others posts.
* Profile page where user can view/edit his profile, send and accept friend requests.
* User can also chat with his friends.

## Screenshots
Landing Page:
![Landing](/images/landing.png?raw=true)

Home Page:
![Home](/images/home.png?raw=true)

Profile Page:
![Profile](/images/profile.png?raw=true)

Chatting:
![Chat](/images/chat.png?raw=true)

Find friends Page:
![Find_friends](/images/find_friends.png?raw=true)
