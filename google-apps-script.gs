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
const CONFIG_CHUNK_SIZE