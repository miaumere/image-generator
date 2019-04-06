<?php
header('Content-Type: text/json');
$output = array();

// Domyślne ikonki 
$dir = './img/';
$images = array_diff(scandir($dir), array('..', '.'));

// Ikonki stworzone przez użytkownika
$fileDir = './user-img/';
$customImages = array_diff(scandir($fileDir), array('..', '.'));

$result = array_merge($images, $customImages);

if (is_array($result) || is_object($result)) {
    foreach ($result as $key) {
        array_push($output, $key);
    };
}
echo json_encode($output);
?>