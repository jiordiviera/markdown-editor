import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { PanelLeftOpen, PanelLeftClose, Eye, Edit } from "lucide-react";
import MarkdownEditor from "@/components/MarkdownEditor";
import MarkdownPreview from "@/components/MarkdownPreview";
import Header from "@/components/Header";
import DocumentSidebar from "@/components/DocumentSidebar";
import { useDocuments } from "@/hooks/useDocuments";
import { useDebounce } from "@/hooks/useDebounce";

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');
  const [isMobile, setIsMobile] = useState(false);

  const { 
    markdown, 
    setMarkdown, 
    isUnsaved, 
    saveCurrentDocument, 
    currentDocument 
  } = useDocuments();

  const debouncedMarkdown = useDebounce(markdown, 2000);

  // Gestion responsive
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Sauvegarde automatique
  useEffect(() => {
    if (currentDocument && isUnsaved && debouncedMarkdown) {
      saveCurrentDocument();
    }
  }, [debouncedMarkdown, currentDocument, isUnsaved, saveCurrentDocument]);

  const handleSave = useCallback(() => {
    if (currentDocument && isUnsaved) {
      saveCurrentDocument();
    }
  }, [currentDocument, isUnsaved, saveCurrentDocument]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  
  const EditorView = () => (
    <div className="h-full transition-all duration-300 ease-in-out"
    >
      <MarkdownEditor 
        value={markdown} 
        onChange={setMarkdown}
      />
    </div>
  );

  /**
   * 
   *  <div
        style={{
          width: isMobile
            ? view === "editor"
              ? "100%"
              : "0"
            : `${splitPosition}%`,
          display: isMobile && view !== "editor" ? "none" : "block",
        }}
        className="h-full transition-all duration-300 ease-in-out"
      >
        <MarkdownEditor value={markdown} onChange={handleMarkdownChange} />
      </div>

      {!isMobile && (
        <div
          ref={resizerRef}
          className="resizer h-full"
          onMouseDown={startResize}
        />
      )}
   */

  const PreviewView = () => (
    <div className="flex-1 flex flex-col">
      <MarkdownPreview 
        markdown={markdown}
      />
    </div>
  );

  const DesktopLayout = () => (
    <div className="flex h-screen bg-background">
      <DocumentSidebar 
        isCollapsed={!sidebarOpen} 
        onToggle={toggleSidebar} 
      />
      
      <div className="flex-1 flex flex-col">
        <Header onSave={handleSave} />
        
        <div className="flex-1 flex">
          <div className="flex-1 border-r border-border">
            <EditorView />
          </div>
          <div className="flex-1">
            <PreviewView />
          </div>
        </div>
      </div>
    </div>
  );

  const MobileLayout = () => (
    <div className="flex h-screen bg-background flex-col">
      <Header onSave={handleSave} />
      
      <div className="flex-1 flex flex-col">
        {/* Mobile Controls */}
        <div className="flex items-center justify-between p-2 border-b border-border bg-background">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="flex items-center gap-2"
          >
            {sidebarOpen ? (
              <>
                <PanelLeftClose className="h-4 w-4" />
                Fermer
              </>
            ) : (
              <>
                <PanelLeftOpen className="h-4 w-4" />
                Documents
              </>
            )}
          </Button>
          
          <div className="flex bg-muted rounded-lg p-1">
            <Button
              variant={mobileView === 'editor' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setMobileView('editor')}
              className="text-xs"
            >
              <Edit className="h-3 w-3 mr-1" />
              Éditer
            </Button>
            <Button
              variant={mobileView === 'preview' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setMobileView('preview')}
              className="text-xs"
            >
              <Eye className="h-3 w-3 mr-1" />
              Aperçu
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex">
          {/* Sidebar */}
          {sidebarOpen && (
            <div className="w-80 border-r border-border">
              <DocumentSidebar 
                isCollapsed={false} 
                onToggle={toggleSidebar} 
              />
            </div>
          )}
          
          {/* Main Content */}
          <div className="flex-1">
            {mobileView === 'editor' ? <EditorView /> : <PreviewView />}
          </div>
        </div>
      </div>
    </div>
  );

  return isMobile ? <MobileLayout /> : <DesktopLayout />;
};

export default Index;