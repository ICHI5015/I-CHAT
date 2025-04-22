document.addEventListener('DOMContentLoaded', async () => {
    const sendButton = document.getElementById('send-button'); // ✅ ここで取得！
    
    if (!sendButton) {
        console.error("sendButtonが見つかりません！HTMLのIDを確認してください"); // 🔥 デバッグ用
        return;
    }

    sendButton.addEventListener('click', () => {
        console.log("送信ボタンがクリックされました！"); // ✅ クリックイベント確認
    });
});

    // 🔹 必要な要素を取得
    document.getElementById("send-button")
    const chatBox = document.getElementById('chat-box');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const imageButton = document.getElementById('image-button');
    const imageInput = document.getElementById('image-input');
    const deleteModeButton = document.getElementById('delete-mode-button');
    const roomIdButton = document.getElementById('room-id-button');
    const nameChangeButton = document.getElementById('name-change-button');
    
    const nameChangeModal = document.getElementById('name-change-modal');
    const newUsernameInput = document.getElementById('new-username');
    const submitNameChange = document.getElementById('submit-name-change');
    const closeNameChange = document.getElementById('close-name-change');

    const roomIdModal = document.getElementById('room-id-modal');
    const roomIdInput = document.getElementById('room-id-input');
    const submitRoomId = document.getElementById('submit-room-id');
    const closeRoomId = document.getElementById('close-room-id');
    const roomIdText = document.getElementById('room-id-text');

    // 🔹 ユーザー情報とルームID管理
    let currentUser = localStorage.getItem("loggedInUser") || "ゲスト";
    let roomId = localStorage.getItem("roomId") || generateRoomId();
    let deleteMode = false;

    function generateRoomId() {
        const randomId = Math.random().toString(36).substring(2, 10);
        localStorage.setItem("roomId", randomId);
        return randomId;
    }

    function saveMessagesLocally(messages) {
        localStorage.setItem(`chat-${roomId}`, JSON.stringify(messages));
    }

    function loadMessagesLocally() {
        return JSON.parse(localStorage.getItem(`chat-${roomId}`)) || [];
    }

    function displayMessage(username, content, time, isImage = false, index) {
        const messageContainer = document.createElement('div');
        messageContainer.classList.add('message-container');

        const messageBubble = document.createElement('div');
        messageBubble.classList.add('message');

        if (isImage) {
            const img = document.createElement('img');
            img.src = content;
            img.classList.add('uploaded-image');
            messageBubble.appendChild(img);
        } else {
            messageBubble.textContent = content;
        }

        const metaInfo = document.createElement('div');
        metaInfo.textContent = `${username} - ${time}`;
        metaInfo.classList.add('meta-info');

        const deleteButton = document.createElement('button');
        deleteButton.textContent = "🗑️";
        deleteButton.classList.add('delete-button');
        deleteButton.style.display = deleteMode ? "inline-block" : "none";
        deleteButton.addEventListener('click', () => deleteMessage(index));

        messageContainer.append(messageBubble, metaInfo, deleteButton);
        chatBox.appendChild(messageContainer);

        scrollToBottom();
    }

    function scrollToBottom() {
        setTimeout(() => chatBox.scrollTop = chatBox.scrollHeight, 100);
    }

    function loadMessages() {
        chatBox.innerHTML = "";
        loadMessagesLocally().forEach((msg, index) => {
            displayMessage(msg.username, msg.image || msg.text, msg.time, !!msg.image, index);
        });
        scrollToBottom();
    }

    function deleteMessage(index) {
        let messages = loadMessagesLocally();
        messages.splice(index, 1);
        saveMessagesLocally(messages);
        loadMessages();
    }

    // 🔹 ボタンのイベント処理
    deleteModeButton.addEventListener('click', () => {
        deleteMode = !deleteMode;
        deleteModeButton.textContent = deleteMode ? "削除モード 🗑️ ON" : "削除モード 🗑️ OFF";
        loadMessages();
    });

    sendButton.addEventListener('click', () => {
        let messageText = messageInput.value.trim();
        if (messageText) {
            const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            let messages = loadMessagesLocally();
            messages.push({ username: currentUser, text: messageText, time: currentTime });
            saveMessagesLocally(messages);
            loadMessages();
            messageInput.value = '';
        }
    });

    imageButton.addEventListener('click', () => imageInput.click());

    imageInput.addEventListener('change', () => {
        if (imageInput.files.length > 0) {
            const file = imageInput.files[0];
            const reader = new FileReader();

            reader.onload = event => {
                const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                let messages = loadMessagesLocally();
                messages.push({ username: currentUser, image: event.target.result, time: currentTime });
                saveMessagesLocally(messages);
                loadMessages();
                imageInput.value = "";
            };

            reader.readAsDataURL(file);
        }
    });

    nameChangeButton.addEventListener('click', () => nameChangeModal.style.display = "block");

    submitNameChange.addEventListener('click', () => {
        const newUsername = newUsernameInput.value.trim();
        if (newUsername) {
            localStorage.setItem("loggedInUser", newUsername);
            alert(`名前が変更されました: ${newUsername}`);
            nameChangeModal.style.display = "none";
        } else {
            alert("新しい名前を入力してください！");
        }
    });

    closeNameChange.addEventListener('click', () => nameChangeModal.style.display = "none");

    roomIdButton.addEventListener('click', () => roomIdModal.style.display = "block");

    submitRoomId.addEventListener('click', () => {
        const newRoomId = roomIdInput.value.trim();
        if (newRoomId) {
            localStorage.setItem("roomId", newRoomId);
            roomIdText.textContent = newRoomId;
            alert(`ルームIDが変更されました: ${newRoomId}`);
            roomIdModal.style.visibility = "hidden";
            loadMessages();
        }
    });

    closeRoomId.addEventListener('click', () => roomIdModal.style.display = "none");

    // 🔹 初回のメッセージ読み込み
    roomIdText.textContent = roomId;
    loadMessages();


const socket = new WebSocket('https://i-chat-five.vercel.app/'); // ✅ WebSocket接続

socket.onmessage = event => {
    const data = JSON.parse(event.data);

    if (data.type === "message") {
        displayMessage(data.username, data.text, data.time); // ✅ 受信したメッセージを表示
    }
};

// 送信処理（ボタンを押したとき）
document.getElementById('send-button').addEventListener('click', () => {
    const messageInput = document.getElementById('message-input');
    const messageText = messageInput.value.trim();

    if (messageText) {
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        socket.send(JSON.stringify({ type: "message", username: currentUser, text: messageText, time: currentTime }));
        messageInput.value = "";
    }
});
sendButton.addEventListener("click", () => {
    const messageText = messageInput.value.trim();
    if (messageText) {
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const messageData = { type: "message", username: currentUser, text: messageText, time: currentTime };

        socket.send(JSON.stringify(messageData)); // ✅ WebSocketで送信！
        messageInput.value = "";
    }
});
sendButton.addEventListener("click", () => {
    const messageText = messageInput.value.trim();
    if (messageText) {
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const messageData = { type: "message", username: currentUser, text: messageText, time: currentTime };

        socket.send(JSON.stringify(messageData)); // ✅ WebSocketで送信！
        messageInput.value = "";
    }
});
socket.onopen = () => console.log("WebSocket connected!");
server.on('connection', ws => {
    console.log("✅ WebSocketサーバーに新しい接続がありました！");

    ws.on('message', message => {
        console.log("📩 受信したメッセージ:", message); // ✅ メッセージログを追加
        server.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });
});
const socket = new WebSocket('wss://i-chat-five.vercel.app'); // ✅ VercelのURLを正しく設定！
