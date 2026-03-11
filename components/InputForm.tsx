import React, { useState, useEffect } from 'react';
import { PromptInputs, RoleType } from '../types';
import { ROLES } from '../constants';
import { Sparkles, Edit3, ChevronDown } from 'lucide-react';

interface InputFormProps {
  isLoading: boolean;
  onSubmit: (inputs: PromptInputs) => void;
}

const InputForm: React.FC<InputFormProps> = ({ isLoading, onSubmit }) => {
  const [role, setRole] = useState<RoleType>('marketing');
  const [task, setTask] = useState('');
  const [productInfo, setProductInfo] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [tone, setTone] = useState('');
  const [constraints, setConstraints] = useState('');
  
  // Character count for constraints
  const constraintLength = constraints.length;
  const MAX_CONSTRAINT_LENGTH = 100;

  // Update suggestions when role changes
  const activeRoleDef = ROLES.find(r => r.id === role);

  // Set default tone when role changes if empty
  useEffect(() => {
    if (activeRoleDef && activeRoleDef.suggestedTones.length > 0) {
      setTone(activeRoleDef.suggestedTones[0]);
    }
  }, [role, activeRoleDef]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ role, task, productInfo, targetAudience, tone, constraints });
  };

  const handleTaskSuggestion = (suggestion: string) => {
    setTask(suggestion);
  };

  const handleAudienceSuggestion = (suggestion: string) => {
    // Append if not empty, otherwise set
    if (targetAudience) {
      // Avoid duplicates
      if (!targetAudience.includes(suggestion)) {
         setTargetAudience(prev => `${prev}, ${suggestion}`);
      }
    } else {
      setTargetAudience(suggestion);
    }
  };

  // Common styles for input fields to support white text on dark background
  const inputStyles = "w-full p-3 rounded-lg border border-slate-600 bg-slate-800 text-white placeholder-slate-400 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all";
  const labelStyles = "block text-sm font-medium text-slate-700 mb-2";
  const chipStyles = "text-xs bg-slate-100 text-slate-600 px-3 py-2 rounded-lg hover:bg-rose-100 hover:text-rose-700 transition-colors border border-slate-200 cursor-pointer text-left flex items-center gap-1";
  
  // Scrollable container style
  const suggestionContainerStyles = "mt-3 border border-slate-200 rounded-xl p-3 bg-slate-50 max-h-48 overflow-y-auto custom-scrollbar";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 text-sm">1</span>
          定義工作情境
        </h2>

        {/* Role Selection */}
        <div className="mb-8">
          <label className={labelStyles}>角色 / 部門範疇</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {ROLES.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={`p-3 rounded-xl border text-left transition-all h-full flex flex-col justify-between ${
                  role === r.id
                    ? 'border-rose-500 bg-rose-50 ring-1 ring-rose-500'
                    : 'border-slate-200 hover:border-rose-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between w-full mb-2">
                   <div className={`font-bold text-sm ${role === r.id ? 'text-rose-900' : 'text-slate-800'}`}>
                     {r.label}
                   </div>
                </div>
                <div className="text-xs text-slate-500 line-clamp-2">{r.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Task Input */}
        <div className="mb-8">
          <label className={labelStyles}>具體任務 <span className="text-slate-400 font-normal ml-2 text-xs">點選下方清單帶入</span></label>
          <input
            type="text"
            required
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder={`例如：${activeRoleDef?.suggestedTasks[0] || '輸入任務...'}`}
            className={inputStyles}
          />
          {/* Scrollable Suggestions */}
          <div className={suggestionContainerStyles}>
             <div className="text-xs text-slate-400 mb-2 sticky top-0 bg-slate-50 pb-1 border-b border-slate-100">點擊選擇建議：</div>
             <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {activeRoleDef?.suggestedTasks.map((s, idx) => (
                <button
                    key={idx}
                    type="button"
                    onClick={() => handleTaskSuggestion(s)}
                    className={chipStyles}
                >
                    <span className="truncate w-full" title={s}>+ {s}</span>
                </button>
                ))}
             </div>
          </div>
        </div>

        {/* Product & Audience */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <label className={labelStyles}>商品 / 主題資訊</label>
            <textarea
              required
              value={productInfo}
              onChange={(e) => setProductInfo(e.target.value)}
              placeholder="請輸入產品特色、服務內容或具體情境細節..."
              rows={5}
              className={`${inputStyles} resize-none h-[180px]`}
            />
          </div>
          <div>
            <label className={labelStyles}>目標受眾 (TA) <span className="text-slate-400 font-normal ml-2 text-xs">點選建議可多選</span></label>
            <textarea
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="例如：新手媽媽, 價格敏感型..."
              rows={2}
              className={`${inputStyles} resize-none mb-3`}
            />
             <div className={`${suggestionContainerStyles} h-[106px] max-h-[106px]`}>
                 <div className="grid grid-cols-2 gap-2">
                    {activeRoleDef?.suggestedAudiences.map((s, idx) => (
                    <button
                        key={idx}
                        type="button"
                        onClick={() => handleAudienceSuggestion(s)}
                        className={chipStyles}
                    >
                         <span className="truncate w-full" title={s}>+ {s}</span>
                    </button>
                    ))}
                </div>
            </div>
          </div>
        </div>

        {/* Tone & Constraints */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className={labelStyles}>語氣風格 <span className="text-slate-400 font-normal ml-2 text-xs">請選擇</span></label>
            <div className="relative">
                <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className={`${inputStyles} appearance-none cursor-pointer`}
                >
                    {activeRoleDef?.suggestedTones.map((s, idx) => (
                        <option key={idx} value={s} className="bg-slate-800 text-white py-2">
                            {s}
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className={labelStyles}>
                重點要求 / 限制 
                <span className={`ml-2 text-xs ${constraintLength > MAX_CONSTRAINT_LENGTH ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                    ({constraintLength}/{MAX_CONSTRAINT_LENGTH} 字)
                </span>
            </label>
            <textarea
              value={constraints}
              onChange={(e) => setConstraints(e.target.value)}
              placeholder="例如：條列式呈現、強調情感連結..."
              rows={3}
              maxLength={MAX_CONSTRAINT_LENGTH}
              className={`${inputStyles} resize-none`}
            />
            {constraintLength >= MAX_CONSTRAINT_LENGTH && (
                <p className="text-red-500 text-xs mt-1">已達到字數上限 (100字)</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading || constraintLength > MAX_CONSTRAINT_LENGTH}
          className={`
            flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white shadow-lg transition-all transform hover:-translate-y-0.5
            ${isLoading 
                ? 'bg-slate-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-rose-500 to-orange-400 hover:shadow-rose-200'
            }
          `}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              正在生成...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              生成提示詞系統
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default InputForm;