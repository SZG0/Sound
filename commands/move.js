const { GuildMember } = require('discord.js');

module.exports = {
  name: 'move',
  //description: 'move song position in the queue!',
  description: '移动在播放列表中歌曲的位置',
  options: [
    {
      name: 'track',
      type: 4, // 'INTEGER' Type
      // description: 'The track number you want to move',
      description: '你想要移动的歌曲编号',
      required: true,
    },
    {
      name: 'position',
      type: 4, // 'INTEGER' Type
      // description: 'The position to move it to',
      description: '将其移至的位置',
      required: true,
    },
  ],
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
    const queueNumbers = [interaction.options.get('track').value - 1, interaction.options.get('position').value - 1];
    if (queueNumbers[0] > queue.tracks.length || queueNumbers[1] > queue.tracks.length)
      // return void interaction.followUp({ content: '❌ | Track number greater than queue depth!' });
      return void interaction.followUp({ content: '⚠️ | 编号大于队列数量！' });

    try {
      const track = queue.remove(queueNumbers[0]);
      queue.insert(track, queueNumbers[1]);
      return void interaction.followUp({
        // content: "✅ | Moved **${track}**!",
        content: "✅ | 编号 **${track}** 已移动",
      });
    } catch (error) {
      console.log(error);
      return void interaction.followUp({
        // content: '❌ | Something went wrong!',
        content: '❌ | 出了点问题！',
      });
    }
  },
};
// ——自己添加——
module.exports.config = {
  name: "move",
  aliases: ['mv']
}
