"use client";

import { StyleResult } from "@/lib/types";
import ResultCard from "@/components/result-card";

type Props = {
  designs: StyleResult[];
  selectedDesign: StyleResult | null;
  onSelectDesign: (design: StyleResult) => void;
};

export default function StepSelectDesign({
  designs,
  selectedDesign,
  onSelectDesign
}: Props) {
  return (
    <div className="card card-pad">
      <div className="mb-6">
        <span className="badge">2. Adım</span>
        <h2 className="section-title">Bir tasarım seç</h2>
        <p className="section-text">
          Beğendiğin AI tasarımını seç, sonraki adımda mockup üzerinde göreceksin.
        </p>
      </div>

      <div className="grid-results">
        {designs.map((item) => (
          <ResultCard
            key={item.key}
            item={item}
            isSelected={selectedDesign?.key === item.key}
            onSelect={() => onSelectDesign(item)}
          />
        ))}
      </div>
    </div>
  );
}