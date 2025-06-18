/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Copy, Download, LogOut, User, Save, FileDown } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useDocuments } from "@/hooks/useDocuments";
import { ThemeToggle } from "@/components/ThemeToggle";
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
  onSave?: () => void;
  isUnsaved?: boolean;
  hasCurrentDocument?: boolean;
  currentDocument?: any;
}

const Header = ({ onSave }: HeaderProps) => {
  const { user, logout } = useAuth();
  const { 
    markdown, 
    currentDocument, 
    isUnsaved, 
    saveCurrentDocument 
  } = useDocuments();
  const [showExportModal, setShowExportModal] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(markdown);
    toast.success("Copié dans le presse-papier");
  };

  const downloadMarkdown = () => {
    if (!currentDocument) {
      toast.error("Aucun document sélectionné");
      return;
    }
    
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentDocument.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Fichier markdown téléchargé");
  };

  const handleExport = () => {
    if (!currentDocument || !markdown) {
      toast.error("Aucun document à exporter");
      return;
    }
    setShowExportModal(true);
  };

  const handleSave = () => {
    if (onSave) {
      onSave();
    } else {
      saveCurrentDocument();
    }
  };

  return (
    <header className="w-full h-16 flex items-center justify-between px-6 border-b border-border bg-background glass animate-slide-in">
      <div className="flex items-center space-x-2">
        <h1 className="text-xl font-semibold">
          {currentDocument?.title || "Markdown Editor"}
        </h1>
        {isUnsaved && (
          <span className="text-xs text-orange-500 bg-orange-100 dark:bg-orange-900/20 px-2 py-1 rounded">
            Non sauvegardé
          </span>
        )}
      </div>
      <div className="flex items-center space-x-2">
        {isUnsaved && currentDocument && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleSave}
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
          title="Copier dans le presse-papier"
        >
          <Copy className="h-5 w-5" />
        </Button>
        {currentDocument && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={downloadMarkdown}
            className="rounded-full transition-all hover:bg-accent"
            title="Télécharger markdown"
          >
            <Download className="h-5 w-5" />
          </Button>
        )}
        {currentDocument && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleExport}
            className="rounded-full transition-all hover:bg-accent"
            title="Exporter le document"
          >
            <FileDown className="h-5 w-5" />
          </Button>
        )}
        
        <ThemeToggle />
        
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
        title={currentDocument?.title || "Document"}
        content={markdown}
      />
    </header>
  );
};

export default Header;