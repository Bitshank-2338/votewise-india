import { NextRequest } from "next/server";
import { rateLimit, getClientIP } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const ip = getClientIP(req.headers);
  const { limited, resetIn } = rateLimit(`news:${ip}`, 30, 60_000);
  if (limited)
    return Response.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(Math.ceil(resetIn / 1000)) } }
    );

  const category = req.nextUrl.searchParams.get("category") || "all";

  // Strategy: try real APIs first, fall back to curated articles
  let articles = await tryGNews(category);
  if (!articles.length) articles = await tryNewsDataIO(category);
  if (!articles.length) articles = getFallbackNews(category);

  return Response.json({ articles });
}

/** GNews.io — free tier, no key needed for basic access, returns images */
async function tryGNews(category: string): Promise<Article[]> {
  try {
    let q = "india AND (election OR voting OR ECI)";
    if (category !== "all" && category !== "politics") {
      q = `india AND ${category}`;
    }
    const res = await fetch(
      `https://gnews.io/api/v4/search?q=${encodeURIComponent(q)}&lang=en&country=in&max=12&apikey=` +
        (process.env.GNEWS_API_KEY || ""),
      { next: { revalidate: 600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.articles?.length) return [];
    return data.articles
      .filter((a: GNewsArticle) => a.image)
      .map((a: GNewsArticle) => ({
        title: sanitize(a.title || ""),
        description: sanitize(a.description || ""),
        url: a.url || "#",
        image: a.image,
        source: a.source?.name || "News",
        date: a.publishedAt || new Date().toISOString(),
        category: category === "all" ? "politics" : category,
      }));
  } catch {
    return [];
  }
}

/** NewsData.io — user's existing key */
async function tryNewsDataIO(category: string): Promise<Article[]> {
  const apiKey = process.env.NEWSDATA_API_KEY;
  if (!apiKey) return [];
  try {
    let catParam = category === "all" ? "politics,top" : category;
    const res = await fetch(
      `https://newsdata.io/api/1/latest?apikey=${apiKey}&country=in&category=${catParam}&language=en&image=1`,
      { next: { revalidate: 300 } }
    );
    const data = await res.json();
    if (data.status !== "success" || !data.results?.length) return [];
    return data.results
      .filter((a: NewsDataArticle) => a.image_url)
      .slice(0, 12)
      .map((a: NewsDataArticle) => ({
        title: sanitize(a.title || ""),
        description: sanitize(a.description || ""),
        url: a.link || "#",
        image: a.image_url,
        source: sanitize(a.source_name || "News"),
        date: a.pubDate || new Date().toISOString(),
        category: (a.category || [category])[0] || category,
      }));
  } catch {
    return [];
  }
}

/** Fallback with locally generated images when no API key is configured */
function getFallbackNews(category: string): Article[] {
  const now = new Date().toISOString();
  const allNews = [
    { title: "Election Commission Announces Schedule for Upcoming State Assembly Elections", description: "The ECI has released the full schedule including nomination dates, polling dates, and counting day for the upcoming state elections. All political parties have been notified.", url: "https://eci.gov.in", image: "/news/parliament.webp", source: "Election Commission of India", date: now, category: "politics" },
    { title: "Voter Registration Drive: Over 1.5 Crore New Voters Added", description: "The National Voters' Service Portal reports a significant surge in new voter registrations ahead of the election season. Youth participation has increased by 25%.", url: "https://nvsp.in", image: "/news/voters-queue.webp", source: "NVSP", date: now, category: "politics" },
    { title: "Understanding EVM and VVPAT: How Your Vote is Counted", description: "A comprehensive guide to the Electronic Voting Machine and Voter Verified Paper Audit Trail system used across India in all elections.", url: "https://eci.gov.in", image: "/news/evm.webp", source: "ECI", date: now, category: "technology" },
    { title: "Supreme Court Upholds EVM Security in Landmark Ruling", description: "The Supreme Court of India has dismissed petitions questioning EVM reliability, citing multiple layers of security including VVPAT verification.", url: "https://sci.gov.in", image: "/news/supreme-court.webp", source: "Supreme Court of India", date: now, category: "politics" },
    { title: "Model Code of Conduct: What Political Parties Can and Cannot Do", description: "A detailed breakdown of the rules governing political parties and candidates once elections are announced by the Election Commission.", url: "https://eci.gov.in", image: "/news/campaign-rally.webp", source: "ECI", date: now, category: "politics" },
    { title: "Digital India: How Technology is Transforming Indian Elections", description: "From voter registration apps to live result tracking, technology plays a crucial role in conducting the world's largest democratic exercise.", url: "https://digitalindia.gov.in", image: "/news/digital-india.webp", source: "Digital India", date: now, category: "technology" },
    { title: "How to Check Your Name on the Voter List Online", description: "Step-by-step guide to verify your voter registration status using the NVSP portal or the Voter Helpline App before election day.", url: "https://nvsp.in", image: "/news/voter-id.webp", source: "NVSP", date: now, category: "politics" },
    { title: "First-Time Voters: Everything You Need to Know Before Election Day", description: "Essential information for young voters including required documents, polling booth procedures, EVM operation, and your fundamental voting rights.", url: "https://eci.gov.in", image: "/news/youth-voters.webp", source: "ECI", date: now, category: "politics" },
    { title: "BBC India: Impact of Social Media on Indian Election Campaigns", description: "Analysis of how social media platforms are shaping political discourse, voter opinions, and campaign strategies in Indian elections.", url: "https://bbc.com/news/world/south_asia", image: "/news/social-media.webp", source: "BBC News India", date: now, category: "world" },
    { title: "Economic Survey: How Government Policies Affect Your Vote", description: "Understanding key economic indicators, budget allocations, and policy decisions that impact voters' daily lives and electoral choices.", url: "https://indiabudget.gov.in", image: "/news/economy.webp", source: "Ministry of Finance", date: now, category: "business" },
    { title: "Women Voter Participation Reaches All-Time High", description: "Election data shows women voter turnout has surpassed male turnout in several states, marking a significant shift in Indian democratic participation.", url: "https://eci.gov.in", image: "/news/women-voters.webp", source: "ECI", date: now, category: "politics" },
    { title: "NOTA Votes Analysis: What the Numbers Tell Us", description: "A data-driven look at NOTA voting patterns across constituencies since its introduction in 2013 and its impact on election outcomes.", url: "https://eci.gov.in", image: "/news/counting-center.webp", source: "ECI", date: now, category: "technology" },
  ];
  if (category === "all") return allNews;
  return allNews.filter(a => a.category.toLowerCase() === category.toLowerCase());
}

function sanitize(t: string) {
  return t.replace(/<[^>]*>/g, "").replace(/\0/g, "").trim();
}

interface Article {
  title: string;
  description: string;
  url: string;
  image: string | null;
  source: string;
  date: string;
  category: string;
}

interface GNewsArticle {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  source?: { name?: string };
  publishedAt?: string;
}

interface NewsDataArticle {
  title?: string;
  description?: string;
  link?: string;
  image_url?: string;
  source_name?: string;
  pubDate?: string;
  category?: string[];
}
