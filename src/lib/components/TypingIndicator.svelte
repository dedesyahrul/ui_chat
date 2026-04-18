<script>
  /**
   * TypingIndicator — Animated dots showing AI is generating a response
   */
</script>

<div class="typing-row">
  <div class="typing-container">
    <div class="typing-avatar">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <div class="typing-content">
      <span class="typing-label">AI Assistant</span>
      <div class="typing-dots">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
    </div>
  </div>
</div>

<style>
  .typing-row {
    padding: var(--space-4) 0;
    animation: fadeInUp 300ms ease;
  }

  .typing-container {
    max-width: 768px;
    margin: 0 auto;
    padding: 0 var(--space-6);
    display: flex;
    gap: var(--space-4);
  }

  .typing-avatar {
    width: 32px;
    height: 32px;
    border-radius: var(--radius-full);
    background: var(--brand-gradient);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    flex-shrink: 0;
    box-shadow: 0 0 12px rgba(16, 163, 127, 0.3);
    animation: pulse 1.5s ease-in-out infinite;
  }

  .typing-content {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .typing-label {
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--text-primary);
  }

  .typing-dots {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: var(--space-2) 0;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--text-muted);
    animation: typing-dot 1.4s ease-in-out infinite;
  }

  .dot:nth-child(2) {
    animation-delay: 0.2s;
  }

  .dot:nth-child(3) {
    animation-delay: 0.4s;
  }
</style>
