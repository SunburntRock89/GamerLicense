// This deviates so far from Novus FM that this may as well be classified as new code
import { ChatInputCommandInteraction, Client } from "discord.js";
import config from "../config/config";
import CommandDataInterface from "../interfaces/commandData";
import Processor from "./processor";

abstract class CommandProcessor extends Processor {
	commandData: CommandDataInterface;
	interaction: ChatInputCommandInteraction;

	constructor(client: Client, interaction: ChatInputCommandInteraction, commandData: CommandDataInterface) {
		super(client, interaction, commandData);
		this.interaction = interaction;
		this.commandData = commandData;
	}

	async _run(): Promise<void> {
		// Maybe this should be moved into the event handler?
		if (this.interaction.guild && (!this.checkPermissions() && !config.maintainers.includes(this.interaction.user.id))) {
			await this.permCheckFail();
			return;
		} else if (this.commandData.guildOnly && !this.interaction.guild) {
			await this.guildOnly();
			return;
		}

		await super._run();
	}
}
export default CommandProcessor;
