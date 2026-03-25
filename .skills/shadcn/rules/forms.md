# Forms

Guidelines for building accessible, user-friendly forms with shadcn/ui components.

## Form Structure

Use `Form` components with React Hook Form or Formik for complex forms:

```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
})

export function ProfileForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="shadcn@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```

## Form Components

### FormField

Wrapper for form inputs with consistent structure:

```tsx
<FormField
  control={form.control}
  name="fieldName"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Label</FormLabel>
      <FormControl>
        <YourInput {...field} />
      </FormControl>
      <FormDescription>Optional description</FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
```

### FormItem

Container for form controls:

```tsx
<FormItem>
  <FormLabel />
  <FormControl />
  <FormDescription />
  <FormMessage />
</FormItem>
```

### FormLabel

Label for form controls:

```tsx
<FormLabel htmlFor="email">Email</FormLabel>
```

### FormControl

Wrapper for form inputs:

```tsx
<FormControl>
  <Input {...field} />
</FormControl>
```

### FormDescription

Help text for form controls:

```tsx
<FormDescription>
  We'll never share your email with anyone else.
</FormDescription>
```

### FormMessage

Error message for form controls:

```tsx
<FormMessage />
```

## Input Patterns

### Text Input

```tsx
<Input
  type="text"
  placeholder="Enter your name"
  {...field}
/>
```

### Email Input

```tsx
<Input
  type="email"
  placeholder="your@email.com"
  {...field}
/>
```

### Password Input

```tsx
<Input
  type="password"
  placeholder="Enter password"
  {...field}
/>
```

### Input with Icon

```tsx
<div className="relative">
  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
  <Input
    placeholder="Search..."
    className="pl-8"
    {...field}
  />
</div>
```

### Textarea

```tsx
import { Textarea } from "@/components/ui/textarea"

<Textarea
  placeholder="Tell us your story..."
  className="resize-none"
  {...field}
/>
```

## Select Patterns

### Native Select

```tsx
<select {...field}>
  <option value="">Select an option</option>
  <option value="option1">Option 1</option>
  <option value="option2">Option 2</option>
</select>
```

### Select Component

```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

<FormField
  control={form.control}
  name="select"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Select</FormLabel>
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>
```

## Checkbox Patterns

### Single Checkbox

```tsx
<FormField
  control={form.control}
  name="agree"
  render={({ field }) => (
    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
      <FormControl>
        <Checkbox
          checked={field.value}
          onCheckedChange={field.onChange}
        />
      </FormControl>
      <div className="space-y-1 leading-none">
        <FormLabel>
          Agree to terms and conditions
        </FormLabel>
        <FormDescription>
          You must agree to the terms to proceed.
        </FormDescription>
      </div>
    </FormItem>
  )}
/>
```

### Checkbox Group

```tsx
<FormField
  control={form.control}
  name="interests"
  render={() => (
    <FormItem>
      <div className="mb-4">
        <FormLabel>Interests</FormLabel>
        <FormDescription>
          Select items you are interested in.
        </FormDescription>
      </div>
      {interests.map((item) => (
        <FormField
          key={item.id}
          control={form.control}
          name="interests"
          render={({ field }) => {
            return (
              <FormItem
                key={item.id}
                className="flex flex-row items-start space-x-3 space-y-0"
              >
                <FormControl>
                  <Checkbox
                    checked={field.value?.includes(item.id)}
                    onCheckedChange={(checked) => {
                      return checked
                        ? field.onChange([...field.value, item.id])
                        : field.onChange(
                            field.value?.filter(
                              (value) => value !== item.id
                            )
                          )
                    }}
                  />
                </FormControl>
                <FormLabel className="font-normal">
                  {item.label}
                </FormLabel>
              </FormItem>
            )
          }}
        />
      ))}
      <FormMessage />
    </FormItem>
  )}
/>
```

## Radio Group Patterns

```tsx
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"

<FormField
  control={form.control}
  name="plan"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Select a plan</FormLabel>
      <FormControl>
        <RadioGroup
          onValueChange={field.onChange}
          defaultValue={field.value}
          className="flex flex-col space-y-1"
        >
          <FormItem className="flex items-center space-x-3 space-y-0">
            <FormControl>
              <RadioGroupItem value="free" />
            </FormControl>
            <FormLabel className="font-normal">
              Free plan
            </FormLabel>
          </FormItem>
          <FormItem className="flex items-center space-x-3 space-y-0">
            <FormControl>
              <RadioGroupItem value="pro" />
            </FormControl>
            <FormLabel className="font-normal">
              Pro plan
            </FormLabel>
          </FormItem>
          <FormItem className="flex items-center space-x-3 space-y-0">
            <FormControl>
              <RadioGroupItem value="enterprise" />
            </FormControl>
            <FormLabel className="font-normal">
              Enterprise plan
            </FormLabel>
          </FormItem>
        </RadioGroup>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

## Switch Patterns

```tsx
import { Switch } from "@/components/ui/switch"

<FormField
  control={form.control}
  name="marketing"
  render={({ field }) => (
    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
      <div className="space-y-0.5">
        <FormLabel className="text-base">
          Marketing emails
        </FormLabel>
        <FormDescription>
          Receive emails about new products and features.
        </FormDescription>
      </div>
      <FormControl>
        <Switch
          checked={field.value}
          onCheckedChange={field.onChange}
        />
      </FormControl>
    </FormItem>
  )}
/>
```

## Date Picker Patterns

```tsx
import { format } from "date-fns"
import { CalendarIcon } from "@radix-ui/react-icons"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

<FormField
  control={form.control}
  name="date"
  render={({ field }) => (
    <FormItem className="flex flex-col">
      <FormLabel>Date of birth</FormLabel>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant={"outline"}
              className={cn(
                "w-[240px] pl-3 text-left font-normal",
                !field.value && "text-muted-foreground"
              )}
            >
              {field.value ? (
                format(field.value, "PPP")
              ) : (
                <span>Pick a date</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={field.value}
            onSelect={field.onChange}
            disabled={(date) =>
              date > new Date() || date < new Date("1900-01-01")
            }
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <FormDescription>
        Your date of birth is used for account recovery.
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
```

## Validation Patterns

### Zod Schema

```tsx
const formSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." })
    .max(30, { message: "Username must not be longer than 30 characters." }),
  email: z
    .string()
    .min(1, { message: "This field is required." })
    .email("This is not a valid email."),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    .regex(/[A-Z]/, { message: "Password must contain an uppercase letter." })
    .regex(/[a-z]/, { message: "Password must contain a lowercase letter." })
    .regex(/[0-9]/, { message: "Password must contain a number." }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ["confirmPassword"],
})
```

## Accessibility

1. **Always use FormField**: Ensures proper label-aria associations
2. **Provide FormDescription**: Helps users understand required input
3. **Use FormMessage**: Displays errors in an accessible way
4. **Include Labels**: Every input must have a visible label
5. **Group related fields**: Use fieldsets for checkbox/radio groups

## Best Practices

1. **Inline validation**: Show errors as users type (debounced)
2. **Focus management**: Focus first invalid field on submit
3. **Accessible errors**: Use `aria-describedby` for error messages
4. **Clear labels**: Use clear, descriptive labels
5. **Optional fields**: Mark optional fields with "(optional)"
6. **Loading states**: Disable form during submission
7. **Success feedback**: Show success message after submission
