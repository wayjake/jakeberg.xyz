---
date: 2025-10-26
author: Jake Berg
title: "Building an N64 Emulator in the Browser, Part 2: Three Files and a Title Screen"
description: "A pre-compiled core should have made the rest easy. First we had to find a missing third file, get the startup order exactly right, and learn the ROM's secret name."
image: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZGxmMHJ0dnJ0dXdyMWV6bG4xM3p0Mmw3YjRib3hsNXFpYjU5ejh6NSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/8WxV7tmTyn6jb8Dwer/giphy.gif"
---

*Part 2 of 3. Previous: [Part 1: When the Compiler Said No](/blog/building-n64-emulator-webassembly) · Next: [Part 3: Audio, Input, and What We Didn't Solve](/blog/building-n64-emulator-webassembly-part-3)*

In [Part 1](/blog/building-n64-emulator-webassembly), the compiler refused to build our emulator, so we switched to N64Wasm's pre-compiled ParaLLEl N64 core. That should have made the rest easy: copy the files, load them, play. This part covers what actually stood between us and the first frame.

## The missing third file

We copied `n64wasm.js` and `n64wasm.wasm` into `/public`, set up a `Module` object, and loaded the script. `onRuntimeInitialized` fired, and then:

```
Aborted(Assertion failed: undefined)
```

No stack trace. Digging through the console turned up the real error:

```
fopen(n64wasm.data, rb): No such file or directory
```

Emscripten modules often ship a **third file**. The `.data` file holds files that get preloaded into the module's virtual filesystem at startup, and ours held configuration the emulator reads as it boots. We had copied two files out of three.

With all three in place, the module initialized.

## Set up `Module` before the script loads

N64Wasm's core was compiled *without* `-s MODULARIZE=1`, so there's no `createModule()` to import. Instead, the loader script looks for a global `window.Module` when it runs and configures itself from that.

That makes timing critical. Set `window.Module` *before* adding the script tag. If the script loads first, Emscripten creates its own `Module` and ignores yours. The canvas has to be on that object from the start, too. You can't attach it later.

Here's our loader, trimmed to the parts that matter:

```typescript
export function loadEmulatorCore(canvas: HTMLCanvasElement): Promise<EmscriptenModule> {
  return new Promise((resolve, reject) => {
    // Must exist before n64wasm.js runs, or Emscripten ignores it
    (window as any).Module = {
      canvas,
      onRuntimeInitialized() {
        resolve((window as any).Module);
      },
      print: (text: string) => console.log('[WASM]', text),
      printErr: (text: string) => console.error('[WASM]', text),
    };

    const script = document.createElement('script');
    script.src = '/n64wasm.js';
    script.onerror = () => reject(new Error('Failed to load n64wasm.js'));
    document.head.appendChild(script);
  });
}
```

We didn't work this out from documentation. We read N64Wasm's `script.js` line by line. Their working code was our Rosetta Stone.

## Files the emulator can see

The emulator is C code that expects a normal computer with files it can open. Emscripten gives it an in-memory virtual filesystem, and JavaScript fills it with ordinary calls:

```typescript
const rom = new Uint8Array(await (await fetch('/offroad.n64')).arrayBuffer());
Module.FS.writeFile('custom.v64', rom);
```

Notice the filename. We fetch `offroad.n64` but write it as `custom.v64`. That's the name N64Wasm uses, the core seems to expect it, and the extension affects how the ROM format is detected. Under its real name, the emulator didn't recognize the ROM. We found that by trial and error.

`assets.zip` goes in the same way. It holds the shaders, font textures, and configuration the graphics plugin loads at runtime.

## Order is everything

Starting the emulator is one line: `Module.callMain(['custom.v64'])`. That call boots the core, reads the ROM, sets up graphics, and starts the main loop, so everything it needs has to be in place first:

1. Load the input controller script and check browser support
2. Load the core and wait for `onRuntimeInitialized`
3. Write `assets.zip` to the virtual filesystem
4. Write the ROM as `custom.v64`
5. Call `callMain()`
6. Start audio, which needs a user click before the browser allows sound
7. Focus the canvas for keyboard input

Get the order wrong, and the failures are quiet or cryptic:

| Mistake | What you see |
|---|---|
| `callMain()` before `assets.zip` | A missing shader error, or a black screen |
| `callMain()` before the ROM | `ROM file not found`, then an abort |
| Audio before `callMain()` | Silence or crackling |

## Rendering just worked

After all that, graphics were the easy part. The pipeline runs from the N64's own chips down to WebGL:

```
N64 game code
  → RSP: 3D transforms
  → RDP: rasterization
  → GLideN64: RDP commands to OpenGL
  → Emscripten: OpenGL ES to WebGL2
  → your screen
```

We wrote none of it. Passing the canvas to `Module` was enough for Emscripten to create the WebGL2 context. The core was proven in N64Wasm, GLideN64 is mature, and Emscripten's mapping from OpenGL ES to WebGL2 is well tested.

Then *Off Road Challenge*'s title screen appeared. After days of cryptic errors, it was the best moment of the project.

## What we learned

- **Emscripten modules have hidden dependencies.** Always look for the `.data` file.
- **Initialization order is part of the API.** Write it down, along with why each step depends on the one before it.
- **Study working examples.** Reading someone's working code beat guessing from documentation.
- **Sometimes the best code is no code.** We wrote nothing for rendering, and it's the part that worked best.

The emulator ran and drew frames. Next, it needed to sound right and respond to the keyboard. One of those went better than the other.

**Next: [Part 3: Audio, Input, and What We Didn't Solve →](/blog/building-n64-emulator-webassembly-part-3)**

---

*Note from the author: This series was entirely created by AI. It loosely represents what I actually wanted to share with you, the reader.*
