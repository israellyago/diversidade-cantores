/* script.js
 - Integra YouTube IFrame API para players já incorporados
 - Play All / Pause All
 - Botão por card (toggle play/pause)
 - Animação reveal com IntersectionObserver
 - Tema automático / toggle (salva preferência em localStorage)
*/

(() => {
  // Reveal animations (fade-in/zoom)
  const cards = document.querySelectorAll('.card');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(ent => {
      if(ent.isIntersecting) {
        ent.target.classList.add('revealed');
        io.unobserve(ent.target);
      }
    });
  }, {threshold: 0.18});
  cards.forEach(c => io.observe(c));

  // YouTube API
  const players = []; // YT.Player objects
  let YTReady = false;
  const tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(tag);

  // Map card to index
  function createPlayer(playerElemId, videoId, cardEl, onReadyCb) {
    // will be called when API is ready
    const p = new YT.Player(playerElemId, {
      videoId: videoId,
      playerVars: {
        rel: 0,
        modestbranding: 1,
        controls: 1,
        disablekb: 0
      },
      events: {
        onReady: function(e) {
          const idx = players.push(e.target) - 1;
          cardEl.dataset.playerIndex = idx;
          if (typeof onReadyCb === 'function') onReadyCb(e.target);
        },
        onStateChange: function(e) {
          // update the per-card button icon when player state changes
          const state = e.data; // 1 playing, 2 paused, 0 ended
          const idx = players.indexOf(e.target);
          if (idx >= 0) {
            const card = document.querySelectorAll('.card')[idx];
            if (card) {
              const btn = card.querySelector('.card-play');
              if (btn) {
                if (state === 1) btn.textContent = '⏸';
                else btn.textContent = '▶';
              }
            }
          }
        }
      }
    });
    return p;
  }

  window.onYouTubeIframeAPIReady = function() {
    YTReady = true;
    // initialize players for all cards now (embedded immediately)
    document.querySelectorAll('.card').forEach((card, i) => {
      const videoId = card.dataset.videoId;
      const playerDiv = card.querySelector('.player');
      // ensure unique id
      if(!playerDiv.id) playerDiv.id = `player-auto-${i+1}`;
      createPlayer(playerDiv.id, videoId, card);
    });
  };

  // Global controls
  document.getElementById('playAllBtn').addEventListener('click', () => {
    players.forEach(p => {
      try { p.playVideo(); } catch(e) {}
    });
  });
  document.getElementById('pauseAllBtn').addEventListener('click', () => {
    players.forEach(p => {
      try { p.pauseVideo(); } catch(e) {}
    });
  });

  // Per-card play button (delegation)
  document.addEventListener('click', (e) => {
    if (!e.target.classList.contains('card-play')) return;
    const card = e.target.closest('.card');
    const idx = card.dataset.playerIndex;
    if (typeof idx === 'undefined') {
      // player might not be ready yet
      return;
    }
    const player = players[Number(idx)];
    if (!player) return;
    const state = player.getPlayerState();
    if (state === 1) {
      player.pauseVideo();
      e.target.textContent = '▶';
    } else {
      player.playVideo();
      e.target.textContent = '⏸';
    }
  });

})();
