<?php
$m = new mysqli("localhost", "u2383407_wp972", "OX59b4]S.p", "u2383407_wp972");
$r = $m->query("SELECT config, data FROM wpyk_ipanorama WHERE id=3")->fetch_assoc();
// Try to detect format
$config = $r["config"];
echo "Config length: " . strlen($config) . "\n";
echo "First 200: " . substr($config, 0, 200) . "\n";
echo "---\n";

// WordPress uses maybe_unserialize
$decoded = @unserialize($config);
if ($decoded === false) {
    echo "unserialize failed, trying json_decode\n";
    $decoded = json_decode($config);
    if ($decoded === null) {
        echo "json_decode also failed\n";
        echo "Raw hex start: " . bin2hex(substr($config, 0, 20)) . "\n";
    } else {
        echo "json_decode OK\n";
        echo json_encode($decoded, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES);
    }
} else {
    echo "unserialize OK\n";
    echo json_encode($decoded, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES);
}
