const API_BASE_URL = import.meta.env.PROD 
  ? '/api' 
  : 'http://localhost:3001/api';

export interface Document {
  id: string;
  title: string;
  content: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentSummary {
  id: string;
  title: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDocumentRequest {
  title: string;
  content?: string;
  isPublic?: boolean;
}

export interface UpdateDocumentRequest {
  title?: string;
  content?: string;
  isPublic?: boolean;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

export const documentService = {
  // Récupérer tous les documents de l'utilisateur
  async getDocuments(): Promise<DocumentSummary[]> {
    const response = await fetch(`${API_BASE_URL}/documents`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des documents');
    }

    return response.json();
  },

  // Récupérer un document par ID
  async getDocument(id: string): Promise<Document> {
    const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Document non trouvé');
    }

    return response.json();
  },

  // Créer un nouveau document
  async createDocument(data: CreateDocumentRequest): Promise<Document> {
    const response = await fetch(`${API_BASE_URL}/documents`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la création du document');
    }

    const result = await response.json();
    return result.document;
  },

  // Mettre à jour un document
  async updateDocument(id: string, data: UpdateDocumentRequest): Promise<Document> {
    const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la mise à jour du document');
    }

    const result = await response.json();
    return result.document;
  },

  // Supprimer un document
  async deleteDocument(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la suppression du document');
    }
  },

  // Récupérer un document public
  async getPublicDocument(id: string): Promise<Document> {
    const response = await fetch(`${API_BASE_URL}/documents/public/${id}`);

    if (!response.ok) {
      throw new Error('Document public non trouvé');
    }

    return response.json();
  },
};
