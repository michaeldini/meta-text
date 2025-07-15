# Header

Think of `useEffect` in React like setting up a smart alarm clock in your room. You tell the alarm clock to ring when something specific happens—like when you enter the room, when you leave, or when you change the lighting. Similarly, `useEffect` lets you run code in response to changes in your component’s state or props, or when the component mounts or unmounts. It’s your way of telling React, “When this thing changes, do this action.”

A React Context is like a central bulletin board in an office. Instead of each person (component) having to pass notes (props) to share important information, you post the info on the bulletin board (Context Provider). Anyone in the office (component tree) can walk up and read or use that information, no matter where they are, without needing it handed down directly from others.

A Zustand store is like a shared digital whiteboard in a co-working space. Anyone (any component) can write on it, erase, or read from it at any time. You don’t need to pass markers (props) around or wait for someone else to update you—everyone has instant access to the latest information on the board.

To use it in your React app:

Create the whiteboard:
Define your store with Zustand, describing what data and actions it holds.

Access the whiteboard:
Any component can “walk up” and read or update the store directly using a simple hook.

Stay in sync:
Whenever the store changes, all components using it automatically see the latest updates—no need to manually pass data around.

This makes global state management simple, efficient, and easy to maintain.

A custom React hook is like a reusable recipe card in your kitchen, but with a twist: it comes with a set of labeled containers for your ingredients. When you use the recipe (custom hook), you can pick and choose exactly which ingredients you want by unpacking them from the containers (using destructuring). This way, each time you follow the recipe in a different part of your house (component), you only take what you need—making your cooking (component logic) cleaner and more efficient.
