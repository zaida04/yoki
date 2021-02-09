<img src="static/yoki-readme.png" alt="Yoki Face" width='350' align="right">
 
# Yoki (WIP) 
[![Discord][discord-badge]][discord-link] 
![Build][ts-badge]
![Linting][lint-badge]  
Kitchen sink'ing to the max.

## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
  * [Features](#features)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Contributing](#contributing)
* [TODO](#todo)
* [License](#licensing)

## TODO
* bot service
* api service
* dashboard service
* docker deploy files
* docker compose files
* write typings

## Features
* Moderation
* Audit Logging
* Message Filtering
* Reaction Roles
* Custom Commands (tags)
* Ticketing
* Giveaways

## About the Project  
Yoki has gone through a couple of rewrites at this point, going from a sub-guild oriented bot to a full fledged kitchen sink bot.

### Built with  
* [discord.js](https://github.com/discordjs/discord.js)  
* [discord-akairo](https://github.com/discord-akairo/discord-akairo)  
* [knex.js](https://github.com/knex/knex)  

## Getting Started

### Prerequisites
Yoki **requires Node.js >=12** due to its dependency on discord.js.  

### Installation 

> Requires [docker](https://docs.docker.com/get-started/overview/) and [docker-compose](https://docs.docker.com/compose/)

- `git clone https://github.com/zaida04/Yoki.git`
- `cd yoki` 
- supply ENV variables. 
- `docker-compose up -d`

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

It's advised to use an sqlite database for testing purposes. You must install this yourself.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## LICENSING  
> **Yoki** © [zaida04](https://github.com/zaida04), Released under the [MIT](https://github.com/zaida04/Yoki/blob/master/LICENSE) License.  

<!-- MARKDOWN LINKS & IMAGES -->
[discord-link]: https://discord.gg/jf66UUN
[discord-badge]: https://img.shields.io/discord/732714723744940032.svg?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2 
[ts-badge]: https://github.com/zaida04/Yoki/workflows/TypeScript/badge.svg
[lint-badge]: https://github.com/zaida04/Yoki/workflows/Linting/badge.svg
