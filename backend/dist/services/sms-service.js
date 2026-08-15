"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.smsService = exports.SmsService = void 0;
const env_js_1 = require("../config/env.js");
class SmsService {
    accountSid;
    authToken;
    fromNumber;
    constructor() {
        this.accountSid = env_js_1.ENV.TWILIO_ACCOUNT_SID;
        this.authToken = env_js_1.ENV.TWILIO_AUTH_TOKEN;
        this.fromNumber = env_js_1.ENV.TWILIO_FROM_NUMBER;
    }
    /**
     * Format phone number to international E.164 standard (defaulting to +91 India if 10 digits)
     */
    formatPhoneNumber(raw) {
        const cleaned = raw.replace(/[^\d+]/g, "");
        if (cleaned.startsWith("+"))
            return cleaned;
        if (cleaned.length === 10)
            return `+91${cleaned}`;
        return `+${cleaned}`;
    }
    /**
     * Dispatch an SMS alert via Twilio REST API
     */
    async sendSms(toRaw, messageBody) {
        const to = this.formatPhoneNumber(toRaw);
        const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`;
        const credentials = Buffer.from(`${this.accountSid}:${this.authToken}`).toString("base64");
        const params = new URLSearchParams();
        params.append("To", to);
        params.append("From", this.fromNumber);
        params.append("Body", messageBody);
        try {
            const response = await fetch(twilioUrl, {
                method: "POST",
                headers: {
                    Authorization: `Basic ${credentials}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: params.toString(),
            });
            const data = (await response.json());
            if (!response.ok) {
                return {
                    recipient: to,
                    success: false,
                    error: data.message || `HTTP ${response.status}: Twilio send failed`,
                };
            }
            return {
                recipient: to,
                success: true,
                messageSid: data.sid,
                status: data.status,
            };
        }
        catch (err) {
            return {
                recipient: to,
                success: false,
                error: err.message || "Failed to reach Twilio API",
            };
        }
    }
    /**
     * Dispatch SMS alert to multiple recipients in parallel
     */
    async dispatchAlertSms(messageBody, recipients = env_js_1.ENV.ALERT_RECIPIENTS) {
        const targetNumbers = recipients.length > 0 ? recipients : env_js_1.ENV.ALERT_RECIPIENTS;
        const results = await Promise.all(targetNumbers.map((num) => this.sendSms(num, messageBody)));
        return results;
    }
}
exports.SmsService = SmsService;
exports.smsService = new SmsService();
