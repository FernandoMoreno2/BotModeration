import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "url";
import { Collection, REST, Routes } from "discord.js";
import { client, GuildCommandHandler, isContextProviderHandler, ButtonHandler } from "./Exports.js";
import botConfig from "../botConfig.json" assert { type: "json" };
const __path = path.dirname(fileURLToPath(import.meta.url));
function getFilesRecursively(folderPath) {
    const files = [];
    for (const item of fs.readdirSync(folderPath)) {
        if (fs.statSync(path.join(folderPath, item)).isDirectory())
            files.push(...getFilesRecursively(path.join(folderPath, item)));
        else
            files.push(path.join(folderPath, item));
    }
    return files;
}
const getPaths = (p) => getFilesRecursively(path.resolve(__path, p)).filter((e) => e.endsWith(".js"));
(await import("dotenv")).config({ path: getFilesRecursively(path.resolve(__path, "../")).find((v) => v.toLowerCase().endsWith(".env")) });
for (const event of getPaths(botConfig.paths.events)) {
    const eventArr = event.split(/[\\\/]/gmi);
    client.on(eventArr[eventArr.length - 1].substring(0, eventArr[eventArr.length - 1].length - 3), async (...args) => await (await import(`file:///${event}`)).default(...args));
}
const ImportConstructor = async (p) => (await import(`file:///${p.replace(/\.ts$/gmi, ".js")}`)).default;
for (const commandIteration of getPaths(botConfig.paths.commands)) {
    const command = new (await ImportConstructor(commandIteration))();
    if (isContextProviderHandler(command))
        (command instanceof GuildCommandHandler ? client.guildCommands.get(command.guildId) || client.guildCommands.set(command.guildId, new Collection())
            : client.commands).set(command.data.name, command);
}
for (const buttonIteration of getPaths(botConfig.paths.buttons)) {
    const buttonHandler = new (await ImportConstructor(buttonIteration))();
    if (buttonHandler instanceof ButtonHandler)
        client.buttonHandlers.push(buttonHandler);
}
const commandRest = new REST({ version: "10" }).setToken(process.env.TOKEN);
await commandRest.put(Routes.applicationCommands(process.env.APPID), { body: client.commands.map((c) => c.data.toJSON()) });
for (const guild of client.guildCommands.values())
    await commandRest.put(Routes.applicationCommands(process.env.APPID), { body: guild.map((c) => c.data.toJSON()) });
await client.login(process.env.TOKEN);
//# sourceMappingURL=index.js.map