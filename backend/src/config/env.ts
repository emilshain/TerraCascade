import dotenv from "dotenv";
import path from "path";

dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

export const ENV = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 4000,
  TWILIO_ACCOUNT_SID: (process.env.TWILIO_ACCOUNT_SID || "AC03c41e3577a5439e59d1ff4ddb68a4cd").trim(),
  TWILIO_AUTH_TOKEN: (process.env.TWILIO_AUTH_TOKEN || "157f97d9d843dacbf18f27bb8ac770e2").trim(),
  TWILIO_FROM_NUMBER: (process.env.TWILIO_FROM_NUMBER || "+14754656961").trim(),
  ALERT_RECIPIENTS: (process.env.ALERT_RECIPIENTS || "+919539367173,+919074121510")
    .split(",")
    .map((num) => num.trim())
    .filter(Boolean),
};

