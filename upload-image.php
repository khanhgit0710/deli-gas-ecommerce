<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    exit();
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data || !isset($data['image']) || !isset($data['type'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
    exit();
}

$base64Image = $data['image'];
$type = $data['type']; // 'product' or 'news'

// Xác định thư mục lưu dựa trên type
$uploadDir = '';
if ($type === 'product') {
    $uploadDir = __DIR__ . '/assets/images/products/';
    $prefix = 'prod_';
} elseif ($type === 'news') {
    $uploadDir = __DIR__ . '/assets/images/news/';
    $prefix = 'news_';
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid type']);
    exit();
}

// Kiểm tra xem chuỗi có đúng định dạng base64 ảnh không
if (preg_match('/^data:image\/(\w+);base64,/', $base64Image, $matches)) {
    $extension = $matches[1];
    
    // Chỉ chấp nhận định dạng ảnh cơ bản
    $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    if (!in_array(strtolower($extension), $allowedExtensions)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid image format']);
        exit();
    }
    
    // Tách phần dữ liệu base64
    $base64Data = substr($base64Image, strpos($base64Image, ',') + 1);
    
    // Tạo tên file duy nhất
    $fileName = $prefix . time() . '_' . rand(1000, 9999) . '.' . $extension;
    $filePath = $uploadDir . $fileName;
    
    // Đảm bảo thư mục tồn tại
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    
    // Lưu file
    if (file_put_contents($filePath, base64_decode($base64Data))) {
        // Trả về đường dẫn tĩnh
        $relativeUrl = '/assets/images/' . ($type === 'product' ? 'products/' : 'news/') . $fileName;
        echo json_encode(['success' => true, 'url' => $relativeUrl]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to save file']);
    }
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Not a valid base64 image']);
}
