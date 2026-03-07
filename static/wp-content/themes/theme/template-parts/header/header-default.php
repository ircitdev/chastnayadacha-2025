<?php
/**
 * header default style
 * @since 2.0.0
 *
 * */
$navbar_button_url = !empty(cs_get_option('header_one_navbar_btn_url')) ? cs_get_option('header_one_navbar_btn_url') : esc_url('#');
$navbar_button_text = !empty(cs_get_option('header_one_navbar_btn_text')) ? cs_get_option('header_one_navbar_btn_text') : esc_html__('Download','aapside');
$navbar_button_status = ( '1' == cs_get_option('header_one_navbar_btn') ) ? true : false;

?>
<div class="header-style-default">
	<nav class="navbar navbar-area navbar-expand-lg navbar-default">
	<div class="container nav-container">
		<div class="responsive-mobile-menu">
			<div class="logo-wrapper">
				<?php
				$header_one_logo = cs_get_option('header_one_logo');
				if (has_custom_logo() && empty($header_two_logo['id'])){
					the_custom_logo();
				}elseif (!empty($header_one_logo['id'])){
					printf('<a class="site-logo" href="%1$s"><img src="%2$s" alt="%3$s"/></a>',get_home_url(),$header_one_logo['url'],$header_one_logo['alt']);
				}
				else{
					printf('<a class="site-title" href="%1$s">%2$s</a>',get_home_url(),get_bloginfo('title'));
				}
				?>
			</div>
			<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#appside_main_menu"
			        aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>
		</div>
		<?php
        $menu_args = [
	        'theme_location'  => 'main-menu',
	        'container_class' => 'collapse navbar-collapse',
	        'container_id'    => 'appside_main_menu',
	        'menu_class'      => 'navbar-nav',
        ];
        if (defined('APPSIDE_MASTER_SELF_PATH')){
	        $menu_args['walker'] = new Appside_Megamenu_Walker();
        }
        wp_nav_menu($menu_args);

		?>
		<?php
		if($navbar_button_status):
			?>
			<div class="nav-right-content">
				<ul>
					<li class="button-wrapper">
						<a href="<?php echo esc_url($navbar_button_url)?>" class="boxed-btn btn-rounded"><?php echo esc_html($navbar_button_text);?></a>
					</li>
				</ul>
			</div>
		<?php endif;?>
	</div>
</nav>
</div>