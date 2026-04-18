<script>
  /**
   * MessageBubble — Renders a single chat message with markdown-like formatting
   * User messages appear on the RIGHT, AI messages on the LEFT (like ChatGPT)
   */
  let { message } = $props();

  // Simple markdown parser
  function parseMarkdown(text) {
    let html = text;

    // Code blocks with language
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
      const language = lang || 'text';
      return `<div class="code-block"><div class="code-header"><span class="code-lang">${language}</span><button class="copy-code-btn" onclick="navigator.clipboard.writeText(this.closest('.code-block').querySelector('code').textContent)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy</button></div><pre><code>${escapeHtml(code.trim())}</code></pre></div>`;
    });

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

    // Headers
    html = html.replace(/^### (.+)$/gm, '<h4>$1</h4>');
    html = html.replace(/^## (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^# (.+)$/gm, '<h2>$1</h2>');

    // Bold & Italic
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Blockquote
    html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');

    // Process tables
    const lines = html.split('\n');
    let inTable = false;
    let tableHtml = '';
    let processedLines = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('|') && line.endsWith('|')) {
        if (!inTable) {
          inTable = true;
          tableHtml = '<div class="table-wrapper"><table>';
        }
        const cells = line.split('|').filter(c => c.trim() !== '');
        if (cells.every(c => c.trim().match(/^[-:]+$/))) {
          continue;
        }
        const firstDataRow = tableHtml.indexOf('<tr>') === -1;
        tableHtml += '<tr>' + cells.map(c => `<${firstDataRow ? 'th' : 'td'}>${c.trim()}</${firstDataRow ? 'th' : 'td'}>`).join('') + '</tr>';
      } else {
        if (inTable) {
          inTable = false;
          tableHtml += '</table></div>';
          processedLines.push(tableHtml);
          tableHtml = '';
        }
        processedLines.push(line);
      }
    }
    if (inTable) {
      tableHtml += '</table></div>';
      processedLines.push(tableHtml);
    }
    html = processedLines.join('\n');

    // Unordered lists
    html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

    // Ordered lists
    html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

    // Horizontal rule
    html = html.replace(/^---$/gm, '<hr/>');

    // Line breaks -> paragraphs
    html = html.replace(/\n\n/g, '</p><p>');
    html = html.replace(/\n/g, '<br/>');

    if (!html.startsWith('<')) {
      html = '<p>' + html + '</p>';
    }

    return html;
  }

  function escapeHtml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatTimestamp(date) {
    return new Intl.DateTimeFormat('en', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  }

  let copied = $state(false);

  function copyMessage() {
    navigator.clipboard.writeText(message.content);
    copied = true;
    setTimeout(() => { copied = false; }, 2000);
  }
</script>

<div class="message-row {message.role}" id="msg-{message.id}">
  {#if message.role === 'user'}
    <!-- USER MESSAGE — RIGHT SIDE BUBBLE -->
    <div class="message-container user-container">
      <div class="user-bubble">
        <p class="user-text">{message.content}</p>
      </div>
      <div class="message-avatar">
        <div class="avatar-user">
          <span>D</span>
        </div>
      </div>
    </div>
  {:else}
    <!-- ASSISTANT MESSAGE — LEFT SIDE -->
    <div class="message-container assistant-container">
      <div class="message-avatar">
        <div class="avatar-ai">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>

      <div class="message-content">
        <div class="message-header">
          <span class="message-author">AI Assistant</span>
          {#if message.model}
            <span class="message-model">{message.model}</span>
          {/if}
        </div>

        <div class="message-body">
          {@html parseMarkdown(message.content)}
        </div>

        <!-- Message actions -->
        <div class="message-actions">
          <button class="msg-action-btn" onclick={copyMessage} title={copied ? 'Copied!' : 'Copy'}>
            {#if copied}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            {:else}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
            {/if}
          </button>
          <button class="msg-action-btn" title="Good response">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M7 10v12"/>
              <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/>
            </svg>
          </button>
          <button class="msg-action-btn" title="Bad response">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 14V2"/>
              <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z"/>
            </svg>
          </button>
          <button class="msg-action-btn" title="Regenerate">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .message-row {
    padding: var(--space-3) 0;
    animation: fadeInUp 300ms ease;
  }

  /* ============================================
     SHARED CONTAINER
     ============================================ */
  .message-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 var(--space-6);
    display: flex;
    gap: var(--space-3);
  }

  /* ============================================
     USER MESSAGE — RIGHT ALIGNED BUBBLE
     ============================================ */
  .user-container {
    justify-content: flex-end;
  }

  .user-bubble {
    max-width: 70%;
    padding: var(--space-3) var(--space-5);
    background: linear-gradient(135deg, #2563eb, #3b82f6);
    border-radius: var(--radius-2xl) var(--radius-2xl) var(--radius-sm) var(--radius-2xl);
    box-shadow: 0 2px 12px rgba(37, 99, 235, 0.25);
    animation: fadeInScale 250ms ease;
  }

  .user-text {
    font-size: var(--text-base);
    line-height: 1.6;
    color: #ffffff;
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  .user-container .message-avatar {
    flex-shrink: 0;
    align-self: flex-end;
  }

  /* ============================================
     ASSISTANT MESSAGE — LEFT ALIGNED
     ============================================ */
  .assistant-container {
    justify-content: flex-start;
  }

  .assistant-container .message-avatar {
    flex-shrink: 0;
    padding-top: 2px;
  }

  .message-content {
    flex: 1;
    min-width: 0;
    max-width: 75%;
  }

  /* ============================================
     AVATARS
     ============================================ */
  .avatar-ai {
    width: 34px;
    height: 34px;
    border-radius: var(--radius-full);
    background: var(--brand-gradient);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: 0 0 14px rgba(16, 163, 127, 0.3);
  }

  .avatar-user {
    width: 34px;
    height: 34px;
    border-radius: var(--radius-full);
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    font-size: var(--text-sm);
  }

  /* ============================================
     MESSAGE HEADER & BODY (ASSISTANT)
     ============================================ */
  .message-header {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    margin-bottom: var(--space-2);
  }

  .message-author {
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--text-primary);
  }

  .message-model {
    font-size: var(--text-xs);
    color: var(--text-muted);
    background: var(--bg-tertiary);
    padding: 1px 6px;
    border-radius: var(--radius-full);
  }

  .message-body {
    font-size: var(--text-base);
    line-height: 1.7;
    color: var(--text-primary);
    background: var(--bg-surface);
    padding: var(--space-4) var(--space-5);
    border-radius: var(--radius-sm) var(--radius-2xl) var(--radius-2xl) var(--radius-2xl);
    border: 1px solid var(--border-default);
  }

  .message-body :global(p) {
    margin-bottom: var(--space-3);
  }

  .message-body :global(p:last-child) {
    margin-bottom: 0;
  }

  .message-body :global(h2) {
    font-size: var(--text-xl);
    font-weight: 700;
    margin: var(--space-5) 0 var(--space-3);
    color: var(--text-primary);
  }

  .message-body :global(h3) {
    font-size: var(--text-lg);
    font-weight: 600;
    margin: var(--space-4) 0 var(--space-2);
    color: var(--text-primary);
  }

  .message-body :global(h4) {
    font-size: var(--text-md);
    font-weight: 600;
    margin: var(--space-3) 0 var(--space-2);
    color: var(--text-primary);
  }

  .message-body :global(strong) {
    font-weight: 600;
    color: var(--text-primary);
  }

  .message-body :global(em) {
    color: var(--text-secondary);
    font-style: italic;
  }

  .message-body :global(ul),
  .message-body :global(ol) {
    padding-left: var(--space-5);
    margin-bottom: var(--space-3);
  }

  .message-body :global(li) {
    margin-bottom: var(--space-1);
    position: relative;
    list-style: disc;
  }

  .message-body :global(blockquote) {
    border-left: 3px solid var(--brand-primary);
    padding: var(--space-2) var(--space-4);
    margin: var(--space-3) 0;
    background: rgba(16, 163, 127, 0.05);
    border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
    color: var(--text-secondary);
    font-style: italic;
  }

  .message-body :global(hr) {
    border: none;
    border-top: 1px solid var(--border-default);
    margin: var(--space-4) 0;
  }

  /* Code blocks */
  .message-body :global(.code-block) {
    margin: var(--space-4) 0;
    border-radius: var(--radius-md);
    overflow: hidden;
    border: 1px solid var(--border-default);
    background: #1a1a2e;
  }

  .message-body :global(.code-header) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-2) var(--space-4);
    background: rgba(255, 255, 255, 0.05);
    border-bottom: 1px solid var(--border-default);
  }

  .message-body :global(.code-lang) {
    font-size: var(--text-xs);
    color: var(--text-muted);
    font-family: var(--font-mono);
    text-transform: lowercase;
  }

  .message-body :global(.copy-code-btn) {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    padding: var(--space-1) var(--space-2);
    border-radius: var(--radius-sm);
    font-size: var(--text-xs);
    color: var(--text-muted);
    background: none;
    border: none;
    cursor: pointer;
    font-family: var(--font-sans);
    transition: all var(--transition-fast);
  }

  .message-body :global(.copy-code-btn:hover) {
    background: rgba(255, 255, 255, 0.1);
    color: var(--text-primary);
  }

  .message-body :global(pre) {
    padding: var(--space-4);
    overflow-x: auto;
  }

  .message-body :global(code) {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    line-height: 1.6;
    color: #e2e8f0;
  }

  .message-body :global(.inline-code) {
    background: rgba(255,255,255,0.08);
    padding: 1px 5px;
    border-radius: var(--radius-sm);
    font-size: 0.875em;
    color: #f0abfc;
    border: 1px solid rgba(255,255,255,0.1);
  }

  /* Tables */
  .message-body :global(.table-wrapper) {
    overflow-x: auto;
    margin: var(--space-4) 0;
    border-radius: var(--radius-md);
    border: 1px solid var(--border-default);
  }

  .message-body :global(table) {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--text-sm);
  }

  .message-body :global(th) {
    background: var(--bg-tertiary);
    padding: var(--space-2) var(--space-3);
    text-align: left;
    font-weight: 600;
    color: var(--text-primary);
    border-bottom: 1px solid var(--border-default);
  }

  .message-body :global(td) {
    padding: var(--space-2) var(--space-3);
    border-bottom: 1px solid var(--border-default);
    color: var(--text-secondary);
  }

  .message-body :global(tr:last-child td) {
    border-bottom: none;
  }

  /* ============================================
     MESSAGE ACTIONS (ASSISTANT ONLY)
     ============================================ */
  .message-actions {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    margin-top: var(--space-2);
    padding-left: var(--space-1);
    opacity: 0;
    transition: opacity var(--transition-fast);
  }

  .message-row:hover .message-actions {
    opacity: 1;
  }

  .msg-action-btn {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-sm);
    color: var(--text-muted);
    transition: all var(--transition-fast);
  }

  .msg-action-btn:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }

  /* ============================================
     RESPONSIVE
     ============================================ */
  @media (max-width: 768px) {
    .message-container {
      padding: 0 var(--space-3);
    }

    .user-bubble {
      max-width: 85%;
    }

    .message-content {
      max-width: 85%;
    }
  }
</style>
