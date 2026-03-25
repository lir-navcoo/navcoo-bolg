# Base vs Radix

shadcn/ui v1 ships with two base implementations: **base** and **radix**. Both are accessible, headless component libraries. The main difference is their APIs.

## Choosing Your Base

Run `shadcn init` and choose your base:

```
Which base do you want to use?
  › base (html primitives)
  ○ radix (radix ui primitives)
```

## Base (HTML Primitives)

Uses native HTML elements enhanced with accessibility features.

```tsx
import * as BaseSwitch from "@/components/ui/switch"

export function Switch() {
  return (
    <BaseSwitch.Root className="peer">
      <BaseSwitch.Thumb className="block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0" />
    </BaseSwitch.Root>
  )
}
```

### Benefits

- Smaller bundle size (no external dependency)
- Full control over the DOM structure
- Native HTML semantics
- Easier to customize

## Radix UI

Uses Radix UI primitives for complex component behaviors.

```tsx
import * as RadixSwitch from "@radix-ui/react-switch"

export function Switch() {
  return (
    <RadixSwitch.Root className="peer">
      <RadixSwitch.Thumb className="block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0" />
    </RadixSwitch.Root>
  )
}
```

### Benefits

- Battle-tested components
- Comprehensive accessibility
- Rich keyboard navigation
- Well-documented API

## API Differences

### Switch Example

| Aspect | Base | Radix |
|--------|------|----|
| Root | `Switch.Root` | `Switch.Root` |
| Thumb | `Switch.Thumb` | `Switch.Thumb` |
| State | `data-state="checked\|unchecked"` | `checked` prop |
| Props | HTML attrs + `data-*` | ARIA props |

### Toggle Example

| Aspect | Base | Radix |
|--------|------|----|
| Root | `Toggle.Root` | `Toggle.Root` |
| State | `data-state="on\|off"` | `pressed` prop |
| Events | `onPressedChange` | `onPressedChange` |

## Migrating Between Bases

There is no automated migration path between bases. When you run `shadcn init` you choose your base once and all components use that base.

To migrate:

1. Run `shadcn init` with new base
2. Use `shadcn add --overwrite` to regenerate components
3. Update any component-specific APIs in your code

## Recommended Usage

### Use Base When:

- Bundle size is critical
- You want no external dependencies
- You prefer native HTML semantics
- You need maximum customization

### Use Radix When:

- You need complex component behaviors
- Accessibility is your top priority
- You prefer a documented API
- You want battle-tested components

## Common Patterns

### Controlled State

Both bases support controlled state:

```tsx
// Base
const [checked, setChecked] = useState(false)
<Switch.Root checked={checked} onCheckedChange={setChecked} />

// Radix
const [checked, setChecked] = useState(false)
<Switch.Root checked={checked} onCheckedChange={setChecked} />
```

### Uncontrolled State

```tsx
// Base
<Switch.Root defaultChecked onCheckedChange={console.log} />

// Radix
<Switch.Root defaultChecked onCheckedChange={console.log} />
```

### Disabling

```tsx
// Base
<Switch.Root disabled>
  <Switch.Thumb />
</Switch.Root>

// Radix
<Switch.Root disabled>
  <Switch.Thumb />
</Switch.Root>
```

## State Attributes

Base components use `data-*` attributes for state:

| State | Attribute |
|-------|-----------|
| On | `data-state="on"` |
| Off | `data-state="off"` |
| Open | `data-state="open"` |
| Closed | `data-state="closed"` |
| Checked | `data-state="checked"` |
| Unchecked | `data-state="unchecked"` |
| Indeterminate | `data-state="indeterminate"` |
| Active | `data-state="active"` |
| Inactive | `data-state="inactive"` |

## Best Practices

1. **Stay consistent**: Don't mix bases in the same component
2. **Update components**: Keep base components updated with `shadcn add --overwrite`
3. **Read the docs**: Each base has specific documentation for advanced usage
4. **Test accessibility**: Both bases are accessible, but test with screen readers
