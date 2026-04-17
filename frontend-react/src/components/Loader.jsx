function Loader({ text = "Loading..." }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center animate-fade-in">
        {/* Orbiting dots */}
        <div className="relative w-12 h-12 mb-5">
          <div className="absolute inset-0 rounded-full border-2 border-violet-500/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-violet-500 animate-spin" />
          <div className="absolute inset-1.5 rounded-full border-2 border-transparent border-t-cyan-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.6)]" />
          </div>
        </div>
        <p className="text-gray-500 text-sm font-medium">{text}</p>
      </div>
    </div>
  );
}

export default Loader;
