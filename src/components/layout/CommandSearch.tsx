"use client";

import { useState, useEffect, useRef } from "react";
import {
  Command,
  Search,
  X,
  Home,
  User,
  Briefcase,
  FileText,
  Mail,
  Github,
  Linkedin,
  Twitter,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "next-themes";

type CommandItem = {
  id: string;
  name: string;
  icon: React.ReactNode;
  shortcut?: string;
  action: () => void;
  group: string;
};

export const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const commandListRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();

  const navigationCommands: CommandItem[] = [
    {
      id: "home",
      name: "Home",
      icon: <Home className="w-4 h-4" />,
      shortcut: "H",
      action: () => (window.location.href = "/#home"),
      group: "Navigation",
    },
    {
      id: "about",
      name: "About",
      icon: <User className="w-4 h-4" />,
      shortcut: "A",
      action: () => (window.location.href = "/#about"),
      group: "Navigation",
    },
    {
      id: "projects",
      name: "Projects",
      icon: <Briefcase className="w-4 h-4" />,
      shortcut: "P",
      action: () => (window.location.href = "/#projects"),
      group: "Navigation",
    },
    {
      id: "blog",
      name: "Blog",
      icon: <FileText className="w-4 h-4" />,
      shortcut: "B",
      action: () => (window.location.href = "/blog"),
      group: "Navigation",
    },
    {
      id: "contact",
      name: "Contact",
      icon: <Mail className="w-4 h-4" />,
      shortcut: "C",
      action: () => (window.location.href = "/#contact"),
      group: "Navigation",
    },
  ];

  const socialCommands: CommandItem[] = [
    {
      id: "github",
      name: "GitHub",
      icon: <Github className="w-4 h-4" />,
      action: () => window.open("https://github.com/yourusername", "_blank"),
      group: "Social",
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: <Linkedin className="w-4 h-4" />,
      action: () =>
        window.open("https://linkedin.com/in/yourusername", "_blank"),
      group: "Social",
    },
    {
      id: "twitter",
      name: "Twitter",
      icon: <Twitter className="w-4 h-4" />,
      action: () => window.open("https://twitter.com/yourusername", "_blank"),
      group: "Social",
    },
  ];

  const themeCommand: CommandItem = {
    id: "theme",
    name: theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode",
    icon:
      theme === "dark" ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      ),
    shortcut: "T",
    action: () => setTheme(theme === "dark" ? "light" : "dark"),
    group: "Preferences",
  };

  const allCommands = [...navigationCommands, ...socialCommands, themeCommand];

  const filteredCommands = allCommands.filter(
    (cmd) =>
      cmd.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.group.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedCommands = filteredCommands.reduce<
    Record<string, CommandItem[]>
  >((groups, cmd) => {
    if (!groups[cmd.group]) {
      groups[cmd.group] = [];
    }
    groups[cmd.group].push(cmd);
    return groups;
  }, {});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(!isOpen);
      }

      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredCommands.length - 1 ? prev + 1 : prev
        );
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      }

      if (e.key === "Enter" && filteredCommands[selectedIndex]) {
        e.preventDefault();
        filteredCommands[selectedIndex].action();
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands]);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (commandListRef.current && selectedIndex >= 0) {
      const selectedItem = commandListRef.current.querySelector(
        `[data-index="${selectedIndex}"]`
      );
      if (selectedItem) {
        selectedItem.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [selectedIndex]);

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
        aria-label="Open command palette"
      >
        <Command className="w-6 h-6" />
      </button>

      {/* Command Palette Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50 backdrop-blur-sm">
          <div
            className="w-full max-w-2xl mx-4 bg-background rounded-lg shadow-2xl overflow-hidden border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="relative border-b border-border">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type a command or search..."
                className="w-full p-4 pl-10 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
                autoFocus
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                <kbd className="px-2 py-1 text-xs rounded bg-muted text-muted-foreground">
                  Esc
                </kbd>
              </div>
            </div>

            {/* Command List */}
            <div
              ref={commandListRef}
              className="max-h-[400px] overflow-y-auto p-2"
            >
              {Object.entries(groupedCommands).length > 0 ? (
                Object.entries(groupedCommands).map(([group, commands]) => (
                  <div key={group} className="py-2">
                    <div className="px-3 py-1 text-xs font-medium text-muted-foreground">
                      {group}
                    </div>
                    <div className="space-y-1">
                      {commands.map((cmd, index) => {
                        const commandIndex = filteredCommands.findIndex(
                          (c) => c.id === cmd.id
                        );
                        return (
                          <button
                            key={cmd.id}
                            data-index={commandIndex}
                            className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                              selectedIndex === commandIndex
                                ? "bg-accent text-accent-foreground"
                                : "hover:bg-accent/50"
                            }`}
                            onClick={() => {
                              cmd.action();
                              setIsOpen(false);
                            }}
                          >
                            <div className="flex items-center justify-center w-6 h-6 mr-3 text-muted-foreground">
                              {cmd.icon}
                            </div>
                            <span className="flex-1 text-left">{cmd.name}</span>
                            {cmd.shortcut && (
                              <kbd className="ml-2 px-1.5 py-0.5 text-xs rounded bg-muted text-muted-foreground">
                                {cmd.shortcut}
                              </kbd>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <p>No commands found</p>
                  <p className="text-xs mt-2">Try a different search term</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-2 text-xs text-muted-foreground border-t border-border bg-muted/30">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <span className="mr-1">↑↓</span> Navigate
                </span>
                <span className="flex items-center">
                  <span className="mr-1">↵</span> Select
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span>⌘K to close</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CommandPalette;
