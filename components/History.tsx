
import React from 'react';
import { SentimentAnalysisResult, SentimentType } from '../types';

interface HistoryProps {
  history: SentimentAnalysisResult[];
  onSelect: (result: SentimentAnalysisResult) => void;
  onClear: () => void;
}

const History: React.FC<HistoryProps> = ({ history, onSelect, onClear }) => {
  const getBadgeColor = (sentiment: SentimentType) => {
    switch (sentiment) {
      case SentimentType.POSITIVE: return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case SentimentType.NEGATIVE: return 'bg-rose-50 text-rose-700 border-rose-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-400">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
            <svg className="w-8 h-8 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <p className="font-semibold text-gray-500">History is currently empty</p>
        <p className="text-xs mt-1">Run your first analysis to see data here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest px-1">Recent Activity</h2>
        <button 
          onClick={onClear}
          className="text-xs text-rose-600 hover:text-rose-700 font-bold uppercase tracking-widest transition-colors"
        >
          Flush Data
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {history.map((item) => (
          <div 
            key={item.id}
            onClick={() => onSelect(item)}
            className="bg-white border border-gray-200 p-6 rounded-2xl cursor-pointer hover:border-[#1E40AF] hover:shadow-lg hover:shadow-blue-900/5 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-widest ${getBadgeColor(item.sentiment)}`}>
                {item.sentiment}
              </span>
              <span className="text-[10px] text-gray-400 font-bold uppercase">
                {new Date(item.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
            <p className="text-[#1F2937] text-sm line-clamp-2 mb-6 leading-relaxed font-medium">
              {item.text}
            </p>
            <div className="flex items-center gap-3">
              <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#1E40AF] transition-all duration-500" 
                  style={{ width: `${item.confidence * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-gray-500 font-bold w-10 text-right">
                {Math.round(item.confidence * 100)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
