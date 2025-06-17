import React, { createContext, useContext, useState, useEffect } from 'react';
import { documentService, Document, DocumentSummary, CreateDocumentRequest, UpdateDocumentRequest } from '@/services/documentService';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface DocumentContextType {
  documents: DocumentSummary[];
  currentDocument: Document | null;
  isLoading: boolean;
  createDocument: (data: CreateDocumentRequest) => Promise<Document | null>;
  loadDocument: (id: string) => Promise<void>;
  updateDocument: (id: string, data: UpdateDocumentRequest) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  refreshDocuments: () => Promise<void>;
  setCurrentDocument: (doc: Document | null) => void;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export { DocumentContext };

export const DocumentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Charger les documents au montage du composant
  useEffect(() => {
    if (user) {
      refreshDocuments();
    }
  }, [user]);

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
      setCurrentDocument(document);
    } catch (error) {
      console.error('Erreur chargement document:', error);
      toast.error('Erreur lors du chargement du document');
    } finally {
      setIsLoading(false);
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
      
      // toast.success('Document sauvegardé !');
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
      isLoading,
      createDocument,
      loadDocument,
      updateDocument,
      deleteDocument,
      refreshDocuments,
      setCurrentDocument
    }}>
      {children}
    </DocumentContext.Provider>
  );
};
