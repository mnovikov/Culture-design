// screens.jsx — all screens for the shipment management prototype

// ═══ LOGIN ════════════════════════════════════════════════════════════════
function LoginScreen({ onLogin }) {
  const { ALL_USERS, CUSTOMERS } = window.SHIPMENT_DATA;
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [showAccounts, setShowAccounts] = React.useState(true);

  const submit = (e) => {
    if (e) e.preventDefault();
    setError('');
    const user = ALL_USERS.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) { setError('Пользователь не найден. Проверьте email.'); return; }
    if (!password.trim()) { setError('Введите пароль.'); return; }
    onLogin(user);
  };

  const fillAccount = (u) => {
    setEmail(u.email);
    setPassword('demo');
    setError('');
  };

  return (
    <div className="login-shell">
      <div className="login-pane">
        <div style={{ maxWidth: 420, width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 30 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 11,
              background: 'linear-gradient(135deg, var(--brand-green), var(--brand-green-700))',
              color: 'white', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 18, letterSpacing: '-.02em',
              boxShadow: '0 6px 14px rgba(23,165,99,.25)',
            }}>К</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 16, color: 'var(--ink-900)' }}>Культура</div>
              <div style={{ fontSize: 12, color: 'var(--ink-500)' }}>Управление отгрузками</div>
            </div>
          </div>

          <h1 style={{ fontSize: 28, fontWeight: 650, letterSpacing: '-.02em', margin: 0, color: 'var(--ink-900)' }}>
            Вход в систему
          </h1>
          <p style={{ fontSize: 14, color: 'var(--ink-500)', marginTop: 8, marginBottom: 24 }}>
            Войдите со своими корпоративными учётными данными
          </p>

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="field">
              <label>Корпоративный email</label>
              <input className="input" type="email" autoFocus
                placeholder="ivan.ivanov@kultura.ru"
                value={email}
                onChange={e => setEmail(e.target.value)}/>
            </div>
            <div className="field">
              <label>Пароль</label>
              <input className="input" type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}/>
            </div>

            {error && (
              <div className="alert error" style={{ padding: '10px 12px' }}>
                <Icons.AlertTri className="alert-ic" w={14} h={14}/>
                <div style={{ fontSize: 12.5 }}>{error}</div>
              </div>
            )}

            <button className="btn primary lg" type="submit" style={{ width: '100%', marginTop: 4 }}>
              Войти <Icons.ArrowRight w={14} h={14}/>
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: 'var(--ink-500)' }}>
              <a href="#" style={{ color: 'var(--brand-green-700)' }}>Забыли пароль?</a>
              <a href="#" style={{ color: 'var(--ink-500)' }}>Связаться с IT</a>
            </div>
          </form>

          {/* Demo accounts */}
          <div style={{ marginTop: 28, padding: 16, background: 'var(--ink-50)', borderRadius: 10, border: '1px dashed var(--ink-200)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-600)', textTransform: 'uppercase', letterSpacing: '.06em' }}>
                Демо-аккаунты для прототипа
              </div>
              <button type="button" className="btn ghost sm" style={{ height: 22, padding: '0 6px', fontSize: 11 }} onClick={() => setShowAccounts(s => !s)}>
                {showAccounts ? 'Свернуть' : 'Показать'}
              </button>
            </div>
            {showAccounts && (
              <>
                <div style={{ fontSize: 11.5, color: 'var(--ink-500)', marginBottom: 10 }}>
                  Нажмите на аккаунт, чтобы заполнить форму. Пароль для всех демо-аккаунтов: <b className="mono" style={{ color: 'var(--ink-700)' }}>demo</b>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {ALL_USERS.map(u => {
                    const myCustomers = CUSTOMERS.filter(c => c.accountManagerId === u.id);
                    return (
                      <button key={u.id} type="button"
                        onClick={() => fillAccount(u)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '8px 10px', borderRadius: 7,
                          background: 'var(--white)', border: '1px solid var(--ink-200)',
                          cursor: 'pointer', textAlign: 'left',
                        }}>
                        <span className="avatar" style={{ width: 26, height: 26, background: u.color, fontSize: 10 }}>{u.initials}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12.5, fontWeight: 550, color: 'var(--ink-900)' }}>{u.name}</div>
                          <div className="mono" style={{ fontSize: 11, color: 'var(--ink-500)' }}>{u.email}</div>
                        </div>
                        <span className="badge b-neutral" style={{ fontSize: 10 }}>
                          {u.role === 'director' ? 'Директор' : `${myCustomers.length} ${myCustomers.length === 1 ? 'клиент' : 'клиента'}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="login-side">
        <div className="deco"></div>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 10, color: '#cfe4d6' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--brand-green)' }}></span>
          <span style={{ fontSize: 12, letterSpacing: '.06em', textTransform: 'uppercase' }}>Внутренний инструмент</span>
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: 36, fontWeight: 600, letterSpacing: '-.02em', lineHeight: 1.15, color: 'white', maxWidth: 460 }}>
            Один процесс от плана отгрузки до подтверждения получения клиентом.
          </div>
          <div style={{ marginTop: 18, fontSize: 14, color: '#aabfd4', maxWidth: 440, lineHeight: 1.55 }}>
            Менеджеры ведут поручения по каждому заказу, видят задержки и историю по клиенту, не переключаясь между системами.
          </div>
        </div>
        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, color: '#dbe6f1', fontSize: 12 }}>
          <div><div style={{ fontSize: 22, fontWeight: 600, color: 'white' }}>142</div><div style={{ color: '#8aa1b8' }}>отгрузок в работе</div></div>
          <div><div style={{ fontSize: 22, fontWeight: 600, color: 'white' }}>4</div><div style={{ color: '#8aa1b8' }}>менеджеров</div></div>
          <div><div style={{ fontSize: 22, fontWeight: 600, color: 'white' }}>10</div><div style={{ color: '#8aa1b8' }}>клиентов</div></div>
        </div>
      </div>
    </div>
  );
}

// ═══ DASHBOARD ════════════════════════════════════════════════════════════
function Dashboard({ shipments, goto, advance, markDelayed, layout, currentUser, scopedCustomers }) {
  const { STATUSES, buildTasks, CUSTOMER_APP_HISTORY } = window.SHIPMENT_DATA;
  const [filter, setFilter] = React.useState('all');

  // Shipments are already scoped to the current user at the app level
  const active = shipments.filter(s => !['completed', 'cancelled'].includes(s.status));
  const tasks = buildTasks(active);

  // Rotation health across the manager's customers
  const rotationHealth = React.useMemo(() => {
    let red = 0, yellow = 0, green = 0;
    (scopedCustomers || []).forEach(cust => {
      const apps = CUSTOMER_APP_HISTORY[cust.id] || {};
      Object.values(apps).forEach(orders => {
        const last6 = orders.slice(0, 6);
        const counts = {};
        last6.forEach(o => { counts[o.productId] = (counts[o.productId] || 0) + 1; });
        const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
        if (entries.length < 2)                          red++;
        else if (entries.length === 2 && entries[0][1] >= 5) yellow++;
        else                                             green++;
      });
    });
    return { red, yellow, green, total: red + yellow + green };
  }, [scopedCustomers]);
  const filteredTasks = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);

  const delayed = shipments.filter(s => s.delayed && !['completed','cancelled'].includes(s.status));

  const summary = [
    { key: 'planned',   num: active.filter(s => s.status === 'planned').length,   lbl: 'Запланировано',         color: 'var(--st-planned)' },
    { key: 'approval',  num: active.filter(s => s.status === 'approval').length,  lbl: 'Ожидает согласования',  color: 'var(--st-approval)' },
    { key: 'preparing', num: active.filter(s => s.status === 'preparing').length, lbl: 'Подготовка',            color: 'var(--st-preparing)' },
    { key: 'docs',      num: active.filter(s => s.status === 'docs').length,      lbl: 'Документы',             color: 'var(--st-docs)' },
    { key: 'delivery',  num: active.filter(s => s.status === 'delivery').length,  lbl: 'В доставке',            color: 'var(--st-delivery)' },
    { key: 'delayed',   num: delayed.length, lbl: 'Задержано', color: 'var(--st-delayed)', delayed: true },
    { key: 'completed', num: shipments.filter(s => s.status === 'completed').length, lbl: 'Завершено за период', color: 'var(--st-completed)' },
    { key: 'cancelled', num: shipments.filter(s => s.status === 'cancelled').length, lbl: 'Отменено', color: 'var(--st-cancelled)' },
  ];

  return (
    <>
      <Topbar crumbs={['Дашборд']} right={
        <>
          <button className="btn"><Icons.Upload w={14} h={14}/> Загрузить план</button>
          <button className="btn primary"><Icons.Plus w={14} h={14}/> Новая отгрузка</button>
        </>
      }/>
      <div className="content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Добрый день, {currentUser.name.split(' ')[0]}</h1>
            <p className="page-sub">У вас {tasks.length} активных задач</p>
          </div>
        </div>

        <div className="summary-grid">
          {summary.map(s => (
            <SummaryCard key={s.key} num={s.num} lbl={s.lbl} color={s.color} delayed={s.delayed}
              active={filter === s.key}
              onClick={() => {
                if (s.key === 'delayed' || s.key === 'completed' || s.key === 'cancelled') {
                  goto('/shipments?filter=' + s.key);
                } else {
                  setFilter(filter === s.key ? 'all' : s.key);
                }
              }}/>
          ))}
          <div
            className={`summary-card rotation ${rotationHealth.red > 0 ? 'danger' : ''}`}
            onClick={() => goto(rotationHealth.red > 0 ? '/rotation?danger=1' : '/rotation')}
            title="Проверка ротации культур"
          >
            <span className="ico"><Icons.Refresh w={18} h={18}/></span>
            <div className="num">{rotationHealth.red}</div>
            <div className="lbl">{rotationHealth.red > 0 ? 'Опасных ротаций' : 'Проверка ротации'}</div>
            {rotationHealth.total > 0 && (
              <div style={{ marginTop: 6, display: 'flex', gap: 4, fontSize: 10.5, color: 'var(--ink-500)' }}>
                <span style={{ color: rotationHealth.red > 0 ? 'var(--st-delayed)' : 'var(--ink-400)' }}>🔴 {rotationHealth.red}</span>
                <span style={{ color: rotationHealth.yellow > 0 ? 'var(--st-approval)' : 'var(--ink-400)' }}>🟡 {rotationHealth.yellow}</span>
                <span style={{ color: 'var(--brand-green-700)' }}>🟢 {rotationHealth.green}</span>
              </div>
            )}
          </div>
        </div>

        {layout === 'kanban' ? (
          <DashboardKanban shipments={active} goto={goto}/>
        ) : (
          <div className="card" style={{ marginBottom: 22 }}>
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <h2 className="card-title">Мои задачи на сегодня</h2>
                {filter !== 'all' && (
                  <span className="badge b-neutral" style={{ cursor: 'pointer' }} onClick={() => setFilter('all')}>
                    Фильтр: {STATUSES[filter]?.short} <Icons.X w={11} h={11}/>
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span className="muted" style={{ fontSize: 12 }}>{filteredTasks.length} задач</span>
                <button className="btn sm ghost" onClick={() => goto('/shipments')}>Все отгрузки <Icons.ArrowRight w={12} h={12}/></button>
              </div>
            </div>
            <div className="card-body flush">
              {filteredTasks.length === 0 ? (
                <div className="empty">
                  <div className="em-ic"><Icons.CheckCircle w={32} h={32}/></div>
                  Все задачи на сегодня выполнены
                </div>
              ) : filteredTasks.slice(0, 10).map(t => (
                <TaskRow key={t.id} task={t} goto={goto} advance={advance}/>
              ))}
            </div>
          </div>
        )}

        {delayed.length > 0 && (
          <div className="card">
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="badge b-delayed lg"><Icons.AlertTri w={12} h={12}/> {delayed.length} задержки</span>
                <h2 className="card-title">Задержанные отгрузки</h2>
              </div>
            </div>
            <div className="card-body flush">
              {delayed.map(s => (
                <div key={s.id} className="row-line clickable" onClick={() => goto('/shipment/' + s.id)} style={{ cursor: 'pointer' }}>
                  <div style={{ width: 28 }}>
                    <span style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--st-delayed-bg)', color: 'var(--st-delayed)', display: 'grid', placeItems: 'center' }}>
                      <Icons.AlertTri w={14} h={14}/>
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="row-strong">{s.customer.short} — {s.id}</div>
                    <div className="row-meta">Причина: {s.delayReason}</div>
                  </div>
                  <div style={{ width: 130, fontSize: 12, color: 'var(--ink-500)' }}>
                    План: {fmtDate(s.plannedDate)}
                  </div>
                  <div style={{ width: 130 }}>
                    <StatusBadge statusKey={s.status}/>
                  </div>
                  <div style={{ width: 130, textAlign: 'right' }}>
                    <button className="btn sm">Открыть <Icons.ArrowRight w={11} h={11}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function DashboardKanban({ shipments, goto }) {
  const { STATUS_ORDER, STATUSES } = window.SHIPMENT_DATA;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 22 }}>
      {STATUS_ORDER.slice(0, 5).map(k => {
        const items = shipments.filter(s => s.status === k);
        return (
          <div key={k} className="card" style={{ background: 'var(--ink-50)' }}>
            <div className="card-header" style={{ padding: '10px 12px' }}>
              <StatusBadge statusKey={k}/>
              <span className="muted" style={{ fontSize: 12 }}>{items.length}</span>
            </div>
            <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {items.slice(0, 5).map(s => (
                <div key={s.id} className="card" style={{ padding: 10, cursor: 'pointer' }} onClick={() => goto('/shipment/' + s.id)}>
                  <div style={{ fontSize: 12, color: 'var(--ink-500)', fontFamily: 'ui-monospace, monospace' }}>{s.id}</div>
                  <div style={{ fontWeight: 550, fontSize: 13, marginTop: 2 }}>{s.customer.short}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-500)', marginTop: 4 }}>{window.SHIPMENT_DATA.fmtDate(s.plannedDate)}</div>
                </div>
              ))}
              {items.length === 0 && <div style={{ padding: 16, textAlign: 'center', fontSize: 12, color: 'var(--ink-400)' }}>Нет отгрузок</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TaskRow({ task, goto, advance }) {
  const { fmtDate } = window.SHIPMENT_DATA;
  const due = new Date(task.dueDate);
  const today = new Date(2026, 4, 26);
  const overdue = due < today;

  return (
    <div className="task-row" onClick={() => goto('/shipment/' + task.shipmentId)}>
      <div className="task-check" onClick={(e) => { e.stopPropagation(); advance(task.shipmentId); }}>
      </div>
      <div>
        <div className="task-title">{task.title}</div>
        <div className="task-meta">
          {task.customer.short} · <span className="mono">{task.shipmentId}</span>
          {task.delayed && <> · <span style={{ color: 'var(--st-delayed)' }}>Задержано</span></>}
        </div>
      </div>
      <div>
        <StatusBadge statusKey={task.status}/>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: overdue ? 'var(--st-delayed)' : 'var(--ink-600)' }}>
        <Icons.Calendar w={13} h={13}/>
        <span style={{ fontSize: 12.5 }}>{fmtDate(task.dueDate)}</span>
      </div>
      <div style={{ textAlign: 'right' }}>
        <button className="btn primary sm" onClick={(e) => { e.stopPropagation(); advance(task.shipmentId); }}>
          {task.action.length > 18 ? task.action.slice(0, 18) + '…' : task.action}
        </button>
      </div>
    </div>
  );
}

// ═══ SHIPMENT LIST ════════════════════════════════════════════════════════
function ShipmentList({ shipments, goto, initialFilter }) {
  const { STATUSES, CUSTOMERS, PRODUCTS, fmtDate } = window.SHIPMENT_DATA;
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState(initialFilter || 'active');
  const [delayedOnly, setDelayedOnly] = React.useState(false);

  const filtered = shipments.filter(s => {
    if (statusFilter === 'active') { if (['completed', 'cancelled'].includes(s.status)) return false; }
    else if (statusFilter === 'delayed') { if (!s.delayed) return false; }
    else if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    if (delayedOnly && !s.delayed) return false;
    if (search) {
      const q = search.toLowerCase();
      const customerMatch = s.customer.name.toLowerCase().includes(q) || s.customer.short.toLowerCase().includes(q);
      const productMatch  = s.products.some(p => PRODUCTS.find(pp => pp.id === p.productId).name.toLowerCase().includes(q));
      const idMatch = s.id.toLowerCase().includes(q);
      if (!customerMatch && !productMatch && !idMatch) return false;
    }
    return true;
  });

  return (
    <>
      <Topbar crumbs={['Отгрузки в работе']} right={
        <>
          <button className="btn"><Icons.Download w={14} h={14}/> Экспорт</button>
          <button className="btn primary"><Icons.Plus w={14} h={14}/> Новая отгрузка</button>
        </>
      }/>
      <div className="content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Отгрузки</h1>
            <p className="page-sub">{filtered.length} отгрузок · обновлено сейчас</p>
          </div>
        </div>

        <div className="filter-bar">
          <div className="search">
            <Icons.Search className="ic" w={15} h={15}/>
            <input placeholder="Поиск по клиенту, продукту, ID..." value={search} onChange={e => setSearch(e.target.value)}/>
          </div>
          <select className="select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="active">Активные</option>
            <option value="all">Все статусы</option>
            <option value="planned">Запланировано</option>
            <option value="approval">Ожидает согласования</option>
            <option value="preparing">Подготовка</option>
            <option value="docs">Документы</option>
            <option value="delivery">В доставке</option>
            <option value="completed">Завершено</option>
            <option value="cancelled">Отменено</option>
            <option value="delayed">Только задержанные</option>
          </select>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--ink-700)', cursor: 'pointer', padding: '0 6px' }}>
            <input type="checkbox" checked={delayedOnly} onChange={e => setDelayedOnly(e.target.checked)}/>
            Только задержанные
          </label>
        </div>

        <div className="table-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>ID</th>
                <th>Клиент</th>
                <th>Продукт</th>
                <th>Кол-во</th>
                <th>План. дата</th>
                <th>Статус</th>
                <th>Текущая задача</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => {
                const firstProduct = PRODUCTS.find(p => p.id === s.products[0].productId);
                return (
                  <tr key={s.id} className="clickable" onClick={() => goto('/shipment/' + s.id)}>
                    <td className="id">{s.id}</td>
                    <td className="strong">
                      <div>{s.customer.short}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--ink-500)', fontWeight: 400 }}>{s.customer.city}</div>
                    </td>
                    <td>
                      <div>{firstProduct.name.length > 32 ? firstProduct.name.slice(0,32) + '…' : firstProduct.name}</div>
                      {s.products.length > 1 && <div style={{ fontSize: 11.5, color: 'var(--ink-500)' }}>+{s.products.length - 1} ещё</div>}
                    </td>
                    <td className="muted">{s.totalQty.toLocaleString('ru-RU')} {firstProduct.unit}</td>
                    <td className="muted">{fmtDate(s.plannedDate)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                        <StatusBadge statusKey={s.status}/>
                        {s.delayed && <DelayBadge/>}
                      </div>
                    </td>
                    <td className="muted">{s.nextTask}</td>
                    <td style={{ textAlign: 'right' }}>
                      <Icons.ChevronRight w={14} h={14} className="muted"/>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="empty">
              <div className="em-ic"><Icons.Search w={28} h={28}/></div>
              Ничего не найдено
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ═══ STATUS FLOW ══════════════════════════════════════════════════════════
function StatusFlowPage() {
  return (
    <>
      <Topbar crumbs={['Статусы и процесс']}/>
      <div className="content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Статусы и процесс отгрузки</h1>
            <p className="page-sub">Полная воронка от плановой отгрузки до получения клиентом</p>
          </div>
        </div>

        <div className="flow-page">
          <div className="flow-stage">
            <div style={{ marginBottom: 22, fontSize: 13.5, color: 'var(--ink-600)' }}>
              Менеджер вручную переводит отгрузку по этапам, отмечая выполнение задачи. Возврат на предыдущий этап и пропуск этапа разрешены.
            </div>
            <WorkflowTimeline status="approval"/>

            <div className="flow-explain">
              <div className="card">
                <div className="card-body tight">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--st-planned)' }}></span>
                    <b style={{ fontSize: 13 }}>Запланировано</b>
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--ink-600)', lineHeight: 1.5 }}>
                    Отгрузка создана из плана. Менеджер проверяет параметры — продукт, количество, дату, адрес.
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-body tight">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--st-approval)' }}></span>
                    <b style={{ fontSize: 13 }}>Ожидает согласования</b>
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--ink-600)', lineHeight: 1.5 }}>
                    Менеджер связался с клиентом. Ждём согласие на дату, объём, адрес доставки.
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-body tight">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--st-preparing)' }}></span>
                    <b style={{ fontSize: 13 }}>Подготовка</b>
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--ink-600)', lineHeight: 1.5 }}>
                    Согласовано. Проверяем остатки, бронируем партии, при нехватке создаём заявку на пополнение.
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-body tight">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--st-docs)' }}></span>
                    <b style={{ fontSize: 13 }}>Документы готовы</b>
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--ink-600)', lineHeight: 1.5 }}>
                    Сформированы накладные, счета и ТТН. Заполнены поля, требующие ручного ввода.
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-body tight">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--st-delivery)' }}></span>
                    <b style={{ fontSize: 13 }}>В доставке</b>
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--ink-600)', lineHeight: 1.5 }}>
                    Выбран перевозчик, есть трек-номер, водитель и машина. Статус доставки обновляется вручную.
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-body tight">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--st-completed)' }}></span>
                    <b style={{ fontSize: 13 }}>Завершено</b>
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--ink-600)', lineHeight: 1.5 }}>
                    Клиент подтвердил получение, загружен документ подтверждения. Отгрузка закрыта.
                  </div>
                </div>
              </div>
            </div>

            <div className="flow-cancel-note">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <Icons.Ban w={14} h={14}/>
                <b>Отмена возможна с этапов «Ожидает согласования» и «Подготовка»</b>
              </div>
              Отменённые отгрузки получают статус <span className="badge b-cancelled" style={{ marginLeft: 4 }}>Отменено</span> и переходят в раздел истории. После начала формирования документов отмена недоступна.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ═══ HISTORY ══════════════════════════════════════════════════════════════
function HistoryPage({ shipments, goto }) {
  const { MANAGERS, PRODUCTS, fmtDate } = window.SHIPMENT_DATA;
  const items = shipments.filter(s => ['completed','cancelled'].includes(s.status));

  return (
    <>
      <Topbar crumbs={['История отгрузок']}/>
      <div className="content">
        <div className="page-header">
          <div>
            <h1 className="page-title">История отгрузок</h1>
            <p className="page-sub">Завершённые и отменённые отгрузки по компании</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn"><Icons.Download w={14} h={14}/> Выгрузить отчёт</button>
          </div>
        </div>

        <div className="kpi-row">
          <div className="kpi"><div className="lbl">Завершено за период</div><div className="val">{items.filter(s => s.status==='completed').length}</div><div className="delta">+12% к прошлому месяцу</div></div>
          <div className="kpi"><div className="lbl">Выручка</div><div className="val">{(items.reduce((s,i)=>s+(i.price||0),0)).toLocaleString('ru-RU')} ₽</div><div className="delta">+8% к прошлому месяцу</div></div>
          <div className="kpi"><div className="lbl">Маржа</div><div className="val">{(items.reduce((s,i)=>s+(i.profit||0),0)).toLocaleString('ru-RU')} ₽</div><div className="delta" style={{ color:'var(--ink-500)'}}>16.3% средняя</div></div>
          <div className="kpi"><div className="lbl">Отменено</div><div className="val" style={{color:'var(--st-cancelled)'}}>{items.filter(s => s.status==='cancelled').length}</div><div className="delta" style={{ color:'var(--ink-500)'}}>1 отгрузка</div></div>
        </div>

        <div className="table-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>ID</th>
                <th>Клиент</th>
                <th>Продукт</th>
                <th>План. дата</th>
                <th>Завершено</th>
                <th>Статус</th>
                <th>Сумма</th>
                <th>Прибыль</th>
                <th>Заметки</th>
              </tr>
            </thead>
            <tbody>
              {items.map(s => {
                const first = PRODUCTS.find(p => p.id === s.products[0].productId);
                return (
                  <tr key={s.id} className="clickable" onClick={() => goto('/shipment/' + s.id)}>
                    <td className="id">{s.id}</td>
                    <td className="strong">{s.customer.short}</td>
                    <td>{first.name.length > 28 ? first.name.slice(0, 28) + '…' : first.name}</td>
                    <td className="muted">{fmtDate(s.plannedDate)}</td>
                    <td className="muted">{fmtDate(s.plannedDate)}</td>
                    <td><StatusBadge statusKey={s.status}/></td>
                    <td className="strong">{s.price ? s.price.toLocaleString('ru-RU') + ' ₽' : '—'}</td>
                    <td style={{ color: s.profit ? 'var(--brand-green-700)' : 'var(--ink-400)' }}>
                      {s.profit ? s.profit.toLocaleString('ru-RU') + ' ₽' : '—'}
                    </td>
                    <td className="muted">{s.notes || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ═══ HELP / ABOUT ═════════════════════════════════════════════════════════
function HelpPage() {
  return (
    <>
      <Topbar crumbs={['О системе']}/>
      <div className="content">
        <div className="page-header">
          <div>
            <h1 className="page-title">О системе «Культура»</h1>
            <p className="page-sub">Назначение, процесс и принципы работы</p>
          </div>
        </div>

        <div style={{ maxWidth: 820 }}>
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-body" style={{ padding: 28 }}>
              <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--ink-900)', marginBottom: 10, letterSpacing: '-.01em' }}>
                Зачем нужна система
              </div>
              <p style={{ fontSize: 14, color: 'var(--ink-700)', lineHeight: 1.65, margin: 0 }}>
                Система автоматизирует процесс управления текущими отгрузками клиентам. Она помогает компании контролировать статус каждой отгрузки,
                упростить и автоматизировать операционные действия, отслеживать задержки, своевременно уведомлять ответственных менеджеров и анализировать
                историю продаж по клиентам и продуктам.
              </p>
            </div>
          </div>

          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-body">
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 14 }}>Что делает система</div>
              <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--ink-700)', fontSize: 13.5, lineHeight: 1.85 }}>
                <li>Контроль статуса текущих отгрузок в одном окне</li>
                <li>Упрощение операционных шагов: задачи, документы, доставка</li>
                <li>Отслеживание задержек и проблемных ситуаций</li>
                <li>Уведомление ответственных менеджеров</li>
                <li>Анализ истории отгрузок за прошлые месяцы</li>
                <li>Сравнение текущих планов с прошлыми объёмами для того же клиента</li>
              </ul>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 14 }}>Главный принцип работы</div>
              <p style={{ fontSize: 13.5, color: 'var(--ink-700)', lineHeight: 1.65, margin: '0 0 12px' }}>
                Менеджер загружает или получает план поставок, а затем работает по списку задач, пока каждая отгрузка не будет выполнена.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 18 }}>
                {[
                  ['1. Загрузка плана', 'Из внешнего документа создаются плановые отгрузки и формируются задачи менеджеру'],
                  ['2. Согласование', 'Менеджер связывается с клиентом и фиксирует согласие вручную'],
                  ['3. Подготовка', 'Проверка остатков, бронирование, при необходимости — заявка на пополнение'],
                  ['4. Документы', 'Автоматическая генерация и ручное заполнение недостающих полей'],
                  ['5. Доставка', 'Выбор перевозчика, передача груза, обновление статуса'],
                  ['6. Завершение', 'Получение подтверждено, загружен документ, отгрузка закрыта'],
                ].map(([t, d]) => (
                  <div key={t} style={{ padding: '12px 14px', background: 'var(--ink-50)', borderRadius: 8, border: '1px solid var(--ink-150)' }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--ink-900)' }}>{t}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--ink-600)', marginTop: 4 }}>{d}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ═══ DIRECTOR PLACEHOLDER ════════════════════════════════════════════════
function DirectorPlaceholder({ goto, onLogout, currentUser }) {
  const user = currentUser || window.SHIPMENT_DATA.DIRECTOR;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'var(--sidebar-w) 1fr', height: '100vh', overflow: 'hidden' }}>
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">К</div>
          <div>
            <div className="brand-name">Культура</div>
            <div className="brand-sub">Управление отгрузками</div>
          </div>
        </div>
        <div className="nav-section">
          <div className="nav-label">Дирекция</div>
          <div className="nav-item active"><Icons.Dashboard className="nav-icon"/> Обзор</div>
          <div className="nav-item"><Icons.Truck className="nav-icon"/> Отгрузки</div>
          <div className="nav-item"><Icons.History className="nav-icon"/> История</div>
        </div>
        <div className="sidebar-foot">
          <div className="user-chip">
            <Avatar manager={user}/>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ color: 'white', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
              <div style={{ color: '#8aa1b8', fontSize: 11 }}>Директор</div>
            </div>
            <span className="icon-btn" style={{ marginLeft: 'auto', color: '#8aa1b8' }} onClick={onLogout || (() => goto('/login'))}><Icons.Logout w={15} h={15}/></span>
          </div>
        </div>
      </aside>

      <div className="main">
        <Topbar crumbs={['Дирекция', 'Обзор']}/>
        <div className="content">
          <div className="placeholder-screen">
            <div>
              <div className="ph-ic"><Icons.Crown w={32} h={32}/></div>
              <h2 style={{ fontSize: 22, fontWeight: 600, color: 'var(--ink-900)', margin: '0 0 8px' }}>Дашборд директора в разработке</h2>
              <p style={{ color: 'var(--ink-500)', fontSize: 14, maxWidth: 480, margin: '0 auto 28px', lineHeight: 1.6 }}>
                Здесь будут KPI по выручке и марже, динамика отгрузок, сводка по менеджерам и сегментация клиентов.
                В рамках MVP сделана заглушка — приоритет на функционал менеджера по продажам.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
                <button className="btn" onClick={onLogout || (() => goto('/login'))}>Сменить пользователя</button>
                <button className="btn primary" onClick={() => goto('/shipments')}>Открыть отгрузки</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  LoginScreen, Dashboard, ShipmentList, StatusFlowPage, HistoryPage, HelpPage, DirectorPlaceholder,
  TaskRow,
});
