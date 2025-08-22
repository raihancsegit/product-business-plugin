import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // 빌্ড করা ফাইলগুলো dist ফোল্ডারে যাবে
    outDir: 'dist',
    // manifest.json ফাইল তৈরি করবে যা ওয়ার্ডপ্রেসের জন্য অপরিহার্য
    manifest: true,
    rollupOptions: {
      // আমাদের React অ্যাপের এন্ট্রি পয়েন্ট
      input: '/src/main.jsx',
    },
  },
});