"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), ".env") });
exports.ENV = {
    PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 4000,
    TWILIO_ACCOUNT_SID: (process.env.TWILIO_ACCOUNT_SID || "AC03c41e3577a5439e59d1ff4ddb68a4cd").trim(),
    TWILIO_AUTH_TOKEN: (process.env.TWILIO_AUTH_TOKEN || "157f97d9d843dacbf18f27bb8ac770e2").trim(),
    TWILIO_FROM_NUMBER: (process.env.TWILIO_FROM_NUMBER || "+14754656961").trim(),
    ALERT_RECIPIENTS: (process.env.ALERT_RECIPIENTS || "+919539367173,+919074121510")
        .split(",")
        .map((num) => num.trim())
        .filter(Boolean),
};
