import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Heart, 
  Activity, 
  MapPin, 
  User, 
  LogOut, 
  Bell, 
  Mail, 
  Search, 
  ChevronDown, 
  History, 
  Star, 
  ChevronRight, 
  PhoneCall, 
  AlertTriangle,
  X,
  Menu,
  HelpCircle
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const UserLayout = ({ children, user, setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [activeRequestsCount, setActiveRequestsCount] = useState(0);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [myApplications, setMyApplications] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Fetch stats for badges
  useEffect(() => {
    if (!user) return;
    const fetchStats = async () => {
      try {
        const statsRes = await axios.get('/Public/home-stats');
        setActiveRequestsCount(statsRes.data.activeRequestsCount || 0);
      } catch (error) {
        console.error('Error fetching home stats in Layout:', error);
      }
    };
    fetchStats();
    // Poll every 60 seconds
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, [user]);

  // Fetch applications for History Modal
  const fetchDonationHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await axios.get('/DonationApplication/my-applications');
      setMyApplications(res.data);
    } catch (error) {
      console.error('Error fetching history:', error);
      toast.error('Bağış geçmişi yüklenirken hata oluştu.');
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (showHistoryModal) {
      fetchDonationHistory();
    }
  }, [showHistoryModal]);

  useEffect(() => {
    const handleOpenHistory = () => setShowHistoryModal(true);
    window.addEventListener('open-donation-history', handleOpenHistory);
    return () => window.removeEventListener('open-donation-history', handleOpenHistory);
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.success('Güvenli çıkış yapıldı.');
    navigate('/');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const menuItems = [
    { name: 'Ana Sayfa', path: '/dashboard', icon: <Heart size={20} /> },
    { 
      name: 'Kan Talepleri', 
      path: '/blood-requests', 
      icon: <Activity size={20} />, 
      badge: activeRequestsCount 
    },
    { name: 'Taleplerim', path: '/my-requests', icon: <Mail size={20} /> },
    { 
      name: 'Bağış Geçmişim', 
      onClick: () => setShowHistoryModal(true), 
      icon: <History size={20} /> 
    },
    { name: 'Favorilerim', onClick: () => setShowFavoritesModal(true), icon: <Star size={20} /> },
    { name: 'Profilim', path: '/profile', icon: <User size={20} /> },
    { name: 'Destek Talepleri', path: '/support', icon: <HelpCircle size={20} /> }
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#f8fafc', overflow: 'hidden', fontFamily: "'Outfit', sans-serif" }}>
      
      {/* MOBILE HEADER */}
      <div style={{
        display: 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        zIndex: 100,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1rem',
        '@media (maxWidth: 1024px)': {
          display: 'flex'
        }
      }} className="mobile-header-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0f172a' }}>
            <Menu size={24} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ backgroundColor: '#e11d48', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justify: 'center' }}>
              <Heart size={16} fill="white" color="white" style={{ display: 'block', margin: 'auto' }} />
            </div>
            <span style={{ fontWeight: '800', fontSize: '1.2rem', color: '#0f172a' }}>Hayat Ağı</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#ffe4e6', color: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '700' }}>
            {getInitials(user?.fullName)}
          </div>
        </div>
      </div>

      {/* LEFT SIDEBAR */}
      <div style={{
        width: '260px',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        flexShrink: 0,
        transition: 'all 0.3s ease',
        zIndex: 101,
        '@media (maxWidth: 1024px)': {
          position: 'fixed',
          left: mobileOpen ? '0' : '-260px',
          top: '0',
          bottom: '0',
        }
      }} className={`sidebar-container ${mobileOpen ? 'mobile-open' : ''}`}>
        
        {/* Sidebar Header Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1.5rem 1.5rem', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ backgroundColor: '#e11d48', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(225,29,72,0.2)' }}>
            <Heart size={18} fill="white" color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.1 }}>Hayat Ağı</h1>
            <span style={{ fontSize: '0.65rem', color: '#e11d48', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Kan Yönetimi</span>
          </div>
          {mobileOpen && (
            <button onClick={() => setMobileOpen(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
              <X size={20} />
            </button>
          )}
        </div>

        {/* Sidebar Navigation */}
        <div style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', overflowY: 'auto' }} className="custom-scrollbar">
          {menuItems.map((item, idx) => {
            const isActive = item.path && location.pathname === item.path;
            const content = (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ color: isActive ? '#e11d48' : '#64748b', transition: 'color 0.2s', display: 'flex', alignItems: 'center' }}>
                    {item.icon}
                  </span>
                  <span style={{ fontSize: '0.9rem', fontWeight: isActive ? '700' : '500', color: isActive ? '#e11d48' : '#334155' }}>
                    {item.name}
                  </span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span style={{ 
                    backgroundColor: '#e11d48', 
                    color: 'white', 
                    fontSize: '0.7rem', 
                    fontWeight: '800', 
                    padding: '0.15rem 0.45rem', 
                    borderRadius: '20px',
                    boxShadow: '0 2px 5px rgba(225,29,72,0.2)' 
                  }}>
                    {item.badge}
                  </span>
                )}
              </>
            );

            const itemStyle = {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.8rem 1rem',
              borderRadius: '12px',
              textDecoration: 'none',
              cursor: 'pointer',
              backgroundColor: isActive ? '#fff1f2' : 'transparent',
              transition: 'all 0.2s ease',
              border: 'none',
              textAlign: 'left',
              width: '100%',
              outline: 'none'
            };

            if (item.path) {
              return (
                <Link key={idx} to={item.path} style={itemStyle} className="sidebar-link" onClick={() => setMobileOpen(false)}>
                  {content}
                </Link>
              );
            } else {
              return (
                <button key={idx} onClick={() => { item.onClick(); setMobileOpen(false); }} style={itemStyle} className="sidebar-link">
                  {content}
                </button>
              );
            }
          })}
        </div>

        {/* Sidebar Footer Banners */}
        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid #f1f5f9' }}>
          {/* Emergency Box */}
          <div style={{ backgroundColor: '#fff1f2', borderRadius: '16px', padding: '1rem', border: '1px solid #ffe4e6' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <AlertTriangle size={18} style={{ color: '#e11d48', flexShrink: 0 }} />
              <div>
                <h4 style={{ fontSize: '0.8rem', fontWeight: '800', color: '#9f1239', margin: 0 }}>Acil Durumda mısınız?</h4>
                <p style={{ fontSize: '0.7rem', color: '#e11d48', margin: '0.1rem 0 0 0', lineHeight: 1.3 }}>En yakın kan merkezine hemen ulaşın.</p>
              </div>
            </div>
            <button 
              onClick={() => { toast.success('Mevcut konumunuz algılanıyor...'); navigate('/blood-requests'); }}
              style={{ width: '100%', border: 'none', backgroundColor: '#e11d48', color: 'white', fontSize: '0.75rem', fontWeight: '700', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', boxShadow: '0 2px 6px rgba(225,29,72,0.15)' }}
            >
              Konumumu Aç
            </button>
          </div>

          {/* Slogan Banner */}
          <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius: '16px', padding: '1rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: '-15px', bottom: '-15px', opacity: 0.1, color: '#ffffff' }}>
              <Heart size={80} fill="white" />
            </div>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0, fontWeight: '500' }}>Hayat Kurtarmak</p>
            <p style={{ fontSize: '0.85rem', color: '#ffffff', margin: '0.1rem 0 0 0', fontWeight: '800' }}>Sizin Elinizde</p>
          </div>
        </div>

      </div>

      {/* MAIN CONTENT AREA */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        
        {/* TOP HEADER */}
        <header style={{
          height: '70px',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem',
          flexShrink: 0
        }} className="top-header-container">
          
          {/* Header Search Box */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: '#f1f5f9', padding: '0.5rem 1rem', borderRadius: '12px', width: '320px' }}>
            <Search size={16} style={{ color: '#64748b' }} />
            <input 
              type="text" 
              placeholder="Hasta, ilçe, hastane ara..." 
              style={{ border: 'none', background: 'transparent', padding: 0, fontSize: '0.85rem', outline: 'none', width: '100%', color: '#0f172a' }} 
              onFocus={() => {}}
            />
            <span style={{ fontSize: '0.7rem', color: '#94a3b8', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', padding: '0.1rem 0.35rem', borderRadius: '4px', fontWeight: '700', userSelect: 'none' }}>
              ⌘ K
            </span>
          </div>

          {/* Header Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            
            {/* Notifications */}
            <button 
              onClick={() => { toast.success('Yeni bir bildiriminiz bulunmuyor.'); }}
              style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', transition: 'color 0.2s', padding: '0.25rem' }}
              onMouseOver={e => e.currentTarget.style.color = '#e11d48'}
              onMouseOut={e => e.currentTarget.style.color = '#64748b'}
            >
              <Bell size={20} />
              {activeRequestsCount > 0 && (
                <span style={{ position: 'absolute', top: 0, right: 0, width: '8px', height: '8px', backgroundColor: '#e11d48', borderRadius: '50%' }} />
              )}
            </button>

            {/* Messages */}
            <button 
              onClick={() => navigate('/my-requests')}
              style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', transition: 'color 0.2s', padding: '0.25rem' }}
              onMouseOver={e => e.currentTarget.style.color = '#e11d48'}
              onMouseOut={e => e.currentTarget.style.color = '#64748b'}
            >
              <Mail size={20} />
            </button>

            {/* Profile Dropdown Trigger */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'none', border: 'none', cursor: 'pointer', outline: 'none' }}
              >
                {/* Initials Avatar */}
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '12px', 
                  backgroundColor: '#fff1f2', 
                  color: '#e11d48', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontWeight: '800', 
                  fontSize: '0.95rem',
                  border: '1px solid #ffe4e6'
                }}>
                  {getInitials(user?.fullName)}
                </div>
                {/* User Info Text */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }} className="header-profile-info">
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0f172a', lineHeight: 1.2 }}>{user?.fullName}</span>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: '500' }}>{user?.role === 'Admin' ? 'Yönetici' : 'Bağışçı'}</span>
                </div>
                <ChevronDown size={14} style={{ color: '#64748b' }} />
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileDropdown && (
                <>
                  <div 
                    onClick={() => setShowProfileDropdown(false)}
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 998 }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '50px',
                    right: 0,
                    width: '180px',
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                    padding: '0.5rem',
                    zIndex: 999,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.2rem'
                  }}>
                    <Link 
                      to="/profile" 
                      onClick={() => setShowProfileDropdown(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.75rem', borderRadius: '8px', fontSize: '0.85rem', color: '#334155', textDecoration: 'none', transition: 'background-color 0.2s' }}
                      className="dropdown-item"
                    >
                      <User size={16} /> Profilim
                    </Link>
                    <button 
                      onClick={() => { setShowProfileDropdown(false); handleLogout(); }}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.75rem', borderRadius: '8px', fontSize: '0.85rem', color: '#ef4444', border: 'none', background: 'none', width: '100%', cursor: 'pointer', textAlign: 'left', transition: 'background-color 0.2s' }}
                      className="dropdown-item logout"
                    >
                      <LogOut size={16} /> Çıkış Yap
                    </button>
                  </div>
                </>
              )}
            </div>

          </div>

        </header>

        {/* PAGE CONTENT CONTAINER */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 2rem' }} className="custom-scrollbar main-layout-scroll">
          {children}
        </div>

      </div>

      {/* DONATION HISTORY MODAL */}
      {showHistoryModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: '#ffffff', padding: '2rem', borderRadius: '24px',
            maxWidth: '600px', width: '90%', maxHeight: '80vh', overflowY: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid #e2e8f0',
            display: 'flex', flexDirection: 'column'
          }} className="animate-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <History size={24} style={{ color: '#e11d48' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Bağış Geçmişim</h3>
              </div>
              <button onClick={() => setShowHistoryModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={24} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }} className="custom-scrollbar">
              {loadingHistory ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Yükleniyor...</div>
              ) : myApplications.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {myApplications.map((app) => (
                    <div key={app.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid #f1f5f9', borderRadius: '16px', background: '#f8fafc' }}>
                      <div>
                        <p style={{ fontWeight: '800', margin: 0, color: '#0f172a', fontSize: '0.95rem' }}>
                          {app.donationRequest?.bloodType?.name || 'Kan Bağışı'}
                        </p>
                        <p style={{ margin: '0.2rem 0 0 0', color: '#64748b', fontSize: '0.8rem', fontWeight: '500' }}>
                          {app.donationRequest?.hospital?.name || 'Hastane'}
                        </p>
                        <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginTop: '0.4rem' }}>
                          Başvuru: {new Date(app.applicationDate).toLocaleDateString('tr-TR')}
                        </span>
                      </div>
                      <div>
                        <span style={{
                          backgroundColor: app.status === 'Approved' ? '#ecfdf5' : app.status === 'Pending' ? '#fef3c7' : '#fff1f2',
                          color: app.status === 'Approved' ? '#10b981' : app.status === 'Pending' ? '#d97706' : '#e11d48',
                          fontSize: '0.75rem',
                          fontWeight: '800',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '20px'
                        }}>
                          {app.status === 'Approved' ? 'Tamamlandı' : app.status === 'Pending' ? 'Bekliyor' : 'İptal'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
                  <History size={48} style={{ color: '#cbd5e1', marginBottom: '1rem' }} />
                  <p style={{ fontWeight: '600', fontSize: '0.9rem', margin: 0 }}>Henüz bir bağış kaydınız bulunmuyor.</p>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>Acil kan taleplerine başvurarak bağış yapabilirsiniz.</p>
                </div>
              )}
            </div>

            <button 
              onClick={() => { setShowHistoryModal(false); navigate('/blood-requests'); }}
              style={{ width: '100%', border: 'none', backgroundColor: '#e11d48', color: 'white', fontWeight: '800', padding: '0.875rem', borderRadius: '12px', marginTop: '1.5rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(225,29,72,0.2)' }}
            >
              Bağış Taleplerini Gör
            </button>
          </div>
        </div>
      )}

      {/* FAVORITES MODAL */}
      {showFavoritesModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: '#ffffff', padding: '2rem', borderRadius: '24px',
            maxWidth: '500px', width: '90%', maxHeight: '60vh', overflowY: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid #e2e8f0',
            display: 'flex', flexDirection: 'column'
          }} className="animate-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Star size={24} style={{ color: '#e11d48' }} fill="#e11d48" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Favori Merkezlerim</h3>
              </div>
              <button onClick={() => setShowFavoritesModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={24} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }} className="custom-scrollbar">
              {/* Sample favorites centers */}
              {[
                { name: 'Çekmeköy Kızılay Bağış Merkezi', district: 'Çekmeköy', phone: '0216 123 45 67' },
                { name: 'Kadıköy Kızılay Kan Bağış Merkezi', district: 'Kadıköy', phone: '0216 987 65 43' }
              ].map((center, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem 1rem', border: '1px solid #f1f5f9', borderRadius: '16px', background: '#f8fafc' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: '800', color: '#0f172a' }}>{center.name}</h4>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '500' }}>{center.district}</span>
                  </div>
                  <a href={`tel:${center.phone}`} style={{ backgroundColor: '#eff6ff', color: '#2563eb', border: 'none', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <PhoneCall size={16} />
                  </a>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setShowFavoritesModal(false)}
              style={{ width: '100%', border: 'none', backgroundColor: '#334155', color: 'white', fontWeight: '800', padding: '0.75rem', borderRadius: '12px', marginTop: '1.5rem', cursor: 'pointer' }}
            >
              Kapat
            </button>
          </div>
        </div>
      )}

      {/* Global Embedded CSS styles */}
      <style dangerouslySetInnerHTML={{__html: `
        .dropdown-item:hover {
          background-color: #f1f5f9;
        }
        .dropdown-item.logout:hover {
          background-color: #fef2f2;
        }
        .sidebar-link:hover {
          background-color: #fff1f2;
          transform: translateX(4px);
        }
        .sidebar-link {
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        
        .main-layout-scroll::-webkit-scrollbar,
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .main-layout-scroll::-webkit-scrollbar-track,
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .main-layout-scroll::-webkit-scrollbar-thumb,
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .main-layout-scroll::-webkit-scrollbar-thumb:hover,
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        @media (max-width: 1024px) {
          .sidebar-container {
            position: fixed !important;
            left: -260px !important;
            top: 0 !important;
            bottom: 0 !important;
            height: 100vh !important;
            box-shadow: 20px 0 50px rgba(0,0,0,0.1);
          }
          .sidebar-container.mobile-open {
            left: 0 !important;
          }
          .top-header-container {
            margin-top: 60px !important;
            padding: 0 1rem !important;
          }
          .main-layout-scroll {
            padding: 1rem !important;
          }
          .header-profile-info {
            display: none !important;
          }
        }
      `}} />

    </div>
  );
};

export default UserLayout;
