const {GuildMember} = require('discord.js');

module.exports = {
    name: 'queue',
    //description: 'View the queue of current songs!',
    description: '查看当前歌曲的队列',

    async execute (interaction, player) {
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
          var queue = player.getQueue(interaction.guildId);
          if (typeof(queue) != 'undefined') {
            trimString = (str, max) => ((str.length > max) ? "${str.slice(0, max - 3)}..." : str);
              return void interaction.reply({
                embeds: [
                  {
                    // title: 'Now Playing',
                    title: '正在播放',
                    // description: trimString("The Current song playing is 🎶 | **${queue.current.title}**! \n 🎶 | **${queue}**! ", 4095),
                    description: trimString("当前播放的歌曲是 🎶 | **${queue.current.title}**! \n 🎶 | **${queue}**! ", 4095),
                  }
                ]
              })
          } else {
            return void interaction.reply({
              // content: 'There is no song in the queue!'
              content: '❌ | 队列中没有歌曲!'
            })
          }
    }
}
