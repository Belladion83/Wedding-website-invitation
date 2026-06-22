/**
 * Google Apps Script backend for Wedding Website Invitation v1.12.
 * Works for both standalone Apps Script and spreadsheet-bound Apps Script.
 * Sheets used: Config, RSVP
 * Drive folder used: Wedding Invitation Images
 * Deploy: Apps Script -> Deploy -> New deployment -> Web app
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
  let cfg = ss.getSheetByName(CONFIG_SHEET) || ss.insertSheet(CONFIG_SHEET);
  let rsvp = ss.getSheetByName(RSVP_SHEET