import { AkairoClient } from "discord-akairo";

export default abstract class Scheduler<T> {
    public timeouts: Map<string, NodeJS.Timeout> = new Map();

    public constructor(public readonly client: AkairoClient, public readonly checkRate: number) {}
    public abstract init(): void;
}
