const Jimp = require("jimp");
const { Client, MessageEmbed, MessageAttachment } = require("discord.js");
const config = require("./config.js")

const client = new Client();

let comicSans;

client.on("ready", async() => {
	comicSans = await Jimp.loadFont("./comicsansbold.fnt")
	console.log(`Successfully logged in as ${client.user.tag}`)
});

const randomDate = () => {
	let start = new Date();
	let end = new Date(2100, 0, 1);
	return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}


client.on("message", async msg => {
	if (msg.mentions?.users?.first()?.id !== client.user.id) return;
	try {		
		const licenseTemplate = await Jimp.read("./GamerLicense.png")
		const userPFP = await Jimp.read(msg.author.avatarURL({ format: "png" }));
	
		userPFP.resize(165, 165)
	
		// Add PFP
		licenseTemplate.composite(userPFP, 42, 125);
		// Add username
		licenseTemplate.print(comicSans, 300, 137, {
			text: msg.author.username,
			alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
			alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
		});
		let date = new Date();
		const day = date.getDate();
		const month = date.getMonth() + 1;
		const year = date.getFullYear();
		if (day < 10) day = `0${day}`;
		if (month < 10) month = `0${month}`;
		if (year < 10) year = `0${year}`;
		const dateString = `${day}/${month}/${year}`;
		// Add date issued
		licenseTemplate.print(comicSans, 384, 175, {
			text: dateString,
			alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
			alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
		})
		// Exp date
		const expDate = randomDate();
		let expDay = expDate.getDate();
		let expMonth = expDate.getMonth() + 1;
		let expYear = expDate.getFullYear();
		if (expDay < 10) expDay = `0${expDay}`;
		if (expMonth < 10) expMonth = `0${expMonth}`;
		if (expYear < 10) expYear = `0${expYear}`;
		const expDateString = `${expDay}/${expMonth}/${expYear}`;
		licenseTemplate.print(comicSans, 432, 220, {
			text: expDateString,
			alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
			alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
		})

		let out = await licenseTemplate.getBufferAsync("image/png");
		const embed = new MessageEmbed()
			.setTitle("License issued!")
			.setColor(0x00FF00)
			.attachFiles([new MessageAttachment(out, "gamerlicense.png")])
			.setImage("attachment://gamerlicense.png")
			.setFooter("Brought to you by SunburntRock89#7062")
		msg.channel.send(embed)
	
		delete licenseTemplate;
		delete userPFP;
	} catch (e) {
		console.error(e)
		return msg.channel.send({
			embed: {
				color: 0xFF0000,
				title: ":x: Uh oh!",
				description: "Your license was declined!",
				footer: {
					text: "The bot encountered an unexpected error. Please contact SunburntRock89#7062"
				}
			}
		})
	}
});

client.login(config.discordToken);

// TODO: Gamer License Test
// TODO: Revoke gamer license when user leaves
