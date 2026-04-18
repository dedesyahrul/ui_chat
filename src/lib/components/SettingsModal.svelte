<script>
  import { chatStore } from '../stores/chatStore.svelte.js';

  let activeTab = $state('general');

  const tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'personalization', label: 'Personalization', icon: '👤' },
    { id: 'data', label: 'Data Controls', icon: '🔒' },
    { id: 'about', label: 'About', icon: 'ℹ️' },
  ];

  let theme = $state('dark');
  let fontSize = $state('default');
  let sendOnEnter = $state(true);
</script>

{#if chatStore.showSettings}
  <div class="settings-overlay" onclick={() => chatStore.toggleSettings()} role="presentation"></div>
  <div class="settings-modal" role="dialog" id="settings-modal">
    <div class="settings-header">
      <h2 class="settings-title">Settings</h2>
      <button class="close-btn" onclick={() => chatStore.toggleSettings()} id="btn-close-settings">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>

    <div class="settings-body">
      <!-- Sidebar tabs -->
      <nav class="settings-tabs">
        {#each tabs as tab (tab.id)}
          <button
            class="tab-btn"
            class:active={activeTab === tab.id}
            onclick={() => activeTab = tab.id}
          >
            <span class="tab-icon">{tab.icon}</span>
            <span class="tab-label">{tab.label}</span>
          </button>
        {/each}
      </nav>

      <!-- Tab content -->
      <div class="settings-content">
        {#if activeTab === 'general'}
          <div class="settings-section">
            <h3 class="section-title">Appearance</h3>

            <div class="setting-item">
              <div class="setting-info">
                <span class="setting-label">Theme</span>
                <span class="setting-desc">Choose your preferred color scheme</span>
              </div>
              <select class="setting-select" bind:value={theme}>
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="system">System</option>
              </select>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <span class="setting-label">Font Size</span>
                <span class="setting-desc">Adjust the text size in messages</span>
              </div>
              <select class="setting-select" bind:value={fontSize}>
                <option value="small">Small</option>
                <option value="default">Default</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>

          <div class="settings-section">
            <h3 class="section-title">Chat</h3>

            <div class="setting-item">
              <div class="setting-info">
                <span class="setting-label">Send on Enter</span>
                <span class="setting-desc">Press Enter to send, Shift+Enter for new line</span>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" bind:checked={sendOnEnter} />
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <span class="setting-label">Archive all chats</span>
                <span class="setting-desc">Move all conversations to archive</span>
              </div>
              <button class="setting-action-btn">Archive all</button>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <span class="setting-label">Delete all chats</span>
                <span class="setting-desc">Permanently delete all conversations</span>
              </div>
              <button class="setting-action-btn danger">Delete all</button>
            </div>
          </div>
        {/if}

        {#if activeTab === 'personalization'}
          <div class="settings-section">
            <h3 class="section-title">Custom Instructions</h3>

            <div class="setting-block">
              <label class="setting-label" for="custom-instructions">What would you like AI to know about you?</label>
              <textarea
                class="setting-textarea"
                id="custom-instructions"
                placeholder="E.g., I'm a software engineer working with JavaScript and Python..."
                rows="4"
              ></textarea>
            </div>

            <div class="setting-block">
              <label class="setting-label" for="response-style">How would you like AI to respond?</label>
              <textarea
                class="setting-textarea"
                id="response-style"
                placeholder="E.g., Be concise, use code examples when possible..."
                rows="4"
              ></textarea>
            </div>
          </div>
        {/if}

        {#if activeTab === 'data'}
          <div class="settings-section">
            <h3 class="section-title">Data Controls</h3>

            <div class="setting-item">
              <div class="setting-info">
                <span class="setting-label">Chat history & training</span>
                <span class="setting-desc">Allow conversations to be used for model improvement</span>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" checked />
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <span class="setting-label">Shared links</span>
                <span class="setting-desc">Manage your shared conversation links</span>
              </div>
              <button class="setting-action-btn">Manage</button>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <span class="setting-label">Export data</span>
                <span class="setting-desc">Download a copy of your data</span>
              </div>
              <button class="setting-action-btn">Export</button>
            </div>
          </div>
        {/if}

        {#if activeTab === 'about'}
          <div class="settings-section">
            <h3 class="section-title">About AI Chat</h3>

            <div class="about-info">
              <div class="about-logo">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <h4 class="about-name">AI Chat</h4>
              <p class="about-version">Version 1.0.0</p>
              <p class="about-desc">A modern, intelligent conversational AI assistant built with Svelte 5.</p>

              <div class="about-links">
                <a href="#" class="about-link">Terms of Service</a>
                <a href="#" class="about-link">Privacy Policy</a>
                <a href="#" class="about-link">Documentation</a>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .settings-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(8px);
    z-index: var(--z-modal);
    animation: fadeIn 200ms ease;
  }

  .settings-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: min(720px, 90vw);
    max-height: 85vh;
    background: var(--bg-surface-elevated);
    border: 1px solid var(--border-light);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-xl);
    z-index: calc(var(--z-modal) + 1);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: fadeInScale 250ms ease;
  }

  .settings-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-5) var(--space-6);
    border-bottom: 1px solid var(--border-default);
    flex-shrink: 0;
  }

  .settings-title {
    font-size: var(--text-lg);
    font-weight: 600;
    color: var(--text-primary);
  }

  .close-btn {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-md);
    color: var(--text-muted);
    transition: all var(--transition-fast);
  }

  .close-btn:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }

  .settings-body {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  /* Tabs */
  .settings-tabs {
    width: 200px;
    flex-shrink: 0;
    padding: var(--space-3);
    border-right: 1px solid var(--border-default);
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .tab-btn {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-md);
    font-size: var(--text-sm);
    color: var(--text-secondary);
    transition: all var(--transition-fast);
  }

  .tab-btn:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }

  .tab-btn.active {
    background: var(--bg-tertiary);
    color: var(--text-primary);
  }

  .tab-icon {
    font-size: 1rem;
  }

  /* Content */
  .settings-content {
    flex: 1;
    padding: var(--space-5) var(--space-6);
    overflow-y: auto;
  }

  .settings-section {
    margin-bottom: var(--space-8);
  }

  .section-title {
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--space-4);
    padding-bottom: var(--space-2);
    border-bottom: 1px solid var(--border-default);
  }

  .setting-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-3) 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  }

  .setting-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .setting-label {
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--text-primary);
  }

  .setting-desc {
    font-size: var(--text-xs);
    color: var(--text-muted);
  }

  .setting-select {
    padding: var(--space-2) var(--space-3);
    background: var(--bg-input);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-md);
    color: var(--text-primary);
    font-size: var(--text-sm);
    font-family: var(--font-sans);
    cursor: pointer;
  }

  .setting-action-btn {
    padding: var(--space-2) var(--space-4);
    background: var(--bg-tertiary);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    font-size: var(--text-sm);
    transition: all var(--transition-fast);
    font-family: var(--font-sans);
    cursor: pointer;
  }

  .setting-action-btn:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }

  .setting-action-btn.danger {
    color: #ef4444;
    border-color: rgba(239, 68, 68, 0.2);
  }

  .setting-action-btn.danger:hover {
    background: rgba(239, 68, 68, 0.1);
  }

  /* Toggle Switch */
  .toggle-switch {
    position: relative;
    width: 44px;
    height: 24px;
    cursor: pointer;
  }

  .toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .toggle-slider {
    position: absolute;
    inset: 0;
    background: var(--bg-active);
    border-radius: var(--radius-full);
    transition: all var(--transition-fast);
  }

  .toggle-slider::before {
    content: '';
    position: absolute;
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background: white;
    border-radius: 50%;
    transition: all var(--transition-fast);
  }

  .toggle-switch input:checked + .toggle-slider {
    background: var(--brand-primary);
  }

  .toggle-switch input:checked + .toggle-slider::before {
    transform: translateX(20px);
  }

  /* Textarea */
  .setting-block {
    margin-bottom: var(--space-4);
  }

  .setting-block .setting-label {
    display: block;
    margin-bottom: var(--space-2);
  }

  .setting-textarea {
    width: 100%;
    padding: var(--space-3);
    background: var(--bg-input);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-md);
    color: var(--text-primary);
    font-size: var(--text-sm);
    font-family: var(--font-sans);
    resize: vertical;
    line-height: 1.5;
    transition: border-color var(--transition-fast);
  }

  .setting-textarea::placeholder {
    color: var(--text-muted);
  }

  .setting-textarea:focus {
    border-color: var(--border-focus);
  }

  /* About */
  .about-info {
    text-align: center;
    padding: var(--space-6) 0;
  }

  .about-logo {
    width: 72px;
    height: 72px;
    margin: 0 auto var(--space-4);
    background: var(--brand-gradient);
    border-radius: var(--radius-xl);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: var(--shadow-glow);
  }

  .about-name {
    font-size: var(--text-xl);
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: var(--space-1);
  }

  .about-version {
    font-size: var(--text-sm);
    color: var(--text-muted);
    margin-bottom: var(--space-3);
  }

  .about-desc {
    font-size: var(--text-sm);
    color: var(--text-secondary);
    margin-bottom: var(--space-6);
    max-width: 300px;
    margin-left: auto;
    margin-right: auto;
  }

  .about-links {
    display: flex;
    justify-content: center;
    gap: var(--space-6);
  }

  .about-link {
    font-size: var(--text-sm);
    color: var(--text-link);
    text-decoration: none;
    transition: color var(--transition-fast);
  }

  .about-link:hover {
    color: var(--brand-primary);
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    .settings-modal {
      width: 95vw;
      max-height: 90vh;
    }

    .settings-tabs {
      width: 60px;
      padding: var(--space-2);
    }

    .tab-label {
      display: none;
    }

    .tab-btn {
      justify-content: center;
      padding: var(--space-2);
    }
  }
</style>
