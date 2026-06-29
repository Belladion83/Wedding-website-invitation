(function(){
  function moveCalendarAfterTimeline(){
    const calendar = document.getElementById('calendar39');
    const timeline = document.getElementById('timeline39');
    const gallery = document.querySelector('.gallery.cinelove-gallery, section.gallery');
    if(!calendar || !timeline) return;

    if(timeline.nextElementSibling !== calendar){
      timeline.insertAdjacentElement('afterend', calendar);
    }
    if(gallery && calendar.nextElementSibling !== gallery){
      gallery.parentNode.insertBefore(calendar, gallery);
    }
  }

  function injectStyle(){
    ['calendar-after-timeline-v203','calendar-after-timeline-v204'].forEach(function(id){
      const old = document.getElementById(id);
      if(old) old.remove();
    });
    const style = document.createElement('style');
    style.id = 'calendar-after-timeline-v204';
    style.textContent = `
      body .page-shell .site #calendar39.calendar39{
        padding-top:40px !important;
        padding-bottom:28px !important;
      }
      body .page-shell .site #calendar39 .calendar-box{
        margin-top:12px !important;
        margin-bottom:0 !important;
        padding-bottom:0 !important;
      }
      body .page-shell .site #calendar39 .calendar-grid{
        margin-bottom:0 !important;
        padding-bottom:0 !important;
      }
      body .page-shell .site #calendar39 .calendar-countdown,
      body .page-shell .site #calendar39 #countdown39{
        margin-top:-16px !important;
        padding-top:0 !important;
        transform:translateY(-12px) !important;
      }
      body .page-shell .site #calendar39 .calendar-countdown .countdown-intro,
      body .page-shell .site #calendar39 #countdown39 .countdown-intro{
        margin-top:0 !important;
        margin-bottom:2px !important;
        line-height:1.05 !important;
      }
      body .page-shell .site #calendar39 .calendar-countdown .divider,
      body .page-shell .site #calendar39 #countdown39 .divider{
        margin-top:4px !important;
        margin-bottom:6px !important;
      }
      body .page-shell .site #calendar39 .calendar-countdown .countdown,
      body .page-shell .site #calendar39 #countdown39 .countdown{
        margin-top:0 !important;
        margin-bottom:0 !important;
        padding-top:0 !important;
      }
      @media (max-width:760px){
        body .page-shell .site #calendar39 .calendar-countdown,
        body .page-shell .site #calendar39 #countdown39{
          margin-top:-20px !important;
          transform:translateY(-14px) !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function apply(){
    moveCalendarAfterTimeline();
    injectStyle();
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply);
  else apply();
  window.addEventListener('load', apply);
  setTimeout(apply, 800);
  setTimeout(apply, 2200);
})();
