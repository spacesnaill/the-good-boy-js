#! /usr/bin/env node
"use strict";
require("dotenv").config();
const Discord = require("discord.js");
const fetch = require("node-fetch");

const botToken = process.env.BOT_TOKEN_DEV;
const client = new Discord.Client();

client.on("ready", () => {
  console.log("Woof!");
});

const commandCharacter = "!";

client.on("message", message => {
  const messageString = message.toString();

  if (message.content.startsWith(commandCharacter)) {
    const messageContent = messageString.slice(1).split(" ");
    const command = messageContent[0];

    switch (command) {
      case "ping":
        message.channel.send("pong");
        break;
      case "avatar":
        if (messageContent.length === 1) {
          message.reply(message.author.avatarURL);
        } else {
          message.reply(getUserAvatarURL(message.mentions.users.first()));
        }
        break;
      case "whereiss":
        getISSlocation(message);
        break;
    }
  }
});

function getUserAvatarURL(user) {
  return user ? user.avatarURL : "User not found";
}

function getISSlocation(message) {
  return fetch("http://api.open-notify.org/iss-now.json")
    .then(response => {
      return response.json();
    })
    .then(json => {
      if (json.message === "success") {
        message.reply(
          `Here is a link to the location of the International Space Station. Woof.
          https://www.google.com/maps/search/?api=1&query=${json.iss_position.latitude},${json.iss_position.longitude}`
        );
      } else {
        message.reply(
          "Sorry, I can't find the International Space Station at the moment. Woof."
        );
      }
    });
}

client.login(botToken);
