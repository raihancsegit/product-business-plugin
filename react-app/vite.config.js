import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { watch } from 'vite-plugin-watch'; // নতুন প্লাগইন ইম্পোর্ট

export default defineConfig({
  plugins: [
    react(),
    // watch প্লাগইনটি এখানে কনফিগার করা হচ্ছে
    watch({
      pattern: 'src/**/*', // src ফোল্ডারের যেকোনো ফাইল পরিবর্তন হলে
      command: 'npm run build', // 'npm run build' কমান্ডটি আবার চালাও
    }),
  ],
  build: {
    outDir: 'dist', // বিল্ড ফাইলগুলো dist ফোল্ডারে যাবে
    manifest: true, // manifest.json ফাইল তৈরি করবে
    rollupOptions: {
      // input main.jsx to make sure it's the entry point
      input: '/src/main.jsx',
    },
  },
});