import { CommandInteraction, MessageEmbed } from "discord.js";
import { Canvas, loadImage } from "skia-canvas";
import { get } from "chainfetch";
import { readFile, writeFile } from "fs/promises";

const randomDate = (): Date => {
	const start = new Date();
	const end = new Date(2100, 0, 1);
	return new Date(start.getTime() + (Math.random() * (end.getTime() - start.getTime())));
};

const formatDate = (date: Date): string => {
	const day = date.getDate();
	const month = date.getMonth() + 1;
	const year = date.getFullYear();

	let readableDay = day.toString();
	if (day < 10) readableDay = `0${day}`;

	let readableMonth = month.toString();
	if (month < 10) readableMonth = `0${month}`;

	return `${readableDay}/${readableMonth}/${year}`;
};

interface LicenseDetails {
	issued: Date | string,
	expiry: Date | string,
}

export default async(command: CommandInteraction): Promise<void> => {
	try {
		const license = new Canvas(960, 549);
		const licenseTemplate = await loadImage("./GamerLicense.png");
		const ctx = license.getContext("2d");
		ctx.drawImage(licenseTemplate, 0, 0);

		const pfpRes = await get(command.user.avatarURL({ format: "png" })).toBuffer();
		const pfpImage = await loadImage(pfpRes.body);

		// Add PFP
		ctx.drawImage(pfpImage, 42, 125, 165, 165);

		ctx.font = "32px Comic Sans MS";
		ctx.textAlign = "left";
		ctx.textBaseline = "top";
		ctx.fillStyle = "white";

		let licenseData: LicenseDetails, newLicense = false, renewedLicense = false;
		try {
			const file = await readFile(`./Data/${command.user.id}.json`);
			licenseData = JSON.parse(file.toString());

			if (new Date(licenseData.expiry) <= new Date()) {
				renewedLicense = true;
				throw new Error();
			}
		} catch {
			licenseData = {
				issued: new Date(),
				expiry: randomDate(),
			};
			newLicense = true;
		}

		// Add username
		ctx.fillText(command.user.username, 300, 137);

		// Add date issued
		ctx.fillText(formatDate(new Date(licenseData.issued)), 384, 175);

		// Exp date
		const expDate = formatDate(new Date(licenseData.expiry));
		ctx.fillText(expDate, 432, 220);

		const out = await license.toBuffer("image/png");
		const embed = new MessageEmbed()
			.setColor(0x00FF00)
			.setImage("attachment://gamerlicense.png")
			.setFooter("Brought to you by SunburntRock89#7062");

		if (newLicense) {
			if (renewedLicense) embed.setTitle("License renewed!");
			else embed.setTitle("License issued!");
			await writeFile(`./Data/${command.user.id}.json`, JSON.stringify(licenseData));
		}

		command.reply({
			embeds: [embed],
			files: [{ attachment: out,
				name: "gamerlicense.png",
			}],
		});
	} catch (e) {
		console.error(e);
		command.reply({
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
};
