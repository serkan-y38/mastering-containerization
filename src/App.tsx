import Hero from './components/Hero';
import Concepts from './components/Concepts';
import Terminal from './components/Terminal';
import Footer from './components/Footer';

function App() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-900 text-slate-200">
            <main className="flex-grow">
                <Hero/>
                <Concepts/>
                <Terminal/>
            </main>
            <Footer/>
        </div>
    );
}

export default App;
