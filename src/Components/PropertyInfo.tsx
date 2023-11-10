import { PropertyDisplay } from "../Classes/Puzzle";
import { Colors, Borders } from "../Classes/Colors";

interface Props {
  propertyDisplay: PropertyDisplay[];
}

function PropertyInfo({ propertyDisplay }: Props) {
  return (
    <div className="flex w-full justify-center mt-2 ">
      <div>
        {propertyDisplay.map(
          (property) =>
            property.active && (
              <div
                className={` flex justify-start my-3 w-96 p-1 rounded-md border-b-4 text-slate-100 font-sans font-medium
              ${Colors[property.colorID + 1]} ${Borders[property.colorID + 1]}`}
              >
                {property.name}
              </div>
            )
        )}
      </div>
    </div>
  );
}

export default PropertyInfo;
