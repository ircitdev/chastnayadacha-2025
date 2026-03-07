<?php
/**
 * Template part for displaying posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package appside
 */
$appside = Appside();
?>

<article id="post-<?php the_ID(); ?>" <?php post_class('single-blog-classic-item margin-bottom-30'); ?>>
      <?php
        the_title( '<h2 class="title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h2>' );
        ?>
</article><!-- #post-<?php the_ID(); ?> -->
