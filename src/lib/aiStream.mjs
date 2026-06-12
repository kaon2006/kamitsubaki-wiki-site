export function parseAiStreamChunk(chunk, previousRemainder = '') {
  const input = `${previousRemainder}${chunk}`.replace(/\r\n?/g, '\n');
  const frames = input.split('\n\n');
  const remainder = frames.pop() ?? '';
  const events = [];

  for (const frame of frames) {
    const lines = frame.split('\n');
    let type;
    const dataLines = [];

    for (const line of lines) {
      const separatorIndex = line.indexOf(':');

      if (separatorIndex === -1) {
        continue;
      }

      const field = line.slice(0, separatorIndex);
      let value = line.slice(separatorIndex + 1);

      if (value.startsWith(' ')) {
        value = value.slice(1);
      }

      if (field === 'event') {
        type = value.trim();
      } else if (field === 'data') {
        dataLines.push(value);
      }
    }

    if (!type || dataLines.length === 0) {
      continue;
    }

    const rawData = dataLines.join('\n');

    try {
      events.push({ type, data: JSON.parse(rawData) });
    } catch {
      events.push({ type: 'error', data: { code: 'invalid_stream_event' } });
    }
  }

  return { events, remainder };
}
