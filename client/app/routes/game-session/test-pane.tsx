import { useRef, useEffect } from "react";
import { VimWasm } from "vim-wasm";

export function TestPane() {
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
    <div className="min-h-0 min-w-0 flex flex-col">
      <canvas className="flex-1" ref={canvasRef} />
      <input ref={inputRef} className="sr-only" autoComplete="off" autoFocus />
    </div>
  );
}
