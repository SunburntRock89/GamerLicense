// File needs a better name

import { Client, MessageComponentInteraction } from "discord.js";

import Processor from "./processor";
import CommandDataInterface from "../interfaces/commandData";

abstract class ComponentProcessor extends Processor {
	interaction: MessageComponentInteraction;

	constructor(client: Client, interaction: MessageComponentInteraction, commandData: CommandDataInterface) {
		super(client, interaction, commandData);
		this.interaction = interaction;
	}
	abstract run(): void;
}
export default ComponentProcessor;
