// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// IMPORTANT: imports MUST match exact filename + case on disk
import Overview from "./pages/overview.jsx";
import DocumentTracker from "./pages/DocumentTracker.jsx";
import Settings from "./pages/settings.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/document-tracker" replace />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/document-tracker" element={<DocumentTracker />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;
