/**
 * Google Apps Script backend for Wedding Website Invitation v1.9.
 * Sheets used: Config, RSVP
 * Drive folder used: Wedding Invitation Images
 * Deploy: Apps Script -> Deploy -> New deployment -> Web app
 * Execute as: Me. Who has access: Anyone.
 */
const CONFIG_SHEET = 'Config';
const RSVP_SHEET = 'RSVP';
const IMAGE_FOLDER_NAME = 'Wedding Invitation Images';
const CONFIG_CHUNK_SIZE = 45000;
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
function outputHtmlPost_(obj) {
  const payload = JSON.stringify(Object.assign({source:'wedding-apps-script-upload'}, obj || {}));
  return HtmlService.createHtmlOutput(`<script>parent.postMessage(${payload}, '*');</script>`);
}
function getImageFolder_() {
  const it = DriveApp.getFoldersByName(IMAGE_FOLDER_NAME);
  if (it.hasNext()) return it.next();
  return DriveApp.createFolder(IMAGE_FOLDER_NAME);
}
function getConfig_() {
  setup_();
  const sh = SpreadsheetApp.getActive().getSheetByName(CONFIG_SHEET);
  const vals = sh.getDataRange().getValues();
  const map = {};
  for (let i = 1; i < vals.length; i++) map[vals[i][0]] = vals[i][1];
  try {
    if (map.config_chunks) {
      const n = Number(map.config_chunks || 0);
      let json = '';
      for (let i = 0; i < n; i++) json += map['config_' + i] || '';
      return JSON.parse(json || '{}');
    }
    if (map.config) return JSON.parse(map.config || '{}');
  } catch(e) {}
  return {};
}
function saveConfig_(config) {
  setup_();
  const sh = SpreadsheetApp.getActive().getSheetByName(CONFIG_SHEET);
  sh.clearContents();
  sh.getRange('A1:B1').setValues([['key','value']]);
  const json = JSON.stringify(config || {});
  const chunks = [];
  for (let i = 0; i < json.length; i += CONFIG_CHUNK_SIZE) chunks.push(json.slice(i, i + CONFIG_CHUNK_SIZE));
  const rows = [['config_chunks', String(chunks.length)], ['saved_at', new Date().toISOString()]];
  chunks.forEach((c, i) => rows.push(['config_' + i, c]));
  if (rows.length) sh.getRange(2, 1, rows.length, 2).setValues(rows);
}
function uploadImage_(data) {
  const uploadId = data.uploadId || '';
  const existing = getConfig_();
  const expected = (existing && existing.adminPassword) || data.password || '29062026';
  if (String(data.password || '') !== String(expected)) return outputHtmlPost_({ok:false, uploadId, error:'Unauthorized'});
  const raw = String(data.dataUrl || '');
  const match = raw.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return outputHtmlPost_({ok:false, uploadId, error:'Invalid dataUrl'});
  const mimeType = data.mimeType || match[1] || 'image/png';
  const safeName = String(data.filename || ('image-' + Date.now())).replace(/[\\/:*?"<>|]/g, '-');
  const bytes = Utilities.base64Decode(match[2]);
  const blob = Utilities.newBlob(bytes, mimeType, safeName);
  const folder = getImageFolder_();
  const file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  const id = file.getId();
  return outputHtmlPost_({
    ok:true,
    uploadId,
    fileId:id,
    fieldPath:data.fieldPath || '',
    filename:safeName,
    driveUrl:file.getUrl(),
    url:`https://drive.google.com/uc?export=view&id=${id}`,
    altUrl:`https://lh3.googleusercontent.com/d/${id}`
  });
}
function doGet(e) {
  setup_(); const p = e.parameter || {}; const action = p.action || 'getConfig'; const cb = p.callback || '';
  if (action === 'getConfig') return output_({ok:true, config:getConfig_()}, cb);
  if (action === 'getRsvps') {
    const sh = SpreadsheetApp.getActive().getSheetByName(RSVP_SHEET);
    const vals = sh.getDataRange().getValues();
    vals.shift();
    const rows = vals.filter(r=>r.join('').trim()).map(r => ({timestamp:r[0], guestId:r[1], guestName:r[2], attending:r[3], companions:r[4], guestOf:r[5], wish:r[6]}));
    return output_({ok:true, rsvps:rows}, cb);
  }
  return output_({ok:false, error:'Unknown action'}, cb);
}
function doPost(e) {
  setup_();
  const p = (e && e.parameter) || {};
  if (p.action === 'uploadImage') return uploadImage_(p);
  let data = {};
  try { data = JSON.parse((e.postData && e.postData.contents) || '{}'); } catch(err) { data = {}; }
  if (data.action === 'rsvp') {
    SpreadsheetApp.getActive().getSheetByName(RSVP_SHEET).appendRow([data.timestamp || new Date(), data.guestId || '', data.guestName || '', data.attending || '', data.companions || '', data.guestOf || '', data.wish || '']);
    return output_({ok:true});
  }
  if (data.action === 'saveConfig') {
    const existing = getConfig_();
    const expected = (existing && existing.adminPassword) || (data.config && data.config.adminPassword) || '29062026';
    if (String(data.password || '') !== String(expected)) return output_({ok:false, error:'Unauthorized'});
    saveConfig_(data.config || {}); return output_({ok:true});
  }
  return output_({ok:false, error:'Unknown action'});
}
