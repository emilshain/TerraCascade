import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export type OfficerRole = "kseb_epm" | "district_eoc" | "district_collector" | "budget_planner";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: OfficerRole;
  badgeId: string;
  agency: string;
  phoneNumber?: string;
  isVerified: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
  toSafeObject(): SafeUser;
}

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: OfficerRole;
  badgeId: string;
  agency: string;
  phoneNumber?: string;
  isVerified: boolean;
  lastLogin?: string;
  createdAt: string;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: ["kseb_epm", "district_eoc", "district_collector", "budget_planner"],
      default: "kseb_epm",
      required: true,
    },
    badgeId: {
      type: String,
      required: [true, "Officer / Badge ID is required"],
      trim: true,
    },
    agency: {
      type: String,
      required: [true, "Agency / Department is required"],
      trim: true,
      default: "Kerala Disaster Management Authority",
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before save
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


// Compare password method
UserSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

// Safe object representation
UserSchema.methods.toSafeObject = function (): SafeUser {
  return {
    id: this._id ? this._id.toString() : this.id,
    name: this.name,
    email: this.email,
    role: this.role,
    badgeId: this.badgeId,
    agency: this.agency,
    phoneNumber: this.phoneNumber,
    isVerified: this.isVerified,
    lastLogin: this.lastLogin?.toISOString(),
    createdAt: this.createdAt ? this.createdAt.toISOString() : new Date().toISOString(),
  };
};

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
