<?php
/**
 * @package Appside
 * @author Ir Tech
 */
if (!defined("ABSPATH")) {
	exit(); //exit if access directly
}

if (!class_exists('Appside_Customize')) {

	class Appside_Customize
	{
		/*
		* $instance
		* @since 1.0.0
		* */
		protected static $instance;

		public function __construct()
		{
			//excerpt more
			add_action('excerpt_more',array($this,'excerpt_more'));
			//back top
			add_action('appside_after_body',array($this,'back_top'));
			//preloader
			add_action('appside_after_body',array($this,'preloader'));
			//breadcrumb
			add_action('appside_before_page_content',array($this,'breadcrumb'));
			//order comment form
            add_filter('comment_form_fields',array($this,'appside_comment_fileds_reorder'));
		}

		/**
		 * getInstance()
		 * */
		public static function getInstance()
		{
			if (null == self::$instance) {
				self::$instance = new self();
			}
			return self::$instance;
		}

		/**
		 * Excerpt More
		 * @since 1.0.0
		 * */
		public function excerpt_more($more){
			$more = ' ';
			return $more;
		}
		/**
		 * Breadcrumb
		 * @since 1.0.0
		 * */
		public function breadcrumb(){
			$page_id = Appside()->page_id();
			$check_page = (!is_home() && !is_front_page() && is_singular()) || is_search() || is_author() || is_404() || is_archive() ? true : false ;
			$check_home_page = Appside('Frontend')->is_home_page();
			$page_header_meta = Appside_Group_Fields_Value::page_container('appside','header_options');
			$page_breadcrumb_enable = isset($page_header_meta['page_breadcrumb_enable']) && $page_header_meta['page_breadcrumb_enable'] && !is_search() ? $page_header_meta['page_breadcrumb_enable'] : false;
			$breadcrumb_enable = false;
			$header_variant = !empty($page_container_meta['navbar_type']) ? $page_container_meta['navbar_type'] : 'default';
			$header_variant = ($page_header_meta['navbar_build_type'] == 'header_builder' && !empty($page_header_meta['header_builder_style']) ) ? 'builder' : $header_variant;
			
			if ($header_variant == 'default' && cs_get_option('global_navbar_build_type') == 'default'){
				$header_variant = cs_get_option('global_header_style');
			}elseif($header_variant == 'default' && cs_get_option('global_navbar_build_type') == 'header_builder'){
				$header_variant = 'builder';
			}
			
			if ( !$check_home_page && !$check_page){
				$breadcrumb_enable = true;
			}elseif (!$page_breadcrumb_enable && $check_page){
				$breadcrumb_enable = true;
			}
			
			$breadcrumb_enable =  !cs_get_switcher_option('breadcrumb_enable') ? false : $breadcrumb_enable;
			
			if ( !$breadcrumb_enable ){
				return;
			}
			?>
			<div class="breadcrumb-area <?php echo esc_attr($header_variant);?>">
				<div class="container">
					<div class="row">
						<div class="col-lg-12">
							<div class="breadcrumb-inner">
								<?php
								if ( is_archive() ){
									the_archive_title( '<h2 class="page-title">', '</h1>' );
								}elseif ( is_404() ){
									printf('<h2 class="page-title">%1$s</h2>',esc_html__('Error 404','aapside'));
								}elseif ( is_search() ){
									printf('<h2 class="page-title">%1$s %2$s</h2>',esc_html__('Search Results for:','aapside'),get_search_query());
								}elseif ( is_singular('post') ){
									printf('<h2 class="page-title">%1$s </h2>',get_the_title());
								}elseif ( is_singular('page') ){
									if ( $page_header_meta['page_title']) {
										printf('<h2 class="page-title">%1$s </h2>',get_the_title());
									}
								}else{
									printf('<h2 class="page-title">%1$s </h2>',get_the_title($page_id));
								}
								if ( $page_header_meta['page_breadcrumb'] ){
									Appside_Breadcrumb();
								}
								?>
							</div>
						</div>
					</div>
				</div>
			</div>
			<?php
		}

		/**
		 * back top
		 * @since 1.0.0
		 * */
		public function back_top(){
			$back_top_enable = cs_get_switcher_option('back_top_enable');
			$back_top_icon = cs_get_option('back_top_icon') ? cs_get_option('back_top_icon') : 'fa fa-angle-up';
			if (!$back_top_enable){
				return;
			}
			?>
			<div class="back-to-top">
				<span class="back-top"><i class="<?php echo esc_attr($back_top_icon);?>"></i></span>
			</div>
			<?php
		}
		/**
		 * Preloader
		 * @since 1.0.0
		 * */
		public function preloader(){
			$preloader_enable = cs_get_switcher_option('preloader_enable');
			if (!$preloader_enable){
				return;
			}
			?>
			<div class="preloader-wrapper" id="preloader">
                <div class="preloader">
                    <div class="sk-circle">
                        <div class="sk-circle1 sk-child"></div>
                        <div class="sk-circle2 sk-child"></div>
                        <div class="sk-circle3 sk-child"></div>
                        <div class="sk-circle4 sk-child"></div>
                        <div class="sk-circle5 sk-child"></div>
                        <div class="sk-circle6 sk-child"></div>
                        <div class="sk-circle7 sk-child"></div>
                        <div class="sk-circle8 sk-child"></div>
                        <div class="sk-circle9 sk-child"></div>
                        <div class="sk-circle10 sk-child"></div>
                        <div class="sk-circle11 sk-child"></div>
                        <div class="sk-circle12 sk-child"></div>
                    </div>
                </div>
			</div>
			<?php
		}

		/**
		 * @since 1.0.0
         * reorder comments form
		 * */
		public function appside_comment_fileds_reorder($fileds){

		    $comment_filed = $fileds['comment'];

		    if (isset($fileds['cookies'])){
                $comment_cookies = $fileds['cookies'];
                unset($fileds['cookies']);
                $fileds['cookies'] = $comment_cookies;
            }

		    unset($fileds['comment']);
		    $fileds['comment'] = $comment_filed;

		    return $fileds;
        }


	}//end class
	if (class_exists('Appside_Customize')){
		Appside_Customize::getInstance();
	}
}
