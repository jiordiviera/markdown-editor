import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ExportService } from "@/services/exportService";
import { FileDown, FileText, Globe, Printer, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

const ExportModal = ({ isOpen, onClose, title, content }: ExportModalProps) => {
  const [exportFormat, setExportFormat] = useState<'pdf' | 'md' | 'html'>('pdf');
  const [pdfMethod, setPdfMethod] = useState<'canvas' | 'print'>('print');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!title || !content) {
      toast.error("Aucun contenu à exporter");
      return;
    }

    setIsExporting(true);
    try {
      const options = { title, content, format: exportFormat };

      switch (exportFormat) {
        case 'md':
          await ExportService.exportAsMarkdown(options);
          toast.success("Document markdown téléchargé !");
          break;
        case 'html':
          await ExportService.exportAsHTML(options);
          toast.success("Document HTML téléchargé !");
          break;
        case 'pdf':
          if (pdfMethod === 'canvas') {
            await ExportService.exportAsPDF(options);
          } else {
            await ExportService.exportAsPDFAdvanced(options);
          }
          toast.success("Document PDF généré !");
          break;
      }
      
      onClose();
    } catch (error) {
      console.error('Erreur export:', error);
      toast.error("Erreur lors de l'export du document");
    } finally {
      setIsExporting(false);
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf':
        return <FileDown className="h-4 w-4" />;
      case 'md':
        return <FileText className="h-4 w-4" />;
      case 'html':
        return <Globe className="h-4 w-4" />;
      default:
        return <FileDown className="h-4 w-4" />;
    }
  };

  const getFormatDescription = (format: string) => {
    switch (format) {
      case 'pdf':
        return "Document PDF pour impression ou partage";
      case 'md':
        return "Fichier Markdown source original";
      case 'html':
        return "Page web HTML avec styles";
      default:
        return "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileDown className="h-5 w-5" />
            Exporter le document
          </DialogTitle>
          <DialogDescription>
            Choisissez le format d'export pour "<strong>{title}</strong>"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Format Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Format d'export</Label>
            <Select value={exportFormat} onValueChange={(value: 'pdf' | 'md' | 'html') => setExportFormat(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">
                  <div className="flex items-center gap-2">
                    <FileDown className="h-4 w-4" />
                    <span>PDF</span>
                  </div>
                </SelectItem>
                <SelectItem value="md">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>Markdown (.md)</span>
                  </div>
                </SelectItem>
                <SelectItem value="html">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span>HTML</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {getFormatDescription(exportFormat)}
            </p>
          </div>

          {/* PDF Method Selection */}
          {exportFormat === 'pdf' && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Méthode PDF</Label>
              <RadioGroup value={pdfMethod} onValueChange={(value: 'canvas' | 'print') => setPdfMethod(value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="print" id="print" />
                  <Label htmlFor="print" className="flex items-center gap-2">
                    <Printer className="h-4 w-4" />
                    <div>
                      <p className="font-medium">Impression du navigateur</p>
                      <p className="text-xs text-muted-foreground">
                        Meilleure qualité, utilise la fonction d'impression
                      </p>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="canvas" id="canvas" />
                  <Label htmlFor="canvas" className="flex items-center gap-2">
                    <FileDown className="h-4 w-4" />
                    <div>
                      <p className="font-medium">Génération automatique</p>
                      <p className="text-xs text-muted-foreground">
                        Téléchargement direct, peut avoir des limitations
                      </p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Preview Info */}
          <div className="rounded-lg border p-3 bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              {getFormatIcon(exportFormat)}
              <span className="font-medium text-sm">Aperçu de l'export</span>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>Titre :</strong> {title}</p>
              <p><strong>Contenu :</strong> {content.length} caractères</p>
              <p><strong>Format :</strong> {exportFormat.toUpperCase()}</p>
              {exportFormat === 'pdf' && (
                <p><strong>Méthode :</strong> {pdfMethod === 'print' ? 'Impression' : 'Canvas'}</p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isExporting}
          >
            Annuler
          </Button>
          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="min-w-[100px]"
          >
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Export...
              </>
            ) : (
              <>
                {getFormatIcon(exportFormat)}
                <span className="ml-2">Exporter</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportModal;
