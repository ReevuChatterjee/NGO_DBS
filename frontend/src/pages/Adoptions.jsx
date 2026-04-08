import React, { useState, useEffect } from 'react';
import { animalsAPI, adoptionsAPI } from '../services/api';
import { LoadingSpinner, StatusBadge } from '../components/UI';
import { FaHeart, FaMapMarkerAlt, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Adoptions = () => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [formData, setFormData] = useState({
    adopter_name: '', adopter_email: '', adopter_phone: '',
    adopter_address: '', adopter_id_proof: '', notes: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadAvailable();
  }, []);

  const loadAvailable = async () => {
    setLoading(true);
    try {
      const { data } = await animalsAPI.getAll({ status: 'Available' });
      setAnimals(data);
    } catch (err) {
      toast.error('Failed to load available animals.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await adoptionsAPI.create({ ...formData, animal_id: selectedAnimal.animal_id });
      toast.success('Adoption request submitted successfully!');
      setSelectedAnimal(null);
      loadAvailable(); // Refresh list to drop animal
      setFormData({ adopter_name: '', adopter_email: '', adopter_phone: '', adopter_address: '', adopter_id_proof: '', notes: '' });
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to submit request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header animate-in">
        <h1>Adoption Portal</h1>
        <p>Find your new best friend.</p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="cards-grid">
          {animals.map((animal, i) => (
            <div key={animal.animal_id} className="card border-none bg-white animate-in flex flex-col p-0 overflow-hidden" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="bg-[#dad7cd]/40 aspect-[16/10] flex items-center justify-center text-4xl relative">
                <span className="opacity-30 grayscale">
                  {animal.species === 'Dog' ? '🐶' : animal.species === 'Cat' ? '🐱' : animal.species === 'Bird' ? '🦜' : animal.species === 'Rabbit' ? '🐰' : '🐾'}
                </span>
                <div className="absolute top-3 right-3"><StatusBadge status={animal.status} /></div>
                <div className="absolute bottom-3 left-3 py-0.5 px-2 bg-white/40 backdrop-blur-md rounded-full text-[9px] font-bold text-[#344e41] uppercase tracking-wider border border-white/20">
                  {animal.gender} • {animal.age ? `${animal.age}y` : 'New'}
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-xl font-heading font-bold text-[#2d3a33] mb-1">{animal.name}</h3>
                <p className="text-[#8a9a91] font-bold text-[10px] uppercase tracking-widest mb-3">
                  {animal.breed || 'Unique Cross'}
                </p>
                
                <div className="mb-5 text-[13px] leading-relaxed text-[#4a5c53] font-medium flex-1">
                  <p className="border-l-2 border-[#dad7cd] pl-3 italic line-clamp-2">
                    {animal.health_status}. Residing in {animal.rescue_location}.
                  </p>
                </div>

                <button 
                  className="btn btn-primary w-full btn-sm group"
                  onClick={() => setSelectedAnimal(animal)}
                >
                  <FaHeart className="text-[10px]" /> 
                  Begin a Story
                </button>
              </div>
            </div>
          ))}
          {animals.length === 0 && (
            <div className="col-span-full text-center py-12 card text-muted">
              No animals are currently marked as available for adoption.
            </div>
          )}
        </div>
      )}

      {/* Adoption Form Modal */}
      {selectedAnimal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Adopt {selectedAnimal.name}</h2>
              <button className="modal-close" onClick={() => setSelectedAnimal(null)}><FaTimes/></button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input type="text" className="form-control" required value={formData.adopter_name} onChange={e => setFormData({...formData, adopter_name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input type="email" className="form-control" required value={formData.adopter_email} onChange={e => setFormData({...formData, adopter_email: e.target.value})} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input type="tel" className="form-control" required minLength={10} value={formData.adopter_phone} onChange={e => setFormData({...formData, adopter_phone: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>ID Proof Number (optional)</label>
                  <input type="text" className="form-control" value={formData.adopter_id_proof} onChange={e => setFormData({...formData, adopter_id_proof: e.target.value})} />
                </div>
              </div>

              <div className="form-group">
                <label>Complete Address *</label>
                <textarea className="form-control" required value={formData.adopter_address} onChange={e => setFormData({...formData, adopter_address: e.target.value})}></textarea>
              </div>

              <div className="form-group">
                <label>Additional Notes / Experience</label>
                <textarea className="form-control" placeholder="E.g., Have owned dogs before, living in apartment..." value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}></textarea>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedAnimal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Adoptions;
