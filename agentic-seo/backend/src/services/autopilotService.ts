import cron from 'node-cron';
import { prisma } from '../lib/prisma';
import { ScraperService } from './scraperService';
import { GeminiService } from './geminiService';
import { PublishService } from './publishService';
import { progressEmitter } from '../lib/progressEmitter';

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
    let keyword = '';
    let job: any = null;

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

      job = pendingJobs[0];
      keyword = job.keyword;
      console.log(`\n[Autopilot] Autopilot Started for keyword: "${keyword}" (Job ID: ${job.id})`);

      // Update status to processing
      await prisma.autopilotKeyword.update({
        where: { id: job.id },
        data: { status: 'processing' }
      });

      progressEmitter.emitProgress({ keyword, step: 1, totalSteps: 7, percentage: 5, message: 'Autopilot queue initiated...', status: 'processing' });

      // 2. [Observe] Scrape competitors
      progressEmitter.emitProgress({ keyword, step: 2, totalSteps: 7, percentage: 15, message: 'Scraping top competitors and Google SERP data...', status: 'processing' });
      console.log(`[Autopilot][Observe] Scraping top 3 competitors for "${keyword}"...`);
      const competitors = await ScraperService.scrapeCompetitors(keyword, 3);
      await prisma.competitorAnalysis.upsert({
        where: { keyword },
        update: { competitors: JSON.stringify(competitors) },
        create: { keyword, competitors: JSON.stringify(competitors) }
      });

      // 3. [Think] Multi-Agent Outline Strategizing
      progressEmitter.emitProgress({ keyword, step: 3, totalSteps: 7, percentage: 30, message: 'Generating Multi-Agent content gap and SEO analysis report...', status: 'processing' });
      console.log(`[Autopilot][Think] Generating Multi-Agent analysis & SEO Gap report...`);
      const gapReport = await GeminiService.researchContentGaps(keyword, competitors);
      console.log(`[Researcher Agent Report]: ${gapReport}`);

      progressEmitter.emitProgress({ keyword, step: 4, totalSteps: 7, percentage: 45, message: 'Strategizing optimized outlines and headlines...', status: 'processing' });
      console.log(`[Autopilot][Think] Strategizing optimized outlines and headlines...`);
      const outline = await GeminiService.generateSEOOutline(keyword, competitors, 'balanced', 'professional');
      await prisma.outline.upsert({
        where: { keyword },
        update: { headings: JSON.stringify(outline) },
        create: { keyword, headings: JSON.stringify(outline) }
      });

      // 4. [Act] Generate & Enhance Article
      progressEmitter.emitProgress({ keyword, step: 5, totalSteps: 7, percentage: 65, message: 'Writing final premium article content with AI...', status: 'processing' });
      console.log(`[Autopilot][Act] Writing final premium article draft...`);
      let content = await GeminiService.generateFullArticle(keyword, outline, competitors, 'professional');

      // 4b. AI/Stock Featured Image Prompt Generation
      progressEmitter.emitProgress({ keyword, step: 6, totalSteps: 7, percentage: 80, message: 'Generating featured image and scanning internal linking...', status: 'processing' });
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
      progressEmitter.emitProgress({ keyword, step: 7, totalSteps: 7, percentage: 95, message: 'Auto-publishing to integrated CMS...', status: 'processing' });
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
      progressEmitter.emitProgress({ keyword, step: 7, totalSteps: 7, percentage: 100, message: 'Autopilot successfully completed!', status: 'completed' });
      
      this.isRunning = false;

      // Auto-trigger next keyword in queue with a brief cooldown
      setTimeout(async () => {
        await this.processNextKeyword();
      }, 2000);

      return { success: true, keyword };
    } catch (error: any) {
      console.error(`[Autopilot] Error during autopilot run: ${error.message}`);
      
      if (job) {
        try {
          await prisma.autopilotKeyword.update({
            where: { id: job.id },
            data: { status: 'failed' }
          });
        } catch (dbErr) {
          console.error('[Autopilot] Failed to set job status to failed:', dbErr);
        }
      }

      if (keyword) {
        progressEmitter.emitProgress({ keyword, step: 7, totalSteps: 7, percentage: 100, message: `Autopilot failed: ${error.message}`, status: 'failed' });
      }

      this.isRunning = false;

      // Auto-trigger next keyword in queue even if one fails
      setTimeout(async () => {
        await this.processNextKeyword();
      }, 2000);

      return { success: false, error: error.message };
    }
  }
}
