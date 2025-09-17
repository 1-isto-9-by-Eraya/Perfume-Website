// src/components/dashboard/DashboardStats.tsx
'use client';

import { useState, useEffect } from 'react';
import { ClockIcon, CheckCircleIcon, PencilIcon } from '@heroicons/react/24/outline';

interface PostStats {
  pending: number;
  approved: number;
  needsUpdate: number;
}

export default function DashboardStats() {
  const [stats, setStats] = useState<PostStats>({
    pending: 0,
    approved: 0,
    needsUpdate: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/posts/stats');
      if (response.ok) {
        const data = await response.json();
        setStats({
          pending: data.pending || 0,
          approved: data.approved || 0,
          needsUpdate: data.needsUpdate || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Refresh stats when component becomes visible (e.g., after returning from review)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchStats();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const statCards = [
    {
      title: 'Pending Review',
      count: stats.pending,
      icon: ClockIcon,
      bgColor: 'bg-yellow-900/20',
      borderColor: 'border-yellow-500/30',
      iconColor: 'text-yellow-400',
      textColor: 'text-yellow-100',
      description: 'Posts awaiting review',
    },
    {
      title: 'Approved',
      count: stats.approved,
      icon: CheckCircleIcon,
      bgColor: 'bg-green-900/20',
      borderColor: 'border-green-500/30',
      iconColor: 'text-green-400',
      textColor: 'text-green-100',
      description: 'Published posts',
    },
    {
      title: 'Needs Update',
      count: stats.needsUpdate,
      icon: PencilIcon,
      bgColor: 'bg-blue-900/20',
      borderColor: 'border-blue-500/30',
      iconColor: 'text-blue-400',
      textColor: 'text-blue-100',
      description: 'Draft posts',
    },
  ];

  if (isLoading) {
    return (
      <div className="bg-[#2a2a2a67] rounded-lg p-6">
        <h2 className="text-xl font-semibold text-[#ffffff] mb-4">Content Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-[#1a1a1a] border border-gray-600 rounded-lg p-6 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 bg-gray-600 rounded mb-2 w-24"></div>
                  <div className="h-8 bg-gray-600 rounded w-16 mb-2"></div>
                  <div className="h-3 bg-gray-600 rounded w-20"></div>
                </div>
                <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#2a2a2a67] rounded-lg p-6">
      <h2 className="text-xl font-semibold text-[#ffffff] mb-6">Content Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className={`${card.bgColor} ${card.borderColor} border rounded-lg p-6 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className={`text-sm font-medium ${card.textColor} mb-1`}>
                  {card.title}
                </p>
                <p className={`text-3xl font-bold ${card.iconColor} mb-2`}>
                  {card.count}
                </p>
                <p className={`text-xs ${card.textColor} opacity-75`}>
                  {card.description}
                </p>
              </div>
              <div className={`p-3 rounded-full ${card.bgColor} border ${card.borderColor}`}>
                <card.icon className={`h-6 w-6 ${card.iconColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}