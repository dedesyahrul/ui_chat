<script>
  /**
   * WelcomeScreen — Shown when a conversation has no messages
   */
</script>

<div class="welcome-screen">
  <div class="welcome-content">
    <!-- Animated logo -->
    <div class="welcome-logo">
      <div class="logo-ring logo-ring-outer"></div>
      <div class="logo-ring logo-ring-middle"></div>
      <div class="logo-ring logo-ring-inner"></div>
      <div class="logo-core">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
      </div>
    </div>

    <h1 class="welcome-title">What can I help with?</h1>
  </div>
</div>

<style>
  .welcome-screen {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--space-8);
    animation: fadeIn 600ms ease;
  }

  .welcome-content {
    text-align: center;
    max-width: 480px;
  }

  /* Animated Logo */
  .welcome-logo {
    width: 80px;
    height: 80px;
    margin: 0 auto var(--space-8);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .logo-ring {
    position: absolute;
    border-radius: 50%;
    border: 2px solid transparent;
  }

  .logo-ring-outer {
    width: 80px;
    height: 80px;
    border-top-color: #10a37f;
    border-right-color: transparent;
    border-bottom-color: transparent;
    border-left-color: #10a37f;
    animation: spin 3s linear infinite;
  }

  .logo-ring-middle {
    width: 60px;
    height: 60px;
    border-top-color: transparent;
    border-right-color: #6366f1;
    border-bottom-color: #6366f1;
    border-left-color: transparent;
    animation: spin 2s linear infinite reverse;
  }

  .logo-ring-inner {
    width: 40px;
    height: 40px;
    border-top-color: #0ea5e9;
    border-right-color: transparent;
    border-bottom-color: transparent;
    border-left-color: #0ea5e9;
    animation: spin 1.5s linear infinite;
  }

  .logo-core {
    z-index: 1;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: pulse 2s ease-in-out infinite;
  }

  /* Title */
  .welcome-title {
    font-size: var(--text-3xl);
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: var(--space-3);
    letter-spacing: -0.02em;
  }
</style>
