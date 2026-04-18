<script>
  import { chatStore } from '../stores/chatStore.svelte.js';
  import ConversationItem from './ConversationItem.svelte';

  let searchInput = $state('');

  function handleSearch(e) {
    searchInput = e.target.value;
    chatStore.setSearchQuery(searchInput);
  }

  function handleNewChat() {
    chatStore.createNewConversation();
  }

  function closeSidebar() {
    chatStore.toggleSidebar();
  }

  const grouped = $derived(chatStore.groupedConversations);
</script>

<aside class="sidebar" class:sidebar-open={chatStore.sidebarOpen}>
  <!-- Sidebar header -->
  <div class="sidebar-header">
    <button class="sidebar-toggle" onclick={closeSidebar} title="Close sidebar" id="btn-close-sidebar">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <line x1="9" y1="3" x2="9" y2="21"/>
      </svg>
    </button>
    <button class="new-chat-btn" onclick={handleNewChat} id="btn-new-chat">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 20h9"/>
        <path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/>
      </svg>
    </button>
  </div>

  <!-- Search -->
  <div class="sidebar-search">
    <div class="search-input-wrapper">
      <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input
        type="text"
        placeholder="Search conversations..."
        value={searchInput}
        oninput={handleSearch}
        class="search-input"
        id="search-conversations"
      />
      {#if searchInput}
        <button class="search-clear" onclick={() => { searchInput = ''; chatStore.setSearchQuery(''); }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      {/if}
    </div>
  </div>

  <!-- Conversations list -->
  <nav class="sidebar-conversations" id="conversation-list">
    {#each Object.entries(grouped) as [group, convos] (group)}
      <div class="conversation-group">
        <h3 class="group-label">{group}</h3>
        {#each convos as conv (conv.id)}
          <ConversationItem
            conversation={conv}
            isActive={conv.id === chatStore.activeConversationId}
          />
        {/each}
      </div>
    {/each}

    {#if Object.keys(grouped).length === 0}
      <div class="no-results">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <p>No conversations found</p>
      </div>
    {/if}
  </nav>

  <!-- Sidebar footer -->
  <div class="sidebar-footer">
    <button class="sidebar-footer-btn" onclick={() => chatStore.toggleSettings()} id="btn-settings">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
      <span>Settings</span>
    </button>

    <div class="sidebar-user">
      <div class="user-avatar">
        <span>D</span>
      </div>
      <div class="user-info">
        <span class="user-name">User</span>
        <span class="user-plan">Free Plan</span>
      </div>
      <button class="user-menu-btn" id="btn-user-menu">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="1"/>
          <circle cx="12" cy="5" r="1"/>
          <circle cx="12" cy="19" r="1"/>
        </svg>
      </button>
    </div>
  </div>
</aside>

<!-- Mobile overlay -->
{#if chatStore.sidebarOpen}
  <div class="sidebar-overlay" onclick={closeSidebar} role="presentation"></div>
{/if}

<style>
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: var(--sidebar-width);
    height: 100vh;
    background: var(--bg-secondary);
    display: flex;
    flex-direction: column;
    z-index: var(--z-sidebar);
    transform: translateX(-100%);
    transition: transform var(--transition-base);
    border-right: 1px solid var(--border-default);
  }

  .sidebar-open {
    transform: translateX(0);
  }

  .sidebar-overlay {
    display: none;
  }

  .sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-3) var(--space-3);
    flex-shrink: 0;
  }

  .sidebar-toggle,
  .new-chat-btn {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    transition: all var(--transition-fast);
  }

  .sidebar-toggle:hover,
  .new-chat-btn:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }

  /* Search */
  .sidebar-search {
    padding: 0 var(--space-3) var(--space-3);
    flex-shrink: 0;
  }

  .search-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .search-icon {
    position: absolute;
    left: 10px;
    color: var(--text-muted);
    pointer-events: none;
  }

  .search-input {
    width: 100%;
    height: 36px;
    padding: 0 32px 0 34px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-lg);
    font-size: var(--text-sm);
    color: var(--text-primary);
    transition: all var(--transition-fast);
  }

  .search-input::placeholder {
    color: var(--text-muted);
  }

  .search-input:focus {
    border-color: var(--border-focus);
    background: var(--bg-input-focus);
    box-shadow: 0 0 0 2px rgba(16, 163, 127, 0.1);
  }

  .search-clear {
    position: absolute;
    right: 6px;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-sm);
    color: var(--text-muted);
    transition: all var(--transition-fast);
  }

  .search-clear:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }

  /* Conversations */
  .sidebar-conversations {
    flex: 1;
    overflow-y: auto;
    padding: 0 var(--space-2);
  }

  .conversation-group {
    margin-bottom: var(--space-2);
  }

  .group-label {
    font-size: var(--text-xs);
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: var(--space-3) var(--space-3) var(--space-1);
  }

  .no-results {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--space-10);
    gap: var(--space-3);
    color: var(--text-muted);
    font-size: var(--text-sm);
  }

  /* Footer */
  .sidebar-footer {
    flex-shrink: 0;
    border-top: 1px solid var(--border-default);
    padding: var(--space-2);
  }

  .sidebar-footer-btn {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    width: 100%;
    padding: var(--space-3);
    border-radius: var(--radius-md);
    font-size: var(--text-sm);
    color: var(--text-secondary);
    transition: all var(--transition-fast);
  }

  .sidebar-footer-btn:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }

  .sidebar-user {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3);
    border-radius: var(--radius-md);
    margin-top: var(--space-1);
    transition: all var(--transition-fast);
  }

  .sidebar-user:hover {
    background: var(--bg-hover);
  }

  .user-avatar {
    width: 32px;
    height: 32px;
    border-radius: var(--radius-sm);
    background: #424242;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: var(--text-sm);
    color: white;
    flex-shrink: 0;
  }

  .user-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  .user-name {
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .user-plan {
    font-size: var(--text-xs);
    color: var(--text-muted);
  }

  .user-menu-btn {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-sm);
    color: var(--text-muted);
    transition: all var(--transition-fast);
    flex-shrink: 0;
  }

  .user-menu-btn:hover {
    background: var(--bg-active);
    color: var(--text-primary);
  }

  /* Mobile responsive */
  @media (max-width: 768px) {
    .sidebar {
      width: 280px;
    }

    .sidebar-overlay {
      display: block;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      z-index: calc(var(--z-sidebar) - 1);
      backdrop-filter: blur(4px);
      animation: fadeIn 200ms ease;
    }
  }
</style>
