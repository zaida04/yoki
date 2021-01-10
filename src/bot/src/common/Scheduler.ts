import { AkairoClient } from "discord-akairo";

export default abstract class Scheduler<T> {
    public timeouts: Map<string, NodeJS.Timeout> = new Map();

    public abstract sweeper(): Promise<void>;
    public abstract sweep(input: T): Promise<void>;
    public constructor(public readonly client: AkairoClient, public readonly checkRate: number) {}
    public init() {
        void this.sweeper().then(() => {
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            this.client.setInterval(() => this.sweeper(), this.checkRate * 1000);
        });
        return this;
    }
}
