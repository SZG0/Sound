const {GuildMember} = require('discord.js');

module.exports = {
  name: 'pause',
  // description: 'Pause current song!',
  description: '暂停当前歌曲',
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
    if (!queue || !queue.playing)
      /* return void interaction.followUp({
        content: '❌ | No music is being played!'
      }); */
      return void interaction.followUp({ 
        content: '❌ | 没有音乐在播放！'
       });
    const success = queue.setPaused(true);
    return void interaction.followUp({
      // content: success ? '⏸ | Paused!' : '❌ | Something went wrong!',
      content: success ? '⏸ | 已暂停' : '❌ | 出了点问题!',
    });
  },
};
