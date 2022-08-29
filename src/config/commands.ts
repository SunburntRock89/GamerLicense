import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";
import Command, { CommandType } from "../interfaces/commandData";

const commands: Command[] = [{
	name: "license",
	description: "Generates or presents your license.",
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: "gamer",
		description: "Get a gamer license",
		type: ApplicationCommandOptionType.Subcommand,

		options: [{
			name: "user",
			description: "A specific user to find a license for",
			type: ApplicationCommandOptionType.User,
			required: false,
		}],
	}, {
		name: "mahmoud",
		description: "Get a mahmoud membership card",
		type: ApplicationCommandOptionType.Subcommand,

		options: [{
			name: "user",
			description: "A specific user to find a license for",
			type: ApplicationCommandOptionType.User,
			required: false,
		}],
	}],

	useType: CommandType.standard,
}];

export default commands;