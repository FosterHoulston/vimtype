import { useRef, useEffect } from "react";
import { VimWasm } from "vim-wasm";

export function GameSession() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !inputRef.current) return;

    const vim = new VimWasm({
      canvas: canvasRef.current,
      input: inputRef.current,
      workerScriptPath: "/vim-wasm/vim.js",
    });
    vim.start();
  }, []);

  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <header className="flex flex-col items-center gap-9">
          <div className="w-[500px] max-w-[100vw] p-4"></div>
        </header>
        <div className="max-w-[300px] w-full space-y-6 px-4">
          <nav className="rounded-3xl border border-gray-200 p-6 dark:border-gray-700 space-y-4">
            <p className="leading-6 text-gray-700 dark:text-gray-200 text-center">Hello there</p>
            <canvas ref={canvasRef} />
            <input ref={inputRef} autoComplete="off" autoFocus />
          </nav>
        </div>
      </div>
    </main>
  );
}
