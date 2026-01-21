
import React from 'react';
import { SentimentAnalysisResult, SentimentType } from '../types';
import SentimentChart from './SentimentChart';

interface ResultCardProps {
  result: SentimentAnalysisResult;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const getSentimentColor = (sentiment: SentimentType) => {
    switch (sentiment) {
      case SentimentType.POSITIVE: return 'text-emerald-700 bg-emerald-50 border-emerald-100';
      case SentimentType.NEGATIVE: return 'text-rose-700 bg-rose-50 border-rose-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div className={`px-4 py-1.5 rounded-full text-xs font-bold border uppercase tracking-widest ${getSentimentColor(result.sentiment)}`}>
            {result.sentiment}
          </div>
          <div className="text-sm text-gray-400 font-medium">
            <span className="text-[#1F2937] font-bold">{(result.confidence * 100).toFixed(1)}%</span> Confidence Score
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h3 className="text-gray-400 text-[10px] font-bold mb-3 uppercase tracking-widest">AI Interpretation</h3>
              <p className="text-[#1F2937] text-lg leading-relaxed font-medium">
                "{result.explanation}"
              </p>
            </div>

            <div>
              <h3 className="text-gray-400 text-[10px] font-bold mb-4 uppercase tracking-widest">Thematic Entities</h3>
              <div className="flex flex-wrap gap-2">
                {result.entities.map((entity, i) => (
                  <span key={i} className="px-3 py-1.5 bg-gray-50 rounded-lg text-xs font-bold text-gray-600 border border-gray-200">
                    {entity}
                  </span>
                ))}
                {result.entities.length === 0 && <span className="text-gray-400 text-sm italic">No significant entities identified.</span>}
              </div>
            </div>
          </div>

          <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
            <h3 className="text-gray-400 text-[10px] font-bold mb-4 uppercase tracking-widest text-center">Emotional Radar</h3>
            <SentimentChart emotions={result.emotions} />
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 px-8 py-3 border-t border-gray-100 text-[10px] text-gray-400 flex justify-between items-center font-bold">
        <span>REF: {result.id.slice(0, 8).toUpperCase()}</span>
        <span className="uppercase tracking-widest">{new Date(result.timestamp).toLocaleTimeString()} · {new Date(result.timestamp).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default ResultCard;
