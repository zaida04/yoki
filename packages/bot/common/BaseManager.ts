import { AkairoClient } from "discord-akairo";
import { Collection } from "discord.js";

export default abstract class BaseManager<T, D> {
    public cache: Collection<string, T>;

    public constructor(public client: AkairoClient) {
        this.cache = new Collection();
    }

    public abstract create(data: D): Promise<T>;
}
