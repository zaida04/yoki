# `@yoki/bot`
Contains the bot part of Yoki.

Modules start with a base of:
`module-name/index.ts (extends YokiModule)` Entry point for module 
`module-name/listeners/` Directory of all listeners for this certain module
`module-name/commands/` Directory of all commands for this certain module

The command and listeners dir is only neccessary if your module has commands or listeners

Example of a Yoki Module:
```ts
import { AkairoClient } from "discord-akairo";
import YokiModule from "../common/YokiModule";

export default class ModuleName extends YokiModule {
    public constructor(client: AkairoClient) {
        super(
            {
                id: "module-id",
                name: "module-name",
                commandDirectory: `${__dirname}/commands/`,
                listenerDirectory: `${__dirname}/listeners/`
            },
            client
        );
    }
}
```