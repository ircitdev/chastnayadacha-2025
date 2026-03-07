<?php
$_SERVER['HTTP_HOST'] = 'chastnayadacha.ru';
$_SERVER['REQUEST_URI'] = '/dacha-map/';
define('ABSPATH', '/var/www/u2383407/data/www/chastnayadacha.ru/');
require(ABSPATH . 'wp-load.php');
echo do_shortcode('[mapplic id="1183" h="auto"]');
