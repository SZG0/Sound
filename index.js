const fs = require('fs');
const Discord = require('discord.js');
const Client = require('./client/Client');
const config = require('./config.json');
const {Player} = require('discord-player');

const client = new Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

console.log(client.commands);

const player = new Player(client);

player.on('error', (queue, error) => {
  // console.log(`[${queue.guild.name}] Error emitted from the queue: ${error.message}`);
  console.log(`[${queue.guild.name}] 播放列表发出的错误: ${error.message}`);
});

player.on('connectionError', (queue, error) => {
  // console.log(`[${queue.guild.name}] Error emitted from the connection: ${error.message}`);
  console.log(`[${queue.guild.name}] 连接发出的错误：: ${error.message}`);
});

player.on('trackStart', (queue, track) => {
  // queue.metadata.send(`▶ | Started playing: **${track.title}** in **${queue.connection.channel.name}**!`);
  queue.metadata.send(`▶️ | 开始在 <#${queue.connection.channel.id}> 里播放 **${track.title}** 。`);
});

player.on('trackAdd', (queue, track) => {
  // queue.metadata.send(`🎶 | Track **${track.title}** queued!`);
  queue.metadata.send(`🎶 | 歌曲 **${track.title}** 已添加至播放播放列表。`);
});

player.on('botDisconnect', queue => {
  // queue.metadata.send('❌ | I was manually disconnected from the voice channel, clearing queue!');
  queue.metadata.send('❌ | 我被手动切断了与语音通道的连接，播放列表已清理完毕！');
});

player.on('channelEmpty', queue => {
  //queue.metadata.send('❌ | Nobody is in the voice channel, leaving...');
  queue.metadata.send('❌ | 没有人在语言频道里，离开中……');
});

player.on('queueEnd', queue => {
  // queue.metadata.send('✅ | Queue finished!');
  queue.metadata.send('✅ | 列表播放完成！');
});

client.once('ready', async () => {
  // console.log('Ready!');
  console.log('准备就绪！');
});

client.on('ready', function () {
  client.user.setActivity(config.activity, { type: config.activityType });
});

client.once('reconnecting', () => {
  // console.log('Reconnecting!');
  console.log('重连中！');
});

client.once('disconnect', () => {
  //console.log('Disconnect!');
  console.log('连接失败，未连接');
});

client.on('messageCreate', async message => {
  if (message.author.bot || !message.guild) return;
  if (!client.application?.owner) await client.application?.fetch();

  if (message.content === '.deploy' && message.author.id === client.application?.owner?.id) {
    await message.guild.commands
      .set(client.commands)
      .then(() => {
        //message.reply('Deployed!');
        message.reply('部署成功！');
      })
      .catch(err => {
        // message.reply('Could not deploy commands! Make sure the bot has the application.commands permission!');
        message.reply('无法部署指令! 请确保机器人有application.command的权限!');
        console.error(err);
      });
  }
});

client.on('interactionCreate', async interaction => {
  const command = client.commands.get(interaction.commandName.toLowerCase());

  try {
    if (interaction.commandName == 'ban' || interaction.commandName == 'userinfo') {
      command.execute(interaction, client);
    } else {
      command.execute(interaction, player);
    }
  } catch (error) {
    console.error(error);
    interaction.followUp({
      // content: 'There was an error trying to execute that command!',
      content: '试图执行该命令时出现了错误!',
    });
  }
});

client.login(config.token);

