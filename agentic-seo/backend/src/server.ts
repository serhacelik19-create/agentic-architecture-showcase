import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ScraperService } from './services/scraperService';
import { GeminiService } from './services/geminiService';
import { PublishService } from './services/publishService';
import { prisma } from './lib/prisma';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// CORS and body parser configuration
app.use(cors({
  origin: '*', // Allow connections from frontend clients
}));
app.use(express.json({ limit: '10mb' })); // Increase payload limit for large articles

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Agentic SEO & Content Autopilot backend is active.' });
});

/**
 * Step 1 & 2: Scrapes Google search results for a keyword and generates a premium SEO Outline using Gemini 3.5 Flash.
 */
app.post('/api/analyze', async (req: Request, res: Response) => {
  const { keyword, limit, size, tone } = req.body;

  if (!keyword || typeof keyword !== 'string' || keyword.trim() === '') {
    return res.status(400).json({ error: 'Invalid or missing "keyword" parameter.' });
  }

  try {
    console.log(`\n[API] Starting analysis pipeline for keyword: "${keyword}"`);
    
    // 1. Google SERP crawling
    const competitors = await ScraperService.scrapeCompetitors(keyword, limit || 3);

    // 2. SEO Outline generation
    const outline = await GeminiService.generateSEOOutline(keyword, competitors, size, tone);

    // Save to PostgreSQL DB
    try {
      await prisma.competitorAnalysis.upsert({
        where: { keyword },
        update: { competitors: JSON.stringify(competitors) },
        create: { keyword, competitors: JSON.stringify(competitors) }
      });
      await prisma.outline.upsert({
        where: { keyword },
        update: { headings: JSON.stringify(outline) },
        create: { keyword, headings: JSON.stringify(outline) }
      });
      console.log(`[DB] Successfully persisted competitor analysis & outline for keyword: "${keyword}"`);
    } catch (dbError: any) {
      console.error(`[DB] Error saving analysis: ${dbError.message}`);
    }

    res.json({
      success: true,
      keyword,
      competitors,
      outline
    });
  } catch (error: any) {
    console.error(`[API] Error during analysis pipeline: ${error.message}`);
    res.status(500).json({ error: 'Analysis pipeline failed.', details: error.message });
  }
});

/**
 * Step 3: Writes the fully realized, high-value blog article based on the keyword, custom outline, and competitor facts.
 */
app.post('/api/generate-article', async (req: Request, res: Response) => {
  const { keyword, outline, competitors, tone } = req.body;

  if (!keyword || !outline || !competitors) {
    return res.status(400).json({ error: 'Missing parameters. "keyword", "outline", and "competitors" are required.' });
  }

  try {
    console.log(`\n[API] Launching article generator. Headline: "${outline.suggestedTitle}"`);
    
    const content = await GeminiService.generateFullArticle(keyword, outline, competitors, tone);

    // Save to PostgreSQL DB
    try {
      await prisma.article.upsert({
        where: { keyword },
        update: {
          title: outline.suggestedTitle || `SEO Article for ${keyword}`,
          content,
          tone: tone || 'Professional',
          status: 'draft'
        },
        create: {
          keyword,
          title: outline.suggestedTitle || `SEO Article for ${keyword}`,
          content,
          tone: tone || 'Professional',
          status: 'draft'
        }
      });
      console.log(`[DB] Successfully persisted generated article draft for keyword: "${keyword}"`);
    } catch (dbError: any) {
      console.error(`[DB] Error saving article: ${dbError.message}`);
    }

    res.json({
      success: true,
      content
    });
  } catch (error: any) {
    console.error(`[API] Error during article generation: ${error.message}`);
    res.status(500).json({ error: 'Article generation failed.', details: error.message });
  }
});



/**
 * API Endpoint: Fetch all successfully published articles to list on the live micro-blog site.
 */
app.get('/api/published-articles', async (req: Request, res: Response) => {
  try {
    const includeDrafts = req.query.includeDrafts === 'true';
    const list = await prisma.article.findMany({
      where: includeDrafts ? {} : { status: 'published' },
      orderBy: { updatedAt: 'desc' }
    });
    res.json({ success: true, articles: list });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch published articles.', details: error.message });
  }
});

/**
 * API Endpoint: Fetch the complete generated outline, competitors, and article for a given keyword.
 */
app.get('/api/article-data', async (req: Request, res: Response) => {
  const { keyword } = req.query;
  if (!keyword) {
    return res.status(400).json({ error: 'Missing required "keyword" query parameter.' });
  }
  try {
    const keywordStr = keyword as string;
    const article = await prisma.article.findFirst({
      where: { keyword: keywordStr }
    });
    const outlineRecord = await prisma.outline.findUnique({
      where: { keyword: keywordStr }
    });
    const competitorRecord = await prisma.competitorAnalysis.findUnique({
      where: { keyword: keywordStr }
    });

    // Check if the outline has headings in headings column (it might be double JSON-stringified or a normal object depending on mock vs prisma database layer)
    let headingsObj = null;
    if (outlineRecord) {
      try {
        headingsObj = typeof outlineRecord.headings === 'string' ? JSON.parse(outlineRecord.headings) : outlineRecord.headings;
      } catch {
        headingsObj = outlineRecord.headings;
      }
    }

    let competitorObj = null;
    if (competitorRecord) {
      try {
        competitorObj = typeof competitorRecord.competitors === 'string' ? JSON.parse(competitorRecord.competitors) : competitorRecord.competitors;
      } catch {
        competitorObj = competitorRecord.competitors;
      }
    }

    res.json({
      success: true,
      article: article || null,
      outline: headingsObj,
      competitors: competitorObj
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch article data.', details: error.message });
  }
});

/**
 * Step 4: Publishes the generated article on the selected CMS/Webhook platform.
 */
app.post('/api/publish', async (req: Request, res: Response) => {
  const { title, content, platform } = req.body;

  if (!title || !content || !platform) {
    return res.status(400).json({ error: 'Missing parameters. "title", "content", and "platform" are required.' });
  }

  try {
    console.log(`\n[API] Received publish request. Target Platform: ${platform}`);
    
    // Adjust result if using our dynamic simulation to point to our actual new React micro blog page
    const result = await PublishService.publish(title, content, platform);

    // Update status in PostgreSQL DB
    try {
      const article = await prisma.article.findFirst({
        where: { title }
      });
      if (article) {
        await prisma.article.update({
          where: { id: article.id },
          data: { 
            status: 'published', 
            publishedUrl: platform === 'Simulation' ? `/blog/${article.id}` : (result.url || '')
          }
        });
        console.log(`[DB] Successfully updated article publishing status to "${platform}" for: "${title}"`);
        
        // Return internal URL if using simulation so they can view it instantly on our micro blog site
        if (platform === 'Simulation') {
          result.url = `/blog/${article.id}`;
        }
      }
    } catch (dbError: any) {
      console.error(`[DB] Error updating article publish status: ${dbError.message}`);
    }

    res.json(result);
  } catch (error: any) {
    console.error(`[API] Error during publishing pipeline: ${error.message}`);
    res.status(500).json({ error: 'Publishing pipeline failed.', details: error.message });
  }
});


import { AutopilotService } from './services/autopilotService';

/**
 * Autopilot Endpoint: Fetch all keywords inside the autopilot pipeline.
 */
app.get('/api/autopilot/keywords', async (req: Request, res: Response) => {
  try {
    const list = await prisma.autopilotKeyword.findMany();
    res.json({ success: true, keywords: list });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to retrieve autopilot keywords.', details: error.message });
  }
});

/**
 * Autopilot Endpoint: Add new keyword to the autopilot pipeline.
 */
app.post('/api/autopilot/keywords', async (req: Request, res: Response) => {
  const { keyword } = req.body;
  if (!keyword || typeof keyword !== 'string' || keyword.trim() === '') {
    return res.status(400).json({ error: 'Invalid or missing "keyword" parameter.' });
  }

  try {
    const existing = await prisma.autopilotKeyword.findUnique({
      where: { keyword }
    });

    if (existing) {
      return res.status(400).json({ error: 'Keyword is already in the autopilot queue.' });
    }

    const item = await prisma.autopilotKeyword.create({
      data: {
        keyword: keyword.trim(),
        status: 'pending'
      }
    });

    res.json({ success: true, data: item });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create autopilot keyword.', details: error.message });
  }
});

/**
 * Autopilot Endpoint: Delete a keyword from the autopilot pipeline.
 */
app.delete('/api/autopilot/keywords/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await prisma.autopilotKeyword.delete({
      where: { id }
    });
    if (result) {
      res.json({ success: true, message: 'Autopilot keyword successfully deleted.' });
    } else {
      res.status(404).json({ error: 'Keyword not found in autopilot queue.' });
    }
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete autopilot keyword.', details: error.message });
  }
});

/**
 * Autopilot Endpoint: Manually trigger one run of the autopilot queue.
 */
app.post('/api/autopilot/trigger', async (req: Request, res: Response) => {
  try {
    console.log('[API] Autopilot manual execution triggered.');
    const result = await AutopilotService.processNextKeyword();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: 'Manual autopilot run failed.', details: error.message });
  }
});

/**
 * Reflection & Self-Optimization Endpoint: 
 * Inspects a low ranking article (simulation) and uses Gemini Editor Agent to self-optimize and rewrite.
 */
app.post('/api/autopilot/reflect', async (req: Request, res: Response) => {
  const { articleId, currentRank } = req.body;
  if (!articleId || !currentRank) {
    return res.status(400).json({ error: 'Missing articleId or currentRank.' });
  }

  try {
    // 1. Fetch original article
    const articles = await prisma.article.findMany();
    const article = articles.find((x: any) => x.id === articleId);

    if (!article) {
      return res.status(404).json({ error: 'Article not found.' });
    }

    // 2. Perform autonomous optimization rewrite (Think & Act loop)
    const optimizedContent = await GeminiService.selfOptimizeArticle(article.title, article.content, currentRank);

    // 3. Save optimized content
    const updated = await prisma.article.update({
      where: { id: article.id },
      data: {
        content: optimizedContent,
        googleRank: parseInt(currentRank),
        lastCheckedAt: new Date()
      }
    });

    console.log(`[Reflection] Article "${article.title}" successfully self-optimized based on Google Rank #${currentRank}.`);

    res.json({
      success: true,
      message: 'Article successfully optimized by Reflection Agent.',
      originalRank: currentRank,
      article: updated
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Self-optimization failed.', details: error.message });
  }
});

// Launch server
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 Agentic SEO Backend Server is running on port ${PORT}!`);
  console.log(`👉 http://localhost:${PORT}/api/health`);
  console.log(`==================================================`);
  
  // Start the background cron scheduler
  AutopilotService.startScheduler();
});

