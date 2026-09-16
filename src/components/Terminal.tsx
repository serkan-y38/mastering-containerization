import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const commands = [
  {
    id: 1,
    comment: '# Build an image from a blueprint',
    code: 'build -t my-app:latest .'
  },
  {
    id: 2,
    comment: '# Run a container in the background',
    code: 'run -d -p 8080:80 my-app:latest'
  },
  {
    id: 3,
    comment: '# View active running containers',
    code: 'ps'
  }
];

const Terminal = () => {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopy = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Command Cheat Sheet</h2>
            <p className="text-slate-400">Essential commands for everyday operations.</p>
          </div>
          
          <div className="bg-[#1e1e1e] rounded-xl overflow-hidden shadow-2xl border border-slate-700/50">
            {/* Mac-style Top Bar */}
            <div className="bg-[#2d2d2d] px-4 py-3 flex items-center gap-2 border-b border-slate-700/50">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div className="ml-4 text-xs text-slate-400 font-mono">bash - my-app</div>
            </div>
            
            {/* Terminal Body */}
            <div className="p-6 font-mono text-sm md:text-base">
              <div className="flex flex-col gap-6">
                {commands.map((cmd) => (
                  <div key={cmd.id} className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2 -m-2 rounded-lg hover:bg-white/5 transition-colors">
                    <div>
                      <div className="text-slate-500 mb-1">{cmd.comment}</div>
                      <div className="text-emerald-400 flex items-center gap-2">
                        <span className="text-slate-500">$</span>
                        {cmd.code}
                      </div>
                    </div>
                    <button 
                      onClick={() => handleCopy(cmd.id, cmd.code)}
                      className="p-2 rounded-md bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors self-start sm:self-auto opacity-0 group-hover:opacity-100 focus:opacity-100"
                      aria-label="Copy command"
                    >
                      {copiedId === cmd.id ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-2 text-slate-500">
                <span>$</span>
                <span className="w-2 h-5 bg-slate-500 animate-pulse"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Terminal;
