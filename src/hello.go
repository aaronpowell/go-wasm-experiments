package main

import (
	"strconv"
	"syscall/js"
)

var global = js.Global()

func add(i ...js.Value) int {
	ret := 0

	for _, item := range i {
		val, _ := strconv.Atoi(item.String())
		ret += val
	}

	return ret
}

func registerCallbacks() {
	wrapper := func(fn func(args ...js.Value) int) func(args []js.Value) {
		return func(args []js.Value) {
			cb := args[len(args)-1:][0]

			invoker := func(i int) {
				cb.Call("cb", js.Null(), i)
			}

			invoker(fn(args[:len(args)-1]...))
		}
	}

	global.Set("add", js.NewCallback(wrapper(add)))
}

func main() {
	c := make(chan struct{}, 0)
	println("Web Assembly is ready")
	registerCallbacks()

	<-c
}
