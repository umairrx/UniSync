import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background">
          <Card className="max-w-md w-full border-destructive/20 shadow-2xl overflow-hidden">
            <div className="h-2 bg-primary" />
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">
                Something went wrong
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-2">
                The application encountered an unexpected error and couldn't continue.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 rounded-lg p-4 border border-border/50 overflow-hidden">
                <p className="text-xs font-mono text-destructive break-all line-clamp-4">
                  {this.state.error?.message || "Unknown error occurred"}
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Your data is safe in local storage. Try refreshing the page or returning home.
              </p>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-center pt-2">
              <Button
                variant="outline"
                onClick={this.handleReset}
                className="w-full sm:w-auto gap-2"
              >
                <Home className="h-4 w-4" />
                Return Home
              </Button>
              <Button onClick={this.handleReload} className="w-full sm:w-auto gap-2">
                <RefreshCw className="h-4 w-4" />
                Reload Page
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
