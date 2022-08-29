/* eslint-disable @typescript-eslint/no-var-requires */
import {
	CommandInteraction,
	MessageComponentInteraction,
	ModalSubmitInteraction,
	Interaction,
	SnowflakeUtil,
	InteractionType,
	ChatInputCommandInteraction,
	ApplicationCommandOptionType,
	Client,
} from "discord.js";
import Commands from "../config/commands";
import Command, { CommandType, SubcommandData } from "../interfaces/commandData";
import Constructable from "../interfaces/constructable";
import Processor from "../internals/processor";
import config from "../config/config";
import { errorEmbed } from "../internals/embeds";

export default async(client: Client, _interaction: Interaction): Promise<void> => {
	const interaction = _interaction as CommandInteraction|MessageComponentInteraction|ModalSubmitInteraction;

	let commandName: string;
	let toRunPath: string;
	let commandData: Command;

	switch (interaction.type) {
		case InteractionType.ApplicationCommand: {
			const typedInteraction = interaction as ChatInputCommandInteraction;

			commandName = typedInteraction.commandName;
			const cmd = Commands.find(c => c.name === commandName);
			if (!cmd) throw new Error();
			commandData = cmd;

			toRunPath = `${__dirname}/../commands`;

			switch (commandData.useType) {
				case CommandType.standard: {
					toRunPath += "/";
					break;
				}
			}

			const subCommand = typedInteraction.options.getSubcommand(false);
			if (subCommand) {
				const subData = commandData.options?.find(o => o.name === subCommand) as SubcommandData | null;
				if (!subData) throw new Error();

				commandName = `${commandName} ${subCommand}`;
			}

			toRunPath += `/${commandName}`;

			break;
		}
		case InteractionType.MessageComponent:
		case InteractionType.ModalSubmit: {
			const typedInteraction = interaction as MessageComponentInteraction|ModalSubmitInteraction;

			if (interaction.type === InteractionType.ModalSubmit && interaction.message?.interaction?.user.id != interaction.user.id) {
				interaction.reply("Wrong user");
				return;
			}

			if (typedInteraction.message && (Date.now() - SnowflakeUtil.timestampFrom(typedInteraction.message.id)) > (2 * 60 * 1000)) {
				interaction.reply({
					content: "Interaction expired",
					ephemeral: true,
				});

				return;
			}

			const split = typedInteraction.customId.split("-");
			if (split.length < 2) {
				interaction.reply({
					embeds: [errorEmbed("An unexpected error has occurred")],
					ephemeral: true,
				});
				console.error(`Message component interaction custom ID not valid.`);
				return;
			}

			commandName = split[0];
			let interactionName: string = split.slice(1, split.length).join("-");

			if (commandName.startsWith("noreg")) return;

			const cmd = Commands.find(c => c.name === commandName);
			if (!cmd) throw new Error();
			commandData = cmd;

			toRunPath = `${__dirname}/../interactions/${commandName}`;

			const subCommand = cmd.options?.find(o => o.type === ApplicationCommandOptionType.Subcommand) as SubcommandData | null;

			if (subCommand) {
				commandName = `${commandName} ${subCommand}`;

				commandName = `${split[0]} ${split[1]}`;
				interactionName = split.slice(2, split.length).join("-");

				toRunPath += `/${split[1]}`;
			}

			toRunPath += `/${interactionName}`;
		}
	}

	commandData = commandData!; // It definitely exists if it got this far

	let processorFile: Constructable<Processor>;
	try {
		if (config.devMode) {
			delete require.cache[require.resolve(toRunPath!)];
		}
		processorFile = require(toRunPath!).default;
		if (!processorFile) throw new Error();
	} catch (e) {
		if (config.devMode) {
			console.error(e);
		}

		console.error(`Cannot process interaction for/from command: ${commandName!}`);
		interaction.reply(":x: Interaction not yet implemented.");
		return;
	}

	const processorClass = new processorFile(client, interaction, commandData);
	try {
		processorClass._run();
	} catch (_err) {
		const err = _err as Error;
		console.error(`Error occurred whilst executing interaction for/from command: ${commandName!}`, err.stack);
		interaction.reply({
			embeds: [errorEmbed("An unexpected error has occurred.")],
		});
	}
};

