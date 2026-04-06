let currentMonster = null;
let currentLevel = "";
// --- SETTINGS HELPER FUNCTIONS ---

function calcBonus(scoreId, bonusId) {
    const score = parseInt(document.getElementById(scoreId).value);
    const bonusField = document.getElementById(bonusId);
    if (!isNaN(score)) {
        bonusField.value = Math.floor((score - 10) / 2);
    } else {
        bonusField.value = "";
    }
}

function addEntry(containerId, name = '', description = '') {
    const container = document.getElementById(containerId);
    const entry = document.createElement('div');
    entry.className = 'form-group';
    entry.style.cssText = 'border: 1px solid #ddd; padding: 10px; border-radius: 4px; margin-bottom: 8px;';
    entry.innerHTML = `
        <input type="text" placeholder="Name" value="${name}" style="margin-bottom: 5px;">
        <textarea placeholder="Description" style="min-height: 60px;">${description}</textarea>
        <button type="button" onclick="this.parentElement.remove()" style="background: #e74c3c; padding: 4px 10px; font-size: 12px; margin-top: 5px;">Remove</button>
    `;
    container.appendChild(entry);
}

// Get BASE_STATS (custom or default)
function getBaseStats() {
  const custom = localStorage.getItem("dc20_base_stats_custom");
  if (custom) {
    return JSON.parse(custom);
  }
  return DEFAULT_BASE_STATS;
}

// Get MODIFIERS (custom or default)
function getModifiers() {
  const custom = localStorage.getItem("dc20_modifiers_custom");
  if (custom) {
    return JSON.parse(custom);
  }
  return DEFAULT_MODIFIERS;
}

// Save BASE_STATS custom values
function saveBaseStatsCustom(stats) {
  localStorage.setItem("dc20_base_stats_custom", JSON.stringify(stats));
  alert("BASE_STATS saved!");
}

// Save MODIFIERS custom values
function saveModifiersCustom(mods) {
  localStorage.setItem("dc20_modifiers_custom", JSON.stringify(mods));
  alert("MODIFIERS saved!");
}

// Reset BASE_STATS to defaults
function resetBaseStats() {
  if (confirm("Reset BASE_STATS to default values? This cannot be undone.")) {
    localStorage.removeItem("dc20_base_stats_custom");
    renderBaseStatsEditor();
    alert("BASE_STATS reset to defaults!");
  }
}

// Reset MODIFIERS to defaults
function resetModifiers() {
  if (confirm("Reset MODIFIERS to default values? This cannot be undone.")) {
    localStorage.removeItem("dc20_modifiers_custom");
    renderModifiersEditor();
    alert("MODIFIERS reset to defaults!");
  }
}

// Render BASE_STATS editor table
function renderBaseStatsEditor() {
  const container = document.getElementById("baseStatsEditor");
  if (!container) return;
  const stats = getBaseStats();
  const levels = Object.keys(stats);
  const statKeys = ["hp", "pd", "ad", "attack", "damage", "saveDC", "speed", "prime", "cm", "totalFeaturePower"];

  let html = '<table class="reference-table"><thead><tr><th>Level</th>';
  statKeys.forEach(key => html += `<th>${key.toUpperCase()}</th>`);
  html += '</tr></thead><tbody>';

  levels.forEach(level => {
    html += `<tr><td><strong>${level}</strong></td>`;
    statKeys.forEach(key => {
      html += `<td><input type="number" step="0.5" value="${stats[level][key]}" onchange="updateBaseStat('${level}','${key}',this.value)" style="width:60px;"></td>`;
    });
    html += '</tr>';
  });

  html += '</tbody></table>';
  container.innerHTML = html;
}

// Update individual BASE_STATS value
function updateBaseStat(level, key, value) {
  const stats = getBaseStats();
  stats[level][key] = parseFloat(value);
  saveBaseStatsCustom(stats);
}

// Render MODIFIERS editor table
function renderModifiersEditor() {
  const container = document.getElementById("modifiersEditor");
  if (!container) return;
  const mods = getModifiers();
  const levels = Object.keys(mods);
  const statKeys = ["hp", "pd", "ad", "attack", "damage", "saveDC", "speed", "prime", "cm", "totalFeaturePower"];

  let html = '';

  levels.forEach(level => {
    const difficulties = Object.keys(mods[level]);

    html += `<details style="margin-bottom:15px;"><summary><strong>${level}</strong> (${difficulties.length} difficulties)</summary>`;
    html += '<div style="margin-top:10px;">';

    difficulties.forEach(diff => {
      html += `<div style="margin-bottom:10px;"><strong>${diff}</strong></div>`;
      html += '<table class="reference-table" style="font-size:12px;"><tr>';
      statKeys.forEach(key => {
        html += `<th>${key.toUpperCase()}</th>`;
      });
      html += '</tr><tr>';
      statKeys.forEach(key => {
        html += `<td><input type="number" step="0.5" value="${mods[level][diff][key]}" onchange="updateModifier('${level}','${diff}','${key}',this.value)" style="width:50px;"></td>`;
      });
      html += '</tr></table>';
    });

    html += '</div></details>';
  });

  container.innerHTML = html;
}

// Update individual MODIFIER value
function updateModifier(level, diff, key, value) {
  const mods = getModifiers();
  mods[level][diff][key] = parseFloat(value);
  saveModifiersCustom(mods);
}
// --- CORE LOGIC FUNCTIONS ---

// Tab Navigation
function switchTab(id) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => {
    c.classList.remove('active');
    c.style.display = 'none'; // Force hide
  });
  
  document.querySelector(`.tab[onclick="switchTab('${id}')"]`).classList.add('active');
  const activeContent = document.getElementById(id);
  activeContent.classList.add('active');
  activeContent.style.display = 'block'; // Force show
}

// Convert 5e Stats to DC20
function convertMonster() {
  // Get basic fields
  const name = document.getElementById("mName").value;
  const cr = document.getElementById("mCR").value;
  const hp5e = document.getElementById("mHP").value;
  const type = document.getElementById("mType").value;
  const size = document.getElementById("mSize").value;
  const alignment = document.getElementById("mAlignment").value;
  const speed = document.getElementById("mSpeed").value;
  const skills = document.getElementById("mSkills").value;
  const vulnerabilities = document.getElementById("mVulnerabilities").value;
  const immunities = document.getElementById("mImmunities").value;
  const senses = document.getElementById("mSenses").value;
  const languages = document.getElementById("mLanguages").value;
  const gear = document.getElementById("mGear").value;

  // Get ability scores and bonuses
  const str = parseInt(document.getElementById("mSTR").value);
  const dex = parseInt(document.getElementById("mDEX").value);
  const con = parseInt(document.getElementById("mCON").value);
  const intScore = parseInt(document.getElementById("mINT").value);
  const wis = parseInt(document.getElementById("mWIS").value);
  const cha = parseInt(document.getElementById("mCHA").value);

  // Use score to calculate bonus, or fall back to manually entered bonus
  const strMod = !isNaN(str) ? Math.floor((str - 10) / 2) : parseInt(document.getElementById("mSTRBonus").value) || 0;
  const dexMod = !isNaN(dex) ? Math.floor((dex - 10) / 2) : parseInt(document.getElementById("mDEXBonus").value) || 0;
  const conMod = !isNaN(con) ? Math.floor((con - 10) / 2) : parseInt(document.getElementById("mCONBonus").value) || 0;
  const intMod = !isNaN(intScore) ? Math.floor((intScore - 10) / 2) : parseInt(document.getElementById("mINTBonus").value) || 0;
  const wisMod = !isNaN(wis) ? Math.floor((wis - 10) / 2) : parseInt(document.getElementById("mWISBonus").value) || 0;
  const chaMod = !isNaN(cha) ? Math.floor((cha - 10) / 2) : parseInt(document.getElementById("mCHABonus").value) || 0;

  // Validate - only name is required now
  if (!name) {
    alert("Please enter a monster name.");
    return;
  }

  // Collect dynamic entries
  function getEntries(containerId) {
    const container = document.getElementById(containerId);
    const entries = [];
    container.querySelectorAll('.form-group').forEach(entry => {
      const inputs = entry.querySelectorAll('input, textarea');
      if (inputs.length >= 2) {
        const entryName = inputs[0].value.trim();
        const entryDesc = inputs[1].value.trim();
        if (entryName || entryDesc) {
          entries.push({ name: entryName, description: entryDesc });
        }
      }
    });
    return entries;
  }

  const traits = getEntries('traitsContainer');
  const actions = getEntries('actionsContainer');
  const bonusActions = getEntries('bonusActionsContainer');
  const reactions = getEntries('reactionsContainer');
  const bossActions = getEntries('bossActionsContainer');
  const lore = getEntries('loreContainer');

  // Determine Level from CR
  currentLevel = CR_TO_LEVEL[cr] || "Level 1";
  document.getElementById("resLevel").innerText = currentLevel;
  document.getElementById("resName").innerText = name;

  // Populate new result fields
  document.getElementById("resType").innerText = type || "—";
  document.getElementById("resSize").innerText = size || "—";
  document.getElementById("resAlignment").innerText = alignment || "—";
  document.getElementById("resSpeedText").innerText = speed || "—";

  // Show/hide optional fields
  function showField(id, value) {
    const el = document.getElementById(id);
    if (value) {
      el.style.display = "block";
      el.querySelector("span").innerText = value;
    } else {
      el.style.display = "none";
    }
  }

  showField("resSkills", skills);
  showField("resVulnerabilities", vulnerabilities);
  showField("resImmunities", immunities);
  showField("resSenses", senses);
  showField("resLanguages", languages);

  // Populate dynamic sections
  function showEntries(sectionId, listId, entries) {
    const section = document.getElementById(sectionId);
    const list = document.getElementById(listId);
    if (entries && entries.length > 0) {
      section.style.display = "block";
      list.innerHTML = entries.map(e => `
        <div class="ability-item">
          <div class="ability-name">${e.name}</div>
          <div>${e.description}</div>
        </div>
      `).join('');
    } else {
      section.style.display = "none";
    }
  }

  showEntries("resTraits", "resTraitsList", traits);
  showEntries("resActions", "resActionsList", actions);
  showEntries("resBonusActions", "resBonusActionsList", bonusActions);
  showEntries("resReactions", "resReactionsList", reactions);
  showEntries("resBossActions", "resBossActionsList", bossActions);
  showEntries("resLore", "resLoreList", lore);

  // Calculate DC20 Attributes
  const might = Math.floor((strMod + conMod) / 2);
  const agility = dexMod;
  const intelligence = Math.floor((intMod + wisMod) / 2);
  const charisma = chaMod;

  // Get Base Stats
  const base = getBaseStats()[currentLevel] || {hp:10,pd:12,ad:12,attack:4,damage:2,saveDC:14,speed:5,prime:0,cm:0,totalFeaturePower:0};

  document.getElementById("resPrime").innerText = base.prime;
  document.getElementById("resCM").innerText = base.cm;
  document.getElementById("resTotalFeaturePower").innerText = base.totalFeaturePower;

  // Display Attributes
  document.getElementById("resMight").innerText = might;
  document.getElementById("resAgility").innerText = agility;
  document.getElementById("resIntelligence").innerText = intelligence;
  document.getElementById("resCharisma").innerText = charisma;

  // Set up difficulty dropdown and calculate stats
  applyDifficultyModifier();

  // Create currentMonster object
  currentMonster = {
    name: name,
    cr: cr,
    level: currentLevel,
    type: type,
    size: size,
    alignment: alignment,
    speed: speed,
    skills: skills,
    vulnerabilities: vulnerabilities,
    immunities: immunities,
    senses: senses,
    languages: languages,
    gear: gear,
    traits: traits,
    actions: actions,
    bonusActions: bonusActions,
    reactions: reactions,
    bossActions: bossActions,
    lore: lore,
    original5e_hp: hp5e || "",
    original5e_str: isNaN(str) ? "" : str,
    original5e_dex: isNaN(dex) ? "" : dex,
    original5e_con: isNaN(con) ? "" : con,
    original5e_int: isNaN(intScore) ? "" : intScore,
    original5e_wis: isNaN(wis) ? "" : wis,
    original5e_cha: isNaN(cha) ? "" : cha,
    original5e_strMod: strMod,
    original5e_dexMod: dexMod,
    original5e_conMod: conMod,
    original5e_intMod: intMod,
    original5e_wisMod: wisMod,
    original5e_chaMod: chaMod,
    dc20_hp: parseInt(document.getElementById("resHP").innerText),
    dc20_pd: parseInt(document.getElementById("resPD").innerText),
    dc20_ad: parseInt(document.getElementById("resAD").innerText),
    dc20_attack: parseInt(document.getElementById("resAttack").innerText),
    dc20_damage: parseFloat(document.getElementById("resDamage").innerText),
    dc20_saveDC: parseInt(document.getElementById("resSaveDC").innerText),
    dc20_speed: parseInt(document.getElementById("resSpeed").innerText),
    dc20_might: might,
    dc20_agility: agility,
    dc20_intelligence: intelligence,
    dc20_charisma: charisma,
    dc20_prime: base.prime,
    dc20_cm: base.cm,
    dc20_totalFeaturePower: base.totalFeaturePower,
    difficulty: "Medium"
  };

  document.getElementById("resultArea").style.display = "block";
}

// Apply Difficulty Modifier
function applyDifficultyModifier() {
  if (!currentLevel) {
    console.log("Cannot apply modifier: no level set");
    return;
  }

  const select = document.getElementById("difficultySelect");
  
  // Capture current selection BEFORE modifying dropdown
  let currentSelection = select.value;
  if (!currentSelection) currentSelection = "Medium";

  // Define options based on Level
  let options = [];
  if (currentLevel === "Novice" || currentLevel === "Level 0") {
    options = ["Easy", "Medium", "Hard"];
  } else {
    options = ["Minion", "Easy", "Medium", "Hard", "Boss", "Solo"];
  }

  // Check if options list has changed
  const currentOptions = Array.from(select.options).map(opt => opt.value);
  const optionsChanged = JSON.stringify(currentOptions) !== JSON.stringify(options);

  // Rebuild dropdown only if options changed
  if (optionsChanged) {
    select.innerHTML = "";
    options.forEach(opt => {
      const el = document.createElement("option");
      el.value = opt;
      el.innerText = opt;
      select.appendChild(el);
    });
    
    // If previous selection is no longer valid, default to Medium
    if (!options.includes(currentSelection)) {
      currentSelection = "Medium";
    }
    select.value = currentSelection;
  }

  // Calculate stats based on current selection
  const diff = select.value;
  
  // Construct the Modifier Key
  let modKey = diff;
  if (currentLevel === "Novice") {
    if (diff === "Easy") modKey = "N-Easy";
    if (diff === "Medium") modKey = "N-Medium";
    if (diff === "Hard") modKey = "N-Hard";
  } else if (currentLevel === "Level 0") {
    if (diff === "Easy") modKey = "0-Easy";
    if (diff === "Medium") modKey = "0-Medium";
    if (diff === "Hard") modKey = "0-Hard";
  } else {
    const lvlNum = currentLevel.split(" ")[1];
    if (diff === "Minion") modKey = `${lvlNum}-Minion`;
    if (diff === "Easy") modKey = `${lvlNum}-Easy`;
    if (diff === "Medium") modKey = `${lvlNum}-Medium`;
    if (diff === "Hard") modKey = `${lvlNum}-Hard`;
    if (diff === "Boss") modKey = `${lvlNum}-Boss`;
    if (diff === "Solo") modKey = `${lvlNum}-Solo`;
  }

  // Get Base Stats (custom or default)
  const base = getBaseStats()[currentLevel] || { hp: 10, pd: 12, ad: 12, attack: 4, damage: 2, saveDC: 14, speed: 5 };
  
  // Get Modifiers (custom or default)
  const mod = getModifiers()[currentLevel]?.[modKey] || { hp: 0, pd: 0, ad: 0, attack: 0, damage: 0, saveDC: 0, speed: 0 };

  // Calculate
  const newHp = base.hp + (mod.hp || 0);
  const newPd = base.pd + (mod.pd || 0);
  const newAd = base.ad + (mod.ad || 0);
  const newAttack = base.attack + (mod.attack || 0);
  const newDamage = base.damage + (mod.damage || 0);
  const newSaveDC = base.saveDC + (mod.saveDC || 0);
  const newSpeed = base.speed + (mod.speed || 0);
  const newPrime = base.prime + (mod.prime || 0);
    const newCM = base.cm + (mod.cm || 0);
    const newTotalFeaturePower = base.totalFeaturePower + (mod.totalFeaturePower || 0);

  // Update Display
  document.getElementById("resHP").innerText = newHp;
  document.getElementById("resPD").innerText = newPd;
  document.getElementById("resAD").innerText = newAd;
  document.getElementById("resAttack").innerText = newAttack;
  document.getElementById("resDamage").innerText = newDamage;
  document.getElementById("resSaveDC").innerText = newSaveDC;
  document.getElementById("resSpeed").innerText = newSpeed;
  document.getElementById("resPrime").innerText = newPrime;
    document.getElementById("resCM").innerText = newCM;
    document.getElementById("resTotalFeaturePower").innerText = newTotalFeaturePower;

  // Update currentMonster state
  if (currentMonster) {
    currentMonster.difficulty = diff;
    currentMonster.dc20_hp = newHp;
    currentMonster.dc20_pd = newPd;
    currentMonster.dc20_ad = newAd;
    currentMonster.dc20_attack = newAttack;
    currentMonster.dc20_damage = newDamage;
    currentMonster.dc20_saveDC = newSaveDC;
    currentMonster.dc20_speed = newSpeed;
    currentMonster.dc20_prime = newPrime;
    currentMonster.dc20_cm = newCM;
    currentMonster.dc20_totalFeaturePower = newTotalFeaturePower;
  }

  console.log(`Applied ${diff} (${modKey}) modifier: HP=${newHp}`);
}
// --- SAVE/LOAD/LIBRARY FUNCTIONS ---

// Save Monster to Library
async function saveMonster() {
  if (!currentMonster) {
    alert("Please convert a monster first.");
    return;
  }

  try {
    const { collection, query, where, getDocs, addDoc, updateDoc } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    const monstersRef = collection(window.db, "monsters");

    // Check for existing entry
    const q = query(monstersRef, 
      where("name", "==", currentMonster.name.toLowerCase().trim()),
      where("cr", "==", currentMonster.cr)
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      if (confirm(`"${currentMonster.name}" (CR ${currentMonster.cr}) exists. Update?`)) {
        const docRef = snapshot.docs[0].ref;
        await updateDoc(docRef, currentMonster);
        alert("Updated!");
      } else {
        return;
      }
    } else {
      await addDoc(monstersRef, currentMonster);
      alert("Saved!");
    }

    loadSavedMonsters();
    switchTab('library');

  } catch (e) {
    console.error("Save Error:", e);
    alert("Error saving: " + e.message);
  }
}

// Load Saved Monsters List
async function loadSavedMonsters() {
  const list = document.getElementById("savedList");
  list.innerHTML = "<li>Loading...</li>";

  try {
    const { collection, getDocs } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    const snapshot = await getDocs(collection(window.db, "monsters"));

    if (snapshot.empty) {
      list.innerHTML = "<li>No monsters saved yet.</li>";
      return;
    }

    list.innerHTML = "";
    snapshot.forEach(doc => {
      const m = doc.data();
      const id = doc.id;
      const li = document.createElement("li");
      li.className = "saved-item";
      li.innerHTML = `<strong>${m.name}</strong> (${m.level}, ${m.difficulty})<button class="delete-btn" onclick="deleteMonster('${id}')">Delete</button>`;
      li.onclick = (e) => {
        if (e.target.className !== 'delete-btn') {
          loadMonster(m);
        }
      };
      list.appendChild(li);
    });

  } catch (e) {
    console.error("Load Error:", e);
    list.innerHTML = "<li>Error loading monsters. Check console.</li>";
  }
}

// Load Specific Monster
function loadMonster(m) {
  if (!m) return;

  // Fill basic fields
  document.getElementById("mName").value = m.name || "";
  document.getElementById("mCR").value = m.cr || "0";
  document.getElementById("mHP").value = m.original5e_hp || "";
  document.getElementById("mType").value = m.type || "";
  document.getElementById("mSize").value = m.size || "";
  document.getElementById("mAlignment").value = m.alignment || "";
  document.getElementById("mSpeed").value = m.speed || "";
  document.getElementById("mSkills").value = m.skills || "";
  document.getElementById("mVulnerabilities").value = m.vulnerabilities || "";
  document.getElementById("mImmunities").value = m.immunities || "";
  document.getElementById("mSenses").value = m.senses || "";
  document.getElementById("mLanguages").value = m.languages || "";
  document.getElementById("mGear").value = m.gear || "";

  // Fill ability scores and bonuses
  document.getElementById("mSTR").value = m.original5e_str || "";
  document.getElementById("mDEX").value = m.original5e_dex || "";
  document.getElementById("mCON").value = m.original5e_con || "";
  document.getElementById("mINT").value = m.original5e_int || "";
  document.getElementById("mWIS").value = m.original5e_wis || "";
  document.getElementById("mCHA").value = m.original5e_cha || "";
  document.getElementById("mSTRBonus").value = m.original5e_strMod || "";
  document.getElementById("mDEXBonus").value = m.original5e_dexMod || "";
  document.getElementById("mCONBonus").value = m.original5e_conMod || "";
  document.getElementById("mINTBonus").value = m.original5e_intMod || "";
  document.getElementById("mWISBonus").value = m.original5e_wisMod || "";
  document.getElementById("mCHABonus").value = m.original5e_chaMod || "";

  // Restore dynamic entries
  function loadEntries(containerId, entries) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    if (entries && entries.length > 0) {
      entries.forEach(entry => addEntry(containerId, entry.name, entry.description));
    }
  }

  loadEntries('traitsContainer', m.traits);
  loadEntries('actionsContainer', m.actions);
  loadEntries('bonusActionsContainer', m.bonusActions);
  loadEntries('reactionsContainer', m.reactions);
  loadEntries('bossActionsContainer', m.bossActions);
  loadEntries('loreContainer', m.lore);

  // Fill Result Display
  document.getElementById("resName").innerText = m.name;
  document.getElementById("resLevel").innerText = m.level;
  document.getElementById("resHP").innerText = m.dc20_hp || "";
  document.getElementById("resPD").innerText = m.dc20_pd || "";
  document.getElementById("resAD").innerText = m.dc20_ad || "";
  document.getElementById("resAttack").innerText = m.dc20_attack || "";
  document.getElementById("resDamage").innerText = m.dc20_damage || "";
  document.getElementById("resSaveDC").innerText = m.dc20_saveDC || "";
  document.getElementById("resSpeed").innerText = m.dc20_speed || "";
  document.getElementById("resMight").innerText = m.dc20_might || "";
  document.getElementById("resAgility").innerText = m.dc20_agility || "";
  document.getElementById("resIntelligence").innerText = m.dc20_intelligence || "";
  document.getElementById("resCharisma").innerText = m.dc20_charisma || "";
  document.getElementById("resPrime").innerText = m.dc20_prime || "";
  document.getElementById("resCM").innerText = m.dc20_cm || "";
  document.getElementById("resTotalFeaturePower").innerText = m.dc20_totalFeaturePower || "";

  // Restore Difficulty
  const savedDiff = m.difficulty || "Medium";
  const select = document.getElementById("difficultySelect");
  const validOptions = Array.from(select.options).map(o => o.value);
  if (validOptions.includes(savedDiff)) {
    select.value = savedDiff;
  } else {
    select.value = "Medium";
  }

  // Restore State
  currentMonster = m;
  currentLevel = m.level;

  document.getElementById("resultArea").style.display = "block";
  switchTab('converter');
}

// Delete Monster
async function deleteMonster(id) {
  if (!confirm("Delete this monster?")) return;

  try {
    const { doc, deleteDoc } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    await deleteDoc(doc(window.db, "monsters", id));
    loadSavedMonsters();
  } catch (e) {
    console.error("Delete Error:", e);
    alert("Error deleting: " + e.message);
  }
}

// Copy Stats to Clipboard
function copyStats() {
  if (!currentMonster) return;
  const text = `Name: ${currentMonster.name}\nLevel: ${currentMonster.level} (${currentMonster.difficulty})\nHP: ${currentMonster.dc20_hp}\nPD: ${currentMonster.dc20_pd}\nAD: ${currentMonster.dc20_ad}\nAttack: ${currentMonster.dc20_attack}\nDamage: ${currentMonster.dc20_damage}\nSave DC: ${currentMonster.dc20_saveDC}\nSpeed: ${currentMonster.dc20_speed}\nMight: ${currentMonster.dc20_might}\nAgility: ${currentMonster.dc20_agility}\nIntelligence: ${currentMonster.dc20_intelligence}\nCharisma: ${currentMonster.dc20_charisma}`;
  navigator.clipboard.writeText(text).then(() => {
    alert("Stats copied to clipboard!");
  }).catch(() => {
    alert("Failed to copy. Try selecting and copying manually.");
  });
}
// --- EXPORT/IMPORT FUNCTIONS ---

// Export Library to JSON file
function exportLibrary() {
  const monsters = JSON.parse(localStorage.getItem("dc20_monsters") || "[]");
  
  if (monsters.length === 0) {
    alert("No monsters to export!");
    return;
  }
  
  // Create downloadable JSON file
  const dataStr = JSON.stringify(monsters, null, 2);
  const blob = new Blob([dataStr], {type: "application/json"});
  const url = URL.createObjectURL(blob);
  
  // Create temporary download link
  const a = document.createElement("a");
  a.href = url;
  a.download = `dnd-monster-library-${new Date().toISOString().slice(0,10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  alert(`Exported ${monsters.length} monsters!`);
}

// Import Library from JSON file
function importLibrary(input) {
  const file = input.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const imported = JSON.parse(e.target.result);
      
      // Validate it's an array
      if (!Array.isArray(imported)) {
        throw new Error("Invalid file format: expected an array of monsters");
      }
      
      // Get existing library
      const existing = JSON.parse(localStorage.getItem("dc20_monsters") || "[]");
      
      // Ask user how to merge
      const overwrite = confirm(
        `Found ${imported.length} monsters to import.\n` +
        `Your library currently has ${existing.length} monsters.\n\n` +
        `Click OK to REPLACE your library with the imported data.\n` +
        `Click Cancel to MERGE (add imported to existing).`
      );
      
      let merged;
      if (overwrite) {
        merged = imported;
      } else {
        // Merge, avoiding duplicates (same name + CR)
        const existingKeys = existing.map(m => `${m.name.toLowerCase()}-${m.cr}`);
        merged = [...existing];
        imported.forEach(m => {
          const key = `${m.name.toLowerCase()}-${m.cr}`;
          if (!existingKeys.includes(key)) {
            merged.push(m);
          }
        });
      }
      
      // Save merged data
      localStorage.setItem("dc20_monsters", JSON.stringify(merged));
      
      // Refresh the list
      loadSavedMonsters();
      
      alert(`Imported ${imported.length} monsters! Total in library: ${merged.length}`);
      
    } catch (err) {
      console.error("Import Error:", err);
      alert("Error importing file: " + err.message);
    }
  };
  
  reader.readAsText(file);
  
  // Reset input so same file can be selected again
  input.value = "";
}

// --- ABILITY REFERENCE FUNCTIONS ---

// Save Ability to Reference Library
function saveAbility() {
  const name = document.getElementById("ab5eName").value;
  const desc = document.getElementById("ab5eDesc").value;
  const dc20 = document.getElementById("abDC20").value;
  
  if (!name || !dc20) {
    alert("Please fill in both the 5e Name and DC20 Conversion fields.");
    return;
  }
  
  const abilities = JSON.parse(localStorage.getItem("dc20_abilities") || "[]");
  const index = abilities.findIndex(a => a.name.toLowerCase() === name.toLowerCase());
  
  if (index >= 0) {
    abilities[index] = {name, desc, dc20};
  } else {
    abilities.push({name, desc, dc20});
  }
  
  localStorage.setItem("dc20_abilities", JSON.stringify(abilities));
  alert("Ability saved!");
  loadAbilities();
  
  // Clear fields
  document.getElementById("ab5eName").value = "";
  document.getElementById("ab5eDesc").value = "";
  document.getElementById("abDC20").value = "";
}

// Load Abilities to Table
function loadAbilities() {
  const tbody = document.getElementById("abilityTableBody");
  if (!tbody) return;
  
  tbody.innerHTML = "";
  const abilities = JSON.parse(localStorage.getItem("dc20_abilities") || "[]");
  
  if (abilities.length === 0) {
    tbody.innerHTML = "<tr><td colspan='3'>No abilities saved yet.</td></tr>";
    return;
  }
  
  abilities.forEach((ab, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${ab.name}</td>
      <td>${ab.dc20}</td>
      <td><button onclick="deleteAbility(${index})" style="padding:5px 10px;font-size:12px;background:#e74c3c;color:white;border:none;border-radius:4px;cursor:pointer;">Delete</button></td>
    `;
    tbody.appendChild(tr);
  });
}

// Delete Ability
function deleteAbility(index) {
  if (!confirm("Delete this ability?")) return;
  
  const abilities = JSON.parse(localStorage.getItem("dc20_abilities") || "[]");
  abilities.splice(index, 1);
  localStorage.setItem("dc20_abilities", JSON.stringify(abilities));
  loadAbilities();
}
// --- ABILITY AUTO-SUGGEST FUNCTIONS ---

// Show suggestions based on user input
function showAbilitySuggestions() {
  const input = document.getElementById("mAbilities");
  const suggestionsBox = document.getElementById("abilitySuggestions");
  
  // Get cursor position
  const cursorPos = input.selectionStart;
  const textBeforeCursor = input.value.substring(0, cursorPos);
  
  // Extract the current ability name being typed (after last newline or colon)
  const lines = textBeforeCursor.split('\n');
  const currentLine = lines[lines.length - 1];
  
  // Get the text after the last colon (if any) - this is the ability name
  const colonIndex = currentLine.lastIndexOf(':');
  const abilityNameQuery = colonIndex >= 0 
    ? currentLine.substring(colonIndex + 1).trim()
    : currentLine.trim();
  
  // Calculate the start position of the query
  let startPos = 0;
  if (colonIndex >= 0) {
    startPos = textBeforeCursor.lastIndexOf(':', textBeforeCursor.length - 1) + 1;
  } else {
    startPos = textBeforeCursor.lastIndexOf('\n', textBeforeCursor.length - 1) + 1;
  }
  
  // Hide if no input or too short
  if (!abilityNameQuery || abilityNameQuery.length < 2) {
    suggestionsBox.style.display = "none";
    return;
  }

  // Get saved abilities
  const abilities = JSON.parse(localStorage.getItem("dc20_abilities") || "[]");
  
  // Filter matches
  const matches = abilities.filter(ab => 
    ab.name.toLowerCase().includes(abilityNameQuery.toLowerCase())
  ).slice(0, 5);

  if (matches.length === 0) {
    suggestionsBox.style.display = "none";
    return;
  }

  // Build suggestions HTML - store position and query length in data attributes
  let html = "";
  matches.forEach(ab => {
    const safeName = ab.name.replace(/'/g, "&#39;").replace(/"/g, "&quot;");
    const safeDc20 = ab.dc20.replace(/'/g, "&#39;").replace(/"/g, "&quot;");
    
    const regex = new RegExp(`(${escapeRegex(abilityNameQuery)})`, 'gi');
    const highlightedName = safeName.replace(regex, '<strong>$1</strong>');
    
    // Store startPos and queryLength in data attributes
    html += `<div class="ability-suggestion-item" 
              onclick="insertAbilityFromSuggestion(this)" 
              data-name="${safeName}" 
              data-dc20="${safeDc20}"
              data-startpos="${startPos}"
              data-querylength="${abilityNameQuery.length}">
      <strong>${highlightedName}</strong>
      <div style="font-size:0.9em;color:#666;margin-top:4px;">${truncate(ab.dc20, 100)}</div>
    </div>`;
  });

  suggestionsBox.innerHTML = html;
  suggestionsBox.style.display = "block";
  
  // Position the box
  const rect = input.getBoundingClientRect();
  suggestionsBox.style.top = (rect.bottom + window.scrollY + 5) + "px";
  suggestionsBox.style.left = rect.left + "px";
  suggestionsBox.style.width = rect.width + "px";
}
// Helper function to handle clicks on suggestions
function insertAbilityFromSuggestion(element) {
  const name = element.getAttribute('data-name');
  const dc20 = element.getAttribute('data-dc20');
  const startPos = parseInt(element.getAttribute('data-startpos'));
  const queryLength = parseInt(element.getAttribute('data-querylength'));
  
  console.log("Inserting:", name, "at pos:", startPos, "query length:", queryLength);
  
  // Call the main insert function with the position data
  insertAbilityWithPosition(name, dc20, startPos, queryLength);
}

// Insert ability using known position (no global state needed)
function insertAbilityWithPosition(name, dc20Text, startPos, queryLength) {
  const input = document.getElementById("mAbilities");
  const suggestionsBox = document.getElementById("abilitySuggestions");
  
  const textBeforeCursor = input.value.substring(0, startPos);
  const textAfterCursor = input.value.substring(startPos + queryLength);
  
  // Prepare the replacement text
  const replacementText = `${name}: ${dc20Text}`;
  
  // Construct the new value
  const newValue = textBeforeCursor + replacementText + textAfterCursor;
  
  // Update the textarea
  input.value = newValue;
  
  // Move cursor to the end of the inserted text
  const newCursorPos = startPos + replacementText.length;
  input.setSelectionRange(newCursorPos, newCursorPos);
  input.focus();
  
  // Hide suggestions
  suggestionsBox.style.display = "none";
}

// Insert selected ability into the textarea
function insertAbility(name, dc20Text) {
  const input = document.getElementById("mAbilities");
  const suggestionsBox = document.getElementById("abilitySuggestions");
  
  // Safety check: Ensure we have a query stored
  if (!lastSuggestionQuery || lastSuggestionStartPos === 0) {
    console.error("No suggestion query stored. Cannot insert.");
    suggestionsBox.style.display = "none";
    return;
  }
  
  const textBeforeCursor = input.value.substring(0, lastSuggestionStartPos);
  const textAfterCursor = input.value.substring(lastSuggestionStartPos + lastSuggestionQuery.length);
  
  // Prepare the replacement text
  const replacementText = `${name}: ${dc20Text}`;
  
  // Construct the new value
  const newValue = textBeforeCursor + replacementText + textAfterCursor;
  
  // Update the textarea
  input.value = newValue;
  
  // Move cursor to the end of the inserted text
  const newCursorPos = lastSuggestionStartPos + replacementText.length;
  input.setSelectionRange(newCursorPos, newCursorPos);
  input.focus();
  
  // Clear stored query
  lastSuggestionQuery = "";
  lastSuggestionStartPos = 0;
  
  // Hide suggestions
  suggestionsBox.style.display = "none";
}

// Helper: Escape special characters for regex
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Helper: Escape quotes for HTML/JS strings
function escapeQuotes(string) {
  return string.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

// Helper: Truncate long text
function truncate(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

// Hide suggestions when clicking outside
document.addEventListener("click", function(event) {
  const suggestionsBox = document.getElementById("abilitySuggestions");
  const input = document.getElementById("mAbilities");
  
  if (suggestionsBox && !suggestionsBox.contains(event.target) && event.target !== input) {
    suggestionsBox.style.display = "none";
  }
});

// --- DC20 MONSTER INGESTION FUNCTIONS ---

// Show status message
function showIngestStatus(message, isError = false) {
  const statusDiv = document.getElementById("ingestStatus");
  statusDiv.textContent = message;
  statusDiv.style.display = "block";
  statusDiv.style.backgroundColor = isError ? "#ffebee" : "#e8f5e9";
  statusDiv.style.color = isError ? "#c62828" : "#2e7d32";
  statusDiv.style.border = `1px solid ${isError ? "#ef9a9a" : "#a5d6a7"}`;
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    statusDiv.style.display = "none";
  }, 5000);
}

// Submit form data
function submitDC20Monster() {
  // Collect form data
  const monster = {
    name: document.getElementById("formName").value.trim(),
    level: document.getElementById("formLevel").value,
    difficulty: document.getElementById("formDifficulty").value,
    cr: document.getElementById("formCR").value || "N/A",
    
    // Combat stats
    dc20_hp: parseInt(document.getElementById("formHP").value),
    dc20_pd: parseInt(document.getElementById("formPD").value),
    dc20_ad: parseInt(document.getElementById("formAD").value),
    dc20_attack: parseInt(document.getElementById("formAttack").value),
    dc20_damage: parseFloat(document.getElementById("formDamage").value),
    dc20_saveDC: parseInt(document.getElementById("formSaveDC").value),
    dc20_speed: parseInt(document.getElementById("formSpeed").value),
    
    // Attributes
    dc20_might: parseInt(document.getElementById("formMight").value),
    dc20_agility: parseInt(document.getElementById("formAgility").value),
    dc20_intelligence: parseInt(document.getElementById("formIntelligence").value),
    dc20_charisma: parseInt(document.getElementById("formCharisma").value),
    
    // Optional features
    dc20_prime: parseInt(document.getElementById("formPrime").value) || 0,
    dc20_cm: parseInt(document.getElementById("formCM").value) || 0,
    dc20_totalFeaturePower: parseInt(document.getElementById("formTotalFeaturePower").value) || 0,
    
    // Placeholder 5e fields (not used for DC20 monsters)
    original5e_hp: "",
    original5e_str: "",
    original5e_dex: "",
    original5e_con: "",
    original5e_int: "",
    original5e_wis: "",
    original5e_cha: ""
  };
  
  // Validate required fields
  if (!monster.name || !monster.level || !monster.difficulty) {
    showIngestStatus("Please fill in all required fields (Name, Level, Difficulty).", true);
    return;
  }
  
  // Get existing library
  const monsters = JSON.parse(localStorage.getItem("dc20_monsters") || "[]");
  
  // Check for duplicate (same name + level)
  const existingIndex = monsters.findIndex(m =>
    m.name.toLowerCase() === monster.name.toLowerCase() &&
    m.level === monster.level
  );
  
  if (existingIndex >= 0) {
    if (!confirm(`"${monster.name}" (Level ${monster.level}) already exists. Overwrite?`)) {
      showIngestStatus("Add cancelled.");
      return;
    }
    monsters[existingIndex] = monster;
    showIngestStatus(`Updated "${monster.name}" in library.`);
  } else {
    monsters.push(monster);
    showIngestStatus(`Added "${monster.name}" to library!`);
  }
  
  // Save and refresh
  localStorage.setItem("dc20_monsters", JSON.stringify(monsters));
  loadSavedMonsters();
  
  // Reset form
  resetDC20Form();
}

// Reset form to defaults
function resetDC20Form() {
  document.getElementById("dc20MonsterForm").reset();
  // Set default values
  document.getElementById("formPrime").value = "0";
  document.getElementById("formCM").value = "0";
  document.getElementById("formTotalFeaturePower").value = "0";
}

// Toggle the visibility of the DC20 form
function toggleDC20Form() {
  const container = document.getElementById("dc20FormContainer");
  const button = document.querySelector('button[onclick="toggleDC20Form()"]');
  
  if (container.classList.contains("show")) {
    container.classList.remove("show");
    if (button) button.textContent = "➕ Add DC20 Monster (Form)";
  } else {
    container.classList.add("show");
    if (button) button.textContent = "🔽 Hide Form";
  }
}

// Keep the file upload function for bulk imports
function ingestDC20FromFile(input) {
  const file = input.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      const monstersToAdd = Array.isArray(data) ? data : [data];
      
      const existing = JSON.parse(localStorage.getItem("dc20_monsters") || "[]");
      let added = 0;
      let updated = 0;
      
      monstersToAdd.forEach(monster => {
        if (!monster.name || !monster.level) return;
        
        const existingIndex = existing.findIndex(m =>
          m.name.toLowerCase() === monster.name.toLowerCase() &&
          m.level === monster.level
        );
        
        if (existingIndex >= 0) {
          existing[existingIndex] = monster;
          updated++;
        } else {
          existing.push(monster);
          added++;
        }
      });
      
      localStorage.setItem("dc20_monsters", JSON.stringify(existing));
      loadSavedMonsters();
      
      showIngestStatus(`Imported ${added} new, updated ${updated}.`);
      
    } catch (e) {
      showIngestStatus(`Error parsing file: ${e.message}`, true);
    }
    
    input.value = "";
  };
  
  reader.readAsText(file);
}

// Ingest multiple DC20 monsters from file
function ingestDC20FromFile(input) {
  const file = input.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      
      // Handle both single monster and array of monsters
      const monstersToAdd = Array.isArray(data) ? data : [data];
      
      // Get existing library
      const existing = JSON.parse(localStorage.getItem("dc20_monsters") || "[]");
      let added = 0;
      let updated = 0;
      let skipped = 0;
      
      monstersToAdd.forEach(monster => {
        // Validate
        const validation = validateDC20Monster(monster);
        if (!validation.valid) {
          console.warn(`Skipping ${monster.name || 'unknown'}: ${validation.error}`);
          skipped++;
          return;
        }
        
        // Add optional fields
        if (!monster.cr) monster.cr = "N/A";
        if (!monster.original5e_hp) monster.original5e_hp = "";
        if (!monster.original5e_str) monster.original5e_str = "";
        if (!monster.original5e_dex) monster.original5e_dex = "";
        if (!monster.original5e_con) monster.original5e_con = "";
        if (!monster.original5e_int) monster.original5e_int = "";
        if (!monster.original5e_wis) monster.original5e_wis = "";
        if (!monster.original5e_cha) monster.original5e_cha = "";
        if (!monster.dc20_prime) monster.dc20_prime = 0;
        if (!monster.dc20_cm) monster.dc20_cm = 0;
        if (!monster.dc20_totalFeaturePower) monster.dc20_totalFeaturePower = 0;
        
        // Check for duplicate
        const existingIndex = existing.findIndex(m =>
          m.name.toLowerCase() === monster.name.toLowerCase() &&
          m.level === monster.level
        );
        
        if (existingIndex >= 0) {
          existing[existingIndex] = monster;
          updated++;
        } else {
          existing.push(monster);
          added++;
        }
      });
      
      // Save
      localStorage.setItem("dc20_monsters", JSON.stringify(existing));
      loadSavedMonsters();
      
      // Show summary
      const summary = `Imported ${added} new, updated ${updated}, skipped ${skipped}.`;
      showIngestStatus(summary);
      
    } catch (e) {
      showIngestStatus(`Error parsing file: ${e.message}`, true);
    }
    
    // Reset input
    input.value = "";
  };
  
  reader.readAsText(file);
}

function resetDC20Form() {
  document.getElementById("dc20MonsterForm").reset();
  document.getElementById("formPrime").value = "0";
  document.getElementById("formCM").value = "0";
  document.getElementById("formTotalFeaturePower").value = "0";
}

// --- MONSTER SEARCH FUNCTIONS ---

// Perform search based on filters
function performSearch() {
  const nameFilter = document.getElementById("searchName").value.toLowerCase().trim();
  const levelFilter = document.getElementById("searchLevel").value;
  const difficultyFilter = document.getElementById("searchDifficulty").value;
  const mightFilter = parseInt(document.getElementById("searchMight").value) || 0;
  const agilityFilter = parseInt(document.getElementById("searchAgility").value) || 0;
  const hpFilter = parseInt(document.getElementById("searchHP").value) || 0;
  
  // Get all monsters
  const monsters = JSON.parse(localStorage.getItem("dc20_monsters") || "[]");
  
  // Filter monsters
  const results = monsters.filter(m => {
    // Name filter
    if (nameFilter && !m.name.toLowerCase().includes(nameFilter)) return false;
    
    // Level filter
    if (levelFilter && m.level !== levelFilter) return false;
    
    // Difficulty filter
    if (difficultyFilter && m.difficulty !== difficultyFilter) return false;
    
    // Might filter
    if (m.dc20_might < mightFilter) return false;
    
    // Agility filter
    if (m.dc20_agility < agilityFilter) return false;
    
    // HP filter
    if (m.dc20_hp < hpFilter) return false;
    
    return true;
  });
  
  // Display results
  displaySearchResults(results);
}

// Display search results
function displaySearchResults(monsters) {
  const resultsDiv = document.getElementById("searchResults");
  const gridDiv = document.getElementById("resultsGrid");
  const countSpan = document.getElementById("searchResultsCount");
  
  if (monsters.length === 0) {
    resultsDiv.style.display = "none";
    countSpan.textContent = "No monsters found.";
    return;
  }
  
  resultsDiv.style.display = "block";
  countSpan.textContent = `${monsters.length} monster(s) found`;
  
  // Build result cards
  let html = "";
  monsters.forEach((m, index) => {
    html += `
      <div class="monster-card" id="card-${index}">
        <div class="card-header">
          <h4>${m.name}</h4>
          <span class="card-badge">${m.level}</span>
          <span class="card-badge difficulty-${m.difficulty.toLowerCase()}">${m.difficulty}</span>
        </div>
        
        <div class="card-stats">
          <div class="stat-row">
            <span class="stat-label">HP</span>
            <span class="stat-value">${m.dc20_hp}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">PD</span>
            <span class="stat-value">${m.dc20_pd}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">AD</span>
            <span class="stat-value">${m.dc20_ad}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Attack</span>
            <span class="stat-value">${m.dc20_attack}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Damage</span>
            <span class="stat-value">${m.dc20_damage}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Save DC</span>
            <span class="stat-value">${m.dc20_saveDC}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Speed</span>
            <span class="stat-value">${m.dc20_speed}</span>
          </div>
        </div>
        
        <div class="card-attributes">
          <div class="attr-row">
            <span class="attr-label">Might</span>
            <span class="attr-value">${m.dc20_might}</span>
          </div>
          <div class="attr-row">
            <span class="attr-label">Agility</span>
            <span class="attr-value">${m.dc20_agility}</span>
          </div>
          <div class="attr-row">
            <span class="attr-label">Intelligence</span>
            <span class="attr-value">${m.dc20_intelligence}</span>
          </div>
          <div class="attr-row">
            <span class="attr-label">Charisma</span>
            <span class="attr-value">${m.dc20_charisma}</span>
          </div>
        </div>
        
        ${m.dc20_prime ? `<div class="card-features"><span class="feature-label">Prime:</span> ${m.dc20_prime}</div>` : ''}
        ${m.dc20_cm ? `<div class="card-features"><span class="feature-label">CM:</span> ${m.dc20_cm}</div>` : ''}
        ${m.dc20_totalFeaturePower ? `<div class="card-features"><span class="feature-label">Features:</span> ${m.dc20_totalFeaturePower}</div>` : ''}
        
        <div class="card-actions">
          <button onclick="viewMonsterCard(${index})" class="secondary">👁️ View</button>
          <button onclick="printMonsterCard(${index})">🖨️ Print</button>
        </div>
      </div>
    `;
  });
  
  gridDiv.innerHTML = html;
}

// Clear all search filters
function clearSearch() {
  document.getElementById("searchName").value = "";
  document.getElementById("searchLevel").value = "";
  document.getElementById("searchDifficulty").value = "";
  document.getElementById("searchMight").value = "";
  document.getElementById("searchAgility").value = "";
  document.getElementById("searchHP").value = "";
  
  document.getElementById("searchResults").style.display = "none";
  document.getElementById("searchResultsCount").textContent = "";
}

// View single monster card (modal or expanded view)
function viewMonsterCard(index) {
  const monsters = JSON.parse(localStorage.getItem("dc20_monsters") || "[]");
  const m = monsters[index];
  
  // Load into converter for full view
  document.getElementById("mName").value = m.name;
  document.getElementById("mCR").value = m.cr || "0";
  document.getElementById("mHP").value = m.original5e_hp || "";
  document.getElementById("mSTR").value = m.original5e_str || "";
  document.getElementById("mDEX").value = m.original5e_dex || "";
  document.getElementById("mCON").value = m.original5e_con || "";
  document.getElementById("mINT").value = m.original5e_int || "";
  document.getElementById("mWIS").value = m.original5e_wis || "";
  document.getElementById("mCHA").value = m.original5e_cha || "";
  
  // Show result area
  document.getElementById("resName").innerText = m.name;
  document.getElementById("resLevel").innerText = m.level;
  document.getElementById("resHP").innerText = m.dc20_hp;
  document.getElementById("resPD").innerText = m.dc20_pd;
  document.getElementById("resAD").innerText = m.dc20_ad;
  document.getElementById("resAttack").innerText = m.dc20_attack;
  document.getElementById("resDamage").innerText = m.dc20_damage;
  document.getElementById("resSaveDC").innerText = m.dc20_saveDC;
  document.getElementById("resSpeed").innerText = m.dc20_speed;
  document.getElementById("resMight").innerText = m.dc20_might;
  document.getElementById("resAgility").innerText = m.dc20_agility;
  document.getElementById("resIntelligence").innerText = m.dc20_intelligence;
  document.getElementById("resCharisma").innerText = m.dc20_charisma;
  
  // Set difficulty
  const select = document.getElementById("difficultySelect");
  if ([...select.options].some(o => o.value === m.difficulty)) {
    select.value = m.difficulty;
  }
  
  // Restore state
  currentMonster = m;
  currentLevel = m.level;
  
  document.getElementById("resultArea").style.display = "block";
  switchTab('converter');
}

// Print single monster card
function printMonsterCard(index) {
  const monsters = JSON.parse(localStorage.getItem("dc20_monsters") || "[]");
  const m = monsters[index];
  
  // Create print window
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${m.name} - DC20 Monster Card</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .card { border: 2px solid #333; border-radius: 8px; padding: 20px; max-width: 400px; margin: 0 auto; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 15px; }
        .header h2 { margin: 0; color: #2c3e50; }
        .level-badge { background: #e74c3c; color: white; padding: 5px 10px; border-radius: 4px; font-size: 12px; }
        .stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 15px; }
        .stat { background: #f8f9fa; padding: 8px; border-radius: 4px; }
        .stat-label { font-size: 11px; color: #666; text-transform: uppercase; }
        .stat-value { font-size: 18px; font-weight: bold; color: #2c3e50; }
        .attributes { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 15px; }
        .attr { background: #ecf0f1; padding: 6px; border-radius: 4px; text-align: center; }
        .attr-label { font-size: 10px; color: #666; }
        .attr-value { font-size: 14px; font-weight: bold; }
        .features { background: #fff3cd; padding: 10px; border-radius: 4px; margin-bottom: 15px; }
        .footer { text-align: center; font-size: 11px; color: #999; margin-top: 20px; }
        @media print { .no-print { display: none; } }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h2>${m.name}</h2>
          <span class="level-badge">${m.level} • ${m.difficulty}</span>
        </div>
        
        <div class="stats">
          <div class="stat"><div class="stat-label">HP</div><div class="stat-value">${m.dc20_hp}</div></div>
          <div class="stat"><div class="stat-label">PD</div><div class="stat-value">${m.dc20_pd}</div></div>
          <div class="stat"><div class="stat-label">AD</div><div class="stat-value">${m.dc20_ad}</div></div>
          <div class="stat"><div class="stat-label">Attack</div><div class="stat-value">${m.dc20_attack}</div></div>
          <div class="stat"><div class="stat-label">Damage</div><div class="stat-value">${m.dc20_damage}</div></div>
          <div class="stat"><div class="stat-label">Save DC</div><div class="stat-value">${m.dc20_saveDC}</div></div>
          <div class="stat"><div class="stat-label">Speed</div><div class="stat-value">${m.dc20_speed}</div></div>
        </div>
        
        <div class="attributes">
          <div class="attr"><div class="attr-label">Might</div><div class="attr-value">${m.dc20_might}</div></div>
          <div class="attr"><div class="attr-label">Agility</div><div class="attr-value">${m.dc20_agility}</div></div>
          <div class="attr"><div class="attr-label">Intelligence</div><div class="attr-value">${m.dc20_intelligence}</div></div>
          <div class="attr"><div class="attr-label">Charisma</div><div class="attr-value">${m.dc20_charisma}</div></div>
        </div>
        
        ${(m.dc20_prime || m.dc20_cm || m.dc20_totalFeaturePower) ? `
        <div class="features">
          ${m.dc20_prime ? `<span>Prime: ${m.dc20_prime}</span> ` : ''}
          ${m.dc20_cm ? `<span>CM: ${m.dc20_cm}</span> ` : ''}
          ${m.dc20_totalFeaturePower ? `<span>Features: ${m.dc20_totalFeaturePower}</span>` : ''}
        </div>
        ` : ''}
        
        <div class="footer">Generated by D&D 5e to DC20 Converter</div>
      </div>
      
      <script>
        window.onload = function() { window.print(); }
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

// Print all search results
function printAllResults() {
  const monsters = JSON.parse(localStorage.getItem("dc20_monsters") || "[]");
  
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Monster Cards - DC20</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .card { border: 2px solid #333; border-radius: 8px; padding: 20px; max-width: 400px; margin: 20px auto; page-break-inside: avoid; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 15px; }
        .header h2 { margin: 0; color: #2c3e50; }
        .level-badge { background: #e74c3c; color: white; padding: 5px 10px; border-radius: 4px; font-size: 12px; }
        .stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 15px; }
        .stat { background: #f8f9fa; padding: 8px; border-radius: 4px; }
        .stat-label { font-size: 11px; color: #666; text-transform: uppercase; }
        .stat-value { font-size: 18px; font-weight: bold; color: #2c3e50; }
        .attributes { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 15px; }
        .attr { background: #ecf0f1; padding: 6px; border-radius: 4px; text-align: center; }
        .attr-label { font-size: 10px; color: #666; }
        .attr-value { font-size: 14px; font-weight: bold; }
        .features { background: #fff3cd; padding: 10px; border-radius: 4px; margin-bottom: 15px; }
        .footer { text-align: center; font-size: 11px; color: #999; margin-top: 20px; }
        @media print { .no-print { display: none; } }
      </style>
    </head>
    <body>
      <h1 style="text-align: center;">DC20 Monster Cards</h1>
  `);
  
  monsters.forEach(m => {
    printWindow.document.write(`
      <div class="card">
        <div class="header">
          <h2>${m.name}</h2>
          <span class="level-badge">${m.level} • ${m.difficulty}</span>
        </div>
        
        <div class="stats">
          <div class="stat"><div class="stat-label">HP</div><div class="stat-value">${m.dc20_hp}</div></div>
          <div class="stat"><div class="stat-label">PD</div><div class="stat-value">${m.dc20_pd}</div></div>
          <div class="stat"><div class="stat-label">AD</div><div class="stat-value">${m.dc20_ad}</div></div>
          <div class="stat"><div class="stat-label">Attack</div><div class="stat-value">${m.dc20_attack}</div></div>
          <div class="stat"><div class="stat-label">Damage</div><div class="stat-value">${m.dc20_damage}</div></div>
          <div class="stat"><div class="stat-label">Save DC</div><div class="stat-value">${m.dc20_saveDC}</div></div>
          <div class="stat"><div class="stat-label">Speed</div><div class="stat-value">${m.dc20_speed}</div></div>
        </div>
        
        <div class="attributes">
          <div class="attr"><div class="attr-label">Might</div><div class="attr-value">${m.dc20_might}</div></div>
          <div class="attr"><div class="attr-label">Agility</div><div class="attr-value">${m.dc20_agility}</div></div>
          <div class="attr"><div class="attr-label">Intelligence</div><div class="attr-value">${m.dc20_intelligence}</div></div>
          <div class="attr"><div class="attr-label">Charisma</div><div class="attr-value">${m.dc20_charisma}</div></div>
        </div>
        
        ${(m.dc20_prime || m.dc20_cm || m.dc20_totalFeaturePower) ? `
        <div class="features">
          ${m.dc20_prime ? `<span>Prime: ${m.dc20_prime}</span> ` : ''}
          ${m.dc20_cm ? `<span>CM: ${m.dc20_cm}</span> ` : ''}
          ${m.dc20_totalFeaturePower ? `<span>Features: ${m.dc20_totalFeaturePower}</span>` : ''}
        </div>
        ` : ''}
        
        <div class="footer">Generated by D&D 5e to DC20 Converter</div>
      </div>
    `);
  });
  
  printWindow.document.write(`
      <script>
        window.onload = function() { window.print(); }
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

// --- INITIALIZATION ---

// Run on page load
window.onload = function() {
  loadSavedMonsters();
  loadAbilities();
  renderBaseStatsEditor();
  renderModifiersEditor();
  switchTab('converter');
  console.log("App loaded successfully");
};