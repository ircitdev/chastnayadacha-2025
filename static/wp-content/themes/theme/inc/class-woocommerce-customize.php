<?php

/**
 * Package Aapside
 * Author Ir Tech
 * @since 1.0.1
 * */

if (!defined('ABSPATH')){
	exit(); //exit if access directly
}
if (!class_exists('Aapside_Woocomerce_Customize')){
	class Aapside_Woocomerce_Customize{
		//$instance variable
		private static $instance;
		
		public function __construct() {
		    remove_action('woocommerce_archive_description','woocommerce_taxonomy_archive_description',10);
		    remove_action('woocommerce_archive_description','woocommerce_product_archive_description',10);
            remove_action('woocommerce_single_product_summary','woocommerce_template_single_title',5);
			add_filter('woocommerce_post_class',array($this,'wc_product_post_class'),20, 3);
			add_filter( 'woocommerce_show_page_title', '__return_false' );
			add_filter( 'woocommerce_enqueue_styles', '__return_false' );
			add_filter( 'woocommerce_add_to_cart_fragments', array($this,'woocommerce_header_add_to_cart_fragment') );
			add_action('woocommerce_before_shop_loop',array($this,'woocommerce_before_shop_header_wrap_start'),12);
			add_action('woocommerce_before_shop_loop',array($this,'woocommerce_before_shop_header_wrap_end'),32);
            add_action('woocommerce_before_shop_loop_item_title',array($this,'woocommerce_before_shop_loop_item_thumbnail_wrap_start'),9);
            add_action('woocommerce_before_shop_loop_item_title',array($this,'woocommerce_before_shop_loop_item_thumbnail_wrap_end'),12);
            add_action('woocommerce_shop_loop_item_title',array($this,'woocommerce_shop_loop_item_content_wrap_start'),9);
            add_action('woocommerce_after_shop_loop_item',array($this,'woocommerce_shop_loop_item_content_wrap_end'),12);
            add_action('woocommerce_before_single_product_summary',array($this,'woocommerce_before_single_product_summary_wrapper_start'),9);
            add_action('woocommerce_before_single_product_summary',array($this,'woocommerce_before_single_product_thumbnail_wrapper_end'),22);
            add_action('woocommerce_after_single_product_summary',array($this,'woocommerce_before_single_product_summary_wrapper_end'),9);
            add_action('woocommerce_before_account_navigation',array($this,'woocommerce_before_account_navigation_wrapper_start'),10);
            add_action('woocommerce_account_content',array($this,'woocommerce_before_account_navigation_wrapper_end'),30);
		}
		/**
		 * get Instance
		 * @since 1.0.2
		 * */
		public static function getInstance(){
			if (null == self::$instance){
				self::$instance = new self();
			}
			return self::$instance;
		}

		/**
		 * Show cart contents / total Ajax
         * @since 1.0.2
		 */
		function woocommerce_header_add_to_cart_fragment( $fragments ) {
			global $woocommerce;
			ob_start();
			?>
			<a class="aapside-header-cart" href="<?php echo wc_get_cart_url(); ?>"
			   title="<?php esc_attr_e( 'View your shopping cart','aapside' ); ?>">
				<i class="fa fa-shopping-basket" aria-hidden="true"></i>
				<span class="cart-badge"><?php echo sprintf (  '%d', WC()->cart->get_cart_contents_count() ); ?></span>
			</a>
			<?php
			$fragments['a.aapside-header-cart'] = ob_get_clean();
			return $fragments;
		}

		/**
         * shop header wrap start
		 * @since 1.0.2
		 * */
        public function woocommerce_before_shop_header_wrap_start(){
            ?>
                <div class="woocommerce-header-area-wrap">
            <?php
        }
        /**
         * shop header wrap end
		 * @since 1.0.2
		 * */
        public function woocommerce_before_shop_header_wrap_end(){
            ?>
                </div>
            <?php
        }
		/**
		 * product class for archive and single page
		 * @since 1.0.2
		 * */
        public function wc_product_post_class($class){
        	$class[] = is_product() ? 'aapside-product-single-page-item' : 'aapside-single-product-item';
            return $class;
        }
        /**
         * add wrapper for thumbnail and sale attribute start
         * @sinsce 1.0.2
         * */
        public function woocommerce_before_shop_loop_item_thumbnail_wrap_start(){
            ?>
            <div class="woocommerce-thumbnail-wrap">
            <?php
        }

        /**
         * add wrapper for thumbnail and sale attribute end
         * @sinsce 1.0.2
         * */
        public function woocommerce_before_shop_loop_item_thumbnail_wrap_end(){
            ?>
            </div>
            <?php
        }

        /**
         * add wrapper for title, price and add to cart item
         * @sinsce 1.0.2
         * */
        public function woocommerce_shop_loop_item_content_wrap_start(){
            ?>
            <div class="product-contnent-wrap">
            <?php
        }

        /**
         * add wrapper for title, price and add to cart item
         * @sinsce 1.0.2
         * */
        public function woocommerce_shop_loop_item_content_wrap_end(){
            ?>
            </div>
            <?php
        }
        /**
         * add wrapper for title, price and add to cart item and product summery for single product page
         * @sinsce 1.0.2
         * */
        public function woocommerce_before_single_product_summary_wrapper_start(){
            ?>
            <div class="woocommmerce-product-single-page-top-content-wrap">
                <div class="woocommerce-thumbnail-wrapper">
            <?php
        }

		/**
		 * add wrapper for title, price and add to cart item and product summery for single product page
		 * @sinsce 1.0.2
		 * */
        public function woocommerce_before_single_product_summary_wrapper_end(){
            ?>
            </div>
            <?php
        }
        /**
		 * add wrapper for title, price and add to cart item . single product page thumbnail wrap
		 * @sinsce 1.0.2
		 * */
        public function woocommerce_before_single_product_thumbnail_wrapper_end(){
            ?>
            </div>
            <?php
        }
        /**
		 * add wrapper for my account navigation and content
		 * @sinsce 1.0.2
		 * */
        public function woocommerce_before_account_navigation_wrapper_start(){
            ?>
            <div class="woocommerce-my-account-page-wrapper">
            <?php
        }
        /**
		 * add wrapper for my account navigation and content
		 * @sinsce 1.0.2
		 * */
        public function woocommerce_before_account_navigation_wrapper_end(){
            ?>
            </div>
            <?php
        }
	}//end class
	if ( class_exists('Aapside_Woocomerce_Customize')){
		Aapside_Woocomerce_Customize::getInstance();
	}
}