<?php
$m = new mysqli("localhost", "u2383407_wp972", "OX59b4]S.p", "u2383407_wp972");
$m->set_charset("utf8mb4");
$r = $m->query("SELECT config FROM wpyk_ipanorama WHERE id=3")->fetch_assoc();
$config = $r["config"];

// Fix serialized string byte counts for multibyte characters
// WordPress serialized data may have byte-length mismatches when charset differs
$fixed = preg_replace_callback(
    '/s:(\d+):"(.*?)";/su',
    function($matches) {
        $len = strlen($matches[2]); // byte length
        return 's:' . $len . ':"' . $matches[2] . '";';
    },
    $config
);

$decoded = @unserialize($fixed);
if ($decoded === false) {
    // Try original
    $decoded = @unserialize($config);
}

if ($decoded === false) {
    // Last resort: use wp approach - eval the serialized data differently
    // Extract JSON-like structure manually
    echo "FAIL: could not unserialize\n";
    echo "Config start: " . substr($config, 0, 300) . "\n";
    exit(1);
}

$json = json_encode($decoded, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES);
echo $json;
