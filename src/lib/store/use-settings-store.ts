import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AISettings, AIProvider } from '@/types/ai';

interface OrgProfile {
  name: string;
  logoUrl?: string;
  tier: 'STARTER' | 'GROWTH' | 'REVENUE_INTELLIGENCE';
  seatsUsed: number;
  seatsTotal: number;
  primaryCurrency: string;
}

interface SettingsState {
  aiSettings: AISettings;
  orgProfile: OrgProfile;
  activeNotificationsCount: number;
  
  // Actions
  setAIProvider: (provider: AIProvider) => void;
  setOpenAIApiKey: (key: string) => void;
  setAnthropicApiKey: (key: string) => void;
  setGeminiApiKey: (key: string) => void;
  setRiskSensitivity: (sensitivity: AISettings['riskSensitivity']) => void;
  setInactivityThreshold: (days: number) => void;
  setRenewalHorizon: (days: number) => void;
  setSubscriptionTier: (tier: 'STARTER' | 'GROWTH' | 'REVENUE_INTELLIGENCE') => void;
  updateOrgProfile: (profile: Partial<OrgProfile>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      aiSettings: {
        provider: 'BUILTIN_ENGINE',
        openaiApiKey: '',
        anthropicApiKey: '',
        geminiApiKey: '',
        riskSensitivity: 'BALANCED',
        inactivityThresholdDays: 10,
        renewalAlertHorizonDays: 45,
        activeTier: 'REVENUE_INTELLIGENCE',
      },
      orgProfile: {
        name: 'Acuity Revenue Labs',
        tier: 'REVENUE_INTELLIGENCE',
        seatsUsed: 8,
        seatsTotal: 15,
        primaryCurrency: 'USD ($)',
      },
      activeNotificationsCount: 3,

      setAIProvider: (provider) =>
        set((state) => ({
          aiSettings: { ...state.aiSettings, provider },
        })),

      setOpenAIApiKey: (openaiApiKey) =>
        set((state) => ({
          aiSettings: {
            ...state.aiSettings,
            openaiApiKey,
            provider: openaiApiKey ? 'OPENAI' : 'BUILTIN_ENGINE',
          },
        })),

      setAnthropicApiKey: (anthropicApiKey) =>
        set((state) => ({
          aiSettings: { ...state.aiSettings, anthropicApiKey },
        })),

      setGeminiApiKey: (geminiApiKey) =>
        set((state) => ({
          aiSettings: { ...state.aiSettings, geminiApiKey },
        })),

      setRiskSensitivity: (riskSensitivity) =>
        set((state) => ({
          aiSettings: { ...state.aiSettings, riskSensitivity },
        })),

      setInactivityThreshold: (inactivityThresholdDays) =>
        set((state) => ({
          aiSettings: { ...state.aiSettings, inactivityThresholdDays },
        })),

      setRenewalHorizon: (renewalAlertHorizonDays) =>
        set((state) => ({
          aiSettings: { ...state.aiSettings, renewalAlertHorizonDays },
        })),

      setSubscriptionTier: (tier) =>
        set((state) => ({
          aiSettings: { ...state.aiSettings, activeTier: tier },
          orgProfile: { ...state.orgProfile, tier },
        })),

      updateOrgProfile: (profile) =>
        set((state) => ({
          orgProfile: { ...state.orgProfile, ...profile },
        })),
    }),
    {
      name: 'revenue-rescue-ai-settings-v1',
    }
  )
);
