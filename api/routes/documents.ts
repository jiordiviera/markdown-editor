import express, { Router, Response, Request } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router: Router = express.Router();
const prisma = new PrismaClient();

// Validation schemas
const createDocumentSchema = z.object({
  title: z.string().min(1, 'Titre requis').max(255, 'Titre trop long'),
  content: z.string().default(''),
  isPublic: z.boolean().default(false)
});

const updateDocumentSchema = z.object({
  title: z.string().min(1, 'Titre requis').max(255, 'Titre trop long').optional(),
  content: z.string().optional(),
  isPublic: z.boolean().optional()
});

// Get all user documents
router.get('/', authenticate, async (req: AuthRequest, res): Promise<void> => {
  try {
    const documents = await prisma.document.findMany({
      where: { userId: req.user!.id },
      select: {
        id: true,
        title: true,
        isPublic: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { updatedAt: 'desc' }
    });

    res.json(documents);
  } catch (error) {
    console.error('Erreur get documents:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Get single document
router.get('/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const document = await prisma.document.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id
      }
    });

    if (!document) {
      res.status(404).json({ error: 'Document non trouvé' });
      return;
    }

    res.json(document);
  } catch (error) {
    console.error('Erreur get document:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Create document
router.post('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, content, isPublic } = createDocumentSchema.parse(req.body);

    const document = await prisma.document.create({
      data: {
        title,
        content,
        isPublic,
        userId: req.user!.id
      }
    });

    res.status(201).json({
      message: 'Document créé avec succès',
      document
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Données invalides',
        details: error.errors
      });
      return;
    }

    console.error('Erreur create document:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Update document
router.put('/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const updateData = updateDocumentSchema.parse(req.body);

    const document = await prisma.document.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id
      }
    });

    if (!document) {
      res.status(404).json({ error: 'Document non trouvé' });
      return;
    }

    const updatedDocument = await prisma.document.update({
      where: { id: req.params.id },
      data: updateData
    });

    res.json({
      message: 'Document mis à jour avec succès',
      document: updatedDocument
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Données invalides',
        details: error.errors
      });
      return;
    }

    console.error('Erreur update document:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Delete document
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const document = await prisma.document.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id
      }
    });

    if (!document) {
      res.status(404).json({ error: 'Document non trouvé' });
      return;
    }

    await prisma.document.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Document supprimé avec succès' });
  } catch (error) {
    console.error('Erreur delete document:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Get public document (no auth required)
router.get('/public/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const document = await prisma.document.findFirst({
      where: {
        id: req.params.id,
        isPublic: true
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    if (!document) {
      res.status(404).json({ error: 'Document public non trouvé' });
      return;
    }

    res.json(document);
  } catch (error) {
    console.error('Erreur get public document:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

export default router;
