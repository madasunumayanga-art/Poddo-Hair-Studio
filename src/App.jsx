import { useState, useRef, useEffect } from "react";

const SALON="Poddo Hair Studio";
const PHONE="+94 74 341 4246";
const GOOGLE_URL="https://g.page/r/poddo-hair-studio/review";
const INSTAGRAM="https://www.instagram.com/poddohairstudio/";
const FACEBOOK="https://www.facebook.com/poddohairstudio/";
const TIKTOK="https://www.tiktok.com/@poddohairstudio";
const PEAK_SURCHARGE=250;
const OFFPEAK_DISCOUNT=200;

const SERVICES=[
  {id:"s1",name:"Baby's First Haircut",emoji:"👶",duration:30,price:1500,color:"#f59e0b",special:true},
  {id:"s2",name:"Haircut",emoji:"✂️",duration:30,price:1200,color:"#ec4899"},
  {id:"s3",name:"Hair Colouring",emoji:"🎨",duration:60,price:3500,color:"#8b5cf6"},
  {id:"s4",name:"Hair Arrangement",emoji:"🎀",duration:45,price:1800,color:"#06b6d4"},
  {id:"s5",name:"Hair Styling",emoji:"💫",duration:45,price:2000,color:"#10b981"},
];

const STYLISTS=[
  {name:"Nadeesha",emoji:"👩‍🎤",specialty:"Baby & Toddler specialist"},
  {name:"Priyanka",emoji:"👩‍🎨",specialty:"Colouring & Styling expert"},
  {name:"Chamari",emoji:"👩‍💼",specialty:"All ages · Arrangements"},
];

const TIME_SLOTS=["09:00 AM","09:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM","12:00 PM","02:00 PM","02:30 PM","03:00 PM","03:30 PM","04:00 PM","04:30 PM","05:00 PM","05:30 PM"];
const FULL_SLOTS=["11:00 AM","03:00 PM"];
const SVC_MAP={"1":"Baby's First Haircut","2":"Haircut","3":"Hair Colouring","4":"Hair Arrangement","5":"Hair Styling"};
const STYL_MAP={"1":"Nadeesha","2":"Priyanka","3":"Chamari","4":"Any"};

const KNOWN={"94771112233":{pname:"Kavindi",children:[{name:"Seneth",age:"5",dob:"2019-03-15"}],visits:4,noShows:0},"94762223344":{pname:"Sachini",children:[{name:"Dinuli",age:"3",dob:"2021-06-20"}],visits:2,noShows:2}};

function isPeak(t,d){if(!t)return false;const h=parseInt(t);const pm=t.includes("PM")&&h!==12;const h24=pm?h+12:(t.includes("PM")&&h===12?12:h);const day=d?new Date(d).getDay():new Date().getDay();return day===0||day===6||h24>=16;}
function calcPrice(sname,t,d,bday){const s=SERVICES.find(x=>x.name===sname);if(!s)return 0;const p=isPeak(t,d);return Math.max(0,s.price+(p?PEAK_SURCHARGE:-OFFPEAK_DISCOUNT)-(bday?300:0));}
function Bold({text}){return String(text).split(/\*(.+?)\*/g).map((p,i)=>i%2===1?<strong key={i}>{p}</strong>:String(p).split(/(_(.+?)_)/g).map((q,j)=>j%3===2?<em key={j} style={{opacity:.65,fontStyle:"normal"}}>{q}</em>:q));}
function useIsMobile(){const[m,setM]=useState(window.innerWidth<768);useEffect(()=>{const f=()=>setM(window.innerWidth<768);window.addEventListener("resize",f);return()=>window.removeEventListener("resize",f);},[]);return m;}

const STATUS_CFG={
  pending:  {label:"Pending",  bg:"#fff7ed",color:"#ea580c",border:"#fed7aa",next:"confirmed",btn:"Confirm ✓"},
  confirmed:{label:"Confirmed",bg:"#f0fdf4",color:"#16a34a",border:"#bbf7d0",next:"seated",   btn:"Seated 💺"},
  seated:   {label:"In Chair", bg:"#eff6ff",color:"#2563eb",border:"#bfdbfe",next:"done",      btn:"Done ✓"},
  done:     {label:"Done",     bg:"#faf5ff",color:"#7c3aed",border:"#ddd6fe",next:null,        btn:null},
  reviewed: {label:"Reviewed", bg:"#fdf2f8",color:"#be185d",border:"#fbcfe8",next:null,        btn:null},
  waitlist: {label:"Waitlist", bg:"#fefce8",color:"#ca8a04",border:"#fde68a",next:null,        btn:null},
};

const DEMO=[
  {id:1,pname:"Kavindi Perera",  child:"Seneth",age:"5y",service:"Haircut",             stylist:"Nadeesha",time:"09:00 AM",date:"Today",phone:"+94 77 111 2233",status:"confirmed",isNew:false,peak:false,price:1000},
  {id:2,pname:"Sachini Fernando",child:"Dinuli",age:"3y",service:"Baby's First Haircut",stylist:"Priyanka", time:"10:00 AM",date:"Today",phone:"+94 76 222 3344",status:"pending",  isNew:false,peak:false,price:1300,firstCut:true},
  {id:3,pname:"Malsha Silva",    child:"Asel",  age:"7y",service:"Hair Arrangement",    stylist:"Chamari",  time:"11:00 AM",date:"Today",phone:"+94 71 333 4455",status:"confirmed",isNew:false,peak:false,price:1600},
  {id:4,pname:"Tharushi Kumari", child:"Nimal", age:"4y",service:"Hair Styling",         stylist:"Nadeesha", time:"04:30 PM",date:"Today",phone:"+94 70 444 5566",status:"pending",  isNew:false,peak:true, price:2250},
  {id:5,pname:"Dilhani Madushani",child:"Piyumi",age:"6y",service:"Hair Colouring",     stylist:"Chamari",  time:"05:00 PM",date:"Today",phone:"+94 72 555 6677",status:"confirmed",isNew:false,peak:true, price:3750},
];

function WABot({onBook,onReview,onWaitlist}){
  const INIT=`👋 *Ayubowan!* Welcome to *Poddo Hair Studio* ✂️\n_Sri Lanka's First Kids-Only Salon!_\n\n1️⃣ Book appointment\n2️⃣ Services & prices\n3️⃣ How was your visit?\n4️⃣ Follow us on social media\n5️⃣ Location & hours`;
  const[msgs,setMsgs]=useState([{from:"bot",text:INIT}]);
  const[inp,setInp]=useState("");
  const[mode,setMode]=useState("idle");
  const[d,setD]=useState({});
  const[rs,setRs]=useState(0);
  const[rd,setRd]=useState({});
  const[ret,setRet]=useState(null);
  const endRef=useRef(null);
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"});},[msgs]);
  const bot=(m,t)=>[...m,{from:"bot",text:t}];

  const finalize=(bData,m)=>{
    const svc=SERVICES.find(s=>s.name===bData.service);
    const peak=isPeak(bData.time,"");
    const bdDisc=bData.birthdayDiscount?300:0;
    const price=Math.max(0,(svc?.price||0)+(peak?PEAK_SURCHARGE:-OFFPEAK_DISCOUNT)-bdDisc);
    const peakNote=peak?`\n⚡ Peak surcharge: *+LKR ${PEAK_SURCHARGE}*`:`\n🌅 Off-peak discount: *-LKR ${OFFPEAK_DISCOUNT}*`;
    const bdNote=bdDisc>0?`\n🎂 Birthday discount: *-LKR ${bdDisc}*`:"";
    const sibNote=bData.sibling?`\n👦 Sibling: ${bData.sibling}`:"";
    const firstNote=bData.service==="Baby's First Haircut"?`\n\n🎀 *First Cut Package:*\n• Keepsake certificate\n• Lock of hair\n• Photo corner`:"";
    const conf=`✅ *Booking Confirmed!* 🎉\n\n✂️ *Poddo Hair Studio*\n\n👩 Parent: ${bData.pname}\n👶 Child: ${bData.cname}\n💇 ${bData.service} ${svc?.emoji||""}\n👤 Stylist: ${bData.stylist||"Any"}${sibNote}\n📅 ${bData.date||"TBD"} · ⏰ ${bData.time}\n💰 Total: *LKR ${price.toLocaleString()}*${peakNote}${bdNote}${firstNote}\n\n⚠️ _Please confirm 24hrs before or reply CANCEL._\n💡 _Bring your child's favourite toy for a calm visit!_\n🎁 _Refer a friend → LKR 200 off next visit!_`;
    onBook({id:Date.now(),pname:bData.pname,child:bData.cname,age:bData.cage||"",service:bData.service,stylist:bData.stylist||"Any",time:bData.time,date:bData.date||"Today",phone:bData.phone||"",status:"pending",isNew:true,peak,price,sibling:bData.sibling||null,firstCut:bData.service==="Baby's First Haircut",birthdayDiscount:bdDisc>0});
    m=bot(m,conf);setMode("idle");setD({});setMsgs(m);
  };

  const send=()=>{
    if(!inp.trim())return;
    const v=inp.trim();
    let m=[...msgs,{from:"user",text:v}];
    setInp("");
    setTimeout(()=>{
      if(mode==="review"){
        let r={...rd};
        if(rs===0){r.rating=v;setRd(r);m=bot(m,`${"⭐".repeat(parseInt(v)||5)}\n\nThank you! Any words to share?\n_(or say *skip*)_`);setRs(1);setMsgs(m);return;}
        r.comment=v.toLowerCase()==="skip"?"":v;
        const stars=parseInt(r.rating)||5;
        const social=`\n\n📸 Instagram: ${INSTAGRAM}\n👍 Facebook: ${FACEBOOK}\n🎵 TikTok: ${TIKTOK}`;
        m=bot(m,stars>=4?`🙏 *Thank you so much!* 💕\n\nPlease share on Google!\n👉 *${GOOGLE_URL}*\n\n_30 seconds — means the world!_${social}\n\n🎁 Refer a friend → *LKR 200 off* next visit!`:`🙏 Thank you for the honest feedback!\nWe'll improve! 💕\n\n📞 ${PHONE}${social}`);
        onReview({stars,comment:r.comment});setMode("idle");setRs(0);setRd({});setMsgs(m);return;
      }
      if(mode==="idle"){
        if(v==="1"){setMode("phone");m=bot(m,"What is your *WhatsApp number*?");}
        else if(v==="2"){m=bot(m,`✂️ *Services & Prices:*\n\n${SERVICES.map(s=>`${s.emoji} *${s.name}* — LKR ${s.price.toLocaleString()}${s.special?" 🌟":""}`).join("\n")}\n\n⚡ _Peak: +LKR ${PEAK_SURCHARGE} (weekends & after 4 PM)_\n🌅 _Off-peak: -LKR ${OFFPEAK_DISCOUNT} (weekday mornings)_\n\nReply *1* to book!`);}
        else if(v==="3"){setMode("review");setRs(0);m=bot(m,`We hope your little one had an amazing time! 🌟\n\nRate your experience:\n\n⭐ 1 · ⭐⭐ 2 · ⭐⭐⭐ 3 · ⭐⭐⭐⭐ 4 · ⭐⭐⭐⭐⭐ 5`);}
        else if(v==="4"){m=bot(m,`💕 *Follow Poddo!*\n\n📸 Instagram: ${INSTAGRAM}\n👍 Facebook: ${FACEBOOK}\n🎵 TikTok: ${TIKTOK}\n⭐ Google Review: ${GOOGLE_URL}\n\n_Tag us! #PoddoHairStudio_ ✂️`);}
        else if(v==="5"){m=bot(m,`📍 16 Gunasekara Udyanaya, Nawala\n🕘 Mon–Sun: 9:00 AM – 6:00 PM\n📞 ${PHONE}\n\n⚡ Peak: Weekends & after 4 PM (+LKR ${PEAK_SURCHARGE})\n🌅 Off-peak: Weekday mornings (-LKR ${OFFPEAK_DISCOUNT})`);}
        else{m=bot(m,"Please reply *1* to *5* 😊");}
        setMsgs(m);return;
      }
      if(mode==="phone"){
        const key=v.replace(/[\s\-+]/g,"");
        const known=KNOWN[key];
        setD({phone:v});
        if(known){
          setRet(known);
          if(known.noShows>=2){m=bot(m,`Hi *${known.pname}*! 👋\n\n⚠️ You've missed *${known.noShows} appointments* before.\n\nWe'll need a *24hr confirmation* for your next booking or the slot will be released.\n\nContinue?\n1️⃣ Yes\n2️⃣ No`);setMode("noshowwarn");setMsgs(m);return;}
          m=bot(m,`Welcome back *${known.pname}*! 💕 _(${known.visits} visits — thank you!)_\n\nBooking for:\n${known.children.map((c,i)=>`${i+1}️⃣ ${c.name} (${c.age} yrs)`).join("\n")}\n${known.children.length+1}️⃣ Add new child`);
          setMode("returning");
        }else{m=bot(m,"Welcome! 😊 What is the *parent's name*?");setMode("pname");}
        setMsgs(m);return;
      }
      if(mode==="noshowwarn"){
        if(v==="2"){m=bot(m,"No problem! Reply *1* anytime to book. 💕");setMode("idle");setMsgs(m);return;}
        const known=ret;m=bot(m,`Great!\n${known.children.map((c,i)=>`${i+1}️⃣ ${c.name} (${c.age} yrs)`).join("\n")}\n${known.children.length+1}️⃣ Add new child`);setMode("returning");setMsgs(m);return;
      }
      if(mode==="returning"){
        const known=ret;const idx=parseInt(v)-1;
        if(idx>=0&&idx<known.children.length){
          const child=known.children[idx];
          const dob=new Date(child.dob);const bday=dob.getMonth()===new Date().getMonth();
          setD(p=>({...p,pname:known.pname,cname:child.name,cage:child.age,birthdayDiscount:bday}));
          m=bot(m,`Booking for *${child.name}*${bday?`\n\n🎂 *Birthday Month!* -LKR 300 discount applied automatically! 🎉`:""}\n\nWhich service?\n${SERVICES.map((s,i)=>`${i+1}️⃣ ${s.emoji} ${s.name} — LKR ${s.price.toLocaleString()}`).join("\n")}`);
          setMode("service");
        }else{m=bot(m,"Child's *name and age*?\n_(e.g. Sena, 4 years)_");setMode("newchild");}
        setMsgs(m);return;
      }
      if(mode==="newchild"){setD(p=>({...p,cname:v}));m=bot(m,"Child's *date of birth*? 🎂\n_(e.g. 2020-05-14 — for birthday surprises!)_");setMode("childdob");setMsgs(m);return;}
      if(mode==="childdob"){setD(p=>({...p,dob:v}));m=bot(m,`Which service?\n${SERVICES.map((s,i)=>`${i+1}️⃣ ${s.emoji} ${s.name} — LKR ${s.price.toLocaleString()}`).join("\n")}`);setMode("service");setMsgs(m);return;}
      if(mode==="pname"){setD(p=>({...p,pname:v}));m=bot(m,`Hi *${v}*! 👋\n\nChild's *name and age*?\n_(e.g. Sena, 4 years)_`);setMode("cname");setMsgs(m);return;}
      if(mode==="cname"){setD(p=>({...p,cname:v}));m=bot(m,"Child's *date of birth*? 🎂\n_(e.g. 2020-05-14)_");setMode("dob");setMsgs(m);return;}
      if(mode==="dob"){setD(p=>({...p,dob:v}));m=bot(m,`Which service?\n${SERVICES.map((s,i)=>`${i+1}️⃣ ${s.emoji} ${s.name} — LKR ${s.price.toLocaleString()}`).join("\n")}`);setMode("service");setMsgs(m);return;}
      if(mode==="service"){const svc=SVC_MAP[v]||v;setD(p=>({...p,service:svc}));m=bot(m,`Pick your *stylist*:\n\n${STYLISTS.map((s,i)=>`${i+1}️⃣ ${s.emoji} *${s.name}* — _${s.specialty}_`).join("\n")}\n4️⃣ No preference`);setMode("stylist");setMsgs(m);return;}
      if(mode==="stylist"){setD(p=>({...p,stylist:STYL_MAP[v]||"Any"}));m=bot(m,"What *date* works for you?\n_(e.g. Tomorrow, June 10th)_");setMode("date");setMsgs(m);return;}
      if(mode==="date"){setD(p=>({...p,date:v}));m=bot(m,`Preferred *time slot*?\n\n🌅 _Before 4 PM weekdays:_ -LKR ${OFFPEAK_DISCOUNT}\n⚡ _Weekends & after 4 PM:_ +LKR ${PEAK_SURCHARGE}\n\n${TIME_SLOTS.slice(0,7).join(" · ")}\n${TIME_SLOTS.slice(7).join(" · ")}`);setMode("time");setMsgs(m);return;}
      if(mode==="time"){
        if(FULL_SLOTS.includes(v)){m=bot(m,`😔 *${v}* is fully booked!\n\nJoin the *waiting list*? We'll notify you if a slot opens!\n\n1️⃣ Yes, add me\n2️⃣ Pick different time`);setD(p=>({...p,time:v}));setMode("waitlist");setMsgs(m);return;}
        setD(p=>({...p,time:v}));m=bot(m,"Add a *sibling* to this booking?\n\n1️⃣ Yes\n2️⃣ No");setMode("sibling");setMsgs(m);return;
      }
      if(mode==="waitlist"){
        if(v==="1"){onWaitlist({...d,status:"waitlist",isNew:true,id:Date.now(),pname:d.pname||"Waiting",child:d.cname||"",service:d.service||"",stylist:d.stylist||"Any",time:d.time,date:d.date||"TBD",price:0});m=bot(m,`✅ *Added to waiting list!*\nWe'll WhatsApp you the moment *${d.time}* opens up! 🙏\n\nBook a backup time?\n1️⃣ Yes\n2️⃣ No thanks`);setMode("idle");setMsgs(m);return;}
        m=bot(m,`Pick another slot:\n${TIME_SLOTS.filter(t=>!FULL_SLOTS.includes(t)).slice(0,8).join(" · ")}`);setMode("time");setMsgs(m);return;
      }
      if(mode==="sibling"){
        if(v==="1"){m=bot(m,"Sibling's *name and service*?\n_(e.g. Piyumi, Haircut)_");setMode("sibname");setMsgs(m);return;}
        finalize(d,m);return;
      }
      if(mode==="sibname"){setD(p=>({...p,sibling:v}));finalize({...d,sibling:v},m);return;}
      setMsgs(m);
    },500);
  };

  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%",borderRadius:24,overflow:"hidden",boxShadow:"0 32px 80px rgba(236,72,153,0.2)",fontFamily:"'Nunito',sans-serif"}}>
      <div style={{background:"linear-gradient(135deg,#ec4899,#8b5cf6,#06b6d4)",padding:"14px 18px",display:"flex",alignItems:"center",gap:12,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle at 70% 50%,rgba(255,255,255,0.15),transparent 60%)"}}/>
        <div style={{width:44,height:44,borderRadius:"50%",background:"rgba(255,255,255,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,zIndex:1,flexShrink:0}}>✂️</div>
        <div style={{flex:1,zIndex:1}}>
          <div style={{color:"#fff",fontWeight:900,fontSize:15,fontFamily:"'Baloo 2',cursive"}}>{SALON}</div>
          <div style={{color:"rgba(255,255,255,0.8)",fontSize:10,display:"flex",alignItems:"center",gap:5}}><span style={{width:6,height:6,borderRadius:"50%",background:"#4ade80",display:"inline-block"}}/>Kids Only · Nawala · Online</div>
        </div>
        <div style={{zIndex:1,display:"flex",gap:5}}>
          {[[INSTAGRAM,"📸"],[FACEBOOK,"👍"],[TIKTOK,"🎵"],[GOOGLE_URL,"⭐"]].map(([url,icon])=>(
            <a key={icon} href={url} target="_blank" style={{background:"rgba(255,255,255,0.2)",color:"#fff",fontSize:14,width:28,height:28,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",textDecoration:"none"}}>{icon}</a>
          ))}
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"14px 12px",background:"#fdf4ff",display:"flex",flexDirection:"column",gap:10,backgroundImage:"radial-gradient(circle at 80% 10%,rgba(236,72,153,0.05),transparent 40%)"}}>
        {msgs.map((msg,i)=>(
          <div key={i} style={{display:"flex",justifyContent:msg.from==="bot"?"flex-start":"flex-end",animation:"msgIn 0.3s ease"}}>
            {msg.from==="bot"&&<div style={{width:30,height:30,borderRadius:"50%",background:"linear-gradient(135deg,#ec4899,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,marginRight:8,flexShrink:0,marginTop:2}}>✂️</div>}
            <div style={{maxWidth:"78%",background:msg.from==="bot"?"#fff":"linear-gradient(135deg,#ec4899,#8b5cf6)",color:msg.from==="bot"?"#2d1a3a":"#fff",padding:"10px 14px",borderRadius:msg.from==="bot"?"4px 18px 18px 18px":"18px 4px 18px 18px",fontSize:13,lineHeight:1.65,whiteSpace:"pre-line",boxShadow:msg.from==="bot"?"0 2px 16px rgba(0,0,0,0.07)":"0 6px 20px rgba(139,92,246,0.35)",fontWeight:500}}>
              <Bold text={msg.text}/>
            </div>
          </div>
        ))}
        <div ref={endRef}/>
      </div>
      <div style={{padding:"12px 14px",background:"#fff",borderTop:"2px solid #fce7f3",display:"flex",gap:10,alignItems:"center"}}>
        <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Type a message…" style={{flex:1,background:"#fdf4ff",border:"2px solid #e9d5ff",borderRadius:24,padding:"10px 16px",color:"#2d1a3a",fontSize:13,outline:"none",fontFamily:"'Nunito',sans-serif",fontWeight:600}}/>
        <button onClick={send} style={{width:44,height:44,borderRadius:"50%",background:"linear-gradient(135deg,#ec4899,#8b5cf6)",border:"none",cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 6px 18px rgba(139,92,246,0.45)",color:"#fff",flexShrink:0}}>➤</button>
      </div>
    </div>
  );
}

function BookingCard({b,onStatus}){
  const s=STATUS_CFG[b.status]||STATUS_CFG.pending;
  const svc=SERVICES.find(sv=>sv.name===b.service);
  return(
    <div style={{background:"#fff",border:"1px solid #fce7f3",borderRadius:20,padding:"14px 18px",display:"flex",alignItems:"center",gap:14,animation:b.isNew?"cardIn 0.5s cubic-bezier(0.34,1.56,0.64,1)":"none",boxShadow:"0 2px 20px rgba(236,72,153,0.07)",borderLeft:`4px solid ${svc?.color||"#ec4899"}`}}>
      <div style={{width:48,height:48,borderRadius:16,background:`${svc?.color||"#ec4899"}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{svc?.emoji||"✂️"}</div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
          <span style={{color:"#1a0a2a",fontWeight:900,fontSize:14,fontFamily:"'Baloo 2',cursive"}}>{b.pname}</span>
          {b.isNew&&<span style={{background:"linear-gradient(135deg,#ec4899,#8b5cf6)",color:"#fff",fontSize:9,padding:"2px 7px",borderRadius:10,fontWeight:800}}>NEW ✨</span>}
          {b.firstCut&&<span style={{background:"#fef3c7",color:"#d97706",fontSize:9,padding:"2px 7px",borderRadius:10,fontWeight:800}}>👶 FIRST CUT</span>}
          {b.birthdayDiscount&&<span style={{background:"#fce7f3",color:"#be185d",fontSize:9,padding:"2px 7px",borderRadius:10,fontWeight:800}}>🎂 BDAY</span>}
          {b.peak&&<span style={{background:"#fff7ed",color:"#ea580c",fontSize:9,padding:"2px 7px",borderRadius:10,fontWeight:800}}>⚡ PEAK</span>}
          {b.status==="waitlist"&&<span style={{background:"#fefce8",color:"#ca8a04",fontSize:9,padding:"2px 7px",borderRadius:10,fontWeight:800}}>⏱ WAITLIST</span>}
        </div>
        <div style={{color:"#7c3aed",fontSize:12,marginTop:3,fontWeight:700}}>👶 {b.child}{b.age?` · ${b.age}`:""}</div>
        {b.sibling&&<div style={{color:"#be185d",fontSize:11,marginTop:1,fontWeight:600}}>👦 Sibling: {b.sibling}</div>}
        <div style={{color:"#a78bfa",fontSize:11,marginTop:2}}>⏰ {b.time} · 👤 {b.stylist}</div>
        {b.price>0&&<div style={{color:"#ec4899",fontSize:12,fontWeight:800,marginTop:2}}>LKR {b.price.toLocaleString()}{b.peak?<span style={{color:"#ea580c",fontSize:10,fontWeight:600}}> (peak)</span>:null}</div>}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:6,alignItems:"flex-end",flexShrink:0}}>
        <span style={{background:s.bg,color:s.color,border:`1px solid ${s.border}`,fontSize:11,padding:"3px 10px",borderRadius:20,fontWeight:700,whiteSpace:"nowrap"}}>{s.label}</span>
        {s.next&&<button onClick={()=>onStatus(b.id,s.next)} style={{background:s.bg,color:s.color,border:`1px solid ${s.border}`,borderRadius:12,padding:"4px 12px",fontSize:11,cursor:"pointer",fontWeight:700,fontFamily:"'Nunito',sans-serif",whiteSpace:"nowrap"}}>{s.btn}</button>}
      </div>
    </div>
  );
}

function PricingPanel(){
  const[demo,setDemo]=useState({time:"10:00 AM",date:""});
  const peak=isPeak(demo.time,demo.date);
  return(
    <div style={{background:"#fff",border:"1px solid #fce7f3",borderRadius:20,padding:"20px",boxShadow:"0 4px 20px rgba(236,72,153,0.08)"}}>
      <div style={{fontFamily:"'Baloo 2',cursive",fontWeight:800,fontSize:16,color:"#1a0a2a",marginBottom:16}}>💰 Live Price Calculator</div>
      <div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap"}}>
        <select value={demo.time} onChange={e=>setDemo(p=>({...p,time:e.target.value}))} style={{flex:1,background:"#fdf4ff",border:"2px solid #e9d5ff",borderRadius:12,padding:"8px 12px",color:"#2d1a3a",fontSize:13,fontWeight:700,fontFamily:"'Nunito',sans-serif",outline:"none"}}>
          {TIME_SLOTS.map(t=><option key={t}>{t}</option>)}
        </select>
        <select value={demo.date} onChange={e=>setDemo(p=>({...p,date:e.target.value}))} style={{flex:1,background:"#fdf4ff",border:"2px solid #e9d5ff",borderRadius:12,padding:"8px 12px",color:"#2d1a3a",fontSize:13,fontWeight:700,fontFamily:"'Nunito',sans-serif",outline:"none"}}>
          <option value="">Weekday</option>
          <option value="2026-06-07">Weekend (Sat)</option>
          <option value="2026-06-08">Weekend (Sun)</option>
        </select>
      </div>
      <div style={{background:peak?"#fff7ed":"#f0fdf4",border:`1px solid ${peak?"#fed7aa":"#bbf7d0"}`,borderRadius:12,padding:"10px 14px",marginBottom:14,display:"flex",alignItems:"center",gap:8}}>
        <span style={{fontSize:20}}>{peak?"⚡":"🌅"}</span>
        <span style={{color:peak?"#ea580c":"#16a34a",fontWeight:800,fontSize:13}}>{peak?`Peak — +LKR ${PEAK_SURCHARGE} surcharge`:`Off-peak — -LKR ${OFFPEAK_DISCOUNT} discount`}</span>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {SERVICES.map(s=>{
          const final=s.price+(peak?PEAK_SURCHARGE:-OFFPEAK_DISCOUNT);
          return(
            <div key={s.id} style={{background:"#fdf4ff",borderRadius:12,padding:"10px 12px",border:"1px solid #f0e6ff"}}>
              <div style={{fontSize:18,marginBottom:4}}>{s.emoji}</div>
              <div style={{color:"#1a0a2a",fontSize:12,fontWeight:700,lineHeight:1.3}}>{s.name}</div>
              <div style={{display:"flex",alignItems:"center",gap:6,marginTop:4,flexWrap:"wrap"}}>
                <span style={{color:"#c4a0e0",fontSize:11,textDecoration:"line-through"}}>LKR {s.price.toLocaleString()}</span>
                <span style={{color:peak?"#ea580c":"#16a34a",fontSize:13,fontWeight:900}}>LKR {final.toLocaleString()}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function App(){
  const[bookings,setBookings]=useState(DEMO);
  const[reviews,setReviews]=useState([]);
  const[waitlist,setWaitlist]=useState([]);
  const[tab,setTab]=useState("dashboard");
  const isMobile=useIsMobile();

  const addBooking=b=>setBookings(p=>[...p,b]);
  const addWaitlist=b=>setWaitlist(p=>[...p,b]);
  const setStatus=(id,s)=>setBookings(p=>p.map(b=>b.id===id?{...b,status:s,isNew:false}:b));
  const addReview=r=>{
    setReviews(p=>[...p,r]);
    setBookings(p=>{const idx=[...p].reverse().findIndex(b=>b.status==="done");if(idx===-1)return p;const ri=p.length-1-idx;return p.map((b,i)=>i===ri?{...b,status:"reviewed",reviewStars:r.stars,reviewComment:r.comment}:b);});
  };

  const counts={pending:bookings.filter(b=>b.status==="pending").length,confirmed:bookings.filter(b=>b.status==="confirmed").length,seated:bookings.filter(b=>b.status==="seated").length,done:bookings.filter(b=>b.status==="done").length,peak:bookings.filter(b=>b.peak).length,waitlist:waitlist.length};
  const revenue=bookings.filter(b=>["done","reviewed"].includes(b.status)).reduce((s,b)=>s+(b.price||0),0);
  const avg=reviews.length?(reviews.reduce((s,r)=>s+r.stars,0)/reviews.length).toFixed(1):null;

  const TABS=[{id:"dashboard",icon:"📋",label:"Today"},{id:"whatsapp",icon:"💬",label:"WhatsApp"},{id:"pricing",icon:"💰",label:"Pricing"},{id:"reviews",icon:"⭐",label:"Reviews"}];

  return(
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#fdf4ff 0%,#fff0f9 50%,#f0f4ff 100%)",fontFamily:"'Nunito',sans-serif",color:"#1a0a2a",paddingBottom:isMobile?76:0}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Baloo+2:wght@600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-track{background:#fdf4ff;}::-webkit-scrollbar-thumb{background:#e9d5ff;border-radius:4px;}
        @keyframes msgIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes cardIn{from{opacity:0;transform:scale(0.92) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
        button:active{transform:scale(0.97);}
      `}</style>

      {/* Header */}
      <div style={{background:"rgba(255,255,255,0.95)",backdropFilter:"blur(20px)",borderBottom:"2px solid #fce7f3",padding:isMobile?"12px 16px":"14px 32px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100,boxShadow:"0 4px 24px rgba(236,72,153,0.1)"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:isMobile?40:48,height:isMobile?40:48,borderRadius:16,background:"linear-gradient(135deg,#ec4899,#8b5cf6,#06b6d4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:isMobile?20:24,boxShadow:"0 6px 20px rgba(139,92,246,0.4)",animation:"float 3s ease-in-out infinite",flexShrink:0}}>✂️</div>
          <div>
            <div style={{fontFamily:"'Baloo 2',cursive",fontWeight:800,fontSize:isMobile?17:22,background:"linear-gradient(135deg,#ec4899,#8b5cf6)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",lineHeight:1.1}}>{SALON}</div>
            <div style={{color:"#c084fc",fontSize:10,marginTop:1,fontWeight:700}}>{isMobile?"Nawala · Kids Only ✨":"Sri Lanka's First Kids-Only Salon ✨"}</div>
          </div>
        </div>
        {!isMobile&&<div style={{display:"flex",gap:4,background:"#fdf4ff",padding:5,borderRadius:16,border:"1px solid #f0e6ff"}}>
          {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{background:tab===t.id?"linear-gradient(135deg,#ec4899,#8b5cf6)":"transparent",color:tab===t.id?"#fff":"#c084fc",border:"none",borderRadius:12,padding:"8px 18px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Nunito',sans-serif",display:"flex",alignItems:"center",gap:6,boxShadow:tab===t.id?"0 4px 14px rgba(139,92,246,0.35)":"none",transition:"all 0.2s"}}>{t.icon} {t.label}</button>)}
        </div>}
        {!isMobile&&<div style={{background:"linear-gradient(135deg,#ec4899,#8b5cf6)",color:"#fff",fontSize:12,fontWeight:800,padding:"7px 16px",borderRadius:12,boxShadow:"0 4px 14px rgba(139,92,246,0.35)",whiteSpace:"nowrap"}}>💰 LKR {revenue.toLocaleString()} earned</div>}
      </div>

      <div style={{padding:isMobile?"16px":"24px 32px",maxWidth:1160,margin:"0 auto"}}>

        {tab==="dashboard"&&<div style={{animation:"fadeUp 0.4s ease"}}>
          <div style={{display:"grid",gridTemplateColumns:isMobile?"repeat(3,1fr)":"repeat(6,1fr)",gap:isMobile?10:12,marginBottom:24}}>
            {[{label:"Pending",value:counts.pending,grad:"linear-gradient(135deg,#f97316,#f59e0b)",icon:"⏳"},{label:"Confirmed",value:counts.confirmed,grad:"linear-gradient(135deg,#10b981,#06b6d4)",icon:"✅"},{label:"In Chair",value:counts.seated,grad:"linear-gradient(135deg,#3b82f6,#6366f1)",icon:"💺"},{label:"Done",value:counts.done,grad:"linear-gradient(135deg,#8b5cf6,#ec4899)",icon:"🎉"},{label:"⚡ Peak",value:counts.peak,grad:"linear-gradient(135deg,#ea580c,#f97316)",icon:"⚡"},{label:"Waitlist",value:counts.waitlist,grad:"linear-gradient(135deg,#ca8a04,#d97706)",icon:"⏱"}].map((s,i)=>(
              <div key={s.label} style={{background:"#fff",border:"1px solid #fce7f3",borderRadius:18,padding:isMobile?"12px 8px":"14px 12px",display:"flex",flexDirection:"column",alignItems:"center",gap:6,boxShadow:"0 4px 20px rgba(236,72,153,0.07)",animation:`fadeUp 0.4s ease ${i*.06}s both`}}>
                <div style={{width:36,height:36,borderRadius:12,background:s.grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,boxShadow:"0 4px 12px rgba(0,0,0,0.15)"}}>{s.icon}</div>
                <div style={{fontSize:isMobile?22:26,fontWeight:900,background:s.grad,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",fontFamily:"'Baloo 2',cursive",lineHeight:1}}>{s.value}</div>
                <div style={{color:"#c084fc",fontSize:isMobile?9:10,fontWeight:700,textAlign:"center",lineHeight:1.2}}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
            <div style={{width:4,height:22,borderRadius:2,background:"linear-gradient(135deg,#ec4899,#8b5cf6)"}}/>
            <div style={{fontFamily:"'Baloo 2',cursive",fontWeight:800,fontSize:16,color:"#1a0a2a"}}>Today's Appointments</div>
            <div style={{background:"linear-gradient(135deg,#ec4899,#8b5cf6)",color:"#fff",fontSize:11,padding:"2px 10px",borderRadius:20,fontWeight:700}}>{bookings.length}</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {bookings.map((b,i)=><div key={b.id} style={{animation:`fadeUp 0.3s ease ${i*.05}s both`}}><BookingCard b={b} onStatus={setStatus}/></div>)}
          </div>
          {waitlist.length>0&&<>
            <div style={{display:"flex",alignItems:"center",gap:10,margin:"20px 0 12px"}}>
              <div style={{width:4,height:22,borderRadius:2,background:"linear-gradient(135deg,#ca8a04,#f59e0b)"}}/>
              <div style={{fontFamily:"'Baloo 2',cursive",fontWeight:800,fontSize:16,color:"#1a0a2a"}}>Waiting List</div>
              <div style={{background:"linear-gradient(135deg,#ca8a04,#f59e0b)",color:"#fff",fontSize:11,padding:"2px 10px",borderRadius:20,fontWeight:700}}>{waitlist.length}</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>{waitlist.map(b=><BookingCard key={b.id} b={b} onStatus={()=>{}}/>)}</div>
          </>}
        </div>}

        {tab==="whatsapp"&&<div style={{animation:"fadeUp 0.4s ease"}}>
          {isMobile
            ?<div style={{height:"calc(100vh - 158px)"}}>
                <div style={{fontFamily:"'Baloo 2',cursive",fontWeight:800,fontSize:14,color:"#1a0a2a",marginBottom:12}}>💬 Parent WhatsApp View — type 1 to start</div>
                <div style={{height:"calc(100% - 34px)"}}><WABot onBook={addBooking} onReview={addReview} onWaitlist={addWaitlist}/></div>
              </div>
            :<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,height:"76vh"}}>
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  <div style={{fontFamily:"'Baloo 2',cursive",fontWeight:800,fontSize:15,color:"#1a0a2a",display:"flex",alignItems:"center",gap:8}}>💬 Parent WhatsApp <span style={{color:"#c084fc",fontSize:11,fontWeight:600}}>— type 1 to book</span></div>
                  <div style={{flex:1}}><WABot onBook={addBooking} onReview={addReview} onWaitlist={addWaitlist}/></div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  <div style={{fontFamily:"'Baloo 2',cursive",fontWeight:800,fontSize:15,color:"#1a0a2a",display:"flex",alignItems:"center",gap:8}}>📋 Live Dashboard <span style={{background:"linear-gradient(135deg,#ec4899,#8b5cf6)",color:"#fff",fontSize:10,padding:"2px 8px",borderRadius:10,fontWeight:700}}>LIVE</span></div>
                  <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:10,paddingRight:4}}>{bookings.map(b=><BookingCard key={b.id} b={b} onStatus={setStatus}/>)}</div>
                </div>
              </div>
          }
        </div>}

        {tab==="pricing"&&<div style={{animation:"fadeUp 0.4s ease"}}>
          <div style={{fontFamily:"'Baloo 2',cursive",fontWeight:800,fontSize:isMobile?16:20,color:"#1a0a2a",marginBottom:18}}>💰 Peak & Off-Peak Pricing</div>
          <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:20}}>
            <PricingPanel/>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {[{icon:"⚡",title:"Peak Hours",desc:"Weekends (Sat & Sun) + After 4:00 PM weekdays",amount:`+LKR ${PEAK_SURCHARGE}`,color:"#ea580c",bg:"#fff7ed",border:"#fed7aa"},{icon:"🌅",title:"Off-Peak Discount",desc:"Weekday mornings before 4:00 PM",amount:`-LKR ${OFFPEAK_DISCOUNT}`,color:"#16a34a",bg:"#f0fdf4",border:"#bbf7d0"},{icon:"🎂",title:"Birthday Month",desc:"Child's birthday month — auto-applied",amount:"-LKR 300",color:"#be185d",bg:"#fdf2f8",border:"#fbcfe8"},{icon:"🎁",title:"Referral Reward",desc:"Refer a friend → discount on next visit",amount:"-LKR 200",color:"#7c3aed",bg:"#faf5ff",border:"#ddd6fe"},{icon:"⚠️",title:"No-Show Protection",desc:"2+ no-shows → 24hr confirmation required",amount:"Policy",color:"#d97706",bg:"#fefce8",border:"#fde68a"}].map(r=>(
                <div key={r.title} style={{background:r.bg,border:`1px solid ${r.border}`,borderRadius:16,padding:"14px 18px",display:"flex",alignItems:"center",gap:14}}>
                  <div style={{fontSize:24,flexShrink:0}}>{r.icon}</div>
                  <div style={{flex:1}}>
                    <div style={{color:r.color,fontWeight:800,fontSize:14,fontFamily:"'Baloo 2',cursive"}}>{r.title}</div>
                    <div style={{color:"#7a5a9a",fontSize:12,marginTop:2}}>{r.desc}</div>
                  </div>
                  <div style={{color:r.color,fontWeight:900,fontSize:14,fontFamily:"'Baloo 2',cursive",flexShrink:0}}>{r.amount}</div>
                </div>
              ))}
            </div>
          </div>
        </div>}

        {tab==="reviews"&&<div style={{animation:"fadeUp 0.4s ease"}}>
          <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"repeat(3,1fr)",gap:16,marginBottom:20}}>
            {[{title:"Avg Rating",value:avg?`${avg} ⭐`:"—",sub:`${reviews.length} reviews via WhatsApp`,grad:"linear-gradient(135deg,#f59e0b,#ef4444)",bg:"#fff7ed",border:"#fed7aa"},{title:"Google Reviews",value:"Auto-sent",sub:"For 4⭐+ ratings automatically",grad:"linear-gradient(135deg,#10b981,#06b6d4)",bg:"#f0fdf4",border:"#bbf7d0"},{title:"Social Follows",value:"📸 👍 🎵",sub:"Instagram · Facebook · TikTok",grad:"linear-gradient(135deg,#8b5cf6,#ec4899)",bg:"#faf5ff",border:"#ddd6fe"}].map(c=>(
              <div key={c.title} style={{background:c.bg,border:`1px solid ${c.border}`,borderRadius:20,padding:"20px 22px",boxShadow:"0 4px 20px rgba(236,72,153,0.07)"}}>
                <div style={{color:"#c084fc",fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:8}}>{c.title}</div>
                <div style={{fontSize:30,fontWeight:900,background:c.grad,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",fontFamily:"'Baloo 2',cursive",lineHeight:1.1,marginBottom:6}}>{c.value}</div>
                <div style={{color:"#a78bfa",fontSize:12,fontWeight:600}}>{c.sub}</div>
              </div>
            ))}
          </div>
          <div style={{background:"#fff",border:"1px solid #fce7f3",borderRadius:20,padding:"18px 22px",marginBottom:20,boxShadow:"0 4px 20px rgba(236,72,153,0.07)"}}>
            <div style={{fontFamily:"'Baloo 2',cursive",fontWeight:800,fontSize:14,color:"#1a0a2a",marginBottom:14}}>📣 Sent automatically after 4⭐+ review</div>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              {[[INSTAGRAM,"📸","Instagram","#e1306c","#fdf2f8"],[FACEBOOK,"👍","Facebook","#1877f2","#eff6ff"],[TIKTOK,"🎵","TikTok","#000","#f9fafb"],[GOOGLE_URL,"⭐","Google","#ea4335","#fff7ed"]].map(([url,icon,label,color,bg])=>(
                <a key={label} href={url} target="_blank" style={{background:bg,border:`1px solid ${color}33`,borderRadius:14,padding:"10px 16px",display:"flex",alignItems:"center",gap:8,textDecoration:"none",flex:"1 1 110px"}}>
                  <span style={{fontSize:20}}>{icon}</span>
                  <span style={{color,fontWeight:800,fontSize:13,fontFamily:"'Baloo 2',cursive"}}>{label}</span>
                </a>
              ))}
            </div>
          </div>
          {reviews.length===0
            ?<div style={{textAlign:"center",padding:"50px 0"}}><div style={{fontSize:52,animation:"float 3s ease-in-out infinite",marginBottom:14}}>⭐</div><div style={{color:"#c4a0e0",fontSize:14,fontWeight:600}}>No reviews yet!<br/>Go to WhatsApp → complete a booking → reply <strong>3</strong> to simulate.</div></div>
            :<div style={{display:"flex",flexDirection:"column",gap:10}}>{reviews.map((r,i)=>(
                <div key={i} style={{background:"#fff",border:"1px solid #fce7f3",borderRadius:16,padding:"16px 20px",boxShadow:"0 2px 12px rgba(236,72,153,0.06)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
                    <span style={{fontSize:20}}>{"⭐".repeat(r.stars)}</span>
                    <span style={{color:r.stars>=4?"#10b981":"#ef4444",fontSize:11,fontWeight:700,background:r.stars>=4?"#f0fdf4":"#fef2f2",padding:"3px 10px",borderRadius:20}}>{r.stars>=4?"✓ Google + Social sent 🎉":"→ Private follow-up"}</span>
                  </div>
                  {r.comment&&<div style={{color:"#7a5a9a",fontSize:13,marginTop:10,fontStyle:"italic"}}>"{r.comment}"</div>}
                </div>
              ))}</div>
          }
        </div>}
      </div>

      {isMobile&&<div style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(255,255,255,0.97)",backdropFilter:"blur(20px)",borderTop:"2px solid #fce7f3",display:"flex",padding:"8px 0 14px",zIndex:100,boxShadow:"0 -4px 20px rgba(236,72,153,0.12)"}}>
        {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:"transparent",border:"none",cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>
          <div style={{fontSize:20,width:42,height:42,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",background:tab===t.id?"linear-gradient(135deg,#ec4899,#8b5cf6)":"transparent",boxShadow:tab===t.id?"0 4px 14px rgba(139,92,246,0.4)":"none",transition:"all 0.25s"}}>{t.icon}</div>
          <div style={{fontSize:10,fontWeight:700,color:tab===t.id?"#8b5cf6":"#d8b4fe"}}>{t.label}</div>
        </button>)}
      </div>}
    </div>
  );
}
