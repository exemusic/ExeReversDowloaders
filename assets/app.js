/* ExeReversDowloaders - app.js */
(function(){
'use strict';

var CFG = {
  supa_url: 'https://pibjdafaxtqushyndarh.supabase.co',
  supa_anon: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpYmpkYWZheHRxdXNoeW5kYXJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3NTkyNDYsImV4cCI6MjA5MjMzNTI0Nn0.vgrXMx_8leB2cu1H29UcU-TGBoajy07Ky-N-76wdEnM',
  supa_service: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpYmpkYWZheHRxdXNoeW5kYXJoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njc1OTI0NiwiZXhwIjoyMDkyMzM1MjQ2fQ.wraRotDIEeRX5L9LnA37nERA2rkDaoQYeOBCxgoUbUg',
  bucket: 'files',
  yt_channel: 'https://youtube.com/@exerevers?si=ewbTDfc8mxH0znW6',
  sub_wait: 5000
};

// LANGUAGE DETECTION — id = Bahasa Indonesia, else English
var lang = (navigator.language || navigator.userLanguage || 'en').toLowerCase().startsWith('id') ? 'id' : 'en';

var T = {
  en: {
    step1:'STEP 1 OF 2', step2:'STEP 2 OF 2',
    hero_desc:'This content is exclusive for <strong>ExeRevers</strong> subscribers.<br>Subscribe & find the password inside the YouTube video.',
    verify_label:'SUBSCRIBER VERIFICATION',
    verify_desc:'Click the button below to subscribe to ExeRevers, then click <strong>"I\'m Already Subscribed"</strong>',
    btn_sub:'Subscribe ExeRevers', btn_verified:'I\'m Already Subscribed — Continue',
    waiting:'Please wait', wait_sec:'seconds...', ready:'Ready!',
    card1_title:'Watch the Video', card1_desc:'Password is inside the YouTube video',
    card2_title:'Enter Password', card2_desc:'Password = access to exclusive files',
    card3_title:'Download', card3_desc:'File ready to download',
    vault_label:'VAULT ACCESS', pw_placeholder:'Enter password...',
    pw_btn:'Verify Password', pw_no_pw:"Don't have a password?", pw_watch:'Watch video',
    pw_verifying:'Verifying...', pw_wrong:'Wrong password or not found.',
    pw_empty:'Please enter a password.', pw_fail:'Connection failed. Try again.',
    attempt:'Attempt ', attempt_of:' of ', attempt_check:' — Check the YouTube video again.',
    attempt_blocked:'Too many attempts. Blocked for 60 seconds.',
    access_granted:'✅ ACCESS GRANTED', file_ready:'FILE READY TO DOWNLOAD',
    verified:'Verified ✓ — Ready to download', loading:'Loading...',
    btn_download:'DOWNLOAD NOW', dl_preparing:'Preparing file...',
    dl_started:'DOWNLOAD STARTED', back:'← Back to Home',
    admin_only:'ADMIN ACCESS ONLY', admin_pw_placeholder:'Admin password...',
    admin_login_btn:'🔐 Enter Admin Panel', admin_pw_wrong:'Wrong password!',
    admin_connecting:'Connection to server failed. Try again.', admin_verifying:'Verifying...',
    total_files:'Total Files', pw_protected:'Password Protected', connected:'Supabase Connected',
    upload_title:'📤 Upload New File', file_title_label:'File Title',
    file_title_placeholder:'e.g. Reverse Engineering Tools v2.0',
    file_pw_label:'Password for This File', file_pw_placeholder:'Create unique password...',
    file_pw_hint:'This is the password you mention in the YouTube video',
    file_upload_label:'Upload File', drop_text:'Click or drag file here',
    drop_sub:'All formats supported', upload_btn:'📤 Upload & Save',
    file_list_title:'File List', refresh:'🔄 Refresh',
    loading_files:'Loading files...', no_files:'No files yet. Upload your first file! 📦',
    load_fail:'Failed to load: ', copy_link:'🔗 Link', delete_btn:'🗑️ Delete',
    delete_confirm_title:'Delete File?', delete_confirm:'Delete', delete_cancel:'Cancel',
    upload_ok:'✅ File uploaded successfully!',
    err_no_title:'Enter a file title!', err_no_pw:'Enter a password for this file!', err_no_file:'Select a file first!',
    hashing:'Hashing password...', uploading:'Uploading file...', saving:'Saving metadata...', done:'Done!',
    upload_date:'Uploaded: ', copy_msg:'Download page link copied! Share this with your viewers:\n',
    delete_fail:'Delete failed: ', logout:'Logout',
    devtools_title:'ACCESS DENIED', devtools_msg:'Developer tools are not allowed on this platform.', devtools_close:'Close',
  },
  id: {
    step1:'LANGKAH 1 DARI 2', step2:'LANGKAH 2 DARI 2',
    hero_desc:'Konten ini hanya untuk subscriber channel <strong>ExeRevers</strong>.<br>Subscribe & password ada di dalam video YouTube.',
    verify_label:'VERIFIKASI SUBSCRIBER',
    verify_desc:'Klik tombol di bawah untuk subscribe ke channel ExeRevers, lalu klik <strong>"Saya Sudah Subscribe"</strong>',
    btn_sub:'Subscribe ExeRevers', btn_verified:'Saya Sudah Subscribe — Lanjut',
    waiting:'Menunggu', wait_sec:'detik...', ready:'Siap!',
    card1_title:'Tonton Video', card1_desc:'Password ada di dalam video YouTube',
    card2_title:'Masukkan Password', card2_desc:'Password = akses ke file eksklusif',
    card3_title:'Download', card3_desc:'File langsung tersedia',
    vault_label:'VAULT ACCESS', pw_placeholder:'Masukkan password...',
    pw_btn:'Verifikasi Password', pw_no_pw:'Belum dapat password?', pw_watch:'Tonton video',
    pw_verifying:'Memverifikasi...', pw_wrong:'Password salah atau tidak ditemukan.',
    pw_empty:'Masukkan password terlebih dahulu.', pw_fail:'Koneksi gagal. Coba lagi.',
    attempt:'Percobaan ke-', attempt_of:'/', attempt_check:'. Cek kembali video YouTube.',
    attempt_blocked:'Terlalu banyak percobaan. Akses diblokir 60 detik.',
    access_granted:'✅ AKSES DIBERIKAN', file_ready:'FILE SIAP DIUNDUH',
    verified:'Terverifikasi ✓ — Siap diunduh', loading:'Memuat...',
    btn_download:'DOWNLOAD SEKARANG', dl_preparing:'Menyiapkan file...',
    dl_started:'DOWNLOAD DIMULAI', back:'← Kembali ke Halaman Utama',
    admin_only:'ADMIN ACCESS ONLY', admin_pw_placeholder:'Admin password...',
    admin_login_btn:'🔐 Masuk ke Admin Panel', admin_pw_wrong:'Password salah!',
    admin_connecting:'Koneksi ke server gagal. Coba lagi.', admin_verifying:'Memverifikasi...',
    total_files:'Total File', pw_protected:'Password Protected', connected:'Supabase Connected',
    upload_title:'📤 Upload File Baru', file_title_label:'Judul File',
    file_title_placeholder:'Contoh: Tools Reverse Engineering v2.0',
    file_pw_label:'Password untuk File Ini', file_pw_placeholder:'Buat password unik...',
    file_pw_hint:'Password ini yang kamu sebut di video YouTube',
    file_upload_label:'Upload File', drop_text:'Klik atau drag file ke sini',
    drop_sub:'Semua format didukung', upload_btn:'📤 Upload & Simpan',
    file_list_title:'Daftar File', refresh:'🔄 Refresh',
    loading_files:'Memuat file...', no_files:'Belum ada file. Upload file pertamamu! 📦',
    load_fail:'Gagal memuat: ', copy_link:'🔗 Link', delete_btn:'🗑️ Hapus',
    delete_confirm_title:'Hapus File?', delete_confirm:'Hapus', delete_cancel:'Batal',
    upload_ok:'✅ File berhasil diupload!',
    err_no_title:'Masukkan judul file!', err_no_pw:'Masukkan password untuk file ini!', err_no_file:'Pilih file terlebih dahulu!',
    hashing:'Hashing password...', uploading:'Uploading file...', saving:'Menyimpan metadata...', done:'Selesai!',
    upload_date:'Upload: ', copy_msg:'Link halaman download disalin! Bagikan ke penonton:\n',
    delete_fail:'Gagal hapus: ', logout:'Logout',
    devtools_title:'AKSES DITOLAK', devtools_msg:'Developer tools tidak diizinkan di platform ini.', devtools_close:'Tutup',
  }
};

function t(k){ return (T[lang]&&T[lang][k]) || (T.en[k]) || k; }

function applyTranslations(){
  document.querySelectorAll('[data-i18n]').forEach(function(el){
    var k = el.getAttribute('data-i18n');
    if (el.tagName==='INPUT') el.placeholder = t(k);
    else el.innerHTML = t(k);
  });
}

// PARTICLES
(function(){
  var c=document.getElementById('particles'); if(!c)return;
  var ctx=c.getContext('2d'),W,H,pts=[];
  function resize(){W=c.width=innerWidth;H=c.height=innerHeight;}
  resize(); window.addEventListener('resize',resize);
  for(var i=0;i<60;i++)pts.push({x:Math.random()*1920,y:Math.random()*1080,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3,r:Math.random()*1.5+.5,c:Math.random()>.5?'rgba(220,38,38,':'rgba(37,99,235,'});
  function draw(){
    ctx.clearRect(0,0,W,H);
    pts.forEach(function(p){
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=p.c+'.4)';ctx.fill();
    });
    for(var i=0;i<pts.length;i++)for(var j=i+1;j<pts.length;j++){
      var dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.sqrt(dx*dx+dy*dy);
      if(d<120){ctx.beginPath();ctx.strokeStyle='rgba(37,99,235,'+(.15*(1-d/120))+')';ctx.lineWidth=.5;ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.stroke();}
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

// UTILS
function hashPw(pw){
  var enc=new TextEncoder().encode(pw.trim().toLowerCase());
  return crypto.subtle.digest('SHA-256',enc).then(function(buf){
    return Array.from(new Uint8Array(buf)).map(function(b){return b.toString(16).padStart(2,'0');}).join('');
  });
}
function getPage(){var p=location.pathname.split('/').pop();return p||'index.html';}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function formatSize(b){if(b<1024)return b+'B';if(b<1048576)return(b/1024).toFixed(1)+'KB';return(b/1048576).toFixed(1)+'MB';}

// ANTI DEVTOOLS
document.addEventListener('contextmenu',function(e){e.preventDefault();});
document.addEventListener('keydown',function(e){
  if(e.key==='F12'||(e.ctrlKey&&['u','s','i'].includes(e.key.toLowerCase()))||(e.ctrlKey&&e.shiftKey&&['i','j','c'].includes(e.key.toLowerCase()))){
    e.preventDefault();
    if(document.getElementById('_devwarn'))return;
    var w=document.createElement('div');w.id='_devwarn';w.className='warn-overlay';
    w.innerHTML='<div class="warn-box"><div class="warn-icon">⚠️</div><h2>'+t('devtools_title')+'</h2><p>'+t('devtools_msg')+'</p><button onclick="document.getElementById(\'_devwarn\').remove()">'+t('devtools_close')+'</button></div>';
    document.body.appendChild(w);
    return false;
  }
});

// SESSION CHECK
(function(){
  var page=getPage();
  if(page==='verify.html'&&!sessionStorage.getItem('exe_subbed')){location.href='index.html';}
  if(page==='download.html'&&!sessionStorage.getItem('exe_file_id')){location.href='index.html';}
})();

// INIT
document.addEventListener('DOMContentLoaded',function(){applyTranslations();initPage();});
if(document.readyState!=='loading'){applyTranslations();initPage();}

function initPage(){
  var p=getPage();
  if(p==='index.html'||p==='')initIndex();
  if(p==='verify.html')initVerify();
  if(p==='download.html')initDownload();
  if(p==='admin.html')initAdmin();
}

// INDEX
function initIndex(){
  var subBtn=document.getElementById('subBtn');
  var verifiedBtn=document.getElementById('verifiedBtn');
  var timerWrap=document.getElementById('timerWrap');
  var timerFill=document.getElementById('timerFill');
  var timerText=document.getElementById('timerText');
  if(subBtn){
    subBtn.addEventListener('click',function(){
      sessionStorage.setItem('exe_subbed','1');
      if(timerWrap)timerWrap.style.display='flex';
      var elapsed=0,total=CFG.sub_wait;
      var iv=setInterval(function(){
        elapsed+=100;
        var pct=Math.min(100,(elapsed/total)*100);
        if(timerFill)timerFill.style.width=pct+'%';
        var rem=Math.ceil((total-elapsed)/1000);
        if(timerText)timerText.textContent=rem>0?t('waiting')+' '+rem+' '+t('wait_sec'):t('ready');
        if(elapsed>=total){clearInterval(iv);if(verifiedBtn){verifiedBtn.disabled=false;verifiedBtn.querySelector('.lock-icon').textContent='✅';}}
      },100);
    });
  }
  window.goToPassword=function(){if(!sessionStorage.getItem('exe_subbed'))return;location.href='verify.html';};
}

// VERIFY
var attempts=0,blocked=false,blockUntil=0;
function initVerify(){
  var inp=document.getElementById('pwInput');
  if(inp)inp.addEventListener('keypress',function(e){if(e.key==='Enter')checkPassword();});
}
window.togglePw=function(){var i=document.getElementById('pwInput');if(i)i.type=i.type==='password'?'text':'password';};
window.checkPassword=async function(){
  if(blocked){var rem=Math.ceil((blockUntil-Date.now())/1000);if(rem>0){showAttemptWarn(t('attempt_blocked'));return;}blocked=false;attempts=0;}
  var input=document.getElementById('pwInput');if(!input)return;
  var pw=input.value.trim();
  if(!pw){showPwError(t('pw_empty'));return;}
  setVerifyLoading(true);hidePwError();
  try{
    var hash=await hashPw(pw);
    var res=await fetch(CFG.supa_url+'/rest/v1/files?select=id,title,file_url&password_hash=eq.'+encodeURIComponent(hash)+'&limit=1',{headers:{'apikey':CFG.supa_anon,'Authorization':'Bearer '+CFG.supa_anon}});
    var data=await res.json();
    if(data&&data.length>0){
      var file=data[0];
      sessionStorage.setItem('exe_file_id',file.id);
      sessionStorage.setItem('exe_file_title',file.title);
      sessionStorage.setItem('exe_file_url',file.file_url);
      setVerifyLoading(false);
      input.style.outline='2px solid #00c864';
      setTimeout(function(){location.href='download.html';},600);
    }else{
      setVerifyLoading(false);attempts++;
      showPwError(t('pw_wrong'));input.value='';input.focus();
      if(attempts>=5){blocked=true;blockUntil=Date.now()+60000;showAttemptWarn(t('attempt_blocked'));}
      else{showAttemptWarn(t('attempt')+attempts+t('attempt_of')+'5'+t('attempt_check'));}
    }
  }catch(e){setVerifyLoading(false);showPwError(t('pw_fail'));}
};
function setVerifyLoading(v){
  var ld=document.getElementById('pwLoading');var btn=document.getElementById('verifyBtn');
  if(ld)ld.style.display=v?'flex':'none';if(btn)btn.disabled=v;
}
function showPwError(msg){var el=document.getElementById('pwError');if(el){el.style.display='flex';el.innerHTML='<span>❌</span> '+msg;}}
function hidePwError(){var el=document.getElementById('pwError');if(el)el.style.display='none';}
function showAttemptWarn(msg){var el=document.getElementById('attemptWarn');if(el){el.style.display='block';el.textContent='⚠️ '+msg;}}

// DOWNLOAD
var dlFile=null;
function initDownload(){
  var title=sessionStorage.getItem('exe_file_title');
  var url=sessionStorage.getItem('exe_file_url');
  var id=sessionStorage.getItem('exe_file_id');
  if(!id||!url){location.href='index.html';return;}
  dlFile={title:title,url:url,id:id};
  var titleEl=document.getElementById('fileTitle');
  var metaEl=document.getElementById('fileMeta');
  var dlBtn=document.getElementById('dlBtn');
  if(titleEl)titleEl.textContent=title||'Exclusive File';
  if(metaEl)metaEl.textContent=t('verified');
  if(dlBtn)dlBtn.disabled=false;
}
window.startDownload=async function(){
  if(!dlFile)return;
  var dlBtn=document.getElementById('dlBtn');
  var prog=document.getElementById('dlProgress');
  var fill=document.getElementById('dlFill');
  if(dlBtn)dlBtn.disabled=true;
  if(prog)prog.style.display='block';
  var pct=0;
  var iv=setInterval(function(){pct=Math.min(95,pct+Math.random()*15);if(fill)fill.style.width=pct+'%';},200);
  try{
    var publicUrl=CFG.supa_url+'/storage/v1/object/public/'+CFG.bucket+'/'+dlFile.url;
    clearInterval(iv);if(fill)fill.style.width='100%';
    setTimeout(function(){
      var a=document.createElement('a');a.href=publicUrl;a.target='_blank';a.download=dlFile.title||'file';a.style.display='none';
      document.body.appendChild(a);a.click();document.body.removeChild(a);
      if(dlBtn){dlBtn.disabled=false;dlBtn.innerHTML='<span>✅</span> '+t('dl_started');}
      if(prog)prog.style.display='none';
    },400);
  }catch(e){
    clearInterval(iv);
    window.open(CFG.supa_url+'/storage/v1/object/public/'+CFG.bucket+'/'+dlFile.url,'_blank');
    if(dlBtn)dlBtn.disabled=false;if(prog)prog.style.display='none';
  }
};

// ADMIN
var adminAuthed=false,deleteTarget=null,selectedFile=null;
function initAdmin(){
  var token=sessionStorage.getItem('exe_admin');
  if(token&&token.length>10){
    adminAuthed=true;
    var gate=document.getElementById('adminGate');var panel=document.getElementById('adminPanel');
    if(gate)gate.style.display='none';if(panel)panel.style.display='block';
    loadFiles();
  }
  var adminPwEl=document.getElementById('adminPw');
  if(adminPwEl)adminPwEl.addEventListener('keypress',function(e){if(e.key==='Enter')adminLogin();});
  var drop=document.getElementById('fileDrop');
  if(drop){
    drop.addEventListener('dragover',function(e){e.preventDefault();drop.classList.add('dragging');});
    drop.addEventListener('dragleave',function(){drop.classList.remove('dragging');});
    drop.addEventListener('drop',function(e){
      e.preventDefault();drop.classList.remove('dragging');
      if(e.dataTransfer.files[0]){selectedFile=e.dataTransfer.files[0];var dt=document.getElementById('dropText');if(dt)dt.textContent='📎 '+selectedFile.name+' ('+formatSize(selectedFile.size)+')';}
    });
  }
}
window.toggleAdminPw=function(){var i=document.getElementById('adminPw');if(i)i.type=i.type==='password'?'text':'password';};
window.toggleFilePw=function(){var i=document.getElementById('filePw');if(i)i.type=i.type==='password'?'text':'password';};
window.adminLogin=async function(){
  var pwEl=document.getElementById('adminPw');var err=document.getElementById('adminErr');var btn=document.querySelector('.admin-gate-box .btn-verified');
  if(!pwEl)return;var pw=pwEl.value;if(!pw)return;
  if(btn){btn.disabled=true;btn.textContent=t('admin_verifying');}
  if(err)err.style.display='none';
  try{
    var res=await fetch('/.netlify/functions/admin-auth',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:pw})});
    var data=await res.json();
    if(data.ok&&data.token){
      adminAuthed=true;sessionStorage.setItem('exe_admin',data.token);
      document.getElementById('adminGate').style.display='none';document.getElementById('adminPanel').style.display='block';
      loadFiles();
    }else{if(err){err.style.display='block';err.textContent=t('admin_pw_wrong');}pwEl.value='';pwEl.focus();}
  }catch(e){if(err){err.style.display='block';err.textContent=t('admin_connecting');}}
  if(btn){btn.disabled=false;btn.textContent=t('admin_login_btn');}
};
window.adminLogout=function(){adminAuthed=false;sessionStorage.removeItem('exe_admin');location.reload();};
window.handleFile=function(inp){
  if(inp.files&&inp.files[0]){selectedFile=inp.files[0];var dt=document.getElementById('dropText');if(dt)dt.textContent='📎 '+selectedFile.name+' ('+formatSize(selectedFile.size)+')';}
};
window.uploadFile=async function(){
  if(!adminAuthed)return;
  var title=document.getElementById('fileTitle').value.trim();
  var pw=document.getElementById('filePw').value.trim();
  var msg=document.getElementById('uploadMsg');var btn=document.getElementById('uploadBtn');
  var prog=document.getElementById('uploadProgress');var fill=document.getElementById('uploadFill');var upText=document.getElementById('uploadText');
  if(!title){showUploadMsg('error',t('err_no_title'));return;}
  if(!pw){showUploadMsg('error',t('err_no_pw'));return;}
  if(!selectedFile){showUploadMsg('error',t('err_no_file'));return;}
  if(btn)btn.disabled=true;if(prog)prog.style.display='block';if(msg)msg.style.display='none';
  try{
    if(upText)upText.textContent=t('hashing');if(fill)fill.style.width='10%';
    var hash=await hashPw(pw);
    if(upText)upText.textContent=t('uploading');if(fill)fill.style.width='30%';
    var fileName=Date.now()+'_'+selectedFile.name.replace(/[^a-zA-Z0-9._-]/g,'_');
    var upRes=await fetch(CFG.supa_url+'/storage/v1/object/'+CFG.bucket+'/'+fileName,{
      method:'POST',headers:{'apikey':CFG.supa_service,'Authorization':'Bearer '+CFG.supa_service,'Content-Type':selectedFile.type||'application/octet-stream','x-upsert':'true'},body:selectedFile
    });
    if(!upRes.ok){var eb=await upRes.text();throw new Error('Upload storage failed: '+upRes.status+' — '+eb);}
    if(fill)fill.style.width='70%';if(upText)upText.textContent=t('saving');
    var dbRes=await fetch(CFG.supa_url+'/rest/v1/files',{
      method:'POST',headers:{'apikey':CFG.supa_service,'Authorization':'Bearer '+CFG.supa_service,'Content-Type':'application/json','Prefer':'return=representation'},
      body:JSON.stringify({title:title,password_hash:hash,file_url:fileName})
    });
    if(!dbRes.ok){var de=await dbRes.text();throw new Error('Database save failed: '+dbRes.status+' — '+de);}
    if(fill)fill.style.width='100%';if(upText)upText.textContent=t('done');
    showUploadMsg('success',t('upload_ok'));
    document.getElementById('fileTitle').value='';document.getElementById('filePw').value='';
    document.getElementById('dropText').textContent=t('drop_text');selectedFile=null;
    setTimeout(function(){if(prog)prog.style.display='none';},1000);loadFiles();
  }catch(e){showUploadMsg('error','❌ '+e.message);if(prog)prog.style.display='none';}
  if(btn)btn.disabled=false;
};
function showUploadMsg(type,msg){
  var el=document.getElementById('uploadMsg');if(!el)return;
  el.style.display='block';el.className=type==='success'?'upload-success':'upload-error';el.textContent=msg;
  if(type==='success')setTimeout(function(){el.style.display='none';},4000);
}
window.loadFiles=async function(){
  if(!adminAuthed)return;
  var listEl=document.getElementById('fileList');var totalEl=document.getElementById('totalFiles');
  if(!listEl)return;
  listEl.innerHTML='<div style="text-align:center;padding:2rem;color:var(--text-muted)"><div class="spinner" style="margin:0 auto .5rem"></div> '+t('loading_files')+'</div>';
  try{
    var res=await fetch(CFG.supa_url+'/rest/v1/files?select=id,title,file_url,created_at&order=created_at.desc',{headers:{'apikey':CFG.supa_service,'Authorization':'Bearer '+CFG.supa_service}});
    var data=await res.json();
    if(totalEl)totalEl.textContent=data.length||0;
    if(!data.length){listEl.innerHTML='<div style="text-align:center;padding:2rem;color:var(--text-muted)">'+t('no_files')+'</div>';return;}
    listEl.innerHTML=data.map(function(f){
      var date=new Date(f.created_at).toLocaleDateString(lang==='id'?'id-ID':'en-US',{day:'2-digit',month:'short',year:'numeric'});
      return '<div class="file-list-item"><div class="fli-icon">📦</div><div class="fli-info"><div class="fli-title">'+esc(f.title)+'</div><div class="fli-date">'+t('upload_date')+date+' &nbsp;<span class="fli-pw">pw: ***</span></div></div><div class="fli-actions"><button class="btn-copy" onclick="copyLink(\''+f.id+'\')">'+t('copy_link')+'</button><button class="btn-delete" onclick="askDelete(\''+f.id+'\',\''+esc(f.title)+'\',\''+f.file_url+'\')">'+t('delete_btn')+'</button></div></div>';
    }).join('');
  }catch(e){listEl.innerHTML='<div style="text-align:center;padding:2rem;color:var(--red)">'+t('load_fail')+e.message+'</div>';}
};
window.copyLink=function(id){
  var url=location.origin+location.pathname.replace('admin.html','')+('verify.html');
  navigator.clipboard.writeText(url).then(function(){alert(t('copy_msg')+url);});
};
window.askDelete=function(id,title,fileUrl){
  deleteTarget={id:id,title:title,fileUrl:fileUrl};
  var modal=document.getElementById('deleteModal');var dtitle=document.getElementById('deleteTitle');
  if(dtitle)dtitle.textContent=title;if(modal)modal.style.display='flex';
};
window.confirmDelete=async function(){
  if(!deleteTarget)return;
  var modal=document.getElementById('deleteModal');if(modal)modal.style.display='none';
  try{
    await fetch(CFG.supa_url+'/storage/v1/object/'+CFG.bucket+'/'+encodeURIComponent(deleteTarget.fileUrl),{method:'DELETE',headers:{'apikey':CFG.supa_service,'Authorization':'Bearer '+CFG.supa_service}});
    await fetch(CFG.supa_url+'/rest/v1/files?id=eq.'+deleteTarget.id,{method:'DELETE',headers:{'apikey':CFG.supa_service,'Authorization':'Bearer '+CFG.supa_service}});
    loadFiles();
  }catch(e){alert(t('delete_fail')+e.message);}
  deleteTarget=null;
};

})();
