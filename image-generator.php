<?php
 // Nagłówek wskazujący na typ zawartości:
// header('Content-type: image/png');
header("Access-Control-Allow-Origin: *");

// Wartości z GET:

    // Wielkosc obrazka:
    $height = isset($_GET['height']) ? $_GET['height'] : '';
    $width = isset($_GET['width']) ? $_GET['width'] : '';

    // Tekst:
    $text = isset($_GET['text']) ? $_GET['text'] : '';

    // Kolor tła:
    $hexInput = urldecode($_GET['color']);

    // Ikonka: 
    $iconInput = isset($_GET['icon']) ? $_GET['icon'] : '';

    // Dodawanie czcionki:
    $font = dirname(__FILE__) . '/visitor2.ttf';
    $im = imagecreate((int)$height, (int)$width);

    // Stałe dot. koloru tekstu:
    const textColor1 = [255, 255, 255];
    const textColor2 = [0, 0, 0];

// Funkcja tworząca ostylowany tekst:
function createText($im, $font, $text) {

    $font_color = imagecolorallocate($im, textColor1[0], textColor1[1], textColor1[2]);
    $stroke_color = imagecolorallocate($im, textColor2[0], textColor2[1], textColor2[2]);
    
    // Tworzenie stroke'a:
    imagettftext($im, 20, 0, 10, 22, $stroke_color, $font, $text);
    imagettftext($im, 20, 0, 12, 20, $stroke_color, $font, $text);
    imagettftext($im, 20, 0, 8, 20, $stroke_color, $font, $text);
    imagettftext($im, 20, 0, 10, 18, $stroke_color, $font, $text);

    // Kolor "głównego" tekstu:
    imagettftext($im, 20, 0, 10, 20, $font_color, $font, $text);
};

// Obrazek nie moze byc mniejszy niz 100x100, inaczej zwracany jest bład
if ($height < 100 || $width < 100) {
    // Najmniejszy mozliwy obrazek:
    $text = "-----Blad renderowania obrazka-----\n";

    if($height < 100) {
        $text .= "\nUstawiono WYSOKOSC mniejsza niz 100!";
    }
    
    if($width < 100) {
        $text .= "\nUstawiono SZEROKOSC mniejsza niz 100!";
    }

    if(!file_exists($iconInput)){
        $text .= "\n Plik nie istnieje!";
    }

    $im = imagecreate(460, 100);

    $bg_color = imagecolorallocate($im, 250, 0, 0);
    imagefill($im, 0, 0, $bg_color);
    createText($im, $font, $text);
    

} else {

    // Konwertowanie hex -> rgb:
    $value = hexdec($hexInput);
    list($r, $g, $b) = sscanf($hexInput, "#%02x%02x%02x");

    // Kolor tła:
    $bg_color = imagecolorallocate($im, $r, $g, $b);
    imagefill($im, 0, 0, $bg_color);
    createText($im, $font, $text);

// Wyświetlanie ikonki:

    //Czy plik w GET jest obrazkiem?
    if (file_exists($iconInput) && strtolower(exif_imagetype($iconInput)) !== false) {
        // Dodawanie ikonki w zależności od rozszerzenia
        switch (exif_imagetype($iconInput)){
            case 1: // .gif
            $icon = imagecreatefromgif($iconInput);
            break;

            case 2: // .jpeg
            $icon = imagecreatefromjpeg($iconInput);
            break;

            case 3: // .png
            $icon = imagecreatefrompng($iconInput);
            break;

            case 6: // .bmp
            $icon = imagecreatefrombmp($iconInput);
            break;
        }
        // Rozmiar ikonki:
        $resizedIcon = imagescale($icon, 60, 60);

        // Dodawanie ikonki do kolorowego tła:
        imagecopymerge($im, $resizedIcon, 50, 50, 10, 0, 50, 50, 100);
    };
};
// Zwracanie obrazka w PNG:
imagepng($im);
imagedestroy($im);