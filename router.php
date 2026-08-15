<?php
$html = file_get_contents('router.html');

$slug = isset($_GET['slug']) ? $_GET['slug'] : '';
if (!$slug) {
    echo $html;
    exit;
}

if ($slug === 'tin-tuc' || $slug === 'san-pham') {
    $targetHtml = file_get_contents($slug . '.html');
    $image = '';
    
    if ($slug === 'tin-tuc') {
        $dbContent = file_get_contents('assets/js/client/product-db.js');
        // Tìm bài viết có position: 'hero_main'
        if (preg_match_all("/\{[^\}]*position:\s*['\"]hero_main['\"][^\}]*\}/is", $dbContent, $matches)) {
            $block = $matches[0][0];
            if (preg_match("/image:\s*['\"]([^'\"]+)['\"]/is", $block, $iMatch)) {
                $image = $iMatch[1];
            }
        }
    } else if ($slug === 'san-pham') {
        $indexHtml = file_get_contents('index.html');
        // Trích xuất og:image từ trang chủ
        if (preg_match('/<meta\s+property=["\']og:image["\']\s+content=["\']([^"\']+)["\']/is', $indexHtml, $matches)) {
            $image = $matches[1];
        }
    }
    
    if ($image) {
        if (strpos($image, 'http') !== 0) {
            $image = 'https://gaslemanh.vn' . (strpos($image, '/') === 0 ? '' : '/') . $image;
        }
        $targetHtml = preg_replace('/<meta property="og:image"[^>]*>/is', '<meta property="og:image" content="' . htmlspecialchars($image) . '" />', $targetHtml);
        $targetHtml = preg_replace('/<meta name="twitter:image"[^>]*>/is', '<meta name="twitter:image" content="' . htmlspecialchars($image) . '" />', $targetHtml);
    }
    
    echo $targetHtml;
    exit;
}

$dbContent = file_get_contents('assets/js/client/product-db.js');

$title = '';
$desc = '';
$image = '';

preg_match_all("/\{[^\}]*slug:\s*['\"]" . preg_quote($slug, '/') . "['\"][^\}]*\}/is", $dbContent, $matches);

if (!empty($matches[0])) {
    $block = $matches[0][0];
    
    if (preg_match("/(?:title|name):\s*['\"]([^'\"]+)['\"]/is", $block, $tMatch)) {
        $title = $tMatch[1];
    }
    
    if (preg_match("/image:\s*['\"]([^'\"]+)['\"]/is", $block, $iMatch)) {
        $image = $iMatch[1];
    }
    
    if (preg_match("/seoDesc:\s*['\"]([^'\"]+)['\"]/is", $block, $dMatch)) {
        $desc = $dMatch[1];
    }
}

// Fallback for auto-generated slugs (like products)
// Instead of complex regex, just extract all names and create slug to find match
if (!$title) {
    preg_match_all("/\{[^\}]*(?:name):\s*['\"]([^'\"]+)['\"][^\}]*\}/is", $dbContent, $allMatches);
    if (!empty($allMatches[0])) {
        foreach ($allMatches[0] as $index => $block) {
            $name = $allMatches[1][$index];
            $generatedSlug = createSlug($name);
            if ($generatedSlug === $slug) {
                $title = $name;
                if (preg_match("/image:\s*['\"]([^'\"]+)['\"]/is", $block, $iMatch)) {
                    $image = $iMatch[1];
                }
                if (preg_match("/seoDesc:\s*['\"]([^'\"]+)['\"]/is", $block, $dMatch)) {
                    $desc = $dMatch[1];
                }
                break;
            }
        }
    }
}

if ($title) {
    $fullTitle = $title . " | Gas Lê Mạnh";
    if (empty($desc)) $desc = $title;
    
    $fullImage = $image;
    if ($fullImage) {
        if (strpos($fullImage, 'http') !== 0) {
            $fullImage = 'https://gaslemanh.vn' . (strpos($fullImage, '/') === 0 ? '' : '/') . $fullImage;
        }
    } else {
        $fullImage = 'https://gaslemanh.vn/assets/images/banner-share-lemanh.jpg';
    }
    
    $html = preg_replace('/<title>.*?<\/title>/is', '<title>' . htmlspecialchars($fullTitle) . '</title>', $html);
    
    $ogTags = "
    <meta property=\"og:title\" content=\"" . htmlspecialchars($fullTitle) . "\" />
    <meta property=\"og:description\" content=\"" . htmlspecialchars($desc) . "\" />
    <meta property=\"og:image\" content=\"" . htmlspecialchars($fullImage) . "\" />
    <meta property=\"og:image:width\" content=\"1200\" />
    <meta property=\"og:image:height\" content=\"630\" />
    <meta name=\"twitter:card\" content=\"summary_large_image\" />
    <meta name=\"twitter:image\" content=\"" . htmlspecialchars($fullImage) . "\" />
    <meta property=\"og:url\" content=\"https://gaslemanh.vn/" . htmlspecialchars($slug) . "\" />
    <meta property=\"og:type\" content=\"website\" />
    ";
    
    $html = str_replace('</head>', $ogTags . "\n</head>", $html);
}

echo $html;

function createSlug($str) {
    if (!$str) return '';
    
    $str = preg_replace("/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/", "a", $str);
    $str = preg_replace("/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/", "e", $str);
    $str = preg_replace("/ì|í|ị|ỉ|ĩ/", "i", $str);
    $str = preg_replace("/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/", "o", $str);
    $str = preg_replace("/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/", "u", $str);
    $str = preg_replace("/ỳ|ý|ỵ|ỷ|ỹ/", "y", $str);
    $str = preg_replace("/đ/", "d", $str);
    
    $str = preg_replace("/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/", "a", $str);
    $str = preg_replace("/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/", "e", $str);
    $str = preg_replace("/Ì|Í|Ị|Ỉ|Ĩ/", "i", $str);
    $str = preg_replace("/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/", "o", $str);
    $str = preg_replace("/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/", "u", $str);
    $str = preg_replace("/Ỳ|Ý|Ỵ|Ỷ|Ỹ/", "y", $str);
    $str = preg_replace("/Đ/", "d", $str);
    
    $str = strtolower($str);
    $str = preg_replace("/[^a-z0-9]+/", "-", $str);
    $str = trim($str, "-");
    
    return $str;
}
?>
