interface SectionLabelProps {
  children: string;
  index?: string;
  className?: string;
}

export default function SectionLabel({ children, index, className = "" }: SectionLabelProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="font-mono text-[11px] font-medium tracking-[0.25em] text-blue-light">
        _{children.toUpperCase()}
      </span>
      {index && (
        <span className="font-mono text-[10px] tracking-[0.15em] text-ink-dimmer">
          {index}
        </span>
      )}
      <span className="h-px w-8 bg-line-strong" />
    </div>
  );
}
