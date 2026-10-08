// components.jsx — shared UI primitives (Russian-language)

// ─── Icons (Lucide-style strokes) ───────────────────────────────────────
const Icon = ({ d, w = 16, h = 16, stroke = 'currentColor', fill = 'none', children, className = '', strokeWidth = 1.75, ...rest }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={w} height={h} viewBox="0 0 24 24"
       fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
       className={className} {...rest}>
    {d ? <path d={d}/> : children}
  </svg>
);

const Icons = {
  Dashboard:  (p) => <Icon {...p}><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></Icon>,
  Truck:      (p) => <Icon {...p}><path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></Icon>,
  List:       (p) => <Icon {...p}><line x1="8" y1="6"  x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6"  x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></Icon>,
  History:    (p) => <Icon {...p}><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/></Icon>,
  Flow:       (p) => <Icon {...p}><rect x="2" y="9" width="6" height="6" rx="1"/><rect x="16" y="9" width="6" height="6" rx="1"/><path d="M8 12h8"/><path d="M14 9l2 3-2 3"/></Icon>,
  Info:       (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></Icon>,
  User:       (p) => <Icon {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></Icon>,
  Crown:      (p) => <Icon {...p}><path d="M2 8l4 8h12l4-8-6 4-4-8-4 8-6-4z"/></Icon>,
  Warehouse:  (p) => <Icon {...p}><path d="M3 21V8l9-5 9 5v13"/><path d="M9 21V12h6v9"/></Icon>,
  Wheel:      (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><line x1="12" y1="3" x2="12" y2="8"/><line x1="12" y1="16" x2="12" y2="21"/><line x1="3" y1="12" x2="8" y2="12"/><line x1="16" y1="12" x2="21" y2="12"/></Icon>,
  Bell:       (p) => <Icon {...p}><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></Icon>,
  Search:     (p) => <Icon {...p}><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></Icon>,
  Filter:     (p) => <Icon {...p}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></Icon>,
  Plus:       (p) => <Icon {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></Icon>,
  Check:      (p) => <Icon {...p}><polyline points="20 6 9 17 4 12"/></Icon>,
  CheckCircle:(p) => <Icon {...p}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></Icon>,
  X:          (p) => <Icon {...p}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></Icon>,
  AlertTri:   (p) => <Icon {...p}><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></Icon>,
  Clock:      (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/></Icon>,
  ChevronRight:(p)=> <Icon {...p}><polyline points="9 18 15 12 9 6"/></Icon>,
  ChevronLeft:(p) => <Icon {...p}><polyline points="15 18 9 12 15 6"/></Icon>,
  ChevronDown:(p) => <Icon {...p}><polyline points="6 9 12 15 18 9"/></Icon>,
  ArrowRight: (p) => <Icon {...p}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></Icon>,
  ArrowLeft:  (p) => <Icon {...p}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></Icon>,
  Upload:     (p) => <Icon {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></Icon>,
  Download:   (p) => <Icon {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></Icon>,
  File:       (p) => <Icon {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></Icon>,
  Doc:        (p) => <Icon {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/></Icon>,
  Printer:    (p) => <Icon {...p}><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></Icon>,
  Calendar:   (p) => <Icon {...p}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></Icon>,
  Pin:        (p) => <Icon {...p}><path d="M12 22s-8-7.58-8-13a8 8 0 0 1 16 0c0 5.42-8 13-8 13z"/><circle cx="12" cy="9" r="3"/></Icon>,
  Box:        (p) => <Icon {...p}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></Icon>,
  Edit:       (p) => <Icon {...p}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/></Icon>,
  More:       (p) => <Icon {...p}><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5"  cy="12" r="1"/></Icon>,
  Settings:   (p) => <Icon {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></Icon>,
  Logout:     (p) => <Icon {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></Icon>,
  Eye:        (p) => <Icon {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></Icon>,
  Help:       (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></Icon>,
  Comment:    (p) => <Icon {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></Icon>,
  Refresh:    (p) => <Icon {...p}><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></Icon>,
  Pause:      (p) => <Icon {...p}><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></Icon>,
  Ban:        (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><line x1="5" y1="5" x2="19" y2="19"/></Icon>,
};

// ─── Status badge ───────────────────────────────────────────────────────
function StatusBadge({ statusKey, big }) {
  const s = window.SHIPMENT_DATA.STATUSES[statusKey];
  if (!s) return null;
  return (
    <span className={`badge ${s.badge} ${big ? 'lg' : ''}`}>
      <span className="dot"></span>
      {s.short}
    </span>
  );
}

function PriorityBadge({ priority }) {
  const map = { high: { c: 'b-priority-high', t: 'Высокий' }, med: { c: 'b-priority-med', t: 'Средний' }, low: { c: 'b-priority-low', t: 'Низкий' } };
  const v = map[priority] || map.low;
  return <span className={`badge ${v.c}`}>{v.t}</span>;
}

function DelayBadge() {
  return <span className="badge b-delayed"><Icons.AlertTri w={11} h={11}/> Задержано</span>;
}

// ─── Avatar ─────────────────────────────────────────────────────────────
function Avatar({ manager, size = 28 }) {
  if (!manager) return null;
  return (
    <span className="avatar" style={{ width: size, height: size, background: manager.color, fontSize: size * 0.4 }}>
      {manager.initials}
    </span>
  );
}

// ─── Sidebar ────────────────────────────────────────────────────────────
function Sidebar({ route, goto, currentUser, onLogout, summary }) {
  const user = currentUser || window.SHIPMENT_DATA.CURRENT_USER;
  const isDirector = user?.role === 'director';
  const items = isDirector ? [
    { key: 'director',  label: 'Обзор (дирекция)', icon: <Icons.Crown/>, route: '/director' },
    { key: 'shipments', label: 'Все отгрузки',          icon: <Icons.Truck/>, route: '/shipments', count: summary.inWork },
    { key: 'history',   label: 'История отгрузок',          icon: <Icons.History/>,  route: '/history' },
  ] : [
    { key: 'dashboard', label: 'Дашборд',           icon: <Icons.Dashboard/>, route: '/dashboard' },
    { key: 'shipments', label: 'Отгрузки в работе', icon: <Icons.Truck/>, route: '/shipments', count: summary.inWork },
    { key: 'rotation',  label: 'Ротация культур',   icon: <Icons.Refresh/>, route: '/rotation' },
    { key: 'history',   label: 'История отгрузок', icon: <Icons.History/>,  route: '/history' },
    { key: 'flow',      label: 'Статусы и процесс', icon: <Icons.Flow/>,    route: '/flow' },
    { key: 'help',      label: 'О системе',         icon: <Icons.Info/>,    route: '/help' },
  ];
  const active = (r) => route === r || (r !== '/dashboard' && route.startsWith(r));
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">К</div>
        <div>
          <div className="brand-name">Культура</div>
          <div className="brand-sub">Управление отгрузками</div>
        </div>
      </div>

      <div className="nav-section">
        <div className="nav-label">Рабочее место</div>
        {items.map(it => (
          <div key={it.key} className={`nav-item ${active(it.route) ? 'active' : ''}`} onClick={() => goto(it.route)}>
            <span className="nav-icon">{it.icon}</span>
            <span>{it.label}</span>
            {it.count != null && <span className="nav-count">{it.count}</span>}
          </div>
        ))}
      </div>

      <div className="sidebar-foot">
        <div className="user-chip">
          <Avatar manager={user}/>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ color: 'white', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
            <div style={{ color: '#8aa1b8', fontSize: 11 }}>{isDirector ? 'Директор' : 'Менеджер по продажам'}</div>
          </div>
          <span className="icon-btn" style={{ marginLeft: 'auto', color: '#8aa1b8' }} title="Выйти" onClick={onLogout}>
            <Icons.Logout w={15} h={15}/>
          </span>
        </div>
      </div>
    </aside>
  );
}

// ─── Topbar ─────────────────────────────────────────────────────────────
function Topbar({ crumbs, right }) {
  return (
    <div className="topbar">
      <div className="crumbs">
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && <Icons.ChevronRight w={13} h={13}/>}
            {i === crumbs.length - 1 ? <b>{c}</b> : <span>{c}</span>}
          </React.Fragment>
        ))}
      </div>
      <div className="right">
        {right}
        <button className="icon-btn" title="Уведомления"><Icons.Bell w={16} h={16}/></button>
        <button className="icon-btn" title="Настройки"><Icons.Settings w={16} h={16}/></button>
      </div>
    </div>
  );
}

// ─── Workflow timeline (chevron) ────────────────────────────────────────
function WorkflowTimeline({ status, onJump }) {
  const { STATUS_ORDER, STATUSES } = window.SHIPMENT_DATA;
  const curIdx = STATUS_ORDER.indexOf(status);
  return (
    <div className="workflow">
      {STATUS_ORDER.map((k, i) => {
        const s = STATUSES[k];
        const cls = i < curIdx ? 'done' : (i === curIdx ? 'active' : 'pending');
        return (
          <div key={k} className={`step ${cls}`} onClick={() => onJump && onJump(k)} title={`Перевести в «${s.label}»`}>
            <div className="lbl">Этап {i + 1}</div>
            <div className="nm">{s.short}</div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Modal ──────────────────────────────────────────────────────────────
function Modal({ open, title, onClose, children, footer, width }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={width ? { width } : undefined} onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <h3>{title}</h3>
          <button className="icon-btn" onClick={onClose}><Icons.X/></button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

// ─── Toast host ─────────────────────────────────────────────────────────
function ToastHost({ toasts }) {
  return (
    <div className="toast-host">
      {toasts.map(t => (
        <div key={t.id} className="toast">
          <Icons.CheckCircle className="ic" w={16} h={16}/> {t.text}
        </div>
      ))}
    </div>
  );
}

// ─── Summary card ───────────────────────────────────────────────────────
function SummaryCard({ num, lbl, color, active, onClick, delayed }) {
  return (
    <div className={`summary-card ${active ? 'active' : ''} ${delayed ? 'delayed' : ''}`} onClick={onClick}>
      <div className="dot" style={{ background: color }}></div>
      <div className="num">{num}</div>
      <div className="lbl">{lbl}</div>
    </div>
  );
}

// Export to window
Object.assign(window, {
  Icons, Icon,
  StatusBadge, PriorityBadge, DelayBadge,
  Avatar, Sidebar, Topbar, WorkflowTimeline,
  Modal, ToastHost, SummaryCard,
});
