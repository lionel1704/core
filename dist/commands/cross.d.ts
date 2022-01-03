export declare class Cross {
    private readonly path;
    private constructor();
    static getOrInstall(): Promise<Cross>;
    static get(): Promise<Cross>;
    static install(version?: string): Promise<Cross>;
    call(args: string[], options?: {}): Promise<number>;
}
