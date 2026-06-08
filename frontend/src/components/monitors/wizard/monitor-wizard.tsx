import { useState } from 'react';
import { BasicConfigStep } from './basic-config-step';
import { AdvancedSettingsStep } from './advanced-settings-step';
import { ReviewStep } from './review-step';

export interface WizardStep {
  id: number;
  title: string;
  description: string;
  component: React.ComponentType<any>;
}

export interface MonitorWizardFormData {
  // Basic Configuration
  name: string;
  url: string;
  method: string;
  interval: number;
  
  // Advanced Settings
  timeout?: number;
  expectedStatus?: number;
  expectedKeyword?: string;
  headers?: Record<string, string>;
  body?: string;
  authType?: 'none' | 'basic' | 'bearer' | 'api-key';
  authUsername?: string;
  authPassword?: string;
  authToken?: string;
  authApiKey?: string;
  authApiKeyHeader?: string;
  
  // Alert Settings
  emailAlerts?: boolean;
  webhookAlerts?: boolean;
  webhookUrl?: string;
  alertOnDown?: boolean;
  alertOnUp?: boolean;
  alertOnDegraded?: boolean;
  
  // Advanced Monitoring
  followRedirects?: boolean;
  ignoreSSL?: boolean;
  retryAttempts?: number;
  retryDelay?: number;
}

export const WizardSteps: WizardStep[] = [
  {
    id: 1,
    title: 'Basic Configuration',
    description: 'Set up the basic details for your monitor',
    component: BasicConfigStep,
  },
  {
    id: 2,
    title: 'Advanced Settings',
    description: 'Configure advanced monitoring options',
    component: AdvancedSettingsStep,
  },
  {
    id: 3,
    title: 'Review & Create',
    description: 'Review your configuration and create the monitor',
    component: ReviewStep,
  },
];