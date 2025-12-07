import { FileText, LayoutDashboard, Users, BrainCircuit } from "lucide-react"
import { View } from "./index"

export default function AdminHomeView({ setCurrentView }: { setCurrentView: (view: View) => void }) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {[
        { id: 'contacts', label: 'Contacts', icon: Users, desc: 'Manage inquiries' },
        { id: 'projects', label: 'Projects', icon: LayoutDashboard, desc: 'Showcase work' },
        { id: 'blogs', label: 'Notelogs', icon: FileText, desc: 'Write thoughts' },
        { id: 'preparation', label: 'Preparation', icon: BrainCircuit, desc: 'AI Interview Prep' },
      ].map((item) => (
        <button
          key={item.id}
          onClick={() => setCurrentView(item.id as View)}
          className="flex flex-col items-center justify-center p-12 bg-white/5 border border-white/10  hover:border-accent/50 hover:bg-white/10 transition-all group text-center"
        >
          <div className="p-4 bg-black  mb-6 group-hover:text-accent transition-colors">
            <item.icon size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-2">{item.label}</h2>
          <p className="text-foreground/60">{item.desc}</p>
        </button>
      ))}
    </div>
  )
}