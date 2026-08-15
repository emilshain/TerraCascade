import { ENV } from "../config/env.js";

export interface SmsDispatchResult {
  recipient: string;
  success: boolean;
  messageSid?: string;
  status?: string;
  error?: string;
}

export class SmsService {
  private accountSid: string;
  private authToken: string;
  private fromNumber: string;

  constructor() {
    this.accountSid = ENV.TWILIO_ACCOUNT_SID;
    this.authToken = ENV.TWILIO_AUTH_TOKEN;
    this.fromNumber = ENV.TWILIO_FROM_NUMBER;
  }

  /**
   * Format phone number to international E.164 standard (defaulting to +91 India if 10 digits)
   */
  private formatPhoneNumber(raw: string): string {
    const cleaned = raw.replace(/[^\d+]/g, "");
    if (cleaned.startsWith("+")) return cleaned;
    if (cleaned.length === 10) return `+91${cleaned}`;
    return `+${cleaned}`;
  }

  /**
   * Dispatch an SMS alert via Twilio REST API
   */
  public async sendSms(toRaw: string, messageBody: string): Promise<SmsDispatchResult> {
    const rawSid = process.env.TWILIO_ACCOUNT_SID;
    const accountSid = (rawSid && rawSid.startsWith("AC") && rawSid.length > 20)
      ? rawSid.trim()
      : "AC03c41e3577a5439e59d1ff4ddb68a4cd";

    const rawToken = process.env.TWILIO_AUTH_TOKEN;
    const authToken = (rawToken && rawToken.length > 20)
      ? rawToken.trim()
      : "157f97d9d843dacbf18f27bb8ac770e2";

    const rawFrom = process.env.TWILIO_FROM_NUMBER;
    const fromNumber = (rawFrom && rawFrom.startsWith("+"))
      ? rawFrom.trim()
      : "+14754656961";

    const to = this.formatPhoneNumber(toRaw);
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const credentials = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

    const params = new URLSearchParams();
    params.append("To", to);
    params.append("From", fromNumber);
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

      const data = (await response.json()) as any;

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
    } catch (err: any) {
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
  public async dispatchAlertSms(
    messageBody: string,
    recipients: string[] = ENV.ALERT_RECIPIENTS
  ): Promise<SmsDispatchResult[]> {
    const targetNumbers = recipients.length > 0 ? recipients : ENV.ALERT_RECIPIENTS;
    const results = await Promise.all(
      targetNumbers.map((num) => this.sendSms(num, messageBody))
    );
    return results;
  }
}

export const smsService = new SmsService();
