const WebSocket = require('ws');

// ポート設定（Vercelでは環境変数`PORT`を使用）
const server = new WebSocket.Server({ port: process.env.PORT || 8080 });

// 接続クライアントの管理
server.on('connection', ws => {
    console.log("✅ WebSocketサーバーに新しい接続がありました！");

    // メッセージ受信時の処理
    ws.on('message', message => {
        console.log("📩 受信したメッセージ:", message);

        // 全クライアントにメッセージを送信
        server.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    // クライアントに初期メッセージを送信
    ws.send(JSON.stringify({ message: "Welcome to the WebSocket server!" }));
});

// サーバー起動ログ
console.log("🚀 WebSocketサーバーが起動しました！");
