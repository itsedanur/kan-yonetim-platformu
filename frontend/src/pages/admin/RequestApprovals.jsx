import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FileCheck, FileX, AlertOctagon, Search, Droplet, MapPin, Activity, CheckCircle, XCircle } from 'lucide-react';

const RequestApprovals = () => {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Pending');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchApprovals();
  }, []);

  const fetchApprovals = async () => {
    try {
      // Mock data if backend is empty
      const response = await axios.get('/Admin/approvals');
      if (response.data && response.data.length > 0) {
        setApprovals(response.data);
      } else {
        // Mock data
        setApprovals([
          { id: 1, hospitalName: 'Şişli Etfal Hastanesi', bloodTypeName: 'A+', unitsNeeded: 5, urgencyLevel: 'Kritik', status: 'Pending', notes: '', decidedAt: new Date().toISOString() },
          { id: 2, hospitalName: 'Çam ve Sakura Şehir Hastanesi', bloodTypeName: 'B-', unitsNeeded: 2, urgencyLevel: 'Acil', status: 'Approved', notes: 'Hemen gönderilecek', decidedAt: new Date(Date.now() - 86400000).toISOString() },
          { id: 3, hospitalName: 'Üsküdar Devlet Hastanesi', bloodTypeName: '0+', unitsNeeded: 1, urgencyLevel: 'Normal', status: 'Rejected', notes: 'Yetersiz stok', decidedAt: new Date(Date.now() - 172800000).toISOString() },
          { id: 4, hospitalName: 'Bakırköy Sadi Konuk', bloodTypeName: 'AB+', unitsNeeded: 10, urgencyLevel: 'Kritik', status: 'Spam', notes: 'Doğrulanamadı', decidedAt: new Date(Date.now() - 259200000).toISOString() }
        ]);
      }
    } catch (error) {
      toast.error('Onay verileri yüklenemedi.');
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = (id, newStatus) => {
    // Optimistic UI update
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    toast.success(`Talep durumu "${newStatus}" olarak güncellendi.`);
    // In real app, call axios.put(`/Admin/approvals/${id}`, { status: newStatus })
  };

  const filteredApprovals = approvals.filter(a => a.status === activeTab && (
    a.hospitalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.bloodTypeName?.toLowerCase().includes(searchTerm.toLowerCase())
  ));

  return (
    <div className="animate-in" style={{ paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>Talep Onay Merkezi</h1>
          <p style={{ color: '#64748b', fontSize: '1rem', margin: 0 }}>Hastanelerden gelen kan taleplerini yönetin ve onaylayın.</p>
        </div>
      </div>

      <div className="card glass" style={{ background: '#ffffff', borderRadius: '32px', border: '1px solid rgba(0,0,0,0.03)', boxShadow: '0 20px 50px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        
        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
          {[
            { id: 'Pending', label: 'Bekleyenler', icon: Activity, color: '#f59e0b' },
            { id: 'Approved', label: 'Onaylananlar', icon: FileCheck, color: '#10b981' },
            { id: 'Rejected', label: 'Reddedilenler', icon: FileX, color: '#ef4444' },
            { id: 'Spam', label: 'Spam/İptal', icon: AlertOctagon, color: '#64748b' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1, padding: '1.25rem', border: 'none', background: activeTab === tab.id ? '#ffffff' : 'transparent',
                borderBottom: activeTab === tab.id ? `3px solid ${tab.color}` : '3px solid transparent',
                color: activeTab === tab.id ? tab.color : '#64748b', fontWeight: activeTab === tab.id ? '800' : '600',
                fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              <tab.icon size={18} /> {tab.label}
              <span style={{ background: activeTab === tab.id ? `${tab.color}20` : '#e2e8f0', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem' }}>
                {approvals.filter(a => a.status === tab.id).length}
              </span>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ position: 'relative', width: '350px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="Hastane veya kan grubu ara..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.9rem', color: '#0f172a', background: '#ffffff' }} 
            />
          </div>
        </div>

        {/* List */}
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Yükleniyor...</div>
          ) : filteredApprovals.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
              <CheckCircle size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.2 }} />
              <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>Bu kategoride talep bulunmuyor.</p>
            </div>
          ) : filteredApprovals.map(a => (
            <div key={a.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '16px', background: '#ffffff', transition: 'all 0.2s', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }} onMouseOver={e => e.currentTarget.style.borderColor = '#cbd5e1'} onMouseOut={e => e.currentTarget.style.borderColor = '#e2e8f0'}>
              
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'rgba(225,29,72,0.1)', color: '#e11d48', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
                  <Droplet size={20} />
                  <span style={{ fontSize: '0.85rem' }}>{a.bloodTypeName}</span>
                </div>
                <div>
                  <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={16} color="#94a3b8"/> {a.hospitalName}
                  </h3>
                  <div style={{ display: 'flex', gap: '1rem', color: '#64748b', fontSize: '0.9rem' }}>
                    <span><strong>Miktar:</strong> {a.unitsNeeded} Ünite</span>
                    <span><strong>Aciliyet:</strong> <span style={{ color: a.urgencyLevel === 'Kritik' ? '#ef4444' : a.urgencyLevel === 'Acil' ? '#f59e0b' : '#3b82f6', fontWeight: '700' }}>{a.urgencyLevel}</span></span>
                    <span><strong>Tarih:</strong> {new Date(a.decidedAt).toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>
              </div>

              {activeTab === 'Pending' && (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleStatusUpdate(a.id, 'Approved')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '12px', border: 'none', background: '#10b981', color: 'white', fontWeight: '700', cursor: 'pointer', transition: 'transform 0.1s' }} onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'} onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}>
                    <CheckCircle size={18} /> Onayla
                  </button>
                  <button onClick={() => handleStatusUpdate(a.id, 'Rejected')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '12px', border: '1px solid #ef4444', background: '#ffffff', color: '#ef4444', fontWeight: '700', cursor: 'pointer', transition: 'transform 0.1s' }} onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'} onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}>
                    <XCircle size={18} /> Reddet
                  </button>
                  <button onClick={() => handleStatusUpdate(a.id, 'Spam')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#64748b', cursor: 'pointer' }}>
                    <AlertOctagon size={18} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RequestApprovals;
