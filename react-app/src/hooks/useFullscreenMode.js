import { useEffect } from 'react';

const useFullscreenMode = () => {
  useEffect(() => {
    // স্টাইল পরিবর্তন করার জন্য একটি স্টাইল ট্যাগ তৈরি করা
    const style = document.createElement('style');
    style.id = 'psp-fullscreen-styles'; // একটি ইউনিক আইডি দেওয়া হলো
    style.innerHTML = `
      /* ওয়ার্ডপ্রেস অ্যাডমিন বার এবং থিমের হেডার/ফুটার লুকানো */
      #wpadminbar, #header, .header, #footer, .footer, #colophon {
        display: none !important;
      }

      /* বডি এবং এইচটিএমএল ট্যাগকে রিসেট করা */
      html, body {
        overflow: hidden !important; /* স্ক্রলবার বন্ধ */
        padding-top: 0 !important; /* অ্যাডমিন বারের প্যাডিং সরানো */
      }
      
      /* থিমের মূল কন্টেইনারকে full-width করা */
      #page, #content, .site-content, .entry-content, main {
        width: 100vw !important;
        max-width: 100vw !important;
        padding: 0 !important;
        margin: 0 !important;
        overflow: hidden; /* ভেতরের কন্টেইনারের স্ক্রল বন্ধ */
      }

      /* আমাদের React অ্যাপের রুটকে স্ক্রিনের পুরোটা দেওয়া */
      #root {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 99999; /* অন্য সবকিছুর উপরে থাকবে */
        background: #f8fafc; /* আপনার অ্যাপের ব্যাকগ্রাউন্ড কালার */
      }
    `;

    // স্টাইল ট্যাগটি ডকুমেন্টের হেডে যোগ করা
    document.head.appendChild(style);

    // কম্পোনেন্ট আনমাউন্ট হলে স্টাইল ট্যাগটি সরিয়ে ফেলা
    return () => {
      const styleTag = document.getElementById('psp-fullscreen-styles');
      if (styleTag) {
        styleTag.remove();
      }
      // পুরোনো স্টাইলগুলো ফিরিয়ে আনা (ঐচ্ছিক)
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []); // এই ইফেক্টটি শুধু একবারই চলবে
};

export default useFullscreenMode;