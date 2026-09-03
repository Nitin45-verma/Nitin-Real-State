import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import './PosterGenerator.css';

const FESTIVAL_PRESETS = [
  { id: 'rakshabandhan', name: 'Rakshabandhan (रक्षाबंधन)', wishText: 'आप सभी को रक्षाबंधन की हार्दिक शुभकामनाएं!', bgType: 'festival_maroon' },
  { id: 'independence', name: 'Independence Day (स्वतंत्रता दिवस)', wishText: 'Happy INDEPENDENCE DAY', bgType: 'tricolor' },
  { id: 'diwali', name: 'Diwali (दीपावली)', wishText: 'आप सभी को दीपावली की हार्दिक शुभकामनाएं!', bgType: 'diwali_gold' },
  { id: 'holi', name: 'Holi (होली)', wishText: 'रंगों के पावन पर्व होली की हार्दिक शुभकामनाएं!', bgType: 'holi_colors' },
  { id: 'hiring', name: 'Real Estate / Business Specialist', wishText: 'आज ही बनें रियल एस्टेट विशेषज्ञ', bgType: 'navy_corporate' },
  { id: 'growth', name: 'Business Growth / Services', wishText: 'WE PROVIDE GREAT IDEAS TO GROW YOUR BUSINESS', bgType: 'orange_wave' },
  { id: 'meme', name: 'Meme / Social Media Marketing', wishText: 'abhi SOCIAL MEDIA handle karke deta hun!!!', bgType: 'yellow_meme' }
];

const TEMPLATES = [
  { id: 'template-1', title: 'Corporate Service Promo', icon: 'bi-briefcase-fill', desc: 'Ref Image 1: Modern service layout with badges & website footer' },
  { id: 'template-2', title: 'Hindi Real Estate Specialist', icon: 'bi-house-heart-fill', desc: 'Ref Image 2: Dark blue theme with Hindi bullet points' },
  { id: 'template-3', title: 'Meme Social Media Post', icon: 'bi-emoji-laughing-fill', desc: 'Ref Image 3: Creative Hinglish marketing banner' },
  { id: 'template-4', title: 'Festival Greetings (Pure Wish)', icon: 'bi-stars', desc: 'Ref Image 4: Festival backdrop + circular photo frame + maroon footer' },
  { id: 'template-5', title: 'Dual Festive + Business Hybrid', icon: 'bi-flag-fill', desc: 'Ref Image 5: Top festival wish + property house + services grid' }
];

const PosterGenerator = () => {
  const canvasRef = useRef(null);
  const userPhotoInputRef = useRef(null);
  const logoInputRef = useRef(null);

  // Form State
  const [selectedTemplate, setSelectedTemplate] = useState('template-4');
  const [selectedFestival, setSelectedFestival] = useState('rakshabandhan');
  const [aspectRatio, setAspectRatio] = useState('1:1'); // 1:1 or 9:16
  
  const [form, setForm] = useState({
    businessName: 'Nitin Real Estate',
    tagline: 'Find Your Dream Property With Us',
    phone: '+91 9950752522',
    address: 'Khatipura, Jaipur / Noida Sector 62',
    website: 'www.nitinrealestate.com',
    services: 'Residential Flats, Commercial Shops, Luxury Villas, Rental & Plots',
    customWish: 'आप सभी को रक्षाबंधन की हार्दिक शुभकामनाएं!'
  });

  // Uploaded Images State (Data URLs or Image elements)
  const [userPhotoSrc, setUserPhotoSrc] = useState(null);
  const [logoSrc, setLogoSrc] = useState(null);

  // Update wish text when festival preset changes
  const handleFestivalChange = (presetId) => {
    setSelectedFestival(presetId);
    const preset = FESTIVAL_PRESETS.find(p => p.id === presetId);
    if (preset) {
      setForm(prev => ({ ...prev, customWish: preset.wishText }));
    }
  };

  // Image Upload Handlers
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setUserPhotoSrc(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setLogoSrc(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Canvas Drawing Function
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const width = 1080;
    const height = aspectRatio === '1:1' ? 1080 : 1920;
    canvas.width = width;
    canvas.height = height;

    // Helper: Draw Gradient Background
    const drawBackground = () => {
      let grad;
      if (selectedFestival === 'rakshabandhan') {
        grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#580816');
        grad.addColorStop(0.5, '#8c1127');
        grad.addColorStop(1, '#3b030d');
      } else if (selectedFestival === 'independence') {
        grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#f97316'); // Saffron
        grad.addColorStop(0.3, '#ffffff'); // White
        grad.addColorStop(0.7, '#15803d'); // Green
        grad.addColorStop(1, '#0b0f19');
      } else if (selectedFestival === 'hiring') {
        grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#0f172a');
        grad.addColorStop(0.7, '#1e293b');
        grad.addColorStop(1, '#0f172a');
      } else if (selectedFestival === 'meme') {
        grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#fef08a');
        grad.addColorStop(0.5, '#ffffff');
        grad.addColorStop(1, '#fde047');
      } else {
        grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#1e1b4b');
        grad.addColorStop(0.5, '#312e81');
        grad.addColorStop(1, '#0f172a');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Decorative Background Patterns / Swirls
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 40;
      for (let i = -width; i < width * 2; i += 150) {
        ctx.beginPath();
        ctx.arc(i, height / 2, 600, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    };

    drawBackground();

    // Load User Photo & Logo asynchronously if present
    const loadImg = (src) => {
      return new Promise((resolve) => {
        if (!src) return resolve(null);
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
      });
    };

    Promise.all([loadImg(userPhotoSrc), loadImg(logoSrc)]).then(([userImg, logoImg]) => {
      // -------------------------------------------------------------
      // TEMPLATE 4: Pure Festival Greetings Poster (Ref Image 4 Style)
      // -------------------------------------------------------------
      if (selectedTemplate === 'template-4') {
        // Top Festival Wish Text
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 36px "Segoe UI", sans-serif';
        ctx.fillText('• आप सभी को •', width / 2, 120);

        // Main Hindi Festival Title
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 64px "Segoe UI", sans-serif';
        const wishLines = form.customWish.split('\n');
        let currentY = 200;
        wishLines.forEach(line => {
          ctx.fillText(line, width / 2, currentY);
          currentY += 75;
        });

        // Decorative Subtext
        ctx.fillStyle = '#fde047';
        ctx.font = 'italic 28px "Segoe UI", sans-serif';
        ctx.fillText('यह पावन पर्व आपके जीवन में खुशियाँ, प्रेम और समृद्धि लाए!', width / 2, currentY + 20);

        // Circular Frame for Owner Photo
        const photoCenterX = width / 2;
        const photoCenterY = height / 2 + 60;
        const photoRadius = 180;

        // Draw Gold Circular Border with Ornaments
        ctx.save();
        ctx.beginPath();
        ctx.arc(photoCenterX, photoCenterY, photoRadius + 16, 0, Math.PI * 2);
        ctx.fillStyle = '#d4af37';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(photoCenterX, photoCenterY, photoRadius + 6, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(photoCenterX, photoCenterY, photoRadius, 0, Math.PI * 2);
        ctx.clip();

        if (userImg) {
          ctx.drawImage(userImg, photoCenterX - photoRadius, photoCenterY - photoRadius, photoRadius * 2, photoRadius * 2);
        } else {
          // Default placeholder avatar gradient
          const avatarGrad = ctx.createLinearGradient(photoCenterX - photoRadius, photoCenterY - photoRadius, photoCenterX + photoRadius, photoCenterY + photoRadius);
          avatarGrad.addColorStop(0, '#4b5563');
          avatarGrad.addColorStop(1, '#1f2937');
          ctx.fillStyle = avatarGrad;
          ctx.fillRect(photoCenterX - photoRadius, photoCenterY - photoRadius, photoRadius * 2, photoRadius * 2);
          ctx.fillStyle = '#9ca3af';
          ctx.font = 'bold 28px sans-serif';
          ctx.fillText('Upload Photo', photoCenterX, photoCenterY);
        }
        ctx.restore();

        // Bottom Branded Footer Bar
        const footerHeight = 180;
        const footerY = height - footerHeight;
        
        ctx.fillStyle = '#4c0519'; // Dark maroon footer bar
        ctx.fillRect(0, footerY, width, footerHeight);

        // Gold Top Line on Footer
        ctx.fillStyle = '#d4af37';
        ctx.fillRect(0, footerY, width, 6);

        // Business Name
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 42px "Playfair Display", Georgia, serif';
        ctx.fillText(form.businessName, width / 2, footerY + 60);

        // Address & Location
        ctx.fillStyle = '#fef08a';
        ctx.font = '30px "Segoe UI", sans-serif';
        ctx.fillText(form.address, width / 2, footerY + 110);

        // Phone / WhatsApp
        ctx.fillStyle = '#22c55e';
        ctx.font = 'bold 32px "Segoe UI", sans-serif';
        ctx.fillText(`📞 WhatsApp: ${form.phone}`, width / 2, footerY + 155);
      }

      // -------------------------------------------------------------
      // TEMPLATE 1: Corporate / Service Promo (Ref Image 1 Style)
      // -------------------------------------------------------------
      else if (selectedTemplate === 'template-1') {
        // Logo Top-Left
        if (logoImg) {
          ctx.drawImage(logoImg, 50, 40, 90, 90);
        }

        // Header Title
        ctx.textAlign = 'left';
        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 30px "Segoe UI", sans-serif';
        ctx.fillText('WE PROVIDE GREAT IDEAS TO', 160, 75);

        ctx.fillStyle = '#ea580c';
        ctx.font = 'black 62px "Segoe UI", sans-serif';
        ctx.fillText('GROW YOUR BUSINESS', 160, 135);

        // Center Owner Photo or Graphic Box
        ctx.save();
        const boxX = 60;
        const boxY = 200;
        const boxW = 500;
        const boxH = 550;

        ctx.fillStyle = '#1e293b';
        ctx.roundRect(boxX, boxY, boxW, boxH, 20);
        ctx.fill();
        ctx.clip();

        if (userImg) {
          ctx.drawImage(userImg, boxX, boxY, boxW, boxH);
        } else {
          ctx.fillStyle = '#334155';
          ctx.fillRect(boxX, boxY, boxW, boxH);
          ctx.fillStyle = '#94a3b8';
          ctx.textAlign = 'center';
          ctx.font = 'bold 32px sans-serif';
          ctx.fillText('Your Photo / Banner', boxX + boxW / 2, boxY + boxH / 2);
        }
        ctx.restore();

        // Right Services Card Box (Orange)
        ctx.save();
        const servX = 600;
        const servY = 220;
        const servW = 420;
        const servH = 380;
        ctx.fillStyle = '#ea580c';
        ctx.roundRect(servX, servY, servW, servH, 24);
        ctx.fill();

        ctx.textAlign = 'left';
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 34px "Segoe UI", sans-serif';
        ctx.fillText('OUR SERVICES', servX + 30, servY + 60);

        ctx.font = '26px "Segoe UI", sans-serif';
        const serviceItems = form.services.split(',');
        let servYPos = servY + 120;
        serviceItems.forEach(item => {
          if (item.trim()) {
            ctx.fillText(`✓  ${item.trim()}`, servX + 30, servYPos);
            servYPos += 50;
          }
        });
        ctx.restore();

        // Orange Callout Badge
        ctx.save();
        ctx.fillStyle = '#f97316';
        ctx.roundRect(60, 780, 400, 80, 16);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.font = 'bold 26px sans-serif';
        ctx.fillText('HAVE AN IDEA OR PROJECT?', 260, 830);
        ctx.restore();

        // Bottom Footer Bar
        const footerY = height - 140;
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, footerY, width, 140);

        ctx.textAlign = 'left';
        ctx.fillStyle = '#94a3b8';
        ctx.font = '22px sans-serif';
        ctx.fillText('CALL US FOR DETAILS', 60, footerY + 55);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 34px sans-serif';
        ctx.fillText(form.phone, 60, footerY + 100);

        ctx.textAlign = 'right';
        ctx.fillStyle = '#94a3b8';
        ctx.font = '22px sans-serif';
        ctx.fillText('VISIT OUR WEBSITE', width - 60, footerY + 55);
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 30px sans-serif';
        ctx.fillText(form.website, width - 60, footerY + 100);
      }

      // -------------------------------------------------------------
      // TEMPLATE 2: Hindi Real Estate Specialist Banner (Ref Image 2 Style)
      // -------------------------------------------------------------
      else if (selectedTemplate === 'template-2') {
        // Dark Blue Background Split
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, width, height);

        // Header Logo & Title
        ctx.textAlign = 'left';
        if (logoImg) {
          ctx.drawImage(logoImg, 50, 40, 80, 80);
        }
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 42px "Segoe UI", sans-serif';
        ctx.fillText(form.businessName, 150, 95);

        // Headline Box Left Side
        ctx.fillStyle = '#ffffff';
        ctx.font = 'black 64px "Segoe UI", sans-serif';
        ctx.fillText('आज ही बनें', 50, 240);
        ctx.fillText('रियल एस्टेट', 50, 320);
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('विशेषज्ञ', 50, 400);

        // Right Side Image Box
        ctx.save();
        const imgX = 540;
        const imgY = 180;
        const imgW = 490;
        const imgH = 400;
        ctx.fillStyle = '#1e293b';
        ctx.roundRect(imgX, imgY, imgW, imgH, 20);
        ctx.fill();
        ctx.clip();
        if (userImg) {
          ctx.drawImage(userImg, imgX, imgY, imgW, imgH);
        } else {
          ctx.fillStyle = '#334155';
          ctx.fillRect(imgX, imgY, imgW, imgH);
          ctx.fillStyle = '#cbd5e1';
          ctx.textAlign = 'center';
          ctx.font = 'bold 30px sans-serif';
          ctx.fillText('Team / Property Photo', imgX + imgW / 2, imgY + imgH / 2);
        }
        ctx.restore();

        // Hindi Description Paragraph
        ctx.textAlign = 'left';
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '28px "Segoe UI", sans-serif';
        ctx.fillText('हम सहयोगियों का एक नेटवर्क बना रहे हैं जहाँ आपको अचल संपत्ति', 50, 480);
        ctx.fillText('के महान अवसर और गहन बाजार ज्ञान प्रदान करेंगे।', 50, 520);

        // Bullet Points List
        const points = [
          '• हम आपको रियल एस्टेट के लिए प्रशिक्षित करेंगे।',
          '• हम आपको बाजार का ज्ञान प्रदान करेंगे।',
          '• प्रति माह 2 लाख और उससे अधिक तक कमाएं'
        ];
        let pY = 600;
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 30px "Segoe UI", sans-serif';
        points.forEach(pt => {
          ctx.fillText(pt, 50, pY);
          pY += 55;
        });

        // CTA Button
        ctx.fillStyle = '#f59e0b';
        ctx.roundRect(50, 790, 240, 70, 35);
        ctx.fill();
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 30px sans-serif';
        ctx.fillText('हमसे जुड़ें', 100, 835);

        // Footer Bar
        const footerY = height - 130;
        ctx.fillStyle = '#020617';
        ctx.fillRect(0, footerY, width, 130);
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 28px sans-serif';
        ctx.fillText(`🌐 ${form.website}`, 50, footerY + 75);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#22c55e';
        ctx.font = 'bold 32px sans-serif';
        ctx.fillText(`📞 ${form.phone}`, width - 50, footerY + 75);
      }

      // -------------------------------------------------------------
      // TEMPLATE 3: Meme Social Media Marketing Post (Ref Image 3 Style)
      // -------------------------------------------------------------
      else if (selectedTemplate === 'template-3') {
        // Yellow Header Banner
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(40, 100, width - 80, 110);
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.font = 'black 60px "Segoe UI", sans-serif';
        ctx.fillText('abhi SOCIAL MEDIA', width / 2, 175);

        // Black Highlighter Box
        ctx.fillStyle = '#000000';
        ctx.fillRect(100, 230, width - 200, 90);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 46px "Segoe UI", sans-serif';
        ctx.fillText('handle karke deta hun!!!', width / 2, 290);

        // Central Meme / Subject Photo Frame
        ctx.save();
        const mX = 200;
        const mY = 360;
        const mW = 680;
        const mH = 500;
        ctx.fillStyle = '#ffffff';
        ctx.roundRect(mX, mY, mW, mH, 16);
        ctx.fill();
        ctx.clip();
        if (userImg) {
          ctx.drawImage(userImg, mX, mY, mW, mH);
        } else {
          ctx.fillStyle = '#e2e8f0';
          ctx.fillRect(mX, mY, mW, mH);
          ctx.fillStyle = '#64748b';
          ctx.font = 'bold 34px sans-serif';
          ctx.fillText('Your Photo / Creative Meme Subject', mX + mW / 2, mY + mH / 2);
        }
        ctx.restore();

        // Footer Contact
        const footerY = height - 130;
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, footerY, width, 130);
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 36px sans-serif';
        ctx.fillText(`Call: ${form.phone}   |   ${form.website}`, width / 2, footerY + 75);
      }

      // -------------------------------------------------------------
      // TEMPLATE 5: Dual Festive + Business Hybrid Poster (Ref Image 5 Style)
      // -------------------------------------------------------------
      else if (selectedTemplate === 'template-5') {
        // White & Gold Clean Theme
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        // Top Header Logo & Name
        ctx.textAlign = 'center';
        ctx.fillStyle = '#0f172a';
        ctx.font = 'black 54px "Playfair Display", Georgia, serif';
        ctx.fillText(form.businessName, width / 2, 90);
        ctx.fillStyle = '#475569';
        ctx.font = 'italic 26px sans-serif';
        ctx.fillText(form.tagline, width / 2, 130);

        // Festival Wish Banner Box (Tricolor / Gold)
        ctx.fillStyle = '#f97316';
        ctx.fillRect(100, 160, width - 200, 80);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 44px sans-serif';
        ctx.fillText(form.customWish, width / 2, 215);

        // Left Side Founder Photo Frame
        ctx.save();
        const fX = 60;
        const fY = 270;
        const fW = 400;
        const fH = 480;
        ctx.fillStyle = '#cbd5e1';
        ctx.roundRect(fX, fY, fW, fH, 16);
        ctx.fill();
        ctx.clip();
        if (userImg) {
          ctx.drawImage(userImg, fX, fY, fW, fH);
        } else {
          ctx.fillStyle = '#94a3b8';
          ctx.fillRect(fX, fY, fW, fH);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 28px sans-serif';
          ctx.fillText('Founder Photo', fX + fW / 2, fY + fH / 2);
        }
        ctx.restore();

        // Right Side Property / Business Photo Frame
        ctx.save();
        const pX = 490;
        const pY = 270;
        const pW = 530;
        const pH = 480;
        ctx.fillStyle = '#0f172a';
        ctx.roundRect(pX, pY, pW, pH, 16);
        ctx.fill();
        ctx.clip();
        if (logoImg) {
          ctx.drawImage(logoImg, pX, pY, pW, pH);
        } else {
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(pX, pY, pW, pH);
          ctx.fillStyle = '#f59e0b';
          ctx.font = 'bold 30px sans-serif';
          ctx.fillText('Property / Building Photo', pX + pW / 2, pY + pH / 2);
        }
        ctx.restore();

        // Headline Below Images
        ctx.fillStyle = '#0f172a';
        ctx.textAlign = 'left';
        ctx.font = 'black 42px "Segoe UI", sans-serif';
        ctx.fillText('FIND. BUY. SELL. BUILD YOUR FUTURE.', 60, 800);

        // Services Grid Box
        ctx.fillStyle = '#f8fafc';
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2;
        ctx.roundRect(60, 830, 960, 110, 16);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#0f172a';
        ctx.textAlign = 'center';
        ctx.font = 'bold 26px sans-serif';
        ctx.fillText(form.services, width / 2, 895);

        // Bottom Contact Call Bar
        const footerY = height - 120;
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, footerY, width, 120);

        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 34px sans-serif';
        ctx.fillText(`CALL US TODAY: ${form.phone}   |   ${form.address}`, width / 2, footerY + 70);
      }
    });

  }, [selectedTemplate, selectedFestival, aspectRatio, form, userPhotoSrc, logoSrc]);

  // Re-render canvas whenever inputs change
  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Download Handler
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `${form.businessName.replace(/\s+/g, '_')}_${selectedFestival}_poster.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="poster-generator-container">
      <div className="container-fluid px-lg-5">
        {/* Header */}
        <div className="text-center mb-4">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="poster-header-title display-5 fw-bold mb-2"
          >
            🎨 AI Business & Festival Poster Generator
          </motion.h1>
          <p className="text-secondary lead fs-6">
            Generate customized, professional festival wishes & marketing posts with exact business branding!
          </p>
        </div>

        <div className="row g-4">
          {/* Controls Column */}
          <div className="col-lg-5">
            <div className="poster-glass-card p-4">
              
              {/* Festival Preset Chips */}
              <div className="mb-4">
                <label className="form-label text-warning fw-bold small text-uppercase mb-2">
                  <i className="bi bi-gift-fill me-1"></i> Select Festival / Category
                </label>
                <div className="d-flex flex-wrap gap-2">
                  {FESTIVAL_PRESETS.map(preset => (
                    <span 
                      key={preset.id}
                      className={`preset-chip ${selectedFestival === preset.id ? 'active' : ''}`}
                      onClick={() => handleFestivalChange(preset.id)}
                    >
                      {preset.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Template Layout Picker */}
              <div className="mb-4">
                <label className="form-label text-warning fw-bold small text-uppercase mb-2">
                  <i className="bi bi-layout-split me-1"></i> Select Template Layout
                </label>
                <div className="d-flex flex-column gap-2">
                  {TEMPLATES.map(tmpl => (
                    <div 
                      key={tmpl.id}
                      className={`template-card d-flex align-items-center gap-3 ${selectedTemplate === tmpl.id ? 'active' : ''}`}
                      onClick={() => setSelectedTemplate(tmpl.id)}
                    >
                      <i className={`bi ${tmpl.icon} fs-3 text-warning`}></i>
                      <div>
                        <div className="fw-bold text-light">{tmpl.title}</div>
                        <div className="text-secondary small">{tmpl.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Aspect Ratio Switcher */}
              <div className="mb-4">
                <label className="form-label text-warning fw-bold small text-uppercase mb-2">
                  <i className="bi bi-aspect-ratio me-1"></i> Post Size Format
                </label>
                <div className="btn-group w-100" role="group">
                  <button 
                    type="button" 
                    className={`btn btn-sm ${aspectRatio === '1:1' ? 'btn-gold' : 'btn-outline-secondary text-light'}`}
                    onClick={() => setAspectRatio('1:1')}
                  >
                    1:1 Square (Feed Post)
                  </button>
                  <button 
                    type="button" 
                    className={`btn btn-sm ${aspectRatio === '9:16' ? 'btn-gold' : 'btn-outline-secondary text-light'}`}
                    onClick={() => setAspectRatio('9:16')}
                  >
                    9:16 Vertical (Story / Reel)
                  </button>
                </div>
              </div>

              {/* Business Profile Inputs */}
              <div className="border-top border-secondary border-opacity-25 pt-3 mb-4">
                <h6 className="text-warning fw-bold mb-3">
                  <i className="bi bi-person-vcard me-1"></i> Business Profile Details
                </h6>

                <div className="mb-3">
                  <label className="form-label small text-secondary">Business Name</label>
                  <input 
                    type="text" 
                    className="form-control form-control-dark"
                    value={form.businessName}
                    onChange={e => setForm({ ...form, businessName: e.target.value })}
                  />
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label className="form-label small text-secondary">Phone / WhatsApp</label>
                    <input 
                      type="text" 
                      className="form-control form-control-dark"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label small text-secondary">City / Address</label>
                    <input 
                      type="text" 
                      className="form-control form-control-dark"
                      value={form.address}
                      onChange={e => setForm({ ...form, address: e.target.value })}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small text-secondary">Website / Email</label>
                  <input 
                    type="text" 
                    className="form-control form-control-dark"
                    value={form.website}
                    onChange={e => setForm({ ...form, website: e.target.value })}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small text-secondary">Custom Wish / Headline Text</label>
                  <textarea 
                    rows="2"
                    className="form-control form-control-dark"
                    value={form.customWish}
                    onChange={e => setForm({ ...form, customWish: e.target.value })}
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label className="form-label small text-secondary">Services Offered (Comma Separated)</label>
                  <input 
                    type="text" 
                    className="form-control form-control-dark"
                    value={form.services}
                    onChange={e => setForm({ ...form, services: e.target.value })}
                  />
                </div>

                {/* Photo & Logo Upload */}
                <div className="row g-2">
                  <div className="col-6">
                    <label className="form-label small text-secondary">Owner / Founder Photo</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      ref={userPhotoInputRef}
                      className="form-control form-control-dark form-control-sm"
                      onChange={handlePhotoUpload}
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label small text-secondary">Business Logo / Property</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      ref={logoInputRef}
                      className="form-control form-control-dark form-control-sm"
                      onChange={handleLogoUpload}
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Canvas Preview & Export Column */}
          <div className="col-lg-7 d-flex flex-column align-items-center">
            <div className="w-100 text-center mb-3">
              <span className="badge bg-gold text-dark px-3 py-2 rounded-pill fw-bold">
                <i className="bi bi-eye-fill me-1"></i> Live High-Res Render Preview
              </span>
            </div>

            <div className="canvas-preview-wrapper mb-4">
              <canvas ref={canvasRef} className="canvas-element" />
            </div>

            <div className="d-flex gap-3 w-100 justify-content-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-gold btn-lg px-5 py-3 rounded-pill shadow-lg d-flex align-items-center gap-2"
                onClick={handleDownload}
              >
                <i className="bi bi-download fs-5"></i>
                <span>Download HD Poster (PNG)</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PosterGenerator;
