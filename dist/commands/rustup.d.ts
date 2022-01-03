declare type Profile = 'minimal' | 'default' | 'full';
export interface ToolchainOptions {
    default?: boolean;
    override?: boolean;
    components?: string[];
    noSelfUpdate?: boolean;
    allowDowngrade?: boolean;
    force?: boolean;
}
export declare class RustUp {
    private readonly path;
    private constructor();
    static getOrInstall(): Promise<RustUp>;
    static get(): Promise<RustUp>;
    static install(): Promise<RustUp>;
    installToolchain(name: string, options?: ToolchainOptions): Promise<number>;
    addTarget(name: string, forToolchain?: string): Promise<number>;
    activeToolchain(): Promise<string>;
    supportProfiles(): Promise<boolean>;
    supportComponents(): Promise<boolean>;
    setProfile(name: Profile): Promise<number>;
    version(): Promise<string>;
    which(program: string): Promise<string>;
    selfUpdate(): Promise<number>;
    call(args: string[], options?: {}): Promise<number>;
    callStdout(args: string[], options?: {}): Promise<string>;
}
export {};
