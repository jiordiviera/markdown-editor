
import { useState, useRef, useEffect } from "react";
import MarkdownEditor from "@/components/MarkdownEditor";
import MarkdownPreview from "@/components/MarkdownPreview";
import Header from "@/components/Header";
import { initialMarkdown } from "@/utils/initialMarkdown";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const [markdown, setMarkdown] = useState(initialMarkdown);
  const [splitPosition, setSplitPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const resizerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [view, setView] = useState<"both" | "editor" | "preview">("both");

  useEffect(() => {
    if (isMobile && view === "both") {
      setView("editor");
    }
  }, [isMobile]);

  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);

    const onMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const containerWidth = containerRef.current.clientWidth;
      const newPosition = (e.clientX / containerWidth) * 100;
      
      // Limit the resizing to a reasonable range
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

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <Header markdown={markdown} />
      
      <div className="flex items-center justify-center h-12 bg-background border-b border-border gap-2 sm:hidden">
        <button
          onClick={() => setView("editor")}
          className={`px-4 py-1 rounded-md transition-all ${view === "editor" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
        >
          Editor
        </button>
        <button
          onClick={() => setView("preview")}
          className={`px-4 py-1 rounded-md transition-all ${view === "preview" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
        >
          Preview
        </button>
      </div>
      
      <div 
        ref={containerRef}
        className={`flex flex-grow overflow-hidden ${isResizing ? "select-none" : ""}`}
      >
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
            onChange={setMarkdown} 
          />
        </div>
        
        {!isMobile && (
          <div 
            ref={resizerRef}
            className="resizer h-full"
            onMouseDown={startResize}
          />
        )}
        
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
    </div>
  );
};

export default Index;
