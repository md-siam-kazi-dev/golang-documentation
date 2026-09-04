# Variadic Functions in Go

A **variadic function** is a function that can accept a variable number of arguments.

In other words, the caller can pass:

```text
0 arguments
1 argument
2 arguments
3 arguments
...
```

without creating a different function for each case.

---

# 1. Why Variadic Functions?

Suppose we want to calculate the sum of numbers.

Without a variadic function:

```go
func add(a, b int) int {
	return a + b
}
```

This only accepts two numbers:

```go
add(10, 20)
```

What if we want:

```go
add(10, 20, 30, 40, 50)
```

We can use a variadic function.

---

# 2. Basic Syntax

The syntax is:

```go
func functionName(values ...type) {
}
```

Example:

```go
func add(numbers ...int) {
}
```

The `...` before the type makes the parameter variadic.

---

# 3. Simple Example

```go
package main

import "fmt"

func add(numbers ...int) {
	fmt.Println(numbers)
}

func main() {
	add(10, 20, 30)
}
```

Output:

```text
[10 20 30]
```

Inside the function, `numbers` behaves like a slice:

```go
[]int
```

---

# 4. Calculate Sum

Now we can loop over the values.

```go
func add(numbers ...int) int {
	sum := 0

	for _, number := range numbers {
		sum += number
	}

	return sum
}
```

Use it:

```go
fmt.Println(add(10, 20))
fmt.Println(add(10, 20, 30))
fmt.Println(add(10, 20, 30, 40, 50))
```

Output:

```text
30
60
150
```

The same function handles all cases.

---

# 5. Zero Arguments

A variadic function can be called without arguments.

```go
func add(numbers ...int) int {
	sum := 0

	for _, n := range numbers {
		sum += n
	}

	return sum
}
```

Then:

```go
fmt.Println(add())
```

Output:

```text
0
```

---

# 6. One Argument

```go
fmt.Println(add(10))
```

Output:

```text
10
```

---

# 7. Many Arguments

```go
fmt.Println(add(10, 20, 30, 40, 50))
```

Output:

```text
150
```

---

# 8. Variadic Parameter Is a Slice

Consider:

```go
func printNumbers(numbers ...int) {
}
```

Inside the function:

```go
numbers
```

has type:

```go
[]int
```

You can use:

```go
len(numbers)
```

You can access elements:

```go
numbers[0]
```

You can loop:

```go
for _, n := range numbers {
	fmt.Println(n)
}
```

---

# 9. Example: Find Maximum

```go
func max(numbers ...int) int {
	if len(numbers) == 0 {
		return 0
	}

	max := numbers[0]

	for _, n := range numbers {
		if n > max {
			max = n
		}
	}

	return max
}
```

Use:

```go
fmt.Println(max(10, 30, 20, 50, 40))
```

Output:

```text
50
```

---

# 10. Example: Find Minimum

```go
func min(numbers ...int) int {
	if len(numbers) == 0 {
		return 0
	}

	min := numbers[0]

	for _, n := range numbers {
		if n < min {
			min = n
		}
	}

	return min
}
```

---

# 11. Passing a Slice to a Variadic Function

Suppose we have:

```go
numbers := []int{10, 20, 30, 40}
```

We can pass the slice using:

```go
add(numbers...)
```

The `...` expands the slice.

Example:

```go
func add(numbers ...int) int {
	sum := 0

	for _, n := range numbers {
		sum += n
	}

	return sum
}

func main() {
	numbers := []int{10, 20, 30, 40}

	result := add(numbers...)

	fmt.Println(result)
}
```

Output:

```text
100
```

---

# 12. Why `numbers...` Is Needed

This:

```go
add(numbers)
```

does not work if `numbers` is:

```go
[]int
```

because the function expects:

```go
int, int, int, ...
```

You must expand the slice:

```go
add(numbers...)
```

Think:

```text
[]int{10,20,30}
       ↓
numbers...
       ↓
10, 20, 30
```

---

# 13. Variadic Parameter Must Be Last

This is valid:

```go
func printUser(name string, ages ...int) {
}
```

This is invalid:

```go
func printUser(ages ...int, name string) {
}
```

A variadic parameter must be the **last parameter**.

---

# 14. Variadic Function With Normal Parameters

You can combine normal parameters and a variadic parameter.

```go
func greet(message string, names ...string) {
	for _, name := range names {
		fmt.Println(message, name)
	}
}
```

Call:

```go
greet("Hello", "Siam", "Rakib", "Sobuj")
```

Output:

```text
Hello Siam
Hello Rakib
Hello Sobuj
```

Here:

```go
message string
```

is a normal parameter.

```go
names ...string
```

is a variadic parameter.

---

# 15. Example: Logger

Variadic functions are useful for logging.

```go
func logMessages(messages ...string) {
	for _, message := range messages {
		fmt.Println(message)
	}
}
```

Use:

```go
logMessages(
	"Server started",
	"Database connected",
	"User authenticated",
)
```

---

# 16. Example: Average

```go
func average(numbers ...float64) float64 {
	if len(numbers) == 0 {
		return 0
	}

	var total float64

	for _, n := range numbers {
		total += n
	}

	return total / float64(len(numbers))
}
```

Use:

```go
fmt.Println(average(10, 20, 30))
```

Output:

```text
20
```

---

# 17. Variadic Functions With Multiple Return Values

A variadic function can also return multiple values.

```go
func minMax(numbers ...int) (int, int) {
	if len(numbers) == 0 {
		return 0, 0
	}

	min := numbers[0]
	max := numbers[0]

	for _, n := range numbers {
		if n < min {
			min = n
		}

		if n > max {
			max = n
		}
	}

	return min, max
}
```

Use:

```go
min, max := minMax(10, 5, 20, 3, 15)

fmt.Println(min)
fmt.Println(max)
```

Output:

```text
3
20
```

---

# 18. Variadic Functions With Strings

Variadic functions aren't limited to numbers.

```go
func joinWords(words ...string) {
	for _, word := range words {
		fmt.Print(word, " ")
	}
}
```

Use:

```go
joinWords("Go", "is", "awesome")
```

Output:

```text
Go is awesome
```

---

# 19. A Practical Example

Imagine we want to calculate the total price of products.

```go
func totalPrice(prices ...float64) float64 {
	var total float64

	for _, price := range prices {
		total += price
	}

	return total
}
```

Use:

```go
total := totalPrice(
	100,
	250,
	50,
	75,
)

fmt.Println(total)
```

Output:

```text
475
```

---

# 20. Variadic Functions Are Not Magic

Remember:

```go
func add(numbers ...int)
```

is conceptually similar to:

```go
func add(numbers []int)
```

But the caller gets a convenient syntax.

With:

```go
func add(numbers ...int)
```

you can call:

```go
add(1, 2, 3)
```

With:

```go
func add(numbers []int)
```

you must call:

```go
add([]int{1, 2, 3})
```

---

# Summary

A variadic function accepts a variable number of arguments.

Syntax:

```go
func add(numbers ...int) int {
	// ...
}
```

You can call:

```go
add()
add(10)
add(10, 20)
add(10, 20, 30, 40)
```

Inside the function, the variadic parameter behaves like a slice:

```go
[]int
```

You can pass an existing slice using:

```go
add(numbers...)
```

Important rule:

> The variadic parameter must always be the final parameter.