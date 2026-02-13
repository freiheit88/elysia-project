
const Elysia = {
    aether: 0, entropy: 100,
    aiUsers: ["보리스", "루시안", "클로에", "티치엘", "밀라", "조슈아", "란지에"],
    texts: ["정원의 공기가 차갑군요.", "새로운 자본이 감지되었습니다.", "당신의 우월함을 증명하십시오.", "시스템 동기화율 99%...", "다른 영혼들이 당신을 주목합니다."],
    
    init() {
        document.getElementById('auth-layer').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('auth-layer').remove();
            document.getElementById('char-img').classList.remove('opacity-0');
            this.speak("마스터, V4.1 소버린 코어가 활성화되었습니다. 아스트라이아의 경제 엔진이 작동을 시작합니다.");
            this.startCycle();
        }, 1000);
    },

    speak(t) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(t); u.lang='ko-KR'; u.pitch=1.1; u.rate=0.95;
        window.speechSynthesis.speak(u);
        document.getElementById('speech').innerText = t;
    },

    startCycle() {
        setInterval(() => {
            this.aether += 0.001;
            document.getElementById('aether-val').innerText = this.aether.toFixed(3);
        }, 1000);
        setInterval(() => this.updateSocial(), 7000);
    },

    updateSocial() {
        const user = this.aiUsers[Math.floor(Math.random()*this.aiUsers.length)];
        const txt = this.texts[Math.floor(Math.random()*this.texts.length)];
        const item = document.createElement('div');
        item.className = "feed-item p-5 bg-white/5 rounded-2xl border border-white/5 shadow-inner";
        item.innerHTML = `<p class="text-[10px] text-indigo-400 font-bold mb-1 uppercase">${user}</p><p class="text-sm font-light text-gray-200 leading-snug">${txt}</p>`;
        const container = document.getElementById('feed');
        container.prepend(item);
        if(container.children.length > 7) container.lastChild.remove();
    },

    battle() {
        const r1 = Math.floor(Math.random()*6)+1, r2 = Math.floor(Math.random()*6)+1;
        if(r1 >= r2) {
            this.aether += 15.0; this.entropy -= 10;
            this.speak("승리하셨습니다. 보상으로 15 에테르를 획득하고 엔트로피를 정화했습니다.");
        } else {
            this.entropy += 5;
            this.speak("시스템 간섭으로 패배했습니다. 엔트로피가 증가합니다.");
        }
        this.updateStats();
    },

    updateStats() {
        document.getElementById('aether-val').innerText = this.aether.toFixed(3);
        document.getElementById('ent').innerText = this.entropy;
        document.getElementById('ent-bar').style.width = this.entropy + "%";
    }
};
