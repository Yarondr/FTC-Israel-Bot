import { ApplicationCommand, ApplicationCommandOptionType, CommandInteraction } from "discord.js"
import { IBot } from "../../utils/interfaces/IBot";
import { ISlashCommand } from "../../utils/interfaces/ISlashCommand";

module.exports = {
    name: "unregister",
    category: "Commands Manager",
    devOnly: true,
    ephemeral: true,
    description: "Unregister a command",
    permissions: ["Administrator"],
    botPermissions: ['SendMessages'],
    options: [
        {
            name: 'command',
            description: "The command name to unregister",
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
    execute: async (bot: IBot, interaction: CommandInteraction) => {
        if (!interaction.isChatInputCommand()) return;
        const { options } = interaction;
        const { slashCommands } = bot;
        const command = options.getString('command')!;

        try {
            if (!slashCommands.has(command)) {
                return interaction.editReply({ content: "This command does not exist!" });
            } else {
                const cmd = slashCommands.get(command)!;
                const guild = interaction.guild;
                const guildCommands = await guild?.commands.fetch();
                const clientCommand: ApplicationCommand = guildCommands?.find(c => c.name === command)!;
                await guild?.commands.delete(clientCommand.id);
                slashCommands.delete(command);
                await interaction.editReply({ content: `Command ${cmd.name} has been unregistered!` });
            }
        } catch (e) {
            console.error(e);
            try {
                return interaction.editReply({ content: "An error occurred while trying to unregister the command." });
            } catch (e) {
                return interaction.editReply("An error occurred while trying to unregister the command.");
            }
        }
    }
} as ISlashCommand;