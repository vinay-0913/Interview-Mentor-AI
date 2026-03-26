/**
 * Simple markdown to HTML renderer for chat messages.
 * Handles: bold, italic, inline code, code blocks, line breaks.
 */
export function renderMarkdown(text) {
  if (!text) return "";

  let html = text
    // Escape HTML
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    // Code blocks (```)
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre style="margin: 8px 0; padding: 12px; border-radius: 8px; background-color: rgba(128,128,128,0.15); overflow-x: auto;"><code style="font-size: 0.875rem; font-family: monospace;">$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code style="padding: 2px 6px; border-radius: 4px; background-color: rgba(128,128,128,0.15); font-size: 0.875rem; font-family: monospace;">$1</code>')
    // Bold + Italic
    .replace(/\*\*\*(.*?)\*\*\*/g, "<strong style='font-weight: 700;'><em>$1</em></strong>")
    // Bold
    .replace(/\*\*(.*?)\*\*/g, "<strong style='font-weight: 700;'>$1</strong>")
    // Italic
    .replace(/\*(.*?)\*/g, "<em style='font-style: italic;'>$1</em>")
    // Line breaks (double newline = paragraph break, single = line break)
    .replace(/\n\n/g, '</p><p style="margin-top: 8px;">')
    .replace(/\n/g, "<br/>");

  return `<p>${html}</p>`;
}
