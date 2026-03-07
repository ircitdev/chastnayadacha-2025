<?php
/**
 * The template for displaying the footer default satyle
 * @package appside
 * @since 2.0.0
 */
$copyright_text = !empty(cs_get_option('copyright_text')) ? cs_get_option('copyright_text'): esc_html__('Aapside Theme Developed by Ir-Tech','aapside');
$copyright_text = str_replace('{copy}','&copy;',$copyright_text);
$copyright_text = str_replace('{year}',date('Y'),$copyright_text);
?>

<footer class="footer-area">
	<?php get_template_part('template-parts/common/footer-widget'); ?>
	<div class="copyright-area"><!-- copyright area -->
		<div class="container">
			<div class="row">
				<div class="col-lg-12 text-center">
					<div class="copyright-inner"><!-- copyright inner wrapper -->
						<?php
						echo wp_kses($copyright_text,Appside()->kses_allowed_html(array('a')));
						?>
					</div><!-- //.copyright inner wrapper -->
				</div>
			</div>
		</div>
	</div><!-- //. copyright area -->
</footer>