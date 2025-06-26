import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { PanelLeftOpen, PanelLeftClose, Eye, Edit, Monitor, Tablet, Smartphone } from "lucide-react";
import MarkdownEditor from "@/components/MarkdownEditor";
import MarkdownPreview from "@/components/MarkdownPreview";
import Header from "@/components/Header";
import DocumentSidebar from "@/components/DocumentSidebar";
import { useDocuments } from "@/hooks/useDocuments";
import { useDebounce } from "@/hooks/useDebounce";

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  const { 
    markdown, 
    setMarkdown, 
    isUnsaved, 
    saveCurrentDocument, 
    currentDocument 
  } = useDocuments();

  const debouncedMarkdown = useDebounce(markdown, 2000);

  // Gestion responsive améliorée
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize('mobile');
        setSidebarOpen(false); // Fermer la sidebar sur mobile par défaut
      } else if (width < 1024) {
        setScreenSize('tablet');
        setSidebarOpen(false); // Fermer la sidebar sur tablette par défaut
      } else {
        setScreenSize('desktop');
        setSidebarOpen(true); // Ouvrir la sidebar sur desktop par défaut
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
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

  // Indicateur de taille d'écran
  const ScreenSizeIndicator = () => (
    <div className="hidden sm:flex items-center space-x-1 text-xs text-muted-foreground">
      {screenSize === 'mobile' && <Smartphone className="h-3 w-3" />}
      {screenSize === 'tablet' && <Tablet className="h-3 w-3" />}
      {screenSize === 'desktop' && <Monitor className="h-3 w-3" />}
      <span className="capitalize">{screenSize}</span>
    </div>
  );

  const EditorView = () => (
    <div className="h-full flex flex-col bg-background">
      <MarkdownEditor 
        value={markdown} 
        onChange={setMarkdown}
      />
    </div>
  );

  const PreviewView = () => (
    <div className="h-full flex flex-col bg-background">
      <MarkdownPreview 
        markdown={markdown}
      />
    </div>
  );

  // Layout Desktop (1024px+)
  const DesktopLayout = () => (
    <div className="flex h-screen bg-background">
      <DocumentSidebar 
        isCollapsed={!sidebarOpen} 
        onToggle={toggleSidebar} 
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header onSave={handleSave} />
        
        <div className="flex-1 flex overflow-hidden">
          {/* Éditeur */}
          <div className="flex-1 min-w-0 border-r border-border">
            <EditorView />
          </div>
          {/* Aperçu */}
          <div className="flex-1 min-w-0">
            <PreviewView />
          </div>
        </div>
      </div>
    </div>
  );

  // Layout Tablette (768px - 1023px)
  const TabletLayout = () => (
    <div className="flex h-screen bg-background">
      {/* Sidebar overlay sur tablette */}
      {sidebarOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed left-0 top-0 h-full w-80 bg-background border-r border-border z-50 lg:hidden">
            <DocumentSidebar 
              isCollapsed={false} 
              onToggle={() => setSidebarOpen(false)}
            />
          </div>
        </>
      )}
      
      <div className="flex-1 flex flex-col">
        <Header onSave={handleSave} />
        
        {/* Contrôles tablette */}
        <div className="flex items-center justify-between p-3 border-b border-border bg-background/95 backdrop-blur">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-2"
            >
              <PanelLeftOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Documents</span>
            </Button>
            <ScreenSizeIndicator />
          </div>
          
          <div className="flex bg-muted rounded-lg p-1">
            <Button
              variant={mobileView === 'editor' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setMobileView('editor')}
              className="text-sm"
            >
              <Edit className="h-4 w-4 mr-1" />
              Éditer
            </Button>
            <Button
              variant={mobileView === 'preview' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setMobileView('preview')}
              className="text-sm"
            >
              <Eye className="h-4 w-4 mr-1" />
              Aperçu
            </Button>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="flex-1 overflow-hidden">
          {mobileView === 'editor' ? <EditorView /> : <PreviewView />}
        </div>
      </div>
    </div>
  );

  // Layout Mobile (< 768px)
  const MobileLayout = () => (
    <div className="flex h-screen bg-background flex-col">
      <Header onSave={handleSave} />
      
      {/* Sidebar fullscreen sur mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-background z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold">Documents</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-2"
            >
              <PanelLeftClose className="h-4 w-4" />
              Fermer
            </Button>
          </div>
          <div className="flex-1 overflow-hidden">
            <DocumentSidebar 
              isCollapsed={false} 
              onToggle={() => setSidebarOpen(false)}
            />
          </div>
        </div>
      )}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Contrôles mobiles */}
        <div className="flex items-center justify-between p-2 border-b border-border bg-background/95 backdrop-blur">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2"
          >
            <PanelLeftOpen className="h-4 w-4" />
            <span className="text-sm">Docs</span>
          </Button>
          
          <div className="flex bg-muted rounded-lg p-1">
            <Button
              variant={mobileView === 'editor' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setMobileView('editor')}
              className="text-xs px-2"
            >
              <Edit className="h-3 w-3 mr-1" />
              Code
            </Button>
            <Button
              variant={mobileView === 'preview' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setMobileView('preview')}
              className="text-xs px-2"
            >
              <Eye className="h-3 w-3 mr-1" />
              Vue
            </Button>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="flex-1 overflow-hidden">
          {mobileView === 'editor' ? <EditorView /> : <PreviewView />}
        </div>
      </div>
    </div>
  );

  // Sélection du layout selon la taille d'écran
  const renderLayout = () => {
    switch (screenSize) {
      case 'mobile':
        return <MobileLayout />;
      case 'tablet':
        return <TabletLayout />;
      default:
        return <DesktopLayout />;
    }
  };

  return renderLayout();
};

export default Index;