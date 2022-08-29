import { Canvas, loadImage } from "skia-canvas";
import { readFile, writeFile } from "fs/promises";
import { EmbedBuilder, User } from "discord.js";
import { randomDate } from "./util";
import JsBarcode from "jsbarcode";

import dayjs from "dayjs";

const formatDate = (date: Date): string => dayjs(date).format("DD/MM/YYYY");

const pfpToImage = async(user: User) => loadImage(Buffer.from(await (await fetch(user.displayAvatarURL({ extension: "png" }))).arrayBuffer()));

interface GeneratedLicense {
	embed: EmbedBuilder,
	png: Buffer,
}

enum PossibleLicenseTypes {
	gamerLicense = "gamerLicense",
	mrMahmoud = "mrMahmoud",
}

const getLicenseData = async(user: User, type: PossibleLicenseTypes): Promise<LicenseDetails> => {
	let licenseData: LicenseDetails;
	try {
		const file = await readFile(`${__dirname}/../../data/${type}/${user.id}.json`);
		licenseData = JSON.parse(file.toString());

		licenseData.renewed = false;
		licenseData.newLicense = false;

		if (new Date(licenseData.expiry) <= new Date()) {
			licenseData.renewed = true;
			throw new Error();
		}
	} catch {
		licenseData = {
			issued: new Date(),
			expiry: randomDate(),
			renewed: true,
			newLicense: true,
		};
	}

	return licenseData;
};

const drawGamerLicense = async(user: User): Promise<GeneratedLicense> => {
	if (user.bot) throw new Error();

	const license = new Canvas(960, 549);
	const licenseTemplate = await loadImage(`${__dirname}/../../src/templates/gamerlicense.png`);
	const ctx = license.getContext("2d");
	ctx.drawImage(licenseTemplate, 0, 0);

	// Add PFP
	ctx.drawImage(await pfpToImage(user), 42, 125, 165, 165);

	ctx.font = "32px Comic Sans MS";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillStyle = "white";

	const licenseData: LicenseDetails = await getLicenseData(user, PossibleLicenseTypes.gamerLicense);

	// Add username
	ctx.fillText(user.username, 300, 137);

	// Add date issued
	ctx.fillText(formatDate(new Date(licenseData.issued)), 384, 175);

	// Exp date
	const expDate = formatDate(new Date(licenseData.expiry));
	ctx.fillText(expDate, 432, 220);

	const out = await license.toBuffer("png");
	const embed = new EmbedBuilder()
		.setColor(0x00FF00)
		.setImage("attachment://gamerlicense.png")
		.setFooter({
			text: "Brought to you by SunburntRock89#7062",
		});

	if (licenseData.newLicense) {
		if (licenseData.renewed) embed.setTitle("License renewed!");
		else embed.setTitle("License issued!");
		await writeFile(`./data/gamerLicense/${user.id}.json`, JSON.stringify(licenseData));
	}

	return {
		embed,
		png: out,
	};
};

const drawMahmoudMembershipCard = async(user: User): Promise<GeneratedLicense> => {
	if (user.bot) throw new Error();

	const license = new Canvas(331, 193);
	const licenseTemplate = await loadImage(`${__dirname}/../../src/templates/mrMahmoudMembership.png`);
	const ctx = license.getContext("2d");
	ctx.drawImage(licenseTemplate, 0, 0);

	const licenseData: LicenseDetails = await getLicenseData(user, PossibleLicenseTypes.mrMahmoud);

	ctx.drawImage(await pfpToImage(user), 5, 2, 100, 100);

	const barcodeRender = new Canvas();
	JsBarcode(barcodeRender, user.id, {
		format: "CODE39",
		background: "white",
		lineColor: "#af0f31",

		displayValue: false,
		// width: 289,
		// height: 24,
		width: 1,
		height: 24,
		margin: 1,
	});

	ctx.drawCanvas(barcodeRender, Math.floor((license.width - barcodeRender.width) / 2), 163);

	ctx.font = "20px Eras ITC";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillStyle = "white";

	// Add username
	ctx.fillText(user.username, 113, 7);

	// Reset the font
	ctx.font = "16px Eras ITC";

	// Add date issued
	ctx.fillText(`Member since ${dayjs(new Date(licenseData.issued)).format("DD.MM.YYYY")}`, 113, 35);

	const out = await license.toBuffer("png");
	const embed = new EmbedBuilder()
		.setColor(0xaf0f31)
		.setImage("attachment://mahmoudmembership.png")
		.setFooter({
			text: "Brought to you by Mr Mahmoud",
		});

	if (licenseData.newLicense) {
		embed.setTitle("Membership card issued!");
		await writeFile(`./data/mrMahmoud/${user.id}.json`, JSON.stringify(licenseData));
	}

	return {
		png: out,
		embed,
	};
};

interface LicenseDetails {
	issued: Date | string,
	expiry: Date | string,
	renewed: boolean,
	newLicense: boolean,
}
export { drawGamerLicense, drawMahmoudMembershipCard };
