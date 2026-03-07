<?php

/*
 * Theme Customize Options
 * @package appside
 * @since 1.0.0
 * */

if ( !defined('ABSPATH') ){
	exit(); // exit if access directly
}

if (class_exists('CSF') ){
	$prefix = 'appside';

	CSF::createCustomizeOptions($prefix.'_customize_options');
	/*-------------------------------------
	** Theme Main panel
-------------------------------------*/
	CSF::createSection($prefix.'_customize_options',array(
		'title' => esc_html__('Appside Options','aapside'),
		'id' => 'appside_main_panel',
		'priority' => 11,
	));


	/*-------------------------------------
		** Theme Main Color
	-------------------------------------*/
	CSF::createSection($prefix.'_customize_options',array(
		'title' => esc_html__('01. Main Color','aapside'),
		'priority' => 10,
		'parent' => 'appside_main_panel',
		'fields' => array(
			array(
				'id'    => 'main_color',
				'type'  => 'color',
				'title' => esc_html__('Theme Main Color','aapside'),
				'default' => '#500ade',
				'desc' => esc_html__('This is theme primary color, means it\'ll affect most of elements that have default color of our theme primary color','aapside')
			),
			array(
				'id'    => 'secondary_color',
				'type'  => 'color',
				'title' => esc_html__('Theme Secondary Color','aapside'),
				'default' => '#111d5c',
				'desc' => esc_html__('This is theme secondary color, means it\'ll affect most of elements that have default color of our theme secondary color','aapside')
			),
			array(
				'id'    => 'heading_color',
				'type'  => 'color',
				'title' => esc_html__('Theme Heading Color','aapside'),
				'default' => '#1c144e',
				'desc' => esc_html__('This is theme heading color, means it\'ll affect all of heading tag like, h1,h2,h3,h4,h5,h6','aapside')
			),
			array(
				'id'    => 'paragraph_color',
				'type'  => 'color',
				'title' => esc_html__('Theme Paragraph Color','aapside'),
				'default' => '#878a95',
				'desc' => esc_html__('This is theme paragraph color, means it\'ll affect all of body/paragraph tag like, p,li,a etc','aapside')
			),
		)
	));
	/*-------------------------------------
		** Theme Header Options
	-------------------------------------*/

	CSF::createSection( $prefix.'_customize_options', array(
		'title'  => esc_html__('02. Header One Options','aapside'),
		'parent' => 'appside_main_panel',
		'priority' => 11,
		'fields' => array(
			array(
				'type' => 'subheading',
				'content' =>'<h3>'.esc_html__('Nav Bar Options','aapside').'</h3>'
			),
			array(
				'id' => 'header_01_nav_bar_bg_color',
				'type' => 'color',
				'title' => esc_html__('Nav Bar Background Color','aapside'),
				'default' => '#fff'
			),
			array(
				'id' => 'header_01_nav_bar_color',
				'type' => 'color',
				'title' => esc_html__('Nav Bar Text Color','aapside'),
				'default' => '#878a95'
			),
			array(
				'type' => 'subheading',
				'content' =>'<h3>'.esc_html__('Dropdown Options','aapside').'</h3>'
			),
			array(
				'id' => 'header_01_dropdown_bg_color',
				'type' => 'color',
				'title' => esc_html__('Dropdown Background Color','aapside'),
				'default' => '#ffffff'
			),
			array(
				'id' => 'header_01_dropdown_color',
				'type' => 'color',
				'title' => esc_html__('Dropdown Text Color','aapside'),
				'default' => '#878a95'
			)
		)
	));
	CSF::createSection( $prefix.'_customize_options', array(
		'title'  => esc_html__('03. Header Two Options','aapside'),
		'parent' => 'appside_main_panel',
		'priority' => 11,
		'fields' => array(
			array(
				'type' => 'subheading',
				'content' =>'<h3>'.esc_html__('Nav Bar Options','aapside').'</h3>'
			),
			array(
				'id' => 'header_02_nav_bar_bg_color',
				'type' => 'color',
				'title' => esc_html__('Nav Bar Background Color','aapside'),
				'default' => 'transparent'
			),
			array(
				'id' => 'header_02_nav_bar_color',
				'type' => 'color',
				'title' => esc_html__('Nav Bar Text Color','aapside'),
				'default' => 'rgba(255, 255, 255, 0.8)'
			),
			array(
				'type' => 'subheading',
				'content' =>'<h3>'.esc_html__('Dropdown Options','aapside').'</h3>'
			),
			array(
				'id' => 'header_02_dropdown_bg_color',
				'type' => 'color',
				'title' => esc_html__('Dropdown Background Color','aapside'),
				'default' => '#ffffff'
			),
			array(
				'id' => 'header_02_dropdown_color',
				'type' => 'color',
				'title' => esc_html__('Dropdown Text Color','aapside'),
				'default' => '#878a95'
			)
		)
	));

	CSF::createSection( $prefix.'_customize_options', array(
		'title'  => esc_html__('04. Header Three Options','aapside'),
		'parent' => 'appside_main_panel',
		'priority' => 11,
		'fields' => array(
			array(
				'type' => 'subheading',
				'content' =>'<h3>'.esc_html__('Nav Bar Options','aapside').'</h3>'
			),
			array(
				'id' => 'header_03_nav_bar_bg_color',
				'type' => 'color',
				'title' => esc_html__('Nav Bar Background Color','aapside'),
				'default' => 'transparent'
			),
			array(
				'id' => 'header_03_nav_bar_color',
				'type' => 'color',
				'title' => esc_html__('Nav Bar Text Color','aapside'),
				'default' => 'rgba(255, 255, 255, 0.8)'
			),
			array(
				'type' => 'subheading',
				'content' =>'<h3>'.esc_html__('Dropdown Options','aapside').'</h3>'
			),
			array(
				'id' => 'header_03_dropdown_bg_color',
				'type' => 'color',
				'title' => esc_html__('Dropdown Background Color','aapside'),
				'default' => '#ffffff'
			),
			array(
				'id' => 'header_03_dropdown_color',
				'type' => 'color',
				'title' => esc_html__('Dropdown Text Color','aapside'),
				'default' => '#878a95'
			),
			array(
				'type' => 'subheading',
				'content' =>'<h3>'.esc_html__('Button One Options','aapside').'</h3>'
			),
			array(
				'id' => 'header_03_btn_one_border_color',
				'type' => 'color',
				'title' => esc_html__('Button One Border Color','aapside'),
				'default' => 'rgba(255,255,255,.8)'
			),
			array(
				'id' => 'header_03_btn_one_color',
				'type' => 'color',
				'title' => esc_html__('Button One Color','aapside'),
				'default' => 'rgba(255,255,255,.8)'
			),
			array(
				'id' => 'header_03_btn_one_hover_border_color',
				'type' => 'color',
				'title' => esc_html__('Button One Hover Border Color','aapside'),
				'default' => '#500ade'
			),
			array(
				'id' => 'header_03_btn_one_hover_color',
				'type' => 'color',
				'title' => esc_html__('Button One Hover Color','aapside'),
				'default' => '#fff'
			),
			array(
				'id' => 'header_03_btn_one_hover_bg_color',
				'type' => 'color',
				'title' => esc_html__('Button One Hover Background Color','aapside'),
				'default' => '#500ade'
			),
			array(
				'type' => 'subheading',
				'content' =>'<h3>'.esc_html__('Button Two Options','aapside').'</h3>'
			),
			array(
				'id' => 'header_03_btn_two_background_color',
				'type' => 'color',
				'title' => esc_html__('Button Two Background Color','aapside'),
				'default' => '#500ade'
			),
			array(
				'id' => 'header_03_btn_two_color',
				'type' => 'color',
				'title' => esc_html__('Button Two Color','aapside'),
				'default' => 'rgba(255,255,255,.8)'
			),
		)
	));

	CSF::createSection( $prefix.'_customize_options', array(
		'title'  => esc_html__('05. Header Four Options','aapside'),
		'parent' => 'appside_main_panel',
		'priority' => 11,
		'fields' => array(
			array(
				'type' => 'subheading',
				'content' =>'<h3>'.esc_html__('Nav Bar Options','aapside').'</h3>'
			),
			array(
				'id' => 'header_04_nav_bar_bg_color',
				'type' => 'color',
				'title' => esc_html__('Nav Bar Background Color','aapside'),
				'default' => '#fff'
			),
			array(
				'id' => 'header_04_nav_bar_color',
				'type' => 'color',
				'title' => esc_html__('Nav Bar Text Color','aapside'),
				'default' => '#878a95'
			),
			array(
				'type' => 'subheading',
				'content' =>'<h3>'.esc_html__('Dropdown Options','aapside').'</h3>'
			),
			array(
				'id' => 'header_04_dropdown_bg_color',
				'type' => 'color',
				'title' => esc_html__('Dropdown Background Color','aapside'),
				'default' => '#ffffff'
			),
			array(
				'id' => 'header_04_dropdown_color',
				'type' => 'color',
				'title' => esc_html__('Dropdown Text Color','aapside'),
				'default' => '#878a95'
			),
			array(
				'type' => 'subheading',
				'content' =>'<h3>'.esc_html__('Button Options','aapside').'</h3>'
			),
			array(
				'id' => 'header_04_btn_background_color',
				'type' => 'color',
				'title' => esc_html__('Button Background Color','aapside'),
				'default' => '#500ade'
			),
			array(
				'id' => 'header_04_btn_color',
				'type' => 'color',
				'title' => esc_html__('Button Color','aapside'),
				'default' => 'rgba(255,255,255,.8)'
			),
		)
	));

	/*-------------------------------------
	  ** Theme Sidebar Options
  -------------------------------------*/
	CSF::createSection($prefix.'_customize_options',array(
		'title' => esc_html__('06. Sidebar','aapside'),
		'priority' => 13,
		'parent' => 'appside_main_panel',
		'fields' => array(
			array(
				'type' => 'subheading',
				'content' =>'<h3>'.esc_html__('Sidebar Options','aapside').'</h3>'
			),
			array(
				'id' => 'sidebar_widget_border_color',
				'type' => 'color',
				'title' => esc_html__('Sidebar Widget Border Color','aapside'),
				'default' => '#fafafa'
			),
			array(
				'id' => 'sidebar_widget_title_color',
				'type' => 'color',
				'title' => esc_html__('Sidebar Widget Title Color','aapside'),
				'default' => '#242424'
			),
			array(
				'id' => 'sidebar_widget_text_color',
				'type' => 'color',
				'title' => esc_html__('Sidebar Widget Text Color','aapside'),
				'default' => '#777777'
			),
		)
	));
	/*-------------------------------------
		** Theme Footer Options
	-------------------------------------*/
	CSF::createSection($prefix.'_customize_options',array(
		'title' => esc_html__('07. Footer','aapside'),
		'priority' => 14,
		'parent' => 'appside_main_panel',
		'fields' => array(
			array(
				'type' => 'subheading',
				'content' =>'<h3>'.esc_html__('Footer Options','aapside').'</h3>'
			),
			array(
				'id' => 'footer_area_bg_color',
				'type' => 'color',
				'title' => esc_html__('Footer Background Color','aapside'),
				'default' => '#0d2753',

			),
			array(
				'type' => 'subheading',
				'content' =>'<h3>'.esc_html__('Footer Widget Options','aapside').'</h3>'
			),
			array(
				'id' => 'footer_widget_title_color',
				'type' => 'color',
				'title' => esc_html__('Footer Widget Title Color','aapside'),
				'default' => '#ffffff'
			),
			array(
				'id' => 'footer_widget_text_color',
				'type' => 'color',
				'title' => esc_html__('Footer Widget Text Color','aapside'),
				'default' => 'rgba(255, 255, 255, 0.7)'
			),
			array(
				'type' => 'subheading',
				'content' =>'<h3>'.esc_html__('Copyright Area Options','aapside').'</h3>'
			),
			array(
				'id' => 'copyright_area_border_top_color',
				'type' => 'color',
				'title' => esc_html__('Copyright Area Border Top Color','aapside'),
				'default' => 'rgba(255, 255, 255, 0.2)'
			),
			array(
				'id' => 'copyright_area_text_color',
				'type' => 'color',
				'title' => esc_html__('Copyright Area Text Color','aapside'),
				'default' => 'rgba(255, 255, 255, 0.6)'
			),
		)
	));

}//endif