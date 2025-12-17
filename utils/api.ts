/**
 * API service for email subscription
 */

export interface SubscribeRequest {
  email: string;
  source: string;
  pageUrl: string;
  referrer: string;
}

export interface SubscribeResponse {
  success: boolean;
  message?: string;
}

/**
 * Subscribe email to the waitlist
 */
export async function subscribeEmail(email: string): Promise<SubscribeResponse> {
  try {
    // Get current page URL
    const pageUrl = window.location.href;
    
    // Get referrer from document
    const referrer = document.referrer || 'direct';
    
    const requestBody: SubscribeRequest = {
      email,
      source: 'inkgenius-pro纹身',
      pageUrl,
      referrer
    };

    const response = await fetch('https://auto-express-email.vercel.app/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      message: data.message || 'Subscription successful'
    };
  } catch (error) {
    console.error('Subscribe email error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to subscribe. Please try again.'
    };
  }
}
