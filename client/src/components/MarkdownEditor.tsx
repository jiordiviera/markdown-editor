/* eslint-disable @typescript-eslint/no-explicit-any */

import { useRef, useEffect } from "react";
import { Editor } from "@monaco-editor/react";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const MarkdownEditor = ({ value, onChange }: MarkdownEditorProps) => {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;

    // Focus the editor
    editor.focus();
  };

  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.textContent = `
      .monaco-editor .margin {
        background-color: transparent !important;
      }
      .monaco-editor, .monaco-editor-background {
        background-color: transparent !important;
      }
      .editor-toolbar {
        backdrop-filter: blur(10px);
        background: rgba(255, 255, 255, 0.1);
      }
      .editor-container.fullscreen {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        z-index: 9999 !important;
        background: var(--background) !important;
      }
    `;
    document.head.appendChild(styleElement);
    
    return () => {
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);



  return (
    <div
      className={`editor-container w-full h-full flex flex-col bg-background border border-border rounded-lg overflow-hidden shadow-lg `}
    >
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage="markdown"
          value={value}
          onChange={(value) => onChange(value || "")}
          onMount={handleEditorDidMount}
          theme={"vs-dark"}
        />
      </div>
    </div>
  );
};

export default MarkdownEditor;
