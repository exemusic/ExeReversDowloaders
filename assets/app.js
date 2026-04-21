/* ExeReversDowloaders - app.js */
(function(){
'use strict';

// ===== CONFIG =====
var CFG = {
  supa_url: 'https://pibjdafaxtqushyndarh.supabase.co',
  supa_anon: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpYmpkYWZheHRxdXNoeW5kYXJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3NTkyNDYsImV4cCI6MjA5MjMzNTI0Nn0.vgrXMx_8leB2cu1H29UcU-TGBoajy07Ky-N-76wdEnM',
  supa_service: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpYmpkYWZheHRxdXNoeW5kYXJoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njc1OTI0NiwiZXhwIjoyMDkyMzM1MjQ2fQ.wraRotDIEeRX5L9LnA37nERA2rkDaoQYeOBCxgoUbUg',
  bucket: 'files',
  // ⚠️ Password admin TIDAK disimpan di sini — ada di Netlify Environment Variables (ADMIN_PW)
  yt_channel: 'https://youtube.com/@exerevers?si=ewbTDfc8mxH0znW6',
  sub_wait: 5000
};

// ===== PARTICLES =====
(function initParticles(){
  var c = document.getElementById('particles');
  if (!c) return;
  var ctx = c.getContext('2d');
  var W, H, pts = [];
  function resize(){ W = c.width = innerWidth; H = c.height = innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  for (var i = 0; i < 60; i++) pts.push({
    x: Math.random()*1920, y: Math.random()*1080,
    vx: (Math.random()-.5)*.3, vy: (Math.random()-.5)*.3,
    r: Math.random()*1.5+.5,
    c: Math.random() > .5 ? 'rgba(220,38,38,' : 'rgba(37,99,235,'
  });
  function draw(){
    ctx.clearRect(0,0,W,H);
    pts.forEach(function(p){
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = p.c + '.4)';
      ctx.fill();
    });
    // connections
    for (var i = 0; i < pts.length; i++) {
      for (var j = i+1; j < pts.length; j++) {
        var dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        var d = Math.sqrt(dx*dx + dy*dy);
        if (d < 120) {
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(37,99,235,' + (.15*(1-d/120)) + ')';
          ctx.lineWidth = .5;
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

// ===== UTILS =====
function supaFetch(path, opts, useService){
  var key = useService ? CFG.supa_service : CFG.supa_anon;
  return fetch(CFG.supa_url + path, Object.assign({
    headers: Object.assign({
      'apikey': key,
      'Authorization': 'Bearer ' + key,
      'Content-Type': 'application/json'
    }, opts && opts.headers || {})
  }, opts || {}));
}

function hashPw(pw){
  // Simple hash untuk client-side comparison (SHA-256 via SubtleCrypto)
  var enc = new TextEncoder().encode(pw.trim().toLowerCase());
  return crypto.subtle.digest('SHA-256', enc).then(function(buf){
    return Array.from(new Uint8Array(buf)).map(function(b){ return b.toString(16).padStart(2,'0'); }).join('');
  });
}

function getPage(){
  var p = location.pathname.split('/').pop();
  return p || 'index.html';
}

// ===== SESSION CHECK =====
// Halaman verify & download butuh sesi dari index
function checkSession(){
  var page = getPage();
  if (page === 'verify.html') {
    var sub = sessionStorage.getItem('exe_subbed');
    if (!sub) { location.href = 'index.html'; return false; }
  }
  if (page === 'download.html') {
    var fid = sessionStorage.getItem('exe_file_id');
    if (!fid) { location.href = 'index.html'; return false; }
  }
  return true;
}
checkSession();

// ===== INDEX PAGE - SUBSCRIBE GATE =====
var subBtn = document.getElementById('subBtn');
var verifiedBtn = document.getElementById('verifiedBtn');
var timerWrap = document.getElementById('timerWrap');
var timerFill = document.getElementById('timerFill');
var timerText = document.getElementById('timerText');

if (subBtn) {
  subBtn.addEventListener('click', function(){
    sessionStorage.setItem('exe_subbed', '1');
    // Start timer
    if (timerWrap) timerWrap.style.display = 'flex';
    var elapsed = 0;
    var total = CFG.sub_wait;
    var iv = setInterval(function(){
      elapsed += 100;
      var pct = Math.min(100, (elapsed/total)*100);
      if (timerFill) timerFill.style.width = pct + '%';
      var rem = Math.ceil((total - elapsed)/1000);
      if (timerText) timerText.textContent = rem > 0 ? 'Menunggu ' + rem + ' detik...' : 'Siap!';
      if (elapsed >= total) {
        clearInterval(iv);
        if (verifiedBtn) { verifiedBtn.disabled = false; verifiedBtn.querySelector('.lock-icon').textContent = '✅'; }
      }
    }, 100);
  });
}

window.goToPassword = function(){
  if (!sessionStorage.getItem('exe_subbed')) return;
  location.href = 'verify.html';
};

// ===== VERIFY PAGE =====
var attempts = 0;
var blocked = false;
var blockUntil = 0;

window.togglePw = function(){
  var i = document.getElementById('pwInput');
  if (!i) return;
  i.type = i.type === 'password' ? 'text' : 'password';
};

window.checkPassword = async function(){
  if (blocked) {
    var rem = Math.ceil((blockUntil - Date.now())/1000);
    if (rem > 0) { showAttemptWarn('Terlalu banyak percobaan. Tunggu ' + rem + ' detik.'); return; }
    blocked = false; attempts = 0;
  }
  var input = document.getElementById('pwInput');
  if (!input) return;
  var pw = input.value.trim();
  if (!pw) { showPwError('Masukkan password terlebih dahulu.'); return; }

  setLoading(true);
  hidePwError();

  try {
    var hash = await hashPw(pw);
    var res = await supaFetch('/rest/v1/files?select=id,title,file_url&password_hash=eq.' + encodeURIComponent(hash) + '&limit=1');
    var data = await res.json();

    if (data && data.length > 0) {
      var file = data[0];
      sessionStorage.setItem('exe_file_id', file.id);
      sessionStorage.setItem('exe_file_title', file.title);
      sessionStorage.setItem('exe_file_url', file.file_url);
      setLoading(false);
      // Flash success then redirect
      input.style.borderColor = '#00c864';
      setTimeout(function(){ location.href = 'download.html'; }, 600);
    } else {
      setLoading(false);
      attempts++;
      showPwError('Password salah atau tidak ditemukan.');
      input.value = '';
      input.focus();
      if (attempts >= 5) {
        blocked = true;
        blockUntil = Date.now() + 60000;
        showAttemptWarn('5x salah. Akses diblokir 60 detik.');
      } else {
        showAttemptWarn('Percobaan ke-' + attempts + '/5. Cek kembali video YouTube.');
      }
    }
  } catch(e) {
    setLoading(false);
    showPwError('Koneksi gagal. Coba lagi.');
  }
};

function setLoading(v){
  var ld = document.getElementById('pwLoading');
  var btn = document.querySelector('.btn-verified');
  if (ld) ld.style.display = v ? 'flex' : 'none';
  if (btn) btn.disabled = v;
}

function showPwError(msg){
  var el = document.getElementById('pwError');
  if (el) { el.style.display = 'flex'; el.innerHTML = '<span>❌</span> ' + msg; }
}

function hidePwError(){
  var el = document.getElementById('pwError');
  if (el) el.style.display = 'none';
}

function showAttemptWarn(msg){
  var el = document.getElementById('attemptWarn');
  if (el) { el.style.display = 'block'; el.textContent = '⚠️ ' + msg; }
}

// ===== DOWNLOAD PAGE =====
var dlFile = null;

(async function initDownload(){
  var page = getPage();
  if (page !== 'download.html') return;

  var title = sessionStorage.getItem('exe_file_title');
  var url = sessionStorage.getItem('exe_file_url');
  var id = sessionStorage.getItem('exe_file_id');

  if (!id || !url) { location.href = 'index.html'; return; }

  dlFile = { title: title, url: url, id: id };

  var titleEl = document.getElementById('fileTitle');
  var metaEl = document.getElementById('fileMeta');
  var dlBtn = document.getElementById('dlBtn');

  if (titleEl) titleEl.textContent = title || 'File Eksklusif';
  if (metaEl) metaEl.textContent = 'Terverifikasi ✓ — Siap diunduh';
  if (dlBtn) dlBtn.disabled = false;
})();

window.startDownload = async function(){
  if (!dlFile) return;
  var dlBtn = document.getElementById('dlBtn');
  var prog = document.getElementById('dlProgress');
  var fill = document.getElementById('dlFill');

  if (dlBtn) dlBtn.disabled = true;
  if (prog) prog.style.display = 'block';

  // Animate progress bar
  var pct = 0;
  var iv = setInterval(function(){
    pct = Math.min(95, pct + Math.random()*15);
    if (fill) fill.style.width = pct + '%';
  }, 200);

  try {
    // Get signed URL dari Supabase storage
    var res = await supaFetch('/storage/v1/object/sign/' + CFG.bucket + '/' + encodeURIComponent(dlFile.url), {
      method: 'POST',
      body: JSON.stringify({ expiresIn: 60 })
    });
    var data = await res.json();
    clearInterval(iv);
    if (fill) fill.style.width = '100%';

    var signedUrl = data.signedURL ? (CFG.supa_url + data.signedURL) : dlFile.url;

    setTimeout(function(){
      var a = document.createElement('a');
      a.href = signedUrl;
      a.download = dlFile.title || 'file';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      if (dlBtn) { dlBtn.disabled = false; dlBtn.innerHTML = '<span>✅</span> DOWNLOAD DIMULAI'; }
      if (prog) prog.style.display = 'none';
    }, 400);
  } catch(e) {
    clearInterval(iv);
    // Fallback: langsung buka URL
    window.open(dlFile.url, '_blank');
    if (dlBtn) dlBtn.disabled = false;
    if (prog) prog.style.display = 'none';
  }
};

// ===== ADMIN PANEL =====
var adminAuthed = false;
var deleteTarget = null;
var selectedFile = null;

window.toggleAdminPw = function(){
  var i = document.getElementById('adminPw');
  if (i) i.type = i.type === 'password' ? 'text' : 'password';
};

window.toggleFilePw = function(){
  var i = document.getElementById('filePw');
  if (i) i.type = i.type === 'password' ? 'text' : 'password';
};

window.adminLogin = async function(){
  var pwEl = document.getElementById('adminPw');
  var err = document.getElementById('adminErr');
  var btn = document.querySelector('.admin-gate-box .btn-verified');
  if (!pwEl) return;
  var pw = pwEl.value;
  if (!pw) return;

  // Disable tombol saat proses
  if (btn) { btn.disabled = true; btn.textContent = 'Memverifikasi...'; }
  if (err) err.style.display = 'none';

  try {
    // Kirim ke Netlify Function — password tidak pernah dicompare di browser
    var res = await fetch('/.netlify/functions/admin-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pw })
    });
    var data = await res.json();

    if (data.ok && data.token) {
      adminAuthed = true;
      // Simpan token (bukan password) di session
      sessionStorage.setItem('exe_admin', data.token);
      document.getElementById('adminGate').style.display = 'none';
      document.getElementById('adminPanel').style.display = 'block';
      loadFiles();
    } else {
      if (err) { err.style.display = 'block'; err.textContent = 'Password salah!'; }
      pwEl.value = '';
      pwEl.focus();
    }
  } catch(e) {
    if (err) { err.style.display = 'block'; err.textContent = 'Koneksi ke server gagal. Coba lagi.'; }
  }

  if (btn) { btn.disabled = false; btn.textContent = '🔐 Masuk ke Admin Panel'; }
};

window.adminLogout = function(){
  adminAuthed = false;
  sessionStorage.removeItem('exe_admin');
  location.reload();
};

// Auto-login jika session masih ada
(function(){
  var page = getPage();
  if (page !== 'admin.html') return;
  var token = sessionStorage.getItem('exe_admin');
  // Token valid = string panjang (hex.timestamp), bukan '1'
  if (token && token.length > 10) {
    adminAuthed = true;
    var gate = document.getElementById('adminGate');
    var panel = document.getElementById('adminPanel');
    if (gate) gate.style.display = 'none';
    if (panel) panel.style.display = 'block';
    loadFiles();
  }
})();

window.handleFile = function(inp){
  if (inp.files && inp.files[0]) {
    selectedFile = inp.files[0];
    var dropText = document.getElementById('dropText');
    if (dropText) dropText.textContent = '📎 ' + selectedFile.name + ' (' + formatSize(selectedFile.size) + ')';
  }
};

// Drag & drop
(function(){
  var drop = document.getElementById('fileDrop');
  if (!drop) return;
  drop.addEventListener('dragover', function(e){ e.preventDefault(); drop.classList.add('dragging'); });
  drop.addEventListener('dragleave', function(){ drop.classList.remove('dragging'); });
  drop.addEventListener('drop', function(e){
    e.preventDefault();
    drop.classList.remove('dragging');
    if (e.dataTransfer.files[0]) {
      selectedFile = e.dataTransfer.files[0];
      var dropText = document.getElementById('dropText');
      if (dropText) dropText.textContent = '📎 ' + selectedFile.name + ' (' + formatSize(selectedFile.size) + ')';
      var inp = document.getElementById('fileInput');
      // simulate for input ref
      var dt = new DataTransfer();
      dt.items.add(selectedFile);
      if (inp) inp.files = dt.files;
    }
  });
})();

window.uploadFile = async function(){
  if (!adminAuthed) return;
  var title = document.getElementById('fileTitle').value.trim();
  var pw = document.getElementById('filePw').value.trim();
  var msg = document.getElementById('uploadMsg');
  var btn = document.getElementById('uploadBtn');
  var prog = document.getElementById('uploadProgress');
  var fill = document.getElementById('uploadFill');
  var upText = document.getElementById('uploadText');

  if (!title) { showUploadMsg('error', 'Masukkan judul file!'); return; }
  if (!pw) { showUploadMsg('error', 'Masukkan password untuk file ini!'); return; }
  if (!selectedFile) { showUploadMsg('error', 'Pilih file terlebih dahulu!'); return; }

  if (btn) btn.disabled = true;
  if (prog) prog.style.display = 'block';
  if (msg) msg.style.display = 'none';

  try {
    // Hash password
    if (upText) upText.textContent = 'Hashing password...';
    if (fill) fill.style.width = '10%';
    var hash = await hashPw(pw);

    // Upload file ke Supabase Storage
    if (upText) upText.textContent = 'Uploading file...';
    if (fill) fill.style.width = '30%';
    var fileName = Date.now() + '_' + selectedFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');

    // Pakai fetch langsung — jangan campur Content-Type json dengan file
    var upRes = await fetch(CFG.supa_url + '/storage/v1/object/' + CFG.bucket + '/' + fileName, {
      method: 'POST',
      headers: {
        'apikey': CFG.supa_service,
        'Authorization': 'Bearer ' + CFG.supa_service,
        'Content-Type': selectedFile.type || 'application/octet-stream',
        'x-upsert': 'true'
      },
      body: selectedFile
    });

    if (!upRes.ok) {
      var errBody = await upRes.text();
      throw new Error('Upload storage gagal: ' + upRes.status + ' — ' + errBody);
    }
    if (fill) fill.style.width = '70%';
    if (upText) upText.textContent = 'Menyimpan metadata...';

    // Simpan ke table files
    var dbRes = await supaFetch('/rest/v1/files', {
      method: 'POST',
      headers: { 'Prefer': 'return=representation' },
      body: JSON.stringify({ title: title, password_hash: hash, file_url: fileName })
    }, true);

    if (!dbRes.ok) throw new Error('Simpan database gagal');
    if (fill) fill.style.width = '100%';
    if (upText) upText.textContent = 'Selesai!';

    showUploadMsg('success', '✅ File "' + title + '" berhasil diupload!');

    // Reset form
    document.getElementById('fileTitle').value = '';
    document.getElementById('filePw').value = '';
    document.getElementById('dropText').textContent = 'Klik atau drag file ke sini';
    selectedFile = null;

    setTimeout(function(){ if (prog) prog.style.display = 'none'; }, 1000);
    loadFiles();
  } catch(e) {
    showUploadMsg('error', '❌ Gagal: ' + e.message);
    if (prog) prog.style.display = 'none';
  }
  if (btn) btn.disabled = false;
};

function showUploadMsg(type, msg){
  var el = document.getElementById('uploadMsg');
  if (!el) return;
  el.style.display = 'block';
  el.className = type === 'success' ? 'upload-success' : 'upload-error';
  el.textContent = msg;
  if (type === 'success') setTimeout(function(){ el.style.display = 'none'; }, 4000);
}

window.loadFiles = async function(){
  if (!adminAuthed) return;
  var listEl = document.getElementById('fileList');
  var totalEl = document.getElementById('totalFiles');
  if (!listEl) return;
  listEl.innerHTML = '<div style="text-align:center;padding:2rem;color:var(--text-muted)"><div class="spinner" style="margin:0 auto .5rem"></div> Memuat...</div>';

  try {
    var res = await supaFetch('/rest/v1/files?select=id,title,file_url,created_at&order=created_at.desc', {}, true);
    var data = await res.json();
    if (totalEl) totalEl.textContent = data.length || 0;

    if (!data.length) {
      listEl.innerHTML = '<div style="text-align:center;padding:2rem;color:var(--text-muted)">Belum ada file. Upload file pertamamu! 📦</div>';
      return;
    }

    listEl.innerHTML = data.map(function(f){
      var date = new Date(f.created_at).toLocaleDateString('id-ID', { day:'2-digit', month:'short', year:'numeric' });
      return '<div class="file-list-item">' +
        '<div class="fli-icon">📦</div>' +
        '<div class="fli-info">' +
          '<div class="fli-title">' + esc(f.title) + '</div>' +
          '<div class="fli-date">Upload: ' + date + ' &nbsp; <span class="fli-pw">pw: ***</span></div>' +
        '</div>' +
        '<div class="fli-actions">' +
          '<button class="btn-copy" onclick="copyLink(\'' + f.id + '\')">🔗 Link</button>' +
          '<button class="btn-delete" onclick="askDelete(\'' + f.id + '\',\'' + esc(f.title) + '\',\'' + f.file_url + '\')">🗑️ Hapus</button>' +
        '</div>' +
      '</div>';
    }).join('');
  } catch(e) {
    listEl.innerHTML = '<div style="text-align:center;padding:2rem;color:var(--red)">Gagal memuat: ' + e.message + '</div>';
  }
};

window.copyLink = function(id){
  var url = location.origin + location.pathname.replace('admin.html','') + 'verify.html';
  navigator.clipboard.writeText(url).then(function(){
    alert('Link halaman download disalin! Bagikan link ini ke penonton:\n' + url);
  });
};

window.askDelete = function(id, title, fileUrl){
  deleteTarget = { id: id, title: title, fileUrl: fileUrl };
  var modal = document.getElementById('deleteModal');
  var dtitle = document.getElementById('deleteTitle');
  if (dtitle) dtitle.textContent = title;
  if (modal) modal.style.display = 'flex';
};

window.confirmDelete = async function(){
  if (!deleteTarget) return;
  var modal = document.getElementById('deleteModal');
  if (modal) modal.style.display = 'none';

  try {
    // Hapus dari storage
    await supaFetch('/storage/v1/object/' + CFG.bucket + '/' + encodeURIComponent(deleteTarget.fileUrl), { method: 'DELETE' }, true);
    // Hapus dari DB
    await supaFetch('/rest/v1/files?id=eq.' + deleteTarget.id, { method: 'DELETE' }, true);
    loadFiles();
  } catch(e) {
    alert('Gagal hapus: ' + e.message);
  }
  deleteTarget = null;
};

// ===== HELPERS =====
function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function formatSize(b){ if (b < 1024) return b+'B'; if (b < 1048576) return (b/1024).toFixed(1)+'KB'; return (b/1048576).toFixed(1)+'MB'; }

})();
