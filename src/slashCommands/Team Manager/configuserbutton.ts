import { ApplicationCommandOptionType, ButtonStyle, CommandInteraction, GuildMember, TextChannel } from 'discord.js';
import { IBot } from '../../utils/interfaces/IBot';
import { ISlashCommand } from '../../utils/interfaces/ISlashCommand';
import { addTeamRole, getNoTeamRoleId, getTeamRoles, isTeamRoleExists, setNoTeamRoleId } from '../../utils/rolesJsonHandler';
import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders';

module.exports = {
    name: 'userconfig',
    category: 'Team Manager',
    description: 'Adds a button to config the user nickname and team role',
    devOnly: false,
    ephemeral: true,
    permissions: ['SendMessages', 'Administrator'],
    botPermissions: ['SendMessages'],

    options: [
        {
            name: 'channel-id',
            type: ApplicationCommandOptionType.String,
            description: 'Update the group no team role id',
            required: true,
        }
    ],

    execute: async (bot: IBot, interaction: CommandInteraction) => {
        if (!interaction.isChatInputCommand()) return;
        const { options, guild } = interaction;

        const buttons = new ActionRowBuilder<ButtonBuilder>().setComponents(
            new ButtonBuilder().setCustomId('configUserButton').setLabel('לחצו כאן').setStyle(ButtonStyle.Primary),
        )

        const channel = guild?.channels.cache.get(options.getString('channel-id')!) as TextChannel;
        if (!channel) return await interaction.editReply({ content: 'Channel not found!' });

        await channel.send({ content: "נא ללחוץ על הכפתור למטה על מנת לקבוע את הרול של הקבוצה והכינוי שלכם בשרת 👇", components: [buttons] }).catch(async () => {
            return await interaction.editReply({ content: 'I don\'t have permissions to send messages in that channel!' });
        });
        return await interaction.editReply({ content: 'Buttons added to the channel!' });
    }
} as ISlashCommand;