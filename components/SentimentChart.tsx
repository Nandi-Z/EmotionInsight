
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { Emotions } from '../types';

interface SentimentChartProps {
  emotions: Emotions;
}

const SentimentChart: React.FC<SentimentChartProps> = ({ emotions }) => {
  const data = [
    { subject: 'Joy', A: emotions.joy, fullMark: 1 },
    { subject: 'Sadness', A: emotions.sadness, fullMark: 1 },
    { subject: 'Anger', A: emotions.anger, fullMark: 1 },
    { subject: 'Fear', A: emotions.fear, fullMark: 1 },
    { subject: 'Surprise', A: emotions.surprise, fullMark: 1 },
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#E5E7EB" strokeWidth={1} />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#6B7280', fontSize: 11, fontWeight: 700 }} />
          <Radar
            name="Emotions"
            dataKey="A"
            stroke="#1E40AF"
            fill="#1E40AF"
            fillOpacity={0.15}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SentimentChart;
