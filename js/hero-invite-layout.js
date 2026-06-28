(function(){
  function escapeHtml(v){
    return String(v || '').replace(/[&<>"]/g, function(m){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m];
    });
  }

  function toNameCase(value){
    return String(value || '')
      .trim()
      .toLocaleLowerCase('vi-VN')
      .replace(/(^|[\s\-'])\p{L}/gu, function(m){ return m.toLocaleUpperCase('vi-VN'); });
  }

  function resolveGuest(cfg){
    const params = new URLSearchParams(location.search);
    const guestId = params.get('id') || params.get('guest') || '';
    const guestNameParam = params.get('name') || '';
    const found = ((cfg && cfg.guests) || []).find(function(g){
      return String(g.id || '').toLowerCase() === String(guestId || '').toLowerCase();
    });
    return guestNameParam || (found && found.name) || 'Quý khách';
  }

  function injectStyle(){
    const old = document.getElementById('hero-invite-layout-v195');
    if(old) old.remove();
    const style = document.createElement('style');
    style.id = 'hero-invite-layout-v195';
    style.textContent = `
      body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195{
        display:flex !important;
        flex-direction:column !important;
        align-items:center !important;
        justify-content:center !important;
        gap:0 !important;
        padding-bottom:54px !important;
      }
      body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 .hero-names.hero-short-names{
        order:1 !important;
        display:flex !important;
        flex-direction:row !important;
        align-items:center !important;
        justify-content:center !important;
        width:100% !important;
        max-width:100% !important;
        margin:0 auto 18px !important;
        padding:0 !important;
        gap:0 !important;
        color:var(--cine-wine) !important;
        font-family:"Cormorant Garamond", "Playfair Display", serif !important;
        font-weight:600 !important;
        font-size:clamp(43px, 9.4vw, 58px) !important;
        line-height:.92 !important;
        letter-spacing:-.035em !important;
        text-transform:none !important;
        white-space:nowrap !important;
      }
      body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 .hero-names.hero-short-names span{
        font-family:inherit !important;
        font-size:inherit !important;
        line-height:.92 !important;
        letter-spacing:-.035em !important;
        text-transform:none !important;
        white-space:nowrap !important;
      }
      body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 .hero-names.hero-short-names #heroGroomName{
        position:relative !important;
        z-index:2 !important;
        transform:translateX(11px) !important;
      }
      body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 .hero-names.hero-short-names .hero-amp{
        position:relative !important;
        z-index:4 !important;
        margin:0 -6px !important;
        transform:translateY(2px) rotate(-8deg) !important;
        color:var(--cine-wine) !important;
        font-family:"Great Vibes", "Allura", cursive !important;
        font-size:1.05em !important;
        font-weight:400 !important;
        line-height:.65 !important;
        letter-spacing:0 !important;
        opacity:.98 !important;
      }
      body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 .hero-names.hero-short-names #heroBrideName{
        position:relative !important;
        z-index:2 !important;
        transform:translateX(-11px) !important;
      }
      body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 #inviteeLine{
        order:2 !important;
        display:flex !important;
        flex-direction:column !important;
        align-items:center !important;
        justify-content:center !important;
        width:100% !important;
        margin:0 auto 14px !important;
        gap:7px !important;
        text-align:center !important;
      }
      body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 #inviteeLine span:first-child{
        font-family:Inter, Arial, sans-serif !important;
        font-size:13px !important;
        line-height:1.1 !important;
        font-weight:600 !important;
        letter-spacing:.34em !important;
        text-transform:uppercase !important;
        color:var(--cine-wine) !important;
      }
      body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 #inviteeLine span+span{
        font-family:"Cormorant Garamond", "Playfair Display", serif !important;
        font-size:clamp(34px, 7.6vw, 42px) !important;
        line-height:1.02 !important;
        font-weight:600 !important;
        letter-spacing:.01em !important;
        text-transform:none !important;
        color:var(--cine-wine) !important;
      }
      body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 .invitee-detail{
        display:none !important;
      }
      body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 .hero-date{
        order:3 !important;
        margin-top:0 !important;
      }
      body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 #musicStart{
        order:4 !important;
      }
      @media (max-width:760px){
        body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195{
          padding-bottom:42px !important;
        }
        body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 .hero-names.hero-short-names{
          font-size:clamp(39px, 11vw, 52px) !important;
          margin-bottom:16px !important;
        }
        body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 .hero-names.hero-short-names .hero-amp{
          margin:0 -5px !important;
        }
        body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 #inviteeLine span+span{
          font-size:clamp(32px, 8.8vw, 40px) !important;
        }
      }
      @media (max-width:390px){
        body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 .hero-names.hero-short-names{
          font-size:38px !important;
        }
        body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 .hero-names.hero-short-names #heroGroomName{
          transform:translateX(9px) !important;
        }
        body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 .hero-names.hero-short-names #heroBrideName{
          transform:translateX(-9px) !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  async function applyHeroInviteLayout(){
    const content = document.querySelector('.hero.cinelove-cover .hero-content');
    const names = document.getElementById('heroNames');
    const groom = document.getElementById('heroGroomName');
    const bride = document.getElementById('heroBrideName');
    const invite = document.getElementById('inviteeLine');
    if(!content || !names || !groom || !bride || !invite) return;

    injectStyle();
    content.classList.add('hero-invite-v195');
    names.classList.add('hero-short-names');

    let cfg = null;
    try{
      if(window.WeddingCMS && WeddingCMS.loadConfig) cfg = await WeddingCMS.loadConfig();
    }catch(e){
      console.warn('Hero invite layout config load failed', e);
    }

    const site = (cfg && cfg.site) || {};
    groom.textContent = toNameCase(site.groomShortName || 'Phú Quí');
    bride.textContent = toNameCase(site.brideShortName || 'Ánh Nguyệt');

    const amp = names.querySelector('span:nth-child(2)');
    if(amp){
      amp.textContent = '&';
      amp.classList.add('hero-amp');
    }

    if(content.firstElementChild !== names) content.insertBefore(names, content.firstChild);
    if(names.nextElementSibling !== invite) content.insertBefore(invite, names.nextSibling);

    const detail = content.querySelector('.invitee-detail');
    if(detail) detail.style.display = 'none';

    const guestName = resolveGuest(cfg);
    invite.innerHTML = '<span>Kính mời</span><span>' + escapeHtml(guestName) + '</span>';
  }

  function boot(){
    applyHeroInviteLayout();
    setTimeout(applyHeroInviteLayout, 450);
    setTimeout(applyHeroInviteLayout, 1400);
    setTimeout(applyHeroInviteLayout, 3200);
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  window.addEventListener('load', applyHeroInviteLayout);
})();
