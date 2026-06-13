export default function PageLoader({ label = "LOADING" }: { label?: string }) {
  return (
    <main className="min-h-screen bg-black pt-8 md:pt-12 pb-24 px-6 md:pl-24">
      <div className="max-w-7xl mx-auto animate-pulse">
        <div className="h-24 w-2/3 md:w-1/3 bg-white/5 mb-16" />
        <div className="h-4 w-full max-w-xl bg-white/5 mb-4" />
        <div className="h-4 w-3/4 max-w-md bg-white/5 mb-24" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 bg-white/5 border border-white/5" />
          ))}
        </div>
        <p className="mt-16 text-[10px] font-black uppercase tracking-[0.5em] text-foreground/20">
          {`// ${label}`}
        </p>
      </div>
    </main>
  );
}
