module.exports = {
  name: 'purge',
  // description: 'Delete the last messages in all chats.',
  description: '删除所有聊天记录中的最后一条信息',
  options: [
    {
      name: 'num',
      type: 4, //'INTEGER' Type
      // description: 'The number of messages you want to delete. (max 100)',
      description: '你想删除的信息数量（最多100条）',
      required: true,
    },
  ],
  async execute(interaction) {
    const deleteCount = interaction.options.get('num').value;

    if (!deleteCount || deleteCount < 2 || deleteCount > 100) {
      return void interaction.reply({
        // content: "Please provide a number between 2 and 100 for the number of messages to delete",
        content: "⚠️ | 请提供一个介于2和100之间的数字，作为要删除的信息数量",
        ephemeral: true,
      });
    }

    const fetched = await interaction.channel.messages.fetch({
      limit: deleteCount,
    });

    interaction.channel
      .bulkDelete(fetched)
      .then(() => {
        interaction.reply({
          // content: "Succesfully deleted messages",
          content: "✅ | 成功删除信息",
          ephemeral: true,
        });
      })
      .catch(error => {
        interaction.reply({
          content: "Couldn't delete messages because of: ${error}",
          content: "❌ | 无法删除信息，因为： ${error}",
          ephemeral: true,
        });
      });
  },
};
