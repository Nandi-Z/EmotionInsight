
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ResultCard from './components/ResultCard';
import History from './components/History';
import { analyzeSentiment } from './services/gemini';
import { SentimentAnalysisResult } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'single' | 'batch' | 'history'>('single');
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastResult, setLastResult] = useState<SentimentAnalysisResult | null>(null);
  const [history, setHistory] = useState<SentimentAnalysisResult[]>([]);
  const [batchTexts, setBatchTexts] = useState<string[]>([]);
  const [batchResults, setBatchResults] = useState<SentimentAnalysisResult[]>([]);
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('emotioninsight_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('emotioninsight_history', JSON.stringify(history));
  }, [history]);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeSentiment(inputText);
      setLastResult(result);
      setHistory(prev => [result, ...prev]);
      setActiveTab('single');
    } catch (error) {
      console.error("Analysis failed:", error);
      alert("Failed to analyze sentiment. Check your API configuration.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleBatchAnalyze = async () => {
    if (batchTexts.length === 0) return;
    setIsBatchProcessing(true);
    setBatchResults([]);
    
    try {
      const results: SentimentAnalysisResult[] = [];
      for (const text of batchTexts) {
        if (!text.trim()) continue;
        const res = await analyzeSentiment(text);
        results.push(res);
        setBatchResults(prev => [...prev, res]);
      }
      setHistory(prev => [...results, ...prev]);
    } catch (error) {
      console.error("Batch analysis error:", error);
    } finally {
      setIsBatchProcessing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const lines = content.split('\n').filter(l => l.trim().length > 0);
      setBatchTexts(lines);
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex h-screen bg-[#F9FAFB] text-[#1F2937] overflow-hidden font-inter">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 overflow-y-auto relative">
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-[#1E40AF]">
              {activeTab === 'single' ? 'Sentiment Analysis' : 
               activeTab === 'batch' ? 'Batch Intelligence' : 'History'}
            </h2>
            <p className="text-xs text-gray-500 font-medium">Uncover the emotional subtext of your data.</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full border border-blue-100">
               <span className="w-2 h-2 bg-[#1E40AF] rounded-full animate-pulse"></span>
               <span className="text-[10px] font-bold text-[#1E40AF]">GEMINI 3 ENGINE</span>
             </div>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto pb-24">
          {activeTab === 'single' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste your text here for deep emotional analysis..."
                  className="w-full h-40 bg-gray-50 border border-gray-200 rounded-xl p-4 text-[#1F2937] focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent transition-all resize-none mb-4 outline-none placeholder:text-gray-400"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !inputText.trim()}
                    className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
                      isAnalyzing || !inputText.trim() 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' 
                        : 'bg-[#1E40AF] hover:bg-blue-800 shadow-md shadow-blue-900/10 text-white'
                    }`}
                  >
                    {isAnalyzing ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Analyzing...
                      </>
                    ) : 'Analyze Text'}
                  </button>
                </div>
              </section>

              {lastResult && (
                <div className="animate-in zoom-in-95 duration-300">
                  <h3 className="text-gray-500 text-xs font-bold mb-4 tracking-widest uppercase">Deep Insight Result</h3>
                  <ResultCard result={lastResult} />
                </div>
              )}
            </div>
          )}

          {activeTab === 'batch' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <section className="bg-white border border-gray-200 rounded-2xl p-12 text-center border-dashed border-2 shadow-sm">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100">
                    <svg className="w-8 h-8 text-[#1E40AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-[#1F2937]">Bulk Processing</h3>
                  <p className="text-gray-500 text-sm mb-6">Upload a .txt file with one text per line to analyze multiple data points at once.</p>
                  
                  <div className="flex flex-col gap-4">
                    <label className="bg-white hover:bg-gray-50 border border-gray-300 text-[#1F2937] px-6 py-3 rounded-xl cursor-pointer transition-all font-semibold shadow-sm">
                      Select Data Source
                      <input type="file" accept=".txt" onChange={handleFileUpload} className="hidden" />
                    </label>
                    {batchTexts.length > 0 && (
                      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <p className="text-[#1E40AF] font-bold mb-4">{batchTexts.length} items loaded</p>
                        <button 
                          onClick={handleBatchAnalyze}
                          disabled={isBatchProcessing}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-all shadow-md"
                        >
                          {isBatchProcessing ? `Processing (${batchResults.length}/${batchTexts.length})...` : 'Execute Batch Analysis'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {batchResults.length > 0 && (
                <div className="space-y-6">
                   <h3 className="text-gray-500 text-xs font-bold tracking-widest uppercase px-1">Live Results Feed</h3>
                   {batchResults.map((res, i) => (
                     <div key={res.id} className="animate-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                       <ResultCard result={res} />
                     </div>
                   ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <History 
              history={history} 
              onSelect={(res) => {
                setLastResult(res);
                setActiveTab('single');
              }}
              onClear={() => {
                if(confirm("Are you sure you want to clear all history?")) setHistory([]);
              }}
            />
          )}
        </div>
      </main>
      
      {/* Mobile nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-2 z-50 shadow-lg">
        <button onClick={() => setActiveTab('single')} className={`p-3 rounded-xl ${activeTab === 'single' ? 'text-[#1E40AF] bg-blue-50' : 'text-gray-400'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        </button>
        <button onClick={() => setActiveTab('batch')} className={`p-3 rounded-xl ${activeTab === 'batch' ? 'text-[#1E40AF] bg-blue-50' : 'text-gray-400'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
        </button>
        <button onClick={() => setActiveTab('history')} className={`p-3 rounded-xl ${activeTab === 'history' ? 'text-[#1E40AF] bg-blue-50' : 'text-gray-400'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </button>
      </div>
    </div>
  );
};

export default App;
