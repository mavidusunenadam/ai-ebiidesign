"use client";

import { useEffect, useRef, useState } from "react";
import MockupPreview from "@/components/mockup-preview";
import {
  DesignPlacement,
  MockupColor,
  MockupSide,
  TextLayer
} from "@/lib/types";

type Props = {
  designUrl: string | null;
  color: MockupColor;
  side: MockupSide;
  placement: DesignPlacement;
  textLayer: TextLayer;
  backgroundRemoving: boolean;
  usingBgRemoved: boolean;
  onPlacementChange: (placement: DesignPlacement) => void;
  onTextLayerChange: (textLayer: TextLayer) => void;
  onRemoveBackground: () => void;
  onUseOriginal: () => void;
};

type DragMode =
  | "design-drag"
  | "design-resize"
  | "text-drag"
  | "text-resize"
  | null;

const COLOR_OPTIONS: Array<{ value: "#ffffff" | "#111111"; label: string }> = [
  { value: "#ffffff", label: "Beyaz" },
  { value: "#111111", label: "Siyah" }
];

export default function MockupEditor({
  designUrl,
  color,
  side,
  placement,
  textLayer,
  backgroundRemoving,
  usingBgRemoved,
  onPlacementChange,
  onTextLayerChange,
  onRemoveBackground,
  onUseOriginal
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [dragMode, setDragMode] = useState<DragMode>(null);
  const [startMouse, setStartMouse] = useState({ x: 0, y: 0 });
  const [startPlacement, setStartPlacement] = useState(placement);
  const [startText, setStartText] = useState(textLayer);

  function beginDrag(e: React.MouseEvent, mode: DragMode) {
    e.preventDefault();
    e.stopPropagation();
    setDragMode(mode);
    setStartMouse({ x: e.clientX, y: e.clientY });
    setStartPlacement(placement);
    setStartText(textLayer);
  }

  useEffect(() => {
    function handleMove(e: MouseEvent) {
      if (!dragMode || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const dx = ((e.clientX - startMouse.x) / rect.width) * 100;
      const dy = ((e.clientY - startMouse.y) / rect.height) * 100;

      if (dragMode === "design-drag") {
        onPlacementChange({
          ...startPlacement,
          x: Math.max(5, Math.min(95, startPlacement.x + dx)),
          y: Math.max(5, Math.min(95, startPlacement.y + dy))
        });
      }

      if (dragMode === "design-resize") {
        onPlacementChange({
          ...startPlacement,
          width: Math.max(8, Math.min(90, startPlacement.width + dx))
        });
      }

      if (dragMode === "text-drag") {
        onTextLayerChange({
          ...startText,
          x: Math.max(5, Math.min(95, startText.x + dx)),
          y: Math.max(5, Math.min(95, startText.y + dy))
        });
      }

      if (dragMode === "text-resize") {
        onTextLayerChange({
          ...startText,
          fontSize: Math.max(
            12,
            Math.min(120, Math.round(startText.fontSize + dx * 1.2))
          )
        });
      }
    }

    function handleUp() {
      setDragMode(null);
    }

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [
    dragMode,
    onPlacementChange,
    onTextLayerChange,
    startMouse,
    startPlacement,
    startText
  ]);

  return (
    <div className="card card-pad">
      <div className="mockup-editor-layout">
        <div>
          <p className="text-sm text-gray mb-3">Mockup editörü</p>

          <MockupPreview
            containerRef={containerRef}
            designUrl={designUrl}
            color={color}
            side={side}
            placement={placement}
            textLayer={textLayer}
            editable
            onDesignMouseDown={(e) => beginDrag(e, "design-drag")}
            onDesignResizeMouseDown={(e) => beginDrag(e, "design-resize")}
            onTextMouseDown={(e) => beginDrag(e, "text-drag")}
            onTextResizeMouseDown={(e) => beginDrag(e, "text-resize")}
          />
        </div>

        <div className="card card-pad">
          <p className="text-sm text-gray mb-3">İsterseniz yazı ekleyebilirsiniz</p>

          <label className="field-label">Yazı</label>
          <input
            type="text"
            className="field-input"
            value={textLayer.text}
            onChange={(e) =>
              onTextLayerChange({ ...textLayer, text: e.target.value })
            }
            placeholder="Örn: EBII DESIGN"
          />

          <div className="mt-4">
            <label className="field-label">Yazı rengi</label>
            <div className="swatch-row">
              {COLOR_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`swatch-btn ${textLayer.color === option.value ? "active" : ""}`}
                  onClick={() =>
                    onTextLayerChange({
                      ...textLayer,
                      color: option.value
                    })
                  }
                  title={option.label}
                >
                  <span
                    className="swatch-circle"
                    style={{ background: option.value }}
                  />
                </button>
              ))}
            </div>

            <p className="helper mt-2">
              Siyah yazının daha net görünmesi için açık kontur, beyaz yazı için koyu gölge uygulanır.
            </p>
          </div>

          <div className="mt-4">
            <label className="field-label">Arka plan</label>
            <div className="btn-row">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onRemoveBackground}
                disabled={backgroundRemoving || !designUrl}
              >
                {backgroundRemoving ? "Kaldırılıyor..." : "Arka planı kaldır"}
              </button>

              {usingBgRemoved && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onUseOriginal}
                >
                  Orijinali kullan
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 btn-row">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() =>
                onPlacementChange({
                  x: 50,
                  y: side === "front" ? 34 : 33,
                  width: 34
                })
              }
            >
              Görseli sıfırla
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() =>
                onTextLayerChange({
                  text: "",
                  x: 50,
                  y: 70,
                  fontSize: 28,
                  color: "#ffffff"
                })
              }
            >
              Yazıyı temizle
            </button>
          </div>

          <p className="helper mt-4">
            Görseli sürükleyerek istediğiniz yere taşıyabilir, sağ alt köşeden boyutunu ayarlayabilirsiniz. Yazıyı da aynı şekilde konumlandırıp büyütüp küçültebilirsiniz.
          </p>
        </div>
      </div>
    </div>
  );
}