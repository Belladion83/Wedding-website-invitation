(function(){
  function applyHeroNameSize(){
    const oldStyle = document.getElementById('hero-name-size-15-v188');
    if(oldStyle) oldStyle.remove();
    const oldStyle2 = document.getElementById('hero-name-size-15-v189');
    if(oldStyle2) oldStyle2.remove();
    const oldStyle3 = document.getElementById('hero-name-size-15-v190');
    if(oldStyle3) oldStyle3.remove();
    const oldStyle4 = document.getElementById('hero-name-size-15-v191');
    if(oldStyle4) oldStyle4.remove();
    const oldStyle5 = document.getElementById('hero-name-size-15-v192');
    if(oldStyle5) oldStyle5.remove();
    if(document.getElementById('hero-name-size-15-v193')) return;
    const style = document.createElement('style');
    style.id = 'hero-name-size-15-v193';
    style.textContent = `
      body .page-shell .site .hero.cinelove-cover .hero-content .hero-names,
      body .page-shell .site .hero.cinelove-cover .hero-content .hero-names span,
      body .page-shell .site .hero.cinelove-cover .hero-content #heroGroomName,
      body .page-shell .site .hero.cinelove-cover .hero-content #heroBrideName{
        font-size:46px !important;
        line-height:1.05 !important;
      }
      body .page-shell .site .hero.cinelove-cover .hero-content .hero-names span:nth-child(2){
        font-size:28px !important;
        line-height:1 !important;
      }
      body .page-shell .site .event-invite .ceremony-block #ceremonyTitle,
      body .page-shell .site .event-invite .ceremony-block h3#ceremonyTitle{
        font-size:clamp(17px, 2.71vw, 28px) !important;
        line-height:1.15 !important;
        white-space:nowrap !important;
        letter-spacing:.02em !important;
      }
      @media (max-width:760px){
        body .page-shell .site .hero.cinelove-cover .hero-content .hero-names,
        body .page-shell .site .hero.cinelove-cover .hero-content .hero-names span,
        body .page-shell .site .hero.cinelove-cover .hero-content #heroGroomName,
        body .page-shell .site .hero.cinelove-cover .hero-content #heroBrideName{
          font-size:39px !important;
          line-height:1.06 !important;
        }
        body .page-shell .site .hero.cinelove-cover .hero-content .hero-names span:nth-child(2){
          font-size:24px !important;
        }

        body .page-shell .site .event-invite .formal-couple h2,
        body .page-shell .site .event-invite .formal-couple #formalGroomName,
        body .page-shell .site .event-invite .formal-couple #formalBrideName{
          font-size:39px !important;
          line-height:1.06 !important;
        }
        body .page-shell .site .event-invite .formal-couple > span{
          font-size:24px !important;
          line-height:1 !important;
        }
        body .page-shell .site .event-invite .ceremony-block #ceremonyTitle,
        body .page-shell .site .event-invite .ceremony-block h3#ceremonyTitle{
          font-size:clamp(14px, 4vw, 18px) !important;
          line-height:1.16 !important;
          white-space:nowrap !important;
          letter-spacing:.01em !important;
        }
      }
      @media (max-width:390px){
        body .page-shell .site .hero.cinelove-cover .hero-content .hero-names,
        body .page-shell .site .hero.cinelove-cover .hero-content .hero-names span,
        body .page-shell .site .hero.cinelove-cover .hero-content #heroGroomName,
        body .page-shell .site .hero.cinelove-cover .hero-content #heroBrideName,
        body .page-shell .site .event-invite .formal-couple h2,
        body .page-shell .site .event-invite .formal-couple #formalGroomName,
        body .page-shell .site .event-invite .formal-couple #formalBrideName{
          font-size:37px !important;
        }
        body .page-shell .site .event-invite .ceremony-block #ceremonyTitle,
        body .page-shell .site .event-invite .ceremony-block h3#ceremonyTitle{
          font-size:14px !important;
        }
      }
    `;
    document.head.appendChild(style);
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyHeroNameSize);
  else applyHeroNameSize();
  window.addEventListener('load', applyHeroNameSize);
})();
