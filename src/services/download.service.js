"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const url_utils_1 = require("../utils/url_utils");
const api_error_1 = require("../core/api_error");
const all_1 = __importDefault(require("../utils/videos/all"));
const prisma_1 = __importDefault(require("../prisma"));
const get_files_save_1 = __importDefault(require("./get_files_save"));
const createOrFinUrl_1 = __importDefault(require("./createOrFinUrl"));
const host_enum_1 = require("../models/host.enum");
const hostDl = {
    [host_enum_1.Host.FACEBOOK]: () => { },
    [host_enum_1.Host.TWITTER]: () => { },
    [host_enum_1.Host.INSTAGRAM]: () => { },
    [host_enum_1.Host.INSTAGRAM_PROFILE]: () => { },
    [host_enum_1.Host.PINTEREST]: () => { },
};
const downloadService = (url) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(0, url_utils_1.isUrl)(url)) {
        throw new api_error_1.ApiError(400, 'Invalid URL');
    }
    const savedFiles = yield (0, get_files_save_1.default)(url);
    if (savedFiles.length > 0) {
        return savedFiles;
    }
    let filesModel = [];
    const host = (0, url_utils_1.getHost)(url);
    if (hostDl.hasOwnProperty(host)) {
        filesModel = yield hostDl[host](url);
    }
    else {
        filesModel = yield (0, all_1.default)(url);
    }
    yield (0, createOrFinUrl_1.default)(url);
    const result = [];
    for (const fileModel of filesModel) {
        const createdFile = yield prisma_1.default.file.create({
            data: {
                size: fileModel.size,
                path: fileModel.path,
                errorMessage: fileModel.errorMessage,
                quality: fileModel.quality,
                type: fileModel.type,
                url: {
                    connect: { url: url },
                },
            },
        });
        result.push(createdFile);
    }
    return result;
});
exports.default = downloadService;
