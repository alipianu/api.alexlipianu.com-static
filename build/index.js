"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// // start api
// (new Server(config.service.id, errors, config.core.service.corsOptions))
//   .mountStaticRoutes({
//     '/images': join(__dirname, 'images')
//   })
//   .mountRoutes({
//     '/': {
//       get: {
//             '/test': Content.test
//           },
//     }
//     // '/content': {
//     //   get: {
//     //     '/:contentID/version/:clientVersion': Content.getContent,
//     //     '/test': Content.test
//     //   },
//     //   post: {
//     //     '/:contentID': Content.setContent
//     //   }
//     // }
//   })
//   .listen(config.core.service.port, NOTFOUND, () => console.log(`Listening on port ${config.core.service.port}..`));
var express = require('express');
var app = express();
app.get('/static', function (req, res) { return res.send('Hello World!'); });
app.listen(3002, function () { return console.log("Example app listening on port " + 3002 + "!"); });
