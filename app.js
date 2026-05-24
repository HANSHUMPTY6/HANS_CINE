const TMDB_API_KEY = "1792a3f2826a279b5350d6e9a6576f49";




const dadosDeTeste = {
    anime: [ { id: 95479, poster: "https://image.tmdb.org/t/p/w200/gB1FqT6uLtsFjNeq4U97W4S26n6.jpg" } ],
    serie: [ { id: 1396, poster: "https://image.tmdb.org/t/p/w200/30erzlzIOtOK3k3T3BAl1GiVMP1.jpg" } ],
    filme: [ { id: 533535, poster: "https://image.tmdb.org/t/p/w200/8Y43POKjjKDGI9MH89NW0NAzzp8.jpg" } ]
};

const estadoSerie = { id: null, temporadaAtual: 1, episodioAtual: 1, totalTemporadas: 1, episodiosDaTemporada: [], nomeSerie: '' };
const carregando = { anime: false, serie: false, filme: false };

// ── 0. INJEÇÃO DO BOTÃO "FORÇAR TELA CHEIA" BLINDADO ───────────────────────

function criarBotaoTelaCheia() {
    let btn = document.getElementById('btn-tela-cheia');
    if (!btn) {
        btn = document.createElement('button');
        btn.id = 'btn-tela-cheia';
        btn.innerHTML = '⛶ Tela Cheia';
        // Posicionado no topo direito, ao lado do botão de fechar (X)
        btn.style.cssText = 'position: absolute; top: 25px; right: 100px; z-index: 9999; background: var(--brand-color, #e50914); color: white; border: none; padding: 8px 16px; border-radius: 6px; font-size: 1rem; font-weight: bold; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.5); transition: transform 0.2s;';
        
        btn.onmouseover = () => btn.style.transform = 'scale(1.05)';
        btn.onmouseout = () => btn.style.transform = 'scale(1)';

        btn.onclick = function() {
            // O truque de mestre: forçamos o IFRAME a entrar em tela cheia, não a div!
            const iframe = document.querySelector("#PlayerContainer iframe");
            if (!iframe) return;

            if (!document.fullscreenElement && !document.webkitFullscreenElement) {
                if (iframe.requestFullscreen) iframe.requestFullscreen();
                else if (iframe.webkitRequestFullscreen) iframe.webkitRequestFullscreen(); // Safari/Chrome
                else if (iframe.msRequestFullscreen) iframe.msRequestFullscreen(); // Edge/IE
            } else {
                if (document.exitFullscreen) document.exitFullscreen();
                else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
                else if (document.msExitFullscreen) document.msExitFullscreen();
            }
        };
        
        const modal = document.getElementById('player-modal');
        if(modal) modal.appendChild(btn);
    }
}

// ── 1. Lógica de Canais Ao Vivo (Rei dos Embeds) com Filtro ────────────────

async function carregarCanaisAoVivo(containerId, categoriaQuery = '') {
    const container = document.getElementById(containerId);
    if (!container) return; 
    
    container.innerHTML = '<div class="loading-msg">Sintonizando canais...</div>';
    
    try {
        const urlAPI = categoriaQuery 
            ? `https://reidosembeds.com/api/channels?category=${encodeURIComponent(categoriaQuery)}`
            : `https://reidosembeds.com/api/channels`;

        const resposta = await fetch(urlAPI);
        const dados = await resposta.json();
        const listaCanais = dados.data || [];
        
        container.innerHTML = ''; 
        
        if(listaCanais.length === 0) {
            container.innerHTML = '<p class="loading-msg">Nenhum canal encontrado nesta categoria.</p>';
            return;
        }

        listaCanais.forEach(canal => {
            const card = document.createElement('div');
            card.className = 'canal-card';
            
            const img = document.createElement('img');
            img.src = canal.logo_url || '';
            img.className = 'poster-canal'; 
            img.alt = canal.name || "Canal Ao Vivo";
            img.title = canal.name;
            
            img.onerror = function() {
                this.onerror = null; 
                this.src = `https://via.placeholder.com/400x225/111111/e50914?text=${encodeURIComponent(canal.name || 'Canal')}`;
            };

            const nome = document.createElement('div');
            nome.className = 'canal-nome';
            nome.innerText = canal.name || 'Sem Nome';
            
            const url = canal.embed_url;
            card.onclick = () => abrirPlayerCanal(url);
            
            card.appendChild(img);
            card.appendChild(nome);
            container.appendChild(card);
        });
        
    } catch (erro) {
        console.error("Falha ao carregar canais", erro);
        container.innerHTML = '<p class="loading-msg" style="color: var(--brand-color);">Erro ao conectar com o servidor.</p>';
    }
}

window.mudarCategoriaTV = function(nomeCategoriaParaAPI, botaoClicado, tituloTela) {
    const botoes = document.querySelectorAll('.categories-bar .cat-btn, .sidebar .cat-btn');
    botoes.forEach(btn => btn.classList.remove('active'));
    botaoClicado.classList.add('active');
    
    const h2Titulo = document.getElementById('titulo-categoria');
    if(h2Titulo) h2Titulo.innerHTML = `🔴 ${tituloTela}`;

    carregarCanaisAoVivo('canais-grid', nomeCategoriaParaAPI);
}

// ── 2. Lógica de Catálogo Aleatório Infinito (Home) ────────────────────────

async function buscarItensAleatorios(categoria) {
    const paginaAleatoria = Math.floor(Math.random() * 50) + 1; 
    let url = '';

    if (categoria === 'anime') url = `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&language=pt-BR&with_genres=16&page=${paginaAleatoria}`;
    else if (categoria === 'serie') url = `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&language=pt-BR&page=${paginaAleatoria}`;
    else url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&language=pt-BR&page=${paginaAleatoria}`;

    try {
        const resposta = await fetch(url);
        const dados = await resposta.json();
        return dados.results.map(item => ({
            id: item.id,
            poster: item.poster_path ? `https://image.tmdb.org/t/p/w200${item.poster_path}` : null
        })).filter(item => item.poster);
    } catch (erro) { return []; }
}

async function carregarCatalogo(categoria, divId) {
    const container = document.getElementById(divId);
    if (!container) return; 

    if (TMDB_API_KEY === "SUA_CHAVE_AQUI") {
        iniciarScrollInfinito(dadosDeTeste[categoria], categoria, container, true);
        return;
    }
    const itensIniciais = [...await buscarItensAleatorios(categoria), ...await buscarItensAleatorios(categoria)];
    iniciarScrollInfinito(itensIniciais, categoria, container, false);
}

function iniciarScrollInfinito(itensIniciais, categoria, container, usandoBackup) {
    itensIniciais.forEach(item => _adicionarImagemAoContainer(item, categoria, container));

    container.addEventListener('scroll', async () => {
        if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 400) {
            if (carregando[categoria]) return; 
            carregando[categoria] = true;

            if (usandoBackup) {
                const embaralhado = [...dadosDeTeste[categoria]].sort(() => 0.5 - Math.random());
                embaralhado.forEach(item => _adicionarImagemAoContainer(item, categoria, container));
            } else {
                const novosItens = await buscarItensAleatorios(categoria);
                novosItens.forEach(item => _adicionarImagemAoContainer(item, categoria, container));
            }
            carregando[categoria] = false;
        }
    });
}

function _adicionarImagemAoContainer(item, categoria, container) {
    const img = document.createElement('img');
    img.src = item.poster;
    img.className = 'poster';
    img.alt = `Capa ID ${item.id}`;
    img.onclick = () => abrirPlayer(categoria, item.id);
    container.appendChild(img);
}

window.rolarCarrossel = function(containerId, direcao) {
    const container = document.getElementById(containerId);
    if(container) container.scrollBy({ left: direcao * (container.clientWidth * 0.7), behavior: 'smooth' });
};

// ── 3. SISTEMA DE PESQUISA (TMDB e Inteligência Artificial) ────────────────

const searchInput = document.getElementById('search-input');
const searchSection = document.getElementById('search-section');
const searchResults = document.getElementById('search-results');
const mainContent = document.getElementById('main-content');
const searchTitle = document.getElementById('search-title');
let timeoutBusca;

if(searchInput) {
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        clearTimeout(timeoutBusca);
        if (query.length === 0) { 
            searchSection.style.display = 'none'; 
            if(mainContent) mainContent.style.display = 'block'; 
            return; 
        }
        timeoutBusca = setTimeout(() => { realizarPesquisaTMDB(query); }, 500); 
    });
}



async function realizarPesquisaTMDB(query) {
    if(searchSection) searchSection.style.display = 'block'; 
    if(mainContent) mainContent.style.display = 'none';
    
    searchTitle.innerText = "Resultados da Pesquisa"; 
    searchResults.innerHTML = '<p style="color: var(--text-muted);">Buscando...</p>';
    try {
        const url = `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}&page=1&include_adult=false`;
        const resposta = await fetch(url);
        const dados = await resposta.json();
        const itens = dados.results.map(item => ({ id: item.id, poster: item.poster_path ? `https://image.tmdb.org/t/p/w200${item.poster_path}` : null, tipo: item.media_type })).filter(item => item.poster && (item.tipo === 'movie' || item.tipo === 'tv'));
        searchResults.innerHTML = '';
        if (itens.length === 0) { searchResults.innerHTML = `<p style="color: var(--text-muted);">Nenhum resultado encontrado.</p>`; return; }
        itens.forEach(item => renderizarItemPesquisa(item));
    } catch (erro) { searchResults.innerHTML = '<p style="color: var(--brand-color);">Ocorreu um erro ao buscar. Tente novamente.</p>'; }
}

async function buscarEAdicionarPosterDoTMDB(tituloExato) {
    try {
        const res = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&language=pt-BR&query=${encodeURIComponent(tituloExato)}&page=1`);
        const dados = await res.json();
        const item = dados.results.find(i => i.poster_path && (i.media_type === 'movie' || i.media_type === 'tv'));
        if (item) { renderizarItemPesquisa({ id: item.id, poster: `https://image.tmdb.org/t/p/w200${item.poster_path}`, tipo: item.media_type }); }
    } catch (e) { console.error(e); }
}

function renderizarItemPesquisa(item) {
    const img = document.createElement('img'); img.src = item.poster; img.className = 'poster'; img.alt = `Capa ID ${item.id}`;
    const categoriaCerta = item.tipo === 'tv' ? 'serie' : 'filme';
    img.onclick = () => abrirPlayer(categoriaCerta, item.id);
    searchResults.appendChild(img);
}

// ── 4. Embed Players e Funções de Episódios ────────────────────────────────

window.abrirPlayerCanal = function(embedUrl) {
    if(!embedUrl) { alert("Link de transmissão não encontrado."); return; }
    
    criarBotaoTelaCheia(); // Injeta o nosso botão de Forçar Tela Cheia
    
    const modal = document.getElementById('player-modal');
    modal.style.display = 'flex';
    
    const painelEp = document.getElementById('episodes-panel');
    if(painelEp) painelEp.style.display = 'none';

    const f = document.getElementById("PlayerContainer");
    f.innerHTML = `<iframe src="${embedUrl}" width="100%" height="100%" frameborder="0" allow="autoplay; fullscreen; encrypted-media; picture-in-picture" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true"></iframe>`;
};

function EmbedPlayer(t, i, s, e) {
    if (t === "filme" || t === "movie") { t = "filme"; s = ""; e = ""; } else { t = "serie"; }
    const f = document.getElementById("PlayerContainer");
    
    let u = `https://superflixapi.rest/${t}/${i}`;
    if (s) u += `/${s}`;
    if (e) u += `/${e}`;
    u += "#color:e50914#transparent";
    
    // Iframe atualizado com todas as tags oficiais de tela cheia que os navegadores exigem
    f.innerHTML = `<iframe src="${u}" width="100%" height="100%" frameborder="0" allow="autoplay; fullscreen; encrypted-media; picture-in-picture" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true"></iframe>`;
}

async function carregarTemporada(serieId, numTemporada) {
    const lista = document.getElementById('episodes-list');
    lista.innerHTML = '<p class="ep-loading">Carregando episódios...</p>';
    try {
        const res = await fetch(`https://api.themoviedb.org/3/tv/${serieId}/season/${numTemporada}?api_key=${TMDB_API_KEY}&language=pt-BR`);
        const dados = await res.json();
        estadoSerie.episodiosDaTemporada = dados.episodes || [];
        renderizarEpisodios(dados.episodes || []);
    } catch (e) { lista.innerHTML = '<p class="ep-loading">Erro ao carregar episódios.</p>'; }
}

function renderizarEpisodios(episodios) {
    const lista = document.getElementById('episodes-list'); lista.innerHTML = '';
    if (!episodios.length) { lista.innerHTML = '<p class="ep-loading">Nenhum episódio encontrado.</p>'; return; }
    
    episodios.forEach(ep => {
        const item = document.createElement('div');
        item.className = 'ep-item' + (ep.episode_number === estadoSerie.episodioAtual ? ' active' : '');
        item.dataset.ep = ep.episode_number;
        const thumb = ep.still_path ? `<img src="https://image.tmdb.org/t/p/w185${ep.still_path}" class="ep-thumb" alt="">` : `<div class="ep-thumb ep-thumb-empty"><span>${ep.episode_number}</span></div>`;
        item.innerHTML = `${thumb}<div class="ep-info"><p class="ep-title">Ep. ${ep.episode_number} — ${ep.name || 'Sem título'}</p><p class="ep-desc">${ep.overview || 'Sem descrição disponível.'}</p><p class="ep-meta">${ep.runtime ? ep.runtime + ' min' : ''} ${ep.air_date ? '· ' + ep.air_date : ''}</p></div>`;
        item.onclick = () => selecionarEpisodio(ep.episode_number);
        lista.appendChild(item);
    });
}

function selecionarEpisodio(numEp) {
    estadoSerie.episodioAtual = numEp; atualizarBotoesNavegacao(); renderizarEpisodios(estadoSerie.episodiosDaTemporada);
    EmbedPlayer('serie', estadoSerie.id, estadoSerie.temporadaAtual, numEp); atualizarInfoAtual();
    document.getElementById('player-modal').scrollTop = 0;
}

window.mudarTemporada = function(delta) {
    const nova = estadoSerie.temporadaAtual + delta;
    if (nova < 1 || nova > estadoSerie.totalTemporadas) return;
    estadoSerie.temporadaAtual = nova; estadoSerie.episodioAtual = 1;
    atualizarSeletorTemporada(); atualizarBotoesNavegacao(); carregarTemporada(estadoSerie.id, nova);
    EmbedPlayer('serie', estadoSerie.id, nova, 1); atualizarInfoAtual();
}

window.irParaTemporada = function(numTemporada) {
    estadoSerie.temporadaAtual = parseInt(numTemporada); estadoSerie.episodioAtual = 1;
    atualizarBotoesNavegacao(); carregarTemporada(estadoSerie.id, estadoSerie.temporadaAtual);
    EmbedPlayer('serie', estadoSerie.id, estadoSerie.temporadaAtual, 1); atualizarInfoAtual();
}

function atualizarSeletorTemporada() { document.getElementById('season-select').value = estadoSerie.temporadaAtual; }
function atualizarBotoesNavegacao() { document.getElementById('btn-prev-season').disabled = estadoSerie.temporadaAtual <= 1; document.getElementById('btn-next-season').disabled = estadoSerie.temporadaAtual >= estadoSerie.totalTemporadas; }
function atualizarInfoAtual() { document.getElementById('ep-current-info').textContent = `${estadoSerie.nomeSerie} · T${estadoSerie.temporadaAtual} E${estadoSerie.episodioAtual}`; }

async function inicializarPainelSerie(serieId) {
    estadoSerie.id = serieId; estadoSerie.temporadaAtual = 1; estadoSerie.episodioAtual = 1;
    const painelEp = document.getElementById('episodes-panel');
    if(painelEp) painelEp.style.display = 'flex';
    
    try {
        const res = await fetch(`https://api.themoviedb.org/3/tv/${serieId}?api_key=${TMDB_API_KEY}&language=pt-BR`);
        const dados = await res.json();
        estadoSerie.totalTemporadas = dados.number_of_seasons || 1; estadoSerie.nomeSerie = dados.name || 'Série';
        const sel = document.getElementById('season-select'); sel.innerHTML = '';
        for (let i = 1; i <= estadoSerie.totalTemporadas; i++) { const opt = document.createElement('option'); opt.value = i; opt.textContent = `Temporada ${i}`; sel.appendChild(opt); }
        sel.value = 1;
    } catch (e) { estadoSerie.totalTemporadas = 1; estadoSerie.nomeSerie = 'Série'; }
    atualizarBotoesNavegacao(); atualizarInfoAtual(); carregarTemporada(serieId, 1);
}

// Controle Inteligente do Modal que garante o botão de Tela Cheia em todas as aberturas
window.abrirPlayer = function(categoria, id_tmdb) {
    criarBotaoTelaCheia(); // Injeta o nosso botão de Forçar Tela Cheia
    
    document.getElementById('player-modal').style.display = 'flex';
    const painelEp = document.getElementById('episodes-panel');

    if (categoria === 'anime' || categoria === 'serie' || categoria === 'tv') {
        if(painelEp) painelEp.style.display = 'flex'; 
        EmbedPlayer('serie', id_tmdb, 1, 1); 
        inicializarPainelSerie(id_tmdb);
    } else {
        if(painelEp) painelEp.style.display = 'none'; 
        EmbedPlayer('filme', id_tmdb, '', '');
    }
}

window.fecharPlayer = function() {
    document.getElementById('player-modal').style.display = 'none';
    document.getElementById('PlayerContainer').innerHTML = '';
    const painelEp = document.getElementById('episodes-panel');
    if(painelEp) painelEp.style.display = 'none';
}

// ── 5. LÓGICA DA TELA DE FILMES (filmes.html) ──────────────────────────────
let paginaAtualFilmes = 1;
let generoAtualFilmes = '';
let carregandoGradeFilmes = false;

async function buscarFilmesPorGenero(generoId, pagina) {
    let url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&language=pt-BR&page=${pagina}`;
    if(generoId) url += `&with_genres=${generoId}`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        return data.results.map(item => ({
            id: item.id,
            poster: item.poster_path ? `https://image.tmdb.org/t/p/w200${item.poster_path}` : null
        })).filter(item => item.poster);
    } catch(e) { return []; }
}

window.carregarFilmesGrade = async function(generoId = '') {
    const container = document.getElementById('filmes-grid');
    if(!container) return; 

    generoAtualFilmes = generoId;
    paginaAtualFilmes = 1;
    container.innerHTML = '<div class="loading-msg">Buscando filmes...</div>';

    const filmes = await buscarFilmesPorGenero(generoAtualFilmes, paginaAtualFilmes);
    container.innerHTML = '';
    
    if(filmes.length === 0) {
        container.innerHTML = '<p class="loading-msg">Nenhum filme encontrado.</p>';
        return;
    }

    renderizarItensFilmes(filmes, container);
}

function renderizarItensFilmes(itens, container) {
    itens.forEach(item => {
        const img = document.createElement('img');
        img.src = item.poster;
        img.className = 'poster-filme'; 
        img.alt = `Capa ID ${item.id}`;
        img.onclick = () => abrirPlayer('filme', item.id);
        container.appendChild(img);
    });
}

window.mudarCategoriaFilme = function(generoId, botaoClicado, tituloTela) {
    const botoes = document.querySelectorAll('.categories-bar .cat-btn');
    botoes.forEach(btn => btn.classList.remove('active'));
    botaoClicado.classList.add('active');
    
    const h2Titulo = document.getElementById('titulo-categoria');
    if(h2Titulo) h2Titulo.innerHTML = `🎬 ${tituloTela}`;

    carregarFilmesGrade(generoId);
}

window.addEventListener('scroll', async () => {
    const container = document.getElementById('filmes-grid');
    if(!container) return; 
    
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500) {
        if(carregandoGradeFilmes) return;
        carregandoGradeFilmes = true;
        
        paginaAtualFilmes++;
        const novosFilmes = await buscarFilmesPorGenero(generoAtualFilmes, paginaAtualFilmes);
        renderizarItensFilmes(novosFilmes, container);
        
        carregandoGradeFilmes = false;
    }
});

// ── 6. LÓGICA DO VERSÍCULO ALEATÓRIO (Apenas index.html) ────────────────────
async function mostrarVersiculo() {
    const popup = document.getElementById('verse-popup');
    const refEl = document.getElementById('verse-ref');
    const textEl = document.getElementById('verse-text');

    if (!popup) return; 

    const versiculosSeguros = [
        { reference: "Salmos 23:1", text: "O Senhor é o meu pastor; de nada me faltará." },
        { reference: "Filipenses 4:13", text: "Tudo posso naquele que me fortalece." },
        { reference: "João 3:16", text: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito..." },
        { reference: "Josué 1:9", text: "Não to mandei eu? Esforça-te, e tem bom ânimo; não temas..." },
        { reference: "Provérbios 3:5", text: "Confia no Senhor de todo o teu coração, e não te estribes no teu próprio entendimento." }
    ];

    try {
        const res = await fetch('https://www.abibliadigital.com.br/api/verses/nvi/random');
        const data = await res.json();
        
        refEl.innerText = `${data.book.name} ${data.chapter}:${data.number}`;
        textEl.innerText = `"${data.text}"`;
    } catch (e) {
        const fallback = versiculosSeguros[Math.floor(Math.random() * versiculosSeguros.length)];
        refEl.innerText = fallback.reference;
        textEl.innerText = `"${fallback.text}"`;
    }

    setTimeout(() => { popup.classList.add('show'); }, 2500);
    setTimeout(() => { fecharVersiculo(); }, 15000);
}

window.fecharVersiculo = function() {
    const popup = document.getElementById('verse-popup');
    if(popup) popup.classList.remove('show');
}

// ── 7. INICIALIZADOR GLOBAL ────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    carregarCanaisAoVivo('canais-list'); 
    carregarCanaisAoVivo('canais-grid');
    carregarCatalogo('anime', 'animes-list');
    carregarCatalogo('serie', 'series-list'); 
    carregarCatalogo('filme', 'movies-list');
    
    carregarFilmesGrade('');
    mostrarVersiculo(); 
});