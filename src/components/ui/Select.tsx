"use client";

import { useEffect, useRef, useState, useId } from "react";
import { ChevronDown, Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  id?: string;
  name?: string;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
  variant?: "dark" | "light";
}

export const Select = ({
  id,
  name,
  options,
  value: externalValue,
  defaultValue = "",
  onChange,
  placeholder = "Select an option",
  required = false,
  disabled = false,
  className,
  ariaLabel,
  variant = "dark",
}: SelectProps) => {
  const generatedId = useId();
  const selectId = id || generatedId;
  const listboxId = `${selectId}-listbox`;

  const [internalValue, setInternalValue] = useState(
    externalValue !== undefined ? externalValue : defaultValue
  );
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedValue = externalValue !== undefined ? externalValue : internalValue;
  const selectedOption = options.find((opt) => opt.value === selectedValue);

  const isLight = variant === "light";

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation inside listbox
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else if (focusedIndex >= 0 && focusedIndex < options.length) {
          selectOption(options[focusedIndex].value);
        }
        break;

      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setFocusedIndex(0);
        } else {
          setFocusedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
        }
        break;

      case "ArrowUp":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setFocusedIndex(options.length - 1);
        } else {
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
        }
        break;

      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        buttonRef.current?.focus();
        break;

      case "Tab":
        if (isOpen) {
          setIsOpen(false);
        }
        break;
    }
  };

  const selectOption = (val: string) => {
    if (externalValue === undefined) {
      setInternalValue(val);
    }
    onChange?.(val);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  // Scroll focused option into view
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && listRef.current) {
      const optionEl = listRef.current.children[focusedIndex] as HTMLElement;
      optionEl?.scrollIntoView({ block: "nearest" });
    }
  }, [focusedIndex, isOpen]);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Hidden input to support native form validation & submission */}
      {name && (
        <input
          type="hidden"
          name={name}
          value={selectedValue}
          required={required && !selectedValue}
        />
      )}

      {/* Trigger Button */}
      <button
        ref={buttonRef}
        id={selectId}
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        className={cn(
          "flex h-[52px] w-full items-center justify-between rounded-base border px-4 text-left text-body transition-all duration-200 cursor-pointer",
          isLight
            ? "border-navy-900/15 bg-white text-navy-950 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
            : "border-white/[0.15] bg-white/[0.05] text-white focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/40",
          isOpen && (isLight ? "border-gold-500 ring-2 ring-gold-500/30" : "border-gold-500 ring-2 ring-gold-500/40"),
          className
        )}
      >
        <span
          className={cn(
            "truncate",
            !selectedOption && (isLight ? "text-navy-900/40 font-normal" : "text-white/40 font-normal"),
            selectedOption && (isLight ? "text-navy-950 font-normal" : "text-white font-normal")
          )}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 transition-transform duration-300",
            isLight ? "text-gold-600" : "text-gold-400",
            isOpen && (isLight ? "rotate-180 text-gold-700" : "rotate-180 text-gold-300")
          )}
        />
      </button>

      {/* Dropdown Options Listbox Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            ref={listRef}
            id={listboxId}
            role="listbox"
            aria-activedescendant={focusedIndex >= 0 ? `${selectId}-opt-${focusedIndex}` : undefined}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className={cn(
              "absolute left-0 top-full z-50 max-h-64 w-full overflow-y-auto rounded-base border p-1.5 shadow-2xl backdrop-blur-xl",
              isLight
                ? "border-navy-900/15 bg-white shadow-xl"
                : "border-white/20 bg-navy-950/95 shadow-2xl",
              "[-ms-overflow-style:none] [scrollbar-width:thin] [scrollbar-color:rgba(212,175,55,0.3)_transparent]"
            )}
          >
            {options.map((option, idx) => {
              const isSelected = option.value === selectedValue;
              const isFocused = idx === focusedIndex;

              return (
                <li
                  key={option.value}
                  id={`${selectId}-opt-${idx}`}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => selectOption(option.value)}
                  onMouseEnter={() => setFocusedIndex(idx)}
                  className={cn(
                    "flex items-center justify-between rounded-sm px-3.5 py-2.5 text-body-sm transition-colors duration-150 cursor-pointer select-none",
                    isLight
                      ? cn(
                          "text-navy-900 hover:bg-navy-900/5 hover:text-navy-950",
                          isFocused && "bg-navy-900/5 text-navy-950",
                          isSelected && "bg-gold-500/15 text-gold-800 font-semibold"
                        )
                      : cn(
                          "text-white/90 hover:bg-white/10 hover:text-white",
                          isFocused && "bg-white/10 text-gold-300",
                          isSelected && "bg-gold-500/20 text-gold-400 font-semibold"
                        )
                  )}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected && (
                    <Check
                      className={cn(
                        "h-4 w-4 shrink-0",
                        isLight ? "text-gold-700" : "text-gold-400"
                      )}
                    />
                  )}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};
