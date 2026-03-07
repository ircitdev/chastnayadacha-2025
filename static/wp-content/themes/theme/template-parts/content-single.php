<?php
/**
 * Template part for displaying single post
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package appside
 */
$appside = Appside();
$post_meta = get_post_meta(get_the_ID(),'appside_post_gallery_options',true);
$post_meta_gallery = isset($post_meta['gallery_images']) && !empty($post_meta['gallery_images']) ? $post_meta['gallery_images'] : '';
$post_single_meta = Appside_Group_Fields_Value::post_meta('blog_single_post');
?>

<article id="post-<?php the_ID(); ?>" <?php post_class('single-post-details-item'); ?>>
    <?php
    if (has_post_thumbnail() || !empty($post_meta_gallery) ):
	    $get_post_format = get_post_format();
	    if ('video' == $get_post_format || 'gallery' == $get_post_format){
		    get_template_part('template-parts/common/thumbnail',$get_post_format);
	    }else{
		    get_template_part('template-parts/common/thumbnail');
	    }
    endif;
	    ?>
    <div class="entry-content">
        <?php if ('post' == get_post_type()):?>
        <ul class="post-meta">
	        <?php if($post_single_meta['posted_by']):?>
            <li><?php $appside->posted_by();?></li>
	        <?php endif;?>
	        <?php if($post_single_meta['posted_category']):?>
            <li class="cat"><i class="fa fa-tags"></i><?php the_category(' ')?></li>
            <?php endif;?>
        </ul>
      <?php
      endif;
        the_content();
        $appside->link_pages();
        ?>
    </div>
    <?php if ( 'post' == get_post_type() && ((has_tag() && $post_single_meta['posted_tag']) || (shortcode_exists('appside_post_share') && $post_single_meta['posted_share']) )):?>
    <div class="entry-footer">
        <?php if(has_tag() && $post_single_meta['posted_tag']): ?>
        <div class="left">
            <?php $appside->posted_tag();?>
        </div>
        <?php endif; ?>
        <div class="right">
            <?php
            if (shortcode_exists('appside_post_share') && $post_single_meta['posted_share']){
	            echo do_shortcode('[appside_post_share]');
            }
            ?>
        </div>
    </div>
    <?php endif;?>
</article><!-- #post-<?php the_ID(); ?> -->
