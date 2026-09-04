# Arrays in Go

An **array** is a collection of values of the **same type** with a **fixed length**.

For example:

```go
var numbers [5]int
```

This creates an array that can store exactly 5 integers.

Think of an array like a row of boxes:

```text
Index:    0    1    2    3    4
        ┌────┬────┬────┬────┬────┐
Value:  │ 10 │ 20 │ 30 │ 40 │ 50 │
        └────┴────┴────┴────┴────┘
```

The first element is at index `0`, not `1`.

---

# 1. Creating an Array

Basic syntax:

```go
var numbers [5]int
```

Example:

```go
package main

import "fmt"

func main() {
	var numbers [5]int

	fmt.Println(numbers)
}
```

Output:

```text
[0 0 0 0 0]
```

Why?

Because Go automatically initializes array elements with their **zero value**.

For `int`, the zero value is:

```text
0
```

---

# 2. Array With Initial Values

You can initialize an array directly:

```go
numbers := [5]int{10, 20, 30, 40, 50}

fmt.Println(numbers)
```

Output:

```text
[10 20 30 40 50]
```

---

# 3. Accessing Array Elements

Use the index:

```go
numbers := [5]int{10, 20, 30, 40, 50}

fmt.Println(numbers[0])
fmt.Println(numbers[1])
fmt.Println(numbers[4])
```

Output:

```text
10
20
50
```

Remember:

```text
numbers[0] → first element
numbers[1] → second element
numbers[2] → third element
```

---

# 4. Updating an Array Element

You can change an element using its index.

```go
numbers := [5]int{10, 20, 30, 40, 50}

numbers[2] = 100

fmt.Println(numbers)
```

Output:

```text
[10 20 100 40 50]
```

---

# 5. Array Index Starts at Zero

Suppose:

```go
numbers := [5]int{10, 20, 30, 40, 50}
```

The indexes are:

```text
Value:   10   20   30   40   50
Index:    0    1    2    3    4
```

The last index is:

```go
len(numbers) - 1
```

So:

```go
len(numbers)
```

returns:

```text
5
```

and the last index is:

```text
4
```

---

# 6. Array Length

Use the built-in `len()` function.

```go
numbers := [5]int{10, 20, 30, 40, 50}

fmt.Println(len(numbers))
```

Output:

```text
5
```

---

# 7. Let Go Calculate the Length

You don't always have to specify the array size.

Use:

```go
numbers := [...]int{10, 20, 30, 40, 50}
```

Go calculates the length automatically.

```go
fmt.Println(len(numbers))
```

Output:

```text
5
```

Another example:

```go
names := [...]string{
	"Siam",
	"Rakib",
	"Sobuj",
}
```

This creates:

```text
[3]string
```

---

# 8. Array With Specific Index Values

Go allows you to initialize specific indexes.

```go
numbers := [5]int{
	0: 100,
	3: 400,
}

fmt.Println(numbers)
```

Output:

```text
[100 0 0 400 0]
```

Only indexes `0` and `3` were explicitly initialized.

The other elements receive their zero value.

---

# 9. Arrays of Strings

Arrays aren't limited to integers.

```go
names := [3]string{
	"Siam",
	"Rakib",
	"Sobuj",
}

fmt.Println(names)
```

Output:

```text
[Siam Rakib Sobuj]
```

---

# 10. Arrays of Booleans

```go
flags := [3]bool{
	true,
	false,
	true,
}

fmt.Println(flags)
```

Output:

```text
[true false true]
```

---

# 11. Looping Through an Array

A very common way to process an array is with a `for` loop.

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

# 12. Using `range`

Go's `range` is often cleaner.

```go
numbers := [5]int{10, 20, 30, 40, 50}

for index, value := range numbers {
	fmt.Println(index, value)
}
```

Output:

```text
0 10
1 20
2 30
3 40
4 50
```

---

# 13. Ignoring the Index

If you only need the values:

```go
for _, value := range numbers {
	fmt.Println(value)
}
```

The `_` means:

> I don't need this value.

---

# 14. Array of Characters

Go does not have a separate `char` type like some languages.

You can use bytes or runes.

For ASCII characters:

```go
letters := [3]byte{'a', 'b', 'c'}

fmt.Println(letters)
```

Output:

```text
[97 98 99]
```

Why numbers?

Because a `byte` stores the numeric UTF-8 byte value.

---

# 15. Comparing Arrays

Arrays can be compared using `==` if their element type is comparable.

Example:

```go
a := [3]int{1, 2, 3}
b := [3]int{1, 2, 3}

fmt.Println(a == b)
```

Output:

```text
true
```

Different values:

```go
a := [3]int{1, 2, 3}
b := [3]int{1, 2, 4}

fmt.Println(a == b)
```

Output:

```text
false
```

---

# 16. Array Length Is Part of Its Type

This is one of the most important things to understand.

These are different types:

```go
[3]int
```

and:

```go
[4]int
```

For example:

```go
var a [3]int
var b [4]int
```

You cannot assign one directly to the other:

```go
a = b // Error
```

Even though both contain integers.

---

# 17. Arrays Are Value Types

When you assign an array to another variable, Go copies the entire array.

```go
a := [3]int{10, 20, 30}

b := a

b[0] = 100

fmt.Println(a)
fmt.Println(b)
```

Output:

```text
[10 20 30]
[100 20 30]
```

Changing `b` did not change `a`.

Why?

Because:

```text
a
 ↓
[10 20 30]

b := a

a → [10 20 30]
b → [10 20 30]
```

They are separate arrays.

---

# 18. Passing an Array to a Function

Because arrays are values, passing an array to a function copies it.

```go
func change(numbers [3]int) {
	numbers[0] = 100
}
```

Example:

```go
numbers := [3]int{10, 20, 30}

change(numbers)

fmt.Println(numbers)
```

Output:

```text
[10 20 30]
```

The original array wasn't changed.

---

# 19. Passing a Pointer to an Array

If you want the function to modify the original array:

```go
func change(numbers *[3]int) {
	numbers[0] = 100
}
```

Then:

```go
numbers := [3]int{10, 20, 30}

change(&numbers)

fmt.Println(numbers)
```

Output:

```text
[100 20 30]
```

However, in normal Go application development, **slices are usually preferred over arrays** when you need a flexible collection.

---

# 20. Multidimensional Arrays

An array can contain other arrays.

For example, a 2D array:

```go
var matrix [2][3]int
```

This means:

```text
2 rows
3 columns
```

You can initialize it:

```go
matrix := [2][3]int{
	{1, 2, 3},
	{4, 5, 6},
}

fmt.Println(matrix)
```

Output:

```text
[[1 2 3] [4 5 6]]
```

---

# 21. Accessing a 2D Array

```go
fmt.Println(matrix[0][0])
fmt.Println(matrix[1][2])
```

Output:

```text
1
6
```

---

# 22. Looping Through a 2D Array

```go
for i := 0; i < len(matrix); i++ {
	for j := 0; j < len(matrix[i]); j++ {
		fmt.Print(matrix[i][j], " ")
	}

	fmt.Println()
}
```

Output:

```text
1 2 3
4 5 6
```

---

# 23. Practical Example: Frequency Array

Arrays are very useful in competitive programming.

Suppose we want to count the frequency of lowercase English letters.

There are exactly 26 letters:

```go
freq := [26]int{}
```

Now:

```go
freq[0]++
```

represents:

```text
a
```

and:

```go
freq[1]++
```

represents:

```text
b
```

You can calculate an index with:

```go
index := ch - 'a'
```

Example:

```go
package main

import "fmt"

func main() {
	freq := [26]int{}

	word := "banana"

	for _, ch := range word {
		freq[ch-'a']++
	}

	fmt.Println(freq)
}
```

The frequency array is extremely useful for LeetCode and Codeforces problems.

---

# 24. When Should You Use Arrays?

Arrays are useful when the size is known and fixed.

Examples:

```go
var days [7]string
```

```go
var months [12]string
```

```go
var frequency [26]int
```

```go
var board [8][8]string
```

If the number of elements can change, a slice is usually a better choice.

---

# Summary

An array:

```go
var numbers [5]int
```

has:

- A fixed length.
- Elements of the same type.
- Zero-based indexing.
- A length that is part of its type.
- Value semantics.

Important syntax:

```go
numbers := [5]int{1, 2, 3, 4, 5}
```

Automatically sized:

```go
numbers := [...]int{1, 2, 3}
```

Access:

```go
numbers[0]
```

Length:

```go
len(numbers)
```

Loop:

```go
for _, value := range numbers {
	fmt.Println(value)
}
```

For flexible collections, you'll usually use a **slice**.