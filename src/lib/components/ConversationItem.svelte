<script>
  import { chatStore } from '../stores/chatStore.svelte.js';

  let { conversation, isActive } = $props();
  let isEditing = $state(false);
  let editTitle = $state('');
  let showMenu = $state(false);

  function handleClick() {
    if (!isEditing) {
      chatStore.setActiveConversation(conversation.id);
    }
  }

  function startEditing() {
    editTitle = conversation.title;
    isEditing = true;
    showMenu = false;
  }

  function saveEdit() {
    if (editTitle.trim()) {
      chatStore.renameConversation(conversation.id, editTitle.trim());
    }
    isEditing = false;
  }

  function cancelEdit() {
    isEditing = false;
  }

  function handleKeydown(e) {
    if (e.key === 'Enter') saveEdit();
    if (e.key === 'Escape') cancelEdit();
  }

  function handleDelete() {
    showMenu = false;
    chatStore.deleteConversation(conversation.id);
  }

  function toggleMenu(e) {
    e.stopPropagation();
    showMenu = !showMenu;
  }
</script>

<div
  class="conversation-item"
  class:active={isActive}
  onclick={handleClick}
  role="button"
  tabindex="0"
  id="conv-{conversation.id}"
>
  {#if isEditing}
    <input
      type="text"
      class="edit-input"
      bind:value={editTitle}
      onkeydown={handleKeydown}
      onblur={saveEdit}
      id="edit-conv-{conversation.id}"
    />
  {:else}
    <svg class="conv-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
    <span class="conv-title">{conversation.title}</span>

    <div class="conv-actions" class:show={showMenu}>
      <button class="action-btn" onclick={toggleMenu} title="More options">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="1"/>
          <circle cx="19" cy="12" r="1"/>
          <circle cx="5" cy="12" r="1"/>
        </svg>
      </button>
    </div>

    {#if showMenu}
      <div class="conv-menu" role="menu">
        <button class="menu-item" onclick={startEditing}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/>
          </svg>
          Rename
        </button>
        <button class="menu-item menu-item-danger" onclick={handleDelete}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 6h18"/>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
          </svg>
          Delete
        </button>
      </div>
    {/if}
  {/if}
</div>

{#if showMenu}
  <div class="menu-backdrop" onclick={() => showMenu = false} role="presentation"></div>
{/if}

<style>
  .conversation-item {
    position: relative;
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-fast);
    margin-bottom: 1px;
  }

  .conversation-item:hover {
    background: var(--bg-hover);
  }

  .conversation-item:hover .conv-actions {
    opacity: 1;
  }

  .conversation-item.active {
    background: var(--bg-tertiary);
  }

  .conv-icon {
    flex-shrink: 0;
    color: var(--text-muted);
    opacity: 0.7;
  }

  .conv-title {
    flex: 1;
    font-size: var(--text-sm);
    color: var(--text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .active .conv-title {
    color: var(--text-primary);
  }

  .conv-actions {
    opacity: 0;
    flex-shrink: 0;
    transition: opacity var(--transition-fast);
  }

  .conv-actions.show {
    opacity: 1;
  }

  .action-btn {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-sm);
    color: var(--text-muted);
    transition: all var(--transition-fast);
  }

  .action-btn:hover {
    background: var(--bg-active);
    color: var(--text-primary);
  }

  .conv-menu {
    position: absolute;
    right: 0;
    top: 100%;
    width: 160px;
    background: var(--bg-surface-elevated);
    border: 1px solid var(--border-light);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    padding: var(--space-1);
    z-index: 100;
    animation: fadeInScale 150ms ease;
  }

  .menu-item {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    width: 100%;
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-sm);
    font-size: var(--text-sm);
    color: var(--text-secondary);
    transition: all var(--transition-fast);
  }

  .menu-item:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }

  .menu-item-danger:hover {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
  }

  .menu-backdrop {
    position: fixed;
    inset: 0;
    z-index: 99;
  }

  .edit-input {
    width: 100%;
    padding: var(--space-1) var(--space-2);
    background: var(--bg-input);
    border: 1px solid var(--border-focus);
    border-radius: var(--radius-sm);
    font-size: var(--text-sm);
    color: var(--text-primary);
  }
</style>
