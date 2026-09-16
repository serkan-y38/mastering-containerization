import {Box, Layers, HardDrive, Network} from 'lucide-react';

const concepts = [
    {
        title: 'Isolated Environments',
        description: 'Run applications in secure, standalone environments that contain everything needed to execute, eliminating the "works on my machine" problem.',
        icon: Box,
        color: 'text-teal-400',
        bg: 'bg-teal-400/10',
        border: 'group-hover:border-teal-500/50'
    },
    {
        title: 'Immutable Blueprints',
        description: 'Use read-only templates that define the environment. Once built, they never change, ensuring consistent deployments every time.',
        icon: Layers,
        color: 'text-indigo-400',
        bg: 'bg-indigo-400/10',
        border: 'group-hover:border-indigo-500/50'
    },
    {
        title: 'Persistent Storage',
        description: 'Mount external storage directories to preserve state and data even when the application environment is destroyed or recreated.',
        icon: HardDrive,
        color: 'text-purple-400',
        bg: 'bg-purple-400/10',
        border: 'group-hover:border-purple-500/50'
    },
    {
        title: 'Virtual Networking',
        description: 'Connect isolated environments together seamlessly through private networks and expose specific ports to the outside world securely.',
        icon: Network,
        color: 'text-blue-400',
        bg: 'bg-blue-400/10',
        border: 'group-hover:border-blue-500/50'
    }
];

const Concepts = () => {
    return (
        <section className="py-20 bg-slate-900/50 border-y border-slate-800/50 relative">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-white mb-4">Core Concepts</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Understanding the fundamental building blocks of modern deployment infrastructure.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {concepts.map((concept, index) => {
                        const Icon = concept.icon;
                        return (
                            <div
                                key={index}
                                className={`group p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm 
                                transition-all duration-300 hover:-translate-y-2 hover:bg-slate-800/80 ${concept.border} hover:shadow-xl hover:shadow-slate-900/50`}
                            >
                                <div
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${concept.bg} ${concept.color}`}>
                                    <Icon className="w-6 h-6"/>
                                </div>
                                <h3 className="text-xl font-semibold text-slate-100 mb-3 group-hover:text-white transition-colors">
                                    {concept.title}
                                </h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    {concept.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Concepts;
