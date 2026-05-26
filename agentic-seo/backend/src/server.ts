import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ScraperService } from './services/scraperService';
import { GeminiService } from './services/geminiService';
import { PublishService } from './services/publishService';

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
 * Step 4: Publishes the generated article on the selected CMS/Webhook platform.
 */
app.post('/api/publish', async (req: Request, res: Response) => {
  const { title, content, platform } = req.body;

  if (!title || !content || !platform) {
    return res.status(400).json({ error: 'Missing parameters. "title", "content", and "platform" are required.' });
  }

  try {
    console.log(`\n[API] Received publish request. Target Platform: ${platform}`);
    
    const result = await PublishService.publish(title, content, platform);

    res.json(result);
  } catch (error: any) {
    console.error(`[API] Error during publishing pipeline: ${error.message}`);
    res.status(500).json({ error: 'Publishing pipeline failed.', details: error.message });
  }
});

// Launch server
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 Agentic SEO Backend Server is running on port ${PORT}!`);
  console.log(`👉 http://localhost:${PORT}/api/health`);
  console.log(`==================================================`);
});
