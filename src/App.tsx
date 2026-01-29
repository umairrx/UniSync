import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";
import LandingPage from "./pages/LandingPage";
import TimetablePage from "./pages/TimetablePage";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/table" element={<TimetablePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
