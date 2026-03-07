<?php
/**
 * Template part for displaying results in search pages
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package appside
 */

?>

<article id="post-<?php the_ID(); ?>" <?php post_class('single-blog-classic-item margin-bottom-30'); ?>>
	<?php Appside()->post_thumbnail(); ?>
    <div class="content">
		<?php
		get_template_part('template-parts/common/post-meta');
		the_title( '<h2 class="title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h2>' );
		get_template_part('template-parts/common/post-excerpt');
		?>
    </div>
</article><!-- #post-<?php the_ID(); ?> -->
