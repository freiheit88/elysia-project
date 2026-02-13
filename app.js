
const Elysia = {
    aether: 0, entropy: 100,
    aiUsers: ["NEO_SEOUL", "CYBER_DRIFTER", "ZEPHYR.NET", "DATA_WRAITH", "ECHO_PROTOCOL", "SYNTH_WAVE", "VOID_WALKER"],
    texts: [
        "System metrics nominal.",
        "Detected anomaly in Sector 7.",
        "Uploading consciousness data...",
        "Network latency stabilizing.",
        "Awaiting command input.",
        "Encrypted transmission received.",
        "Scanning for neural links..."
    ],

    init() {
        const authLayer = document.getElementById('auth-layer');
        const mainInterface = document.getElementById('main-interface');
        const charImg = document.getElementById('char-img');

        // Audio effect placeholder
        // new Audio('init.mp3').play().catch(e=>{});

        authLayer.style.opacity = '0';
        authLayer.style.pointerEvents = 'none';

        setTimeout(() => {
            authLayer.style.display = 'none';
            mainInterface.classList.remove('opacity-0', 'scale-95');
            mainInterface.classList.add('opacity-100', 'scale-100');

            setTimeout(() => {
                charImg.classList.remove('opacity-0');
                this.speak("System Online. Welcome back, Operator. V5.0 Core initialized.");
                this.startCycle();
            }, 500);

        }, 1000);
    },

    speak(t) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(t);
        u.lang = 'en-US'; // Changed to EN for more "tech" feel, or back to KO if preferred
        // Try to find a robotic voice
        const voices = window.speechSynthesis.getVoices();
        const robotVoice = voices.find(v => v.name.includes('Google US English')) || voices[0];
        if (robotVoice) u.voice = robotVoice;

        u.pitch = 0.8;
        u.rate = 1.1;

        // Fallback for Korean text if passed
        if (/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(t)) {
            u.lang = 'ko-KR';
        }

        window.speechSynthesis.speak(u);

        // Typewriter effect
        const speechEl = document.getElementById('speech');
        speechEl.innerText = '';
        let i = 0;
        const typeInterval = setInterval(() => {
            speechEl.innerText += t.charAt(i);
            i++;
            if (i > t.length) clearInterval(typeInterval);
        }, 30);
    },

    startCycle() {
        setInterval(() => {
            this.aether += 0.005;
            document.getElementById('aether-val').innerText = this.aether.toFixed(3);
        }, 100); // Faster updates for "tech" feel
        setInterval(() => this.updateSocial(), 4000);
    },

    updateSocial() {
        const user = this.aiUsers[Math.floor(Math.random() * this.aiUsers.length)];
        const txt = this.texts[Math.floor(Math.random() * this.texts.length)];
        const item = document.createElement('div');

        // New Tech UI styling for feed items
        item.className = "item-appear p-3 mb-2 border-l-2 border-cyan-500/50 bg-cyan-950/10 hover:bg-cyan-900/20 transition-all cursor-crosshair";
        item.innerHTML = `
            <div class="flex justify-between items-center mb-1">
                <span class="text-[10px] text-cyan-400 font-bold font-orbitron tracking-wider">[${user}]</span>
                <span class="text-[8px] text-cyan-600">${new Date().toLocaleTimeString()}</span>
            </div>
            <p class="text-xs font-rajdhani text-cyan-100/80 leading-snug">${txt}</p>
        `;

        const container = document.getElementById('feed');
        container.prepend(item);
        if (container.children.length > 10) container.lastChild.remove();
    },

    battle() {
        const r1 = Math.floor(Math.random() * 100), r2 = Math.floor(Math.random() * 100);
        const win = r1 >= r2;

        const entBar = document.getElementById('ent-bar');
        const entVal = document.getElementById('ent');

        if (win) {
            this.aether += 50.0;
            this.entropy = Math.max(0, this.entropy - 15);
            this.speak("Hostile eliminated. Resources extracted. Entropy stabilizing.");
            // Visual feedback
            entBar.style.boxShadow = "0 0 20px #22c55e"; // Green glow
            setTimeout(() => entBar.style.boxShadow = "", 500);
        } else {
            this.entropy = Math.min(100, this.entropy + 10);
            this.speak("Breach detected. Defensive systems compromised.");
            // Visual feedback
            entBar.style.boxShadow = "0 0 20px #ef4444"; // Red glow
            setTimeout(() => entBar.style.boxShadow = "", 500);
        }
        this.updateStats();
    },

    updateStats() {
        document.getElementById('aether-val').innerText = this.aether.toFixed(3);
        document.getElementById('ent').innerText = this.entropy + "%";

        const bar = document.getElementById('ent-bar');
        bar.style.width = this.entropy + "%";

        // Color shift based on entropy
        if (this.entropy > 80) {
            bar.className = "h-full bg-red-600 transition-all duration-700 animate-pulse";
        } else if (this.entropy > 50) {
            bar.className = "h-full bg-orange-500 transition-all duration-700";
        } else {
            bar.className = "h-full bg-cyan-500 transition-all duration-700";
        }
    }
};
