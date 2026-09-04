# For Loops in Go

A loop allows you to execute code repeatedly.

For example, instead of writing:

```go
fmt.Println(1)
fmt.Println(2)
fmt.Println(3)
fmt.Println(4)
fmt.Println(5)
```

you can use a loop:

```go
for i := 1; i <= 5; i++ {
    fmt.Println(i)
}
```

Go has only **one looping keyword**:

```go
for
```

But `for` can be used in several different ways.

---

# 1. Basic For Loop

The most common form is:

```go
for initialization; condition; update {
    // code
}
```

Example:

```go
for i := 1; i <= 5; i++ {
    fmt.Println(i)
}
```

Output:

```text
1
2
3
4
5
```

---

# 2. Understanding the Three Parts

Consider:

```go
for i := 1; i <= 5; i++ {
    fmt.Println(i)
}
```

There are three parts.

### Initialization

```go
i := 1
```

Runs once before the loop starts.

### Condition

```go
i <= 5
```

Checked before every iteration.

### Update

```go
i++
```

Runs after each iteration.

The process is:

```text
i = 1
 ↓
i <= 5 ?
 ↓
execute body
 ↓
i++
 ↓
i <= 5 ?
 ↓
...
```

---

# 3. Counting from 0

A common programming pattern:

```go
for i := 0; i < 5; i++ {
    fmt.Println(i)
}
```

Output:

```text
0
1
2
3
4
```

Notice that the condition is:

```go
i < 5
```

not:

```go
i <= 5
```

---

# 4. Counting Backwards

You can decrement instead of incrementing.

```go
for i := 5; i >= 1; i-- {
    fmt.Println(i)
}
```

Output:

```text
5
4
3
2
1
```

---

# 5. Increment by More Than One

```go
for i := 0; i <= 20; i += 2 {
    fmt.Println(i)
}
```

Output:

```text
0
2
4
6
8
10
12
14
16
18
20
```

---

# 6. Infinite Loop

You can create an infinite loop using:

```go
for {
    // code
}
```

Example:

```go
for {
    fmt.Println("Running...")
}
```

This never stops unless something inside the program stops it.

Infinite loops are common in servers and continuously running programs.

---

# 7. `break`

Use `break` to immediately stop a loop.

```go
for i := 1; i <= 10; i++ {
    if i == 5 {
        break
    }

    fmt.Println(i)
}
```

Output:

```text
1
2
3
4
```

When `i` becomes `5`, `break` terminates the loop.

---

# 8. `continue`

`continue` skips the current iteration and moves to the next one.

```go
for i := 1; i <= 5; i++ {
    if i == 3 {
        continue
    }

    fmt.Println(i)
}
```

Output:

```text
1
2
4
5
```

The value `3` is skipped.

---

# 9. For Loop as a While Loop

Go does not have a separate `while` keyword.

Instead, use:

```go
for condition {
    // code
}
```

Example:

```go
i := 1

for i <= 5 {
    fmt.Println(i)

    i++
}
```

This behaves similarly to a traditional `while` loop.

---

# 10. Loop Until User Enters 0

```go
var number int

for number != 0 {
    fmt.Print("Enter number: ")
    fmt.Scan(&number)

    if number != 0 {
        fmt.Println("You entered:", number)
    }
}
```

---

# 11. Loop Through an Array

```go
numbers := [5]int{10, 20, 30, 40, 50}

for i := 0; i < len(numbers); i++ {
    fmt.Println(numbers[i])
}
```

Output:

```text
10
20
30
40
50
```

---

# 12. Loop Through a Slice

```go
numbers := []int{10, 20, 30, 40}

for i := 0; i < len(numbers); i++ {
    fmt.Println(numbers[i])
}
```

---

# 13. `range`

Go provides `range` for iterating over collections.

```go
numbers := []int{10, 20, 30}

for index, value := range numbers {
    fmt.Println(index, value)
}
```

Output:

```text
0 10
1 20
2 30
```

---

# 14. Ignore the Index

If you don't need the index, use `_`.

```go
numbers := []int{10, 20, 30}

for _, value := range numbers {
    fmt.Println(value)
}
```

Output:

```text
10
20
30
```

The `_` is called the blank identifier.

---

# 15. Only Get the Index

You can also get only the index.

```go
numbers := []int{10, 20, 30}

for index := range numbers {
    fmt.Println(index)
}
```

Output:

```text
0
1
2
```

---

# 16. Loop Through a String

You can use `range` with strings.

```go
name := "Go"

for index, char := range name {
    fmt.Println(index, char)
}
```

For Unicode text, `range` iterates over decoded runes rather than raw bytes.

---

# 17. Loop Through a Map

```go
ages := map[string]int{
    "Siam": 21,
    "Rakib": 22,
    "Sobuj": 23,
}

for name, age := range ages {
    fmt.Println(name, age)
}
```

The order of map iteration is not guaranteed.

---

# 18. Nested Loops

A loop can contain another loop.

```go
for i := 1; i <= 3; i++ {
    for j := 1; j <= 3; j++ {
        fmt.Println(i, j)
    }
}
```

This is called a nested loop.

Nested loops are very important for:

- Matrix problems
- 2D arrays
- Grid problems
- Competitive programming
- Some sorting algorithms

---

# 19. Multiplication Table

```go
number := 5

for i := 1; i <= 10; i++ {
    fmt.Println(number, "x", i, "=", number*i)
}
```

Output:

```text
5 x 1 = 5
5 x 2 = 10
5 x 3 = 15
...
5 x 10 = 50
```

---

# 20. Sum of Numbers

Calculate:

```text
1 + 2 + 3 + ... + 100
```

Code:

```go
sum := 0

for i := 1; i <= 100; i++ {
    sum += i
}

fmt.Println(sum)
```

Output:

```text
5050
```

---

# 21. Find Even Numbers

```go
for i := 1; i <= 20; i++ {
    if i%2 == 0 {
        fmt.Println(i)
    }
}
```

Output:

```text
2
4
6
8
10
12
14
16
18
20
```

---

# 22. Find Odd Numbers

```go
for i := 1; i <= 20; i++ {
    if i%2 != 0 {
        fmt.Println(i)
    }
}
```

---

# 23. Factorial

Factorial of 5:

```text
5! = 5 × 4 × 3 × 2 × 1
```

Code:

```go
factorial := 1

for i := 1; i <= 5; i++ {
    factorial *= i
}

fmt.Println(factorial)
```

Output:

```text
120
```

---

# 24. Search for a Value

```go
numbers := []int{10, 20, 30, 40, 50}

target := 30
found := false

for _, value := range numbers {
    if value == target {
        found = true
        break
    }
}

if found {
    fmt.Println("Found")
} else {
    fmt.Println("Not found")
}
```

This pattern is fundamental for algorithmic problem solving.

---

# 25. Loop with Conditions

You can combine loops with `if`.

```go
for i := 1; i <= 100; i++ {
    if i%3 == 0 && i%5 == 0 {
        fmt.Println(i, "FizzBuzz")
    }
}
```

---

# 26. Labels and Nested Loops

Go supports labels when you need to break out of an outer loop.

```go
outer:
for i := 1; i <= 3; i++ {
    for j := 1; j <= 3; j++ {
        if i == 2 && j == 2 {
            break outer
        }

        fmt.Println(i, j)
    }
}
```

The label:

```go
outer:
```

allows:

```go
break outer
```

to terminate the outer loop.

Use labels only when they make the control flow clearer.

---

# 27. Common Loop Mistake

Be careful with the condition.

This:

```go
for i := 0; i < 5; i++ {
}
```

runs 5 times.

But:

```go
for i := 0; i <= 5; i++ {
}
```

runs 6 times.

Understanding `<` vs `<=` is extremely important in programming.

---

# 28. For Loop in Competitive Programming

Loops are everywhere in algorithmic problems.

Example:

```go
var n int
fmt.Scan(&n)

sum := 0

for i := 0; i < n; i++ {
    var x int
    fmt.Scan(&x)

    sum += x
}

fmt.Println(sum)
```

Input:

```text
5
10 20 30 40 50
```

Output:

```text
150
```

This pattern appears constantly in Codeforces and LeetCode-style problems.

---

# Key Takeaways

- Go has one looping keyword: `for`.
- `for init; condition; update` is the standard form.
- `for condition` behaves like a while loop.
- `for {}` creates an infinite loop.
- `break` stops a loop.
- `continue` skips the current iteration.
- `range` is useful for arrays, slices, maps, and strings.
- Nested loops are useful for 2D and algorithmic problems.
- Loops are one of the most important concepts for DSA and competitive programming.