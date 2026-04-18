<script>
  import { chatStore } from '../stores/chatStore.svelte.js';

  let inputText = $state('');
  let textareaEl = $state(null);
  let isFocused = $state(false);

  function autoResize() {
    if (textareaEl) {
      textareaEl.style.height = 'auto';
      textareaEl.style.height = Math.min(textareaEl.scrollHeight, 200) + 'px';
    }
  }

  function handleInput(e) {
    inputText = e.target.value;
    autoResize();
  }

  async function handleSend() {
    if (!inputText.trim() || chatStore.isLoading) return;
    const msg = inputText;
    inputText = '';
    if (textareaEl) {
      textareaEl.style.height = 'auto';
    }
    await chatStore.sendMessage(msg);
  }

  function handleKeydown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const suggestions = [
    { icon: '💡', text: 'Explain quantum computing', desc: 'in simple terms' },
    { icon: '🎨', text: 'Create a color palette', desc: 'for a modern website' },
    { icon: '💻', text: 'Help me debug', desc: 'my JavaScript code' },
    { icon: '📝', text: 'Write a professional email', desc: 'for a job application' },
  ];

  function handleSuggestion(text, desc) {
    inputText = text + ' ' + desc;
    if (textareaEl) textareaEl.focus();
  }

  const hasMessages = $derived(
    chatStore.activeConversation?.messages?.length > 0
  );
</script>

<div class="input-area">
  <!-- Suggestion chips shown on empty conversation -->
  {#if !hasMessages}
    <div class="suggestions">
      {#each suggestions as suggestion}
        <button
          class="suggestion-chip"
          onclick={() => handleSuggestion(suggestion.text, suggestion.desc)}
        >
          <span class="suggestion-icon">{suggestion.icon}</span>
          <div class="suggestion-text">
            <span class="suggestion-title">{suggestion.text}</span>
            <span class="suggestion-desc">{suggestion.desc}</span>
          </div>
        </button>
      {/each}
    </div>
  {/if}

  <!-- Input container -->
  <div class="input-container" class:focused={isFocused}>
    <div class="input-wrapper">
      <!-- Attach Button -->
      <button class="attach-btn" title="Attach file" id="btn-attach">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
        </svg>
      </button>

      <!-- Textarea -->
      <textarea
        bind:this={textareaEl}
        value={inputText}
        oninput={handleInput}
        onkeydown={handleKeydown}
        onfocus={() => isFocused = true}
        onblur={() => isFocused = false}
        placeholder="Message AI Chat..."
        rows="1"
        class="chat-textarea"
        id="chat-input"
      ></textarea>

      <!-- Send Button -->
      <button
        class="send-btn"
        class:active={inputText.trim() && !chatStore.isLoading}
        onclick={handleSend}
        disabled={!inputText.trim() || chatStore.isLoading}
        title="Send message"
        id="btn-send"
      >
        {#if chatStore.isLoading}
          <div class="stop-icon"></div>
        {:else}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L12 22M12 2L5 9M12 2L19 9"/>
          </svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="19" x2="12" y2="5"/>
            <polyline points="5 12 12 5 19 12"/>
          </svg>
        {/if}
      </button>
    </div>
  </div>

  <p class="input-disclaimer">
    AI Chat can make mistakes. Check important info.
  </p>
</div>

<style>
  .input-area {
    flex-shrink: 0;
    padding: 0 var(--space-4) var(--space-4);
    max-width: 768px;
    margin: 0 auto;
    width: 100%;
  }

  /* Suggestions */
  .suggestions {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-3);
    margin-bottom: var(--space-4);
    animation: fadeInUp 400ms ease;
  }

  .suggestion-chip {
    display: flex;
    align-items: flex-start;
    gap: var(--space-3);
    padding: var(--space-3) var(--space-4);
    background: var(--bg-surface);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-xl);
    text-align: left;
    transition: all var(--transition-fast);
    cursor: pointer;
  }

  .suggestion-chip:hover {
    background: var(--bg-hover);
    border-color: var(--border-hover);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  .suggestion-icon {
    font-size: 1.25rem;
    flex-shrink: 0;
    margin-top: 1px;
  }

  .suggestion-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .suggestion-title {
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--text-primary);
  }

  .suggestion-desc {
    font-size: var(--text-xs);
    color: var(--text-muted);
  }

  /* Input Container */
  .input-container {
    background: var(--bg-input);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-2xl);
    padding: var(--space-2);
    transition: all var(--transition-fast);
  }

  .input-container.focused {
    border-color: var(--border-hover);
    background: var(--bg-input-focus);
    box-shadow: 0 0 0 2px rgba(16, 163, 127, 0.08);
  }

  .input-wrapper {
    display: flex;
    align-items: flex-end;
    gap: var(--space-2);
  }

  .attach-btn {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-full);
    color: var(--text-muted);
    transition: all var(--transition-fast);
    flex-shrink: 0;
  }

  .attach-btn:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }

  .chat-textarea {
    flex: 1;
    resize: none;
    border: none;
    outline: none;
    background: transparent;
    font-size: var(--text-base);
    line-height: 1.5;
    color: var(--text-primary);
    padding: var(--space-2) 0;
    max-height: 200px;
    overflow-y: auto;
    font-family: var(--font-sans);
  }

  .chat-textarea::placeholder {
    color: var(--text-muted);
  }

  .send-btn {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-full);
    background: var(--text-muted);
    color: var(--bg-primary);
    transition: all var(--transition-fast);
    flex-shrink: 0;
    opacity: 0.3;
  }

  .send-btn.active {
    background: var(--text-primary);
    opacity: 1;
    cursor: pointer;
  }

  .send-btn.active:hover {
    background: white;
    transform: scale(1.05);
  }

  .send-btn svg:first-child {
    display: none;
  }

  .stop-icon {
    width: 14px;
    height: 14px;
    background: var(--bg-primary);
    border-radius: 2px;
  }

  /* Disclaimer */
  .input-disclaimer {
    text-align: center;
    font-size: var(--text-xs);
    color: var(--text-muted);
    margin-top: var(--space-2);
    padding: 0 var(--space-4);
  }

  @media (max-width: 768px) {
    .suggestions {
      grid-template-columns: 1fr;
    }

    .input-area {
      padding: 0 var(--space-3) var(--space-3);
    }
  }
</style>
