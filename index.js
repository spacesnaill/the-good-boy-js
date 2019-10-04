#! /usr/bin/env node
"use strict";
require("dotenv").config();
const Discord = require("discord.js");
const fetch = require("node-fetch");

const commandCharacter = "?";
const commands = [
  { usage: `\`${commandCharacter}ping\``, description: "responds with pong" },
  {
    usage: `\`${commandCharacter}avatar @user\``,
    description:
      "return the image link of the specified user's avatar. Leave blank for your own avatar"
  },
  {
    usage: `\`${commandCharacter}whereiss\``,
    description:
      "returns a link to the International Space Station's location via google maps and its longitude and latitude"
  },
  {
    usage: `\`${commandCharacter}apod\``,
    description:
      "returns NASA's Astronomy Picture of the Day for today, along with its title and explanation."
  }
];

const botToken = process.env.BOT_TOKEN_DEV;
const nasaAPI = process.env.NASA_API_KEY;
const client = new Discord.Client();

client.on("ready", () => {
  console.log("Woof!");
});

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
      case "help":
        commands.forEach(command => {
          message.channel.send(`
          **Command:** ${command.usage}\n**Description:** ${command.description}\n---
          `);
        });
        break;
      case "apod":
        getAstronomyPictureOfTheDay(message);
        break;
      default:
        message.reply(
          `Not sure what to do? Try \`${commandCharacter}help\` for a list of commands. Woof`
        );
        break;
    }
  }
});

function getUserAvatarURL(user) {
  return user ? user.avatarURL : "User not found";
}

function getISSlocation(message) {
  fetch("http://api.open-notify.org/iss-now.json")
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

function getAstronomyPictureOfTheDay(message) {
  fetch(`https://api.nasa.gov/planetary/apod?api_key=${nasaAPI}`)
    .then(response => {
      return response.json();
    })
    .then(json => {
      message.reply(
        `${json.url}\n**Title:** ${json.title}\n**Explanation:** ${json.explanation}`
      );
    });
}

client.login(botToken);
