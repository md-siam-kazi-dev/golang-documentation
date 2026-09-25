# Generics in Go

## Introduction

Generics allow you to write reusable code that works with different types while still keeping compile-time type safety.

Before generics, you often had to:

- duplicate functions for different types
- use `interface{}` / `any`
- perform type assertions

With generics, one implementation can work with many types.

## 1. The Problem Generics Solve

Imagine you want to find the maximum integer:

```go
func MaxInt(a, b int) int {
    if a > b {
        return a
    }

    return b
}
```

Now you want the same thing for `float64`:

```go
func MaxFloat(a, b float64) float64 {
    if a > b {
        return a
    }

    return b
}
```

The logic is duplicated.

Generics let us express the reusable idea once.

## 2. Generic Function

```go
func Max[T int | float64](a, b T) T {
    if a > b {
        return a
    }

    return b
}
```

Here:

- `T` is a type parameter.
- `int | float64` is the constraint.
- `a` and `b` have type `T`.
- The return value also has type `T`.

Usage:

```go
fmt.Println(Max(10, 20))
fmt.Println(Max(3.14, 2.71))
```

## 3. What Is a Type Parameter?

Look at:

```go
func Max[T int | float64](a, b T) T
```

The important part is:

```go
[T int | float64]
```

`T` represents a type that will be selected when the function is used.

For example:

```go
Max(10, 20)
```

Go can infer:

```go
T = int
```

For:

```go
Max(3.2, 5.7)
```

Go can infer:

```go
T = float64
```

## 4. Type Constraints

A generic type parameter needs to know what operations are allowed.

For example:

```go
func Add[T int | float64](a, b T) T {
    return a + b
}
```

Because the constraint allows `int` and `float64`, Go knows `+` is valid.

But this would not be valid:

```go
func PrintLength[T any](value T) {
    // How does Go know T has a length?
}
```

`any` does not promise that a type has a length.

## 5. any

`any` is an alias for:

```go
interface{}
```

Example:

```go
func Print[T any](value T) {
    fmt.Println(value)
}
```

This function accepts almost any type.

```go
Print(10)
Print("Hello")
Print(3.14)
Print(true)
```

## 6. Generic Slice Function

A common example is searching a slice:

```go
func Contains[T comparable](items []T, target T) bool {
    for _, item := range items {
        if item == target {
            return true
        }
    }

    return false
}
```

Usage:

```go
numbers := []int{10, 20, 30}

fmt.Println(Contains(numbers, 20))
```

And:

```go
names := []string{"Siam", "Rahim", "Karim"}

fmt.Println(Contains(names, "Siam"))
```

`comparable` is used because `==` requires comparable values.

## 7. Generic Types

Generics are not limited to functions.

You can define a generic type:

```go
type Stack[T any] struct {
    items []T
}
```

Now:

```go
intStack := Stack[int]{}
stringStack := Stack[string]{}
```

The same type definition can represent stacks of different element types.

## 8. Why Not Just Use any?

You could write:

```go
func Contains(items []any, target any) bool
```

But generic code preserves the relationship between the input types.

With generics:

```go
func Contains[T comparable](items []T, target T) bool
```

If `items` contains integers, `target` must also be an integer.

This gives stronger compile-time checking.

## 9. Generic Type With Methods

```go
type Box[T any] struct {
    Value T
}

func (b Box[T]) Get() T {
    return b.Value
}
```

Usage:

```go
box := Box[int]{Value: 100}

fmt.Println(box.Get())
```

## 10. Generics vs Interfaces

Interfaces are still extremely important.

Use an interface when you want different concrete types to satisfy behavior:

```go
type Speaker interface {
    Speak()
}
```

Generics are useful when the algorithm should work with multiple types while preserving their type.

A simple mental model:

```text
Interface
→ "What behavior can this value perform?"

Generics
→ "What type is this algorithm working with?"
```

## 11. When Should You Use Generics?

Good use cases:

- reusable data structures
- generic algorithms
- collections
- sorting/search helpers
- functions operating on multiple types

Do not add generics just because you can.

If ordinary code is simpler, use ordinary code.

## 12. Summary

Generics provide:

```text
Reusable code
+
Compile-time type safety
+
Less duplication
```

Key concepts:

- type parameter
- type constraint
- generic function
- generic type
- `any`
- `comparable`
- type inference
