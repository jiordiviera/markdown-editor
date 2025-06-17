import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { MarkdownRenderer } from './markdownRenderer';

export interface ExportOptions {
  title: string;
  content: string;
  format: 'pdf' | 'md' | 'html';
}

export class ExportService {
  // Export en Markdown (.md)
  static async exportAsMarkdown(options: ExportOptions): Promise<void> {
    const { title, content } = options;
    
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${this.sanitizeFilename(title)}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Export en HTML
  static async exportAsHTML(options: ExportOptions): Promise<void> {
    const { title, content } = options;
    
    // Créer le contenu HTML avec styles
    const htmlContent = this.generateHTMLContent(title, content);
    
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${this.sanitizeFilename(title)}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Export en PDF
  static async exportAsPDF(options: ExportOptions): Promise<void> {
    const { title, content } = options;
    
    try {
      // Créer un conteneur temporaire avec le contenu rendu
      const tempContainer = document.createElement('div');
      tempContainer.style.cssText = `
        position: absolute;
        top: -10000px;
        left: -10000px;
        width: 800px;
        padding: 40px;
        background: white;
        color: black;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
      `;
      
      // Ajouter le contenu rendu
      tempContainer.innerHTML = this.generatePDFContent(title, content);
      document.body.appendChild(tempContainer);
      
      // Capturer en canvas
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        backgroundColor: '#ffffff',
        allowTaint: true,
        useCORS: true,
        logging: false,
        width: 800,
        height: tempContainer.scrollHeight
      });
      
      // Supprimer le conteneur temporaire
      document.body.removeChild(tempContainer);
      
      // Créer le PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      // Si le contenu est plus haut qu'une page, créer plusieurs pages
      let heightLeft = pdfHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();
      
      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }
      
      // Télécharger le PDF
      pdf.save(`${this.sanitizeFilename(title)}.pdf`);
      
    } catch (error) {
      console.error('Erreur lors de l\'export PDF:', error);
      throw new Error('Erreur lors de la génération du PDF');
    }
  }

  // Méthode alternative pour PDF avec meilleure qualité
  static async exportAsPDFAdvanced(options: ExportOptions): Promise<void> {
    const { title, content } = options;
    
    try {
      // Créer une nouvelle fenêtre pour le rendu
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Impossible d\'ouvrir la fenêtre d\'impression');
      }
      
      const htmlContent = this.generatePrintableHTML(title, content);
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Attendre le chargement complet
      await new Promise(resolve => {
        printWindow.onload = resolve;
        setTimeout(resolve, 1000); // Fallback
      });
      
      // Déclencher l'impression/sauvegarde PDF
      printWindow.print();
      
      // Fermer la fenêtre après un délai
      setTimeout(() => {
        printWindow.close();
      }, 1000);
      
    } catch (error) {
      console.error('Erreur lors de l\'export PDF avancé:', error);
      throw new Error('Erreur lors de la génération du PDF');
    }
  }

  // Générer le contenu HTML avec styles
  private static generateHTMLContent(title: string, content: string): string {
    return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            background: #fff;
        }
        h1, h2, h3, h4, h5, h6 {
            margin-top: 2rem;
            margin-bottom: 1rem;
            color: #2c3e50;
        }
        h1 { font-size: 2.5rem; border-bottom: 3px solid #3498db; padding-bottom: 0.5rem; }
        h2 { font-size: 2rem; border-bottom: 2px solid #3498db; padding-bottom: 0.3rem; }
        h3 { font-size: 1.5rem; }
        p { margin-bottom: 1rem; }
        pre {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 4px;
            padding: 1rem;
            overflow-x: auto;
        }
        code {
            background: #f1f3f4;
            padding: 0.2rem 0.4rem;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
        }
        blockquote {
            border-left: 4px solid #3498db;
            padding-left: 1rem;
            margin: 1rem 0;
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 4px;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 1rem 0;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 0.5rem;
            text-align: left;
        }
        th {
            background: #f8f9fa;
            font-weight: bold;
        }
        ul, ol {
            padding-left: 2rem;
        }
        li {
            margin-bottom: 0.5rem;
        }
        .export-footer {
            margin-top: 3rem;
            padding-top: 1rem;
            border-top: 1px solid #eee;
            text-align: center;
            color: #666;
            font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <div class="markdown-content">
        ${MarkdownRenderer.renderToHTML(content)}
    </div>
    <div class="export-footer">
        <p>Exporté depuis Markdown Editor - ${new Date().toLocaleDateString('fr-FR')}</p>
    </div>
</body>
</html>`;
  }

  // Générer le contenu pour PDF
  private static generatePDFContent(title: string, content: string): string {
    return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; padding: 20px;">
        <h1 style="color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; margin-bottom: 20px;">${title}</h1>
        <div style="margin-bottom: 30px;">
            ${MarkdownRenderer.renderToHTML(content)}
        </div>
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 12px;">
            <p>Exporté depuis Markdown Editor - ${new Date().toLocaleDateString('fr-FR')}</p>
        </div>
    </div>`;
  }

  // Générer HTML pour impression
  private static generatePrintableHTML(title: string, content: string): string {
    return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
        @page { margin: 2cm; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
        }
        h1, h2, h3, h4, h5, h6 {
            page-break-after: avoid;
            margin-top: 1.5rem;
            margin-bottom: 1rem;
            color: #2c3e50;
        }
        h1 { font-size: 2rem; border-bottom: 2px solid #3498db; padding-bottom: 0.5rem; }
        h2 { font-size: 1.5rem; border-bottom: 1px solid #3498db; padding-bottom: 0.3rem; }
        pre, code { 
            font-family: 'Courier New', monospace;
            font-size: 0.9rem;
        }
        pre {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            padding: 1rem;
            page-break-inside: avoid;
        }
        table { 
            page-break-inside: avoid;
            border-collapse: collapse;
            width: 100%;
        }
        th, td { 
            border: 1px solid #ddd;
            padding: 0.5rem;
        }
        th { background: #f8f9fa; }
        .no-print { display: none; }
    </style>
</head>
<body>
    ${MarkdownRenderer.renderToHTML(content)}
    <div style="margin-top: 2rem; text-align: center; color: #666; font-size: 0.9rem;">
        <p>Exporté depuis Markdown Editor - ${new Date().toLocaleDateString('fr-FR')}</p>
    </div>
</body>
</html>`;
  }

  // Convertir Markdown en HTML simple (fonction basique)
  private static convertMarkdownToHTML(markdown: string): string {
    return markdown
      // Headers
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      // Bold
      .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*)\*/g, '<em>$1</em>')
      // Code blocks
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      // Inline code
      .replace(/`([^`]*)`/g, '<code>$1</code>')
      // Links
      .replace(/\[([^\]]*)\]\(([^)]*)\)/g, '<a href="$2">$1</a>')
      // Blockquotes
      .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
      // Line breaks
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      // Wrap in paragraphs
      .replace(/^(.+)$/gm, '<p>$1</p>')
      // Clean up empty paragraphs
      .replace(/<p><\/p>/g, '')
      .replace(/<p>(<h[1-6]>.*<\/h[1-6]>)<\/p>/g, '$1')
      .replace(/<p>(<pre>.*<\/pre>)<\/p>/g, '$1')
      .replace(/<p>(<blockquote>.*<\/blockquote>)<\/p>/g, '$1');
  }

  // Nettoyer le nom de fichier
  private static sanitizeFilename(filename: string): string {
    return filename
      .replace(/[^a-z0-9]/gi, '_')
      .replace(/_{2,}/g, '_')
      .replace(/^_|_$/g, '')
      .toLowerCase();
  }
}
