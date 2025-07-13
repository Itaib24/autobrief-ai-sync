import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';

interface DiagnosticResult {
  step: string;
  status: 'success' | 'error' | 'warning' | 'pending';
  message: string;
  data?: any;
  error?: any;
}

export function SaveDiagnostic() {
  const { user } = useAuth();
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (result: DiagnosticResult) => {
    setResults(prev => [...prev, result]);
  };

  const runDiagnostic = async () => {
    setIsRunning(true);
    setResults([]);

    try {
      // Step 1: Check authentication
      addResult({
        step: 'Authentication Check',
        status: 'pending',
        message: 'Checking user authentication...'
      });

      if (!user) {
        addResult({
          step: 'Authentication Check',
          status: 'error',
          message: 'User not authenticated'
        });
        return;
      }

      addResult({
        step: 'Authentication Check',
        status: 'success',
        message: `User authenticated: ${user.id}`,
        data: { userId: user.id, email: user.email }
      });

      // Step 2: Check user profile
      addResult({
        step: 'User Profile Check',
        status: 'pending',
        message: 'Checking user profile...'
      });

      const { data: userProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileError) {
        addResult({
          step: 'User Profile Check',
          status: 'error',
          message: `Profile error: ${profileError.message}`,
          error: profileError
        });
      } else if (!userProfile) {
        addResult({
          step: 'User Profile Check',
          status: 'warning',
          message: 'No user profile found - may need to create one'
        });
      } else {
        addResult({
          step: 'User Profile Check',
          status: 'success',
          message: `Profile found: ${userProfile.briefs_count}/${userProfile.briefs_limit} briefs used`,
          data: userProfile
        });
      }

      // Step 3: Test transcript save
      addResult({
        step: 'Transcript Save Test',
        status: 'pending',
        message: 'Testing transcript save...'
      });

      const testTranscript = `Test transcript created at ${new Date().toISOString()}`;
      const { data: transcriptData, error: transcriptError } = await supabase
        .from('transcripts')
        .insert({
          user_id: user.id,
          original_text: testTranscript,
          source_type: 'diagnostic_test',
          metadata: {
            test: true,
            timestamp: new Date().toISOString()
          }
        })
        .select()
        .single();

      if (transcriptError) {
        addResult({
          step: 'Transcript Save Test',
          status: 'error',
          message: `Transcript save failed: ${transcriptError.message}`,
          error: transcriptError
        });
        return;
      }

      addResult({
        step: 'Transcript Save Test',
        status: 'success',
        message: `Transcript saved successfully: ${transcriptData.id}`,
        data: transcriptData
      });

      // Step 4: Test brief save
      addResult({
        step: 'Brief Save Test',
        status: 'pending',
        message: 'Testing brief save...'
      });

      const testBrief = `Test brief created at ${new Date().toISOString()}`;
      const { data: briefData, error: briefError } = await supabase
        .from('briefs')
        .insert({
          transcript_id: transcriptData.id,
          template: 'meeting_summary',
          content_md: testBrief,
          metadata: {
            test: true,
            timestamp: new Date().toISOString()
          }
        })
        .select()
        .single();

      if (briefError) {
        addResult({
          step: 'Brief Save Test',
          status: 'error',
          message: `Brief save failed: ${briefError.message}`,
          error: briefError
        });
        return;
      }

      addResult({
        step: 'Brief Save Test',
        status: 'success',
        message: `Brief saved successfully: ${briefData.id}`,
        data: briefData
      });

      // Step 5: Test data retrieval
      addResult({
        step: 'Data Retrieval Test',
        status: 'pending',
        message: 'Testing data retrieval...'
      });

      const { data: retrievedBrief, error: retrievalError } = await supabase
        .from('briefs')
        .select(`
          *,
          transcripts (*)
        `)
        .eq('id', briefData.id)
        .single();

      if (retrievalError) {
        addResult({
          step: 'Data Retrieval Test',
          status: 'error',
          message: `Data retrieval failed: ${retrievalError.message}`,
          error: retrievalError
        });
      } else {
        addResult({
          step: 'Data Retrieval Test',
          status: 'success',
          message: 'Data retrieved successfully',
          data: retrievedBrief
        });
      }

      // Step 6: Cleanup test data
      addResult({
        step: 'Cleanup Test Data',
        status: 'pending',
        message: 'Cleaning up test data...'
      });

      const { error: cleanupError } = await supabase
        .from('transcripts')
        .delete()
        .eq('id', transcriptData.id);

      if (cleanupError) {
        addResult({
          step: 'Cleanup Test Data',
          status: 'warning',
          message: `Cleanup warning: ${cleanupError.message}`,
          error: cleanupError
        });
      } else {
        addResult({
          step: 'Cleanup Test Data',
          status: 'success',
          message: 'Test data cleaned up successfully'
        });
      }

    } catch (error) {
      addResult({
        step: 'Diagnostic Error',
        status: 'error',
        message: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error
      });
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'pending':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
    }
  };

  const getStatusColor = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending':
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Save Functionality Diagnostic
          {isRunning && <Loader2 className="h-5 w-5 animate-spin" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={runDiagnostic} 
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            {isRunning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Running Diagnostic...
              </>
            ) : (
              'Run Diagnostic'
            )}
          </Button>
          
          {results.length > 0 && (
            <Button 
              variant="outline" 
              onClick={() => setResults([])}
              disabled={isRunning}
            >
              Clear Results
            </Button>
          )}
        </div>

        {results.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Diagnostic Results</h3>
            {results.map((result, index) => (
              <Alert key={index} className={getStatusColor(result.status)}>
                <div className="flex items-start gap-3">
                  {getStatusIcon(result.status)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{result.step}</span>
                      <Badge variant="outline" className="text-xs">
                        {result.status}
                      </Badge>
                    </div>
                    <AlertDescription className="text-sm">
                      {result.message}
                    </AlertDescription>
                    {result.data && (
                      <details className="mt-2">
                        <summary className="text-xs cursor-pointer text-gray-600 hover:text-gray-800">
                          View Data
                        </summary>
                        <pre className="text-xs bg-gray-50 p-2 rounded mt-1 overflow-auto">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </details>
                    )}
                    {result.error && (
                      <details className="mt-2">
                        <summary className="text-xs cursor-pointer text-red-600 hover:text-red-800">
                          View Error Details
                        </summary>
                        <pre className="text-xs bg-red-50 p-2 rounded mt-1 overflow-auto">
                          {JSON.stringify(result.error, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        )}

        {!user && (
          <Alert className="border-red-200 bg-red-50">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              You must be logged in to run the diagnostic test.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
} 