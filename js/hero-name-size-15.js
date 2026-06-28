(function(){
  function applyHeroNameSize(){
    const oldStyle = document.getElementById('hero-name-size-15-v188');
    if(oldStyle) oldStyle.remove();
    if(document.getElementById('hero-name-size-15-v189')) return;
    const style = document.createElement('style');
    style.id = 'hero-name-size-15-v189';
    style.textContent = `
      body .page-shell .site .hero.cinelove-cover .hero-content .hero-names,
      body .page-shell .site .hero.cinelove-cover .hero-content .hero-names span,
      body .page-shell .site .hero.cinelove-cover .hero-content #heroGroomName,
      body .page-shell .site .hero.cinelove-cover .hero-content #heroBrideName{
        font-size:44px !important;
        line-height:1.05 !important;
      }
      body .page-shell .site .hero.cinelove-cover .hero-content .hero-names span:nth-child(2){
        font-size:27px !important;
        line-height:1 !important;
      }
      @media (max-width:760px){
        body .page-shell .site .hero.cinelove-cover .hero-content .hero-names,
        body .page-shell .site .hero.cinelove-cover .hero-content .hero-names span,
        body .page-shell .site .hero.cinelove-cover .hero-content #heroGroomName,
        body .page-shell .site .hero.cinelove-cover .hero-content #heroBrideName{
          font-size:37px !important;
          line-height:1.06 !important;
        }
        body .page-shell .site .hero.cinelove-cover .hero-content .hero-names span:nth-child(2){
          font-size:23px !important;
        }
      }
      @media (max-width:390px){
        body .page-shell .site .hero.cinelove-cover .hero-content .hero-names,
        body .page-shell .site .hero.cinelove-cover .hero-content .hero-names span,
        body .page-shell .site .hero.cinelove-cover .hero-content #heroGroomName,
        body .page-shell .site .hero.cinelove-cover .hero-content #heroBrideName{
          font-size:35px !important;
        }
      }
    `;
    document.head.appendChild(style);
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyHeroNameSize);
  else applyHeroNameSize();
  window.addEventListener('load', applyHeroNameSize);
})();
