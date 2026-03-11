import React, { useState } from 'react';
import { GeneratedPrompt } from '../types';
import { Copy, Check, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ROLES } from '../constants';

interface ResultDisplayProps {
  result: GeneratedPrompt | null;
  onReset: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onReset }) => {
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  // Find the label for the current role
  const roleLabel = ROLES.find(r => r.id === result.inputs.role)?.label || result.inputs.role;

  const handleCopy = () => {
    // Extract text from code blocks if possible, or just copy the whole content
    const codeBlockMatch = result.content.match(/```(?:markdown|txt|xml)?\n([\s\S]*?)```/);
    const textToCopy = codeBlockMatch ? codeBlockMatch[1] : result.content;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-fade-in-up">
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 flex justify-between items-center text-white">
        <div>
          <h3 className="text-lg font-bold">AI 提示詞已就緒 (Prompt Ready)</h3>
          <p className="text-slate-400 text-sm">複製並貼上到 ChatGPT、Claude 或 Gemini。</p>
        </div>
        <div className="flex gap-2">
            <button
            onClick={onReset}
            className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-slate-300"
            title="建立新任務"
            >
            <RefreshCw className="w-5 h-5" />
            </button>
        </div>
      </div>

      <div className="p-6">
        <div className="relative group">
            <div className="absolute top-2 right-2 z-10">
                 <button
                    onClick={handleCopy}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm ${
                        copied 
                        ? 'bg-green-100 text-green-700 border border-green-200' 
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                    }`}
                >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? '已複製！' : '複製提示詞'}
                </button>
            </div>
            
            <div className="prose prose-slate max-w-none bg-slate-50 p-6 rounded-xl border border-slate-100 overflow-x-auto text-sm text-slate-800">
                <ReactMarkdown>{result.content}</ReactMarkdown>
            </div>
        </div>

        <div className="mt-6 border-t border-slate-100 pt-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">輸入情境摘要</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                    <span className="block text-slate-500 text-xs">角色</span>
                    <span className="font-medium text-slate-800">{roleLabel}</span>
                </div>
                <div>
                    <span className="block text-slate-500 text-xs">任務</span>
                    <span className="font-medium text-slate-800 truncate" title={result.inputs.task}>{result.inputs.task}</span>
                </div>
                <div>
                    <span className="block text-slate-500 text-xs">語氣</span>
                    <span className="font-medium text-slate-800">{result.inputs.tone}</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;