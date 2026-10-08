// data.jsx — mock data for the shipment management prototype (Russian, B2B cultures)

const STATUSES = {
  planned:    { key: 'planned',    label: 'Запланировано',          short: 'Запланировано', badge: 'b-planned' },
  approval:   { key: 'approval',   label: 'Ожидает согласования',    short: 'Согласование',  badge: 'b-approval' },
  preparing:  { key: 'preparing',  label: 'Подготовка',              short: 'Подготовка',    badge: 'b-preparing' },
  docs:       { key: 'docs',       label: 'Документы готовы',        short: 'Документы',     badge: 'b-docs' },
  delivery:   { key: 'delivery',   label: 'В доставке',              short: 'Доставка',      badge: 'b-delivery' },
  completed:  { key: 'completed',  label: 'Завершено',               short: 'Завершено',     badge: 'b-completed' },
  cancelled:  { key: 'cancelled',  label: 'Отменено',                short: 'Отменено',      badge: 'b-cancelled' },
};

const STATUS_ORDER = ['planned', 'approval', 'preparing', 'docs', 'delivery', 'completed'];

// Possible next-task labels per status
const NEXT_TASK_BY_STATUS = {
  planned:   'Проверить план отгрузки',
  approval:  'Зафиксировать согласование клиента',
  preparing: 'Проверить остатки на складе',
  docs:      'Утвердить документы',
  delivery:  'Подтвердить получение клиентом',
  completed: '—',
  cancelled: '—',
};

const NEXT_ACTION_BY_STATUS = {
  planned:   { label: 'Отправить на согласование', next: 'approval' },
  approval:  { label: 'Зафиксировать согласование', next: 'preparing' },
  preparing: { label: 'Подготовить документы',     next: 'docs' },
  docs:      { label: 'Утвердить и отправить',     next: 'delivery' },
  delivery:  { label: 'Подтвердить получение',     next: 'completed' },
  completed: { label: 'Завершено',                 next: null },
  cancelled: { label: 'Отменено',                  next: null },
};

const MANAGERS = [
  { id: 'm1', name: 'Снежана',  initials: 'Сн', color: '#16a34a', email: 'snejana@kultura.ru',  role: 'sales' },
  { id: 'm2', name: 'Света',    initials: 'Св', color: '#2563eb', email: 'sveta@kultura.ru',    role: 'sales' },
  { id: 'm3', name: 'Артур',    initials: 'Ар', color: '#ea580c', email: 'artur@kultura.ru',    role: 'sales' },
  { id: 'm4', name: 'Лариса',   initials: 'Ла', color: '#9333ea', email: 'larisa@kultura.ru',   role: 'sales' },
];

const DIRECTOR = { id: 'dir', name: 'Виктор', initials: 'Ви', color: '#7c3aed', email: 'viktor@kultura.ru', role: 'director' };

const ALL_USERS = [...MANAGERS, DIRECTOR];

// Currently logged in user — mutated on login. Default: Anna for direct deep-links.
let CURRENT_USER = MANAGERS[0];

const CUSTOMERS = [
  { id: 'c1', accountManagerId: 'm1', name: 'ОАО "Молочный комбинат Останкинский"',  short: 'МК Останкинский',   city: 'Москва',          tag: 'Постоянный' },
  { id: 'c2', accountManagerId: 'm1', name: 'ЗАО "Вимм-Билль-Данн"',                 short: 'Вимм-Билль-Данн',   city: 'Москва',          tag: 'Постоянный' },
  { id: 'c3', accountManagerId: 'm3', name: 'ООО "Молочные продукты Поволжья"',      short: 'МПП',               city: 'Самара',          tag: 'Постоянный' },
  { id: 'c4', accountManagerId: 'm2', name: 'ОАО "Кубаньмолоко"',                    short: 'Кубаньмолоко',      city: 'Краснодар',       tag: 'Постоянный' },
  { id: 'c5', accountManagerId: 'm3', name: 'ООО "Сыродельный завод Калачинский"',   short: 'СЗ Калачинский',    city: 'Омск',            tag: 'Новый клиент' },
  { id: 'c6', accountManagerId: 'm1', name: 'АО "Воронежмолоко"',                    short: 'Воронежмолоко',     city: 'Воронеж',         tag: 'Постоянный' },
  { id: 'c7', accountManagerId: 'm2', name: 'ООО "СибирьПродукт"',                   short: 'СибирьПродукт',     city: 'Новосибирск',     tag: 'Постоянный' },
  { id: 'c8', accountManagerId: 'm4', name: 'ЗАО "Алтайская буренка"',               short: 'Алтайская буренка', city: 'Барнаул',         tag: 'Постоянный' },
  { id: 'c9', accountManagerId: 'm4', name: 'ООО "Северный сыр"',                    short: 'Северный сыр',      city: 'Архангельск',     tag: 'Новый клиент' },
  { id: 'c10',accountManagerId: 'm2', name: 'ОАО "Башкирский молочный комбинат"',    short: 'БМК',               city: 'Уфа',             tag: 'Постоянный' },
];

const PRODUCTS = [
  // Термофильные — для йогурта, сыра типа моцарелла/чеддер
  { id: 'p1',  name: 'Закваска "Йогурт термофильная YF-L02"',  unit: 'DCU', code: 'YF-L02',   category: 'Термофильные' },
  { id: 'p7',  name: 'Закваска "Сыр Чеддер CHN-22"',            unit: 'DCU', code: 'CHN-22',   category: 'Термофильные' },
  { id: 'p9',  name: 'Закваска "Йогурт CHN-19"',                unit: 'DCU', code: 'CHN-19',   category: 'Термофильные' },
  { id: 'p10', name: 'Закваска "YO-MIX 883"',                   unit: 'DCU', code: 'YO-MIX-883', category: 'Термофильные' },
  // Мезофильные — для творога, сметаны, кефира
  { id: 'p2',  name: 'Закваска "Кефирная грибковая KEF-3"',     unit: 'DCU', code: 'KEF-3',    category: 'Мезофильные' },
  { id: 'p3',  name: 'Закваска для творога TCC-3',              unit: 'DCU', code: 'TCC-3',    category: 'Мезофильные' },
  { id: 'p6',  name: 'Закваска "Сметанная MC-2"',                unit: 'DCU', code: 'MC-2',     category: 'Мезофильные' },
  { id: 'p11', name: 'Закваска "Мезофильная RA-22"',             unit: 'DCU', code: 'RA-22',    category: 'Мезофильные' },
  // Защитные
  { id: 'p4',  name: 'Защитная культура HOLDBAC YM-B',           unit: 'DCU', code: 'HOLDBAC-YM', category: 'Защитные' },
  { id: 'p12', name: 'Защитная культура HOLDBAC LBB',            unit: 'DCU', code: 'HOLDBAC-LBB', category: 'Защитные' },
  { id: 'p13', name: 'Защитная культура LYOFAST LPRA',           unit: 'DCU', code: 'LYOFAST',  category: 'Защитные' },
  // Ферменты
  { id: 'p5',  name: 'Сычужный фермент Maxiren 600',             unit: 'л',   code: 'MX-600',   category: 'Ферменты' },
  { id: 'p14', name: 'Сычужный фермент CHY-MAX M',                unit: 'л',   code: 'CHY-MAX',  category: 'Ферменты' },
  { id: 'p15', name: 'Сычужный фермент Naturen Extra',            unit: 'л',   code: 'NATUREN',  category: 'Ферменты' },
  // Пробиотики
  { id: 'p8',  name: 'Пробиотик L. casei LC-01',                 unit: 'DCU', code: 'LC-01',    category: 'Пробиотики' },
  { id: 'p16', name: 'Пробиотик B. lactis BB-12',                unit: 'DCU', code: 'BB-12',    category: 'Пробиотики' },
];

const ADDRESSES = {
  c1: '127427, г. Москва, ул. Руставели, д. 14',
  c2: '127591, г. Москва, Дмитровское ш., д. 108',
  c3: '443022, г. Самара, пр. Кирова, д. 21',
  c4: '350080, г. Краснодар, ул. Уральская, д. 230',
  c5: '646903, г. Калачинск, ул. Заводская, д. 1',
  c6: '394038, г. Воронеж, ул. Ильюшина, д. 11',
  c7: '630099, г. Новосибирск, ул. Фабричная, д. 16',
  c8: '656905, г. Барнаул, ул. Власихинская, д. 49',
  c9: '163000, г. Архангельск, пр. Ленинградский, д. 30',
  c10:'450029, г. Уфа, ул. Юбилейная, д. 12',
};

const CARRIERS = [
  { id: 'car1', name: 'ПЭК — Первая Экспедиционная Компания', kind: 'LTL', sla: '2-3 дня' },
  { id: 'car2', name: 'Деловые Линии',                         kind: 'LTL', sla: '2-4 дня' },
  { id: 'car3', name: 'Байкал Сервис',                         kind: 'LTL', sla: '3-5 дней' },
  { id: 'car4', name: 'СДЭК',                                  kind: 'Экспресс', sla: '1-2 дня' },
  { id: 'car5', name: 'Энергия',                               kind: 'FTL', sla: '2-3 дня' },
];

const PRIORITY = { high: 'Высокий', med: 'Средний', low: 'Низкий' };

function todayPlus(days) {
  const d = new Date(2026, 4, 26 + days); // anchor: May 26, 2026
  return d.toISOString().slice(0, 10);
}
function fmtDate(iso) {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}`;
}
function fmtDateTime(iso) {
  if (!iso) return '—';
  return iso.replace('T', ' ').slice(0, 16);
}

// Mock shipments
function buildShipments() {
  const ships = [
    // Active — variety of statuses
    mkShip('SH-2026-0142', 'c1', [['p1', 4200], ['p4', 800]],  'planned',   'm1', +1, 'high', false, null),
    mkShip('SH-2026-0141', 'c3', [['p3', 1600]],               'approval',  'm1', +2, 'high', true,  'Клиент не отвечает на письмо от 22.05'),
    mkShip('SH-2026-0140', 'c2', [['p2', 3200], ['p6', 1200]], 'approval',  'm2', +3, 'med',  false, null),
    mkShip('SH-2026-0139', 'c4', [['p7', 2500]],               'preparing', 'm1', +2, 'high', false, null),
    mkShip('SH-2026-0138', 'c5', [['p1', 900],  ['p5', 60]],   'preparing', 'm3', +4, 'med',  false, null),
    mkShip('SH-2026-0137', 'c6', [['p8', 600]],                'docs',      'm1', +1, 'high', false, null),
    mkShip('SH-2026-0136', 'c7', [['p2', 2200]],               'docs',      'm4', +3, 'low',  false, null),
    mkShip('SH-2026-0135', 'c8', [['p3', 1800], ['p6', 700]],  'delivery',  'm1', 0,  'high', false, null),
    mkShip('SH-2026-0134', 'c9', [['p7', 1100]],               'delivery',  'm5', -1, 'med',  true,  'Транспортная задержка: непогода в Архангельской области'),
    mkShip('SH-2026-0133', 'c10',[['p1', 5400], ['p4', 1100]], 'delivery',  'm2', +2, 'low',  false, null),
    mkShip('SH-2026-0132', 'c1', [['p5', 120]],                'planned',   'm1', +5, 'med',  false, null),
    mkShip('SH-2026-0131', 'c3', [['p2', 1400]],               'planned',   'm3', +6, 'low',  false, null),
    mkShip('SH-2026-0130', 'c2', [['p6', 2800]],               'preparing', 'm1', +3, 'med',  true,  'Недостаток на складе — ожидаем поставку'),
    mkShip('SH-2026-0129', 'c4', [['p8', 400], ['p1', 1600]],  'approval',  'm2', +4, 'med',  false, null),
    mkShip('SH-2026-0128', 'c5', [['p3', 1100]],               'docs',      'm1', +2, 'high', false, null),
    // Completed / history
    mkShip('SH-2026-0127', 'c6', [['p1', 3800]],               'completed', 'm1', -7, 'med',  false, null, { price: 760000, profit: 124000 }),
    mkShip('SH-2026-0126', 'c2', [['p2', 2400], ['p6', 900]],  'completed', 'm2', -10,'med',  false, null, { price: 615000, profit: 98000 }),
    mkShip('SH-2026-0125', 'c7', [['p7', 1600]],               'completed', 'm4', -12,'high', false, null, { price: 432000, profit: 71000 }),
    mkShip('SH-2026-0124', 'c1', [['p1', 4000], ['p4', 700]],  'completed', 'm1', -18,'med',  false, null, { price: 890000, profit: 145000, notes: 'Крупный заказ' }),
    mkShip('SH-2026-0123', 'c9', [['p3', 800]],                'cancelled', 'm5', -22,'low',  false, null, { price: 0, profit: 0, notes: 'Отменено клиентом — пересмотр объёма' }),
    mkShip('SH-2026-0122', 'c8', [['p2', 1100]],               'completed', 'm3', -25,'med',  false, null, { price: 286000, profit: 44000, notes: 'Новый клиент' }),
  ];
  return ships;
}

function mkShip(id, customerId, items, status, managerId, dayOffset, priority, delayed, delayReason, extra = {}) {
  const customer = CUSTOMERS.find(c => c.id === customerId);
  // The account manager owns the customer — they're the responsible salesperson.
  managerId = customer.accountManagerId;
  const products = items.map(([pid, qty]) => ({ productId: pid, qty }));
  const plannedDate = todayPlus(dayOffset);
  const totalQty = products.reduce((s, p) => s + p.qty, 0);

  // Approval state derived from status
  const approval = {
    deliveryApproved: ['preparing', 'docs', 'delivery', 'completed'].includes(status),
    receiptConfirmed: status === 'completed',
    approvedAt:    ['preparing', 'docs', 'delivery', 'completed'].includes(status) ? todayPlus(dayOffset - 3) + 'T10:24' : null,
    approvedBy:    ['preparing', 'docs', 'delivery', 'completed'].includes(status) ? managerId : null,
    changeRequests: [],
    comments: [],
  };

  // Documents state — print checklist for delivery
  const docKinds = [
    { id: 'd1', name: 'Упаковочный лист',           desc: 'Перечень товаров в отгрузке' },
    { id: 'd2', name: 'Счёт-фактура',                desc: 'Финансовый документ' },
    { id: 'd3', name: 'Товарная накладная ТОРГ-12',  desc: 'Передача товара клиенту' },
    { id: 'd4', name: 'Складской лист отбора',      desc: 'Для сборщика на складе' },
    { id: 'd5', name: 'Транспортная накладная (ТТН)', desc: 'Для перевозчика и водителя' },
  ];
  const allPrinted = ['docs', 'delivery', 'completed'].includes(status);
  const partlyPrinted = status === 'preparing';
  const docs = docKinds.map((d, i) => ({
    ...d,
    printed: allPrinted ? true : (partlyPrinted && i < 2),
  }));

  // Stock
  const stockRows = products.map(p => {
    const required = p.qty;
    const available = id === 'SH-2026-0130' ? Math.floor(required * 0.6) : Math.floor(required * (1.05 + Math.random() * 0.2));
    const reserved  = Math.min(required, available);
    const missing   = Math.max(0, required - available);
    const incoming  = missing > 0 ? Math.floor(missing * 1.3) : 0;
    const prod = PRODUCTS.find(pp => pp.id === p.productId);
    return {
      ...p,
      productName: prod.name,
      unit: prod.unit,
      code: prod.code,
      required, available, reserved, missing, incoming,
      batch: `B-${(2026)}-${(Math.floor(Math.random() * 9000) + 1000)}`,
      serial: `${prod.code}-${Math.floor(Math.random() * 99999).toString().padStart(5, '0')}`,
    };
  });

  // Delivery
  const delivery = {
    carrierId: ['delivery', 'completed'].includes(status) ? (['car1','car2','car4'][Math.floor(Math.random()*3)]) : null,
    trackingNumber: ['delivery', 'completed'].includes(status) ? `TR${Math.floor(Math.random()*9000000+1000000)}` : null,
    driver: ['delivery', 'completed'].includes(status) ? ['Иванов А.С.','Петров В.В.','Кузнецов И.М.'][Math.floor(Math.random()*3)] : null,
    vehicle: ['delivery', 'completed'].includes(status) ? ['А123МК 77','В456ОР 50','К789ЕМ 23'][Math.floor(Math.random()*3)] : null,
    dispatchDate: ['delivery', 'completed'].includes(status) ? todayPlus(dayOffset - 1) : null,
    eta: ['delivery'].includes(status) ? todayPlus(dayOffset + 1) : null,
    deliveryStatus: status === 'completed' ? 'delivered' : (status === 'delivery' ? (delayed ? 'transit' : 'transit') : 'pending'),
    proofOfDelivery: status === 'completed' ? 'POD-2026-' + Math.floor(Math.random()*9000+1000) : null,
  };

  // Audit
  const audit = buildAudit(id, status, managerId, dayOffset, delayed, delayReason);

  // History (previous shipments for same customer)
  const history = [];
  for (let i = 1; i <= 3; i++) {
    history.push({
      id: 'SH-2026-' + String(Math.floor(Math.random()*9000)+1000).padStart(4,'0'),
      date: todayPlus(dayOffset - 30 * i),
      productId: products[0].productId,
      qty: Math.floor(products[0].qty * (0.8 + Math.random() * 0.4)),
      price: Math.floor(products[0].qty * 180 * (0.8 + Math.random() * 0.4)),
    });
  }

  return {
    id, customerId, customer,
    products, totalQty,
    plannedDate,
    address: ADDRESSES[customerId],
    status,
    managerId,
    delayed,
    delayReason,
    priority,
    nextTask: NEXT_TASK_BY_STATUS[status],
    nextAction: NEXT_ACTION_BY_STATUS[status],
    approval, docs, stock: stockRows, delivery, audit, history,
    notes: extra.notes || null,
    price: extra.price || null,
    profit: extra.profit || null,
    warehouse: ['Склад МСК-1','Склад МСК-2','Склад СПБ'][customerId.charCodeAt(1)%3],
    createdAt: todayPlus(dayOffset - 7),
  };
}

function buildAudit(shipId, status, managerId, dayOffset, delayed, delayReason) {
  const mgr = MANAGERS.find(m => m.id === managerId);
  const events = [];
  let t = -7;
  events.push({ id: 'a' + (events.length+1), time: todayPlus(dayOffset + t) + 'T09:12', user: mgr.name, action: 'Создана отгрузка', detail: 'Импорт из плана поставок (план №2026-05-Q2)', kind: 'create' });
  if (['approval','preparing','docs','delivery','completed'].includes(status)) {
    t += 1;
    events.push({ id: 'a' + (events.length+1), time: todayPlus(dayOffset + t) + 'T11:30', user: mgr.name, action: 'Отправлено на согласование клиенту', detail: 'Запланировано → Ожидает согласования', kind: 'status' });
  }
  if (['preparing','docs','delivery','completed'].includes(status)) {
    t += 2;
    events.push({ id: 'a' + (events.length+1), time: todayPlus(dayOffset + t) + 'T14:08', user: mgr.name, action: 'Зафиксировано согласование клиента', detail: 'Согласовано по телефону, контактное лицо: Васильев П.А.', kind: 'approve' });
  }
  if (['docs','delivery','completed'].includes(status)) {
    t += 1;
    events.push({ id: 'a' + (events.length+1), time: todayPlus(dayOffset + t) + 'T10:42', user: mgr.name, action: 'Сформирован пакет документов', detail: 'Подготовка → Документы готовы', kind: 'docs' });
  }
  if (['delivery','completed'].includes(status)) {
    t += 1;
    events.push({ id: 'a' + (events.length+1), time: todayPlus(dayOffset + t) + 'T08:20', user: mgr.name, action: 'Выбран перевозчик и оформлена отгрузка', detail: 'Документы готовы → В доставке', kind: 'delivery' });
  }
  if (status === 'completed') {
    t += 2;
    events.push({ id: 'a' + (events.length+1), time: todayPlus(dayOffset + t) + 'T16:50', user: mgr.name, action: 'Получение подтверждено клиентом', detail: 'В доставке → Завершено', kind: 'complete' });
  }
  if (delayed) {
    events.push({ id: 'a' + (events.length+1), time: todayPlus(dayOffset - 1) + 'T15:00', user: mgr.name, action: 'Отгрузка помечена как задержанная', detail: 'Причина: ' + delayReason, kind: 'delay' });
  }
  return events.reverse();
}

const ALL_SHIPMENTS = buildShipments();

// "Today" tasks derived from active shipments
function buildTasks(shipments) {
  return shipments
    .filter(s => !['completed', 'cancelled'].includes(s.status))
    .map(s => ({
      id: 't-' + s.id,
      shipmentId: s.id,
      customerId: s.customerId,
      customer: s.customer,
      title: s.nextTask,
      status: s.status,
      plannedDate: s.plannedDate,
      dueDate: s.plannedDate,
      priority: s.priority,
      action: s.nextAction.label,
      managerId: s.managerId,
      delayed: s.delayed,
    }));
}

// ─── Customer rotation history ──────────────────────────────────────────
// For each (customer, category) we model a deliberate rotation pattern:
//   'balanced' — 2-3 strains used roughly evenly  → GREEN
//   'skewed'   — 2 strains but 5:1 split           → YELLOW
//   'mono'     — only 1 strain used                → RED (dangerous)
//   'none'     — customer doesn't buy this category
const ROTATION_PATTERNS = {
  c1: { 'Термофильные': 'mono',     'Мезофильные': 'balanced', 'Защитные': 'skewed',   'Ферменты': 'balanced' },
  c2: { 'Термофильные': 'balanced', 'Мезофильные': 'skewed',   'Защитные': 'balanced', 'Ферменты': 'mono' },
  c3: { 'Термофильные': 'skewed',   'Мезофильные': 'mono',     'Ферменты': 'balanced' },
  c4: { 'Термофильные': 'balanced', 'Мезофильные': 'balanced', 'Защитные': 'mono',     'Ферменты': 'skewed' },
  c5: { 'Термофильные': 'mono',     'Ферменты': 'mono' },
  c6: { 'Термофильные': 'balanced', 'Мезофильные': 'skewed',   'Пробиотики': 'mono' },
  c7: { 'Термофильные': 'skewed',   'Мезофильные': 'balanced' },
  c8: { 'Мезофильные': 'balanced', 'Ферменты': 'mono' },
  c9: { 'Термофильные': 'mono',    'Мезофильные': 'mono' },
  c10:{ 'Термофильные': 'balanced','Мезофильные': 'balanced', 'Защитные': 'balanced', 'Ферменты': 'balanced', 'Пробиотики': 'skewed' },
};

// ─── End-product applications ── what the client manufactures ──────────────────
const APPLICATIONS = [
  { id: 'yogurt',     name: 'Йогурт',                     icon: '🥛', cultures: ['p1', 'p9', 'p10'],   description: 'Термофильные закваски для йогурта' },
  { id: 'cheddar',    name: 'Сыр Чеддер',                 icon: '🧀', cultures: ['p7', 'p10'],         description: 'Твёрдые сыры' },
  { id: 'mozzarella', name: 'Моцарелла',                  icon: '🧀', cultures: ['p1', 'p10', 'p7'],   description: 'Сыры паста-филата' },
  { id: 'tvorog',     name: 'Творог',                     icon: '🥡', cultures: ['p3', 'p6', 'p11'],   description: 'Кисломолочные продукты' },
  { id: 'smetana',    name: 'Сметана',                    icon: '🥗', cultures: ['p6', 'p11', 'p2'],   description: 'Мезофильные закваски' },
  { id: 'kefir',      name: 'Кефир',                      icon: '🥤', cultures: ['p2', 'p11'],         description: 'Кефирные грибки' },
  { id: 'rennet',     name: 'Сыроварение (ферменты)', icon: '🪴', cultures: ['p5', 'p14', 'p15'], description: 'Сычужные ферменты' },
  { id: 'protect',    name: 'Защитные культуры',       icon: '🛡️', cultures: ['p4', 'p12', 'p13'], description: 'Продление срока хранения' },
];

// Per-customer applications: which end-products they manufacture, with rotation pattern
const CUSTOMER_APPLICATIONS = {
  c1: { yogurt: 'mono',     smetana: 'balanced', kefir: 'mono' },
  c2: { yogurt: 'balanced', tvorog: 'balanced',  smetana: 'skewed' },
  c3: { tvorog: 'mono',     smetana: 'balanced', kefir: 'skewed' },
  c4: { yogurt: 'balanced', cheddar: 'balanced', mozzarella: 'skewed', protect: 'mono' },
  c5: { cheddar: 'mono',    rennet: 'skewed' },
  c6: { yogurt: 'skewed',   tvorog: 'balanced',  rennet: 'balanced' },
  c7: { kefir: 'mono',      smetana: 'balanced', yogurt: 'skewed' },
  c8: { tvorog: 'skewed',   smetana: 'balanced' },
  c9: { cheddar: 'mono',    mozzarella: 'mono',  rennet: 'mono' },
  c10:{ yogurt: 'balanced', tvorog: 'balanced',  cheddar: 'balanced', protect: 'balanced' },
};

const ROTATION_NOTES = {
  mono: [
    'Клиент привык к этой культуре, не хочет менять',
    'Согласовано техническим директором — стабильный профиль',
    'Без изменений, как обычно',
    'Клиент сообщил об отличных результатах',
    'Параметры производства настроены под эту культуру',
    'Заявка по образцу прошлых поставок',
  ],
  skewed: [
    'Основная культура — стабильно',
    'Альтернативная закваска — пробная партия',
    'Стандартная отгрузка',
    'Без замечаний',
    'Менеджер обсудил замену с технологом клиента',
    'Заявка по плану',
  ],
  balanced: [
    'Очередная ротация',
    'Чередование согласно плану',
    'Альтернативная партия',
    'По графику ротации',
    'Профилактическая замена',
    'Обычный месячный заказ',
  ],
};

function pickCulturesForPattern(pattern, productsInCategory) {
  if (productsInCategory.length === 0) return [];
  if (pattern === 'mono') return [productsInCategory[0]];
  if (pattern === 'skewed') return productsInCategory.slice(0, 2);
  // balanced: 2 or 3
  return productsInCategory.slice(0, Math.min(3, productsInCategory.length));
}

function sequenceForPattern(pattern, cultures) {
  // Return an array of 8 productIds reflecting the pattern (newest first when reversed)
  const ids = cultures.map(c => c.id);
  if (pattern === 'mono')   return Array(8).fill(ids[0]);
  if (pattern === 'skewed') {
    // mostly first, 1-2 of second across 8 orders
    return [ids[0], ids[0], ids[1], ids[0], ids[0], ids[0], ids[1], ids[0]];
  }
  // balanced: rotating cycle
  if (ids.length >= 3) {
    return [ids[0], ids[1], ids[2], ids[0], ids[1], ids[2], ids[0], ids[1]];
  }
  return [ids[0], ids[1], ids[0], ids[1], ids[0], ids[1], ids[0], ids[1]];
}

// Build CUSTOMER_APP_HISTORY: customerId → { appId → array of orders, newest first }
function buildCustomerAppHistory() {
  const out = {};
  CUSTOMERS.forEach(cust => {
    const apps = CUSTOMER_APPLICATIONS[cust.id] || {};
    out[cust.id] = {};
    Object.entries(apps).forEach(([appId, pattern]) => {
      const app = APPLICATIONS.find(a => a.id === appId);
      if (!app) return;
      const cultures = pickCulturesForPattern(pattern, app.cultures.map(pid => PRODUCTS.find(p => p.id === pid)));
      const seq = sequenceForPattern(pattern, cultures);
      const notes = ROTATION_NOTES[pattern];
      const orders = seq.map((pid, i) => {
        const dayOffset = -(15 + i * 28 + (i * 17 % 6));
        const prod = PRODUCTS.find(p => p.id === pid);
        return {
          orderId: 'OR-2026-' + (1000 + cust.id.charCodeAt(1) * 100 + i).toString(),
          date: todayPlus(dayOffset),
          productId: pid,
          productName: prod.name,
          productCode: prod.code,
          qty: 600 + ((cust.id.charCodeAt(1) * 71 + i * 311) % 4400),
          unit: prod.unit,
          batch: 'B-2026-' + ((cust.id.charCodeAt(1) * 71 + i * 311) % 9000 + 1000),
          managerId: MANAGERS[i % MANAGERS.length].id,
          notes: notes[i % notes.length],
          status: 'completed',
        };
      });
      out[cust.id][appId] = orders;
    });
  });
  return out;
}

const CUSTOMER_APP_HISTORY = buildCustomerAppHistory();

// Categories list (for picker)
const CATEGORIES = Array.from(new Set(PRODUCTS.map(p => p.category)));

// Export to window so other scripts can read
window.SHIPMENT_DATA = {
  STATUSES, STATUS_ORDER, NEXT_TASK_BY_STATUS, NEXT_ACTION_BY_STATUS,
  MANAGERS, DIRECTOR, ALL_USERS,
  get CURRENT_USER() { return CURRENT_USER; },
  setCurrentUser(u) { CURRENT_USER = u; },
  CUSTOMERS, PRODUCTS, CARRIERS, PRIORITY,
  ALL_SHIPMENTS, buildTasks,
  APPLICATIONS, CUSTOMER_APPLICATIONS, CUSTOMER_APP_HISTORY, CATEGORIES,
  fmtDate, fmtDateTime, todayPlus,
};
