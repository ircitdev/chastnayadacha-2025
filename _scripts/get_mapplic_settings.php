<?php
$m = new mysqli('localhost', 'u2383407_wp972', 'OX59b4]S.p', 'u2383407_wp972');
if ($m->connect_error) { die('Connect error: ' . $m->connect_error); }

// Get post_content for ID 1183
$r = $m->query('SELECT post_content, post_title FROM wpyk_posts WHERE ID = 1183');
$row = $r->fetch_assoc();
echo "=== POST CONTENT ===\n";
echo $row['post_title'] . "\n";
echo $row['post_content'] . "\n\n";

// Check if mapplic table exists
$r2 = $m->query("SHOW TABLES LIKE '%mapplic%'");
echo "=== MAPPLIC TABLES ===\n";
while ($t = $r2->fetch_array()) { echo $t[0] . "\n"; }

$m->close();
