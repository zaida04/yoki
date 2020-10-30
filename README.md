<img src="static/yoki-readme.png" alt="Yoki Face" width='350' align="right">
 
# Yoki (WIP) 
[![Discord](https://img.shields.io/discord/732714723744940032.svg?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2)](https://discord.gg/jf66UUN) ![Build](https://github.com/zaida04/Yoki/workflows/TypeScript/badge.svg) ![Linting](https://github.com/zaida04/Yoki/workflows/Linting/badge.svg)  
A general usage discord bot made with discord.js  

 
## Installation 
> **Note: Requires Node >12.0.0**  
- `git clone https://github.com/zaida04/Yoki.git`  
- `pnpm i --r`  
- Change knexfile.example.ts => knexfile.ts & supply ENV variables in a `bot.env` file in the root.  
- `pnpm run build`  
- `pnpm run start::bot` 
    

## Commands
Coming soon.

## More Info
Yoki is structured as a monorepo  
Custom unrelated libraries in `lib/` (like logger and database)

`packages/` - Main applications     
`packages/bot` - Where the bot part of Yoki lives
`packages/bot/core/` - Being the core of Yoki  
`packages/bot/common/` - Being things that more than one folder share in dependency  
`packages/bot/typings/` - Typings for Bot related structures
`packages/bot/**` - Most of the other dirs are modules (such as audit logging, moderation, etc)

## Contributing
All PRs are welcome. People of any experience are free to open a PR and recieve feedback on how to make them ready for Yoki.

### LICENSING  
Created ~10/04/2020  

**Yoki** © [zaida04](https://github.com/zaida04), Released under the [MIT](https://github.com/zaida04/Yoki/blob/master/LICENSE) License.  
Authored and maintained by zaida04.

> GitHub [@zaida04](https://github.com/zaida04) 

