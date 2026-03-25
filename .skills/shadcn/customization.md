# Theming & Customization

Customize the look and feel of your shadcn/ui components.

## CSS Variables

shadcn/ui uses CSS variables for theming. These are defined in your `globals.css` file.

### Default Theme Variables

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
  --radius: 0.5rem;
}
```

### Dark Theme Variables

```css
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  --popover: 222.2 84% 4.9%;
  --popover-foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 212.7 26.8% 83.9%;
}
```

## Custom Colors

### Adding Custom Colors

1. Add the color to your `tailwind.config.js`:

```js
tailwind.config = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
    },
  },
}
```

2. Update CSS variables:

```css
:root {
  --primary: 199 89% 48%;
  --primary-foreground: 210 40% 98%;
}
```

## Dark Mode

### Using Tailwind CSS

1. Add the dark mode config:

```js
tailwind.config = {
  darkMode: ["class"],
}
```

2. Use the `dark` class:

```js
// For Next.js 13+ with App Router
import { useTheme } from "next-themes"

const { theme, setTheme } = useTheme()
```

3. Add dark mode toggle to your UI:

```tsx
<button
  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
>
  Toggle {theme === "dark" ? "light" : "dark"}
</button>
```

## Border Radius

### Customizing Border Radius

```css
:root {
  --radius: 1rem;
}
```

### Radius Scale

| Token | Value | Use Case |
|-------|-------|----------|
| `--radius-sm` | calc(var(--radius) - 4px) | Small elements |
| `--radius-md` | calc(var(--radius) - 2px) | Default elements |
| `--radius-lg` | var(--radius) | Large elements |
| `--radius-xl` | calc(var(--radius) + 2px) | Extra large elements |
| `--radius-2xl` | calc(var(--radius) + 4px) | Cards, modals |

## Typography

### Custom Font

1. Import font in your CSS:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
```

2. Update Tailwind config:

```js
tailwind.config = {
  fontFamily: {
    sans: ["Inter", "system-ui", "sans-serif"],
  },
}
```

## Component Variants

### Button Variants

```tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

## Best Practices

1. **Use OKLCH colors**: For better color rendering across browsers
2. **Maintain contrast ratios**: Ensure WCAG AA compliance (4.5:1 for text)
3. **Use semantic colors**: Prefer `primary`, `secondary`, `destructive` over raw colors
4. **Keep radius consistent**: Use the radius scale for uniformity
5. **Test in both modes**: Verify your theme works in light and dark modes
