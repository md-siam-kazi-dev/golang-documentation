# Closures in Go

A **closure** is a function that remembers and can access variables from the environment where it was created.

Closures are one of the most interesting concepts in Go.

To understand closures properly, first remember:

> A function can access variables from its surrounding scope.

---

# 1. A Simple Example

```go
package main

import "fmt"

func main() {

	message := "Hello Go"

	greet := func() {
		fmt.Println(message)
	}

	greet()
}
```

Output:

```text
Hello Go
```

The anonymous function can access:

```go
message
```

even though `message` was not declared inside the function.

This is the basic idea behind a closure.

---

# 2. What Does "Capture" Mean?

Consider:

```go
x := 10

func() {
	fmt.Println(x)
}()
```

The function uses `x` from its surrounding scope.

We say that the function **captures** `x`.

Conceptually:

```text
Outer scope
    │
    ├── x = 10
    │
    └── function
          │
          └── accesses x
```

---

# 3. Closure Can Modify the Variable

This is where closures become interesting.

```go
func main() {

	counter := 0

	increment := func() {
		counter++
	}

	increment()
	increment()
	increment()

	fmt.Println(counter)
}
```

Output:

```text
3
```

The anonymous function modifies the variable `counter`.

The function remembers the variable.

---

# 4. Why Is It Called a Closure?

Because the function "closes over" the variables it uses from the surrounding environment.

Example:

```go
counter := 0

increment := func() {
	counter++
}
```

The function and the captured variable work together.

You can think of them as a small package:

```text
Closure
 ├── function
 └── captured variables
```

---

# 5. The Most Important Closure Example

A common pattern is a function that **returns another function**.

```go
func counter() func() int {

	count := 0

	return func() int {
		count++
		return count
	}
}
```

Now:

```go
func main() {

	next := counter()

	fmt.Println(next())
	fmt.Println(next())
	fmt.Println(next())
}
```

Output:

```text
1
2
3
```

How does this work?

---

# 6. Understanding the Counter Example

When we call:

```go
next := counter()
```

Go creates:

```text
count = 0
```

Then `counter()` returns a function:

```go
func() int {
	count++
	return count
}
```

The returned function remembers `count`.

So:

```go
next()
```

changes:

```text
count = 0 → 1
```

Next:

```go
next()
```

changes:

```text
count = 1 → 2
```

Next:

```go
next()
```

changes:

```text
count = 2 → 3
```

That's a closure.

---

# 7. Multiple Closures Have Separate State

This is extremely important.

```go
func counter() func() int {

	count := 0

	return func() int {
		count++
		return count
	}
}
```

Create two counters:

```go
counterA := counter()
counterB := counter()
```

Now:

```go
fmt.Println(counterA())
fmt.Println(counterA())
fmt.Println(counterA())
```

Output:

```text
1
2
3
```

But:

```go
fmt.Println(counterB())
```

Output:

```text
1
```

Why?

Because each call to:

```go
counter()
```

creates a separate `count`.

Conceptually:

```text
counterA
 └── count = 3

counterB
 └── count = 1
```

They have independent state.

---

# 8. Closure as a Private Variable

Closures can be used to create state that cannot be directly accessed from outside.

Example:

```go
func createCounter() func() int {

	count := 0

	return func() int {
		count++
		return count
	}
}
```

Outside the function, we cannot directly access:

```go
count
```

We can only interact with it through the returned function.

This is similar to the idea of private state.

---

# 9. Example: Bank Account

We can use a closure to create a simple bank account.

```go
func createAccount(initialBalance float64) func(float64) float64 {

	balance := initialBalance

	return func(amount float64) float64 {
		balance += amount
		return balance
	}
}
```

Use:

```go
account := createAccount(1000)

fmt.Println(account(500))
fmt.Println(account(200))
fmt.Println(account(-300))
```

Output:

```text
1500
1700
1400
```

The `balance` variable is captured by the returned function.

---

# 10. Closure With Multiple Functions

We can create a more powerful example.

```go
func createAccount(initialBalance float64) (func(float64), func() float64) {

	balance := initialBalance

	deposit := func(amount float64) {
		balance += amount
	}

	getBalance := func() float64 {
		return balance
	}

	return deposit, getBalance
}
```

Use:

```go
deposit, getBalance := createAccount(1000)

deposit(500)
deposit(200)

fmt.Println(getBalance())
```

Output:

```text
1700
```

Both functions share the same captured `balance`.

---

# 11. Closure for Generating Functions

Suppose we want to create functions that multiply numbers by a specific value.

```go
func multiplier(factor int) func(int) int {

	return func(number int) int {
		return number * factor
	}
}
```

Create a double function:

```go
double := multiplier(2)
```

Now:

```go
fmt.Println(double(10))
fmt.Println(double(20))
```

Output:

```text
20
40
```

Create a triple function:

```go
triple := multiplier(3)

fmt.Println(triple(10))
```

Output:

```text
30
```

---

# 12. How the Multiplier Closure Works

When:

```go
double := multiplier(2)
```

the returned function remembers:

```text
factor = 2
```

When:

```go
triple := multiplier(3)
```

the returned function remembers:

```text
factor = 3
```

So:

```text
double
 └── factor = 2

triple
 └── factor = 3
```

---

# 13. Closure vs Anonymous Function

These concepts are related but not identical.

### Anonymous function

A function without a name:

```go
func() {
	fmt.Println("Hello")
}
```

### Closure

A function that captures variables from its surrounding environment:

```go
message := "Hello"

greet := func() {
	fmt.Println(message)
}
```

An anonymous function **can be a closure** when it captures surrounding variables.

---

# 14. Closure With a Loop

Closures and loops require special attention.

Example:

```go
for i := 0; i < 3; i++ {
	func() {
		fmt.Println(i)
	}()
}
```

This directly executes the function during each iteration.

Output:

```text
0
1
2
```

The important point is that closures can capture variables, so when you create functions inside loops and execute/store them for later, you need to understand exactly which variable each closure captures.

Modern Go versions changed loop-variable semantics to make common closure-in-loop patterns safer, but understanding variable capture is still essential.

---

# 15. Practical Example: Authentication

Closures can be useful when creating functions with configuration.

```go
func createAuthenticator(expectedToken string) func(string) bool {

	return func(token string) bool {
		return token == expectedToken
	}
}
```

Create an authenticator:

```go
auth := createAuthenticator("secret123")
```

Use:

```go
fmt.Println(auth("secret123"))
fmt.Println(auth("wrong"))
```

Output:

```text
true
false
```

The returned function remembers:

```text
expectedToken
```

---

# 16. Practical Example: Logger With Prefix

```go
func createLogger(prefix string) func(string) {

	return func(message string) {
		fmt.Println(prefix + ": " + message)
	}
}
```

Create:

```go
infoLog := createLogger("INFO")
errorLog := createLogger("ERROR")
```

Use:

```go
infoLog("Server started")
errorLog("Database connection failed")
```

Output:

```text
INFO: Server started
ERROR: Database connection failed
```

Each closure remembers its own `prefix`.

---

# 17. Closures in Backend Development

Closures appear in many areas of Go development:

### HTTP middleware

```go
func middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// logic
		next.ServeHTTP(w, r)
	})
}
```

### Callbacks

```go
someFunction(func() {
	// callback logic
})
```

### Goroutines

```go
go func() {
	// concurrent work
}()
```

### Configuration

```go
func createHandler(config Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// use config
	}
}
```

Closures are therefore not just a theoretical concept. They are useful in real applications.

---

# 18. Closure and Memory

A closure may keep captured variables alive as long as the closure can still access them.

Example:

```go
func createCounter() func() int {

	count := 0

	return func() int {
		count++
		return count
	}
}
```

Normally, `count` belongs to the function's local scope.

But because the returned function still needs `count`, Go keeps the necessary state available.

You don't need to manually manage this memory.

Go's garbage collector handles it.

---

# 19. Closure With State vs Normal Function

Normal function:

```go
func add(a, b int) int {
	return a + b
}
```

Every call is independent.

Closure:

```go
func counter() func() int {

	count := 0

	return func() int {
		count++
		return count
	}
}
```

The function maintains state between calls.

This is the major difference.

---

# 20. A Real Mental Model

Think of a normal function like a machine:

```text
Input
  ↓
Function
  ↓
Output
```

Example:

```text
10 → add(10, 5) → 15
```

A closure is more like a machine with memory:

```text
Input
  ↓
┌──────────────┐
│ Function     │
│              │
│ remembered   │
│ state        │
└──────────────┘
  ↓
Output
```

For example:

```text
counter()
   ↓
1

counter()
   ↓
2

counter()
   ↓
3
```

The function remembers what happened previously.

---

# 21. Complete Closure Example

```go
package main

import "fmt"

func createCounter(start int) func() int {

	count := start

	return func() int {
		count++
		return count
	}
}

func main() {

	counter := createCounter(100)

	fmt.Println(counter())
	fmt.Println(counter())
	fmt.Println(counter())
}
```

Output:

```text
101
102
103
```

The returned function remembers `count`.

---

# 22. Another Complete Example

Let's create a function generator:

```go
package main

import "fmt"

func createMultiplier(factor int) func(int) int {

	return func(number int) int {
		return number * factor
	}
}

func main() {

	double := createMultiplier(2)
	triple := createMultiplier(3)

	fmt.Println(double(10))
	fmt.Println(double(20))

	fmt.Println(triple(10))
	fmt.Println(triple(20))
}
```

Output:

```text
20
40
30
60
```

---

# Summary

A closure is a function that **captures variables from its surrounding environment**.

Basic example:

```go
message := "Hello"

greet := func() {
	fmt.Println(message)
}
```

The function captures:

```text
message
```

The most important closure pattern is:

```go
func createCounter() func() int {

	count := 0

	return func() int {
		count++
		return count
	}
}
```

Closures are useful for:

- Maintaining state
- Function generators
- Callbacks
- HTTP middleware
- Goroutines
- Configuration
- Encapsulation
- Backend application logic

### Remember

**Anonymous function** = function without a name.

**Closure** = function that captures variables from its surrounding scope.

An anonymous function can be a closure, but not every anonymous function necessarily captures outside variables.