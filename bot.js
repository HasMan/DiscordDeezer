const Discord = require("discord.js")
var Deezer = require('deezer-node-api');
var dz = new Deezer();
const bot = new Discord.Client()
const config = require('./config.json');
const prefixes = {}
const prefix = config.prefix
var silenced = {}

bot.on("ready", () => {
    console.log("Ready!");
    bot.user.setPresence({ game: { name: config.status, type: 0 } })
});

bot.on("message", msg => {
    if (!msg.guild) { return }
    if (msg.content.startsWith(prefix) && !prefixes[msg.guild.id]) { prefixes[msg.guild.id] = prefix }
    if (silenced[msg.author.id] && silenced[msg.author.id].type == "user" && silenced[msg.author.id].active) { return; }
    if (silenced[msg.guild.id] && silenced[msg.guild.id].type == "guild" && silenced[msg.guild.id].active) { return; }
    if (!msg.content.startsWith(prefixes[msg.guild.id])) { return; }
    let cmd = msg.content.split(" ")[0]
    cmd = cmd.slice(prefixes[msg.guild.id].length)
    let args = msg.content.split(" ").slice(1)
    if (cmd == "song") {
        let song = args.slice(1).join(" ")
        if (!args[0]) { return msg.channel.send(":x: Sorry, but you must specify a song to search for.") }
        dz.findTracks(song).then(function(result) {
            msg.channel.send("", { embed: new Discord.RichEmbed().setTitle(result.data[0].title).setColor("#00D4FF").setThumbnail(bot.iconURL).setDescription("**Link**\n" + result.data[0].link + "\n**Rank**\n" + result.data[0].rank + "\n**Duration**\n" + result.data[0].duration + " seconds\n**Explicit**\n" + result.data[0].explicit_lyrics).setFooter("Information sourced from Deezer") })
        });
    };

    if (cmd == "eval" && msg.author.id === config.owner) {
        let result
        try {
            result = eval(args.join(" "))
        } catch (err) {
            return msg.channel.send(":x: Looks like there was an error: " + console.log(err))
        }
        msg.channel.send(":white_check_mark: Eval results: " + result)
    };

    if (cmd == "preview") {
        let song = args.slice(1).join(" ")
        if (!args[0]) { return msg.channel.send(":x: Sorry, but you must specify a song to find the preview of.") }
        dz.findTracks(song).then(function(result) {
            msg.channel.send("", { embed: new Discord.RichEmbed().setTitle(result.data[0].title).setColor("#00D4FF").setThumbnail("http://a2.mzstatic.com/us/r30/Purple4/v4/73/f2/77/73f277e5-37fa-e7e5-5195-43d664aadba8/mzl.xhtrnmrg.png").setDescription("**Preview**\n" + result.data[0].preview).setFooter("Information sourced from Deezer") })
        });
    };

    if (cmd == "image") {
        let artist = args.slice(1).join(" ")
        if (!args[0]) { return msg.channel.send(":x: Sorry, but you must specify an arist to get the image of.") }
        dz.findArtists(artist).then(function(result) {
            msg.channel.send("", { embed: new Discord.RichEmbed().setTitle(result.data[0].name).setColor("#00D4FF").setThumbnail("http://a2.mzstatic.com/us/r30/Purple4/v4/73/f2/77/73f277e5-37fa-e7e5-5195-43d664aadba8/mzl.xhtrnmrg.png").setImage(result.data[0].picture_medium).setFooter("Information sourced from Deezer") })
        });
    };

    //if (cmd == "album") {
    //let album = args.slice(1).join(" ")
    // if (!args[0]) { return msg.channel.send(":x: Sorry, but you must specify an album to search for.") }
    //dz.findAlbums(album).then(function(result) {@turb Broken code :/
    //console.log(result)
    //msg.channel.send("", { embed: new Discord.RichEmbed().setTitle(album[0].title).setThumbnail().setColor("#00D4FF").setDescription("").setFooter("Information sourced from Deezer") })
    //});
    //}

    if (cmd == "artist") {
        let artist = args.slice(1).join(" ")
        if (!args[0]) { return msg.channel.send(":x: Sorry, but you must specify an artist to search for.") }
        dz.findArtists(artist).then(function(result) {
            msg.channel.send("", { embed: new Discord.RichEmbed().setTitle(result.data[0].name).setColor("#00D4FF").setThumbnail(result.data[0].picture_medium).setDescription("**Link**\n" + result.data[0].link + "\n**Fans**\n" + result.data[0].nb_fan + "\n**Albums**\n" + result.data[0].nb_album + "\n**Type**\n" + result.data[0].nb_album).setFooter("Information sourced from Deezer") })
        });
    };

    if (cmd == "stats") {
        msg.channel.send("", { embed: new Discord.RichEmbed().setTitle("Stats").setThumbnail("http://a2.mzstatic.com/us/r30/Purple4/v4/73/f2/77/73f277e5-37fa-e7e5-5195-43d664aadba8/mzl.xhtrnmrg.png").setColor("ff0000").setDescription("**Guilds**\n" + bot.guilds.size + "\n**Users**\n" + bot.users.size + "\n**Channels**\n" + bot.channels.size + "\n**Ping**\n" + bot.ping.toFixed()).setFooter("Stats Command") })
    }

    if (cmd == "support") {
        msg.channel.send("Join here: https://discord.gg/YQs6Fye")
    }

    if (cmd == "help") {
        msg.channel.send("", { embed: new Discord.RichEmbed().setTitle("Help").setColor("ff0000").setDescription("__***Commands***__\n__**Info**__\n**de$help** - Shows this message\n**de$stats** - Tells you bot stats\n**de$support** - Links you to the support server\n__**Deezer**__\n**de$song (name)** - Finds info about a song on Deezer\n**de$artist (name)** - Finds info about an artist on Deezer\n**de$preview (song name)** - Gives you a 30 second preview link of a song\n**de$image (artist name)** - Gives you an image of an artist\n**de$stats** - Tells you bot stats\n**de$support** - Links you to the support server").setFooter("Help Command") })
    }

});

bot.login(config.token)
