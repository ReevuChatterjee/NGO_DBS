import React from 'react';

export const StatusBadge = ({ status }) => {
  const getBadgeClass = (s) => {
    switch (s?.toLowerCase()) {
      case 'rescued': return 'badge-rescued';
      case 'available': return 'badge-available';
      case 'adopted': return 'badge-adopted';
      case 'pending': return 'badge-pending';
      default: return 'badge-adopted';
    }
  };

  return (
    <span className={`badge ${getBadgeClass(status)}`}>
      {status}
    </span>
  );
};

export const LoadingSpinner = () => (
  <div className="loading-container animate-in">
    <div className="spinner"></div>
  </div>
);

export const EmptyState = ({ icon, title, description }) => (
  <div className="empty-state animate-in">
    <div className="icon">{icon}</div>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

export const StatCard = ({ title, value, icon, trend, delay = 0 }) => (
  <div className="card animate-in border-none bg-stone-50" style={{ animationDelay: `${delay}s`, display: 'flex', flexDirection: 'column' }}>
    <div className="flex items-center gap-4 mb-4">
      <div className="w-12 h-12 rounded-2xl bg-[#344e41] text-white flex items-center justify-center text-xl shadow-lg shadow-[#344e41]/10">
        {icon}
      </div>
      <div>
        <h3 className="text-[#8a9a91] text-[11px] font-bold uppercase tracking-[0.2em]">{title}</h3>
        <div className="text-3xl font-heading font-extrabold text-[#2d3a33]">{value}</div>
      </div>
    </div>
    {trend && (
      <div className="mt-2 py-2 px-3 bg-[#344e41]/5 rounded-xl inline-flex items-center gap-2 text-[13px] font-semibold text-[#344e41]">
        <div className="w-1.5 h-1.5 rounded-full bg-[#344e41]"></div>
        {trend}
      </div>
    )}
  </div>
);
