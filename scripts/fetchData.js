export const fetchData = async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // Set timeout to 5 seconds
  
    try {
      const response = await fetch('http://ezgoing.app/api/serverstatus', {
        signal: controller.signal, // Attach the abort signal
      });
      const data = await response.json();
      console.log(data.message); // This should log "Server is Running"
      return true;
  
    } catch (error) {
        console.error('Error fetching data:', error);
        return false;
    } finally {
      clearTimeout(timeout); // Clear the timeout once the request completes
    }
  };