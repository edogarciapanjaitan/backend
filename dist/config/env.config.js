"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SECRET_KEY = exports.PORT = void 0;
require("dotenv/config");
const PORT = process.env.PORT || 8000;
exports.PORT = PORT;
const SECRET_KEY = process.env.SECRET_KEY || "";
exports.SECRET_KEY = SECRET_KEY;
