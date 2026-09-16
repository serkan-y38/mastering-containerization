import {ArrowRight, BookOpen} from 'lucide-react';

const Hero = () => {
    return (
        <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24">
            {/* Background glow effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]
      bg-teal-500/20 blur-[120px] rounded-full pointer-events-none"></div>
            <div
                className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700/50
          text-teal-400 text-sm font-medium mb-8 backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                        DevOps Excellence
                    </div>

                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-white">
                        Mastering <span
                        className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-400">Containerization</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed">
                        Package your code, isolate your environments, and deploy seamlessly anywhere.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                        <button className="w-full sm:w-auto px-8 py-3 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-900
            font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(20,184,166,0.3)]
            hover:shadow-[0_0_30px_rgba(20,184,166,0.5)]">
                            Start Learning
                            <ArrowRight className="w-5 h-5"/>
                        </button>
                        <button className="w-full sm:w-auto px-8 py-3 rounded-lg bg-slate-800/50 border border-slate-700
            hover:border-slate-600 hover:bg-slate-800 text-slate-300 font-semibold transition-all duration-300 flex
            items-center justify-center gap-2 backdrop-blur-sm">
                            <BookOpen className="w-5 h-5"/>
                            View Docs
                        </button>
                    </div>
                </div>

                {/* Abstract Graphic */}
                <div className="mt-20 flex justify-center perspective-1000">
                    <div className="relative w-full max-w-lg aspect-video rounded-xl bg-slate-800/40 border
          border-slate-700/50 backdrop-blur-md shadow-2xl overflow-hidden flex items-center justify-center group">
                        {/* Layers representing containers */}
                        <div className="absolute w-3/4 h-3/4 border-2 border-indigo-500/30 rounded-lg transform -translate-y-4
            group-hover:-translate-y-8 transition-transform duration-700 ease-in-out"></div>
                        <div className="absolute w-3/4 h-3/4 border-2 border-teal-500/40 rounded-lg backdrop-blur-sm
            bg-slate-900/50 transform group-hover:-translate-y-2 transition-transform duration-700 ease-in-out delay-75"></div>
                        <div className="absolute w-3/4 h-3/4 border-2 border-teal-400/60 rounded-lg backdrop-blur-md
            bg-slate-800/80 transform translate-y-4 group-hover:translate-y-4 transition-transform duration-700
            ease-in-out delay-150 flex items-center justify-center shadow-lg">
                            <div className="grid grid-cols-3 gap-3 p-4 w-full">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i}
                                         className="h-12 bg-slate-700/50 rounded-md border border-slate-600/50"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
