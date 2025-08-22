<?php

/**
 * Plugin Name: ProductScope Pro
 * Description: An Amazon product research dashboard with a React frontend.
 * Version: 1.0
 * Author: Raihan Islam
 */

if (! defined('ABSPATH')) {
    exit; // সরাসরি ফাইল অ্যাক্সেস বন্ধ করার জন্য।
}

function psp_activate_plugin()
{
    global $wpdb; // ওয়ার্ডপ্রেস ডাটাবেস নিয়ে কাজ করার জন্য এটি প্রয়োজন।

    $table_name = $wpdb->prefix . 'psp_products'; // টেবিলের নাম হবে wp_psp_products
    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE $table_name (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        product_title text NOT NULL,
        product_subtitle text,
        image_url varchar(255) DEFAULT '' NOT NULL,
        price decimal(10, 2) NOT NULL,
        reviews_count int(11),
        rating decimal(3, 1),
        monthly_sales int(11),
        category varchar(100),
        subcategory varchar(100),
        sales_trend_90d varchar(20),
        last_year_sales int(11),
        yoy_sales_percent varchar(20),
        dimensions varchar(50),
        weight_lbs decimal(10, 2),
        age_months int(11),
        asin varchar(20) UNIQUE,
        PRIMARY KEY  (id)
    ) $charset_collate;";

    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql); // dbDelta() ফাংশনটি টেবিল তৈরি বা আপডেট করতে সাহায্য করে।

    // নতুন: কাস্টম রোল যোগ করার কোড
    add_role('psp_basic_user', 'Basic User', ['read' => true]);
    add_role('psp_expert_user', 'Expert User', ['read' => true]);
    add_role('psp_advanced_user', 'Advanced User', ['read' => true]);
}
register_activation_hook(__FILE__, 'psp_activate_plugin');


// অ্যাডমিন মেন্যুতে একটি নতুন পেজ যুক্ত করার ফাংশন
function psp_admin_menu()
{
    add_menu_page(
        'ProductScope Pro Importer', // পেজের টাইটেল
        'Product Importer',          // মেন্যুর নাম
        'manage_options',            // শুধুমাত্র অ্যাডমিনরা দেখতে পাবে
        'psp-importer',              // পেজের ইউনিক slug
        'psp_importer_page_html',    // এই পেজের HTML দেখানোর ফাংশন
        'dashicons-upload',          // মেন্যুর আইকন
        25                           // মেন্যুতে অবস্থান
    );
}
add_action('admin_menu', 'psp_admin_menu');

// অ্যাডমিন পেজের HTML কন্টেন্ট দেখানোর ফাংশন
function psp_importer_page_html()
{
?>
    <div class="wrap">
        <h1>Import Products via CSV</h1>
        <p>Upload a CSV file with product data. The columns should be in the correct order: product_title, image_url, price,
            etc.</p>

        <form method="post" enctype="multipart/form-data">
            <table class="form-table">
                <tr valign="top">
                    <th scope="row">Upload CSV File</th>
                    <td><input type="file" name="product_csv_file" /></td>
                </tr>
            </table>
            <?php
            // নিরাপত্তার জন্য Nonce ফিল্ড যোগ করা হচ্ছে
            wp_nonce_field('psp_csv_import_nonce', 'psp_nonce_field');
            submit_button('Upload and Import');
            ?>
        </form>
    </div>
<?php
}

function psp_handle_csv_upload()
{
    // ফর্মটি সাবমিট করা হয়েছে কিনা এবং ফাইল আপলোড হয়েছে কিনা তা পরীক্ষা করা
    if (isset($_POST['submit']) && isset($_FILES['product_csv_file']) && check_admin_referer('psp_csv_import_nonce', 'psp_nonce_field')) {

        // ফাইলটি CSV কিনা তা নিশ্চিত করা
        $file_mimes = array('text/x-comma-separated-values', 'text/comma-separated-values', 'application/octet-stream', 'application/vnd.ms-excel', 'application/x-csv', 'text/x-csv', 'text/csv', 'application/csv', 'application/excel', 'application/vnd.msexcel', 'text/plain');
        if (!in_array($_FILES['product_csv_file']['type'], $file_mimes)) {
            echo "<div class='error'><p>Error: Please upload a valid CSV file.</p></div>";
            return;
        }

        // ফাইলটি খোলা হচ্ছে
        $csv_file = fopen($_FILES['product_csv_file']['tmp_name'], 'r');

        // প্রথম সারি (হেডার) বাদ দেওয়া হচ্ছে
        fgetcsv($csv_file);

        global $wpdb;
        $table_name = $wpdb->prefix . 'psp_products';

        $imported_count = 0;
        // ফাইলের প্রতিটি সারি লুপের মাধ্যমে পড়া হচ্ছে
        while (($row = fgetcsv($csv_file)) !== FALSE) {
            // ডেটাবেসে ডেটা ইনসার্ট করা হচ্ছে
            $wpdb->insert(
                $table_name,
                [
                    'product_title'     => sanitize_text_field($row[0]),
                    'product_subtitle'    => sanitize_text_field($row[1]),
                    'image_url'         => esc_url_raw($row[2]),
                    'price'             => floatval($row[3]),
                    'reviews_count'     => intval($row[4]),
                    'rating'            => floatval($row[5]),
                    'monthly_sales'     => intval($row[6]),
                    'category'          => sanitize_text_field($row[7]),
                    'subcategory'       => sanitize_text_field($row[8]),
                    'sales_trend_90d'   => sanitize_text_field($row[9]),
                    'last_year_sales'   => intval($row[10]),
                    'yoy_sales_percent' => sanitize_text_field($row[11]),
                    'dimensions'        => sanitize_text_field($row[12]),
                    'weight_lbs'        => floatval($row[13]),
                    'age_months'        => intval($row[14]),
                    'asin'              => sanitize_text_field($row[15]),
                ]
            );
            $imported_count++;
        }

        fclose($csv_file);
        echo "<div class='updated'><p>Successfully imported " . $imported_count . " products!</p></div>";
    }
}
add_action('admin_init', 'psp_handle_csv_upload');


function psp_deactivate_plugin()
{
    remove_role('psp_basic_user');
    remove_role('psp_expert_user');
    remove_role('psp_advanced_user');
}
register_deactivation_hook(__FILE__, 'psp_deactivate_plugin');


function psp_register_api_routes()
{
    register_rest_route('productscope/v1', '/products', [
        'methods' => 'GET', // এই URL শুধুমাত্র GET রিকোয়েস্ট গ্রহণ করবে।
        'callback' => 'psp_get_products_callback', // রিকোয়েস্ট আসলে কোন ফাংশনটি কাজ করবে।
        'permission_callback' => function () {
            // শুধুমাত্র লগইন করা ইউজাররা এই API ব্যবহার করতে পারবে।
            return is_user_logged_in();
        }

    ]);
}
add_action('rest_api_init', 'psp_register_api_routes');

add_action('rest_api_init', 'psp_register_favorites_api_routes');
function psp_register_favorites_api_routes()
{
    // ফেভারিট প্রোডাক্টের তালিকা পাওয়ার জন্য
    register_rest_route('productscope/v1', '/favorites', [
        'methods' => 'GET',
        'callback' => 'psp_get_favorites',
        'permission_callback' => function () {
            return is_user_logged_in();
        }
    ]);

    // একটি প্রোডাক্টকে ফেভারিট হিসেবে যোগ/বাদ দেওয়ার জন্য
    register_rest_route('productscope/v1', '/favorites/toggle', [
        'methods' => 'POST',
        'callback' => 'psp_toggle_favorite',
        'permission_callback' => function () {
            return is_user_logged_in();
        }
    ]);
}

// ফেভারিট প্রোডাক্টের তালিকা ফেরত দেওয়ার ফাংশন
function psp_get_favorites(WP_REST_Request $request)
{
    $user_id = get_current_user_id();
    $favorite_ids = get_user_meta($user_id, 'psp_favorite_products', true);

    if (empty($favorite_ids)) {
        return new WP_REST_Response(['products' => []], 200);
    }

    // এখন এই আইডিগুলো দিয়ে প্রোডাক্টের ডেটা ডাটাবেস থেকে আনতে হবে
    global $wpdb;
    $table_name = $wpdb->prefix . 'psp_products';

    $id_placeholders = implode(', ', array_fill(0, count($favorite_ids), '%d'));
    $query = $wpdb->prepare("SELECT * FROM $table_name WHERE id IN ($id_placeholders)", $favorite_ids);

    $products = $wpdb->get_results($query);

    return new WP_REST_Response(['products' => $products], 200);
}

// একটি প্রোডাক্টকে ফেভারিট হিসেবে যোগ বা বাদ দেওয়ার ফাংশন
function psp_toggle_favorite(WP_REST_Request $request)
{
    $user_id = get_current_user_id();
    $product_id = $request->get_param('product_id');

    if (empty($product_id)) {
        return new WP_Error('bad_request', 'Product ID is required.', ['status' => 400]);
    }

    $product_id = intval($product_id);
    $favorite_ids = get_user_meta($user_id, 'psp_favorite_products', true);

    // যদি কোনো ফেভারিট আগে থেকে না থাকে, তাহলে এটি একটি খালি অ্যারে হবে
    if (!is_array($favorite_ids)) {
        $favorite_ids = [];
    }

    // চেক করা হচ্ছে প্রোডাক্টটি আগে থেকেই ফেভারিট লিস্টে আছে কিনা
    if (in_array($product_id, $favorite_ids)) {
        // যদি থাকে, তাহলে বাদ দেওয়া হচ্ছে (আনফেভারিট)
        $favorite_ids = array_diff($favorite_ids, [$product_id]);
        $message = 'Product removed from favorites.';
    } else {
        // যদি না থাকে, তাহলে যোগ করা হচ্ছে (ফেভারিট)
        $favorite_ids[] = $product_id;
        $message = 'Product added to favorites.';
    }

    // নতুন অ্যারেটি ডাটাবেসে আপডেট করা হচ্ছে
    update_user_meta($user_id, 'psp_favorite_products', $favorite_ids);

    return new WP_REST_Response(['success' => true, 'message' => $message, 'favorites' => $favorite_ids], 200);
}


function psp_get_products_callback(WP_REST_Request $request)
{
    global $wpdb;
    $table_name = $wpdb->prefix . 'psp_products';
    $current_user = wp_get_current_user();
    $roles = (array) $current_user->roles;

    // কোন রোলের জন্য কোন কলামগুলো প্রযোজ্য, তা এখানে নির্ধারণ করা হলো
    $column_map = [
        'basic'    => ['id', 'product_title', 'product_subtitle', 'image_url', 'price', 'rating', 'category', 'subcategory'],
        'expert'   => ['id', 'product_title', 'product_subtitle', 'image_url', 'price', 'rating', 'category', 'subcategory', 'reviews_count', 'monthly_sales', 'sales_trend_90d', 'age_months'],
        'advanced' => ['*'] // Advanced User এবং Admin সবাই সব কলাম পাবে
    ];

    $selected_columns_str = '';
    $is_basic_user = in_array('psp_basic_user', $roles);

    // ইউজারের রোল অনুযায়ী কলাম সেট করা
    if (in_array('administrator', $roles) || in_array('psp_advanced_user', $roles)) {
        $selected_columns_str = implode(', ', $column_map['advanced']);
    } elseif (in_array('psp_expert_user', $roles)) {
        $selected_columns_str = implode(', ', $column_map['expert']);
    } elseif ($is_basic_user) {
        $selected_columns_str = implode(', ', $column_map['basic']);
    } else {
        return new WP_Error('no_permission', 'You do not have permission.', ['status' => 403]);
    }

    // ফিল্টার প্যারামিটার গ্রহণ করা
    $params = $request->get_params();
    $where_clauses = [];

    if (!empty($params['categories'])) {
        $category_list = explode(',', sanitize_text_field($params['categories']));
        $cat_placeholders = [];
        foreach ($category_list as $cat) $cat_placeholders[] = $wpdb->prepare('%s', $cat);
        if (!empty($cat_placeholders)) {
            $where_clauses[] = "(category IN (" . implode(', ', $cat_placeholders) . ") OR subcategory IN (" . implode(', ', $cat_placeholders) . "))";
        }
    }

    $range_filters = ['price' => ['minPrice', 'maxPrice'], /* ... অন্যান্য ফিল্টার ... */];
    foreach ($range_filters as $column => $keys) {
        if (!empty($params[$keys[0]])) $where_clauses[] = $wpdb->prepare("$column >= %f", floatval($params[$keys[0]]));
        if (!empty($params[$keys[1]])) $where_clauses[] = $wpdb->prepare("$column <= %f", floatval($params[$keys[1]]));
    }

    $where_sql = !empty($where_clauses) ? 'WHERE ' . implode(' AND ', $where_clauses) : '';


    // ১. মোট প্রোডাক্টের সংখ্যা গণনা করা (বেসিক ইউজারের জন্য সীমাবদ্ধ)
    $total_products_count_query = "SELECT COUNT(id) FROM $table_name $where_sql";

    if ($is_basic_user) {
        // প্রথমে ডাটাবেস থেকে সব প্রোডাক্টের আইডি (ফিল্টারসহ) আনা হচ্ছে
        $all_product_ids = $wpdb->get_col("SELECT id FROM $table_name $where_sql");
        // মোট প্রোডাক্টের ৫০% নেওয়া হচ্ছে
        $limit_count = floor(count($all_product_ids) * 0.5);
        // শুধুমাত্র সেই সীমিত সংখ্যক আইডিগুলো ব্যবহার করা হবে
        $allowed_ids = array_slice($all_product_ids, 0, $limit_count);
        $total_products_count = count($allowed_ids);
    } else {
        $total_products_count = (int) $wpdb->get_var($total_products_count_query);
        $allowed_ids = null; // অন্যান্য ইউজারদের জন্য কোনো আইডি সীমাবদ্ধতা নেই
    }

    // ২. পেজিনেশন প্যারামিটার গণনা করা
    $per_page = isset($params['per_page']) ? intval($params['per_page']) : 25;
    $current_page = isset($params['page']) ? intval($params['page']) : 1;
    $offset = ($current_page - 1) * $per_page;
    $total_pages = $total_products_count > 0 ? ceil($total_products_count / $per_page) : 0;

    $pagination_sql = $wpdb->prepare("LIMIT %d OFFSET %d", $per_page, $offset);

    // ৩. চূড়ান্ত ডাটাবেস কোয়েরি তৈরি করা
    if ($is_basic_user) {
        if (empty($allowed_ids)) {
            $products = []; // যদি কোনো প্রোডাক্টই না থাকে
        } else {
            $id_placeholders = implode(', ', array_fill(0, count($allowed_ids), '%d'));
            // এখন শুধুমাত্র সেই আইডিগুলোর উপর পেজিনেশন প্রয়োগ করা হচ্ছে
            $query = $wpdb->prepare("SELECT $selected_columns_str FROM $table_name WHERE id IN ($id_placeholders) $pagination_sql", $allowed_ids);
            $products = $wpdb->get_results($query);
        }
    } else {
        $query = "SELECT $selected_columns_str FROM $table_name $where_sql ORDER BY id ASC $pagination_sql";
        $products = $wpdb->get_results($query);
    }

    // ৪. রেসপন্স পাঠানো
    return new WP_REST_Response([
        'products' => $products,
        'total' => $total_products_count,
        'totalPages' => $total_pages,
        'user_role' => $roles[0] ?? 'unknown'
    ], 200);
}


add_action('rest_api_init', 'psp_register_mylist_api_routes');
function psp_register_mylist_api_routes()
{
    // "My List"-এর প্রোডাক্ট তালিকা পাওয়ার জন্য
    register_rest_route('productscope/v1', '/mylist', [
        'methods' => 'GET',
        'callback' => 'psp_get_mylist',
        'permission_callback' => function () {
            return is_user_logged_in();
        }
    ]);

    // "My List"-এ একাধিক প্রোডাক্ট যোগ করার জন্য
    register_rest_route('productscope/v1', '/mylist/add', [
        'methods' => 'POST',
        'callback' => 'psp_add_to_mylist',
        'permission_callback' => function () {
            return is_user_logged_in();
        }
    ]);
}

// "My List"-এর প্রোডাক্ট তালিকা ফেরত দেওয়ার ফাংশন
function psp_get_mylist(WP_REST_Request $request)
{
    $user_id = get_current_user_id();
    // আমরা 'psp_my_list' নামে একটি নতুন মেটা কী ব্যবহার করব
    $my_list_ids = get_user_meta($user_id, 'psp_my_list', true);

    if (empty($my_list_ids) || !is_array($my_list_ids)) {
        return new WP_REST_Response(['products' => []], 200);
    }

    global $wpdb;
    $table_name = $wpdb->prefix . 'psp_products';

    $id_placeholders = implode(', ', array_fill(0, count($my_list_ids), '%d'));
    $query = $wpdb->prepare("SELECT * FROM $table_name WHERE id IN ($id_placeholders)", $my_list_ids);

    $products = $wpdb->get_results($query);

    return new WP_REST_Response(['products' => $products], 200);
}

// "My List"-এ প্রোডাক্ট যোগ করার ফাংশন
function psp_add_to_mylist(WP_REST_Request $request)
{
    $user_id = get_current_user_id();
    $product_ids_to_add = $request->get_param('product_ids');

    if (empty($product_ids_to_add) || !is_array($product_ids_to_add)) {
        return new WP_Error('bad_request', 'Product IDs must be an array.', ['status' => 400]);
    }

    $current_list_ids = get_user_meta($user_id, 'psp_my_list', true);
    if (!is_array($current_list_ids)) {
        $current_list_ids = [];
    }

    // নতুন আইডিগুলো পুরোনো লিস্টের সাথে যোগ করা হচ্ছে, ডুপ্লিকেট বাদ দিয়ে
    $new_list_ids = array_unique(array_merge($current_list_ids, $product_ids_to_add));

    update_user_meta($user_id, 'psp_my_list', $new_list_ids);

    return new WP_REST_Response([
        'success' => true,
        'message' => count($product_ids_to_add) . ' product(s) added to your list.',
        'my_list' => $new_list_ids
    ], 200);
}


function psp_enqueue_react_app_assets()
{
    // শুধুমাত্র যে পেজে আমাদের শর্টকোডটি আছে, সেখানেই এই ফাইলগুলো লোড হবে
    if (is_singular() && has_shortcode(get_post()->post_content, 'product_scope_dashboard')) {

        $script_handle = 'psp-react-app';
        $react_app_dist_url = plugin_dir_url(__FILE__) . 'react-app/dist/';

        // Vite 4+ থেকে manifest.json ফাইলটি dist ফোল্ডারের ভেতরে .vite ফোল্ডারে থাকে
        // তবে নতুন কনফিগারেশনে এটি সরাসরি dist ফোল্ডারেও থাকতে পারে। আমরা দুটোই চেক করব।
        $manifest_path = plugin_dir_path(__FILE__) . 'react-app/dist/manifest.json';
        if (!file_exists($manifest_path)) {
            $manifest_path = plugin_dir_path(__FILE__) . 'react-app/dist/.vite/manifest.json';
        }

        if (file_exists($manifest_path)) {
            $manifest_data = file_get_contents($manifest_path);
            if ($manifest_data) {
                $manifest = json_decode($manifest_data, true);

                // React অ্যাপের মূল JS ফাইল (entry point)
                $js_entry_key = 'src/main.jsx';

                if (isset($manifest[$js_entry_key])) {
                    $entry = $manifest[$js_entry_key];

                    // JS ফাইল লোড করা
                    wp_enqueue_script($script_handle, $react_app_dist_url . $entry['file'], [], null, true);

                    // সংশ্লিষ্ট CSS ফাইল লোড করা
                    if (isset($entry['css'])) {
                        foreach ($entry['css'] as $index => $css_file) {
                            wp_enqueue_style('psp-react-app-css-' . $index, $react_app_dist_url . $css_file);
                        }
                    }

                    // React অ্যাপে ডেটা (URL, Nonce) পাঠানোর জন্য
                    wp_localize_script($script_handle, 'psp_object', [
                        'root_url'       => home_url(),
                        'api_base_url'   => rest_url('productscope/v1/'),
                        'nonce'          => wp_create_nonce('wp_rest')
                    ]);
                }
            }
        } else {
            // যদি manifest.json খুঁজে না পাওয়া যায়, একটি এরর মেসেজ দেখানো ভালো
            wp_die('React app manifest.json not found. Please run "npm run build" in the react-app directory.');
        }
    }
}
add_action('wp_enqueue_scripts', 'psp_enqueue_react_app_assets');
// React অ্যাপের জন্য শর্টকোড
function psp_react_app_shortcode()
{
    return '<div id="root"></div>';
}
add_shortcode('product_scope_dashboard', 'psp_react_app_shortcode');

// >> পরিবর্তন শুরু: এই নতুন ফাংশনটি যোগ করুন <<
function psp_hide_admin_bar_for_dashboard($hook_suffix)
{
    // শুধুমাত্র আমাদের ড্যাশবোর্ড পেজের জন্য এই স্টাইলটি প্রয়োগ করা হবে
    if ($hook_suffix === 'toplevel_page_product-scope-dashboard') {
        echo '<style>
            #wpadminbar { display: none !important; }
            html.wp-toolbar { padding-top: 0px !important; }
        </style>';
    }
}
// 'admin_head' হুকটি <head> ট্যাগের ভেতরে স্টাইল যোগ করার জন্য ব্যবহৃত হয়
add_action('admin_head', 'psp_hide_admin_bar_for_dashboard');
// >> পরিবর্তন শেষ