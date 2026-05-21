import React from "react";

const ComingSoonModal = ({ isOpen, onClose, onExplore }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
        
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full 
            bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white">
            📘
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Notes are on the way
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              This section is being carefully prepared
            </p>
          </div>
        </div>

        {/* Body */}
        <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          We’re currently working on well-structured, exam-focused notes for this year.
          <br />
          <br />
          Until then, we recommend exploring
          <span className="font-medium text-slate-900 dark:text-white">
            {" "}Previous Year Question Papers (PYQs)
          </span>
          {" "}to understand patterns and prepare effectively.
        </p>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="cursor-pointer px-4 py-2 rounded-md text-sm font-medium
              text-slate-600 dark:text-slate-300
              hover:bg-slate-100 dark:hover:bg-slate-800
              transition-colors"
          >
            Close
          </button>

          <button
            onClick={onExplore}
            className="cursor-pointer px-4 py-2 rounded-md text-sm font-medium
              bg-slate-900 text-white
              dark:bg-white dark:text-slate-900
              hover:opacity-90 transition-opacity"
          >
            Explore PYQs
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonModal;
