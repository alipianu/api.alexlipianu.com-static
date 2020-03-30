"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_json_1 = __importDefault(require("../../config.json"));
var errors_json_1 = __importDefault(require("./errors.json"));
var statuses_json_1 = __importDefault(require("./statuses.json"));
/**
 * Responds with an error
 */
exports.__ERROR__ = function (error, status) {
    // @ts-ignore
    throw { error: (error || "0000"), status: (statuses_json_1.default[status] || statuses_json_1.default["FATAL"]) };
};
;
;
/**
 * Controller for path mismatch
 */
exports.NOTFOUND = function () { return exports.__ERROR__("0001", "NOTFOUND"); };
/**
 * Endpoint model
 */
var Endpoint = /** @class */ (function () {
    /**
     * Create Endpoint instance
     * @param {string} method the endpoint method
     * @param {IPostEndpoint|IGetEndpoint} endpoint the endpoint
     */
    function Endpoint(method, endpoint) {
        this.endpoint = function (req, res) {
            return __awaiter(this, void 0, void 0, function () {
                var error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 5, , 6]);
                            this.req = req;
                            this.res = res;
                            if (!(method === 'post')) return [3 /*break*/, 2];
                            return [4 /*yield*/, endpoint.bind(this)(req.body, req.query)];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, endpoint.bind(this)(req.query)];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            error_1 = _a.sent();
                            if (error_1) {
                                this.res.status(error_1.status.status).send(__assign(__assign({}, error_1.status), { error: __assign(__assign({}, errors_json_1.default[error_1.code]), { code: config_json_1.default.service.id + error_1.code }) }));
                            }
                            return [3 /*break*/, 6];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        this.endpoint = this.endpoint.bind(this);
    }
    /**
     * Gets a cookie's value
     */
    Endpoint.prototype.getCookie = function (cookie) {
        return this.req.cookies[cookie.name];
    };
    /**
     * Clears a cookie
     */
    Endpoint.prototype.clearCookie = function (cookie) {
        this.res.clearCookie(cookie.name);
    };
    Endpoint.prototype.setCookie = function (cookie, value) {
        this.res.cookie(cookie.name, value, { maxAge: cookie.maxAge });
    };
    /**
     * Sends a 200 response
     * @param {*} data the data
     */
    Endpoint.prototype.respond = function (data) {
        if (data === void 0) { data = {}; }
        this.res.send({ name: "OK", status: 200, data: data });
        throw undefined;
    };
    /**
     * Redirects to another microservice
     * @param {string} service the service name
     */
    Endpoint.prototype.redirect = function (service) {
        this.res.redirect(config_json_1.default.services.api + "/" + service);
        throw undefined;
    };
    return Endpoint;
}());
exports.Endpoint = Endpoint;
;
