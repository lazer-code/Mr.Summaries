"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { PageTemplate, Stroke, Point } from "@/types/notebook";

interface NotebookCanvasProps {
  content?: string;
  onContentChange?: (content: string) => void;
  tool: "pen" | "eraser" | "highlighter";
  color: string;
  strokeWidth: number;
  template?: PageTemplate;
  zoom?: number;
}

export function NotebookCanvas({
  content,
  onContentChange,
  tool,
  color,
  strokeWidth,
  template = "ruled",
  zoom = 100,
}: NotebookCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<Point>({ x: 0, y: 0 });
  const [panningPointerId, setPanningPointerId] = useState<number | null>(null);

  // Load content when it changes (e.g., when switching pages)
  useEffect(() => {
    if (content) {
      try {
        const loadedStrokes = JSON.parse(content) as Stroke[];
        setStrokes(loadedStrokes);
      } catch {
        // If content is not valid JSON, ignore it (might be old format)
        setStrokes([]);
      }
    } else {
      setStrokes([]);
    }
  }, [content]);

  const drawRuled = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
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
  }, []);

  const drawGrid = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
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
  }, []);

  const drawStroke = useCallback((ctx: CanvasRenderingContext2D, stroke: Stroke) => {
    if (stroke.points.length === 0) return;

    // Save context state
    ctx.save();

    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = stroke.alpha;
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
    
    for (let i = 1; i < stroke.points.length; i++) {
      ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
    }
    
    ctx.stroke();

    // Restore context state
    ctx.restore();
  }, []);

  const redrawCanvas = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Fill white background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Draw template background
    if (template === "ruled") {
      drawRuled(ctx, width, height);
    } else if (template === "grid") {
      drawGrid(ctx, width, height);
    }
    // Blank template has no background lines

    // Redraw all strokes
    strokes.forEach((stroke) => {
      drawStroke(ctx, stroke);
    });
  }, [template, strokes, drawRuled, drawGrid, drawStroke]);

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

    // Redraw all strokes
    redrawCanvas(ctx, canvas.width, canvas.height);
  }, [template, strokes, redrawCanvas]);

  const isPointNearStroke = (point: Point, stroke: Stroke, threshold: number = 10): boolean => {
    // Check if any point in the stroke is within the threshold distance
    for (const strokePoint of stroke.points) {
      const distance = Math.sqrt(
        (point.x - strokePoint.x) ** 2 + (point.y - strokePoint.y) ** 2
      );
      if (distance <= threshold) {
        return true;
      }
    }
    return false;
  };

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!context || !canvasRef.current) return;

    // Only allow pen or mouse for drawing, fingers are for panning
    const isStylus = e.pointerType === 'pen';
    const isMouse = e.pointerType === 'mouse';
    const isFinger = e.pointerType === 'touch';

    if (isFinger) {
      // Finger touch starts panning
      e.currentTarget.setPointerCapture(e.pointerId);
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
      setPanningPointerId(e.pointerId);
      return;
    }

    if (!isStylus && !isMouse) return;

    // Capture pointer for stylus/mouse to prevent scrolling
    e.currentTarget.setPointerCapture(e.pointerId);

    const rect = canvasRef.current.getBoundingClientRect();
    const scale = zoom / 100;
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    const point: Point = { x, y };

    if (tool === "eraser") {
      // Find and remove strokes that are near this point
      const threshold = strokeWidth * 2;
      const remainingStrokes = strokes.filter(
        (stroke) => !isPointNearStroke(point, stroke, threshold)
      );
      
      if (remainingStrokes.length !== strokes.length) {
        setStrokes(remainingStrokes);
      }
    } else {
      // Start a new stroke
      setIsDrawing(true);
      const alpha = tool === "highlighter" ? 0.3 : 1.0;
      const newStroke: Stroke = {
        points: [point],
        tool,
        color,
        width: strokeWidth,
        alpha,
      };
      setCurrentStroke(newStroke);
    }
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!context || !canvasRef.current) return;

    const isStylus = e.pointerType === 'pen';
    const isMouse = e.pointerType === 'mouse';
    const isFinger = e.pointerType === 'touch';

    // Handle panning with finger - only if this is the finger that started panning
    if (isFinger && isPanning && panningPointerId === e.pointerId && containerRef.current) {
      const deltaX = e.clientX - panStart.x;
      const deltaY = e.clientY - panStart.y;
      containerRef.current.scrollLeft -= deltaX;
      containerRef.current.scrollTop -= deltaY;
      setPanStart({ x: e.clientX, y: e.clientY });
      return;
    }

    // Only stylus and mouse should draw
    if (!isStylus && !isMouse) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const scale = zoom / 100;
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    const point: Point = { x, y };

    if (tool === "eraser") {
      // Eraser removes strokes on stylus/mouse pointer move
      const threshold = strokeWidth * 2;
      const remainingStrokes = strokes.filter(
        (stroke) => !isPointNearStroke(point, stroke, threshold)
      );
      
      if (remainingStrokes.length !== strokes.length) {
        setStrokes(remainingStrokes);
      }
    } else {
      // Continue drawing the current stroke
      if (!isDrawing || !currentStroke) return;

      const updatedStroke = {
        ...currentStroke,
        points: [...currentStroke.points, point],
      };
      setCurrentStroke(updatedStroke);

      // Draw the stroke segment immediately for visual feedback
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        redrawCanvas(context, canvas.width, canvas.height);
        drawStroke(context, updatedStroke);
      }
    }
  };

  const stopDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    // Release pointer capture
    e.currentTarget.releasePointerCapture(e.pointerId);

    // Only reset panning state if this was the finger that started it
    if (isPanning && panningPointerId === e.pointerId) {
      setIsPanning(false);
      setPanningPointerId(null);
    }

    if (!isDrawing && tool !== "eraser") return;

    if (tool !== "eraser") {
      setIsDrawing(false);

      // Add the completed stroke to strokes array
      if (currentStroke && currentStroke.points.length > 0) {
        const updatedStrokes = [...strokes, currentStroke];
        setStrokes(updatedStrokes);
        setCurrentStroke(null);

        // Save strokes as JSON
        if (onContentChange) {
          const contentJson = JSON.stringify(updatedStrokes);
          onContentChange(contentJson);
        }
      }
    } else {
      // For eraser, save the updated strokes
      if (onContentChange) {
        const contentJson = JSON.stringify(strokes);
        onContentChange(contentJson);
      }
    }
  };

  return (
    <div 
      ref={containerRef}
      className="flex h-full items-center justify-center overflow-auto bg-gray-100 p-4 dark:bg-gray-800"
    >
      <canvas
        ref={canvasRef}
        onPointerDown={startDrawing}
        onPointerMove={draw}
        onPointerUp={stopDrawing}
        onPointerLeave={stopDrawing}
        style={{
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'top left',
          touchAction: 'none',
        }}
        className="cursor-crosshair rounded-lg border border-gray-300 bg-white shadow-lg dark:border-gray-600"
      />
    </div>
  );
}
