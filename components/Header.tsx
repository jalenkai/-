import React from 'react';
import { Baby, Star } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-rose-500 p-2 rounded-lg text-white">
            <Baby className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">婦幼零售 <span className="text-rose-500">AI 提示詞大師</span></h1>
            <p className="text-xs text-slate-500 font-medium">專業零售業提示詞生成系統</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4 text-sm font-medium text-slate-600">
          <div className="flex items-center gap-1">
             <Star className="w-4 h-4 text-yellow-400 fill-current" />
             <span>專家模式</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;