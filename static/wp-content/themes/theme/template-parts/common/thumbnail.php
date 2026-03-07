<?php if ( has_post_thumbnail() ):?>
<div class="thumb">
	<?php Appside()->post_thumbnail(); ?>
        <div class="time">
            <span class="date"><?php echo esc_html(get_the_date('d'))?></span>
            <span class="month"><?php echo esc_html(get_the_date('M'))?></span>
        </div>

</div>
<?php endif;?>