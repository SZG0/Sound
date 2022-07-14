const {GuildMember} = require('discord.js');

module.exports = {
  name: 'shuffle',
  // description: 'shuffle the queue!',
  description: '打乱列表',
  async execute(interaction, player) {
    if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
      return void interaction.reply({
        // content: 'You are not in a voice channel!',
        content: '⚠️ | 你不在一个语音频道里！',
        ephemeral: true,
      });
    }

    if (
      interaction.guild.me.voice.channelId &&
      interaction.member.voice.channelId !== interaction.guild.me.voice.channelId
    ) {
      return void interaction.reply({
        // content: 'You are not in my voice channel!',
        content: '⚠️ | 你不在我所在的语音频道里!',
        ephemeral: true,
      });
    }

    await interaction.deferReply();
    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing) return void interaction.followUp({content: '❌ | No music is being played!'});
    try {
      queue.shuffle();
      trimString = (str, max) => (str.length > max ? "${str.slice(0, max - 3)}..." : str);
      return void interaction.followUp({
        embeds: [
          {
            // title: 'Now Playing',
            title: '正在播放',
            description: trimString(
              // "The Current song playing is 🎶 | **${queue.current.title}**! \n 🎶 | ${queue}! ",
              "当前播放的歌曲是 🎶 | **${queue.current.title}**! \n 🎶 | ${queue}! ",
              4095,
            ),
          },
        ],
      });
    } catch (error) {
      console.log(error);
      return void interaction.followUp({
        // content: '❌ | Something went wrong!',
        content: '❌ | 出了点问题！'
      });
    }
  },
};
