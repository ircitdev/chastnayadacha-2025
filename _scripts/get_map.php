<?php
$m = new mysqli("localhost", "u2383407_wp972", "OX59b4]S.p", "u2383407_wp972");
$m->set_charset("utf8mb4");
$r = $m->query("SELECT meta_value FROM wpyk_postmeta WHERE post_id=1183 AND meta_key='_mapplic_data'")->fetch_assoc();
$data = maybe_unserialize($r['meta_value']);
if (!$data) $data = @unserialize($r['meta_value']);
if (!$data) { $data = json_decode($r['meta_value'], true); }
echo json_encode($data, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES);
