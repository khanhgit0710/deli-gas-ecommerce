<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Admin-Action');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Nạp cấu hình Database
if (file_exists(__DIR__ . '/db-config.php')) {
    require_once __DIR__ . '/db-config.php';
} else {
    define('DB_HOST', 'localhost');
    define('DB_NAME', 'gaslemanh_db');
    define('DB_USER', 'gaslemanh_user');
    define('DB_USER_FALLBACK', 'gaslemanh_db');
    define('DB_PASS', 'Gaslemanh@123');
    define('DB_CHARSET', 'utf8mb4');
}

$dataFile = __DIR__ . '/data.json';
$backupFile = __DIR__ . '/data.json.bak';
$backupDir = __DIR__ . '/backups';

// Hàm kết nối PDO MySQL (Tự động thử user chính và user dự phòng của aaPanel)
function getDbConnection() {
    static $pdo = null;
    if ($pdo !== null) return $pdo;

    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_TIMEOUT            => 3,
    ];

    $usersToTry = [DB_USER];
    if (defined('DB_USER_FALLBACK') && DB_USER_FALLBACK !== DB_USER) {
        $usersToTry[] = DB_USER_FALLBACK;
    }

    foreach ($usersToTry as $u) {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            $conn = new PDO($dsn, $u, DB_PASS, $options);
            
            // Tự động tạo bảng lưu dữ liệu nếu chưa có
            $conn->exec("CREATE TABLE IF NOT EXISTS `site_data` (
                `id` INT AUTO_INCREMENT PRIMARY KEY,
                `data_key` VARCHAR(50) NOT NULL UNIQUE,
                `data_content` LONGTEXT NOT NULL,
                `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

            // Tự động tạo bảng lịch sử sao lưu (History Revision)
            $conn->exec("CREATE TABLE IF NOT EXISTS `site_data_history` (
                `id` INT AUTO_INCREMENT PRIMARY KEY,
                `data_key` VARCHAR(50) NOT NULL,
                `data_content` LONGTEXT NOT NULL,
                `total_products` INT DEFAULT 0,
                `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

            $pdo = $conn;
            return $pdo;
        } catch (PDOException $e) {
            // Thử user kế tiếp nếu lỗi kết nối
            continue;
        }
    }
    return null;
}

$db = getDbConnection();

// ==========================================================
// 1. XỬ LÝ POST (LƯU DỮ LIỆU)
// ==========================================================
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if ($data !== null && is_array($data)) {
        $incomingProducts = isset($data['products']) && is_array($data['products']) ? $data['products'] : [];
        $incomingCount = count($incomingProducts);

        // SAFETY GUARD: Chống ghi đè rỗng
        $currentProductCount = 0;
        if ($db) {
            try {
                $stmt = $db->prepare("SELECT data_content FROM site_data WHERE data_key = 'main_data'");
                $stmt->execute();
                $row = $stmt->fetch();
                if ($row && !empty($row['data_content'])) {
                    $currJson = json_decode($row['data_content'], true);
                    if ($currJson && isset($currJson['products'])) {
                        $currentProductCount = count($currJson['products']);
                    }
                }
            } catch (Exception $e) {}
        }

        if ($currentProductCount === 0 && file_exists($dataFile)) {
            $currJson = json_decode(file_get_contents($dataFile), true);
            if ($currJson && isset($currJson['products'])) {
                $currentProductCount = count($currJson['products']);
            }
        }

        if ($currentProductCount > 0 && $incomingCount === 0) {
            http_response_code(400);
            echo json_encode([
                'success' => false, 
                'message' => 'Lỗi an toàn: Không thể ghi đè cơ sở dữ liệu hiện tại bằng dữ liệu sản phẩm rỗng!'
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }

        $jsonContent = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        $savedToMysql = false;

        // Lưu vào MySQL
        if ($db) {
            try {
                // 1. Cập nhật bảng chính
                $stmt = $db->prepare("INSERT INTO site_data (data_key, data_content) VALUES ('main_data', :content) 
                                      ON DUPLICATE KEY UPDATE data_content = VALUES(data_content)");
                $stmt->execute([':content' => $jsonContent]);

                // 2. Tự động lưu 1 bản snapshot vào bảng Lịch Sử (History Revision)
                $histStmt = $db->prepare("INSERT INTO site_data_history (data_key, data_content, total_products) 
                                          VALUES ('main_data', :content, :total_products)");
                $histStmt->execute([
                    ':content' => $jsonContent,
                    ':total_products' => $incomingCount
                ]);

                // Giữ lại 30 bản ghi lịch sử gần nhất, xóa bản ghi cũ hơn
                $db->exec("DELETE FROM site_data_history WHERE data_key = 'main_data' AND id NOT IN (
                    SELECT id FROM (SELECT id FROM site_data_history WHERE data_key = 'main_data' ORDER BY id DESC LIMIT 30) AS tmp
                )");

                $savedToMysql = true;
            } catch (Exception $e) {
                error_log("MySQL save error: " . $e->getMessage());
            }
        }

        // Đồng thời ghi 1 bản sao lưu tĩnh vào file data.json làm backup / cache
        if (file_exists($dataFile) && filesize($dataFile) > 100) {
            @copy($dataFile, $backupFile);
            if (!is_dir($backupDir)) @mkdir($backupDir, 0775, true);
            if (is_dir($backupDir)) {
                $dailyBackup = $backupDir . '/data_' . date('Y-m-d') . '.json';
                if (!file_exists($dailyBackup)) @copy($dataFile, $dailyBackup);
            }
        }

        $tempFile = $dataFile . '.tmp.' . uniqid();
        if (file_put_contents($tempFile, $jsonContent, LOCK_EX) !== false) {
            if (@rename($tempFile, $dataFile)) {
                @chmod($dataFile, 0666);
            } else {
                @unlink($tempFile);
            }
        }

        echo json_encode([
            'success' => true,
            'storage' => $savedToMysql ? 'mysql' : 'file',
            'message' => $savedToMysql ? 'Đã lưu an toàn vào MySQL và tạo bản sao lưu lịch sử' : 'Đã lưu vào file',
            'total_products' => $incomingCount,
            'timestamp' => date('Y-m-d H:i:s')
        ], JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid JSON']);
    }
    exit();
}

// ==========================================================
// 2. XỬ LÝ GET (ĐỌC DỮ LIỆU)
// ==========================================================
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // 1. Ưu tiên đọc từ MySQL
    if ($db) {
        try {
            $stmt = $db->prepare("SELECT data_content FROM site_data WHERE data_key = 'main_data'");
            $stmt->execute();
            $row = $stmt->fetch();
            if ($row && !empty($row['data_content']) && strlen($row['data_content']) > 50) {
                echo $row['data_content'];
                exit();
            }
        } catch (Exception $e) {
            error_log("MySQL read error: " . $e->getMessage());
        }
    }

    // 2. Dự phòng: Nếu MySQL chưa có dữ liệu, đọc từ file data.json
    if (file_exists($dataFile) && filesize($dataFile) > 50) {
        $json = file_get_contents($dataFile);
        
        // Tự động nạp dữ liệu từ data.json vào MySQL để đồng bộ
        if ($db) {
            try {
                $stmt = $db->prepare("INSERT INTO site_data (data_key, data_content) VALUES ('main_data', :content) 
                                      ON DUPLICATE KEY UPDATE data_content = VALUES(data_content)");
                $stmt->execute([':content' => $json]);
            } catch (Exception $e) {}
        }
        
        echo $json;
        exit();
    } elseif (file_exists($backupFile) && filesize($backupFile) > 50) {
        // Tự phục hồi từ file backup
        @copy($backupFile, $dataFile);
        $json = file_get_contents($dataFile);
        echo $json;
        exit();
    }

    http_response_code(404);
    echo json_encode(['error' => 'No data']);
    exit();
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
