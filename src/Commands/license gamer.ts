import { CommandInteraction } from "discord.js";
import CommandProcessor from "../internals/commandProcessor";
import { drawGamerLicense } from "../internals/generators";

export default class LicenseGamer extends CommandProcessor {
	async run(): Promise<void> {
		await this.interaction.deferReply();

		const user = this.interaction.options.getUser("user", false) || this.interaction.user;
		if (user.bot) {
			this.interaction.editReply({
				embeds: [{
					color: 0xFFFF00,
					title: "⚠️ User unlicensed!",
					description: "Robots need not apply.",
				}],
			});
			return;
		}

		try {
			const license = await drawGamerLicense(user);

			this.interaction.editReply({
				embeds: [license.embed],
				files: [{ attachment: license.png,
					name: "gamerlicense.png",
				}],
			});
		} catch (e) {
			console.error(e);
			this.interaction.editReply({
				embeds: [{
					color: 0xFF0000,
					title: ":x: Uh oh!",
					description: "Your license was declined!",
					footer: {
						text: "The bot encountered an unexpected error. Please contact SunburntRock89#7062",
					},
				}],
			});
		}
	}
}
