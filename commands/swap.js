const {GuildMember} = require('discord.js');

module.exports = {
  name: 'swap',
  // description: 'swap song positions in the queue!',
  description: '交换队列中的歌曲位置',
  options: [
    {
      name: 'track1',
      type: 4, // 'INTEGER' Type
      // description: 'The track number you want to swap',
      description: '你想调换的曲目编号',
      required: true,
    },
    {
      name: 'track2',
      type: 4, // 'INTEGER' Type
      // description: 'The track number you want to swap',
      description: '你想调换的曲目编号',
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
    const queueNumbers = [interaction.options.get('track1').value - 1, interaction.options.get('track2').value - 1];
    // Sort so the lowest number is first for swap logic to work
    // 排序，使最低的数字在前面，以便交换逻辑发挥作用
    queueNumbers.sort(function (a, b) {
      return a - b;
    });
    if (queueNumbers[1] > queue.tracks.length)
      // return void interaction.followUp({content: '❌ | Track number greater than queue depth!'});
      return void interaction.followUp({ content: '⚠️ | 编号大于队列数量！' });

    try {
      const track2 = queue.remove(queueNumbers[1]); // Remove higher track first to avoid list order issues //删除较高的轨道，以避免列表顺序问题
      const track1 = queue.remove(queueNumbers[0]);
      queue.insert(track2, queueNumbers[0]); // Add track in lowest position first to avoid list order issues //添加最低位置的轨道，以避免列表顺序问题
      queue.insert(track1, queueNumbers[1]);
      return void interaction.followUp({
        // content: "✅ | Swapped **${track1}** & **${track2}**!",
        content: "✅ | **${track1}** 与 **${track2}** 交换了位置",
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
