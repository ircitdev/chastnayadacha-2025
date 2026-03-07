<?php
$m = new mysqli("localhost", "u2383407_wp972", "OX59b4]S.p", "u2383407_wp972");
$m->set_charset("utf8mb4");
$r = $m->query("SELECT post_content FROM wpyk_posts WHERE ID=1183")->fetch_assoc();
// post_content is already JSON
echo $r['post_content'];
