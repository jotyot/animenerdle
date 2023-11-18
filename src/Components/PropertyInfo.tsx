import { PropertyDisplay } from "../Classes/Puzzle";
import { Colors, Borders } from "../Classes/Colors";

interface Props {
  propertyDisplay: PropertyDisplay[];
}

function PropertyInfo({ propertyDisplay }: Props) {
  return (
    <div>
      {propertyDisplay.map(
        (property) =>
          property.active && (
            <div
              className={` flex justify-start my-3 xs:w-96 sm:w-[28rem] lg:w-[32rem] xs:text-base sm:text-lg lg:text-xl 
                py-1 px-3 rounded-md border-b-4 text-slate-100 font-sans font-medium 
              ${Colors[property.colorID + 1]} ${Borders[property.colorID + 1]}`}
            >
              {property.name}
            </div>
          )
      )}
    </div>
  );
}

export default PropertyInfo;
