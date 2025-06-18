import React, { createContext, useContext, useState, useEffect } from 'react';
import { documentService, Document, DocumentSummary, CreateDocumentRequest, UpdateDocumentRequest } from '@/services/documentService';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface DocumentContextType {
  documents: DocumentSummary[];
  currentDocument: Document | null;
  markdown: string;
  isLoading: boolean;
  isUnsaved: boolean;
  createDocument: (data: CreateDocumentRequest) => Promise<Document | null>;
  loadDocument: (id: string) => Promise<void>;
  updateDocument: (id: string, data: UpdateDocumentRequest) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  refreshDocuments: () => Promise<void>;
  setCurrentDocument: (doc: Document | null) => void;
  setMarkdown: (content: string) => void;
  saveCurrentDocument: () => Promise<void>;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export { DocumentContext };

const DEFAULT_MARKDOWN = `# Bienvenue dans l'éditeur Markdown

Commencez à écrire votre markdown ici...

## Fonctionnalités

- **Édition en temps réel**
- *Prévisualisation instantanée*
- Sauvegarde automatique
- Export PDF et Markdown

\`\`\`javascript
// Code avec coloration syntaxique
console.log('Hello, World!');
\`\`\`

> Citation importante

1. Liste numérotée
2. Deuxième élément

- [x] Tâche terminée
- [ ] Tâche en cours

[Lien vers GitHub](https://github.com)
`;

export const DocumentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [markdown, setMarkdownState] = useState<string>(DEFAULT_MARKDOWN);
  const [isLoading, setIsLoading] = useState(false);
  const [isUnsaved, setIsUnsaved] = useState(false);
  const { user } = useAuth();

  // Charger les documents au montage du composant
  useEffect(() => {
    if (user) {
      refreshDocuments();
    }
  }, [user]);

  // Synchroniser le markdown avec le document actuel
  useEffect(() => {
    if (currentDocument) {
      setMarkdownState(currentDocument.content);
      setIsUnsaved(false);
    } else {
      setMarkdownState(DEFAULT_MARKDOWN);
      setIsUnsaved(false);
    }
  }, [currentDocument]);

  const setMarkdown = (content: string) => {
    setMarkdownState(content);
    // Marquer comme non sauvegardé seulement si on a un document actuel
    if (currentDocument && content !== currentDocument.content) {
      setIsUnsaved(true);
    }
  };

  const refreshDocuments = async () => {
    try {
      setIsLoading(true);
      const docs = await documentService.getDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error('Erreur chargement documents:', error);
      toast.error('Erreur lors du chargement des documents');
    } finally {
      setIsLoading(false);
    }
  };

  const createDocument = async (data: CreateDocumentRequest): Promise<Document | null> => {
    try {
      setIsLoading(true);
      const newDocument = await documentService.createDocument(data);
      await refreshDocuments(); // Recharger la liste
      
      // Définir le nouveau document comme actuel
      // Le useEffect se chargera de synchroniser le markdown
      setCurrentDocument(newDocument);
      
      toast.success('Document créé avec succès !');
      return newDocument;
    } catch (error) {
      console.error('Erreur création document:', error);
      toast.error('Erreur lors de la création du document');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const loadDocument = async (id: string) => {
    try {
      setIsLoading(true);
      const document = await documentService.getDocument(id);
      
      // Définir le document comme actuel
      // Le useEffect se chargera de synchroniser le markdown
      setCurrentDocument(document);
    } catch (error) {
      console.error('Erreur chargement document:', error);
      toast.error('Erreur lors du chargement du document');
    } finally {
      setIsLoading(false);
    }
  };

  const saveCurrentDocument = async () => {
    if (!currentDocument || !isUnsaved) return;

    try {
      const updatedDocument = await documentService.updateDocument(currentDocument.id, {
        content: markdown,
        title: currentDocument.title,
        isPublic: currentDocument.isPublic
      });
      
      setCurrentDocument(updatedDocument);
      setIsUnsaved(false);
      
      // Mettre à jour la liste des documents
      setDocuments(prev => prev.map(doc => 
        doc.id === currentDocument.id 
          ? { ...doc, title: updatedDocument.title, updatedAt: updatedDocument.updatedAt }
          : doc
      ));
      
    } catch (error) {
      console.error('Erreur mise à jour document:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const updateDocument = async (id: string, data: UpdateDocumentRequest) => {
    try {
      const updatedDocument = await documentService.updateDocument(id, data);
      setCurrentDocument(updatedDocument);
      
      // Mettre à jour la liste des documents
      setDocuments(prev => prev.map(doc => 
        doc.id === id 
          ? { ...doc, title: updatedDocument.title, updatedAt: updatedDocument.updatedAt }
          : doc
      ));
      
      // Si on a mis à jour le contenu, synchroniser avec l'état local
      if (data.content !== undefined) {
        setMarkdownState(data.content);
        setIsUnsaved(false);
      }
      
    } catch (error) {
      console.error('Erreur mise à jour document:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      await documentService.deleteDocument(id);
      setDocuments(prev => prev.filter(doc => doc.id !== id));
      
      // Si le document supprimé est le document actuel, le désélectionner
      if (currentDocument?.id === id) {
        setCurrentDocument(null);
        // Le useEffect se chargera de remettre le markdown par défaut
      }
      
      toast.success('Document supprimé !');
    } catch (error) {
      console.error('Erreur suppression document:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  return (
    <DocumentContext.Provider value={{
      documents,
      currentDocument,
      markdown,
      isLoading,
      isUnsaved,
      createDocument,
      loadDocument,
      updateDocument,
      deleteDocument,
      refreshDocuments,
      setCurrentDocument,
      setMarkdown,
      saveCurrentDocument
    }}>
      {children}
    </DocumentContext.Provider>
  );
};