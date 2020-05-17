"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = require("../../../../core/server");
var config_json_1 = __importDefault(require("./config/config.json"));
var errors_json_1 = __importDefault(require("./config/errors.json"));
var Content_1 = __importDefault(require("./controllers/Content"));
var Activity_1 = __importDefault(require("./workers/Activity"));
// start api
(new server_1.Server(config_json_1.default.service.id, config_json_1.default.service.name, errors_json_1.default, config_json_1.default.service.cors))
    .mountStaticRoutes({
    '/images': process.env.API_IMAGE_PATH
})
    .mountRoutes({
    '/content': {
        get: {
            '/:contentID/version/:clientVersion': Content_1.default.getContent
        }
    }
})
    .mountWorkers({
    // 2 min, for testing purposes
    60000: [Activity_1.default.getLatest]
})
    .listen(config_json_1.default.service.port, function () { return console.log(config_json_1.default.service.name + "-" + config_json_1.default.service.id + " service running on port " + config_json_1.default.service.port + ".."); });
