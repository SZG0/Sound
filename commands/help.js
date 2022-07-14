const fs = require('fs');

module.exports = {
  name: 'help',
  // description: 'List all available commands.',
  description: '列出所有可用的指令',
  execute(interaction) {
    let str = '';
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const command = require("./${file}");
      //str += "Name: ${command.name}, Description: ${command.description} \n";
      str += "指令: ${command.name}, 简介: ${command.description} \n";
    }

    return void interaction.reply({
      content: str,
      ephemeral: true,
    });
  },
};
