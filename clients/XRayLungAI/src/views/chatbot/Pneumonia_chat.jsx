import React, { useState, useEffect, useRef } from "react";
import "../../styles/Pneumonia_chat.css";

const ChatBot = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = "http://127.0.0.1:8085/api/v1/chatbot/message/chat/generate";
  const messagesEndRef = useRef(null);

  // Scroll tự động xuống cuối khi chatHistory hoặc loading thay đổi
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, loading]);

  // Hàm tách text và render phần Source in đậm, link https clickable, gạch chân, màu xanh
  function renderMessageText(text) {
    if (!text) return null;

    // Tách text theo từ "Source" (giữ lại từ "Source")
    const parts = text.split(/(Source)/gi);

    return parts.map((part, i) => {
      // Nếu là từ "Source" (bất kể hoa thường), in đậm
      if (/^source$/i.test(part)) {
        return (
          <strong key={i} style={{ fontWeight: "700" }}>
            {part}
          </strong>
        );
      }

      // Với phần khác, tìm các link https://... và render thành <a>
      const linkRegex = /(https?:\/\/[^\s]+)/g;

      const subparts = part.split(linkRegex);

      return subparts.map((subpart, j) => {
        if (linkRegex.test(subpart)) {
          return (
            <a
              key={`${i}-${j}`}
              href={subpart}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#0077cc",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              {subpart}
            </a>
          );
        }
        return <span key={`${i}-${j}`}>{subpart}</span>;
      });
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setError(null);

    // Thêm tin nhắn user vào lịch sử
    setChatHistory((prev) => [...prev, { sender: "user", text: message }]);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Lỗi từ server");
      }

      const data = await res.json();
      let responseText = data.response;

      // Hàm cắt chuỗi sau lần lặp thứ 2 của từ khóa
      function cutAfterSecondRepeat(text, keyword) {
        let count = 0;
        let lastIndex = -1;
        let searchIndex = 0;
        while (true) {
          const idx = text.indexOf(keyword, searchIndex);
          if (idx === -1) break;
          count++;
          if (count === 2) {
            lastIndex = idx;
            break;
          }
          searchIndex = idx + keyword.length;
        }
        if (lastIndex !== -1) {
          return text.slice(0, lastIndex).trim();
        }
        return text;
      }

      // Áp dụng cắt cho cả 2 từ khóa
      responseText = cutAfterSecondRepeat(responseText, "Source");
      responseText = cutAfterSecondRepeat(responseText, "https");

      setChatHistory((prev) => [...prev, { sender: "bot", text: responseText }]);
      setMessage("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="chatbot-container">
      <h2>Chat With Pneumonia Chatbot GPT-2</h2>

      <div className="chatbot-messages">
        {chatHistory.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-message ${msg.sender === "user" ? "chat-user" : "chat-bot"}`}
          >
            <div className="chat-icon">
              {msg.sender === "user" ? (
                <i className="fas fa-user-circle" title="You" />
              ) : (
                <i className="fas fa-robot" title="Bot" />
              )}
            </div>
            <div className="chat-text">
              {msg.sender === "bot" ? renderMessageText(msg.text) : msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="chat-message chat-bot thinking">
            <div className="chat-icon">
              <i className="fas fa-robot" title="Bot" />
            </div>
            <div className="chat-text">
              AI Thinking
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {error && <div className="chatbot-error">Lỗi: {error}</div>}

      <form onSubmit={handleSubmit} className="chatbot-form">
        <textarea
          rows={2}
          placeholder="Nhập câu hỏi của bạn..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="chatbot-textarea"
          disabled={loading}
          autoFocus
        />
        <button
          type="submit"
          disabled={loading || !message.trim()}
          className="chatbot-button"
          title="Gửi tin nhắn"
        >
          Gửi <i className="fas fa-paper-plane" />
        </button>
      </form>
    </div>
  );
};

export default ChatBot;
