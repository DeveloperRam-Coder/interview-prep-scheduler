import { useState } from 'react';
import { Search, FileText, Video, Book, BookOpen, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ResourceCard, { Resource } from '@/components/resources/ResourceCard';

const resourceCategories = [
  { id: 'all', label: 'All Resources' },
  { id: 'technical', label: 'Technical' },
  { id: 'behavioral', label: 'Behavioral' },
  { id: 'resume', label: 'Resume & CV' },
  { id: 'career', label: 'Career Advice' },
];

const resourceTypes = [
  { id: 'all', label: 'All Types', icon: <BookOpen className="h-4 w-4" /> },
  { id: 'article', label: 'Articles', icon: <FileText className="h-4 w-4" /> },
  { id: 'video', label: 'Videos', icon: <Video className="h-4 w-4" /> },
  { id: 'guide', label: 'Guides', icon: <Book className="h-4 w-4" /> },
];

const Resources = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  
  // This would come from your backend in a real app
  const resources: Resource[] = [
    {
      id: '1',
      title: 'Data Structures Cheat Sheet',
      description: 'A comprehensive guide to common data structures and their operations',
      type: 'article',
      category: 'technical',
      author: 'Tech Interview Handbook',
      imageUrl: '/placeholder.svg',
      popularity: 4.5,
      premium: false,
    },
    {
      id: '2',
      title: 'System Design Fundamentals',
      description: 'Learn how to approach and solve system design interview questions',
      type: 'guide',
      category: 'technical',
      author: 'Coding Experts',
      imageUrl: '/placeholder.svg',
      popularity: 4.8,
      premium: true,
    },
    {
      id: '3',
      title: 'STAR Method for Behavioral Interviews',
      description: 'How to structure your answers using the STAR method',
      type: 'video',
      category: 'behavioral',
      author: 'Career Insights',
      imageUrl: '/placeholder.svg',
      popularity: 4.7,
      premium: false,
    },
    {
      id: '4',
      title: 'Resume Templates for Tech Roles',
      description: 'Professional templates optimized for ATS systems',
      type: 'guide',
      category: 'resume',
      author: 'Resume Crafters',
      imageUrl: '/placeholder.svg',
      popularity: 4.2,
      premium: false,
    },
    {
      id: '5',
      title: 'Negotiating Your Tech Offer',
      description: 'How to negotiate your salary and benefits package',
      type: 'article',
      category: 'career',
      author: 'Salary Experts',
      imageUrl: '/placeholder.svg',
      popularity: 4.9,
      premium: true,
    },
    {
      id: '6',
      title: 'Top 10 Algorithm Problems',
      description: 'Most common algorithm problems in technical interviews',
      type: 'article',
      category: 'technical',
      author: 'Algorithm Masters',
      imageUrl: '/placeholder.svg',
      popularity: 4.6,
      premium: false,
    },
  ];
  
  const filteredResources = resources.filter((resource) => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <section className="flex-1 pt-24 pb-16">
        <div className="container">
          <div className="flex flex-col lg:flex-row justify-between items-start mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Resources</h1>
              <p className="text-muted-foreground mt-1">
                Curated materials to help you prepare for your interviews
              </p>
            </div>
            
            <div className="w-full lg:w-auto">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search resources..."
                  className="w-full lg:w-[300px] pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div className="flex flex-wrap gap-2">
              {resourceCategories.map((category) => (
                <Badge
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.label}
                </Badge>
              ))}
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Filter by:</span>
              <div className="flex gap-1">
                {resourceTypes.map((type) => (
                  <Button
                    key={type.id}
                    variant={selectedType === type.id ? "default" : "outline"}
                    size="sm"
                    className="h-8 gap-1"
                    onClick={() => setSelectedType(type.id)}
                  >
                    {type.icon}
                    <span className="hidden sm:inline">{type.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          {filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <CardContent>
                <div className="flex justify-center mb-4">
                  <Search className="h-12 w-12 text-muted-foreground opacity-50" />
                </div>
                <h3 className="text-lg font-medium">No resources found</h3>
                <p className="text-muted-foreground mt-1">
                  Try adjusting your search or filters
                </p>
              </CardContent>
            </Card>
          )}
          
          <div className="mt-8 text-center">
            <Button variant="outline" size="lg">
              Load More Resources
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Resources;
