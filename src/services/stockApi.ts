// const API_URL = 'https://bestchoice-serverless.netlify.app/.netlify/functions/post';
// const API_URL = 'http://localhost:8888/.netlify/functions/post';
const API_URL  = `${import.meta.env.VITE_API_URL}/post`

export async function fetchStockData(symbol: string): Promise<{ price: number; media200: number } | null> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-target-url': 'https://scanner.tradingview.com/brazil/scan'
      },
      body: JSON.stringify({
        columns: ["name", "description", "close", "SMA200"],
        filter: [{left: "name", operation: "match", right: symbol.toUpperCase()}],
        markets: ["brazil"],
        options: { lang: "pt" },
        range: [0, 1000],
        sort: { sortBy: "return_on_invested_capital_fq", sortOrder: "desc" },
        symbols: { symbolset: [] }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch stock data');
    }


    const data: { totalCount: number; data: Array<{ s: string; d: any[] }> } = await response.json();

    // console.log('data@@##', data)
    const stockData = data.data.find(item => item.s === `BMFBOVESPA:${symbol.toUpperCase()}`);

    if (!stockData) return null;

    return {
      price: stockData.d[2] as number,
      media200: stockData.d[3] as number
    };
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return null;
  }
}