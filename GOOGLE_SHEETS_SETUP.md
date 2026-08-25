# Free Google Sheets Integration for Hindustan Tea Co. Invitations

Follow these simple steps (takes under 2 minutes) to automatically collect invitation requests in your Google Sheet for free:

---

### Step 1: Create a New Google Sheet
1. Go to [sheets.new](https://sheets.new) in your browser.
2. Name the sheet **Hindustan Tea Invitations**.
3. In Row 1, add these column headers:
   - **A1**: `Timestamp`
   - **B1**: `Email`
   - **C1**: `Source`

---

### Step 2: Open Apps Script
1. In your Google Sheet, click on **Extensions** in the top menu $\rightarrow$ **Apps Script**.
2. Delete any existing code in `Code.gs` and paste the following snippet:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    var email = e.parameter.email || "No Email";
    var timestamp = e.parameter.timestamp || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    var source = e.parameter.source || "Website";
    
    // Append the new invitation row
    sheet.appendRow([timestamp, email, source]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", email: email }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

---

### Step 3: Deploy as a Free Web App
1. In Apps Script, click the blue **Deploy** button (top right) $\rightarrow$ **New deployment**.
2. Click the gear icon ⚙️ next to *Select type* and select **Web app**.
3. Configure the settings:
   - **Description**: `Hindustan Tea Lead Collector`
   - **Execute as**: `Me (your email)`
   - **Who has access**: **`Anyone`** *(Important: Choose "Anyone" so visitors can submit without logging into Google)*
4. Click **Deploy** and authorize access if prompted.
5. Copy the **Web App URL** (it looks like `https://script.google.com/macros/s/AKfycbx.../exec`).

---

### Step 4: Paste into `script.js`
Open [`script.js`](file:///d:/AI%20Projects/HteaC/script.js) and paste your URL into line 144:

```javascript
const GOOGLE_SHEET_WEBAPP_URL = "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec";
```

That's it! Every invitation request submitted on the website will now appear in your Google Sheet in real time.
