import React, { useState, useEffect } from 'react';
import { donationsAPI } from '../services/api';
import { LoadingSpinner, StatCard } from '../components/UI';
import { FaMoneyBillWave, FaChartPie, FaPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Donations = () => {
  const [donations, setDonations] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    donor_name: '', donor_email: '', amount: '', donation_type: 'One-Time', 
    purpose: '', payment_mode: 'UPI'
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [donationsRes, summaryRes] = await Promise.all([
        donationsAPI.getAll(),
        donationsAPI.getSummary()
      ]);
      setDonations(donationsRes.data);
      setSummary(summaryRes.data);
    } catch (err) {
      toast.error('Failed to load donation data.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { 
        ...formData, 
        donor_email: formData.donor_email.trim() === '' ? null : formData.donor_email,
        amount: parseFloat(formData.amount),
        donation_date: new Date().toISOString().split('T')[0] 
      };
      await donationsAPI.create(payload);
      toast.success('Donation logged successfully!');
      setIsModalOpen(false);
      setFormData({ donor_name: '', donor_email: '', amount: '', donation_type: 'One-Time', purpose: '', payment_mode: 'UPI' });
      fetchData();
    } catch (err) {
      toast.error('Failed to log donation.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="page-header animate-in flex justify-between items-end flex-wrap gap-4">
        <div>
          <h1>Donations Ledger</h1>
          <p>Track incoming funds and allocations.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <FaPlus /> Receive Donation
        </button>
      </div>

      {summary && (
        <div className="stats-grid mb-8">
          <StatCard delay={0.1} title="Total Funds Raised" value={`₹${summary.total_raised.toLocaleString()}`} icon={<FaMoneyBillWave />} trend="All time" />
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="card animate-in flex-[2] border-none shadow-xl shadow-[#344e41]/5 bg-white p-0 overflow-hidden" style={{ animationDelay: '0.2s' }}>
          <div className="p-5 border-b border-border-color bg-[#f8faf9]">
            <h3 className="font-heading text-lg font-bold text-[#2d3a33]">Recent Contributions</h3>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Identity</th>
                  <th>Amount</th>
                  <th>Classification</th>
                  <th>Mission</th>
                  <th>Mode</th>
                </tr>
              </thead>
              <tbody>
                {donations.map(d => (
                  <tr key={d.donation_id}>
                    <td>
                      <div className="font-bold text-[#2d3a33] text-sm uppercase tracking-tight">{d.donor_name}</div>
                      <div className="text-[10px] text-[#8a9a91] font-bold uppercase tracking-widest mt-0.5">{d.donation_date}</div>
                    </td>
                    <td className="font-extrabold text-[#344e41] text-sm">₹{d.amount.toLocaleString()}</td>
                    <td className="text-[11px] font-bold text-[#4a5c53] uppercase">{d.donation_type}</td>
                    <td className="text-xs font-bold text-[#8a9a91]">{d.purpose || 'General'}</td>
                    <td className="text-[10px] font-extrabold text-[#8a9a91] uppercase tracking-widest opacity-60">{d.payment_mode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-6">
          <div className="card animate-in border-none shadow-xl shadow-[#344e41]/5 bg-white" style={{ animationDelay: '0.3s' }}>
            <h3 className="font-heading text-lg font-bold text-[#2d3a33] mb-6 flex items-center gap-2">
              <FaChartPie className="opacity-30" /> Allocation Breakdown
            </h3>
            <div className="flex flex-col gap-4">
              {summary?.by_purpose.map((p, i) => (
                <div key={i} className="flex justify-between items-center bg-[#f8faf9] p-4 rounded-xl border border-border-color">
                  <span className="font-bold text-xs uppercase text-[#4a5c53]">{p.purpose}</span>
                  <span className="text-[#344e41] font-extrabold text-sm">₹{p.total_raised.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Make Donation Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}>
          <div className="modal-content custom-scrollbar">
            <div className="modal-header">
              <h2>Log a Contribution</h2>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label>Donor Name *</label>
                <input type="text" className="form-control" required value={formData.donor_name} onChange={e => setFormData({...formData, donor_name: e.target.value})} />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Donor Email</label>
                  <input type="email" className="form-control" value={formData.donor_email} onChange={e => setFormData({...formData, donor_email: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Amount (₹) *</label>
                  <input type="number" step="0.01" min="1" className="form-control" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Recurring Type *</label>
                  <select className="form-control" value={formData.donation_type} onChange={e => setFormData({...formData, donation_type: e.target.value})}>
                    <option value="One-Time">One-Time</option>
                    <option value="Recurring">Recurring (Subscription)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Payment Method *</label>
                  <select className="form-control" value={formData.payment_mode} onChange={e => setFormData({...formData, payment_mode: e.target.value})}>
                    <option value="UPI">UPI</option>
                    <option value="Card">Card</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label>Purpose / Campaign Note</label>
                <input type="text" className="form-control" placeholder="E.g. Medical Fund for Charlie, General Needs" value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})} />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Processing...' : 'Log Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Donations;
