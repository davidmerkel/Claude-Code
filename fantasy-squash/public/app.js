const BUDGET = 100;
const MAX_PLAYERS = 6;

let allPlayers = { men: [], women: [] };
let team = [];
let activeTab = 'men';

async function init() {
  const res = await fetch('/api/players');
  allPlayers = await res.json();
  renderGrid();
  setupNav();
  setupTabs();
}

function setupNav() {
  document.querySelectorAll('[data-view]').forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.dataset.view;
      document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      document.getElementById(`view-${view}`).classList.add('active');
      document.querySelectorAll(`.nav-btn[data-view="${view}"]`).forEach(b => b.classList.add('active'));
      if (view === 'myteam') renderTeam();
    });
  });

  document.getElementById('clear-team').addEventListener('click', () => {
    team = [];
    renderTeam();
    renderGrid();
    updateBudgetBar();
  });
}

function setupTabs() {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeTab = tab.dataset.tab;
      renderGrid();
    });
  });
}

function budgetUsed() {
  return team.reduce((sum, p) => sum + p.price, 0);
}

function updateBudgetBar() {
  const used = budgetUsed();
  const pct = (used / BUDGET) * 100;
  document.getElementById('budget-used').textContent = used;
  document.getElementById('team-count').textContent = team.length;

  const fill = document.getElementById('budget-fill');
  fill.style.width = Math.min(pct, 100) + '%';
  fill.classList.remove('warning', 'danger');
  if (pct >= 90) fill.classList.add('danger');
  else if (pct >= 70) fill.classList.add('warning');
}

function renderGrid() {
  const grid = document.getElementById('player-grid');
  const players = allPlayers[activeTab];
  const used = budgetUsed();

  grid.innerHTML = players.map(p => {
    const isSelected = team.some(t => t.id === p.id);
    const canAfford = used + p.price <= BUDGET;
    const teamFull = team.length >= MAX_PLAYERS;
    const isDisabled = !isSelected && (!canAfford || teamFull);

    return `
      <div class="player-card ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}"
           data-id="${p.id}" onclick="togglePlayer('${p.id}')">
        <span class="selected-badge">IN TEAM</span>
        <span class="player-rank">#${p.ranking}</span>
        <span class="player-flag">${p.flag}</span>
        <div class="player-name">${p.name}</div>
        <div class="player-country">${p.country}</div>
        <div class="player-stats">
          <div class="player-pts">PSA Pts <span>${p.pts.toLocaleString()}</span></div>
          <div class="player-price">${p.price}pts</div>
        </div>
      </div>
    `;
  }).join('');
}

function togglePlayer(id) {
  const inTeam = team.findIndex(p => p.id === id);
  if (inTeam !== -1) {
    team.splice(inTeam, 1);
  } else {
    const player = [...allPlayers.men, ...allPlayers.women].find(p => p.id === id);
    if (!player) return;
    if (team.length >= MAX_PLAYERS) return;
    if (budgetUsed() + player.price > BUDGET) return;
    team.push(player);
  }
  renderGrid();
  updateBudgetBar();
}

function renderTeam() {
  const grid = document.getElementById('team-grid');
  const empty = document.getElementById('empty-team');
  const summary = document.getElementById('team-summary');
  const actions = document.getElementById('team-actions');
  const subtitle = document.getElementById('team-subtitle');

  if (team.length === 0) {
    grid.innerHTML = '';
    empty.classList.remove('hidden');
    summary.classList.add('hidden');
    actions.classList.add('hidden');
    subtitle.textContent = 'Select players from the Players tab to build your squad.';
    return;
  }

  empty.classList.add('hidden');
  summary.classList.remove('hidden');
  actions.classList.remove('hidden');

  const totalPts = team.reduce((s, p) => s + p.pts, 0);
  document.getElementById('summary-count').textContent = `${team.length} / ${MAX_PLAYERS}`;
  document.getElementById('summary-budget').textContent = `${budgetUsed()} / ${BUDGET} pts`;
  document.getElementById('summary-pts').textContent = totalPts.toLocaleString();
  subtitle.textContent = `Your squad of ${team.length} player${team.length !== 1 ? 's' : ''}.`;

  grid.innerHTML = team.map(p => `
    <div class="team-card">
      <span class="team-card-flag">${p.flag}</span>
      <div class="team-card-info">
        <div class="team-card-name">${p.name}</div>
        <div class="team-card-meta">${p.country} · #${p.ranking} ${p.id.startsWith('m') ? "Men's" : "Women's"} · ${p.pts.toLocaleString()} pts</div>
      </div>
      <div class="team-card-price">${p.price}pts</div>
      <button class="remove-btn" onclick="removePlayer('${p.id}')" title="Remove">×</button>
    </div>
  `).join('');
}

function removePlayer(id) {
  team = team.filter(p => p.id !== id);
  renderTeam();
  renderGrid();
  updateBudgetBar();
}

init();
