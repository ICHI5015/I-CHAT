<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // POSTリクエストを処理
    $data = json_decode(file_get_contents("php://input"), true);
    echo json_encode(["message" => "POSTリクエスト成功！", "data" => $data]);
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // GETリクエストを処理
    echo json_encode(["message" => "GETリクエスト成功！"]);
} else {
    http_response_code(405);
    echo json_encode(["error" => "このメソッドは許可されていません"]);
}
?>
