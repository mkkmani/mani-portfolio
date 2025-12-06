import { ArrowRight, Star } from "lucide-react";
import { Blog } from "./index";

interface Props {
  blogs: Blog[];
  filter: 'all' | 'published' | 'draft';
  handleTogglePublish: (id: string, type: 'project' | 'blog', currentStatus: boolean) => void;
  handleToggleFavourite: (id: string, type: 'project' | 'blog', currentStatus: boolean) => void;
}

export default function BlogsView({ blogs, filter, handleTogglePublish, handleToggleFavourite }: Props) {
  return (
    <div className="grid gap-4">
      {blogs
        .filter(b => filter === 'all' ? true : filter === 'published' ? b.published : !b.published)
        .map((blog) => (
          <div key={blog._id} className="group bg-black border border-white/10 p-6 hover:border-accent/50 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-serif text-2xl text-foreground group-hover:text-accent transition-colors">{blog.title}</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleFavourite(blog._id, 'blog', blog.favourite)}
                  className={`p-1.5  transition-all ${blog.favourite ? 'bg-accent text-black' : 'bg-white/5 text-white border border-white/20 hover:bg-white/10'}`}
                  title={blog.favourite ? 'Remove from favourites' : 'Add to favourites'}
                >
                  <Star size={14} fill={blog.favourite ? 'currentColor' : 'none'} />
                </button>
                <span className={`text-[10px] font-bold px-2 py-1 uppercase tracking-wider border ${blog.published ? 'text-accent border-accent' : 'text-yellow-500 border-yellow-500'}`}>
                  {blog.published ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>

            <p className="text-foreground/60 text-sm leading-relaxed mb-6 font-serif italic border-l-2 border-white/10 pl-4">
              {blog.excerpt}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-white/5 text-[10px] font-mono text-foreground/40 border border-white/5">{blog.slug}</span>
                <span className="text-[10px] font-mono text-foreground/40">{new Date(blog.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleTogglePublish(blog._id, 'blog', blog.published)}
                  className="text-xs font-bold uppercase tracking-wider hover:text-accent text-foreground/60"
                >
                  {blog.published ? 'Unpublish' : 'Publish'}
                </button>
                <a
                  href={`/notelogs/${blog.slug}`}
                  target="_blank"
                  className="text-accent hover:text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 group-hover:gap-3 transition-all"
                >
                  View Post <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </div>
        ))}
    </div>
  )
}