/**
 * Google Tag Manager Analytics Utility
 * Unified event tracking function
 */

export interface AnalyticsEventParams {
  feature: string;
  page: string;
  position: string;
  tab: string;
  action: string;
}

/**
 * Send analytics event to Google Tag Manager
 * @param params - Event parameters
 */
export function trackEvent(params: AnalyticsEventParams): void {
  if (typeof window === 'undefined') {
    return;
  }

  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push({
    event: 'ai_generate', // Unified event name
    ...params
  });
}

/**
 * Track AI generation event for different tabs
 * @param tab - Tab mode (Design, Stencil, Try-On, Cover-Up)
 * @param action - Action name
 * @param isModal - Whether the event is triggered from modal
 */
export function trackGenerationEvent(
  tab: string,
  action: string,
  isModal: boolean = false
): void {
  trackEvent({
    feature: 'generate',
    page: isModal ? 'modal' : 'landing',
    position: 'hero',
    tab: tab.toLowerCase(),
    action: action
  });
}
