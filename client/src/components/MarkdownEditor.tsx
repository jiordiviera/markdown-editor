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
    // Apply custom styles to the editor
    const styleElement = document.createElement("style");
    styleElement.textContent = `
      .monaco-editor .margin {
        background-color: transparent !important;
      }
      .monaco-editor, .monaco-editor-background {
        background-color: transparent !important;
      }
    `;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <div className="w-full h-full overflow-hidden bg-editor-bg rounded-md animate-fade-in">
      <Editor
        height="100%"
        defaultLanguage="markdown"
        value={value}
        onChange={(value) => onChange(value || "")}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: "on",
          lineNumbers: "on",
          renderLineHighlight: "none",
          fontSize: 14,
          fontFamily: 'JetBrains Mono, monospace',
          padding: { top: 16, bottom: 16 },
          scrollbar: {
            vertical: "visible",
            horizontal: "visible",
            useShadows: false,
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8
          }
        }}
        theme="vs-dark"
      />
    </div>
  );
};

export default MarkdownEditor;
