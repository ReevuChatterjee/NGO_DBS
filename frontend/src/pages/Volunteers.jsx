import React, { useState, useEffect } from 'react';
import { volunteersAPI, animalsAPI } from '../services/api';
import { LoadingSpinner, StatusBadge } from '../components/UI';
import { FaUserPlus, FaTasks } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Volunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVol, setSelectedVol] = useState(null);
  const [assignments, setAssignments] = useState([]);

  // Volunteer Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', role: 'Animal Care', availability: 'Both' });
  const [submitting, setSubmitting] = useState(false);

  // Assign Modal State
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignForm, setAssignForm] = useState({ animal_id: '', task_description: '' });
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    fetchVols();
  }, []);

  const fetchVols = async () => {
    try {
      const [volRes, aniRes] = await Promise.all([
        volunteersAPI.getAll(),
        animalsAPI.getAll()
      ]);
      setVolunteers(volRes.data);
      setAnimals(aniRes.data);
    } catch (err) {
      toast.error('Failed to load volunteers.');
    } finally {
      setLoading(false);
    }
  };

  const viewAssignments = async (vol) => {
    setSelectedVol(vol);
    try {
      const { data } = await volunteersAPI.getAssignments(vol.volunteer_id);
      setAssignments(data);
    } catch (err) {
      toast.error('Failed to load assignments.');
    }
  };

  const markComplete = async (assignId) => {
    try {
      await volunteersAPI.completeAssignment(assignId);
      toast.success('Assignment marked completed');
      // refresh assignments
      viewAssignments(selectedVol);
      // refresh workload counts
      fetchVols();
    } catch (err) {
      toast.error('Failed to update assignment status');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { ...formData, joined_date: new Date().toISOString().split('T')[0] };
      await volunteersAPI.create(payload);
      toast.success('Volunteer onboarded successfully!');
      setIsModalOpen(false);
      setFormData({ name: '', email: '', phone: '', role: 'General Helper', availability: '' });
      fetchVols();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to onboard volunteer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    setAssigning(true);
    try {
      const payload = {
        volunteer_id: selectedVol.volunteer_id,
        animal_id: assignForm.animal_id,
        task_description: assignForm.task_description,
        assigned_date: new Date().toISOString().split('T')[0]
      };
      await volunteersAPI.assign(payload);
      toast.success('Task assigned successfully!');
      setIsAssignModalOpen(false);
      setAssignForm({ animal_id: '', task_description: '' });
      viewAssignments(selectedVol);
      fetchVols();
    } catch (err) {
      toast.error('Failed to assign task. E.g. Missing fields or Duplicate assignment.');
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div>
      <div className="page-header animate-in flex justify-between items-end">
        <div>
          <h1>Volunteer Network</h1>
          <p>Management of shelter volunteers and their assignments.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <FaUserPlus /> Onboard Volunteer
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="card animate-in flex-[2] border-none shadow-xl shadow-[#344e41]/5 bg-white" style={{ animationDelay: '0.1s' }}>
          <h3 className="font-heading text-xl font-bold text-[#2d3a33] mb-6">Volunteer Roster</h3>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Availability</th>
                  <th>Load</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {volunteers.map(v => (
                  <tr key={v.volunteer_id} className={selectedVol?.volunteer_id === v.volunteer_id ? 'bg-[#344e41]/3' : ''}>
                    <td>
                      <div className="font-bold text-[#2d3a33] text-sm uppercase tracking-tight">{v.name}</div>
                      <div className="text-[10px] text-[#8a9a91] font-bold uppercase tracking-widest mt-0.5">{v.phone}</div>
                    </td>
                    <td className="font-semibold text-xs uppercase tracking-wider text-[#4a5c53]">{v.role}</td>
                    <td className="text-xs font-bold text-[#8a9a91]">{v.availability}</td>
                    <td>
                      <span className="text-[#344e41] font-extrabold text-sm">{v.active_assignments}</span>
                      <span className="text-[10px] text-[#8a9a91] ml-1 font-bold uppercase">active</span>
                    </td>
                    <td>
                      <button className="btn btn-secondary btn-sm" onClick={() => viewAssignments(v)}>
                        <FaTasks/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Assignments Sidebar */}
        <div className="flex-1 min-w-[340px]">
          {selectedVol ? (
            <div className="card animate-in border-none shadow-xl shadow-[#344e41]/5 bg-white sticky top-6">
              <div className="mb-6 pb-4 border-b border-border-color">
                <h3 className="font-heading text-xl font-bold text-[#2d3a33]">{selectedVol.name}</h3>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#8a9a91] mt-1">{selectedVol.role}</p>
              </div>

              <div className="flex flex-col gap-4">
                {assignments.map(a => (
                  <div key={a.assignment_id} className="bg-[#f8faf9] p-4 rounded-2xl border border-border-color">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-[11px] uppercase tracking-wider text-[#344e41]">{a.animal?.name || 'Unknown'}</span>
                      <StatusBadge status={a.status} />
                    </div>
                    <p className="text-xs font-medium text-[#4a5c53] mb-3 leading-relaxed">{a.task_description}</p>
                    <div className="flex justify-between items-center text-[10px] font-bold text-[#8a9a91]">
                      <span className="uppercase tracking-widest">Since: {a.assigned_date}</span>
                      {a.status === 'Active' && (
                        <button className="btn btn-accent btn-sm py-1"
                                onClick={() => markComplete(a.assignment_id)}>
                          Finish
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {assignments.length === 0 && (
                  <div className="text-center text-[#8a9a91] py-8 border-2 border-dashed border-border-color rounded-2xl">
                    <p className="text-xs font-bold uppercase tracking-widest">No Active Missions</p>
                  </div>
                )}
                
                <button className="btn btn-primary w-full mt-2" onClick={() => setIsAssignModalOpen(true)}>Assign New Task</button>
              </div>
            </div>
          ) : (
            <div className="card text-center text-muted py-12">
              Select a volunteer to view their assignments.
            </div>
          )}
        </div>
      </div>

      {/* Onboard Volunteer Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}>
          <div className="modal-content custom-scrollbar">
            <div className="modal-header">
              <h2>Onboard New Volunteer</h2>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label>Full Name *</label>
                <input type="text" className="form-control" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Email Address *</label>
                  <input type="email" className="form-control" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input type="tel" className="form-control" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Role / Department</label>
                  <select className="form-control" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                    <option value="Animal Care">Animal Care</option>
                    <option value="Rescue Ops">Rescue Ops</option>
                    <option value="Medical Support">Medical Support</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Availability *</label>
                  <select className="form-control" value={formData.availability} onChange={e => setFormData({...formData, availability: e.target.value})}>
                    <option value="Weekdays">Weekdays</option>
                    <option value="Weekends">Weekends</option>
                    <option value="Both">Both</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Onboarding...' : 'Onboard Volunteer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Task Modal */}
      {isAssignModalOpen && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setIsAssignModalOpen(false)}>
          <div className="modal-content custom-scrollbar">
            <div className="modal-header">
              <h2>Assign Mission to {selectedVol?.name}</h2>
              <button className="modal-close" onClick={() => setIsAssignModalOpen(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleAssign}>
              <div className="form-group">
                <label>Select Animal *</label>
                <select className="form-control" required value={assignForm.animal_id} onChange={e => setAssignForm({...assignForm, animal_id: e.target.value})}>
                  <option value="" disabled>-- Select an Animal --</option>
                  {animals.map(a => (
                    <option key={a.animal_id} value={a.animal_id}>{a.name} ({a.species})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Task Description *</label>
                <textarea 
                  className="form-control" 
                  rows="3" 
                  required 
                  placeholder="e.g. Daily walk, medication, etc."
                  value={assignForm.task_description} 
                  onChange={e => setAssignForm({...assignForm, task_description: e.target.value})}
                ></textarea>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsAssignModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={assigning}>
                  {assigning ? 'Assigning...' : 'Assign Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Volunteers;
