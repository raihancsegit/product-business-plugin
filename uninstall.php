<?php
// যদি ওয়ার্ডপ্রেস থেকে সরাসরি আনইন্সটল করা না হয়, তাহলে ফাইলটি কাজ করবে না।
if (! defined('WP_UNINSTALL_PLUGIN')) {
    die;
}

global $wpdb;
$table_name = $wpdb->prefix . 'psp_products';

// আমাদের কাস্টম ডাটাবেস টেবিলটি ড্রপ করা হচ্ছে
$wpdb->query("DROP TABLE IF EXISTS $table_name");
