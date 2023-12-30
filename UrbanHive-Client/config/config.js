export async function fetchServerIP() {
  const response = await fetch("http://10.0.0.18:5000/get_server_ip");
  const data = await response.json();
  return data.server_ip;
}

export async function getConfig() {
  const serverIP = await fetchServerIP();
  return `http://${serverIP}:5000`;
}
