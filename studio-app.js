<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="A CEFR-based Dutch, Polish and European Portuguese learning studio.">
  <title>Language Learning Studio</title>
  <link rel="stylesheet" href="./assets/styles/studio.css">
</head>
<body>
  <header class="app-header">
    <a class="brand-link" href="#/" aria-label="Language Learning Studio home">
      <span class="brand-mark" aria-hidden="true">LS</span>
      <span><strong>Language Studio</strong><small>Dutch · Polish · Portuguese</small></span>
    </a>
    <button class="settings-button" id="settingsButton" type="button" aria-label="Open settings" aria-haspopup="dialog">
      <span aria-hidden="true">⚙</span><span class="settings-label">Settings</span>
    </button>
  </header>

  <main id="app" class="app-main" tabindex="-1"></main>

  <div class="modal-backdrop" id="settingsModal" hidden>
    <section class="settings-panel" role="dialog" aria-modal="true" aria-labelledby="settingsTitle">
      <div class="panel-heading">
        <div><p class="eyebrow">Preferences</p><h2 id="settingsTitle">Settings</h2></div>
        <button class="icon-button" id="closeSettings" type="button" aria-label="Close settings">×</button>
      </div>
      <div class="settings-grid">
        <label>Appearance
          <select data-setting="theme">
            <option value="system">Use device setting</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
        <label>Daily goal
          <select data-setting="dailyGoal">
            <option value="5">5 minutes</option><option value="10">10 minutes</option><option value="20">20 minutes</option><option value="30">30 minutes</option><option value="45">45 minutes</option>
          </select>
        </label>
        <label class="toggle-row"><span><strong>Pronunciation audio</strong><small>Enable listen buttons</small></span><input type="checkbox" data-setting="soundEnabled"></label>
        <label class="toggle-row"><span><strong>Reduced motion</strong><small>Limit interface animation</small></span><input type="checkbox" data-setting="reducedMotion"></label>
      </div>
      <p class="settings-note">Preferences and progress are stored in this browser. Cross-device syncing requires an account service and is not enabled.</p>
    </section>
  </div>

  <noscript>This learning studio requires JavaScript.</noscript>
  <script type="module" src="./assets/studio-app.js"></script>
</body>
</html>

