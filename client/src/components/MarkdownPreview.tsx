
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface MarkdownPreviewProps {
  markdown: string;
  className?: string;
}

// Types pour les composants React Markdown
type ComponentProps = {
  children?: React.ReactNode;
  className?: string;
  [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
};

const MarkdownPreview = ({ markdown, className }: MarkdownPreviewProps) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Fonction pour copier le code
  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      console.error('Erreur lors de la copie:', error);
    }
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  useEffect(() => {
    if (previewRef.current) {
      previewRef.current.scrollTop = 0;
    }
  }, [markdown]);

  // Composants personnalisés pour le rendu markdown
  const components = {
    code({ className, children, ...props }: ComponentProps) {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      const code = String(children).replace(/\n$/, '');

      if (!match) {
        return (
          <code className="!bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground">
            {children}
          </code>
        );
      }

      return (
        <div className="relative group my-4">
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 h-8 w-8 p-0"
            onClick={() => copyToClipboard(code)}
            title="Copier le code"
          >
            {copiedCode === code ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
          <SyntaxHighlighter
            style={theme === 'dark' ? oneDark : oneLight}
            language={language}
            PreTag="div"
            className="rounded-lg !bg-muted/50 !mt-0 !mb-0"
            customStyle={{
              margin: 0,
              padding: '1rem',
              fontSize: '0.875rem',
              lineHeight: '1.5',
            }}
            {...props}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      );
    },
    // Amélioration des liens
    a: ({ href, children, ...props }: ComponentProps & { href?: string }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:text-primary/80 underline underline-offset-2 hover:underline-offset-4 transition-all"
        {...props}
      >
        {children}
      </a>
    ),
    // Amélioration des tableaux
    table: ({ children, ...props }: ComponentProps) => (
      <div className="overflow-x-auto my-6 rounded-lg border border-border">
        <table className="min-w-full border-collapse" {...props}>
          {children}
        </table>
      </div>
    ),
    th: ({ children, ...props }: ComponentProps) => (
      <th className="border-b border-border bg-muted/50 px-4 py-3 text-left font-semibold text-sm" {...props}>
        {children}
      </th>
    ),
    td: ({ children, ...props }: ComponentProps) => (
      <td className="border-b border-border px-4 py-3 text-sm" {...props}>
        {children}
      </td>
    ),
    // Amélioration des citations
    blockquote: ({ children, ...props }: ComponentProps) => (
      <blockquote className="border-l-4 border-primary bg-muted/30 pl-4 py-2 my-6 italic" {...props}>
        {children}
      </blockquote>
    ),
    // Amélioration des titres
    h1: ({ children, ...props }: ComponentProps) => (
      <h1 className="text-3xl font-bold mt-8 mb-4 first:mt-0 text-foreground border-b border-border pb-2" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }: ComponentProps) => (
      <h2 className="text-2xl font-semibold mt-6 mb-3 text-foreground" {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }: ComponentProps) => (
      <h3 className="text-xl font-medium mt-5 mb-2 text-foreground" {...props}>
        {children}
      </h3>
    ),
    h4: ({ children, ...props }: ComponentProps) => (
      <h4 className="text-lg font-medium mt-4 mb-2 text-foreground" {...props}>
        {children}
      </h4>
    ),
    h5: ({ children, ...props }: ComponentProps) => (
      <h5 className="text-base font-medium mt-3 mb-1 text-foreground" {...props}>
        {children}
      </h5>
    ),
    h6: ({ children, ...props }: ComponentProps) => (
      <h6 className="text-sm font-medium mt-2 mb-1 text-foreground" {...props}>
        {children}
      </h6>
    ),
    // Amélioration des paragraphes
    p: ({ children, ...props }: ComponentProps) => (
      <p className="mb-4 leading-relaxed text-foreground" {...props}>
        {children}
      </p>
    ),
    // Amélioration des listes
    ul: ({ children, ...props }: ComponentProps) => (
      <ul className="list-disc list-inside mb-4 space-y-1 ml-4" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }: ComponentProps) => (
      <ol className="list-decimal list-inside mb-4 space-y-1 ml-4" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }: ComponentProps) => (
      <li className="text-foreground" {...props}>
        {children}
      </li>
    ),
    // Amélioration des images
    img: ({ src, alt, ...props }: ComponentProps & { src?: string; alt?: string }) => (
      <img 
        src={src} 
        alt={alt} 
        className="max-w-full h-auto rounded-lg shadow-sm my-4 border border-border"
        {...props} 
      />
    ),
    // Ligne horizontale
    hr: ({ ...props }: ComponentProps) => (
      <hr className="my-8 border-border" {...props} />
    ),
  };

  return (
    <div className={cn("flex flex-col h-full bg-background", className)}>
      {/* Header avec contrôles */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-background/95 backdrop-blur">
        <h3 className="text-sm font-medium text-muted-foreground">
          Aperçu Markdown
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleVisibility}
          className="h-8 w-8 p-0"
          title={isVisible ? "Masquer l'aperçu" : "Afficher l'aperçu"}
        >
          {isVisible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Contenu */}
      {isVisible ? (
        <div
          ref={previewRef}
          className="flex-1 overflow-y-auto p-4 sm:p-6 bg-background scrollbar-thin"
        >
          <div className="max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={components}
            >
              {markdown || "# Aperçu\n\nCommencez à écrire votre markdown pour voir l'aperçu..."}
            </ReactMarkdown>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-muted/20">
          <div className="text-center text-muted-foreground">
            <EyeOff className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm font-medium">Aperçu masqué</p>
            <p className="text-xs">Cliquez sur l'œil pour l'afficher</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarkdownPreview;
