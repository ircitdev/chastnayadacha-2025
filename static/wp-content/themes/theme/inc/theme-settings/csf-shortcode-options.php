<?php
/**
 * theme shortcode generator
 * @since 1.0.0
 * */
if (!defined('ABSPATH')){
	exit(); //exit if access it directly
}

// Control core classes for avoid errors
if( class_exists( 'CSF' ) ) {
	$prefix = 'appside';
	CSF::createShortcoder( $prefix.'_shortcodes', array(
		'button_title'   => esc_html__('Add Shortcode','aapside'),
		'select_title'   => esc_html__('Select a shortcode','aapside'),
		'insert_title'   => esc_html__('Insert Shortcode','aapside')
	) );

	/*------------------------------------
		Inline info shortcode options
	-------------------------------------*/
	CSF::createSection( $prefix.'_shortcodes', array(
		'title'     => esc_html__('Inline Info Text','aapside'),
		'view'      => 'group',
		'shortcode' => 'appside_info_item_wrap',
		'group_shortcode' => 'appside_info_inline_text',
		'group_fields'    => array(
			array(
				'id'    => 'url',
				'type'  => 'text',
				'title' => esc_html__('URL','aapside'),
			),

			array(
				'id'      => 'text',
				'type'    => 'text',
				'title'   => esc_html__('Text','aapside'),
			)
		)
	) );
	/*------------------------------------
		Inline info link options
	-------------------------------------*/
	CSF::createSection( $prefix.'_shortcodes', array(
		'title'     => esc_html__('Inline Info Link','aapside'),
		'view'      => 'group',
		'shortcode' => 'appside_info_item_wrap',
		'group_shortcode' => 'appside_info_link',
		'group_fields'    => array(
			array(
				'id'    => 'icon',
				'type'  => 'icon',
				'title' => esc_html__('Icon','aapside'),
			),
			array(
				'id'      => 'text',
				'type'    => 'text',
				'title'   => esc_html__('Text','aapside'),
			),
			array(
				'id'      => 'url',
				'type'    => 'text',
				'title'   => esc_html__('URL','aapside'),
			)
		)
	) );
	/*------------------------------------
		info item two
	-------------------------------------*/
	CSF::createSection( $prefix.'_shortcodes', array(
		'title'     => esc_html__('Info Item Two','aapside'),
		'view'      => 'group',
		'shortcode' => 'appside_info_item_two_wrap',
		'group_shortcode' => 'appside_info_item_two',
		'group_fields'    => array(
			array(
				'id'    => 'icon',
				'type'  => 'icon',
				'title' => esc_html__('Icon','aapside'),
			),
			array(
				'id'      => 'title',
				'type'    => 'text',
				'title'   => esc_html__('Title','aapside'),
			),
			array(
				'id'      => 'details',
				'type'    => 'text',
				'title'   => esc_html__('Details','aapside'),
			)
		)
	) );
	/*------------------------------------
		info item three
	-------------------------------------*/
	CSF::createSection( $prefix.'_shortcodes', array(
		'title'     => esc_html__('Info Item Three','aapside'),
		'view'      => 'group',
		'shortcode' => 'appside_info_item_three_wrap',
		'group_shortcode' => 'appside_info_inline_item_three',
		'group_fields'    => array(
			array(
				'id'    => 'icon',
				'type'  => 'icon',
				'title' => esc_html__('Icon','aapside'),
			),
			array(
				'id'      => 'title',
				'type'    => 'text',
				'title'   => esc_html__('Title','aapside'),
			),
			array(
				'id'      => 'details',
				'type'    => 'text',
				'title'   => esc_html__('Details','aapside'),
			)
		)
	) );

}
