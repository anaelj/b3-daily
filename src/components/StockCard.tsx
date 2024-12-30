import React, { useState } from "react";
import { Check, X, Edit2 } from "lucide-react";
import type { Stock } from "../types/stock";
import { EditStockModal } from "./EditStockModal";

interface StockCardProps {
  stock: Stock;
  onChecklistChange: (
    symbol: string,
    field: keyof Stock["checklist"],
    value: boolean
  ) => void;
  onStockUpdate: (symbol: string, updates: Partial<Stock>) => void;
}

export function StockCard({
  stock,
  onChecklistChange,
  onStockUpdate,
}: StockCardProps) {
  const [showEditModal, setShowEditModal] = useState(false);

  const checklistItems = [
    { key: "insider", label: "Insider" },
    { key: "volume", label: "Volume" },
    { key: "obv", label: "OBV" },
    { key: "adx", label: "ADX" },
    { key: "margemLiquida", label: "Margem Líquida" },
    { key: "dividendYield", label: "Dividend Yield" },
    { key: "magicFormula", label: "Magic Formula" },
    { key: "distanciaMedia200", label: "Distância Média 200" },
    { key: "upside", label: "Upside" },
    { key: "plAverage", label: "PL Médio" },
  ];

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">{stock.symbol}</h2>
          <div className="flex items-center gap-4">
            <span className="text-lg font-semibold text-gray-600">
              Score: {stock.score}
            </span>
            <button
              onClick={() => setShowEditModal(true)}
              className="text-gray-600 hover:text-gray-800"
            >
              <Edit2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-gray-600">
              Preço Atual: R$ {stock.currentPrice.toFixed(2)}
            </p>
            <p className="text-gray-600">
              Distância (-): {stock.distanceNegative.toFixed(2)}%
            </p>
            <p className="text-gray-600">
              Distância (+): {stock.distancePositive.toFixed(2)}%
            </p>
            {stock.media200 && (
              <p className="text-gray-600">
                Média 200: R$ {stock.media200.toFixed(2)}
              </p>
            )}
          </div>
          <div className="space-y-2">
            {stock.targetPrice && (
              <>
                <p className="text-gray-600">
                  Preço Alvo: R$ {stock.targetPrice.toFixed(2)}
                </p>
                <p className="text-gray-600">
                  Upside: {stock.upside?.toFixed(2)}%
                </p>
              </>
            )}
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold mb-2">Checklist</h3>
          <div className="grid grid-cols-2 gap-2">
            {checklistItems.map(({ key, label }) => (
              <div
                key={key}
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() =>
                  onChecklistChange(
                    stock.symbol,
                    key as keyof Stock["checklist"],
                    !stock.checklist[key as keyof Stock["checklist"]]
                  )
                }
              >
                <div
                  className={`p-1 rounded ${
                    stock.checklist[key as keyof Stock["checklist"]]
                      ? "bg-green-100"
                      : "bg-red-100"
                  }`}
                >
                  {stock.checklist[key as keyof Stock["checklist"]] ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <X className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <span className="text-sm text-gray-700">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showEditModal && (
        <EditStockModal
          stock={stock}
          onClose={() => setShowEditModal(false)}
          onSave={(updates) => onStockUpdate(stock.symbol, updates)}
        />
      )}
    </>
  );
}
