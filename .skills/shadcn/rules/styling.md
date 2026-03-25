# Styling

Guidelines for styling shadcn/ui components with Tailwind CSS.

## CSS Variables

shadcn/ui uses CSS variables for theming. These are defined in your `globals.css`:

```css
@layer base {
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

  .dark {
    /* Dark mode variables */
  }
}
```

## Semantic Colors

Use semantic color tokens for consistency:

| Token | Light Mode | Dark Mode | Use Case |
|-------|------------|-----------|----------|
| `--background` | White | Dark | Page background |
| `--foreground` | Dark | Light | Text color |
| `--primary` | Dark | Light | Primary actions |
| `--secondary` | Gray | Dark gray | Secondary actions |
| `--muted` | Light gray | Dark gray | Subtle backgrounds |
| `--accent` | Light gray | Dark gray | Hover states |
| `--destructive` | Red | Dark red | Destructive actions |

## Tailwind Classes

### Background Colors

```tsx
// Background colors
<div className="bg-background" />
<div className="bg-primary" />
<div className="bg-secondary" />
<div className="bg-muted" />
<div className="bg-accent" />
<div className="bg-destructive" />
```

### Text Colors

```tsx
// Text colors
<p className="text-foreground">Text</p>
<p className="text-primary">Text</p>
<p className="text-secondary">Text</p>
<p className="text-muted-foreground">Text</p>
<p className="text-destructive">Text</p>
```

### Border Colors

```tsx
// Border colors
<div className="border border-border" />
<div className="border border-input" />
<div className="border border-primary" />
```

### Ring Colors

```tsx
// Focus ring
<div className="ring-offset-background focus-visible:ring-ring" />
```

## Border Radius

Use the radius scale for consistency:

```tsx
// Radius classes
<div className="rounded-sm" />    /* --radius: calc(0.5rem - 2px) */
<div className="rounded-md" />    /* --radius: calc(0.5rem - 1px) */
<div className="rounded" />       /* --radius: 0.5rem */
<div className="rounded-lg" />    /* --radius: 0.5rem */
<div className="rounded-xl" />    /* --radius: calc(0.5rem + 2px) */
<div className="rounded-2xl" />   /* --radius: calc(0.5rem + 4px) */
<div className="rounded-full" />  /* --radius: 9999px */
```

## Shadows

### Available Shadows

```tsx
<div className="shadow-xs" />
<div className="shadow-sm" />
<div className="shadow" />
<div className="shadow-md" />
<div className="shadow-lg" />
<div className="shadow-xl" />
<div className="shadow-2xl" />
```

### Shadow Colors

```tsx
// Shadow with color
<div className="shadow-[0_1px_3px_0_rgb(0_0_0_/_0.1)]" />
```

## Component Styling Patterns

### Button Variants

```tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
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

### Card Styling

```tsx
<Card className="w-[350px]">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card Content</p>
  </CardContent>
  <CardFooter>
    <p>Card Footer</p>
  </CardFooter>
</Card>

// Card CSS
.card {
  background-color: hsl(var(--card));
  border-radius: calc(var(--radius) + 4px);
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
}
```

### Input Styling

```tsx
<input
  className={cn(
    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
    className
  )}
/>
```

### Dialog Overlay

```tsx
<Dialog>
  <DialogContent className="sm:max-w-[425px]">
    {/* Content */}
  </DialogContent>
</Dialog>

// Overlay CSS
.fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
```

## Animation Classes

### Fade Animations

```tsx
// Fade in
<div className="animate-in fade-in-0" />

// Fade out
<div className="animate-out fade-out-0" />

// Zoom in
<div className="animate-in zoom-in-95" />
```

### Slide Animations

```tsx
// Slide from bottom
<div className="animate-in slide-in-from-bottom-2" />

// Slide from top
<div className="animate-in slide-in-from-top-2" />

// Slide from right
<div className="animate-in slide-in-from-right-2" />

// Slide from left
<div className="animate-in slide-in-from-left-2" />
```

### Spin Animation

```tsx
// Spinning loader
<div className="animate-spin" />
```

## Tailwind Configuration

### Extending Theme

```js
// tailwind.config.js
module.exports = {
  darkMode: ["class"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "calc(var(--radius) + 2px)",
        md: "calc(var(--radius) + -1px)",
        sm: "calc(var(--radius) + -2px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
}
```

## Best Practices

1. **Use CSS variables**: Always use semantic tokens for colors
2. **Use the radius scale**: Don't use arbitrary radius values
3. **Consistent spacing**: Use Tailwind's spacing scale
4. **Focus rings**: Always include focus-visible styles
5. **Dark mode**: Test styles in both light and dark modes
6. **Accessibility**: Ensure sufficient color contrast
7. **Responsive design**: Use responsive prefixes appropriately

## Common Mistakes

❌ **Don't do this:**

```tsx
// Using raw colors
<div className="bg-gray-100 text-gray-900" />

// Arbitrary radius
<div className="rounded-[12px]" />

// Inline styles
<div style={{ backgroundColor: "white" }} />
```

✅ **Do this:**

```tsx
// Using semantic colors
<div className="bg-muted text-foreground" />

// Using radius scale
<div className="rounded-lg" />

// Using Tailwind classes
<div className="bg-background" />
```
