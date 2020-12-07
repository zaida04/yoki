<img src="static/yoki-readme.png" alt="Yoki Face" width='350' align="right">
 
# Yoki (WIP) 
[![Discord][discord-badge]][discord-link] 
![Build][ts-badge]
![Linting][lint-badge]  
General usage discord bot aimed at cutting down the amount of bots needed in a server  

## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
  * [Features](#features)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Commands](#commands)
* [Contributing](#contributing)
* [TODO](#todo)
* [License](#licensing)

## Features
* Moderation
* Audit Logging
* Message Filtering
* Reaction Roles
* Custom Commands (tags)
* Ticketing
* Giveaways

## About the Project  
Yoki was built out of a desire to cut down the amount of bots that had to be invited to a discord server. It's original purpose was to allow sub-guilds in a guild, but was later repurposed to be a general usage discord bot.

### Built with  
* [discord.js](https://github.com/discordjs/discord.js)  
* [discord-akairo](https://github.com/discord-akairo/discord-akairo)  
* [knex.js](https://github.com/knex/knex)  

## Getting Started

### Prerequisites
Yoki **requires Node.js >=12** due to the dependency on discord.js.  
Yoki **advises you use PNPM** due to it's monorepo setup. You can use npm, but it will be much more of a hassle.

**You must enable the SERVER MEMBERS intent in https://discord.com/developers/applications**

### Installation 

1. Normal
- `git clone https://github.com/zaida04/Yoki.git`  
- `cd yoki`
- `pnpm i --r`  
- Change `knexfile.example.js` => `knexfile.js`  
- supply ENV variables in a `bot.env` file in the root.  
- `pnpm run build`  
- `pnpm run knex:init`
- `pnpm run start:bot` 
    
2. Docker
> Requires [docker](https://docs.docker.com/get-started/overview/) and [docker-compose](https://docs.docker.com/compose/)

- `git clone https://github.com/zaida04/Yoki.git`
- `cd yoki`
- Change `knexfile.example.js` => `knexfile.js`  
- supply ENV variables in a `bot.env` file in the root.  
- `docker-compose up -d`

## Commands
Coming soon.

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

It's advised to use an sqlite database for testing purposes. You must install this yourself.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Yoki is structured as a monorepo  

`lib/` - Custom libraries  
`packages/` - Main applications     
`packages/bot` - Where the bot part of Yoki lives  
`packages/bot/src/core/` - Being the core of Yoki  
`packages/bot/src/common/` - Being things that more than one folder share in dependency  
`packages/bot/**` - Most of the other dirs are modules (such as audit logging, moderation, etc)  
`packages/dashboard` - Dashboard for Yoki

## LICENSING  
> **Yoki** © [zaida04](https://github.com/zaida04), Released under the [MIT](https://github.com/zaida04/Yoki/blob/master/LICENSE) License.  

<!-- MARKDOWN LINKS & IMAGES -->
[discord-link]: https://discord.gg/jf66UUN
[discord-badge]: https://img.shields.io/discord/732714723744940032.svg?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2 
[ts-badge]: https://github.com/zaida04/Yoki/workflows/TypeScript/badge.svg
[lint-badge]: https://github.com/zaida04/Yoki/workflows/Linting/badge.svg
