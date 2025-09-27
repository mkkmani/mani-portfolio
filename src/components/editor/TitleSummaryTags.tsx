import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, X, Tag as TagIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface TitleSummaryTagsProps {
  title: string;
  onTitleChange: (title: string) => void;
  summary: string;
  onSummaryChange: (summary: string) => void;
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  tagInput: string;
  onTagInputChange: (value: string) => void;
}

export const TitleSummaryTags: React.FC<TitleSummaryTagsProps> = ({
  title,
  onTitleChange,
  summary,
  onSummaryChange,
  tags,
  onAddTag,
  onRemoveTag,
  tagInput,
  onTagInputChange,
}) => {
  const [showTagInput, setShowTagInput] = useState(false);
  const [titleFocused, setTitleFocused] = useState(false);
  const maxTags = 4;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      if (tags.length < maxTags && !tags.includes(tagInput.trim())) {
        onAddTag(tagInput.trim());
      }
      onTagInputChange("");
      setShowTagInput(false);
    } else if (e.key === "Escape") {
      onTagInputChange("");
      setShowTagInput(false);
    }
  };

  const handleAddTagClick = () => {
    if (
      tagInput.trim() &&
      tags.length < maxTags &&
      !tags.includes(tagInput.trim())
    ) {
      onAddTag(tagInput.trim());
      onTagInputChange("");
      setShowTagInput(false);
    }
  };

  useEffect(() => {
    if (tags.length >= maxTags) {
      setShowTagInput(false);
    }
  }, [tags.length]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title Section */}
      <div className="space-y-2">
        <div className="relative">
          <Input
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            onFocus={() => setTitleFocused(true)}
            onBlur={() => setTitleFocused(false)}
            placeholder="Enter your blog title..."
            className={cn(
              "text-2xl sm:text-3xl lg:text-4xl font-bold h-auto py-6 px-4",
              "border-0 border-b-2 border-border bg-transparent rounded-none",
              "focus-visible:ring-0 focus-visible:ring-offset-0",
              "focus-visible:border-primary transition-colors duration-200",
              "placeholder:text-muted-foreground/60 placeholder:font-normal",
              titleFocused ? "border-primary" : "border-border"
            )}
          />
        </div>
      </div>

      {/* Summary Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground uppercase tracking-wider">
            Summary
          </h3>
          <span
            className={cn(
              "text-xs text-muted-foreground",
              summary.length > 180 && "text-orange-500",
              summary.length >= 200 && "text-destructive"
            )}
          >
            {summary.length}/200
          </span>
        </div>

        <div className="relative">
          <Input
            value={summary}
            onChange={(e) => onSummaryChange(e.target.value)}
            placeholder="Write a brief summary of your blog post..."
            maxLength={200}
            className={cn(
              "text-base py-4 px-4 min-h-[3rem] bg-transparent",
              "border-0 border-b border-border rounded-none",
              "focus-visible:ring-0 focus-visible:ring-offset-0",
              "focus-visible:border-primary transition-colors duration-200",
              "placeholder:text-muted-foreground/60 resize-none"
            )}
          />
        </div>
      </div>

      {/* Tags Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground uppercase tracking-wider flex items-center gap-2">
            <TagIcon className="h-4 w-4" />
            Tags
          </h3>
          <span
            className={cn(
              "text-xs text-muted-foreground",
              tags.length >= maxTags && "text-orange-500"
            )}
          >
            {tags.length}/{maxTags}
          </span>
        </div>

        {/* Tags Container */}
        <div className="space-y-4">
          {/* Existing Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className={cn(
                    "px-3 py-1.5 text-sm bg-secondary/80 hover:bg-secondary",
                    "flex items-center gap-1.5 group transition-colors duration-200"
                  )}
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => onRemoveTag(tag)}
                    className={cn(
                      "rounded-full hover:bg-destructive/20 p-0.5",
                      "transition-colors duration-200",
                      "opacity-60 group-hover:opacity-100"
                    )}
                    aria-label={`Remove ${tag} tag`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Add Tag Section */}
          {showTagInput ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                value={tagInput}
                onChange={(e) => onTagInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => {
                  setTimeout(() => {
                    if (!tagInput.trim()) {
                      setShowTagInput(false);
                    }
                  }, 150);
                }}
                placeholder="Type tag name..."
                autoFocus
                className={cn(
                  "h-10 text-sm px-3 flex-1 sm:max-w-xs",
                  "border border-border bg-background",
                  "focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0",
                  "focus-visible:border-primary"
                )}
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  className="h-10 px-4 text-sm"
                  onClick={handleAddTagClick}
                  disabled={
                    !tagInput.trim() ||
                    tags.includes(tagInput.trim()) ||
                    tags.length >= maxTags
                  }
                >
                  Add
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-10 px-4 text-sm"
                  onClick={() => {
                    onTagInputChange("");
                    setShowTagInput(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : tags.length < maxTags ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={cn(
                "h-10 px-4 text-sm border-dashed",
                "hover:bg-muted/50 hover:border-solid",
                "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setShowTagInput(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Tag
            </Button>
          ) : null}

          {/* Helper Text */}
          <div className="text-xs text-muted-foreground space-y-1">
            {showTagInput ? (
              <p>Press Enter or comma to add the tag</p>
            ) : tags.length === 0 ? (
              <p>Add tags to help categorize your blog post</p>
            ) : tags.length >= maxTags ? (
              <p>Maximum number of tags reached</p>
            ) : (
              <p>
                You can add {maxTags - tags.length} more tag
                {maxTags - tags.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
