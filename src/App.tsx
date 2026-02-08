import { AppProvider } from './context/AppContext';
import { AppContent } from './AppContents';

const App = () => {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>      
    );
};

export default App;
