import { StarIcon } from "@heroicons/react/24/solid"

const StarIconComponent = ({rating = 4.6}) =>{
    return (
      <div className="flex ">
        {rating}
        {[...Array(5)].map((_, index) => {
          const pathFill = Math.max(Math.min(rating - index, 1), 0) * 100;
          return (
            <div
              className="relative h-6 w-6 text-slate-500 flex items-center justify-center cursor-pointer"
              key={index}
            >
              <StarIcon className="h-full w-full absolute inset-0 " />
              <div
                className="absolute  left-0 flex items-center inset-y-0 overflow-hidden"
                style={{ width: `${pathFill}%` }}
              >
                <StarIcon className="h-6 w-6 min-w-6 text-emerald-600" />
              </div>
            </div>
          );
        })}
      </div>
    );
}
export default StarIconComponent