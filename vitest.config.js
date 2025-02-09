import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const reporter = process.env.VITEST_REPORTER;

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    coverage: {
      provider: "v8", // Ou "c8" se precisar de mais compatibilidade
      reporter: ["text", "html", "lcov"], // Adiciona "html" para gerar o relatório visual
      reportsDirectory: "coverage", // Diretório onde os arquivos serão gerados
    },    
    environment: "jsdom",
    reporters: reporter
      ? [[reporter, { outputFile: "coverage/coverage.xml" }]]
      : [],
    outputFile: "coverage/coverage.xml",
    testTimeout: 30000,
    include: ['**/*.test.{js,jsx,ts,tsx}', '**/*.spec.{js,jsx,ts,tsx}'],
  },
});
