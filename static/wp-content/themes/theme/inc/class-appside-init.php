<?php
/**
 * @package Dizzcox
 * @author Ir Tech
 */
if (!defined("ABSPATH")) {
	exit(); //exit if access directly
}

if (!class_exists('Class_Appside_Init')) {

	class Class_Appside_Init
	{
		/*
		* $instance
		* @since 1.0.0
		* */
		protected static $instance;

		public function __construct()
		{
			/*
			 * theme setup
			 * */
			add_action( 'after_setup_theme', array($this,'theme_setup') );
			/**
			 * Widget Init
			 * */
			add_action( 'widgets_init', array($this,'theme_widgets_init') );
			/**
			 * Theme Assets
			 * */
			add_action( 'wp_enqueue_scripts', array($this,'theme_assets') );
			/**
			 * Registers an editor stylesheet for the theme.
			 */
			add_action( 'admin_init', array($this,'add_editor_styles' ));
			/**
			 * Register gutenberg editor css
			 * */
			add_action('enqueue_block_editor_assets',array($this,'gutenberg_editor_assets'));
		}

		/**
		 * getInstance()
		 * */
		public static function getInstance()
		{
			if (null == self::$instance) {
				self::$instance = new self();
			}
			return self::$instance;
		}

		/**
		 * Theme Setup
		 * @since 1.0.0
		 * */
		public function theme_setup(){
			/*
		 * Make theme available for translation.
		 * Translations can be filed in the /languages/ directory.
		 * If you're building a theme based on appside, use a find and replace
		 * to change 'aapside' to the name of your theme in all the template files.
		 */
			load_theme_textdomain( 'aapside', get_template_directory() . '/languages' );

			// Add default posts and comments RSS feed links to head.
			add_theme_support( 'automatic-feed-links' );

			/*
			 * Let WordPress manage the document title.
			 * By adding theme support, we declare that this theme does not use a
			 * hard-coded <title> tag in the document head, and expect WordPress to
			 * provide it for us.
			 */
			add_theme_support( 'title-tag' );

			/*
			 * Enable support for Post Thumbnails on posts and pages.
			 *
			 * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
			 */
			add_theme_support( 'post-thumbnails' );

			// This theme uses wp_nav_menu() in one location.
			register_nav_menus( array(
				'main-menu' => esc_html__( 'Primary Menu', 'aapside' ),
			) );

			/*
			 * Switch default core markup for search form, comment form, and comments
			 * to output valid HTML5.
			 */
			add_theme_support( 'html5', array(
				'search-form',
				'comment-form',
				'comment-list',
				'gallery',
				'caption',
			) );

			// Set up the WordPress core custom background feature.
			add_theme_support( 'custom-background', apply_filters( 'appside_custom_background_args', array(
				'default-color' => 'ffffff',
				'default-image' => '',
			) ) );

			// Add theme support for selective refresh for widgets.
			add_theme_support( 'customize-selective-refresh-widgets' );

			add_theme_support( 'responsive-embeds' );
			// -- Wide Images
			add_theme_support( 'align-wide' );
			// -- Disable custom font sizes
			add_theme_support( 'disable-custom-font-sizes' );

			/**
			 * Add support for core custom logo.
			 *
			 * @link https://codex.wordpress.org/Theme_Logo
			 */
			add_theme_support( 'custom-logo', array(
				'height'      => 250,
				'width'       => 250,
				'flex-width'  => true,
				'flex-height' => true,
			) );
			// -- Editor Font Styles
			add_theme_support( 'editor-font-sizes', array(
				array(
					'name'      => esc_html__( 'small', 'aapside' ),
					'shortName' => esc_html__( 'S', 'aapside' ),
					'size'      => 12,
					'slug'      => 'small'
				),
				array(
					'name'      => esc_html__( 'regular', 'aapside' ),
					'shortName' => esc_html__( 'M', 'aapside' ),
					'size'      => 16,
					'slug'      => 'regular'
				),
				array(
					'name'      => esc_html__( 'large', 'aapside' ),
					'shortName' => esc_html__( 'L', 'aapside' ),
					'size'      => 20,
					'slug'      => 'large'
				),
			) );

			// -- Disable Custom Colors
			add_theme_support( 'disable-custom-colors' );
			// -- Editor Color Palette
			add_theme_support( 'editor-color-palette', array(
				array(
					'name'  => esc_html__( 'Blue', 'aapside' ),
					'slug'  => 'blue',
					'color'	=> '#59BACC',
				),
				array(
					'name'  => esc_html__( 'Green', 'aapside' ),
					'slug'  => 'green',
					'color' => '#58AD69',
				),
				array(
					'name'  => esc_html__( 'Orange', 'aapside' ),
					'slug'  => 'orange',
					'color' => '#FFBC49',
				),
				array(
					'name'	=> esc_html__( 'Red', 'aapside' ),
					'slug'	=> 'red',
					'color'	=> '#E2574C',
				),
			) );
			add_theme_support( 'wp-block-styles' );
			//add theme support for post format
			add_theme_support('post-formats',array('image','video','gallery','link','quote'));
			// This variable is intended to be overruled from themes.
			// Open WPCS issue: {@link https://github.com/WordPress-Coding-Standards/WordPress-Coding-Standards/issues/1043}.
			// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound
			$GLOBALS['content_width'] = apply_filters( 'appside_content_width', 740 );
			//add image sizes
			add_image_size('appside_classic',750,350,true);
			add_image_size('appside_medium',550,380,true);
			add_image_size('appside_grid',370,270,true);
			add_image_size('appside_portfolio',360,340,true);
			add_image_size('appside_portfolio_single',750);

			//woocommerce support
			add_theme_support('woocommerce');
			add_theme_support( 'wc-product-gallery-zoom' );
			add_theme_support( 'wc-product-gallery-lightbox' );
			add_theme_support( 'wc-product-gallery-slider' );

			self::load_theme_dependency_files();
		}

		/**
		 * Theme Widget Init
		 * @since 1.0.0
		 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
		 * */
		public function theme_widgets_init(){
			register_sidebar( array(
				'name'          => esc_html__( 'Sidebar', 'aapside' ),
				'id'            => 'sidebar-1',
				'description'   => esc_html__( 'Add widgets here.', 'aapside' ),
				'before_widget' => '<div id="%1$s" class="widget %2$s">',
				'after_widget'  => '</div>',
				'before_title'  => '<h4 class="widget-title">',
				'after_title'   => '</h4>',
			) );
			register_sidebar( array(
				'name'          => esc_html__( 'Footer Widget Area', 'aapside' ),
				'id'            => 'footer-widget',
				'description'   => esc_html__( 'Add widgets here.', 'aapside' ),
				'before_widget' => '<div class="col-lg-3 col-md-6"><div id="%1$s" class="widget footer-widget %2$s">',
				'after_widget'  => '</div></div>',
				'before_title'  => '<h4 class="widget-title">',
				'after_title'   => '</h4>',
			) );
		}

		/**
		 * Theme Assets
		 * @since 1.0.0
		 * */
		public function theme_assets(){
			self::load_theme_css();
			self::load_theme_js();
		}
		/*
	   * load theme options google fonts css
	   * @since 1.0.0
	   * */
		public static function load_google_fonts(){

			$enqueue_fonts = array();
			//body font enqueue
			$body_font = cs_get_option('_body_font') ? cs_get_option('_body_font') : false;
			$body_font_variant = cs_get_option('body_font_variant') ? cs_get_option('body_font_variant') : false;
			$body_font['family'] = ( isset($body_font['font-family']) && !empty($body_font['font-family']) ) ? $body_font['font-family'] : 'Poppins';
			$body_font['font'] = ( isset($body_font['type']) && !empty($body_font['type']) ) ? $body_font['type'] : 'google';
			$body_font_variant = !empty($body_font_variant) ? $body_font_variant : array(400,700,600,500);
			$google_fonts = array();

			if ( !empty($body_font_variant) ){
				foreach ($body_font_variant as $variant){
					$google_fonts[] = array(
						'family' => $body_font['family'],
						'variant' => $variant,
						'font' => $body_font['font']
					);
				}
			}
			//heading font enqueue
			$heading_font_enable = false;
			if (null == cs_get_option('heading_font_enable')){
				$heading_font_enable = false;
			}elseif ('0' == cs_get_option('heading_font_enable')){
				$heading_font_enable = true;
			}elseif('1' == cs_get_option('heading_font_enable')){
				$heading_font_enable = false;
			}
			$heading_font = cs_get_option('heading_font') ? cs_get_option('heading_font') : false;
			$heading_font_variant = cs_get_option('heading_font_variant') ? cs_get_option('heading_font_variant') : false;
			$heading_font['family'] = ( isset($heading_font['font-family']) && !empty($heading_font['font-family']) ) ? $heading_font['font-family'] : 'Poppins';
			$heading_font['font'] = ( isset($heading_font['type']) && !empty($heading_font['type']) ) ? $heading_font['type'] : 'google';
			$heading_font_variant = !empty($heading_font_variant) ? $heading_font_variant : array(400,500,600,700,800);
			if ( !empty($heading_font_variant) &&  !$heading_font_enable){
				foreach ($heading_font_variant as $variant){
					$google_fonts[] = array(
						'family' => $heading_font['family'],
						'variant' => $variant,
						'font' => $heading_font['font']
					);
				}
			}

			if ( ! empty( $google_fonts ) ) {
				foreach ( $google_fonts as $font ) {
					if( !empty( $font['font'] ) && $font['font'] == 'google' ) {
						$variant = ( !empty( $font['variant'] ) && $font['variant'] !== 'regular' ) ? ':'. $font['variant'] : '';
						if( !empty($font['family']) ){
							$enqueue_fonts[] = $font['family'] . $variant;
						}
					}
				}
			}

			$enqueue_fonts = array_unique($enqueue_fonts);
			return $enqueue_fonts;
		}
		/**
		 * Load Theme Css
		 * @since 1.0.0
		 * */
		public function load_theme_css(){
			$theme_version = Appside()->get_theme_info('version');
			//load google fonts
			$enqueue_google_fonts = self::load_google_fonts();
			if ( ! empty( $enqueue_google_fonts ) ) {
				wp_enqueue_style( 'appside-google-fonts', esc_url( add_query_arg( 'family', urlencode( implode( '|', $enqueue_google_fonts ) ) , '//fonts.googleapis.com/css' ) ), array(), null );
			}
			$all_css_files = array(
				array(
					'handle' => 'animate',
					'src' => APPSIDE_CSS .'/animate.css',
					'deps' => array(),
					'ver' => $theme_version,
					'media' => 'all',
				),
				array(
					'handle' => 'bootstrap',
					'src' => APPSIDE_CSS .'/bootstrap.min.css',
					'deps' => array(),
					'ver' => $theme_version,
					'media' => 'all',
				),
				array(
					'handle' => 'font-awesome',
					'src' => APPSIDE_CSS .'/font-awesome.min.css',
					'deps' => array(),
					'ver' => $theme_version,
					'media' => 'all',
				),
				array(
					'handle' => 'magnific-popup',
					'src' => APPSIDE_CSS .'/magnific-popup.css',
					'deps' => array(),
					'ver' => $theme_version,
					'media' => 'all',
				),
				array(
					'handle' => 'appside-default-style',
					'src' => APPSIDE_CSS .'/default-style.css',
					'deps' => array(),
					'ver' => $theme_version,
					'media' => 'all',
				),
				array(
					'handle' => 'appside-main-style',
					'src' => APPSIDE_CSS .'/main-style.css',
					'deps' => array(),
					'ver' => $theme_version,
					'media' => 'all',
				),
				array(
					'handle' => 'appside-gutenberg-style',
					'src' => APPSIDE_CSS .'/gutenberg.css',
					'deps' => array(),
					'ver' => $theme_version,
					'media' => 'all',
				),
				array(
					'handle' => 'woocommerce-style',
					'src' => APPSIDE_CSS .'/woocommerce-style.css',
					'deps' => array(),
					'ver' => $theme_version,
					'media' => 'all',
				),
				array(
					'handle' => 'appside-responsive',
					'src' => APPSIDE_CSS .'/responsive.css',
					'deps' => array('appside-main-style'),
					'ver' => $theme_version,
					'media' => 'all',
				),
			);

			$all_css_files = apply_filters('appside_theme_enqueue_style',$all_css_files);

			if (is_array($all_css_files) && !empty($all_css_files)){
				foreach ($all_css_files as $css){
					call_user_func_array('wp_enqueue_style',$css);
				}
			}
			wp_enqueue_style( 'appside-style', get_stylesheet_uri() );

			if (Appside()->is_appside_master_active()){
				if (file_exists(APPSIDE_DYNAMIC_STYLESHEETS .'/appside-inline-style.php')){
					require_once APPSIDE_DYNAMIC_STYLESHEETS .'/appside-inline-style.php';
					wp_add_inline_style('appside-style',Appside()->minify_css_lines($GLOBALS['appside_inline_css']));
					wp_add_inline_style('appside-style',Appside()->minify_css_lines($GLOBALS['theme_customize_css']));
				}

			}
		}

		/**
		 * Load Theme js
		 * @since 1.0.0
		 * */
		public function load_theme_js(){
			$theme_version = Appside()->get_theme_info('version');

			$all_js_files = array(
				array(
					'handle' => 'popper',
					'src' => APPSIDE_JS .'/popper.min.js',
					'deps' => array('jquery'),
					'ver' => $theme_version,
					'in_footer' => true,
				),
				array(
					'handle' => 'bootstrap',
					'src' => APPSIDE_JS .'/bootstrap.min.js',
					'deps' => array('jquery','popper'),
					'ver' => $theme_version,
					'in_footer' => true,
				),
				array(
					'handle' => 'magnific-popup',
					'src' => APPSIDE_JS .'/jquery.magnific-popup.js',
					'deps' => array('jquery'),
					'ver' => $theme_version,
					'in_footer' => true,
				),
				array(
					'handle' => 'appside-main-script',
					'src' => APPSIDE_JS .'/main.js',
					'deps' => array('jquery'),
					'ver' => $theme_version,
					'in_footer' => true,
				),
			);

			$all_js_files = apply_filters('appside_theme_enqueue_script',$all_js_files);

			if (is_array($all_js_files) && !empty($all_js_files)){
				foreach ($all_js_files as $js){
					call_user_func_array('wp_enqueue_script',$js);
				}
			}

			if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
				wp_enqueue_script( 'comment-reply' );
			}
		}

		/**
		 * Load THeme Dependency Files
		 * @since 1.0.0
		 * */
		public function load_theme_dependency_files(){
			$includes_files = array(
				array(
					'file-name' => 'activation',
					'file-path' => APPSIDE_TGMA
				),
				array(
					'file-name' => 'breadcrumb',
					'file-path' => APPSIDE_INC
				),
				array(
					'file-name' => 'class-appside-excerpt',
					'file-path' => APPSIDE_INC
				),
				array(
					'file-name' => 'class-megamenu-walker',
					'file-path' => APPSIDE_INC
				),
				array(
					'file-name' => 'class-appside-hook-customize',
					'file-path' => APPSIDE_INC
				),
				array(
					'file-name' => 'comments-modifications',
					'file-path' => APPSIDE_INC
				),
				array(
					'file-name' => 'customizer',
					'file-path' => APPSIDE_INC
				),
				array(
					'file-name' => 'csf-group-fields',
					'file-path' => APPSIDE_THEME_SETTINGS
				),
				array(
					'file-name' => 'csf-group-fields-value',
					'file-path' => APPSIDE_THEME_SETTINGS
				),
				array(
					'file-name' => 'csf-metabox',
					'file-path' => APPSIDE_THEME_SETTINGS
				),
				array(
					'file-name' => 'csf-shortcode-options',
					'file-path' => APPSIDE_THEME_SETTINGS
				),
				array(
					'file-name' => 'csf-customizer',
					'file-path' => APPSIDE_THEME_SETTINGS
				),
				array(
					'file-name' => 'csf-options',
					'file-path' => APPSIDE_THEME_SETTINGS
				),
			);

			if (defined('APPSIDE_MASTER_SELF_PATH')){
				$includes_files[] = array(
					'file-name' => 'appside-options-style',
					'file-path' => APPSIDE_DYNAMIC_STYLESHEETS
				);
			}
			if (class_exists('WooCommerce')){
				$includes_files[] = array(
					'file-name' => 'class-woocommerce-customize',
					'file-path' => APPSIDE_INC
				);
			}

			if (is_array($includes_files) && !empty($includes_files)){
				foreach ($includes_files as $file){
					if (file_exists($file['file-path'].'/'.$file['file-name'].'.php')){
						require_once $file['file-path'].'/'.$file['file-name'].'.php';
					}
				}
			}
		}


		/**
		 * add editor style
		 * @since 1.0.0
		 * */
		public function add_editor_styles(){
			add_editor_style(get_template_directory_uri().'/assets/css/editor-style.css');
		}

		/**
		 * gutenberg editor style enqueue
		 * */
		public function gutenberg_editor_assets(){
			//load google fonts
			$enqueue_google_fonts = self::load_google_fonts();
			if ( ! empty( $enqueue_google_fonts ) ) {
				wp_enqueue_style( 'appside-google-fonts', esc_url( add_query_arg( 'family', urlencode( implode( '|', $enqueue_google_fonts ) ) , '//fonts.googleapis.com/css' ) ), array(), null );
			}
			wp_enqueue_style( 'fontawesome', get_theme_file_uri( '/assets/css/font-awesome.min.css' ), false, '1.0', 'all' );
			wp_enqueue_style( 'appside-gutenberg', get_theme_file_uri( '/assets/css/gutenberg-editor-style.css' ), false, '1.0', 'all' );
		}

	}//end class
	if (class_exists('Class_Appside_Init')){
		Class_Appside_Init::getInstance();
	}
}
