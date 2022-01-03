"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RustUp = void 0;
const fs_1 = require("fs");
const path = __importStar(require("path"));
const process = __importStar(require("process"));
const os = __importStar(require("os"));
const semver = __importStar(require("semver"));
const io = __importStar(require("@actions/io"));
const core = __importStar(require("@actions/core"));
const exec = __importStar(require("@actions/exec"));
const tc = __importStar(require("@actions/tool-cache"));
const PROFILES_MIN_VERSION = '1.20.1';
const COMPONENTS_MIN_VERSION = '1.20.1';
class RustUp {
    constructor(exePath) {
        this.path = exePath;
    }
    static async getOrInstall() {
        try {
            return await RustUp.get();
        }
        catch (error) {
            core.debug(`Unable to find "rustup" executable, installing it now. Reason: ${error}`);
            return await RustUp.install();
        }
    }
    static async get() {
        const exePath = await io.which('rustup', true);
        return new RustUp(exePath);
    }
    static async install() {
        const args = [
            '--default-toolchain',
            'none',
            '-y',
        ];
        switch (process.platform) {
            case 'darwin':
            case 'linux': {
                const rustupSh = await tc.downloadTool('https://sh.rustup.rs');
                core.debug(`Executing chmod 755 on the ${rustupSh}`);
                await fs_1.promises.chmod(rustupSh, 0o755);
                await exec.exec(rustupSh, args);
                break;
            }
            case 'win32': {
                const downloadPath = path.join(os.tmpdir(), "rustup-init.exe");
                try {
                    await fs_1.promises.unlink(downloadPath);
                }
                catch (e) {
                    console.trace(`Unable to delete: ${downloadPath} Error: ${e}`);
                }
                const rustupExe = await tc.downloadTool('https://win.rustup.rs', downloadPath);
                await exec.exec(rustupExe, args);
                break;
            }
            default:
                throw new Error(`Unknown platform ${process.platform}, can't install rustup`);
        }
        core.addPath(path.join(process.env.HOME, '.cargo', 'bin'));
        return new RustUp('rustup');
    }
    async installToolchain(name, options) {
        const args = ['toolchain', 'install', name];
        if (options) {
            if (options.components && options.components.length > 0) {
                for (const component of options.components) {
                    args.push('--component');
                    args.push(component);
                }
            }
            if (options.noSelfUpdate) {
                args.push('--no-self-update');
            }
            if (options.allowDowngrade) {
                args.push('--allow-downgrade');
            }
            if (options.force) {
                args.push('--force');
            }
        }
        await this.call(args);
        if (options && options.default) {
            await this.call(['default', name]);
        }
        if (options && options.override) {
            await this.call(['override', 'set', name]);
        }
        return 0;
    }
    async addTarget(name, forToolchain) {
        const args = ['target', 'add'];
        if (forToolchain) {
            args.push('--toolchain');
            args.push(forToolchain);
        }
        args.push(name);
        return await this.call(args);
    }
    async activeToolchain() {
        const stdout = await this.callStdout(['show', 'active-toolchain']);
        if (stdout) {
            return stdout.split(' ', 2)[0];
        }
        else {
            throw new Error('Unable to determine active toolchain');
        }
    }
    async supportProfiles() {
        const version = await this.version();
        const supports = semver.gte(version, PROFILES_MIN_VERSION);
        if (supports) {
            core.info(`Installed rustup ${version} support profiles`);
        }
        else {
            core.info(`Installed rustup ${version} does not support profiles, \
expected at least ${PROFILES_MIN_VERSION}`);
        }
        return supports;
    }
    async supportComponents() {
        const version = await this.version();
        const supports = semver.gte(version, COMPONENTS_MIN_VERSION);
        if (supports) {
            core.info(`Installed rustup ${version} support components`);
        }
        else {
            core.info(`Installed rustup ${version} does not support components, \
expected at least ${PROFILES_MIN_VERSION}`);
        }
        return supports;
    }
    async setProfile(name) {
        return await this.call(['set', 'profile', name]);
    }
    async version() {
        const stdout = await this.callStdout(['-V']);
        return stdout.split(' ')[1];
    }
    async which(program) {
        const stdout = await this.callStdout(['which', program]);
        if (stdout) {
            return stdout;
        }
        else {
            throw new Error(`Unable to find the ${program}`);
        }
    }
    async selfUpdate() {
        return await this.call(['self', 'update']);
    }
    async call(args, options) {
        return await exec.exec(this.path, args, options);
    }
    async callStdout(args, options) {
        let stdout = '';
        const resOptions = Object.assign({}, options, {
            listeners: {
                stdout: (buffer) => {
                    stdout += buffer.toString();
                },
            },
        });
        await this.call(args, resOptions);
        return stdout;
    }
}
exports.RustUp = RustUp;
//# sourceMappingURL=rustup.js.map