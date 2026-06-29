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
    const old = document.getElementById('calendar-after-timeline-v203');
    if(old) old.remove();
    const style = document.createElement('style');
    style.id = 'calendar-after-timeline-v203';
    style.textContent = `
      body .page-shell .site #calendar39.calendar39{
        padding-top:42px !important;
        padding-bottom:34px !important;
      }
      body .page-shell .site #calendar39 .calendar-box{
        margin-top:14px !important;
        margin-bottom:8px !important;
      }
      body .page-shell .site #calendar39 .calendar-countdown{
        margin-top:8px !important;
        padding-top:0 !important;
      }
      body .page-shell .site #calendar39 .calendar-countdown .countdown-intro{
        margin-top:0 !important;
        margin-bottom:6px !important;
      }
      body .page-shell .site #calendar39 .calendar-countdown .divider{
        margin-top:8px !important;
        margin-bottom:10px !important;
      }
      body .page-shell .site #calendar39 .calendar-countdown .countdown{
        margin-top:8px !important;
        margin-bottom:0 !important;
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
