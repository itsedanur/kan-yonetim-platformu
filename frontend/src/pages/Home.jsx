import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Activity, MapPin, Droplet, Users, Shield, Zap, Send, FileText, Bell, ChevronRight, Share2, ArrowRight } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [homeStats, setHomeStats] = useState(null);
  const [urgentReqs, setUrgentReqs] = useState([]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [statsRes, reqsRes] = await Promise.all([
          axios.get('/Public/home-stats'),
          axios.get('/Public/urgent-requests')
        ]);
        setHomeStats(statsRes.data);
        setUrgentReqs(reqsRes.data);
      } catch (error) {
        console.error("Error fetching public data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const pieData = homeStats?.bloodGroupStats?.map(bgs => ({
    name: bgs.name,
    value: bgs.value,
    color: bgs.name.includes('O') ? '#e11d48' : bgs.name.includes('A') ? '#8b5cf6' : bgs.name.includes('B') ? '#f59e0b' : '#3b82f6'
  })) || [
    { name: 'O Rh(-)', value: 5, color: '#e11d48' },
    { name: 'A+', value: 3, color: '#8b5cf6' },
    { name: 'B+', value: 2, color: '#f59e0b' },
    { name: 'AB+', value: 1, color: '#10b981' },
    { name: 'Diğer', value: 1, color: '#3b82f6' }
  ];

  const totalNeed = pieData.reduce((acc, curr) => acc + curr.value, 0);

  const stats = [
    { title: 'Aktif Talepler', value: homeStats?.activeRequestsCount || '0', icon: <FileText size={20} color="#e11d48" />, bg: '#fff1f2' },
    { title: 'Bağışçılar', value: homeStats?.totalDonorsCount || '0', icon: <Users size={20} color="#3b82f6" />, bg: '#eff6ff' },
    { title: 'Kan Grupları', value: homeStats?.bloodTypesCount || '0', icon: <Droplet size={20} color="#8b5cf6" />, bg: '#f5f3ff' },
    { title: 'Kurtarılan Can', value: homeStats?.livesSaved || '0', icon: <Heart size={20} color="#10b981" />, bg: '#ecfdf5' },
  ];

  const requests = urgentReqs.length > 0 ? urgentReqs.map(r => ({
    bloodType: r.bloodType,
    hospital: r.hospital,
    distance: r.distance,
    urgency: r.urgency,
    color: r.urgency === 'Kritik' ? '#9f1239' : (r.urgency === 'Acil' ? '#e11d48' : '#8b5cf6'),
    bg: r.urgency === 'Kritik' ? '#ffe4e6' : (r.urgency === 'Acil' ? '#fff1f2' : '#f5f3ff')
  })) : [
    { bloodType: 'O Rh(-)', hospital: 'Kadıköy Acıbadem Hastanesi', distance: '2.4 km', urgency: 'Acil', color: '#e11d48', bg: '#fff1f2' },
    { bloodType: 'B+', hospital: 'Çekmeköy Devlet Hastanesi', distance: '4.1 km', urgency: 'Acil', color: '#8b5cf6', bg: '#f5f3ff' },
    { bloodType: 'A+', hospital: 'Kartal Eğitim Araştırma Hastanesi', distance: '5.8 km', urgency: 'Orta', color: '#f59e0b', bg: '#fef3c7' },
  ];

  const helpSteps = [
    { title: 'Kan Bağışı Yapın', desc: 'Size en yakın merkeze giderek kan bağışı yapın.', icon: <Droplet size={18} color="#e11d48" />, bg: '#fff1f2' },
    { title: 'Talebi Paylaşın', desc: 'Acil kan taleplerini sevdiklerinizle paylaşın.', icon: <Send size={18} color="#3b82f6" />, bg: '#eff6ff' },
    { title: 'Bir Hayat Kurtarın', desc: 'Küçük bir adım, büyük bir fark yaratır.', icon: <Heart size={18} color="#10b981" />, bg: '#ecfdf5' },
  ];

  const features = [
    { title: 'Güvenli Platform', desc: 'Kişisel bilgileriniz güvende', icon: <Shield size={22} color="#e11d48" />, bg: '#fff1f2' },
    { title: 'Anlık Bildirim', desc: 'Taleplerden anında haberdar olun', icon: <Zap size={22} color="#f59e0b" />, bg: '#fef3c7' },
    { title: 'En Yakın Noktalar', desc: 'Size en yakın bağış noktalarını bulun', icon: <MapPin size={22} color="#8b5cf6" />, bg: '#f5f3ff' },
    { title: 'Topluluk Desteği', desc: 'Birlikte daha güçlüyüz', icon: <Users size={22} color="#3b82f6" />, bg: '#eff6ff' },
  ];

  return (
    <div className="home-container" style={{ 
      height: 'calc(100vh - 80px)', 
      overflow: 'hidden', 
      display: 'flex', 
      flexDirection: 'column', 
      padding: '0.5rem 2rem 1.5rem 2rem', 
      gap: '1.5rem',
      backgroundColor: '#f8fafc',
      fontFamily: "'Inter', sans-serif"
    }}>
      
      {/* ROW 1: HERO SECTION */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.6fr 0.8fr', gap: '1.5rem', flex: '0 0 42%', minHeight: 0 }}>
        
        {/* Left Column: Text & Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingRight: '1rem' }}>
          <h1 style={{ fontSize: 'clamp(2.5rem, 3.5vw, 4rem)', fontWeight: '900', lineHeight: '1.1', color: '#000000', margin: '0 0 1rem 0', letterSpacing: '-0.03em' }}>
            Hayat Kurtarmak <br />
            <span style={{ background: 'linear-gradient(90deg, #e11d48, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Sizin Elinizde
            </span>
          </h1>
          <p style={{ color: '#64748b', fontSize: 'clamp(0.9rem, 1vw, 1.1rem)', lineHeight: '1.6', margin: '0 0 1.5rem 0' }}>
            Acil kan ihtiyaçlarını anlık takip edin, size en yakın bağış noktasına ulaşarak binlerce kişiye umut olun.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/register" style={{ background: '#e11d48', color: 'white', padding: '0.8rem 1.2rem', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 8px 20px rgba(225,29,72,0.25)', fontSize: '0.9rem', whiteSpace: 'nowrap' }} className="hover-scale">
              <Droplet size={18} fill="white" /> Kan Bağışı Yap <ArrowRight size={18} />
            </Link>
            <Link to="/blood-requests" style={{ background: 'white', color: '#e11d48', padding: '0.8rem 1.2rem', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #ffe4e6', boxShadow: '0 4px 10px rgba(225,29,72,0.05)', fontSize: '0.9rem', whiteSpace: 'nowrap' }} className="hover-scale">
              <Activity size={18} /> Kan Talebi Oluştur <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* Middle Column: Abstract Illustration */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(248,250,252,0) 70%)' }}>
          {/* Abstract IV Bag / Heart Concept */}
          <div style={{ position: 'relative', width: '220px', height: '220px', zIndex: 10 }}>
            {/* The "Bag" */}
            <div style={{ position: 'absolute', width: '140px', height: '180px', background: 'linear-gradient(135deg, #fb7185, #e11d48)', borderRadius: '30px', top: '10px', left: '40px', boxShadow: '0 20px 40px rgba(225,29,72,0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '15px' }}>
              <div style={{ width: '40px', height: '8px', background: 'rgba(255,255,255,0.5)', borderRadius: '4px' }}></div>
              <Heart size={64} fill="white" color="white" style={{ marginTop: '30px' }} className="pulse-animation" />
            </div>
            {/* The "Tube" */}
            <svg style={{ position: 'absolute', top: '180px', left: '100px', width: '200px', height: '100px', overflow: 'visible', zIndex: -1 }}>
              <path d="M 10 10 C 10 80, 100 0, 150 80" fill="none" stroke="#e11d48" strokeWidth="8" strokeLinecap="round" />
            </svg>
            {/* The "Arm/Receiver" abstract */}
            <div style={{ position: 'absolute', top: '230px', left: '220px', width: '120px', height: '40px', background: '#ffedd5', borderRadius: '20px', transform: 'rotate(-10deg)', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
               <div style={{ position: 'absolute', top: '10px', left: '20px', width: '30px', height: '20px', background: 'white', borderRadius: '4px' }}></div>
            </div>
          </div>
          
          {/* Floating elements */}
          <div style={{ position: 'absolute', top: '20%', right: '15%', background: 'white', padding: '10px 15px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: '10px', animation: 'float 4s ease-in-out infinite' }}>
            <div style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#e11d48', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bell size={12} color="white" fill="white" />
            </div>
            <div>
              <p style={{ fontSize: '0.7rem', color: '#e11d48', fontWeight: '700', margin: 0 }}>Acil İhtiyaç</p>
              <p style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: '900', margin: 0 }}>O Rh(-)</p>
              <p style={{ fontSize: '0.65rem', color: '#64748b', margin: 0 }}>Kan Grubu</p>
            </div>
          </div>
        </div>

        {/* Right Column: Stats List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', justifyContent: 'center' }}>
          {stats.map((stat, idx) => (
            <div key={idx} style={{ background: 'white', borderRadius: '16px', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', border: '1px solid #f1f5f9' }}>
              <div style={{ background: stat.bg, width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {stat.icon}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 0.1rem 0', fontWeight: '600' }}>{stat.title}</p>
                <p style={{ fontSize: '1.15rem', color: '#0f172a', margin: 0, fontWeight: '800' }}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ROW 2: CARDS SECTION */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', flex: 1, minHeight: 0 }}>
        
        {/* Card 1: Nearest Requests */}
        <div style={{ background: 'white', borderRadius: '24px', padding: '1.2rem 1.5rem', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bell size={20} color="#e11d48" /> En Yakın Acil Talepler
            </h3>
            <Link to="/blood-requests" style={{ fontSize: '0.8rem', fontWeight: '700', color: '#e11d48', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              Tümünü Gör <ChevronRight size={16} />
            </Link>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', overflowY: 'auto', flex: 1, paddingRight: '0.5rem' }} className="custom-scrollbar">
            {requests.map((req, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: i !== requests.length - 1 ? '0.8rem' : 0, borderBottom: i !== requests.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: req.bg, padding: '0.5rem', borderRadius: '10px', minWidth: '45px' }}>
                  <Droplet size={16} fill={req.color} color={req.color} />
                  <span style={{ fontSize: '0.65rem', fontWeight: '800', color: req.color, marginTop: '2px' }}>{req.urgency}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: '800', color: '#0f172a' }}>{req.bloodType}</p>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>{req.hospital}</p>
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#e11d48' }}>
                  {req.distance}
                </div>
              </div>
            ))}
          </div>
          <Link to="/blood-requests" style={{ textAlign: 'center', display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#e11d48', textDecoration: 'none', marginTop: 'auto', paddingTop: '0.8rem', borderTop: '1px solid #f1f5f9' }}>
            Tüm Talepleri İncele →
          </Link>
        </div>

        {/* Card 2: Chart */}
        <div style={{ background: 'white', borderRadius: '24px', padding: '1.2rem 1.5rem', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.5rem 0' }}>Kan Grubuna Göre İhtiyaç</h3>
          <div style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
            <div style={{ width: '55%', height: '100%', position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius="60%" outerRadius="85%" paddingAngle={5} dataKey="value" stroke="none">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Toplam</span>
                <span style={{ fontSize: '1.4rem', color: '#0f172a', fontWeight: '900' }}>{totalNeed}</span>
              </div>
            </div>
            <div style={{ width: '45%', display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: '1rem' }}>
              {pieData.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }}></div>
                    <span style={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: '700' }}>{item.name}</span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: '800' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
          <Link to="/blood-requests" style={{ textAlign: 'center', display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#e11d48', textDecoration: 'none', marginTop: 'auto', paddingTop: '0.8rem', borderTop: '1px solid #f1f5f9' }}>
            Detaylı İstatistikler →
          </Link>
        </div>

        {/* Card 3: How to help */}
        <div style={{ background: 'white', borderRadius: '24px', padding: '1.2rem 1.5rem', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: '0 0 1rem 0' }}>Nasıl Yardımcı Olabilirsiniz?</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
            {helpSteps.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ background: step.bg, width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {step.icon}
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '0.9rem', fontWeight: '800', color: '#0f172a' }}>{step.title}</h4>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b', lineHeight: '1.4' }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <Link to="/about" style={{ textAlign: 'center', display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#e11d48', textDecoration: 'none', marginTop: 'auto', paddingTop: '0.8rem', borderTop: '1px solid #f1f5f9' }}>
            Daha Fazla Bilgi →
          </Link>
        </div>

      </div>

      {/* ROW 3: FOOTER FEATURES */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', borderRadius: '20px', padding: '1rem 2rem', flex: '0 0 auto', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
         {features.map((feat, i) => (
           <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
             <div style={{ background: feat.bg, width: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               {feat.icon}
             </div>
             <div>
               <h5 style={{ margin: '0 0 0.2rem 0', fontSize: '0.85rem', fontWeight: '800', color: '#0f172a' }}>{feat.title}</h5>
               <p style={{ margin: 0, fontSize: '0.7rem', color: '#64748b' }}>{feat.desc}</p>
             </div>
           </div>
         ))}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        /* Enforce exact fitting to viewport */
        body { overflow: hidden; }
        
        .pulse-animation { animation: pulseHeart 2s infinite; }
        @keyframes pulseHeart {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        .hover-scale:hover { transform: scale(1.02); }
        
        /* Custom scrollbar for lists if they ever overflow */
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 4px;
        }
      `}} />
    </div>
  );
};

export default Home;
