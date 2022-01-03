export declare function resolveVersion(crate: string): Promise<string>;
export declare class Cargo {
    private readonly path;
    private constructor();
    static get(): Promise<Cargo>;
    installCached(program: string, version?: string, primaryKey?: string, restoreKeys?: string[]): Promise<string>;
    install(program: string, version?: string): Promise<string>;
    findOrInstall(program: string, version?: string): Promise<string>;
    call(args: string[], options?: {}): Promise<number>;
}
