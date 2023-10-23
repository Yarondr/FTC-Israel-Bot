import { GuildMember, ModalSubmitInteraction, Role } from "discord.js";
import { IBot } from "../../utils/interfaces/IBot";
import teamsList from "../../utils/teamLists";
import { getTeamRoles } from "../../utils/rolesJsonHandler";
import { addNoTeamRole, hasNoTeamRole, renameMember, setTeamRole } from "../../utils/userConfig";
import { IModal } from "../../utils/interfaces/IModal";

module.exports = {
    id: 'configUserModal',
    catergory: 'Team Manager',
    deferReply: true,
    ephemeral: true,

    execute: async (bot: IBot, interaction: ModalSubmitInteraction) => {
        const { guild } = interaction;
        const member: GuildMember = interaction.member as GuildMember

        const nickname = interaction.fields.getTextInputValue('nicknameInput');
        const teamNumber = interaction.fields.getTextInputValue('teamInput');

        if (!nickname.match(/^[a-zA-Z ]+$/)) {
            return await interaction.followUp({ content: 'על הכינוי להכין רק תווים באנגלית ורווחים!' });
        }
        if (!nickname.replace(/\s/g, '').length) {
            return await interaction.followUp({ content: 'הכינוי לא יכול להיות רק רווחים!' });
        }

        if (!await hasNoTeamRole(member, guild!)) {
            return await interaction.followUp({ content: 'כבר יש לך רול של קבוצה!' });
        }


        if (teamsList.includes(teamNumber)) {
            const teamRoles = getTeamRoles();
            const removedRoles: Role[] = [];
            const memberRoles = member.roles.cache;
            const guildRoles = await guild!.roles.fetch();

            // Set Nickname
            const oldNickname = member.nickname;
            const renamesuccess = await renameMember(member, guild!, nickname, teamNumber);
            if (!renamesuccess) {
                return await interaction.followUp({ content: 'לא הצלחנו לקבוע לך את הכינוי, יש לפנות לצוות השרת' });
            }

            // Remove old team roles
            for (const role of teamRoles) {
                if (memberRoles.find(r => r.id == role)) {
                    const guildRole = guildRoles.get(role);
                    if (guildRole) {
                        removedRoles.push(guildRole);
                        member.roles.remove(guildRole);
                    }
                }
            }

            // Add new team role
            const roleSuccess = await setTeamRole(guildRoles, member, teamNumber, guild!);
            if (!roleSuccess) {
                // If role not found, revert nickname and add back old roles
                if (renamesuccess) await renameMember(member, guild!, oldNickname!, teamNumber);
                for (const role of removedRoles) {
                    member.roles.add(role);
                }
                await addNoTeamRole(member, guild!);

                return await interaction.followUp({ content: 'מספר קבוצה לא נמצא!' });
            }

            await interaction.followUp({ content: 'הכינוי שלך ורול הקבוצה שלך נקבעו בהצלחה!' });
        } else {
            await interaction.followUp({ content: 'מספר קבוצה לא תקין!' });
        }
    }
} as IModal