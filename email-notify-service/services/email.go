package services

import (
	"bytes"
	"encoding/base64"
	"fmt"
	"io/ioutil"
	"log"
	"net/smtp"
	"os"
)

func SendLoginNotificationEmail(toEmail, userName string) error {
	host := os.Getenv("SMTP_HOST")
	port := os.Getenv("SMTP_PORT")
	user := os.Getenv("SMTP_USER")
	pass := os.Getenv("SMTP_PASS")

	auth := smtp.PlainAuth("", user, pass, host)
	addr := host + ":" + port

	// Đọc ảnh local
	imgPath := "./assets/logo_penumonia.png"
	imgBytes, err := ioutil.ReadFile(imgPath)
	if err != nil {
		log.Printf("Lỗi đọc ảnh: %v", err)
		return err
	}
	imgBase64 := base64.StdEncoding.EncodeToString(imgBytes)

	var buf bytes.Buffer
	boundary := "my-boundary-123"

	buf.WriteString(fmt.Sprintf("From: %s\r\n", user))
	buf.WriteString(fmt.Sprintf("To: %s\r\n", toEmail))
	buf.WriteString("Subject: Chào mừng bạn đến với AI Pneumonia\r\n")
	buf.WriteString("MIME-Version: 1.0\r\n")
	buf.WriteString(fmt.Sprintf("Content-Type: multipart/related; boundary=%s\r\n", boundary))
	buf.WriteString("\r\n")

	// HTML body
	buf.WriteString(fmt.Sprintf("--%s\r\n", boundary))
	buf.WriteString("Content-Type: text/html; charset=\"UTF-8\"\r\n")
	buf.WriteString("\r\n")
	buf.WriteString(fmt.Sprintf(`
<html>
  <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
      <div style="padding: 30px;">
        <h2 style="color: #2E86DE;">👋 Xin chào %s!</h2>
        <p style="font-size: 16px; color: #333;">
          Chào mừng bạn đến với <strong>AI Pneumonia</strong> – nền tảng hỗ trợ chẩn đoán viêm phổi từ ảnh X-quang bằng trí tuệ nhân tạo.
        </p>
        <img src="cid:image1" alt="Chào mừng" style="width: 100%%; border-radius: 8px; margin: 20px 0;" />
        <p style="font-size: 16px; color: #333;">
          Hãy thử tải lên ảnh X-quang để nhận phân tích thông minh, trực quan và hỗ trợ bác sĩ trong quá trình chẩn đoán nhanh chóng hơn.
        </p>
        <div style="margin: 20px 0;">
          👉 <strong>Website:</strong> AIPneumonia.com<br/>
          👉 <strong>Facebook:</strong> AI Pneumonia Fanpage<br/>
          👉 <strong>LinkedIn:</strong> AI Pneumonia Community
        </div>
        <p style="font-size: 12px; color: #aaa; text-align: center;">
          (Email này được gửi tự động. Vui lòng không phản hồi.)
        </p>
      </div>
    </div>
  </body>
</html>
`, userName))
	buf.WriteString("\r\n")

	// Inline image
	buf.WriteString(fmt.Sprintf("--%s\r\n", boundary))
	buf.WriteString("Content-Type: image/png\r\n")
	buf.WriteString("Content-Transfer-Encoding: base64\r\n")
	buf.WriteString("Content-ID: <image1>\r\n")
	buf.WriteString("\r\n")
	buf.WriteString(imgBase64)
	buf.WriteString("\r\n")

	// End of MIME
	buf.WriteString(fmt.Sprintf("--%s--\r\n", boundary))

	// Gửi email
	err = smtp.SendMail(addr, auth, user, []string{toEmail}, buf.Bytes())
	if err != nil {
		log.Printf("Lỗi gửi email: %v", err)
		return err
	}
	return nil
}
