import mongoose, { Schema, Document } from 'mongoose';

/**
 * SiteSettings Schema
 * Stores global site settings like contact info, social links, branding, etc.
 */
export interface ISiteSettings extends Document {
  key: string;
  value: string | Record<string, unknown>;
  category: 'general' | 'contact' | 'social' | 'branding' | 'seo';
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    value: {
      type: Schema.Types.Mixed,
      required: true,
    },
    category: {
      type: String,
      enum: ['general', 'contact', 'social', 'branding', 'seo'],
      default: 'general',
    },
  },
  {
    timestamps: true,
  }
);

SiteSettingsSchema.index({ category: 1 });

export const SiteSettings = mongoose.models.SiteSettings || mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);