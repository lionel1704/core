declare type GitHub = any;
interface Output {
    title: string;
    summary: string;
    text: string;
}
export declare class CheckReporter {
    private readonly client;
    private readonly checkName;
    private checkId;
    constructor(client: GitHub, checkName: string);
    startCheck(status?: 'queued' | 'in_progress' | 'completed'): Promise<number>;
    finishCheck(conclusion: 'cancelled' | 'success' | 'failure' | 'neutral' | 'timed_out' | 'action_required', output: Output): Promise<void>;
    cancelCheck(): Promise<void>;
}
export {};
