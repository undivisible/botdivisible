import discord
import os
import youtube_dl
import asyncio
import datetime
from dotenv import load_dotenv
from random import randrange
from discord.ext import commands

# Define the bot's intents
intents = discord.Intents.default()
intents.message_content = True
intents.members = True

# Create the bot instance
bot = commands.Bot(
    command_prefix='/', 
    intents=intents,
    activity=discord.Activity(type=discord.ActivityType.watching, name="you.")
)

time = datetime.datetime.now()
hour = time.hour

# Load the API token from the .env file
load_dotenv('token.env')
DISCORD_TOKEN = os.getenv("discord_token")

youtube_dl.utils.bug_reports_message = lambda: ''

ytdl_format_options = {
    'format': 'bestaudio/best',
    'restrictfilenames': True,
    'noplaylist': True,
    'nocheckcertificate': True,
    'ignoreerrors': False,
    'logtostderr': False,
    'quiet': True,
    'no_warnings': True,
    'default_search': 'auto',
    'source_address': '0.0.0.0' # bind to ipv4 since ipv6 addresses cause issues sometimes
}

ffmpeg_options = {
    'options': '-vn'
}

ytdl = youtube_dl.YoutubeDL(ytdl_format_options)

class YTDLSource(discord.PCMVolumeTransformer):
    def __init__(self, source, *, data, volume=0.5):
        super().__init__(source, volume)
        self.data = data
        self.title = data.get('title')
        self.url = ""

    @classmethod
    async def from_url(cls, url, *, loop=None, stream=False):
        loop = loop or asyncio.get_event_loop()
        data = await loop.run_in_executor(None, lambda: ytdl.extract_info(url, download=not stream))
        if 'entries' in data:
            # take first item from a playlist
            data = data['entries'][0]
        filename = data['title'] if stream else ytdl.prepare_filename(data)
        return filename

# Bot commands
@bot.command(name='play')
async def play(ctx, url):
    await join_voice(ctx)
    
    async with ctx.typing():
        filename = await YTDLSource.from_url(url, loop=bot.loop)
        ctx.voice_client.play(discord.FFmpegPCMAudio(source=filename))
    
    await ctx.send(f"**Now playing:** {filename}")

@bot.command(name='pause')    
async def pause(ctx):
    if ctx.voice_client.is_playing():
        ctx.voice_client.pause()
        await ctx.send("Paused ⏸️") 
    else:
        await ctx.send("Not playing anything currently")
        
# Other commands        
# Define a dictionary to map greetings in different languages
greetings = {
    'en': ['hello', 'hi', 'hey', 'wassup', 'whats up', 'good morning', 'good afternoon', 'good day', 'wsg', 'gm'],
    'ru': ['привет', 'здравствуйте', 'здравствуй', 'прив', 'здорово'],
    'cn': ['早上好', '下午好', '晚安', '你好']
}

@bot.event
async def on_message(message):
    if message.author == bot.user:
        return

    content = message.content.lower()

    for lang, phrases in greetings.items():
        for phrase in phrases:
            if content.startswith(phrase):
                name = str(message.author)
                if name == "undivisible": 
                    await message.channel.send(greetings[lang][randrange(5)] + "?")
                elif name == "koolych":
                    await message.channel.send(greetings[lang][randrange(5)] + " koolych :333")
                elif name == "leroy1107":
                    await message.channel.send(greetings[lang][randrange(5)] + " leroy")
                elif name == "xavier8001":
                    await message.channel.send(greetings[lang][randrange(5)] + " xav")
                elif name == "redmyfavcolour":
                    await message.channel.send(greetings[lang][randrange(5)] + " terence")

    if 'french' in content:
        await message.channel.send('i think you mean fr*nch')
    elif 'france' in content:
        await message.channel.send('i think you mean fr*nce')
    elif 'dllm' in content:
        await message.channel.send('fuck you too')
    elif hour == 9:
        await message.channel.send('<@476637864814444545> daily reminder your parents are forced to love you, but they arent forced to be proud of you.')


    elif message.author.id == 476637864814444545:
        if 'bot shut up' in content:
            await message.channel.send('fuck you')
            await asyncio.sleep(10 * 60)
        elif 'doesnt work' in content:
            await message.channel.send('of course i dont work you made me fucking idiot')
        elif message.content.startswith('gn'):
            await message.channel.send('i hope you fucking die')
        elif message.content.startswith('good night'):
            await message.channel.send('i hope you fucking die')
        elif message.content.startswith('yes'):
            await message.channel.send('no')
        elif message.content.startswith('fuck you'):
            await message.channel.send('fuck you too')
        elif message.content.startswith('no'):
            await message.channel.send('yes')
        elif message.content.startswith('thanks'):
            await message.channel.send('no problem')
        elif message.content.startswith('<@1161867915004481606> what'):
            await message.channel.send('what?')

    elif message.author.id == 546581450070163456:
        if 'bot shut up' in content:
            await message.channel.send('ok whatever you say')
            await asyncio.sleep(10 * 60)
        elif message.content.startswith('good night'):
            await message.channel.send('good night leroy :))')
        elif message.content.startswith('gn'):
            await message.channel.send('gn :))')
        elif message.content.startswith('yes'):
            await message.channel.send('sure')
        elif message.content.startswith('thanks'):
            await message.channel.send('thanks')

    elif message.author.id == 581025257977020427:
        if 'bot shut up' in content:
            await message.channel.send('ok koolych :)). youre so cool')
            await asyncio.sleep(10 * 60)
        elif message.content.startswith('good night'):
            await message.channel.send('good night koolych i love you')
        elif message.content.startswith('gn'):
            await message.channel.send('gn :))')
        elif message.content.startswith('yes'):
            await message.channel.send('of course kooly')
        elif message.content.startswith('thanks'):
            await message.channel.send('thanksssss')

    elif message.author.id == 495178505605349376:
        if 'bot shut up' in content:
            await message.channel.send('no lol')
            await asyncio.sleep(10 * 60)
        elif message.content.startswith('good night'):
            await message.channel.send('good night xav')
        elif message.content.startswith('gn'):
            await message.channel.send('gn :))')
        elif message.content.startswith('yes'):
            await message.channel.send('no xavier, no')
        elif message.content.startswith('thanks'):
            await message.channel.send('no problem')


# Helper functions  
async def join_voice(ctx):
    if not ctx.author.voice:
        await ctx.send("You are not in a voice channel!")
        return
    
    if not ctx.voice_client:
        await ctx.author.voice.channel.connect() 

# Bot event handlers
@bot.event
async def on_ready():
    await bot.tree.sync()
    print(f'Logged in as {bot.user}!')

# Run bot
bot.run(DISCORD_TOKEN)