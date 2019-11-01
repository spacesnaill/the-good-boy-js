#! /usr/bin/env node
"use strict";
import Discord from "discord.js";

import * as dotenv from "dotenv";
import fetch from "node-fetch";

import ICommand from "./types/ICommand";

dotenv.config();
const commandCharacter = "?";
const commands: ICommand[] = [
  { usage: `\`${commandCharacter}ping\``, description: "responds with pong" },
  {
    usage: `\`${commandCharacter}avatar @user\``,
    description:
      "return the image link of the specified user's avatar. Leave blank for your own avatar",
  },
  {
    usage: `\`${commandCharacter}whereiss\``,
    description:
      "returns a link to the International Space Station's location via google maps and its longitude and latitude",
  },
  {
    usage: `\`${commandCharacter}apod\``,
    description:
      "returns NASA's Astronomy Picture of the Day for today, along with its title and explanation.",
  },
  {
    usage: `\`${commandCharacter}dog\``,
    description: "returns a random picture of a doggo.",
  },
  {
    usage: `\`${commandCharacter}jesus\``,
    description: "returns a random picture of Jesus.",
  },
  {
    usage: `\`${commandCharacter}corporatebs\``,
    description: "returns some corporate nonsense.",
  },
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
        getHelp(message, commands);
        break;
      case "apod":
        getAstronomyPictureOfTheDay(message);
        break;
      case "dog":
        getRandomDoggo(message);
        break;
      case "jesus":
        getJesus(message);
        break;
      case "corporatebs":
        getCorporateBS(message);
        break;
      default:
        message.reply(
          `Not sure what to do? Try \`${commandCharacter}help\` for a list of commands. Woof`
        );
        break;
    }
  }
});

function getUserAvatarURL(user: Discord.User) {
  return user ? user.avatarURL : "User not found";
}

function getISSlocation(message: Discord.Message) {
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

function getAstronomyPictureOfTheDay(message: Discord.Message) {
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

function getRandomDoggo(message: Discord.Message) {
  fetch(`https://dog.ceo/api/breeds/image/random`)
    .then(response => {
      return response.json();
    })
    .then(json => {
      if (json.status === "success") {
        message.reply(json.message);
      } else {
        message.reply("I couldn't find any other doggos. Woof.");
      }
    });
}

function getJesus(message: Discord.Message) {
  fetch("https://jesusapi.000webhostapp.com/api")
    .then(response => {
      return response.json();
    })
    .then(json => {
      message.reply(json.link);
    });
}

function getCorporateBS(message: Discord.Message) {
  fetch("https://corporatebs-generator.sameerkumar.website/")
    .then(response => {
      return response.json();
    })
    .then(json => {
      message.reply(`${json.phrase}. Woof.`);
    });
}

function getHelp(message: Discord.Message, commandList: ICommand[]) {
  const helpOutput = [`\n`];
  commandList.forEach(command => {
    const commandToString = `${command.usage} \n ${command.description}`;
    if (helpOutput[helpOutput.length - 1].length > 2000) {
      helpOutput.push(`${commandToString} \n --- \n`);
    } else {
      helpOutput[helpOutput.length - 1] = helpOutput[
        helpOutput.length - 1
      ].concat(`${commandToString} \n --- \n`);
    }
  });
  helpOutput.forEach(helpMessage => {
    message.reply(helpMessage);
  });
}

client.login(botToken);
