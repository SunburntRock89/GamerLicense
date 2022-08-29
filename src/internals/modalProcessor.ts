import { Client, ModalSubmitInteraction } from "discord.js";
import Processor from "./processor";
import CommandDataInterface from "../interfaces/commandData";

abstract class ModalProcessor extends Processor {
	interaction: ModalSubmitInteraction;

	constructor(client: Client, interaction: ModalSubmitInteraction, commandData: CommandDataInterface) {
		super(client, interaction, commandData);
		this.interaction = interaction;
	}
	abstract run(): void;
}
export default ModalProcessor;
