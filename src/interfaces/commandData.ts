/* eslint-disable no-unused-vars */
import { ApplicationCommandOptionData, ApplicationCommandSubCommandData, ChatInputApplicationCommandData } from "discord.js";

enum CommandType {
	standard,
}

interface SubcommandData extends ApplicationCommandSubCommandData {
	useType: CommandType;
}

type CommandOptions = ApplicationCommandOptionData | SubcommandData;

interface CommandData extends ChatInputApplicationCommandData {
	options?: CommandOptions[],

	guildOnly?: boolean;
	numberRequired?: boolean;
	accountRequired?: boolean;

	useType: CommandType;

	notExecutableInCall?: boolean;
}
export default CommandData;
export { CommandType, SubcommandData };

