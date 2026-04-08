import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';
import { LoadingSpinner, StatCard, StatusBadge } from '../components/UI';
import { FaPaw, FaHeart, FaDonate, FaUsers, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import toast from 'react-hot-toast';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await dashboardAPI.getStats();
        setStats(data);
      } catch (error) {
        toast.error('Failed to load dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!stats) return <div>Failed to load data.</div>;

  const speciesLabels = Object.keys(stats.species_breakdown);
  const speciesData = Object.values(stats.species_breakdown);
  const pieData = {
    labels: speciesLabels.length > 0 ? speciesLabels : ['No Data'],
    datasets: [{
      data: speciesData.length > 0 ? speciesData : [1],
      backgroundColor: ['#344e41', '#588157', '#a3b18a', '#dad7cd', '#e9c46a'],
      borderWidth: 4,
      borderColor: '#fdfbf7',
    }]
  };

  const barData = {
    labels: stats.monthly_donations.map(m => m.month),
    datasets: [{
      label: 'Donations (₹)',
      data: stats.monthly_donations.map(m => m.total),
      backgroundColor: '#588157',
      borderRadius: 12,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#2d3a33', font: { family: "'Quicksand', sans-serif", weight: '700', size: 12 } } }
    },
    scales: {
      x: { 
        ticks: { color: '#8a9a91', font: { family: "'Quicksand', sans-serif", weight: '600' } }, 
        grid: { display: false } 
      },
      y: { 
        ticks: { color: '#8a9a91', font: { family: "'Quicksand', sans-serif", weight: '600' } }, 
        grid: { color: 'rgba(52, 78, 65, 0.05)', drawBorder: false } 
      }
    }
  };

  return (
    <div>
      <div className="page-header animate-in">
        <h1>Dashboard summary</h1>
        <p>Overview of current shelter metrics and recent activity.</p>
      </div>

      <div className="stats-grid">
        <StatCard delay={0.1} title="Total Animals" value={stats.total_animals} icon={<FaPaw />} trend={`${stats.animals_rescued} newly rescued`} />
        <StatCard delay={0.2} title="Animals Available" value={stats.animals_available} icon={<FaHeart />} trend={`${stats.pending_adoptions} adoptions pending`} />
        <StatCard delay={0.3} title="Total Donations" value={`₹${stats.total_donations.toLocaleString()}`} icon={<FaDonate />} trend="All time raised" />
        <StatCard delay={0.4} title="Active Volunteers" value={stats.total_volunteers} icon={<FaUsers />} trend="Across all departments" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="card animate-in h-[380px] flex flex-col" style={{ animationDelay: '0.3s' }}>
          <h3 className="mb-6 font-semibold text-[#1d1d1f]">Species Breakdown</h3>
          <div className="flex-1 min-h-0 relative flex items-center justify-center">
            {stats.total_animals > 0 ? (
              <Pie data={pieData} options={{ plugins: { legend: { position: 'bottom', labels: { color: '#1d1d1f', padding: 25, font: { weight: '500' } } } }, maintainAspectRatio: false, cutout: '65%' }} />
            ) : (
               <div className="text-muted flex flex-col items-center"><FaPaw className="text-4xl mb-2 opacity-20"/>No animals registered yet</div>
            )}
          </div>
        </div>

        <div className="card animate-in h-[380px] flex flex-col" style={{ animationDelay: '0.4s' }}>
          <h3 className="mb-6 font-semibold text-[#1d1d1f]">Donation Trends (Last 6 Months)</h3>
          <div className="flex-1 min-h-0 relative flex items-center justify-center">
            {stats.monthly_donations.length > 0 ? (
               <Bar data={barData} options={chartOptions} />
            ) : (
                <div className="text-muted flex flex-col items-center"><FaDonate className="text-4xl mb-2 opacity-20"/>No recent donations</div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-12 card animate-in border-none shadow-xl shadow-[#344e41]/5 bg-white" style={{ animationDelay: '0.5s' }}>
        <div className="flex justify-between items-center mb-10">
          <div>
            <h3 className="font-heading text-3xl font-bold text-[#2d3a33] mb-1">Recent Missions</h3>
            <p className="text-sm text-[#8a9a91] font-semibold uppercase tracking-widest">Late Arrival Tracking</p>
          </div>
          <Link to="/animals" className="btn btn-primary">View All Residents</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Species</th>
                <th>Rescue Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recent_animals.map((animal) => (
                <tr key={animal.animal_id}>
                  <td className="font-medium">{animal.name}</td>
                  <td>{animal.species}</td>
                  <td>{animal.date_rescued}</td>
                  <td><StatusBadge status={animal.status} /></td>
                </tr>
              ))}
              {stats.recent_animals.length === 0 && (
                <tr><td colSpan="4" className="text-center text-muted">No animals found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
