// Lịch giải dùng chung cho trang (index.html) và script đồng bộ (sync/sync.mjs).
// Sửa lịch tuần mới ở đây: mỗi dòng RAW là một giải.
(function (g) {
const CLUBS = {
  vpl:   {name:"VPL · HSOP", full:"Vietnam Poker League — HSOP Grinder Series III", addr:"Grand Plaza Hotel, Hà Nội", url:"https://vietnampokerleague.com/", color:"#b8892e"},
  center:{name:"Center Poker", full:"Center Poker Club", addr:"Hà Nội", url:"https://centerpoker.vn/", color:"#7b4fd6"},
  royal: {name:"Royal Poker", full:"Royal Poker Tour", addr:"Hà Nội", url:"https://royal-poker.com/en", color:"#c2386a"},
  quads: {name:"Quads", full:"Quads Poker Club", addr:"Hà Nội", url:"https://quadspoker.vn/", color:"#0e8f84"},
  gl:    {name:"Grand Loyal", full:"Grand Loyal Poker", addr:"Tầng 2, 146 Giảng Võ, Ba Đình · 0869 583 586", url:"https://grandloyal.vn/", color:"#2f6fd0"},
  arena: {name:"Arena", full:"Arena Poker Club", addr:"Tầng 3 CTM Complex, 139 Cầu Giấy · 079 768 6626", url:"https://arenapoker.vn/", color:"#4e8a1c"},
};

// [ngày MM-DD, giờ bắt đầu, tên, buy-in (nghìn đ), GTD (nghìn đ | "N vé" | null), giờ đóng reg | null, số entry GTD CLB công bố]
const RAW = {
  vpl:[
    ["10-29","10:00","S5 Mega Satellite: Hanoi Open",680,"20 vé","11:55"],
    ["10-29","10:30","#1 Hanoi Open Special Boosted Day 1C",4500,8000000,"16:35"],
    ["10-29","10:30","S6 Satellite: High Roller Opener",2000,null,"12:04"],
    ["10-29","11:30","#6 Thursday Special",5500,500000,"18:05"],
    ["10-29","11:30","#7 High Roller Warm Up Day 1",22000,2000000,"18:30"],
    ["10-29","15:00","S7 Mega Satellite: Hanoi Open",680,"10 vé","16:55"],
    ["10-29","16:30","#1 Hanoi Open Special Boosted Day 1D",4500,8000000,"22:35"],
    ["10-29","17:30","#8 Deepstack NLH (20% ITM)",4500,120000,"21:35"],
    ["10-29","19:00","#9 Mini High Roller",11000,200000,"23:15"],
    ["10-29","20:30","S8 Satellite: Main Event",2000,"1 vé","22:04"],
    ["10-29","21:30","#10 Turbo NLH (20% ITM)",2300,20000,"23:40"],
    ["10-30","10:00","S9 Mega Satellite: Hanoi Open",680,"20 vé","11:55"],
    ["10-30","10:30","#1 Hanoi Open Special Boosted Day 1E",4500,8000000,"16:35"],
    ["10-30","10:30","S10 Satellite: High Roller Single Day",3700,null,"12:04"],
    ["10-30","11:30","#11 Super Deepstack",6600,600000,"18:05"],
    ["10-30","11:30","#12 High Roller Single Day",33000,1500000,"18:30"],
    ["10-30","16:30","#1 Hanoi Open Special Boosted Day 1F",4500,8000000,"21:40"],
    ["10-30","17:30","#13 Deepstack NLH (20% ITM)",4500,120000,"21:35"],
    ["10-30","19:00","#14 Mini High Roller",11000,200000,"23:15"],
    ["10-30","20:30","S11 Satellite: Main Event",2000,"1 vé","22:04"],
    ["10-30","21:30","#15 Turbo NLH (20% ITM)",2300,20000,"23:40"],
    ["10-31","10:00","S12 Mega Satellite: Mini Main Event",1050,"15 vé","11:55"],
    ["10-31","10:30","#16 Mini Main Event Day 1A",8800,10000000,"16:35"],
    ["10-31","10:30","S13 Satellite: Super High Roller",6100,null,"12:04"],
    ["10-31","11:30","#17 Super High Roller Day 1",55000,2000000,"20:05"],
    ["10-31","15:00","S14 Mega Satellite: Mini Main Event",1050,"10 vé","16:55"],
    ["10-31","16:30","#16 Mini Main Event Day 1B",8800,10000000,"22:35"],
    ["10-31","17:30","#18 Deepstack NLH (20% ITM)",4500,120000,"21:35"],
    ["10-31","19:00","#19 Mini High Roller",11000,200000,"23:15"],
    ["10-31","20:30","S15 Satellite: Main Event",2000,"1 vé","22:04"],
    ["10-31","21:30","#20 Turbo NLH (20% ITM)",2300,20000,"23:40"],
    ["11-01","10:00","S16 Mega Satellite: Mini Main Event",1050,"15 vé","11:55"],
    ["11-01","10:30","#16 Mini Main Event Day 1C",8800,10000000,"16:35"],
    ["11-01","10:30","S17 Satellite: Sunday Leopard High Roller",3700,null,"12:04"],
    ["11-01","11:30","#21 Super Sunday",6600,600000,"18:05"],
    ["11-01","11:30","#22 Sunday Leopard High Roller Single Day",33000,1500000,"18:30"],
    ["11-01","15:00","S18 Mega Satellite: Mini Main Event",1050,"10 vé","16:55"],
    ["11-01","16:30","#16 Mini Main Event Day 1D",8800,10000000,"22:35"],
    ["11-01","17:30","#23 Deepstack NLH (20% ITM)",4500,120000,"21:35"],
    ["11-01","19:00","#24 Mini High Roller",11000,200000,"23:15"],
    ["11-01","20:30","S19 Satellite: Main Event",2000,"1 vé","22:04"],
    ["11-01","21:30","#25 Turbo NLH (20% ITM)",2300,20000,"23:40"],
  ],
  center:[
    ["10-29","10:30","Satellite for Green Gecko",360,"4 vé",null],
    ["10-29","10:30","CenterP Morning Deepstack",854,70000,null,100],
    ["10-29","11:00","Center-P Green Gecko",2330,200000,"17:33",100],
    ["10-29","14:00","CenterP Satellite for Mini Highroller",650,"4 vé",null],
    ["10-29","15:00","CenterP Daily",854,70000,"19:30",100],
    ["10-29","17:00","Mini Highroller",3330,81900,"21:15",30],
    ["10-29","19:00","CenterP Fast & Furious",732,60000,"22:20",100],
  ],
  royal:[
    ["10-29","10:30","R - Speed I (25% ITM)",1220,10000,"12:00"],
    ["10-29","11:00","R - Thursday Duke",976,80000,"17:38"],
    ["10-29","12:00","R - Speed II (25% ITM)",1830,15000,"13:30"],
    ["10-29","13:30","R - Speed III (25% ITM)",2330,20000,"15:00"],
    ["10-29","14:00","Satellite Credit 2M5",508,"2 vé","15:34"],
    ["10-29","17:30","R - Mini Deepstack (25% ITM)",2330,60000,"21:35"],
    ["10-29","21:30","R - Relax (25% ITM)",1830,15000,"23:38"],
    ["10-29","23:30","R - Happy Night (25% ITM)",2330,12000,"00:40"],
  ],
  quads:[
    ["10-29","11:00","#26 Quads Horizon",1830,150000,"17:38"],
    ["10-29","11:30","#27 Daily Express I",1525,12500,"13:15"],
    ["10-29","13:15","#28 Daily Express II",1830,15000,"15:00"],
    ["10-29","15:00","#29 Daily Express III",2330,20000,"16:45"],
    ["10-29","15:00","#30 Deepstack Turbo",732,60000,"19:45"],
    ["10-29","17:30","#31 Cronus Superstack 8-Max",2330,60000,"21:25"],
    ["10-29","21:30","#32 Evening Storm 8-max",1525,12500,"23:40"],
    ["10-30","10:00","#33 Daily Megastack",1220,100000,"15:05"],
    ["10-30","11:00","#34 Quads Kickstarter",2530,220000,"17:38"],
    ["10-30","11:30","#35 Daily Express I",1525,12500,"13:15"],
    ["10-30","13:15","#36 Daily Express II",1830,15000,"15:00"],
    ["10-30","15:00","#37 Daily Express III",2330,20000,"16:45"],
    ["10-30","15:00","#38 Deepstack Turbo",732,60000,"19:45"],
    ["10-30","17:30","#39 Cronus Superstack 8-Max",2330,60000,"21:25"],
    ["10-30","21:30","#40 Evening Storm 8-max",1525,12500,"23:40"],
    ["10-31","10:00","#41 Daily Megastack",1220,100000,"15:05"],
    ["10-31","11:00","#42 Quads Genesis Live",2885,250000,"17:38"],
    ["10-31","11:30","#43 Daily Express I",1525,12500,"13:15"],
    ["10-31","13:15","#44 Daily Express II",1830,15000,"15:00"],
    ["10-31","15:00","#45 Daily Express III",2330,20000,"16:45"],
    ["10-31","15:00","#46 Deepstack Turbo",854,70000,"19:45"],
    ["10-31","17:30","#47 Cronus Superstack 8-Max",2330,60000,"21:25"],
    ["10-31","21:30","#48 Evening Storm 8-max",1525,12500,"23:40"],
    ["11-01","10:00","#49 Daily Megastack",1220,100000,"15:05"],
    ["11-01","11:00","#50 Quads Kickstarter Live",2530,220000,"17:38"],
    ["11-01","11:30","#51 Daily Express I",1525,12500,"13:15"],
    ["11-01","13:15","#52 Daily Express II",1830,15000,"15:00"],
    ["11-01","15:00","#53 Daily Express III",2330,20000,"16:45"],
    ["11-01","15:00","#54 Deepstack Turbo",854,70000,"19:45"],
    ["11-01","17:30","#55 Cronus Superstack 8-Max",2330,60000,"21:25"],
    ["11-01","21:30","#56 Evening Storm 8-max",1525,12500,"23:40"],
  ],
  gl:[
    ["10-29","09:30","Morning Relax",548,60000,"14:06"],
    ["10-29","10:00","Thursday Typhoon",1320,150000,"16:29"],
    ["10-29","11:30","The Flash 1",1120,12500,"13:00"],
    ["10-29","13:00","The Flash 2",1320,15000,"14:30"],
    ["10-29","15:00","The Flash 3",1820,20000,"16:30"],
    ["10-29","15:00","Deepstack Turbo",640,70000,"18:44"],
    ["10-29","17:30","New Superstack (25% ITM)",1320,45000,"21:06"],
    ["10-29","20:30","Mini Deepstack (25% ITM)",1180,12500,"22:20"],
    ["10-30","09:30","Morning Relax",548,60000,"14:06"],
    ["10-30","10:00","Friday Fire",1120,125000,"16:29"],
    ["10-30","11:30","The Flash 1",1120,12500,"13:00"],
    ["10-30","13:00","The Flash 2",1320,15000,"14:30"],
    ["10-30","15:00","The Flash 3",1820,20000,"16:30"],
    ["10-30","15:00","Deepstack Turbo",640,70000,"18:44"],
    ["10-30","17:30","New Superstack (25% ITM)",1320,45000,"21:06"],
    ["10-30","20:30","Mini Deepstack (25% ITM)",1180,12500,"22:20"],
    ["10-31","09:30","Morning Relax",731,80000,"14:06"],
    ["10-31","10:00","Saturday Star (Livestream FN)",3540,320000,"16:29"],
    ["10-31","11:30","The Flash 1",1120,12500,"13:00"],
    ["10-31","13:00","The Flash 2",1320,15000,"14:30"],
    ["10-31","15:00","The Flash 3",1820,20000,"16:30"],
    ["10-31","15:00","Deepstack Turbo",548,60000,"18:44"],
    ["10-31","17:30","New Superstack (25% ITM)",1320,45000,"21:06"],
    ["10-31","20:30","Mini Deepstack (25% ITM)",1180,12500,"22:20"],
  ],
  arena:[
    ["10-29","10:00","Jupiter Thunder",732,60000,"16:00",100],
    ["10-29","14:00","Colosseum Arena Express",610,50000,"18:10",100],
    ["10-29","15:30","Satellite for The Gladiator Dash",244,"5 vé","17:04"],
    ["10-29","17:00","The Gladiator Dash (25% ITM)",1220,30000,"20:48",30],
    ["10-29","18:00","Hyper Clash",488,40000,"21:30",100],
    ["10-29","20:00","Arena Night (25% ITM)",976,8000,"21:50",10],
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
