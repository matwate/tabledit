/* @refresh reload */
import './index.css';
import { render } from 'solid-js/web';
import { ErrorBoundary } from 'solid-js';

import App from './App';

// ponytail: devtools are dev-only; importing them in production bloats the
// build and can emit confusing warnings / break headless deploys.
if (import.meta.env.DEV) {
  await import('solid-devtools');
}

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

render(
  () => (
    <ErrorBoundary
      fallback={(err) => (
        <div style={{ padding: '2rem', color: 'white', background: '#111' }}>
          <h1>Something went wrong</h1>
          <pre>{err instanceof Error ? err.message : String(err)}</pre>
        </div>
      )}
    >
      <App />
    </ErrorBoundary>
  ),
  root,
);
