import React, {useCallback, useState} from 'react';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

type Status = 'idle' | 'copied' | 'error';

/**
 * Toolbar shown at the top of every doc page. Lets a reader take the exact
 * Markdown source of the page they're on — either copied to the clipboard
 * ("Copy page") or saved as a `.md` file ("Download .md") — so code-heavy
 * integration steps can be pasted straight into a project or an AI assistant.
 *
 * The raw source is served by the `docs-raw-markdown` plugin at `/md/<path>`,
 * mirroring the file's location under `docs/`.
 */
export default function DocMarkdownActions(): React.JSX.Element | null {
  const {metadata} = useDoc();
  const [status, setStatus] = useState<Status>('idle');

  // metadata.source looks like "@site/docs/platform/.../widget.md"
  const relPath = metadata.source.replace(/^@site\/docs\//, '');
  const rawUrl = useBaseUrl(`/md/${relPath}`);
  const filename = relPath.split('/').pop() || 'page.md';

  const flash = useCallback((next: Status) => {
    setStatus(next);
    window.setTimeout(() => setStatus('idle'), next === 'error' ? 2600 : 1800);
  }, []);

  const fetchSource = useCallback(async (): Promise<string> => {
    const res = await fetch(rawUrl);
    // A missing file falls through to the SPA and returns HTML, not Markdown —
    // guard against that so we never hand back a page of <!doctype html>.
    const type = res.headers.get('content-type') || '';
    if (!res.ok || type.includes('text/html')) {
      throw new Error(`Unable to load Markdown source (${res.status})`);
    }
    return res.text();
  }, [rawUrl]);

  const onCopy = useCallback(async () => {
    try {
      const text = await fetchSource();
      await navigator.clipboard.writeText(text);
      flash('copied');
    } catch {
      flash('error');
    }
  }, [fetchSource, flash]);

  const onDownload = useCallback(async () => {
    try {
      const text = await fetchSource();
      const blob = new Blob([text], {type: 'text/markdown;charset=utf-8'});
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      flash('error');
    }
  }, [fetchSource, filename, flash]);

  return (
    <div className={styles.actions} role="group" aria-label="Page source actions">
      <button
        type="button"
        className={styles.button}
        onClick={onCopy}
        aria-label="Copy this page as Markdown"
      >
        {status === 'copied' ? <CheckIcon /> : <CopyIcon />}
        <span>{status === 'copied' ? 'Copied' : 'Copy page'}</span>
      </button>
      <button
        type="button"
        className={styles.button}
        onClick={onDownload}
        aria-label="Download this page as a Markdown file"
      >
        <DownloadIcon />
        <span>Download .md</span>
      </button>
      {status === 'error' && (
        <span className={styles.error} role="status">
          Couldn’t load source
        </span>
      )}
    </div>
  );
}

function CopyIcon(): React.JSX.Element {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M5 15V5a2 2 0 0 1 2-2h8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DownloadIcon(): React.JSX.Element {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3v11m0 0 4-4m-4 4-4-4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon(): React.JSX.Element {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="m5 13 4 4L19 7"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
