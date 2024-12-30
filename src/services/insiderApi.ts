
const API_URL  = `${import.meta.env.VITE_API_URL}/getInsider?symbol=`

export async function fetchInsiderData(symbol: string): Promise<{ soma: number; } | null> {
  try {
    // http://localhost:8888/.netlify/functions/getInsider?symbol=ALOS3
    const response = await fetch(`${API_URL}${symbol.toLocaleUpperCase()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
     
    });

    console.log( response);

    return {
      soma : 0
    };
  } catch (error) {
    console.error('Error fetching insider data:', error);
    return null;
  }
}