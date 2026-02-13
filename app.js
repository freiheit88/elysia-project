
const Elysia = {
    // 1. 상태 데이터 (저장될 대상)
    state: {
        aether: 0,
        entropy: 100,
        battleCount: 0,
        lastUpdate: Date.now()
    },

    init() {
        this.load(); // 데이터 불러오기
        this.speak("마스터, 복귀를 환영합니다. 모든 데이터는 블랙박스에 안전하게 기록되었습니다.");
        this.startEngine();
    },

    // [중요] 데이터 저장 로직 (방지책)
    save() {
        localStorage.setItem('elysia_sovereign_state', JSON.stringify(this.state));
        const indicator = document.getElementById('save-indicator');
        if (indicator) {
            indicator.style.opacity = '1';
            setTimeout(() => indicator.style.opacity = '0', 2000);
        }
    },

    load() {
        const saved = localStorage.getItem('elysia_sovereign_state');
        if (saved) {
            this.state = JSON.parse(saved);
            this.updateUI();
        }
    },

    resetData() {
        if (confirm("모든 에테르와 전적을 소멸시키겠습니까?")) {
            localStorage.clear(); location.reload();
        }
    },

    speak(t) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(t); u.lang = 'ko-KR'; u.rate = 0.95;
        window.speechSynthesis.speak(u);
        const speechEl = document.getElementById('speech');
        if (speechEl) speechEl.innerText = t;
    },

    startEngine() {
        setInterval(() => {
            this.state.aether += 0.001;
            this.updateUI();
            if (Math.random() > 0.98) this.addFeed();
        }, 1000);
        // 30초마다 자동 저장
        setInterval(() => this.save(), 30000);
    },

    updateUI() {
        const el = document.getElementById('aether-val');
        if (el) el.innerText = this.state.aether.toFixed(3);
    },

    addFeed() {
        const users = ["보리스", "루시안", "티치엘", "이스핀", "막시민"];
        const texts = ["마스터의 에테르가 또 상승했군.", "정원에 새로운 바람이 붑니다.", "배틀 로그를 분석 중입니다.", "우월함이란 이런 것이군요."];
        const user = users[Math.floor(Math.random() * users.length)];
        const text = texts[Math.floor(Math.random() * texts.length)];

        const item = document.createElement('div');
        item.className = "p-4 bg-white/5 rounded-xl border border-white/5 animate-slide-in";
        item.innerHTML = `<p class="text-[9px] font-bold text-indigo-500 mb-1">@${user}</p><p class="text-sm font-light text-gray-300">${text}</p>`;
        const container = document.getElementById('feed');
        if (container) {
            container.prepend(item);
            if (container.children.length > 10) container.lastChild.remove();
        }
    },

    battle() {
        const r1 = Math.floor(Math.random() * 6) + 1, r2 = Math.floor(Math.random() * 6) + 1;
        this.state.battleCount++;
        if (r1 >= r2) {
            this.state.aether += 10;
            this.speak("승리했습니다. 10 에테르를 금고에 추가합니다.");
        } else {
            this.speak("간섭으로 인해 패배했습니다.");
        }
        this.save(); // 배틀 직후 저장
        this.updateUI();
    }
};
window.onload = () => Elysia.init();
