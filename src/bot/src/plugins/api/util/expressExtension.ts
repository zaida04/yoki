/* eslint-disable @typescript-eslint/no-namespace */

import { AkairoClient } from "discord-akairo";

declare global {
    namespace Express {
        interface Application {
            bot_client: AkairoClient;
        }
        interface Request {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: any;
        }
    }
}
