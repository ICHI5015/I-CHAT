const WebSocket = require('ws'); // ✅ Node.js の `require` を正しく使う！
const server = new WebSocket.Server({ port: process.env.PORT || 8080 });

server.on('connection', ws => {
    console.log("✅ WebSocketサーバーに新しい接続がありました！");

    ws.on('message', message => {
        console.log("📩 受信したメッセージ:", message);

        server.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });
});


console.log("🚀 WebSocketサーバーが起動しました！");
