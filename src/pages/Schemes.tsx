import React, { useState } from "react";
import { useSchemes, Scheme } from "@/context/SchemesContext";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SchemeDetailModal } from "@/components/SchemeDetailModal";
import {
  Search,
  Filter,
  Star,
  Users,
  ArrowRight,
  ExternalLink,
  Eye,
} from "lucide-react";

const Schemes = () => {
  const { schemes, getAllCategories, searchSchemes, incrementViews } =
    useSchemes();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredSchemes, setFilteredSchemes] = useState(schemes);
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleSchemeClick = (scheme: Scheme) => {
    setSelectedScheme(scheme);
    setIsDetailModalOpen(true);
    incrementViews(scheme.id);
  };

  React.useEffect(() => {
    let result = schemes;

    if (searchQuery) {
      result = searchSchemes(searchQuery);
    }

    if (selectedCategory !== "all") {
      result = result.filter((scheme) => scheme.category === selectedCategory);
    }

    setFilteredSchemes(result);
  }, [searchQuery, selectedCategory, schemes, searchSchemes]);

  const categories = getAllCategories();

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      Farmers: "🌾",
      "Senior Citizens": "👴",
      Women: "👩",
      "Digital Services": "💻",
      Healthcare: "🏥",
      Business: "🏢",
    };
    return icons[category] || "📋";
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Farmers: "bg-green-100 text-green-800",
      "Senior Citizens": "bg-blue-100 text-blue-800",
      Women: "bg-pink-100 text-pink-800",
      "Digital Services": "bg-purple-100 text-purple-800",
      Healthcare: "bg-red-100 text-red-800",
      Business: "bg-orange-100 text-orange-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Section with Gradient */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-purple-700 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Government Schemes
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Discover welfare programs and benefits available for Telangana
            citizens. Apply directly to official portals
          </p>

          {/* Search and Filter */}
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search schemes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 text-lg bg-white/90 backdrop-blur-sm border-0 rounded-full"
              />
            </div>

            <div className="flex justify-center">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-48 bg-white/90 backdrop-blur-sm border-0 rounded-full">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <SelectValue placeholder="All Categories" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Citizens</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Showing {filteredSchemes.length} of {schemes.length} schemes
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchemes.map((scheme) => (
            <Card
              key={scheme.id}
              className="bg-white hover:shadow-lg transition-all duration-300 border-0 shadow-sm group cursor-pointer"
            >
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{scheme.icon}</div>
                    <Badge className={getCategoryColor(scheme.category)}>
                      {scheme.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">{scheme.views}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {scheme.name}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {scheme.description}
                </p>

                {/* Key Benefits */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium text-gray-700">
                      Key Benefits
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {scheme.keyBenefits.slice(0, 4).map((benefit, index) => (
                      <li
                        key={index}
                        className="text-xs text-gray-600 flex items-center gap-2"
                      >
                        <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Users className="w-4 h-4" />
                    <span className="text-xs">{scheme.department}</span>
                  </div>
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 group-hover:bg-blue-700"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredSchemes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No schemes found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Need help with applications?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Visit your nearest MeeSeva center or contact our helpline for
            assistance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              Find MeeSeva Center
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              Call 1800-425-111
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schemes;
