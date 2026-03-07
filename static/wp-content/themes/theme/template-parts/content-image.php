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
    <?php if ( has_post_thumbnail() ):?>
        <div class="thumb">
            <div class="time">
                <span class="date"><?php echo esc_html(get_the_date('d'))?></span>
                <span class="month"><?php echo esc_html(get_the_date('M'))?></span>
            </div>
            <?php $appside->post_thumbnail(); ?>
        </div>
    <?php endif;?>
    <div class="content">
      <?php
        get_template_part('template-parts/common/post-meta');
        the_title( '<h2 class="title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h2>' );
        get_template_part('template-parts/common/post-excerpt');
        ?>
    </div>
</article><!-- #post-<?php the_ID(); ?> -->
