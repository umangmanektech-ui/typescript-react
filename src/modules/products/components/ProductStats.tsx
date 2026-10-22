import React from 'react';
import type { Product } from '../../../types/product';
import { Package, Tags, DollarSign, AlertTriangle } from 'lucide-react';

interface ProductStatsProps {
  products: Product[];
  totalCount: number;
  totalCategories: number;
}

export const ProductStats: React.FC<ProductStatsProps> = ({
  products,
  totalCount,
  totalCategories,
}) => {
  const avgPrice = products.length
    ? (
        products.reduce((acc, curr) => acc + (curr.price || 0), 0) /
        products.length
      ).toFixed(2)
    : '0.00';

  const lowStockCount = products.filter((p) => (p.stock || 0) < 10).length;

  const stats = [
    {
      label: 'Total Catalog',
      value: totalCount,
      icon: <Package className="w-5 h-5 text-indigo-400" />,
      subtext: 'DummyJSON database',
      gradient: 'from-indigo-500/10 to-indigo-500/5',
      border: 'border-indigo-500/20',
    },
    {
      label: 'Categories',
      value: totalCategories,
      icon: <Tags className="w-5 h-5 text-violet-400" />,
      subtext: 'Marketplace sectors',
      gradient: 'from-violet-500/10 to-violet-500/5',
      border: 'border-violet-500/20',
    },
    {
      label: 'Avg. Page Price',
      value: `$${avgPrice}`,
      icon: <DollarSign className="w-5 h-5 text-emerald-400" />,
      subtext: 'Current page average',
      gradient: 'from-emerald-500/10 to-emerald-500/5',
      border: 'border-emerald-500/20',
    },
    {
      label: 'Low Stock Items',
      value: lowStockCount,
      icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
      subtext: 'Stock under 10 units',
      gradient: 'from-amber-500/10 to-amber-500/5',
      border: 'border-amber-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {stats.map((stat, i) => (
        <div
          key={i}
          className={`p-4 rounded-2xl bg-gradient-to-br ${stat.gradient} border ${stat.border} backdrop-blur-sm relative overflow-hidden group hover:border-slate-700 transition-all duration-300`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">{stat.label}</span>
            <div className="p-2 rounded-xl bg-slate-900/60 border border-white/5">
              {stat.icon}
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {stat.value}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">{stat.subtext}</div>
        </div>
      ))}
    </div>
  );
};
