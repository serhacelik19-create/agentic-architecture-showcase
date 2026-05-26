import cron from 'node-cron';
import { prisma } from '../lib/prisma';
import { ScraperService } from './scraperService';
import { GeminiService } from './geminiService';
import { PublishService } from './publishService';

export class AutopilotService {
  private static isRunning = false;

  /**
   * Initializes the 24/7 Autopilot Background Scheduler.
   * Runs every day at midnight (0 0 * * *), but in this development mode,
   * it can also be triggered manually or run at a faster interval if configured.
   */
  public static startScheduler() {
    console.log('[Autopilot] Initializing 24/7 SEO Autopilot Background Scheduler...');
    
    // Check for pending autopilot jobs every hour
    cron.schedule('0 * * * *', async () => {
      console.log('[Autopilot] Scheduled hourly heartbeat. Checking for pending SEO keywords...');
      await this.processNextKeyword();
    });
  }

  /**
   * Processes the next pending keyword in the Autopilot queue.
   */
  public static async processNextKeyword(): Promise<{ success: boolean; keyword?: string; error?: string }> {
    if (this.isRunning) {
      console.log('[Autopilot] Autopilot is already processing a keyword. Skipping execution.');
      return { success: false, error: 'Autopilot is currently busy.' };
    }

    this.isRunning = true;

    try {
      // 1. Fetch first pending keyword
      const pendingJobs = await prisma.autopilotKeyword.findMany({
        where: { status: 'pending' }
      });

      if (pendingJobs.length === 0) {
        console.log('[Autopilot] No pending keywords in queue.');
        this.isRunning = false;
        return { success: false, error: 'No pending keywords.' };
      }

      const job = pendingJobs[0];
      const keyword = job.keyword;
      console.log(`\n[Autopilot] Autopilot Started for keyword: "${keyword}" (Job ID: ${job.id})`);

      // Update status to processing
      await prisma.autopilotKeyword.update({
        where: { id: job.id },
        data: { status: 'processing' }
      });

      // 2. [Observe] Scrape competitors
      console.log(`[Autopilot][Observe] Scraping top 3 competitors for "${keyword}"...`);
      const competitors = await ScraperService.scrapeCompetitors(keyword, 3);
      await prisma.competitorAnalysis.upsert({
        where: { keyword },
        update: { competitors: JSON.stringify(competitors) },
        create: { keyword, competitors: JSON.stringify(competitors) }
      });

      // 3. [Think] Multi-Agent Outline Strategizing
      console.log(`[Autopilot][Think] Generating Multi-Agent analysis & SEO Gap report...`);
      const gapReport = await GeminiService.researchContentGaps(keyword, competitors);
      console.log(`[Researcher Agent Report]: ${gapReport}`);

      console.log(`[Autopilot][Think] Strategizing optimized outlines and headlines...`);
      const outline = await GeminiService.generateSEOOutline(keyword, competitors, 'balanced', 'professional');
      await prisma.outline.upsert({
        where: { keyword },
        update: { headings: JSON.stringify(outline) },
        create: { keyword, headings: JSON.stringify(outline) }
      });

      // 4. [Act] Generate & Enhance Article
      console.log(`[Autopilot][Act] Writing final premium article draft...`);
      let content = await GeminiService.generateFullArticle(keyword, outline, competitors, 'professional');

      // 4b. AI/Stock Featured Image Prompt Generation
      console.log(`[Autopilot][Act] Requesting featured image cover...`);
      const imageUrl = await GeminiService.generateFeaturedImagePrompt(keyword, outline.suggestedTitle);

      // 4c. Inject Internal Linker Agent
      console.log(`[Autopilot][Act] Scanning published articles to inject internal linking...`);
      const existingArticles = await prisma.article.findMany({
        where: { status: 'published' }
      });
      content = GeminiService.injectInternalLinks(content, existingArticles);

      // Save article to DB
      const article = await prisma.article.upsert({
        where: { keyword },
        update: {
          title: outline.suggestedTitle,
          content,
          tone: 'professional',
          featuredImage: imageUrl,
          status: 'draft'
        },
        create: {
          keyword,
          title: outline.suggestedTitle,
          content,
          tone: 'professional',
          featuredImage: imageUrl,
          status: 'draft'
        }
      });

      // 5. Publish to Webhook / Default active CMS (WordPress/Webflow Simulation)
      console.log(`[Autopilot][Act] Auto-publishing to integrated CMS platform...`);
      const publishResult = await PublishService.publish(outline.suggestedTitle, content, 'WordPress');

      // Update publishing details
      await prisma.article.update({
        where: { id: article.id },
        data: {
          status: 'published',
          publishedUrl: publishResult.url || `http://localhost:3000/blog/${article.id}`
        }
      });

      // 6. Complete Autopilot Job
      await prisma.autopilotKeyword.update({
        where: { id: job.id },
        data: { status: 'completed' }
      });

      console.log(`[Autopilot] Autopilot successfully finished for keyword: "${keyword}"!\n`);
      this.isRunning = false;
      return { success: true, keyword };
    } catch (error: any) {
      console.error(`[Autopilot] Error during autopilot run: ${error.message}`);
      this.isRunning = false;
      return { success: false, error: error.message };
    }
  }
}
