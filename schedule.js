// Lịch giải dùng chung cho trang (index.html) và script đồng bộ (sync/sync.mjs).
// Sửa lịch tuần mới ở đây: mỗi dòng RAW là một giải.
(function (g) {
const CLUBS = {
  vpl:   {short:"VPL", name:"VPL · HSOP", full:"Vietnam Poker League", addr:"Grand Plaza Hotel, Hà Nội", url:"https://vietnampokerleague.com/", color:"#b8892e"},
  center:{short:"CP", name:"Center Poker", full:"Center Poker Club", addr:"Hà Nội", url:"https://centerpoker.vn/", color:"#7b4fd6"},
  royal: {short:"RP", name:"Royal Poker", full:"Royal Poker Tour", addr:"Hà Nội", url:"https://royal-poker.com/en", color:"#c2386a"},
  quads: {short:"QD", name:"Quads", full:"Quads Poker Club", addr:"Hà Nội", url:"https://quadspoker.vn/", color:"#0e8f84"},
  gl:    {short:"GL", name:"Grand Loyal", full:"Grand Loyal Poker", addr:"Tầng 2, 146 Giảng Võ, Ba Đình · 0869 583 586", url:"https://grandloyal.vn/", color:"#2f6fd0"},
  arena: {short:"AR", name:"Arena", full:"Arena Poker Club", addr:"Tầng 3 CTM Complex, 139 Cầu Giấy · 079 768 6626", url:"https://arenapoker.vn/", color:"#4e8a1c"},
  gp:    {short:"GP", name:"Grand Poker", full:"Grand Poker Hà Nội", addr:"Tầng 1 Grand Plaza, 117 Trần Duy Hưng, Cầu Giấy", url:"https://grandpokerhanoi.com/", color:"#b5531b"},
};

// [ngày MM-DD, giờ bắt đầu, tên, buy-in (nghìn đ), GTD (nghìn đ | "N vé" | null), giờ đóng reg | null, số entry GTD CLB công bố]
const RAW = {
  vpl:[],
  center:[
    ["11-13","10:30","Satellite for Blue Badger",360,"4 vé",null],
    ["11-13","10:30","CenterP Morning Deepstack",854,70000,null,100],
    ["11-13","11:00","Center-P Blue Badger",2330,191000,null,100],
  ],
  royal:[],
  quads:[
    ["11-13","11:00","#32 Quads Megastack",1200,100000,"17:38"],
    ["11-13","12:00","#33 Daily Express I",1525,12500,"13:45"],
    ["11-13","13:45","#34 Daily Express II",1830,15000,"15:30"],
    ["11-13","15:00","#36 Deepstack Turbo",732,60000,"19:45"],
    ["11-13","15:30","#35 Daily Express III",2330,20000,"17:15"],
    ["11-13","17:30","#37 Cronus Superstack 8-Max",2330,60000,"21:25"],
    ["11-13","21:30","#38 Evening Storm 8-max",1525,12500,"23:40"],
    ["11-14","10:00","#39 Daily Megastack",1220,100000,"15:05"],
    ["11-14","11:00","#40 Quads Genesis",2885,250000,"17:38"],
    ["11-14","12:00","#41 Daily Express I",1525,12500,"13:45"],
    ["11-14","13:45","#42 Daily Express II",1830,15000,"15:30"],
    ["11-14","15:00","#44 Deepstack Turbo",732,60000,"19:45"],
    ["11-14","15:30","#43 Daily Express III",2330,20000,"17:15"],
    ["11-14","17:30","#45 Cronus Superstack 8-Max",2330,60000,"21:25"],
    ["11-14","21:30","#46 Evening Storm 8-max",1525,12500,"23:40"],
    ["11-15","10:00","#47 Daily Megastack",1220,100000,"15:05"],
    ["11-15","11:00","#48 Quads Signature",9990,720000,"18:00"],
    ["11-15","12:00","#49 Daily Express I",1525,12500,"13:45"],
    ["11-15","13:45","#50 Daily Express II",1830,15000,"15:30"],
    ["11-15","15:00","#52 Deepstack Turbo",854,70000,"19:45"],
    ["11-15","15:30","#51 Daily Express III",2330,20000,"17:15"],
    ["11-15","17:30","#53 Cronus Superstack 8-Max",2330,60000,"21:25"],
    ["11-15","21:30","#54 Evening Storm 8-max",1525,12500,"23:40"],
  ],
  gl:[
    ["11-13","10:00","Friday Fire",1530,125000,"16:29"],
    ["11-13","11:30","The Flash 1",1120,12500,"13:00"],
    ["11-13","13:00","The Flash 2",1320,15000,"14:30"],
    ["11-13","15:00","Deepstack Turbo",548,60000,"18:44"],
    ["11-13","15:00","The Flash 3",1820,20000,"16:30"],
    ["11-13","16:30","The Flash 4",1820,20000,"18:00"],
    ["11-13","17:30","New Superstack (25% ITM)",1320,45000,"21:06"],
    ["11-13","20:30","Mini Deepstack (25% ITM)",1180,12500,"22:20"],
    ["11-14","09:30","Morning Relax",640,70000,"14:06"],
    ["11-14","10:00","Saturday Star (Livestream)",2330,200000,"16:29"],
    ["11-14","11:30","The Flash 1",1120,12500,"13:00"],
    ["11-14","13:00","The Flash 2",1320,15000,"14:30"],
    ["11-14","15:00","Deepstack Turbo",548,60000,"18:44"],
    ["11-14","15:00","The Flash 3",1820,20000,"16:30"],
    ["11-14","16:30","The Flash 4",1820,20000,"18:00"],
    ["11-14","17:30","New Superstack (25% ITM)",1320,45000,"21:06"],
    ["11-14","20:30","Mini Deepstack (25% ITM)",1180,12500,"22:20"],
    ["11-15","09:30","Morning Relax",731,80000,"14:06"],
    ["11-15","10:30","Sunday Storm (Livestream)",3540,320000,"16:59"],
    ["11-15","11:30","The Flash 1",1120,12500,"13:00"],
    ["11-15","13:00","The Flash 2",1320,15000,"14:30"],
    ["11-15","15:00","Deepstack Turbo",548,60000,"18:44"],
    ["11-15","15:00","The Flash 3",1820,20000,"16:30"],
    ["11-15","16:30","The Flash 4",1820,20000,"18:00"],
    ["11-15","17:30","New Superstack (25% ITM)",1320,45000,"21:06"],
    ["11-15","20:30","Mini Deepstack (25% ITM)",1180,12500,"22:20"],
  ],
  gp:[
    ["11-13","10:00","Mega Satellite: Grand Opening Event",500,"15 vé","11:55"],
    ["11-13","10:30","#1 Grand Opening Event Day 1C",3400,3000000,"16:35"],
    ["11-13","10:30","Satellite: High Roller Special",2000,null,"12:04"],
    ["11-13","11:30","#6 Friday Challenge",5500,500000,"18:05"],
    ["11-13","11:30","#7 High Roller Special",16500,1000000,"18:30"],
    ["11-13","16:30","#1 Grand Opening Event Day 1D",3400,3000000,"22:35"],
    ["11-13","17:30","#8 Deepstack NLH (20% ITM)",3400,100000,"21:35"],
    ["11-13","19:00","#9 Mini High Roller",8800,160000,"23:15"],
    ["11-13","21:30","#10 Turbo - NLH (20% ITM)",2300,20000,"23:40"],
    ["11-14","10:00","Satellite: Saturday Deepstack",800,"3 vé","11:55"],
    ["11-14","10:30","Satellite: High Roller Finale",2500,null,"12:04"],
    ["11-14","10:30","#11 Saturday Deepstack",6600,600000,"17:05"],
    ["11-14","11:30","#12 High Roller Finale",22000,1200000,"18:30"],
    ["11-14","15:00","#13 Super Deepstack (20% ITM)",2300,100000,"18:50"],
    ["11-14","19:00","#14 Mini High Roller",8800,160000,"23:15"],
    ["11-14","21:30","#15 Turbo - NLH (20% ITM)",2300,20000,"23:40"],
  ],
  arena:[
    ["11-13","10:00","[MAIN] Venus Showdown",854,70000,null,100],
    ["11-13","14:00","Colosseum Arena Express",488,50000,"18:10",125],
    ["11-13","15:30","Satellite for The Gladiator Dash 1in6",244,"5 vé","17:04"],
    ["11-13","17:00","The Gladiator Dash (15% ITM)",1220,30000,"20:48",30],
    ["11-13","18:00","Hyper Clash",488,40000,"21:30",100],
    ["11-13","20:00","Arena Night (15% ITM)",976,12000,"21:50",15],
    ["11-14","15:30","Satellite for The Gladiator Dash 1in6",244,"5 vé","17:04"],
    ["11-15","15:30","Satellite for The Gladiator Dash 1in6",244,"5 vé","17:04"],
  ],
};


const YEAR = 2026, FEE = 1.22, HOUR = 3600e3, VN = 7*HOUR;

// Giờ Hà Nội -> mốc thời gian tuyệt đối
const vnTs = (md, hm) => { const [M,D]=md.split("-").map(Number), [h,m]=hm.split(":").map(Number); return Date.UTC(YEAR,M-1,D,h,m) - VN; };
const vnParts = ts => { const d=new Date(ts+VN); return {md:String(d.getUTCMonth()+1).padStart(2,"0")+"-"+String(d.getUTCDate()).padStart(2,"0"), h:d.getUTCHours(), m:d.getUTCMinutes(), s:d.getUTCSeconds(), wd:d.getUTCDay()}; };
// NFKD: đổi cả chữ in đậm kiểu Unicode (𝐆𝐑𝐄𝐄𝐍 của Center) về chữ thường
const fold = s => String(s).normalize("NFKD").toLowerCase().normalize("NFD").replace(/\p{M}/gu,"").replace(new RegExp(String.fromCharCode(273),"g"),"d");
const slug = s => fold(s).replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,48);
// Tên dùng để ghép với dữ liệu CLB: bỏ dấu, bỏ tiền tố "R - ", bỏ đuôi " - GTD 100 Entries", chỉ giữ chữ và số
const normName = s => fold(s).trim().replace(/^r\s*-\s*/,"").replace(/\s+\W*\s*gtd\b.*$/,"").replace(/[^a-z0-9]/g,"");

function buildTours(){
  const tours = [];
  for (const [club, rows] of Object.entries(RAW)) for (const r of rows) {
    const [md,start,name,buyin,gtd,close,gtdEntries] = r;
    const startTs = vnTs(md,start);
    let closeTs = close ? vnTs(md,close) : null;
    if (closeTs !== null && closeTs < startTs) closeTs += 24*HOUR;
    const flight = /day\s*1[a-f]\b/i.test(name);
    const isSat = typeof gtd === "string" || /satellite/i.test(name);
    const gtdNum = typeof gtd === "number" ? gtd : null;
    const needed = gtdNum ? (gtdEntries || Math.ceil(gtdNum*FEE/buyin - 1e-9)) : null;
    tours.push({id:`${club}-${md}-${start.replace(":","")}-${slug(name)}`, club, md, start, name, buyin, gtd, gtdNum, close, startTs, closeTs, flight, isSat, needed});
  }
  return tours;
}

g.HNP = {CLUBS, RAW, YEAR, FEE, HOUR, VN, vnTs, vnParts, slug, normName, buildTours};
})(typeof window !== "undefined" ? window : globalThis);
