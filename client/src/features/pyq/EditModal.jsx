import PyqForm from "./Form";

export default function EditPyqModal({ pyq, onClose, onUpdate, isLoading = false }) {
  if (!pyq) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card border border-primary  rounded-xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Edit PYQ</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </div>

        <PyqForm
          initialData={pyq}
          submitLabel="Update PYQ"
          onSubmit={onUpdate}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
