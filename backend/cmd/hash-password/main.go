// Command hash-password prints a bcrypt hash for ADMIN_PASSWORD_HASH.
// Usage: read -rs PW && printf %s "$PW" | go run ./cmd/hash-password
package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"

	"golang.org/x/crypto/bcrypt"
)

func main() {
	line, err := bufio.NewReader(os.Stdin).ReadString('\n')
	password := strings.TrimRight(line, "\r\n")
	if err != nil && password == "" {
		fmt.Fprintln(os.Stderr, "pipe the password on stdin")
		os.Exit(1)
	}
	if len(password) < 12 {
		fmt.Fprintln(os.Stderr, "use at least 12 characters")
		os.Exit(1)
	}
	hash, err := bcrypt.GenerateFromPassword([]byte(password), 12)
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
	fmt.Println(string(hash))
}
