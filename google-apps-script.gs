/**
 * Google Apps Script backend for Wedding Website Invitation v1.12.
 * Sheets used: Config, RSVP
 * Drive folder used: Wedding Invitation Images
 * Deploy: Apps Script -> Deploy -> Web app
 * Execute as: Me. Who has access: Anyone.
 */
const CONFIG_SHEET = 'Config';
const RSVP_SHEET = 'RSVP';
const IMAGE_FOLDER_NAME = 'Wedding Invitation Images';
const CONFIG_CHUNK_SIZE = 45000;
const PROP_SPREADSHEET_ID = 'WEDDING_SPREADSHEET_ID';

function getSpreadsheet_() {
  const props = PropertiesService.getScriptProperties();
  const savedId = props.getProperty(PROP_SPREADSHEET_ID);
  if (savedId) {
    try { return SpreadsheetApp.openById(savedId); } catch (e) {}
  }
  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (active) {
    props.setProperty(PROP_SPREADSHEET_ID, active.getId());
    return active;
  }
  const ss = SpreadsheetApp.create('Wedding Invitation CMS Data');
  props.setProperty(PROP_SPREADSHEET_ID, ss.getId());
  return ss;
}

function setup_() {
  const ss = getSpreadsheet_();
  const cfg = ss.getSheetByName(CONFIG_SHEET) || ss.insertSheet(CONFIG_SHEET);
  const rsvp = ss.getSheetByName(RSVP_SHEET) || ss.insertSheet(RSVP_SHEET);
  if (cfg.getLastRow() === 0) cfg.getRange('A1:B1').setValues([['key','value']]);
  if (rsvp.getLastRow() === 0) rsvp.getRange(1,1,1,8).setValues([['timestamp','guestId','guestLinkName','guestName','attending','companions','guestOf','wish']]);
  return ss;
}

function output_(obj, cb) {
  const text = cb ? `${cb}(${JSON.stringify(obj)});` : JSON.stringify(obj);
  return ContentService.createTextOutput(text).setMimeType(cb ? ContentService.MimeType.JAVASCRIPT : ContentService.MimeType.JSON);
}

function outputHtmlPost_(obj) {
  const payload = JSON.stringify(Object.assign({source:'wedding-apps-script'}, obj || {}));
  return HtmlService
    .createHtmlOutput(`<script>parent.postMessage(${payload}, '*');</script>`)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getImageFolder_() {
  const it = DriveApp.getFoldersByName(IMAGE_FOLDER_NAME);
  if (it.hasNext()) return it.next();
  return DriveApp.createFolder(IMAGE_FOLDER_NAME);
}

function getConfig_() {
  const ss = setup_();
  const sh = ss.getSheetByName(CONFIG_SHEET);
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
  const ss = setup_();
  const sh = ss.getSheetByName(CONFIG_SHEET);
  sh.clearContents();
  sh.getRange('A1:B1').setValues([['key','value']]);
  const json = JSON.stringify(config || {});
  const chunks = [];
  for (let i = 0; i < json.length; i += CONFIG_CHUNK_SIZE) chunks.push(json.slice(i, i + CONFIG_CHUNK_SIZE));
  const rows = [['config_chunks', String(chunks.length)], ['saved_at', new Date().toISOString()]];
  chunks.forEach((c, i) => rows.push(['config_' + i, c]));
  sh.getRange(2, 1, rows.length, 2).setValues(rows);
}

function getExpectedPassword_(incomingConfig) {
  const existing = getConfig_();
  return (existing && existing.adminPassword) || (incomingConfig && incomingConfig.adminPassword) || '29062026';
}

function uploadImage_(data) {
  const requestId = data.requestId || '';
  const uploadId = data.uploadId || requestId;
  const expected = getExpectedPassword_(null);
  if (String(data.password || '') !== String(expected)) return outputHtmlPost_({ok:false, requestId, uploadId, error:'Unauthorized'});
  const raw = String(data.dataUrl || '');
  const match = raw.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return outputHtmlPost_({ok:false, requestId, uploadId, error:'Invalid dataUrl'});
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
    requestId,
    uploadId,
    fileId:id,
    fieldPath:data.fieldPath || '',
    filename:safeName,
    driveUrl:file.getUrl(),
    url:`https://drive.google.com/thumbnail?id=${id}&sz=w2000`,
    viewUrl:file.getUrl(),
    downloadUrl:`https://drive.google.com/uc?export=view&id=${id}`,
    altUrl:`https://lh3.googleusercontent.com/d/${id}`
  });
}

function appendRsvp_(data) {
  const ss = setup_();
  ss.getSheetByName(RSVP_SHEET).appendRow([
    data.timestamp || new Date(),
    data.guestId || '',
    data.guestLinkName || '',
    data.guestName || '',
    data.attending || '',
    data.companions || '',
    data.guestOf || '',
    data.wish || ''
  ]);
}

function readJson_(text, fallback) {
  try { return JSON.parse(text || ''); } catch(e) { return fallback; }
}

function authorizeOnce() {
  setup_();
  const folder = getImageFolder_();
  Logger.log('Spreadsheet: ' + getSpreadsheet_().getUrl());
  Logger.log('Image folder: ' + folder.getUrl());
}

function doGet(e) {
  setup_();
  const p = (e && e.parameter) || {};
  const action = p.action || 'getConfig';
  const cb = p.callback || '';
  if (action === 'ping') return output_({ok:true, time:new Date().toISOString(), spreadsheetId:getSpreadsheet_().getId()}, cb);
  if (action === 'getConfig') return output_({ok:true, config:getConfig_()}, cb);
  if (action === 'getRsvps') {
    const ss = setup_();
    const sh = ss.getSheetByName(RSVP_SHEET);
    const vals = sh.getDataRange().getValues();
    vals.shift();
    const rows = vals.filter(r=>String(r.join('')).trim()).map(r => ({
      timestamp:r[0], guestId:r[1], guestLinkName:r[2], guestName:r[3], attending:r[4], companions:r[5], guestOf:r[6], wish:r[7]
    }));
    return output_({ok:true, rsvps:rows}, cb);
  }
  return output_({ok:false, error:'Unknown action'}, cb);
}

function doPost(e) {
  setup_();
  const p = (e && e.parameter) || {};
  const requestId = p.requestId || '';
  const action = p.action || '';
  if (action === 'uploadImage') return uploadImage_(p);
  if (action === 'rsvp') {
    const payload = readJson_(p.payloadJson, null) || readJson_((e.postData && e.postData.contents) || '{}', {});
    appendRsvp_(payload || {});
    return outputHtmlPost_({ok:true, requestId});
  }
  if (action === 'saveConfig') {
    const cfg = readJson_(p.configJson, null) || (readJson_((e.postData && e.postData.contents) || '{}', {}).config) || {};
    const expected = getExpectedPassword_(cfg);
    if (String(p.password || '') !== String(expected)) return outputHtmlPost_({ok:false, requestId, error:'Unauthorized'});
    saveConfig_(cfg);
    return outputHtmlPost_({ok:true, requestId, savedAt:new Date().toISOString(), spreadsheetId:getSpreadsheet_().getId()});
  }
  const body = readJson_((e.postData && e.postData.contents) || '{}', {});
  if (body.action === 'rsvp') {
    appendRsvp_(body);
    return output_({ok:true});
  }
  if (body.action === 'saveConfig') {
    const expected = getExpectedPassword_(body.config || {});
    if (String(body.password || '') !== String(expected)) return output_({ok:false, error:'Unauthorized'});
    saveConfig_(body.config || {});
    return output_({ok:true});
  }
  return outputHtmlPost_({ok:false, requestId, error:'Unknown action'});
}
