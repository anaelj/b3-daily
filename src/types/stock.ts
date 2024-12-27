export interface StockChecklist {
  insider: boolean;
  volume: boolean;
  obv: boolean;
  adx: boolean;
  margemLiquida: boolean;
  dividendYield: boolean;
  magicFormula: boolean;
  distanciaMedia200: boolean;
  upside: boolean;
}

export interface Stock {
  id?: string;
  symbol: string;
  currentPrice: number;
  distanceNegative: number;
  distancePositive: number;
  targetPrice?: number;
  upside?: number;
  checklist: StockChecklist;
  score: number;
  cpf: string;
  media200?: number;
}

export interface StockAPIResponse {
  totalCount: number;
  data: Array<{
    s: string;
    d: Array<string | number>;
  }>;
}