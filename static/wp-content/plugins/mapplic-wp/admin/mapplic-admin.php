<?php

if (!class_exists('MapplicWPAdmin')) :

class MapplicWPAdmin {

	public $demos;

	public function __construct() {
		add_action('admin_enqueue_scripts', array($this, 'admin_enqueue'));
		add_action('edit_form_after_editor', array($this, 'map_builder'));
		add_action('do_meta_boxes', array($this, 'disable_post_editor_sidebar'));
		add_action('in_admin_footer', array($this, 'logo'));
		add_action('manage_mapplic_map_posts_custom_column' , array($this, 'column_shortcode'), 10, 2);

		add_filter('upload_mimes', array($this, 'mime_types'));
		add_filter('manage_edit-mapplic_map_columns', array($this, 'add_column_shortcode'));
		add_filter('wp_insert_post_data', array($this, 'save_map'), 99, 2);
	}

	public function map_builder($post) {
		if (get_post_type() != 'mapplic_map') return;
		
		echo '<input type="hidden" name="mapplic-mapdata" id="mapplic-mapdata">';

		if (get_current_screen()->action == 'add') {
			echo '<div id="mapplic-builder" data-new="true" data-save="wp" data-dir="' . MAPPLIC_PATH . '"></div>';
		}
		else {
			// render builder
			$data = user_can_richedit() ? htmlentities($post->post_content, ENT_QUOTES, 'UTF-8') : $post->post_content;
			echo '<div id="mapplic-builder" data-json="' . $data . '" data-save="wp"></div>';
		}
	}

	public function disable_post_editor_sidebar() {
		remove_meta_box('submitdiv', 'mapplic_map', 'side'); // Removes the Publish meta box
	}

	public function admin_enqueue() {
		$dir = plugin_dir_url(__FILE__);

		if (get_post_type() != 'mapplic_map') return;
		if (get_current_screen()->base == 'edit') return;

		// media
		wp_enqueue_media();

		// custom script
		wp_register_script('mapplic-admin-scripts', $dir . 'builder/admin-scripts.js', null, MapplicWP::$version, true);
		wp_enqueue_script('mapplic-admin-scripts');

		// admin
		wp_register_style('admin-style', $dir . 'admin.css', false, MapplicWP::$version);
		wp_enqueue_style('admin-style');

		// editor
		wp_register_script('mapplic-builder', $dir . 'builder/mapplic-admin.js', null, MapplicWP::$version, true);
		wp_enqueue_script('mapplic-builder');
	}

	public function example_data($data) {
		if ($data == 'mall') return '{"settings":{"title":"Shopping mall","hoverTooltip":true,"deeplinking":true,"sidebar":true,"rightSidebar":false,"toggleSidebar":true,"thumbnails":true,"sidebarClosed":true,"ordered":true,"orderBy":"title","portrait":480,"maxZoom":4,"mapWidth":1000,"mapHeight":600,"filters":true,"filtersOpened":false,"layer":"ground","location":null,"css":".mapplic-thumbnail > img {\r\n\tfilter: grayscale(100%);\r\n\topacity: 0.5;\r\n}\r\n\r\n.mapplic-dir-item:hover .mapplic-thumbnail img,\r\n.mapplic-dir-item.mapplic-active .mapplic-thumbnail img {\r\n\tfilter: grayscale(0%);\r\n\topacity: 1;\r\n}\r\n\r\n.mapplic-thumbnail > img {\r\n    object-fit: contain;\r\n}\r\n\r\n.mapplic-popup-image > img {\r\n    object-fit: contain;\r\n    padding: 8px;\r\n    box-sizing: border-box;\r\n}","primaryColor":"#1476FF","fullscreen":"bottom-left","layerSwitcher":"top-right","resetButton":"bottom-right","zoomButtons":"bottom-right","zoom":true,"geo":false,"groupBy":true,"filtersAlwaysVisible":false,"csvEnabled":false,"moreText":"Visit","mouseWheel":true},"layers":[{"id":"first","name":"First Floor","file":"' . MAPPLIC_PATH . '/assets/maps/mall-first.svg"},{"id":"ground","name":"Ground floor","file":"' . MAPPLIC_PATH . '/assets/maps/mall-ground.svg"},{"id":"underground","name":"Underground","file":"' . MAPPLIC_PATH . '/assets/maps/mall-underground.svg"}],"locations":[{"group":[],"style":"store","id":"def","link":"https://host.mapplic.com","color":"#333","hide":false,"sample":"true","phone":"(248) 762-0356","type":"hidden"},{"group":"Entertainment","id":"a203","title":"AMC Theatres","color":"#CE0E2D","zoom":"3.2445","layer":"first","desc":"<p>Movie theater chain showing the latest blockbusters.</p><p>Movie theater chain showing the latest blockbusters.</p><p>Movie theater chain showing the latest blockbusters.</p>","coord":[0.6848,0.6568],"about":"Movie Time","style":"anchor"},{"group":"Department Store","id":"a102","title":"JCPenney","color":"#D91920","zoom":"3.2468","layer":"ground","desc":"Affordable department store with clothing beauty home goods and more for the whole family.","coord":[0.6862,0.6429],"about":"Style for Less","style":"anchor"},{"group":"Others","id":"a001","title":"Petco","color":"#001952","zoom":"3.6576","layer":"underground","desc":"Offers pet supplies grooming services and live pet adoption.","coord":[0.5365,0.2781],"about":"Pet Care & Supplies","style":"anchor"},{"group":"Department Store,Electronics & Tech,Home & Living","id":"a101","title":"Macy\'s","color":"#E22130","zoom":"2.9254","layer":"ground","desc":"Large department store offering clothing beauty home goods and more at competitive prices.","coord":[0.2114,0.563],"about":"Shop & Save Big","style":"anchor"},{"group":"Fashion","id":"s107","title":"Massimo Dutii","color":"","zoom":"5.8252","layer":"ground","desc":"Iconic fashion and lifestyle brand offering clothing accessories and home goods.","coord":[0.6446,0.2888],"about":""},{"group":"Electronics & Tech","id":"s108","title":"Verizon","color":"#DC4F44","zoom":"9.6931","layer":"ground","desc":"Leading wireless and broadband telecommunications company.","coord":[0.6045,0.2984],"about":"Stay Connected"},{"group":"Electronics & Tech","id":"s109","title":"T-Mobile","color":"#E20975","zoom":"10.582","layer":"ground","desc":"Mobile phone provider offering affordable and flexible plans.","coord":[0.6147,0.3221],"about":"Connect More"},{"group":"Footwear,Sportswear","id":"s110","title":"Foot Locker","color":"#E52935","zoom":"7.7022","layer":"ground","desc":"Sports retailer offering shoes apparel and gear for a variety of sports.","coord":[0.7071,0.3002],"about":"Step Up Your Game"},{"group":["Fashion","Footwear","Sport"],"id":"s112","title":"Adidas","color":"","zoom":"8.7848","layer":"ground","desc":"<p>Iconic sportswear brand offering shoes apparel and accessories for athletes and fans.</p>","coord":[0.7605,0.397],"about":"Game On"},{"group":"Accessories,Fashion","id":"s114","title":"PacSun","color":"","zoom":"8.7336","layer":"ground","desc":"Casual clothing and accessory store with a focus on beach and surf styles.","coord":[0.759,0.4651],"about":"California Cool"},{"group":"Accessories,Fashion","id":"s115","title":"Urban Outfitters","color":"","zoom":"7.4534","layer":"ground","desc":"Trendy clothing and accessory store for men","coord":[0.7768,0.4941],"about":"Trendy Apparel"},{"group":"Food & Beverage","id":"s211","title":"Subway","color":"#009743","zoom":"7.3873","layer":"first","desc":"<p>A fast-food chain offering made-to-order subs salads and sides.</p>","coord":[0.6528,0.3093],"about":"Eat Fresh."},{"group":"Food & Beverage","id":"s212","title":"Cinnabon","color":"#051D49","zoom":"11.6257","layer":"first","desc":"A sweet treat destination offering fresh-baked cinnamon rolls coffee and more.","coord":[0.7712,0.3503],"about":"Warm and Fresh."},{"group":"Food & Beverage","id":"s213","title":"Dairy Queen","color":"#EE3E42","zoom":"9.2067","layer":"first","desc":"<p>Not Fast Food. A beloved fast-food chain offering classic treats like soft serve sundaes and Blizzards.</p>","coord":[0.7526,0.3615],"about":"Fan Food"},{"group":"Food & Beverage","id":"s214","title":"Godiva Chocolatier","color":"#581B00","zoom":"8.7822","layer":"first","desc":"Offers premium chocolate gifts and confections for every occasion.","coord":[0.7636,0.3991],"about":"Indulge in Luxury.","hours":"Mo-Fr 8:30-22:00; Sa 10:00-23:00; Su Closed"},{"group":"Food & Beverage","id":"s215","title":"Pizza Hut","color":"#EE1C23","zoom":"9.1061","layer":"first","desc":"<p>A popular pizza chain offering classic pies wings and more.</p>","coord":[0.767,0.4286],"about":"No One Out-Pizzas the Hut."},{"group":"Food & Beverage","id":"s216","title":"Taco Bell","color":"#682A8D","zoom":"8.7285","layer":"first","desc":"A fast-food chain offering Mexican-inspired fare including tacos burritos and nachos.","coord":[0.7597,0.4644],"about":"Live Más."},{"group":"Food & Beverage","id":"s217","title":"KFC","color":"#F40027","zoom":"7.4516","layer":"first","desc":"A fast-food chain known for its crispy fried chicken and sides.","coord":[0.7744,0.5014],"about":"Finger Lickin\' Good."},{"group":"Kids","id":"s221","title":"Justice","color":"#EC008C","zoom":"6.0205","layer":"first","desc":"<p>A popular clothing store for tween girls offering trendy and stylish clothing and accessories.</p>","coord":[0.4932,0.5334],"about":"Girls Rule."},{"group":"Electronics & Tech,Entertainment","id":"s222","title":"AT&T","color":"#009FDB","zoom":"5.3004","layer":"first","desc":"<p>A leading telecommunications company offering wireless internet and entertainment services.</p>","coord":[0.398,0.5407],"about":"Connect More."}],"styles":[{"class":"anchor","svg":true,"hover-color":"#666","base-color":"#888","active-color":"#555"},{"class":"store","stroke-width":1,"hover-color":"#fafafa","active-color":"#ffffff","svg":true,"active-stroke":"#6082cc","base-color":"#e8e8e8","hover-stroke":"#a0b5e2"}],"groups":[{"id":"fashion","name":"Fashion"},{"id":"department-store","name":"Department Store"},{"id":"food","name":"Food & Drinks"},{"id":"accessories","name":"Accessories"},{"id":"tech","name":"Electronics & Tech"},{"id":"footwear","name":"Footwear"},{"id":"entertainment","name":"Entertainment"},{"id":"home-living","name":"Home & Living"},{"id":"health","name":"Health & Beauty"},{"id":"kids","name":"Kids"},{"name":"Sport"},{"id":"others","name":"Others"}],"breakpoints":[{"name":"all-screens","below":8000,"portrait":false,"type":"list","column":1,"sidebar":280,"container":600},{"name":"tablet","below":860,"portrait":true,"column":3,"sidebar":200,"container":400,"type":"grid"},{"name":"mobile","below":480,"portrait":true,"container":460}],"filters":[{"id":"categories","type":"tags","name":"Categories","default":[]},{"id":"now-opened","name":"Now opened","type":"checkbox","default":false,"disable":false},{"id":"sale","name":"On SALE","type":"checkbox","default":false}]}';	
		if ($data == 'lots') return '{"settings":{"mapWidth":1300,"mapHeight":1100,"maxZoom":"3","csvEnabled":true,"csv":"' . MAPPLIC_PATH . '/assets/lots.csv","css": ".mapplic-marker {font-size:10px;box-shadow: 0px 2px 6px rgba(0,0,0,0.2);}.mapplic-marker.available {background-color: #15803D;}.mapplic-marker.reserved{background-color: #EAB308;}.mapplic-marker.sold{background-color: #D1D5DB;}.mapplic-marker.sold{background-color: #9CA3AF;}svg .mapplic-active {stroke-width: 1;}","hoverTooltip":true,"sidebar":true,"layerSwitcher":"bottom-left","resetButton":"bottom-right","zoomButtons":"bottom-right","height":"","filters":true,"thumbnails":true,"ordered":false,"title":"Residential lots","sidebarWidth":"30%","layer":"lot-map","portrait":"600","zoom":true,"toggleSidebar":false,"sidebarClosed":false,"primaryColor":"#15803D","portraitMinHeight":"400px","fullscreen":"top-left","moreText":"Reserve","csvEnabled":true,"rightSidebar":false,"groupBy":true,"mouseWheel":true},"groups":[{"name":"Phase 1","color":"#111827"},{"name":"Phase 2","color":"#111827"},{"name":"Phase 3","color":"#111827"}],"layers":[{"id":"lot-map","name":"Lot map","file":"' . MAPPLIC_PATH . '/assets/maps/lots.svg"}],"locations":[{"id":"def","title":"Default values","group":["Available"],"sample":"true","style":"available","about":"{{group}}","desc":"<p>Your dream home is within reach! Act now — reserve this available lot today or contact us directly for more information on making it yours.</p><p>Area: <strong>{{area}} sqm</strong></p><p>Price: <strong>${{price}} USD</strong></p>","action":"sidebar","image":"' . MAPPLIC_PATH . '/assets/lot-image.jpeg","link":"https://host.mapplic.com","phone":"(555) 123-4567"},{"id":"reserved","title":"Reserved","desc":"<p>This lot is currently off the market. Explore our available lots or contact us to learn more about our reservation opportunities.</p>","layer":"lot-map","sample":"true","style":"reserved","action":"tooltip","group":["Reserved"],"about":"{{group}} - Reserved","phone":"(555) 123-4567"},{"id":"sold","desc":"<p><strong>This lot is no longer available.</strong></p><p>Feel free to explore our other available lots or contact us for more details on our current offerings.</p>","title":"Sold","layer":"lot-map","sample":"true","style":"sold","group":["Sold"],"action":"tooltip","about":"{{group}} - Sold"}],"filters":[{"type":"tags","name":"Phases","id":"phases"}],"styles":[{"marker":false,"active-stroke":"#15803D","active-color":"#B4DEAD","class":"available","svg":true,"hover-color":"#ffffff"},{"active-stroke":"#C29F34","hover-color":"#ffffff","class":"reserved","svg":true,"active-color":"#EBE7BC","marker":false},{"class":"sold","marker":false,"active-stroke":"#6B7280","base-color":"#E5E7EB","svg":true}],"breakpoints":[{"name":"all-screens","below":8000,"sidebar":260},{"name":"tablet","below":860,"portrait":true,"column":3,"element":1200},{"name":"mobile","below":480,"portrait":true,"container":480,"element":1000}]}';
	}

	public function save_map($data, $postarr) {
		if (!isset($postarr['ID']) || !$postarr['ID'] || $data['post_type'] != 'mapplic_map') return $data;
		
		$mapdata = $_POST['mapplic-mapdata'];
		if ($mapdata == 'mall' || $mapdata == 'lots') $data['post_content'] = $this->example_data($mapdata);
		else if ($mapdata) $data['post_content'] = $mapdata;

		return $data;
	}

	public function logo() {
		if (get_post_type() == 'mapplic_map') {
			echo '<a class="mapplic-logo" href="//www.mapplic.com" target="_blank"><img height="24" src="' . plugins_url('../img/mapplic-logo.svg', __FILE__) . '"></a><br>';
		}
	}

	public function mime_types($mimes) {
		$mimes['svg'] = 'image/svg+xml';
		$mimes['csv'] = 'text/csv';
		return $mimes;
	}

	public function column_shortcode($column, $post_id) {
		if ($column == 'shortcode') echo '[mapplic-map id="' . $post_id . '"]';
	}

	public function add_column_shortcode($columns) {
		$new_columns = array();
		foreach ($columns as $key => $title) {
			if ($key == 'date') $new_columns['shortcode'] = __('Shortcode', 'mapplic');
			$new_columns[$key] = $title;
		}
		return $new_columns;
	}
}

endif;

?>