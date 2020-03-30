"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var cors_1 = __importDefault(require("cors"));
var body_parser_1 = require("body-parser");
var endpoint_1 = require("./endpoint");
var config_json_1 = __importDefault(require("@config/config.json"));
var apiPath = config_json_1.default.service.path;
/**
 * Server class
 */
var Server = /** @class */ (function () {
    /**
     * Creates server
     * @param {any} options the server options
     */
    function Server(options) {
        if (options === void 0) { options = {}; }
        this.methods = options.methods.split(',').map(function (x) { return x.toLowerCase(); });
        this.express = express_1.default();
        this.cors = options;
        this.express.use(cors_1.default(this.cors));
        // parse application/x-www-form-urlencoded
        this.express.use(body_parser_1.urlencoded({ extended: false }));
        // parse application/json
        this.express.use(body_parser_1.json());
        this.express.use(body_parser_1.text());
        // cookie parser
        this.express.use(cookie_parser_1.default());
        // cors
        if (options.origin) {
            options.origin = RegExp(options.origin);
        }
        this.express.options('*', cors_1.default(this.cors));
    }
    /**
     * Mounts server routes
     * @param {Array<any>} routesObj the routes object
     * @returns {this} server instance
     */
    Server.prototype.mountRoutes = function (routesObj) {
        var _this = this;
        Object.keys(routesObj).forEach(function (routeBase) {
            var router = express_1.default.Router();
            _this.methods.forEach(function (method) {
                if (routesObj[routeBase][method]) {
                    Object.keys(routesObj[routeBase][method]).forEach(function (routeEnd) {
                        router[method](routeEnd, cors_1.default(_this.cors), (new endpoint_1.Endpoint(method, routesObj[routeBase][method][routeEnd]).endpoint));
                    });
                }
            });
            _this.express.use("" + apiPath + routeBase, router);
        });
        return this;
    };
    /**
     * Mounts server static routes
     * @param {Array<any>} staticRoutesObj the static routes object
     * @returns {this} server instance
     */
    Server.prototype.mountStaticRoutes = function (staticRoutesObj) {
        var _this = this;
        Object.keys(staticRoutesObj).forEach(function (routeBase) {
            _this.express.use(routeBase, express_1.default.static(staticRoutesObj[routeBase]));
        });
        return this;
    };
    /**
     * Starts server
     * @param {number} port port number
     * @param {Function} routeErrorCallback the route error callback
     * @param {Function} listeningListener the onListen callback
     * @returns {this} server instance
     */
    Server.prototype.listen = function (port, routeErrorCallback, listeningListener) {
        // handle unknown routes
        if (routeErrorCallback) {
            this.express.get('*', routeErrorCallback);
        }
        // start listening
        this.express.listen(port, listeningListener);
        return this;
    };
    return Server;
}());
exports.Server = Server;
;
