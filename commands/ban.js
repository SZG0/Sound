module.exports = {
  name: 'ban',
  description: '封禁一个用户',
  options: [
    {
      name: 'user',
      type: 6, //USER Type
      // description: 'The user you want to ban',
      description: '你想封禁的用户',
      required: true,
    },
  ],
  execute(interaction, client) {
    const member = interaction.options.get('user').value;

    if (!member) {
      // return message.reply('You need to mention the member you want to ban him');
      return message.reply('⚠️ | 你需要提及（@）你想禁止的成员');
    }

    if (!interaction.member.permissions.has('BAN_MEMBERS')) {
      // return message.reply("I can't ban this user.");
      return message.reply("❌ | 我无法封禁这个用户。");
    }

    const userinfo = client.users.cache.get(member);

    return interaction.guild.members
      .ban(member)
      .then(() => {
        interaction.reply({
          // content: "${userinfo.username} was banned.",
          content: "✅ | ${userinfo.username} 已被封禁.",
          ephemeral: true,
        });
      })
      .catch(error =>
        interaction.reply({
          // content: "Sorry, an error occured.",
          content: "❌ | 抱歉，出现了一个错误。",
          ephemeral: true,
        }),
      );
  },
};
