<?php
$appside = Appside();
$post_meta = get_post_meta(get_the_ID(),'appside_post_video_options',true);
$video_url = isset($post_meta['video_url']) && $post_meta['video_url'] ? $post_meta['video_url'] : '';
$blog_single_options = Appside_Group_Fields_Value::post_meta('blog_single_post');
if(!empty($video_url)):
	?>
	<div class="thumb">
		<div class="time">
			<span class="date"><?php echo esc_html(get_the_date('d'))?></span>
			<span class="month"><?php echo esc_html(get_the_date('M'))?></span>
		</div>
		<?php $appside->post_thumbnail(); ?>
		<?php if(!empty($video_url)): ?>
			<div class="hover">
				<a href="<?php echo esc_url($video_url);?>" class="video-play-btn mfp-iframe"><i class="fa fa-play"></i></a>
			</div>
		<?php endif; ?>
	</div>
<?php endif; ?>
