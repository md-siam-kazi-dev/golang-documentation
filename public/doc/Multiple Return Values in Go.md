# Multiple Return Values in Go

One of Go's most useful features is the ability for a function to return **multiple values**.

This is very common in real Go applications, especially when handling errors.

---

# 1. The Basic Idea

In many programming languages, a function normally returns one value.

Go allows:

```go
func function() (value1Type, value2Type) {
	// ...
}
```

For example:

```go
func getUser() (string, int) {
	return "Siam", 21
}
```

The function returns two values:

```text
"Siam"
21
```

---

# 2. Receiving Multiple Values

```go
package main

import "fmt"

func getUser() (string, int) {
	return "Siam", 21
}

func main() {
	name, age := getUser()

	fmt.Println(name)
	fmt.Println(age)
}
```

Output:

```text
Siam
21
```

---

# 3. Declaring Multiple Return Types

The return types are placed inside parentheses:

```go
func getUser() (string, int) {
	return "Siam", 21
}
```

This means:

```text
First return value → string
Second return value → int
```

---

# 4. Returning Three Values

A function can return more than two values.

```go
func getPerson() (string, int, string) {
	return "Siam", 21, "Bangladesh"
}
```

Use it:

```go
name, age, country := getPerson()

fmt.Println(name)
fmt.Println(age)
fmt.Println(country)
```

Output:

```text
Siam
21
Bangladesh
```

---

# 5. Why Does Go Need Multiple Return Values?

One major reason is **error handling**.

Consider a function that divides two numbers.

What happens if the denominator is zero?

Instead of returning only the result, we can return:

```text
result
error
```

Example:

```go
func divide(a, b float64) (float64, error) {
	if b == 0 {
		return 0, fmt.Errorf("cannot divide by zero")
	}

	return a / b, nil
}
```

Now the function communicates both:

```text
result
error
```

---

# 6. Handling the Error

```go
result, err := divide(10, 2)

if err != nil {
	fmt.Println(err)
	return
}

fmt.Println(result)
```

Output:

```text
5
```

If we call:

```go
result, err := divide(10, 0)
```

Output:

```text
cannot divide by zero
```

This pattern is everywhere in Go.

---

# 7. Understanding `nil`

When there is no error:

```go
return result, nil
```

`nil` means there is no error value.

So:

```go
if err != nil {
	// error exists
}
```

means:

> If `err` is not nil, something went wrong.

---

# 8. The Most Common Go Pattern

You will frequently see:

```go
value, err := someFunction()

if err != nil {
	return err
}
```

For example:

```go
user, err := getUser()

if err != nil {
	return err
}

fmt.Println(user)
```

Learn this pattern well because you will use it constantly in Go backend development.

---

# 9. Ignoring a Return Value

Sometimes you don't need every returned value.

Use `_` to ignore a value.

```go
name, _ := getUser()
```

Here:

```text
name → used
age  → ignored
```

Example:

```go
func getUser() (string, int) {
	return "Siam", 21
}

func main() {
	name, _ := getUser()

	fmt.Println(name)
}
```

Output:

```text
Siam
```

---

# 10. Ignoring the First Value

You can also ignore the first value:

```go
_, age := getUser()
```

---

# 11. Ignoring Multiple Values

```go
_, _, country := getPerson()
```

Only `country` is kept.

---

# 12. Named Return Values

Go allows return values to have names.

Instead of:

```go
func add(a, b int) (int, int) {
	return a + b, a * b
}
```

You can write:

```go
func add(a, b int) (sum int, product int) {
	return a + b, a * b
}
```

Now the return values have names:

```text
sum
product
```

---

# 13. Naked Return

With named return values, Go allows a naked `return`.

```go
func calculate(a, b int) (sum int, product int) {
	sum = a + b
	product = a * b

	return
}
```

Example:

```go
sum, product := calculate(5, 4)

fmt.Println(sum)
fmt.Println(product)
```

Output:

```text
9
20
```

Although this is valid Go, avoid excessive use of naked returns in large functions because explicit returns are often easier to understand.

---

# 14. Multiple Return Values With Different Types

The return values don't need to have the same type.

```go
func getInfo() (string, int, bool) {
	return "Siam", 21, true
}
```

---

# 15. Multiple Return Values From Another Function

A function can receive the multiple values returned by another function.

```go
func getNumbers() (int, int) {
	return 10, 20
}

func calculate() int {
	a, b := getNumbers()

	return a + b
}
```

---

# 16. Practical Example: Find Min and Max

```go
func minMax(numbers []int) (int, int) {
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

Use it:

```go
numbers := []int{10, 5, 30, 2, 20}

min, max := minMax(numbers)

fmt.Println("Min:", min)
fmt.Println("Max:", max)
```

Output:

```text
Min: 2
Max: 30
```

---

# 17. Practical Example: User Lookup

Imagine a backend application.

```go
type User struct {
	ID   int
	Name string
}
```

We can create:

```go
func findUser(id int) (User, error) {
	if id <= 0 {
		return User{}, fmt.Errorf("invalid user ID")
	}

	user := User{
		ID:   id,
		Name: "Siam",
	}

	return user, nil
}
```

Use it:

```go
user, err := findUser(10)

if err != nil {
	fmt.Println(err)
	return
}

fmt.Println(user.Name)
```

This is very similar to patterns you'll use with databases.

---

# 18. Returning Data and Error

A common backend function looks like:

```go
func CreateUser(name string) (User, error) {
	// create user

	return user, nil
}
```

Then:

```go
user, err := CreateUser("Siam")

if err != nil {
	return err
}

fmt.Println(user)
```

This combination is one of the most important Go patterns:

```go
(value, error)
```

---

# 19. Multiple Return Values vs Struct

Sometimes you might have:

```go
func getUser() (string, int, string) {
	return "Siam", 21, "Bangladesh"
}
```

If there are many related values, a struct may be better:

```go
type User struct {
	Name    string
	Age     int
	Country string
}
```

Then:

```go
func getUser() User {
	return User{
		Name:    "Siam",
		Age:     21,
		Country: "Bangladesh",
	}
}
```

A good rule:

> Use multiple returns for a small number of logically related results. Use a struct when the returned data represents a meaningful object.

---

# 20. Important Rule

The number of values you receive must match the number of returned values unless you use `_`.

If:

```go
func getUser() (string, int) {
	return "Siam", 21
}
```

Correct:

```go
name, age := getUser()
```

Also correct:

```go
name, _ := getUser()
```

Incorrect:

```go
name := getUser()
```

because the function returns two values.

---

# Summary

Go functions can return multiple values:

```go
func getUser() (string, int) {
	return "Siam", 21
}
```

You can receive them:

```go
name, age := getUser()
```

You can ignore values:

```go
name, _ := getUser()
```

The most important real-world pattern is:

```go
value, err := function()

if err != nil {
	return err
}
```

Master this pattern because it appears throughout Go's standard library and backend development.