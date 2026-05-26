import dotenv from 'dotenv';

dotenv.config();

export interface PublishResult {
  success: boolean;
  platform: 'WordPress' | 'Webflow' | 'Simülasyon';
  url?: string;
  message: string;
}

export class PublishService {
  /**
   * Publishes the generated article on the configured or chosen blog platform.
   */
  public static async publish(
    title: string, 
    content: string, 
    platform: 'WordPress' | 'Webflow' | 'Simülasyon' = 'Simülasyon'
  ): Promise<PublishResult> {
    console.log(`[PublishService] Publishing article. Platform: ${platform}, Title: "${title}"`);

    switch (platform) {
      case 'WordPress':
        return this.publishToWordPress(title, content);
      case 'Webflow':
        return this.publishToWebflow(title, content);
      case 'Simülasyon':
      default:
        return this.simulatePublish(title, content);
    }
  }

  /**
   * Publishes the article as a draft on WordPress via the WordPress REST API.
   */
  private static async publishToWordPress(title: string, content: string): Promise<PublishResult> {
    const wpUrl = process.env.WORDPRESS_URL;
    const wpUser = process.env.WORDPRESS_USER;
    const wpAppPassword = process.env.WORDPRESS_APP_PASSWORD;

    if (!wpUrl || !wpUser || !wpAppPassword) {
      return {
        success: false,
        platform: 'WordPress',
        message: 'WordPress credentials or URL are missing in the .env file.'
      };
    }

    try {
      const endpoint = `${wpUrl.replace(/\/$/, '')}/wp-json/wp/v2/posts`;
      const credentials = Buffer.from(`${wpUser}:${wpAppPassword}`).toString('base64');

      console.log(`[PublishService] Querying WordPress REST API: ${endpoint}`);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credentials}`
        },
        body: JSON.stringify({
          title: title,
          content: content,
          status: 'draft', // default to draft for security
          format: 'standard'
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`WordPress API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return {
        success: true,
        platform: 'WordPress',
        url: data.link,
        message: `Article successfully uploaded to WordPress as a Draft! Post ID: ${data.id}`
      };
    } catch (err: any) {
      console.error(`[PublishService] WordPress publishing error: ${err.message}`);
      return {
        success: false,
        platform: 'WordPress',
        message: `Failed to upload to WordPress: ${err.message}`
      };
    }
  }

  /**
   * Publishes the article as a CMS item on Webflow via the Webflow CMS v2 API.
   */
  private static async publishToWebflow(title: string, content: string): Promise<PublishResult> {
    const token = process.env.WEBFLOW_API_TOKEN;
    const collectionId = process.env.WEBFLOW_COLLECTION_ID || 'mock_collection_id';

    if (!token) {
      return {
        success: false,
        platform: 'Webflow',
        message: 'Webflow API Token (WEBFLOW_API_TOKEN) is missing in the .env file.'
      };
    }

    try {
      const endpoint = `https://api.webflow.com/v2/collections/${collectionId}/items`;
      console.log(`[PublishService] Querying Webflow CMS API: ${endpoint}`);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          fieldData: {
            name: title,
            slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            'post-body': content // Rich text block identifier inside your collection template
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Webflow API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return {
        success: true,
        platform: 'Webflow',
        url: `https://webflow.com/dashboard`,
        message: `Article successfully added to Webflow CMS Collection! Item ID: ${data.id}`
      };
    } catch (err: any) {
      console.error(`[PublishService] Webflow publishing error: ${err.message}`);
      return {
        success: false,
        platform: 'Webflow',
        message: `Failed to upload to Webflow: ${err.message}`
      };
    }
  }

  /**
   * Generates a simulated successful publish result for local testing/presentations.
   */
  private static async simulatePublish(title: string, content: string): Promise<PublishResult> {
    // Artificial delay to simulate real network request
    await new Promise(resolve => setTimeout(resolve, 1500));

    const simulatedUrl = `https://agentic-seo-autopilot.local/drafts/${encodeURIComponent(
      title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    )}`;

    console.log(`[PublishService] Simulated publishing completed successfully.`);
    
    return {
      success: true,
      platform: 'Simülasyon',
      url: simulatedUrl,
      message: 'Simulation Mode: Article has been successfully stored in the local simulated drafts repository and is ready to review.'
    };
  }
}
