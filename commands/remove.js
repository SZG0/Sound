const {GuildMember} = require('discord.js');

module.exports = {
  name: 'remove',
  // description: 'remove a song from the queue!',
  description: '从列表中删除一首歌曲',
  aliases: ["rm"],
  options: [
    {
      name: 'number',
      type: 4, // 'INTEGER' Type
      // description: 'The queue number you want to remove',
      description: '你想删除的列表编号',
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
    const number = interaction.options.get('number').value - 1;
    if (number > queue.tracks.length)
      // return void interaction.followUp({ content: '❌ | Track number greater than queue depth!' });
      return void interaction.followUp({ content: '⚠️ | 编号大于队列数量！' });
      const removedTrack = queue.remove(number);
    return void interaction.followUp({
      // content: removedTrack ? "✅ | Removed **${removedTrack}**!" : '❌ | Something went wrong!',
      content: removedTrack ? "✅ | 已移除 **${removedTrack}**!" : '❌ | 出了点问题！',
    });
  },
};
/* // ——自己添加——
module.exports.config = {
  name: "remove",
  aliases: ['rm']
}
 */