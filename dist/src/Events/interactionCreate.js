import { ChatInputCommandInteraction } from "discord.js";
import { client } from "../Exports.js";
export default async function (interaction) {
    const handler = interaction instanceof ChatInputCommandInteraction ? (client.commands.get(interaction.commandName)
        || client.guildCommands.get(interaction.guild.id).get(interaction.commandName)) : client.buttonHandlers.find((h) => h.id === interaction.customId);
    handler.context = interaction;
    await handler.execute();
}
//# sourceMappingURL=interactionCreate.js.map