# Anonymous Functions in Go

An **anonymous function** is a function that does not have a name.

Normally, we write:

```go
func sayHello() {
	fmt.Println("Hello")
}
```

The function has a name:

```text
sayHello
```

An anonymous function has no name:

```go
func() {
	fmt.Println("Hello")
}
```

Because it has no name, we usually assign it to a variable or execute it immediately.

---

# 1. Basic Anonymous Function

```go
package main

import "fmt"

func main() {

	greet := func() {
		fmt.Println("Hello, Go!")
	}

	greet()
}
```

Output:

```text
Hello, Go!
```

Here:

```go
greet := func() {
	fmt.Println("Hello, Go!")
}
```

The function is stored inside the variable `greet`.

We can call it:

```go
greet()
```

---

# 2. Function Is a Value

One important idea in Go is:

> Functions are values.

That means a function can be stored in a variable.

Example:

```go
add := func(a, b int) int {
	return a + b
}
```

Now `add` contains a function.

Call:

```go
result := add(10, 20)

fmt.Println(result)
```

Output:

```text
30
```

---

# 3. Anonymous Function With Parameters

```go
multiply := func(a, b int) int {
	return a * b
}

fmt.Println(multiply(5, 4))
```

Output:

```text
20
```

---

# 4. Anonymous Function With Multiple Return Values

Anonymous functions can return multiple values.

```go
calculate := func(a, b int) (int, int) {
	return a + b, a * b
}

sum, product := calculate(5, 4)

fmt.Println(sum)
fmt.Println(product)
```

Output:

```text
9
20
```

---

# 5. Immediately Invoked Anonymous Function

An anonymous function can be created and executed immediately.

```go
func() {
	fmt.Println("Hello")
}()
```

Notice the final:

```go
()
```

That calls the function immediately.

Output:

```text
Hello
```

---

# 6. Passing Arguments Immediately

You can pass arguments:

```go
func(name string) {
	fmt.Println("Hello", name)
}("Siam")
```

Output:

```text
Hello Siam
```

---

# 7. Why Use Anonymous Functions?

Anonymous functions are useful when:

- You need a function only once.
- You want to pass a function to another function.
- You need a callback.
- You want a small piece of logic.
- You are working with goroutines.
- You are creating closures.

---

# 8. Anonymous Function as a Variable

Example:

```go
greet := func(name string) {
	fmt.Println("Hello", name)
}

greet("Siam")
greet("Rakib")
```

Output:

```text
Hello Siam
Hello Rakib
```

---

# 9. Changing the Function Stored in a Variable

Because functions are values, a variable can be assigned another function.

```go
operation := func(a, b int) int {
	return a + b
}

fmt.Println(operation(10, 5))
```

We can replace it:

```go
operation = func(a, b int) int {
	return a * b
}

fmt.Println(operation(10, 5))
```

Output:

```text
15
50
```

The variable `operation` now points to a different function.

---

# 10. Function Type

You can explicitly declare a function type.

For example:

```go
var operation func(int, int) int
```

This means:

```text
operation must contain a function
that accepts two ints
and returns an int
```

Then:

```go
operation = func(a, b int) int {
	return a + b
}
```

Use:

```go
fmt.Println(operation(10, 20))
```

---

# 11. Passing Functions as Arguments

This is one of the most powerful features.

Suppose:

```go
func calculate(a, b int, operation func(int, int) int) int {
	return operation(a, b)
}
```

Now we can pass different functions.

```go
add := func(a, b int) int {
	return a + b
}

multiply := func(a, b int) int {
	return a * b
}
```

Use:

```go
fmt.Println(calculate(10, 5, add))
fmt.Println(calculate(10, 5, multiply))
```

Output:

```text
15
50
```

The same `calculate` function can perform different operations.

---

# 12. Passing Anonymous Functions Directly

We don't even need variables.

```go
result := calculate(10, 5, func(a, b int) int {
	return a - b
})

fmt.Println(result)
```

Output:

```text
5
```

---

# 13. Anonymous Functions and Goroutines

Anonymous functions are commonly used with goroutines.

```go
package main

import (
	"fmt"
)

func main() {

	go func() {
		fmt.Println("Running in goroutine")
	}()

	fmt.Scanln()
}
```

The anonymous function is launched as a goroutine.

You will learn goroutines and concurrency later.

---

# 14. Example: Filtering Numbers

We can create a function that accepts another function.

```go
func filter(numbers []int, condition func(int) bool) []int {
	var result []int

	for _, number := range numbers {
		if condition(number) {
			result = append(result, number)
		}
	}

	return result
}
```

Now we can provide different conditions.

Even numbers:

```go
numbers := []int{1, 2, 3, 4, 5, 6}

even := filter(numbers, func(n int) bool {
	return n%2 == 0
})

fmt.Println(even)
```

Output:

```text
[2 4 6]
```

Greater than 3:

```go
greater := filter(numbers, func(n int) bool {
	return n > 3
})

fmt.Println(greater)
```

Output:

```text
[4 5 6]
```

This demonstrates why functions being values is powerful.

---

# 15. Anonymous Function Inside a Loop

You can create anonymous functions inside loops, but be careful with variable capture.

Simple example:

```go
for i := 0; i < 3; i++ {
	func(n int) {
		fmt.Println(n)
	}(i)
}
```

Output:

```text
0
1
2
```

---

# 16. Anonymous Function vs Named Function

Named function:

```go
func add(a, b int) int {
	return a + b
}
```

Anonymous function:

```go
add := func(a, b int) int {
	return a + b
}
```

Use a named function when the behavior is reusable and deserves a clear name.

Use an anonymous function when the logic is small and local.

---

# 17. Practical Example: Sorting

Go's sorting functions often use functions as arguments.

Conceptually:

```go
sort.Slice(numbers, func(i, j int) bool {
	return numbers[i] < numbers[j]
})
```

The anonymous function tells `sort.Slice` how to compare elements.

This is an important real-world use of anonymous functions.

---

# 18. Anonymous Functions Can Access Variables

This leads directly to **closures**.

Example:

```go
message := "Hello"

greet := func() {
	fmt.Println(message)
}

greet()
```

The function can access `message` from the surrounding scope.

This behavior becomes even more powerful with closures.

---

# Summary

An anonymous function has no name:

```go
func() {
	fmt.Println("Hello")
}
```

You can store it:

```go
greet := func() {
	fmt.Println("Hello")
}
```

You can call it:

```go
greet()
```

You can execute it immediately:

```go
func() {
	fmt.Println("Hello")
}()
```

You can pass it to another function:

```go
calculate(10, 20, func(a, b int) int {
	return a + b
})
```

Anonymous functions are especially useful for:

- Callbacks
- Goroutines
- Sorting
- Filtering
- Short one-time logic
- Closures