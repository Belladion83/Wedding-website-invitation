/**
 * Google Apps Script backend for Wedding Website Invitation.
 * Sheets used: Config, RSVP
 * Deploy: Apps Script -> Deploy -> New deployment -> Web app
 * Execute as: Me. Who has access: Anyone.
 */
const CONFIG_SHEET = 'Config';
const RSVP_SHEET = 'RSVP';
function setup_() {
  const ss = SpreadsheetApp.getActive();
  let cfg = ss.getSheetByName(CONFIG_SHEET) || ss.insertSheet(CONFIG_SHEET);
  let rsvp = ss.getSheetByName(RSVP_SHEET) || ss.insertSheet(RSVP_SHEET);
  if (cfg.getLastRow() === 0) cfg.getRange('A1:B1').setValues([['key','value']]);
  if (rsvp.getLastRow() === 0) rsvp.getRange(1,1,1,7).setValues([['timestamp','guestId','guestName','attending','companions','guestOf','wish']]);
}
function output_(obj, cb) {
  const text = cb ? `${cb}(${JSON.stringify(obj)});` : JSON.stringify(obj);
  return ContentService.createTextOutput(text).setMimeType(cb ? ContentService.MimeType.JAVASCRIPT : ContentService.MimeType.JSON);
}
function getConfig_() {
  setup_(); const sh = SpreadsheetApp.getActive().getSheetByName(CONFIG_SHEET);
  const vals = sh.getDataRange().getValues();
  for (let i=1;i<vals.length;i++) if (vals[i][0] === 'config') { try { return JSON.parse(vals[i][1] || '{}'); } catch(e){ return {}; } }
  return {};
}
function saveConfig_(config) {
  setup_(); const sh = SpreadsheetApp.getActive().getSheetByName(CONFIG_SHEET);
  const vals = sh.getDataRange().getValues(); let row = vals.findIndex(r => r[0] === 'config') + 1;
  if (!row) row = sh.getLastRow() + 1;
  sh.getRange(row,1,1,2).setValues([['config', JSON.stringify(config || {})]]);
}
function doGet(e) {
  setup_(); const p = e.parameter || {}; const action = p.action || 'getConfig'; const cb = p.callback || '';
  if (action === 'getConfig') return output_({ok:true, config:getConfig_()}, cb);
  if (action === 'getRsvps') {
    const sh = SpreadsheetApp.getActive().getSheetByName(RSVP_SHEET); const vals = sh.getDataRange().getValues(); const head = vals.shift();
    const rows = vals.filter(r=>r.join('').trim()).map(r => ({timestamp:r[0], guestId:r[1], guestName:r[2], attending:r[3], companions:r[4], guestOf:r[5], wish:r[6]}));
    return output_({ok:true, rsvps:rows}, cb);
  }
  return output_({ok:false, error:'Unknown action'}, cb);
}
function doPost(e) {
  setup_(); let data = {};
  try { data = JSON.parse((e.postData && e.postData.contents) || '{}'); } catch(err) { data = {}; }
  if (data.action === 'rsvp') {
    SpreadsheetApp.getActive().getSheetByName(RSVP_SHEET).appendRow([data.timestamp || new Date(), data.guestId || '', data.guestName || '', data.attending || '', data.companions || '', data.guestOf || '', data.wish || '']);
    return output_({ok:true});
  }
  if (data.action === 'saveConfig') {
    const existing = getConfig_(); const expected = (existing && existing.adminPassword) || (data.config && data.config.adminPassword) || '29062026';
    if (String(data.password || '') !== String(expected)) return output_({ok:false, error:'Unauthorized'});
    saveConfig_(data.config || {}); return output_({ok:true});
  }
  return output_({ok:false, error:'Unknown action'});
}
