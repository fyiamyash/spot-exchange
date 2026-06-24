import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
// import { AssetBar } from "./components/AssetBar";
// import { OrderBook } from "./components/OrderBook";
import { Spot } from "./pages/Spot";

import { LandingPage } from "./pages/LandingPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route path="/spot" element={<Spot />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
