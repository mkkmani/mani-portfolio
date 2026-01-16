'use client';

import { useState, useRef } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateProjectModal({ isOpen, onClose, onSuccess }: CreateProjectModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    tags: '',
    link: '',
    github: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit check
        setError('Image size too large. Please upload an image smaller than 1MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
          published: false,
        }),
      });

      if (res.ok) {
        onSuccess();
        onClose();
        setFormData({ title: '', description: '', image: '', tags: '', link: '', github: '' });
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to create project');
      }
    } catch (err) {
      setError('An error occurred while creating the project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl bg-background border border-white/10 p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold uppercase tracking-tight">
            Add New <span className="text-accent">Project</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:text-accent transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-foreground/40 mb-2">
              Project Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-accent outline-none transition-colors"
              placeholder="e.g. AI Portfolio Dashboard"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-foreground/40 mb-2">
              Description
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-accent outline-none transition-colors h-32 resize-none"
              placeholder="Describe the project goals, tech stack, and features..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-foreground/40 mb-2">
                Project Image (Upload)
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full aspect-video bg-white/5 border border-white/10 hover:border-accent/50 transition-all cursor-pointer flex flex-col items-center justify-center relative group overflow-hidden"
              >
                {formData.image ? (
                  <>
                    <img src={formData.image} alt="Upload preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-bold uppercase tracking-widest">
                      Change Image
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-foreground/40">
                    <Upload size={24} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Click to upload</span>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-foreground/40 mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                required
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-accent outline-none transition-colors"
                placeholder="Next.js, Tailwind, MongoDB..."
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-foreground/40 mb-2">
                Live Link (optional)
              </label>
              <input
                type="text"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-accent outline-none transition-colors"
                placeholder="https://project.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-foreground/40 mb-2">
                GitHub Repo (optional)
              </label>
              <input
                type="text"
                value={formData.github}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-accent outline-none transition-colors"
                placeholder="https://github.com/..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 border border-white/10 hover:bg-white/5 transition-colors font-bold uppercase tracking-widest text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-accent text-background hover:bg-accent/90 transition-colors font-bold uppercase tracking-widest text-xs disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
