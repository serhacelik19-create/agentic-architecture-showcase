import { GoogleGenerativeAI } from '@google/generative-ai';
import { ScrapedArticle } from './scraperService';
import dotenv from 'dotenv';

dotenv.config();

const geminiApiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(geminiApiKey);

export interface SEOOutline {
  suggestedTitle: string;
  metaDescription: string;
  headings: { tag: 'h2' | 'h3'; text: string; keywords: string[] }[];
  suggestedWordCount: number;
}

export class GeminiService {
  /**
   * Analyzes competitor headers/excerpts and maps out a superior SEO optimized outline structure.
   */
  public static async generateSEOOutline(
    keyword: string, 
    competitors: ScrapedArticle[],
    size: 'kisa' | 'dengeli' | 'kapsamli' = 'dengeli',
    tone: 'profesyonel' | 'samimi' | 'akademik' | 'satis' = 'profesyonel'
  ): Promise<SEOOutline> {
    console.log(`[GeminiService] Generating SEO Outline for keyword: "${keyword}"... (Size: ${size}, Tone: ${tone})`);
    
    if (!geminiApiKey || geminiApiKey.startsWith('YOUR_')) {
      console.warn('[GeminiService] Gemini API Key is missing or invalid. Returning mock outline data.');
      return this.getMockOutline(keyword);
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-3.5-flash',
      generationConfig: { responseMimeType: 'application/json' }
    });

    const competitorsPromptData = competitors.map((c, i) => {
      const competitorHeaders = c.headers.map(h => `${h.tag.toUpperCase()}: ${h.text}`).join('\n');
      return `Competitor ${i + 1} (${c.title}):\nURL: ${c.url}\nHeadings:\n${competitorHeaders}\nContent Excerpt: ${c.bodyExcerpt.slice(0, 1000)}...\n`;
    }).join('\n---\n');

    const targetWords = size === 'kisa' ? 700 : size === 'kapsamli' ? 2500 : 1300;

    const prompt = `
      You are a world-class SEO strategist and content marketing expert.
      The target keyword you are optimizing for is: "${keyword}"
      Target Article Length: "${size}" (Approximate word count: ${targetWords} words)
      Target Tone of Voice: "${tone}"
      
      Below is the SERP organic ranking data from the top competitors on Google for this exact keyword:
      
      ${competitorsPromptData}
      
      Your Goal:
      1. Analyze the headings and content structures of the competitors.
      2. Synthesize a new, much more comprehensive, highly informative, and superior SEO outline that will outrank them.
      3. **CRITICAL:** The suggested outline, title, meta descriptions, and keywords MUST BE IN ENGLISH.
      4. Output the outline strictly in valid JSON format.
      
      JSON Scheme Requirement:
      {
        "suggestedTitle": "High CTR SEO Optimized Compelling Headline",
        "metaDescription": "Max 155 character click-inducing search engine meta description",
        "suggestedWordCount": ${targetWords},
        "headings": [
          {
            "tag": "h2" or "h3",
            "text": "Heading text",
            "keywords": ["recommended LSI/semantic keywords to organically include under this specific heading"]
          }
        ]
      }
    `;

    try {
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      const outlineData: SEOOutline = JSON.parse(responseText);
      console.log(`[GeminiService] SEO Outline successfully generated: "${outlineData.suggestedTitle}"`);
      return outlineData;
    } catch (error: any) {
      console.error(`[GeminiService] Error generating outline: ${error.message}`);
      return this.getMockOutline(keyword);
    }
  }

  /**
   * Generates a fully fleshed out, high-value, plagiarism-free HTML article based on the SEO Outline and competitor references.
   */
  public static async generateFullArticle(
    keyword: string, 
    outline: SEOOutline, 
    competitors: ScrapedArticle[],
    tone: 'profesyonel' | 'samimi' | 'akademik' | 'satis' = 'profesyonel'
  ): Promise<string> {
    console.log(`[GeminiService] Writing article: "${outline.suggestedTitle}" (Tone: ${tone})`);

    if (!geminiApiKey || geminiApiKey.startsWith('YOUR_')) {
      console.warn('[GeminiService] Gemini API Key is missing or invalid. Returning mock article.');
      return this.getMockArticle(keyword, outline);
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' }); // Fast, responsive Flash model

    const headingsList = outline.headings.map((h, i) => `${i + 1}. [${h.tag.toUpperCase()}] ${h.text} (Target Keywords: ${h.keywords.join(', ')})`).join('\n');
    const competitorsExcerpt = competitors.map(c => c.bodyExcerpt).join('\n\n');

    const prompt = `
      You are a world-class professional copywriter and technical editor.
      Target Keyword: "${keyword}"
      Suggested Headline: "${outline.suggestedTitle}"
      Target Meta Description: "${outline.metaDescription}"
      Target Tone of Voice: "${tone}"
      
      You must write a comprehensive, original, high-ranking blog article following the structured SEO Outline below:
      
      STRUCTURED OUTLINE:
      ${headingsList}
      
      COMPETITOR REFERENCE SOURCES (Synthesize these facts but DO NOT PLAGIARIZE. Write uniquely with deep value):
      ${competitorsExcerpt.slice(0, 8000)}
      
      WRITING AND FORMATTING INSTRUCTIONS:
      1. **CRITICAL:** Write the entire article in **ENGLISH**. Match the tone requested ("${tone}"). For "profesyonel" use high-level business professional; "samimi" use engaging, casual, conversational; "akademik" use heavily researched, source-driven; "satis" use high-converting, benefits-focused, persuasive copy.
      2. Format the output directly as clean **HTML markup**. Only use standard HTML tags (do not wrap in markdown backticks or block biers).
      3. Only use HTML tags like \`<h2>\`, \`<h3>\`, \`<p>\`, \`<ul>\`, \`<li>\`, \`<strong>\`, and \`<em>\`. Generate appropriate URL-friendly ids on headers (e.g. <h2 id="introduction">).
      4. Do not include root tags like \`<html>\`, \`<head>\` or \`<body>\`. Just generate the article body.
      5. The article must be extremely rich, informative, and be at least ${outline.suggestedWordCount} words long. Avoid generic AI fluff or overused intro transitions.
      6. Incorporate LSI/semantic keywords naturally under each heading section.
      7. **TECHNICAL SEO & FAQ SCHEMA ENTEGRATION:** At the very end of the article, add an \`<h2>Frequently Asked Questions (FAQ)</h2>\` section containing at least 3 relevant questions and answers. Immediately below that, generate a valid Schema.org JSON-LD FAQ script block (\`<script type="application/ld+json">\`) containing these exact Q&As and append it to the absolute bottom of the markup.
    `;

    try {
      const result = await model.generateContent(prompt);
      let contentHtml = result.response.text();
      
      // Clean up markdown block wrapping if returned by LLM
      if (contentHtml.startsWith('```html')) {
        contentHtml = contentHtml.replace(/^```html\s*/, '').replace(/\s*```$/, '');
      } else if (contentHtml.startsWith('```')) {
        contentHtml = contentHtml.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      console.log(`[GeminiService] Article successfully written. Size: ~${contentHtml.length} characters.`);
      return contentHtml.trim();
    } catch (error: any) {
      console.error(`[GeminiService] Error writing article: ${error.message}`);
      return this.getMockArticle(keyword, outline);
    }
  }

  // --- MOCK FALLBACK HELPER METHODS (Fully translated to English) ---

  private static getMockOutline(keyword: string): SEOOutline {
    return {
      suggestedTitle: `${keyword.toUpperCase()}: The Ultimate Developer's Guide and SEO Best Practices`,
      metaDescription: `Learn everything you need to know about ${keyword}, including expert developer tips, common errors to avoid, and future 2026 tech trends!`,
      suggestedWordCount: 1300,
      headings: [
        { tag: 'h2', text: `What is ${keyword} and Why is it Changing the Industry?`, keywords: ['definition', 'core principles', 'business impact'] },
        { tag: 'h2', text: `Common Pitfalls When Implementing ${keyword}`, keywords: ['common errors', 'things to avoid', 'debugging tips'] },
        { tag: 'h3', text: 'Lack of Planning and Scalability Issues', keywords: ['architectural bottlenecks', 'budget overheads'] },
        { tag: 'h2', text: `Future Horizons: What to Expect in 2026`, keywords: ['artificial intelligence', 'automation', 'future trends'] },
        { tag: 'h2', text: 'Frequently Asked Questions (FAQ)', keywords: ['qa', 'common questions', 'expert solutions'] }
      ]
    };
  }

  private static getMockArticle(keyword: string, outline: SEOOutline): string {
    let html = `
      <p>In today's fast-paced digital ecosystem, understanding <strong>${keyword}</strong> has evolved from a competitive advantage into an absolute prerequisite for software engineering success. Properly architected systems built on top of this concept unlock unparalleled scalability, while poorly designed strategies yield massive performance bottlenecks and team fatigue. In this guide, we analyze competitor approaches to bring you a production-ready blueprint.</p>
    `;

    for (const h of outline.headings) {
      const id = h.text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      html += `\n<${h.tag} id="${id}">${h.text}</${h.tag}>\n`;
      html += `<p>In this section, we deeply explore critical subjects including <strong>${h.keywords.join(', ')}</strong>. Recent data and developer benchmarks show that incorporating these semantic topics into your engineering pipelines yields up to a 45% increase in operational efficiency. Let's outline the most critical guidelines:</p>
      <ul>
        <li><strong>Scalable Planning:</strong> Breaking complex microservices into granular, easily testable components.</li>
        <li><strong>Continuous Monitoring:</strong> Inspecting server metrics and database connections in real-time.</li>
        <li><strong>AI-Assisted Orchestration:</strong> Automating repetitive tasks using advanced autonomous workflows.</li>
      </ul>
      <p>By delegating standard operational workloads to autonomous scripts and LLM pipelines, engineering teams can refocus their creative resources on strategic architectures and product value.</p>`;
    }

    html += `
      <h2 id="faq">Frequently Asked Questions (FAQ)</h2>
      <p>Here are some of the most common questions developers ask about <strong>${keyword}</strong>:</p>
      <ul>
        <li><strong>Q: How do we get started?</strong> A: Follow the architectural planning outlined in this guide and start with a minimal viable prototype.</li>
        <li><strong>Q: What are the main hosting requirements?</strong> A: A modern Docker-compatible hosting setup with standard REST APIs and Webhook support.</li>
      </ul>
    `;

    return html;
  }
}
