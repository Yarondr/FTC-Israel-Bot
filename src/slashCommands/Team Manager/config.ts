import { ApplicationCommandOptionType, CommandInteraction } from 'discord.js';
import { IBot } from '../../utils/interfaces/IBot';
import { ISlashCommand } from '../../utils/interfaces/ISlashCommand';
import { addTeamRole, isTeamRoleExists, setNoTeamRoleId } from '../../utils/rolesJsonHandler';
import teamsList from '../../utils/teamLists';

module.exports = {
    name: 'teamconfig',
    category: 'Team Manager',
    description: 'Config teams info and data',
    devOnly: false,
    ephemeral: true,
    permissions: ['SendMessages', 'Administrator'],
    botPermissions: ['ManageRoles', 'SendMessages'],

    options: [
        {
            name: 'noteam',
            type: ApplicationCommandOptionType.Subcommand,
            description: 'Update the group no team role id',
            options: [
                {
                    name: 'role',
                    type: ApplicationCommandOptionType.Role,
                    required: true,
                    description: "The role to set as no team role"
                }
            ],
        },
        {
            name: 'teams',
            type: ApplicationCommandOptionType.Subcommand,
            description: 'Update the group teams role ids',
        }

    ],

    execute: async (bot: IBot, interaction: CommandInteraction) => {
        if (!interaction.isChatInputCommand()) return;
        const { options, guild } = interaction;
        const subCommand = options.getSubcommand();
        if (subCommand == 'noteam') {
            const role = options.getRole('role')!;
            setNoTeamRoleId(role.id);
            await interaction.editReply({ content: `No Team role id has been set to ${role.id}` });
        } else if (subCommand == 'teams') {
            const guildRoles = await guild!.roles.fetch();
            let amount = 0;
            guildRoles.forEach(role => {
                if (teamsList.includes(role.name.split(" | ")[1]) && !isTeamRoleExists(role.id)) {
                    amount++;
                    addTeamRole(role.id);
                }
            });
            await interaction.editReply({ content: `Added ${amount} new team roles.` });
        }
    }
} as ISlashCommand;