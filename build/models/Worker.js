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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importStar(require("mongoose"));
var config_json_1 = __importDefault(require("../config/config.json"));
var Content_1 = __importDefault(require("./Content"));
var models_1 = __importDefault(require("./models"));
mongoose_1.default.connect(config_json_1.default.service.database.url + "/" + config_json_1.default.service.database.name, { useNewUrlParser: true });
;
;
;
;
/**
 * Worker schema
 */
exports.WorkerSchema = new mongoose_1.Schema({
    modelName: { type: String, required: true, unique: true },
    targets: [{
            contentID: { type: Number, required: true },
            minClientVersion: { type: Number, required: true },
            maxClientVersion: { type: Number, required: true },
            path: { type: String, required: true },
            filter: { type: {} },
            projection: { type: {} },
            options: { type: {} }
        }]
});
/**
 * Get content
 * @param {string} contentID the content id
 * @param {string} clientVersion the client version
 */
exports.WorkerSchema.statics.updateAndPush = function (modelName, data, updateFn) {
    return __awaiter(this, void 0, void 0, function () {
        var model, worker;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    model = models_1.default[modelName];
                    if (!model)
                        return [2 /*return*/];
                    // perform updates
                    return [4 /*yield*/, Promise.all(data.map(updateFn))];
                case 1:
                    // perform updates
                    _a.sent();
                    return [4 /*yield*/, Worker.findOne({ modelName: modelName })];
                case 2:
                    worker = _a.sent();
                    if (!worker)
                        return [2 /*return*/];
                    // perform data push to content
                    worker.targets.forEach(function (target) {
                        var filter = target.filter, projection = target.projection, options = target.options;
                        // @ts-ignore
                        model.find(filter, projection, options)
                            .then(function (items) {
                            var contentID = target.contentID, minClientVersion = target.minClientVersion, maxClientVersion = target.maxClientVersion, path = target.path;
                            Content_1.default.updateTarget(contentID, minClientVersion, maxClientVersion, path, items);
                        });
                    });
                    return [2 /*return*/];
            }
        });
    });
};
var Worker = mongoose_1.default.model('Worker', exports.WorkerSchema, 'worker');
exports.default = Worker;