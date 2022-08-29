import CommandProcessor from "../internals/commandProcessor";
import { drawMahmoudMembershipCard } from "../internals/generators";

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
			const license = await drawMahmoudMembershipCard(user);

			this.interaction.editReply({
				embeds: [license.embed],
				files: [{ attachment: license.png,
					name: "mahmoudmembership.png",
				}],
			});
		} catch (e) {
			console.error(e);
			this.interaction.editReply({
				embeds: [{
					color: 0xFF0000,
					title: ":x: Uh oh!",
					description: "Your Mr Mahmoud Membership was declined!",
					footer: {
						text: "The bot encountered an unexpected error. Please contact SunburntRock89#7062",
					},
				}],
			});
		}
	}
}
