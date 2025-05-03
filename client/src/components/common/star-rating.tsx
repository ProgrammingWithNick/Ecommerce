import { Star } from "lucide-react";
import { Button } from "../ui/button";

interface StarRatingProps {
    rating: number;
    handleRatingChange?: (star: number) => void;
}

function StarRatingComponent({ rating, handleRatingChange }: StarRatingProps) {
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => {
                const isActive = star <= rating;
                return (
                    <Button
                        key={star}
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 p-0 ${
                            isActive ? "text-yellow-500" : "text-gray-300"
                        }`}
                        onClick={handleRatingChange ? () => handleRatingChange(star) : undefined}
                        type="button"
                        disabled={!handleRatingChange}
                    >
                        <Star className={`w-5 h-5 ${isActive ? "fill-yellow-500" : ""}`} />
                    </Button>
                );
            })}
        </div>
    );
}

export default StarRatingComponent;