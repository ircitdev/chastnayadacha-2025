<?php
/**
 * header style 01
 * @since 2.0.0
 *
 * */
$page_container_meta = Appside_Group_Fields_Value::page_container( 'appside', 'header_options' );
$header_builder_id = ($page_container_meta['navbar_build_type'] == 'header_builder' && !empty($page_container_meta['header_builder_style']) ) ? $page_container_meta['header_builder_style'] : '';

if($page_container_meta['navbar_type'] == 'default' && cs_get_option('global_navbar_build_type') == 'header_builder'){
	$header_builder_id = cs_get_option('global_header_builder_style');
}
?>
<div class="header-builder-wrap header-builder-post-<?php echo esc_attr($header_builder_id)?>">
    <?php echo Appside()->render_elementor_content($header_builder_id);?>
</div>