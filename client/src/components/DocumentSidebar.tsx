import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  FileText, 
  Trash2, 
  Globe, 
  Lock, 
  Search,
  Calendar,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useDocuments } from "@/hooks/useDocuments";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DocumentSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const DocumentSidebar = ({ isCollapsed, onToggle }: DocumentSidebarProps) => {
  const { 
    documents, 
    currentDocument, 
    isLoading, 
    createDocument, 
    loadDocument, 
    deleteDocument 
  } = useDocuments();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState("");

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateDocument = async () => {
    if (!newDocTitle.trim()) {
      toast.error("Le titre est requis");
      return;
    }

    setIsCreating(true);
    await createDocument({
      title: newDocTitle.trim(),
      content: "# " + newDocTitle.trim() + "\n\nCommencez à écrire votre markdown ici...",
      isPublic: false
    });
    setNewDocTitle("");
    setIsCreating(false);
  };

  const handleDeleteDocument = async (id: string, title: string) => {
    await deleteDocument(id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  if (isCollapsed) {
    return (
      <div className="w-12 h-full bg-sidebar border-r border-border flex flex-col items-center py-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="mb-4"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setNewDocTitle("Nouveau document");
            handleCreateDocument();
          }}
          disabled={isCreating}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-80 h-full bg-sidebar border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Mes Documents</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un document..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Create new document */}
        <div className="space-y-2">
          <Input
            placeholder="Titre du nouveau document"
            value={newDocTitle}
            onChange={(e) => setNewDocTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCreateDocument()}
          />
          <Button 
            onClick={handleCreateDocument}
            disabled={isCreating || !newDocTitle.trim()}
            className="w-full"
          >
            {isCreating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Création...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Document
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Document List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {isLoading && documents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              Chargement...
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
              {searchTerm ? "Aucun document trouvé" : "Aucun document"}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className={`group p-3 rounded-lg border cursor-pointer transition-all hover:bg-accent ${
                    currentDocument?.id === doc.id 
                      ? 'bg-primary/10 border-primary' 
                      : 'border-border hover:border-accent-foreground/20'
                  }`}
                  onClick={() => loadDocument(doc.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <h3 className="font-medium truncate text-sm">
                          {doc.title}
                        </h3>
                        {doc.isPublic ? (
                          <Globe className="h-3 w-3 text-green-500" />
                        ) : (
                          <Lock className="h-3 w-3 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(doc.updatedAt)}</span>
                        <Badge variant="outline" className="text-xs">
                          {doc.isPublic ? 'Public' : 'Privé'}
                        </Badge>
                      </div>
                    </div>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Supprimer le document</AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer "{doc.title}" ? 
                            Cette action est irréversible.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteDocument(doc.id, doc.title)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default DocumentSidebar;
