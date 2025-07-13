import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, FileText, Download, Users, Clock, Shield, Check, Star, ArrowRight, Sparkles, Play, ChevronRight, Mic, Brain, FileCheck, Globe, Lock, TrendingUp, MessageSquare, Headphones } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Header } from '@/components/layout/Header';

const Footer = () => (
    <footer className="border-t border-border/50 py-12 bg-background/80">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-gradient-primary rounded-md flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold">AutoBrief.AI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              AI-powered document generation for modern professionals.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <a href="#features" className="block hover:text-primary">Features</a>
              <a href="#pricing" className="block hover:text-primary">Pricing</a>
              <a href="#testimonials" className="block hover:text-primary">Testimonials</a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <a href="#" className="block hover:text-primary">About</a>
              <a href="#" className="block hover:text-primary">Blog</a>
              <a href="#" className="block hover:text-primary">Careers</a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <a href="#" className="block hover:text-primary">Help Center</a>
              <a href="#" className="block hover:text-primary">Privacy Policy</a>
              <a href="#" className="block hover:text-primary">Terms of Service</a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border/50 mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} AutoBrief.AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
);

const Index = () => {
  const [statsAnimated, setStatsAnimated] = useState(false);
  const [activeDemo, setActiveDemo] = useState(0);

  const useCounter = (end: number, duration: number = 2000, startAnimation: boolean = false) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
      if (!startAnimation) return;
      let startTime: number | undefined;
      let animationFrame: number;
      const animate = (currentTime: number) => {
        if (startTime === undefined) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };
      animationFrame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrame);
    }, [end, duration, startAnimation]);
    return count;
  };
  
  const clientsCount = useCounter(2500, 2000, statsAnimated);
  const docsCount = useCounter(50000, 2000, statsAnimated);
  const timeCount = useCounter(85, 2000, statsAnimated);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !statsAnimated) {
        setStatsAnimated(true);
      }
    }, {
      threshold: 0.3
    });
    const statsElement = document.getElementById('animated-stats');
    if (statsElement) observer.observe(statsElement);
    return () => observer.disconnect();
  }, [statsAnimated]);
  
  const demoSteps = [{
    icon: Mic,
    title: "Record or Upload",
    description: "Upload audio or paste your notes"
  }, {
    icon: Brain,
    title: "AI Processing",
    description: "Our AI analyzes and structures content"
  }, {
    icon: FileCheck,
    title: "Professional Brief",
    description: "Get polished, ready-to-share documents"
  }];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header variant="landing" />

      <main>
        {/* Hero Section - Moved closer to header */}
        <section className="relative py-8 lg:py-12 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float"></div>
            <div className="absolute top-3/4 -right-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float-delayed"></div>
            </div>
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <Badge variant="secondary" className="mb-6 text-sm font-medium animate-fade-in">
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Document Generation
              </Badge>
              
              <h1 className="text-5xl font-bold text-foreground mb-6 leading-tight animate-slide-up lg:text-6xl">
                Transform Your Notes Into{' '}
                    <span className="text-primary">Professional Briefs</span>{' '}
                in Seconds
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed animate-slide-up animation-delay-200">
                Stop spending hours formatting meeting notes and client updates. 
                    Our AI instantly converts your unstructured content into polished, 
                    professional documents that impress.
              </p>
              
                <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-slide-up animation-delay-400">
                <Link to="/app/upload">
                  <Button size="lg" className="gradient-primary hover-scale shadow-elegant px-8 py-4 text-lg group">
                    <Zap className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                        Create Your First Brief
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>

              <div id="animated-stats" className="grid grid-cols-3 gap-6 animate-slide-up animation-delay-600">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{clientsCount.toLocaleString()}+</div>
                  <div className="text-sm text-muted-foreground">Happy Clients</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{docsCount.toLocaleString()}+</div>
                  <div className="text-sm text-muted-foreground">Documents Created</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{timeCount}%</div>
                  <div className="text-sm text-muted-foreground">Time Saved</div>
                </div>
              </div>
            </div>

            <div className="relative animate-slide-up animation-delay-800">
                <div className="glass rounded-2xl p-6 shadow-elegant border border-border/20">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">How It Works</h3>
                    <Badge variant="outline" className="text-xs">Live Demo</Badge>
                  </div>
                  
                  <div className="space-y-4">
                        {demoSteps.map((step, index) => (
                            <div key={index} className={`flex items-center p-4 rounded-xl transition-all cursor-pointer ${activeDemo === index ? 'bg-primary/10 border-l-4 border-primary' : 'hover:bg-muted/50'}`} onClick={() => setActiveDemo(index)}>
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${activeDemo === index ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                          <step.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{step.title}</div>
                          <div className="text-xs text-muted-foreground">{step.description}</div>
                        </div>
                        {activeDemo === index && <ChevronRight className="w-4 h-4 text-primary animate-pulse" />}
                        </div>
                        ))}
                  </div>
                </div>

                    <div className="bg-gradient-subtle rounded-xl p-4 border border-border/20">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="text-xs text-muted-foreground bg-transparent">AutoBrief.AI</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="h-2 bg-primary/20 rounded w-3/4 animate-pulse"></div>
                    <div className="h-2 bg-primary/20 rounded w-1/2 animate-pulse animation-delay-200"></div>
                    <div className="h-2 bg-primary/20 rounded w-5/6 animate-pulse animation-delay-400"></div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-center">
                    <Button size="sm" className="gradient-primary text-xs">
                      <Headphones className="w-3 h-3 mr-1" />
                      Processing Audio...
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center space-x-6 text-sm text-muted-foreground">
                    <div className="flex items-center bg-background/50 backdrop-blur-sm px-3 py-2 rounded-full border border-border/20">
                    <Lock className="w-4 h-4 mr-1 text-green-600 dark:text-green-400" />
                  <span>Enterprise Secure</span>
                </div>
                    <div className="flex items-center bg-background/50 backdrop-blur-sm px-3 py-2 rounded-full border border-border/20">
                    <Globe className="w-4 h-4 mr-1 text-blue-600 dark:text-blue-400" />
                  <span>GDPR Compliant</span>
                </div>
                    <div className="flex items-center bg-background/50 backdrop-blur-sm px-3 py-2 rounded-full border border-border/20">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500 mr-1" />
                  <span>4.9/5 Rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

        {/* Features Section - Refined Bento Grid Style */}
        <section id="features" className="py-16 bg-background/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">⚡ Powerful Features</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Everything You Need to{' '}
                <span className="text-primary">Work Smarter</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Built for <span className="text-primary">professionals</span> who value their time and need consistent, high-quality documentation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-12">
                <Card className="md:col-span-4 md:row-span-2 group relative overflow-hidden border border-border/40 bg-gradient-to-br from-background via-background to-muted/20 shadow-lg hover:shadow-xl transition-all duration-500 hover:border-primary/20">
                <CardContent className="p-8 h-full flex flex-col relative z-10">
                <div className="flex items-start justify-between mb-6">
                    <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                    <Badge variant="secondary" className="text-xs bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 border-orange-200 dark:from-orange-900/20 dark:to-red-900/20 dark:text-orange-300 dark:border-orange-800">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Most Popular
                    </Badge>
                </div>
                    <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">Lightning-Fast Processing</h3>
                    <p className="text-muted-foreground mb-6 flex-1 leading-relaxed">
                  Generate professional briefs in under 30 seconds. Our advanced AI processes 
                  your unstructured notes and transforms them into polished documents instantly.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-muted/40 rounded-xl p-4 border border-border/30 relative">
                        <div className="text-xs text-muted-foreground mb-3 font-medium">Before (Raw Notes)</div>
                        <div className="space-y-2">
                        <div className="h-2 bg-muted rounded-full w-full"></div>
                        <div className="h-2 bg-muted rounded-full w-3/4"></div>
                        <div className="h-2 bg-muted rounded-full w-5/6"></div>
                        <div className="h-2 bg-muted rounded-full w-2/3"></div>
                        </div>
                        <div className="absolute top-2 right-2 w-6 h-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                        <span className="text-xs text-red-600 dark:text-red-400">✗</span>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-4 border border-primary/20 relative">
                        <div className="text-xs text-primary mb-3 font-medium">After (Professional Brief)</div>
                        <div className="space-y-2">
                        <div className="h-2 bg-gradient-to-r from-primary/40 to-primary/30 rounded-full w-full"></div>
                        <div className="h-2 bg-gradient-to-r from-primary/30 to-primary/20 rounded-full w-4/5"></div>
                        <div className="h-2 bg-gradient-to-r from-primary/40 to-primary/30 rounded-full w-full"></div>
                        <div className="h-2 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full w-3/4"></div>
                  </div>
                        <div className="absolute top-2 right-2 w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        <span className="text-xs text-green-600 dark:text-green-400">✓</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

                <Card className="md:col-span-2 glass hover-lift group transition-all duration-500 border border-border/20">
              <CardContent className="p-6 h-full">
                <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6 text-success" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Smart Templates</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Choose from expertly crafted templates optimized for different use cases and industries.
                </p>
                <div className="space-y-2">
                    {['Meeting Summary', 'Client Update', 'Action Plan'].map((template, i) => (
                        <div key={i} className="flex items-center text-xs">
                      <Check className="w-3 h-3 text-success mr-2" />
                      {template}
                        </div>
                    ))}
                </div>
              </CardContent>
            </Card>

                <Card className="md:col-span-2 glass hover-lift group transition-all duration-500 border border-border/20">
              <CardContent className="p-6 h-full">
                <div className="w-12 h-12 bg-info/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Download className="w-6 h-6 text-info" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Export & Share</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Multiple export formats and sharing options for seamless workflow integration.
                </p>
                <div className="flex flex-wrap gap-2">
                    {['PDF', 'Word', 'Email', 'Slack'].map((format, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{format}</Badge>
                    ))}
                </div>
              </CardContent>
            </Card>
            </div>
            </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <Badge variant="outline" className="mb-4">⚙️ How It Works</Badge>
                    <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                        From Raw Notes to Polished Briefs in 3 Simple Steps
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Our streamlined workflow transforms your unstructured content into professional documents effortlessly.
                    </p>
                </div>

                <div className="relative">
                    {/* Dashed line connector for desktop */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-transparent mt-8">
                        <svg className="w-full" height="2">
                            <line x1="0" y1="1" x2="100%" y2="1" strokeWidth="2" strokeDasharray="8, 8" className="stroke-border" />
                        </svg>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 relative">
                        {/* Step 1 */}
                        <div className="text-center">
                            <div className="mb-4 relative bg-background">
                                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center ring-8 ring-background shadow-lg">
                                    <Mic className="w-8 h-8 text-primary" />
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">1. Upload or Record</h3>
                            <p className="text-muted-foreground">
                                Upload audio files, record directly, or paste your rough notes. We support multiple formats and make it easy to get started.
                  </p>
                </div>

                        {/* Step 2 */}
                        <div className="text-center">
                            <div className="mb-4 relative bg-background">
                                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center ring-8 ring-background shadow-lg">
                                    <Brain className="w-8 h-8 text-primary" />
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">2. AI Processing</h3>
                            <p className="text-muted-foreground">
                                Our advanced AI transcribes, analyzes, and identifies key insights, action items, and structures your content intelligently.
                            </p>
                </div>

                        {/* Step 3 */}
                        <div className="text-center">
                            <div className="mb-4 relative bg-background">
                                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center ring-8 ring-background shadow-lg">
                                    <FileCheck className="w-8 h-8 text-primary" />
                                </div>
                </div>
                            <h3 className="text-xl font-semibold mb-2">3. Professional Output</h3>
                            <p className="text-muted-foreground">
                                Get a polished, professionally formatted document in seconds. Export to PDF, Word, or share instantly with your team.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-16 md:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto mb-12 text-center">
                    <Badge variant="outline" className="mb-4">💰 Pricing Plans</Badge>
                    <h2 className="text-3xl lg:text-4xl font-bold">Choose Your Perfect Plan</h2>
                    <p className="mt-4 text-lg text-muted-foreground">Start free, scale as you grow. No long-term commitments.</p>
                </div>
                <div className="grid max-w-5xl grid-cols-1 gap-8 mx-auto md:grid-cols-3">
                    <Card className="flex flex-col justify-between p-6 transition-all duration-300 glass hover-lift border border-border/20">
                        <div>
                            <h3 className="text-2xl font-bold">Free</h3>
                            <p className="mt-2 text-muted-foreground">For individuals and small projects.</p>
                            <p className="mt-6 text-4xl font-bold">$0<span className="text-lg font-normal text-muted-foreground">/month</span></p>
                            <ul className="mt-6 space-y-4">
                                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-primary" />30 minutes of audio per month</li>
                                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-primary" />Basic brief generation</li>
                                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-primary" />Community support</li>
                            </ul>
                        </div>
                        <Link to="/auth/register" className="w-full mt-8">
                            <Button className="w-full" variant="outline">Get Started</Button>
                        </Link>
                    </Card>
                    <Card className="relative flex flex-col justify-between p-6 overflow-hidden transition-all duration-300 border-2 border-primary shadow-elegant bg-card">
                        <Badge className="absolute top-0 right-0 px-3 py-1 m-4 -rotate-12">Most Popular</Badge>
                        <div>
                            <h3 className="text-2xl font-bold">Pro</h3>
                            <p className="mt-2 text-muted-foreground">For <span className="text-primary">professionals</span> and small teams.</p>
                            <p className="mt-6 text-4xl font-bold">$29<span className="text-lg font-normal text-muted-foreground">/month</span></p>
                            <ul className="mt-6 space-y-4">
                                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-primary" />300 minutes of audio per month</li>
                                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-primary" />Advanced brief generation</li>
                                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-primary" />Priority email support</li>
                                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-primary" />Team collaboration features</li>
                            </ul>
                        </div>
                        <Link to="/auth/register" className="w-full mt-8">
                            <Button className="w-full gradient-primary">Choose Pro</Button>
                        </Link>
                    </Card>
                    <Card className="flex flex-col justify-between p-6 transition-all duration-300 glass hover-lift border border-border/20">
                        <div>
                            <h3 className="text-2xl font-bold">Enterprise</h3>
                            <p className="mt-2 text-muted-foreground">For large organizations.</p>
                            <p className="mt-6 text-4xl font-bold">Contact Us</p>
                            <ul className="mt-6 space-y-4">
                                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-primary" />Unlimited audio processing</li>
                                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-primary" />Custom templates & integrations</li>
                                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-primary" />Dedicated account manager</li>
                                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-primary" />Enterprise-grade security</li>
                            </ul>
                        </div>
                        <a href="#" className="w-full mt-8">
                            <Button className="w-full" variant="outline">Contact Sales</Button>
                        </a>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof & Testimonials */}
        <section id="testimonials" className="py-16 bg-gradient-subtle">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">💬 Customer Success</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Loved by{' '}
                <span className="text-primary">Professionals</span>{' '}
              Worldwide
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See how teams across industries are transforming their documentation workflow.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
                <Card className="glass hover-lift transition-all duration-500 border border-border/20">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                    <div className="flex text-yellow-500">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <span className="ml-2 text-sm text-muted-foreground">5.0</span>
                </div>
                <p className="text-muted-foreground mb-4 italic">
                  "AutoBrief.AI transformed our client reporting process. What used to take 2 hours now takes 5 minutes. Our clients love the professional quality."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-semibold text-sm">SM</span>
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Sarah Mitchell</div>
                    <div className="text-xs text-muted-foreground">Project Manager, TechCorp</div>
                  </div>
                </div>
              </CardContent>
            </Card>

                <Card className="glass hover-lift transition-all duration-500 border border-border/20">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                    <div className="flex text-yellow-500">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <span className="ml-2 text-sm text-muted-foreground">5.0</span>
                </div>
                <p className="text-muted-foreground mb-4 italic">
                  "The AI understands context incredibly well. It picks up on action items, decisions, and key points automatically. It's like having a professional assistant."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-semibold text-sm">MR</span>
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Michael Rodriguez</div>
                    <div className="text-xs text-muted-foreground">Agency Owner, Digital Plus</div>
                  </div>
                </div>
              </CardContent>
            </Card>

                <Card className="glass hover-lift transition-all duration-500 border border-border/20">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                    <div className="flex text-yellow-500">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <span className="ml-2 text-sm text-muted-foreground">5.0</span>
                </div>
                <p className="text-muted-foreground mb-4 italic">
                  "Game changer for our HR team. Policy updates and meeting notes are now consistent and professional. The templates are perfectly structured."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-semibold text-sm">LC</span>
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Lisa Chen</div>
                    <div className="text-xs text-muted-foreground">HR Director, InnovateLab</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
        <section className="relative py-16 overflow-hidden bg-gradient-subtle dark:bg-transparent">
            <div className="absolute inset-0 bg-transparent dark:bg-gradient-primary"></div>
                <div className="hidden dark:block absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }}></div>
        
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <Badge variant="secondary" className="mb-6">
            🚀 Ready to get started?
          </Badge>
          
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground dark:text-white mb-6 leading-tight">
            Transform Your Documentation
            <br />
                <span className="text-primary dark:text-white">Starting Today</span>
          </h2>
          
            <p className="text-xl text-muted-foreground dark:text-white/90 mb-8 max-w-3xl mx-auto">
                Join {clientsCount.toLocaleString()}+ <span className="text-primary dark:text-white font-semibold">professionals</span> who've streamlined their workflow. Start your free trial and create your first professional brief in under 2 minutes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/auth/register">
                <Button size="lg" className="gradient-primary hover-scale shadow-elegant px-8 py-4 text-lg group">
                Start Your Free Trial
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

            <div className="flex flex-wrap items-center justify-center gap-8 text-muted-foreground dark:text-white/80">
                 <div className="flex items-center bg-background/50 dark:bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-border dark:border-white/20">
                 <Check className="w-5 h-5 mr-2 text-success dark:text-green-300" />
              <span>Free 14-day trial</span>
            </div>
                 <div className="flex items-center bg-background/50 dark:bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-border dark:border-white/20">
                 <Check className="w-5 h-5 mr-2 text-success dark:text-green-300" />
              <span>No credit card required</span>
            </div>
                 <div className="flex items-center bg-background/50 dark:bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-border dark:border-white/20">
                 <Check className="w-5 h-5 mr-2 text-success dark:text-green-300" />
              <span>Cancel anytime</span>
            </div>
            </div>
            </div>
        </section>
      </main>

      <Footer />
              </div>
  );
};

export default Index;