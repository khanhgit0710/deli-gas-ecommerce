<?php
// File: delete-image.php
header('Content-Type: application/json');

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);
$imagePaths = isset($data['paths']) ? $data['paths'] : [];

if (empty($imagePaths)) {
    echo json_encode(['success' => false, 'msg' => 'Không có đường dẫn ảnh nào được cung cấp.']);
    exit;
}

$deletedFiles = [];
$errors = [];

foreach ($imagePaths as $path) {
    // Basic security check: Only allow deleting files in assets/images/
    if (strpos($path, '/assets/images/') === 0 && strpos($path, '..') === false) {
        // Absolute path on server
        $absolutePath = $_SERVER['DOCUMENT_ROOT'] . $path;
        
        if (file_exists($absolutePath) && is_file($absolutePath)) {
            if (unlink($absolutePath)) {
                $deletedFiles[] = $path;
            } else {
                $errors[] = "Không thể xoá file: $path";
            }
        } else {
            $errors[] = "File không tồn tại: $path";
        }
    } else {
        $errors[] = "Đường dẫn không hợp lệ: $path";
    }
}

if (count($deletedFiles) > 0) {
    echo json_encode(['success' => true, 'msg' => 'Đã xoá file thành công!', 'deleted' => $deletedFiles, 'errors' => $errors]);
} else {
    echo json_encode(['success' => false, 'msg' => 'Không có file nào được xoá.', 'errors' => $errors]);
}
?>
