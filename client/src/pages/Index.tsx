
import { useState, useRef, useEffect } from "react";
import MarkdownEditor from "@/components/MarkdownEditor";
import MarkdownPreview from "@/components/MarkdownPreview";
import Header from "@/components/Header";
import DocumentSidebar from "@/components/DocumentSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useDocuments } from "@/hooks/useDocuments";
import { Button } from "@/components/ui/button";
import { FileText, Save } from "lucide-react";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";

const Index = () => {
  const { currentDocument, updateDocument, createDocument } = useDocuments();
  const [markdown, setMarkdown] = useState("");
  const [splitPosition, setSplitPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const resizerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [view, setView] = useState<"both" | "editor" | "preview">("both");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Debounce pour la sauvegarde automatique
  const debouncedMarkdown = useDebounce(markdown, 2000);

  // Charger le document actuel
  useEffect(() => {
    if (currentDocument) {
      setMarkdown(currentDocument.content);
      setHasUnsavedChanges(false);
    } else {
      // Si aucun document, proposer d'en créer un
      setMarkdown("# Bienvenue dans Markdown Editor\n\nCréez votre premier document pour commencer !");
    }
  }, [currentDocument]);

  // Sauvegarde automatique
  useEffect(() => {
    if (currentDocument && debouncedMarkdown !== currentDocument.content && debouncedMarkdown) {
      updateDocument(currentDocument.id, { content: debouncedMarkdown });
      setHasUnsavedChanges(false);
    }
  }, [debouncedMarkdown, currentDocument, updateDocument]);

  // Gérer les changements de markdown
  const handleMarkdownChange = (value: string) => {
    setMarkdown(value);
    if (currentDocument && value !== currentDocument.content) {
      setHasUnsavedChanges(true);
    }
  };

  // Vue mobile
  useEffect(() => {
    if (isMobile && view === "both") {
      setView("editor");
    }
  }, [isMobile, view]);

  // Redimensionnement
  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);

    const onMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const containerWidth = containerRef.current.clientWidth;
      const newPosition = (e.clientX / containerWidth) * 100;
      
      if (newPosition > 20 && newPosition < 80) {
        setSplitPosition(newPosition);
      }
    };

    const onMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  // Créer un nouveau document rapidement
  const handleCreateNewDocument = async () => {
    const title = `Document ${new Date().toLocaleDateString('fr-FR')}`;
    await createDocument({
      title,
      content: `# ${title}\n\nCommencez à écrire votre markdown ici...`,
      isPublic: false
    });
  };

  // Sauvegarder manuellement
  const handleSave = async () => {
    if (currentDocument && hasUnsavedChanges) {
      await updateDocument(currentDocument.id, { content: markdown });
      setHasUnsavedChanges(false);
      toast.success("Document sauvegardé !");
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <DocumentSidebar 
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header 
          markdown={markdown} 
          documentTitle={currentDocument?.title}
          hasUnsavedChanges={hasUnsavedChanges}
          onSave={handleSave}
        />
        
        {/* Mobile View Toggle */}
        <div className="flex items-center justify-center h-12 bg-background border-b border-border gap-2 sm:hidden">
          <Button
            onClick={() => setView("editor")}
            className={`px-4 py-1 rounded-md transition-all ${view === "editor" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
          >
            Editor
          </Button>
          <Button
            onClick={() => setView("preview")}
            className={`px-4 py-1 rounded-md transition-all ${view === "preview" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
          >
            Preview
          </Button>
        </div>
        
        {/* Editor Area */}
        {!currentDocument ? (
          <div className="flex-1 flex items-center justify-center bg-background">
            <div className="text-center max-w-md mx-auto p-8">
              <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-semibold mb-2">Bienvenue !</h2>
              <p className="text-muted-foreground mb-6">
                Créez votre premier document markdown pour commencer à écrire.
              </p>
              <Button onClick={handleCreateNewDocument} size="lg">
                <FileText className="mr-2 h-5 w-5" />
                Créer un document
              </Button>
            </div>
          </div>
        ) : (
          <div 
            ref={containerRef}
            className={`flex flex-1 overflow-hidden ${isResizing ? "select-none" : ""}`}
          >
            {/* Editor Panel */}
            <div 
              style={{ 
                width: isMobile
                  ? view === "editor" 
                    ? "100%" 
                    : "0"
                  : `${splitPosition}%`,
                display: (isMobile && view !== "editor") ? "none" : "block"
              }}
              className="h-full transition-all duration-300 ease-in-out"
            >
              <MarkdownEditor 
                value={markdown} 
                onChange={handleMarkdownChange} 
              />
            </div>
            
            {/* Resizer */}
            {!isMobile && (
              <div 
                ref={resizerRef}
                className="resizer h-full"
                onMouseDown={startResize}
              />
            )}
            
            {/* Preview Panel */}
            <div 
              style={{ 
                width: isMobile
                  ? view === "preview" 
                    ? "100%" 
                    : "0"
                  : `calc(${100 - splitPosition}%)`,
                display: (isMobile && view !== "preview") ? "none" : "block"
              }}
              className="h-full transition-all duration-300 ease-in-out bg-background"
            >
              <MarkdownPreview markdown={markdown} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
