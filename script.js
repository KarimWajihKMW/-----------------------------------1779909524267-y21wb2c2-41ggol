const app = document.getElementById('app');
const modal = document.getElementById('crudModal');
const modalTitle = document.getElementById('modalTitle');
const crudForm = document.getElementById('crudForm');

const datasets = {
  schools: [
    { id: 1, name: 'مدارس الروافد الدولية', branch: 'القاهرة الجديدة', departments: 8, students: 1840, status: 'نشط', plan: 'مؤسسي' },
    { id: 2, name: 'أكاديمية النخبة', branch: 'الشيخ زايد', departments: 5, students: 920, status: 'تجديد قريب', plan: 'احترافي' },
    { id: 3, name: 'مدرسة دار الهدى', branch: 'المنصورة', departments: 6, students: 1130, status: 'نشط', plan: 'احترافي' },
    { id: 4, name: 'معهد الإتقان', branch: 'الإسكندرية', departments: 4, students: 610, status: 'معلّق', plan: 'أساسي' },
    { id: 5, name: 'مدارس براعم المستقبل', branch: 'طنطا', departments: 7, students: 1450, status: 'نشط', plan: 'مؤسسي' },
    { id: 6, name: 'مدرسة القيم الحديثة', branch: 'مدينة نصر', departments: 5, students: 780, status: 'نشط', plan: 'أساسي' },
    { id: 7, name: 'أكاديمية البيان', branch: 'أسيوط', departments: 9, students: 2030, status: 'تجديد قريب', plan: 'مؤسسي' }
  ],
  subscriptions: [
    { id: 11, school: 'مدارس الروافد الدولية', plan: 'مؤسسي', renewal: '2026-03-15', value: 148000, users: 420, status: 'مدفوع' },
    { id: 12, school: 'أكاديمية النخبة', plan: 'احترافي', renewal: '2025-12-20', value: 74000, users: 180, status: 'فاتورة مفتوحة' },
    { id: 13, school: 'مدرسة دار الهدى', plan: 'احترافي', renewal: '2026-01-10', value: 68000, users: 160, status: 'مدفوع' },
    { id: 14, school: 'معهد الإتقان', plan: 'أساسي', renewal: '2025-09-05', value: 28000, users: 70, status: 'متأخر' },
    { id: 15, school: 'براعم المستقبل', plan: 'مؤسسي', renewal: '2026-05-01', value: 126000, users: 360, status: 'مدفوع' },
    { id: 16, school: 'مدرسة القيم الحديثة', plan: 'أساسي', renewal: '2025-11-12', value: 35000, users: 90, status: 'فاتورة مفتوحة' }
  ],
  grading: [
    { id: 21, batch: 'نهائي رياضيات G10', papers: 820, reviewers: 12, hidden: 'مفعّل', progress: 76, status: 'قيد التصحيح' },
    { id: 22, batch: 'اختبار لغة عربية G7', papers: 540, reviewers: 8, hidden: 'مفعّل', progress: 94, status: 'مراجعة ثانية' },
    { id: 23, batch: 'علوم ابتدائي - فرع طنطا', papers: 430, reviewers: 6, hidden: 'مفعّل', progress: 38, status: 'قيد التصحيح' },
    { id: 24, batch: 'إنجليزي منتصف العام', papers: 760, reviewers: 10, hidden: 'موقوف', progress: 100, status: 'مكتمل' },
    { id: 25, batch: 'فيزياء ثانوي', papers: 310, reviewers: 5, hidden: 'مفعّل', progress: 61, status: 'قيد التصحيح' }
  ]
};

const state = {
  table: 'schools',
  page: 1,
  perPage: 5,
  query: '',
  status: 'all',
  sort: 'name',
  editId: null
};

const routes = {
  '/': renderHome,
  '/schools': () => renderTablePage('schools'),
  '/schools/branches': renderBranches,
  '/subscriptions': () => renderTablePage('subscriptions'),
  '/subscriptions/plans': renderPlans,
  '/blind-grading': () => renderTablePage('grading'),
  '/blind-grading/batches': renderBlindBatches,
  '/dashboard': renderDashboard,
  '/dashboard/reports': renderReports,
  '/dashboard/users': renderUsers,
  '/dashboard/settings': renderSettings,
  '/android': renderAndroid,
  '/contact': renderContact
};

function navigate(path) {
  history.pushState({}, '', path);
  renderRoute();
}

function renderRoute() {
  const path = window.location.pathname;
  const renderer = routes[path] || renderNotFound;
  app.innerHTML = renderer();
  document.body.classList.remove('menu-open');
  document.querySelector('.mobile-menu')?.setAttribute('aria-expanded', 'false');
  setActiveNav(path);
  hydratePage();
  app.focus({ preventScroll: true });
}

function pageShell(title, subtitle, content, actions = '') {
  return `<section class="page page-hero"><div class="section"><div class="page-hero-card reveal"><span class="eyebrow">${subtitle}</span><h1>${title}</h1>${actions ? `<div class="section-actions">${actions}</div>` : ''}</div>${content}</div></section>`;
}

function renderHome() {
  return `<div class="page">
    <section class="section hero">
      <div class="hero-grid">
        <div class="hero-copy reveal">
          <span class="eyebrow">برنامج اشتراكات تعليمي بلون أخضر، أسود وبني عميق</span>
          <h1>إدارة مؤسسات تعليمية <span class="accent">بعمق ثلاثي</span> من الاشتراك حتى التصحيح الأعمى.</h1>
          <p class="lead">نواة منصة تشغيل كاملة للمدارس، الفروع، الأقسام، الخطط، الصلاحيات، الفواتير ودفعات التصحيح دون كشف هوية الطالب للمصحح.</p>
          <div class="hero-actions">
            <a class="btn btn-primary route-link" href="/dashboard">افتح مركز القيادة</a>
            <a class="btn btn-brown route-link" href="/blind-grading">شاهد التصحيح الأعمى</a>
            <a class="btn route-link" href="/android">تطبيق أندرويد متكامل</a>
          </div>
          <div class="stats-row">
            <div class="stat"><strong data-count="42">0</strong><span>فرع قابل للربط</span></div>
            <div class="stat"><strong data-count="98">0</strong><span>% دقة تتبع الاشتراكات</span></div>
            <div class="stat"><strong data-count="320">0</strong><span>مصحح بصلاحيات مفصولة</span></div>
            <div class="stat"><strong data-count="24">0</strong><span>تقرير تشغيلي</span></div>
          </div>
        </div>
        <div class="command-stage tilt reveal" aria-label="معاينة ثلاثية الأبعاد للوحة القيادة">
          <div class="map-lines"></div><span class="branch-node node-a"></span><span class="branch-node node-b"></span><span class="branch-node node-c"></span>
          <div class="depth-card depth-main">
            <div class="panel-top"><strong>Command Center</strong><span class="status-pill">اشتراكات مستقرة</span></div>
            <div class="metric-grid">
              <div class="metric"><strong>18.4k</strong><span>طالب نشط</span></div>
              <div class="metric"><strong>7</strong><span>فروع تحت الإدارة</span></div>
              <div class="metric"><strong>1,860</strong><span>ورقة مصححة أعمى</span></div>
              <div class="metric"><strong>3.2M</strong><span>قيمة اشتراكات</span></div>
            </div>
            <div class="chart">${[42,75,58,88,64,92,70].map((h,i)=>`<span class="bar" style="height:${h}%;animation-delay:${i*.08}s"></span>`).join('')}</div>
          </div>
          <div class="depth-card depth-side"><div class="panel-top"><strong>خريطة الفروع</strong><span class="badge">حي</span></div><p>توزيع المدارس والأقسام والمديرين على خريطة صلاحيات مرنة.</p></div>
          <div class="depth-card depth-low"><div class="panel-top"><strong>Blind Code</strong><span class="badge brown">مخفي</span></div><p>إخفاء الاسم، الرقم القومي، الفرع، والفصل قبل إرسال الورقة للمصحح.</p></div>
        </div>
      </div>
    </section>
    <section class="section">
      <span class="eyebrow reveal">منصة واحدة بدل ملفات متفرقة</span><h2 class="reveal">كل كيان تعليمي له مسار واضح، صلاحيات، تقارير وإجراءات.</h2>
      <div class="feature-grid">
        ${feature('🏫','هيكل مؤسسي متعدد الفروع','إدارة المدارس والأقسام والمراحل والصفوف والمسؤولين بربط هرمي واضح.')}
        ${feature('💳','اشتراكات وفواتير','خطط شهرية وسنوية، تنبيهات تجديد، خصومات، حالات دفع ومراجعة مالية.')}
        ${feature('🕶️','التصحيح الأعمى','ترميز أوراق الإجابة وإخفاء بيانات الطالب وتوزيع الدفعات على المصححين.')}
        ${feature('🔐','صلاحيات دقيقة','مدير مؤسسة، مدير فرع، مسؤول قسم، مصحح، محاسب وولي أمر بمستويات منفصلة.')}
        ${feature('📊','تقارير تشغيلية','مؤشرات حضور، اشتراكات، تحصيل، تقدم تصحيح، ومدارس معرضة للتأخر.')}
        ${feature('🧭','حركة 3D تفاعلية','واجهة تتفاعل مع التمرير والماوس لتقديم تجربة بيع وتعريف لا تُنسى.')}
        ${feature('🤖','تطبيق أندرويد متكامل','تطبيق ميداني متصل بالنظام للمديرين والمحاسبين والمصححين مع إشعارات ومزامنة فورية.')}
      </div>
    </section>
    <section class="section workflow">
      <div class="workflow-steps reveal">
        <div class="workflow-card" data-step="01"><h3>أنشئ المؤسسة</h3><p>أضف المدارس، الفروع، الأقسام، الصفوف، والحسابات الإدارية في دقائق.</p></div>
        <div class="workflow-card" data-step="02"><h3>اربط الاشتراك</h3><p>اختر الخطة، حد المستخدمين، دورة الفاتورة، والتنبيهات قبل انتهاء الاشتراك.</p></div>
        <div class="workflow-card" data-step="03"><h3>صحّح بلا تحيز</h3><p>ارفع الدفعات ووزعها على المصححين بعد إخفاء أي بيانات تعريفية.</p></div>
      </div>
      <div class="blind-visual reveal">
        <div class="paper-stack"><div class="paper"><strong>ورقة إجابة #A-219</strong><div class="mask-line"></div><div class="mask-line" style="width:70%"></div><p style="color:#31291e">بيانات الطالب مخفية قبل التصحيح.</p></div><div class="paper"></div><div class="paper"></div></div>
        <div class="grade-chip"><strong>انحياز أقل</strong><p>توزيع عشوائي + مراجعة مزدوجة</p></div>
      </div>
    </section>
  </div>`;
}

function feature(icon, title, text) {
  return `<article class="feature-card tilt reveal"><div class="icon-badge">${icon}</div><h3>${title}</h3><p>${text}</p></article>`;
}

function setTableContext(type) {
  state.table = type;
  const defaults = { schools: 'name', subscriptions: 'school', grading: 'batch' };
  const validKeys = Object.keys(datasets[type][0]);
  if (!validKeys.includes(state.sort)) state.sort = defaults[type];
}

function renderTablePage(type) {
  setTableContext(type);
  const labels = {
    schools: ['المدارس والفروع', 'إدارة المدارس، الأقسام، الفروع، المراحل وعدد الطلاب', 'إضافة مدرسة'],
    subscriptions: ['الاشتراكات والفواتير', 'متابعة الخطط، تواريخ التجديد، قيمة الاشتراك وحالة التحصيل', 'إضافة اشتراك'],
    grading: ['التصحيح الأعمى', 'دفعات تصحيح مشفرة تخفي بيانات الطلاب وتدعم المراجعة العادلة', 'إضافة دفعة']
  }[type];
  return pageShell(labels[0], labels[1], `<div class="table-shell reveal" data-table-shell>${tableMarkup(type)}</div>`, `<button class="btn btn-primary" data-add="${type}">${labels[2]}</button>${type === 'schools' ? '<a class="btn route-link" href="/schools/branches">إدارة الفروع العميقة</a>' : ''}${type === 'subscriptions' ? '<a class="btn route-link" href="/subscriptions/plans">خطط الاشتراك</a>' : ''}${type === 'grading' ? '<a class="btn route-link" href="/blind-grading/batches">دفعات التصحيح</a>' : ''}`);
}

function tableMarkup(type) {
  const rows = getFilteredRows(type);
  const totalPages = Math.max(1, Math.ceil(rows.length / state.perPage));
  state.page = Math.min(state.page, totalPages);
  const pageRows = rows.slice((state.page - 1) * state.perPage, state.page * state.perPage);
  return `<div class="table-toolbar">
    <div class="filters">
      <input class="input" style="max-width:260px" data-filter-query placeholder="ابحث داخل الجدول" value="${state.query}">
      <select class="select" style="max-width:190px" data-filter-status><option value="all">كل الحالات</option>${statusOptions(type)}</select>
      <select class="select" style="max-width:190px" data-sort>${sortOptions(type)}</select>
    </div>
    <span class="badge dark">${rows.length} سجل مطابق</span>
  </div>
  <div class="responsive-table"><table><thead>${thead(type)}</thead><tbody>${pageRows.map(row => tr(type, row)).join('')}</tbody></table></div>
  <div class="pagination">${Array.from({length: totalPages}, (_, i) => `<button class="${state.page === i+1 ? 'active' : ''}" data-page="${i+1}">${i+1}</button>`).join('')}</div>`;
}

function getFilteredRows(type) {
  return [...datasets[type]].filter(row => {
    const text = Object.values(row).join(' ').toLowerCase();
    const statusValue = row.status || row.hidden;
    return text.includes(state.query.toLowerCase()) && (state.status === 'all' || statusValue === state.status);
  }).sort((a,b) => String(a[state.sort] || '').localeCompare(String(b[state.sort] || ''), 'ar'));
}

function statusOptions(type) {
  const statuses = [...new Set(datasets[type].map(r => r.status || r.hidden))];
  return statuses.map(s => `<option value="${s}" ${state.status === s ? 'selected' : ''}>${s}</option>`).join('');
}
function sortOptions(type) {
  const options = {
    schools: [['name','اسم المدرسة'],['branch','الفرع'],['students','عدد الطلاب'],['status','الحالة']],
    subscriptions: [['school','المدرسة'],['renewal','تاريخ التجديد'],['value','القيمة'],['status','الحالة']],
    grading: [['batch','اسم الدفعة'],['papers','عدد الأوراق'],['progress','التقدم'],['status','الحالة']]
  }[type];
  return options.map(([v,l]) => `<option value="${v}" ${state.sort === v ? 'selected' : ''}>ترتيب حسب ${l}</option>`).join('');
}
function thead(type) {
  const heads = {
    schools: ['المدرسة','الفرع','الأقسام','الطلاب','الخطة','الحالة','إجراءات'],
    subscriptions: ['المدرسة','الخطة','التجديد','القيمة','المستخدمون','الحالة','إجراءات'],
    grading: ['الدفعة','الأوراق','المصححون','إخفاء الهوية','التقدم','الحالة','إجراءات']
  }[type];
  return `<tr>${heads.map(h=>`<th>${h}</th>`).join('')}</tr>`;
}
function tr(type, row) {
  const action = `<td><div class="action-group"><button class="icon-btn" data-edit="${row.id}">تعديل</button><button class="icon-btn" data-delete="${row.id}">حذف</button></div></td>`;
  if (type === 'schools') return `<tr><td>${row.name}</td><td>${row.branch}</td><td>${row.departments}</td><td>${row.students}</td><td><span class="badge brown">${row.plan}</span></td><td><span class="badge">${row.status}</span></td>${action}</tr>`;
  if (type === 'subscriptions') return `<tr><td>${row.school}</td><td>${row.plan}</td><td>${row.renewal}</td><td>${row.value.toLocaleString('ar-EG')} ج.م</td><td>${row.users}</td><td><span class="badge ${row.status === 'متأخر' ? 'brown' : ''}">${row.status}</span></td>${action}</tr>`;
  return `<tr><td>${row.batch}</td><td>${row.papers}</td><td>${row.reviewers}</td><td><span class="badge">${row.hidden}</span></td><td>${row.progress}%</td><td>${row.status}</td>${action}</tr>`;
}

function renderBranches() {
  return pageShell('خريطة الفروع والأقسام', 'مسار /schools/branches', `<div class="feature-grid">${['فرع القاهرة الجديدة','فرع الشيخ زايد','فرع الإسكندرية','فرع طنطا','فرع المنصورة','فرع أسيوط'].map((b,i)=>feature('📍', b, `ربط ${4+i} أقسام، مدير فرع، حدود صلاحيات ومؤشرات تحصيل مستقلة.`)).join('')}</div>`, '<a class="btn btn-primary route-link" href="/schools">عودة لجدول المدارس</a>');
}

function renderPlans() {
  return pageShell('خطط اشتراك مرنة للمؤسسات التعليمية', 'مسار /subscriptions/plans', `<div class="pricing-grid">
    ${plan('أساسي','2,900','مدرسة واحدة، 50 مستخدم، تقارير اشتراك شهرية')}
    ${plan('احترافي','7,900','حتى 5 فروع، فواتير، تصحيح أعمى، صلاحيات أقسام')}
    ${plan('مؤسسي','حسب الحجم','فروع غير محدودة، تكاملات، مراجعة مزدوجة، مدير نجاح')}
  </div>`, '<a class="btn route-link" href="/subscriptions">إدارة الاشتراكات</a>');
}
function plan(name, price, desc) { return `<article class="pricing-card reveal"><h3>${name}</h3><div class="price">${price}</div><p>${desc}</p><ul><li>تنبيهات تجديد</li><li>إجراءات CRUD كاملة</li><li>تقارير قابلة للتصدير</li></ul><button class="btn btn-primary">اختيار الخطة</button></article>`; }

function renderBlindBatches() {
  return pageShell('دفعات التصحيح العميقة', 'مسار /blind-grading/batches', `<div class="workflow"><div class="blind-visual reveal"><div class="paper-stack"><div class="paper"><strong>رمز مجهول #BX-72</strong><div class="mask-line"></div><div class="mask-line" style="width:82%"></div></div><div class="paper"></div><div class="paper"></div></div></div><div class="workflow-steps">${['رفع الأوراق','إخفاء البيانات','توزيع المصححين','مراجعة الانحرافات'].map((s,i)=>`<div class="workflow-card reveal" data-step="0${i+1}"><h3>${s}</h3><p>خطوة تشغيلية موثقة داخل مسار التصحيح الأعمى لضمان العدالة والشفافية.</p></div>`).join('')}</div></div>`, '<a class="btn btn-primary route-link" href="/blind-grading">إدارة جدول الدفعات</a>');
}

function renderDashboard() { return dashboardShell('overview'); }
function renderReports() { return dashboardShell('reports'); }
function renderUsers() { return dashboardShell('users'); }
function renderSettings() { return dashboardShell('settings'); }
function dashboardShell(tab) {
  if (tab === 'reports') setTableContext('subscriptions');
  const content = {
    overview: `<div class="kpi-grid">${kpi('إيراد الاشتراكات','3.2M','+18%')}${kpi('مدارس نشطة','42','7 فروع جديدة')}${kpi('أوراق أعمى','18,640','94% مكتمل')}</div><div class="glass-card chart">${[65,88,42,91,73,54,96,80].map((h,i)=>`<span class="bar" style="height:${h}%;animation-delay:${i*.06}s"></span>`).join('')}</div>`,
    reports: `<div class="glass-card" style="padding:1.2rem"><h3>تقارير العمق</h3><p>تقرير تحصيل حسب الفرع، تقرير المدارس المعرضة للتأخر، تقرير انحراف المصححين، ومؤشر استهلاك الخطة.</p></div>${tableMarkup('subscriptions')}`,
    users: `<div class="table-shell">${userTable()}</div>`,
    settings: `<form class="contact-form"><input class="input" value="نواة التعليمية"><select class="select"><option>إخفاء بيانات الطالب دائماً</option><option>إخفاء عند الاختبارات النهائية فقط</option></select><textarea rows="5">سياسة المؤسسة: لا تظهر بيانات الطالب أو الفرع للمصحح.</textarea><button class="btn btn-primary" type="submit">حفظ الإعدادات</button></form>`
  }[tab];
  return `<section class="page"><div class="section"><div class="dashboard-grid"><aside class="side-panel reveal"><a class="route-link ${tab==='overview'?'active':''}" href="/dashboard">نظرة عامة <span>↗</span></a><a class="route-link ${tab==='reports'?'active':''}" href="/dashboard/reports">التقارير <span>↗</span></a><a class="route-link ${tab==='users'?'active':''}" href="/dashboard/users">المستخدمون <span>↗</span></a><a class="route-link ${tab==='settings'?'active':''}" href="/dashboard/settings">الإعدادات <span>↗</span></a></aside><div class="dashboard-content reveal"><span class="eyebrow">لوحة تحكم تشغيلية</span><h1>مركز قيادة الاشتراكات والمؤسسات</h1>${content}</div></div></div></section>`;
}
function kpi(title, value, note) { return `<div class="kpi"><span>${title}</span><strong>${value}</strong><p>${note}</p></div>`; }
function userTable() { const users = [['مدير مؤسسة','كامل','نشط'],['محاسب فرع','فواتير فقط','نشط'],['مصحح أعمى','دفعات مجهولة','مؤقت'],['مدير قسم','طلاب وتقارير','نشط']]; return `<div class="responsive-table"><table><thead><tr><th>الدور</th><th>الصلاحية</th><th>الحالة</th><th>إجراءات</th></tr></thead><tbody>${users.map((u,i)=>`<tr><td>${u[0]}</td><td>${u[1]}</td><td><span class="badge">${u[2]}</span></td><td><div class="action-group"><button class="icon-btn">تعديل</button><button class="icon-btn">تعطيل</button></div></td></tr>`).join('')}</tbody></table></div>`; }

function renderAndroid() {
  const modules = [
    ['📲', 'مزامنة حية مع لوحة التحكم', 'أي مدرسة أو اشتراك أو دفعة تصحيح يتم تحديثها من الهاتف تظهر فوراً في مركز القيادة.'],
    ['🔔', 'إشعارات تشغيلية ذكية', 'تنبيهات تجديد الاشتراكات، الفواتير المتأخرة، اكتمال التصحيح، وطلبات اعتماد المدير.'],
    ['🕶️', 'تصحيح أعمى من الموبايل', 'يعرض التطبيق أوراقاً مرمزة بلا اسم الطالب أو الفرع مع تتبع زمن التصحيح والمراجعة الثانية.'],
    ['🔐', 'صلاحيات Android حسب الدور', 'مدير مؤسسة، مدير فرع، محاسب، مصحح وولي أمر؛ كل دور يرى أدواته فقط.']
  ];
  return pageShell('تطبيق أندرويد متكامل مع نظام نواة', 'مسار /android', `<div class="android-hero">
    <div class="phone-mockup reveal" aria-label="معاينة تطبيق أندرويد">
      <div class="phone-speaker"></div>
      <div class="phone-screen">
        <div class="app-top"><span>نواة Android</span><strong>متصل الآن</strong></div>
        <div class="app-card primary"><small>اشتراك يحتاج متابعة</small><strong>أكاديمية النخبة</strong><span>تجديد خلال 12 يوم</span></div>
        <div class="app-grid">
          <div><strong>42</strong><span>مدرسة</span></div>
          <div><strong>18.6k</strong><span>ورقة</span></div>
        </div>
        <div class="app-task"><span>🕶️</span><div><strong>دفعة تصحيح مجهولة</strong><small>76% مكتمل</small></div></div>
        <div class="app-task"><span>💳</span><div><strong>فاتورة مفتوحة</strong><small>تم إرسال إشعار للمحاسب</small></div></div>
        <div class="phone-nav"><span></span><span></span><span></span></div>
      </div>
    </div>
    <div class="android-copy reveal">
      <p class="lead">تطبيق أندرويد يعمل كامتداد ميداني للنظام: إدارة المدارس والاشتراكات والتصحيح الأعمى من الهاتف مع نفس البيانات والصلاحيات.</p>
      <div class="integration-strip">
        <span>API آمن</span><span>مزامنة فورية</span><span>وضع ميداني</span><span>إشعارات Push</span>
      </div>
      <div class="hero-actions"><a class="btn btn-primary route-link" href="/contact">اطلب تفعيل التطبيق</a><a class="btn route-link" href="/dashboard">شاهد تكامله مع اللوحة</a></div>
    </div>
  </div>
  <div class="feature-grid android-modules">${modules.map(([icon, title, text]) => feature(icon, title, text)).join('')}</div>
  <section class="google-play-section reveal" aria-labelledby="gpTitle">
    <div class="gp-copy">
      <span class="eyebrow">متاح على Google Play</span>
      <h2 id="gpTitle">حمّل تطبيق نواة لأندرويد الآن</h2>
      <p class="lead">جرّب نواة من جيبك: إدارة الاشتراكات، متابعة الفروع، اعتماد الفواتير، والتصحيح الأعمى بهوية مخفية — كل ذلك بمزامنة فورية مع لوحة التحكم.</p>
      <ul class="gp-meta">
        <li><strong>4.8</strong><span>★ تقييم المستخدمين</span></li>
        <li><strong>+10k</strong><span>تنزيل نشط</span></li>
        <li><strong>Android 8+</strong><span>توافق واسع</span></li>
        <li><strong>28MB</strong><span>حجم خفيف</span></li>
      </ul>
      <div class="gp-actions">
        <a class="gp-badge" href="https://play.google.com/store" target="_blank" rel="noopener" aria-label="تنزيل من Google Play">
          <span class="gp-badge-icon" aria-hidden="true">
            <svg viewBox="0 0 48 48" width="34" height="34" xmlns="http://www.w3.org/2000/svg"><path fill="#34A853" d="M7 4.5v39c0 .9.5 1.7 1.3 2.1L28 24 8.3 2.4C7.5 2.8 7 3.6 7 4.5z"/><path fill="#FBBC04" d="M34.6 17.6 28 24l6.6 6.4 7.1-4.1c2.1-1.2 2.1-4.4 0-5.6l-7.1-3.1z"/><path fill="#EA4335" d="M8.3 2.4 28 24l6.6-6.4L11.3 3.1c-1-.6-2.2-.5-3 .3l-.0 -.0z"/><path fill="#4285F4" d="M8.3 45.6 28 24l6.6 6.4-23.3 13.5c-.8.5-1.8.4-2.5-.3z"/></svg>
          </span>
          <span class="gp-badge-text"><small>تنزيل من</small><strong>Google Play</strong></span>
        </a>
        <a class="btn" href="https://play.google.com/store" target="_blank" rel="noopener">نسخة تجريبية مغلقة</a>
      </div>
    </div>
    <div class="gp-visual" aria-hidden="true">
      <div class="gp-qr">
        <div class="gp-qr-frame">${Array.from({length:36}).map((_,i)=>`<span class="qr-dot${[0,1,4,5,6,7,9,10,12,14,16,17,18,21,22,25,27,28,30,32,34,35].includes(i%36)?' on':''}"></span>`).join('')}</div>
        <p>امسح الكود من جوالك لفتح صفحة التطبيق على Google Play.</p>
      </div>
    </div>
  </section>
  <div class="sync-flow reveal">
    ${['تسجيل دخول موحد', 'سحب الصلاحيات', 'قراءة وكتابة البيانات', 'إشعارات واعتمادات'].map((step, i) => `<div class="sync-step" data-step="0${i + 1}"><strong>${step}</strong><p>يتصل التطبيق بنواة الويب ليحافظ على مصدر بيانات واحد لكل الفروع والأقسام.</p></div>`).join('')}
  </div>`, '<a class="btn route-link" href="/">عودة للرئيسية</a>');
}

function renderContact() {
  return pageShell('احجز عرضاً لمؤسستك التعليمية', 'مسار /contact', `<div class="contact-grid"><div class="glass-card reveal" style="padding:1.4rem"><h3>ما الذي سنضبطه لك؟</h3><p>هيكل الفروع، خطط الاشتراك، صلاحيات الأقسام، دورة الفوترة، وسياسة التصحيح الأعمى.</p><div class="stats-row"><div class="stat"><strong>14</strong><span>يوم إطلاق</span></div><div class="stat"><strong>6</strong><span>مسارات تدريب</span></div></div></div><form class="contact-form reveal"><input class="input" required placeholder="اسم المؤسسة"><input class="input" required placeholder="رقم التواصل"><select class="select"><option>إدارة مدرسة واحدة</option><option>مجموعة مدارس وفروع</option><option>نظام تصحيح أعمى فقط</option><option>نظام ويب + تطبيق أندرويد متكامل</option></select><textarea rows="5" placeholder="اكتب عدد الفروع والأقسام واحتياج الاشتراكات"></textarea><button class="btn btn-primary" type="submit">إرسال طلب العرض</button></form></div>`);
}
function renderNotFound() { return pageShell('المسار غير موجود', '404', '<p class="lead">يمكنك العودة إلى مركز القيادة أو اختيار صفحة من القائمة.</p>', '<a class="btn btn-primary route-link" href="/">الرئيسية</a>'); }

function hydratePage() {
  bindRouteLinks(); bindTableControls(); bindCrudButtons(); bindForms(); animateReveals(); bindTilt(); animateCounters();
}
function bindRouteLinks() { document.querySelectorAll('.route-link').forEach(link => link.addEventListener('click', e => { const url = new URL(link.href); if (url.origin === location.origin) { e.preventDefault(); navigate(url.pathname); } })); }
function setActiveNav(path) { document.querySelectorAll('.main-nav a').forEach(a => a.classList.toggle('active', new URL(a.href).pathname === path)); }
function bindTableControls() {
  const shell = document.querySelector('[data-table-shell]') || (location.pathname.includes('reports') ? document.querySelector('.dashboard-content .table-shell') : null);
  if (!shell) return;
  shell.querySelector('[data-filter-query]')?.addEventListener('input', e => { state.query = e.target.value; state.page = 1; shell.innerHTML = tableMarkup(state.table); bindTableControls(); bindCrudButtons(); });
  shell.querySelector('[data-filter-status]')?.addEventListener('change', e => { state.status = e.target.value; state.page = 1; shell.innerHTML = tableMarkup(state.table); bindTableControls(); bindCrudButtons(); });
  shell.querySelector('[data-sort]')?.addEventListener('change', e => { state.sort = e.target.value; shell.innerHTML = tableMarkup(state.table); bindTableControls(); bindCrudButtons(); });
  shell.querySelectorAll('[data-page]').forEach(btn => btn.addEventListener('click', () => { state.page = Number(btn.dataset.page); shell.innerHTML = tableMarkup(state.table); bindTableControls(); bindCrudButtons(); }));
}
function bindCrudButtons() {
  document.querySelectorAll('[data-add]').forEach(btn => btn.addEventListener('click', () => openCrud(btn.dataset.add)));
  document.querySelectorAll('[data-edit]').forEach(btn => btn.addEventListener('click', () => openCrud(state.table, Number(btn.dataset.edit))));
  document.querySelectorAll('[data-delete]').forEach(btn => btn.addEventListener('click', () => { datasets[state.table] = datasets[state.table].filter(r => r.id !== Number(btn.dataset.delete)); toast('تم حذف السجل من الجدول'); renderRoute(); }));
}
function openCrud(type, id = null) {
  state.table = type; state.editId = id;
  const row = id ? datasets[type].find(r => r.id === id) : {};
  modalTitle.textContent = id ? 'تعديل سجل تشغيلي' : 'إضافة سجل جديد';
  const fields = Object.keys(datasets[type][0]).filter(k => k !== 'id');
  crudForm.innerHTML = `<div class="form-grid">${fields.map(k => `<label>${fieldLabel(k)}<input class="input" name="${k}" value="${row[k] ?? ''}" required></label>`).join('')}</div><button class="btn btn-primary" type="submit">حفظ السجل</button>`;
  modal.classList.add('open'); modal.setAttribute('aria-hidden','false');
}
function fieldLabel(k) { return ({name:'اسم المدرسة',branch:'الفرع',departments:'الأقسام',students:'الطلاب',status:'الحالة',plan:'الخطة',school:'المدرسة',renewal:'تاريخ التجديد',value:'القيمة',users:'المستخدمون',batch:'اسم الدفعة',papers:'الأوراق',reviewers:'المصححون',hidden:'إخفاء الهوية',progress:'التقدم'})[k] || k; }
crudForm.addEventListener('submit', e => {
  e.preventDefault();
  const formData = Object.fromEntries(new FormData(crudForm));
  Object.keys(formData).forEach(k => { if (!Number.isNaN(Number(formData[k])) && formData[k] !== '') formData[k] = Number(formData[k]); });
  if (state.editId) datasets[state.table] = datasets[state.table].map(r => r.id === state.editId ? { ...r, ...formData } : r);
  else datasets[state.table].unshift({ id: Date.now(), ...formData });
  closeModal(); toast('تم حفظ السجل بنجاح'); renderRoute();
});
document.querySelector('.modal-close').addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
function closeModal() { modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); }

function bindForms() { document.querySelectorAll('form:not(#crudForm)').forEach(form => form.addEventListener('submit', e => { e.preventDefault(); toast('تم استلام البيانات وسيتم التواصل معك'); })); }
function animateReveals() { const io = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); io.unobserve(entry.target); } }), { threshold: .12 }); document.querySelectorAll('.reveal').forEach(el => io.observe(el)); }
function bindTilt() { document.querySelectorAll('.tilt').forEach(card => { card.addEventListener('mousemove', e => { const r = card.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - .5; const y = (e.clientY - r.top) / r.height - .5; card.style.transform = `rotateY(${x * -10}deg) rotateX(${y * 10}deg) translateY(-4px)`; }); card.addEventListener('mouseleave', () => card.style.transform = ''); }); }
function animateCounters() { document.querySelectorAll('[data-count]').forEach(el => { let n = 0; const target = Number(el.dataset.count); const step = Math.max(1, Math.ceil(target / 45)); const timer = setInterval(() => { n += step; if (n >= target) { n = target; clearInterval(timer); } el.textContent = n; }, 22); }); }
function toast(message) { let t = document.querySelector('.toast'); if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); } t.textContent = message; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 2600); }

window.addEventListener('popstate', renderRoute);
document.querySelector('.mobile-menu').addEventListener('click', e => { const open = !document.body.classList.contains('menu-open'); document.body.classList.toggle('menu-open', open); e.currentTarget.setAttribute('aria-expanded', String(open)); });
window.addEventListener('scroll', () => { const doc = document.documentElement; const pct = (doc.scrollTop / (doc.scrollHeight - doc.clientHeight)) * 100; document.querySelector('.scroll-progress').style.width = `${pct}%`; });
window.addEventListener('pointermove', e => { const halo = document.querySelector('.cursor-halo'); halo.style.left = `${e.clientX}px`; halo.style.top = `${e.clientY}px`; });

console.log('Nawah Education OS initialized');
renderRoute();
