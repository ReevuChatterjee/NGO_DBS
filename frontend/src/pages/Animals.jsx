import React, { useState, useEffect } from 'react';
import { animalsAPI } from '../services/api';
import { LoadingSpinner, StatusBadge } from '../components/UI';
import { FaFilter, FaPlus, FaSearch } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Animals = () => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', species: '', search: '' });
  
  // Registration Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', species: 'Dog', breed: '', age: '', health_status: 'Healthy', 
    rescue_location: '', status: 'Available'
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchAnimals = async () => {
    setLoading(true);
    try {
      const { data } = await animalsAPI.getAll(filter);
      setAnimals(data);
    } catch (error) {
      toast.error('Failed to load animals.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => { fetchAnimals(); }, 300);
    return () => clearTimeout(delayDebounce);
  }, [filter]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // API expects age as float and requires date_rescued
      const payload = { 
        ...formData, 
        age: formData.age ? parseFloat(formData.age) : null,
        date_rescued: new Date().toISOString().split('T')[0]
      };
      await animalsAPI.create(payload);
      toast.success('Animal registered successfully!');
      setIsModalOpen(false);
      setFormData({ name: '', species: 'Dog', breed: '', age: '', health_status: 'Healthy', rescue_location: '', status: 'Available' });
      fetchAnimals();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to register animal.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header animate-in flex justify-between items-center bg-white p-8 rounded-3xl mb-8 border border-border-color shadow-xl shadow-[#344e41]/5">
        <div>
          <h1 className="text-4xl">Resident Directory</h1>
          <p className="mt-2 text-[#8a9a91] font-bold uppercase tracking-widest text-[11px]">Comprehensive Shelter Population Management</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <FaPlus /> Register New Resident
        </button>
      </div>

      <div className="card mb-8 animate-in border-none shadow-xl shadow-[#344e41]/5 flex items-center gap-6 p-6" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center gap-3 text-[#8a9a91] font-bold text-[10px] uppercase tracking-widest">
          <FaFilter /> Filters
        </div>
        
        <select 
          className="form-control"
          style={{ width: '180px' }}
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
        >
          <option value="">Life Status</option>
          <option value="Rescued">Rescued</option>
          <option value="Under Treatment">In Wellbeing</option>
          <option value="Available">Available</option>
          <option value="Adopted">Adopted</option>
        </select>

        <select 
          className="form-control"
          style={{ width: '150px' }}
          value={filter.species}
          onChange={(e) => setFilter({ ...filter, species: e.target.value })}
        >
          <option value="">Species</option>
          <option value="Dog">Dogs</option>
          <option value="Cat">Cats</option>
          <option value="Bird">Birds</option>
          <option value="Rabbit">Rabbits</option>
          <option value="Other">Others</option>
        </select>

        <div className="relative flex-1">
          <FaSearch className="absolute top-1/2 -translate-y-1/2 left-4 text-[#8a9a91] opacity-40" />
          <input 
            type="text" 
            placeholder="Search residents by name or breed..." 
            className="form-control !pl-10" 
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
          />
        </div>
      </div>

      <div className="card border-none shadow-xl shadow-[#344e41]/5 bg-white p-0 overflow-hidden animate-in" style={{ animationDelay: '0.2s' }}>
        {loading ? (
          <div className="p-20"><LoadingSpinner /></div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Identity</th>
                  <th>Classification</th>
                  <th>Maturity</th>
                  <th>joined</th>
                  <th>Current State</th>
                </tr>
              </thead>
              <tbody>
                {animals.map((animal) => (
                  <tr key={animal.animal_id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#344e41]/5 text-[#344e41] flex items-center justify-center text-sm font-black opacity-40">
                          {animal.animal_id}
                        </div>
                        <div className="font-heading text-lg font-bold text-[#2d3a33]">{animal.name}</div>
                      </div>
                    </td>
                    <td>
                      <div className="text-xs font-bold text-[#344e41] uppercase tracking-wider">{animal.species}</div>
                      <div className="text-[10px] text-[#8a9a91] font-bold uppercase tracking-widest mt-0.5">{animal.breed || 'Unknown'}</div>
                    </td>
                    <td className="font-bold text-[#4a5c53] text-sm">{animal.age ? `${animal.age} yrs` : 'New'}</td>
                    <td className="text-xs font-bold text-[#8a9a91]">{animal.date_rescued}</td>
                    <td><StatusBadge status={animal.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Register Animal Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}>
          <div className="modal-content custom-scrollbar">
            <div className="modal-header">
              <h2>Register New Resident</h2>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleRegister}>
              <div className="form-row">
                <div className="form-group">
                  <label>Name *</label>
                  <input type="text" className="form-control" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Age (Years)</label>
                  <input type="number" step="0.1" className="form-control" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Species *</label>
                  <select className="form-control" value={formData.species} onChange={e => setFormData({...formData, species: e.target.value})}>
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Bird">Bird</option>
                    <option value="Rabbit">Rabbit</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Breed</label>
                  <input type="text" className="form-control" value={formData.breed} onChange={e => setFormData({...formData, breed: e.target.value})} />
                </div>
              </div>

              <div className="form-group">
                <label>Health Status</label>
                <input type="text" className="form-control" placeholder="E.g. Healthy, Injured Leg, Malnourished" required value={formData.health_status} onChange={e => setFormData({...formData, health_status: e.target.value})} />
              </div>

              <div className="form-group">
                <label>Rescue Location *</label>
                <textarea className="form-control" required rows="2" value={formData.rescue_location} onChange={e => setFormData({...formData, rescue_location: e.target.value})}></textarea>
              </div>

              <div className="form-group">
                <label>Initial Status *</label>
                <select className="form-control" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                  <option value="Rescued">Rescued (Under Evaluation)</option>
                  <option value="Available">Available for Adoption</option>
                  <option value="Under Treatment">Under Treatment</option>
                </select>
                <small className="text-[#8a9a91] font-medium mt-1 block italic text-xs">Marking as 'Available' will display the animal in the Adoption Portal.</small>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Registering...' : 'Register Animal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Animals;
