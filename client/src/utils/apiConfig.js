/**
 * Generates the correct backend API URL dynamically based on the current hostname.
 * This ensures that local development on mobile devices (e.g. 192.168.x.x) or other 
 * local hosts will hit the local backend port 5000 directly instead of crashing or hitting production.
 */
export const getBaseUrl = (pathSuffix = "") => {
  const hostname = window.location.hostname;
  const isLocal = hostname === "localhost" || 
                  hostname === "127.0.0.1" || 
                  hostname.startsWith("192.168.") || 
                  hostname.startsWith("10.") || 
                  hostname.startsWith("172.");
  
  const base = isLocal 
    ? `http://${hostname}:5000/api` 
    : "https://aktunotesapp.onrender.com/api";
    
  return pathSuffix ? `${base}/${pathSuffix}` : base;
};
