# Icons

Guidelines for using and customizing icons in shadcn/ui components.

## Default Icon Library

shadcn/ui uses **Lucide React** as its default icon library.

### Installation

```bash
npm install lucide-react
```

### Usage

```tsx
import { Icons } from "@/components/ui/icons"
import { Heart, Settings, User } from "lucide-react"

// Using the Icons object
<Icons.heart className="h-4 w-4" />

// Direct import
<Heart className="h-4 w-4" />
```

## Icon Component

shadcn/ui provides an Icons component for consistent icon rendering:

```tsx
// Located at components/ui/icons.tsx
import { Icons } from "@/components/ui/icons"

// Use in your components
<Button variant="ghost">
  <Icons.settings className="mr-2 h-4 w-4" />
  Settings
</Button>
```

### Adding New Icons

1. Install the icon from Lucide:

```bash
npm install lucide-react
```

2. Add to `components/ui/icons.tsx`:

```tsx
import { Heart, Settings, User, ... } from "lucide-react"

export const Icons = {
  heart: Heart,
  settings: Settings,
  user: User,
  // Add new icons here
}
```

## Icon Sizing

Use Tailwind's size utilities:

| Size | Class | Pixels |
|------|-------|--------|
| xs | `h-3 w-3` | 12px |
| sm | `h-4 w-4` | 16px |
| md | `h-5 w-5` | 20px |
| lg | `h-6 w-6` | 24px |
| xl | `h-8 w-8` | 32px |

```tsx
// Small icon
<Heart className="h-4 w-4" />

// Large icon
<Heart className="h-8 w-8" />
```

## Icon Colors

Use semantic color tokens:

```tsx
// Default color (inherits from parent)
<Heart />

// Primary color
<Heart className="text-primary" />

// Muted color
<Heart className="text-muted-foreground" />

// Destructive color
<Heart className="text-destructive" />

// Current color
<Heart className="text-current" />
```

## Icon Variants

### Button Icons

```tsx
// Icon left (default)
<Button>
  <Heart className="mr-2 h-4 w-4" />
  Like
</Button>

// Icon right
<Button>
  Next
  <ArrowRight className="ml-2 h-4 w-4" />
</Button>

// Icon only
<Button variant="ghost" size="icon">
  <Heart className="h-4 w-4" />
</Button>
```

### Icon with Badge

```tsx
import { Badge } from "@/components/ui/badge"

<div className="relative">
  <Heart className="h-4 w-4" />
  <Badge variant="destructive" className="absolute -top-1 -right-1 h-3 w-3 p-0">
    3
  </Badge>
</div>
```

### Loading Spinner

```tsx
import { Spinner } from "@/components/ui/spinner"

// Use in buttons
<Button disabled>
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  Loading...
</Button>
```

## Custom Icons

### SVG Inline

```tsx
const CustomIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
)
```

### Creating Icon Component

```tsx
// components/ui/icon.tsx
import { cn } from "@/lib/utils"

interface IconProps extends React.SVGProps<SVGSVGElement> {
  children: React.ReactNode
  className?: string
}

export function Icon({ children, className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-4 w-4", className)}
      {...props}
    >
      {children}
    </svg>
  )
}

// Usage
<Icon>
  <path d="M12 2L2 7l10 5 10-5-10-5z" />
</Icon>
```

## Icon Libraries

### Lucide React (Default)

```bash
npm install lucide-react
```

```tsx
import { Heart, Settings, User } from "lucide-react"
```

### Radix Icons

```bash
npm install @radix-ui/react-icons
```

```tsx
import { CrosshairIcon } from "@radix-ui/react-icons"
```

### Heroicons

```bash
npm install @heroicons/react
```

```tsx
import { HeartIcon } from "@heroicons/react/24/solid"
```

### Tabler Icons

```bash
npm install @tabler/icons-react
```

```tsx
import { IconHeart, IconSettings, IconUser } from "@tabler/icons-react"
```

## Accessibility

### Decorative Icons

Hide icons from screen readers when purely decorative:

```tsx
<Button>
  <Heart className="h-4 w-4" aria-hidden="true" />
  Like
</Button>
```

### Icon Buttons

Ensure icon-only buttons have accessible labels:

```tsx
<Button variant="ghost" size="icon" aria-label="Like">
  <Heart className="h-4 w-4" />
</Button>
```

### Animated Icons

Add `aria-hidden="true"` to animated icons:

```tsx
<Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
```

## Best Practices

1. **Use consistent sizing**: Stick to the Tailwind size scale
2. **Match stroke width**: Use `stroke-2` for consistency
3. **Use semantic colors**: Prefer `text-muted-foreground` over raw colors
4. **Include aria-label**: Always label icon-only buttons
5. **Hide decorative icons**: Use `aria-hidden="true"` for decorative icons
6. **Avoid mixing libraries**: Pick one icon library and stick with it
7. **Optimize for performance**: Tree-shake unused icons

## Common Patterns

### Navigation Icons

```tsx
const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "About", href: "/about", icon: Info },
  { label: "Contact", href: "/contact", icon: Mail },
]

{navItems.map((item) => (
  <a key={item.href} href={item.href}>
    <item.icon className="h-4 w-4" />
    {item.label}
  </a>
))}
```

### Status Icons

```tsx
const statusIcon = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}

// Usage
const Icon = statusIcon[status]
<Icon className={cn(
  "h-4 w-4",
  status === "success" && "text-green-500",
  status === "error" && "text-red-500",
)} />
```

### Feature Icons

```tsx
const features = [
  {
    title: "Fast",
    description: "Built for speed",
    icon: Zap,
  },
  {
    title: "Secure",
    description: "Enterprise security",
    icon: Shield,
  },
  {
    title: "Reliable",
    description: "99.9% uptime",
    icon: Cloud,
  },
]
```
