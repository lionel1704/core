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
exports.getInputAsArray = exports.getInputList = exports.getInputBool = exports.getInput = void 0;
const core = __importStar(require("@actions/core"));
function getInput(name, options) {
    const inputFullName = name.replace(/-/g, '_');
    const value = core.getInput(inputFullName, options);
    if (value.length > 0) {
        return value;
    }
    return core.getInput(name, options);
}
exports.getInput = getInput;
function getInputBool(name, options) {
    const value = getInput(name, options);
    if (value && (value === 'true' || value === '1')) {
        return true;
    }
    else {
        return false;
    }
}
exports.getInputBool = getInputBool;
function getInputList(name, options) {
    const raw = getInput(name, options);
    return raw
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
}
exports.getInputList = getInputList;
function getInputAsArray(name, options) {
    return getInput(name, options)
        .split('\n')
        .map((s) => s.trim())
        .filter((x) => x !== '');
}
exports.getInputAsArray = getInputAsArray;
//# sourceMappingURL=input.js.map