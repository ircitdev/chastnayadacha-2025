<?php
$m = new mysqli("localhost", "u2383407_wp972", "OX59b4]S.p", "u2383407_wp972");
$r = $m->query("SELECT config FROM wpyk_ipanorama WHERE id=3")->fetch_assoc();
$c = unserialize($r["config"]);
echo json_encode($c, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES);
