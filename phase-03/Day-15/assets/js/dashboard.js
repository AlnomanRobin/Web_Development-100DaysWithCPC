// dashboard.js - handles profile, records, prescriptions, and reports storage + UI
document.addEventListener('DOMContentLoaded', ()=>{
  const session = JSON.parse(localStorage.getItem('sessionUser')||'null');
  if(!session && window.location.pathname.indexOf('login')===-1 && window.location.pathname.indexOf('signup')===-1 && !window.location.pathname.endsWith('index.html')){
    // no session — redirect to login
    window.location='login.html';
    return;
  }

  // Utilities for storage
  function get(key, fallback){ return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback)) }
  function set(key, val){ localStorage.setItem(key, JSON.stringify(val)) }

  // greet user in dashboard
  const user = session;

  // Profile page logic
  const profileForm = document.getElementById('profileForm');
  if(profileForm){
    // load saved profile
    const profiles = get('profiles', {});
    const p = profiles[user.id]||{};
    document.getElementById('pName').value = p.name || user.name || '';
    document.getElementById('pAge').value = p.age||'';
    document.getElementById('pGender').value = p.gender||'Prefer not to say';
    document.getElementById('pPhone').value = p.phone||'';
    document.getElementById('pBlood').value = p.blood||'';
    document.getElementById('pAddress').value = p.address||'';
    document.getElementById('pEmergency').value = p.emergency||'';

    profileForm.addEventListener('submit', e=>{
      e.preventDefault();
      const updated = {
        name: document.getElementById('pName').value,
        age: document.getElementById('pAge').value,
        gender: document.getElementById('pGender').value,
        phone: document.getElementById('pPhone').value,
        blood: document.getElementById('pBlood').value,
        address: document.getElementById('pAddress').value,
        emergency: document.getElementById('pEmergency').value
      }
      profiles[user.id] = updated; set('profiles', profiles); alert('Profile saved')
    })

    document.getElementById('resetProfile').addEventListener('click', ()=>{ localStorage.removeItem('profiles'); location.reload() })
  }

  // Records page logic
  const recordForm = document.getElementById('recordForm');
  if(recordForm){
    const presPreview = document.getElementById('presPreview');
    const prescriptionFile = document.getElementById('prescriptionFile');
    prescriptionFile.addEventListener('change', ()=>{
      const f = prescriptionFile.files[0]; if(!f) return;
      const r = new FileReader(); r.onload = ()=> presPreview.src = r.result; r.readAsDataURL(f);
    })

    function renderRecords(){
      const records = get('records',{}); const list = records[user.id]||[];
      const out = document.getElementById('recordsList'); if(!out) return;
      out.innerHTML = '';
      list.slice().reverse().forEach(r=>{
        const div = document.createElement('div'); div.className='item';
        div.innerHTML = `<div><strong>${r.doctor}</strong><div class=muted>${r.date}</div></div><div style="margin-left:auto">${r.diagnosis||''}</div>`;
        out.appendChild(div);
      })
    }

    recordForm.addEventListener('submit', e=>{
      e.preventDefault();
      const doctor = document.getElementById('docName').value;
      const date = document.getElementById('visitDate').value;
      const what = document.getElementById('whatHappened').value;
      const diagnosis = document.getElementById('diagnosis').value;
      const medicine = document.getElementById('medicine').value;
      const f = prescriptionFile.files[0];

      if(!doctor||!date){ alert('Doctor and date required'); return }

      const readerAndSave = (cb)=>{
        if(!f) return cb(null);
        const fr = new FileReader(); fr.onload = ()=> cb(fr.result); fr.readAsDataURL(f);
      }

      readerAndSave((img)=>{
        const all = get('records',{});
        all[user.id] = all[user.id]||[];
        all[user.id].push({id:Date.now(),doctor,date,what,diagnosis,medicine,image:img});
        set('records',all); recordForm.reset(); presPreview.src=''; renderRecords(); alert('Record saved')
      })
    })
    renderRecords();
  }

  // Prescriptions page logic
  const presGrid = document.getElementById('presGrid');
  const imageModal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImg');
  const closeModal = document.getElementById('closeModal');

  function renderPrescriptions(){
    if(!presGrid) return;
    presGrid.innerHTML='';
    const records = get('records',{})[user.id]||[];
    records.forEach(r=>{
      if(r.image){
        const img = document.createElement('img'); img.src = r.image; img.alt=r.doctor; img.addEventListener('click', ()=>{
          modalImg.src = r.image; imageModal.style.display='flex';
        });
        presGrid.appendChild(img);
      }
    })
  }
  if(closeModal) closeModal.addEventListener('click', ()=>{imageModal.style.display='none'})
  if(imageModal) imageModal.addEventListener('click', (e)=>{ if(e.target===imageModal) imageModal.style.display='none' })
  renderPrescriptions();

  // Test reports page
  const reportForm = document.getElementById('reportForm');
  if(reportForm){
    const reportPreview = document.getElementById('reportPreview');
    document.getElementById('reportFile').addEventListener('change', ()=>{
      const f = document.getElementById('reportFile').files[0]; if(!f) return; const fr=new FileReader(); fr.onload=()=>reportPreview.src=fr.result; fr.readAsDataURL(f);
    })

    reportForm.addEventListener('submit', e=>{
      e.preventDefault();
      const name = document.getElementById('testName').value;
      const date = document.getElementById('testDate').value;
      const f = document.getElementById('reportFile').files[0];
      if(!name||!date){ alert('Please enter test name and date'); return }
      if(!f){ alert('Please attach an image'); return }
      const fr = new FileReader(); fr.onload = ()=>{
        const all = get('reports',{});
        all[user.id] = all[user.id]||[];
        all[user.id].push({id:Date.now(),name,date,image:fr.result}); set('reports',all);
        reportForm.reset(); reportPreview.src=''; renderReports(); alert('Report saved')
      }; fr.readAsDataURL(f);
    })
  }

  function renderReports(){
    const grid = document.getElementById('reportsGrid'); if(!grid) return;
    grid.innerHTML=''; const all = get('reports',{})[user.id]||[];
    all.slice().reverse().forEach(r=>{ const img=document.createElement('img'); img.src=r.image; img.alt=r.name; grid.appendChild(img) })
  }
  renderReports();

  // Latest records on dashboard
  const latest = document.getElementById('latestList');
  if(latest){
    const recs = get('records',{})[user.id]||[];
    recs.slice(-4).reverse().forEach(r=>{
      const d = document.createElement('div'); d.className='item'; d.innerHTML = `<div><strong>${r.doctor}</strong><div class=muted>${r.date}</div></div><div style="margin-left:auto">${r.diagnosis||''}</div>`; latest.appendChild(d)
    })
  }
})
