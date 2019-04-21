<?php
header('Content-Type: application/json');
$output = array();

// Domyślne ikonki 
$dir = 'img';
$images = array_diff(scandir('../' . $dir . '/'), array('..', '.'));
$imagesModified = array();

foreach ($images as $image) {
    $image = $dir . '/' . $image;
    array_push($imagesModified, $image);
};

// Ikonki stworzone przez użytkownika

$fileDir = 'user-img';
$customImages = array_diff(scandir('../' . $fileDir . '/'), array('..', '.'));
$customImagesModified = array();

foreach ($customImages as $customImage) {
    $customImage = $fileDir . '/' . $customImage;
    array_push($customImagesModified, $customImage);
};



$result = array_merge($imagesModified, $customImagesModified);

if (is_array($result) || is_object($result)) {
    foreach ($result as $key) {
        array_push($output, $key);
    };
}



$obj = new class{};
    $obj->nativeImages = array_merge([], $images);
    $obj->userImages = array_merge([], $customImages);
    
    

echo json_encode($obj);
?>

