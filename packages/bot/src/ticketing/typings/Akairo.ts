import TicketManager from "../TicketManager";
declare module "discord-akairo" {
    interface AkairoClient {
        tickets: TicketManager;
    }
}
