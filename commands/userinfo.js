module.exports = {
  name: 'userinfo',
  // description: 'Get information about a user.',
  description: '获取一个用户的信息',
  options: [
    {
      name: 'user',
      type: 6, //USER TYPE
      // description: 'The user you want to get info about',
      description: '你想获得的用户信息',
      required: true,
    },
  ],
  execute(interaction, client) {
    const member = interaction.options.get('user').value;
    const user = client.users.cache.get(member);

    interaction.reply({
      content: "Name: ${user.username}, ID: ${user.id}, Avatar: ${user.displayAvatarURL({dynamic: true})}",
      ephemeral: true,
    });
  },
};
