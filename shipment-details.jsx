// shipment-details.jsx — full shipment details page with all 7 tabs

function ShipmentDetails({ shipment, goto, updateShipment, advance, retreat, markDelayed, removeDelay, addAudit, layout, showToast }) {
  const { STATUSES, MANAGERS, PRODUCTS, CARRIERS, fmtDate, fmtDateTime, CURRENT_USER } = window.SHIPMENT_DATA;
  const [tab, setTab] = React.useState(() => {
    // Авто-выбор вкладки: на этапах «Подготовка» и «Документы» — сразу открываем чек-лист
    if (shipment && (shipment.status === 'preparing' || shipment.status === 'docs')) return 'docs';
    return 'overview';
  });
  const [delayModal, setDelayModal] = React.useState(false);
  const [cancelModal, setCancelModal] = React.useState(false);
  const [statusModal, setStatusModal] = React.useState(false);

  if (!shipment) {
    return (
      <>
        <Topbar crumbs={['Отгрузки', 'Не найдено']}/>
        <div className="content">
          <div className="empty">Отгрузка не найдена</div>
        </div>
      </>
    );
  }

  const mgr = MANAGERS.find(m => m.id === shipment.managerId);
  const tabs = [
    { key: 'overview',   label: 'Обзор' },
    { key: 'plan',       label: 'План и история' },
    { key: 'approval',   label: 'Согласование', count: shipment.approval.deliveryApproved && !shipment.approval.receiptConfirmed ? 1 : null },
    { key: 'stock',      label: 'Продукция и склад' },
    { key: 'docs',       label: 'Печать документов', count: shipment.docs.filter(d => !d.printed).length || null },
    { key: 'delivery',   label: 'Доставка' },
    { key: 'audit',      label: 'Журнал', count: null },
  ];

  return (
    <>
      <Topbar
        crumbs={['Отгрузки', shipment.id]}
        right={
          <>
            <button className="btn" onClick={() => retreat(shipment.id)} disabled={shipment.status === 'planned' || shipment.status === 'cancelled'}>
              <Icons.ArrowLeft w={14} h={14}/> Назад по этапу
            </button>
            <button className="btn" onClick={() => setStatusModal(true)}>
              <Icons.Refresh w={14} h={14}/> Изменить статус
            </button>
            {!shipment.delayed
              ? <button className="btn danger" onClick={() => setDelayModal(true)}><Icons.AlertTri w={14} h={14}/> Пометить задержку</button>
              : <button className="btn" onClick={() => { removeDelay(shipment.id); showToast('Метка задержки снята'); }}>Снять метку задержки</button>
            }
            {(shipment.status === 'approval' || shipment.status === 'preparing') && (
              <button className="btn danger" onClick={() => setCancelModal(true)}><Icons.Ban w={14} h={14}/> Отменить</button>
            )}
          </>
        }
      />

      <div className="content">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, gap: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span className="mono" style={{ color: 'var(--ink-500)', fontSize: 13 }}>{shipment.id}</span>
              <StatusBadge statusKey={shipment.status} big/>
              {shipment.delayed && <DelayBadge/>}
            </div>
            <h1 className="page-title" style={{ fontSize: 24 }}>{shipment.customer.name}</h1>
            <div style={{ display: 'flex', gap: 18, marginTop: 8, fontSize: 13, color: 'var(--ink-600)' }}>
              <span><Icons.Calendar w={13} h={13} style={{ verticalAlign: -2, marginRight: 4 }}/> План: <b style={{ color: 'var(--ink-900)' }}>{fmtDate(shipment.plannedDate)}</b></span>
              <span><Icons.Pin w={13} h={13} style={{ verticalAlign: -2, marginRight: 4 }}/> {shipment.customer.city}</span>
              <span><Icons.Warehouse w={13} h={13} style={{ verticalAlign: -2, marginRight: 4 }}/> {shipment.warehouse}</span>
              <span><Icons.Box w={13} h={13} style={{ verticalAlign: -2, marginRight: 4 }}/> {shipment.products.length} {shipment.products.length === 1 ? 'продукт' : 'продукта'} · {shipment.totalQty.toLocaleString('ru-RU')} ед.</span>
            </div>
          </div>
        </div>

        {/* Workflow timeline */}
        <div style={{ marginBottom: 20 }}>
          <WorkflowTimeline status={shipment.status} onJump={(k) => {
            const { STATUS_ORDER } = window.SHIPMENT_DATA;
            const ti = STATUS_ORDER.indexOf(k);
            const ci = STATUS_ORDER.indexOf(shipment.status);
            if (ti > ci) for (let i = 0; i < ti - ci; i++) advance(shipment.id);
            else if (ti < ci) for (let i = 0; i < ci - ti; i++) retreat(shipment.id);
          }}/>
        </div>

        {/* Delay banner */}
        {shipment.delayed && (
          <div className="alert error" style={{ marginBottom: 18 }}>
            <Icons.AlertTri className="alert-ic" w={16} h={16}/>
            <div>
              <b>Отгрузка помечена как задержанная.</b> {shipment.delayReason}
            </div>
          </div>
        )}

        {/* Next task card */}
        {shipment.status !== 'completed' && shipment.status !== 'cancelled' && (
          <div className="next-task" style={{ marginBottom: 22 }}>
            <div style={{ width: 44, height: 44, borderRadius: 11, background: 'rgba(23,165,99,.18)', color: 'var(--brand-green)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
              <Icons.CheckCircle w={22} h={22}/>
            </div>
            <div>
              <div className="nt-eyebrow">Следующая задача</div>
              <div className="nt-title">{shipment.nextTask}</div>
              <div className="nt-sub">После выполнения отгрузка перейдёт в статус «{STATUSES[shipment.nextAction.next]?.label}»</div>
            </div>
            <div className="nt-cta">
              <button className="btn primary lg" onClick={() => { advance(shipment.id); showToast(`Статус обновлён: ${STATUSES[shipment.nextAction.next].label}`); }}>
                {shipment.nextAction.label} <Icons.ArrowRight w={15} h={15}/>
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="tabs">
          {tabs.map(t => (
            <div key={t.key} className={`tab ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
              {t.label}
              {t.count != null && <span className="count">{t.count}</span>}
            </div>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'overview' && <OverviewTab shipment={shipment} onMarkDelayed={() => setDelayModal(true)} onRemoveDelay={() => { removeDelay(shipment.id); showToast('Метка задержки снята'); }}/>}
        {tab === 'plan'     && <PlanHistoryTab shipment={shipment} showToast={showToast}/>}
        {tab === 'approval' && <ApprovalTab shipment={shipment} updateShipment={updateShipment} advance={advance} showToast={showToast}/>}
        {tab === 'stock'    && <StockTab shipment={shipment} showToast={showToast}/>}
        {tab === 'docs'     && <DocsTab shipment={shipment} updateShipment={updateShipment} advance={advance} showToast={showToast}/>}
        {tab === 'delivery' && <DeliveryTab shipment={shipment} updateShipment={updateShipment} showToast={showToast}/>}
        {tab === 'audit'    && <AuditTab shipment={shipment}/>}
      </div>

      {/* Modals */}
      <DelayModal open={delayModal} onClose={() => setDelayModal(false)}
        onConfirm={(reason) => { markDelayed(shipment.id, reason); setDelayModal(false); showToast('Отгрузка помечена как задержанная'); }}
      />
      <CancelModal open={cancelModal} onClose={() => setCancelModal(false)}
        onConfirm={(reason) => {
          updateShipment(shipment.id, { status: 'cancelled', notes: 'Отменено: ' + reason });
          addAudit(shipment.id, { action: 'Отгрузка отменена', detail: 'Причина: ' + reason, kind: 'cancel' });
          setCancelModal(false); showToast('Отгрузка отменена'); goto('/shipments');
        }}
      />
      <StatusJumpModal open={statusModal} onClose={() => setStatusModal(false)}
        currentStatus={shipment.status}
        onPick={(newStatus) => {
          updateShipment(shipment.id, { status: newStatus });
          addAudit(shipment.id, { action: 'Статус изменён вручную', detail: `${STATUSES[shipment.status].label} → ${STATUSES[newStatus].label}`, kind: 'status' });
          setStatusModal(false);
          showToast('Статус обновлён');
        }}
      />
    </>
  );
}

// ─── Overview tab ──────────────────────────────────────────────────────
function OverviewTab({ shipment, onMarkDelayed, onRemoveDelay }) {
  const { MANAGERS, PRODUCTS, fmtDate } = window.SHIPMENT_DATA;
  const mgr = MANAGERS.find(m => m.id === shipment.managerId);

  return (
    <div className="detail-grid">
      <div>
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-header">
            <h3 className="card-title">Основные параметры</h3>
            <button className="btn ghost sm"><Icons.Edit w={13} h={13}/> Редактировать</button>
          </div>
          <div className="card-body">
            <dl className="dl">
              <dt>ID отгрузки</dt>          <dd className="mono">{shipment.id}</dd>
              <dt>Клиент</dt>                <dd>{shipment.customer.name}</dd>
              <dt>Адрес доставки</dt>        <dd>{shipment.address}</dd>
              <dt>Склад отправки</dt>        <dd>{shipment.warehouse}</dd>
              <dt>Плановая дата</dt>         <dd>{fmtDate(shipment.plannedDate)}</dd>
              <dt>Текущий статус</dt>        <dd><StatusBadge statusKey={shipment.status}/></dd>
              <dt>Создано</dt>               <dd>{fmtDate(shipment.createdAt)}</dd>
              <dt>Следующая задача</dt>      <dd>{shipment.nextTask}</dd>
            </dl>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h3 className="card-title">Состав отгрузки</h3></div>
          <div className="card-body flush">
            {shipment.products.map((p, i) => {
              const prod = PRODUCTS.find(pp => pp.id === p.productId);
              return (
                <div key={i} className="row-line">
                  <div style={{ width: 32, height: 32, borderRadius: 7, background: 'var(--brand-green-50)', color: 'var(--brand-green-700)', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 600 }}>
                    {prod.code.slice(0, 2)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="row-strong">{prod.name}</div>
                    <div className="row-meta">{prod.category} · код {prod.code}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{p.qty.toLocaleString('ru-RU')}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-500)' }}>{prod.unit}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div>
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-header"><h3 className="card-title">Управление задержкой</h3></div>
          <div className="card-body">
            {shipment.delayed ? (
              <>
                <div className="alert error" style={{ marginBottom: 12 }}>
                  <Icons.AlertTri className="alert-ic" w={15} h={15}/>
                  <div><b>Помечена как задержанная.</b><br/><span style={{ fontSize: 12.5 }}>{shipment.delayReason}</span></div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn" onClick={onMarkDelayed}>Изменить причину</button>
                  <button className="btn" onClick={onRemoveDelay}>Снять метку</button>
                </div>
              </>
            ) : (
              <>
                <p style={{ fontSize: 13, color: 'var(--ink-600)', margin: '0 0 12px' }}>
                  Отгрузка идёт по плану. Пометьте задержку, если возникли проблемы с согласованием, остатками или доставкой.
                </p>
                <button className="btn danger" onClick={onMarkDelayed} style={{ width: '100%' }}>
                  <Icons.AlertTri w={14} h={14}/> Пометить как задержанную
                </button>
              </>
            )}
          </div>
        </div>

        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-header"><h3 className="card-title">Сводка по отгрузке</h3></div>
          <div className="card-body">
            <ProgressMeter shipment={shipment}/>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h3 className="card-title">Контакты клиента</h3></div>
          <div className="card-body">
            <div style={{ fontSize: 13 }}>
              <div style={{ marginBottom: 10 }}>
                <div style={{ color: 'var(--ink-500)', fontSize: 12 }}>Контактное лицо</div>
                <div style={{ fontWeight: 550 }}>Васильев Павел Александрович</div>
                <div style={{ color: 'var(--ink-500)', fontSize: 12 }}>Менеджер по закупкам</div>
              </div>
              <div style={{ marginBottom: 10 }}>
                <div style={{ color: 'var(--ink-500)', fontSize: 12 }}>Телефон</div>
                <div className="mono">+7 (495) 123-45-67</div>
              </div>
              <div>
                <div style={{ color: 'var(--ink-500)', fontSize: 12 }}>Email</div>
                <div>vasilyev@{shipment.customer.short.toLowerCase().replace(/\s/g,'')}.ru</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgressMeter({ shipment }) {
  const { STATUS_ORDER } = window.SHIPMENT_DATA;
  const idx = STATUS_ORDER.indexOf(shipment.status);
  const pct = shipment.status === 'completed' ? 100 : shipment.status === 'cancelled' ? 0 : Math.round((idx / (STATUS_ORDER.length - 1)) * 100);
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
        <span style={{ color: 'var(--ink-500)' }}>Выполнено этапов</span>
        <span style={{ fontWeight: 600 }}>{pct}%</span>
      </div>
      <div style={{ height: 6, background: 'var(--ink-150)', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: pct + '%', background: 'var(--brand-green)', transition: 'width .3s' }}></div>
      </div>
      <div style={{ marginTop: 14, fontSize: 12.5, color: 'var(--ink-600)' }}>
        Этап {idx + 1} из {STATUS_ORDER.length}: <b style={{ color: 'var(--ink-900)' }}>{window.SHIPMENT_DATA.STATUSES[shipment.status].label}</b>
      </div>
    </>
  );
}

// ─── Plan & History tab ─────────────────────────────────────────────────
function PlanHistoryTab({ shipment, showToast }) {
  const { PRODUCTS, fmtDate } = window.SHIPMENT_DATA;
  const firstProduct = PRODUCTS.find(p => p.id === shipment.products[0].productId);
  const currentQty = shipment.products[0].qty;
  const avgHistorical = Math.round(shipment.history.reduce((s, h) => s + h.qty, 0) / shipment.history.length);
  const recommended = Math.round(avgHistorical * 1.25);

  return (
    <div className="detail-grid">
      <div>
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-header">
            <h3 className="card-title">Загруженный план отгрузки</h3>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="btn sm"><Icons.Eye w={13} h={13}/> Открыть</button>
              <button className="btn sm"><Icons.Download w={13} h={13}/> Скачать</button>
            </div>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 0 14px', borderBottom: '1px solid var(--ink-150)', marginBottom: 14 }}>
              <div style={{ width: 44, height: 56, background: 'var(--st-delayed-bg)', borderRadius: 6, display: 'grid', placeItems: 'center', color: 'var(--st-delayed)' }}>
                <Icons.File w={20} h={20}/>
              </div>
              <div>
                <div style={{ fontWeight: 550, fontSize: 13.5 }}>План_поставок_2026-05-Q2.xlsx</div>
                <div style={{ fontSize: 12, color: 'var(--ink-500)', marginTop: 2 }}>Загружено 15.05.2026 · 248 КБ · автор: Соколова А.</div>
              </div>
              <span className="badge b-completed" style={{ marginLeft: 'auto' }}><Icons.Check w={12} h={12}/> Импортирован</span>
            </div>

            <div className="alert info" style={{ marginBottom: 14 }}>
              <Icons.Info className="alert-ic" w={15} h={15}/>
              <div>Можно вносить корректировки в течение 5 дней с момента создания отгрузки. После — потребуется создать новый заказ (приход ~2 месяца).</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="field">
                <label>Плановая дата</label>
                <input className="input" defaultValue={fmtDate(shipment.plannedDate)}/>
              </div>
              <div className="field">
                <label>Количество ({firstProduct.unit})</label>
                <input className="input" defaultValue={currentQty}/>
              </div>
              <div className="field" style={{ gridColumn: '1 / -1' }}>
                <label>Адрес доставки</label>
                <input className="input" defaultValue={shipment.address}/>
              </div>
              <div className="field" style={{ gridColumn: '1 / -1' }}>
                <label>Комментарий менеджера</label>
                <textarea className="textarea" placeholder="Заметки по параметрам отгрузки..."/>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              <button className="btn primary" onClick={() => showToast('Параметры обновлены')}>Сохранить изменения</button>
              <button className="btn">Отменить</button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h3 className="card-title">История отгрузок этому клиенту</h3></div>
          <div className="card-body flush">
            <table className="tbl">
              <thead>
                <tr><th>Дата</th><th>Продукт</th><th>Количество</th><th>Сумма</th></tr>
              </thead>
              <tbody>
                {shipment.history.map((h, i) => {
                  const p = PRODUCTS.find(pp => pp.id === h.productId);
                  return (
                    <tr key={i}>
                      <td className="muted">{fmtDate(h.date)}</td>
                      <td className="strong">{p.name}</td>
                      <td>{h.qty.toLocaleString('ru-RU')} {p.unit}</td>
                      <td>{h.price.toLocaleString('ru-RU')} ₽</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div>
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-header"><h3 className="card-title">Анализ объёма</h3></div>
          <div className="card-body">
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: 'var(--ink-500)', marginBottom: 4 }}>Текущая отгрузка</div>
              <div style={{ fontSize: 22, fontWeight: 600, color: 'var(--ink-900)' }}>{currentQty.toLocaleString('ru-RU')} {firstProduct.unit}</div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: 'var(--ink-500)', marginBottom: 4 }}>Среднее за прошлые поставки</div>
              <div style={{ fontSize: 18, fontWeight: 550, color: 'var(--ink-700)' }}>{avgHistorical.toLocaleString('ru-RU')} {firstProduct.unit}</div>
            </div>
            {currentQty > avgHistorical * 1.3 ? (
              <div className="alert warn"><Icons.AlertTri className="alert-ic" w={14} h={14}/><div><b>Объём выше среднего на {Math.round((currentQty/avgHistorical-1)*100)}%</b><br/><span style={{ fontSize: 12.5 }}>Проверьте остатки и уточните потребность клиента.</span></div></div>
            ) : currentQty < avgHistorical * 0.7 ? (
              <div className="alert info"><Icons.Info className="alert-ic" w={14} h={14}/><div><b>Объём ниже среднего</b><br/><span style={{ fontSize: 12.5 }}>Возможно, изменился ассортимент клиента.</span></div></div>
            ) : (
              <div className="alert success"><Icons.Check className="alert-ic" w={14} h={14}/><div><b>Объём в норме</b><br/><span style={{ fontSize: 12.5 }}>Близко к среднему за прошлые поставки.</span></div></div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h3 className="card-title">Заявка на пополнение</h3></div>
          <div className="card-body">
            <p style={{ fontSize: 12.5, color: 'var(--ink-600)', margin: '0 0 12px', lineHeight: 1.55 }}>
              Заявки формируются ежемесячно. Срок прихода ~2 месяца. Рекомендуемый объём = среднее × 1.25 (страховой запас).
            </p>
            <div className="dl" style={{ gridTemplateColumns: '1fr auto', rowGap: 8, fontSize: 12.5 }}>
              <dt>Продукт</dt><dd>{firstProduct.code}</dd>
              <dt>Среднее</dt><dd>{avgHistorical.toLocaleString('ru-RU')}</dd>
              <dt>Запас 25%</dt><dd>+{Math.round(avgHistorical * 0.25).toLocaleString('ru-RU')}</dd>
              <dt><b>К заказу</b></dt><dd><b style={{ color: 'var(--brand-green-700)' }}>{recommended.toLocaleString('ru-RU')} {firstProduct.unit}</b></dd>
            </div>
            <button className="btn primary" style={{ width: '100%', marginTop: 14 }} onClick={() => showToast('Создана заявка на пополнение')}>
              <Icons.Plus w={14} h={14}/> Создать заявку
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Approval tab ───────────────────────────────────────────────────────
function ApprovalTab({ shipment, updateShipment, advance, showToast }) {
  const [comment, setComment] = React.useState('');
  const a = shipment.approval;
  const { MANAGERS, fmtDateTime } = window.SHIPMENT_DATA;
  const mgr = a.approvedBy ? MANAGERS.find(m => m.id === a.approvedBy) : null;

  return (
    <div className="detail-grid">
      <div>
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-header"><h3 className="card-title">Процесс согласования</h3></div>
          <div className="card-body">
            <div className="approval-step">
              <div className={`approval-dot ${a.deliveryApproved ? 'done' : (shipment.status === 'approval' ? 'active' : '')}`}>
                {a.deliveryApproved ? <Icons.Check w={13} h={13}/> : '1'}
              </div>
              <div style={{ flex: 1 }}>
                <div className="approval-title">Согласование плановой доставки</div>
                <div className="approval-meta">
                  {a.deliveryApproved
                    ? <>Согласовано · {mgr && <>{mgr.name} · </>}{fmtDateTime(a.approvedAt)}</>
                    : 'Клиент должен подтвердить дату, объём и адрес доставки'}
                </div>
                {!a.deliveryApproved && (
                  <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
                    <button className="btn primary sm" onClick={() => {
                      updateShipment(shipment.id, { approval: { ...a, deliveryApproved: true, approvedAt: '2026-05-26T12:30', approvedBy: 'm1' } });
                      if (shipment.status === 'approval') advance(shipment.id);
                      showToast('Согласование зафиксировано');
                    }}>
                      <Icons.Check w={12} h={12}/> Зафиксировать согласование
                    </button>
                    <button className="btn sm">Запросить изменения</button>
                  </div>
                )}
              </div>
            </div>

            <div className="approval-step">
              <div className={`approval-dot ${a.receiptConfirmed ? 'done' : (shipment.status === 'delivery' ? 'active' : '')}`}>
                {a.receiptConfirmed ? <Icons.Check w={13} h={13}/> : '2'}
              </div>
              <div style={{ flex: 1 }}>
                <div className="approval-title">Подтверждение получения после доставки</div>
                <div className="approval-meta">
                  {a.receiptConfirmed
                    ? 'Клиент подтвердил получение продукции'
                    : 'Будет доступно после прибытия груза к клиенту'}
                </div>
                {shipment.status === 'delivery' && !a.receiptConfirmed && (
                  <div style={{ marginTop: 10 }}>
                    <button className="btn primary sm" onClick={() => {
                      updateShipment(shipment.id, { approval: { ...a, receiptConfirmed: true } });
                      advance(shipment.id);
                      showToast('Получение подтверждено');
                    }}>
                      <Icons.CheckCircle w={12} h={12}/> Зафиксировать получение
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h3 className="card-title">Комментарии и запросы на изменения</h3></div>
          <div className="card-body">
            <div style={{ padding: '12px 14px', background: 'var(--ink-50)', borderRadius: 8, marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <Avatar manager={window.SHIPMENT_DATA.MANAGERS[0]} size={22}/>
                <span style={{ fontWeight: 550, fontSize: 13 }}>Анна Соколова</span>
                <span style={{ fontSize: 11.5, color: 'var(--ink-500)' }}>23.05.2026, 14:08</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--ink-700)' }}>
                Связалась с Васильевым П.А. — согласовал дату, попросил уточнить количество HOLDBAC. Жду подтверждение по почте.
              </div>
            </div>

            <div className="field">
              <textarea className="textarea" placeholder="Добавить комментарий..." value={comment} onChange={e => setComment(e.target.value)}/>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <button className="btn primary" onClick={() => { showToast('Комментарий добавлен'); setComment(''); }}>
                <Icons.Comment w={13} h={13}/> Добавить комментарий
              </button>
              <button className="btn">Создать напоминание</button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-header"><h3 className="card-title">Статус согласования</h3></div>
          <div className="card-body">
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: 'var(--ink-500)' }}>Согласование доставки</div>
              <div style={{ marginTop: 4 }}>
                {a.deliveryApproved
                  ? <span className="badge b-completed"><Icons.Check w={11} h={11}/> Согласовано</span>
                  : <span className="badge b-approval"><Icons.Clock w={11} h={11}/> Ожидается</span>}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--ink-500)' }}>Подтверждение получения</div>
              <div style={{ marginTop: 4 }}>
                {a.receiptConfirmed
                  ? <span className="badge b-completed"><Icons.Check w={11} h={11}/> Подтверждено</span>
                  : <span className="badge b-neutral"><Icons.Clock w={11} h={11}/> Не подтверждено</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h3 className="card-title">Напоминание клиенту</h3></div>
          <div className="card-body">
            <p style={{ fontSize: 12.5, color: 'var(--ink-600)', margin: '0 0 12px', lineHeight: 1.55 }}>
              Если клиент не отвечает дольше 24 часов, система создаст напоминание-задачу.
            </p>
            <button className="btn" style={{ width: '100%' }} onClick={() => showToast('Напоминание создано')}>
              <Icons.Bell w={13} h={13}/> Создать напоминание сейчас
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Stock tab ─────────────────────────────────────────────────────────
function StockTab({ shipment, showToast }) {
  const hasMissing = shipment.stock.some(s => s.missing > 0);
  return (
    <>
      {hasMissing && (
        <div className="alert error" style={{ marginBottom: 16 }}>
          <Icons.AlertTri className="alert-ic" w={16} h={16}/>
          <div>
            <b>Нехватка на складе.</b> Часть продукции отсутствует — создайте заявку на пополнение.
            <button className="btn sm" style={{ marginLeft: 12 }} onClick={() => showToast('Создана заявка на пополнение')}>
              <Icons.Plus w={12} h={12}/> Создать заявку
            </button>
          </div>
        </div>
      )}

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header">
          <h3 className="card-title">Продукция и остатки</h3>
          <span className="muted" style={{ fontSize: 12 }}>{shipment.warehouse}</span>
        </div>
        <div className="card-body flush">
          <table className="tbl">
            <thead>
              <tr>
                <th>Продукт</th>
                <th>Требуется</th>
                <th>Доступно</th>
                <th>Зарезервировано</th>
                <th>Нехватка</th>
                <th>В пути</th>
                <th>Партия</th>
                <th>Серийный №</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {shipment.stock.map((r, i) => {
                const pct = Math.min(100, Math.round((r.available / r.required) * 100));
                const cls = r.missing > 0 ? (pct < 60 ? 'danger' : 'warn') : '';
                return (
                  <tr key={i}>
                    <td>
                      <div className="strong" style={{ fontSize: 13 }}>{r.productName}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--ink-500)' }}>код {r.code}</div>
                    </td>
                    <td>{r.required.toLocaleString('ru-RU')} {r.unit}</td>
                    <td>
                      <div>{r.available.toLocaleString('ru-RU')}</div>
                      <div className={`stock-bar ${cls}`} style={{ marginTop: 4, width: 100 }}><i style={{ width: pct + '%' }}></i></div>
                    </td>
                    <td>{r.reserved.toLocaleString('ru-RU')}</td>
                    <td style={{ color: r.missing > 0 ? 'var(--st-delayed)' : 'var(--ink-500)', fontWeight: r.missing > 0 ? 550 : 400 }}>
                      {r.missing > 0 ? r.missing.toLocaleString('ru-RU') : '—'}
                    </td>
                    <td className="muted">{r.incoming > 0 ? r.incoming.toLocaleString('ru-RU') : '—'}</td>
                    <td className="mono">{r.batch}</td>
                    <td className="mono">{r.serial}</td>
                    <td>
                      {r.missing > 0
                        ? <button className="btn sm" onClick={() => showToast('Создана заявка на пополнение')}><Icons.Plus w={11} h={11}/></button>
                        : <span className="badge b-completed">OK</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="alert info">
        <Icons.Info className="alert-ic" w={15} h={15}/>
        <div>
          <b>Правила:</b> Корректировка заказа возможна в течение 5 дней после создания. По истечении — требуется новый заказ (приход ~2 месяца).
          Частичная отгрузка в MVP не поддерживается — собираем заказ полностью.
        </div>
      </div>
    </>
  );
}

// ─── Docs tab ──────────────────────────────────────────────────────────
function DocsTab({ shipment, updateShipment, advance, showToast }) {
  const docs = shipment.docs;
  const printedCount = docs.filter(d => d.printed).length;
  const allPrinted = printedCount === docs.length;
  const pct = Math.round((printedCount / docs.length) * 100);

  const togglePrinted = (id, val) => {
    updateShipment(shipment.id, { docs: docs.map(x => x.id === id ? { ...x, printed: val } : x) });
  };

  return (
    <div className="detail-grid">
      <div>
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Чек-лист печати документов</h3>
              <div style={{ fontSize: 12, color: 'var(--ink-500)', marginTop: 2 }}>Отметьте каждый документ после распечатки</div>
            </div>
            {!allPrinted && printedCount > 0 && (
              <button className="btn sm" onClick={() => {
                updateShipment(shipment.id, { docs: docs.map(d => ({ ...d, printed: true })) });
                showToast('Все документы отмечены как распечатанные');
              }}><Icons.Check w={12} h={12}/> Отметить все</button>
            )}
          </div>
          <div className="card-body flush">
            {docs.map((d, i) => (
              <div key={d.id} className="row-line" style={{ padding: '14px 18px', alignItems: 'center', cursor: 'pointer' }} onClick={() => togglePrinted(d.id, !d.printed)}>
                <div className={`task-check ${d.printed ? 'done' : ''}`} style={{ flexShrink: 0 }}>
                  {d.printed && <Icons.Check w={13} h={13}/>}
                </div>
                <div style={{ width: 36, height: 44, borderRadius: 5, display: 'grid', placeItems: 'center', flexShrink: 0,
                  background: d.printed ? 'var(--brand-green-50)' : 'var(--ink-100)',
                  color: d.printed ? 'var(--brand-green-700)' : 'var(--ink-500)',
                }}>
                  <Icons.Doc w={18} h={18}/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="row-strong" style={{ fontSize: 13.5, textDecoration: d.printed ? 'line-through' : 'none', color: d.printed ? 'var(--ink-500)' : 'var(--ink-900)' }}>
                    {i + 1}. {d.name}
                  </div>
                  <div className="row-meta">{d.desc}</div>
                </div>
                <button className="btn sm" onClick={(e) => { e.stopPropagation(); togglePrinted(d.id, !d.printed); }}>
                  {d.printed ? 'Отменить' : 'Отметить'}
                </button>
                {d.printed
                  ? <span className="badge b-completed" style={{ flexShrink: 0 }}><Icons.Check w={11} h={11}/> Распечатан</span>
                  : <span className="badge b-neutral" style={{ flexShrink: 0 }}>Не распечатан</span>
                }
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-header"><h3 className="card-title">Прогресс печати</h3></div>
          <div className="card-body">
            <div style={{ fontSize: 30, fontWeight: 650, letterSpacing: '-.02em', color: allPrinted ? 'var(--brand-green-700)' : 'var(--ink-900)', lineHeight: 1.1 }}>
              {printedCount}<span style={{ color: 'var(--ink-400)', fontWeight: 500 }}>/{docs.length}</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--ink-600)', marginTop: 2 }}>распечатано</div>

            <div style={{ marginTop: 14, height: 6, background: 'var(--ink-150)', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: pct + '%', background: 'var(--brand-green)', transition: 'width .25s' }}></div>
            </div>

            <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--ink-150)' }}>
              {allPrinted
                ? <>
                    <div className="alert success" style={{ marginBottom: 12 }}>
                      <Icons.Check className="alert-ic" w={14} h={14}/>
                      <div>Все документы распечатаны. Можно переходить к доставке.</div>
                    </div>
                    {shipment.status !== 'delivery' && shipment.status !== 'completed' && (
                      <button className="btn primary" style={{ width: '100%' }} onClick={() => { advance(shipment.id); showToast('Переведено в «В доставке»'); }}>
                        Перейти к доставке <Icons.ArrowRight w={14} h={14}/>
                      </button>
                    )}
                  </>
                : <div className="alert warn">
                    <Icons.AlertTri className="alert-ic" w={14} h={14}/>
                    <div>Осталось распечатать {docs.length - printedCount} документов перед передачей в доставку.</div>
                  </div>
              }
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h3 className="card-title">Как работать со списком</h3></div>
          <div className="card-body">
            <p style={{ fontSize: 12.5, color: 'var(--ink-600)', margin: 0, lineHeight: 1.55 }}>
              Нажмите на строку, чтобы отметить документ как распечатанный. Когда все 5 отмечены — отгрузку можно переводить в «В доставке».
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Delivery tab ───────────────────────────────────────────────────────
function DeliveryTab({ shipment, updateShipment, showToast }) {
  const { CARRIERS, fmtDate } = window.SHIPMENT_DATA;
  const d = shipment.delivery;
  const carrier = d.carrierId ? CARRIERS.find(c => c.id === d.carrierId) : null;

  const deliveryStatuses = [
    { k: 'pending',  l: 'Готов к отправке',    color: 'var(--st-planned)' },
    { k: 'dispatched', l: 'Отгружен',          color: 'var(--st-preparing)' },
    { k: 'transit',  l: 'В пути',              color: 'var(--st-delivery)' },
    { k: 'delivered',l: 'Доставлен',           color: 'var(--st-completed)' },
    { k: 'failed',   l: 'Неудачная доставка',  color: 'var(--st-delayed)' },
    { k: 'returned', l: 'Возвращён',           color: 'var(--st-cancelled)' },
  ];
  const curDs = deliveryStatuses.find(s => s.k === d.deliveryStatus) || deliveryStatuses[0];

  return (
    <div className="detail-grid">
      <div>
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-header">
            <h3 className="card-title">Выбор перевозчика</h3>
            {carrier && <span className="badge b-completed"><Icons.Check w={11} h={11}/> Выбран</span>}
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              {CARRIERS.map(c => (
                <div key={c.id} style={{
                  padding: 12,
                  border: `1.5px solid ${d.carrierId === c.id ? 'var(--brand-green)' : 'var(--ink-200)'}`,
                  borderRadius: 8,
                  cursor: 'pointer',
                  background: d.carrierId === c.id ? 'var(--brand-green-50)' : 'var(--white)',
                  boxShadow: d.carrierId === c.id ? '0 0 0 3px var(--brand-green-50)' : 'none',
                }} onClick={() => {
                  updateShipment(shipment.id, { delivery: { ...d, carrierId: c.id } });
                  showToast(`Выбран перевозчик: ${c.name}`);
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--brand-navy)', color: 'var(--brand-green)', display: 'grid', placeItems: 'center' }}>
                      <Icons.Truck w={14} h={14}/>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{c.name}</div>
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--ink-500)' }}>{c.kind} · {c.sla}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-header"><h3 className="card-title">Данные доставки</h3></div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="field">
                <label>Трек-номер</label>
                <input className="input mono" defaultValue={d.trackingNumber || ''} placeholder="TR-XXXXXXX"/>
              </div>
              <div className="field">
                <label>Дата отгрузки</label>
                <input className="input" defaultValue={d.dispatchDate ? fmtDate(d.dispatchDate) : ''} placeholder="ДД.ММ.ГГГГ"/>
              </div>
              <div className="field">
                <label>Водитель</label>
                <input className="input" defaultValue={d.driver || ''} placeholder="ФИО водителя"/>
              </div>
              <div className="field">
                <label>Транспорт</label>
                <input className="input mono" defaultValue={d.vehicle || ''} placeholder="Номер автомобиля"/>
              </div>
              <div className="field">
                <label>ETA</label>
                <input className="input" defaultValue={d.eta ? fmtDate(d.eta) : ''} placeholder="ДД.ММ.ГГГГ"/>
              </div>
              <div className="field">
                <label>Адрес доставки</label>
                <input className="input" defaultValue={shipment.address} readOnly/>
              </div>
            </div>
            <button className="btn primary" style={{ marginTop: 14 }} onClick={() => showToast('Данные доставки сохранены')}>
              Сохранить данные доставки
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h3 className="card-title">Подтверждение получения</h3></div>
          <div className="card-body">
            {d.proofOfDelivery ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 12, background: 'var(--brand-green-50)', border: '1px solid var(--brand-green-100)', borderRadius: 8 }}>
                <div style={{ width: 36, height: 44, background: 'var(--white)', borderRadius: 6, display: 'grid', placeItems: 'center', color: 'var(--brand-green-700)' }}>
                  <Icons.Doc w={18} h={18}/>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 550, fontSize: 13 }}>{d.proofOfDelivery}.pdf</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-600)' }}>Загружен · подпись клиента</div>
                </div>
                <button className="btn sm"><Icons.Eye w={12} h={12}/> Открыть</button>
              </div>
            ) : (
              <div style={{ border: '2px dashed var(--ink-200)', borderRadius: 8, padding: 22, textAlign: 'center', cursor: 'pointer' }} onClick={() => showToast('Подтверждение загружено')}>
                <Icons.Upload w={20} h={20} className="muted" style={{ marginBottom: 8 }}/>
                <div style={{ fontSize: 13, fontWeight: 550 }}>Загрузить подтверждение</div>
                <div style={{ fontSize: 12, color: 'var(--ink-500)', marginTop: 2 }}>Подписанный документ от клиента</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-header"><h3 className="card-title">Статус доставки</h3></div>
          <div className="card-body">
            <div style={{ marginBottom: 12 }}>
              <span className="badge lg" style={{ background: curDs.color + '20', color: curDs.color }}>
                <span className="dot" style={{ background: curDs.color }}></span>
                {curDs.l}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {deliveryStatuses.map(s => (
                <button key={s.k}
                  className={`btn sm ${d.deliveryStatus === s.k ? 'primary' : ''}`}
                  style={{ justifyContent: 'flex-start', width: '100%' }}
                  onClick={() => {
                    updateShipment(shipment.id, { delivery: { ...d, deliveryStatus: s.k } });
                    showToast(`Доставка: ${s.l}`);
                  }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: s.color, marginRight: 4 }}></span>
                  {s.l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Audit tab ──────────────────────────────────────────────────────────
function AuditTab({ shipment }) {
  const { MANAGERS, fmtDateTime } = window.SHIPMENT_DATA;
  const iconForKind = (k) => {
    switch (k) {
      case 'create':   return { ic: <Icons.Plus w={14} h={14}/>, cls: '' };
      case 'status':   return { ic: <Icons.Refresh w={14} h={14}/>, cls: 'blue' };
      case 'approve':  return { ic: <Icons.Check w={14} h={14}/>, cls: 'green' };
      case 'docs':     return { ic: <Icons.Doc w={14} h={14}/>, cls: 'purple' };
      case 'delivery': return { ic: <Icons.Truck w={14} h={14}/>, cls: 'amber' };
      case 'complete': return { ic: <Icons.CheckCircle w={14} h={14}/>, cls: 'green' };
      case 'delay':    return { ic: <Icons.AlertTri w={14} h={14}/>, cls: 'red' };
      case 'cancel':   return { ic: <Icons.Ban w={14} h={14}/>, cls: 'red' };
      default:         return { ic: <Icons.Edit w={14} h={14}/>, cls: '' };
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Журнал изменений</h3>
        <button className="btn sm"><Icons.Download w={12} h={12}/> Экспорт</button>
      </div>
      <div className="card-body">
        {shipment.audit.length === 0 ? (
          <div className="empty">Журнал пуст</div>
        ) : shipment.audit.map(a => {
          const ico = iconForKind(a.kind);
          return (
            <div key={a.id} className="audit-item">
              <div className={`audit-ic ${ico.cls}`}>{ico.ic}</div>
              <div>
                <div className="audit-action">{a.action}</div>
                <div className="audit-detail">{a.detail}</div>
                <div style={{ fontSize: 11.5, color: 'var(--ink-400)', marginTop: 4 }}>{a.user}</div>
              </div>
              <div className="audit-time">{fmtDateTime(a.time)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Modals ─────────────────────────────────────────────────────────────
function DelayModal({ open, onClose, onConfirm }) {
  const [reason, setReason] = React.useState('');
  React.useEffect(() => { if (open) setReason(''); }, [open]);
  return (
    <Modal open={open} onClose={onClose} title="Пометить как задержанную"
      footer={<>
        <button className="btn" onClick={onClose}>Отмена</button>
        <button className="btn primary" disabled={!reason.trim()} onClick={() => onConfirm(reason)}>Пометить</button>
      </>}>
      <p style={{ margin: '0 0 12px' }}>Укажите причину задержки. Метка появится в дашборде и в списке отгрузок.</p>
      <div className="field">
        <label>Причина задержки</label>
        <textarea className="textarea" placeholder="Клиент не отвечает, проблемы с поставкой, погода..."
                  value={reason} onChange={e => setReason(e.target.value)}/>
      </div>
    </Modal>
  );
}

function CancelModal({ open, onClose, onConfirm }) {
  const [reason, setReason] = React.useState('');
  React.useEffect(() => { if (open) setReason(''); }, [open]);
  return (
    <Modal open={open} onClose={onClose} title="Отменить отгрузку"
      footer={<>
        <button className="btn" onClick={onClose}>Не отменять</button>
        <button className="btn danger" disabled={!reason.trim()} onClick={() => onConfirm(reason)}>Отменить отгрузку</button>
      </>}>
      <div className="alert warn" style={{ marginBottom: 14 }}>
        <Icons.AlertTri className="alert-ic" w={15} h={15}/>
        <div>Отгрузка перейдёт в статус «Отменено» и попадёт в историю. Это действие нельзя отменить.</div>
      </div>
      <div className="field">
        <label>Причина отмены</label>
        <textarea className="textarea" placeholder="Клиент отказался, пересмотр объёма..."
                  value={reason} onChange={e => setReason(e.target.value)}/>
      </div>
    </Modal>
  );
}

function StatusJumpModal({ open, onClose, currentStatus, onPick }) {
  const { STATUSES, STATUS_ORDER } = window.SHIPMENT_DATA;
  return (
    <Modal open={open} onClose={onClose} title="Изменить статус вручную"
      footer={<button className="btn" onClick={onClose}>Закрыть</button>}>
      <p style={{ margin: '0 0 14px' }}>Выберите статус, в который нужно перевести отгрузку. Доступен возврат назад и пропуск этапов.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {STATUS_ORDER.map(k => {
          const s = STATUSES[k];
          const isCurrent = k === currentStatus;
          return (
            <button key={k}
              className="btn"
              disabled={isCurrent}
              style={{ justifyContent: 'space-between', width: '100%', height: 42 }}
              onClick={() => onPick(k)}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <StatusBadge statusKey={k}/>
                {isCurrent && <span className="muted" style={{ fontSize: 12 }}>текущий</span>}
              </span>
              {!isCurrent && <Icons.ArrowRight w={14} h={14}/>}
            </button>
          );
        })}
      </div>
    </Modal>
  );
}

Object.assign(window, { ShipmentDetails });
