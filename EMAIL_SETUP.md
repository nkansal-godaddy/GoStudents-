# Real Email Setup Guide

## 🚀 Quick Setup

### 1. Copy Environment File
```bash
cp env.example .env.local
```

### 2. Configure SMTP Settings
Edit `.env.local` with your email provider details:

#### Gmail Setup (Recommended)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=danngodaddy@gmail.com
SMTP_PASS=v[97#lYzJ~5K
FROM_EMAIL=dann@godaddy.com
FROM_NAME=GoStudents Team
```

**Gmail App Password Setup:**
1. Enable 2-Factor Authentication on your Google account
2. Go to Google Account Settings → Security → App passwords
3. Generate an app password for "Mail"
4. Use this app password (not your regular password)




### 3. Restart Development Server
```bash
npm run dev
```

## 🔧 How It Works

### Automatic Detection
- **SMTP Configured**: Sends real emails via SMTP
- **SMTP Not Configured**: Falls back to mock email (console logging)

### Email Features
- ✅ **Real SMTP sending** with Nodemailer
- ✅ **HTML formatting** (bold text, line breaks)
- ✅ **Fallback to mock** if SMTP not configured
- ✅ **Error handling** with detailed logging
- ✅ **Multiple recipients** support

### Console Output
**With SMTP configured:**
```
📧 SENDING REAL EMAIL
To: dann@godaddy.com, qwu@godaddy.com, sbhandarkar@godaddy.com, nkansal@godaddy.com
✅ Real email sent successfully: <message-id>
Response: 250 2.0.0 OK
```

**Without SMTP configured:**
```
⚠️ SMTP not configured. Using mock email sending.
📧 MOCK EMAIL SENDING
To: dann@godaddy.com, qwu@godaddy.com, sbhandarkar@godaddy.com, nkansal@godaddy.com
```

## 🧪 Testing

1. **Configure SMTP** in `.env.local`
2. **Restart server**: `npm run dev`
3. **Go to**: `http://localhost:3000/gostudents`
4. **Fill form** and click "Create Account (SSO)"
5. **Check console** for real email sending confirmation
6. **Check recipient inboxes** for the welcome email

## 🔒 Security Notes

- Never commit `.env.local` to version control
- Use app passwords, not regular passwords
- Consider using environment-specific SMTP settings
- Monitor email sending limits and quotas

## 🆘 Troubleshooting

### "Authentication failed"
- Check username/password
- Ensure 2FA is enabled and using app password
- Verify SMTP settings for your provider

### "Connection timeout"
- Check firewall settings
- Verify SMTP host and port
- Try different SMTP port (465 for SSL, 587 for TLS)

### "Rate limit exceeded"
- Wait before sending more emails
- Check your email provider's sending limits
- Consider using a dedicated email service
