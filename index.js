<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SERA AI - استشارة العناية بالبشرة</title>

    <style>
        body {
            margin: 0;
            background: #000;
            font-family: "Tahoma", sans-serif;
            color: white;
            display: flex;
            justify-content: center;
            padding: 20px;
        }

        .chat-wrapper {
            width: 100%;
            max-width: 650px;
            background: #111;
            padding: 20px;
            border-radius: 14px;
            box-shadow: 0 0 18px rgba(255,255,255,0.05);
        }

        .header {
            text-align: center;
            padding: 10px 0 20px;
            font-size: 28px;
            font-weight: bold;
            letter-spacing: 1px;
            color: white;
        }

        .messages {
            height: 65vh;
            overflow-y: auto;
            padding: 5px 10px;
            border-radius: 10px;
            border: 1px solid #333;
            background: #0c0c0c;
        }

        .msg {
            margin: 12px 0;
            padding: 12px 16px;
            border-radius: 10px;
            max-width: 80%;
            font-size: 16px;
            line-height: 1.6;
        }

        .user {
            background: #1f1f1f;
            align-self: flex-end;
            margin-left: auto;
        }

        .ai {
            background: white;
            color: black;
            margin-right: auto;
        }

        .input-area {
            display: flex;
            gap: 10px;
            margin-top: 15px;
        }

        input {
            flex: 1;
            padding: 14px;
            border-radius: 10px;
            border: none;
            background: #222;
            color: white;
            font-size: 16px;
            outline: none;
        }

        button {
            background: white;
            color: black;
            border: none;
            padding: 14px 20px;
            font-size: 16px;
            border-radius: 10px;
            cursor: pointer;
            font-weight: bold;
        }

        button:hover {
            opacity: 0.9;
        }

        .typing {
            font-size: 13px;
            color: #aaa;
            margin-top: 5px;
        }
    </style>

</head>
<body>

<div class="chat-wrapper">
    <div class="header">SERA AI</div>

    <div class="messages" id="messages"></div>

    <div class="input-area">
        <input id="userInput" type="text" placeholder="اكتب سؤالك هنا عن بشرتك…">
        <button onclick="sendMessage()">إرسال</button>
    </div>
</div>

<script>
    const API_URL = "https://sera-ai-backend-qhrd.onrender.com/ask";

    function addMessage(text, sender) {
        const msgContainer = document.getElementById("messages");

        const msg = document.createElement("div");
        msg.classList.add("msg", sender);
        msg.innerText = text;

        msgContainer.appendChild(msg);
        msgContainer.scrollTop = msgContainer.scrollHeight;
    }

    async function sendMessage() {
        const input = document.getElementById("userInput");
        const text = input.value.trim();

        if (text === "") return;

        addMessage(text, "user");
        input.value = "";

        addMessage("يكتب الآن…", "typing");

        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text })
        });

        const data = await response.json();

        document.querySelector(".typing")?.remove();

        addMessage(data.reply, "ai");
    }
</script>

</body>
</html>