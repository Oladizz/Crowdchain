import React from 'react';
import useAnimatedCounter from '../hooks/useAnimatedCounter';

interface StatCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, prefix = '', suffix = '' }) => {
  const animatedValue = useAnimatedCounter(value, 2000);

  return (
    <div className="bg-brand-surface p-4 rounded-lg text-center shadow-lg animate-fade-in">
      <p className="text-2xl md:text-4xl font-bold text-brand-blue">
        {prefix}{animatedValue.toLocaleString()}{suffix}
      </p>
      <p className="mt-2 text-sm sm:text-base text-brand-muted">{label}</p>
    </div>
  );
};

export default StatCard;