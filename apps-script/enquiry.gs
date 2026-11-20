/**
 * Backend for the portfolio's "Send enquiry" form.
 * Each enquiry is added as a row to the "Enquiries" sheet and emailed to the
 * Google account that deployed this script (replying answers the sender).
 *
 * Setup (once):
 * 1. Create a Google Sheet, then Extensions > Apps Script, and paste this file.
 * 2. Deploy > New deployment > type "Web app".
 *    Execute as: Me. Who has access: Anyone. Authorise when asked.
 * 3. Copy the web app URL (ends in /exec) into `formEndpoint` in src/data/profile.ts.
 * After editing this script, use Deploy > Manage deployments > Edit > New version,
 * so the same URL keeps working.
 */

const FIELDS = ['name', 'email', 'business', 'website', 'need', 'message'];
const REQUIRED = ['name', 'email', 'business', 'need'];

function doPost(e) {
  const p = (e && e.parameter) || {};
  if (p._gotcha) return json({ ok: true }); // honeypot filled: a bot, drop it quietly
  if (REQUIRED.some((k) => !p[k])) return json({ ok: false, error: 'missing fields' });

  const row = FIELDS.map((k) => cell(p[k]));
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const book = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = book.getSheetByName('Enquiries') || book.insertSheet('Enquiries');
    if (sheet.getLastRow() === 0) sheet.appendRow(['Received'].concat(FIELDS));
    sheet.appendRow([new Date()].concat(row));
  } finally {
    lock.releaseLock();
  }

  try {
    MailApp.sendEmail({
      to: Session.getEffectiveUser().getEmail(),
      replyTo: p.email,
      subject: 'Website enquiry: ' + p.business,
      body: FIELDS.map((k) => k + ': ' + (p[k] || '-')).join('\n'),
    });
  } catch (err) {
    // The row is saved even if the email fails (e.g. daily quota reached).
    console.error(err);
  }
  return json({ ok: true });
}

/** Trim long input and stop text like "=HYPERLINK(...)" from running as a formula. */
function cell(value) {
  const s = String(value || '').slice(0, 2000);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
