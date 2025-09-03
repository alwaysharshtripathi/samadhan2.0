// Google Apps Script for ShopHub Reviews
// Replace your current Google Apps Script with this one

function doPost(e) {
  try {
    // Log the incoming request for debugging
    console.log('Incoming request:', e);
    
    // Parse the JSON data from the request
    const data = JSON.parse(e.postData.contents);
    console.log('Parsed data:', data);
    
    // Get the active spreadsheet and sheet
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName('ShopHub Reviews');
    
    // If the sheet doesn't exist, create it with headers
    if (!sheet) {
      const newSheet = spreadsheet.insertSheet('ShopHub Reviews');
      newSheet.getRange(1, 1, 1, 8).setValues([['Id', 'Name', 'Email', 'Rating', 'Message', 'ClientId', 'Date', 'Action']]);
      newSheet.getRange(1, 1, 1, 8).setFontWeight('bold');
      newSheet.setFrozenRows(1);
    }
    
    // Extract all the fields from the data
    const id = data.id || '';
    const name = data.name || '';
    const email = data.email || '';
    const rating = data.rating || '';
    const message = data.message || '';
    const clientId = data.clientId || '';
    const date = data.date || new Date().toISOString();
    const action = data.action || 'create';
    
    // Log the extracted data
    console.log('Extracted data:', { id, name, email, rating, message, clientId, date, action });
    
    // Prepare the row data
    const rowData = [id, name, email, rating, message, clientId, date, action];
    
    // Add the new row to the sheet
    const targetSheet = spreadsheet.getSheetByName('ShopHub Reviews');
    targetSheet.appendRow(rowData);
    
    // Auto-resize columns for better readability
    targetSheet.autoResizeColumns(1, 8);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ 
        ok: true, 
        message: 'Review saved successfully',
        savedData: rowData
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error processing request:', error);
    
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({ 
        ok: false, 
        error: error.toString(),
        stack: error.stack
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // Handle GET requests (for testing)
  return ContentService
    .createTextOutput(JSON.stringify({ 
      message: 'ShopHub Reviews Google Apps Script is running',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Function to manually test the script
function testScript() {
  const testData = {
    id: 'test_123',
    name: 'Test User',
    email: 'test@example.com',
    rating: 5,
    message: 'This is a test review',
    clientId: 'client_test',
    date: new Date().toISOString(),
    action: 'create'
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(mockEvent);
  console.log('Test result:', result);
}




