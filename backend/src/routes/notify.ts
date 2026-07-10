import { Router } from 'express';
import pool from '../db/connection.js';

const router = Router();

// Send APNs notification to a single device token
// Requires env vars: APNS_KEY (contents of .p8 file), APNS_KEY_ID, APNS_TEAM_ID, APNS_BUNDLE_ID
async function sendAPNS(token: string, title: string, body: string, env: string = 'production') {
  const keyId = process.env.APNS_KEY_ID;
  const teamId = process.env.APNS_TEAM_ID;
  const bundleId = process.env.APNS_BUNDLE_ID;
  const apnsKey = process.env.APNS_KEY;

  if (!keyId || !teamId || !bundleId || !apnsKey) {
    console.warn('APNs env vars not configured — skipping notification');
    return { skipped: true };
  }

  // Dynamically import for JWT signing
  const { createSign } = await import('crypto');

  const header = Buffer.from(JSON.stringify({ alg: 'ES256', kid: keyId })).toString('base64url');
  const now = Math.floor(Date.now() / 1000);
  const payload = Buffer.from(JSON.stringify({ iss: teamId, iat: now })).toString('base64url');
  const signingInput = `${header}.${payload}`;

  const sign = createSign('SHA256');
  sign.update(signingInput);
  const signature = sign.sign(apnsKey, 'base64url');
  const jwt = `${signingInput}.${signature}`;

  const host = env === 'sandbox'
    ? 'https://api.sandbox.push.apple.com'
    : 'https://api.push.apple.com';

  const response = await fetch(`${host}/3/device/${token}`, {
    method: 'POST',
    headers: {
      'authorization': `bearer ${jwt}`,
      'apns-topic': bundleId,
      'apns-push-type': 'alert',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      aps: {
        alert: { title, body },
        sound: 'default',
        badge: 1,
      },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error('APNs error:', response.status, text);
    return { error: text };
  }

  return { sent: true };
}

// /api/notify/trigger — accepts GET (Vercel Cron) or POST (manual/external).
// Vercel Cron auto-adds `Authorization: Bearer $CRON_SECRET`. External services can
// use `Authorization: Bearer $NOTIFY_SECRET`. Both are accepted; each is optional.
router.all('/trigger', async (req, res) => {
  const auth = req.headers['authorization'];
  const notifySecret = process.env.NOTIFY_SECRET;
  const cronSecret = process.env.CRON_SECRET;
  const anySecretSet = notifySecret || cronSecret;
  if (anySecretSet) {
    const matches =
      (notifySecret && auth === `Bearer ${notifySecret}`) ||
      (cronSecret && auth === `Bearer ${cronSecret}`);
    if (!matches) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  try {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM

    // Find schedule slots whose notification_time is within the next 5 minutes
    const slotsResult = await pool.query(
      `SELECT ss.practice_id, ss.date, ss.slot, ss.notification_time
       FROM schedule_slots ss
       WHERE ss.date = $1
       AND ss.notification_time::time BETWEEN $2::time AND ($2::time + INTERVAL '5 minutes')`,
      [todayStr, currentTime]
    );

    if (slotsResult.rows.length === 0) {
      return res.json({ sent: 0, message: 'No slots firing now' });
    }

    let sent = 0;
    let skipped = 0;

    for (const slot of slotsResult.rows) {
      // Get all active patients in this practice with push tokens
      const patientsResult = await pool.query(
        `SELECT p.id, p.name, p.push_token, p.push_token_env, pr.name as practice_name
         FROM patients p
         JOIN practices pr ON p.practice_id = pr.id
         WHERE p.practice_id = $1
         AND p.status = 'active'
         AND p.push_token IS NOT NULL`,
        [slot.practice_id]
      );

      for (const patient of patientsResult.rows) {
        // Ensure a daily_prompt record exists for this patient/slot
        await pool.query(
          `INSERT INTO daily_prompts (patient_id, date, slot)
           VALUES ($1, $2, $3)
           ON CONFLICT (patient_id, date, slot) DO NOTHING`,
          [patient.id, todayStr, slot.slot]
        );

        const slotLabel = slot.slot === 1 ? 'morning' : slot.slot === 2 ? 'afternoon' : 'evening';
        const result = await sendAPNS(
          patient.push_token,
          'Time to snap your Bandz 📸',
          `You have 30 minutes to capture your ${slotLabel} Bandz snap for ${patient.practice_name}`,
          patient.push_token_env
        );

        if ('sent' in result) sent++;
        else skipped++;
      }
    }

    res.json({ sent, skipped });
  } catch (error) {
    console.error('Notify trigger error:', error);
    res.status(500).json({ error: 'Failed to send notifications' });
  }
});

// GET /api/notify/schedule?patientId=X&date=YYYY-MM-DD
// Returns today's notification times for a patient (so iOS can show upcoming windows)
router.get('/schedule', async (req, res) => {
  try {
    const { patientId, date } = req.query;
    if (!patientId || !date) {
      return res.status(400).json({ error: 'patientId and date are required' });
    }

    const patientResult = await pool.query(
      'SELECT practice_id FROM patients WHERE id = $1',
      [patientId]
    );

    if (patientResult.rows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const practiceId = patientResult.rows[0].practice_id;

    const schedResult = await pool.query(
      `SELECT slot, notification_time
       FROM schedule_slots
       WHERE practice_id = $1 AND date = $2
       ORDER BY slot`,
      [practiceId, date]
    );

    res.json(schedResult.rows.map(r => ({
      slot: r.slot,
      notificationTime: r.notification_time,
      label: r.slot === 1 ? 'Morning' : r.slot === 2 ? 'Afternoon' : 'Evening',
    })));
  } catch (error) {
    console.error('Schedule error:', error);
    res.status(500).json({ error: 'Failed to fetch schedule' });
  }
});

export default router;
