# Functions in Go

Functions are one of the most important concepts in Go.

A **function** is a reusable block of code that performs a specific task.

Instead of writing the same code again and again, we can put that code inside a function and call the function whenever we need it.

---

## 1. Why Do We Need Functions?

Imagine you need to print a welcome message 5 times.

Without a function:

```go
package main

import "fmt"

func main() {
	fmt.Println("Welcome to Go!")
	fmt.Println("Welcome to Go!")
	fmt.Println("Welcome to Go!")
	fmt.Println("Welcome to Go!")
	fmt.Println("Welcome to Go!")
}
```

This works, but it is repetitive.

With a function:

```go
package main

import "fmt"

func welcome() {
	fmt.Println("Welcome to Go!")
}

func main() {
	welcome()
	welcome()
	welcome()
	welcome()
	welcome()
}
```

Now the code is reusable.

---

# 2. Creating a Function

The basic syntax of a Go function is:

```go
func functionName() {
	// function body
}
```

For example:

```go
func sayHello() {
	fmt.Println("Hello!")
}
```

Here:

- `func` tells Go that we are defining a function.
- `sayHello` is the function name.
- `()` contains parameters.
- `{}` contains the function body.

---

# 3. Calling a Function

Defining a function does not execute it.

You need to **call** the function.

```go
package main

import "fmt"

func sayHello() {
	fmt.Println("Hello, Go!")
}

func main() {
	sayHello()
}
```

Output:

```text
Hello, Go!
```

Think of it like this:

```text
Define function
      ↓
   sayHello()
      ↓
Call function
      ↓
Execute function body
```

---

# 4. Function With Parameters

A function can receive data from the caller.

These inputs are called **parameters**.

```go
package main

import "fmt"

func greet(name string) {
	fmt.Println("Hello", name)
}

func main() {
	greet("Siam")
	greet("Rakib")
}
```

Output:

```text
Hello Siam
Hello Rakib
```

Here:

```go
name string
```

is a parameter.

When we call:

```go
greet("Siam")
```

`"Siam"` is the argument.

### Parameter vs Argument

```go
func greet(name string) {
}
```

`name` → parameter

```go
greet("Siam")
```

`"Siam"` → argument

---

# 5. Multiple Parameters

A function can accept multiple parameters.

```go
func add(a int, b int) {
	fmt.Println(a + b)
}
```

Call it:

```go
add(10, 20)
```

Output:

```text
30
```

Go also provides a shorter syntax when consecutive parameters have the same type:

```go
func add(a, b int) {
	fmt.Println(a + b)
}
```

---

# 6. Function That Returns a Value

A function can return a result.

Syntax:

```go
func functionName() returnType {
	// code
	return value
}
```

Example:

```go
func add(a, b int) int {
	return a + b
}
```

Use it:

```go
package main

import "fmt"

func add(a, b int) int {
	return a + b
}

func main() {
	result := add(10, 20)

	fmt.Println(result)
}
```

Output:

```text
30
```

The important part is:

```go
int
```

This tells Go that the function returns an integer.

---

# 7. Returning a String

Functions can return any valid Go type.

```go
func getName() string {
	return "Siam"
}
```

Example:

```go
func main() {
	name := getName()

	fmt.Println(name)
}
```

Output:

```text
Siam
```

---

# 8. Returning a Boolean

```go
func isAdult(age int) bool {
	return age >= 18
}
```

Example:

```go
func main() {
	result := isAdult(21)

	fmt.Println(result)
}
```

Output:

```text
true
```

---

# 9. Function Without Parameters but With Return Value

Parameters and return values are independent.

A function can have no parameters but still return something.

```go
func getAge() int {
	return 21
}
```

---

# 10. Function With Parameters and Return Value

This is extremely common.

```go
func multiply(a, b int) int {
	return a * b
}
```

Example:

```go
result := multiply(5, 4)

fmt.Println(result)
```

Output:

```text
20
```

---

# 11. Functions Can Call Other Functions

One function can call another function.

```go
package main

import "fmt"

func square(n int) int {
	return n * n
}

func printSquare(n int) {
	result := square(n)

	fmt.Println(result)
}

func main() {
	printSquare(5)
}
```

Output:

```text
25
```

Execution:

```text
main()
  ↓
printSquare(5)
  ↓
square(5)
  ↓
25
```

---

# 12. Function Calling Another Function

You can build larger programs by combining small functions.

```go
func add(a, b int) int {
	return a + b
}

func subtract(a, b int) int {
	return a - b
}

func multiply(a, b int) int {
	return a * b
}

func main() {
	fmt.Println(add(10, 5))
	fmt.Println(subtract(10, 5))
	fmt.Println(multiply(10, 5))
}
```

This is much easier to maintain than putting everything inside `main()`.

---

# 13. Function With No Return Value

A function does not have to return anything.

```go
func printMessage() {
	fmt.Println("Learning Go")
}
```

---

# 14. Early Return

You can use `return` to stop a function early.

```go
func checkAge(age int) {
	if age < 18 {
		fmt.Println("You are not an adult")
		return
	}

	fmt.Println("You are an adult")
}
```

Example:

```go
checkAge(16)
```

Output:

```text
You are not an adult
```

---

# 15. Functions and Local Variables

Variables created inside a function are generally local to that function.

```go
func calculate() {
	x := 10

	fmt.Println(x)
}
```

You cannot directly use `x` outside the function:

```go
func calculate() {
	x := 10
}

func main() {
	fmt.Println(x) // Error
}
```

The variable `x` belongs to the scope of `calculate`.

---

# 16. Practical Example: Calculator

We can use functions to build a simple calculator.

```go
package main

import "fmt"

func add(a, b float64) float64 {
	return a + b
}

func subtract(a, b float64) float64 {
	return a - b
}

func multiply(a, b float64) float64 {
	return a * b
}

func divide(a, b float64) float64 {
	return a / b
}

func main() {
	fmt.Println(add(10, 5))
	fmt.Println(subtract(10, 5))
	fmt.Println(multiply(10, 5))
	fmt.Println(divide(10, 5))
}
```

Output:

```text
15
5
50
2
```

---

# 17. Functions Improve Code Organization

Bad:

```go
func main() {
	// validate user

	// connect database

	// fetch user

	// calculate price

	// send response
}
```

Better:

```go
func main() {
	validateUser()
	connectDatabase()
	getUser()
	calculatePrice()
	sendResponse()
}
```

Each function has one clear responsibility.

This becomes extremely important when building real applications.

---

# 18. Function Naming Convention

Go convention is to use short, descriptive names.

Good:

```go
calculateTotal()
getUser()
createUser()
deleteUser()
isValid()
```

Bad:

```go
doSomething()
abc()
function1()
myFunction()
```

A function name should tell you what the function does.

---

# 19. Exported Functions

In Go, capitalization has an important meaning.

```go
func calculate() {
}
```

This function is **unexported**.

```go
func Calculate() {
}
```

This function is **exported**.

Exported identifiers start with an uppercase letter and can be accessed from another package.

Example:

```go
package mathutil

func Add(a, b int) int {
	return a + b
}
```

Another package can use:

```go
mathutil.Add(10, 20)
```

---

# 20. Function as a Building Block

Think about a real backend application:

```text
HTTP Request
     ↓
Handler
     ↓
Service Function
     ↓
Repository Function
     ↓
Database
```

For example:

```go
func GetUser(id int) User {
	// get user from database
}
```

Functions are the building blocks that allow us to divide a large program into manageable pieces.

---

# Summary

A Go function:

```go
func name(parameters) returnType {
	// body
	return value
}
```

Remember:

- Functions make code reusable.
- Functions can accept parameters.
- Functions can return values.
- Functions can call other functions.
- Functions help organize large programs.
- Functions can be exported or unexported.
- Good functions usually have a clear responsibility.

The next important concept is **Multiple Return Values**, one of Go's most useful features.