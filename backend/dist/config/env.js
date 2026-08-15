"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV = void 0;
exports.ENV = {
    PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 4000,
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || "AC03c41e3577a5439e59d1ff4ddb68a4cd",
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || "8c8b3155cea918041ec5e6244131675a",
    TWILIO_FROM_NUMBER: process.env.TWILIO_FROM_NUMBER || "+14754656961",
    ALERT_RECIPIENTS: (process.env.ALERT_RECIPIENTS || "+919539367173,+919074121510")
        .split(",")
        .map((num) => num.trim())
        .filter(Boolean),
};
