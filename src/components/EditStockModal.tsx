import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { Stock } from '../types/stock';

interface EditStockModalProps {
  stock: Stock;
  onClose: () => void;
  onSave: (updatedStock: Partial<Stock>) => void;
}

export function EditStockModal({ stock, onClose, onSave }: EditStockModalProps) {
  const [price, setPrice] = useState(stock.currentPrice.toString());
  const [targetPrice, setTargetPrice] = useState(stock.targetPrice?.toString() || '');
  const [distanceNegative, setDistanceNegative] = useState(stock.distanceNegative.toString());
  const [distancePositive, setDistancePositive] = useState(stock.distancePositive.toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedStock: Partial<Stock> = {
      currentPrice: parseFloat(price),
      distanceNegative: parseFloat(distanceNegative),
      distancePositive: parseFloat(distancePositive),
    };

    if (targetPrice) {
      updatedStock.targetPrice = parseFloat(targetPrice);
      updatedStock.upside = ((parseFloat(targetPrice) - parseFloat(price)) / parseFloat(price)) * 100;
    }

    onSave(updatedStock);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>
        
        <h2 className="text-2xl font-bold mb-4">Editar {stock.symbol}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Preço Atual
            </label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Preço Alvo
            </label>
            <input
              type="number"
              step="0.01"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Distância (-)
            </label>
            <input
              type="number"
              step="0.01"
              value={distanceNegative}
              onChange={(e) => setDistanceNegative(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Distância (+)
            </label>
            <input
              type="number"
              step="0.01"
              value={distancePositive}
              onChange={(e) => setDistancePositive(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}