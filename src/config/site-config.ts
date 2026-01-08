/**
 * Site Configuration - The Master Toggle
 *
 * This file controls which features are visible/active in the app.
 * Edit this file to turn features on/off without touching code.
 */

export type Theme = "purple" | "blue" | "green" | "orange" | "pink" | "monochrome";

export type FeatureId =
  | "auth"
  | "projects"
  | "kits"
  | "components"
  | "sow-generator"
  | "instructions";

export interface SiteConfig {
  // App Metadata
  name: string;
  description: string;
  url: string;

  // Feature Flags - Turn modules on/off
  activeFeatures: FeatureId[];

  // UI Configuration
  theme: Theme;
  isCatalog: boolean;  // Show sidebar catalog of all modules
  showAdmin: boolean;  // Hidden admin panel toggle

  // Social & SEO
  links: {
    twitter?: string;
    github?: string;
    docs?: string;
  };
}

export const siteConfig: SiteConfig = {
  // App Metadata
  name: "Dot Fulfillment",
  description: "Kit-based manufacturing and fulfillment management system",
  url: "https://fulfillment.example.com",

  // Feature Flags
  // Add/remove features from this array to enable/disable them
  activeFeatures: [
    "auth",         // User authentication
    "projects",     // Quote/SOW creation
    "kits",         // Kit management
    "components",   // Component library
    "sow-generator", // SOW document generation
    "instructions"  // Instructions & documentation
  ],

  // UI Configuration
  theme: "blue",             // Default color scheme
  isCatalog: false,          // Simple app, no catalog sidebar
  showAdmin: false,          // Toggle admin features on/off

  // Social & SEO
  links: {
    github: "https://github.com/dotcorp/fulfillment-app",
  },
};

/**
 * Helper function to check if a feature is active
 */
export function isFeatureActive(featureId: FeatureId): boolean {
  return siteConfig.activeFeatures.includes(featureId);
}

/**
 * Get all active features
 */
export function getActiveFeatures(): FeatureId[] {
  return siteConfig.activeFeatures;
}

/**
 * Get current theme
 */
export function getCurrentTheme(): Theme {
  return siteConfig.theme;
}
