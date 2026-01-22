"use client";

import { useEffect, useRef, useState } from "react";
import { PageTemplate } from "@/types/notebook";

interface NotebookCanvasProps {
  content?: string;
  onContentChange?: (content: string) => void;
  tool: "pen" | "eraser" | "highlighter";
  color: string;
  strokeWidth: number;
  template?: PageTemplate;
}

export function NotebookCanvas({
  content,
  onContentChange,
  tool,
  color,
  strokeWidth,
  template = "ruled",
}: NotebookCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setContext(ctx);

    // Set canvas size to A4 proportions (210mm x 297mm = 1:1.414)
    const containerWidth = canvas.parentElement?.clientWidth || 800;
    const canvasWidth = Math.min(containerWidth - 32, 800);
    const canvasHeight = canvasWidth * 1.414; // A4 aspect ratio

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Fill white background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw template background
    if (template === "ruled") {
      drawRuled(ctx, canvas.width, canvas.height);
    } else if (template === "grid") {
      drawGrid(ctx, canvas.width, canvas.height);
    }
    // Blank template has no background lines

    // Load existing content if available
    if (content) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
      img.src = content;
    }
  }, [content, template]);

  const drawRuled = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;

    // Draw horizontal lines (lined paper effect)
    const lineSpacing = 30;
    for (let y = lineSpacing; y < height; y += lineSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;

    const gridSpacing = 30;

    // Draw vertical lines
    for (let x = gridSpacing; x < width; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = gridSpacing; y < height; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!context || !canvasRef.current) return;

    setIsDrawing(true);

    const rect = canvasRef.current.getBoundingClientRect();
    let x: number, y: number;

    if ("touches" in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    context.beginPath();
    context.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    let x: number, y: number;

    if ("touches" in e) {
      e.preventDefault();
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    // Set drawing properties based on tool
    if (tool === "eraser") {
      context.globalCompositeOperation = "destination-out";
      context.lineWidth = strokeWidth * 2; // Eraser is wider
    } else {
      context.globalCompositeOperation = "source-over";
      context.lineWidth = strokeWidth;
      
      if (tool === "highlighter") {
        context.globalAlpha = 0.3;
        context.strokeStyle = color;
      } else {
        context.globalAlpha = 1.0;
        context.strokeStyle = color;
      }
    }

    context.lineCap = "round";
    context.lineJoin = "round";

    context.lineTo(x, y);
    context.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;

    setIsDrawing(false);

    // Save canvas content
    if (canvasRef.current && onContentChange) {
      const dataUrl = canvasRef.current.toDataURL("image/png");
      onContentChange(dataUrl);
    }
  };

  return (
    <div className="flex items-center justify-center overflow-auto rounded-lg border-2 border-gray-200 bg-gray-100 p-4 dark:border-gray-700 dark:bg-gray-800">
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className="cursor-crosshair rounded-lg border border-gray-300 bg-white shadow-lg dark:border-gray-600"
      />
    </div>
  );
}
