<?php

$htmlTemplate = file_get_contents('template.html');
$cssContent = file_get_contents('../css/view.css');

$htmlTemplate = str_replace('<link rel="stylesheet" type="text/css" href="../css/view.css">', '', $htmlTemplate);
$cssContent = str_replace("'", "\'", $cssContent);

$htmlTemplate = str_replace('{$styles}', $cssContent, $htmlTemplate);

$htmlTemplate = str_replace(array("\t", "\r", "\n"), '', $htmlTemplate);
$htmlTemplateParts = explode('<!-- split -->', $htmlTemplate);

$sidePart = explode('<!-- line -->', $htmlTemplateParts[2]);

$jsTemplate = file_get_contents('script.template.js');
$jsTemplate = str_replace('{$header}', $htmlTemplateParts[0], $jsTemplate);
$jsTemplate = str_replace('{$footer}', $htmlTemplateParts[3], $jsTemplate);
$jsTemplate = str_replace('{$main}', $htmlTemplateParts[1], $jsTemplate);

$jsTemplate = str_replace('{$side}', $sidePart[0] . "'+htmlInformation()+'" . $sidePart[2], $jsTemplate);
$jsTemplate = str_replace('{$line}', $sidePart[1], $jsTemplate);

file_put_contents('script.js', $jsTemplate);