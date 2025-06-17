
import { Button } from "@/components/ui/button";
import { Copy, Download, Moon, Sun, LogOut, User, Save, FileDown } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import ExportModal from "@/components/ExportModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  markdown: string;
  documentTitle?: string;
  hasUnsavedChanges?: boolean;
  onSave?: () => void;
}

const Header = ({ markdown, documentTitle, hasUnsavedChanges, onSave }: HeaderProps) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const { user, logout } = useAuth();
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(markdown);
    toast.success("Copied to clipboard");
  };

  const downloadMarkdown = () => {
    if (!documentTitle) {
      toast.error("Aucun document sélectionné");
      return;
    }
    
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${documentTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Fichier markdown téléchargé");
  };

  const handleExport = () => {
    if (!documentTitle || !markdown) {
      toast.error("Aucun document à exporter");
      return;
    }
    setShowExportModal(true);
  };

  return (
    <header className="w-full h-16 flex items-center justify-between px-6 border-b border-border bg-background glass animate-slide-in">
      <div className="flex items-center space-x-2">
        <h1 className="text-xl font-semibold">
          {documentTitle || "Markdown Editor"}
        </h1>
        {hasUnsavedChanges && (
          <span className="text-xs text-orange-500 bg-orange-100 dark:bg-orange-900/20 px-2 py-1 rounded">
            Non sauvegardé
          </span>
        )}
      </div>
      <div className="flex items-center space-x-2">
        {hasUnsavedChanges && onSave && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onSave}
            className="rounded-full transition-all hover:bg-accent"
            title="Sauvegarder"
          >
            <Save className="h-5 w-5" />
          </Button>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={copyToClipboard}
          className="rounded-full transition-all hover:bg-accent"
          title="Copy to clipboard"
        >
          <Copy className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={downloadMarkdown}
          className="rounded-full transition-all hover:bg-accent"
          title="Télécharger markdown"
        >
          <Download className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleExport}
          className="rounded-full transition-all hover:bg-accent"
          title="Exporter le document"
        >
          <FileDown className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleTheme}
          className="rounded-full transition-all hover:bg-accent"
          title="Toggle theme"
        >
          {theme === "light" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              {user?.name || user?.email}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title={documentTitle || "Document"}
        content={markdown}
      />
    </header>
  );
};

export default Header;
