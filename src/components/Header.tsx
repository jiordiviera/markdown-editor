
import { Button } from "@/components/ui/button";
import { Copy, Download, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface HeaderProps {
  markdown: string;
}

const Header = ({ markdown }: HeaderProps) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(markdown);
    toast.success("Copied to clipboard");
  };

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Downloaded markdown file");
  };

  return (
    <header className="w-full h-16 flex items-center justify-between px-6 border-b border-border bg-background glass animate-slide-in">
      <div className="flex items-center space-x-2">
        <h1 className="text-xl font-semibold">Markdown Editor</h1>
      </div>
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={copyToClipboard}
          className="rounded-full transition-all hover:bg-accent"
          title="Copy to clipboard"
        >
          <Copy className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={downloadMarkdown}
          className="rounded-full transition-all hover:bg-accent"
          title="Download markdown"
        >
          <Download className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleTheme}
          className="rounded-full transition-all hover:bg-accent"
          title="Toggle theme"
        >
          {theme === "light" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>
      </div>
    </header>
  );
};

export default Header;
