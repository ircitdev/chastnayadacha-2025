<?php
$appside = Appside();
$post_meta = Appside_Group_Fields_Value::post_meta('blog_post');
?>
<ul class="post-meta">
    <?php if ($post_meta['posted_by']):?>
	<li><?php $appside->posted_by();?></li>
    <?php endif;?>
    <?php if ($post_meta['posted_on'] && get_post_type() == 'post'):?>
	<li class="postec_cats"><i class="fa fa-tags"></i> <?php the_category(', ')?></li>
    <?php endif;?>
</ul>