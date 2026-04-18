<script>
  import Sidebar from './lib/components/Sidebar.svelte';
  import ChatArea from './lib/components/ChatArea.svelte';
  import SettingsModal from './lib/components/SettingsModal.svelte';
</script>

<div class="app-container" id="app-root">
  <Sidebar />
  <ChatArea />
  <SettingsModal />
</div>

<style>
  .app-container {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    position: relative;
    background: var(--bg-primary);
  }
</style>
