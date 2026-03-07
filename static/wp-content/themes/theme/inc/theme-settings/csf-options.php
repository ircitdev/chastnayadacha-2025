<?php
/**
 * Theme Options
 * @Packange Appside
 * @since 1.0.0
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit(); // exit if access directly
}
// Control core classes for avoid errors
if ( class_exists( 'CSF' ) ) {

	$allowed_html = Appside()->kses_allowed_html( array( 'mark' ) );
	$prefix       = 'appside';
	// Create options
	CSF::createOptions( $prefix . '_theme_options', array(
		'menu_title'         => esc_html__( 'Theme Options', 'aapside' ),
		'menu_slug'          => 'appside-theme-options',
		'menu_parent'        => 'appside_theme_options',
		'menu_type'          => 'submenu',
		'footer_credit'      => ' ',
		'menu_icon'          => 'fa fa-filter',
		'show_footer'        => false,
		'enqueue_webfont'    => false,
		'show_search'        => false,
		'show_reset_all'     => true,
		'show_reset_section' => false,
		'show_all_options'   => false,
		'theme'              => 'dark',
		'framework_title'    => Appside()->get_theme_info( 'name' ) . '<a href="' . Appside()->get_theme_info( 'author_uri' ) . '" class="author_link">' . '<span>' . esc_html__( 'Author - ', 'aapside' ) . ' </span>' . Appside()->get_theme_info( 'author' ) . '</a> <span class="irtech-theme-version">' . esc_html__( 'V-', 'aapside' ) . Appside()->get_theme_info( 'version' ) . '</span>'
	) );

	/*-------------------------------------------------------
		** General  Options
	--------------------------------------------------------*/
	CSF::createSection( $prefix . '_theme_options', array(
		'title'  => esc_html__( 'General', 'aapside' ),
		'id'     => 'general_options',
		'icon'   => 'fa fa-wrench',
		'fields' => array(
			array(
				'type'    => 'subheading',
				'content' => '<h3>' . esc_html__( 'Preloader Options', 'aapside' ) . '</h3>'
			),
			array(
				'id'      => 'preloader_enable',
				'title'   => esc_html__( 'Preloader', 'aapside' ),
				'type'    => 'switcher',
				'desc'    => wp_kses( __( 'you can set <mark>Yes / No</mark> to enable/disable preloader', 'aapside' ), $allowed_html ),
				'default' => true,
			),
			array(
				'id'         => 'preloader_bg_color',
				'title'      => esc_html__( 'Background Color', 'aapside' ),
				'type'       => 'color',
				'default'    => '#ffffff',
				'desc'       => wp_kses( __( 'you can set <mark>overlay color</mark> for breadcrumb background image', 'aapside' ), $allowed_html ),
				'dependency' => array( 'preloader_enable', '==', 'true' )
			),
			array(
				'type'    => 'subheading',
				'content' => '<h3>' . esc_html__( 'Back Top Options', 'aapside' ) . '</h3>'
			),
			array(
				'id'      => 'back_top_enable',
				'title'   => esc_html__( 'Back Top', 'aapside' ),
				'type'    => 'switcher',
				'desc'    => wp_kses( __( 'you can set <mark>Yes / No</mark> to show/hide back to top', 'aapside' ), $allowed_html ),
				'default' => true,
			),
			array(
				'id'         => 'back_top_icon',
				'title'      => esc_html__( 'Back Top Icon', 'aapside' ),
				'type'       => 'icon',
				'default'    => 'fa fa-angle-up',
				'desc'       => wp_kses( __( 'you can set <mark>icon</mark> for back to top.', 'aapside' ), $allowed_html ),
				'dependency' => array( 'back_top_enable', '==', 'true' )
			),
		)
	) );
	/*-------------------------------------------------------
	   ** Entire Site Header  Options
   --------------------------------------------------------*/

	CSF::createSection( $prefix . '_theme_options', array(
		'title'  => esc_html__( 'Header & Footer Style', 'aapside' ),
		'id'     => 'theme_header_one_options',
		'icon'   => 'fa fa-id-card-o',
		'fields' => array(
			array(
				'type'    => 'subheading',
				'content' => '<h3>' . esc_html__( 'Global Header Style', 'aapside' ) . '</h3>'
			),
			array(
				'id'      => 'global_navbar_build_type',
				'title'   => esc_html__( 'Header Type', 'aapside' ),
				'type'    => 'select',
				'options' => [
					'default'        => esc_html__( 'Default', 'aapside' ),
					'header_builder' => esc_html__( 'Header Builder', 'aapside' ),
				],
				'default' => 'default',
				'desc'    => wp_kses( __( 'you can set <mark>header type</mark> default or use header builder design.', 'aapside' ), $allowed_html ),
			),
			array(
				'id'         => 'global_header_style',
				'title'      => esc_html__( 'Header Style', 'aapside' ),
				'type'       => 'image_select',
				'options'    => array(
					'default'  => APPSIDE_THEME_SETTINGS_IMAGES . '/header/02.jpg',
					'style-01' => APPSIDE_THEME_SETTINGS_IMAGES . '/header/01.jpg',
					'style-02' => APPSIDE_THEME_SETTINGS_IMAGES . '/header/03.png',
					'style-03' => APPSIDE_THEME_SETTINGS_IMAGES . '/header/04.png',
				),
				'default'    => 'default',
				'desc'       => wp_kses( __( 'you can set <mark>header style</mark> from available design', 'aapside' ), $allowed_html ),
				'dependency' => [ 'global_navbar_build_type', '==', 'default' ]
			),
			array(
				'id'         => 'global_header_builder_style',
				'title'      => esc_html__( 'Header Builder Style', 'aapside' ),
				'type'       => 'select',
				'options'    => Appside()->get_post_list_by_post_type( 'apside-hebuilder' ),
				'desc'       => wp_kses( __( 'you can set <mark>header builder style</mark> for this page.', 'aapside' ), $allowed_html ),
				'dependency' => [ 'global_navbar_build_type', '==', 'header_builder' ]
			),
			array(
				'type'    => 'subheading',
				'content' => '<h3>' . esc_html__( 'Global Footer Style', 'aapside' ) . '</h3>'
			),
			array(
				'id'      => 'global_footer_build_type',
				'title'   => esc_html__( 'Footer Type', 'aapside' ),
				'type'    => 'select',
				'options' => [
					'default'        => esc_html__( 'Default', 'aapside' ),
					'footer_builder' => esc_html__( 'Footer Builder', 'aapside' ),
				],
				'default' => 'default',
				'desc'    => wp_kses( __( 'you can set <mark>footer type</mark> default or use header builder design.', 'aapside' ), $allowed_html ),
			),
			array(
				'id'         => 'global_footer_builder_style',
				'title'      => esc_html__( 'Footer Builder Style', 'aapside' ),
				'type'       => 'select',
				'options'    => Appside()->get_post_list_by_post_type( 'apside-foobuilder' ),
				'desc'       => wp_kses( __( 'you can set <mark>footer builder style</mark> for this page.', 'aapside' ), $allowed_html ),
				'dependency' => [ 'global_footer_build_type', '==', 'footer_builder' ]
			),
		)
	) );
	/*-------------------------------------
		Header Settings
	-------------------------------------*/
	CSF::createSection( $prefix . '_theme_options', array(
		'title' => esc_html__( 'Header Settings', 'aapside' ),
		'id'    => 'header_style_settings_options',
		'icon'  => 'fa fa-header',
	) );

	/* header style 01 */
	CSF::createSection( $prefix . '_theme_options', array(
		'title'  => esc_html__( 'Header One', 'aapside' ),
		'id'     => 'theme_header_one_settings',
		'icon'   => 'fa fa-image',
		'parent' => 'header_style_settings_options',
		'fields' => array(
			array(
				'type'    => 'subheading',
				'content' => '<h3>' . esc_html__( 'Header Style One Settings', 'aapside' ) . '</h3>'
			),
			array(
				'id'      => 'header_one_logo',
				'type'    => 'media',
				'title'   => esc_html__( 'Logo', 'aapside' ),
				'library' => 'image',
				'desc'    => wp_kses( __( 'you can upload <mark> logo</mark> here it will overwrite customizer uploaded logo', 'aapside' ), $allowed_html ),
			),
			array(
				'type'    => 'subheading',
				'content' => '<h3>' . esc_html__( 'Navbar Options', 'aapside' ) . '</h3>'
			),
			array(
				'id'      => 'header_one_navbar_btn',
				'title'   => esc_html__( 'Navbar Button', 'aapside' ),
				'type'    => 'switcher',
				'desc'    => wp_kses( __( 'you can set <mark>Yes / No</mark> to enable/disable navbar button', 'aapside' ), $allowed_html ),
				'default' => true,
			),
			array(
				'id'      => 'header_one_navbar_btn_text',
				'title'   => esc_html__( 'Navbar Button Text', 'aapside' ),
				'type'    => 'text',
				'desc'    => wp_kses( __( 'you can set <mark>button text</mark> for navbar button', 'aapside' ), $allowed_html ),
				'default' => esc_html__( 'Download', 'aapside' ),
			),
			array(
				'id'      => 'header_one_navbar_btn_url',
				'title'   => esc_html__( 'Navbar Button URL', 'aapside' ),
				'type'    => 'text',
				'desc'    => wp_kses( __( 'you can set <mark>button url</mark> for navbar button', 'aapside' ), $allowed_html ),
				'default' => '#',
			),
		)
	) );

	/* header style 02 */
	CSF::createSection( $prefix . '_theme_options', array(
		'title'  => esc_html__( 'Header Two', 'aapside' ),
		'id'     => 'theme_header_two_settings',
		'icon'   => 'fa fa-image',
		'parent' => 'header_style_settings_options',
		'fields' => array(
			array(
				'type'    => 'subheading',
				'content' => '<h3>' . esc_html__( 'Header Style Two Settings', 'aapside' ) . '</h3>'
			),
			array(
				'id'      => 'header_two_logo',
				'type'    => 'media',
				'title'   => esc_html__( 'Logo', 'aapside' ),
				'library' => 'image',
				'desc'    => wp_kses( __( 'you can upload <mark> logo</mark> here it will overwrite customizer uploaded logo', 'aapside' ), $allowed_html ),
			),
			array(
				'type'    => 'subheading',
				'content' => '<h3>' . esc_html__( 'Navbar Options', 'aapside' ) . '</h3>'
			),
			array(
				'id'      => 'header_two_navbar_btn',
				'title'   => esc_html__( 'Navbar Button', 'aapside' ),
				'type'    => 'switcher',
				'desc'    => wp_kses( __( 'you can set <mark>Yes / No</mark> to enable/disable navbar button', 'aapside' ), $allowed_html ),
				'default' => true,
			),
			array(
				'id'      => 'header_two_navbar_btn_text',
				'title'   => esc_html__( 'Navbar Button Text', 'aapside' ),
				'type'    => 'text',
				'desc'    => wp_kses( __( 'you can set <mark>button text</mark> for navbar button', 'aapside' ), $allowed_html ),
				'default' => esc_html__( 'Download', 'aapside' ),
			),
			array(
				'id'      => 'header_two_navbar_btn_url',
				'title'   => esc_html__( 'Navbar Button URL', 'aapside' ),
				'type'    => 'text',
				'desc'    => wp_kses( __( 'you can set <mark>button url</mark> for navbar button', 'aapside' ), $allowed_html ),
				'default' => '#',
			),
		)
	) );

	/* header style 03 */
	CSF::createSection( $prefix . '_theme_options', array(
		'title'  => esc_html__( 'Header Three', 'aapside' ),
		'id'     => 'theme_header_three_settings',
		'icon'   => 'fa fa-image',
		'parent' => 'header_style_settings_options',
		'fields' => array(
			array(
				'type'    => 'subheading',
				'content' => '<h3>' . esc_html__( 'Header Style Three Settings', 'aapside' ) . '</h3>'
			),
			array(
				'id'      => 'header_three_logo',
				'type'    => 'media',
				'title'   => esc_html__( 'Logo', 'aapside' ),
				'library' => 'image',
				'desc'    => wp_kses( __( 'you can upload <mark> logo</mark> here it will overwrite customizer uploaded logo', 'aapside' ), $allowed_html ),
			),
			array(
				'type'    => 'subheading',
				'content' => '<h3>' . esc_html__( 'Navbar Options', 'aapside' ) . '</h3>'
			),
			array(
				'id'      => 'header_three_navbar_btn',
				'title'   => esc_html__( 'Navbar Button One', 'aapside' ),
				'type'    => 'switcher',
				'desc'    => wp_kses( __( 'you can set <mark>Yes / No</mark> to enable/disable navbar button', 'aapside' ), $allowed_html ),
				'default' => true,
			),
			array(
				'id'      => 'header_three_navbar_btn_text',
				'title'   => esc_html__( 'Navbar Button One Text', 'aapside' ),
				'type'    => 'text',
				'desc'    => wp_kses( __( 'you can set <mark>button text</mark> for navbar button', 'aapside' ), $allowed_html ),
				'default' => esc_html__( 'Login', 'aapside' ),
			),
			array(
				'id'      => 'header_three_navbar_btn_url',
				'title'   => esc_html__( 'Navbar Button One URL', 'aapside' ),
				'type'    => 'text',
				'desc'    => wp_kses( __( 'you can set <mark>button url</mark> for navbar button', 'aapside' ), $allowed_html ),
				'default' => '#',
			),
			array(
				'id'      => 'header_three_navbar_btn_two',
				'title'   => esc_html__( 'Navbar Button Two', 'aapside' ),
				'type'    => 'switcher',
				'desc'    => wp_kses( __( 'you can set <mark>Yes / No</mark> to enable/disable navbar button', 'aapside' ), $allowed_html ),
				'default' => true,
			),
			array(
				'id'      => 'header_three_navbar_btn_two_text',
				'title'   => esc_html__( 'Navbar Button Two Text', 'aapside' ),
				'type'    => 'text',
				'desc'    => wp_kses( __( 'you can set <mark>button text</mark> for navbar button', 'aapside' ), $allowed_html ),
				'default' => esc_html__( 'Signup', 'aapside' ),
			),
			array(
				'id'      => 'header_three_navbar_btn_two_url',
				'title'   => esc_html__( 'Navbar Button Two URL', 'aapside' ),
				'type'    => 'text',
				'desc'    => wp_kses( __( 'you can set <mark>button url</mark> for navbar button', 'aapside' ), $allowed_html ),
				'default' => '#',
			),
		)
	) );
	/* header style 04 */
	CSF::createSection( $prefix . '_theme_options', array(
		'title'  => esc_html__( 'Header Four', 'aapside' ),
		'id'     => 'theme_header_four_settings',
		'icon'   => 'fa fa-image',
		'parent' => 'header_style_settings_options',
		'fields' => array(
			array(
				'type'    => 'subheading',
				'content' => '<h3>' . esc_html__( 'Header Style Four Settings', 'aapside' ) . '</h3>'
			),
			array(
				'id'      => 'header_four_logo',
				'type'    => 'media',
				'title'   => esc_html__( 'Logo', 'aapside' ),
				'library' => 'image',
				'desc'    => wp_kses( __( 'you can upload <mark> logo</mark> here it will overwrite customizer uploaded logo', 'aapside' ), $allowed_html ),
			),
			array(
				'type'    => 'subheading',
				'content' => '<h3>' . esc_html__( 'Navbar Options', 'aapside' ) . '</h3>'
			),
			array(
				'id'      => 'header_four_navbar_btn',
				'title'   => esc_html__( 'Navbar Button', 'aapside' ),
				'type'    => 'switcher',
				'desc'    => wp_kses( __( 'you can set <mark>Yes / No</mark> to enable/disable navbar button', 'aapside' ), $allowed_html ),
				'default' => true,
			),
			array(
				'id'      => 'header_four_navbar_btn_text',
				'title'   => esc_html__( 'Navbar Button Text', 'aapside' ),
				'type'    => 'text',
				'desc'    => wp_kses( __( 'you can set <mark>button text</mark> for navbar button', 'aapside' ), $allowed_html ),
				'default' => esc_html__( 'Download', 'aapside' ),
			),
			array(
				'id'      => 'header_four_navbar_btn_url',
				'title'   => esc_html__( 'Navbar Button URL', 'aapside' ),
				'type'    => 'text',
				'desc'    => wp_kses( __( 'you can set <mark>button url</mark> for navbar button', 'aapside' ), $allowed_html ),
				'default' => '#',
			),
		)
	) );


	/* Breadcrumb */
	CSF::createSection( $prefix . '_theme_options', array(
		'title'  => esc_html__( 'Breadcrumb', 'aapside' ),
		'id'     => 'breadcrumb_options',
		'icon'   => 'fa fa-ellipsis-h',
		'fields' => array(
			array(
				'type'    => 'subheading',
				'content' => '<h3>' . esc_html__( 'Breadcrumb Options', 'aapside' ) . '</h3>'
			),
			array(
				'id'      => 'breadcrumb_enable',
				'title'   => esc_html__( 'Breadcrumb', 'aapside' ),
				'type'    => 'switcher',
				'desc'    => wp_kses( __( 'you can set <mark>Yes / No</mark> to show/hide breadcrumb', 'aapside' ), $allowed_html ),
				'default' => true,
			),
			array(
				'id'               => 'breadcrumb_bg',
				'title'            => esc_html__( 'Background Image', 'aapside' ),
				'type'             => 'background',
				'desc'             => wp_kses( __( 'you can set <mark>background</mark> for breadcrumb', 'aapside' ), $allowed_html ),
				'default'          => array(
					'background-size'     => 'cover',
					'background-position' => 'center bottom',
					'background-repeat'   => 'no-repeat',
				),
				'background_color' => false,
				'dependency'       => array( 'breadcrumb_enable', '==', 'true' )
			)
		)
	) );


	/*-------------------------------------------------------
		   ** Footer  Options
	--------------------------------------------------------*/
	CSF::createSection( $prefix . '_theme_options', array(
		'title'  => esc_html__( 'Footer', 'aapside' ),
		'id'     => 'footer_options',
		'icon'   => 'fa fa-copyright',
		'fields' => array(
			array(
				'type'    => 'subheading',
				'content' => '<h3>' . esc_html__( 'Footer Options', 'aapside' ) . '</h3>'
			),
			array(
				'id'      => 'footer_spacing',
				'title'   => esc_html__( 'Footer Spacing', 'aapside' ),
				'type'    => 'switcher',
				'desc'    => wp_kses( __( 'you can set <mark>Yes / No</mark> to set footer spacing', 'aapside' ), $allowed_html ),
				'default' => true,
			),
			array(
				'id'         => 'footer_top_spacing',
				'title'      => esc_html__( 'Footer Top Spacing', 'aapside' ),
				'type'       => 'slider',
				'desc'       => wp_kses( __( 'you can set <mark>padding</mark> for footer top', 'aapside' ), $allowed_html ),
				'min'        => 0,
				'max'        => 500,
				'step'       => 1,
				'unit'       => 'px',
				'default'    => 100,
				'dependency' => array( 'footer_spacing', '==', 'true' )
			),
			array(
				'id'         => 'footer_bottom_spacing',
				'title'      => esc_html__( 'Footer Bottom Spacing', 'aapside' ),
				'type'       => 'slider',
				'desc'       => wp_kses( __( 'you can set <mark>padding</mark> for footer bottom', 'aapside' ), $allowed_html ),
				'min'        => 0,
				'max'        => 500,
				'step'       => 1,
				'unit'       => 'px',
				'default'    => 65,
				'dependency' => array( 'footer_spacing', '==', 'true' )
			),
			array(
				'type'    => 'subheading',
				'content' => '<h3>' . esc_html__( 'Footer Copyright Area Options', 'aapside' ) . '</h3>'
			),
			array(
				'id'      => 'copyright_area_spacing',
				'title'   => esc_html__( 'Copyright Area Spacing', 'aapside' ),
				'type'    => 'switcher',
				'desc'    => wp_kses( __( 'you can set <mark>Yes / No</mark> to set copyright area spacing', 'aapside' ), $allowed_html ),
				'default' => true,
			),
			array(
				'id'    => 'copyright_text',
				'title' => esc_html__( 'Copyright Area Text', 'aapside' ),
				'type'  => 'text',
				'desc'  => wp_kses( __( 'use  <mark>{copy}</mark> for copyright symbol, use <mark>{year}</mark> for current year, ', 'aapside' ), $allowed_html )
			),
			array(
				'id'         => 'copyright_area_top_spacing',
				'title'      => esc_html__( 'Copyright Area Top Spacing', 'aapside' ),
				'type'       => 'slider',
				'desc'       => wp_kses( __( 'you can set <mark>padding</mark> for copyright area top', 'aapside' ), $allowed_html ),
				'min'        => 0,
				'max'        => 500,
				'step'       => 1,
				'unit'       => 'px',
				'default'    => 20,
				'dependency' => array( 'copyright_area_spacing', '==', 'true' )
			),
			array(
				'id'         => 'copyright_area_bottom_spacing',
				'title'      => esc_html__( 'Copyright Area Bottom Spacing', 'aapside' ),
				'type'       => 'slider',
				'desc'       => wp_kses( __( 'you can set <mark>padding</mark> for copyright area bottom', 'aapside' ), $allowed_html ),
				'min'        => 0,
				'max'        => 500,
				'step'       => 1,
				'unit'       => 'px',
				'default'    => 20,
				'dependency' => array( 'copyright_area_spacing', '==', 'true' )
			),
		)
	) );
	/*-------------------------------------------------------
		  ** Blog  Options
	--------------------------------------------------------*/
	CSF::createSection( $prefix . '_theme_options', array(
		'id'    => 'blog_settings',
		'title' => esc_html__( 'Blog Settings', 'aapside' ),
		'icon'  => 'fa fa-rss'
	) );
	CSF::createSection( $prefix . '_theme_options', array(
		'parent' => 'blog_settings',
		'id'     => 'blog_post_options',
		'title'  => esc_html__( 'Blog Post', 'aapside' ),
		'icon'   => 'fa fa-list-ul',
		'fields' => Appside_Group_Fields::post_meta( 'blog_post', esc_html__( 'Blog Page', 'aapside' ) )
	) );
	CSF::createSection( $prefix . '_theme_options', array(
		'parent' => 'blog_settings',
		'id'     => 'blog_single_post_options',
		'title'  => esc_html__( 'Single Post', 'aapside' ),
		'icon'   => 'fa fa-list-alt',
		'fields' => Appside_Group_Fields::post_meta( 'blog_single_post', esc_html__( 'Blog Single Page', 'aapside' ) )
	) );
	/*-------------------------------------------------------
		  ** Pages & templates  Options
   --------------------------------------------------------*/
	CSF::createSection( $prefix . '_theme_options', array(
		'id'    => 'pages_and_template',
		'title' => esc_html__( 'Default Pages Settings', 'aapside' ),
		'icon'  => 'fa fa-files-o'
	) );
	/*  404 page options */
	CSF::createSection( $prefix . '_theme_options', array(
		'id'     => '404_page',
		'title'  => esc_html__( '404 Page', 'aapside' ),
		'parent' => 'pages_and_template',
		'icon'   => 'fa fa-exclamation-triangle',
		'fields' => array(
			array(
				'type'    => 'subheading',
				'content' => '<h3>' . esc_html__( '404 Page Options', 'aapside' ) . '</h3>',
			),
			array(
				'id'      => '404_bg_color',
				'type'    => 'color',
				'title'   => esc_html__( 'Page Background Color', 'aapside' ),
				'default' => '#ffffff'
			),
			array(
				'id'         => '404_title',
				'title'      => esc_html__( 'Title', 'aapside' ),
				'type'       => 'text',
				'info'       => wp_kses( __( 'you can change <mark>title</mark> of 404 page', 'aapside' ), $allowed_html ),
				'attributes' => array( 'placeholder' => esc_html__( '404', 'aapside' ) )
			),
			array(
				'id'         => '404_subtitle',
				'title'      => esc_html__( 'Sub Title', 'aapside' ),
				'type'       => 'text',
				'info'       => wp_kses( __( 'you can change <mark>sub title</mark> of 404 page', 'aapside' ), $allowed_html ),
				'attributes' => array( 'placeholder' => esc_html__( 'Oops! That page can not be found.', 'aapside' ) )
			),
			array(
				'id'         => '404_paragraph',
				'title'      => esc_html__( 'Paragraph', 'aapside' ),
				'type'       => 'textarea',
				'info'       => wp_kses( __( 'you can change <mark>paragraph</mark> of 404 page', 'aapside' ), $allowed_html ),
				'attributes' => array( 'placeholder' => esc_html__( 'It looks like nothing was found at this location. Maybe try one of the links below or a search?', 'aapside' ) )
			),
			array(
				'id'         => '404_button_text',
				'title'      => esc_html__( 'Button Text', 'aapside' ),
				'type'       => 'text',
				'info'       => wp_kses( __( 'you can change <mark>button text</mark> of 404 page', 'aapside' ), $allowed_html ),
				'attributes' => array( 'placeholder' => esc_html__( 'back to home', 'aapside' ) )
			),
			array(
				'id'      => '404_spacing_top',
				'title'   => esc_html__( 'Page Spacing Top', 'aapside' ),
				'type'    => 'slider',
				'desc'    => wp_kses( __( 'you can set <mark>Padding Top</mark> for page content area.', 'aapside' ), $allowed_html ),
				'min'     => 0,
				'max'     => 500,
				'step'    => 1,
				'unit'    => 'px',
				'default' => 120,
			),
			array(
				'id'      => '404_spacing_bottom',
				'title'   => esc_html__( 'Page Spacing Bottom', 'aapside' ),
				'type'    => 'slider',
				'desc'    => wp_kses( __( 'you can set <mark>Padding Bottom</mark> for page content area.', 'aapside' ), $allowed_html ),
				'min'     => 0,
				'max'     => 500,
				'step'    => 1,
				'unit'    => 'px',
				'default' => 120,
			),
		)
	) );
	/*  blog page options */
	CSF::createSection( $prefix . '_theme_options', array(
		'id'     => 'blog_page',
		'title'  => esc_html__( 'Blog Page', 'aapside' ),
		'parent' => 'pages_and_template',
		'icon'   => 'fa fa-indent',
		'fields' => Appside_Group_Fields::page_layout_options( esc_html__( 'Blog', 'aapside' ), 'blog' )
	) );
	/*  blog single page options */
	CSF::createSection( $prefix . '_theme_options', array(
		'id'     => 'blog_single_page',
		'title'  => esc_html__( 'Blog Single Page', 'aapside' ),
		'parent' => 'pages_and_template',
		'icon'   => 'fa fa-indent',
		'fields' => Appside_Group_Fields::page_layout_options( esc_html__( 'Blog Single', 'aapside' ), 'blog_single' )
	) );
	/*  archive page options */
	CSF::createSection( $prefix . '_theme_options', array(
		'id'     => 'archive_page',
		'title'  => esc_html__( 'Archive Page', 'aapside' ),
		'parent' => 'pages_and_template',
		'icon'   => 'fa fa-archive',
		'fields' => Appside_Group_Fields::page_layout_options( esc_html__( 'Archive', 'aapside' ), 'archive' )
	) );
	/*  search page options */
	CSF::createSection( $prefix . '_theme_options', array(
		'id'     => 'search_page',
		'title'  => esc_html__( 'Search Page', 'aapside' ),
		'parent' => 'pages_and_template',
		'icon'   => 'fa fa-search',
		'fields' => Appside_Group_Fields::page_layout_options( esc_html__( 'Search', 'aapside' ), 'search' )
	) );

	/*  portfolio options */
	CSF::createSection( $prefix . '_theme_options', array(
		'id'     => 'portfolio_single_page',
		'title'  => esc_html__( 'Portfolio Single Page', 'aapside' ),
		'parent' => 'pages_and_template',
		'icon'   => 'fa fa-th-large',
		'fields' => array(
			array(
				'type'    => 'subheading',
				'content' => '<h3>' . esc_html__( 'Portfolio Single Page Options', 'aapside' ) . '</h3>',
			),
			array(
				'id'      => 'portfolio_bg_color',
				'type'    => 'color',
				'title'   => esc_html__( 'Page Background Color', 'aapside' ),
				'default' => '#ffffff'
			),
			array(
				'id'      => 'portfolio_spacing_top',
				'title'   => esc_html__( 'Page Spacing Top', 'aapside' ),
				'type'    => 'slider',
				'desc'    => wp_kses( __( 'you can set <mark>Padding Top</mark> for page content area.', 'aapside' ), $allowed_html ),
				'min'     => 0,
				'max'     => 500,
				'step'    => 1,
				'unit'    => 'px',
				'default' => 120,
			),
			array(
				'id'      => 'portfolio_spacing_bottom',
				'title'   => esc_html__( 'Page Spacing Bottom', 'aapside' ),
				'type'    => 'slider',
				'desc'    => wp_kses( __( 'you can set <mark>Padding Bottom</mark> for page content area.', 'aapside' ), $allowed_html ),
				'min'     => 0,
				'max'     => 500,
				'step'    => 1,
				'unit'    => 'px',
				'default' => 120,
			),
			array(
				'id'      => 'portfolio_sidebar_title',
				'type'    => 'text',
				'title'   => esc_html__( 'Sidebar Title', 'aapside' ),
				'default' => esc_html__( 'Information', 'aapside' )
			),
			array(
				'id'      => 'portfolio_sidebar_clients',
				'type'    => 'text',
				'title'   => esc_html__( 'Client Title', 'aapside' ),
				'default' => esc_html__( 'Client', 'aapside' )
			),
			array(
				'id'      => 'portfolio_sidebar_company',
				'type'    => 'text',
				'title'   => esc_html__( 'Company Title', 'aapside' ),
				'default' => esc_html__( 'Company', 'aapside' )
			),
			array(
				'id'      => 'portfolio_sidebar_website',
				'type'    => 'text',
				'title'   => esc_html__( 'Website Title', 'aapside' ),
				'default' => esc_html__( 'Website', 'aapside' )
			),
			array(
				'id'      => 'portfolio_sidebar_category',
				'type'    => 'text',
				'title'   => esc_html__( 'Category Title', 'aapside' ),
				'default' => esc_html__( 'Category', 'aapside' )
			),
			array(
				'id'      => 'portfolio_sidebar_start_date',
				'type'    => 'text',
				'title'   => esc_html__( 'Start Date Title', 'aapside' ),
				'default' => esc_html__( 'Start Date', 'aapside' )
			),
			array(
				'id'      => 'portfolio_sidebar_end_date',
				'type'    => 'text',
				'title'   => esc_html__( 'End Date Title', 'aapside' ),
				'default' => esc_html__( 'End Date', 'aapside' )
			)
		)
	) );

	/*-------------------------------------------------------
		   ** Typography  Options
	--------------------------------------------------------*/
	CSF::createSection( $prefix . '_theme_options', array(
		'id'     => 'typography',
		'title'  => esc_html__( 'Typography', 'aapside' ),
		'icon'   => 'fa fa-text-width',
		'fields' => array(
			array(
				'type'    => 'subheading',
				'content' => '<h3>' . esc_html__( 'Body Font Options', 'aapside' ) . '</h3>',
			),
			array(
				'type'           => 'typography',
				'title'          => esc_html__( 'Typography', 'aapside' ),
				'id'             => '_body_font',
				'default'        => array(
					'font-family' => 'Poppins',
					'font-size'   => '16',
//					'line-height' => '1.3',
					'unit'        => '%',
					'type'        => 'google',
				),
				'color'          => false,
				'subset'         => false,
				'text_align'     => false,
				'text_transform' => false,
				'letter_spacing' => false,
				'line_height'    => false,
				'desc'           => wp_kses( __( 'you can set <mark>font</mark> for all html tags (if not use different heading font)', 'aapside' ), $allowed_html ),
			),
			array(
				'id'       => 'body_font_variant',
				'type'     => 'select',
				'title'    => esc_html__( 'Load Font Variant', 'aapside' ),
				'multiple' => true,
				'chosen'   => true,
				'options'  => array(
					'300' => esc_html__( 'Light 300', 'aapside' ),
					'400' => esc_html__( 'Regular 400', 'aapside' ),
					'500' => esc_html__( 'Medium 500', 'aapside' ),
					'600' => esc_html__( 'Semi Bold 600', 'aapside' ),
					'700' => esc_html__( 'Bold 700', 'aapside' ),
					'800' => esc_html__( 'Extra Bold 800', 'aapside' ),
				),
				'default'  => array( '400', '700' )
			),
			array(
				'type'    => 'subheading',
				'content' => '<h3>' . esc_html__( 'Heading Font Options', 'aapside' ) . '</h3>',
			),
			array(
				'type'    => 'switcher',
				'id'      => 'heading_font_enable',
				'title'   => esc_html__( 'Heading Font', 'aapside' ),
				'desc'    => wp_kses( __( 'you can set <mark>yes</mark> to select different heading font', 'aapside' ), $allowed_html ),
				'default' => false
			),
			array(
				'type'           => 'typography',
				'title'          => esc_html__( 'Typography', 'aapside' ),
				'id'             => 'heading_font',
				'default'        => array(
					'font-family' => 'Poppins',
					'type'        => 'google',
				),
				'color'          => false,
				'subset'         => false,
				'text_align'     => false,
				'text_transform' => false,
				'letter_spacing' => false,
				'font_size'      => false,
				'line_height'    => false,
				'desc'           => wp_kses( __( 'you can set <mark>font</mark> for  for heading tag .eg: h1,h2mh3,h4,h5,h6', 'aapside' ), $allowed_html ),
				'dependency'     => array( 'heading_font_enable', '==', 'true' )
			),
			array(
				'id'         => 'heading_font_variant',
				'type'       => 'select',
				'title'      => esc_html__( 'Load Font Variant', 'aapside' ),
				'multiple'   => true,
				'chosen'     => true,
				'options'    => array(
					'300' => esc_html__( 'Light 300', 'aapside' ),
					'400' => esc_html__( 'Regular 400', 'aapside' ),
					'500' => esc_html__( 'Medium 500', 'aapside' ),
					'600' => esc_html__( 'Semi Bold 600', 'aapside' ),
					'700' => esc_html__( 'Bold 700', 'aapside' ),
					'800' => esc_html__( 'Extra Bold 800', 'aapside' ),
				),
				'default'    => array( '400', '500', '600', '700', '800' ),
				'dependency' => array( 'heading_font_enable', '==', 'true' )
			),
		)
	) );

	/*-------------------------------------------------------
		   ** Backup  Options
	--------------------------------------------------------*/
	CSF::createSection( $prefix . '_theme_options', array(
		'id'     => 'backup',
		'title'  => esc_html__( 'Import / Export', 'aapside' ),
		'icon'   => 'fa fa-upload',
		'fields' => array(
			array(
				'type'    => 'notice',
				'style'   => 'warning',
				'content' => esc_html__( 'You can save your current options. Download a Backup and Import.', 'aapside' ),
			),
			array(
				'type'  => 'backup',
				'title' => esc_html__( 'Backup & Import', 'aapside' )
			)
		)
	) );
}
