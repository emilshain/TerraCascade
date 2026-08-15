export interface SmsDispatchResult {
    recipient: string;
    success: boolean;
    messageSid?: string;
    status?: string;
    error?: string;
}
export declare class SmsService {
    private accountSid;
    private authToken;
    private fromNumber;
    constructor();
    /**
     * Format phone number to international E.164 standard (defaulting to +91 India if 10 digits)
     */
    private formatPhoneNumber;
    /**
     * Dispatch an SMS alert via Twilio REST API
     */
    sendSms(toRaw: string, messageBody: string): Promise<SmsDispatchResult>;
    /**
     * Dispatch SMS alert to multiple recipients in parallel
     */
    dispatchAlertSms(messageBody: string, recipients?: string[]): Promise<SmsDispatchResult[]>;
}
export declare const smsService: SmsService;
