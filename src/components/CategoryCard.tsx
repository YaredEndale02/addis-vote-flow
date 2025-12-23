import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Category } from "@/data/votingData";
import { Link } from "react-router-dom";
import { ChevronRight, Check } from "lucide-react";

interface CategoryCardProps {
  category: Category;
  hasVoted?: boolean;
}

const CategoryCard = ({ category, hasVoted = false }: CategoryCardProps) => {
  return (
    <Link to={`/vote/${category.id}`}>
      <Card variant="category" className="h-full group cursor-pointer relative overflow-hidden">
        {hasVoted && (
          <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-accent flex items-center justify-center shadow-gold z-10">
            <Check className="w-4 h-4 text-accent-foreground" />
          </div>
        )}
        
        <CardHeader className="pb-3">
          <div className="text-4xl mb-3">{category.icon}</div>
          <CardTitle className="text-xl group-hover:text-accent transition-colors duration-300">
            {category.name}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            {category.description}
          </p>
          <div className="flex items-center gap-2 text-sm font-medium text-primary group-hover:text-accent transition-colors duration-300">
            {hasVoted ? "Change Vote" : "Vote Now"}
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CategoryCard;
