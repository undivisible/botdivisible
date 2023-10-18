import { Client, GatewayIntentBits, VoiceChannel } from 'discord.js';
import * as ytdl from 'ytdl-core';
import { StreamDispatcher, VoiceConnection } from 'discord.js';
import { Message } from 'discord.js';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

const TOKEN = 'YOUR_BOT_TOKEN';
const PREFIX = '/';

client.once('ready', () => {
    console.log(`Logged in as ${client.user?.tag}!`);
    client.user?.setActivity('you.', { type: 'WATCHING' });
});

client.on('messageCreate', async (message: Message) => {
    if (message.author.bot) return;

    const content = message.content.toLowerCase();

    // Define a dictionary to map greetings in different languages
    const greetings: { [key: string]: string[] } = {
        'en': ['hello', 'hi', 'hey', 'wassup', 'whats up', 'good morning', 'good afternoon', 'good day', 'wsg', 'gm'],
        'ru': ['привет', 'здравствуйте', 'здравствуй', 'прив', 'здорово'],
        'cn': ['早上好', '下午好', '晚安', '你好'],
    };

    for (const lang in greetings) {
        for (const phrase of greetings[lang]) {
            if (content.startsWith(phrase)) {
                const name = message.author.username;
                const randomGreeting = greetings[lang][Math.floor(Math.random() * 5)];
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

    // Add your other message handling logic here...

    if (message.author.id === '476637864814444545') {
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

    // Add handling for other user IDs...

});

// Voice handling
let voiceConnection: VoiceConnection | null = null;

client.on('messageCreate', async (message: Message) => {
    if (message.author.bot) return;

    if (message.content.startsWith(`${PREFIX}play`)) {
        const voiceChannel: VoiceChannel | null = message.member?.voice.channel;
        if (!voiceChannel) {
            message.channel.send('You are not in a voice channel!');
            return;
        }

        const args: string[] = message.content.split(' ');
        if (args.length !== 2 || !ytdl.validateURL(args[1])) {
            message.channel.send('Please provide a valid YouTube URL.');
            return;
        }

        if (voiceConnection) {
            voiceConnection.join();
        } else {
            voiceConnection = await voiceChannel.join();
        }

        const stream = ytdl(args[1], { filter: 'audioonly' }); // Use 'ytdl' from 'ytdl-core-discord'
        const dispatcher: StreamDispatcher = voiceConnection.play(stream);

        dispatcher.on('finish', () => {
            voiceConnection?.disconnect();
        });

        message.channel.send(`**Now playing:** ${args[1]}`);
    } else if (message.content.startsWith(`${PREFIX}pause`)) {
        if (voiceConnection) {
            voiceConnection.voice?.connection?.dispatcher?.pause();
            message.channel.send('Paused ⏸️');
        } else {
            message.channel.send('Not playing anything currently');
        }
    }
});

// Log in with the bot's token
client.login(TOKEN);
