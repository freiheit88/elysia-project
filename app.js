/**
 * THE SOVEREIGN ENGINE V6.0 (STEAMPUNK CORE)
 * ARCHITECT: THE COUNCIL
 */

const App = {
    // STATE
    state: {
        view: 'atlas',
        history: [
            { sender: 'automaton', text: "The gears are turning, Master. I await your command." }
        ]
    },

    // INIT
    init() {
        this.cacheDOM();
        this.renderParticles();
        this.renderChat();
        lucide.createIcons();
        console.log("The Machine is Humming.");
    },

    cacheDOM() {
        this.dom = {
            header: document.getElementById('main-header'),
            views: {
                atlas: document.getElementById('view-atlas'),
                manor: document.getElementById('view-manor')
            },
            chat: {
                logs: document.getElementById('chat-logs'),
                input: document.getElementById('chat-input')
            },
            steam: document.getElementById('steam-layer')
        };
    },

    // --- [THE MACHINIST: AUDIO ENGINE] ---
    playClick() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'square';
            osc.frequency.setValueAtTime(150, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.1);

            gain.gain.setValueAtTime(0.1, ctx.currentTime); // Lower volume
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.1);
        } catch (e) { console.warn("Audio Context blocked"); }
    },

    // --- [THE ATLAS: NAVIGATION] ---
    navigate(target) {
        this.playClick();
        this.state.view = target;

        if (target === 'manor') {
            this.dom.header.classList.add('opacity-0', '-translate-y-10');

            this.dom.views.atlas.classList.add('opacity-0', 'pointer-events-none');
            this.dom.views.atlas.classList.remove('scale-100');

            this.dom.views.manor.classList.remove('opacity-0', 'pointer-events-none', 'scale-90');
            this.dom.views.manor.classList.add('scale-100');
        } else {
            this.dom.header.classList.remove('opacity-0', '-translate-y-10');

            this.dom.views.manor.classList.add('opacity-0', 'pointer-events-none', 'scale-90');
            this.dom.views.manor.classList.remove('scale-100');

            this.dom.views.atlas.classList.remove('opacity-0', 'pointer-events-none');
            this.dom.views.atlas.classList.add('scale-100');
        }
    },

    locked() {
        this.playClick();
        alert("The gears are locked. This area is under construction.");
    },

    // --- [THE CHRONICLER: CHAT ENGINE] ---
    renderChat() {
        this.dom.chat.logs.innerHTML = '';
        this.state.history.forEach(msg => {
            const div = document.createElement('div');
            div.className = `flex flex-col ${msg.sender === 'master' ? 'items-end' : 'items-start'}`;
            div.innerHTML = `
                <span class="text-[9px] uppercase tracking-widest text-[#8b7355] mb-1">
                    ${msg.sender === 'master' ? 'The Master' : 'Automaton #04'}
                </span>
                <div class="p-3 max-w-[85%] border ${msg.sender === 'master'
                    ? 'bg-[#2c241b] border-[#c5a059] text-[#f4e4bc]'
                    : 'bg-[#1a1a1a] border-[#4a3b2a] text-[#a09078] italic'
                } text-sm font-serif shadow-md">
                    ${msg.text}
                </div>
            `;
            this.dom.chat.logs.appendChild(div);
        });
        this.dom.chat.logs.scrollTop = this.dom.chat.logs.scrollHeight;
    },

    sendMessage() {
        const text = this.dom.chat.input.value.trim();
        if (!text) return;

        this.playClick();
        this.state.history.push({ sender: 'master', text: text });
        this.dom.chat.input.value = '';
        this.renderChat();

        // Automaton Response
        setTimeout(() => {
            this.playClick();
            this.state.history.push({
                sender: 'automaton',
                text: `Command received: "${text}". Feeding data into the steam engine.`
            });
            this.renderChat();
        }, 1200);
    },

    // --- [THE ILLUSTRATOR: PARTICLES] ---
    renderParticles() {
        // Create Steam particles randomly
        for (let i = 0; i < 5; i++) {
            const el = document.createElement('div');
            el.className = 'steam-particle w-20 h-20';
            el.style.left = Math.random() * 100 + '%';
            el.style.bottom = '-50px';
            el.style.animationDelay = Math.random() * 5 + 's';
            this.dom.steam.appendChild(el);
        }
    }
};

window.onload = () => App.init();
