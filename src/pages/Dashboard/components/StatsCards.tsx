import React from 'react';
import { Bot, Wifi, WifiOff } from 'lucide-react';
import { useBotsStats } from '../../../hooks/useBotsStats';
import StatsCard from './StatsCard';

const StatsCards = () => {
  const { stats, loading } = useBotsStats();

  const statsConfig = [
    {
      title: 'Total de Assistentes',
      value: loading ? '-' : stats.total,
      icon: Bot,
      color: 'bg-blue-500',
    },
    {
      title: 'Assistentes Online',
      value: loading ? '-' : stats.online,
      icon: Wifi,
      color: 'bg-emerald-500',
    },
    {
      title: 'Assistentes Offline',
      value: loading ? '-' : stats.offline,
      icon: WifiOff,
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="w-full px-4">
      <div className="max-w-[1370px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="lg:col-span-2 xl:col-span-3">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {statsConfig.map((stat, index) => (
                <div key={stat.title} className="flex justify-center">
                  <div className="w-full max-w-[440px] min-w-[300px]">
                    <StatsCard {...stat} index={index} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;