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
    const old195 = document.getElementById('hero-invite-layout-v195');
    if(old195) old195.remove();
    const old196 = document.getElementById('hero-invite-layout-v196');
    if(old196) old196.remove();
    const old197 = document.getElementById('hero-invite-layout-v197');
    if(old197) old197.remove();
    const old198 = document.getElementById('hero-invite-layout-v198');
    if(old198) old198.remove();
    const old199 = document.getElementById('hero-invite-layout-v199');
    if(old199) old199.remove();
    const style = document.createElement('style');
    style.id = 'hero-invite-layout-v199';
    style.textContent = `
      body .page-shell .site .hero.cinelove-cover{
        justify-content:flex-start !important;
        align-items:center !important;
      }
      body .page-shell .site .hero.cinelove-cover::before{
        background:linear-gradient(180deg, rgba(255,248,239,.76) 0%, rgba(255,248,239,.48) 21%, rgba(255,255,255,0) 56%, rgba(255,248,239,.35) 100%) !important;
      }
      body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195{
        display:flex !important;
        flex-direction:column !important;
        align-items:center !important;
        justify-content:flex-start !important;
        gap:0 !important;
        padding-top:56px !important;
        padding-bottom:0 !important;
        margin-top:0 !important;
      }
      body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 .hero-names.hero-short-names{
        order:1 !important;
        display:flex !important;
        flex-direction:row !important;
        align-items:center !important;
        justify-content:center !important;
        width:100% !important;
        max-width:100% !important;
        margin:0 auto 6px !important;
        padding:0 !important;
        gap:8px !important;
        color:var(--cine-wine) !important;
        font-family:"Great Vibes", cursive !important;
        font-weight:400 !important;
        font-size:clamp(43px, 9.4vw, 58px) !important;
        line-height:.92 !important;
        letter-spacing:0 !important;
        text-transform:none !important;
        white-space:nowrap !important;
      }
      body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 .hero-names.hero-short-names span{
        font-family:"Great Vibes", cursive !important;
        font-size:inherit !important;
        font-weight:400 !important;
        line-height:.92 !important;
        letter-spacing:0 !important;
        text-transform:none !important;
        white-space:nowrap !important;
      }
      body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 .hero-names.hero-short-names #heroGroomName{
        position:relative !important;
        z-index:2 !important;
        transform:translateX(-4px) !important;
      }
      body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 .hero-names.hero-short-names .hero-amp{
        position:relative !important;
        z-index:4 !important;
        margin:0 8px !important;
        transform:translateY(2px) rotate(-8deg) !important;
        color:#f3e5c8 !important;
        font-family:"Great Vibes", "Allura", cursive !important;
        font-size:1.05em !important;
        font-weight:400 !important;
        line-height:.65 !important;
        letter-spacing:0 !important;
        opacity:.98 !important;
        text-shadow:0 2px 10px rgba(86,52,23,.38), 0 1px 2px rgba(255,255,255,.68) !important;
      }
      body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 .hero-names.hero-short-names #heroBrideName{
        position:relative !important;
        z-index:2 !important;
        transform:translate(4px, 7px) !important;
      }
      body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 #inviteeLine{
        order:2 !important;
        display:flex !important;
        flex-direction:column !important;
        align-items:center !important;
        justify-content:center !important;
        width:100% !important;
        margin:0 auto 0 !important;
        gap:5px !important;
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
      body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 .invitee-detail,
      body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 .hero-date,
      body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 #musicStart{
        display:none !important;
      }
      @media (max-width:760px){
        body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195{
          padding-top:42px !important;
          padding-bottom:0 !important;
        }
        body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 .hero-names.hero-short-names{
          font-size:clamp(39px, 11vw, 52px) !important;
          margin-bottom:5px !important;
          gap:7px !important;
        }
        body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 .hero-names.hero-short-names .hero-amp{
          margin:0 6px !important;
        }
        body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 #heroBrideName{
          transform:translate(4px, 6px) !important;
        }
        body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 #inviteeLine span+span{
          font-size:clamp(32px, 8.8vw, 40px) !important;
        }
      }
      @media (max-width:390px){
        body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195{
          padding-top:36px !important;
        }
        body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 .hero-names.hero-short-names{
          font-size:38px !important;
          gap:5px !important;
        }
        body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 .hero-names.hero-short-names #heroGroomName{
          transform:translateX(-2px) !important;
        }
        body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 .hero-names.hero-short-names #heroBrideName{
          transform:translate(2px, 6px) !important;
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
