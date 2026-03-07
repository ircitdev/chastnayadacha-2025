<?php
/**
 * The template for displaying the footer default satyle
 * @package appside
 * @since 2.0.0
 */
$page_container_meta = Appside_Group_Fields_Value::page_container( 'appside', 'header_options' );
$footer_builder_id = ($page_container_meta['footer_build_type'] == 'footer_builder' && !empty($page_container_meta['footer_builder_style']) ) ? $page_container_meta['footer_builder_style'] : '';

if($page_container_meta['footer_build_type'] == 'default' && cs_get_option('global_footer_build_type') == 'footer_builder'){
	$footer_builder_id = cs_get_option('global_footer_builder_style');
}
?>

<footer class="footer-builder-area footer-build-post-<?php echo esc_attr($footer_builder_id)?>">
	<?php echo Appside()->render_elementor_content($footer_builder_id);?>
</footer>