import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generateCertificate = async (userName, date, bloodType, hospitalName) => {
  // Create an off-screen container
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.width = '800px';
  container.style.height = '600px';
  container.style.backgroundColor = '#ffffff';
  container.style.padding = '40px';
  container.style.boxSizing = 'border-box';
  container.style.border = '12px solid #991b1b';
  container.style.fontFamily = "'Arial', sans-serif";
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';
  container.style.boxShadow = 'inset 0 0 0 4px #f87171';

  container.innerHTML = `
    <div style="text-align: center; color: #991b1b; font-size: 42px; font-weight: 900; margin-bottom: 10px; letter-spacing: 2px;">
      TEŞEKKÜR BELGESİ
    </div>
    <div style="font-size: 22px; color: #64748b; font-weight: bold; margin-bottom: 40px; text-align: center; letter-spacing: 1px;">
      HAYAT AĞI KAN YÖNETİM PLATFORMU
    </div>
    <div style="font-size: 20px; color: #334155; text-align: center; max-width: 650px; line-height: 1.8;">
      Sayın <strong style="font-size: 24px; color: #0f172a;">${userName || 'Gönüllü Bağışçımız'}</strong>,<br/><br/>
      ${date} tarihinde ${hospitalName || 'hastanemize'} ulaştırılmak üzere yaptığınız 
      <strong style="color: #991b1b;">${bloodType || 'Kan'}</strong> bağışı ile bir hastamıza umut oldunuz.<br/><br/>
      <em style="font-size: 22px; color: #991b1b;">"Bir damla kan, kurtarılan bir can..."</em><br/><br/>
      İyilik dolu bu davranışınız için sonsuz şükranlarımızı sunarız.
    </div>
    <div style="margin-top: 60px; width: 100%; display: flex; justify-content: space-between; padding: 0 60px; font-size: 18px;">
      <div style="text-align: center;">
        <div style="font-weight: 800; color: #0f172a; margin-bottom: 5px;">Tarih</div>
        <div style="color: #475569;">${date}</div>
      </div>
      <div style="text-align: center;">
        <div style="font-weight: 800; color: #0f172a; margin-bottom: 5px;">Sistem Yöneticisi</div>
        <div style="color: #475569;">Hayat Ağı Platformu</div>
      </div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [800, 600]
    });
    
    pdf.addImage(imgData, 'PNG', 0, 0, 800, 600);
    pdf.save(`Tesekkur_Belgesi_${(userName || 'Donor').replace(/ /g, '_')}.pdf`);
  } catch (error) {
    console.error('PDF generation error:', error);
  } finally {
    document.body.removeChild(container);
  }
};
