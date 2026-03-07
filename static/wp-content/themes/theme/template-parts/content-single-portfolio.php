<?php
/**
 * Template part for displaying single post
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package appside
 */
$appside = Appside();

?>

<article id="post-<?php the_ID(); ?>" <?php post_class( 'single-portfolio-details-item' ); ?>>
	<?php if ( has_post_thumbnail() ): ?>
        <div class="thumb">
			<?php
                the_post_thumbnail( 'appside_portfolio_single', array(
                    'alt' => the_title_attribute( array(
                        'echo' => false,
                    ) ),
                ) );
			?>
        </div>
	<?php endif; ?>
    <div class="entry-content">
		<?php
		the_content();
		$appside->link_pages();
		?>
    </div>
</article><!-- #post-<?php the_ID(); ?> -->
