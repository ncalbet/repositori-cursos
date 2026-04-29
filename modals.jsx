// ── All modals ──────────────────────────────────────────────────────

function AddItemModal({ mode, onSave, onClose }) {
  const ALL_SUBJECTS_M = ["Anglès","Català","Història","Ciències Socials","Ciències","Matemàtiques","Altres"];
  const SUBJECT_COLORS_M = {"Anglès":"var(--english)","Català":"var(--catalan)","Història":"var(--history)","Ciències Socials":"var(--social)","Ciències":"var(--science)","Matemàtiques":"oklch(0.52 0.14 340)","Altres":"oklch(0.52 0.10 200)"};
  const TYPE_MAP_M = {"web":"Web interactiva","genially":"Genially","pptx":"Presentació","doc":"Document","video":"Vídeo","altra":"Altra"};
  const isCourse = mode === "curs";
  const [form, setForm] = React.useState({
    title:"", desc:"", subject:"Anglès", level:"",
    status:"actiu", url:"", teacherUrl:"", type:"web", resourceSubject:"Anglès",
  });
  const set = (k, v) => setForm(f => ({...f, [k]:v}));

  const inputStyle = {
    width:"100%", padding:"9px 12px", borderRadius:9,
    border:"1.5px solid oklch(0.88 0.01 250)",
    fontSize:14, fontFamily:"inherit", fontWeight:600,
    outline:"none", background:"oklch(0.98 0.005 80)"
  };
  const labelStyle = {
    fontSize:12, fontWeight:800, color:"oklch(0.45 0.01 250)",
    textTransform:"uppercase", letterSpacing:"0.04em", marginBottom:4, display:"block"
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.url.trim()) return;
    if (isCourse) {
      onSave({ type:"curs", data:{
        id: Date.now(), title:form.title, desc:form.desc,
        subject:form.subject, level:form.level, status:form.status,
        url:form.url, teacherUrl:form.teacherUrl,
        color: SUBJECT_COLORS_M[form.subject] || "oklch(0.52 0.1 250)", imgSrc:"",
      }});
    } else {
      onSave({ type:"recurs", data:{
        id: Date.now(), title:form.title, desc:form.desc,
        subject:form.resourceSubject, url:form.url, resourceType:form.type,
      }});
    }
  };

  return (
    <div style={{
      position:"fixed", inset:0, background:"oklch(0 0 0 / 0.5)",
      display:"flex", alignItems:"center", justifyContent:"center",
      zIndex:1000, backdropFilter:"blur(4px)", padding:16
    }} onClick={onClose}>
      <div style={{
        background:"white", borderRadius:20, padding:"28px 32px",
        width:"100%", maxWidth:500, maxHeight:"90vh", overflowY:"auto",
        boxShadow:"0 24px 80px oklch(0 0 0 / 0.2)"
      }} onClick={e=>e.stopPropagation()}>
        <h3 style={{fontSize:19, fontWeight:900, marginBottom:4}}>
          {isCourse ? "Afegir nou curs" : "Afegir recurs"}
        </h3>
        <p style={{fontSize:13, color:"oklch(0.55 0.01 250)", marginBottom:20, fontWeight:500}}>
          {isCourse ? "Afegeix una nova web de curs al repositori" : "Afegeix una presentació, genially o altra eina"}
        </p>
        <div style={{display:"flex", flexDirection:"column", gap:14}}>
          <div><label style={labelStyle}>Títol</label><input style={inputStyle} value={form.title} onChange={e=>set("title",e.target.value)} placeholder={isCourse?"Nom del curs":"Títol del recurs"} autoFocus/></div>
          <div><label style={labelStyle}>Descripció</label><textarea style={{...inputStyle, resize:"vertical", minHeight:72}} value={form.desc} onChange={e=>set("desc",e.target.value)} placeholder="Breu descripció..."/></div>
          <div><label style={labelStyle}>URL</label><input style={inputStyle} value={form.url} onChange={e=>set("url",e.target.value)} placeholder="https://..."/></div>
          <div><label style={labelStyle}>Assignatura</label>
            <select value={form[isCourse?"subject":"resourceSubject"]} onChange={e=>set(isCourse?"subject":"resourceSubject",e.target.value)} style={{...inputStyle, cursor:"pointer"}}>
              {ALL_SUBJECTS_M.map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
          {isCourse && (
            <>
              <div><label style={labelStyle}>Nivell</label><input style={inputStyle} value={form.level} onChange={e=>set("level",e.target.value)} placeholder="3r ESO, Batxillerat..."/></div>
              <div><label style={labelStyle}>Estat</label>
                <select value={form.status} onChange={e=>set("status",e.target.value)} style={{...inputStyle, cursor:"pointer"}}>
                  <option value="actiu">Actiu</option>
                  <option value="construccio">En construcció</option>
                  <option value="arxivat">Arxivat</option>
                </select>
              </div>
              <div><label style={labelStyle}>URL tauler docent (opcional)</label><input style={inputStyle} value={form.teacherUrl} onChange={e=>set("teacherUrl",e.target.value)} placeholder="https://..."/></div>
            </>
          )}
          {!isCourse && (
            <div><label style={labelStyle}>Tipus</label>
              <select value={form.type} onChange={e=>set("type",e.target.value)} style={{...inputStyle, cursor:"pointer"}}>
                {Object.entries(TYPE_MAP_M).map(([v,l])=><option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          )}
        </div>
        <div style={{display:"flex", gap:10, justifyContent:"flex-end", marginTop:24}}>
          <button onClick={onClose} style={{
            padding:"9px 18px", borderRadius:10, border:"1.5px solid oklch(0.88 0.01 250)",
            background:"white", fontSize:14, fontWeight:700, cursor:"pointer"
          }}>Cancel·lar</button>
          <button onClick={handleSave} style={{
            padding:"9px 20px", borderRadius:10, border:"none",
            background: isCourse ? "oklch(0.55 0.16 235)" : "oklch(0.52 0.16 310)",
            color:"white", fontSize:14, fontWeight:800, cursor:"pointer",
            opacity: (!form.title||!form.url) ? 0.4 : 1,
          }}>Desar</button>
        </div>
      </div>
    </div>
  );
}

function AdminLoginModal({ onSuccess, onClose, correctPin }) {
  const [pin, setPin] = React.useState("");
  const [err, setErr] = React.useState(false);

  const handleSubmit = () => {
    if (pin === correctPin) { onSuccess(); }
    else { setErr(true); setPin(""); setTimeout(()=>setErr(false), 1500); }
  };

  return (
    <div style={{
      position:"fixed", inset:0, background:"oklch(0 0 0 / 0.5)",
      display:"flex", alignItems:"center", justifyContent:"center",
      zIndex:1000, backdropFilter:"blur(4px)"
    }} onClick={onClose}>
      <div style={{
        background:"white", borderRadius:20, padding:"36px 40px",
        width:340, boxShadow:"0 24px 80px oklch(0 0 0 / 0.2)",
        display:"flex", flexDirection:"column", gap:18, textAlign:"center"
      }} onClick={e=>e.stopPropagation()}>
        <div style={{
          width:56, height:56, borderRadius:16,
          background: err ? "oklch(0.94 0.08 25)" : "oklch(0.22 0.01 250)",
          margin:"0 auto", display:"flex", alignItems:"center",
          justifyContent:"center", fontSize:26, transition:"background 0.3s"
        }}>{err ? "✕" : "🔐"}</div>
        <div>
          <h2 style={{fontSize:20, fontWeight:900}}>Accés administrador</h2>
          <p style={{fontSize:13, color:"oklch(0.55 0.01 250)", marginTop:4, fontWeight:500}}>
            Introdueix el codi PIN per continuar
          </p>
        </div>
        <input
          autoFocus
          type="password"
          inputMode="numeric"
          maxLength={8}
          value={pin}
          onChange={e=>setPin(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&handleSubmit()}
          placeholder="••••"
          style={{
            textAlign:"center", fontSize:24, letterSpacing:"0.3em",
            padding:"12px", borderRadius:12,
            border: err ? "2px solid oklch(0.6 0.15 25)" : "2px solid oklch(0.88 0.01 250)",
            outline:"none", fontFamily:"inherit", fontWeight:700,
            background: err ? "oklch(0.97 0.04 25)" : "oklch(0.98 0.005 80)",
            transition:"all 0.3s"
          }}
        />
        {err && <p style={{color:"oklch(0.5 0.15 25)", fontSize:13, fontWeight:700, marginTop:-8}}>
          PIN incorrecte. Torna-ho a provar.
        </p>}
        <button onClick={handleSubmit} style={{
          padding:"12px", borderRadius:12, border:"none",
          background:"oklch(0.22 0.01 250)", color:"white",
          fontSize:15, fontWeight:800, cursor:"pointer"
        }}>Entrar</button>
      </div>
    </div>
  );
}

function GitHubImportModal({ githubUser, existingUrls, onImport, onClose }) {
  const ALL_SUBJECTS_G = ["Anglès","Català","Història","Ciències Socials","Ciències","Matemàtiques","Altres"];
  const SUBJECT_COLORS_G = {"Anglès":"var(--english)","Català":"var(--catalan)","Història":"var(--history)","Ciències Socials":"var(--social)","Ciències":"var(--science)","Matemàtiques":"oklch(0.52 0.14 340)","Altres":"oklch(0.52 0.10 200)"};
  const [repos, setRepos] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [selected, setSelected] = React.useState({});

  React.useEffect(() => {
    fetch("https://api.github.com/users/" + githubUser + "/repos?per_page=100&sort=updated")
      .then(function(r) { return r.ok ? r.json() : Promise.reject(r.status); })
      .then(function(data) {
        var filtered = data.filter(function(r) { return !r.fork && !r.name.endsWith('.github.io'); });
        setRepos(filtered);
        setLoading(false);
      })
      .catch(function(e) { setError("Error carregant repos: " + e); setLoading(false); });
  }, []);

  const toggle = (name, homepage) => {
    setSelected(s => {
      const n = Object.assign({}, s);
      if (n[name]) { delete n[name]; }
      else { n[name] = { url: homepage || ("https://" + githubUser + ".github.io/" + name + "/"), subject:"Anglès", level:"" }; }
      return n;
    });
  };

  const setField = (name, field, val) => {
    setSelected(s => Object.assign({}, s, {[name]: Object.assign({}, s[name], {[field]: val})}));
  };

  const handleImport = () => {
    var items = Object.entries(selected).map(function([name, data], i) {
      return {
        id: Date.now() + i,
        title: name.replace(/-/g," ").replace(/\b\w/g, function(c){return c.toUpperCase();}),
        desc: (repos && repos.find(function(r){return r.name===name;})||{}).description || "",
        subject: data.subject, level: data.level, status:"actiu",
        url: data.url, teacherUrl:"",
        color: SUBJECT_COLORS_G[data.subject] || "oklch(0.52 0.1 250)", imgSrc:"",
      };
    });
    onImport(items);
  };

  const selCount = Object.keys(selected).length;
  const inputS = {
    padding:"5px 8px", borderRadius:7,
    border:"1.5px solid oklch(0.88 0.01 250)",
    fontSize:12, fontFamily:"inherit", fontWeight:600,
    outline:"none", background:"white", width:"100%"
  };

  return (
    <div style={{
      position:"fixed", inset:0, background:"oklch(0 0 0 / 0.5)",
      display:"flex", alignItems:"center", justifyContent:"center",
      zIndex:1000, backdropFilter:"blur(4px)", padding:16
    }} onClick={onClose}>
      <div style={{
        background:"white", borderRadius:20, padding:"28px 32px",
        width:"100%", maxWidth:620, maxHeight:"85vh",
        display:"flex", flexDirection:"column",
        boxShadow:"0 24px 80px oklch(0 0 0 / 0.2)"
      }} onClick={e=>e.stopPropagation()}>
        <div style={{marginBottom:18}}>
          <h3 style={{fontSize:19, fontWeight:900}}>Importar des de GitHub</h3>
          <p style={{fontSize:13, color:"oklch(0.55 0.01 250)", marginTop:3, fontWeight:500}}>
            Repositoris de <strong>{githubUser}</strong> — selecciona els que vols afegir
          </p>
        </div>
        <div style={{flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:8}}>
          {loading && (
            <div style={{textAlign:"center", padding:40, color:"oklch(0.6 0.01 250)"}}>
              <div style={{fontSize:32, marginBottom:8}}>⏳</div>
              Carregant repositoris...
            </div>
          )}
          {error && <div style={{textAlign:"center", padding:40, color:"oklch(0.5 0.15 25)"}}>{error}</div>}
          {repos && repos.map(repo => {
            const alreadyAdded = existingUrls.some(u => u.includes(repo.name));
            const isSel = !!selected[repo.name];
            return (
              <div key={repo.name} style={{
                border: isSel ? "2px solid oklch(0.55 0.16 235)" : "1.5px solid oklch(0.9 0.01 250)",
                borderRadius:12, padding:"12px 16px",
                background: isSel ? "oklch(0.97 0.02 235)" : alreadyAdded ? "oklch(0.96 0.01 250)" : "white",
                opacity: alreadyAdded ? 0.55 : 1, transition:"all 0.15s"
              }}>
                <div style={{display:"flex", alignItems:"center", gap:12}}>
                  <input type="checkbox" checked={isSel} disabled={alreadyAdded}
                    onChange={()=>toggle(repo.name, repo.homepage)}
                    style={{width:18, height:18, cursor:"pointer"}}/>
                  <div style={{flex:1, minWidth:0}}>
                    <div style={{display:"flex", alignItems:"center", gap:8}}>
                      <span style={{fontSize:14, fontWeight:800}}>{repo.name}</span>
                      {alreadyAdded && <span style={{fontSize:11, color:"oklch(0.55 0.14 150)", fontWeight:700, background:"oklch(0.92 0.07 150)", padding:"1px 8px", borderRadius:99}}>Ja afegit</span>}
                    </div>
                    {repo.description && <div style={{fontSize:12, color:"oklch(0.55 0.01 250)", marginTop:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{repo.description}</div>}
                    <div style={{fontSize:11, color:"oklch(0.65 0.01 250)", marginTop:1}}>
                      {repo.homepage || ("https://" + githubUser + ".github.io/" + repo.name + "/")}
                    </div>
                  </div>
                </div>
                {isSel && (
                  <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginTop:10}}>
                    <select value={selected[repo.name].subject} onChange={e=>setField(repo.name,"subject",e.target.value)} style={inputS}>
                      {ALL_SUBJECTS_G.map(s=><option key={s}>{s}</option>)}
                    </select>
                    <input style={inputS} placeholder="Nivell (3r ESO...)" value={selected[repo.name].level} onChange={e=>setField(repo.name,"level",e.target.value)}/>
                    <input style={inputS} placeholder="URL custom" value={selected[repo.name].url} onChange={e=>setField(repo.name,"url",e.target.value)}/>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div style={{display:"flex", gap:10, justifyContent:"space-between", alignItems:"center", marginTop:20, paddingTop:16, borderTop:"1.5px solid oklch(0.92 0.01 250)"}}>
          <span style={{fontSize:13, color:"oklch(0.55 0.01 250)", fontWeight:600}}>{selCount} seleccionats</span>
          <div style={{display:"flex", gap:8}}>
            <button onClick={onClose} style={{
              padding:"9px 18px", borderRadius:10, border:"1.5px solid oklch(0.88 0.01 250)",
              background:"white", fontSize:14, fontWeight:700, cursor:"pointer"
            }}>Cancel·lar</button>
            <button onClick={handleImport} disabled={!selCount} style={{
              padding:"9px 20px", borderRadius:10, border:"none",
              background:"oklch(0.22 0.01 250)", color:"white",
              fontSize:14, fontWeight:800, cursor:"pointer", opacity: selCount ? 1 : 0.4
            }}>Importar {selCount > 0 ? "(" + selCount + ")" : ""}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginModal({ onClose }) {
  const [user, setUser] = React.useState("");
  const [pass, setPass] = React.useState("");
  const inputStyle = {
    width:"100%", padding:"10px 14px", borderRadius:10,
    border:"1.5px solid oklch(0.88 0.01 250)",
    fontSize:15, fontFamily:"inherit", fontWeight:600,
    outline:"none", background:"oklch(0.98 0.005 80)"
  };
  return (
    <div style={{
      position:"fixed", inset:0, background:"oklch(0 0 0 / 0.45)",
      display:"flex", alignItems:"center", justifyContent:"center",
      zIndex:1000, backdropFilter:"blur(4px)"
    }} onClick={onClose}>
      <div style={{
        background:"white", borderRadius:20, padding:"36px 40px",
        width:380, boxShadow:"0 24px 80px oklch(0 0 0 / 0.18)",
        display:"flex", flexDirection:"column", gap:20
      }} onClick={e=>e.stopPropagation()}>
        <div style={{textAlign:"center"}}>
          <div style={{
            width:56, height:56, borderRadius:16, background:"oklch(0.94 0.06 235)",
            margin:"0 auto 12px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28
          }}>🎓</div>
          <h2 style={{fontSize:22, fontWeight:900}}>Accés Alumnes</h2>
          <p style={{fontSize:13, color:"oklch(0.55 0.01 250)", marginTop:4, fontWeight:500}}>
            Entra amb el teu usuari per veure els teus cursos
          </p>
        </div>
        <div style={{display:"flex", flexDirection:"column", gap:12}}>
          <input style={inputStyle} placeholder="Nom d'usuari" value={user} onChange={e=>setUser(e.target.value)}/>
          <input type="password" style={inputStyle} placeholder="Contrasenya" value={pass} onChange={e=>setPass(e.target.value)}/>
        </div>
        <button style={{
          padding:"12px", borderRadius:12, border:"none",
          background:"oklch(0.55 0.16 235)", color:"white",
          fontSize:15, fontWeight:800, cursor:"pointer"
        }}>Entrar</button>
        <p style={{textAlign:"center", fontSize:12, color:"oklch(0.65 0.01 250)", fontWeight:600}}>
          Funció pròximament disponible
        </p>
      </div>
    </div>
  );
}

Object.assign(window, { AddItemModal, AdminLoginModal, GitHubImportModal, LoginModal });
