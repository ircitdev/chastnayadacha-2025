<?php
$m = new mysqli('localhost', 'u2383407_wp972', 'OX59b4]S.p', 'u2383407_wp972');
if ($m->connect_error) { die('Connect error: ' . $m->connect_error); }
$r = $m->query('SELECT meta_key, meta_value FROM wpyk_postmeta WHERE post_id = 1183');
while ($row = $r->fetch_assoc()) {
    echo $row['meta_key'] . "\t" . $row['meta_value'] . "\n";
}
$m->close();
