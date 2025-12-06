import { ArrowLeft, LogOut, Plus } from "lucide-react";
import Link from "next/link";
import { View } from "./index";

export default function DashboardHeader({ currentView, setCurrentView, handleLogout, setModalOpen, setModalType, setFormData }: {
  currentView: View;
  setCurrentView: (view: View) => void;
  handleLogout: () => void;
  setModalOpen: (open: boolean) => void;
  setModalType: (type: 'project' | 'blog' | null) => void;
  setFormData: (data: any) => void;
}) {
  return (

    <header className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {currentView !== 'home' && (
            <button
              onClick={() => setCurrentView('home')}
              className="p-2 hover:bg-white/10  transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <h1 className="text-xl font-bold tracking-tight">
            Admin<span className="text-accent">Panel</span>
            {currentView !== 'home' && <span className="text-foreground/40 ml-2 capitalize">/ {currentView}</span>}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Home Button */}
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 text-foreground/60 hover:text-accent transition-colors text-sm font-medium"
            title="Back to Home"
          >
            <ArrowLeft size={16} />
            Home
          </Link>
          {(currentView === 'projects' || currentView === 'blogs') && (
            <button
              onClick={() => {
                setModalType(currentView === 'projects' ? 'project' : 'blog');
                setModalOpen(true);
                setFormData({});
              }}
              className="flex items-center gap-2 px-4 py-2 bg-accent text-black font-bold  hover:bg-white transition-colors text-sm"
            >
              <Plus size={16} />
              Add New
            </button>
          )}
          <button
            onClick={handleLogout}
            className="p-2 text-red-400 hover:bg-red-500/10  transition-colors"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  )
}