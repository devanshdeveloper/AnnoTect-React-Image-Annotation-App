import "./index.css";
import HomePage from "./pages/HomePage";
import ImageAnnotator from "./pages/ImageAnnotator";
import MainProvider from "./context/MainContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createRoot } from "react-dom/client";

const root = createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter basename="/">
    <MainProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/image-annotator" element={<ImageAnnotator />} />
      </Routes>
    </MainProvider>
  </BrowserRouter>
);
