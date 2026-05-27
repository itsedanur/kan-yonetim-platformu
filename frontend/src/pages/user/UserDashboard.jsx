import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  XCircle,
  Calendar, 
  MapPin, 
  Activity, 
  Heart, 
  PlusCircle, 
  FileText, 
  Users, 
  Droplet, 
  ArrowRight, 
  Clock, 
  PhoneCall, 
  Plus, 
  History,
  Navigation,
  Send
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  LineChart, 
  Line 
} from 'recharts';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ISTANBUL_ILCELER = [
  'Adalar', 'Arnavutköy', 'Ataşehir', 'Avcılar', 'Bağcılar', 'Bahçelievler', 'Bakırköy', 
  'Başakşehir', 'Bayrampaşa', 'Beşiktaş', 'Beykoz', 'Beylikdüzü', 'Beyoğlu', 'Büyükçekmece', 
  'Çatalca', 'Çekmeköy', 'Esenler', 'Esenyurt', 'Eyüpsultan', 'Fatih', 'Gaziosmanpaşa', 
  'Güngören', 'Kadıköy', 'Kağıthane', 'Kartal', 'Küçükçekmece', 'Maltepe', 'Pendik', 
  'Sancaktepe', 'Sarıyer', 'Silivri', 'Sultanbeyli', 'Sultangazi', 'Şile', 'Şişli', 
  'Tuzla', 'Ümraniye', 'Üsküdar', 'Zeytinburnu'
];

const HASTANELER = {
  'Fatih': 'Fatih Devlet Hastanesi',
  'Şişli': 'Şişli Etfal Eğitim ve Araştırma Hastanesi',
  'Kadıköy': 'Kadıköy Acıbadem Hastanesi',
  'Beşiktaş': 'Beşiktaş Devlet Hastanesi',
  'Üsküdar': 'Üsküdar Devlet Hastanesi',
  'Bakırköy': 'Bakırköy Ruh Sağlığı Hastanesi',
  'Beyoğlu': 'Beyoğlu Devlet Hastanesi',
  'Ümraniye': 'Ümraniye Eğitim ve Araştırma Hastanesi',
  'Kartal': 'Kartal Eğitim ve Araştırma Hastanesi',
  'Pendik': 'Pendik Devlet Hastanesi',
  'Maltepe': 'Maltepe Devlet Hastanesi',
  'Ataşehir': 'Ataşehir Devlet Hastanesi',
  'Sarıyer': 'Sarıyer İsveç Hastanesi',
  'Kağıthane': 'Kağıthane Devlet Hastanesi',
  'Eyüpsultan': 'Eyüpsultan Devlet Hastanesi',
  'Bayrampaşa': 'Bayrampaşa Kızılay Hastanesi',
  'Gaziosmanpaşa': 'Gaziosmanpaşa Taksim Eğitim Hastanesi',
  'Sultanbeyli': 'Sultanbeyli Devlet Hastanesi',
  'Tuzla': 'Tuzla Devlet Hastanesi',
  'Silivri': 'Silivri Devlet Hastanesi',
};

const getHastane = (ilce) => HASTANELER[ilce] || `${ilce} İlçe Devlet Hastanesi`;

const UserDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [eligibility, setEligibility] = useState(null);
  const [nearbyRequests, setNearbyRequests] = useState([]);
  const [activities, setActivities] = useState([]);
  const [homeStats, setHomeStats] = useState(null);
  const [monthlyStats, setMonthlyStats] = useState([]);

  // Form State for creating quick blood request
  const [formData, setFormData] = useState({
    type: 'Kendim için',
    district: user?.district || 'Fatih',
    hospital: '',
    bloodType: user?.bloodType || 'A+',
    urgency: 'Yüksek (Acil)',
    note: ''
  });

  useEffect(() => {
    setFormData(prev => ({ ...prev, hospital: getHastane(prev.district) }));
  }, [formData.district]);

  // Load Dashboard Data
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [
        profileRes, 
        eligibilityRes, 
        nearbyRes, 
        activitiesRes, 
        statsRes,
        monthlyRes
      ] = await Promise.all([
        axios.get('/User/profile').catch(() => ({ data: user })),
        axios.get('/Donor/eligibility').catch(() => null),
        axios.get('/Donor/nearby-requests').catch(() => null),
        axios.get('/User/activities').catch(() => null),
        axios.get('/Public/home-stats').catch(() => null),
        axios.get('/Donor/monthly-stats').catch(() => null)
      ]);

      if (profileRes) setProfileData(profileRes.data);
      if (eligibilityRes) setEligibility(eligibilityRes.data);
      if (nearbyRes) setNearbyRequests(nearbyRes.data || []);
      if (activitiesRes) setActivities(activitiesRes.data || []);
      if (statsRes) setHomeStats(statsRes.data);

      if (monthlyRes && monthlyRes.data) {
        const formattedMonthly = monthlyRes.data.map(item => ({
          name: item.name,
          Bağış: item.bagis,
          Talep: item.talep
        }));
        setMonthlyStats(formattedMonthly);
      } else {
        const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz'];
        const formattedMonthly = months.map(m => ({
          name: m,
          Bağış: 0,
          Talep: 0
        }));
        setMonthlyStats(formattedMonthly);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  // Form Submit Handler
  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    const newAlert = {
      id: Date.now(),
      bloodType: formData.bloodType,
      urgency: formData.urgency,
      ilce: formData.district,
      hastane: formData.hospital,
      date: new Date().toLocaleDateString('tr-TR'),
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      requester: profileData?.fullName || user?.fullName,
      requesterTc: user?.tc,
      requestType: formData.type,
      autoGenerated: false
    };

    try {
      // Save locally to localstorage for instant alerts sync across tabs
      const existing = JSON.parse(localStorage.getItem('stockAlerts') || '[]');
      localStorage.setItem('stockAlerts', JSON.stringify([newAlert, ...existing].slice(0, 50)));
      
      toast.success('Kan talebiniz oluşturuldu ve diğer bağışçılara iletildi!');
      // Reload lists
      loadDashboardData();
    } catch (e) {
      toast.error('Talep oluşturulurken bir hata oluştu.');
    }
  };

  // Doughnut Chart Data Formatting
  const pieData = homeStats?.bloodGroupStats?.map(bgs => ({
    name: bgs.name,
    value: bgs.value,
    color: bgs.name.includes('0') || bgs.name.includes('O') ? '#e11d48' : bgs.name.includes('A') ? '#8b5cf6' : bgs.name.includes('B') ? '#f59e0b' : '#3b82f6'
  })) || [
    { name: 'O Rh(-)', value: 5, color: '#e11d48' },
    { name: 'A+', value: 3, color: '#8b5cf6' },
    { name: 'B+', value: 2, color: '#f59e0b' },
    { name: 'AB+', value: 1, color: '#10b981' },
    { name: 'Diğer', value: 1, color: '#3b82f6' }
  ];

  const totalNeed = pieData.reduce((acc, curr) => acc + curr.value, 0);

  // Sparkline Chart Mock Datasets
  const sparklineData1 = [{ v: 5 }, { v: 8 }, { v: 6 }, { v: 12 }, { v: 9 }, { v: 14 }, { v: 12 }];
  const sparklineData2 = [{ v: 2 }, { v: 4 }, { v: 3 }, { v: 7 }, { v: 5 }, { v: 9 }, { v: 7 }];
  const sparklineData3 = [{ v: 3 }, { v: 3 }, { v: 4 }, { v: 4 }, { v: 4 }, { v: 4 }, { v: 4 }];
  const sparklineData4 = [{ v: 1100 }, { v: 1150 }, { v: 1180 }, { v: 1200 }, { v: 1210 }, { v: 1240 }, { v: 1248 }];

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '4px solid #f1f5f9', borderTopColor: '#e11d48', animation: 'spin 1s linear infinite' }} />
        <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '600' }}>Panel yükleniyor...</span>
        <style dangerouslySetInnerHTML={{__html: `@keyframes spin { to { transform: rotate(360deg); } }`}} />
      </div>
    );
  }

  // Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Kayıt Bulunmuyor';
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Relative Time Helper
  const getRelativeTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Az önce';
    if (diffMins < 60) return `${diffMins} dakika önce`;
    if (diffHours < 24) return `${diffHours} saat önce`;
    return `${diffDays} gün önce`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', animation: 'fadeInUp 0.6s ease-out' }}>
      
      {/* ROW 1: WELCOME & SPARKLINES */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr repeat(4, 1fr)', gap: '1.25rem', alignItems: 'stretch' }} className="dashboard-grid-row1">
        
        {/* Welcome & Eligibility Card */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #e2e8f0',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gridColumn: 'span 1',
          boxShadow: '0 4px 12px rgba(0,0,0,0.01)'
        }} className="welcome-card-grid">
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              Merhaba, {(profileData?.fullName || user?.fullName || '').split(' ')[0]} 👋
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.25rem 0 1rem 0', lineHeight: 1.4 }}>
              Bugün {homeStats?.activeRequestsCount || 12} aktif kan talebi var. Bir hayat kurtarmaya ne dersin?
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }} className="welcome-card-badges">
            {/* Eligibility Badge */}
            <div style={{
              flex: 1,
              backgroundColor: eligibility?.isEligible ? '#ecfdf5' : '#fff1f2',
              borderRadius: '16px',
              padding: '0.75rem',
              border: eligibility?.isEligible ? '1px solid #d1fae5' : '1px solid #ffe4e6',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <span style={{ 
                color: eligibility?.isEligible ? '#059669' : '#e11d48', 
                fontSize: '0.7rem', 
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                {eligibility?.isEligible ? <CheckCircle size={12} fill="#059669" color="white" /> : <XCircle size={12} fill="#e11d48" color="white" />}
                {eligibility?.isEligible ? 'Bağış Yapabilir' : 'Bağış Yapılamaz'}
              </span>
              <span style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '0.5rem', fontWeight: '500' }}>
                Son değerlendirme: Bugün 09:15
              </span>
              <button 
                onClick={() => toast(eligibility?.message || 'Bağış kriterleri standarda uygundur.', { icon: 'ℹ️' })}
                style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.65rem', fontWeight: '700', textDecoration: 'underline', cursor: 'pointer', textAlign: 'left', marginTop: '0.4rem', padding: 0 }}
              >
                Detayları Gör
              </button>
            </div>

            {/* Blood Type Box */}
            <div style={{
              width: '100px',
              background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)',
              border: '1px solid #ffd1d5',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.5rem'
            }}>
              <span style={{ fontSize: '1.25rem', fontWeight: '900', color: '#e11d48' }}>
                {user?.bloodType ? user.bloodType.replace('+', ' Rh(+)').replace('-', ' Rh(-)') : 'B Rh(+)'}
              </span>
              <span style={{ fontSize: '0.6rem', color: '#9f1239', fontWeight: '700', marginTop: '0.2rem' }}>
                Kan Grubunuz
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '0.85rem' }} className="welcome-card-footer">
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: '600' }}>Son bağışınız</span>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#334155' }}>
                {formatDate(profileData?.lastDonationDate)}
              </span>
            </div>
            <button 
              onClick={() => { const btn = document.querySelector('.sidebar-link[href="/my-requests"]'); if (btn) btn.click(); }}
              style={{ background: 'none', border: 'none', color: '#e11d48', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
            >
              Bağış Geçmişim <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* SPARKLINE CARD 1: ACTIVE REQUESTS */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '1.25rem', display: 'flex', flexDirection: 'column', justify: 'space-between', boxShadow: '0 4px 12px rgba(0,0,0,0.01)' }}>
          <div>
            <div style={{ backgroundColor: '#fff1f2', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e11d48', marginBottom: '0.75rem' }}>
              <Activity size={18} />
            </div>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Aktif Talepler</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', marginTop: '0.15rem' }}>
              <span style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a' }}>
                {homeStats?.activeRequestsCount || 12}
              </span>
              <span style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: '700' }}>+3 yeni bugün</span>
            </div>
          </div>
          <div style={{ height: '40px', marginTop: '0.5rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData1}>
                <Line type="monotone" dataKey="v" stroke="#e11d48" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SPARKLINE CARD 2: NEARBY REQUESTS */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '1.25rem', display: 'flex', flexDirection: 'column', justify: 'space-between', boxShadow: '0 4px 12px rgba(0,0,0,0.01)' }}>
          <div>
            <div style={{ backgroundColor: '#eff6ff', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', marginBottom: '0.75rem' }}>
              <MapPin size={18} />
            </div>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Yakındaki Talepler</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', marginTop: '0.15rem' }}>
              <span style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a' }}>
                {nearbyRequests.length || 7}
              </span>
              <span style={{ fontSize: '0.7rem', color: '#3b82f6', fontWeight: '700' }}>2 km içinde</span>
            </div>
          </div>
          <div style={{ height: '40px', marginTop: '0.5rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData2}>
                <Line type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SPARKLINE CARD 3: BLOOD STOCKS / HOSPITALS */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '1.25rem', display: 'flex', flexDirection: 'column', justify: 'space-between', boxShadow: '0 4px 12px rgba(0,0,0,0.01)' }}>
          <div>
            <div style={{ backgroundColor: '#f5f3ff', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6', marginBottom: '0.75rem' }}>
              <Users size={18} />
            </div>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Kan Merkezleri</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', marginTop: '0.15rem' }}>
              <span style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a' }}>
                {10 || homeStats?.bloodTypesCount}
              </span>
              <span style={{ fontSize: '0.7rem', color: '#8b5cf6', fontWeight: '700' }}>5 km içinde</span>
            </div>
          </div>
          <div style={{ height: '40px', marginTop: '0.5rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData3}>
                <Line type="monotone" dataKey="v" stroke="#8b5cf6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SPARKLINE CARD 4: LIVES SAVED */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '1.25rem', display: 'flex', flexDirection: 'column', justify: 'space-between', boxShadow: '0 4px 12px rgba(0,0,0,0.01)' }}>
          <div>
            <div style={{ backgroundColor: '#ecfdf5', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', marginBottom: '0.75rem' }}>
              <Heart size={18} />
            </div>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Kurtarılan Can</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', marginTop: '0.15rem' }}>
              <span style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a' }}>
                {homeStats?.livesSaved || '1.248'}
              </span>
              <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: '700' }}>Toplam katkınız</span>
            </div>
          </div>
          <div style={{ height: '40px', marginTop: '0.5rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData4}>
                <Line type="monotone" dataKey="v" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* ROW 2: FORMS, NEARBY REQUESTS & ACTIVITIES */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.5fr 1fr', gap: '1.5rem' }} className="dashboard-grid-row2">
        
        {/* Create Blood Request Card */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #e2e8f0',
          padding: '1.5rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.01)',
          display: 'flex',
          flexDirection: 'column'
        }} className="request-form-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <PlusCircle size={20} style={{ color: '#e11d48' }} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Acil Kan Talebi Oluştur</h3>
          </div>

          <form onSubmit={handleRequestSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '0.35rem' }}>Kan Grubu</label>
                <select 
                  id="quick-request-blood-type"
                  value={formData.bloodType} 
                  onChange={e => setFormData({ ...formData, bloodType: e.target.value })}
                  style={{ padding: '0.65rem 0.85rem', borderRadius: '10px', fontSize: '0.85rem' }}
                >
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', '0+', '0-'].map(kg => (
                    <option key={kg} value={kg}>{kg}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '0.35rem' }}>İlçe</label>
                <select 
                  value={formData.district} 
                  onChange={e => setFormData({ ...formData, district: e.target.value })}
                  style={{ padding: '0.65rem 0.85rem', borderRadius: '10px', fontSize: '0.85rem' }}
                >
                  {ISTANBUL_ILCELER.map(ilce => (
                    <option key={ilce} value={ilce}>{ilce}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '0.35rem' }}>Hastane</label>
              <input 
                type="text" 
                value={formData.hospital} 
                onChange={e => setFormData({ ...formData, hospital: e.target.value })}
                style={{ padding: '0.65rem 0.85rem', borderRadius: '10px', fontSize: '0.85rem' }}
                placeholder="Hastane adı girin..."
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '0.35rem' }}>Not (isteğe bağlı)</label>
              <textarea 
                value={formData.note}
                onChange={e => setFormData({ ...formData, note: e.target.value })}
                style={{ 
                  width: '100%', 
                  borderRadius: '10px', 
                  border: '1px solid #e2e8f0', 
                  padding: '0.65rem 0.85rem', 
                  fontSize: '0.85rem', 
                  minHeight: '70px',
                  maxHeight: '100px',
                  resize: 'vertical',
                  outline: 'none',
                  color: '#0f172a',
                  fontFamily: 'inherit'
                }}
                placeholder="İrtibat telefonu, talep nedeni vb. ekleyebilirsiniz..."
              />
            </div>

            <button 
              type="submit" 
              style={{ 
                marginTop: 'auto', 
                backgroundColor: '#e11d48', 
                color: 'white', 
                border: 'none', 
                padding: '0.75rem', 
                borderRadius: '12px', 
                fontWeight: '800', 
                fontSize: '0.85rem', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 12px rgba(225,29,72,0.15)'
              }}
            >
              <Send size={16} /> Talep Oluştur
            </button>

          </form>
        </div>

        {/* Nearby Requests List Card */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #e2e8f0',
          padding: '1.5rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.01)',
          display: 'flex',
          flexDirection: 'column'
        }} className="nearby-requests-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Droplet size={20} style={{ color: '#e11d48' }} fill="#e11d48" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Yakınımdaki Acil Talepler</h3>
            </div>
            <Link to="/blood-requests" style={{ fontSize: '0.75rem', fontWeight: '700', color: '#e11d48', textDecoration: 'none' }}>
              Tümünü Gör
            </Link>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }} className="custom-scrollbar nearby-reqs-scroll">
            {nearbyRequests.length > 0 ? (
              nearbyRequests.map((req) => (
                <div key={req.id} style={{ display: 'flex', alignItems: 'center', padding: '0.75rem 1rem', border: '1px solid #f1f5f9', borderRadius: '16px', backgroundColor: '#ffffff', transition: 'border-color 0.2s' }} className="request-list-item">
                  <div style={{ 
                    backgroundColor: req.urgencyLevel === 'Kritik' || req.urgencyLevel === 'Acil' ? '#fff1f2' : '#f5f3ff', 
                    width: '44px', 
                    height: '44px', 
                    borderRadius: '12px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Droplet size={14} fill={req.urgencyLevel === 'Kritik' || req.urgencyLevel === 'Acil' ? '#e11d48' : '#8b5cf6'} color={req.urgencyLevel === 'Kritik' || req.urgencyLevel === 'Acil' ? '#e11d48' : '#8b5cf6'} />
                    <span style={{ fontSize: '0.55rem', fontWeight: '800', color: req.urgencyLevel === 'Kritik' || req.urgencyLevel === 'Acil' ? '#e11d48' : '#8b5cf6', marginTop: '2px' }}>
                      {req.urgencyLevel === 'Kritik' || req.urgencyLevel === 'Acil' ? 'Acil' : 'Orta'}
                    </span>
                  </div>

                  <div style={{ marginLeft: '1rem', flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '800', color: '#0f172a' }}>
                      {req.bloodTypeName || 'O Rh(-)'}
                    </p>
                    <p style={{ margin: '0.1rem 0 0 0', fontSize: '0.75rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {req.hospitalName || 'Kadıköy Acıbadem Hastanesi'}
                    </p>
                  </div>

                  <div style={{ textAlign: 'right', marginLeft: '0.75rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#e11d48' }}>
                      {req.distanceKm ? `${req.distanceKm.toFixed(1)} km` : '2.4 km'}
                    </span>
                    <span style={{ display: 'block', fontSize: '0.6rem', color: '#94a3b8', marginTop: '2px' }}>
                      Mesafe
                    </span>
                  </div>
                </div>
              ))
            ) : (
              // Fallback default list
              [
                { blood: 'O Rh(-)', hospital: 'Kadıköy Acıbadem Hastanesi', dist: '2.1 km', urgency: 'Acil' },
                { blood: 'B+', hospital: 'Çekmeköy Devlet Hastanesi', dist: '3.4 km', urgency: 'Acil' },
                { blood: 'A+', hospital: 'Kartal Eğitim Araştırma Hastanesi', dist: '4.8 km', urgency: 'Orta' },
                { blood: 'AB+', hospital: 'Ümraniye Eğitim Araştırma Hastanesi', dist: '5.2 km', urgency: 'Bekliyor' }
              ].map((fallback, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', padding: '0.75rem 1rem', border: '1px solid #f1f5f9', borderRadius: '16px', backgroundColor: '#ffffff' }} className="request-list-item">
                  <div style={{ 
                    backgroundColor: fallback.urgency === 'Acil' ? '#fff1f2' : fallback.urgency === 'Orta' ? '#fffbeb' : '#eff6ff', 
                    width: '44px', 
                    height: '44px', 
                    borderRadius: '12px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Droplet size={14} fill={fallback.urgency === 'Acil' ? '#e11d48' : fallback.urgency === 'Orta' ? '#d97706' : '#2563eb'} color={fallback.urgency === 'Acil' ? '#e11d48' : fallback.urgency === 'Orta' ? '#d97706' : '#2563eb'} />
                    <span style={{ fontSize: '0.55rem', fontWeight: '800', color: fallback.urgency === 'Acil' ? '#e11d48' : fallback.urgency === 'Orta' ? '#d97706' : '#2563eb', marginTop: '2px' }}>
                      {fallback.urgency}
                    </span>
                  </div>

                  <div style={{ marginLeft: '1rem', flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '800', color: '#0f172a' }}>
                      {fallback.blood}
                    </p>
                    <p style={{ margin: '0.1rem 0 0 0', fontSize: '0.75rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {fallback.hospital}
                    </p>
                  </div>

                  <div style={{ textAlign: 'right', marginLeft: '0.75rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#e11d48' }}>
                      {fallback.dist}
                    </span>
                    <span style={{ display: 'block', fontSize: '0.6rem', color: '#94a3b8', marginTop: '2px' }}>
                      Mesafe
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Activities Timeline Card */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #e2e8f0',
          padding: '1.5rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.01)',
          display: 'flex',
          flexDirection: 'column'
        }} className="activities-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={20} style={{ color: '#e11d48' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Son Aktiviteler</h3>
            </div>
            <button 
              onClick={() => { const btn = document.querySelector('.sidebar-link[href="/profile"]'); if (btn) btn.click(); }}
              style={{ background: 'none', border: 'none', fontSize: '0.75rem', fontWeight: '700', color: '#e11d48', cursor: 'pointer', textDecoration: 'none' }}
            >
              Tümünü Gör
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingLeft: '0.5rem' }} className="custom-scrollbar activities-scroll">
            {activities.length > 0 ? (
              activities.map((act, idx) => (
                <div key={act.id} style={{ display: 'flex', gap: '0.85rem', position: 'relative' }}>
                  {/* Timeline bar line */}
                  {idx !== activities.length - 1 && (
                    <div style={{ position: 'absolute', top: '22px', left: '9px', bottom: '-22px', width: '2px', backgroundColor: '#f1f5f9' }} />
                  )}
                  {/* Bullet Node */}
                  <div style={{ 
                    width: '20px', 
                    height: '20px', 
                    borderRadius: '50%', 
                    backgroundColor: '#fff1f2', 
                    border: '2px solid #e11d48', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexShrink: 0,
                    zIndex: 2
                  }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#e11d48' }} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#334155', fontWeight: '600', lineHeight: 1.3 }}>
                      {act.description || 'Profil bilgileri güncellendi'}
                    </p>
                    <span style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '0.2rem', display: 'block' }}>
                      {getRelativeTime(act.createdAt)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              // Fallback mock timeline
              [
                { desc: 'Profil bilgileri güncellendi', time: new Date(Date.now() - 2 * 60 * 60 * 1000) },
                { desc: 'E-posta adresi doğrulandı', time: new Date(Date.now() - 5 * 60 * 60 * 1000) },
                { desc: 'Kan grubu bilgisi güncellendi', time: new Date(Date.now() - 24 * 60 * 60 * 1000) },
                { desc: 'Bildirim tercihleri güncellendi', time: new Date(Date.now() - 48 * 60 * 60 * 1000) },
                { desc: 'Yeni kan talebine başvurdun', time: new Date(Date.now() - 72 * 60 * 60 * 1000) }
              ].map((fallback, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.85rem', position: 'relative' }}>
                  {idx !== 4 && (
                    <div style={{ position: 'absolute', top: '22px', left: '9px', bottom: '-22px', width: '2px', backgroundColor: '#f1f5f9' }} />
                  )}
                  <div style={{ 
                    width: '20px', 
                    height: '20px', 
                    borderRadius: '50%', 
                    backgroundColor: idx === 4 ? '#ecfdf5' : '#fff1f2', 
                    border: idx === 4 ? '2px solid #10b981' : '2px solid #e11d48', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexShrink: 0,
                    zIndex: 2
                  }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: idx === 4 ? '#10b981' : '#e11d48' }} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#334155', fontWeight: '600', lineHeight: 1.3 }}>
                      {fallback.desc}
                    </p>
                    <span style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '0.2rem', display: 'block' }}>
                      {getRelativeTime(fallback.time)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* ROW 3: CHARTS & QUICK ACTIONS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr 1fr', gap: '1.5rem', alignItems: 'stretch' }} className="dashboard-grid-row3">
        
        {/* Doughnut Distribution Chart */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #e2e8f0',
          padding: '1.5rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.01)',
          display: 'flex',
          flexDirection: 'column'
        }} className="distribution-chart-card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: '0 0 1rem 0' }}>Kan Talep Dağılımı</h3>
          
          <div style={{ display: 'flex', flex: 1, alignItems: 'center' }} className="distribution-chart-inner">
            {/* Chart */}
            <div style={{ width: '50%', height: '150px', position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius="65%" outerRadius="90%" paddingAngle={4} dataKey="value" stroke="none">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} Ünite`, 'Talep']} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '600' }}>Toplam</span>
                <span style={{ fontSize: '1.35rem', color: '#0f172a', fontWeight: '900' }}>{totalNeed}</span>
              </div>
            </div>
            {/* Legend */}
            <div style={{ width: '50%', display: 'flex', flexDirection: 'column', gap: '0.45rem', paddingLeft: '1rem' }} className="distribution-legend">
              {pieData.map((item, i) => {
                const percentage = totalNeed > 0 ? Math.round((item.value / totalNeed) * 100) : 0;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }} />
                      <span style={{ fontSize: '0.75rem', color: '#334155', fontWeight: '700' }}>{item.name}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '800' }}>%{percentage}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '0.85rem', marginTop: '0.5rem' }}>
            <Link to="/blood-requests" style={{ fontSize: '0.8rem', fontWeight: '700', color: '#e11d48', textDecoration: 'none' }}>
              Detaylı İstatistikler →
            </Link>
          </div>
        </div>

        {/* Bar Chart Donation vs Demand */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #e2e8f0',
          padding: '1.5rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.01)',
          display: 'flex',
          flexDirection: 'column'
        }} className="monthly-chart-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Aylık Bağış İstatistiğiniz</h3>
            {/* Chart Legend */}
            <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem', fontWeight: '600' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#e11d48' }}>
                <div style={{ width: '10px', height: '10px', backgroundColor: '#e11d48', borderRadius: '3px' }} />
                Bağış
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#94a3b8' }}>
                <div style={{ width: '10px', height: '10px', backgroundColor: '#cbd5e1', borderRadius: '3px' }} />
                Talep
              </div>
            </div>
          </div>

          <div style={{ flex: 1, minHeight: '140px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyStats} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: '600' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: '600' }} />
                <Tooltip />
                <Bar dataKey="Bağış" fill="#e11d48" radius={[4, 4, 0, 0]} barSize={12} />
                <Bar dataKey="Talep" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '0.85rem', marginTop: '0.5rem' }}>
            <button 
              onClick={() => toast.success('İstatistikleriniz günceldir.')}
              style={{ background: 'none', border: 'none', fontSize: '0.8rem', fontWeight: '700', color: '#e11d48', cursor: 'pointer' }}
            >
              İstatistikleri Gör →
            </button>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #e2e8f0',
          padding: '1.5rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.01)',
          display: 'flex',
          flexDirection: 'column'
        }} className="quick-actions-card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: '0 0 1rem 0' }}>Hızlı İşlemler</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', flex: 1 }} className="quick-actions-grid">
            
            {/* Quick 1: Create request */}
            <button 
              onClick={() => {
                const select = document.getElementById('quick-request-blood-type');
                if (select) {
                  select.focus();
                  select.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  toast.success('Talep oluşturma alanına yönlendirildiniz.');
                }
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem', border: 'none', borderRadius: '16px', backgroundColor: '#fff1f2', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left' }}
              className="quick-action-btn action-red"
            >
              <div style={{ color: '#e11d48', backgroundColor: '#ffffff', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Plus size={18} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#9f1239' }}>Kan Talebi Oluştur</span>
            </button>

            {/* Quick 2: Nearest Centers */}
            <button 
              onClick={() => navigate('/blood-requests')}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem', border: 'none', borderRadius: '16px', backgroundColor: '#eff6ff', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left' }}
              className="quick-action-btn action-blue"
            >
              <div style={{ color: '#3b82f6', backgroundColor: '#ffffff', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MapPin size={18} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#1d4ed8' }}>Yakın Merkezleri Gör</span>
            </button>

            {/* Quick 3: Donation History */}
            <button 
              onClick={() => {
                window.dispatchEvent(new Event('open-donation-history'));
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem', border: 'none', borderRadius: '16px', backgroundColor: '#ecfdf5', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left' }}
              className="quick-action-btn action-green"
            >
              <div style={{ color: '#10b981', backgroundColor: '#ffffff', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <History size={18} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#047857' }}>Bağış Geçmişim</span>
            </button>

            {/* Quick 4: Emergency Contacts */}
            <button 
              onClick={() => {
                toast(
                  <div>
                    <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Acil Kan Destek Hattı</strong>
                    Kızılay İletişim: 168<br />
                    Ambulans: 112
                  </div>,
                  { duration: 5000 }
                );
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem', border: 'none', borderRadius: '16px', backgroundColor: '#fffbeb', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left' }}
              className="quick-action-btn action-yellow"
            >
              <div style={{ color: '#d97706', backgroundColor: '#ffffff', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PhoneCall size={18} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#b45309' }}>Acil Rehber</span>
            </button>

          </div>
        </div>

      </div>

      {/* FLOATING ACTION BUTTON */}
      <button 
        onClick={() => {
          const select = document.getElementById('quick-request-blood-type');
          if (select) {
            select.focus();
            select.scrollIntoView({ behavior: 'smooth', block: 'center' });
            toast.success('Talep formuna yönlendirildiniz.');
          }
        }}
        style={{
          position: 'fixed',
          bottom: '2.5rem',
          right: '2.5rem',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#e11d48',
          color: 'white',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(225,29,72,0.3)',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 99
        }}
        className="floating-action-fab"
      >
        <Plus size={28} />
      </button>

      {/* Global Dashboard UI Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        .quick-action-btn:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.04);
        }
        .quick-action-btn:active {
          transform: translateY(-2px);
        }
        
        .request-list-item:hover {
          border-color: rgba(225,29,72,0.2) !important;
          background-color: #fcfcfc !important;
        }

        .floating-action-fab:hover {
          transform: scale(1.1) rotate(90deg);
          background-color: #be123c;
          box-shadow: 0 12px 30px rgba(225,29,72,0.4);
        }

        @media (max-width: 1400px) {
          .dashboard-grid-row1 {
            grid-template-columns: 1fr 1fr !important;
          }
          .welcome-card-grid {
            grid-column: span 2 !important;
          }
          .dashboard-grid-row2 {
            grid-template-columns: 1fr 1fr !important;
          }
          .activities-card {
            grid-column: span 2 !important;
          }
          .dashboard-grid-row3 {
            grid-template-columns: 1fr 1fr !important;
          }
          .quick-actions-card {
            grid-column: span 2 !important;
          }
        }

        @media (max-width: 768px) {
          .dashboard-grid-row1,
          .dashboard-grid-row2,
          .dashboard-grid-row3 {
            grid-template-columns: 1fr !important;
          }
          .welcome-card-grid,
          .activities-card,
          .quick-actions-card {
            grid-column: span 1 !important;
          }
          .distribution-chart-inner {
            flex-direction: column !important;
            gap: 1.5rem !important;
          }
          .distribution-legend {
            width: 100% !important;
            padding-left: 0 !important;
          }
        }
      `}} />

    </div>
  );
};

export default UserDashboard;
