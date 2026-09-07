import React from 'react'
import { MinusIcon, PlusIcon } from 'lucide-react';

const Stepper = ( {onDecrease, onIncrease, quantity} ) => {
  return (
    <div className="flex items-center justify-between">
      <button
        type="button"
        onClick={onDecrease}
        className="p-0.5 sm:p-2 active:scale-90 transition-transform cursor-pointer"
      >
        <MinusIcon className="h-4 w-4" />
      </button>

      <span className="font-bold text-slate-800 text-sm">{quantity}</span>

      <button
        type="button"
        onClick={onIncrease}
        className="p-0.5 sm:p-2 active:scale-90 transition-transform cursor-pointer"
      >
        <PlusIcon className="h-4 w-4" />
      </button>
    </div>
  );
}

export default Stepper
