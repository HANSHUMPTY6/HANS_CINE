<div align="center">

<br/>

```
██╗  ██╗ █████╗ ███╗   ██╗███████╗     ██████╗██╗███╗   ██╗███████╗
██║  ██║██╔══██╗████╗  ██║██╔════╝    ██╔════╝██║████╗  ██║██╔════╝
███████║███████║██╔██╗ ██║███████╗    ██║     ██║██╔██╗ ██║█████╗  
██╔══██║██╔══██║██║╚██╗██║╚════██║    ██║     ██║██║╚██╗██║██╔══╝  
██║  ██║██║  ██║██║ ╚████║███████║    ╚██████╗██║██║ ╚████║███████╗
╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝     ╚═════╝╚═╝╚═╝  ╚═══╝╚══════╝
```

<br/>

![Version](https://img.shields.io/badge/versão-2.0-e50914?style=for-the-badge&logo=github&logoColor=white)
![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![TMDB](https://img.shields.io/badge/TMDB_API-01D277?style=for-the-badge&logo=themoviedatabase&logoColor=white)
![License](https://img.shields.io/badge/licença-MIT-blue?style=for-the-badge)

<br/>

> ### 🎬 *Sua plataforma de streaming completa — Filmes, Séries, Animes e Canais ao Vivo.*
> ### Totalmente gratuito. Sem anúncios. Sem cadastro.

<br/>

---

</div>

<br/>

## 📸 Preview

<div align="center">

| 🏠 Página Inicial | 📡 Ao Vivo | 🎬 Filmes |
|:-:|:-:|:-:|
| Banner dinâmico com destaques aleatórios | Grade de canais por categoria | Catálogo infinito com filtro por gênero |

</div>

<br/>

---

## ✨ Funcionalidades

<br/>

### 🏠 Página Inicial
- **Banner Hero Dinâmico** — a cada visita, um destaque diferente é exibido com backdrop, título e sinopse em português, trocando automaticamente a cada 8 segundos
- **Dots de navegação** — bolinhas clicáveis para navegar entre os destaques do banner
- **Carrosséis infinitos** — Canais em Destaque, Animes, Séries e Filmes com scroll horizontal e carregamento automático
- **Animação de intro** — splash screen profissional com logo animada, partículas e barra de progresso ao entrar no site
- **Pop-up de versículo bíblico** — versículo aleatório do dia exibido com elegância

### 📡 Ao Vivo
- **Canais em tempo real** via API Rei dos Embeds
- **Filtro por categoria**: Abertos, Esportes, Desenhos, Documentários, Filmes, Notícias, Variedades, Infantil
- **Logo de cada canal** com fallback automático

### 🎬 Filmes
- **Catálogo completo** carregado pela API do TMDB
- **Filtro por gênero**: Ação, Romance, Suspense, Comédia, Terror, Ficção Científica, Animação
- **Scroll infinito** — novos filmes carregam automaticamente ao chegar no final da página

### ▶️ Player
- **Player embutido** via SuperFlixAPI para filmes e séries
- **Painel de episódios** para séries — seleção de temporada, lista de episódios com thumbnail e sinopse
- **Botão de tela cheia** nativo para todos os navegadores
- **Modal imersivo** com backdrop blur

### 📱 Mobile First
- **Navegação bottom bar** estilo app nativo no celular
- **Layout 100% responsivo** para telas de 320px a 4K
- Breakpoints para mobile (600px), tablet (900px) e desktop

<br/>

---

## 🛠️ Tecnologias

<br/>

| Tecnologia | Uso |
|---|---|
| `HTML5` | Estrutura das páginas |
| `CSS3` | Estilização, animações e responsividade |
| `JavaScript (Vanilla)` | Toda a lógica do site, sem frameworks |
| `TMDB API` | Catálogo de filmes, séries e metadados |
| `Rei dos Embeds API` | Canais ao vivo |
| `SuperFlixAPI` | Player de filmes e séries |
| `Google Fonts` | Bebas Neue + DM Sans |
| `Canvas API` | Partículas animadas na splash screen |

<br/>

---

## 📁 Estrutura do Projeto

```
HANS_CINE/
│
├── 📄 index.html        # Página principal (hero + carrosséis)
├── 📄 aovivo.html       # Canais ao vivo
├── 📄 filmes.html       # Catálogo de filmes
└── 📄 app.js            # Toda a lógica JavaScript
```

<br/>

---

## 🚀 Como usar

### Opção 1 — Abrir direto no navegador

```bash
# Clone o repositório
git clone https://github.com/HANSHUMPTY6/HANS_CINE.git

# Entre na pasta
cd HANS_CINE

# Abra o index.html no seu navegador
start index.html       # Windows
open index.html        # macOS
xdg-open index.html    # Linux
```

### Opção 2 — Servidor local (recomendado)

```bash
# Com Python
python -m http.server 8000

# Com Node.js (npx)
npx serve .

# Acesse no navegador
http://localhost:8000
```

<br/>

---

## 🎨 Design System

```css
/* Paleta de cores */
--bg:        #0a0a0f   /* Fundo principal     */
--surface:   #111118   /* Superfície          */
--card:      #16161f   /* Cards               */
--red:       #e50914   /* Cor de destaque     */
--text:      #f0f0f0   /* Texto principal     */
--muted:     #888888   /* Texto secundário    */

/* Tipografia */
Bebas Neue   →  Títulos e logo
DM Sans      →  Corpo e UI
```

<br/>

---

## 📡 APIs utilizadas

| API | Documentação | Gratuita |
|---|---|:-:|
| TMDB (The Movie Database) | [themoviedb.org/documentation](https://www.themoviedb.org/documentation/api) | ✅ |
| Rei dos Embeds | [reidosembeds.com](https://reidosembeds.com) | ✅ |
| SuperFlixAPI | — | ✅ |
| A Bíblia Digital | [abibliadigital.com.br](https://www.abibliadigital.com.br) | ✅ |

<br/>

---

## 📱 Responsividade

| Dispositivo | Breakpoint | Status |
|---|---|:-:|
| 📱 Mobile pequeno | `< 380px` | ✅ |
| 📱 Mobile | `< 600px` | ✅ |
| 📟 Tablet | `< 900px` | ✅ |
| 🖥️ Desktop | `≥ 900px` | ✅ |
| 🖥️ Wide / 4K | `≥ 1400px` | ✅ |

<br/>

---

## 🔮 Roadmap

- [ ] 🔍 Página de busca dedicada com resultados em grade
- [ ] ❤️ Lista de favoritos salva localmente
- [ ] 🌙 Modo claro / escuro
- [ ] 🔔 Notificações de novos lançamentos
- [ ] 📺 Suporte a Séries com página dedicada
- [ ] 🌐 PWA — instalar como app no celular

<br/>

---

## 👨‍💻 Desenvolvedor

<div align="center">

<br/>

**Feito com ❤️ por Hans**

<br/>

[![Telegram](https://img.shields.io/badge/@hansyt-Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/hansyt)
[![Canal Privado](https://img.shields.io/badge/Canal_Privado-Entrar-e50914?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/+SbR0Ih6pVDE2NTQx)

<br/>

> *"Tudo posso naquele que me fortalece." — Filipenses 4:13*

<br/>

</div>

---

<div align="center">

<br/>

**⭐ Se esse projeto te ajudou, deixa uma estrela no repositório!**

<br/>

![Footer](https://img.shields.io/badge/HANS__CINE-Streaming_Ilimitado-e50914?style=for-the-badge)

</div>
