# Yoki (WIP)
Yet another Discord bot.

## Usage
> **Note: Requires Node >12.0.0**  
    - `git clone https://github.com/zaida04/Yoki.git`  
    - `pnpm i --r`  
    - Change knexfile.example.ts => knexfile.ts & supply ENV variables in a `bot.env` file in the root.
    - `pnpm run build`  
    - `pnpm run start::bot`  
    - `pnpm run start::dash`
    

## Commands
Coming soon.

## How can I contribute?
Yoki is structured almost like a monorepo, with each module of it (giveaway, logging, etc) in different folders in src/. The structure we are attempting to create is so that only one line has to be changed in the core to add another module. Just extend core/structures/modules.

## Scripts  
`pnpm start::bot` - Compile the bot and run it. 
`pnpm start::dash` - Compile the dashboard and run it.  
`pnpm run lint` - Lint `packages` 
`pnpm run build` - Compile `packages`

### LICENSING  
Created ~10/04/2020  

**Yoki** © [zaida04](https://github.com/zaida04), Released under the [MIT](https://github.com/zaida04/Yoki/blob/master/LICENSE) License.  
Authored and maintained by zaida04.

> GitHub [@zaida04](https://github.com/zaida04) 

