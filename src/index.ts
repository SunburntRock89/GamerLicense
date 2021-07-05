import { Client, CommandInteraction, Interaction } from "discord.js";
import { registerFont } from "canvas";

import config from "./config";

const client = new Client({
	intents: [
		"GUILDS",
		"GUILD_MESSAGES",
	],
});

client.on("ready", async() => {
	registerFont("./comic.ttf", { family: "Comic Sans MS" });
	// for (const g of client.guilds.cache.keys()) {
	// 	client.application.commands.set([{
	// 		name: "license",
	// 		description: "Generates or presents your license.",
	// 		defaultPermission: true,
	// 	}], g);
	// }
	client.application.commands.set([{
		name: "license",
		description: "Generates or presents your license.",
		defaultPermission: true,
	}]);
	console.log(`Successfully logged in as ${client.user.tag}`);
});

client.on("interactionCreate", async(interaction: Interaction) => {
	switch (interaction.type) {
		case "APPLICATION_COMMAND": {
			const command = interaction as CommandInteraction;
			try {
				// eslint-disable-next-line @typescript-eslint/no-var-requires
				const cmdFile = require(`./Commands/${command.command.name}`);
				if (cmdFile) cmdFile.default(command);
			} catch {
				console.error(`Unhandled command found! ${command.command.name}`);
			}
			break;
		}
	}
});

// client.on("messageCreate", async(msg: Message) => {
// });

client.login(config.discordToken);

// TODO: Gamer License Test
// TODO: Revoke gamer license when user leaves
