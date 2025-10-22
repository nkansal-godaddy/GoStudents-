# Order API 404 Error - Troubleshooting Guide

## 🔴 **Error: "Order API failed with status: 404"**

This error indicates that the orders API endpoint cannot be found. Here are the most common causes and solutions:

---

## 🔍 **Immediate Debugging Steps**

### **1. Check Server Logs (Terminal)**

With the new logging, you should now see detailed information in your Next.js terminal:

```
Calling orders API: https://orders-shim-ext.cp.api.test.godaddy.com/v2/customers/.../orders/[basketId]/add
Order payload: { ... }
Orders API status: 404
Orders API response: { ... }
```

**Look for:**
- The exact URL being called
- The payload being sent
- The error response from the API

### **2. Check Browser Console**

Look for these logs:
- `Calling orders API with basketId: xxx`
- `Order API error response: {...}`

---

## 🚨 **Common Causes & Solutions**

### **1. Invalid Customer ID (Most Likely)**

**Problem:** The customer ID is hardcoded as `a9b3f6a1-eb44-4154-b26d-1d7a016ad065` which might not:
- Exist in the test environment
- Match the SSO token you're using
- Have permission to create orders

**Solution:** You need to get the correct customer ID. This typically comes from:

#### **Option A: Extract from SSO Token**
The customer ID might be encoded in your SSO JWT token. Let me create a helper to extract it:

```typescript
// Decode JWT to get customer ID
function getCustomerIdFromToken(ssoToken: string): string | null {
  try {
    const parts = ssoToken.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(atob(parts[1]));
    return payload.customerId || payload.sub || payload.customer_id || null;
  } catch {
    return null;
  }
}
```

#### **Option B: Call a Profile/Me Endpoint**
Some APIs have an endpoint to get the current user's customer ID:

```bash
curl --location 'https://api.test.godaddy.com/v1/me' \
--header 'Authorization: sso-jwt YOUR_TOKEN'
```

#### **Option C: Use a Different Endpoint**
The orders API might support a "me" or "current" customer identifier:

```
/v2/customers/me/orders/...
# or
/v2/orders/...  (without customer ID in path)
```

### **2. Basket Creation Required**

**Problem:** You might need to CREATE a basket first before adding items to it.

**Current approach:**
```
POST /orders/{basketId}/add  ← This assumes basket exists
```

**Correct approach might be:**
```
POST /orders/create          ← Create basket first
POST /orders/{basketId}/add  ← Then add items
```

**Solution:** Check if there's a basket creation endpoint:

```bash
# Try creating a basket first
curl --location 'https://orders-shim-ext.cp.api.test.godaddy.com/v2/customers/a9b3f6a1-eb44-4154-b26d-1d7a016ad065/orders' \
--header 'Authorization: sso-jwt YOUR_TOKEN' \
--header 'Content-Type: application/json' \
--data '{}'
```

### **3. Wrong URL Structure**

**Problem:** The endpoint structure might be different.

**Current (UPDATED):**
```
/v2/customers/{customerId}/orders/cart/add
```

The endpoint now uses the literal word "cart" instead of a dynamic basketId variable.

### **4. API Endpoint Changed/Deprecated**

**Problem:** The test environment endpoint might be different from production.

**Check:**
- Is there API documentation you can reference?
- Try removing `/add` from the URL
- Try using `/v1/` instead of `/v2/`

---

## 🧪 **Testing Different Scenarios**

### **Test 1: Verify the Endpoint Exists**

```bash
# Try a GET request to see if the endpoint exists
curl --location 'https://orders-shim-ext.cp.api.test.godaddy.com/v2/customers/a9b3f6a1-eb44-4154-b26d-1d7a016ad065/orders/cart' \
--header 'Authorization: sso-jwt YOUR_TOKEN'
```

### **Test 2: Try Without Customer ID**

```bash
# Some APIs don't need customer ID in the path
curl --location 'https://orders-shim-ext.cp.api.test.godaddy.com/v2/orders' \
--header 'Authorization: sso-jwt YOUR_TOKEN' \
--header 'Content-Type: application/json' \
--data '{
  "currency": "USD",
  "marketId": "en-US"
}'
```

### **Test 3: Check for Different Endpoint**

```bash
# Try basket endpoint instead of orders
curl --location 'https://orders-shim-ext.cp.api.test.godaddy.com/v2/baskets' \
--header 'Authorization: sso-jwt YOUR_TOKEN'
```

---

## 🔧 **Code Modifications to Try**

### **Modification 1: Dynamic Customer ID**

I'll create an updated version that extracts the customer ID from the token:

**In `/app/api/orders/route.ts`:**

```typescript
// Add this function at the top
function getCustomerIdFromToken(ssoToken: string): string | null {
  try {
    const parts = ssoToken.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    return payload.customerId || payload.sub || payload.customer_id || null;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

// Then in the POST function, replace the hardcoded customer ID:
const customerId = getCustomerIdFromToken(ssoAuth) || 'a9b3f6a1-eb44-4154-b26d-1d7a016ad065';
const orderUrl = `https://orders-shim-ext.cp.api.test.godaddy.com/v2/customers/${customerId}/orders/${basketId}/add`;
```

### **Modification 2: Try Alternative Endpoint Structure**

Try removing `/add` from the URL:

```typescript
const orderUrl = `https://orders-shim-ext.cp.api.test.godaddy.com/v2/customers/a9b3f6a1-eb44-4154-b26d-1d7a016ad065/orders/${basketId}`;
```

### **Modification 3: Use Different Base URL**

The endpoint might be at a different location:

```typescript
// Try cart instead of orders
const orderUrl = `https://orders-shim-ext.cp.api.test.godaddy.com/v2/carts/${basketId}/items`;

// Or try without customer ID
const orderUrl = `https://orders-shim-ext.cp.api.test.godaddy.com/v2/orders/${basketId}/items`;
```

---

## 📋 **Information to Gather**

To properly fix this, you need:

1. **API Documentation:** Do you have access to the orders-shim API documentation?
2. **Valid Customer ID:** What's the correct customer ID for your SSO token?
3. **Endpoint Structure:** What's the correct URL structure for adding items to an order?
4. **API Response:** What's the actual error message in the 404 response? (Check server logs)

---

## 🎯 **Next Steps**

1. **Check your terminal** for the new detailed logs showing:
   - Exact URL being called
   - Payload being sent
   - API response body

2. **Copy the curl equivalent** from the logs and test it directly:
   ```bash
   curl --location 'THE_URL_FROM_LOGS' \
   --header 'Authorization: sso-jwt YOUR_TOKEN' \
   --header 'Idempotent-Id: GUID' \
   --header 'Content-Type: application/json' \
   --data 'THE_PAYLOAD_FROM_LOGS'
   ```

3. **Check the API response** - it might contain hints about:
   - The correct endpoint URL
   - Missing required parameters
   - Authentication issues

4. **Contact GoDaddy API Support** if you have access, with:
   - The exact error message
   - The URL you're trying to call
   - Your customer/account ID

---

## 💡 **Questions to Answer**

1. What does the server log show for "Orders API response"?
2. Do you have API documentation for the orders-shim service?
3. What customer ID should be used with your SSO token?
4. Is there a basket creation step required before adding items?

Share the answers and I can help you fix the exact issue!

