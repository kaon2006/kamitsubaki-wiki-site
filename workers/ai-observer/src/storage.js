export async function upsertAnonymousSession(db, session) {
  if (!db) {
    return;
  }

  await db
    .prepare(
      `INSERT INTO anonymous_sessions (
        id,
        session_token_hash,
        ip_hash,
        ua_hash,
        country,
        region,
        region_code,
        last_seen_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(id) DO UPDATE SET
        ip_hash = excluded.ip_hash,
        ua_hash = excluded.ua_hash,
        country = excluded.country,
        region = excluded.region,
        region_code = excluded.region_code,
        last_seen_at = CURRENT_TIMESTAMP`,
    )
    .bind(
      session.id,
      session.sessionTokenHash,
      session.ipHash,
      session.uaHash,
      session.country,
      session.region,
      session.regionCode,
    )
    .run();
}

export async function recordUsageEvent(db, event) {
  if (!db) {
    return;
  }

  await db
    .prepare(
      `INSERT INTO usage_events (
        id,
        anonymous_session_id,
        ip_hash,
        event_type,
        model_provider,
        model_name
      ) VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      event.id,
      event.anonymousSessionId,
      event.ipHash,
      event.eventType,
      event.modelProvider ?? null,
      event.modelName ?? null,
    )
    .run();
}
