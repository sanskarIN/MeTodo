# MeTodo - API Integration Guide

## =============================================================================
## (c) Copyright Sanskar Yadav. All rights reserved.
## Made by Sanskar Yadav.
## =============================================================================

## FILE PURPOSE
This comprehensive guide explains how to integrate external APIs with MeTodo, including authentication, data synchronization, and error handling.

---

## Table of Contents

1. [API Architecture](#api-architecture)
2. [REST API Integration](#rest-api-integration)
3. [GraphQL Integration](#graphql-integration)
4. [Authentication](#authentication)
5. [Data Synchronization](#data-synchronization)
6. [Error Handling](#error-handling)
7. [Rate Limiting](#rate-limiting)

---

## API Architecture

### API Client Setup

```typescript
// lib/_core/api.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptors
apiClient.interceptors.request.use((config) => {
  // Add auth token
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors
    if (error.response?.status === 401) {
      // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

---

## REST API Integration

### GET Requests

```typescript
// Fetch tasks
async function fetchTasks() {
  try {
    const response = await apiClient.get('/tasks');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    throw error;
  }
}

// Fetch with parameters
async function fetchTasksByCategory(categoryId: string) {
  try {
    const response = await apiClient.get('/tasks', {
      params: {
        category: categoryId,
        limit: 50,
        offset: 0,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    throw error;
  }
}
```

### POST Requests

```typescript
// Create task
async function createTask(task: Task) {
  try {
    const response = await apiClient.post('/tasks', task);
    return response.data;
  } catch (error) {
    console.error('Failed to create task:', error);
    throw error;
  }
}
```

### PUT/PATCH Requests

```typescript
// Update task
async function updateTask(id: string, updates: Partial<Task>) {
  try {
    const response = await apiClient.patch(`/tasks/${id}`, updates);
    return response.data;
  } catch (error) {
    console.error('Failed to update task:', error);
    throw error;
  }
}
```

### DELETE Requests

```typescript
// Delete task
async function deleteTask(id: string) {
  try {
    await apiClient.delete(`/tasks/${id}`);
  } catch (error) {
    console.error('Failed to delete task:', error);
    throw error;
  }
}
```

---

## GraphQL Integration

### Setup Apollo Client

```typescript
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({
    uri: process.env.REACT_APP_GRAPHQL_URL,
    credentials: 'include',
  }),
  cache: new InMemoryCache(),
});
```

### GraphQL Queries

```typescript
import { gql, useQuery } from '@apollo/client';

const GET_TASKS = gql`
  query GetTasks($limit: Int!, $offset: Int!) {
    tasks(limit: $limit, offset: $offset) {
      id
      title
      completed
      priority
      dueDate
    }
  }
`;

function TaskList() {
  const { data, loading, error } = useQuery(GET_TASKS, {
    variables: { limit: 50, offset: 0 },
  });
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return <TaskListView tasks={data.tasks} />;
}
```

### GraphQL Mutations

```typescript
import { gql, useMutation } from '@apollo/client';

const CREATE_TASK = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      id
      title
      completed
    }
  }
`;

function CreateTaskForm() {
  const [createTask] = useMutation(CREATE_TASK);
  
  const handleSubmit = async (formData) => {
    try {
      const { data } = await createTask({
        variables: {
          input: formData,
        },
      });
      console.log('Task created:', data.createTask);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };
  
  return <Form onSubmit={handleSubmit} />;
}
```

---

## Authentication

### Token Management

```typescript
// lib/_core/auth.ts
import * as SecureStore from 'expo-secure-store';

async function saveToken(token: string) {
  await SecureStore.setItemAsync('authToken', token);
}

async function getToken() {
  return await SecureStore.getItemAsync('authToken');
}

async function removeToken() {
  await SecureStore.deleteItemAsync('authToken');
}
```

### OAuth Integration

```typescript
// OAuth flow
async function handleOAuthCallback(code: string) {
  try {
    const response = await apiClient.post('/auth/callback', { code });
    const { token } = response.data;
    
    // Save token
    await saveToken(token);
    
    // Update auth state
    setAuthToken(token);
    
    // Redirect to home
    router.replace('/');
  } catch (error) {
    console.error('OAuth failed:', error);
  }
}
```

---

## Data Synchronization

### Sync Strategy

```typescript
// Sync tasks with server
async function syncTasks() {
  try {
    // Get local tasks
    const localTasks = await getLocalTasks();
    
    // Get server tasks
    const serverTasks = await fetchTasks();
    
    // Merge data
    const merged = mergeData(localTasks, serverTasks);
    
    // Save merged data
    await saveLocalTasks(merged);
    
    // Update UI
    setTasks(merged);
  } catch (error) {
    console.error('Sync failed:', error);
  }
}

// Periodic sync
useEffect(() => {
  const interval = setInterval(syncTasks, 5 * 60 * 1000); // 5 minutes
  
  return () => clearInterval(interval);
}, []);
```

### Conflict Resolution

```typescript
// Merge local and server data
function mergeData(local: Task[], server: Task[]) {
  const merged = new Map();
  
  // Add server data
  server.forEach(task => {
    merged.set(task.id, task);
  });
  
  // Merge local changes
  local.forEach(task => {
    const existing = merged.get(task.id);
    if (!existing || task.updatedAt > existing.updatedAt) {
      merged.set(task.id, task);
    }
  });
  
  return Array.from(merged.values());
}
```

---

## Error Handling

### Error Types

```typescript
interface ApiError {
  code: string;
  message: string;
  status: number;
  details?: Record<string, unknown>;
}

// Network error
if (error.code === 'ECONNREFUSED') {
  // Handle offline
}

// Authentication error
if (error.response?.status === 401) {
  // Redirect to login
}

// Validation error
if (error.response?.status === 400) {
  // Show validation errors
}

// Server error
if (error.response?.status >= 500) {
  // Show error message
}
```

### Retry Logic

```typescript
async function retryRequest(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      // Exponential backoff
      const delay = Math.pow(2, i) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Usage
const tasks = await retryRequest(() => fetchTasks());
```

---

## Rate Limiting

### Rate Limit Handling

```typescript
// Check rate limit headers
apiClient.interceptors.response.use((response) => {
  const remaining = response.headers['x-ratelimit-remaining'];
  const reset = response.headers['x-ratelimit-reset'];
  
  if (remaining && parseInt(remaining) === 0) {
    console.warn(`Rate limited. Reset at ${new Date(parseInt(reset) * 1000)}`);
  }
  
  return response;
});
```

### Request Queuing

```typescript
// Queue requests when rate limited
class RequestQueue {
  private queue: Array<() => Promise<any>> = [];
  private isProcessing = false;
  
  async add(fn: () => Promise<any>) {
    this.queue.push(fn);
    this.process();
  }
  
  private async process() {
    if (this.isProcessing || this.queue.length === 0) return;
    
    this.isProcessing = true;
    
    while (this.queue.length > 0) {
      const fn = this.queue.shift();
      try {
        await fn();
      } catch (error) {
        console.error('Request failed:', error);
      }
      
      // Wait before next request
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    this.isProcessing = false;
  }
}
```

---

**Last Updated:** June 29, 2026  
**Version:** 1.0.0

Made with ❤️ by Sanskar Yadav

---

**Need help? Email us at supportramsandesh@gmail.com**
