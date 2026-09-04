# Strings in Go

A **string** is a sequence of bytes that usually represents text.

Strings are used everywhere:

```go
name := "Siam"
message := "Hello, Go!"
email := "siam@example.com"
```

Go's string model is simple but very important:

> A Go string is an immutable sequence of bytes.

Understanding **bytes, runes, UTF-8, indexing, and iteration** is essential for becoming good at Go.

---

# 1. Creating a String

The most common way:

```go
name := "Siam"
```

Example:

```go
package main

import "fmt"

func main() {
	name := "Siam"

	fmt.Println(name)
}
```

Output:

```text
Siam
```

---

# 2. String With Spaces

```go
message := "Hello, welcome to Go!"

fmt.Println(message)
```

Output:

```text
Hello, welcome to Go!
```

---

# 3. Double Quotes

Normal strings use double quotes:

```go
name := "Siam"
```

These are called **interpreted string literals**.

Escape sequences such as `\n` and `\t` work inside them.

---

# 4. New Line

You can use:

```go
message := "Hello\nGo"
```

Output:

```text
Hello
Go
```

---

# 5. Tab

```go
message := "Name:\tSiam"
```

Output:

```text
Name:	Siam
```

---

# 6. Raw String Literals

Go also supports backticks:

```go
message := `Hello
Go
World`
```

The contents are treated as a raw string.

This is useful for:

- Multi-line text
- SQL queries
- JSON examples
- Regular expressions
- Templates

Example:

```go
query := `
SELECT id, name
FROM users
WHERE id = 10;
`
```

---

# 7. String Length

Use:

```go
len()
```

Example:

```go
name := "Siam"

fmt.Println(len(name))
```

Output:

```text
4
```

But there is an important detail.

`len()` returns the number of **bytes**, not necessarily the number of human-readable characters.

---

# 8. ASCII Example

For ASCII text:

```go
name := "Siam"
```

Each character uses one byte:

```text
S → 1 byte
i → 1 byte
a → 1 byte
m → 1 byte
```

Therefore:

```go
len(name)
```

is:

```text
4
```

---

# 9. UTF-8 and Unicode

Go strings use UTF-8 encoded bytes.

For example:

```go
text := "বাংলা"
```

The visible number of characters is not the same as the byte length.

```go
fmt.Println(len(text))
```

may produce a number larger than the number of visible characters because Bengali characters generally require multiple UTF-8 bytes.

This is why you should distinguish between:

```text
bytes
```

and:

```text
runes
```

---

# 10. String Indexing

You can access a string by index:

```go
text := "Hello"

fmt.Println(text[0])
```

Output:

```text
72
```

Why `72` instead of `H`?

Because:

```go
text[0]
```

returns a **byte**.

The ASCII value of `H` is 72.

---

# 11. Converting a Byte to a Character

You can print it as a character:

```go
fmt.Printf("%c\n", text[0])
```

Output:

```text
H
```

---

# 12. Accessing Other Bytes

```go
text := "Hello"

fmt.Printf("%c\n", text[0])
fmt.Printf("%c\n", text[1])
fmt.Printf("%c\n", text[2])
```

Output:

```text
H
e
l
```

---

# 13. Strings Are Immutable

You cannot directly change a character inside a string.

This is invalid:

```go
text := "Hello"

text[0] = 'Y'
```

Go will produce an error.

Why?

Because strings are immutable.

---

# 14. Converting a String to a Byte Slice

If you need to modify ASCII/byte-oriented text:

```go
text := "Hello"

bytes := []byte(text)

bytes[0] = 'Y'

text = string(bytes)

fmt.Println(text)
```

Output:

```text
Yello
```

The process is:

```text
string
  ↓
[]byte
  ↓
modify
  ↓
string
```

---

# 15. Strings and Bytes

A string can be converted to a byte slice:

```go
bytes := []byte("Hello")
```

You can inspect:

```go
fmt.Println(bytes)
```

Output:

```text
[72 101 108 108 111]
```

These are the UTF-8 bytes for the string.

---

# 16. Converting Bytes Back to String

```go
bytes := []byte{72, 101, 108, 108, 111}

text := string(bytes)

fmt.Println(text)
```

Output:

```text
Hello
```

---

# 17. Runes

A **rune** is an alias for:

```go
int32
```

A rune represents a Unicode code point.

Example:

```go
var r rune = 'A'
```

You can also write:

```go
var r rune = 'বাংলা'
```

But a single rune literal must represent exactly one Unicode code point, so a word such as `"বাংলা"` is a string, not one rune.

---

# 18. Rune Literal

Single quotes represent a character/rune:

```go
r := 'A'
```

Double quotes represent a string:

```go
s := "A"
```

These are different:

```text
'A' → rune
"A" → string
```

---

# 19. Iterating Over a String

There are two important ways to loop through strings.

### Byte iteration

```go
text := "Hello"

for i := 0; i < len(text); i++ {
	fmt.Printf("%c\n", text[i])
}
```

This works naturally for ASCII.

### Rune iteration

Use `range`:

```go
text := "Hello"

for _, r := range text {
	fmt.Printf("%c\n", r)
}
```

For Unicode text, `range` is usually what you want when processing characters.

---

# 20. Unicode Example

```go
text := "বাংলা"

for _, r := range text {
	fmt.Printf("%c\n", r)
}
```

This iterates over Unicode code points rather than individual UTF-8 bytes.

This is one of the most important differences between:

```go
text[i]
```

and:

```go
for _, r := range text
```

---

# 21. Converting String to Runes

If you need random access by Unicode character:

```go
text := "বাংলা"

runes := []rune(text)

fmt.Println(len(runes))
```

Now:

```go
runes[0]
```

represents the first Unicode code point.

You can modify the rune slice:

```go
runes[0] = 'গ'

text = string(runes)
```

---

# 22. Byte vs Rune

This is extremely important.

### Byte

```go
byte
```

is:

```go
uint8
```

It represents one byte.

### Rune

```go
rune
```

is:

```go
int32
```

It represents a Unicode code point.

Think:

```text
byte → raw UTF-8 data
rune → Unicode character/code point
```

---

# 23. String Concatenation

You can combine strings with `+`.

```go
firstName := "Md"
lastName := "Siam"

fullName := firstName + " " + lastName

fmt.Println(fullName)
```

Output:

```text
Md Siam
```

---

# 24. Concatenation With `+=`

```go
message := "Hello"

message += " Go"

fmt.Println(message)
```

Output:

```text
Hello Go
```

---

# 25. `fmt.Sprintf`

For formatted strings:

```go
name := "Siam"
age := 21

message := fmt.Sprintf(
	"My name is %s and I am %d years old.",
	name,
	age,
)

fmt.Println(message)
```

Output:

```text
My name is Siam and I am 21 years old.
```

---

# 26. Comparing Strings

You can compare strings:

```go
a := "hello"
b := "hello"

fmt.Println(a == b)
```

Output:

```text
true
```

Different:

```go
a := "hello"
b := "world"

fmt.Println(a == b)
```

Output:

```text
false
```

You can also use:

```go
!=
```

---

# 27. Lexicographical Comparison

Strings can also be compared with:

```go
<
>
<=
>=
```

Example:

```go
fmt.Println("apple" < "banana")
```

Output:

```text
true
```

This is lexicographical ordering based on byte/string ordering.

---

# 28. Useful `strings` Package

Go provides the `strings` package for common string operations.

Import:

```go
import "strings"
```

---

# 29. `strings.Contains`

Check whether a string contains another string.

```go
message := "I love Go"

fmt.Println(strings.Contains(message, "Go"))
```

Output:

```text
true
```

---

# 30. `strings.HasPrefix`

```go
url := "https://example.com"

fmt.Println(strings.HasPrefix(url, "https://"))
```

Output:

```text
true
```

---

# 31. `strings.HasSuffix`

```go
filename := "main.go"

fmt.Println(strings.HasSuffix(filename, ".go"))
```

Output:

```text
true
```

---

# 32. `strings.ToUpper`

```go
text := "hello"

fmt.Println(strings.ToUpper(text))
```

Output:

```text
HELLO
```

---

# 33. `strings.ToLower`

```go
text := "HELLO"

fmt.Println(strings.ToLower(text))
```

Output:

```text
hello
```

---

# 34. `strings.TrimSpace`

Remove leading and trailing whitespace:

```go
text := "   hello   "

text = strings.TrimSpace(text)

fmt.Println(text)
```

Output:

```text
hello
```

This is very useful when processing user input.

---

# 35. `strings.Split`

Split a string into a slice.

```go
text := "apple,banana,orange"

fruits := strings.Split(text, ",")

fmt.Println(fruits)
```

Output:

```text
[apple banana orange]
```

This is a common bridge between **strings and slices**.

---

# 36. `strings.Join`

The opposite of `Split`.

```go
fruits := []string{
	"apple",
	"banana",
	"orange",
}

text := strings.Join(fruits, ", ")

fmt.Println(text)
```

Output:

```text
apple, banana, orange
```

---

# 37. `strings.Replace`

Replace text:

```go
text := "I love Java"

text = strings.Replace(text, "Java", "Go", 1)

fmt.Println(text)
```

Output:

```text
I love Go
```

The final `1` means replace at most one occurrence.

Use `-1` to replace all occurrences:

```go
strings.Replace(text, "Java", "Go", -1)
```

---

# 38. `strings.Count`

Count occurrences:

```go
text := "banana"

fmt.Println(strings.Count(text, "a"))
```

Output:

```text
3
```

---

# 39. `strings.Index`

Find the index of a substring:

```go
text := "Hello Go"

index := strings.Index(text, "Go")

fmt.Println(index)
```

Output:

```text
6
```

If the substring doesn't exist, it returns:

```text
-1
```

---

# 40. Practical Example: Palindrome

A common programming problem is checking whether a string is a palindrome.

Example:

```text
madam
```

Read from both directions:

```text
madam
madam
```

One approach:

```go
func isPalindrome(s string) bool {
	left := 0
	right := len(s) - 1

	for left < right {
		if s[left] != s[right] {
			return false
		}

		left++
		right--
	}

	return true
}
```

This works for ASCII/byte-oriented strings.

For Unicode-aware character processing, convert to `[]rune`.

---

# 41. Palindrome With Runes

```go
func isPalindrome(s string) bool {
	runes := []rune(s)

	left := 0
	right := len(runes) - 1

	for left < right {
		if runes[left] != runes[right] {
			return false
		}

		left++
		right--
	}

	return true
}
```

This handles Unicode code points more naturally.

---

# 42. Counting Characters

For lowercase English letters, an array is often faster and simpler:

```go
func frequency(s string) [26]int {
	var freq [26]int

	for _, r := range s {
		freq[r-'a']++
	}

	return freq
}
```

This connects the concepts you've already learned:

```text
String
  ↓
Range / rune
  ↓
Array
  ↓
Frequency counting
```

---

# 43. Reverse a String

For Unicode-aware reversal:

```go
func reverse(s string) string {
	runes := []rune(s)

	for left, right := 0, len(runes)-1; left < right; left, right = left+1, right-1 {
		runes[left], runes[right] = runes[right], runes[left]
	}

	return string(runes)
}
```

Example:

```go
fmt.Println(reverse("hello"))
```

Output:

```text
olleh
```

---

# 44. Important: Unicode and Grapheme Clusters

A rune is a Unicode code point, not necessarily a complete user-perceived character.

For example, some visible characters can be represented by multiple Unicode code points.

Therefore:

```text
byte ≠ rune ≠ user-perceived character
```

For most beginner Go programs:

- Use bytes for ASCII/binary-oriented processing.
- Use `range`/runes for Unicode code-point processing.
- For true human-readable character segmentation, specialized Unicode text processing may be needed.

---

# 45. Strings in HTTP APIs

Strings are everywhere in backend development.

Example:

```go
func greetUser(name string) string {
	return "Hello, " + name
}
```

An HTTP request might provide:

```text
name=Siam
```

Your Go application processes it as a string.

Database values such as:

```text
username
email
password hash
title
description
```

are also commonly represented as strings.

---

# 46. Strings and JSON

Example struct:

```go
type User struct {
	Name  string `json:"name"`
	Email string `json:"email"`
}
```

The fields are strings.

Example JSON:

```json
{
	"name": "Siam",
	"email": "siam@example.com"
}
```

This is why understanding strings is essential for backend development.

---

# 47. Common Mistake: `len()` and Unicode

Do not assume:

```go
len(s)
```

means:

> number of visible characters.

It means:

> number of bytes in the string.

For Unicode code points:

```go
len([]rune(s))
```

can be used.

Example:

```go
text := "বাংলা"

fmt.Println(len(text))
fmt.Println(len([]rune(text)))
```

The values can be different.

---

# 48. String Builder

When repeatedly constructing a large string, `strings.Builder` can be useful.

```go
var builder strings.Builder

builder.WriteString("Hello")
builder.WriteString(" ")
builder.WriteString("Go")

result := builder.String()

fmt.Println(result)
```

Output:

```text
Hello Go
```

This is especially useful when building strings incrementally.

---

# 49. Practical Example: Building a Sentence

```go
words := []string{
	"Go",
	"is",
	"fast",
	"and",
	"simple",
}

sentence := strings.Join(words, " ")

fmt.Println(sentence)
```

Output:

```text
Go is fast and simple
```

Notice how strings and slices work together:

```text
[]string
   ↓
strings.Join()
   ↓
string
```

---

# 50. Important String Concepts

You should understand these concepts before moving to advanced Go:

```text
string
byte
rune
UTF-8
[]byte
[]rune
range
strings package
strings.Builder
```

A useful mental model:

```text
String
  │
  ├── bytes
  │     └── UTF-8 encoded data
  │
  └── runes
        └── Unicode code points
```

---

# Summary

A Go string is an immutable sequence of bytes.

Create:

```go
name := "Siam"
```

Length in bytes:

```go
len(name)
```

Access a byte:

```go
name[0]
```

Convert to bytes:

```go
[]byte(name)
```

Convert to runes:

```go
[]rune(name)
```

Unicode-aware iteration:

```go
for _, r := range name {
	fmt.Println(r)
}
```

Concatenate:

```go
a + b
```

Useful package:

```go
import "strings"
```

Common functions:

```go
strings.Contains()
strings.HasPrefix()
strings.HasSuffix()
strings.ToUpper()
strings.ToLower()
strings.TrimSpace()
strings.Split()
strings.Join()
strings.Replace()
strings.Count()
strings.Index()
```

### The key distinction

```text
Array  → fixed-size collection
Slice  → dynamic/flexible collection
String → immutable sequence of bytes
Rune   → Unicode code point
Byte   → 8-bit value
```

Mastering these three topics—**arrays, slices, and strings**—gives you a strong foundation for maps, structs, algorithms, JSON, HTTP APIs, and Go backend development.