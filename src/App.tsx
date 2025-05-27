import "./App.css"

import QuarterlyReport from './components/QuarterlyReport/QuarterlyReport';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';

const App = () => {
  return (
    <div className="App">
      <QuarterlyReport />
      <ThemeToggle />
    </div>
  );
};

export default App;