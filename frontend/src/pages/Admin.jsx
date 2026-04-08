import React, { useState, useEffect } from 'react';
import { adoptionsAPI, animalsAPI } from '../services/api';
import { LoadingSpinner, StatusBadge } from '../components/UI';
import { FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Admin = () => {
  const [adoptions, setAdoptions] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const fetchData = async () => {
    try {
      const [adoptionsRes, animalsRes] = await Promise.all([
        adoptionsAPI.getAll(),
        animalsAPI.getAll()
      ]);
      setAdoptions(adoptionsRes.data);
      setAnimals(animalsRes.data);
    } catch (err) {
      toast.error('Failed to load admin data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAction = async (id, action) => {
    setProcessingId(id);
    try {
      if (action === 'approve') {
        await adoptionsAPI.approve(id, { reviewed_by: 'Admin' });
        toast.success('Adoption approved!');
      } else {
        await adoptionsAPI.reject(id, { reviewed_by: 'Admin' });
        toast.success('Adoption rejected.');
      }
      fetchData();
    } catch (err) {
      toast.error('Failed to process adoption request.');
    } finally {
      setProcessingId(null);
    }
  };

  const updateAnimalStatus = async (id, newStatus) => {
    try {
      await animalsAPI.update(id, { status: newStatus });
      toast.success('Animal status updated successfully!');
      fetchData();
    } catch (err) {
      toast.error('Failed to update animal status.');
    }
  };

  const pendingCount = adoptions.filter(a => a.status === 'Pending').length;

  return (
    <div>
      <div className="page-header animate-in flex justify-between items-center bg-white p-8 rounded-3xl mb-8 border border-border-color shadow-xl shadow-[#344e41]/5">
        <div>
          <h1 className="text-3xl text-[#2d3a33]">Governance Center</h1>
          <p className="mt-2 text-[#8a9a91] font-bold uppercase tracking-widest text-[11px]">System Administration & Request Evaluation</p>
        </div>
        <button className="btn btn-secondary border border-border-color hover:bg-white" onClick={handleLogout}>Log Out</button>
      </div>

      <div className="card border-none shadow-xl shadow-[#344e41]/5 bg-white p-0 overflow-hidden animate-in">
        <div className="p-6 border-b border-border-color bg-[#f8faf9] flex justify-between items-center">
          <h3 className="font-heading text-xl font-bold text-[#2d3a33]">Adoption Evaluations</h3>
          <div className="px-3 py-1 bg-[#344e41]/10 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-[#344e41]">
            {pendingCount} Pending Requests
          </div>
        </div>
        
        {loading ? (
          <div className="p-20"><LoadingSpinner /></div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Identity</th>
                  <th>Resident</th>
                  <th>Applicant</th>
                  <th>Contact Info</th>
                  <th>Status</th>
                  <th>Review</th>
                </tr>
              </thead>
              <tbody>
                {adoptions.map((ad) => (
                  <tr key={ad.adoption_id} className={ad.status === 'Pending' ? 'bg-[#e9c46a]/5' : ''}>
                    <td>
                      <div className="text-[10px] font-extrabold text-[#8a9a91] opacity-40 uppercase tracking-widest">#{ad.adoption_id}</div>
                      <div className="text-xs font-bold text-[#4a5c53]">{ad.request_date}</div>
                    </td>
                    <td className="font-heading font-bold text-[#2d3a33]">{ad.animal?.name || 'N/A'}</td>
                    <td className="font-bold text-sm text-[#344e41]">{ad.adopter?.name || 'Unknown'}</td>
                    <td>
                      <div className="text-[10px] font-extrabold text-[#8a9a91] uppercase tracking-widest">{ad.adopter?.phone}</div>
                      <div className="text-xs font-medium text-[#4a5c53]">{ad.adopter?.email}</div>
                    </td>
                    <td><StatusBadge status={ad.status} /></td>
                    <td>
                      {ad.status === 'Pending' ? (
                        <div className="flex gap-2">
                          <button 
                            className="btn btn-primary btn-sm px-3"
                            disabled={processingId === ad.adoption_id}
                            onClick={() => handleAction(ad.adoption_id, 'approve')}
                          >
                            {processingId === ad.adoption_id ? <FaSpinner className="animate-spin text-[10px]" /> : <FaCheck className="text-[10px]"/>}
                          </button>
                          <button 
                            className="btn btn-secondary btn-sm px-3"
                            disabled={processingId === ad.adoption_id}
                            onClick={() => handleAction(ad.adoption_id, 'reject')}
                          >
                            <FaTimes className="text-[10px]"/>
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] font-extrabold text-[#8a9a91] uppercase tracking-widest border border-border-color px-2 py-1 rounded-full bg-[#f8faf9]">
                          Reviewed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <div className="card mt-12 animate-in border-none shadow-xl shadow-[#344e41]/5 bg-white p-0 overflow-hidden" style={{ animationDelay: '0.2s' }}>
        <div className="p-6 border-b border-border-color bg-[#f8faf9]">
          <h2 className="font-heading text-xl font-bold text-[#2d3a33]">Population Master Search</h2>
        </div>
        {animals.length === 0 ? (
          <div className="p-8 text-[#8a9a91] font-bold uppercase text-xs tracking-widest text-center italic">No residents mapped to system.</div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Status Indicator</th>
                  <th>Master Control</th>
                </tr>
              </thead>
              <tbody>
                {animals.map(animal => (
                  <tr key={animal.animal_id}>
                    <td>
                      <div className="font-heading font-bold text-[#2d3a33] text-lg">{animal.name}</div>
                      <div className="text-[10px] font-extrabold text-[#8a9a91] uppercase tracking-widest mt-1">{animal.species} • {animal.animal_id}</div>
                    </td>
                    <td>
                      <StatusBadge status={animal.status} />
                    </td>
                    <td>
                      <select 
                        className="form-control text-sm font-bold border-none bg-[#344e41]/5" 
                        value={animal.status} 
                        onChange={(e) => updateAnimalStatus(animal.animal_id, e.target.value)}
                        style={{ width: 'auto', minWidth: '180px' }}
                      >
                        <option value="Rescued">Evaluation Mode</option>
                        <option value="Available">Public Listing</option>
                        <option value="Adopted">Adopted (Closed)</option>
                        <option value="Under Treatment">Wellbeing Mode</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
