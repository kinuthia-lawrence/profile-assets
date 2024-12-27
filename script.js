// Extract common logic into reusable function:
async function sendRequest(url, data) {
  try {
    const response = await fetch(url, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.text();
    return responseData;
  } catch (error) {
    console.error(error);
    throw error; // rethrow the error for the calling function to handle
  }
}

async function bookNow() {
  // get data
  const data = { /* name, email, date */ };
  
  try {
    const response = await sendRequest('/bookNow', data);
    console.log(response);
  } catch (error) {
    // handle error (if needed)
  }
}

async function reserveTable() {
  // get data
  const data = { /* name, email, guests, date */ };

  try {
    const response = await sendRequest('/reserveTable', data);
    console.log(response);
  } catch (error) {
    // handle error (if needed)
  }
}
