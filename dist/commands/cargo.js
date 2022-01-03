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
exports.Cargo = exports.resolveVersion = void 0;
const io = __importStar(require("@actions/io"));
const core = __importStar(require("@actions/core"));
const exec = __importStar(require("@actions/exec"));
const cache = __importStar(require("@actions/cache"));
const http = __importStar(require("@actions/http-client"));
const path = __importStar(require("path"));
async function resolveVersion(crate) {
    const url = `https://crates.io/api/v1/crates/${crate}`;
    const client = new http.HttpClient('@actions-rs (https://github.com/actions-rs/)');
    const resp = await client.getJson(url);
    if (resp.result == null) {
        throw new Error('Unable to fetch latest crate version');
    }
    return resp.result['crate']['newest_version'];
}
exports.resolveVersion = resolveVersion;
class Cargo {
    constructor(path) {
        this.path = path;
    }
    static async get() {
        try {
            const path = await io.which('cargo', true);
            return new Cargo(path);
        }
        catch (error) {
            core.error('cargo is not installed by default for some virtual environments, \
see https://help.github.com/en/articles/software-in-virtual-environments-for-github-actions');
            core.error('To install it, use this action: https://github.com/actions-rs/toolchain');
            throw error;
        }
    }
    async installCached(program, version, primaryKey, restoreKeys) {
        if (version == 'latest') {
            version = await resolveVersion(program);
        }
        if (primaryKey) {
            restoreKeys = restoreKeys || [];
            const paths = [path.join(path.dirname(this.path), program)];
            const programKey = program + '-' + version + '-' + primaryKey;
            const programRestoreKeys = restoreKeys.map((key) => program + '-' + version + '-' + key);
            const cacheKey = await cache.restoreCache(paths, programKey, programRestoreKeys);
            if (cacheKey) {
                core.info(`Using cached \`${program}\` with version ${version}`);
                return program;
            }
            else {
                const res = await this.install(program, version);
                try {
                    core.info(`Caching \`${program}\` with key ${programKey}`);
                    await cache.saveCache(paths, programKey);
                }
                catch (error) {
                    if (error.name === cache.ValidationError.name) {
                        throw error;
                    }
                    else if (error.name === cache.ReserveCacheError.name) {
                        core.info(error.message);
                    }
                    else {
                        core.info('[warning]' + error.message);
                    }
                }
                return res;
            }
        }
        else {
            return await this.install(program, version);
        }
    }
    async install(program, version) {
        const args = ['install'];
        if (version && version != 'latest') {
            args.push('--version');
            args.push(version);
        }
        args.push(program);
        try {
            core.startGroup(`Installing "${program} = ${version || 'latest'}"`);
            await this.call(args);
        }
        finally {
            core.endGroup();
        }
        return program;
    }
    async findOrInstall(program, version) {
        try {
            return await io.which(program, true);
        }
        catch (error) {
            core.info(`${program} is not installed, installing it now`);
        }
        return await this.installCached(program, version);
    }
    async call(args, options) {
        return await exec.exec(this.path, args, options);
    }
}
exports.Cargo = Cargo;
//# sourceMappingURL=cargo.js.map