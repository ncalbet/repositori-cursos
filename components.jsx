// ── Shared card components ──────────────────────────────────────────

const STATUS_MAP = {
  actiu:       { label: "Actiu",          bg: "oklch(0.92 0.09 145)", color: "oklch(0.38 0.12 145)" },
  construccio: { label: "En construcció", bg: "oklch(0.94 0.09 70)",  color: "oklch(0.45 0.13 60)"  },
  arxivat:     { label: "Arxivat",        bg: "oklch(0.92 0.01 250)", color: "oklch(0.48 0.02 250)" },
};

function Thumbnail({ imgSrc, color, title }) {
  const [err, setErr] = React.useState(false);
  if (!err && imgSrc) {
    return (
      <img
        src={imgSrc}
        alt={title}
        onError={() => setErr(true)}
        style={{width:"100%", height:"100%", objectFit:"cover", display:"block"}}
      />
    );
  }
  return (
    <div style={{
      width:"100%", height:"100%",
      background: color,
      display:"flex", alignItems:"center", justifyContent:"center",
      opacity: 0.18
    }}>
      <span style={{fontSize:40, opacity:0.5, color:"white"}}>{(title||"?")[0]}</span>
    </div>
  );
}

function StatusBadge({ status }) {
  const s = STATUS_MAP[status] || STATUS_MAP.actiu;
  return (
    <span style={{
      fontSize:12, fontWeight:700, letterSpacing:"0.03em",
      padding:"3px 10px", borderRadius:99,
      background: s.bg, color: s.color,
      textTransform:"uppercase"
    }}>{s.label}</span>
  );
}

function TeacherUrlEditor({ course, onSave, onClose }) {
  const [val, setVal] = React.useState(course.teacherUrl || "");
  return (
    <div style={{
      position:"fixed", inset:0, background:"oklch(0 0 0 / 0.45)",
      display:"flex", alignItems:"center", justifyContent:"center",
      zIndex:1000, backdropFilter:"blur(4px)"
    }} onClick={onClose}>
      <div style={{
        background:"white", borderRadius:20, padding:"32px 36px",
        width:440, boxShadow:"0 24px 80px oklch(0 0 0 / 0.18)",
      }} onClick={e=>e.stopPropagation()}>
        <h3 style={{fontSize:18, fontWeight:900, marginBottom:6}}>Tauler docent</h3>
        <p style={{fontSize:13, color:"oklch(0.5 0.01 250)", fontWeight:500, marginBottom:20}}>
          Afegeix la URL del tauler docent de <strong>{course.title}</strong>.
        </p>
        <input
          autoFocus
          value={val}
          onChange={e=>setVal(e.target.value)}
          placeholder="https://..."
          style={{
            width:"100%", padding:"11px 14px", borderRadius:10,
            border:"1.5px solid oklch(0.88 0.01 250)",
            fontSize:14, fontFamily:"inherit", fontWeight:600,
            outline:"none", marginBottom:16,
            background:"oklch(0.98 0.005 80)"
          }}
        />
        <div style={{display:"flex", gap:10, justifyContent:"flex-end"}}>
          <button onClick={onClose} style={{
            padding:"9px 18px", borderRadius:10, border:"1.5px solid oklch(0.88 0.01 250)",
            background:"white", fontSize:14, fontWeight:700, cursor:"pointer"
          }}>Cancel·lar</button>
          <button onClick={()=>onSave(val)} style={{
            padding:"9px 18px", borderRadius:10, border:"none",
            background:"oklch(0.52 0.16 290)", color:"white",
            fontSize:14, fontWeight:800, cursor:"pointer"
          }}>Desar</button>
        </div>
      </div>
    </div>
  );
}

function CourseCard({ course, radius, isTeacher, onUpdateTeacherUrl }) {
  const [hov, setHov] = React.useState(false);
  const [editingTeacher, setEditingTeacher] = React.useState(false);
  const col = course.color;

  return (
    <>
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          display:"flex", flexDirection:"column",
          background:"white",
          borderRadius: radius,
          overflow:"hidden",
          boxShadow: hov ? "0 12px 40px oklch(0 0 0 / 0.14)" : "0 2px 12px oklch(0 0 0 / 0.07)",
          transform: hov ? "translateY(-4px)" : "translateY(0)",
          transition:"box-shadow 0.22s, transform 0.22s",
        }}
      >
        <div style={{height:5, background:col}}/>
        <a href={course.url} target="_blank" rel="noopener noreferrer"
          style={{height:140, overflow:"hidden", flexShrink:0, display:"block", cursor:"pointer"}}>
          <Thumbnail imgSrc={course.imgSrc} color={col} title={course.title}/>
        </a>
        <div style={{padding:"16px 18px 18px", display:"flex", flexDirection:"column", gap:8, flex:1}}>
          <div style={{display:"flex", alignItems:"center", gap:8, flexWrap:"wrap"}}>
            <span style={{fontSize:11, fontWeight:800, letterSpacing:"0.06em", color:col, textTransform:"uppercase"}}>{course.subject}</span>
            <span style={{fontSize:11, color:"oklch(0.6 0.01 250)", fontWeight:600}}>· {course.level}</span>
          </div>
          <h3 style={{fontSize:17, fontWeight:800, lineHeight:1.25, color:"oklch(0.2 0.01 250)"}}>{course.title}</h3>
          <p style={{
            fontSize:13, lineHeight:1.6, color:"oklch(0.48 0.01 250)", fontWeight:500, flex:1,
            display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical", overflow:"hidden"
          }}>{course.desc}</p>
          <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:4}}>
            <StatusBadge status={course.status}/>
          </div>
          <div style={{display:"flex", gap:8, marginTop:4}}>
            <a href={course.url} target="_blank" rel="noopener noreferrer" style={{
              flex:1, padding:"9px 0", borderRadius:9, border:"1.5px solid " + col,
              background: hov ? col : "white", color: hov ? "white" : col,
              fontSize:13, fontWeight:800, textAlign:"center",
              textDecoration:"none", transition:"all 0.18s"
            }}>Obrir curs →</a>
            {isTeacher && (
              course.teacherUrl ? (
                <a href={course.teacherUrl} target="_blank" rel="noopener noreferrer"
                  title="Tauler docent" style={{
                    padding:"9px 12px", borderRadius:9,
                    border:"1.5px solid oklch(0.88 0.01 250)",
                    background:"oklch(0.97 0.005 290)", color:"oklch(0.42 0.14 290)",
                    fontSize:13, fontWeight:800, textDecoration:"none",
                    display:"flex", alignItems:"center", gap:5, whiteSpace:"nowrap"
                  }}>📊 Docent</a>
              ) : (
                <button onClick={()=>setEditingTeacher(true)} style={{
                  padding:"9px 10px", borderRadius:9,
                  border:"1.5px dashed oklch(0.82 0.01 250)",
                  background:"transparent", color:"oklch(0.65 0.01 250)",
                  fontSize:12, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap"
                }}>+ Docent</button>
              )
            )}
          </div>
        </div>
      </div>
      {editingTeacher && (
        <TeacherUrlEditor course={course} onSave={(url)=>{onUpdateTeacherUrl(course.id,url);setEditingTeacher(false);}} onClose={()=>setEditingTeacher(false)}/>
      )}
    </>
  );
}

function ResourceCard({ resource, radius, isTeacher, onDelete }) {
  const [hov, setHov] = React.useState(false);
  const TYPE_MAP_LOCAL = {
    "web":     { label: "Web interactiva", icon: "🌐", color: "oklch(0.55 0.16 235)" },
    "genially":{ label: "Genially",        icon: "✨", color: "oklch(0.55 0.14 310)" },
    "pptx":    { label: "Presentació",     icon: "📊", color: "oklch(0.52 0.13 50)"  },
    "doc":     { label: "Document",        icon: "📄", color: "oklch(0.52 0.10 200)" },
    "video":   { label: "Vídeo",           icon: "▶",  color: "oklch(0.50 0.15 20)"  },
    "altra":   { label: "Altra",           icon: "📎", color: "oklch(0.52 0.06 250)" },
  };
  const t = TYPE_MAP_LOCAL[resource.resourceType] || TYPE_MAP_LOCAL.altra;
  const SUBJECT_COLORS_LOCAL = {
    "Anglès":"var(--english)","Català":"var(--catalan)","Història":"var(--history)",
    "Ciències Socials":"var(--social)","Ciències":"var(--science)",
    "Matemàtiques":"oklch(0.52 0.14 340)","Altres":"oklch(0.52 0.10 200)",
  };
  const col = SUBJECT_COLORS_LOCAL[resource.subject] || "oklch(0.52 0.1 250)";
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{
      background:"white", borderRadius:radius,
      boxShadow: hov ? "0 8px 28px oklch(0 0 0/0.12)" : "0 2px 10px oklch(0 0 0/0.06)",
      transform: hov ? "translateY(-3px)" : "none", transition:"all 0.2s",
      display:"flex", flexDirection:"column", overflow:"hidden",
    }}>
      <div style={{height:4, background:col}}/>
      <div style={{padding:"18px 20px", display:"flex", flexDirection:"column", gap:10, flex:1}}>
        <div style={{display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:8}}>
          <div style={{display:"flex", alignItems:"center", gap:10}}>
            <div style={{
              width:40, height:40, borderRadius:10, flexShrink:0,
              background: t.color + "22",
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:20
            }}>{t.icon}</div>
            <div>
              <div style={{fontSize:10, fontWeight:800, letterSpacing:"0.06em", color:col, textTransform:"uppercase"}}>{resource.subject}</div>
              <div style={{fontSize:11, color:"oklch(0.6 0.01 250)", fontWeight:600}}>{t.label}</div>
            </div>
          </div>
          {isTeacher && (
            <button onClick={()=>onDelete(resource.id)} style={{
              border:"none", background:"none", cursor:"pointer",
              color:"oklch(0.7 0.01 250)", fontSize:16, padding:"2px 4px",
              opacity: hov ? 1 : 0, transition:"opacity 0.2s"
            }}>✕</button>
          )}
        </div>
        <h3 style={{fontSize:15, fontWeight:800, lineHeight:1.3, color:"oklch(0.2 0.01 250)"}}>{resource.title}</h3>
        {resource.desc && <p style={{
          fontSize:12, lineHeight:1.6, color:"oklch(0.5 0.01 250)", fontWeight:500,
          display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden"
        }}>{resource.desc}</p>}
        <a href={resource.url} target="_blank" rel="noopener noreferrer" style={{
          marginTop:"auto", padding:"8px 0", borderRadius:8,
          border:"1.5px solid " + col,
          background: hov ? col : "white", color: hov ? "white" : col,
          fontSize:12, fontWeight:800, textAlign:"center",
          textDecoration:"none", transition:"all 0.18s", display:"block"
        }}>Obrir recurs →</a>
      </div>
    </div>
  );
}

Object.assign(window, { Thumbnail, StatusBadge, TeacherUrlEditor, CourseCard, ResourceCard });
