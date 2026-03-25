// Configuração do destino padrão; ajuste conforme o e-mail oficial de psicologia
const DESTINO_AGENDAMENTO = 'depatamentodepsicologos@gmail.com';

// Monta e dispara o mailto a partir do formulário de agendamento
function initAgendamento() {
	const form = document.getElementById('form-agenda');
	const btn = document.getElementById('btn-agendar');

	function handleSend(event) {
		event?.preventDefault();
		const nome = (document.getElementById('ag-nome')?.value || '').trim();
		const email = (document.getElementById('ag-email')?.value || '').trim();
		const area = (document.getElementById('ag-area')?.value || '').trim();
		const horario = (document.getElementById('ag-horario')?.value || '').trim();
		const urgencia = (document.getElementById('ag-urgencia')?.value || '').trim();
		const crise = (document.getElementById('ag-crise')?.value || '').trim();
		const motivo = (document.getElementById('ag-motivo')?.value || '').trim();
		if (!nome || !email) {
			alert('Preencha nome e e-mail corporativo para enviar o pedido.');
			return;
		}
		const assunto = encodeURIComponent('Agendamento de consulta psicológica');
		const corpo = encodeURIComponent(
			`Nome: ${nome}\nE-mail: ${email}\nÁrea/Squad: ${area || '—'}\nPreferência de horário: ${horario || '—'}\nUrgência: ${urgencia || '—'}\nTipo de crise: ${crise || '—'}\nMotivo: ${motivo || '—'}`
		);
		window.location.href = `mailto:${DESTINO_AGENDAMENTO}?subject=${assunto}&body=${corpo}`;
	}

	btn?.addEventListener('click', handleSend);
	form?.addEventListener('submit', handleSend);
}

document.addEventListener('DOMContentLoaded', ()=>{
  initAgendamento();

  // Anima elementos educacionais com reveal on-scroll
  function initReveal() {
	const items = document.querySelectorAll('.reveal');
	if (!items.length) return;

	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add('is-visible');
				observer.unobserve(entry.target);
			}
		});
	}, { threshold: 0.16, rootMargin: '0px 0px -40px 0px' });

	items.forEach((item, index) => {
		item.style.transitionDelay = `${Math.min(index * 60, 320)}ms`;
		observer.observe(item);
	});
}

  initReveal();

  // Carregador simples e robusto de imagens: tenta várias alternativas e usa placeholder no fim
  (function initImages(){
    const FALLBACKS = ['../site-doces/img/placeholder.svg','site-doces/img/placeholder.svg','/site-doces/img/placeholder.svg','img/placeholder.svg'];

    function tryImage(img, candidates){
      let i = 0;
      function next(){
        if(i >= candidates.length){
          img.src = FALLBACKS[0];
          return;
        }
        const c = candidates[i++];
        try {
          const tester = new Image();
          tester.onload = () => { try { img.src = c; } catch(e){} };
          tester.onerror = next;
          tester.src = c;
        } catch(e){ next(); }
      }
      next();
    }

    document.querySelectorAll('img').forEach(img => {
      try {
        const raw = (img.getAttribute('data-src') || img.getAttribute('src') || '').trim();
        const candidates = [];
        if (raw) {
          const filename = raw.split('/').pop();
          candidates.push(encodeURI(raw));
          if (filename) {
            candidates.push(encodeURI(`../site-doces/img/${filename}`));
            candidates.push(encodeURI(`site-doces/img/${filename}`));
            candidates.push(encodeURI(`./img/${filename}`));
            candidates.push(encodeURI(`../img/${filename}`));
          }
        }
        candidates.push(...FALLBACKS);
        const uniq = [...new Set(candidates)];
        tryImage(img, uniq);
        img.onerror = function(){ this.onerror = null; this.src = FALLBACKS[0]; };
      } catch(e){ /* ignore */ }
    });
  })();

  // Função para forçar recarregamento das imagens (cache-bust opcional)
  function reloadAllImages(options = { cacheBust: true }) {
    const { cacheBust } = options;
    document.querySelectorAll('img').forEach(img => {
      try {
        const raw = (img.getAttribute('data-src') || img.getAttribute('src') || '').trim();
        if (!raw) return;
        let url = raw;
        // se raw for um caminho relativo curto (nome do arquivo), expandir para ../site-doces/img/
        if (!url.includes('/') && document.location) {
          url = `../site-doces/img/${url}`;
        }
        if (cacheBust) {
          const base = url.split('?')[0];
          const sep = base.includes('?') ? '&' : '?';
          url = `${base}${sep}cb=${Date.now()}`;
        }
        img.src = url;
      } catch (e) { /* ignore */ }
    });
    console.log('reloadAllImages: imagens recarregadas', options);
  }

  // Expor a função globalmente e ouvir evento customizado
  window.reloadImages = reloadAllImages;
  window.addEventListener('reload-images', (e) => {
    const cacheBust = e?.detail?.cacheBust !== false;
    reloadAllImages({ cacheBust });
  });

  // Recarrega uma vez após carregamento para atualizar possíveis recursos em cache
  setTimeout(() => reloadAllImages({ cacheBust: true }), 300);

});
