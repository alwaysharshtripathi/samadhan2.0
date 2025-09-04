# Google Apps Script Setup for ShopHub Reviews

## Problem
Currently, only the timestamp is being saved to the Google Sheet when submitting reviews. This is because the Google Apps Script is not properly processing all the incoming data fields.

## Solution
Replace your current Google Apps Script with the improved version that properly handles all review data fields.

## Steps to Fix

### 1. Open Google Apps Script
1. Go to [script.google.com](https://script.google.com)
2. Open your existing ShopHub Reviews project
3. Or create a new project if needed

### 2. Replace the Code
Replace the entire content of your `Code.gs` file with the code from `google-apps-script-template.gs` in this project.

### 3. Deploy the Script
1. Click on "Deploy" → "New deployment"
2. Choose "Web app" as the type
3. Set "Execute as" to "Me"
4. Set "Who has access" to "Anyone"
5. Click "Deploy"
6. Copy the new Web App URL

### 4. Update the Frontend
Replace the `SHEETS_WEB_APP_URL` in `frontend/reviews.html` with your new Web App URL:

```javascript
const SHEETS_WEB_APP_URL = 'YOUR_NEW_WEB_APP_URL_HERE';
```

### 5. Test the Setup
1. Submit a new review through the frontend
2. Check the Google Sheet to see if all fields are now populated
3. Check the browser console for detailed logging

## What the New Script Does

- **Proper Data Parsing**: Extracts all fields from the incoming JSON data
- **Field Validation**: Ensures all required fields are present
- **Better Error Handling**: Provides detailed error messages
- **Automatic Sheet Creation**: Creates the sheet with proper headers if it doesn't exist
- **Column Auto-sizing**: Automatically adjusts column widths for better readability
- **Comprehensive Logging**: Logs all data processing steps for debugging

## Expected Result
After implementing the new script, your Google Sheet should show all review fields:
- Id
- Name  
- Email
- Rating
- Message
- ClientId
- Date
- Action

## Troubleshooting

If you still have issues:

1. **Check the Google Apps Script logs** in the Apps Script editor
2. **Verify the Web App URL** is correct and accessible
3. **Test with the built-in test function** in the Apps Script editor
4. **Check browser console** for any error messages
5. **Verify the sheet name** matches "ShopHub Reviews"

## Testing the Script

In the Google Apps Script editor, you can run the `testScript()` function to manually test the script with sample data.




