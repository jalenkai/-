import React, { useState } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import ResultDisplay from './components/ResultDisplay';
import { PromptInputs, GeneratedPrompt } from './types';
import { generateMetaPrompt } from './services/geminiService';
import { Info } from 'lucide-react';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedResult, setGeneratedResult] = useState<GeneratedPrompt | null>(null);

  const handleGenerate = async (inputs: PromptInputs) => {
    setIsLoading(true);
    setError(null);
    setGeneratedResult(null);

    try {
      const content = await generateMetaPrompt(inputs);
      const newResult: GeneratedPrompt = {
        id: Date.now().toString(),
        title: inputs.task,
        content,
        inputs,
        createdAt: Date.now()
      };
      setGeneratedResult(newResult);
    } catch (err: any) {
      setError(err.message || "發生意外錯誤。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setGeneratedResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      <main className="flex-grow max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-8 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4">
            為您的工作打造完美 <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-400">
              婦幼零售 AI 提示詞
            </span>
          </h2>
          <p className="text-slate-600 text-lg">
            別再用猜的了。為母嬰產業量身打造，生成專業的角色專屬提示詞，讓您的 AI 工具發揮最大效益。
          </p>
        </div>

        {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <Info className="w-5 h-5" />
                <span>{error}</span>
            </div>
        )}

        <div className="grid grid-cols-1 gap-8">
          {generatedResult ? (
             <ResultDisplay result={generatedResult} onReset={handleReset} />
          ) : (
             <InputForm isLoading={isLoading} onSubmit={handleGenerate} />
          )}
        </div>

        {!generatedResult && (
             <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center opacity-70">
                <div className="p-4">
                    <div className="text-rose-500 font-bold mb-2">角色專屬設定</div>
                    <p className="text-sm text-slate-600">為店長、行銷人員和客服專員量身定制的情境。</p>
                </div>
                <div className="p-4">
                    <div className="text-rose-500 font-bold mb-2">產業深度優化</div>
                    <p className="text-sm text-slate-600">懂得「包屁衣」與「防踢被」差異的專業系統。</p>
                </div>
                <div className="p-4">
                    <div className="text-rose-500 font-bold mb-2">即貼即用</div>
                    <p className="text-sm text-slate-600">獲得格式完美的系統提示詞，直接貼上 ChatGPT 即可使用。</p>
                </div>
             </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} 婦幼零售 AI 提示詞大師. Powered by Google Gemini.
        </div>
      </footer>
    </div>
  );
};

export default App;