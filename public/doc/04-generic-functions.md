# Generic Functions in Go

## Introduction

A generic function is a function that can operate on multiple types using type parameters.

Instead of writing:

```go
func SumInts(numbers []int) int
```

and:

```go
func SumFloats(numbers []float64) float64
```

we can create reusable generic logic.

## 1. Basic Generic Function

```go
func PrintValue[T any](value T) {
    fmt.Println(value)
}
```

Usage:

```go
PrintValue(100)
PrintValue("Hello")
PrintValue(3.14)
PrintValue(true)
```

`T` can represent different types.

## 2. Understanding the Syntax

Look carefully:

```go
func PrintValue[T any](value T)
```

Break it down:

```text
func
 ↓
PrintValue
 ↓
[T any]
 ↓
(value T)
```

**`T`**

The type parameter name.

**`any`**

The constraint. It says that `T` can be any type.

**`value T`**

The function parameter has the selected type.

## 3. Type Inference

Usually, you do not need to specify the type manually.

```go
PrintValue(100)
```

Go infers:

```go
T = int
```

And:

```go
PrintValue("Go")
```

means:

```go
T = string
```

You can also explicitly provide the type:

```go
PrintValue[int](100)
```

## 4. Generic Function With Constraints

Suppose we want to add two values.

```go
func Add[T int | float64](a, b T) T {
    return a + b
}
```

Usage:

```go
fmt.Println(Add(10, 20))
fmt.Println(Add(1.5, 2.5))
```

The constraint tells the compiler which types are allowed.

## 5. Multiple Type Parameters

A function can have more than one type parameter.

```go
func Pair[A any, B any](first A, second B) {
    fmt.Println(first, second)
}
```

Usage:

```go
Pair("Age", 21)
Pair(100, true)
```

Here:

```text
A → type of first
B → type of second
```

## 6. Generic Function Returning a Value

```go
func First[T any](items []T) T {
    return items[0]
}
```

Usage:

```go
numbers := []int{10, 20, 30}

firstNumber := First(numbers)

fmt.Println(firstNumber)
```

And:

```go
names := []string{"Siam", "Rahim"}

firstName := First(names)

fmt.Println(firstName)
```

## 7. Generic Map Function

You can create a function that transforms one slice into another type.

```go
func Map[T any, R any](items []T, fn func(T) R) []R {
    result := make([]R, 0, len(items))

    for _, item := range items {
        result = append(result, fn(item))
    }

    return result
}
```

Example:

```go
numbers := []int{1, 2, 3}

strings := Map(numbers, func(n int) string {
    return fmt.Sprintf("%d", n)
})

fmt.Println(strings)
```

Result:

```text
[1 2 3]
```

The values are converted from `int` to `string`.

## 8. Generic Filter

```go
func Filter[T any](items []T, condition func(T) bool) []T {
    result := []T{}

    for _, item := range items {
        if condition(item) {
            result = append(result, item)
        }
    }

    return result
}
```

Usage:

```go
numbers := []int{1, 2, 3, 4, 5, 6}

even := Filter(numbers, func(n int) bool {
    return n%2 == 0
})

fmt.Println(even)
```

Output:

```text
[2 4 6]
```

## 9. Generic Function With comparable

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

Why `comparable`?

Because the function uses:

```go
item == target
```

The compiler needs to know that `T` supports equality.

## 10. Generic Function With a Custom Constraint

You can define your own constraint.

```go
type Number interface {
    int | int64 | float64
}
```

Then:

```go
func Sum[T Number](a, b T) T {
    return a + b
}
```

Usage:

```go
fmt.Println(Sum(10, 20))
fmt.Println(Sum(10.5, 20.5))
```

## 11. Generic Functions and Type Safety

Consider:

```go
func Contains[T comparable](items []T, target T) bool
```

This is type-safe.

If you have:

```go
numbers := []int{1, 2, 3}
```

the target is expected to be an `int`.

The compiler can catch incompatible usage.

## 12. Generic Function vs any

Without generics:

```go
func Print(value any) {
    fmt.Println(value)
}
```

With generics:

```go
func Print[T any](value T) {
    fmt.Println(value)
}
```

For simple printing, generics may not provide much benefit.

Generics become more useful when the function performs type-preserving operations.

## 13. Teacher Rule

Ask:

> "Do I have the same algorithm repeated for several types?"

If yes, generics may help.

If the code becomes harder to understand than the original version, do not force generics into it.

## 14. Summary

Generic functions use:

```go
func Name[T Constraint](parameter T) T
```

Important ideas:

- type parameters
- constraints
- type inference
- multiple type parameters
- `any`
- `comparable`
- reusable algorithms
