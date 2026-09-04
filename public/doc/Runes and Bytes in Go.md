# Runes and Bytes in Go

In Go, **strings, bytes, and runes** are closely related, but they are not the same thing.

Understanding them properly is extremely important when working with:

- Text processing
- Unicode
- File handling
- HTTP requests
- JSON
- String algorithms
- Competitive programming
- Backend development

---

# 1. What is a Byte?

A **byte** in Go is an alias for `uint8`.

```go
var b byte = 65

fmt.Println(b)
```

Output:

```text
65
```

A byte stores **one 8-bit value**.

Since 8 bits can represent:

```text
0 → 255
```

we can think of a byte as:

```go
byte == uint8
```

For example:

```go
var a byte = 65
var b byte = 66
var c byte = 67

fmt.Println(a, b, c)
```

Output:

```text
65 66 67
```

---

# 2. Byte and Characters

ASCII characters can be represented using bytes.

```go
fmt.Println(byte('A'))
fmt.Println(byte('B'))
fmt.Println(byte('a'))
fmt.Println(byte('0'))
```

Output:

```text
65
66
97
48
```

You can convert a byte back into a character:

```go
var b byte = 65

fmt.Println(string(b))
```

Output:

```text
A
```

---

# 3. What is a Rune?

A **rune** is Go's name for an `int32` value.

```go
r := 'A'

fmt.Printf("%T\n", r)
```

Output:

```text
int32
```

So:

```go
rune == int32
```

A rune represents a **Unicode code point**.

This is important because not every character can fit into one byte.

For example:

```text
A
B
Z
বাংলা
😀
中
```

English characters generally require one byte in UTF-8.

But many Unicode characters require multiple bytes.

---

# 4. Why Do We Need Runes?

Consider:

```go
name := "Siam"

fmt.Println(len(name))
```

Output:

```text
4
```

Everything looks normal.

But now:

```go
name := "বাংলা"

fmt.Println(len(name))
```

The result is **not 5**.

Why?

Because `len(string)` returns the number of **bytes**, not the number of characters.

UTF-8 represents many Unicode characters using multiple bytes.

---

# 5. String is a Sequence of Bytes

Consider:

```go
text := "Hello"

fmt.Println(len(text))
```

Output:

```text
5
```

We can access individual bytes:

```go
text := "Hello"

fmt.Println(text[0])
fmt.Println(text[1])
fmt.Println(text[2])
```

Output:

```text
72
101
108
```

These are ASCII/UTF-8 byte values.

Convert them to characters:

```go
fmt.Println(string(text[0]))
fmt.Println(string(text[1]))
fmt.Println(string(text[2]))
```

Output:

```text
H
e
l
```

---

# 6. The Important Difference

Remember:

```text
string → sequence of bytes
byte   → uint8
rune   → int32 / Unicode code point
```

For example:

```go
text := "Hello"
```

Internally:

```text
H → 72
e → 101
l → 108
l → 108
o → 111
```

But for:

```go
text := "বাংলা"
```

the characters require multiple UTF-8 bytes.

Therefore:

```go
len(text)
```

counts bytes.

---

# 7. Iterating Over a String

This is one of the most important differences.

## Using an index

```go
text := "Hello"

for i := 0; i < len(text); i++ {
    fmt.Println(text[i])
}
```

This iterates over **bytes**.

---

# 8. Using Range

Now:

```go
text := "বাংলা"

for _, r := range text {
    fmt.Printf("%c\n", r)
}
```

`range` over a string decodes UTF-8 and gives you **runes**.

This is generally what you want when processing Unicode text character-by-character.

---

# 9. Rune Example

```go
text := "Hello 😀"

for _, r := range text {
    fmt.Printf("%c\n", r)
}
```

Output:

```text
H
e
l
l
o
 
😀
```

Each `r` is a rune.

---

# 10. Get Rune Count

If you want the number of Unicode characters rather than bytes:

```go
import "unicode/utf8"

text := "বাংলা"

fmt.Println(utf8.RuneCountInString(text))
```

You can also convert to a rune slice:

```go
runes := []rune(text)

fmt.Println(len(runes))
```

---

# 11. String to []byte

You can convert a string to bytes:

```go
text := "Hello"

bytes := []byte(text)

fmt.Println(bytes)
```

Output:

```text
[72 101 108 108 111]
```

You can modify the byte slice:

```go
bytes := []byte("Hello")

bytes[0] = 'J'

fmt.Println(string(bytes))
```

Output:

```text
Jello
```

---

# 12. []byte to String

```go
bytes := []byte{'H', 'e', 'l', 'l', 'o'}

text := string(bytes)

fmt.Println(text)
```

Output:

```text
Hello
```

---

# 13. String to []rune

```go
text := "বাংলা"

runes := []rune(text)

fmt.Println(runes)
```

Now each element represents one Unicode code point.

You can modify it:

```go
runes := []rune("Hello")

runes[0] = 'J'

fmt.Println(string(runes))
```

Output:

```text
Jello
```

---

# 14. Why []rune is Useful

Suppose you want to reverse Unicode text.

Doing this:

```go
text := "😀abc"

bytes := []byte(text)
```

and reversing bytes can break multi-byte Unicode characters.

Instead:

```go
runes := []rune(text)

for i, j := 0, len(runes)-1; i < j; i, j = i+1, j-1 {
    runes[i], runes[j] = runes[j], runes[i]
}

fmt.Println(string(runes))
```

---

# 15. Byte vs Rune

| Feature | Byte | Rune |
|---|---|---|
| Go type | `byte` | `rune` |
| Underlying type | `uint8` | `int32` |
| Size | 8 bits | 32 bits |
| Represents | Raw byte | Unicode code point |
| Useful for | ASCII, binary data | Unicode text |
| String indexing | Yes | No directly |
| `range` over string | No | Yes |

---

# 16. When Should You Use byte?

Use bytes when dealing with:

- ASCII
- Binary data
- Network data
- File data
- HTTP bodies
- Efficient string manipulation
- Encoded data

Example:

```go
data := []byte("Hello World")

fmt.Println(data)
```

---

# 17. When Should You Use rune?

Use runes when dealing with:

- Unicode characters
- Multiple languages
- Emoji
- Character-level text processing

Example:

```go
text := "Hello বাংলা 😀"

for _, r := range text {
    fmt.Printf("%c ", r)
}
```

---

# 18. Character Counting

Incorrect for Unicode:

```go
len("বাংলা")
```

This counts bytes.

Better:

```go
len([]rune("বাংলা"))
```

or:

```go
utf8.RuneCountInString("বাংলা")
```

---

# 19. Practical Example: Count Vowels

For English:

```go
func countVowels(text string) int {
    count := 0

    for _, r := range text {
        switch r {
        case 'a', 'e', 'i', 'o', 'u':
            count++
        }
    }

    return count
}
```

Usage:

```go
fmt.Println(countVowels("hello world"))
```

Output:

```text
3
```

---

# 20. Practical Example: Reverse String

```go
func reverse(text string) string {
    runes := []rune(text)

    for i, j := 0, len(runes)-1; i < j; i, j = i+1, j-1 {
        runes[i], runes[j] = runes[j], runes[i]
    }

    return string(runes)
}
```

Usage:

```go
fmt.Println(reverse("Hello"))
fmt.Println(reverse("বাংলা"))
```

Using `[]rune` makes the function Unicode-aware.

---

# 21. Important Rule

Remember this:

> **String indexing gives bytes. `range` over a string gives runes.**

Example:

```go
text := "Hello 😀"

fmt.Println(text[0])
```

Byte.

But:

```go
for _, r := range text {
    fmt.Println(r)
}
```

Rune.

---

# 22. Summary

The three concepts you should remember:

```text
string
   ↓
sequence of UTF-8 encoded bytes

byte
   ↓
uint8
   ↓
one raw byte

rune
   ↓
int32
   ↓
one Unicode code point
```

For normal ASCII:

```text
1 character ≈ 1 byte
```

For Unicode:

```text
1 character may require multiple bytes
```

Therefore, choose:

```text
byte → raw/encoded data
rune → Unicode character processing
string → text
```