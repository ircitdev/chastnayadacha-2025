<?php
/*
 * @package Appside
 * @since 1.0.0
 * */

if ( !defined('ABSPATH') ){
	exit(); // exit if access directly
}


if ( !class_exists('Appside_Group_Fields') ){

	class Appside_Group_Fields{
		/*
			* $instance
			* @since 1.0.0
			* */
		private static $instance;
		/*
		* construct()
		* @since 1.0.0
		* */
		public function __construct() {

		}
		/*
	   * getInstance()
	   * @since 1.0.0
	   * */
		public static function getInstance(){
			if ( null == self::$instance ){
				self::$instance = new self();
			}
			return self::$instance;
		}

		/**
		 * page layout options
		 * @since 1.0.0
		 * */
		public static function page_layout(){
			$fields = array(
				array(
					'type'    => 'subheading',
					'content' => esc_html__('Page Layouts & Colors Options','aapside'),
				),
				array(
					'id' => 'page_layout',
					'type' => 'image_select',
					'title' => esc_html__('Select Page Layout','aapside'),
					'options' => array(
						'default' => APPSIDE_THEME_SETTINGS_IMAGES .'/page/default.png',
						'left-sidebar' => APPSIDE_THEME_SETTINGS_IMAGES .'/page/left-sidebar.png',
						'right-sidebar' => APPSIDE_THEME_SETTINGS_IMAGES .'/page/right-sidebar.png',
						'blank' => APPSIDE_THEME_SETTINGS_IMAGES .'/page/blank.png',
					),
					'default' => 'default'
				),
				array(
					'id' => 'page_bg_color',
					'type' => 'color',
					'title' => esc_html__('Page Background Color','aapside'),
					'default' => '#ffffff'
				),
				array(
					'id' => 'page_content_bg_color',
					'type' => 'color',
					'title' => esc_html__('Page Content Background Color','aapside'),
					'default' => '#ffffff'
				)
			);

			return $fields;
		}

		/**
		 * page container options
		 * @since 1.0.0
		 * */
		public static function  Page_Container_Options($type){
			$fields = array();
			$allowed_html = Appside()->kses_allowed_html(array('mark'));
			if ('header_options' == $type){
				$fields = array(
					array(
						'type'    => 'subheading',
						'content' => esc_html__('Page Header & Breadcrumb Options','aapside'),
					),
					array(
						'id' => 'navbar_build_type',
						'title' => esc_html__('Header Type','aapside'),
						'type' => 'select',
						'options' => [
							'default' => esc_html__('Default','aapside'),
							'header_builder' => esc_html__('Header Builder','aapside'),
						],
						'default' => 'default',
						'desc' => wp_kses(__('you can set <mark>header type</mark> default or use header builder design.','aapside'),$allowed_html),
					),
					array(
						'id' => 'navbar_type',
						'title' => esc_html__('Header Style','aapside'),
						'type' => 'image_select',
						'options' => array(
							'default' => APPSIDE_THEME_SETTINGS_IMAGES .'/header/02.jpg',
							'style-01' => APPSIDE_THEME_SETTINGS_IMAGES .'/header/01.jpg',
							'style-02' => APPSIDE_THEME_SETTINGS_IMAGES .'/header/03.png',
							'style-03' => APPSIDE_THEME_SETTINGS_IMAGES .'/header/04.png',
						),
						'default' => 'default',
						'desc' => wp_kses(__('you can set <mark>header style</mark> from available design','aapside'),$allowed_html),
						'dependency' => ['navbar_build_type','==','default']
					),
					array(
						'id' => 'header_builder_style',
						'title' => esc_html__('Header Builder Style','aapside'),
						'type' => 'select',
						'options' => Appside()->get_post_list_by_post_type('apside-hebuilder'),
						'default' => 'black',
						'desc' => wp_kses(__('you can set <mark>header builder style</mark> for this page.','aapside'),$allowed_html),
						'dependency' => ['navbar_build_type','==','header_builder']
					),
					array(
						'id' => 'footer_build_type',
						'title' => esc_html__('Footer Type','aapside'),
						'type' => 'select',
						'options' => [
							'default' => esc_html__('Default','aapside'),
							'footer_builder' => esc_html__('Footer Builder','aapside'),
						],
						'default' => 'default',
						'desc' => wp_kses(__('you can set <mark>footer type</mark> default or use header builder design.','aapside'),$allowed_html),
					),
					array(
						'id' => 'footer_builder_style',
						'title' => esc_html__('Footer Builder Style','aapside'),
						'type' => 'select',
						'options' => Appside()->get_post_list_by_post_type('apside-foobuilder'),
						'default' => 'black',
						'desc' => wp_kses(__('you can set <mark>footer builder style</mark> for this page.','aapside'),$allowed_html),
						'dependency' => ['footer_build_type','==','footer_builder']
					),
					array(
						'id' => 'page_title',
						'type' => 'switcher',
						'title' => esc_html__('Page Title','aapside'),
						'desc' => wp_kses(__('you can set <mark>ON / OFF</mark> to show/hide page title.','aapside'),$allowed_html),
						'text_on' => esc_html__('Yes','aapside'),
						'text_off' => esc_html__('No','aapside'),
						'default' => true
					),
					array(
						'id' => 'page_breadcrumb',
						'type' => 'switcher',
						'title' => esc_html__('Page Breadcrumb','aapside'),
						'desc' => wp_kses(__('you can set <mark>ON / OFF</mark> to show/hide page breadcrumb.','aapside'),$allowed_html),
						'text_on' => esc_html__('Yes','aapside'),
						'text_off' => esc_html__('No','aapside'),
						'default' => true
					),
				);
			}elseif ('container_options' == $type){
				$fields = array(
					array(
						'type'    => 'subheading',
						'content' => esc_html__('Page Width & Padding Options','aapside'),
					),
					array(
						'id' => 'page_container',
						'type' => 'switcher',
						'title' => esc_html__('Page Full Width','aapside'),
						'desc' => wp_kses(__('you can set <mark>ON / OFF</mark> to set page container full width.','aapside'),$allowed_html),
						'text_on' => esc_html__('Yes','aapside'),
						'text_off' => esc_html__('No','aapside'),
						'default' => false
					),
					array(
						'type'    => 'subheading',
						'content' => esc_html__('Page Spacing Options','aapside'),
					),
					array(
						'id' => 'page_spacing_top',
						'title' => esc_html__('Page Spacing Top','aapside'),
						'type' => 'slider',
						'desc' => wp_kses(__('you can set <mark>Padding Top</mark> for page container.','aapside'),$allowed_html),
						'min'     => 0,
						'max'     => 500,
						'step'    => 1,
						'unit'    => 'px',
						'default' => 120,
					),
					array(
						'id' => 'page_spacing_bottom',
						'title' => esc_html__('Page Spacing Bottom','aapside'),
						'type' => 'slider',
						'desc' => wp_kses(__('you can set <mark>Padding Bottom</mark> for page container.','aapside'),$allowed_html),
						'min'     => 0,
						'max'     => 500,
						'step'    => 1,
						'unit'    => 'px',
						'default' => 120,
					),
					array(
						'type'    => 'subheading',
						'content' => esc_html__('Page Content Spacing Options','aapside'),
					),
					array(
						'id' => 'page_content_spacing',
						'type' => 'switcher',
						'title' => esc_html__('Page Content Spacing','aapside'),
						'desc' => wp_kses(__('you can set <mark>ON / OFF</mark> to set page content spacing.','aapside'),$allowed_html),
						'text_on' => esc_html__('Yes','aapside'),
						'text_off' => esc_html__('No','aapside'),
						'default' => false
					),
					array(
						'id' => 'page_content_spacing_top',
						'title' => esc_html__('Page Spacing Bottom','aapside'),
						'type' => 'slider',
						'desc' => wp_kses(__('you can set <mark>Padding Top</mark> for page content area.','aapside'),$allowed_html),
						'min'     => 0,
						'max'     => 500,
						'step'    => 1,
						'unit'    => 'px',
						'default' => 0,
						'dependency' => array('page_content_spacing' ,'==','true')
					),
					array(
						'id' => 'page_content_spacing_bottom',
						'title' => esc_html__('Page Spacing Bottom','aapside'),
						'type' => 'slider',
						'desc' => wp_kses(__('you can set <mark>Padding Bottom</mark> for page content area.','aapside'),$allowed_html),
						'min'     => 0,
						'max'     => 500,
						'step'    => 1,
						'unit'    => 'px',
						'default' => 0,
						'dependency' => array('page_content_spacing' ,'==','true')
					),
					array(
						'id' => 'page_content_spacing_left',
						'title' => esc_html__('Page Spacing Left','aapside'),
						'type' => 'slider',
						'desc' => wp_kses(__('you can set <mark>Padding Left</mark> for page content area.','aapside'),$allowed_html),
						'min'     => 0,
						'max'     => 500,
						'step'    => 1,
						'unit'    => 'px',
						'default' => 0,
						'dependency' => array('page_content_spacing' ,'==','true')
					),
					array(
						'id' => 'page_content_spacing_right',
						'title' => esc_html__('Page Spacing Right','aapside'),
						'type' => 'slider',
						'desc' => wp_kses(__('you can set <mark>Padding Right</mark> for page content area.','aapside'),$allowed_html),
						'min'     => 0,
						'max'     => 500,
						'step'    => 1,
						'unit'    => 'px',
						'default' => 0,
						'dependency' => array('page_content_spacing' ,'==','true')
					),
				);
			}

			return $fields;
		}
		/**
		 * page layout options
		 * */
		public static function page_layout_options($title,$prefix){
			$allowed_html = Appside()->kses_allowed_html(array('mark'));
			$fields = array(
				array(
					'type' => 'subheading',
					'content' => '<h3>'.$title.esc_html__(' Page Options','aapside').'</h3>',
				),
				array(
					'id' => $prefix.'_layout',
					'type' => 'image_select',
					'title' => esc_html__('Select Page Layout','aapside'),
					'options' => array(
						'right-sidebar' => APPSIDE_THEME_SETTINGS_IMAGES .'/page/right-sidebar.png',
						'left-sidebar' => APPSIDE_THEME_SETTINGS_IMAGES .'/page/left-sidebar.png',
						'no-sidebar' => APPSIDE_THEME_SETTINGS_IMAGES .'/page/no-sidebar.png',
					),
					'default' => 'right-sidebar'
				),
				array(
					'id' => $prefix.'_bg_color',
					'type' => 'color',
					'title' => esc_html__('Page Background Color','aapside'),
					'default' => '#ffffff'
				),
				array(
					'id' => $prefix.'_spacing_top',
					'title' => esc_html__('Page Spacing Top','aapside'),
					'type' => 'slider',
					'desc' => wp_kses(__('you can set <mark>Padding Top</mark> for page content area.','aapside'),$allowed_html),
					'min'     => 0,
					'max'     => 500,
					'step'    => 1,
					'unit'    => 'px',
					'default' => 120,
				),
				array(
					'id' => $prefix.'_spacing_bottom',
					'title' => esc_html__('Page Spacing Bottom','aapside'),
					'type' => 'slider',
					'desc' => wp_kses(__('you can set <mark>Padding Bottom</mark> for page content area.','aapside'),$allowed_html),
					'min'     => 0,
					'max'     => 500,
					'step'    => 1,
					'unit'    => 'px',
					'default' => 120,
				),
			);

			return $fields;
		}

		/**
		 * Post meta
		 * @since 1.0.0
		 * */
		public static function post_meta($prefix,$title){
			$allowed_html = Appside()->kses_allowed_html(array('mark'));
			$fields = array(
				array(
					'type' => 'subheading',
					'content' => '<h3>'.$title.esc_html__(' Post Options','aapside').'</h3>',
				),
				array(
					'id' => $prefix.'_posted_by',
					'type' => 'switcher',
					'title' => esc_html__('Posted By','aapside'),
					'desc' => wp_kses(__('you can set <mark>ON / OFF</mark> to show / hide posted by.','aapside'),$allowed_html),
					'text_on' => esc_html__('Yes','aapside'),
					'text_off' => esc_html__('No','aapside'),
					'default' => true
				),
				array(
					'id' => $prefix.'_posted_on',
					'type' => 'switcher',
					'title' => esc_html__('Posted On','aapside'),
					'desc' => wp_kses(__('you can set <mark>ON / OFF</mark> to show / hide posted on.','aapside'),$allowed_html),
					'text_on' => esc_html__('Yes','aapside'),
					'text_off' => esc_html__('No','aapside'),
					'default' => true
				)
			);

			if ( 'blog_post' == $prefix){
				$fields[] =  array(
					'id' => $prefix.'_readmore_btn',
					'type' => 'switcher',
					'title' => esc_html__('Read More Button','aapside'),
					'desc' => wp_kses(__('you can set <mark>ON / OFF</mark> to show / hide read more button.','aapside'),$allowed_html),
					'text_on' => esc_html__('Yes','aapside'),
					'text_off' => esc_html__('No','aapside'),
					'default' => true
				);
				$fields[] =  array(
					'id' => $prefix.'_readmore_btn_text',
					'type' => 'text',
					'title' => esc_html__('Read More Text','aapside'),
					'desc' => wp_kses(__('you can set read more <mark>button text</mark> to button text.','aapside'),$allowed_html),
					'default' => esc_html__('Read More','aapside'),
					'dependency' => array($prefix.'_readmore_btn' ,'==','true')
				);
				$fields[] =  array(
					'id' => $prefix.'_excerpt_more',
					'type' => 'text',
					'title' => esc_html__('Excerpt More','aapside'),
					'desc' => wp_kses(__('you can set read more <mark>button text</mark> to button text.','aapside'),$allowed_html),
					'attributes' => array(
						'placeholder' => esc_html__('....','aapside')
					)
				);
				$fields[] =  array(
					'id' => $prefix.'_excerpt_length',
					'type' => 'select',
					'options' => array(
						'25' => esc_html__('Short','aapside'),
						'55' => esc_html__('Regular','aapside'),
						'100' => esc_html__('Long','aapside'),
					),
					'title' => esc_html__('Excerpt Length','aapside'),
					'desc' => wp_kses(__('you can set <mark> excerpt length</mark> for post.','aapside'),$allowed_html),
				);
			}elseif('blog_single_post' == $prefix){

				$fields[] =array(
					'id' => $prefix.'_posted_category',
					'type' => 'switcher',
					'title' => esc_html__('Posted Category','aapside'),
					'desc' => wp_kses(__('you can set <mark>ON / OFF</mark> to show / hide posted category.','aapside'),$allowed_html),
					'text_on' => esc_html__('Yes','aapside'),
					'text_off' => esc_html__('No','aapside'),
					'default' => true
				);
				$fields[] =  array(
					'id' => $prefix.'_posted_tag',
					'type' => 'switcher',
					'title' => esc_html__('Posted Tags','aapside'),
					'desc' => wp_kses(__('you can set <mark>ON / OFF</mark> to show / hide post tags.','aapside'),$allowed_html),
					'text_on' => esc_html__('Yes','aapside'),
					'text_off' => esc_html__('No','aapside'),
					'default' => true
				);
				$fields[] =  array(
					'id' => $prefix.'_posted_share',
					'type' => 'switcher',
					'title' => esc_html__('Post Share','aapside'),
					'desc' => wp_kses(__('you can set <mark>ON / OFF</mark> to show / hide post share.','aapside'),$allowed_html),
					'text_on' => esc_html__('Yes','aapside'),
					'text_off' => esc_html__('No','aapside'),
					'default' => true
				);
			}

			return $fields;
		}

	}//end class

}//end if

