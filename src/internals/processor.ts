import { Client, CommandInteraction, InteractionResponse, MessageComponentInteraction, ModalSubmitInteraction } from "discord.js";
import CommandDataInterface from "../interfaces/commandData";
import { errorEmbed } from "./embeds";
type ChannelBasedInteraction = CommandInteraction|MessageComponentInteraction|ModalSubmitInteraction;

abstract class Processor {
	client: Client;
	interaction: ChannelBasedInteraction;
	commandData: CommandDataInterface;

	constructor(client: Client, interaction: ChannelBasedInteraction, commandData: CommandDataInterface) {
		this.client = client;
		this.interaction = interaction;
		this.commandData = commandData;
	}

	checkPermissions(): boolean {
		return true;
	}

	permCheckFail(): Promise<InteractionResponse> {
		return this.interaction.reply({
			ephemeral: true,
			embeds: [{
				color: 0xFF0000,
				title: ":x: No permission!",
				description: "You do not have permission run do this.\nGet someone with the `MANAGE_SERVER` permission to run it for you.",
			}],
		});
	}

	guildOnly(): Promise<InteractionResponse> {
		return this.interaction.reply({
			embeds: [errorEmbed("This command can only be ran in a server!")],
		});
	}

	abstract run(): void;

	async _run(): Promise<void> {
		this.run();
	}
}
export default Processor;
