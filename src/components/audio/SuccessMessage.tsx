import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface SuccessMessageProps {
  briefId: string;
  onReset: () => void;
}

export function SuccessMessage({ briefId, onReset }: SuccessMessageProps) {
  const navigate = useNavigate();

  return (
    <Card className="border-2 border-green-200 bg-green-50 dark:bg-green-950/20 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-green-900 dark:text-green-100">Brief Generated Successfully!</h3>
              <p className="text-green-700 dark:text-green-300">Your audio has been processed and saved to your dashboard.</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => navigate(`/brief/${briefId}`)}
              className="border-green-300 text-green-700 hover:bg-green-100 dark:border-green-600 dark:text-green-300 dark:hover:bg-green-900"
            >
              View Full Brief
            </Button>
            <Button
              onClick={onReset}
              className="bg-primary hover:bg-primary/90"
            >
              Process Another Audio
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}