import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Local dummy plugin (replace with your real logic if needed)
function componentTagger() {
  return {
    name: "component-tagger",
    transform(code: any, id: string) {
      // Example logic (optional)
      if (id.endsWith(".tsx") || id.endsWith(".jsx")) {
        console.log(`[ComponentTagger] Processing: ${id}`);
      }
      return code;
    },
  };
}

// Vite config
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    ...(mode === "development" ? [componentTagger()] : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
