<script>
  import { chatStore } from '../stores/chatStore.svelte.js';
</script>

{#if chatStore.showModelSelector}
  <div class="model-backdrop" onclick={() => chatStore.toggleModelSelector()} role="presentation"></div>
{/if}

<div class="model-selector-wrapper">
  <button class="model-trigger" onclick={() => chatStore.toggleModelSelector()} id="btn-model-selector">
    <span class="model-name">{chatStore.selectedModel}</span>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="chevron" class:open={chatStore.showModelSelector}>
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  </button>

  {#if chatStore.showModelSelector}
    <div class="model-dropdown" role="listbox" id="model-dropdown">
      <div class="dropdown-header">
        <span class="dropdown-title">Model</span>
      </div>
      <div class="dropdown-list">
        {#each chatStore.models as model (model.id)}
          <button
            class="model-option"
            class:selected={chatStore.selectedModel === model.id}
            onclick={() => chatStore.setModel(model.id)}
            role="option"
            id="model-{model.id}"
          >
            <span class="model-icon">{model.icon}</span>
            <div class="model-info">
              <div class="model-option-name">
                {model.name}
                {#if model.badge}
                  <span class="model-badge" class:badge-new={model.badge === 'New'}>{model.badge}</span>
                {/if}
              </div>
              <span class="model-desc">{model.desc}</span>
            </div>
            {#if chatStore.selectedModel === model.id}
              <svg class="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            {/if}
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .model-selector-wrapper {
    position: relative;
  }

  .model-trigger {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-lg);
    transition: all var(--transition-fast);
    cursor: pointer;
  }

  .model-trigger:hover {
    background: var(--bg-hover);
  }

  .model-name {
    font-size: var(--text-lg);
    font-weight: 600;
    color: var(--text-primary);
  }

  .chevron {
    color: var(--text-muted);
    transition: transform var(--transition-fast);
  }

  .chevron.open {
    transform: rotate(180deg);
  }

  .model-backdrop {
    position: fixed;
    inset: 0;
    z-index: 99;
  }

  .model-dropdown {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    width: 320px;
    background: var(--bg-surface-elevated);
    border: 1px solid var(--border-light);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-xl);
    overflow: hidden;
    z-index: 100;
    animation: fadeInScale 200ms ease;
  }

  .dropdown-header {
    padding: var(--space-3) var(--space-4);
    border-bottom: 1px solid var(--border-default);
  }

  .dropdown-title {
    font-size: var(--text-xs);
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .dropdown-list {
    padding: var(--space-2);
    max-height: 400px;
    overflow-y: auto;
  }

  .model-option {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    width: 100%;
    padding: var(--space-3);
    border-radius: var(--radius-md);
    transition: all var(--transition-fast);
    cursor: pointer;
  }

  .model-option:hover {
    background: var(--bg-hover);
  }

  .model-option.selected {
    background: rgba(16, 163, 127, 0.08);
  }

  .model-icon {
    font-size: 1.25rem;
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-tertiary);
    border-radius: var(--radius-md);
  }

  .model-info {
    flex: 1;
    min-width: 0;
    text-align: left;
  }

  .model-option-name {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--text-primary);
  }

  .model-badge {
    font-size: 10px;
    padding: 1px 6px;
    border-radius: var(--radius-full);
    background: var(--bg-tertiary);
    color: var(--text-muted);
    font-weight: 500;
  }

  .badge-new {
    background: rgba(16, 163, 127, 0.15);
    color: var(--brand-primary);
  }

  .model-desc {
    font-size: var(--text-xs);
    color: var(--text-muted);
  }

  .check-icon {
    color: var(--brand-primary);
    flex-shrink: 0;
  }
</style>
