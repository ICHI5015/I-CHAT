<?php
// サーバーに簡単なレスポンスを返す
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode(["message" => "GETリクエスト成功！"]);
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = file_get_contents("php://input");
    echo json_encode(["message" => "POSTリクエスト成功！", "data" => json_decode($body)]);
} else {
    http_response_code(405); // メソッド許可されず
    echo json_encode(["error" => "許可されていないメソッド"]);
}
?>
