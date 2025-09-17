// src/components/create-post/editors/ImageEditor.tsx - Optimized for new UploadThing config
"use client";

import { useEffect, useRef, useState } from "react";
import {
  XMarkIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
} from "@heroicons/react/24/outline";
import { useUploadThing } from "@/lib/uploadthing";

interface ImageEditorProps {
  imageUrl: string;
  onSave: (editedImageUrl: string) => void;
  onCancel: () => void;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

type DragMode =
  | "none"
  | "move"
  | "nw" | "n" | "ne"
  | "e"
  | "se" | "s" | "sw"
  | "w";

export default function ImageEditor({ imageUrl, onSave, onCancel }: ImageEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [cropArea, setCropArea] = useState<CropArea>({ x: 0, y: 0, width: 100, height: 100 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [originalImageSize, setOriginalImageSize] = useState({ width: 0, height: 0 });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // UploadThing hook with progress tracking
  const { startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      if (res?.[0]) {
        console.log("Upload completed:", res[0].url);
        onSave(res[0].url);
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    onUploadError: (error) => {
      console.error("Upload error:", error);
      alert("Failed to upload edited image. Please try again.");
      setIsUploading(false);
      setUploadProgress(0);
    },
    onUploadProgress: (progress) => {
      setUploadProgress(progress);
    }
  });

  // drag state
  const [dragMode, setDragMode] = useState<DragMode>("none");
  const dragStart = useRef({ x: 0, y: 0 });
  const startCrop = useRef<CropArea>(cropArea);

  // last draw cache (canvas space numbers)
  const lastDraw = useRef({ drawW: 0, drawH: 0, offX: 0, offY: 0, dpr: 1 });

  // ---------- sizing ----------
  const resizeCanvasToWrap = () => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const rect = wrap.getBoundingClientRect();

    const maxH = Math.min(rect.height, window.innerHeight * 0.55);
    const displayW = Math.min(rect.width, 960);
    const displayH = Math.max(280, Math.min(maxH, displayW * 0.62)); // ~16:10 look

    canvas.style.width = `${displayW}px`;
    canvas.style.height = `${displayH}px`;
    canvas.width = Math.floor(displayW * dpr);
    canvas.height = Math.floor(displayH * dpr);
  };

  useEffect(() => {
    resizeCanvasToWrap();
    const onResize = () => {
      resizeCanvasToWrap();
      if (imageLoaded) drawImage();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [imageLoaded]);

  // ---------- load ----------
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imageRef.current = img;
      setImageLoaded(true);
      setOriginalImageSize({ width: img.width, height: img.height });
      setCropArea({ x: 0, y: 0, width: img.width, height: img.height });
      resizeCanvasToWrap();
      drawImage();
    };
    img.onerror = () => {
      console.error("Failed to load image");
      alert("Failed to load image. Please try again.");
    };
    img.src = imageUrl;
  }, [imageUrl]);

  // ---------- draw ----------
  const drawImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const img = imageRef.current;
    if (!canvas || !ctx || !img) return;

    const dpr = Math.max(1, window.devicePixelRatio || 1);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // contain fit, then apply user scale
    const baseScale = Math.min(canvas.width / img.width, canvas.height / img.height);
    const displayScale = baseScale * scale;

    const drawW = img.width * displayScale;
    const drawH = img.height * displayScale;
    const offX = (canvas.width - drawW) / 2;
    const offY = (canvas.height - drawH) / 2;

    lastDraw.current = { drawW, drawH, offX, offY, dpr };

    // draw image (rotate about center of canvas)
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    ctx.drawImage(img, offX, offY, drawW, drawH);
    ctx.restore();

    // overlay (not rotated)
    drawCropOverlay(ctx, canvas, drawW, drawH, offX, offY, dpr);
  };

  // map crop area (image space) to canvas rect
  const getCanvasCropRect = (drawW?: number, drawH?: number, offX?: number, offY?: number) => {
    const { drawW: dW, drawH: dH, offX: oX, offY: oY } = lastDraw.current;
    const DW = drawW ?? dW;
    const DH = drawH ?? dH;
    const OX = offX ?? oX;
    const OY = offY ?? oY;

    const scaleX = DW / originalImageSize.width;
    const scaleY = DH / originalImageSize.height;

    const x = OX + cropArea.x * scaleX;
    const y = OY + cropArea.y * scaleY;
    const w = cropArea.width * scaleX;
    const h = cropArea.height * scaleY;

    return { rect: { x, y, w, h }, scaleX, scaleY };
  };

  const drawCropOverlay = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    drawW: number,
    drawH: number,
    offX: number,
    offY: number,
    dpr: number
  ) => {
    const { rect } = getCanvasCropRect(drawW, drawH, offX, offY);
    const { x, y, w, h } = rect;

    // dim outside
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // cut the crop window
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillRect(x, y, w, h);

    // draw stroke + handles on top
    ctx.globalCompositeOperation = "source-over";
    const lineW = 2 * dpr;
    const handle = 10 * dpr;

    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = lineW;
    ctx.strokeRect(x, y, w, h);

    // handle centers (exactly on stroke)
    const pts = [
      { mode: "nw", cx: x,     cy: y },
      { mode: "n",  cx: x+w/2, cy: y },
      { mode: "ne", cx: x+w,   cy: y },
      { mode: "e",  cx: x+w,   cy: y+h/2 },
      { mode: "se", cx: x+w,   cy: y+h },
      { mode: "s",  cx: x+w/2, cy: y+h },
      { mode: "sw", cx: x,     cy: y+h },
      { mode: "w",  cx: x,     cy: y+h/2 },
    ] as const;

    ctx.fillStyle = "#3b82f6";
    pts.forEach(({ cx, cy }) => {
      ctx.fillRect(cx - handle / 2, cy - handle / 2, handle, handle);
    });

    ctx.restore();
  };

  useEffect(() => {
    if (imageLoaded) drawImage();
  }, [rotation, scale, cropArea, imageLoaded]);

  // ---------- interaction ----------
  const setCursor = (mode: DragMode) => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const map: Record<DragMode, string> = {
      none: "default",
      move: "move",
      n: "ns-resize",
      s: "ns-resize",
      e: "ew-resize",
      w: "ew-resize",
      ne: "nesw-resize",
      sw: "nesw-resize",
      nw: "nwse-resize",
      se: "nwse-resize",
    };
    cvs.style.cursor = map[mode] || "default";
  };

  // exact hit-test on stroke & handles
  const hitTest = (px: number, py: number): DragMode => {
    const { rect } = getCanvasCropRect();
    const { x, y, w, h } = rect;

    const dpr = lastDraw.current.dpr;
    const lineW = 2 * dpr;
    const handle = 10 * dpr;
    const halfHandle = handle / 2;

    // handle squares (priority)
    const handles: { mode: DragMode; rx: number; ry: number; rw: number; rh: number }[] = [
      { mode: "nw", rx: x - halfHandle,      ry: y - halfHandle,      rw: handle, rh: handle },
      { mode: "n",  rx: x + w/2 - halfHandle,ry: y - halfHandle,      rw: handle, rh: handle },
      { mode: "ne", rx: x + w - halfHandle,  ry: y - halfHandle,      rw: handle, rh: handle },
      { mode: "e",  rx: x + w - halfHandle,  ry: y + h/2 - halfHandle,rw: handle, rh: handle },
      { mode: "se", rx: x + w - halfHandle,  ry: y + h - halfHandle,  rw: handle, rh: handle },
      { mode: "s",  rx: x + w/2 - halfHandle,ry: y + h - halfHandle,  rw: handle, rh: handle },
      { mode: "sw", rx: x - halfHandle,      ry: y + h - halfHandle,  rw: handle, rh: handle },
      { mode: "w",  rx: x - halfHandle,      ry: y + h/2 - halfHandle,rw: handle, rh: handle },
    ];

    for (const hnd of handles) {
      if (px >= hnd.rx && px <= hnd.rx + hnd.rw && py >= hnd.ry && py <= hnd.ry + hnd.rh) {
        return hnd.mode;
      }
    }

    // edges (thin bands centered on stroke)
    const onTop = py >= y - lineW && py <= y + lineW && px >= x && px <= x + w;
    if (onTop) return "n";
    const onBottom = py >= y + h - lineW && py <= y + h + lineW && px >= x && px <= x + w;
    if (onBottom) return "s";
    const onLeft = px >= x - lineW && px <= x + lineW && py >= y && py <= y + h;
    if (onLeft) return "w";
    const onRight = px >= x + w - lineW && px <= x + w + lineW && py >= y && py <= y + h;
    if (onRight) return "e";

    // inside
    if (px > x && px < x + w && py > y && py < y + h) return "move";

    return "none";
  };

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const r = cvs.getBoundingClientRect();
    const px = e.clientX - r.left;
    const py = e.clientY - r.top;

    const mode = hitTest(px, py);
    setDragMode(mode);
    setCursor(mode);
    dragStart.current = { x: px, y: py };
    startCrop.current = { ...cropArea };
  };

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const r = cvs.getBoundingClientRect();
    const px = e.clientX - r.left;
    const py = e.clientY - r.top;

    if (dragMode === "none") {
      setCursor(hitTest(px, py));
      return;
    }

    const { scaleX, scaleY } = getCanvasCropRect();
    const dxImg = (px - dragStart.current.x) / scaleX;
    const dyImg = (py - dragStart.current.y) / scaleY;

    const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));
    const minSize = 20; // image-space

    let { x, y, width, height } = startCrop.current;

    if (dragMode === "move") {
      x = clamp(x + dxImg, 0, originalImageSize.width - width);
      y = clamp(y + dyImg, 0, originalImageSize.height - height);
    } else {
      const rightMax = originalImageSize.width;
      const bottomMax = originalImageSize.height;

      const resizeLeft = (d: number) => {
        const nx = clamp(x + d, 0, x + width - minSize);
        width = width + (x - nx);
        x = nx;
      };
      const resizeRight = (d: number) => {
        width = clamp(width + d, minSize, rightMax - x);
      };
      const resizeTop = (d: number) => {
        const ny = clamp(y + d, 0, y + height - minSize);
        height = height + (y - ny);
        y = ny;
      };
      const resizeBottom = (d: number) => {
        height = clamp(height + d, minSize, bottomMax - y);
      };

      if (dragMode.includes("w")) resizeLeft(dxImg);
      if (dragMode.includes("e")) resizeRight(dxImg);
      if (dragMode.includes("n")) resizeTop(dyImg);
      if (dragMode.includes("s")) resizeBottom(dyImg);
    }

    setCropArea({ x, y, width, height });
  };

  const onMouseUp = () => {
    setDragMode("none");
    setCursor("none");
  };

  // ---------- optimize image before upload ----------
  const optimizeImage = async (blob: Blob): Promise<Blob> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(blob);
          return;
        }

        // Set max dimensions (2048px for good quality without being too large)
        const maxDimension = 2048;
        let { width, height } = img;
        
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height / width) * maxDimension;
            width = maxDimension;
          } else {
            width = (width / height) * maxDimension;
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (optimizedBlob) => {
            resolve(optimizedBlob || blob);
          },
          'image/jpeg',
          0.85 // Slightly lower quality for better file size
        );
      };
      img.src = URL.createObjectURL(blob);
    });
  };

  // ---------- actions ----------
  const handleSave = async () => {
    const img = imageRef.current;
    if (!img || isUploading) return;

    setIsUploading(true);

    try {
      // Create canvas with edited image
      const out = document.createElement("canvas");
      const ctx = out.getContext("2d");
      if (!ctx) {
        setIsUploading(false);
        return;
      }

      out.width = Math.max(1, Math.round(cropArea.width * scale));
      out.height = Math.max(1, Math.round(cropArea.height * scale));

      ctx.save();
      if (rotation % 360 !== 0) {
        ctx.translate(out.width / 2, out.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.translate(-out.width / 2, -out.height / 2);
      }
      ctx.drawImage(
        img,
        cropArea.x, cropArea.y, cropArea.width, cropArea.height,
        0, 0, out.width, out.height
      );
      ctx.restore();

      // Convert canvas to blob
      out.toBlob(async (blob) => {
        if (!blob) {
          setIsUploading(false);
          return;
        }

        // Optimize image before upload
        const optimizedBlob = await optimizeImage(blob);

        // Create File object for UploadThing
        const fileName = `edited-${Date.now()}.jpg`;
        const file = new File([optimizedBlob], fileName, { type: 'image/jpeg' });

        // Upload to UploadThing (the hook handles the onComplete callback)
        await startUpload([file]);
      }, "image/jpeg", 0.9);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Failed to process image');
      setIsUploading(false);
    }
  };

  // ---------- UI ----------
  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] rounded-lg p-6 w-full max-w-3xl mx-4 max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 shrink-0">
          <h2 className="text-lg md:text-xl font-semibold text-white">Edit Image</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
              disabled={!imageLoaded || isUploading}
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Uploading... {uploadProgress > 0 && `${uploadProgress.toFixed(0)}%`}
                </>
              ) : (
                'Save Changes'
              )}
            </button>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-700 rounded-full transition-colors"
              title="Close"
              disabled={isUploading}
            >
              <XMarkIcon className="w-5 h-5 text-gray-300" />
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div
          ref={wrapRef}
          className="mb-4 flex justify-center items-center rounded-lg border border-gray-700 bg-[#0f0f0f] overflow-hidden grow"
        >
          <canvas
            ref={canvasRef}
            className="block"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          />
        </div>

        {/* Controls */}
        <div className="space-y-4 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-white font-medium">Rotate:</span>
            <button
              onClick={() => setRotation((r) => r - 90)}
              className="p-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 rounded-lg"
              title="Rotate 90° Left"
              disabled={isUploading}
            >
              <ArrowUturnLeftIcon className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={() => setRotation((r) => r + 90)}
              className="p-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 rounded-lg"
              title="Rotate 90° Right"
              disabled={isUploading}
            >
              <ArrowUturnRightIcon className="w-4 h-4 text-white" />
            </button>
            <span className="text-gray-400 text-sm">{rotation}°</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-white font-medium">Scale:</span>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
              disabled={isUploading}
            />
            <span className="text-gray-400 text-sm min-w-[44px] text-right">
              {(scale * 100).toFixed(0)}%
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() =>
                setCropArea({
                  x: 0,
                  y: 0,
                  width: originalImageSize.width,
                  height: originalImageSize.height,
                })
              }
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white rounded text-sm"
              disabled={isUploading}
            >
              Reset Crop
            </button>
            <button
              onClick={() => {
                const size = Math.min(originalImageSize.width, originalImageSize.height);
                const x = (originalImageSize.width - size) / 2;
                const y = (originalImageSize.height - size) / 2;
                setCropArea({ x, y, width: size, height: size });
              }}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white rounded text-sm"
              disabled={isUploading}
            >
              Square
            </button>
            <button
              onClick={() => {
                const aspect = 16 / 9;
                let w = originalImageSize.width;
                let h = w / aspect;
                if (h > originalImageSize.height) {
                  h = originalImageSize.height;
                  w = h * aspect;
                }
                const x = (originalImageSize.width - w) / 2;
                const y = (originalImageSize.height - h) / 2;
                setCropArea({ x, y, width: w, height: h });
              }}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white rounded text-sm"
              disabled={isUploading}
            >
              16:9
            </button>
            <button
              onClick={() => {
                setRotation(0);
                setScale(1);
              }}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white rounded text-sm"
              disabled={isUploading}
            >
              Reset Transform
            </button>
          </div>
          
          {isUploading && (
            <div className="space-y-2">
              <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <div className="text-center text-blue-400 text-sm">
                Processing and uploading your edited image...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}