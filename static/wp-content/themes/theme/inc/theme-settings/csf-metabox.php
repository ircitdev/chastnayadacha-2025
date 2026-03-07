<?php
/*
 * Theme Metabox Options
 * @package Appside
 * @since 1.0.0
 * */

if ( !defined('ABSPATH') ){
	exit(); // exit if access directly
}

if ( class_exists('CSF') ){

	$allowed_html = Appside()->kses_allowed_html(array('mark'));

	$prefix = 'appside';
	/*-------------------------------------
		Post Format Options
	-------------------------------------*/
	CSF::createMetabox($prefix.'_post_video_options',array(
		'title' => esc_html__('Video Post Format Options','aapside'),
		'post_type' => 'post',
		'post_formats' => 'video'
	));
	CSF::createSection($prefix.'_post_video_options',array(
		'fields' => array(
			array(
				'id' => 'video_url',
				'type' => 'text',
				'title' => esc_html__('Enter Video URL','aapside'),
				'desc' => wp_kses(__('enter <mark>video url</mark> to show in frontend','aapside'),$allowed_html)
			)
		)
	));
	CSF::createMetabox($prefix.'_post_gallery_options',array(
		'title' => esc_html__('Gallery Post Format Options','aapside'),
		'post_type' => 'post',
		'post_formats' => 'gallery'
	));
	CSF::createSection($prefix.'_post_gallery_options',array(
		'fields' => array(
			array(
				'id' => 'gallery_images',
				'type' => 'gallery',
				'title' => esc_html__('Select Gallery Photos','aapside'),
				'desc' => wp_kses(__('select <mark>gallery photos</mark> to show in frontend','aapside'),$allowed_html)
			)
		)
	));
	/*-------------------------------------
	  Page Container Options
  -------------------------------------*/
	CSF::createMetabox($prefix.'_page_container_options',array(
		'title' => esc_html__('Page Options','aapside'),
		'post_type' => array('page'),
	));
	CSF::createSection($prefix.'_page_container_options',array(
		'title' => esc_html__('Layout & Colors','aapside'),
		'icon' => 'fa fa-columns',
		'fields' => Appside_Group_Fields::page_layout()
	));
	CSF::createSection($prefix.'_page_container_options',array(
		'title' => esc_html__('Header & Footer','aapside'),
		'icon' => 'fa fa-header',
		'fields' => Appside_Group_Fields::Page_Container_Options('header_options')
	));
	CSF::createSection($prefix.'_page_container_options',array(
		'title' => esc_html__('Width & Padding','aapside'),
		'icon' => 'fa fa-file-o',
		'fields' => Appside_Group_Fields::Page_Container_Options('container_options')
	));

	/*-------------------------------------
	 Portfolio Options
  -------------------------------------*/
	CSF::createMetabox($prefix.'_portfolio_options',array(
		'title' => esc_html__('Portfolio Info Options','aapside'),
		'post_type' => array('portfolio'),
	));
	CSF::createSection($prefix.'_portfolio_options',array(
		'fields' => array(
			array(
				'id' => 'client',
				'type' => 'text',
				'title' => esc_html__('Client Name','aapside'),
			),
			array(
				'id' => 'company_name',
				'type' => 'text',
				'title' => esc_html__('Company Name','aapside'),
			),
			array(
				'id' => 'website',
				'type' => 'text',
				'title' => esc_html__('Website','aapside'),
			),
			array(
				'id' => 'start',
				'type' => 'date',
				'title' => esc_html__('Start Date','aapside'),
				'settings' => array(
					'dateFormat' => 'dd/mm/yy'
				)
			),
			array(
				'id' => 'finish',
				'type' => 'date',
				'title' => esc_html__('Finish Date','aapside'),
				'settings' => array(
					'dateFormat' => 'dd/mm/yy'
				)
			)
		)
	));


}//endif