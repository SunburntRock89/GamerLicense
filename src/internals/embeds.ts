import { APIEmbed, EmbedBuilder } from "discord.js";

const errorEmbed = (description: string, options?: APIEmbed): EmbedBuilder => EmbedBuilder
	.from(options || {})
	.setColor(0xFF0000)
	.setTitle("❌ Error!")
	.setDescription(description);

export { errorEmbed };
