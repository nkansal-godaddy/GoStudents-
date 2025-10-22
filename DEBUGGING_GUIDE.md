# Debugging Guide for Offer Page Network Errors

## ✅ **Solution Implemented**

The network error you were experiencing was most likely caused by **CORS (Cross-Origin Resource Sharing)** restrictions. When you call external APIs directly from the browser (client-side), the browser blocks the request unless the API server explicitly allows your origin.

### **What Was Fixed:**

1. ✅ Created **API proxy routes** in Next.js to handle external API calls server-side
   - `/api/catalog` - Proxies catalog query requests
   - `/api/orders` - Proxies order shim requests

2. ✅ Updated **Offer Page** to use proxy routes instead of calling external APIs directly

3. ✅ Added **enhanced logging** to help debug issues

---

## 🔍 **How to Debug Network Errors**

### **Step 1: Check Browser Console**

1. Open Developer Tools (Press `F12` or `Cmd+Option+I` on Mac)
2. Go to the **Console** tab
3. Look for:
   - `Calling catalog API...` (confirms the fetch started)
   - `Catalog API response:` (shows successful response data)
   - `Catalog API error response:` or `Catalog API error text:` (shows error details)
   - Any red error messages

### **Step 2: Check Network Tab**

1. In Developer Tools → **Network** tab
2. Filter by **Fetch/XHR**
3. Click the "Claim Your Student Offer" button
4. Look for requests to:
   - `/api/catalog` - Should show status 200 or error code
   - `/api/orders` - Should show status 200 or error code

5. Click on each request to see:
   - **Headers** tab: Request headers sent
   - **Payload** tab: Data you sent
   - **Response** tab: What the server returned
   - **Preview** tab: Formatted response

### **Step 3: Check Server Logs**

Since the API calls now run server-side, check your Next.js terminal for:
- `Catalog proxy error:` messages
- `Orders proxy error:` messages
- Stack traces with more details

---

## 🚨 **Common Issues and Solutions**

### **1. "Catalog API failed with status: 401"**
**Cause:** Invalid or expired SSO authorization token

**Solution:**
- Verify your SSO JWT token is valid
- Check that the token hasn't expired
- Ensure the token format is correct (should be a JWT string)

**Debug Steps:**
```bash
# Test the token directly with curl
curl --location 'https://catalog-query-ext.cp.api.test.godaddy.com/v2/catalog/offers?rateForDisplay=true' \
--header 'Authorization: sso-jwt YOUR_TOKEN_HERE' \
--header 'Content-Type: application/json' \
--data '{
    "currency": "USD",
    "marketId": "en-US",
    "curatedOfferId": "airo-all-access-with-freetrial",
    "term": {
        "termType": "MONTH",
        "numberOfTerms": 12
    }
}'
```

### **2. "Catalog API failed with status: 404"**
**Cause:** API endpoint doesn't exist or curated offer ID is invalid

**Solution:**
- Verify the API endpoint URL is correct
- Check that `curatedOfferId: "airo-all-access-with-freetrial"` exists
- Confirm you're using the right environment (test vs prod)

### **3. "Catalog API failed with status: 500"**
**Cause:** Internal server error on GoDaddy's API

**Solution:**
- Check if the API is down or having issues
- Look at the error response for more details
- Try again after a few minutes

### **4. "Network error: Unable to connect to catalog service"**
**Cause:** This should now be fixed with proxy routes, but if you still see it:

**Debug Steps:**
1. Verify Next.js dev server is running (`npm run dev`)
2. Check if you can access `http://localhost:3000/api/catalog` directly
3. Test from terminal:
```bash
curl -X POST http://localhost:3000/api/catalog \
  -H "Content-Type: application/json" \
  -d '{
    "ssoAuth": "YOUR_TOKEN",
    "currency": "USD",
    "marketId": "en-US",
    "curatedOfferId": "airo-all-access-with-freetrial",
    "term": {
      "termType": "MONTH",
      "numberOfTerms": 12
    }
  }'
```

### **5. "No catalog instance key found in response"**
**Cause:** The API response doesn't contain expected data structure

**Solution:**
- Check the console log: `Catalog API response:` to see what was returned
- Verify the response has a `plans` array with at least one item
- Check that each plan has a `catalogInstanceKey` field

---

## 🧪 **Testing the API Endpoints**

### **Test Catalog API:**

```bash
curl -X POST http://localhost:3000/api/catalog \
  -H "Content-Type: application/json" \
  -d '{
    "ssoAuth": "YOUR_SSO_JWT_TOKEN_HERE",
    "currency": "USD",
    "marketId": "en-US",
    "curatedOfferId": "airo-all-access-with-freetrial",
    "term": {
      "termType": "MONTH",
      "numberOfTerms": 12
    }
  }'
```

### **Test Orders API:**

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "ssoAuth": "YOUR_SSO_JWT_TOKEN_HERE",
    "basketId": "test-basket-id-123",
    "idempotentId": "test-idempotent-id-456",
    "currency": "USD",
    "marketId": "en-US",
    "items": [{
      "key": "test-key-789",
      "item": {
        "catalogInstanceKey": "test-catalog-key",
        "intent": "FREE_TRIAL_PURCHASE"
      }
    }]
  }'
```

---

## 📝 **Console Logging**

The application now logs the following for debugging:

### **Client-Side (Browser Console):**
- `Calling catalog API...` - Fetch initiated
- `Catalog API response: {...}` - Successful response
- `Catalog API error response: {...}` - Error details
- `Calling orders API with basketId: ...` - Order creation started

### **Server-Side (Terminal):**
- `Catalog proxy error:` - Errors from catalog API route
- `Orders proxy error:` - Errors from orders API route

---

## 🔧 **Environment Troubleshooting**

### **If localhost isn't working:**

1. Check Next.js is running:
```bash
npm run dev
```

2. Verify the correct port (usually 3000):
```
✓ Ready on http://localhost:3000
```

3. Try accessing the page directly:
- `http://localhost:3000/offer`

### **If you need to change API endpoints:**

Edit the proxy files:
- `/app/api/catalog/route.ts` - Line 17 (catalog API URL)
- `/app/api/orders/route.ts` - Line 31 (orders API URL)

---

## 📞 **Still Having Issues?**

If you're still experiencing problems:

1. **Share the Browser Console logs** - Copy all red error messages
2. **Share the Network tab details** - Take screenshots of failed requests
3. **Share the Terminal output** - Copy any server-side errors
4. **Test with curl** - Run the curl commands above and share results
5. **Verify your SSO token** - Ensure it's valid and not expired

---

## 🎯 **Quick Checklist**

- [ ] Next.js dev server is running
- [ ] Browser console shows no CORS errors
- [ ] Network tab shows requests to `/api/catalog` and `/api/orders`
- [ ] SSO JWT token is valid and correctly formatted
- [ ] API endpoints are accessible (test with curl)
- [ ] Response contains expected data structure
- [ ] No firewall or proxy blocking external API calls

