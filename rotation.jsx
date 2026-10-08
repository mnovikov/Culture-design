// rotation.jsx — Rotation Check screen (Ротация культур)
// Customer → end-product (application) → cultures used in last 6 orders

function RotationCheck({ goto, showToast, scopedCustomers }) {
  const customers = scopedCustomers || window.SHIPMENT_DATA.CUSTOMERS;
  const [customerId, setCustomerId] = React.useState(null);
  const [appId, setAppId] = React.useState(null);

  // Danger mode — read from URL query string
  const isDangerMode = React.useMemo(() => {
    const hash = window.location.hash || '';
    return hash.includes('danger=1') && !customerId;
  }, [customerId]);

  const customer = customerId ? customers.find(c => c.id === customerId) : null;
  React.useEffect(() => { setAppId(null); }, [customerId]);

  // Открываем пару клиент+продукт напрямую из списка опасных
  const openCombo = (cid, aid) => {
    window.location.hash = '/rotation';
    setCustomerId(cid);
    setAppId(aid);
  };

  return (
    <>
      <Topbar crumbs={['Ротация культур']}/>
      <div className="content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Проверка ротации культур</h1>
            <p className="page-sub">Выберите клиента и продукт — увидите, какие закваски использовались в последних 6 поставках</p>
          </div>
        </div>

        {/* Step indicator */}
        {!isDangerMode && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18, fontSize: 13 }}>
            <StepDot n={1} active={!customerId} done={!!customerId} label="Клиент"/>
            <StepConnector done={!!customerId}/>
            <StepDot n={2} active={!!customerId && !appId} done={!!appId} label="Продукт" muted={!customerId}/>
            <StepConnector done={!!appId}/>
            <StepDot n={3} active={!!appId} label="История и проверка" muted={!appId}/>
          </div>
        )}

        {isDangerMode ? (
          <DangerList customers={customers} onOpen={openCombo} onAllCustomers={() => { window.location.hash = '/rotation'; }}/>
        ) : !customerId ? (
          <CustomerPicker customers={customers} onPick={setCustomerId}/>
        ) : !appId ? (
          <ApplicationPicker customer={customer} onPick={setAppId} onBack={() => setCustomerId(null)}/>
        ) : (
          <RotationResult
            customer={customer}
            appId={appId}
            onResetCustomer={() => { setCustomerId(null); setAppId(null); }}
            onResetApp={() => setAppId(null)}
            showToast={showToast}
          />
        )}
      </div>
    </>
  );
}

// ─── Step indicator ─────────────────────────────────────────────────────
function StepDot({ n, active, done, label, muted }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: muted ? 0.5 : 1 }}>
      <span style={{
        width: 22, height: 22, borderRadius: '50%',
        background: done ? 'var(--brand-green)' : (active ? 'var(--brand-navy)' : 'var(--ink-200)'),
        color: done || active ? 'white' : 'var(--ink-500)',
        display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 600,
        boxShadow: active ? '0 0 0 4px var(--brand-green-50)' : 'none',
      }}>{done ? <Icons.Check w={11} h={11}/> : n}</span>
      <span style={{ fontWeight: active || done ? 600 : 500, color: active || done ? 'var(--ink-900)' : 'var(--ink-500)' }}>{label}</span>
    </div>
  );
}
function StepConnector({ done }) {
  return <span style={{ width: 36, height: 2, background: done ? 'var(--brand-green)' : 'var(--ink-200)', borderRadius: 2 }}></span>;
}

// ─── Customer picker ────────────────────────────────────────────────────
function CustomerPicker({ customers, onPick }) {
  const { CUSTOMER_APP_HISTORY } = window.SHIPMENT_DATA;
  const [search, setSearch] = React.useState('');

  const filtered = customers.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.short.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Шаг 1 · Выберите клиента</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="muted" style={{ fontSize: 12 }}>{customers.length} {customers.length === 1 ? 'клиент' : 'клиентов'} в портфеле</span>
          <div className="search" style={{ width: 240, flex: 'none' }}>
            <Icons.Search className="ic" w={14} h={14}/>
            <input placeholder="Поиск..." value={search} onChange={e => setSearch(e.target.value)}/>
          </div>
        </div>
      </div>
      <div className="card-body">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {filtered.map(c => {
            const hist = CUSTOMER_APP_HISTORY[c.id] || {};
            const appCount = Object.keys(hist).length;
            const totalOrders = Object.values(hist).reduce((s, arr) => s + arr.length, 0);
            return (
              <button key={c.id} className="role-card" style={{ padding: 16 }} onClick={() => onPick(c.id)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 9,
                    background: 'var(--brand-green-50)', color: 'var(--brand-green-700)',
                    display: 'grid', placeItems: 'center', fontWeight: 600, fontSize: 13,
                  }}>{c.short.slice(0, 2).toUpperCase()}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--ink-900)' }}>{c.short}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-500)' }}>{c.city}</div>
                  </div>
                  <span className={`badge ${c.tag === 'Постоянный' ? 'b-completed' : 'b-preparing'}`}>{c.tag}</span>
                </div>
                <div style={{ display: 'flex', gap: 14, fontSize: 12, color: 'var(--ink-500)', borderTop: '1px solid var(--ink-150)', paddingTop: 10, marginTop: 4 }}>
                  <span>{appCount} {appCount === 1 ? 'продукт' : 'продуктов'}</span>
                  <span>·</span>
                  <span>{totalOrders} отгрузок</span>
                </div>
              </button>
            );
          })}
        </div>
        {filtered.length === 0 && <div className="empty">Клиент не найден</div>}
      </div>
    </div>
  );
}

// ─── Application picker ────────────────────────────────────────────────
function ApplicationPicker({ customer, onPick, onBack }) {
  const { APPLICATIONS, CUSTOMER_APP_HISTORY } = window.SHIPMENT_DATA;
  const customerHist = CUSTOMER_APP_HISTORY[customer.id] || {};
  const customerApps = Object.keys(customerHist);

  // Group: apps the customer makes (with rotation badge), then other available apps
  const own = APPLICATIONS.filter(a => customerApps.includes(a.id));
  const other = APPLICATIONS.filter(a => !customerApps.includes(a.id));

  // Quick rotation analysis for each owned application (for the badge)
  const quickVerdict = (orders) => {
    const last6 = orders.slice(0, 6);
    const counts = {};
    last6.forEach(o => { counts[o.productId] = (counts[o.productId] || 0) + 1; });
    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    if (entries.length < 2) return 'red';
    if (entries.length === 2 && entries[0][1] >= 5) return 'yellow';
    return 'green';
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <button className="btn ghost sm" onClick={onBack}><Icons.ArrowLeft w={13} h={13}/> Сменить клиента</button>
        <div style={{ fontSize: 13, color: 'var(--ink-600)' }}>
          Клиент: <b style={{ color: 'var(--ink-900)' }}>{customer.short}</b> · {customer.city}
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header">
          <h3 className="card-title">Шаг 2 · Какой продукт проверяем?</h3>
          <span className="muted" style={{ fontSize: 12 }}>{own.length} {own.length === 1 ? 'продукт' : 'продуктов'} в производстве у клиента</span>
        </div>
        <div className="card-body flush">
          {own.map(a => {
            const orders = customerHist[a.id] || [];
            const level = quickVerdict(orders);
            const badge = level === 'red'    ? { cls: 'b-delayed',   txt: 'Ротация: опасно' }
                        : level === 'yellow' ? { cls: 'b-approval',  txt: 'Ротация: внимание' }
                                              : { cls: 'b-completed', txt: 'Ротация: в норме' };
            return (
              <div key={a.id} className="row-line" style={{ cursor: 'pointer', padding: '14px 18px' }} onClick={() => onPick(a.id)}>
                <div style={{ fontSize: 24, width: 40, textAlign: 'center' }}>{a.icon}</div>
                <div style={{ flex: 1 }}>
                  <div className="row-strong" style={{ fontSize: 14 }}>{a.name}</div>
                  <div className="row-meta">{a.description} · {orders.length} {orders.length === 1 ? 'отгрузка' : 'отгрузок'}</div>
                </div>
                <span className={`badge ${badge.cls}`}>{badge.txt}</span>
                <Icons.ChevronRight w={16} h={16} className="muted" style={{ marginLeft: 8 }}/>
              </div>
            );
          })}
          {own.length === 0 && (
            <div className="empty">У клиента нет истории отгрузок</div>
          )}
        </div>
      </div>

      {other.length > 0 && (
        <details>
          <summary style={{ fontSize: 12.5, color: 'var(--ink-500)', cursor: 'pointer', padding: '6px 4px', userSelect: 'none' }}>
            Другие продукты, которые клиент пока не заказывал ({other.length})
          </summary>
          <div className="card" style={{ marginTop: 8 }}>
            <div className="card-body flush">
              {other.map(a => (
                <div key={a.id} className="row-line" style={{ padding: '12px 18px', opacity: 0.6 }}>
                  <div style={{ fontSize: 22, width: 40, textAlign: 'center' }}>{a.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div className="row-strong" style={{ fontSize: 13.5 }}>{a.name}</div>
                    <div className="row-meta">{a.description}</div>
                  </div>
                  <span className="badge b-neutral">Нет истории</span>
                </div>
              ))}
            </div>
          </div>
        </details>
      )}
    </>
  );
}

// ─── Rotation analysis ──────────────────────────────────────────────────
function analyzeRotation(orders) {
  const last6 = orders.slice(0, 6);
  const counts = {};
  last6.forEach(o => { counts[o.productId] = (counts[o.productId] || 0) + 1; });
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const distinctCount = entries.length;

  let verdict;
  if (distinctCount < 2) {
    verdict = { level: 'red', title: 'Опасная ситуация: ротация отсутствует', message: 'За последние 6 отгрузок использовалась только одна культура. Рекомендуется обсудить с клиентом введение чередования заквасок для снижения риска бактериофагов и стабильности качества.' };
  } else if (distinctCount === 2 && entries[0][1] >= 5) {
    verdict = { level: 'yellow', title: 'Внимание: ротация неравномерная', message: 'Используются 2 культуры, но одна доминирует (соотношение ' + entries[0][1] + ':' + entries[1][1] + '). Рекомендуется увеличить долю альтернативной культуры.' };
  } else {
    verdict = { level: 'green', title: 'Ротация в норме', message: 'За последние 6 отгрузок использовано ' + distinctCount + ' разных культур. Чередование сбалансированное.' };
  }

  return { last6, counts, entries, distinctCount, verdict };
}

// ─── Rotation result ────────────────────────────────────────────────────
function RotationResult({ customer, appId, onResetCustomer, onResetApp, showToast }) {
  const { APPLICATIONS, CUSTOMER_APP_HISTORY, PRODUCTS, MANAGERS, fmtDate } = window.SHIPMENT_DATA;
  const [taskCreated, setTaskCreated] = React.useState(false);

  const app = APPLICATIONS.find(a => a.id === appId);
  const orders = (CUSTOMER_APP_HISTORY[customer.id] || {})[appId] || [];
  const analysis = analyzeRotation(orders);
  const { last6, counts, entries, distinctCount, verdict } = analysis;

  const cultureColors = ['#16a34a', '#2563eb', '#ea580c', '#9333ea', '#0891b2'];
  const productToColor = {};
  entries.forEach(([pid], i) => { productToColor[pid] = cultureColors[i] || '#6b7280'; });

  const availableCultures = app.cultures.map(pid => PRODUCTS.find(p => p.id === pid));

  // Next recommended
  let nextRecommended;
  if (verdict.level === 'red') {
    nextRecommended = availableCultures.find(p => p.id !== entries[0][0]) || availableCultures[1];
  } else {
    const lastSeen = {};
    last6.forEach((o, i) => { if (lastSeen[o.productId] === undefined) lastSeen[o.productId] = i; });
    const sorted = Object.entries(lastSeen).sort((a, b) => b[1] - a[1]);
    nextRecommended = PRODUCTS.find(p => p.id === sorted[0][0]);
  }

  return (
    <>
      {/* Context header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
        <button className="btn ghost sm" onClick={onResetCustomer}><Icons.ArrowLeft w={13} h={13}/> Новый анализ</button>
        <div style={{ fontSize: 13, color: 'var(--ink-600)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <b style={{ color: 'var(--ink-900)' }}>{customer.short}</b>
          <Icons.ChevronRight w={12} h={12} className="muted"/>
          <span style={{ fontSize: 18 }}>{app.icon}</span>
          <b style={{ color: 'var(--ink-900)' }}>{app.name}</b>
        </div>
        <button className="btn ghost sm" style={{ marginLeft: 'auto' }} onClick={onResetApp}>
          <Icons.Refresh w={13} h={13}/> Сменить продукт
        </button>
      </div>

      {/* Verdict banner */}
      <VerdictBanner verdict={verdict} onCreateTask={() => {
        setTaskCreated(true);
        showToast('Задача на обсуждение с клиентом создана');
      }} taskCreated={taskCreated}/>

      {/* MAIN: history table is the hero */}
      <div className="card" style={{ marginTop: 18, marginBottom: 18 }}>
        <div className="card-header">
          <div>
            <h3 className="card-title">Последние 6 отгрузок · {app.name}</h3>
            <div style={{ fontSize: 12, color: 'var(--ink-500)', marginTop: 2 }}>
              {distinctCount} {distinctCount === 1 ? 'разная культура' : (distinctCount < 5 ? 'разных культуры' : 'разных культур')} · хронологически от новых к старым
            </div>
          </div>
        </div>
        <div className="card-body flush">
          <table className="tbl">
            <thead>
              <tr>
                <th>#</th>
                <th>Дата</th>
                <th>Культура</th>
                <th>Количество</th>
                <th>Партия</th>
                <th>Заметка</th>
              </tr>
            </thead>
            <tbody>
              {last6.map((o, i) => {
                return (
                  <tr key={o.orderId}>
                    <td className="muted">{i + 1}</td>
                    <td className="muted">{fmtDate(o.date)}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: productToColor[o.productId], flexShrink: 0 }}></span>
                        <div>
                          <div className="strong" style={{ fontSize: 13 }}>{o.productCode}</div>
                          <div style={{ fontSize: 11.5, color: 'var(--ink-500)' }}>{o.productName.replace(/^.+?["«](.+?)[»"].*$/, '$1').slice(0, 32)}</div>
                        </div>
                      </div>
                    </td>
                    <td>{o.qty.toLocaleString('ru-RU')} {o.unit}</td>
                    <td className="mono">{o.batch}</td>
                    <td className="muted" style={{ fontSize: 12 }}>{o.notes}</td>
                  </tr>
                );
              })}
              {last6.length === 0 && (
                <tr><td colSpan="6"><div className="empty">Нет истории отгрузок</div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two-column supplementary */}
      <div className="detail-grid">
        <div>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Распределение по культурам</h3>
            </div>
            <div className="card-body">
              {entries.map(([pid, count]) => {
                const p = PRODUCTS.find(pp => pp.id === pid);
                const pct = Math.round((count / last6.length) * 100);
                return (
                  <div key={pid} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0' }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: productToColor[pid], flexShrink: 0 }}></span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 550, color: 'var(--ink-900)' }}>{p.code}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--ink-500)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                    </div>
                    <div style={{ width: 120 }}>
                      <div style={{ height: 6, background: 'var(--ink-150)', borderRadius: 999, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: pct + '%', background: productToColor[pid] }}></div>
                      </div>
                    </div>
                    <div style={{ width: 70, textAlign: 'right', fontWeight: 600, fontSize: 13 }}>
                      {count}/6
                    </div>
                  </div>
                );
              })}
              {entries.length === 0 && <div className="empty">Нет данных</div>}
            </div>
          </div>
        </div>

        <div>
          {nextRecommended && (
            <div className="card" style={{ marginBottom: 16 }}>
              <div className="card-header"><h3 className="card-title">Рекомендуется следующей</h3></div>
              <div className="card-body">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--brand-green-50)', color: 'var(--brand-green-700)', display: 'grid', placeItems: 'center', fontWeight: 600, fontSize: 11 }}>
                    {nextRecommended.code.slice(0, 3)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink-900)' }}>{nextRecommended.code}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-500)' }}>{nextRecommended.name.length > 32 ? nextRecommended.name.slice(0, 32) + '…' : nextRecommended.name}</div>
                  </div>
                </div>
                <p style={{ fontSize: 12, color: 'var(--ink-600)', margin: 0, lineHeight: 1.55 }}>
                  {verdict.level === 'red'
                    ? 'Клиент использует только одну культуру. Предложите альтернативу.'
                    : 'Использовалась наименее недавно — хороший выбор по графику ротации.'}
                </p>
              </div>
            </div>
          )}

          <div className="card">
            <div className="card-header"><h3 className="card-title">Закваски для «{app.name}»</h3></div>
            <div className="card-body flush">
              {availableCultures.map(p => {
                const used = counts[p.id] > 0;
                const isRec = nextRecommended && p.id === nextRecommended.id;
                return (
                  <div key={p.id} className="row-line" style={{ padding: '10px 16px' }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: 5,
                      background: used ? productToColor[p.id] : 'var(--ink-100)',
                      color: used ? 'white' : 'var(--ink-400)',
                      display: 'grid', placeItems: 'center', flexShrink: 0,
                    }}>
                      {used ? <Icons.Check w={11} h={11}/> : <Icons.X w={11} h={11}/>}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 550, fontSize: 12.5, color: 'var(--ink-900)' }}>
                        {p.code}
                        {isRec && <span className="badge b-completed" style={{ marginLeft: 8, fontSize: 10 }}>Рекомендуется</span>}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--ink-500)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                    </div>
                    <div style={{ fontSize: 11.5, color: used ? 'var(--brand-green-700)' : 'var(--ink-400)', textAlign: 'right', fontWeight: used ? 600 : 400, flexShrink: 0 }}>
                      {used ? `${counts[p.id]}/6` : 'не использ.'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Verdict banner ─────────────────────────────────────────────────────
function VerdictBanner({ verdict, onCreateTask, taskCreated }) {
  const styles = {
    red:    { bg: 'var(--st-delayed-bg)',   bd: '#fecaca', fg: 'var(--st-delayed)',    ic: <Icons.AlertTri w={20} h={20}/> },
    yellow: { bg: 'var(--st-approval-bg)',  bd: '#fde68a', fg: 'var(--st-approval)',   ic: <Icons.AlertTri w={20} h={20}/> },
    green:  { bg: 'var(--brand-green-50)',  bd: 'var(--brand-green-100)', fg: 'var(--brand-green-700)', ic: <Icons.CheckCircle w={20} h={20}/> },
  }[verdict.level];

  return (
    <div style={{
      background: styles.bg, border: `1px solid ${styles.bd}`,
      borderRadius: 'var(--radius-lg)', padding: '18px 22px',
      display: 'flex', alignItems: 'flex-start', gap: 16,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 10,
        background: 'rgba(255,255,255,.6)', color: styles.fg,
        display: 'grid', placeItems: 'center', flexShrink: 0,
      }}>{styles.ic}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: styles.fg, letterSpacing: '-.005em' }}>
          {verdict.title}
        </div>
        <div style={{ fontSize: 13, color: 'var(--ink-700)', marginTop: 6, lineHeight: 1.55 }}>
          {verdict.message}
        </div>
      </div>
      {verdict.level === 'red' && (
        <div style={{ flexShrink: 0 }}>
          {!taskCreated
            ? <button className="btn primary" onClick={onCreateTask}><Icons.Plus w={14} h={14}/> Создать задачу</button>
            : <span className="badge b-completed lg"><Icons.Check w={12} h={12}/> Задача создана</span>}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { RotationCheck });

// ─── DangerList: shows all (customer, application) combos with red rotation ──
function DangerList({ customers, onOpen, onAllCustomers }) {
  const { CUSTOMER_APP_HISTORY, APPLICATIONS } = window.SHIPMENT_DATA;

  // Build all customer × app pairs with red rotation
  const dangerous = [];
  const warn = [];
  customers.forEach(cust => {
    const apps = CUSTOMER_APP_HISTORY[cust.id] || {};
    Object.entries(apps).forEach(([appId, orders]) => {
      const last6 = orders.slice(0, 6);
      const counts = {};
      last6.forEach(o => { counts[o.productId] = (counts[o.productId] || 0) + 1; });
      const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
      if (entries.length < 2) {
        const app = APPLICATIONS.find(a => a.id === appId);
        const onlyCulture = entries[0]?.[0];
        dangerous.push({ cust, app, onlyCulture, ordersCount: last6.length });
      } else if (entries.length === 2 && entries[0][1] >= 5) {
        const app = APPLICATIONS.find(a => a.id === appId);
        warn.push({ cust, app, split: `${entries[0][1]}:${entries[1][1]}` });
      }
    });
  });

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
        <button className="btn ghost sm" onClick={onAllCustomers}>
          <Icons.ArrowLeft w={13} h={13}/> Все клиенты
        </button>
        <div style={{ fontSize: 13, color: 'var(--ink-600)' }}>
          Показаны клиенты и продукты, где ротация не соблюдается
        </div>
      </div>

      {/* Red — dangerous */}
      <div className="alert error" style={{ marginBottom: 18, alignItems: 'center' }}>
        <Icons.AlertTri className="alert-ic" w={18} h={18}/>
        <div style={{ flex: 1 }}>
          <b>{dangerous.length}</b> {dangerous.length === 1 ? 'опасная ситуация' : dangerous.length < 5 ? 'опасные ситуации' : 'опасных ситуаций'} — за последние 6 отгрузок использовалась только одна культура.
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header">
          <h3 className="card-title">🔴 Требуют внимания — нет ротации</h3>
          <span className="muted" style={{ fontSize: 12 }}>{dangerous.length} {dangerous.length === 1 ? 'позиция' : 'позиций'}</span>
        </div>
        <div className="card-body flush">
          {dangerous.length === 0 ? (
            <div className="empty">
              <div className="em-ic"><Icons.CheckCircle w={32} h={32}/></div>
              <div className="em-title" style={{ color: 'var(--brand-green-700)' }}>Опасных ситуаций нет</div>
              Все клиенты используют 2+ культуры для каждого продукта
            </div>
          ) : dangerous.map((d, i) => (
            <div key={i} className="row-line" style={{ cursor: 'pointer', padding: '14px 18px' }} onClick={() => onOpen(d.cust.id, d.app.id)}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--st-delayed-bg)', color: 'var(--st-delayed)', display: 'grid', placeItems: 'center', fontSize: 18, flexShrink: 0 }}>
                {d.app.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="row-strong" style={{ fontSize: 13.5 }}>{d.cust.short} · {d.app.name}</div>
                <div className="row-meta">
                  {d.cust.city} · Используется только <b style={{ color: 'var(--st-delayed)' }}>1 культура</b> в {d.ordersCount} последних отгрузках
                </div>
              </div>
              <span className="badge b-delayed" style={{ flexShrink: 0 }}>
                <Icons.AlertTri w={11} h={11}/> Опасно
              </span>
              <Icons.ChevronRight w={16} h={16} className="muted" style={{ marginLeft: 8, flexShrink: 0 }}/>
            </div>
          ))}
        </div>
      </div>

      {/* Yellow — skewed */}
      {warn.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">🟡 Внимание — ротация несбалансирована</h3>
            <span className="muted" style={{ fontSize: 12 }}>{warn.length} {warn.length === 1 ? 'позиция' : 'позиций'}</span>
          </div>
          <div className="card-body flush">
            {warn.map((d, i) => (
              <div key={i} className="row-line" style={{ cursor: 'pointer', padding: '14px 18px' }} onClick={() => onOpen(d.cust.id, d.app.id)}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--st-approval-bg)', color: 'var(--st-approval)', display: 'grid', placeItems: 'center', fontSize: 18, flexShrink: 0 }}>
                  {d.app.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="row-strong" style={{ fontSize: 13.5 }}>{d.cust.short} · {d.app.name}</div>
                  <div className="row-meta">{d.cust.city} · Соотношение культур <b style={{ color: 'var(--st-approval)' }}>{d.split}</b> — одна доминирует</div>
                </div>
                <span className="badge b-approval" style={{ flexShrink: 0 }}>
                  <Icons.AlertTri w={11} h={11}/> Внимание
                </span>
                <Icons.ChevronRight w={16} h={16} className="muted" style={{ marginLeft: 8, flexShrink: 0 }}/>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

Object.assign(window, { DangerList });
