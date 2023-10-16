import { Client, Collection } from "discord.js";
import botConfig from "../../botConfig.json" assert { type: "json" };
import ora from "ora";
export default class CustomClient extends Client {
    commands = new Collection();
    guildCommands = new Collection();
    buttonHandlers = [];
    splashGenerator = this.splashScreen();
    constructor(options) {
        super(options);
        this.on("ready", async () => {
            await this.splashGenerator.next();
        });
        (async () => await this.splashGenerator.next())();
    }
    async *splashScreen() {
        let loadingMessage;
        const beforeDate = Date.now();
        if (botConfig.credits)
            console.log("✨ \x1b[33mThanks for using DjsBotTemplateTS!\x1b[0m ✨\n");
        if (botConfig.splash)
            loadingMessage = ora({ text: "Client is starting..." }).start();
        yield;
        loadingMessage?.succeed("Client started!");
        if (botConfig.splash) {
            loadingMessage?.succeed(`started in ${(Date.now() - beforeDate) / 1000}s`);
            loadingMessage = ora({ text: "... out of ... logins remaining." }).start();
            const loginData = JSON.parse(await (await fetch("https://discord.com/api/v10/gateway/bot", { headers: { Authorization: `Bot ${process.env.TOKEN}` } })).text());
            loadingMessage.succeed(`${loginData.session_start_limit.remaining} out of ${loginData.session_start_limit.total} logins remaining`);
            loadingMessage = ora({ text: "webSocket ping is..." }).start();
        }
        if (this.ws.ping !== -1) {
            loadingMessage.succeed(`webSocket ping is ${this.ws.ping}`);
            return;
        }
        while (this.ws.ping === -1) {
            await new Promise((resolve) => {
                setTimeout(() => {
                    if (this.ws.ping !== -1)
                        loadingMessage.succeed(`webSocket ping is ${this.ws.ping}ms`);
                    resolve();
                }, 5000);
            });
        }
        console.log();
    }
}
//# sourceMappingURL=CustomClient.js.map