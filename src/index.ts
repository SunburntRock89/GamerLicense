import { Client } from "discord.js";
import { FontLibrary } from "skia-canvas";
import InteractionCreateEvent from "./events/interactionCreate";

import config from "./config/config";
import commands from "./config/commands";

const client = new Client<true>({
	intents: [
		"Guilds",
	],
});

client.on("ready", async() => {
	FontLibrary.use(["./comic.ttf", "./erasbd.ttf"]);

	client.application!.commands.set(commands);

	console.log(`Successfully logged in as ${client.user.tag}`);
});

client.on("interactionCreate", interaction => InteractionCreateEvent(client, interaction));

client.login(config.discordToken);

