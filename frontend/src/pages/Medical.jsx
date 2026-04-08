import React, { useState, useEffect } from 'react';
import { medicalAPI, animalsAPI } from '../services/api';
import { LoadingSpinner } from '../components/UI';
import { FaStethoscope, FaCalendarPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Medical = () => {
  const [animals, setAnimals] = useState([]);
  const [records, setRecords] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [loading, setLoading] = useState(true);

  // Medical Record Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    treatment: '', diagnosis: '', medication: '', vet_name: '', record_type: 'Checkup'
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAnimals();
  }, []);

  const fetchAnimals = async () => {
    try {
      const { data } = await animalsAPI.getAll();
      setAnimals(data);
    } catch (err) {
      toast.error('Failed to load animals.');
    } finally {
      setLoading(false);
    }
  };

  const loadRecords = async (animalId) => {
    setSelectedAnimal(animalId);
    try {
      const { data } = await medicalAPI.getByAnimal(animalId);
      setRecords(data);
    } catch (err) {
      toast.error('Failed to load medical records.');
    }
  };

  const handleAddRecord = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { 
        ...formData, 
        animal_id: selectedAnimal,
        treatment_date: new Date().toISOString().split('T')[0]
      };
      await medicalAPI.create(payload);
      toast.success('Medical record added successfully!');
      setIsModalOpen(false);
      setFormData({ treatment: '', diagnosis: '', medication: '', vet_name: '', record_type: 'Checkup' });
      loadRecords(selectedAnimal);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to add medical record.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="page-header animate-in">
        <h1>Medical Records</h1>
        <p>Track treatments, vaccinations, and surgeries.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="card w-full lg:w-[320px] p-0 overflow-hidden animate-in h-[calc(100vh-200px)] flex flex-col" style={{ animationDelay: '0.1s' }}>
          <div className="p-5 bg-[#f8faf9] border-b border-border-color sticky top-0 z-10">
            <h3 className="font-heading text-lg font-bold text-[#2d3a33] m-0">Residents List</h3>
          </div>
          <div className="overflow-y-auto flex-1 custom-scrollbar">
            {animals.map((a) => (
              <div 
                key={a.animal_id}
                onClick={() => loadRecords(a.animal_id)}
                className={`p-4 border-b border-border-color cursor-pointer transition-all ${
                  selectedAnimal === a.animal_id ? 'bg-[#344e41]/5 border-l-4 border-l-[#344e41]' : 'hover:bg-[#344e41]/2'
                }`}
              >
                <div className="font-bold text-[#2d3a33] text-sm uppercase tracking-tight">{a.name} <span className="text-[#8a9a91] text-[10px] font-extrabold opacity-40 ml-1">#{a.animal_id}</span></div>
                <div className="text-[11px] text-[#8a9a91] font-bold uppercase tracking-wider mt-1">{a.species} • {a.health_status}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1">
          {selectedAnimal ? (
            <div className="card animate-in border-none shadow-xl shadow-[#344e41]/5 bg-white" style={{ animationDelay: '0.2s', minHeight: '400px' }}>
              <div className="flex justify-between items-center mb-8 border-b border-border-color pb-6">
                <div>
                  <h3 className="font-heading text-2xl font-bold text-[#2d3a33] flex items-center gap-3">
                    <FaStethoscope className="text-[#344e41] opacity-40"/> wellbeing Trail
                  </h3>
                  <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#8a9a91] mt-1">Medical checkups & treatments</p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                  <FaCalendarPlus/> Add Record
                </button>
              </div>

              <div className="relative border-l-2 border-[#dad7cd] ml-4 pl-8 py-2 flex flex-col gap-8">
                {records.map((r, i) => (
                  <div key={r.record_id} className="relative group">
                    <div className="absolute -left-[37px] top-2 w-4 h-4 rounded-full bg-white border-4 border-[#344e41] shadow-sm z-10 transition-transform group-hover:scale-125"></div>
                    <div className="bg-[#f8faf9] p-6 rounded-2xl border border-border-color transition-all group-hover:border-[#344e41]/20 group-hover:shadow-md">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-[11px] uppercase tracking-[0.2em] text-[#344e41] bg-[#344e41]/10 py-1 px-3 rounded-full">{r.record_type}</span>
                        <span className="text-xs font-bold text-[#8a9a91] uppercase tracking-widest">{r.treatment_date}</span>
                      </div>
                      <h4 className="font-heading text-xl font-bold text-[#2d3a33] mb-3">{r.treatment}</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-medium text-[#4a5c53]">
                        {r.diagnosis && <div><span className="text-[#8a9a91] font-bold text-[10px] uppercase block mb-1">Diagnosis</span> {r.diagnosis}</div>}
                        {r.medication && <div><span className="text-[#8a9a91] font-bold text-[10px] uppercase block mb-1">Medications</span> {r.medication}</div>}
                        <div><span className="text-[#8a9a91] font-bold text-[10px] uppercase block mb-1">Attending Vet</span> {r.vet_name}</div>
                        {r.follow_up_date && <div><span className="text-[#8a9a91] font-bold text-[10px] uppercase block mb-1">Next Review</span> <span className="text-[#bf8000]">{r.follow_up_date}</span></div>}
                      </div>
                    </div>
                  </div>
                ))}
                
                {records.length === 0 && (
                  <div className="text-muted py-4">No medical records found for this animal.</div>
                )}
              </div>
            </div>
          ) : (
            <div className="card h-full flex items-center justify-center text-center p-12 text-muted animate-in">
              <div>
                <FaStethoscope className="text-5xl mx-auto mb-4 opacity-30" />
                <p>Select an animal from the list to view their medical history.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Record Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add Medical Record</h2>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleAddRecord}>
              <div className="form-row">
                <div className="form-group">
                  <label>Record Type *</label>
                  <select className="form-control" value={formData.record_type} onChange={e => setFormData({...formData, record_type: e.target.value})}>
                    <option value="Checkup">Checkup</option>
                    <option value="Vaccination">Vaccination</option>
                    <option value="Surgery">Surgery</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Veterinarian Name *</label>
                  <input type="text" className="form-control" required value={formData.vet_name} onChange={e => setFormData({...formData, vet_name: e.target.value})} />
                </div>
              </div>

              <div className="form-group">
                <label>Diagnosis / Problem Details</label>
                <input type="text" className="form-control" placeholder="E.g. Broken Leg, Parasites, General Exam" value={formData.diagnosis} onChange={e => setFormData({...formData, diagnosis: e.target.value})} />
              </div>

              <div className="form-group">
                <label>Treatment Provided *</label>
                <textarea className="form-control" required rows="2" placeholder="Describe the treatment..." value={formData.treatment} onChange={e => setFormData({...formData, treatment: e.target.value})}></textarea>
              </div>

              <div className="form-group">
                <label>Medications Prescribed</label>
                <input type="text" className="form-control" placeholder="E.g. Antibiotics 50mg, Painkillers" value={formData.medication} onChange={e => setFormData({...formData, medication: e.target.value})} />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Medical;
