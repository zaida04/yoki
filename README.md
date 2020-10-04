# AkairoTemplate  
A template for Akairo based TS Discord.js Bots.   

## What is this?  
This is my personal structure template for Akairo based TS Discord.js Bots. Comes with a QueryBuilder called `knex.js`, with compatibility with multiple types of SQL databases.  

## Structure  
`src/core/client/Client.ts` - Main Akairo Client.  
`src/core/index.ts` - Main script that runs the client and related packages.  
`src/core/listeners/**` - Listeners for the Client.  
`src/core/commands/**` - Non Packaged commands for the client.  
`src/core/inhibitors/**` - Inhibitors for the Client.  
`src/core/managers/**` - Managers for structures.
`src/core/structures/**` - Custom/Extended Structures.

## Scripts  
`npm start` - Run the bot using ts-node  
`npm run start::build` - Compile the bot, and run the compiled source.  
`npm run lint` - Lint the TS of the bot  
`npm run build` - Compile the bot  

### LICENSING  
Created ~10/03/2020  

**AkairoTemplate** © [zaida04](https://github.com/zaida04), Released under the [MIT](https://github.com/zaida04/AkairoTemplate/blob/master/LICENSE) License.  
Authored and maintained by zaida04.

> GitHub [@zaida04](https://github.com/zaida04) 

