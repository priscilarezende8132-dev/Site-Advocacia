import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./content/pages/Home";    // Caminho com content
import Blog from "./content/pages/Blog";    // Caminho com content
import Post from "./content/pages/Post";    // Caminho com content

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<Post />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;