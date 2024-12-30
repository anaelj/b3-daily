import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { PlusCircle } from "lucide-react";
import { db } from "./lib/firebase";
import { StockCard } from "./components/StockCard";
import type { Stock } from "./types/stock";
import { validateCPF } from "./utils/cpf";
import { fetchStockData } from "./services/stockApi";
import { fetchInsiderData } from "./services/insiderApi";

function App() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [newSymbol, setNewSymbol] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newTargetPrice, setNewTargetPrice] = useState("");
  const [cpf, setCpf] = useState("");
  const [cpfError, setCpfError] = useState("");

  useEffect(() => {
    const cpfLocal = localStorage.getItem("dailyb3-cpf");
    if (cpfLocal) setCpf(cpfLocal);
  }, []);

  useEffect(() => {
    if (!cpf) return;
    localStorage.setItem("dailyb3-cpf", cpf);

    const unsubscribe = onSnapshot(
      collection(db, "daily_stocks"),
      (snapshot) => {
        const stocksData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Stock[];

        const filteredStocks = stocksData.filter((stock) => stock.cpf === cpf);

        setStocks(filteredStocks.sort((a, b) => b.score - a.score));
      }
    );

    return () => unsubscribe();
  }, [cpf]);

  const calculateScore = (checklist: Stock["checklist"]): number => {
    return Object.values(checklist).filter(Boolean).length;
  };

  const handleAddStock = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newSymbol || !newPrice || !cpf) return;
    if (!validateCPF(cpf)) {
      setCpfError("CPF inválido");
      return;
    }
    setCpfError("");

    const targetPrice = newTargetPrice ? parseFloat(newTargetPrice) : undefined;

    const newStock: Partial<Stock> = {
      symbol: newSymbol.toUpperCase(),
      distanceNegative: -0,
      distancePositive: 0,
      targetPrice,
      checklist: {
        insider: false,
        volume: false,
        obv: false,
        adx: false,
        margemLiquida: false,
        dividendYield: false,
        magicFormula: false,
        distanciaMedia200: false,
        upside: false,
        plAverage: false,
      },
      score: 0,
      cpf,
    };

    const onLineData = await getCurrentStockData(newStock, newSymbol);

    await setDoc(doc(db, "daily_stocks", newStock.symbol), {
      ...newStock,
      ...onLineData,
    });

    setNewSymbol("");
    setNewPrice("");
    setNewTargetPrice("");
  };

  // useEffect(() => {
  //   fetchInsiderData("ALOS3");
  // }, []);

  const handleChecklistChange = async (
    symbol: string,
    field: keyof Stock["checklist"],
    value: boolean
  ) => {
    const stock = stocks.find((s) => s.symbol === symbol);
    if (!stock) return;

    const updatedChecklist = {
      ...stock.checklist,
      [field]: value,
    };

    const updatedStock = {
      ...stock,
      checklist: updatedChecklist,
      score: calculateScore(updatedChecklist),
    };

    await updateDoc(doc(db, "daily_stocks", symbol), updatedStock);
  };

  const getCurrentStockData = async (
    oldStock: Partial<Stock>,
    symbol: string
  ) => {
    const stockData = await fetchStockData(symbol);
    const currentPrice = stockData?.price || parseFloat(newPrice);
    const media200 = stockData?.media200;
    const upside = oldStock.targetPrice
      ? ((oldStock.targetPrice - currentPrice) / currentPrice) * 100
      : undefined;
    return { currentPrice, media200, upside };
  };

  const handleStockUpdate = async (symbol: string, updates: Partial<Stock>) => {
    const onLineData = await getCurrentStockData(updates, symbol);

    await updateDoc(doc(db, "daily_stocks", symbol), {
      ...updates,
      ...onLineData,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Análise de Ações</h1>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-4">
            <label
              htmlFor="cpf"
              className="block text-sm font-medium text-gray-700"
            >
              CPF
            </label>
            <input
              type="text"
              id="cpf"
              placeholder="Digite seu CPF"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border"
            />
            {cpfError && (
              <p className="mt-1 text-sm text-red-600">{cpfError}</p>
            )}
          </div>

          {cpf && validateCPF(cpf) && (
            <form onSubmit={handleAddStock} className="flex gap-4">
              <input
                type="text"
                placeholder="Símbolo"
                value={newSymbol}
                onChange={(e) => setNewSymbol(e.target.value)}
                className="flex-1 p-2 border rounded"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Preço Atual"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="flex-1 p-2 border rounded"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Preço Alvo (opcional)"
                value={newTargetPrice}
                onChange={(e) => setNewTargetPrice(e.target.value)}
                className="flex-1 p-2 border rounded"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
              >
                <PlusCircle className="w-5 h-5" />
                Adicionar
              </button>
            </form>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stocks.map((stock) => (
            <StockCard
              key={stock.symbol}
              stock={stock}
              onChecklistChange={handleChecklistChange}
              onStockUpdate={handleStockUpdate}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
