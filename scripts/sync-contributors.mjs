import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

const apiBase = process.env.CONTRIBUTORS_API_BASE || process.env.PUBLIC_AI_OBSERVER_API_BASE;
const syncToken = process.env.CONTRIBUTOR_SYNC_TOKEN;
const commitBaseUrl = process.env.CONTRIBUTORS_COMMIT_BASE_URL || 'https://github.com/linkth1rsty/kamitsubaki-wiki-site/commit';
const contentRoots = [
  'src/content/artists',
  'src/content/projects',
  'src/content/logs',
  'src/content/contribute',
  'src/content/site',
];
const localePattern = /^(zh|ja|en)$/;

function sha256(value) {
  return createHash('sha256').update(String(value)).digest('hex');
}

function runGit(args) {
  return execFileSync('git', args, { encoding: 'utf8' });
}

function parseGithubLogin(email) {
  const normalized = String(email || '').trim().toLowerCase();
  const numbered = normalized.match(/^\d+\+([^@]+)@users\.noreply\.github\.com$/);
  if (numbered) {
    return numbered[1];
  }
  const plain = normalized.match(/^([^@]+)@users\.noreply\.github\.com$/);
  return plain ? plain[1] : '';
}

function contributorFromAuthor(name, email) {
  const displayName = String(name || 'Contributor').trim();
  const githubLogin = parseGithubLogin(email);
  if (githubLogin) {
    return {
      contributor: {
        id: `github:${githubLogin}`,
        displayName: displayName || githubLogin,
        githubLogin,
        avatarUrl: `https://github.com/${githubLogin}.png?size=96`,
        profileUrl: `https://github.com/${githubLogin}`,
        isBot: /\[bot\]$/.test(githubLogin),
      },
      identity: {
        provider: 'github',
        providerKey: githubLogin,
      },
    };
  }

  const emailHash = email ? sha256(String(email).trim().toLowerCase()) : sha256(displayName);
  return {
    contributor: {
      id: `git:${emailHash.slice(0, 16)}`,
      displayName,
      isBot: /\[bot\]$/i.test(displayName),
    },
    identity: {
      provider: 'git_email',
      providerKey: emailHash,
      emailHash,
    },
  };
}

function parseContentPath(path) {
  const parts = path.split('/');
  if (parts[0] !== 'src' || parts[1] !== 'content') {
    return null;
  }

  if (parts[2] === 'site') {
    const filename = parts[3] || '';
    const locale = filename.replace(/\.(json|md)$/, '');
    if (!localePattern.test(locale)) {
      return null;
    }
    return { collection: 'site', entryId: 'home', locale };
  }

  const collection = parts[2];
  if (!['artists', 'projects', 'logs', 'contribute'].includes(collection)) {
    return null;
  }

  const filename = parts.at(-1) || '';
  const match = filename.match(/^([a-z]{2})\.mdx?$/);
  if (!match || !localePattern.test(match[1])) {
    return null;
  }

  const entryId = parts.slice(3, -1).join('/');
  if (!entryId) {
    return null;
  }
  return { collection, entryId, locale: match[1] };
}

function collectEvents() {
  const output = runGit([
    'log',
    '--name-only',
    '--format=%x1e%H%x1f%an%x1f%ae%x1f%aI%x1f%s',
    '--',
    ...contentRoots,
  ]);
  const chunks = output.split('\x1e').filter(Boolean);
  const events = [];

  for (const chunk of chunks) {
    const lines = chunk.trim().split(/\r?\n/).filter(Boolean);
    const [commitSha, authorName, authorEmail, committedAt, summary] = (lines.shift() || '').split('\x1f');
    if (!commitSha || !committedAt) {
      continue;
    }

    const author = contributorFromAuthor(authorName, authorEmail);
    for (const path of lines) {
      const parsed = parseContentPath(path);
      if (!parsed) {
        continue;
      }

      events.push({
        ...parsed,
        path,
        commitSha,
        commitUrl: `${commitBaseUrl}/${commitSha}`,
        summary,
        committedAt,
        ...author,
      });
    }
  }

  return events;
}

async function main() {
  if (!apiBase) {
    throw new Error('Set CONTRIBUTORS_API_BASE or PUBLIC_AI_OBSERVER_API_BASE before syncing contributors.');
  }
  if (!syncToken) {
    throw new Error('Set CONTRIBUTOR_SYNC_TOKEN before syncing contributors.');
  }

  const events = collectEvents();
  const response = await fetch(new URL('/api/admin/contributors/sync', apiBase), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${syncToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      source: 'git-history',
      events,
    }),
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`Contributor sync failed with ${response.status}: ${JSON.stringify(body)}`);
  }

  console.log(`Synced ${body.accepted ?? events.length} contribution events from ${body.contributors ?? 0} contributors.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
