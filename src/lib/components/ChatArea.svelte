<script>
  import { chatStore } from '../stores/chatStore.svelte.js';
  import ModelSelector from './ModelSelector.svelte';
  import MessageBubble from './MessageBubble.svelte';
  import ChatInput from './ChatInput.svelte';
  import WelcomeScreen from './WelcomeScreen.svelte';
  import TypingIndicator from './TypingIndicator.svelte';
  import { tick } from 'svelte';

  let messagesContainer = $state(null);

  const conversation = $derived(chatStore.activeConversation);
  const messages = $derived(conversation?.messages || []);
  const hasMessages = $derived(messages.length > 0);

  // Auto-scroll to bottom when new messages arrive
  $effect(() => {
    if (messages.length && messagesContainer) {
      tick().then(() => {
        messagesContainer.scrollTo({
          top: messagesContainer.scrollHeight,
          behavior: 'smooth',
        });
      });
    }
  });

  // Also scroll when loading state changes
  $effect(() => {
    if (chatStore.isLoading && messagesContainer) {
      tick().then(() => {
        messagesContainer.scrollTo({
          top: messagesContainer.scrollHeight,
          behavior: 'smooth',
        });
      });
    }
  });
</script>

<main class="chat-area" class:sidebar-open={chatStore.sidebarOpen}>
  <!-- Top bar -->
  <header class="chat-header">
    <div class="header-left">
      {#if !chatStore.sidebarOpen}
        <button class="header-btn" onclick={() => chatStore.toggleSidebar()} title="Open sidebar" id="btn-open-sidebar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <line x1="9" y1="3" x2="9" y2="21"/>
          </svg>
        </button>

        <button class="header-btn" onclick={() => chatStore.createNewConversation()} title="New chat" id="btn-header-new-chat">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 20h9"/>
            <path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/>
          </svg>
        </button>
      {/if}

      <ModelSelector />
    </div>

    <div class="header-right">
      <button class="header-btn" title="Share" id="btn-share">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
          <polyline points="16 6 12 2 8 6"/>
          <line x1="12" y1="2" x2="12" y2="15"/>
        </svg>
      </button>
    </div>
  </header>

  <!-- Messages area -->
  <div class="messages-scroll" bind:this={messagesContainer} id="messages-area">
    {#if hasMessages}
      <div class="messages-list">
        {#each messages as message (message.id)}
          <MessageBubble {message} />
        {/each}

        {#if chatStore.isLoading}
          <TypingIndicator />
        {/if}
      </div>
    {:else}
      <WelcomeScreen />
    {/if}
  </div>

  <!-- Input area -->
  <ChatInput />
</main>

<style>
  .chat-area {
    display: flex;
    flex-direction: column;
    height: 100vh;
    margin-left: 0;
    transition: margin-left var(--transition-base);
    background: var(--bg-primary);
  }

  .chat-area.sidebar-open {
    margin-left: var(--sidebar-width);
  }

  /* Header */
  .chat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-2) var(--space-4);
    flex-shrink: 0;
    height: 52px;
    border-bottom: 1px solid transparent;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: var(--space-1);
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: var(--space-1);
  }

  .header-btn {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    transition: all var(--transition-fast);
  }

  .header-btn:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }

  /* Messages scroll area */
  .messages-scroll {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }

  .messages-list {
    flex: 1;
    padding-bottom: var(--space-4);
  }

  @media (max-width: 768px) {
    .chat-area.sidebar-open {
      margin-left: 0;
    }
  }
</style>
