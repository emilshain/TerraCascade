import dotenv from "dotenv";
import path from "path";

dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

export const ENV = {
  get PORT(): number {
    return process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
  },
  get TWILIO_ACCOUNT_SID(): string {
    return (process.env.TWILIO_ACCOUNT_SID || "AC03c41e3577a5439e59d1ff4ddb68a4cd").trim();
  },
  get TWILIO_AUTH_TOKEN(): string {
    return (process.env.TWILIO_AUTH_TOKEN || "157f97d9d843dacbf18f27bb8ac770e2").trim();
  },
  get TWILIO_FROM_NUMBER(): string {
    return (process.env.TWILIO_FROM_NUMBER || "+14754656961").trim();
  },
  get ALERT_RECIPIENTS(): string[] {
    return (process.env.ALERT_RECIPIENTS || "+919539367173,+919074121510")
      .split(",")
      .map((num) => num.trim())
      .filter(Boolean);
  },
  get MONGODB_URI(): string {
    dotenv.config({ path: path.resolve(process.cwd(), ".env"), override: true });
    return (process.env.MONGODB_URI || "mongodb://localhost:27017/terracascade").trim();
  },
  get JWT_SECRET(): string {
    return (process.env.JWT_SECRET || "terracascade-dam-safety-command-jwt-secret-key-2026").trim();
  },
};



