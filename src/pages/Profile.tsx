
import { useState } from 'react';
import { User, Mail, Phone, Briefcase, Edit, MapPin, Save, Trash, Github, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  // Placeholder data - in a real app, this would come from your backend
  const [formData, setFormData] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '(555) 123-4567',
    location: 'San Francisco, CA',
    bio: 'Full-stack developer with 3 years of experience in React, Node.js, and TypeScript. Currently looking for new opportunities.',
    jobTitle: 'Software Engineer',
    skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'AWS'],
    github: 'github.com/alexjohnson',
    linkedin: 'linkedin.com/in/alexjohnson',
    profileVisibility: true,
    emailNotifications: true,
  });
  
  const updateField = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };
  
  const handleSave = () => {
    // In a real app, this would send data to your backend
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <section className="flex-1 pt-24 pb-16">
        <div className="container max-w-4xl">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
              <p className="text-muted-foreground mt-1">
                Manage your account and preferences
              </p>
            </div>
            
            {activeTab === 'profile' && !isEditing && (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            )}
            
            {activeTab === 'profile' && isEditing && (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            )}
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-2 w-full md:w-[400px] h-11">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader className="relative pb-0">
                  <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/5 rounded-t-lg" />
                  <div className="absolute -bottom-12 left-8">
                    <Avatar className="h-24 w-24 border-4 border-background">
                      <AvatarImage src="/placeholder.svg" alt={formData.name} />
                      <AvatarFallback>
                        {formData.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </CardHeader>
                <CardContent className="pt-16">
                  {!isEditing ? (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-semibold">{formData.name}</h2>
                        <p className="text-muted-foreground">{formData.jobTitle}</p>
                      </div>
                      
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          {formData.email}
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          {formData.phone}
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          {formData.location}
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <Github className="h-4 w-4 text-muted-foreground" />
                          {formData.github}
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <Linkedin className="h-4 w-4 text-muted-foreground" />
                          {formData.linkedin}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-2">About</h3>
                        <p className="text-sm">{formData.bio}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-2">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {formData.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input 
                            id="name" 
                            value={formData.name}
                            onChange={(e) => updateField('name', e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="jobTitle">Job Title</Label>
                          <Input 
                            id="jobTitle" 
                            value={formData.jobTitle}
                            onChange={(e) => updateField('jobTitle', e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            type="email"
                            value={formData.email}
                            onChange={(e) => updateField('email', e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input 
                            id="phone" 
                            value={formData.phone}
                            onChange={(e) => updateField('phone', e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input 
                            id="location" 
                            value={formData.location}
                            onChange={(e) => updateField('location', e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="skills">Skills (comma-separated)</Label>
                          <Input 
                            id="skills" 
                            value={formData.skills.join(', ')}
                            onChange={(e) => updateField('skills', e.target.value.split(', '))}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="github">GitHub</Label>
                          <Input 
                            id="github" 
                            value={formData.github}
                            onChange={(e) => updateField('github', e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="linkedin">LinkedIn</Label>
                          <Input 
                            id="linkedin" 
                            value={formData.linkedin}
                            onChange={(e) => updateField('linkedin', e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bio">About</Label>
                        <Textarea 
                          id="bio" 
                          rows={4}
                          value={formData.bio}
                          onChange={(e) => updateField('bio', e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>
                    Manage your account settings and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Privacy</h3>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="profile-visibility">Profile Visibility</Label>
                        <p className="text-sm text-muted-foreground">
                          Make your profile visible to other users
                        </p>
                      </div>
                      <Switch 
                        id="profile-visibility" 
                        checked={formData.profileVisibility}
                        onCheckedChange={(checked) => updateField('profileVisibility', checked)}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Notifications</h3>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive email notifications about interview updates
                        </p>
                      </div>
                      <Switch 
                        id="email-notifications" 
                        checked={formData.emailNotifications}
                        onCheckedChange={(checked) => updateField('emailNotifications', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <Button 
                    variant="destructive" 
                    className="gap-2"
                    onClick={() => toast.error('This feature is not yet implemented')}
                  >
                    <Trash className="h-4 w-4" />
                    Delete Account
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Profile;
