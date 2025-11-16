/* Admin Dashboard JS - basic skeleton and API integration patterns */
(function(){
  const API_BASE = '/api'; // adjust as needed

  const adminDashboard = {
    adminName: 'Admin',
    authToken: localStorage.getItem('authToken') || '',
    init(){
      this.cache();
      this.bind();
      this.setAdminName();
      this.navigateTo('overview');
      this.loadOverview();
    },
    cache(){
      this.el = {
        panels: document.querySelectorAll('.panel'),
        sidebarItems: document.querySelectorAll('.sidebar li[data-section]'),
        adminName: document.getElementById('adminName'),
        recentFeed: document.getElementById('recentFeed'),
        pendingList: document.getElementById('pendingList'),
        auditSnapshot: document.querySelector('#auditSnapshot tbody'),
        sessionsPanel: document.getElementById('sessionsPanel'),
        recentExports: document.getElementById('recentExports'),
        profileMenu: document.getElementById('profileMenu'),
        profileDropdown: document.getElementById('profileDropdown')
      };
    },
    bind(){
      // sidebar navigation
      this.el.sidebarItems.forEach(item=>{
        item.addEventListener('click', ()=>this.navigateTo(item.dataset.section));
      });

      // profile dropdown
      const profile = document.querySelector('.profile');
      profile.addEventListener('click', ()=>{
        this.el.profileDropdown.hidden = !this.el.profileDropdown.hidden;
      });

      document.getElementById('pendingCategoryFilter').addEventListener('change', (e)=>this.loadPending(e.target.value));
      document.getElementById('pendingSearch').addEventListener('input', (e)=>this.filterPending(e.target.value));

      document.getElementById('btnNewExport').addEventListener('click', ()=>this.openExportDialog());

      const importForm = document.getElementById('importForm');
      if(importForm) importForm.addEventListener('submit', (e)=>{e.preventDefault(); this.handleImport();});

      // sign out
      const signOut = document.getElementById('signOut');
      if(signOut) signOut.addEventListener('click', ()=>this.handleSignOut());
    },
    setAdminName(){
      const name = localStorage.getItem('adminName') || this.adminName;
      this.el.adminName.textContent = name;
    },
    navigateTo(section){
      // hide all
      this.el.panels.forEach(p=>p.hidden=true);
      // remove active
      this.el.sidebarItems.forEach(i=>i.classList.remove('active'));
      // show target
      const target = document.getElementById(section);
      if(target){ target.hidden=false; document.querySelector(`.sidebar li[data-section=\"${section}\"]`).classList.add('active'); }
      // lazy-load data for section
      switch(section){
        case 'overview': this.loadOverview(); break;
        case 'pending': this.loadPending(); break;
        case 'audit': this.loadAudit(); break;
        case 'sessions': this.loadSessions(); break;
        case 'exports': this.loadExports(); break;
        case 'residents': this.loadResidents(); break;
        case 'events': this.loadEvents(); break;
        case 'announcements': this.loadAnnouncements(); break;
        case 'users': this.loadUsers(); break;
        case 'officials': this.loadOfficials(); break;
        case 'complaints': this.loadComplaints(); break;
        case 'auditlogs': this.loadAuditLogs(); break;
        case 'imports': this.loadImports(); break;
      }
    },

    /* ========== Data loaders ========== */
    async loadOverview(){
      // recent activity
      const recent = await this.makeAPIRequest('/admin/recent-activity');
      this.renderFeed(recent || []);

      // pending snapshot
      this.loadPending('all');

      // audit snapshot
      const audit = await this.makeAPIRequest('/admin/audit-snapshot');
      this.renderAuditSnapshot(audit || []);

      // sessions
      const sessions = await this.makeAPIRequest('/admin/active-sessions');
      this.renderSessions(sessions || []);

      // recent exports
      const exports = await this.makeAPIRequest('/admin/exports/recent');
      this.renderRecentExports(exports || []);
    },

    async loadPending(category='all'){
      const pending = await this.makeAPIRequest(`/admin/pending?category=${encodeURIComponent(category)}`);
      this.renderPending(pending || []);
    },
    async loadAudit(){
      const logs = await this.makeAPIRequest('/admin/audit');
      this.renderAuditTable(logs || []);
    },
    async loadSessions(){
      const sessions = await this.makeAPIRequest('/admin/sessions');
      this.renderSessionsTable(sessions || []);
    },
    async loadExports(){
      const ex = await this.makeAPIRequest('/admin/exports');
      this.renderExportTable(ex || []);
    },
    async loadResidents(){
      const list = await this.makeAPIRequest('/residents');
      this.renderResidents(list || []);
    },
    async loadEvents(){
      const list = await this.makeAPIRequest('/events');
      this.renderEvents(list || []);
    },
    async loadAnnouncements(){
      const list = await this.makeAPIRequest('/announcements');
      this.renderAnnouncements(list || []);
    },
    async loadUsers(){
      const list = await this.makeAPIRequest('/users');
      this.renderUsers(list || []);
    },
    async loadOfficials(){
      const list = await this.makeAPIRequest('/officials');
      this.renderOfficials(list || []);
    },
    async loadComplaints(){
      const list = await this.makeAPIRequest('/complaints');
      this.renderComplaints(list || []);
    },
    async loadAuditLogs(){
      const list = await this.makeAPIRequest('/audit-logs');
      this.renderAuditLogs(list || []);
    },
    async loadImports(){
      // show recent imports
      const list = await this.makeAPIRequest('/admin/imports/recent');
      this.renderImportList(list || []);
    },

    /* ========== Renderers ========== */
    renderFeed(items){
      const el = this.el.recentFeed; el.innerHTML='';
      items.forEach(it=>{
        const div = document.createElement('div'); div.className='feed-item';
        div.innerHTML = `<div class="dot" style="width:10px;height:10px;border-radius:6px;background:${it.color||'#3b82f6'}"></div><div><div class="meta">${it.actor} • ${it.action}</div><div class="meta">${new Date(it.timestamp).toLocaleString()}</div><a href='${it.link||"#"}' data-deeplink>Open</a></div>`;
        el.appendChild(div);
      });
    },
    renderPending(items){
      const el = this.el.pendingList; el.innerHTML='';
      items.forEach(row=>{
        const r = document.createElement('div'); r.className='pending-row';
        r.innerHTML = `<div class="row-main"><strong>${row.type}</strong> — ${row.ref||row.name||''} <div class='meta'>${row.actor||''} • ${new Date(row.date).toLocaleString()}</div></div><div class="row-actions"><button class='btn primary' data-action='approve' data-id='${row.id}'>Approve</button><button class='btn' data-action='reject' data-id='${row.id}'>Reject</button><button class='btn' data-action='view' data-id='${row.id}'>View</button></div>`;
        // attach action handlers
        r.querySelectorAll('button').forEach(b=>b.addEventListener('click', (e)=>this.handlePendingAction(e)));
        el.appendChild(r);
      });
    },
    renderAuditSnapshot(items){
      const tbody = this.el.auditSnapshot; tbody.innerHTML='';
      items.forEach(it=>{
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${it.actor}</td><td>${it.action}</td><td>${it.target}</td><td>${new Date(it.time).toLocaleString()}</td>`;
        tbody.appendChild(tr);
      });
    },
    renderSessions(items){
      const el = this.el.sessionsPanel; el.innerHTML='';
      items.forEach(s=>{
        const d = document.createElement('div'); d.className='session-row';
        d.innerHTML=`<div><strong>${s.admin}</strong> • ${s.ip} • ${s.agent}</div><div><button class='btn' data-action='signout' data-session='${s.sessionId}'>Sign out</button></div>`;
        d.querySelector('button').addEventListener('click', ()=>this.remoteSignOut(s.sessionId));
        el.appendChild(d);
      });
    },
    renderRecentExports(items){
      const el = this.el.recentExports; el.innerHTML='';
      items.forEach(ex=>{
        const d = document.createElement('div'); d.className='export-item';
        d.innerHTML = `<div>${ex.dataset} • ${ex.format} • ${ex.count} records • <span class='badge-status'>${ex.status}</span></div><div><a href='${ex.url||"#"}' ${ex.status==='Ready'?'':'aria-disabled="true"'}>Download</a></div>`;
        el.appendChild(d);
      });
    },

    /* ========== Actions ========== */
    async handlePendingAction(e){
      const btn = e.currentTarget; const action=btn.dataset.action; const id=btn.dataset.id;
      if(action==='approve'){
        const res = await this.makeAPIRequest(`/admin/pending/${id}/approve`, 'POST');
        this.showNotification(res? 'Approved':'Failed to approve', res? 'success':'error');
        this.loadPending();
      } else if(action==='reject'){
        const note = prompt('Provide rejection reason (required)');
        if(!note) return this.showNotification('Rejection reason required','warning');
        const res = await this.makeAPIRequest(`/admin/pending/${id}/reject`, 'POST', {reason:note});
        this.showNotification(res? 'Rejected':'Failed to reject', res? 'success':'error');
        this.loadPending();
      } else if(action==='view'){
        // deep link to the item
        window.location.hash = `pending:${id}`;
      }
    },

    async remoteSignOut(sessionId){
      const r = confirm('Sign out this session remotely?'); if(!r) return;
      const res = await this.makeAPIRequest(`/admin/sessions/${sessionId}/signout`, 'POST');
      this.showNotification(res? 'Signed out':'Failed to sign out', res? 'success':'error');
      this.loadSessions();
    },

    openExportDialog(){
      // simple prompt flow for now
      const dataset = prompt('Dataset to export (residents,events,complaints,audit):','residents');
      const format = prompt('Format (CSV,XLSX,JSON,PDF):','CSV');
      if(!dataset||!format) return;
      this.requestExport({dataset,format});
    },
    async requestExport(opts){
      const payload = {dataset:opts.dataset, format:opts.format};
      const res = await this.makeAPIRequest('/admin/exports', 'POST', payload);
      if(res) this.showNotification('Export queued','success');
      this.loadExports();
    },

    async handleImport(){
      const fileInput = document.getElementById('importFile');
      const dataset = document.getElementById('importDataset').value;
      if(!fileInput.files.length) return this.showNotification('Select a file','warning');
      const fd = new FormData(); fd.append('file', fileInput.files[0]); fd.append('dataset', dataset);
      // upload and validate
      const resp = await fetch('/admin/imports/validate',{method:'POST',body:fd,headers:{'Authorization':'Bearer '+this.authToken}}).then(r=>r.json()).catch(()=>null);
      if(!resp) return this.showNotification('Failed to upload','error');
      // show preview and allow start
      const preview = document.getElementById('importPreview'); preview.innerHTML = `<div>Preview: ${resp.sampleCount} rows, ${resp.errors?.length||0} errors</div><button id='startImport' class='btn primary'>Start Import</button>`;
      document.getElementById('startImport').addEventListener('click', async ()=>{
        const p = await this.makeAPIRequest('/admin/imports/start','POST',{importId:resp.importId});
        if(p) this.showNotification('Import started','success');
        this.loadImports();
      });
    },

    async handleSignOut(){
      localStorage.removeItem('authToken'); localStorage.removeItem('adminName');
      window.location.href = '/login.html';
    },

    /* ========== Utility / API ========== */
    async makeAPIRequest(endpoint, method='GET', data=null){
      try{
        const headers = {};
        if(this.authToken) headers['Authorization'] = 'Bearer '+this.authToken;
        if(data && !(data instanceof FormData)) headers['Content-Type'] = 'application/json';
        const res = await fetch(API_BASE+endpoint, {method, headers, body: data && !(data instanceof FormData) ? JSON.stringify(data) : data});
        if(res.status===401){ this.showNotification('Unauthorized — please sign in again','error'); return null; }
        if(!res.ok) { console.error('API error', res.status); return null; }
        const json = await res.json().catch(()=>null);
        return json;
      }catch(err){console.error(err); return null}
    },

    showNotification(msg, type='info'){
      // simple toast
      const t = document.createElement('div'); t.className='toast'; t.textContent = msg; t.style.position='fixed'; t.style.right='16px'; t.style.bottom='16px'; t.style.padding='10px 14px'; t.style.borderRadius='8px'; t.style.background = type==='success'? 'linear-gradient(90deg,#10b981,#34d399)': type==='error'? 'linear-gradient(90deg,#ef4444,#f97316)': 'linear-gradient(90deg,#3b82f6,#60a5fa)'; t.style.color='#021'; document.body.appendChild(t); setTimeout(()=>t.remove(),5000);
    },

    filterPending(q){
      const els = document.querySelectorAll('.pending-row');
      els.forEach(r=>{ r.style.display = (q.length===0 || r.textContent.toLowerCase().includes(q.toLowerCase()))? 'flex':'none'});
    },

    renderAuditTable(items){
      const t = document.querySelector('#auditTable tbody'); t.innerHTML='';
      items.forEach(it=>{ const tr=document.createElement('tr'); tr.innerHTML=`<td>${new Date(it.timestamp).toLocaleString()}</td><td>${it.actor}</td><td>${it.type}</td><td>${it.target}</td><td><button class='btn' data-id='${it.logId}' data-action='viewLog'>View</button></td>`; t.appendChild(tr); });
    },

    // simple renderers for other tables (placeholders)
    renderExportTable(items){ const t=document.querySelector('#exportTable tbody'); if(!t) return; t.innerHTML=''; items.forEach(i=>{ const tr=document.createElement('tr'); tr.innerHTML=`<td>${i.exportId}</td><td>${i.dataset}</td><td>${i.format}</td><td>${i.records}</td><td>${i.status}</td><td>${new Date(i.requestedAt).toLocaleString()}</td><td><a href='${i.downloadUrl||"#"}'>Download</a></td>`; t.appendChild(tr); }); },
    renderResidents(items){ const t=document.querySelector('#residentsTable tbody'); if(!t) return; t.innerHTML=''; items.forEach(r=>{ const tr=document.createElement('tr'); tr.innerHTML=`<td>${r.residentId}</td><td>${r.firstName} ${r.lastName}</td><td>${r.age||''}</td><td>${r.sex}</td><td>${r.purok}</td><td>${r.contact}</td><td>${r.status}</td><td>${new Date(r.registeredAt).toLocaleDateString()}</td><td><button class='btn' data-id='${r.residentId}'>View</button></td>`; t.appendChild(tr); }); },
    renderEvents(items){ const t=document.querySelector('#eventsTable tbody'); if(!t) return; t.innerHTML=''; items.forEach(e=>{ const tr=document.createElement('tr'); tr.innerHTML=`<td>${e.eventId}</td><td>${e.title}</td><td>${e.organizer}</td><td>${new Date(e.start).toLocaleString()}</td><td>${e.venue}</td><td>${e.status}</td><td><button class='btn'>View</button></td>`; t.appendChild(tr); }); },
    renderAnnouncements(items){ const t=document.querySelector('#annTable tbody'); if(!t) return; t.innerHTML=''; items.forEach(a=>{ const tr=document.createElement('tr'); tr.innerHTML=`<td>${a.id}</td><td>${a.title}</td><td>${a.audience}</td><td>${new Date(a.start).toLocaleString()}</td><td>${new Date(a.end).toLocaleString()}</td><td>${a.status}</td><td><button class='btn'>Edit</button></td>`; t.appendChild(tr); }); },
    renderUsers(items){ const t=document.querySelector('#usersTable tbody'); if(!t) return; t.innerHTML=''; items.forEach(u=>{ const tr=document.createElement('tr'); tr.innerHTML=`<td>${u.userId}</td><td>${u.username}</td><td>${u.fullName}</td><td>${(u.roles||[]).join(', ')}</td><td>${u.status}</td><td>${u.lastLoginAt||''}</td><td><button class='btn'>Impersonate</button></td>`; t.appendChild(tr); }); },
    renderOfficials(items){ const t=document.querySelector('#officialsTable tbody'); if(!t) return; t.innerHTML=''; items.forEach(o=>{ const tr=document.createElement('tr'); tr.innerHTML=`<td>${o.officialId}</td><td>${o.fullName}</td><td>${o.position}</td><td>${o.termStart} - ${o.termEnd}</td><td>${o.status}</td><td><button class='btn'>Assign</button></td>`; t.appendChild(tr); }); },
    renderComplaints(items){ const t=document.querySelector('#complaintsTable tbody'); if(!t) return; t.innerHTML=''; items.forEach(c=>{ const tr=document.createElement('tr'); tr.innerHTML=`<td>${c.ref}</td><td>${c.complainantName}</td><td>${c.category}</td><td>${new Date(c.dateReported).toLocaleString()}</td><td>${c.status}</td><td>${c.priority||''}</td><td><button class='btn'>View</button></td>`; t.appendChild(tr); }); },
    renderAuditLogs(items){ const t=document.querySelector('#auditLogsTable tbody'); if(!t) return; t.innerHTML=''; items.forEach(l=>{ const tr=document.createElement('tr'); tr.innerHTML=`<td>${l.logId}</td><td>${new Date(l.timestamp).toLocaleString()}</td><td>${l.actor}</td><td>${l.actionType}</td><td>${l.target}</td><td>${l.ip}</td><td><button class='btn'>Details</button></td>`; t.appendChild(tr); }); },
    renderImportList(items){ const el=document.getElementById('importPreview'); if(!el) return; el.innerHTML=''; items.forEach(it=>{ const d=document.createElement('div'); d.innerHTML=`<strong>${it.importId}</strong> • ${it.dataset} • ${it.status} • ${it.recordsImported}/${it.recordsTotal} <button class='btn'>View</button>`; el.appendChild(d); }); },
  };

  // expose to global for debugging
  window.adminDashboard = adminDashboard;
  document.addEventListener('DOMContentLoaded', ()=>adminDashboard.init());
})();