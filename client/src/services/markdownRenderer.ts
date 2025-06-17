import ReactMarkdown from 'react-markdown';
import { renderToString } from 'react-dom/server';
import remarkGfm from 'remark-gfm';

export class MarkdownRenderer {
  static renderToHTML(markdown: string): string {
    try {
      // Utiliser react-markdown pour un rendu plus précis
      const reactElement = ReactMarkdown({
        children: markdown,
        remarkPlugins: [remarkGfm],
        components: {
          // Personnaliser le rendu des composants
          h1: ({ children }) => `<h1 style="color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 0.5rem; margin: 2rem 0 1rem 0; font-size: 2.5rem;">${children}</h1>`,
          h2: ({ children }) => `<h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 0.3rem; margin: 2rem 0 1rem 0; font-size: 2rem;">${children}</h2>`,
          h3: ({ children }) => `<h3 style="color: #2c3e50; margin: 1.5rem 0 1rem 0; font-size: 1.5rem;">${children}</h3>`,
          h4: ({ children }) => `<h4 style="color: #2c3e50; margin: 1.5rem 0 1rem 0; font-size: 1.2rem;">${children}</h4>`,
          h5: ({ children }) => `<h5 style="color: #2c3e50; margin: 1.5rem 0 1rem 0; font-size: 1rem;">${children}</h5>`,
          h6: ({ children }) => `<h6 style="color: #2c3e50; margin: 1.5rem 0 1rem 0; font-size: 0.9rem;">${children}</h6>`,
          p: ({ children }) => `<p style="margin-bottom: 1rem; line-height: 1.6;">${children}</p>`,
          strong: ({ children }) => `<strong style="font-weight: 600;">${children}</strong>`,
          em: ({ children }) => `<em style="font-style: italic;">${children}</em>`,
          code: ({ children }) => `<code style="background: #f1f3f4; padding: 0.2rem 0.4rem; border-radius: 3px; font-family: 'Courier New', monospace; font-size: 0.9em;">${children}</code>`,
          pre: ({ children }) => `<pre style="background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 4px; padding: 1rem; overflow-x: auto; margin: 1rem 0; font-family: 'Courier New', monospace;">${children}</pre>`,
          blockquote: ({ children }) => `<blockquote style="border-left: 4px solid #3498db; padding: 1rem; margin: 1rem 0; background: #f8f9fa; border-radius: 4px;">${children}</blockquote>`,
          ul: ({ children }) => `<ul style="padding-left: 2rem; margin: 1rem 0;">${children}</ul>`,
          ol: ({ children }) => `<ol style="padding-left: 2rem; margin: 1rem 0;">${children}</ol>`,
          li: ({ children }) => `<li style="margin-bottom: 0.5rem;">${children}</li>`,
          table: ({ children }) => `<table style="border-collapse: collapse; width: 100%; margin: 1rem 0;">${children}</table>`,
          th: ({ children }) => `<th style="border: 1px solid #ddd; padding: 0.5rem; background: #f8f9fa; font-weight: bold; text-align: left;">${children}</th>`,
          td: ({ children }) => `<td style="border: 1px solid #ddd; padding: 0.5rem;">${children}</td>`,
          a: ({ href, children }) => `<a href="${href}" style="color: #3498db; text-decoration: none;">${children}</a>`,
          img: ({ src, alt }) => `<img src="${src}" alt="${alt}" style="max-width: 100%; height: auto; margin: 1rem 0;" />`,
          hr: () => `<hr style="border: none; height: 2px; background: #e9ecef; margin: 2rem 0;" />`,
        }
      });
      
      // Fallback vers la méthode simple si renderToString ne fonctionne pas
      return this.convertMarkdownToHTMLSimple(markdown);
    } catch (error) {
      console.warn('Erreur lors du rendu React, utilisation du fallback:', error);
      return this.convertMarkdownToHTMLSimple(markdown);
    }
  }

  private static convertMarkdownToHTMLSimple(markdown: string): string {
    let html = markdown;
    
    // Headers (dans l'ordre décroissant pour éviter les conflits)
    html = html.replace(/^###### (.*$)/gm, '<h6 style="color: #2c3e50; margin: 1.5rem 0 1rem 0; font-size: 0.9rem;">$1</h6>');
    html = html.replace(/^##### (.*$)/gm, '<h5 style="color: #2c3e50; margin: 1.5rem 0 1rem 0; font-size: 1rem;">$1</h5>');
    html = html.replace(/^#### (.*$)/gm, '<h4 style="color: #2c3e50; margin: 1.5rem 0 1rem 0; font-size: 1.2rem;">$1</h4>');
    html = html.replace(/^### (.*$)/gm, '<h3 style="color: #2c3e50; margin: 1.5rem 0 1rem 0; font-size: 1.5rem;">$1</h3>');
    html = html.replace(/^## (.*$)/gm, '<h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 0.3rem; margin: 2rem 0 1rem 0; font-size: 2rem;">$1</h2>');
    html = html.replace(/^# (.*$)/gm, '<h1 style="color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 0.5rem; margin: 2rem 0 1rem 0; font-size: 2.5rem;">$1</h1>');
    
    // Bold et Italic
    html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: 600;">$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em style="font-style: italic;">$1</em>');
    
    // Strikethrough
    html = html.replace(/~~(.*?)~~/g, '<del>$1</del>');
    
    // Code blocks (avant inline code)
    html = html.replace(/```([\s\S]*?)```/g, '<pre style="background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 4px; padding: 1rem; overflow-x: auto; margin: 1rem 0; font-family: \'Courier New\', monospace;"><code>$1</code></pre>');
    
    // Inline code
    html = html.replace(/`([^`]*)`/g, '<code style="background: #f1f3f4; padding: 0.2rem 0.4rem; border-radius: 3px; font-family: \'Courier New\', monospace; font-size: 0.9em;">$1</code>');
    
    // Links
    html = html.replace(/\[([^\]]*)\]\(([^)]*)\)/g, '<a href="$2" style="color: #3498db; text-decoration: none;">$1</a>');
    
    // Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]*)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; height: auto; margin: 1rem 0;" />');
    
    // Blockquotes
    html = html.replace(/^> (.*$)/gm, '<blockquote style="border-left: 4px solid #3498db; padding: 1rem; margin: 1rem 0; background: #f8f9fa; border-radius: 4px;">$1</blockquote>');
    
    // Horizontal rules
    html = html.replace(/^---$/gm, '<hr style="border: none; height: 2px; background: #e9ecef; margin: 2rem 0;" />');
    
    // Lists (simplifiées)
    html = html.replace(/^[*\-+] (.*)$/gm, '<li style="margin-bottom: 0.5rem;">$1</li>');
    html = html.replace(/^(\d+)\. (.*)$/gm, '<li style="margin-bottom: 0.5rem;">$2</li>');
    
    // Entourer les listes
    html = html.replace(/((?:<li[^>]*>.*<\/li>\s*)+)/g, (match) => {
      return `<ul style="padding-left: 2rem; margin: 1rem 0;">${match}</ul>`;
    });
    
    // Paragraphes (remplacer les double retours à la ligne)
    html = html.replace(/\n\n/g, '</p><p style="margin-bottom: 1rem; line-height: 1.6;">');
    html = html.replace(/\n/g, '<br>');
    
    // Entourer dans des paragraphes et nettoyer
    html = `<p style="margin-bottom: 1rem; line-height: 1.6;">${html}</p>`;
    html = html.replace(/<p[^>]*><\/p>/g, '');
    html = html.replace(/<p[^>]*>(<h[1-6][^>]*>.*<\/h[1-6]>)<\/p>/g, '$1');
    html = html.replace(/<p[^>]*>(<pre[^>]*>.*<\/pre>)<\/p>/g, '$1');
    html = html.replace(/<p[^>]*>(<blockquote[^>]*>.*<\/blockquote>)<\/p>/g, '$1');
    html = html.replace(/<p[^>]*>(<ul[^>]*>.*<\/ul>)<\/p>/g, '$1');
    html = html.replace(/<p[^>]*>(<hr[^>]*>)<\/p>/g, '$1');
    
    return html;
  }
}
