/**
 * Chat Store — Centralized state management for the chat application
 * Uses Svelte 5 runes-compatible reactive state
 */

// Generate unique IDs
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// Format timestamp
function formatTime(date) {
  return new Intl.DateTimeFormat('en', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

function formatDate(date) {
  const now = new Date();
  const diff = now - date;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return 'Previous 7 Days';
  if (days < 30) return 'Previous 30 Days';
  return date.toLocaleDateString('en', { month: 'long', year: 'numeric' });
}

// AI Response simulation data
const AI_RESPONSES = [
  {
    text: `That's a great question! Let me break it down for you.

**Key Points:**

1. **Architecture** — The system uses a modular design pattern that separates concerns into distinct layers
2. **Performance** — Optimized for real-time processing with event-driven architecture
3. **Scalability** — Built to handle growing workloads through horizontal scaling

Here's a simple example:

\`\`\`javascript
const processRequest = async (input) => {
  const validated = await validate(input);
  const result = await transform(validated);
  return formatResponse(result);
};
\`\`\`

Would you like me to elaborate on any of these points?`,
  },
  {
    text: `I'd be happy to help with that! Here's what I recommend:

## Step-by-Step Guide

### 1. Setup Your Environment
First, make sure you have the prerequisites installed. You'll need Node.js 18+ and a package manager.

### 2. Configure the Project
Create a configuration file with the following structure:

\`\`\`json
{
  "name": "my-project",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  }
}
\`\`\`

### 3. Start Development
Run the development server and start building:

\`\`\`bash
npm run dev
\`\`\`

> **Pro tip:** Enable hot module replacement for a faster development experience.

Let me know if you need help with any specific step!`,
  },
  {
    text: `Excellent question! Let me provide a comprehensive answer.

The difference between these approaches comes down to **trade-offs**:

| Feature | Approach A | Approach B |
|---------|-----------|-----------|
| Speed | ⚡ Fast | 🐢 Slower |
| Memory | 📈 Higher | 📉 Lower |
| Complexity | 🔧 Simple | 🔩 Complex |
| Scalability | ✅ Good | ✅ Excellent |

**My recommendation:** Start with *Approach A* for prototyping, then migrate to *Approach B* when you need to optimize for production.

Here's the key insight — both approaches are valid, but choosing the right one depends on your specific requirements:

- If you prioritize **development speed** → Go with A
- If you prioritize **runtime performance** → Go with B
- If you need **both** → Consider a hybrid approach

Would you like me to dive deeper into any of these?`,
  },
  {
    text: `Here's a detailed explanation with a practical example:

## Understanding the Concept

Think of it like a **pipeline** — data flows through each stage, getting transformed along the way:

\`\`\`
Input → Validate → Process → Transform → Output
\`\`\`

### Implementation

\`\`\`python
class DataPipeline:
    def __init__(self):
        self.stages = []
    
    def add_stage(self, stage):
        self.stages.append(stage)
        return self
    
    def execute(self, data):
        result = data
        for stage in self.stages:
            result = stage.process(result)
        return result

# Usage
pipeline = DataPipeline()
pipeline.add_stage(ValidateStage())
pipeline.add_stage(TransformStage())
pipeline.add_stage(OutputStage())

result = pipeline.execute(raw_data)
\`\`\`

### Key Benefits
- 🔄 **Reusable** — Each stage can be used independently
- 🧪 **Testable** — Easy to unit test each stage
- 📦 **Composable** — Mix and match stages as needed

Does this help clarify the concept?`,
  },
  {
    text: `Great question! Let me walk you through this step by step.

## The Short Answer
Yes, it's absolutely possible and actually quite straightforward once you understand the underlying mechanism.

## The Detailed Explanation

The core idea relies on three fundamental principles:

1. **Immutability** — Never modify the original data directly
2. **Composition** — Build complex operations from simple ones  
3. **Declarative style** — Describe *what* you want, not *how* to get it

### Real-world Example

\`\`\`typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
}

const filterByRole = (users: User[], role: string): User[] =>
  users.filter(user => user.role === role);

const formatNames = (users: User[]): string[] =>
  users.map(user => \`\${user.name} (\${user.email})\`);

// Compose operations
const getAdminNames = (users: User[]): string[] =>
  formatNames(filterByRole(users, 'admin'));
\`\`\`

### Performance Considerations
- Use **lazy evaluation** for large datasets
- Consider **memoization** for repeated computations  
- Profile before optimizing — premature optimization is the root of all evil! 🎯

Anything else you'd like to explore?`,
  },
];

// Create the chat store
function createChatStore() {
  // Default conversations
  const defaultConversations = [
    {
      id: 'welcome',
      title: 'Welcome to AI Chat',
      messages: [
        {
          id: 'msg-welcome',
          role: 'assistant',
          content: `Hello! 👋 I'm your AI assistant, ready to help you with anything you need.

I can help you with:
- 💻 **Coding** — Write, debug, and explain code
- 📝 **Writing** — Draft, edit, and improve text
- 🔬 **Analysis** — Break down complex topics
- 🎨 **Creative** — Generate ideas and content
- 📊 **Data** — Analyze and visualize information

What would you like to explore today?`,
          timestamp: new Date(),
        },
      ],
      createdAt: new Date(),
      model: 'GPT-4o',
    },
  ];

  let conversations = $state(defaultConversations);
  let activeConversationId = $state('welcome');
  let isLoading = $state(false);
  let sidebarOpen = $state(true);
  let selectedModel = $state('GPT-4o');
  let searchQuery = $state('');
  let showModelSelector = $state(false);
  let showSettings = $state(false);

  const models = [
    { id: 'GPT-4o', name: 'GPT-4o', desc: 'Great for most tasks', icon: '✨', badge: 'Recommended' },
    { id: 'GPT-4o-mini', name: 'GPT-4o mini', desc: 'Fastest model', icon: '⚡', badge: 'Fast' },
    { id: 'GPT-4-turbo', name: 'GPT-4 Turbo', desc: 'Complex reasoning', icon: '🧠', badge: 'Advanced' },
    { id: 'o1-preview', name: 'o1-preview', desc: 'Deep thinking', icon: '🔮', badge: 'New' },
    { id: 'o1-mini', name: 'o1-mini', desc: 'Fast reasoning', icon: '💡', badge: '' },
    { id: 'DALL-E 3', name: 'DALL·E 3', desc: 'Image generation', icon: '🎨', badge: '' },
  ];

  // Derived state
  const activeConversation = $derived(
    conversations.find((c) => c.id === activeConversationId) || conversations[0]
  );

  const filteredConversations = $derived(() => {
    if (!searchQuery) return conversations;
    const q = searchQuery.toLowerCase();
    return conversations.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.messages.some((m) => m.content.toLowerCase().includes(q))
    );
  });

  const groupedConversations = $derived(() => {
    const convos = searchQuery ? filteredConversations() : conversations;
    const groups = {};

    convos.forEach((conv) => {
      const group = formatDate(conv.createdAt);
      if (!groups[group]) groups[group] = [];
      groups[group].push(conv);
    });

    return groups;
  });

  function setActiveConversation(id) {
    activeConversationId = id;
  }

  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
  }

  function setSearchQuery(q) {
    searchQuery = q;
  }

  function setModel(modelId) {
    selectedModel = modelId;
    showModelSelector = false;
  }

  function toggleModelSelector() {
    showModelSelector = !showModelSelector;
  }

  function toggleSettings() {
    showSettings = !showSettings;
  }

  function createNewConversation() {
    const newConv = {
      id: generateId(),
      title: 'New conversation',
      messages: [],
      createdAt: new Date(),
      model: selectedModel,
    };
    conversations = [newConv, ...conversations];
    activeConversationId = newConv.id;
    return newConv;
  }

  function deleteConversation(id) {
    conversations = conversations.filter((c) => c.id !== id);
    if (activeConversationId === id) {
      activeConversationId = conversations[0]?.id || null;
      if (!conversations.length) {
        createNewConversation();
      }
    }
  }

  function renameConversation(id, newTitle) {
    conversations = conversations.map((c) =>
      c.id === id ? { ...c, title: newTitle } : c
    );
  }

  async function sendMessage(content) {
    if (!content.trim() || isLoading) return;

    // If no conversation exists, create one
    if (!activeConversation) {
      createNewConversation();
    }

    const userMessage = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    // Add user message  
    conversations = conversations.map((c) => {
      if (c.id === activeConversationId) {
        const updated = { ...c, messages: [...c.messages, userMessage] };
        // Auto-title from first user message
        if (c.messages.filter((m) => m.role === 'user').length === 0) {
          updated.title = content.trim().substring(0, 40) + (content.length > 40 ? '...' : '');
        }
        return updated;
      }
      return c;
    });

    isLoading = true;

    // Simulate AI response with realistic delay
    const responseDelay = 800 + Math.random() * 2000;
    const aiResponse = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];

    await new Promise((resolve) => setTimeout(resolve, responseDelay));

    const assistantMessage = {
      id: generateId(),
      role: 'assistant',
      content: aiResponse.text,
      timestamp: new Date(),
      model: selectedModel,
    };

    conversations = conversations.map((c) => {
      if (c.id === activeConversationId) {
        return { ...c, messages: [...c.messages, assistantMessage] };
      }
      return c;
    });

    isLoading = false;
  }

  return {
    get conversations() { return conversations; },
    get activeConversation() { return activeConversation; },
    get activeConversationId() { return activeConversationId; },
    get isLoading() { return isLoading; },
    get sidebarOpen() { return sidebarOpen; },
    get selectedModel() { return selectedModel; },
    get searchQuery() { return searchQuery; },
    get showModelSelector() { return showModelSelector; },
    get showSettings() { return showSettings; },
    get models() { return models; },
    get groupedConversations() { return groupedConversations(); },
    get filteredConversations() { return filteredConversations(); },
    setActiveConversation,
    toggleSidebar,
    setSearchQuery,
    setModel,
    toggleModelSelector,
    toggleSettings,
    createNewConversation,
    deleteConversation,
    renameConversation,
    sendMessage,
  };
}

export const chatStore = createChatStore();
