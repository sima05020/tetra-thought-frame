import { Board } from './components/Board';
import { ProjectSelector } from './components/ProjectSelector';
import { ThoughtProvider } from './contexts/ThoughtContext';

function AppContent() {
    return (
        <div className="h-screen flex flex-col bg-gray-50">
            <ProjectSelector />
            <Board />
        </div>
    );
}

function App() {
    return (
        <ThoughtProvider>
            <AppContent />
        </ThoughtProvider>
    );
}

export default App;
