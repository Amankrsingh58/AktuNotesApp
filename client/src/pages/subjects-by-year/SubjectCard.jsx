import Icon from "../../components/AppIcon";

const SubjectCard = ({ subject }) => {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden transition hover:shadow-lg">
      
      {/* Image (30%) */}
      <div className="h-[140px] w-full overflow-hidden">
        <img
          src={subject.image}
          alt={subject.name}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col h-[calc(100%-140px)]">
        <p className="text-xs text-muted-foreground">{subject.code}</p>

        <h3 className="text-base font-semibold text-foreground mt-1">
          {subject.name}
        </h3>

        <p className="text-sm text-muted-foreground mb-3">
          {subject.units} Units
        </p>

        <hr className="border-border mb-3" />

        <div className="mt-auto flex items-center justify-between">
          <span className="font-semibold text-foreground">
            ₹{subject.price}
          </span>

          <button className="flex items-center gap-1 text-primary text-sm font-medium hover:underline">
            Download
            <Icon name="ArrowRight" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubjectCard;
