# Frontend V3 Project

This document provides an overview of the project architecture, coding standards, and guidelines for new developers joining the team.

## 🏗️ Project Architecture

### Tech Stack

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - UI components based on Radix UI
- **React Query** - Data fetching and state management
- **React Hook Form** - Form handling with Zod validation
- **Axios** - HTTP client

### Directory Structure

```
./
├── app/                    # Next.js App Router pages and routes
│   ├── (default)/          # Main application routes
│   ├── dashboard-demo/     # Dashboard demo pages
│   ├── fonts/              # Font assets
│   ├── globals.css         # Global CSS
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Root page
│   └── preview/            # Preview pages
├── components/             # Global UI components
│   ├── ui/                 # Reusable UI components (shadcn/ui)
│   └── ...                 # Application-specific components
├── hooks/                  # Global custom hooks
├── lib/                    # Utility functions and libraries
├── public/                 # Static assets
└── src/                    # Source code
    ├── common/             # Common utilities, components, and types
    │   ├── components/     # Shared components
    │   ├── constants.ts    # Shared constants
    │   ├── helper/         # Helper functions
    │   ├── hooks/          # Shared hooks
    │   └── types.ts        # Shared TypeScript types
    ├── core/               # Core functionality
    │   └── api/            # API client setup
    └── modules/            # Feature modules
        ├── masterdata/     # Master data management features
        ├── preview/        # Preview features
        ├── settings/       # Settings features
        └── train-schedules/# Train schedule features
```

## 📋 Coding Conventions

### Module Organization

Each feature module follows a consistent structure:

```
modules/[module-name]/
├── components/            # Module-specific components
├── hooks/                 # React Query hooks and other custom hooks
│   ├── useMutationCreate[Entity].tsx
│   ├── useMutationDelete[Entity].tsx
│   ├── useMutationUpdate[Entity].tsx
│   ├── useQueryGet[Entity].tsx
│   └── useQueryGet[Entities].tsx
├── services/              # API service functions
│   └── [entity].ts
├── columns.tsx            # Table column definitions
├── types.ts               # TypeScript types for the module
└── schema.ts              # Zod validation schemas (optional)
```

### Naming Conventions

- **Components**: PascalCase (e.g., `TableFilter.tsx`)
- **Hooks**: camelCase starting with "use" (e.g., `useQueryGetCategories.tsx`)
- **Services**: camelCase (e.g., `category.ts`)
- **Types**: PascalCase for interfaces and types (e.g., `CategoryType`)
- **Files**: kebab-case for UI components and utilities (e.g., `alert-dialog.tsx`)

### API Pattern

- API calls are isolated in service files
- React Query is used for data fetching and mutations
- Custom hooks wrap React Query functionality

Example:

```typescript
// services/category.ts
export const getCategories = async (): Promise<CategoryType[]> => {
  const response = await axiosInstance.get("/categories");
  return response.data;
};

// hooks/useQueryGetCategories.tsx
export const useQueryGetCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
};
```

### Component Structure

Components follow a consistent structure:

1. Import statements
2. Type definitions
3. Component definition
4. Export statement

Example:

```tsx
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ExampleProps {
  title: string;
}

export function Example({ title }: ExampleProps) {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>{title}</h1>
      <p>Count: {count}</p>
      <Button onClick={() => setCount(count + 1)}>Increment</Button>
    </div>
  );
}
```

### Form Handling

Forms use React Hook Form with Zod validation:

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

type FormValues = z.infer<typeof formSchema>;

export function ExampleForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    // Handle form submission
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>{/* Form fields */}</form>
  );
}
```

## 🔄 Development Workflow

1. **Feature Development**:

   - Create a new branch for your feature
   - Follow the existing patterns for the module you're working on
   - Ensure components are typed correctly
   - Use existing UI components from shadcn/ui when possible

2. **Code Quality**:

   - Run linting before committing (`npm run lint`)
   - Ensure TypeScript types are properly defined
   - Follow existing naming conventions

3. **Testing**:
   - Test your changes in development mode
   - Verify all CRUD operations work as expected
   - Check for responsive design issues

## 🧩 Key Concepts

### Page Structure

Pages follow the Next.js App Router convention. For a typical CRUD feature:

- **List Page**: `/app/(default)/[module]/page.tsx`
- **Create Page**: `/app/(default)/[module]/create/page.tsx`
- **Edit Page**: `/app/(default)/[module]/[id]/edit/page.tsx`

### Data Fetching & State Management

- React Query is used for server state management
- Data fetching is encapsulated in custom hooks
- Mutations (create, update, delete) are also managed with React Query

### UI Components

- Most UI components are built on top of shadcn/ui
- Table components use TanStack Table (React Table)
- Styling is done with Tailwind CSS utility classes

## 🌐 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [React Hook Form Documentation](https://react-hook-form.com)
- [Zod Documentation](https://zod.dev)

