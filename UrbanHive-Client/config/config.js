/**
 * Fetches the server IP address from a specified URL.
 * This function makes a network request to retrieve the server IP.
 *
 * @returns {Promise<string>} A promise that resolves to the server IP address.
 */
export async function fetchServerIP() {
  const response = await fetch("http://192.168.1.235:5000/get_server_ip"); // Make an HTTP GET request to the server
  const data = await response.json(); // Parse the JSON response body
  return data.server_ip; // Return the server IP address from the response
}

/**
 * Retrieves the full configuration endpoint URL using the server IP.
 * This function depends on fetchServerIP to first get the IP.
 *
 * @returns {Promise<string>} A promise that resolves to the full URL of the server configuration endpoint.
 */
export async function getConfig() {
  const serverIP = await fetchServerIP(); // Fetch the server IP using the above function
  return `http://${serverIP}:5000`; // Construct and return the full URL using the retrieved server IP
}
