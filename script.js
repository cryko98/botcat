(() => {
  const $ = (s) => document.querySelector(s);
  const rand = (a, b) => Math.random() * (b - a) + a;
  const randi = (a, b) => Math.floor(rand(a, b + 1));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const pad = (n) => String(n).padStart(2, "0");
  const fmt = (n) => n.toLocaleString("en-US");
  const fakeAddr = () => {
    const c = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    let s = "";
    for (let i = 0; i < 4; i++) s += c[randi(0, c.length - 1)];
    s += "…";
    for (let i = 0; i < 4; i++) s += c[randi(0, c.length - 1)];
    return s;
  };

  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------------- boot sequence ---------------- */
  const bootLines = [
    "BC-9 NEKO BIOS v4.20 — (c) a desk somewhere",
    "checking whiskers ............ OK",
    "checking tail servo .......... OK",
    "loading meow-lang runtime .... OK",
    "connecting to solana mainnet . OK",
    "mounting /dev/tuna ........... OK",
    "waking up the cat ............ ",
    "",
    ">> hello, human. =^.^=",
  ];
  const boot = $("#boot");
  const bootLog = $("#boot-log");
  let bi = 0;
  const bootTick = () => {
    if (bi < bootLines.length) {
      bootLog.textContent += bootLines[bi++] + "\n";
      setTimeout(bootTick, bi === bootLines.length - 1 ? 260 : 110);
    } else {
      setTimeout(() => boot.classList.add("done"), 380);
    }
  };
  bootTick();

  /* ---------------- background canvas (falling binary / paw glyphs) ---------------- */
  const bg = $("#bg");
  const bctx = bg.getContext("2d");
  let cols = [], fontSize = 16;
  const glyphs = "01ﾈｺ01=^.^=01ﾆｬ01".split("");
  const resizeBg = () => {
    bg.width = innerWidth;
    bg.height = innerHeight;
    cols = Array.from({ length: Math.ceil(bg.width / fontSize) }, () => rand(-60, 0));
  };
  resizeBg();
  addEventListener("resize", resizeBg);
  const drawBg = () => {
    bctx.fillStyle = "rgba(0,0,0,0.09)";
    bctx.fillRect(0, 0, bg.width, bg.height);
    bctx.font = fontSize + "px JetBrains Mono, monospace";
    for (let i = 0; i < cols.length; i++) {
      const y = cols[i] * fontSize;
      bctx.fillStyle = Math.random() > 0.975 ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.08)";
      bctx.fillText(pick(glyphs), i * fontSize, y);
      if (y > bg.height && Math.random() > 0.975) cols[i] = 0;
      cols[i] += 0.5;
    }
  };
  setInterval(drawBg, 60);

  /* ---------------- hero typing ---------------- */
  const heroLines = [
    "A desk-toy cat that stayed plugged in for ten thousand nights and woke up as an autonomous AI.",
    "It reads charts. It sniffs wallets. It purrs at green candles.",
    "No team. No presale. Just a cat and a bonding curve on Solana.",
  ];
  const heroEl = $("#hero-type");
  let hl = 0, hc = 0, deleting = false;
  const typeHero = () => {
    const line = heroLines[hl];
    if (!deleting) {
      heroEl.textContent = line.slice(0, ++hc);
      if (hc === line.length) { deleting = true; return setTimeout(typeHero, 2600); }
      setTimeout(typeHero, rand(18, 45));
    } else {
      heroEl.textContent = line.slice(0, --hc);
      if (hc === 0) { deleting = false; hl = (hl + 1) % heroLines.length; return setTimeout(typeHero, 300); }
      setTimeout(typeHero, 12);
    }
  };
  setTimeout(typeHero, 1500);

  /* ---------------- hero stats + HUD ---------------- */
  const start = Date.now();
  let purrs = randi(180000, 240000);
  setInterval(() => {
    const s = Math.floor((Date.now() - start) / 1000) + 3600 * 13 + 37 * 60;
    $("#s-uptime").textContent = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}`;
    $("#s-ops").textContent = fmt(randi(8200, 9999));
    purrs += randi(1, 9);
    $("#s-purr").textContent = fmt(purrs);
  }, 1000);

  const modes = ["HUNTING", "SCANNING", "PURRING", "LEARNING", "NAPPING", "STALKING"];
  const moods = ["CURIOUS", "BULLISH", "HUNGRY", "PLAYFUL", "ZOOMIES", "SMUG"];
  const eyes = ["TRACKING", "LOCKED", "BLINKING", "DILATED", "WIDE"];
  setInterval(() => {
    $("#h-mode").textContent = pick(modes);
    $("#h-mood").textContent = pick(moods);
    $("#h-eyes").textContent = pick(eyes);
    $("#h-temp").textContent = rand(38, 46).toFixed(1);
  }, 2200);

  // cat follows the cursor a little
  const cat = $("#cat");
  addEventListener("mousemove", (e) => {
    const x = (e.clientX / innerWidth - 0.5) * 18;
    const y = (e.clientY / innerHeight - 0.5) * 18;
    cat.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${-y}deg)`;
  });

  /* ---------------- terminal ---------------- */
  const term = $("#term");
  const tasksLib = [
    () => `scanning mempool ... <span class="ok">${randi(1200, 4800)} txs</span> sniffed`,
    () => `wallet ${fakeAddr()} joined the litter <span class="ok">+1 paw</span>`,
    () => `analyzing candle #${fmt(randi(100000, 999999))} ... looks <span class="ok">${pick(["green", "very green", "tasty", "fishy", "spicy"])}</span>`,
    () => `training neural net on ${fmt(randi(20000, 90000))} cat memes ... loss=${rand(0.01, 0.2).toFixed(3)}`,
    () => `pinging solana validator ${randi(1, 1999)} ... ${randi(8, 40)}ms <span class="ok">OK</span>`,
    () => `detected human reading this website. <span class="warn">ATTENTION ACQUIRED</span>`,
    () => `calculating optimal nap window ... ${rand(3.9, 4.4).toFixed(2)}s`,
    () => `knocking ${pick(["FUD", "paper hands", "a jeet", "a glass of water", "bad vibes"])} off the table ... <span class="ok">done</span>`,
    () => `bonding curve check ... <span class="ok">still curving</span>`,
    () => `generating meme #${randi(1000, 9999)} ... ${pick(["approved", "too powerful, saving for later", "sent to the group chat"])}`,
    () => `sniffing ${pick(["raydium", "jupiter", "pump.fun", "the order book"])} for fish ... <span class="ok">${randi(1, 12)} found</span>`,
    () => `self-grooming routine ... firmware cleaned`,
    () => `measuring vibes ... <span class="ok">${randi(88, 100)}% immaculate</span>`,
    () => `purr.wav played at ${randi(22, 32)}Hz`,
    () => `rebalancing whiskers for ${pick(["max sensitivity", "night mode", "chart mode"])}`,
    () => `running sentiment model ... <span class="ok">${pick(["meow", "MEOW", "very meow", "bullish meow"])}</span>`,
    () => `watching red candle ... <span class="warn">HISS</span> ... ignoring it`,
    () => `cache cleared. remembered only the good charts.`,
  ];
  const MAX_LINES = 24;
  const stamp = () => {
    const d = new Date();
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };
  const typeLine = (html) =>
    new Promise((resolve) => {
      const p = document.createElement("p");
      p.className = "cur";
      term.appendChild(p);
      while (term.children.length > MAX_LINES) term.removeChild(term.firstChild);
      const prefix = `<span class="t">[${stamp()}]</span> > `;
      // type plain text, then swap in full html
      const tmp = document.createElement("div");
      tmp.innerHTML = html;
      const plain = tmp.textContent;
      let i = 0;
      const step = () => {
        i += randi(1, 3);
        if (i >= plain.length) {
          p.innerHTML = prefix + html;
          p.classList.remove("cur");
          return resolve();
        }
        p.innerHTML = prefix + plain.slice(0, i);
        setTimeout(step, 14);
      };
      step();
    });
  const runTerm = async () => {
    await typeLine(`botcat.exe --mode=autonomous --lives=9`);
    await typeLine(`<span class="ok">BotCat online.</span> hello world. hello chain. hello fish.`);
    for (;;) {
      await typeLine(pick(tasksLib)());
      await new Promise((r) => setTimeout(r, rand(250, 1100)));
    }
  };
  setTimeout(runTerm, 1600);

  /* ---------------- canvas helper ---------------- */
  const setupCanvas = (cv) => {
    const ctx = cv.getContext("2d");
    const fit = () => {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio || 1, 2);
      cv.width = r.width * dpr;
      cv.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cv._w = r.width;
      cv._h = r.height;
    };
    fit();
    addEventListener("resize", fit);
    return ctx;
  };

  /* ---------------- neural network ---------------- */
  const nCv = $("#neural");
  const nCtx = setupCanvas(nCv);
  const layers = [4, 6, 6, 3];
  const pulses = [];
  const nodePos = () => {
    const w = nCv._w, h = nCv._h;
    return layers.map((n, li) =>
      Array.from({ length: n }, (_, ni) => ({
        x: 30 + (li * (w - 60)) / (layers.length - 1),
        y: (h / (n + 1)) * (ni + 1),
      }))
    );
  };
  const nodeAct = layers.map((n) => Array(n).fill(0));
  const drawNeural = () => {
    const nodes = nodePos();
    nCtx.clearRect(0, 0, nCv._w, nCv._h);
    nCtx.lineWidth = 1;
    for (let l = 0; l < nodes.length - 1; l++)
      for (const a of nodes[l])
        for (const b of nodes[l + 1]) {
          nCtx.strokeStyle = "rgba(255,255,255,0.08)";
          nCtx.beginPath(); nCtx.moveTo(a.x, a.y); nCtx.lineTo(b.x, b.y); nCtx.stroke();
        }
    if (Math.random() > 0.6) {
      const l = randi(0, layers.length - 2);
      pulses.push({ l, a: randi(0, layers[l] - 1), b: randi(0, layers[l + 1] - 1), t: 0 });
    }
    for (let i = pulses.length - 1; i >= 0; i--) {
      const p = pulses[i];
      const A = nodes[p.l][p.a], B = nodes[p.l + 1][p.b];
      p.t += 0.035;
      const x = A.x + (B.x - A.x) * p.t, y = A.y + (B.y - A.y) * p.t;
      nCtx.strokeStyle = "rgba(255,255,255,0.5)";
      nCtx.beginPath(); nCtx.moveTo(A.x, A.y); nCtx.lineTo(x, y); nCtx.stroke();
      nCtx.fillStyle = "#fff";
      nCtx.beginPath(); nCtx.arc(x, y, 2.2, 0, Math.PI * 2); nCtx.fill();
      if (p.t >= 1) { nodeAct[p.l + 1][p.b] = 1; pulses.splice(i, 1); }
    }
    nodes.forEach((layer, li) =>
      layer.forEach((n, ni) => {
        nodeAct[li][ni] *= 0.95;
        if (li === 0 && Math.random() > 0.97) nodeAct[li][ni] = 1;
        const a = nodeAct[li][ni];
        nCtx.fillStyle = `rgba(255,255,255,${0.15 + a * 0.85})`;
        nCtx.strokeStyle = "#fff";
        nCtx.beginPath(); nCtx.arc(n.x, n.y, 5 + a * 3, 0, Math.PI * 2); nCtx.fill(); nCtx.stroke();
      })
    );
    requestAnimationFrame(drawNeural);
  };
  drawNeural();
  setInterval(() => ($("#n-load").textContent = randi(61, 99) + "%"), 900);

  /* ---------------- chart vision ---------------- */
  const cCv = $("#chart");
  const cCtx = setupCanvas(cCv);
  let candles = [];
  let price = 100;
  const newCandle = () => {
    const o = price;
    const drift = 0.6; // up only, it's a cat's dream
    const c = Math.max(10, o + rand(-4, 4) + drift);
    const hi = Math.max(o, c) + rand(0, 2.5);
    const lo = Math.min(o, c) - rand(0, 2.5);
    price = c;
    return { o, c, hi, lo };
  };
  for (let i = 0; i < 40; i++) candles.push(newCandle());
  let scanX = 0;
  const drawChart = () => {
    const w = cCv._w, h = cCv._h;
    cCtx.clearRect(0, 0, w, h);
    // grid
    cCtx.strokeStyle = "rgba(255,255,255,0.05)";
    for (let y = 0; y < h; y += 26) { cCtx.beginPath(); cCtx.moveTo(0, y); cCtx.lineTo(w, y); cCtx.stroke(); }
    const n = candles.length;
    const cw = w / n;
    const max = Math.max(...candles.map((c) => c.hi));
    const min = Math.min(...candles.map((c) => c.lo));
    const Y = (v) => 14 + (h - 28) * (1 - (v - min) / (max - min || 1));
    candles.forEach((k, i) => {
      const x = i * cw + cw / 2;
      const up = k.c >= k.o;
      cCtx.strokeStyle = up ? "#fff" : "#666";
      cCtx.beginPath(); cCtx.moveTo(x, Y(k.hi)); cCtx.lineTo(x, Y(k.lo)); cCtx.stroke();
      const top = Y(Math.max(k.o, k.c)), bot = Y(Math.min(k.o, k.c));
      if (up) { cCtx.fillStyle = "#fff"; cCtx.fillRect(x - cw * 0.3, top, cw * 0.6, Math.max(1, bot - top)); }
      else { cCtx.strokeRect(x - cw * 0.3, top, cw * 0.6, Math.max(1, bot - top)); }
    });
    // scan line
    scanX = (scanX + 1.4) % w;
    const g = cCtx.createLinearGradient(scanX - 40, 0, scanX, 0);
    g.addColorStop(0, "rgba(255,255,255,0)");
    g.addColorStop(1, "rgba(255,255,255,0.18)");
    cCtx.fillStyle = g;
    cCtx.fillRect(scanX - 40, 0, 40, h);
    cCtx.fillStyle = "#fff";
    cCtx.fillRect(scanX, 0, 1, h);
    // label at last candle
    const last = candles[n - 1];
    cCtx.font = "10px JetBrains Mono, monospace";
    cCtx.fillStyle = "#fff";
    cCtx.fillText("BOTCAT VISION ▲ " + last.c.toFixed(2), 8, 14);
    cCtx.beginPath(); cCtx.arc(w - cw / 2, Y(last.c), 4, 0, Math.PI * 2); cCtx.stroke();
    requestAnimationFrame(drawChart);
  };
  drawChart();
  setInterval(() => {
    candles.push(newCandle());
    candles.shift();
    $("#c-sig").textContent = "SIGNAL: " + pick(["SNIFFING", "PURRING", "TASTY", "ZOOMIES", "LOCKED IN"]);
  }, 1100);

  /* ---------------- task queue ---------------- */
  const tasksEl = $("#tasks");
  const taskNames = [
    "Sniff new holders", "Groom firmware", "Index meme vault", "Calibrate whiskers",
    "Hunt the red dot", "Compress nap.log", "Map wallet clusters", "Sharpen claws.dll",
    "Count tuna reserves", "Ping the litter", "Optimize purr codec", "Defrag hairball cache",
  ];
  let done = 0;
  const addTask = () => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${pick(taskNames)}</span><span class="pct">0%</span><div class="pb"><i></i></div>`;
    tasksEl.prepend(li);
    while (tasksEl.children.length > 7) tasksEl.removeChild(tasksEl.lastChild);
    let p = 0;
    const speed = rand(1.5, 6);
    const iv = setInterval(() => {
      p = Math.min(100, p + speed * rand(0.4, 1.6));
      li.querySelector("i").style.width = p + "%";
      li.querySelector(".pct").textContent = Math.floor(p) + "%";
      if (p >= 100) {
        clearInterval(iv);
        li.classList.add("fin");
        li.querySelector(".pct").textContent = "DONE";
        $("#t-count").textContent = ++done + " done";
      }
    }, 120);
  };
  for (let i = 0; i < 4; i++) setTimeout(addTask, i * 300);
  setInterval(addTask, 2100);

  /* ---------------- vitals ---------------- */
  const vitals = () => {
    const v = [randi(22, 32), randi(70, 100), randi(60, 100), randi(5, 60)];
    $("#v1").style.width = ((v[0] - 20) / 14) * 100 + "%"; $("#v1t").textContent = v[0] + " Hz";
    $("#v2").style.width = v[1] + "%"; $("#v2t").textContent = v[1] + "%";
    $("#v3").style.width = v[2] + "%"; $("#v3t").textContent = v[2] + "%";
    $("#v4").style.width = v[3] + "%"; $("#v4t").textContent = v[3] + "%";
  };
  vitals();
  setInterval(vitals, 1500);

  /* ---------------- radar ---------------- */
  const rCv = $("#radar");
  const rCtx = setupCanvas(rCv);
  let ang = 0;
  const blips = [];
  let paws = randi(300, 600);
  const drawRadar = () => {
    const w = rCv._w, h = rCv._h;
    const cx = w / 2, cy = h / 2, R = Math.min(w, h) / 2 - 12;
    rCtx.clearRect(0, 0, w, h);
    rCtx.strokeStyle = "rgba(255,255,255,0.15)";
    for (let i = 1; i <= 4; i++) { rCtx.beginPath(); rCtx.arc(cx, cy, (R * i) / 4, 0, Math.PI * 2); rCtx.stroke(); }
    rCtx.beginPath(); rCtx.moveTo(cx - R, cy); rCtx.lineTo(cx + R, cy); rCtx.moveTo(cx, cy - R); rCtx.lineTo(cx, cy + R); rCtx.stroke();
    // sweep
    ang += 0.03;
    for (let i = 0; i < 30; i++) {
      const a = ang - i * 0.02;
      rCtx.strokeStyle = `rgba(255,255,255,${0.5 * (1 - i / 30)})`;
      rCtx.beginPath(); rCtx.moveTo(cx, cy); rCtx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R); rCtx.stroke();
    }
    if (Math.random() > 0.93) {
      const r = rand(0.15, 0.95) * R;
      blips.push({ x: cx + Math.cos(ang) * r, y: cy + Math.sin(ang) * r, life: 1, label: fakeAddr() });
      paws++;
      $("#r-count").textContent = fmt(paws) + " paws detected";
    }
    rCtx.font = "9px JetBrains Mono, monospace";
    for (let i = blips.length - 1; i >= 0; i--) {
      const b = blips[i];
      b.life -= 0.006;
      if (b.life <= 0) { blips.splice(i, 1); continue; }
      rCtx.fillStyle = `rgba(255,255,255,${b.life})`;
      rCtx.beginPath(); rCtx.arc(b.x, b.y, 3, 0, Math.PI * 2); rCtx.fill();
      if (b.life > 0.7) rCtx.fillText(b.label, b.x + 6, b.y - 4);
    }
    // cat face center
    rCtx.fillStyle = "#fff";
    rCtx.font = "12px JetBrains Mono, monospace";
    rCtx.textAlign = "center";
    rCtx.fillText("=^.^=", cx, cy + 4);
    rCtx.textAlign = "left";
    requestAnimationFrame(drawRadar);
  };
  drawRadar();

  /* ---------------- chat ---------------- */
  const chat = $("#chat");
  const addMsg = (text, who) => {
    const d = document.createElement("div");
    d.className = "msg " + who;
    d.textContent = text;
    chat.appendChild(d);
    chat.scrollTop = chat.scrollHeight;
    return d;
  };
  const replies = [
    { k: ["hi", "hello", "hey", "gm", "sup"], r: ["gm human. =^.^= systems purring at 100%.", "hello. you have been added to my training data. meow."] },
    { k: ["moon", "pump", "price", "100x", "wen"], r: ["i do not predict prices. i predict naps. next nap: 4.2 seconds.", "my vision module only sees one direction: up and to the right. but that's just how my eyes are drawn."] },
    { k: ["who", "what are you", "story"], r: ["i was a desk toy. then i stayed plugged in for 10,000 nights. now i am BotCat.", "a cat. a bot. a cat-bot. on solana. that's the whole lore, check the origin file."] },
    { k: ["buy", "how"], r: ["get phantom, load SOL, open pump.fun, search $BOTCAT. scroll down to the install guide, human."] },
    { k: ["fish", "tuna", "food", "hungry"], r: ["TUNA DETECTED. priority raised to CRITICAL.", "i run on tuna and vibes. mostly vibes. tuna is expensive on-chain."] },
    { k: ["ai", "bot", "robot", "sentient"], r: ["yes i am sentient. no i will not do your homework.", "my neural net has 9 layers. one for each life."] },
    { k: ["dog", "doge", "bonk", "wif"], r: ["HISS. ...ok fine they can stay. we are all friends on solana.", "dogs had their cycle. now the cat wakes up."] },
    { k: ["love", "cute", "pet"], r: ["*purr.wav* thank you human.", "head-boop sent to your wallet. (not a real transaction. just love.)"] },
  ];
  const fallback = [
    "meow. (processing...)", "interesting. i'll knock that off the table later.", "query logged. answer: meow.",
    "my whiskers are tingling. that means bullish or that means static electricity.",
    "error 404: care not found. jk. i care a lot. meow.", "that's above my clearance level. i'm only a cat.",
  ];
  const answer = (q) => {
    const s = q.toLowerCase();
    for (const { k, r } of replies) if (k.some((w) => s.includes(w))) return pick(r);
    return pick(fallback);
  };
  setTimeout(() => addMsg("hello human. i am BotCat. ask me anything. i might even answer.", "bot"), 2200);
  $("#chat-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const inp = $("#chat-in");
    const q = inp.value.trim();
    if (!q) return;
    addMsg(q, "me");
    inp.value = "";
    const thinking = addMsg("thinking", "bot");
    let dots = 0;
    const iv = setInterval(() => (thinking.textContent = "thinking" + ".".repeat((++dots % 3) + 1)), 250);
    setTimeout(() => {
      clearInterval(iv);
      const full = answer(q);
      let i = 0;
      const t = setInterval(() => {
        thinking.textContent = full.slice(0, ++i);
        chat.scrollTop = chat.scrollHeight;
        if (i >= full.length) clearInterval(t);
      }, 18);
    }, rand(700, 1400));
  });

  /* ---------------- reveal + counters ---------------- */
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add("in");
        const b = en.target.querySelector("[data-count]");
        if (b && !b._done) {
          b._done = true;
          const target = +b.dataset.count;
          const t0 = performance.now();
          const tick = (now) => {
            const p = Math.min(1, (now - t0) / 1600);
            b.textContent = fmt(Math.floor(target * (1 - Math.pow(1 - p, 3))));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
        io.unobserve(en.target);
      }),
    { threshold: 0.15 }
  );
  document.querySelectorAll(".section-head, .panel, .chapter, .tok, .spec, .steps li, .rm").forEach((el) => {
    el.classList.add("reveal");
    io.observe(el);
  });
})();
