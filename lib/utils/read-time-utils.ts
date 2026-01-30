/**
 * Calculate estimated reading time for content
 * Based on average reading speed of 200 words per minute
 * @param content - The content to analyze (HTML, Markdown, or plain text)
 * @returns Estimated reading time in minutes
 */
export function calculateReadTime(content: string): number {
  if (!content) return 0;

  // Strip HTML tags if present
  const textContent = content.replace(/<[^>]*>/g, ' ');

  // Count words (split by whitespace)
  const wordCount = textContent.trim().split(/\s+/).filter(Boolean).length;

  // Average reading speed: 200 words per minute
  const wordsPerMinute = 200;

  // Calculate and round up
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Calculate read time for TipTap JSON content
 * @param content - TipTap JSON content
 * @returns Estimated reading time in minutes
 */
export function calculateReadTimeFromTipTap(content: any): number {
  if (!content) return 0;

  // Extract text from TipTap JSON structure
  function extractText(node: any): string {
    if (!node) return '';

    let text = '';

    if (node.type === 'text') {
      text += node.text || '';
    } else if (node.content) {
      for (const child of node.content) {
        text += extractText(child);
        text += ' '; // Add space between blocks
      }
    }

    return text;
  }

  const textContent = extractText(content);
  const wordCount = textContent.trim().split(/\s+/).filter(Boolean).length;

  return Math.ceil(wordCount / 200);
}

/**
 * Format read time for display
 * @param minutes - Reading time in minutes
 * @returns Formatted string (e.g., "5 min read")
 */
export function formatReadTime(minutes: number): string {
  if (minutes < 1) return 'Less than 1 min read';
  if (minutes === 1) return '1 min read';
  return `${minutes} min read`;
}
