import { Button } from "@/components/ui/button";
import { Zap, Terminal, ArrowRight, Ghost } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface BeginChatProps {
  onClick: () => void;
}

export default function BeginChat({ onClick }: BeginChatProps) {
  return (
    <div className="flex min-h-screen max-h-screen items-center justify-center">
      <Card className="w-full max-w-sm border-2 border-primary/20 bg-card/50 shadow-2xl transition-all duration-300 hover:shadow-primary/50 md:max-w-md">
        <CardHeader className="flex flex-col items-center text-center">
          <Terminal className="h-16 w-16 text-primary animate-pulse-slow" />
          <CardTitle className="mt-4 text-2xl font-bold md:text-3xl">
            Proceed to the Nexus
          </CardTitle>
          <CardDescription className="text-muted-foreground mt-2 text-sm md:text-base">
            This action will initiate a direct connection.
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-2 text-center text-sm md:text-base">
          <ul className="list-none space-y-2">
            <li className="flex items-center justify-center gap-2">
              <Zap className="h-4 w-4 text-accent" />
              All signals will be routed directly to the source.
            </li>
            <li className="flex items-center justify-center gap-2">
              <Ghost className="h-4 w-4 text-warning" />
              Prepare for human-level interaction.
            </li>
          </ul>
        </CardContent>
        <CardFooter className="mt-6 flex justify-center">
          <Button
            onClick={onClick}
            className="group w-full rounded-full bg-primary text-primary-foreground p-6 text-base font-bold transition-all duration-300 hover:scale-105 hover:bg-primary/90 md:w-3/4"
          >
            Authenticate & Proceed
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
