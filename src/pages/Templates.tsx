import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText, Briefcase, Zap, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const templates = [
  {
    title: 'Meeting Summary',
    description: 'Perfect for summarizing key decisions and action items from any meeting.',
    icon: FileText,
  },
  {
    title: 'Client Update',
    description: 'A professional format for keeping your clients informed of project progress.',
    icon: Briefcase,
  },
  {
    title: 'Action Plan',
    description: 'Clearly outline the next steps, owners, and deadlines for any project.',
    icon: Zap,
  },
];

export function Templates() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Brief Templates</h1>
          <p className="text-muted-foreground">Choose a template to get started with your next brief.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template, index) => (
          <Card key={index} className="flex flex-col justify-between hover:shadow-lg transition-shadow">
            <CardHeader>
              <template.icon className="h-8 w-8 text-primary mb-4" />
              <CardTitle>{template.title}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Use Template</Button>
            </CardContent>
          </Card>
        ))}

        <Card className="flex flex-col items-center justify-center border-2 border-dashed text-center p-6 hover:shadow-lg transition-shadow">
            <CardHeader>
                <div className="mx-auto bg-primary/10 rounded-full p-3 w-max">
                    <PlusCircle className="h-8 w-8 text-primary" />
                </div>
                 <CardTitle className="mt-4">Custom Template</CardTitle>
                 <CardDescription>
                    Need something different? Create your own template.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button variant="outline">Create Custom</Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
} 