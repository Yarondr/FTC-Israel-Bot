console.log("Starting bot...")
import { Client, Collection, IntentsBitField } from 'discord.js';
import dotenv from 'dotenv';
import { loadEvents } from './handlers/eventsHandler';
import { loadCommands } from './handlers/commandsHandler';
import { loadSlashCommands } from './handlers/slashCommandsHandler';
import { IBot } from './utils/interfaces/IBot';
import { ISlashCommand } from './utils/interfaces/ISlashCommand';
import { IEvent } from './utils/interfaces/IEvent';
import { ICommand } from './utils/interfaces/ICommand';
import { scheduleChannelLock } from './utils/timeSchedulers';
import { loadButtons } from './handlers/buttonsHandler';
import { IButton } from './utils/interfaces/IButton';
import { IModal } from './utils/interfaces/IModal';
import { loadModals } from './handlers/modalsHandler';
dotenv.config();

const FTCIsraelId = '738388170370187325'
const testServers = [FTCIsraelId];

export const owners = ['306449257831989248']

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMembers
    ]
});

const commands = new Collection<string, ICommand>();
const events = new Collection<string, IEvent>();
const slashCommands = new Collection<string, ISlashCommand>();
const buttons = new Collection<string, IButton>();
const modals = new Collection<string, IModal>();

const bot: IBot = {
    client,
    commands,
    events,
    slashCommands,
    buttons,
    modals,
    owners,
    testServers,
    prefix: '!'
};

loadEvents(bot, false);
loadCommands(bot, false);
loadSlashCommands(bot, false);
loadButtons(bot, false);
loadModals(bot, false);

scheduleChannelLock(bot.client, FTCIsraelId);

client.login(process.env.TOKEN);