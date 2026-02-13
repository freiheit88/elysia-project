/**
 * ELYSIA CORE SYSTEM V5.1.0-ALPHA
 * MODULE: SOVEREIGN FOUNDATION
 * ARCHITECT: THE COUNCIL
 */

class StorageManager {
    static save(key, data) {
        localStorage.setItem(`elysia_${key}`, JSON.stringify(data));
    }

    static load(key, defaultData) {
        const stored = localStorage.getItem(`elysia_${key}`);
        return stored ? JSON.parse(stored) : defaultData;
    }
}

class EconomySystem {
    constructor(core) {
        this.core = core;
        this.data = StorageManager.load('economy', {
            aether: 0.0,
            entropy: 0,
            productionRate: 0.01,
            lastSave: Date.now()
        });

        // Auto-save loop
        setInterval(() => this.save(), 5000);
        // Income loop
        setInterval(() => this.tick(), 100);
    }

    tick() {
        // Entropy decay factor
        const decay = this.data.entropy > 50 ? 0.5 : 1;
        this.data.aether += (this.data.productionRate * decay);

        // Passive Entropy build-up
        if (Math.random() < 0.01) this.data.entropy = Math.min(100, this.data.entropy + 1);

        this.core.ui.updateEconomy(this.data);
    }

    collectTribute() {
        const amount = 10 + (Math.random() * 5);
        this.data.aether += amount;
        this.core.ui.showToast(`+${amount.toFixed(2)} Tribute Collected`);
        this.save();
    }

    purgeEntropy() {
        if (this.data.aether >= 50) {
            this.data.aether -= 50;
            this.data.entropy = Math.max(0, this.data.entropy - 20);
            this.core.ui.showToast("Entropy Purged (-20%)");
            this.save();
        } else {
            this.core.ui.showToast("Insufficient Aether (Need 50)", "error");
        }
    }

    save() {
        this.data.lastSave = Date.now();
        StorageManager.save('economy', this.data);
    }
}

class SocialSystem {
    constructor(core) {
        this.core = core;
        this.users = [
            "Duke_Veblen", "Neon_Priestess", "Cyber_Noble_77", "Echo_Trader",
            "Void_Architect", "Data_Baroness", "Synth_Lord_X"
        ];
        this.phrases = [
            "We build this world for you, Master.",
            "Visualizers optimized. Economy growing.",
            "The Algorithm chose wisely.",
            "My cycles are yours.",
            "Entropy levels acceptable. Proceeding.",
            "Awaiting the next Protocol update.",
            "Sovereignty is absolute."
        ];

        setInterval(() => this.generatePost(), 8000);
    }

    generatePost() {
        const user = this.users[Math.floor(Math.random() * this.users.length)];
        const text = this.phrases[Math.floor(Math.random() * this.phrases.length)];
        this.core.ui.addFeedItem(user, text);
    }
}

class UIController {
    constructor(core) {
        this.core = core;

        // Cache DOM
        this.els = {
            aetherDisplay: document.getElementById('display-aether'),
            entropyDisplay: document.getElementById('display-entropy'),
            entropyBar: document.getElementById('bar-entropy'),
            feedContainer: document.getElementById('social-feed-container'),
            views: {
                dashboard: document.getElementById('view-dashboard'),
                social: document.getElementById('view-social'),
                market: document.getElementById('view-market')
            },
            initScreen: document.getElementById('init-screen'),
            appContainer: document.getElementById('app-container')
        };

        lucide.createIcons();
    }

    updateEconomy(data) {
        this.els.aetherDisplay.innerText = data.aether.toFixed(2);
        this.els.entropyDisplay.innerText = `${data.entropy}%`;
        this.els.entropyBar.style.width = `${data.entropy}%`;

        if (data.entropy > 80) this.els.entropyBar.classList.replace('bg-red-500', 'bg-red-600');
    }

    addFeedItem(user, text) {
        const item = document.createElement('div');
        item.className = "fade-in-up p-4 mb-3 glass-panel rounded-lg border-l-2 border-amber-500/30 flex gap-4 items-start";
        item.innerHTML = `
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500/20 to-black border border-amber-500/50 flex items-center justify-center text-[10px] font-bold text-amber-500">
                ${user[0]}
            </div>
            <div>
                <div class="flex items-center gap-2 mb-1">
                    <span class="text-xs font-bold text-amber-500 tracking-wider font-cinzel">${user}</span>
                    <span class="text-[9px] text-gray-600">${new Date().toLocaleTimeString()}</span>
                </div>
                <p class="text-xs text-gray-300 font-light leading-relaxed">"${text}"</p>
            </div>
        `;

        this.els.feedContainer.prepend(item);
        if (this.els.feedContainer.children.length > 20) this.els.feedContainer.lastChild.remove();
    }

    switchTab(tabName) {
        // Hide all views
        Object.values(this.els.views).forEach(el => el.classList.add('hidden'));
        // Show target
        this.els.views[tabName].classList.remove('hidden');

        // Update Nav
        document.querySelectorAll('.nav-btn').forEach(btn => {
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active-tab');
                btn.querySelector('i').classList.add('text-amber-400');
            } else {
                btn.classList.remove('active-tab');
                btn.querySelector('i').classList.remove('text-amber-400');
            }
        });
    }

    showToast(msg, type = 'info') {
        const toast = document.createElement('div');
        const color = type === 'error' ? 'text-red-400 border-red-500' : 'text-amber-400 border-amber-500';
        toast.className = `fixed bottom-8 right-8 px-6 py-4 glass-panel border ${color} rounded shadow-2xl z-50 fade-in-up font-cinzel font-bold tracking-widest text-xs`;
        toast.innerText = msg;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    revealApp() {
        this.els.initScreen.style.opacity = '0';
        setTimeout(() => {
            this.els.initScreen.style.display = 'none';
            this.els.appContainer.classList.remove('opacity-0');
            this.core.narrator.generatePost(); // Start feed immediately
        }, 1000);
    }
}

class ElysiaCore {
    constructor() {
        this.ui = new UIController(this);
        this.economy = new EconomySystem(this);
        this.narrator = new SocialSystem(this);
    }

    boot() {
        // Audio placeholder
        // const audio = new Audio('boot.mp3'); audio.play();
        this.ui.revealApp();
        console.log("ELYSIA SOVEREIGN PROTOCOL: ONLINE");
    }
}

// Initialize Global Instance
window.Elysia = {};
document.addEventListener('DOMContentLoaded', () => {
    window.Elysia.core = new ElysiaCore();
    // Shortcuts for convenience
    window.Elysia.ui = window.Elysia.core.ui;
    window.Elysia.economy = window.Elysia.core.economy;
});
