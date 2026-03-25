import React from 'react';
import { createRoot } from 'react-dom/client';
import { Widget } from './widget';

interface WidgetConfig {
  tenantId: string;
  apiUrl?: string;
  containerId?: string;
}

export function initWidget(config: WidgetConfig) {
  const containerId = config.containerId ?? 'saas-widget';
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Widget container #${containerId} not found`);
    return;
  }

  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <Widget tenantId={config.tenantId} apiUrl={config.apiUrl ?? 'http://localhost:3000'} />
    </React.StrictMode>,
  );
}

const devContainer = document.getElementById('root');
if (devContainer && import.meta.env.DEV) {
  const root = createRoot(devContainer);
  root.render(
    <React.StrictMode>
      <Widget tenantId="demo" apiUrl="http://localhost:3000" />
    </React.StrictMode>,
  );
}
