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
const tikTokVideoDl = (url) => __awaiter(void 0, void 0, void 0, function* () {
    const sever1 = yield tiktokServer1(url);
    if (sever1.length > 0)
        return sever1;
    const sever2 = yield tiktokServer1(url);
    if (sever2.length > 0)
        return sever2;
    return [];
});
exports.default = tikTokVideoDl;
const tiktokServer1 = (url) => __awaiter(void 0, void 0, void 0, function* () {
    var files = [];
    try {
        var result = yield (0, scraper_1.tiktokdl)(url);
        if (result.video) {
            try {
                var file = yield (0, download_files_1.default)(result.video.no_watermark, 'tiktok/tikmate');
                files.push(file);
            }
            catch (error) { }
            try {
                var file = yield (0, download_files_1.default)(result.video.no_watermark_hd, 'tiktok/tikmate');
                files.push(file);
            }
            catch (error) { }
        }
    }
    catch (error) {
        console.error(error);
    }
    return files;
});
