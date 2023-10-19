import { Client, GatewayIntentBits } from 'discord.js';
import { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayer, AudioResource, NoSubscriberBehavior, VoiceConnection } from '@discordjs/voice';
import ytdl from 'ytdl-core';

const queue: AudioResource[] = [];
let player: AudioPlayer;
let connection: VoiceConnection;

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildVoiceStates
	]
});

const greetings: {[lang: string]: string[]} = {
	en: ['hello', 'hi', 'hey', 'wassup', 'whats up', 'good morning', 'good afternoon', 'good day'],
	ru: ['привет', 'здравствуйте', 'здравствуй'],
	cn: ['早上好', '下午好', '晚安', '你好']
};

client.on('messageCreate', async message => {

	if (message.author.bot) return;

	const content = message.content.toLowerCase();

	for (const lang in greetings) {
		for (const phrase of greetings[lang]) {
			if (content.startsWith(phrase)) {
				const name = message.author.username;
				const randomGreeting = greetings[lang][Math.floor(Math.random() * greetings[lang].length)];
				switch (name) {
					case 'undivisible':
						message.channel.send(`${randomGreeting}?`);
						break;
					case 'koolych':
						message.channel.send(`${randomGreeting} koolych :333`);
						break;
					case 'leroy1107':
						message.channel.send(`${randomGreeting} leroy`);
						break;
					case 'xavier8001':
						message.channel.send(`${randomGreeting} xav`);
						break;
					case 'redmyfavcolour':
						message.channel.send(`${randomGreeting} terence`);
						break;
				}
			}
		}
	}

	if (content.includes('french')) {
        message.channel.send('i think you mean fr*nch');
    } else if (content.includes('france')) {
        message.channel.send('i think you mean fr*nce');
    } else if (content.includes('dllm')) {
        message.channel.send('fuck you too');
    }
    
    if (message.author.id === '476637864814444545') {
        switch (true) {
            case content.startsWith('bot shut up'):
                message.channel.send('ok whatever you say');
                setTimeout(async () => {
                    // Sleep for 10 minutes
                    // Code here will execute after 10 minutes
                }, 10 * 60 * 1000);
                break;
            case content.startsWith('good night'):
                message.channel.send('good night leroy :))');
                break;
            case content.startsWith('gn'):
                message.channel.send('gn :))');
                break;
            case content.startsWith('yes'):
                message.channel.send('sure');
                break;
            case content.startsWith('thanks'):
                message.channel.send('thanks');
                break;
        }
    } else if (message.author.id === '581025257977020427') {
        switch (true) {
            case content.startsWith('bot shut up'):
                message.channel.send('ok koolych :)). you\'re so cool');
                setTimeout(async () => {
                    // Sleep for 10 minutes
                    // Code here will execute after 10 minutes
                }, 10 * 60 * 1000);
                break;
            case content.startsWith('good night'):
                message.channel.send('good night koolych i love you');
                break;
            case content.startsWith('gn'):
                message.channel.send('gn :))');
                break;
            case content.startsWith('yes'):
                message.channel.send('of course kooly');
                break;
            case content.startsWith('thanks'):
                message.channel.send('thanksssss');
                break;
        }
    } else if (message.author.id === '495178505605349376') {
        switch (true) {
            case content.startsWith('bot shut up'):
                message.channel.send('no lol');
                setTimeout(async () => {
                    // Sleep for 10 minutes
                    // Code here will execute after 10 minutes
                }, 10 * 60 * 1000);
                break;
            case content.startsWith('good night'):
                message.channel.send('good night xav');
                break;
            case content.startsWith('gn'):
                message.channel.send('gn :))');
                break;
            case content.startsWith('yes'):
                message.channel.send('no xavier, no');
                break;
            case content.startsWith('thanks'):
                message.channel.send('no problem');
                break;
        }
    } else if (message.author.id === '476637864814444545') {
        switch (true) {
            case content.startsWith('bot shut up'):
                message.channel.send('fuck you');
                setTimeout(() => {
                    // Sleep for 10 minutes
                }, 10 * 60 * 1000);
                break;
            case content.includes('doesnt work'):
                message.channel.send('of course i dont work you made me a fool');
                break;
            case content.startsWith('gn'):
            case content.startsWith('good night'):
                message.channel.send('i hope you have a terrible night');
                break;
            case content.startsWith('yes'):
                message.channel.send('no');
                break;
            case content.startsWith('fuck you'):
                message.channel.send('fuck you too');
                break;
            case content.startsWith('no'):
                message.channel.send('yes');
                break;
            case content.startsWith('thanks'):
                message.channel.send('no problem');
                break;
            case content.startsWith('<@1161867915004481606> what'):
                message.channel.send('what?');
                break;
        }
    }

	if (message.content.startsWith('/play')) {

		const url = message.content.split(' ')[1];
    
		const connection = joinVoiceChannel({
			channelId: message.member!.voice.channel!.id,
			guildId: message.guild!.id,
			adapterCreator: message.guild!.voiceAdapterCreator  
		});

		const stream = ytdl(url, { filter: 'audioonly' });

		const resource = createAudioResource(stream);
    
		queue.push(resource);

		if (!player) {
			player = createAudioPlayer({
				behaviors: {
					noSubscriber: NoSubscriberBehavior.Pause
				}
			});
			connection.subscribe(player);
		}

		player.play(resource);

	}

	if (message.content === '/pause') {
		player?.pause();
	}

	if (message.content === '/skip') {
		player?.stop();

		if (queue.length > 0) {
			const nextResource = queue.shift()!;
			player?.play(nextResource);
		}

		if (queue.length === 0) {
			connection.disconnect();
		}
	}

	if (message.content === '/queue') {
		message.channel.send(`Queue has ${queue.length} songs`);
	}

});

client.on('debug', console.log);

client.on('ready', () => {
  console.log(`bot connected!`);
});

client.login('MTE2MTg2NzkxNTAwNDQ4MTYwNg.G7oYNU.TY25ilP8AVwbmv_ie89eBRhrKACvXlvpGGFsCk');