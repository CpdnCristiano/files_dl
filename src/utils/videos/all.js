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
const scraper_1 = require("@bochilteam/scraper");
const download_files_1 = __importDefault(require("../download_files"));
const downloadVideosFromAllPlatforms = (url) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        var files = [];
        var result = yield (0, scraper_1.savefrom)(url);
        if (result) {
            for (let v of result) {
                if (v.url) {
                    for (const u of v.url) {
                        var file = yield (0, download_files_1.default)(u.url, 'savefrom', {
                            extension: u.ext,
                            quality: (_a = u.quality) === null || _a === void 0 ? void 0 : _a.toString(),
                        });
                        files.push(file);
                    }
                }
            }
        }
        return files;
    }
    catch (error) {
        return [];
    }
});
exports.default = downloadVideosFromAllPlatforms;
