<?php

// Maksymalna wielkość obrazka:
$max_size = 1024 * 1024;
$fileFolder = '../user-img/';




// Converts it into a PHP object

if (isset($_FILES['image'])) {
    // Zmienne dot. pobieranego pliku:
    $file_name = $_FILES['image']['name'];
    $file_size = $_FILES['image']['size'];
    $file_tmp = $_FILES['image']['tmp_name'];
    $file_type = $_FILES['image']['type'];
    $file_error = $_FILES["image"]["error"];

    //Walidacja wielkości pliku:            
    if ($file_size > $max_size) {
        header("HTTP/1.0 500 Internal Server Error");
    } else {
        $fileFolder = '../user-img/';

        move_uploaded_file($file_tmp, $fileFolder . $file_name);
    };
} else {
    header("HTTP/1.0 500 Internal Server Error");
    echo "Brak pliku";
}




?>