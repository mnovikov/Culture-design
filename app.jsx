// app.jsx — main router & state container for the shipment management prototype

const { useState, useEffect, useMemo, useCallback } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "brandGreen": "#17a563",
  "brandNavy": "#0f2944",
  "density": "regular",
  "dashboardLayout": "tasks",
  "statusPalette": "default",
  "darkSidebar": true
}/*EDITMODE-END*/;

const STATUS_PALETTES = {
  default: {
    '--st-planned':    '#6b7280', '--st-planned-bg':    '#f1f3f6',
    '--st-approval':   '#d97706', '--st-approval-bg':   '#fef3c7',
    '--st-preparing':  '#2563eb', '--st-preparing-bg':  '#dbeafe',
    '--st-docs':       '#7c3aed', '--st-docs-bg':       '#ede9fe',
    '--st-delivery':   '#ea580c', '--st-delivery-bg':   '#ffedd5',
    '--st-completed':  '#16a34a', '--st-completed-bg':  '#dcfce7',
    '--st-delayed':    '#dc2626', '--st-delayed-bg':    '#fee2e2',
    '--st-cancelled':  '#991b1b', '--st-cancelled-bg':  '#fecaca',
  },
  soft: {
    '--st-planned':    '#64748b', '--st-planned-bg':    '#f1f5f9',
    '--st-approval':   '#b45309', '--st-approval-bg':   '#fef3c7',
    '--st-preparing':  '#0369a1', '--st-preparing-bg':  '#e0f2fe',
    '--st-docs':       '#6d28d9', '--st-docs-bg':       '#f3e8ff',
    '--st-delivery':   '#c2410c', '--st-delivery-bg':   '#fed7aa',
    '--st-completed':  '#15803d', '--st-completed-bg':  '#d1fae5',
    '--st-delayed':    '#b91c1c', '--st-delayed-bg':    '#fee2e2',
    '--st-cancelled':  '#7f1d1d', '--st-cancelled-bg':  '#fecaca',
  },
  bold: {
    '--st-planned':    '#475569', '--st-planned-bg':    '#e2e8f0',
    '--st-approval':   '#ea580c', '--st-approval-bg':   '#ffedd5',
    '--st-preparing':  '#1d4ed8', '--st-preparing-bg':  '#dbeafe',
    '--st-docs':       '#7e22ce', '--st-docs-bg':       '#ede9fe',
    '--st-delivery':   '#db2777', '--st-delivery-bg':   '#fce7f3',
    '--st-completed':  '#15803d', '--st-completed-bg':  '#bbf7d0',
    '--st-delayed':    '#dc2626', '--st-delayed-bg':    '#fee2e2',
    '--st-cancelled':  '#991b1b', '--st-cancelled-bg':  '#fecaca',
  },
};

function App() {
  // Hash routing
  const [route, setRoute] = useState(() => window.location.hash.replace(/^#/, '') || '/login');
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash.replace(/^#/, '') || '/login');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  const goto = (path) => { window.location.hash = path; };

  // Auth: current user persisted in localStorage
  const [currentUser, setCurrentUserState] = useState(() => {
    try {
      const saved = localStorage.getItem('kultura_currentUserId');
      if (saved) return window.SHIPMENT_DATA.ALL_USERS.find(u => u.id === saved) || null;
    } catch (e) {}
    return null;
  });
  // Keep window.SHIPMENT_DATA.CURRENT_USER in sync (audit entries read it)
  useEffect(() => {
    window.SHIPMENT_DATA.setCurrentUser(currentUser || window.SHIPMENT_DATA.MANAGERS[0]);
  }, [currentUser]);

  const handleLogin = useCallback((user) => {
    setCurrentUserState(user);
    try { localStorage.setItem('kultura_currentUserId', user.id); } catch (e) {}
    goto(user.role === 'director' ? '/director' : '/dashboard');
  }, []);
  const handleLogout = useCallback(() => {
    setCurrentUserState(null);
    try { localStorage.removeItem('kultura_currentUserId'); } catch (e) {}
    goto('/login');
  }, []);

  // Route guard
  useEffect(() => {
    if (!currentUser && route !== '/login' && route !== '/') {
      goto('/login');
    }
  }, [route, currentUser]);

  // Tweaks
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply tweaks to CSS vars
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--brand-green', t.brandGreen);
    root.style.setProperty('--brand-navy', t.brandNavy);
    // derive supplemental shades using simple math
    root.style.setProperty('--brand-green-600', shade(t.brandGreen, -8));
    root.style.setProperty('--brand-green-700', shade(t.brandGreen, -18));
    root.style.setProperty('--brand-green-50', tint(t.brandGreen, 0.92));
    root.style.setProperty('--brand-green-100', tint(t.brandGreen, 0.82));
    root.style.setProperty('--brand-navy-700', shade(t.brandNavy, 6));
    root.style.setProperty('--brand-navy-600', shade(t.brandNavy, 14));
    root.setAttribute('data-density', t.density);
    const palette = STATUS_PALETTES[t.statusPalette] || STATUS_PALETTES.default;
    Object.entries(palette).forEach(([k, v]) => root.style.setProperty(k, v));
  }, [t]);

  // Shipments state (mutable, shared across all screens)
  const [shipments, setShipments] = useState(() => window.SHIPMENT_DATA.ALL_SHIPMENTS);

  // Toasts
  const [toasts, setToasts] = useState([]);
  const showToast = useCallback((text) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(ts => [...ts, { id, text }]);
    setTimeout(() => setToasts(ts => ts.filter(t => t.id !== id)), 2400);
  }, []);

  // Mutations
  const updateShipment = useCallback((id, patch) => {
    setShipments(ss => ss.map(s => {
      if (s.id !== id) return s;
      const merged = { ...s, ...patch };
      // Update next task / action when status changes
      if (patch.status) {
        const { NEXT_TASK_BY_STATUS, NEXT_ACTION_BY_STATUS } = window.SHIPMENT_DATA;
        merged.nextTask = NEXT_TASK_BY_STATUS[patch.status];
        merged.nextAction = NEXT_ACTION_BY_STATUS[patch.status];
      }
      return merged;
    }));
  }, []);

  const addAudit = useCallback((id, entry) => {
    setShipments(ss => ss.map(s => {
      if (s.id !== id) return s;
      const id2 = 'a' + Math.random().toString(36).slice(2, 8);
      const event = { id: id2, time: '2026-05-26T14:00', user: window.SHIPMENT_DATA.CURRENT_USER.name, ...entry };
      return { ...s, audit: [event, ...s.audit] };
    }));
  }, []);

  const advance = useCallback((id) => {
    setShipments(ss => ss.map(s => {
      if (s.id !== id) return s;
      const { STATUS_ORDER, STATUSES, NEXT_TASK_BY_STATUS, NEXT_ACTION_BY_STATUS } = window.SHIPMENT_DATA;
      const idx = STATUS_ORDER.indexOf(s.status);
      if (idx >= STATUS_ORDER.length - 1) return s;
      const newStatus = STATUS_ORDER[idx + 1];
      const id2 = 'a' + Math.random().toString(36).slice(2, 8);
      return {
        ...s,
        status: newStatus,
        nextTask: NEXT_TASK_BY_STATUS[newStatus],
        nextAction: NEXT_ACTION_BY_STATUS[newStatus],
        audit: [{
          id: id2, time: '2026-05-26T14:00',
          user: window.SHIPMENT_DATA.CURRENT_USER.name,
          action: 'Статус изменён',
          detail: `${STATUSES[s.status].label} → ${STATUSES[newStatus].label}`,
          kind: 'status',
        }, ...s.audit],
      };
    }));
  }, []);

  const retreat = useCallback((id) => {
    setShipments(ss => ss.map(s => {
      if (s.id !== id) return s;
      const { STATUS_ORDER, STATUSES, NEXT_TASK_BY_STATUS, NEXT_ACTION_BY_STATUS } = window.SHIPMENT_DATA;
      const idx = STATUS_ORDER.indexOf(s.status);
      if (idx <= 0) return s;
      const newStatus = STATUS_ORDER[idx - 1];
      const id2 = 'a' + Math.random().toString(36).slice(2, 8);
      return {
        ...s,
        status: newStatus,
        nextTask: NEXT_TASK_BY_STATUS[newStatus],
        nextAction: NEXT_ACTION_BY_STATUS[newStatus],
        audit: [{
          id: id2, time: '2026-05-26T14:00',
          user: window.SHIPMENT_DATA.CURRENT_USER.name,
          action: 'Возврат на предыдущий этап',
          detail: `${STATUSES[s.status].label} → ${STATUSES[newStatus].label}`,
          kind: 'status',
        }, ...s.audit],
      };
    }));
  }, []);

  const markDelayed = useCallback((id, reason) => {
    setShipments(ss => ss.map(s => {
      if (s.id !== id) return s;
      const id2 = 'a' + Math.random().toString(36).slice(2, 8);
      return {
        ...s, delayed: true, delayReason: reason,
        audit: [{ id: id2, time: '2026-05-26T14:00', user: window.SHIPMENT_DATA.CURRENT_USER.name, action: 'Отгрузка помечена как задержанная', detail: 'Причина: ' + reason, kind: 'delay' }, ...s.audit],
      };
    }));
  }, []);

  const removeDelay = useCallback((id) => {
    setShipments(ss => ss.map(s => {
      if (s.id !== id) return s;
      const id2 = 'a' + Math.random().toString(36).slice(2, 8);
      return {
        ...s, delayed: false, delayReason: null,
        audit: [{ id: id2, time: '2026-05-26T14:00', user: window.SHIPMENT_DATA.CURRENT_USER.name, action: 'Метка задержки снята', detail: '', kind: 'status' }, ...s.audit],
      };
    }));
  }, []);

  // Scope: filter shipments + customers to current user (director sees everything)
  const isDirector = currentUser?.role === 'director';
  const scopedShipments = useMemo(() => {
    if (!currentUser || isDirector) return shipments;
    return shipments.filter(s => s.managerId === currentUser.id);
  }, [shipments, currentUser, isDirector]);
  const scopedCustomers = useMemo(() => {
    if (!currentUser || isDirector) return window.SHIPMENT_DATA.CUSTOMERS;
    return window.SHIPMENT_DATA.CUSTOMERS.filter(c => c.accountManagerId === currentUser.id);
  }, [currentUser, isDirector]);

  // Summary counts for sidebar
  const summary = useMemo(() => ({
    inWork: scopedShipments.filter(s => !['completed','cancelled'].includes(s.status)).length,
  }), [scopedShipments]);

  // ─── Route render ───
  const renderRoute = () => {
    // Login
    if (route === '/login' || route === '/' || !currentUser) {
      return <LoginScreen onLogin={handleLogin}/>;
    }

    // Director
    if (route.startsWith('/director') || (isDirector && route === '/dashboard')) {
      return <DirectorPlaceholder goto={goto} onLogout={handleLogout} currentUser={currentUser}/>;
    }

    // Shipment details
    if (route.startsWith('/shipment/')) {
      const id = route.replace('/shipment/', '').split('?')[0];
      const shipment = scopedShipments.find(s => s.id === id);
      return (
        <div className="app-shell">
          <Sidebar route="/shipments" goto={goto} currentUser={currentUser} onLogout={handleLogout} summary={summary}/>
          <div className="main">
            <ShipmentDetails
              shipment={shipment}
              goto={goto}
              updateShipment={updateShipment}
              advance={advance}
              retreat={retreat}
              markDelayed={markDelayed}
              removeDelay={removeDelay}
              addAudit={addAudit}
              showToast={showToast}
              layout={t.dashboardLayout}
            />
          </div>
        </div>
      );
    }

    // Sales manager screens with sidebar
    let inner;
    let path = route.split('?')[0];
    let queryFilter = null;
    if (route.includes('?filter=')) queryFilter = route.split('?filter=')[1];

    if (path === '/dashboard')       inner = <Dashboard shipments={scopedShipments} goto={goto} advance={advance} markDelayed={markDelayed} layout={t.dashboardLayout} currentUser={currentUser} scopedCustomers={scopedCustomers}/>;
    else if (path === '/shipments')  inner = <ShipmentList shipments={scopedShipments} goto={goto} initialFilter={queryFilter} currentUser={currentUser}/>;
    else if (path === '/rotation')   inner = <RotationCheck goto={goto} showToast={showToast} scopedCustomers={scopedCustomers}/>;
    else if (path === '/history')    inner = <HistoryPage shipments={scopedShipments} goto={goto}/>;
    else if (path === '/flow')       inner = <StatusFlowPage/>;
    else if (path === '/help')       inner = <HelpPage/>;
    else                             inner = <Dashboard shipments={scopedShipments} goto={goto} advance={advance} markDelayed={markDelayed} layout={t.dashboardLayout} currentUser={currentUser} scopedCustomers={scopedCustomers}/>;

    return (
      <div className="app-shell">
        <Sidebar route={path} goto={goto} currentUser={currentUser} onLogout={handleLogout} summary={summary}/>
        <div className="main">{inner}</div>
      </div>
    );
  };

  // Set screen label
  useEffect(() => {
    const screenLabels = {
      '/login': '01 Login', '/dashboard': '02 Dashboard', '/shipments': '03 Shipments',
      '/rotation': '04 Rotation', '/history': '05 History', '/flow': '06 Status Flow', '/help': '07 Help',
      '/director': '08 Director',
    };
    const path = route.split('?')[0];
    const lbl = screenLabels[path] || (path.startsWith('/shipment/') ? '08 Shipment Details' : 'Unknown');
    document.body.setAttribute('data-screen-label', lbl);
  }, [route]);

  return (
    <>
      {renderRoute()}
      <ToastHost toasts={toasts}/>

      <TweaksPanel>
        <TweakSection label="Внешний вид"/>
        <TweakColor label="Основной цвет"
          value={t.brandGreen}
          options={['#17a563', '#0d9488', '#0891b2', '#16a34a', '#22c55e']}
          onChange={v => setTweak('brandGreen', v)}/>
        <TweakColor label="Цвет навигации"
          value={t.brandNavy}
          options={['#0f2944', '#1e293b', '#111827', '#1a365d', '#312e81']}
          onChange={v => setTweak('brandNavy', v)}/>
        <TweakRadio label="Палитра статусов"
          value={t.statusPalette}
          options={['default', 'soft', 'bold']}
          onChange={v => setTweak('statusPalette', v)}/>

        <TweakSection label="Плотность"/>
        <TweakRadio label="Высота строк"
          value={t.density}
          options={['compact', 'regular', 'comfy']}
          onChange={v => setTweak('density', v)}/>

        <TweakSection label="Раскладка дашборда"/>
        <TweakRadio label="Главный блок"
          value={t.dashboardLayout}
          options={['tasks', 'kanban']}
          onChange={v => setTweak('dashboardLayout', v)}/>
      </TweaksPanel>
    </>
  );
}

// ─── Color helpers ──────────────────────────────────────────────────────
function hexToRgb(hex) {
  const m = hex.replace('#','').match(/.{1,2}/g);
  return m ? m.map(x => parseInt(x, 16)) : [0,0,0];
}
function rgbToHex(r, g, b) {
  return '#' + [r,g,b].map(x => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2,'0')).join('');
}
function shade(hex, pct) {
  // negative = darker, positive = lighter
  const [r,g,b] = hexToRgb(hex);
  const f = pct / 100;
  return rgbToHex(r + (255 - r) * f, g + (255 - g) * f, b + (255 - b) * f);
}
function tint(hex, amount) {
  // amount 0..1, higher = lighter
  const [r,g,b] = hexToRgb(hex);
  return rgbToHex(r + (255 - r) * amount, g + (255 - g) * amount, b + (255 - b) * amount);
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
