/**
 * YouTube Data API v3 client — fetch official ECI and voter-education videos.
 * https://developers.google.com/youtube/v3
 */

const YT_BASE = "https://www.googleapis.com/youtube/v3";

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  channel: string;
  thumbnail: string;
  publishedAt: string;
}

/** Search YouTube for nonpartisan ECI / voter-education videos. */
export async function searchVoterEducationVideos(
  query: string = "Election Commission of India voter education",
  maxResults: number = 8
): Promise<YouTubeVideo[]> {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return [];

  try {
    const url =
      `${YT_BASE}/search?part=snippet&type=video&safeSearch=strict` +
      `&maxResults=${maxResults}` +
      `&q=${encodeURIComponent(query)}&key=${key}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];

    const data: {
      items?: Array<{
        id: { videoId: string };
        snippet: {
          title: string;
          description: string;
          channelTitle: string;
          publishedAt: string;
          thumbnails: { high?: { url: string }; default?: { url: string } };
        };
      }>;
    } = await res.json();

    return (data.items || []).map((item) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      channel: item.snippet.channelTitle,
      thumbnail:
        item.snippet.thumbnails.high?.url ||
        item.snippet.thumbnails.default?.url ||
        "",
      publishedAt: item.snippet.publishedAt,
    }));
  } catch {
    return [];
  }
}

/** Build a privacy-enhanced YouTube embed URL (uses youtube-nocookie.com). */
export function buildEmbedUrl(videoId: string): string {
  const safe = videoId.replace(/[^a-zA-Z0-9_-]/g, "");
  return `https://www.youtube-nocookie.com/embed/${safe}?rel=0&modestbranding=1`;
}
