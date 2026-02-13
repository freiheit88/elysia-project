/**
 * ELYSIA SOVEREIGN ENGINE V5.2
 * ARCHITECT: THE COUNCIL
 */

const Elysia = {
    // 1. STATE (Persistent)
    state: {
        aether: 0.000,
        integrity: 100,
        startTime: Date.now(),
        logs: []
    },

    // 2. CONFIG
    config: {
        tickRate: 100, // 0.1s
        aetherPerTick: 0.002,
        maxIntegrity: 100
    },

    // 3. INIT
    init() {
        this.load();
        this.cacheDOM();
        this.bindEvents();

        // Reveal Character
        setTimeout(() => document.getElementById('seraphina').classList.remove('opacity-0'), 500);

        // Start Engine
        this.engineLoop = setInterval(() => this.tick(), this.config.tickRate);
        this.log("Sovereign Engine V5.2 Initialized.");
        this.speak("마스터, 소버린 엔진이 가동되었습니다. 에테르 추출을 시작합니다.");
    },

    cacheDOM() {
        this.dom = {
            aeVal: document.getElementById('ae-val'),
            hpBar: document.getElementById('hp-bar'),
            hpText: document.getElementById('integrity-text'),
            dialogue: document.getElementById('dialogue'),
            feed: document.getElementById('feed-container'),
            uptime: document.getElementById('uptime')
        };
    },

    bindEvents() {
        // Future keyboard shortcuts
    },

    // 4. CORE LOOP
    tick() {
        // Aether Growth
        this.state.aether += this.config.aetherPerTick;

        // Random Events
        if (Math.random() < 0.005) {
            this.state.integrity = Math.max(0, this.state.integrity - 1);
            this.log("WARNING: Integrity breach detected.", "warn");
        }

        // Uptime
        const diff = Math.floor((Date.now() - this.state.startTime) / 1000);
        const h = Math.floor(diff / 3600).toString().padStart(2, '0');
        const m = Math.floor((diff % 3600) / 60).toString().padStart(2, '0');
        const s = (diff % 60).toString().padStart(2, '0');
        this.dom.uptime.innerText = `${h}:${m}:${s}`;

        // Save & Render
        if (this.state.aether % 0.1 < 0.005) this.save(); // Frequent saves
        this.render();
    },

    // 5. ACTIONS
    action(type) {
        if (type === 'battle') {
            const roll = Math.random();
            if (roll > 0.4) {
                this.state.aether += 5;
                this.speak("프로토콜 실행 성공. 에테르를 확보했습니다.");
                this.log(`BATTLE WON: +5.000 Æ`);
            } else {
                this.state.integrity -= 5;
                this.speak("시스템 저항이 감지되었습니다. 무결성이 손상되었습니다.");
                this.log(`BATTLE LOST: -5% Integrity`, "error");
            }
        } else if (type === 'purge') {
            if (this.state.aether >= 10) {
                this.state.aether -= 10;
                this.state.integrity = Math.min(100, this.state.integrity + 20);
                this.speak("시스템 정화 완료. 무결성이 회복되었습니다.");
                this.log(`PURGE COMPLETE: +20% Integrity`);
            } else {
                this.speak("에테르가 부족합니다.");
            }
        }
        this.save();
        this.render();
    },

    // 6. UTILS
    log(msg, type = 'info') {
        const div = document.createElement('div');
        div.className = "feed-anim p-3 mb-2 rounded bg-white/5 border-l-2 border-white/10 text-xs font-light text-gray-300";
        if (type === 'warn') div.classList.add('border-amber-500', 'text-amber-200');
        if (type === 'error') div.classList.add('border-rose-500', 'text-rose-200');

        div.innerHTML = `<span class="opacity-50 text-[9px] mr-2">[${new Date().toLocaleTimeString()}]</span>${msg}`;
        this.dom.feed.prepend(div);

        if (this.dom.feed.children.length > 20) this.dom.feed.lastChild.remove();
    },

    speak(text) {
        this.dom.dialogue.innerText = text;
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'ko-KR';
        u.rate = 1.0;
        window.speechSynthesis.speak(u);
    },

    render() {
        this.dom.aeVal.innerText = this.state.aether.toFixed(3);
        this.dom.hpBar.style.width = `${this.state.integrity}%`;
        this.dom.hpText.innerText = `${this.state.integrity}%`;

        // Dynamic Color for HP
        if (this.state.integrity < 30) {
            this.dom.hpBar.className = "h-full bg-rose-600 transition-all duration-1000 animate-pulse";
        } else {
            this.dom.hpBar.className = "h-full bg-indigo-500 transition-all duration-1000";
        }
    },

    save() {
        localStorage.setItem('elysia_v5_engine', JSON.stringify(this.state));
    },

    load() {
        const saved = localStorage.getItem('elysia_v5_engine');
        if (saved) {
            this.state = { ...this.state, ...JSON.parse(saved) };
        }
    }
};

window.onload = () => Elysia.init();
