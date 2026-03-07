<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit(); //exit if access directly
}
$appside = Appside();
global $theme_customize_css;
$theme_customize_css = '';

ob_start();

/*---------------------------------
	Preloader
---------------------------------*/
$preloader_bg_color = cs_get_option('preloader_bg_color');
echo <<<CSS
	.preloader-wrapper{
		background-color: {$preloader_bg_color};
	}
CSS;

/*---------------------------------
	Breadcrumb
---------------------------------*/
$breadcrumb_bg = cs_get_option('breadcrumb_bg');
$breadcrumb_bg_image = isset($breadcrumb_bg['background-image']['url']) && !empty($breadcrumb_bg['background-image']['url']) ? $breadcrumb_bg['background-image']['url'] : '';
$breadcrumb_bg_image_size = isset($breadcrumb_bg['background-size']) && !empty($breadcrumb_bg['background-size']) ? $breadcrumb_bg['background-size'] : 'cover';
$breadcrumb_bg_image_position =  isset($breadcrumb_bg['background-position']) && !empty($breadcrumb_bg['background-position']) ? $breadcrumb_bg['background-position'] : 'center center';
$breadcrumb_bg_image_repeat =  isset($breadcrumb_bg['background-repeat']) && !empty($breadcrumb_bg['background-repeat']) ? $breadcrumb_bg['background-repeat'] : 'no-repeat';
$breadcrumb_bg_image_attachment =  isset($breadcrumb_bg['background-attachment']) && !empty($breadcrumb_bg['background-attachment']) ? $breadcrumb_bg['background-attachment'] : 'scroll';
echo <<<CSS
	.breadcrumb-area{
		background-image:url({$breadcrumb_bg_image}) ;
		background-position :{$breadcrumb_bg_image_position};
		background-repeat:{$breadcrumb_bg_image_repeat};
		background-size:{$breadcrumb_bg_image_size};
		background-attachment:{$breadcrumb_bg_image_attachment};
	}
CSS;

/*---------------------------------
	Footer Options
---------------------------------*/
$footer_spacing = cs_get_switcher_option('footer_spacing');
$footer_top_spacing = cs_get_option('footer_top_spacing');
$footer_bottom_spacing = cs_get_option('footer_bottom_spacing');
$footer_padding_top = !empty($footer_top_spacing) ? 'padding-top:'.$appside->sanitize_px($footer_top_spacing).';': '';
$footer_padding_bottom = !empty($footer_bottom_spacing) ? 'padding-bottom:'.$appside->sanitize_px($footer_bottom_spacing).';': '';

if ($footer_spacing){
	echo <<<CSS
	.footer-top{
		{$footer_padding_top}
		{$footer_padding_bottom}
	}
CSS;

}
/*---------------------------------
	Copyright Area Options
---------------------------------*/
$copyright_area_spacing = cs_get_switcher_option('copyright_area_spacing');
$copyright_area_top_spacing = cs_get_option('copyright_area_top_spacing');
$copyright_area_bottom_spacing = cs_get_option('copyright_area_bottom_spacing');
$copyright_padding_top = !empty($copyright_area_top_spacing) ? 'padding-top:'.$appside->sanitize_px($copyright_area_top_spacing).';': '';
$copyright_padding_bottom = !empty($copyright_area_bottom_spacing) ? 'padding-bottom:'.$appside->sanitize_px($copyright_area_bottom_spacing).';': '';

if ($copyright_area_spacing){
	echo <<<CSS
	.copyright-inner{
		{$copyright_padding_top}
		{$copyright_padding_bottom}
	}
CSS;

}


/*---------------------------------
	Header One
---------------------------------*/
$header_01_nav_bar_bg_color  = cs_get_customize_option( 'header_01_nav_bar_bg_color' );
$header_01_nav_bar_color     = cs_get_customize_option( 'header_01_nav_bar_color' );
$header_01_dropdown_bg_color = cs_get_customize_option( 'header_01_dropdown_bg_color' );
$header_01_dropdown_color    = cs_get_customize_option( 'header_01_dropdown_color' );

echo <<<CSS
.header-style-default .navbar-area.navbar-default .nav-container .navbar-collapse .navbar-nav li a, 
.header-style-default .navbar-area.navbar-default .nav-container .navbar-collapse .navbar-nav li.menu-item-has-children:before{
	color: {$header_01_nav_bar_color};
}
.header-style-default .navbar-area.navbar-default {
    background-color: {$header_01_nav_bar_bg_color};
}
.header-style-default .navbar-area.navbar-default .nav-container .navbar-collapse .navbar-nav li.menu-item-has-children .sub-menu li a {
    background-color: {$header_01_dropdown_bg_color};
    color: {$header_01_dropdown_color};
}
.header-style-default .navbar-area.navbar-default .nav-container .navbar-collapse .navbar-nav li.menu-item-has-children .sub-menu li a:hover {
    background-color: var(--main-color-one);
    color: #fff;
}
.header-style-default .navbar-area .nav-container .navbar-collapse .navbar-nav li a:hover {
    color: var(--main-color-one);
}
CSS;

/*---------------------------------
	Header Two
---------------------------------*/
$header_02_nav_bar_bg_color  = cs_get_customize_option( 'header_02_nav_bar_bg_color' );
$header_02_nav_bar_color     = cs_get_customize_option( 'header_02_nav_bar_color' );
$header_02_dropdown_bg_color = cs_get_customize_option( 'header_02_dropdown_bg_color' );
$header_02_dropdown_color    = cs_get_customize_option( 'header_02_dropdown_color' );

echo <<<CSS
.header-style-01 .navbar-area.navbar-style-transparent .nav-container .navbar-collapse .navbar-nav li a, 
.header-style-01 .navbar-area.navbar-style-transparent .nav-container .navbar-collapse .navbar-nav li.menu-item-has-children:before{
	color: {$header_02_nav_bar_color};
}
.header-style-01 .navbar-area.navbar-style-transparent {
    background-color: {$header_02_nav_bar_bg_color};
}
.header-style-01 .navbar-area.navbar-style-transparent .nav-container .navbar-collapse .navbar-nav li.menu-item-has-children .sub-menu li a {
    background-color: {$header_02_dropdown_bg_color};
    color: {$header_02_dropdown_color};
}
.header-style-01 .navbar-area.navbar-style-transparent .nav-container .navbar-collapse .navbar-nav li.menu-item-has-children .sub-menu li a:hover {
    background-color: var(--main-color-one);
    color: #fff;
}

CSS;
/*---------------------------------
	Header Three
---------------------------------*/
$header_03_nav_bar_bg_color  = cs_get_customize_option( 'header_03_nav_bar_bg_color' );
$header_03_nav_bar_color     = cs_get_customize_option( 'header_03_nav_bar_color' );
$header_03_dropdown_bg_color = cs_get_customize_option( 'header_03_dropdown_bg_color' );
$header_03_dropdown_color    = cs_get_customize_option( 'header_03_dropdown_color' );

//btn one options
$header_03_btn_one_border_color = cs_get_customize_option('header_03_btn_one_border_color');
$header_03_btn_one_color = cs_get_customize_option('header_03_btn_one_color');
$header_03_btn_one_hover_border_color = cs_get_customize_option('header_03_btn_one_hover_border_color');
$header_03_btn_one_hover_color = cs_get_customize_option('header_03_btn_one_hover_color');
$header_03_btn_one_hover_bg_color = cs_get_customize_option('header_03_btn_one_hover_bg_color');

//button two options
$header_03_btn_two_background_color = cs_get_customize_option('header_03_btn_two_background_color');
$header_03_btn_two_color = cs_get_customize_option('header_03_btn_two_color');

echo <<<CSS
.header-style-02 .navbar-area.navbar-style-transparent .nav-container .navbar-collapse .navbar-nav li a, 
.header-style-02 .navbar-area.navbar-style-transparent .nav-container .navbar-collapse .navbar-nav li.menu-item-has-children:before{
	color: {$header_03_nav_bar_color};
}
.header-style-02 .navbar-area.navbar-style-transparent {
    background-color: {$header_03_nav_bar_bg_color};
}
.header-style-02 .navbar-area.navbar-style-transparent .nav-container .navbar-collapse .navbar-nav li.menu-item-has-children .sub-menu li a {
    background-color: {$header_03_dropdown_bg_color};
    color: {$header_03_dropdown_color};
}
.header-style-02 .navbar-area.navbar-style-transparent .nav-container .navbar-collapse .navbar-nav li.menu-item-has-children .sub-menu li a:hover {
    background-color: var(--main-color-one);
    color: #fff;
}
.header-style-02 .navbar-area.navbar-style-transparent .nav-container .nav-right-content ul li .boxed-btn:first-child{
    border-color:{$header_03_btn_one_border_color};
    color:{$header_03_btn_one_color};
}
.header-style-02 .navbar-area.navbar-style-transparent .nav-container .nav-right-content ul li .boxed-btn:first-child:hover {
    background-color: {$header_03_btn_one_hover_bg_color};
    border-color: {$header_03_btn_one_hover_border_color};
    color: {$header_03_btn_one_hover_color};
}
.header-style-02 .navbar-area.navbar-style-transparent .nav-container .nav-right-content ul li .boxed-btn {
    background-color: {$header_03_btn_two_background_color};
    color: {$header_03_btn_two_color};
}
CSS;
/*---------------------------------
	Header Four
---------------------------------*/
$header_04_nav_bar_bg_color  = cs_get_customize_option( 'header_04_nav_bar_bg_color' );
$header_04_nav_bar_color     = cs_get_customize_option( 'header_04_nav_bar_color' );
$header_04_dropdown_bg_color = cs_get_customize_option( 'header_04_dropdown_bg_color' );
$header_04_dropdown_color    = cs_get_customize_option( 'header_04_dropdown_color' );

//button two options
$header_04_btn_background_color = cs_get_customize_option('header_04_btn_background_color');
$header_04_btn_color = cs_get_customize_option('header_04_btn_color');

echo <<<CSS
.header-style-03 .navbar-area .nav-container .navbar-collapse .navbar-nav li a, 
.header-style-03 .navbar-area .nav-container .navbar-collapse .navbar-nav li.menu-item-has-children:before{
	color: {$header_04_nav_bar_color};
}
.header-style-03 .navbar-area {
    background-color: {$header_04_nav_bar_bg_color};
}
.header-style-03 .navbar-area .nav-container .navbar-collapse .navbar-nav li.menu-item-has-children .sub-menu li a {
    background-color: {$header_04_dropdown_bg_color};
    color: {$header_04_dropdown_color};
}
.header-style-03 .navbar-area .nav-container .navbar-collapse .navbar-nav li.menu-item-has-children .sub-menu li a:hover {
    background-color: var(--main-color-one);
    color: #fff;
}

.header-style-03 .navbar-area .nav-container .nav-right-content ul li .boxed-btn {
    background-color: {$header_04_btn_background_color};
    color: {$header_04_btn_color};
    border-color: {$header_04_btn_background_color};
}
CSS;
/*---------------------------------
	Sidebar
---------------------------------*/
$widget_border_color    = cs_get_customize_option( 'sidebar_widget_border_color' );
$widget_title_color = cs_get_customize_option( 'sidebar_widget_title_color' );
$widget_text_color  = cs_get_customize_option( 'sidebar_widget_text_color' );

echo <<<CSS
    .widget{
         border-color: {$widget_border_color} !important;
    }
    .widget .widget-title,
    .widget_rss ul li a.rsswidget,
    .widget .recent_post_item li.single-recent-post-item .content .title>a{
        color:{$widget_title_color}
    }
    .widget ul li a,
    .widget ul li ,
    .widget p,
    .widget .table td,
     .widget .table th,
    .widget caption,
    .widget_tag_cloud .tagcloud a,
    .calendar_wrap table td,.calendar_wrap table tr {
        color:{$widget_text_color}
    }
CSS;
/*-----------------------------------
	Footer Options
-----------------------------------*/
$footer_area_bg_color            = cs_get_customize_option( 'footer_area_bg_color' );
$footer_widget_title_color       = cs_get_customize_option( 'footer_widget_title_color' );
$footer_widget_text_color        = cs_get_customize_option( 'footer_widget_text_color' );
$copyright_area_border_top_color = cs_get_customize_option( 'copyright_area_border_top_color' );
$copyright_area_text_color       = cs_get_customize_option( 'copyright_area_text_color' );

echo <<<CSS
	.footer-area{
	    background-color: {$footer_area_bg_color};
	}
CSS;

echo <<<CSS

	.widget.footer-widget p, 
	.footer-widget.widget_tag_cloud .tagcloud a, 
	.widget.footer-widget.widget_calendar caption, 
	.widget.footer-widget.widget_calendar th, 
	.widget.footer-widget.widget_calendar td,
	 .footer-widget.widget p,
	 .footer-widget.widget a,
	 .footer-widget.widget,
	 .widget.footer-widget ul li a, .widget.footer-widget ul li{
	    color: {$footer_widget_text_color};
	}
	.widget.footer-widget .widget-title ,
	.widget.footer-widget .widget-title a,
	.footer-widget.widget_rss ul li a.rsswidget,
	.footer-widget.widget .recent_post_item li.single-recent-post-item .content .title>a{
	    color: {$footer_widget_title_color};
	}
	.footer-widget.widget_appside_about_us .social-icon li a {
	    color: var(--main-color-one) !important;
	}
    
CSS;
/* Copyright Area
 * */
echo <<<CSS
.copyright-inner {
	    border-top: 1px solid {$copyright_area_border_top_color};
	    color: {$copyright_area_text_color};
	}
CSS;

/*---------------------------------
	404 Error Page Options
---------------------------------*/
$error_page_bg_color    = cs_get_option( '404_bg_color' ) ? cs_get_option( '404_bg_color' ) : '#fff';
$err_404_spacing_top    = cs_get_option( '404_spacing_top' ) ? cs_get_option( '404_spacing_top' ) : 120;
$err_404_spacing_bottom = cs_get_option( '404_spacing_bottom' ) ? cs_get_option( '404_spacing_bottom' ) : 120;
echo <<<CSS
    .error_page_content_area {
        background-color: {$error_page_bg_color};
        padding-top: {$appside->sanitize_px( $err_404_spacing_top )};
        padding-bottom: {$appside->sanitize_px( $err_404_spacing_bottom )};
    }
CSS;
/*---------------------------------
	Blog Page Options
---------------------------------*/
$blog_page_bg_color       = cs_get_option( 'blog_bg_color' ) ? cs_get_option( 'blog_bg_color' ) : '#fff';
$blog_page_spacing_top    = cs_get_option( 'blog_spacing_top' ) ? cs_get_option( 'blog_spacing_top' ) : 120;
$blog_page_spacing_bottom = cs_get_option( 'blog_spacing_bottom' ) ? cs_get_option( 'blog_spacing_bottom' ) : 120;
echo <<<CSS
    .blog-page-content-area {
        background-color: {$blog_page_bg_color};
        padding-top: {$appside->sanitize_px( $blog_page_spacing_top )};
        padding-bottom: {$appside->sanitize_px( $blog_page_spacing_bottom )};
    }
CSS;
/*---------------------------------
	Blog Single Page Options
---------------------------------*/
$blog_single_page_bg_color       = cs_get_option( 'blog_single_bg_color' ) ? cs_get_option( 'blog_single_bg_color' ) : '#fff';
$blog_single_page_spacing_top    = cs_get_option( 'blog_single_spacing_top' ) ? cs_get_option( 'blog_single_spacing_top' ) : 120;
$blog_single_page_spacing_bottom = cs_get_option( 'blog_single_spacing_bottom' ) ? cs_get_option( 'blog_single_spacing_bottom' ) : 120;
echo <<<CSS
    .blog-single-page-content-area {
        background-color: {$blog_single_page_bg_color};
        padding-top: {$appside->sanitize_px( $blog_single_page_spacing_top )};
        padding-bottom: {$appside->sanitize_px( $blog_single_page_spacing_bottom )};
    }
CSS;
/*---------------------------------
	Archive Page Options
---------------------------------*/
$archive_page_bg_color       = cs_get_option( 'archive_bg_color' ) ? cs_get_option( 'archive_bg_color' ) : '#fff';
$archive_page_spacing_top    = cs_get_option( 'archive_spacing_top' ) ? cs_get_option( 'archive_spacing_top' ) : 120;
$archive_page_spacing_bottom = cs_get_option( 'archive_spacing_bottom' ) ? cs_get_option( 'archive_spacing_bottom' ) : 120;
echo <<<CSS
    .archive-page-content-area {
        background-color: {$archive_page_bg_color};
        padding-top: {$appside->sanitize_px( $archive_page_spacing_top )};
        padding-bottom: {$appside->sanitize_px( $archive_page_spacing_bottom )};
    }
CSS;
/*---------------------------------
	Search Page Options
---------------------------------*/
$search_page_bg_color       = cs_get_option( 'search_bg_color' ) ? cs_get_option( 'search_bg_color' ) : '#fff';
$search_page_spacing_top    = cs_get_option( 'search_spacing_top' ) ? cs_get_option( 'search_spacing_top' ) : 120;
$search_page_spacing_bottom = cs_get_option( 'search_spacing_bottom' ) ? cs_get_option( 'search_spacing_bottom' ) : 120;
echo <<<CSS
    .search-page-content-area {
        background-color: {$search_page_bg_color};
        padding-top: {$appside->sanitize_px( $search_page_spacing_top )};
        padding-bottom: {$appside->sanitize_px( $search_page_spacing_bottom )};
    }
CSS;


/*--------------------------------
    Portfolio Details Page
--------------------------------*/
$portfolio_bg_color       = cs_get_option( 'portfolio_bg_color' ) ? cs_get_option( 'portfolio_bg_color' ) : '#fff';
$portfolio_spacing_top    = cs_get_option( 'portfolio_spacing_top' ) ? cs_get_option( 'portfolio_spacing_top' ) : 120;
$portfolio_spacing_bottom = cs_get_option( 'portfolio_spacing_bottom' ) ? cs_get_option( 'portfolio_spacing_bottom' ) : 120;
echo <<<CSS
    .portfolio-details-page {
        background-color: {$portfolio_bg_color};
        padding-top: {$appside->sanitize_px( $portfolio_spacing_top )};
        padding-bottom: {$appside->sanitize_px( $portfolio_spacing_bottom )};
    }
CSS;

/*--------------------------------
    Typography
--------------------------------*/

/* body font */
$body_font = cs_get_option('_body_font') ? cs_get_option('_body_font') : false;
$body_font_variant = cs_get_option('body_font_variant') ? cs_get_option('body_font_variant') : false;
$body_font['family'] = ( isset($body_font['font-family']) && !empty($body_font['font-family']) ) ? $body_font['font-family'] : 'Poppins';
$body_font['weight']  = ( isset($body_font['font-weight']) && !empty($body_font['font-weight']) ) ? $body_font['font-weight'] : '400';
$body_font['size']  = ( isset($body_font['font-size']) && !empty($body_font['font-size']) ) ? $body_font['font-size'] : '16px';
$body_font['height']  = ( isset($body_font['line-height']) && !empty($body_font['line-height']) ) ? $body_font['line-height'] : '26px';

echo <<<CSS
    html,
    body{
        font-family: "{$body_font['family']}", sans-serif;
    }
    body,p{
        font-size : {$appside->sanitize_px($body_font['size'])};
        font-weight:{$body_font['weight'] };
    }
    :root {
        --body-font: "{$body_font['family']}", sans-serif;
    }
CSS;

/* heading font */
$heading_font_enable = false;
if (null == cs_get_option('heading_font_enable')){
	$heading_font_enable = false;
}elseif ('0' == cs_get_option('heading_font_enable')){
	$heading_font_enable = true;
}elseif('1' == cs_get_option('heading_font_enable')){
	$heading_font_enable = false;
}
$heading_font = cs_get_option('heading_font') ? cs_get_option('heading_font') : false;
$heading_font_variant = cs_get_option('heading_font_variant') ? cs_get_option('heading_font_variant') : false;
$heading_font['family'] = ( isset($heading_font['font-family']) && !empty($heading_font['font-family']) ) ? $heading_font['font-family'] : 'Poppins';
$heading_font['weight'] = ( isset($heading_font['font-weight']) && !empty($heading_font['font-weight']) ) ? $heading_font['font-weight'] : '700';

if (!$heading_font_enable){
	echo <<<CSS
    h1,
    h2,
    h3,
    h4,
    h5,
    h6{
        font-family: "{$heading_font['family']}", sans-serif;
        font-weight:{$heading_font['weight'] };
    }
   :root {
        --heading-font: "{$heading_font['family']}", sans-serif;
    }
CSS;

}else{
	echo <<<CSS
 :root {
        --heading-font: "{$body_font['family']}", sans-serif;
    }
CSS;

}




/*---------------------------------
	Main Color
---------------------------------*/
$main_color = cs_get_customize_option('main_color');
$secondary_color = cs_get_customize_option('secondary_color');
$heading_color = cs_get_customize_option('heading_color');
$paragraph_color = cs_get_customize_option('paragraph_color');

echo <<<CSS
	:root {
    --main-color-one: {$main_color};
    --secondary-color: {$secondary_color};
    --heading-color:{$heading_color};
    --paragraph-color: {$paragraph_color};
}
CSS;


$theme_customize_css = ob_get_clean();