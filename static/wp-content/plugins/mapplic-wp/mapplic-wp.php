<?php
/**
 * Plugin Name: Mapplic
 * Plugin URI: https://mapplic.com/
 * Description: Create beautiful interactive maps.
 * Version: 8.5.0
 * Text Domain: mapplic
 * Author: sekler
 * Author URI: https://1.envato.market/R5Nv
 */

if (!class_exists('MapplicWP')) :

class MapplicWP {
	public $admin;
	public static $version = '8.4.4';
	public function __construct() {
		define('MAPPLIC_PATH', plugin_dir_url(__FILE__));

		add_action('init', array($this, 'register_post_type'));
		add_action('init', array($this, 'register_scripts_styles'));
		add_shortcode('mapplic-map', array($this, 'shortcode'));

		add_filter('plugin_action_links_' . plugin_basename(__FILE__), array($this, 'add_action_link'));

		if (is_admin()) {
			include('admin/mapplic-admin.php');
			$this->admin = new MapplicWPAdmin();
		}
	}

	public function register_post_type() {
		$labels = array(
			'name' => __('Maps', 'mapplic'),
			'singular_name' => __('Map', 'mapplic'),
			'add_new' => __('Add New Map', 'mapplic'),
			'add_new_item' => __('New Map', 'mapplic'),
			'new_item' => __('New Map', 'mapplic'),
			'edit_item' => __('Edit Map', 'mapplic')
		);

		register_post_type('mapplic_map',
			array(
				'labels' => $labels,
				'description' => __('Interactive maps', 'mapplic'),
				'show_ui' => true,
				'public' => false,
				'publicly_queryable' => true,
				'exclude_from_search' => true,
				'has_archive' => false, 
				'menu_icon' => 'dashicons-location-alt',
				'rewrite' => array('slug' => 'mapplic_map'),
				'supports' => array('title')
			)
		);
	}

	public function register_scripts_styles() {
		wp_register_script('mapplic', MAPPLIC_PATH . 'core/mapplic.js', false, MapplicWP::$version, true);
	}

	public function shortcode($atts) {
		extract(shortcode_atts(array(
			'id' => false,
			'location' => false,
			'shortcode' => false
		), $atts, 'mapplic'));

		$post = get_post($id);
		$data = $post->post_content;

		if ($shortcode) {
			$data = json_decode($post->post_content);
			foreach ($data->locations as $l) {
				$l = apply_filters('mapplic_location', $l);
				if (isset($l->desc)) $l->desc = do_shortcode($l->desc);
			}
			$data = json_encode($data);
		}

		if (!$id || !$post) return '<p class="mapplic-warning">' . __('Invalid map ID', 'mapplic') . '<p/>';

		wp_enqueue_script('mapplic');

		$template = '<mapplic-map id="mapplic-%s" data-json="%s" data-path="%s"%s></mapplic-map>';
		$data_location = $location !== false ? ' data-location="' . $location . '"' : '';

		return sprintf($template, $id, htmlentities($data, ENT_QUOTES, 'UTF-8'), MAPPLIC_PATH . '/core/', $data_location);
	}

	public function add_action_link($links) {
		$newlink = array('<a href="' . admin_url('edit.php?post_type=mapplic_map' ) . '">' . __('Map list', 'mapplic') . '</a>');
		return array_merge($links, $newlink);
	}
}

endif;

function mapplic_build() {
	global $mapplic;
	if (!isset($mapplic)) $mapplic = new MapplicWP();
	return $mapplic;
}
mapplic_build();

?>