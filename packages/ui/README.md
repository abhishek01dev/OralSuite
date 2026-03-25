# @repo/ui

Shared React component library used by `@repo/admin` and `@repo/client`. All components are built with React 19, styled with Tailwind CSS utility classes, and fully typed with TypeScript.

## Installation

This package is a private workspace package — import it directly in any app that declares `@repo/ui` as a dependency:

```typescript
import { Button, Input, DataTable, Modal, Tooltip, Badge } from '@repo/ui';
```

## Components

---

### `Button`

A styled button with variant and size options. Extends all native `<button>` attributes.

```typescript
import { Button } from '@repo/ui';

<Button variant="primary" size="md" onClick={handleClick}>
  Save Changes
</Button>

<Button variant="danger" isLoading={isDeleting}>
  Delete
</Button>
```

| Prop        | Type                                              | Default     | Description                                                          |
| ----------- | ------------------------------------------------- | ----------- | -------------------------------------------------------------------- |
| `variant`   | `'primary' \| 'secondary' \| 'danger' \| 'ghost'` | `'primary'` | Visual style                                                         |
| `size`      | `'sm' \| 'md' \| 'lg'`                            | `'md'`      | Button size                                                          |
| `isLoading` | `boolean`                                         | `false`     | Shows a spinning loader and disables the button                      |
| `...rest`   | `ButtonHTMLAttributes`                            | —           | All standard button attributes (`onClick`, `disabled`, `type`, etc.) |

---

### `Input`

A form input field with optional label, error state, and help text. Extends all native `<input>` attributes.

```typescript
import { Input } from '@repo/ui';

<Input
  id="email"
  label="Email Address"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
  helpText="We'll never share your email."
/>
```

| Prop       | Type                  | Default | Description                                                                      |
| ---------- | --------------------- | ------- | -------------------------------------------------------------------------------- |
| `label`    | `string`              | —       | Label text rendered above the input                                              |
| `error`    | `string`              | —       | Error message — renders in red below the input and applies red border styling    |
| `helpText` | `string`              | —       | Help text rendered below the input (hidden when `error` is set)                  |
| `...rest`  | `InputHTMLAttributes` | —       | All standard input attributes (`type`, `value`, `onChange`, `placeholder`, etc.) |

---

### `DataTable<T>`

A generic, typed data table with loading skeleton and empty state. Renders an `overflow-x-auto` scrollable table. Supports optional row click handler.

```typescript
import { DataTable } from '@repo/ui';

const columns = [
  { key: 'name', header: 'Name' },
  { key: 'email', header: 'Email' },
  {
    key: 'status',
    header: 'Status',
    render: (user) => <Badge variant="success">{user.status}</Badge>,
  },
];

<DataTable
  columns={columns}
  data={users}
  isLoading={isLoading}
  emptyMessage="No users found"
  onRowClick={(user) => openEditModal(user)}
/>
```

| Prop           | Type                | Default           | Description                                   |
| -------------- | ------------------- | ----------------- | --------------------------------------------- |
| `columns`      | `Column<T>[]`       | —                 | Column definitions (see below)                |
| `data`         | `T[]`               | —                 | Array of row data objects                     |
| `isLoading`    | `boolean`           | `false`           | Shows animated skeleton rows                  |
| `emptyMessage` | `string`            | `'No data found'` | Message shown when `data` is empty            |
| `onRowClick`   | `(item: T) => void` | —                 | Optional row click handler; adds hover cursor |

**`Column<T>` definition:**

| Field       | Type                     | Description                                                                   |
| ----------- | ------------------------ | ----------------------------------------------------------------------------- |
| `key`       | `string`                 | Property name on `T` to render (used as cell content when `render` is absent) |
| `header`    | `string`                 | Column header label                                                           |
| `render`    | `(item: T) => ReactNode` | Optional custom cell renderer                                                 |
| `className` | `string`                 | Optional extra CSS classes for both `<th>` and `<td>`                         |

---

### `Modal`

An accessible modal dialog with keyboard dismiss (Escape key), click-outside dismiss, body scroll lock, and a close button.

```typescript
import { Modal } from '@repo/ui';

<Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Edit User"
  size="lg"
>
  <UserForm ... />
</Modal>
```

| Prop       | Type                           | Default | Description                                          |
| ---------- | ------------------------------ | ------- | ---------------------------------------------------- |
| `isOpen`   | `boolean`                      | —       | Controls visibility                                  |
| `onClose`  | `() => void`                   | —       | Called when backdrop is clicked or Escape is pressed |
| `title`    | `string`                       | —       | Modal header title                                   |
| `children` | `ReactNode`                    | —       | Modal body content                                   |
| `size`     | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'`  | Max width of the modal panel                         |

---

### `Tooltip`

A hover-activated tooltip that wraps any element.

```typescript
import { Tooltip } from '@repo/ui';

<Tooltip text="Delete this record" position="top">
  <button>🗑</button>
</Tooltip>
```

| Prop       | Type                                     | Default | Description                                    |
| ---------- | ---------------------------------------- | ------- | ---------------------------------------------- |
| `text`     | `string`                                 | —       | Tooltip label                                  |
| `children` | `ReactNode`                              | —       | The element that triggers the tooltip on hover |
| `position` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Tooltip placement relative to the trigger      |

---

### `Badge`

A small inline status pill for labeling states.

```typescript
import { Badge } from '@repo/ui';

<Badge variant="success">Active</Badge>
<Badge variant="error">Suspended</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="info">Trial</Badge>
```

| Prop        | Type                                                       | Default     | Description                |
| ----------- | ---------------------------------------------------------- | ----------- | -------------------------- |
| `variant`   | `'default' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'default'` | Color scheme               |
| `children`  | `ReactNode`                                                | —           | Badge label                |
| `className` | `string`                                                   | `''`        | Optional extra CSS classes |

| Variant   | Colors                              |
| --------- | ----------------------------------- |
| `default` | Gray background, dark gray text     |
| `success` | Green background, dark green text   |
| `warning` | Yellow background, dark yellow text |
| `error`   | Red background, dark red text       |
| `info`    | Blue background, dark blue text     |

## Scripts

```bash
# Build (tsc)
pnpm build

# Lint
pnpm lint
```
