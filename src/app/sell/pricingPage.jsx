"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

const ThemeDropdown = ({
  label,
  value,
  placeholder,
  options,
  onChange,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, []);

  return (
    <div ref={wrapperRef}>
      <label className="mb-3 block text-sm font-semibold text-slate-900">
        {label}
      </label>
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen((current) => !current)}
          className="flex w-full items-center justify-between rounded-2xl border border-emerald-200 bg-white px-4 py-4 text-left text-base font-medium text-slate-900 shadow-sm transition-all duration-200 hover:border-emerald-300 hover:bg-emerald-50 focus:border-emerald-500 focus:bg-emerald-50 focus:outline-none focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className={value ? "text-slate-900" : "text-slate-400"}>
            {value || placeholder}
          </span>
          <ChevronDownIcon className="h-5 w-5 shrink-0 text-emerald-700" />
        </button>

        {open && !disabled ? (
          <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-lg shadow-emerald-100">
            <button
              type="button"
              className="w-full bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-400 hover:bg-emerald-50 hover:text-emerald-900"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
            >
              {placeholder}
            </button>

            {options.map((option) => {
              const selected = option === value;

              return (
                <button
                  key={option}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left text-sm transition-colors duration-150 hover:bg-emerald-50 hover:text-emerald-900 ${
                    selected
                      ? "bg-emerald-100 font-semibold text-emerald-900"
                      : "bg-white text-slate-700"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
};

const PricingStep = ({
  listing = {},
  errors,
  onBack = () => {},
  onContinue = () => {},
  onChange = () => {},
}) => {
  const universityOptions = ["Unilag", "LASU", "Lasued", "Lasutech", "Caleb"];
  const pickupOptions = ["Library Gate", "Faculty Front", "Hostel Common Room"];

  const campusRunnersByUniversity = {
    Unilag: ["Ayo", "Bola", "Tobi"],
    LASU: ["Kunle", "Sade", "Tolu"],
    Lasued: ["Mimi", "Femi", "Kemi"],
    Lasutech: ["Emeka", "Dara", "Kola"],
    Caleb: ["John", "Zara", "Ife"],
  };

  const price = listing.price ?? "";
  const university = listing.university ?? "";
  const pickupOption = listing.pickupOption ?? "";
  const campusRunner = listing.campusRunner ?? "";

  const campusRunnerOptions = useMemo(() => {
    return university ? (campusRunnersByUniversity[university] ?? []) : [];
  }, [university]);

  const handleUniversityChange = (nextUniversity) => {
    onChange({ university: nextUniversity, campusRunner: "" });
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 pt-3">
      <div className="mb-6">
        <button
          type="button"
          onClick={() => onBack()}
          className="inline-flex items-center gap-2 text-emerald-700 font-semibold cursor-pointer"
        >
          <ChevronLeftIcon className="w-5 h-5" />
          Back
        </button>
      </div>

      <div className="space-y-sm">
        <div className="mb-4">
          <h1 className="text-xs ms:text-3xl font-black text-slate-900 tracking-tight ">
            Pricing & Logistics
          </h1>
        </div>
        <p className="block text-[10px] ms:text-[15px] font-black text-slate-400 ">
          Set your price and tell buyers where they can find you on campus.
        </p>
      </div>

      <div className="mt-8 space-y-5">
        <div>
          <label
            htmlFor="price"
            className="mb-3 block text-sm font-semibold text-slate-900"
          >
            Item Price
          </label>
          <div className="flex items-center rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm focus-within:border-emerald-500">
            <span className="mr-3 text-2xl font-bold text-slate-500">₦</span>
            <input
              id="price"
              type="number"
              inputMode="decimal"
              value={price}
              onChange={(event) => onChange({ price: event.target.value })}
              placeholder="0.00"
              className="w-full border-0 bg-transparent text-3xl font-bold tracking-tight text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
        </div>

        <ThemeDropdown
          label="Target University Hub"
          value={university}
          placeholder="Select University"
          options={universityOptions}
          onChange={handleUniversityChange}
        />
        {errors?.university && (
          <p className="text-red-500 text-xs mt-1 font-medium">
            {errors.university}
          </p>
        )}

        <ThemeDropdown
          label="Pickup Option"
          value={pickupOption}
          placeholder="Select Pickup Option"
          options={pickupOptions}
          onChange={(value) => onChange({ pickupOption: value })}
        />
        {errors?.pickupOption && (
          <p className="text-red-500 text-xs mt-1 font-medium">
            {errors.pickupOption}
          </p>
        )}

        <ThemeDropdown
          label="Campus Runner"
          value={campusRunner}
          placeholder={
            university ? "Select Campus Runner" : "Choose a university first"
          }
          options={campusRunnerOptions}
          onChange={(value) => onChange({ campusRunner: value })}
          disabled={!university}
        />
        {errors?.campusRunner && (
          <p className="text-red-500 text-xs mt-1 font-medium">
            {errors.campusRunner}
          </p>
        )}
      </div>

      <div className="mt-10 w-full border-t border-slate-100 p-4 ms:p-6">
        <button
          type="button"
          disabled={isLoading}
          onClick={() => onContinue()}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-2 ms:p-4 rounded-2xl flex items-center justify-center mx-auto gap-2 transition-all active:scale-95 shadow-lg shadow-emerald-200 cursor-pointer max-w-md"
        >
            <span className="text-xs ms:text-sm">
              Continue to Review and Post
            </span>
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default PricingStep;
