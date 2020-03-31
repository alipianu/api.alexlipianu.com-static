"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = require("../../../core/server");
var config_json_1 = __importDefault(require("./config/config.json"));
var errors_json_1 = __importDefault(require("./config/errors.json"));
var endpoint_1 = require("../../../core/endpoint");
var Content_1 = __importDefault(require("./controllers/Content"));
var path_1 = require("path");
// start api
(new server_1.Server(config_json_1.default.service.id, errors_json_1.default, config_json_1.default.core.service.corsOptions))
    .mountStaticRoutes({
    '/images': path_1.join(__dirname, 'images')
})
    .mountRoutes({
    '/': {
        get: {
            '/test': Content_1.default.test
        },
    }
    // '/content': {
    //   get: {
    //     '/:contentID/version/:clientVersion': Content.getContent,
    //     '/test': Content.test
    //   },
    //   post: {
    //     '/:contentID': Content.setContent
    //   }
    // }
})
    .listen(config_json_1.default.core.service.port, endpoint_1.NOTFOUND, function () { return console.log("Listening on port " + config_json_1.default.core.service.port + ".."); });
